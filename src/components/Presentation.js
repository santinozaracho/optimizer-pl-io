import React from 'react';
import {Alert,Button} from 'reactstrap';
import solver from 'javascript-lp-solver'
import Restriccion from './elements/Restriccion';

let convertArraysToModelForSolver = (modelo) => {
    let {restricciones,variables,objective} = modelo;
    let model = {};
    model.constraints = restricciones;
    
    return JSON.stringify(model)
}
        


class Presentation extends React.Component{
    constructor (props){
        super(props)
        this.state={model:''}
    }

    calculate = () => {
        let model = convertArraysToModelForSolver(this.props.status)
        console.log(model);
        
        
    }


    render () {
        

        return(
            <> 
            <Alert color="warning">TESTING RESULTS</Alert>
            <Button color='success' onClick={this.calculate}>Calcular</Button>
            <p>{this.state.resultados}</p>
            </>

        )
    }
}

export default Presentation;