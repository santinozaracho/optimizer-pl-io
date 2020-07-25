import React from 'react';

import { ButtonGroup, Button, Container, Row, Col, Card, CardBody, CardHeader, CardTitle, Jumbotron } from "reactstrap";
import { Alert, UncontrolledPopover, PopoverBody, PopoverHeader } from "reactstrap";
import logo from "../../components/LinealProgramming/logo.svg";
import Variables from '../LinealProgramming/Configuration/Variables/index'
class Dicotomica extends React.Component{
constructor(props){
    super(props)
    this.state={
        model:{
            funcion:"",
            extremoA:"",
            extremoB:"",
            delta:"",
            obj:"max",
            salida:""
        }
        
    }
}
handleObjective = objective => {
    let { model } = this.state;
    model.obj = objective;
    this.setState({ model });
  };

render(){
    let buttonsOptType = (
        <ButtonGroup>
          <Button
            outline
            onClick={() => this.handleObjective("max")}
            active={this.state.model.obj === "max"}
            color="primary"
          >
            Maximizar
          </Button>
          <Button
            outline
            onClick={() => this.handleObjective("min")}
            active={this.state.model.obj === "min"}
            color="primary"
          >
            Minimizar
          </Button>
        </ButtonGroup>)

    return(
        <Container fluid className="App">
            <Row className="">
          <Col xs={12} md={6} className="mx-auto">
            <img src={logo} className="App-logo" alt="logo" height="200" />
          </Col>
            </Row>
    
    <Row>
                <Jumbotron className='w-100'>
                <h2>Busqueda Dicotomica</h2>
                <h4>Comenzamos configurando nuestro modelo</h4>
                <Col>
              <UncontrolledPopover flip={false} trigger="hover" placement="top" target="CardOpt">
                <PopoverBody>
                  Y aquí el tipo de optimizacion que deseas realizar: si deseas maximizar o minimizar la
                  función.
                </PopoverBody>
              </UncontrolledPopover>
              <Card outline color="secondary" id="CardOpt" className="mt-3 mx-auto">
                <CardHeader>Tipo de optimización</CardHeader>
                <CardBody>{buttonsOptType}</CardBody>
              </Card>
            </Col>
            <Row>
            <UncontrolledPopover flip={false} trigger="hover" placement="top" target="CardVariables">
              <PopoverHeader>Variables</PopoverHeader>
              <PopoverBody>
                Aquí debes ingresar las variables que formarán parte del modelo, las mismas son de carga
                dinámica.
              </PopoverBody>
            </UncontrolledPopover>
            <Card outline color="secondary" id="CardVariables" className="w-100 mt-3 mx-auto">
              <CardHeader>
                <CardTitle className="text-left">
                  <h4>Variables</h4>
                </CardTitle>
              </CardHeader>
              <CardBody></CardBody>
            </Card>
          </Row>

                </Jumbotron>  
            </Row>
    </Container>
    
    
    )
}


}

export default Dicotomica;