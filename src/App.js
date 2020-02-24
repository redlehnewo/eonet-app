import React, { Component } from "react";
import Event from "./containers/Events/Event/Event";
import Events from "./containers/Events/Events";
import Toolbar from "./components/Navigation/Toolbar/Toolbar";

import { Route } from "react-router-dom";

class App extends Component {
  state = {
    navlinkConfig: [{}]
  };

  render() {
    return (
      <div className="App">
        <Toolbar />
        <main className="container">
          <Route path="/:id" component={Event} />
          <Route path="/" exact component={Events} />
        </main>
      </div>
    );
  }
}

export default App;
