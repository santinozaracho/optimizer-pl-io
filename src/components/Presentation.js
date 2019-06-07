import React from 'react';
import {Card,CardTitle,CardBody,CardText,CardHeader} from 'reactstrap';
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
        let result = 'No hay resultados todavsia'
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
                            <CardText>{
                                result[vari.xi] ? 
                                'Se recomienda utilizar: '+result[vari.xi]:
                                'No se Recomienda la utilizacion'}
                                {' de '+vari.descripcion}</CardText>
                        </CardBody>
        
                    </Card>) 
        return(
            <> 
                <Card>
                    <CardHeader><CardTitle><h3>{'El resultado optimo es: '+result.result}</h3></CardTitle></CardHeader>
                    <CardBody>
                        {impresionDeResultados}
                    </CardBody>
                </Card>  
            </>

        )
    }
}

export default Presentation;