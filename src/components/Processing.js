import React from 'react';
import {Container, Row, Card} from 'reactstrap';
import Restriccion from './elements/Restriccion';
import Variable from './elements/Variable';



class Processing extends React.Component{
    constructor (props){
        super(props);
        this.state={};
        this.handleCoeficientefromV=this.handleCoeficientefromV.bind(this);
        this.handlerInputRes=this.handlerInputRes.bind(this);
        this.handlerInputVar=this.handlerInputVar.bind(this);

    }


    handlerInputVar (event) {
        let {value, name} = event.target;   
    }

    handlerInputRes (event) {
        let {value, name} = event.target;
        let {restricciones} = this.props.status;
        restricciones[name] = value;
        this.props.handleRestricciones(restricciones);
    }
    //En el Siguiente Handler, Se toma del input de una variable en particular el coeficiente.
    handleCoeficientefromV(indVariable,coeficiente) {
        
        let {variables} = this.props.status;
        variables[indVariable].coeficiente = coeficiente;
        console.log(variables);
        
        this.props.handleVariables(variables);
    }

    render() {
        //Obtenemos las propiedades del Super
        let {variables} = this.props.status;        
        let {restricciones} = this.props.status;
        console.log(restricciones);

        //Generamos el renderizado para cada una de los elementos de los arreglos obtenidos anteriormente.
        let variablesToDesc = variables.map( (variable,index) => {       
            return(<Variable key={'V'+index} getCoeficiente={this.handleCoeficientefromV} variable={variable}/>)
        });

        let restriccionesInput = restricciones.map((restriccion,index) => {
            return(<Restriccion key={'R'+index} restriccion={restriccion}/>)
        });
        
        return(
            <>
            <h3>Cargamos los datos de nuestro Modelo:</h3>
            <Container>
                <Row>
                    <Card className="w-100 mt-3">       
                        <h5>Variables:</h5>
                        {variablesToDesc}
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