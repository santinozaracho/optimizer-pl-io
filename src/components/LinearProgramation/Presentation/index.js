import React from "react";
import { Card, CardTitle, CardHeader } from "reactstrap";
import solver from "javascript-lp-solver";
import SimplexPresentation from "./SimplexPresentation";
import GraphicPresentation from "./GraphicPresentation";

let convertAppToModelForSolverPrimal = datosApp => {
  //Obtenemos los Datos de la aplicacion
  let { restricciones, variables, objective, integer } = datosApp;
  variables = variables.filter(item => item.descripcion !== "");
  restricciones = restricciones.filter(item => item.descripcion !== "");
  //Precargamos el Modelo
  let model = { optimize: "coeficiente", opType: "", constraints: {}, variables: {}, ints: {} };

  //Tratamos el objetivo
  model.opType = objective;

  //Verificamos si se desea PL Entera
  if (integer) {
    variables.forEach(vari => (model.ints[vari.xi] = 1));
  }
  //Tratamos las Variables
  variables.forEach(vari => {
    //Generamos una nueva Variable
    let newVari = {};
    newVari.coeficiente = vari.coeficiente;
    restricciones.forEach(restri => (newVari["r" + restri.ri] = restri.coeficientes[vari.xi]));
    // console.log(newVari);
    model.variables[vari.xi] = newVari;
  });
  //Tratamos las Restricciones
  restricciones.forEach(restri => {
    if (restri.eq === ">=") {
      let res = {};
      res.min = restri.derecha;
      model.constraints["r" + restri.ri] = res;
    } else {
      let res = {};
      res.max = restri.derecha;
      model.constraints["r" + restri.ri] = res;
    }
  });

  return model;
};

class Presentation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { result: false , details: false };
  }

  componentDidMount() {
    let result = false ;
    if ( this.validateCoeficientes(this.props) ){
      console.log('Validado..');
      result = this.calculateResults();
    }
    console.log(result);
    this.setState({ result })
  }

  componentWillReceiveProps(futureProps) {
    if (this.props !== futureProps) {
      let result = false ;
      if ( this.validateCoeficientes(futureProps) ){
        console.log('Validado..');
        result = this.calculateResults();
      }
      console.log(result);
      this.setState({ result })
    }
  }

   //Funcion que Valida si es posible operar con los datos ingresados
   validateCoeficientes = props => {
    console.log('Validando..');
    let {variables, restricciones } = props.status;
    //Verificando si los coeficientes de las variables y las restricciones no son nulos
    let varsOperatives = variables.filter(va => va.descripcion !== "");
    let verifQty = varsOperatives.length ? varsOperatives.every(va => va.coeficiente !== "") : false; 
    let restOperatives = restricciones.filter(re => re.descripcion !== "");
    let veriResQty = restOperatives.length ? restOperatives.every(re => re.coeficientes.every(co => co !== "") && re.derecha !== ""):false;
    return (verifQty && veriResQty) ? true : false;
  };

  //Funcion de Calculo del modelo.
  calculateResults = () => {
    console.log('Calculating..');  
    //Convertimos la App en Modelo para Solver.js
    let model = convertAppToModelForSolverPrimal(this.props.status);

    //solver.js soluciona y nos devuelve
    return solver.Solve(model, false, true);
  };

  render() {
    //Obtenemos el resultado almacenado
    let { result } = this.state;
    let printResults;
    console.log('Factible?:'+result.feasible);
    if ( result.feasible ) {
      //Obtenemos las Variables desde las props
      let { variables, restricciones, method } = this.props.status;
      if (method === "simplex") {
        if (result.bounded) {
            printResults = <SimplexPresentation variables={variables} restricciones={restricciones} result={result} />
          } 
      }else{
            printResults = <GraphicPresentation
                variables={variables}
                restricciones={restricciones}
                graph={result.feasible}
                result={ result.bounded ? result.solutionSet : {} }
              />
        }
      }
      
    return (
      <>
        <Card outline color="info" className="w-100 mt-3 mx-auto">
          <CardHeader>
            <CardTitle>
              <h3>
                {result.feasible
                  ? result.bounded ? "El resultado óptimo de la función objetivo es: " + result.evaluation
                    : "Solucion no Acotada"
                  : "Solución no Factible" }
              </h3>
            </CardTitle>
          </CardHeader>
          {result.feasible && printResults}
        </Card>
      </>
    );
  }
}

export default Presentation;
