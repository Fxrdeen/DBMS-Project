import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-8">
          About Contractix
        </h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              At Contractix, our mission is to bridge the gap between talented
              freelancers and businesses seeking expertise. We strive to create
              a platform that fosters collaboration, innovation, and growth in
              the gig economy. By providing a user-friendly, secure, and
              efficient marketplace, we aim to empower professionals and
              businesses alike to achieve their goals and push the boundaries of
              what's possible in the world of remote work.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Contractix was founded in 2020 by a group of freelancers who
              recognized the need for a better way to connect skilled
              professionals with businesses seeking their expertise. What
              started as a small community has grown into a global platform,
              serving thousands of freelancers and clients across various
              industries.
            </p>
            <p className="text-muted-foreground">
              Our journey has been marked by continuous innovation, always
              striving to improve the user experience and adapt to the evolving
              needs of the freelance market. From implementing advanced matching
              algorithms to developing secure payment systems, we've remained
              committed to our goal of creating the most effective freelancing
              platform in the digital age.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Transparency:</strong> We believe in open communication
                and clear expectations between freelancers and clients.
              </li>
              <li>
                <strong>Quality:</strong> We strive to attract and retain top
                talent, ensuring high-quality work for our clients.
              </li>
              <li>
                <strong>Innovation:</strong> We continuously improve our
                platform to meet the evolving needs of the gig economy.
              </li>
              <li>
                <strong>Fairness:</strong> We promote fair practices, reasonable
                rates, and timely payments for all users.
              </li>
              <li>
                <strong>Community:</strong> We foster a supportive community
                where freelancers can grow and businesses can thrive.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Team</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Contractix is powered by a diverse team of professionals from
              around the globe. Our staff includes experienced developers,
              designers, marketers, and customer support specialists, all
              working together to create the best possible platform for our
              users.
            </p>
            <p className="text-muted-foreground">
              We're proud of our inclusive work culture and our commitment to
              diversity. By bringing together individuals with varied
              backgrounds and experiences, we're able to better understand and
              serve our global user base. Our team is united by a shared passion
              for innovation and a desire to revolutionize the way people work
              in the digital age.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
