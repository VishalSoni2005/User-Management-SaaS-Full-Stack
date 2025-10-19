import LeaderboardBtn from "@/styles/LeaderboardBtn";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const LeaderboardButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard/leaderboard");
  }
  return (
    <LeaderboardBtn>
      <Button 
      type="button"
      aria-label="Leaderboard"
      role="button"
      onClick={handleClick}
      className="uiverse">
        <div className="wrapper">
          <span>Leaderboard</span>
          <div className="circle circle-12" />
          <div className="circle circle-11" />
          <div className="circle circle-10" />
          <div className="circle circle-9" />
          <div className="circle circle-8" />
          <div className="circle circle-7" />
          <div className="circle circle-6" />
          <div className="circle circle-5" />
          <div className="circle circle-4" />
          <div className="circle circle-3" />
          <div className="circle circle-2" />
          <div className="circle circle-1" />
        </div>
      </Button>
    </LeaderboardBtn>
  );
};

export default LeaderboardButton;