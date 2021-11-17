import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import styles from "./Dashboard.module.scss";
import MyEvents from "../MyEvents/MyEvents";
import OtherEvents from "../OtherEvents/OtherEvents";
import Loader from "../Common/Loader/Loader";
import { getAllEvents } from "../../api";

const Dashboard = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [otherEvents, setOtherEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const socket = useRef();

  useEffect(() => {
    // socket.current = io.connect("https://fairshost-chat-server.herokuapp.com/");
    // socket.current.on("liveEvent", ({ eventId }) => {
    //   console.log("typeof eventId:", typeof eventId);
    //   let modEvents = otherEvents.map((event) => {
    //     console.log("event in map:", event);
    //     if (event._id === eventId) {
    //       console.log("condition fulfilled.");
    //       event.status = "live";
    //     }
    //     return event;
    //   });
    //   console.log("modEvents:", modEvents);
    //   setOtherEvents(modEvents);

    //   console.log("eventId", eventId);
    // });
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
