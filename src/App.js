import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {Container} from 'reactstrap';
import LinealProg from "./components/LinealProg";
import NoLinealProg from "./components/NoLinealProg";
import Inicio from "./components/Inicio";
import Models from "./components/Models"

const LinealProgramacion = () => <LinealProg />;

const NoLinealProgramacion = () => <NoLinealProg />;

const Index = () => <Inicio/>;

const Modelos = () => <Container><Models/></Container>;

const App = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Route exact path="/" component={Index} />
      <Route path="/linealProg" component={LinealProgramacion} />
      <Route path="/noLinealProg/" component={NoLinealProgramacion} />
      <Route path="/models" component={Modelos}/>
    </Router>
  );
};

export default App;
