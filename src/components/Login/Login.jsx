import React, { useState } from "react";
import styles from "./Login.module.scss";
import { Link, useHistory } from "react-router-dom";
import Loader from "../Common/Loader/Loader";
import { ReactComponent as Logo } from "../../assets/icons/v4.svg";

import { loginUser } from "../../api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    username: false,
    password: false,
    errorMessage: "",
  });
  const history = useHistory();

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    const data = {
      username,
      password,
    };
    setLoading(true);
    loginUser(data)
      .then((response) => {
        console.log("response:", response);
        setLoading(false);
        if (response.status >= 200 && response.status < 300) {
          localStorage.setItem("token", response.data.token);
          history.push("/streamer");
        }
      })
      .catch((error) => {
        console.log("error:", error.response);
        setLoading(false);
        if (error.response.data.error) {
          setError({
            ["errorMessage"]: error.response.data.error,
          });
        }
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoWrapper}>
        <Logo />
      </div>
      <h3>Welcome back. We are glad to see you again!</h3>
      <div className={styles.formWrapper}>
        <form action="" onSubmit={(e) => handleSubmitLogin(e)}>
          <div className={styles.usernameWrapper}>
            <label htmlFor="Username">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              required
            />
          </div>
          <div className={styles.passwordWrapper}>
            <label htmlFor="Password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
          </div>
          {error.errorMessage !== "" ? (
            <div className={styles.errorMessageWrapper}>
              <p>{error.errorMessage}</p>
            </div>
          ) : (
            ""
          )}

          {loading ? (
            <div className={styles.loaderWrapper}>
              <Loader />
            </div>
          ) : (
            ""
          )}
          <input type="submit" name="submit" value="Log in" />
          <p className={styles.registerHere}>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
