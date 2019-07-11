import React from "react";
import { Switch, Route } from "react-router-dom";
import InSteps from "./components/LinearProgramation/InSteps";
import NoLinealProg from "./components/NoLinealProgramation";
import LinearProgramation from './components/LinearProgramation'
import Inicio from "./components/Inicio";
import SinglePage from "./components/LinearProgramation/SinglePage";


const NoLinearProgramation = () => <NoLinealProg />;

const Index = () => <Inicio/>;

const App = () => 
    <Switch>
      <Route exact path="/" component={Index} />
      <Route exact path="/LinearProgramation" component={LinearProgramation} />
      <Route exact path="/LinearProgramation/InSteps" component={InSteps} />
      <Route exact path="/LinearProgramation/SinglePage" component={SinglePage} />
      <Route exact path="/NoLinearProgramation" component={NoLinearProgramation} />
    </Switch>;

export default App;
