import React from 'react';
import {Tooltip, ToggleButtonGroup, ToggleButton, Button, Jumbotron, Container, Row, Col, Card, InputGroup, FormControl, OverlayTrigger} from 'react-bootstrap';
import Restriccion from './elements/Restriccion';



class Processing extends React.Component{
    constructor (props){
        super(props);
        this.state={variables:[],restricciones:[{ri:1,descripcion:'',coeficientes:[0,0],eq:'>',derecha:0}]};
        this.handleNext=this.handleNext.bind(this);
        this.handlerInputRes=this.handlerInputRes.bind(this);
        this.handlerInputVar=this.handlerInputVar.bind(this);

    }

    componentDidMount () {
        this.setState({
            method:this.props.status.method,
            objective:this.props.status.objective,
            restricciones:this.props.status.restricciones,
            variables:this.props.status.variables})
    }


    handlerInputVar (event) {
        let {value, name} = event.target;
        let {variables} = this.state;
        variables[name].coeficiente = value;
        this.setState({variables});
    }

    handlerInputRes (event) {
        let {value, name} = event.target;
        let {restricciones} = this.state;
        restricciones[name].descripcion = value;
        this.setState({restricciones});
    }

    handleNext () {
        console.log("Next");
        
    }  
    render() {
        let {variables} = this.state;
        let {restricciones} = this.state;
        let variablesToDesc = variables.map( (variable,index) => {       
            return(<InputGroup key={index}>
                <InputGroup.Prepend>
                    <InputGroup.Text name="xi" id="variable">{"X"+variable.xi}</InputGroup.Text>
                </InputGroup.Prepend>
                <InputGroup.Prepend>
                    <InputGroup.Text name="description" id="variable">{variable.descripcion}</InputGroup.Text>
                </InputGroup.Prepend>
                <OverlayTrigger
                        overlay={
                            <Tooltip>
                            Aqui usted debe Ingresar el coeficiente de la Variable.
                            </Tooltip>}>
                    <FormControl
                        name={index}
                        placeholder="Coef"
                        aria-label="Coeficiente"
                        aria-describedby="coe"
                        onChange={this.handlerInputVar}
                        value={variable.coeficiente}
                        />
                </OverlayTrigger>
            </InputGroup>)
        });

        console.log("restricciones");
        console.log(restricciones);
        let restriccionesInput = restricciones.map( (restriccion,index) => {
            return(<Restriccion key={index} restriccion={restriccion} />)
        });
        
        return(
            <>
            <h3>Cargamos los datos de nuestro Modelo:</h3>
            <Jumbotron>
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

export default Processing;