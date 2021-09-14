import React from "react";
import styles from "./Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <h4 className={styles.bold}>Fairs Host</h4>
    </header>
  );
};

export default Header;
