import React from "react";
import styles from "./ChatUserBox.module.scss";

import { FaUser } from "react-icons/fa";

import ChatUser from "../ChatUser/ChatUser";

const ChatUserBox = ({ users, currentUser }) => {
  return (
    <div className={styles.usersWrapper}>
      <p>
        <FaUser />
        Users
      </p>
      {users.map((user) =>
        user.username !== currentUser ? (
          <ChatUser key={user.id} username={user.username} />
        ) : (
          ""
        )
      )}
    </div>
  );
};

export default ChatUserBox;
