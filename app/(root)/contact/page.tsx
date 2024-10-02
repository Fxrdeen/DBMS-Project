import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>

        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Name
                </label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1"
                >
                  Message
                </label>
                <Textarea id="message" placeholder="Your message" rows={5} />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Other Ways to Reach Us
          </h2>
          <p className="mb-2">Email: support@contractix.com</p>
          <p className="mb-2">Phone: +1 (555) 123-4567</p>
          <p className="mb-2">
            Address: 123 Freelance Street, Gig City, Remote State 12345
          </p>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">
                How do I create an account?
              </h3>
              <p className="text-muted-foreground">
                To create an account, click on the "Sign Up" button in the top
                right corner of the homepage. Follow the prompts to enter your
                information and set up your profile.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                How can I post a job?
              </h3>
              <p className="text-muted-foreground">
                Once you're logged in, navigate to the "Post a Job" page from
                the main menu. Fill out the job details form and submit it for
                review. Your job will be live on our platform once approved.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                What are the fees for using Contractix?
              </h3>
              <p className="text-muted-foreground">
                Contractix charges a 10% fee on all completed projects. This fee
                covers the use of our platform, payment processing, and customer
                support. There are no upfront costs for posting jobs or bidding
                on projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
