"use client";
import DashboardLoader from "@/styles/DashboardLoader";

const Loader = () => {
  return (
    <DashboardLoader className="flex items-center justify-center min-h-screen  ">
      <div className="loader">
        <div data-glitch="Loading..." className="glitch">
          Loading...
        </div>
      </div>
    </DashboardLoader>
  );
};

export default Loader;
