import React from 'react';
import {Container, Row, Card} from 'reactstrap';
import Restriccion from './elements/Restriccion';
import Variable from './elements/Variable';



class Processing extends React.Component{
    constructor (props){
        super(props);
        this.state={};

    }

    isValidated() {
        //Verificando si los coeficientes de las variables no son nulos
        let verifQty = this.props.status.variables.every( va => va.coeficiente !== 0)
        if (verifQty) {
            this.props.handleStepResult(true);
            return true
        }else{
            this.props.handleStepResult(true);

            return true
        }

    }

    //En el Siguiente Handler, Se toma del input de una variable en particular el coeficiente.
    handleCoefVar = event => {        
        let {value, name} = event.target;
        if (value) {
            let {variables} = this.props.status;
            variables[name].coeficiente = parseInt(value);
            this.props.handleVariables(variables);
            console.log(this.props.status.variables);
        }
    }

    handleCoefRes = (event,ri) => {
        let {name,value } = event.target
        let {restricciones} = this.props.status;
        console.log('En la Res:'+ri+', en el campo:'+name+',con el valor:'+value);
        
        switch (name) {
            case 'derecha':
                    restricciones[ri].derecha = parseInt(value)
                break;
            case 'eq':
                    restricciones[ri].eq = value
                break;
            default:
                    restricciones[ri].coeficientes[name]= parseInt(value)
                break;
        }
        console.log(restricciones);
        this.props.handleRestricciones(restricciones);
    }


    render() {
        //Obtenemos las propiedades del Super
        let {variables} = this.props.status;        
        let {restricciones} = this.props.status;
        let varsOperativas = variables.filter(va => va.descripcion !== '').length;

        //Generamos el renderizado para cada una de los elementos de los arreglos obtenidos anteriormente.
        let variablesInput = variables.map(
            (variable,index) => {
                if (variable.descripcion !== ''){
                    return(<Variable key={'V'+index} handleCoefVar={this.handleCoefVar} variable={variable}/>)
                }
        });

        let restriccionesInput = restricciones.map(
            (restriccion,index) => {
                if (restriccion.descripcion !== '') {
                    return(<Restriccion key={'R'+index} handleCoefRes={this.handleCoefRes} cantVariables={varsOperativas} restriccion={restriccion}/>)
                }
        });
        
        return(
            <>
            <h3>Cargamos los datos de nuestro Modelo:</h3>
            <Container>
                <Row>
                    <Card className="w-100 mt-3">       
                        <h5>Variables:</h5>
                        {variablesInput}
                    </Card>
                </Row>
                <Row>
                    <Card className="w-100 mt-3">
                        <h5>Restricciones:</h5>
                        {restriccionesInput}                        
                    </Card>
                </Row>
            </Container>
            </>
        )
    }
}

export default Processing;