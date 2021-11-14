import React, { useState } from "react";
import styles from "./OtherEvents.module.scss";

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

  return (
    <div className={styles.container}>
      <div className={styles.headingWrapper}>
        <h3>All Events</h3>
        <button>Start Your Event</button>
      </div>
      {currentPosts.length ? (
        <div>
          <Table
            headers={[
              "Owner",
              "First Name",
              "Last Name",
              "Topic",
              "Date",
              "Time",
              "Expected Duration",
              "Status",
            ]}
          >
            {currentPosts.map((event, index) => (
              <tr key={event.id}>
                <td>{index + 1 + (currentPage - 1) * postsPerPage + "."}</td>
                <td>{event.user.username}</td>
                <td>{event.user.first_name}</td>
                <td>{event.user.last_name}</td>
                <td>{event.topic}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{getLocalTime(event.date)}</td>
                <td>{event.expected_duration}</td>
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
          There are no other events at the moment.
        </p>
      )}
    </div>
  );
};

export default MyEvents;
