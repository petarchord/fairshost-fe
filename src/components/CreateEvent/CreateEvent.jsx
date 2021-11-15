import React, { useState } from "react";
import styles from "./CreateEvent.module.scss";
import Loader from "../Common/Loader/Loader";
import { useHistory } from "react-router-dom";
import { createEvent } from "../../api";

const CreateEvent = () => {
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("1h");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    errorMessage: "",
  });
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      topic,
      expected_duration: duration,
      description,
    };
    setLoading(true);
    createEvent(data)
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          console.log("res.data.event_id:", res.data.event_id);
          history.push(`/streamer/${res.data.event_id}`);
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.data.msg) {
          setError({
            ["errorMessage"]: error.response.data.msg,
          });
        }
      });
  };

  return (
    <div className={styles.container}>
      <h3>Create Your Event</h3>
      <div className={styles.formWrapper}>
        <form
          action=""
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div className={styles.inputWrapper}>
            <label htmlFor="Topic">Topic:</label>
            <input
              type="text"
              name="topic"
              placeholder="Enter your topic"
              onChange={(e) => {
                setTopic(e.target.value);
              }}
              required
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="Expected Duration">Expected Duration:</label>
            <select
              defaultValue="Select Expected Duration"
              name="expectedDuration"
              onChange={(e) => {
                setDuration(e.target.value);
              }}
            >
              <option value="1h">1h</option>
              <option value="2h">2h</option>
              <option value="3h">3h</option>
              <option value="4h">4h</option>
              <option value="5h">5h</option>
              <option value="6h">6h</option>
            </select>
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="Description">Description:</label>
            <textarea
              name="description"
              placeholder="Enter description of the event"
              cols="25"
              rows="7"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            ></textarea>
          </div>

          {error.errorMessage !== "" ? (
            <div className={styles.errorMessageWrapper}>
              <p>{error.errorMessage}</p>
            </div>
          ) : (
            ""
          )}

          {loading ? (
            <div className={styles.loaderWrapper}>
              <Loader />
            </div>
          ) : (
            ""
          )}

          <input type="submit" name="submit" value="Proceed" />
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
