import React from "react";
import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>Demo example created by Petar Jovanovic</p>
      </div>
    </footer>
  );
};

export default Footer;
