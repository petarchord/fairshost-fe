import React, { useState } from "react";
import styles from "./CreateEvent.module.scss";
import Loader from "../Common/Loader/Loader";

const CreateEvent = () => {
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    errorMessage: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
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
            <label htmlFor="Topic">Topic</label>
            <input
              type="text"
              name="topic"
              placeholder="Enter your topic"
              onChange={(e) => {
                setTopic(e.target.value);
              }}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="Expected Duration">Expected Duration:</label>
            <input
              type="text"
              name="expectedDuiration"
              placeholder="Enter exprected duration"
              onChange={(e) => {
                setDuration(e.target.value);
              }}
            />
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
