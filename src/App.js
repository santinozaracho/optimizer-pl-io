import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import InSteps from "./components/LinealProgramming/InSteps";
import NoLinealProgramming from "./components/NoLinealProgramming";
import StockProblems from "./components/StockProblems";
import LinealProgramming from './components/LinealProgramming'
import Inicio from "./components/Inicio";
import SinglePage from "./components/LinealProgramming/SinglePage";

import CantidadEconomicaPedido from "./components/StockProblems/cantidadEconomicaPedido";
import infoCantidadEconomicaPedido from "./components/StockProblems/cantidadEconomicaPedido/info.js";



import ModeloWilson from "./components/StockProblems/modeloWilson";
import infoModeloWilson from "./components/StockProblems/modeloWilson/info.js";

import ModeloStockProteccion from "./components/StockProblems/ModeloStockProteccion";
import infoModeloStockProteccion from "./components/StockProblems/ModeloStockProteccion/info.js";

import ModeloAgotamientoAdmitido from "./components/StockProblems/ModeloAgotamientoAdmitido";
import infoModeloAgotamientoAdmitido from "./components/StockProblems/ModeloAgotamientoAdmitido/info.js";

import ModeloTriangular from "./components/StockProblems/modeloTriangular";
import infoModeloTriangular from "./components/StockProblems/modeloTriangular/info.js";



import ModelStockDiscontinuidadDePrecio from "./components/StockProblems/ModelStockDiscontinuidadDePrecio";
import infoModelStockDiscontinuidadDePrecio from "./components/StockProblems/ModelStockDiscontinuidadDePrecio/info.js";

import ModeloSimpleSinAgotamiento from "./components/StockProblems/modeloSimpleSinAgotamiento/index.js";
import infoModeloSimpleSinAgotamiento from "./components/StockProblems/modeloSimpleSinAgotamiento/info.js";





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

      <Route exact path="/StockProblems/ModeloAgotamientoAdmitido" component={ModeloAgotamientoAdmitido} />
      <Route exact path="/StockProblems/ModeloAgotamientoAdmitido/info.js" component={infoModeloAgotamientoAdmitido} />

      <Route exact path="/StockProblems/ModeloTriangular" component={ModeloTriangular} />
      <Route exact path="/StockProblems/ModeloTriangular/info.js" component={infoModeloTriangular} />
      
      <Route exact path="/StockProblems/ModelStockDiscontinuidadDePrecio" component={ModelStockDiscontinuidadDePrecio} />
      <Route exact path="/StockProblems/ModelStockDiscontinuidadDePrecio/info.js" component={infoModelStockDiscontinuidadDePrecio} />

      <Route exact path="/StockProblems/StockProblems/modeloSimpleSinAgotamiento/info.js" component={infoModeloSimpleSinAgotamiento} />
      <Route exact path="/StockProblems/modeloSimpleSinAgotamiento" component={ModeloSimpleSinAgotamiento} />
      
      
      <Redirect to="/home" />
    </Switch>;

export default App;
