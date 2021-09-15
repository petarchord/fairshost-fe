import React from "react";
import styles from "./Chat.module.scss";

// Icons imports
import { IoIosChatboxes } from "react-icons/io";
import { RiSendPlaneFill } from "react-icons/ri";

import ChatBox from "../ChatBox/ChatBox";
import ChatUserBox from "../ChatUserBox/ChatUserBox";

const Chat = ({
  chatUsers,
  currentUser,
  chatButton,
  chatMessage,
  setChatMessage,
  sendMessage,
  chatMessages,
}) => {
  const onChatKeyup = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      chatButton.current.click();
    }
  };

  return (
    <div className={styles.chat_wrapper}>
      <ChatUserBox users={chatUsers} currentUser={currentUser} />
      <div className={styles.chat}>
        <p className={styles.chatParagraph}>
          <IoIosChatboxes />
          Chat
        </p>
        <div className={styles.chat_input_wrapper}>
          <input
            onKeyUp={onChatKeyup}
            type="text"
            name="message"
            placeholder="Enter Message"
            value={chatMessage}
            onChange={(e) => {
              setChatMessage(e.target.value);
            }}
          />
          <button
            ref={chatButton}
            id="chatButton"
            className={styles.sendMessage}
            onClick={(e) => {
              sendMessage(e);
            }}
            disabled={chatMessage === ""}
          >
            <RiSendPlaneFill />
          </button>
        </div>
        <ChatBox messages={chatMessages} />
      </div>
    </div>
  );
};

export default Chat;
