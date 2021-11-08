import React from "react";
import styles from "./Header.module.scss";
import { ReactComponent as Logo } from "../../assets/icons/v4.svg";
import { Link, useHistory } from "react-router-dom";
import { logoutUser } from "../../api";

const Header = () => {
  const history = useHistory();

  const logOutClickHandler = () => {
    logoutUser()
      .then((response) => {
        if (response.data.success) {
          localStorage.removeItem("token");
          history.push("/");
        }
      })
      .catch((err) => {
        console.log("err:", err);
      });
  };

  return (
    <header className={styles.header}>
      {/* <h4 className={styles.bold}>Fairs Host</h4> */}
      <nav>
        <ul>
          <div className={styles.logoWrapper}>
            <Link to="/user/dashboard">
              <li>
                <Logo />
              </li>
            </Link>
          </div>
          <div className={styles.rightNavWrapper}>
            <Link to="/user/dashboard">
              <li>Events</li>
            </Link>
            <Link>
              <li>Start Your Event</li>
            </Link>
            <Link to="#" onClick={logOutClickHandler}>
              <li>Log Out</li>
            </Link>
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
