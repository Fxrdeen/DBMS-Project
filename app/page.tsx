"use client";
import AppPage from "@/components/app-page";
import ResponsiveNavbar from "@/components/responsive-navbar";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-5">
      <ResponsiveNavbar />
      <AppPage />
    </div>
  );
}
