import React from "react";
import { Button } from "./ui/button";

export const AddUser = ({ className }: { className?: string }) => {
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };
  return (
    <div>
      <Button
        className={`bg-destructive hover:bg-destructive/90 text-white ${className}`}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
};
export default AddUser;
