import React from 'react';
import {Tooltip, ToggleButtonGroup, ToggleButton, Button, Jumbotron, Container, Row, Col, Card, InputGroup, FormControl, OverlayTrigger} from 'react-bootstrap';



class Configuration extends React.Component{
    constructor (props){
        super(props);
        this.state={variables:[],restricciones:[]};
        this.handlerMethod=this.handlerMethod.bind(this);
        this.handleNext=this.handleNext.bind(this);
        this.handlerObjective=this.handlerObjective.bind(this);
        this.handlerInputRes=this.handlerInputRes.bind(this);
        this.handlerInputVar=this.handlerInputVar.bind(this);
        

    }

    componentDidMount(){
        this.setState({
            method:this.props.status.method,
            objective:this.props.status.objective,
            restricciones:this.props.status.restricciones,
            variables:this.props.status.variables});
        this.handleNewsRes();
        this.handleNewsVar(this.state.method);

    }

    handlerInputVar (event) {
        let {value, name} = event.target;
        let {variables} = this.state;
        variables[name].descripcion = value;
        this.setState({variables});
        this.handleNewsVar(this.state.method)
    }

    handlerInputRes (event) {
        let {value, name} = event.target;
        let {restricciones} = this.state;
        restricciones[name].descripcion = value;
        this.setState({restricciones});
        this.handleNewsRes()
    }

    handleNewsRes () {
        let {restricciones} = this.state;
        let counterWitheRes = restricciones.filter( element => element.descripcion.length === 0).length;
        if (counterWitheRes === 0 ) {  
            restricciones.push({ri:restricciones.length+1,descripcion:'',coeficientes:[0,0],eq:'>',derecha:0})
            this.setState({restricciones})
        }
    }
    handleNewsVar (method) { 
        let {restricciones} = this.state;
        if (method === 'simplex') {
            let {variables} = this.state;
            let counterWitheVar = variables.filter( element => element.descripcion.length === 0).length;
            if (counterWitheVar === 0 ) {  
                variables.push({xi:variables.length+1,descripcion:'',coeficiente:0})
                this.setState({variables})
                restricciones.forEach(rest => {
                    rest.coeficientes.push(0);
                })
                this.setState({restricciones})
                
            }
        }else{
            let {variables} = this.state;
            if(variables.length > 2) {     
                variables.splice(2)
                this.setState({variables})

                restricciones.forEach(rest => {
                    rest.coeficientes.splice(2);
                })
                this.setState({restricciones})    
            }
        }
        

    }
    handlerMethod (method) {
        this.setState({method});
        this.handleNewsVar(method);
    }

    handleNext () {
        console.log(this.state.restricciones);
        this.props.handleStateSystem(this.state.variables,
            this.state.restricciones,
            this.state.method,
            this.state.objective)
    }

    handlerObjective (objective) {
        this.setState({objective})
    }


    
    render () {
        let {variables} = this.state;
        let {restricciones} = this.state;
        let variablesToDesc = variables.map( (variable,index) => {       
            return(<InputGroup key={index}>
                <InputGroup.Prepend>
                    <InputGroup.Text name="xi" id="variable">{"X"+variable.xi}</InputGroup.Text>
                </InputGroup.Prepend>
                <OverlayTrigger
                        overlay={
                            <Tooltip>
                            Aqui usted debe Ingresar la Descripcion de la Variable.
                            </Tooltip>}>
                    <FormControl
                        name={index}
                        placeholder="Descripcion de la Variable"
                        aria-label="Descripcion"
                        aria-describedby="variable"
                        onChange={this.handlerInputVar}
                        value={variable.descripcion}
                        />
                </OverlayTrigger>
            </InputGroup>)
        });
        let restriccionesToDesc = restricciones.map( (restriccion,index) => {
            return(<InputGroup key={index}>
                <InputGroup.Prepend>
                    <InputGroup.Text name="ri" id="restriccion">{"R"+restriccion.ri}</InputGroup.Text>
                </InputGroup.Prepend>
                <OverlayTrigger
                        overlay={
                            <Tooltip>
                            Aqui usted debe Ingresar la Descripcion de la Restriccion.
                            </Tooltip>}>
                    <FormControl
                        name={index}
                        placeholder="Descripcion de la Restriccion"
                        aria-label="Descripcion"
                        aria-describedby="restriccion"
                        onChange={this.handlerInputRes}
                        value={restriccion.descripcion}
                        />
                    </OverlayTrigger>
            </InputGroup>)
        });
        return(
            <>
            <h3>Comenzamos Configurando nuestro Modelo:</h3>
            <Jumbotron>
                <Container>
                    <Row>
                        <OverlayTrigger
                                    overlay={
                                        <Tooltip>
                                        Seleccione el Metodo deseado para la solucion del Modelo.
                                        </Tooltip>}>
                            <Card className="mx-auto">
                                
                                <p>Metodo a Utilizar:</p>
                                <ToggleButtonGroup type="radio" onChange={this.handlerMethod} value={this.state.method} name="method">
                                    <ToggleButton value="graph">
                                        GRAFICO
                                    </ToggleButton>
                                    <ToggleButton value="simplex">
                                        SIMPLEX
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            
                            </Card>
                        </OverlayTrigger>
                        <OverlayTrigger
                                    overlay={
                                        <Tooltip>
                                        Seleccione que tipo de Optimizacion desea realizar en el Modelo.
                                        </Tooltip>}>
                            <Card className="mx-auto">
                                <p>Tipo de Optimizacion:</p>
                                <ToggleButtonGroup type="radio" onChange={this.handlerObjective} value={this.state.objective} name="objective" >
                                    <ToggleButton value="max">
                                        Maximizacion
                                    </ToggleButton>
                                    <ToggleButton value="min">
                                        Minimizacion
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Card>
                        </OverlayTrigger>
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
                    <Row className="mt-3">
                        <Col md={{ span: 6, offset: 6 }}>
                            <Button onClick={this.props.nextStep} onClickCapture={this.handleNext}>Continuar</Button>
                        </Col> 
                    </Row>
                </Container>
                
            </Jumbotron>
            </>
        )
    }
}

export default Configuration;