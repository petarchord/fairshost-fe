import React from "react";
import styles from "./ChatBox.module.scss";

import ChatMessage from "../ChatMessage/ChatMessage";

const ChatBox = ({ messages }) => {
  return (
    <div className={styles.message_wrapper}>
      {messages.length
        ? messages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg.chatMessage}
              user={msg.user}
              time={msg.time}
            />
          ))
        : ""}
    </div>
  );
};

export default ChatBox;
