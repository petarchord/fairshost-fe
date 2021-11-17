import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import styles from "./OtherEvents.module.scss";

import Table from "../Common/Table/Table";
import Pagination from "../Common/Pagination/Pagination";

const MyEvents = ({ events }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);
  const socket = useRef();
  const history = useHistory();

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = events.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    socket.current = io.connect("https://fairshost-chat-server.herokuapp.com/");
    socket.current.on("liveEvent", () => {
      history.go(0);
    });
  }, []);

  const getLocalTime = (date) => {
    const d = new Date(date);
    return `${d.getHours()}:${d.getMinutes()}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.headingWrapper}>
        <h3>Other Events</h3>
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
              "Start Date",
              "Start Time",
              "Expected Duration",
              "Status",
              "Action",
            ]}
          >
            {currentPosts.map((event, index) => (
              <tr key={event._id}>
                <td>{index + 1 + (currentPage - 1) * postsPerPage + "."}</td>
                <td>{event.user.username}</td>
                <td>{event.user.first_name}</td>
                <td>{event.user.last_name}</td>
                <td>{event.topic}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{getLocalTime(event.date) + "h"}</td>
                <td>{event.expected_duration}</td>
                <td>{event.status}</td>
                <td className={styles.actionColumn}>
                  <button
                    className={styles.actionButton}
                    onClick={() => {
                      if (event.status === "live") {
                        history.push(
                          `/viewer/${event.user.username}/${event._id}`
                        );
                      } else {
                        history.push(`/event-details/${event._id}`);
                      }
                    }}
                  >
                    {event.status === "live" ? "Watch Event" : "See Details"}
                  </button>
                </td>
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
