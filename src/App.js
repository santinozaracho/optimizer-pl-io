import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import InSteps from "./components/LinealProgramming/InSteps";
import NoLinealProgramming from "./components/NoLinealProgramming";
import LinealProgramming from './components/LinealProgramming'
import Inicio from "./components/Inicio";
import SinglePage from "./components/LinealProgramming/SinglePage";
import Gradiente from "./components/NoLinealProgramming/Gradiente"
import Derivadas from "./components/NoLinealProgramming/Derivadas"
import Dicotomica from "./components/NoLinealProgramming/Dicotomica"
import Lagrange from "./components/NoLinealProgramming/Lagrange"
import KuhnTucker from "./components/NoLinealProgramming/KuhnTucker"

const NoLinealProgrammingPage = () => <NoLinealProgramming />;

const Index = () => <Inicio/>;

const App = () => 
    <Switch>
      <Route exact path="/home" component={Index} />
      <Route exact path="/optimizer-pl-io/" component={Index} />
      <Route exact path="/LinealProgramming" component={LinealProgramming} />
      <Route exact path="/LinealProgramming/InSteps" component={InSteps} />
      <Route exact path="/LinealProgramming/SinglePage" component={SinglePage} />
      <Route exact path="/NoLinealProgramming" component={NoLinealProgrammingPage} />
      <Route exact path="/NoLinealProgramming/Gradiente" component={Gradiente} />
      <Route exact path="/NoLinealProgramming/KuhnTucker" component={KuhnTucker} />
      <Route exact path="/NoLinealProgramming/Derivadas" component={Derivadas} />
      <Route exact path="/NoLinealProgramming/Dicotomica" component={Dicotomica} />
      <Route exact path="/NoLinealProgramming/Lagrange" component={Lagrange} />
      <Redirect to="/home" />
    </Switch>;

export default App;
