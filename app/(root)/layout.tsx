"use client";
import ResponsiveNavbar from "@/components/responsive-navbar";
import { useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  return (
    <div className="flex flex-col min-h-screen">
      <ResponsiveNavbar user={user as unknown as User} />
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default RootLayout;
