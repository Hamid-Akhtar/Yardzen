import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./modules/Home";
function App() {
  return (
    <div className="App">
      <div className="background"></div>{" "}
      <Router>
        <Switch> <Route exact path="/" component={Home} /></Switch>
      </Router>
    </div>
  );
}

export default App;
