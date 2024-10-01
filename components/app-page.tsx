import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for jobs
const jobs = [
  {
    id: 1,
    title: "Full Stack Developer",
    description:
      "We're looking for a skilled full stack developer to join our team and work on exciting projects.",
    budget: "$5000 - $8000",
    client: "TechCorp Inc.",
    skills: ["React", "Node.js", "MongoDB"],
  },
  {
    id: 2,
    title: "UI/UX Designer",
    description:
      "Seeking a creative UI/UX designer to help design intuitive and beautiful user interfaces for our products.",
    budget: "$3000 - $5000",
    client: "DesignHub",
    skills: ["Figma", "Adobe XD", "Sketch"],
  },
  {
    id: 3,
    title: "Data Scientist",
    description:
      "We need a data scientist to analyze large datasets and provide insights to drive business decisions.",
    budget: "$6000 - $9000",
    client: "DataDriven Co.",
    skills: ["Python", "Machine Learning", "SQL"],
  },
];

export default function AppPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to Contractix
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              A job marketplace to find freelance jobs
            </p>
            <Link
              href="/jobs"
              className="bg-background text-primary hover:bg-background/90 px-6 py-3 rounded-md font-semibold transition-colors duration-200"
            >
              Browse Jobs
            </Link>
          </div>
        </section>

        {/* Job Listings */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Featured Jobs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <Card key={job.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{job.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground mb-4">
                      {job.description}
                    </p>
                    <p className="font-semibold">Budget: {job.budget}</p>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start">
                    <p className="text-sm text-muted-foreground mb-2">
                      Posted by: {job.client}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted text-muted-foreground py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-primary transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="hover:text-primary transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">For Freelancers</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/find-jobs"
                    className="hover:text-primary transition-colors"
                  >
                    Find Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/create-profile"
                    className="hover:text-primary transition-colors"
                  >
                    Create Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/freelancer-resources"
                    className="hover:text-primary transition-colors"
                  >
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">For Clients</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/post-jobs"
                    className="hover:text-primary transition-colors"
                  >
                    Post Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/find-freelancers"
                    className="hover:text-primary transition-colors"
                  >
                    Find Freelancers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/client-resources"
                    className="hover:text-primary transition-colors"
                  >
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookie-policy"
                    className="hover:text-primary transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-muted-foreground/20 text-center">
            <p>
              &copy; {new Date().getFullYear()} Contractix. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
