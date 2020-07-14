import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import InSteps from "./components/LinealProgramming/InSteps";
import NoLinealProgramming from "./components/NoLinealProgramming";
import StockProblems from "./components/StockProblems";
import LinealProgramming from './components/LinealProgramming'
import Inicio from "./components/Inicio";
import SinglePage from "./components/LinealProgramming/SinglePage";

import CantidadEconomicaPedido from "./components/StockProblems/CantidadEconomicaPedido";
import infoCantidadEconomicaPedido from "./components/StockProblems/CantidadEconomicaPedido/info.js";


import ModeloWilson from "./components/StockProblems/ModeloWilson";
import infoModeloWilson from "./components/StockProblems/ModeloWilson/info.js";

import ModeloStockProteccion from "./components/StockProblems/ModeloStockProteccion";
import infoModeloStockProteccion from "./components/StockProblems/ModeloStockProteccion/info.js";

import ModelStockDiscontinuidadDePrecio from "./components/StockProblems/ModelStockDiscontinuidadDePrecio";

import ModeloAgotamientoAdmitido from "./components/StockProblems/ModeloAgotamientoAdmitido";

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
      <Route exact path="/StockProblems/CantidadEconomicaPedido" component={CantidadEconomicaPedido} />
      <Route exact path="/StockProblems/CantidadEconomicaPedido/info.js" component={infoCantidadEconomicaPedido} />
      <Route exact path="/StockProblems/ModeloWilson" component={ModeloWilson} />
      <Route exact path="/StockProblems/ModeloWilson/info.js" component={infoModeloWilson} />
      <Route exact path="/StockProblems/ModeloStockProteccion" component={ModeloStockProteccion} />
      <Route exact path="/StockProblems/ModeloStockProteccion/info.js" component={infoModeloStockProteccion} />
      <Route exact path="/StockProblems/ModelStockDiscontinuidadDePrecio" component={ModelStockDiscontinuidadDePrecio} />
      <Route exact path="/StockProblems/ModeloAgotamientoAdmitido" component={ModeloAgotamientoAdmitido} />
      
      <Redirect to="/home" />
    </Switch>;

export default App;
