import React from "react";
import styles from "./App.module.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Streamer from "./components/Streamer/Streamer";
import Viewer from "./components/Viewer/Viewer";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

const App = () => {
  return (
    <Router>
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <Switch>
            <Route path="/" exact component={Streamer} />
            <Route path="/viewer/:username" component={Viewer} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
