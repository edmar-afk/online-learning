import React from "react";
import Header from "../components/dashboard/Header";
import Greetings from "../components/dashboard/Greetings";
import Stats from "../components/dashboard/Stats";

function Dashboard() {
  return (
    <div>
      <Header />
      <Greetings/>
      <Stats/>
    </div>
  );
}

export default Dashboard;
