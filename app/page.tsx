"use client";
import AppPage from "@/components/app-page";
import ResponsiveNavbar from "@/components/responsive-navbar";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-5">
      <ResponsiveNavbar />
      <AppPage />
      {/* {data?.map((item) => (
        <div className="flex flex-col">
          <h1 className="text-2xl">{item.name}</h1>
          <h1 className="text-2xl">{item.email}</h1>
          <h1 className="text-2xl">{item.role}</h1>
          <h1 className="text-2xl">{item.rating}</h1>
        </div>
      ))} */}
    </div>
  );
}
