import React from "react";
import { Card, CardTitle, Row, CardHeader, Badge } from "reactstrap";
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
    console.log("RESULTADOOOOOOO");
    console.log(result);
    let printResults;
    let existenCeros = false;
    
    
    
    if ( result.feasible ) {
      //Esto voy a ocupar para preguntar si en la fila de Z hay algun cero quiere decir que existen multiples soluciones
      //Esto es teniendo en cuenta que el metodo Solver solamente arma la tabla del Simplex con las columnas de las variables que NO ESTAN EN LA BASE 
      let {matrix} = result._tableau;     
      existenCeros = matrix[0].some(current => current === 0); //Recorremos la fila de Z que seria la fila 0 en la matrix, y si existe algun cero ponemos true
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
              <Row className="justify-content-center">
                <h3>
                  {result.feasible
                    ? result.bounded ? "El resultado óptimo de la función objetivo es: " + result.evaluation
                      : "Solucion no Acotada"
                    : "Solución no Factible" }
                </h3>
              </Row>
              {existenCeros && <Row className="justify-content-center"><h4><Badge pill color="info">Existen soluciones multiples para este ejercicio</Badge></h4></Row>}
            </CardTitle>
          </CardHeader>
          {result.feasible && printResults}
        </Card>
      </>
    );
  }
}

export default Presentation;
