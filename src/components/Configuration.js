import React from 'react';
import {ButtonGroup, Button, Container, Row, Card, InputGroup,InputGroupAddon,InputGroupText, Input} from 'reactstrap';



class Configuration extends React.Component{
    constructor (props){
        super(props);
        this.handlerInputRes=this.handlerInputRes.bind(this);
        this.handlerInputVar=this.handlerInputVar.bind(this);
        this.handleNewsRes();
    }

    handlerInputVar (event) {
        let {value, name} = event.target;
        let {variables} = this.props.status;
        variables[name].descripcion = value;
        this.props.handleVariables(variables);
        this.handleNewsVar(this.props.status.method)
    }

    handlerInputRes (event) {
        let {value, name} = event.target;
        let {restricciones} = this.props.status;
        restricciones[name].descripcion = value;
        this.props.handleRestricciones(restricciones);
        this.handleNewsRes()
    }

    handleNewsRes () {
        let {restricciones} = this.props.status;
        let counterWitheRes = restricciones.filter( element => element.descripcion.length === 0).length;
        if (counterWitheRes === 0 ) {
            let {variables} = this.props.status
            let coeficientes = [];
            variables.forEach(variables => coeficientes.push(null))
            restricciones.push({ri:restricciones.length,descripcion:'',coeficientes:coeficientes,eq:'>=',derecha:null})
            this.props.handleRestricciones(restricciones);
        }
    }
    handleNewsVar (method) { 
        let {restricciones} = this.props.status;
        let {variables} = this.props.status;

        if (method === 'simplex') {
            let counterWitheVar = variables.filter( element => element.descripcion.length === 0).length;
            if (counterWitheVar === 0 ) {  
                variables.push({xi:variables.length,descripcion:'',coeficiente:null})
                this.props.handleVariables(variables);
                restricciones.forEach(rest => {
                    rest.coeficientes.push(null);
                })
                this.props.handleRestricciones(restricciones)      
            }
        }else{
            if(variables.length > 2) {     
                variables.splice(2)
                this.props.handleVariables(variables);

                restricciones.forEach(rest => {
                    rest.coeficientes.splice(2);
                })
                this.props.handleRestricciones(restricciones)    
            }
        }
        

    }
    
    render () {
        let {variables} = this.props.status;
        let {restricciones} = this.props.status;
        let variablesToDesc = variables.map( (variable,index) => {       
            return(<InputGroup key={index}>
                <InputGroupAddon addonType="prepend">
                    <InputGroupText name="xi" id="variable">{"X"+variable.xi}</InputGroupText>
                </InputGroupAddon>
                    <Input
                        name={index}
                        placeholder="Descripcion de la Variable"
                        aria-label="Descripcion"
                        aria-describedby="variable"
                        onChange={this.handlerInputVar}
                        value={variable.descripcion}
                        />
            </InputGroup>)
        });
        let restriccionesToDesc = restricciones.map( (restriccion,index) => {
            return(<InputGroup key={index}>
                <InputGroupAddon addonType="prepend">
                    <InputGroupText name="ri" id="restriccion">{"R"+restriccion.ri}</InputGroupText>
                </InputGroupAddon>
                    <Input
                        name={index}
                        placeholder="Descripcion de la Restriccion"
                        aria-label="Descripcion"
                        aria-describedby="restriccion"
                        onChange={this.handlerInputRes}
                        value={restriccion.descripcion}
                        />
                 
            </InputGroup>)
        });
        return(
            <>
                <h3>Comenzamos Configurando nuestro Modelo:</h3>
                <Container>
                    <Row>         
                            <Card className="mx-auto">
                                <p>Metodo a Utilizar:</p>
                                <ButtonGroup>
                                    <Button onClick={() => {this.props.handleMethod('graph');this.handleNewsVar('graph')}} active={this.props.status.method === 'graph'}>
                                        GRAFICO
                                    </Button>
                                    <Button onClick={() => {this.props.handleMethod('simplex');this.handleNewsVar('simplex')}} active={this.props.status.method === 'simplex'}>
                                        SIMPLEX
                                    </Button>
                                </ButtonGroup>
                            
                            </Card>              
                            <Card className="mx-auto">
                                <p>Tipo de Optimizacion:</p>
                                <ButtonGroup>
                                    <Button onClick={() => this.props.handleObjective('max')} active={this.props.status.objective === 'max'}>
                                        Maximizacion
                                    </Button>
                                    <Button onClick={() => this.props.handleObjective('min')} active={this.props.status.objective === 'min'}>
                                        Minimizacion
                                    </Button>
                                </ButtonGroup>
                            </Card>
                    </Row>
                    <Row>
                        <Card className="w-100 mt-3">       
                            <h5>Variables:</h5>
                            {variablesToDesc}
                        </Card>
                    </Row>
                    <Row>
                        <Card className="w-100 mt-3">
                            <h5>Restricciones:</h5>
                            {restriccionesToDesc}
                        </Card>
                    </Row>
                </Container>
            </>
        )
    }
}

export default Configuration;