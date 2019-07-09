import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LinealProg from "./components/LinealProg";
import NoLinealProg from "./components/NoLinealProg";
import Inicio from "./components/Inicio";

const LinealProgramacion = () => <LinealProg />;

const NoLinealProgramacion = () => <NoLinealProg />;

const Index = () => <Inicio/>;

const App = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Route exact path="/" component={Index} />
      <Route path="/linealProg" component={LinealProgramacion} />
      <Route path="/noLinealProg/" component={NoLinealProgramacion} />
    </Router>
  );
};

export default App;
