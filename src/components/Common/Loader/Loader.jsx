import React from "react";
import styles from "./Loader.module.scss";

const Loader = ({ absolute, small }) => {
  const getContainerClass = () => {
    if (!absolute) {
      if (!small) {
        return styles.container;
      } else {
        return styles.containerSmall;
      }
    } else {
      return styles.containerAbsolute;
    }
  };

  return <div className={getContainerClass()}></div>;
};

export default Loader;
