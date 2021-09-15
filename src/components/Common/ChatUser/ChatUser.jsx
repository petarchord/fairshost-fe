import React from "react";
import styles from "./ChatUser.module.scss";

import { BsCircleFill } from "react-icons/bs";

const ChatUser = ({ username }) => {
  return (
    <p>
      <BsCircleFill className={styles.greenIcon} />
      {username}
    </p>
  );
};

export default ChatUser;
