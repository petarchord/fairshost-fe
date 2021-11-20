import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.scss";
import MyEvents from "../MyEvents/MyEvents";
import OtherEvents from "../OtherEvents/OtherEvents";
import Loader from "../Common/Loader/Loader";
import { getAllEvents } from "../../api";

const Dashboard = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [otherEvents, setOtherEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const filterEvents = (status) => {
    let newEvents = [];
    if (status === "all") {
      newEvents = otherEvents;
      setFilteredEvents(newEvents);
    } else {
      newEvents = otherEvents.filter((event) => event.status === status);
      setFilteredEvents(newEvents);
    }
  };

  useEffect(() => {
    setLoading(true);
    getAllEvents()
      .then((res) => {
        setLoading(false);
        if (res[0].data.success) {
          setMyEvents(res[0].data.events);
        }
        if (res[1].data.success) {
          setOtherEvents(res[1].data.events);
          setFilteredEvents(res[1].data.events);
        }
      })
      .catch((err) => {
        console.log("err:", err);
      });
  }, []);

  return (
    <div className={styles.containier}>
      {loading && <Loader absolute={true} />}
      <MyEvents events={myEvents} />
      <OtherEvents events={filteredEvents} filterEvents={filterEvents} />
    </div>
  );
};

export default Dashboard;
