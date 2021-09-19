import React from "react";
import styles from "./Header.module.scss";
import { ReactComponent as Logo } from "../../assets/icons/v4.svg";

const Header = () => {
  return (
    <header className={styles.header}>
      {/* <h4 className={styles.bold}>Fairs Host</h4> */}
      <Logo />
    </header>
  );
};

export default Header;
