import React, { useState } from "react";
import styles from "./Dashboard.module.scss";
import MyEvents from "../MyEvents/MyEvents";
import OtherEvents from "../OtherEvents/OtherEvents";

const events = [
  {
    id: 1,
    owner: "petarchord",
    name: "Petar",
    lastName: "Jovanovic",
    topic: "Web RTC",
    expectedDuration: "2h",
    status: "upcoming",
  },
  {
    id: 2,
    owner: "dzony",
    name: "Nikola",
    lastName: "Jovanovic",
    topic: "React Introduction",
    expectedDuration: "1h",
    status: "finished",
  },
  {
    id: 3,
    owner: "samm",
    name: "Sam",
    lastName: "Davidson",
    topic: "Nodejs Basic Course",
    expectedDuration: "1h",
    status: "live",
  },
];

const Dashboard = () => {
  return (
    <div className={styles.containier}>
      <MyEvents events={events} />
      <OtherEvents events={events} />
    </div>
  );
};

export default Dashboard;
