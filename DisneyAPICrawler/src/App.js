//import "./App.css";
import React from "react";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./component/navbar";
import DisneyAPIbuttons from "./pages/disneyAPIbuttons";
import toystory from "./pages/toystory";
import codejokes from "./pages/codejokes";

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={DisneyAPIbuttons} />
        <Route path="/toystory" component={toystory} />
        <Route path="/codejokes" component={codejokes} />
      </Switch>
    </Router>
  );
}

export default App;
