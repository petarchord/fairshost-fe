import React from "react";
import styles from "./App.module.scss";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Streamer from "./components/Streamer/Streamer";
import Viewer from "./components/Viewer/Viewer";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Dashboard from "./components/Dashboard/Dashboard";
import CreateEvent from "./components/CreateEvent/CreateEvent";
import { getRedirectUrl } from "./utils/auth";

const App = () => {
  return (
    <Router>
      <div className={styles.container}>
        <Route
          path={[
            "/user/dashboard",
            "/streamer",
            "/viewer/:username",
            "/create-event",
          ]}
          component={Header}
        />
        <main className={styles.main}>
          <Switch>
            <Route exact path="/">
              <Redirect to={getRedirectUrl()} />
            </Route>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/streamer" component={Streamer} />
            <Route path="/user/dashboard" component={Dashboard} />
            <Route path="/viewer/:username" component={Viewer} />
            <Route path="/create-event" component={CreateEvent} />
          </Switch>
        </main>
        <Route
          path={[
            "/user/dashboard",
            "/streamer",
            "/viewer/:username",
            "/create-event",
          ]}
          component={Footer}
        />
      </div>
    </Router>
  );
};

export default App;
