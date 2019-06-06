import React from 'react';
import {Alert,Card,CardTitle,CardBody,CardText} from 'reactstrap';
import solver from 'javascript-lp-solver';

let convertAppToModelForSolver = (modelo) => {
    let {restricciones,variables,objective} = modelo;
    let model = {
        optimize:'coeficiente',
        opType:'',
        constraints: {},
        variables: {}
    };
    //Tratamos el objetivo
    model.opType = objective;
        
    //Tratamos las Variables
    variables.forEach( vari => {  
        if (vari.descripcion !== '') {
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
        }     
    });
    //Tratamos las Restricciones
    restricciones.forEach(restri => {
        if(restri.descripcion !== ''){
            if(restri.eq === '>='){ 
                let res = {};
                res.min = restri.derecha     
                model.constraints['r'+restri.ri] = res;
            }else{
                let res = {};
                res.max = restri.derecha
                model.constraints['r'+restri.ri] = res;
            }
        }    
    });
    console.log(model);
    return model
}
        


class Presentation extends React.Component{
    constructor (props){
        super(props)
        this.state={result:false,model:''}
    }

    calculate = () => {
        let model = convertAppToModelForSolver(this.props.status)
//        return model
        return solver.Solve(model);      
    }


    render () {
        let result = 'No hay resultados todavia'
        if (this.props.status.result){
            result = this.calculate()
            console.log(result);
            
        }
        let {variables} =this.props.status;
        let impresionDeResultados = variables
        .map( vari => {
            console.log(result);
            console.log(result.xi);
            
            
            return(
            <Card>
                <CardTitle>
                    {'Variable: X'+vari.xi}
                </CardTitle>
                <CardBody>
                    <CardText>{'Definicion: '+vari.descripcion}</CardText>
                    <CardText>{'Se Producira: '+result[vari.xi]+' cantidad del Producto'}</CardText>
                </CardBody>

            </Card>)
            }

        ) 
        return(
            <> 
                <h3>{'Se va a Ganar:$ '+result.result}</h3>
                {impresionDeResultados}
            </>

        )
    }
}

export default Presentation;