import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "./EventDetails.module.scss";
import Loader from "../Common/Loader/Loader";
import { getEventById } from "../../api";

const EventDetails = (props) => {
  const [topic, setTopic] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expectedDuration, setExpectedDuration] = useState("");
  const [description, setDescription] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const eventId = props.match.params.eventId;
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    getEventById(eventId)
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          setTopic(res.data.event.topic);
          setStartDate(res.data.event.date);
          setExpectedDuration(res.data.event.expected_duration);
          setDescription(res.data.event.description);
          setUsername(res.data.event.user.username);
          setFirstName(res.data.event.user.first_name);
          setLastName(res.data.event.user.last_name);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("err:", err);
      });
  }, [eventId]);

  const getLocalTime = (date) => {
    if (date) {
      const d = new Date(date);
      return `${d.getHours()}:${d.getMinutes()}`;
    }
  };

  return (
    <div className={styles.container}>
      {loading && <Loader absolute={true} />}
      <div className={styles.eventWrapper}>
        <h2>Event Inforamtions</h2>
        <div className={styles.row}>
          <h3>Topic:</h3>
          <p>{topic}</p>
        </div>
        <div className={styles.row}>
          <h3>Start Date:</h3>
          <p>{startDate ? new Date(startDate).toLocaleDateString() : ""}</p>
        </div>
        <div className={styles.row}>
          <h3>Start Time:</h3>
          <p>{getLocalTime(startDate)}</p>
        </div>
        <div className={styles.row}>
          <h3>Expected Duration:</h3>
          <p>{expectedDuration}</p>
        </div>
        <div className={styles.row}>
          <h3>Description:</h3>
          <p>{description}</p>
        </div>
        <div className={styles.row}>
          <button
            onClick={() => {
              history.goBack();
            }}
          >
            Back
          </button>
        </div>
      </div>
      <div className={styles.ownerWrapper}>
        <h2>Owner Informations</h2>
        <div className={styles.row}>
          <h3>Username:</h3>
          <p>{username}</p>
        </div>
        <div className={styles.row}>
          <h3>First Name:</h3>
          <p>{firstName}</p>
        </div>
        <div className={styles.row}>
          <h3>Last Name:</h3>
          <p>{lastName}</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
