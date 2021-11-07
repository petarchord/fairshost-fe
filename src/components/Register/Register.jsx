import React, { useState } from "react";
import styles from "./Register.module.scss";
import { Link, useHistory } from "react-router-dom";

import { ReactComponent as Logo } from "../../assets/icons/v4.svg";

import Loader from "../Common/Loader/Loader";

import { registerUser } from "../../api";

const Register = (props) => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({
    password: false,
    refferalCode: false,
    errorMessage: "",
  });
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmitRegister = (e) => {
    e.preventDefault();
    const data = {
      username,
      password,
      first_name: name,
      last_name: lastName,
    };
    setLoading(true);
    registerUser(data)
      .then((response) => {
        console.log("response:", response);
        setLoading(false);
        if (response.status >= 200 && response.status < 300) {
          history.push("/login");
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

  const restrictDigits = (e) => {
    if (
      (e.keyCode < 65 || e.keyCode > 90) &&
      e.keyCode !== 8 &&
      e.keyCode !== 32 &&
      e.keyCode !== 16 &&
      e.keyCode !== 9
    ) {
      e.preventDefault();
    }
  };

  const validatePassword = (e) => {
    if (password !== confirmPassword) {
      setError({
        ["password"]: true,
        ["errorMessage"]:
          "Paswords must match! Please enter the same passowrd in both fields.",
      });
    } else {
      setError({ ["password"]: false, ["errorMessage"]: "" });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoWrapper}>
        <Logo />
      </div>
      <h3>Welcome! Join Us.</h3>
      <div className={styles.formWrapper}>
        <form
          action=""
          onSubmit={(e) => {
            handleSubmitRegister(e);
          }}
        >
          <div className={styles.inputWrapper}>
            <label htmlFor="First Name">First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              onChange={(e) => {
                setName(e.target.value);
              }}
              onKeyDown={(e) => {
                restrictDigits(e);
              }}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="Last Name">Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              onKeyDown={(e) => {
                restrictDigits(e);
              }}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="Username">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              required
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="Password">Password</label>
            <input
              className={error.password ? styles.error : ""}
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="Confirm Password">Confirm Password</label>
            <input
              className={error.password ? styles.error : ""}
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              required
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              onBlur={(e) => {
                validatePassword(e);
              }}
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

          <input type="submit" name="submit" value="Register" />
          <p>
            Already have an account? <Link to="/login">Log in here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
