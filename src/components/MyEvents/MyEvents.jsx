import React, { useState } from "react";
import styles from "./MyEvents.module.scss";

import Table from "../Common/Table/Table";
import Pagination from "../Common/Pagination/Pagination";

const MyEvents = ({ events }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = events.slice(indexOfFirstPost, indexOfLastPost);

  const getLocalTime = (date) => {
    const d = new Date(date);
    return `${d.getHours()}:${d.getMinutes()}`;
  };

  const getStatus = () => {};

  return (
    <div className={styles.container}>
      <div className={styles.headingWrapper}>
        <h3>My Events</h3>
        <button>Start Your Event</button>
      </div>
      {currentPosts.length ? (
        <div>
          <Table
            headers={[
              "Topic",
              "Expected Duration",
              "Start Date",
              "Start Time",
              "Status",
            ]}
          >
            {currentPosts.map((event, index) => (
              <tr key={event._id}>
                <td>{index + 1 + (currentPage - 1) * postsPerPage + "."}</td>
                <td>{event.topic}</td>
                <td>{event.expected_duration}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{getLocalTime(event.date) + "h"}</td>
                <td>{event.status}</td>
              </tr>
            ))}
          </Table>
          <Pagination
            arrayLength={events.length}
            postsPerPage={postsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            currentPosts={currentPosts}
          />
        </div>
      ) : (
        <p className={styles.noEventsMessage}>
          You do not have any events at the moment. Start your event on the
          button at the top right corner.
        </p>
      )}
    </div>
  );
};

export default MyEvents;
