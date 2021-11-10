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

  return (
    <div className={styles.container}>
      <div className={styles.headingWrapper}>
        <h3>All Events</h3>
        <button>Start Your Event</button>
      </div>
      <Table
        headers={[
          "Owner",
          "First Name",
          "Last Name",
          "Topic",
          "Expected Duration",
          "Status",
        ]}
      >
        {events && events.length ? (
          events.map((event, index) => (
            <tr key={event.id}>
              <td>{index + 1 + (currentPage - 1) * postsPerPage + "."}</td>
              <td>{event.owner}</td>
              <td>{event.name}</td>
              <td>{event.lastName}</td>
              <td>{event.topic}</td>
              <td>{event.expectedDuration}</td>
              <td>{event.status}</td>
            </tr>
          ))
        ) : (
          <p>
            There aro no live events currently. Start your own event on the
            button above.
          </p>
        )}
      </Table>

      <Pagination
        arrayLength={events.length}
        postsPerPage={postsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentPosts={currentPosts}
      />
    </div>
  );
};

export default MyEvents;
