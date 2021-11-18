import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.scss";
import MyEvents from "../MyEvents/MyEvents";
import OtherEvents from "../OtherEvents/OtherEvents";
import Loader from "../Common/Loader/Loader";
import { getAllEvents } from "../../api";

const Dashboard = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [otherEvents, setOtherEvents] = useState([]);
  const [loading, setLoading] = useState(false);

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
      <OtherEvents events={otherEvents} />
    </div>
  );
};

export default Dashboard;
