import React from 'react';
import {Card,CardTitle,CardBody,CardText,CardHeader,Table,CardFooter,Row} from 'reactstrap';
import solver from 'javascript-lp-solver';

let convertAppToModelForSolverPrimal = datosApp => {
    //Obtenemos los Datos de la aplicacion
    let {restricciones,variables,objective,integer} = datosApp;
    variables = variables.filter(item => item.descripcion !== '');
    restricciones = restricciones.filter(item => item.descripcion !== '');
    //Precargamos el Modelo
    let model = {optimize:'coeficiente',opType:'',constraints:{},variables:{},ints:{}};
    
    //Tratamos el objetivo
    model.opType = objective;

    //Verificamos si se desea PL Entera
    if (integer) {
        variables.forEach(vari => model.ints[vari.xi]=1)
    }    
    //Tratamos las Variables
    variables.forEach( vari => {  
            //Generamos una nueva Variable
            let newVari = {};
            newVari.coeficiente = vari.coeficiente;
            restricciones.forEach(restri =>
                    newVari['r'+restri.ri] = restri.coeficientes[vari.xi]);
            console.log(newVari);
            model.variables[vari.xi] = newVari;
        });
    //Tratamos las Restricciones
    restricciones.forEach(restri => {
            if(restri.eq === '>='){ 
                let res = {};
                res.min = restri.derecha     
                model.constraints['r'+restri.ri] = res;
            }else{
                let res = {};
                res.max = restri.derecha
                model.constraints['r'+restri.ri] = res;
            }});
    
    return model
}
        


class Presentation extends React.Component{
    constructor (props){
        super(props)
        this.state={result:false,resultDual:false}
    }

    componentDidMount() {
        if (this.props.status.result){
            this.calculateResults()
            console.log(this.state.result);
            console.log(this.state.resultDual);
        }

    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps){
            if (this.props.status.result){
                this.calculateResults()
            }  
        }
    }

    //Funcion de Calculo del modelo.
    calculateResults = () => {
        //Convertimos la App en Modelo para Solver.js
        let model = convertAppToModelForSolverPrimal(this.props.status);
        console.log(model);
        
        //solver.js soluciona y nos devuelve 
        let result = solver.Solve(model,false,true);
        console.log(result);
        
        this.setState({result})
    }


    tablaDeRecursos = (cantUsoVar,variable,restricciones) => {

    }

    render () {
        let {result} = this.state
        let {variables} = this.props.status;
        let impresionDeResultados = <p>.</p>;
        if (result.feasible) { impresionDeResultados = variables
            .filter(vari => vari.descripcion !== '')
            .map( vari => 
                        <Card key={'Card'+vari.xi} outline color='secondary' className="w-100 mt-3 mx-auto">
                            <CardHeader><CardTitle>{'Variable: X'+vari.xi}</CardTitle></CardHeader>    
                            <CardBody>
                                <Row><CardText>{
                                    result.solutionSet[vari.xi] ? 
                                    'Se recomienda producir '+result.solutionSet[vari.xi]+' unidades':
                                    'No se recomienda la produccion'}
                                    {' de '+vari.descripcion}</CardText>
                                </Row>
                                <Row></Row>
                    
                            </CardBody>
                            <CardFooter>
                                <CardText>Tabla de Recursos:</CardText>
                               
                            </CardFooter>
            
                        </Card>) 

        }
    
       
       return(
            <> 
                <Card outline color='info' className="w-100 mt-3 mx-auto">
                    <CardHeader><CardTitle><h3>{result.feasible ? 'El resultado optimo es: '+result.evaluation:'Solucion No Factible'}</h3></CardTitle></CardHeader>
                    <CardBody>
                        {impresionDeResultados}
                    </CardBody>
                </Card>  
            </>

        )
    }
}

export default Presentation;