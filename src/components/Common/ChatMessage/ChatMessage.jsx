import React from "react";
import styles from "./ChatMessage.module.scss";

const ChatMessage = ({ message, user, time }) => {
  return (
    <div>
      <p>{message}</p>
      <p className={styles.msgUser}>
        {user} <span> {time}</span>{" "}
      </p>
    </div>
  );
};

export default ChatMessage;
