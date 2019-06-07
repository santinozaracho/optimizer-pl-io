import React from 'react';
import {Card,CardTitle,CardBody,CardText} from 'reactstrap';
import solver from 'javascript-lp-solver';

let convertAppToModelForSolverPrimal = datosApp => {
    //Obtenemos los Datos de la aplicacion
    let {restricciones,variables,objective} = datosApp;
    //Precargamos el Modelo
    let model = {optimize:'coeficiente',opType:'',constraints:{},variables:{}};
    
    //Tratamos el objetivo
    model.opType = objective;
        
    //Tratamos las Variables
    variables
    .filter(item => item.descripcion !== '')
    .forEach( vari => {  
            //Generamos una nueva Variable
            let newVari = {};
            newVari.coeficiente = vari.coeficiente;
            restricciones.forEach(restri => {
                if(restri.descripcion !==''){
                    newVari['r'+restri.ri] = restri.coeficientes[vari.xi];
                }
            });
            console.log(newVari);
            model.variables[vari.xi] = newVari;
        });
    //Tratamos las Restricciones
    restricciones
    .filter(item => item.descripcion !== '')
    .forEach(restri => {
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
        this.state={result:false}
    }

    //Funcion de Calculo del modelo.
    calculatePrimal = () => {
        //Convertimos la App en Modelo para Solver.js
        let model = convertAppToModelForSolverPrimal(this.props.status)
        //solver.js soluciona y nos devuelve
        return solver.Solve(model);      
    }

    render () {
        let result = 'No hay resultados todavia'
        if (this.props.status.result){
            result = this.calculatePrimal()
            console.log(result);
        }
        let {variables} =this.props.status;
        let impresionDeResultados = variables
        .filter(vari => vari.descripcion !== '')
        .map( vari => 
                    <Card key={'Card'+vari.xi}>
                        <CardTitle>
                            {'Variable: X'+vari.xi}
                        </CardTitle>
                        <CardBody>
                            <CardText>{'Se recomienda: '+result[vari.xi]+' de'+vari.descripcion}</CardText>
                        </CardBody>
        
                    </Card>) 
        return(
            <> 
                <h3>{'Se va a Ganar:$ '+result.result}</h3>
                {impresionDeResultados}
            </>

        )
    }
}

export default Presentation;