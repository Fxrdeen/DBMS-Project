"use server";
import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

export async function getJobs() {
  const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
  const response =
    await sql`SELECT j.job_id, j.title, j.description, j.status, j.budget, j.deadline, u.name AS client_name, array_agg(sr.skill_name) AS skills_required
		FROM Jobs j
		JOIN Users u ON j.client_id = u.user_id
		LEFT JOIN SkillsRequired sr ON j.job_id = sr.job_id
		GROUP BY j.job_id, u.name
		ORDER BY j.job_id;`;
  return response;
}

export async function createUser(
  firstName: string,
  lastName: string,
  email: string,
  skills: string[],
  jobRole: string
) {
  const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
  console.log("Inserting user:", firstName, lastName, email, skills, jobRole);

  try {
    const fullName = `${firstName} ${lastName}`;
    const userResponse = await sql`
      INSERT INTO Users (name, email, role, rating)
      VALUES (${fullName}, ${email}, ${jobRole}, 0.0)
      RETURNING user_id;
    `;

    console.log("User insertion response:", userResponse);

    if (!userResponse || userResponse.length === 0) {
      throw new Error("Failed to insert user");
    }

    const userId = userResponse[0].user_id;
    for (const skill of skills) {
      await sql`
        INSERT INTO Skills (user_id, skill_name) 
        VALUES (${userId}, ${skill})
      `;
    }

    console.log("User and skills inserted successfully");
    return { userId, fullName, email, jobRole, skills };
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error;
  }
}

export async function getJobById(jobId: number) {
  const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
  const response = await sql`SELECT 
    Bids.bid_id,
    Users.name AS freelancer_name,
    Bids.bid_amount,
    Bids.status,
    Bids.created_at
FROM 
    Bids
JOIN 
    Users ON Bids.freelancer_id = Users.user_id
WHERE 
    Bids.job_id = ${jobId};
`;
  return response;
}

export async function getUserDetails(email: string) {
  const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
  const response = await sql`SELECT * FROM Users WHERE email = ${email};`;
  return response;
}

export async function createBid(
  jobId: number,
  freelancerId: number,
  bidAmount: number
) {
  const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
  const response =
    await sql`INSERT INTO Bids (job_id, freelancer_id, bid_amount, status, created_at)
VALUES (${jobId}, ${freelancerId}, ${bidAmount}, 'pending', CURRENT_TIMESTAMP);`;
  return response;
}

export async function deleteBid(bidId: number) {
  console.log("Deleting bid:", bidId);
  const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
  const response = await sql`DELETE FROM Bids WHERE bid_id = ${bidId};`;
  console.log("Bid deleted:", response);
  return response;
}

export async function updateBidAmount(bidId: number, amount: number) {
  const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
  const response =
    await sql`UPDATE Bids SET bid_amount = ${amount} WHERE bid_id = ${bidId};`;
  return response;
}

export async function getUserWithSkills(userId: number) {
  const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
  const response = await sql`SELECT 
    Users.user_id,
    Users.name,
    Users.email,
    Users.role,
    Users.rating,
    Users.created_at,
    COALESCE(ARRAY_AGG(Skills.skill_name), '{}') AS skills
FROM 
    Users
LEFT JOIN 
    Skills ON Users.user_id = Skills.user_id
WHERE 
    Users.user_id = ${userId}
GROUP BY 
    Users.user_id;`;
  console.log("User with skills:", response);
  return response;
}

export async function createJob(
  title: string,
  description: string,
  budget: number,
  deadline: Date,
  clientId: number,
  skills: string[]
) {
  const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
  const jobId = await sql`
      INSERT INTO Jobs (title, description, budget, deadline, client_id, status, created_at)
      VALUES (${title}, ${description}, ${budget}, ${deadline}, ${clientId}, 'open', CURRENT_TIMESTAMP)
      RETURNING job_id;
    `;
  for (const skill of skills) {
    await sql`
      INSERT INTO SkillsRequired (job_id, skill_name)
      VALUES (${jobId[0].job_id}, ${skill})
    `;
  }
  return jobId;
}

export async function getAppliedJobs(userId: number) {
  const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
  const response = await sql`SELECT 
    j.job_id,
    j.title,
    j.description,
    j.status AS job_status,
    j.budget,
    j.deadline,
    b.bid_amount,
    b.status AS bid_status
FROM Jobs j
JOIN Bids b ON j.job_id = b.job_id
WHERE b.freelancer_id = ${userId};
`;
  return response;
}

export async function getUserPostedJobs(userId: number) {
  const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
  const response = await sql`
    SELECT 
    j.job_id,
    j.title,
    j.description,
    j.budget,
    j.deadline,
    j.status AS job_status,
    json_agg(
        json_build_object(
            'bid_id', b.bid_id,
            'freelancer_id', b.freelancer_id,
            'freelancer_name', u.name,
            'bid_amount', b.bid_amount,
            'status', b.status
        )
    ) AS bids
FROM Jobs j
LEFT JOIN Bids b ON j.job_id = b.job_id
LEFT JOIN Users u ON b.freelancer_id = u.user_id
WHERE j.client_id = ${userId}
GROUP BY j.job_id;
  `;
  console.log("User posted jobs:", response);
  return response;
}

export async function updateUserDetails({
  userId,
  name,
  skills,
}: {
  userId: number;
  name: string;
  skills: string[];
}) {
  const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
  const response = await sql`
      UPDATE Users
      SET name = ${name}
      WHERE user_id = ${userId};
    `;
  console.log("User updated:", response);
  const deleteSkills = await sql`
      DELETE FROM Skills
      WHERE user_id = ${userId};
    `;
  for (const skill of skills) {
    await sql`
        INSERT INTO Skills (user_id, skill_name)
        VALUES (${userId}, ${skill});
      `;
  }

  return deleteSkills;
}
export async function rejectBid(bidId: number) {
  const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
  const response =
    await sql`UPDATE Bids SET status = 'rejected' WHERE bid_id = ${bidId} and status = 'pending';`;
  return response;
}

export async function acceptBid(bidId: number) {
  const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
  const response =
    await sql`UPDATE Bids SET status = 'accepted' WHERE bid_id = ${bidId} and status = 'pending';`;
  return response;
}

export async function completeJob(jobId: number) {
  const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
  const response =
    await sql`UPDATE Jobs SET status = 'completed' WHERE job_id = ${jobId};`;
  return response;
}

export async function giveFeedback(
  jobId: number,
  fromUserId: number,
  toUserId: number,
  rating: number
) {
  const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
  const response =
    await sql`INSERT INTO Feedback (job_id, from_user_id, to_user_id, rating) VALUES (${jobId}, ${fromUserId}, ${toUserId}, ${rating});`;
  return response;
}

export async function getAllFeedback() {
  const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
  const response = await sql`SELECT * FROM Feedback;`;
  return response;
}
