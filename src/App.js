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
import EventDetails from "./components/EventDetails/EventDetails";
import { getRedirectUrl } from "./utils/auth";

const App = () => {
  return (
    <Router>
      <div className={styles.container}>
        <Route
          path={[
            "/user/dashboard",
            "/streamer/:eventId",
            "/viewer/:username/:eventId",
            "/create-event",
            "/event-details/:eventId",
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
            <Route
              path="/streamer/:eventId"
              component={(props) => <Streamer {...props} />}
            />
            <Route path="/user/dashboard" component={Dashboard} />
            <Route
              path="/viewer/:username/:eventId"
              component={(props) => <Viewer {...props} />}
            />
            <Route
              path="/event-details/:eventId"
              component={(props) => <EventDetails {...props} />}
            />
            <Route path="/create-event" component={CreateEvent} />
          </Switch>
        </main>
        <Route
          path={[
            "/user/dashboard",
            "/streamer/:eventId",
            "/viewer/:username/:eventId",
            "/create-event",
            "/event-details/:eventId",
          ]}
          component={Footer}
        />
      </div>
    </Router>
  );
};

export default App;
