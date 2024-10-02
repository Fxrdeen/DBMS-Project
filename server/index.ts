"use server";
import { neon } from "@neondatabase/serverless";

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
