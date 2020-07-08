import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import InSteps from "./components/LinealProgramming/InSteps";
import NoLinealProgramming from "./components/NoLinealProgramming";
import StockProblems from "./components/StockProblems";
import LinealProgramming from './components/LinealProgramming'
import Inicio from "./components/Inicio";
import SinglePage from "./components/LinealProgramming/SinglePage";
import modelStockSimple from "./components/StockProblems/ModelStockSimple";


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
      <Route exact path="/StockProblems" component={StockProblems} />
      <Route exact path="/StockProblems/ModelStockSimple" component={modelStockSimple} />
      <Redirect to="/home" />
    </Switch>;

export default App;
