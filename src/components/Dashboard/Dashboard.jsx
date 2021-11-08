import React, { useState } from "react";
import styles from "./Dashboard.module.scss";

import Table from "../Common/Table/Table";
import Pagination from "../Common/Pagination/Pagination";

const events = [
    {
      id: 1,
      owner: "petarchord",
      name: "Petar",
      lastName: "Jovanovic",
      topic: "Web RTC",
      expectedDuration: "2h",
    },
    {
      id: 2,
      owner: "dzony",
      name: "Nikola",
      lastName: "Jovanovic",
      topic: "React Introduction",
      expectedDuration: "1h",
    },
];

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = events.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className={styles.container}>
      <div className={styles.headingWrapper}>
        <h3>Live Events</h3>
        <button>Start Your Event</button>
      </div>
      <Table
        headers={[
          "Owner",
          "First Name",
          "Last Name",
          "Topic",
          "Expected Duration",
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

export default Dashboard;
