import React from 'react';
import { ButtonGroup, Button, Container, Row, Col, Card, CardBody, CardHeader, CardTitle, Jumbotron } from "reactstrap";
import { Alert, UncontrolledPopover, PopoverBody, PopoverHeader, Input,InputGroupText,InputGroup,InputGroupAddon, } from "reactstrap";
import logo from "../../components/LinealProgramming/logo.svg";
import Variables from '../LinealProgramming/Configuration/Variables/index'

class Derivadas extends React.Component{
    constructor(props){
        super(props)
        this.state={
            model:{
                funcion:"",
                incognitas:[],
                obj:"max",
                salida:"No se encontro solucion"
            }
            
        }
    }
    handleObjective = objective => {
        let { model } = this.state;
        model.obj = objective;
        this.setState({ model });
      };
    
      handleInput = e =>{
        let nombre = e.target.name;
        let valor = e.target.value
        if(nombre!=="funcion"){
          valor = Number(valor)
        }
        if(nombre==="epsilon"){
            if(valor < 0){
                e.target.value = 0 
                valor = 0
            } 
        }
        
        let { model } = this.state;
        model[nombre] = valor;
        this.setState({model})
    
        console.log(this.state.model)
        
    
      }
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
        <Col xs={12} md={6} className="my-4 mx-auto ">
                    <Jumbotron className='w-100'>
                    <h2>Metodo de las derivadas</h2>
                    <h4>Comenzamos configurando nuestro modelo</h4>
                    <Col>
                  <UncontrolledPopover flip={false} trigger="hover" placement="top" target="CardOpt">
                    <PopoverBody>
                      Aqui debes seleccionar el tipo de optimizacion que deseas realizar: si deseas maximizar o minimizar la función.
                    </PopoverBody>
                  </UncontrolledPopover>
                  <Card outline color="secondary" id="CardOpt" className="mt-3 mx-auto">
                    <CardHeader>Tipo de optimización</CardHeader>
                    <CardBody>{buttonsOptType}</CardBody>
                  </Card>
                </Col>
                <Row>
                <UncontrolledPopover flip={false} trigger="hover" placement="top" target="CardVariables">
                  <PopoverHeader>Datos</PopoverHeader>
                  <PopoverBody>
                    Aquí debes ingresar los elementos necesarios para la resolucion del modelo a traves del metodo de las derivadas
                  </PopoverBody>
                </UncontrolledPopover>
                <br/>
                <Card outline color="secondary" id="CardVariables" className="w-100 mt-3 mx-auto">
                  <CardHeader>
                    <CardTitle className="text-left">
                      <h4>Datos</h4>
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                  <InputGroup className="mt-1" id="funcionObj">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText >
                          <b>Funcion</b>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        name="funcion"
                        placeholder="Ingrese la funcion"
                        
                        onChange={this.handleInput}
                        
                      />
                      <UncontrolledPopover flip={false} trigger="focus hover" placement="auto" target="funcionObj">
                        <PopoverBody>Aquí debes ingresar la funcion objetivo a optimizar.</PopoverBody>
                      </UncontrolledPopover>
                  </InputGroup>
                  
    
    
                  </CardBody>
    
                </Card>
                
               
              </Row>
    
    
    
              <Row>
                
                <br/>
                <Card outline color="secondary" id="CardVariables" className="w-100 mt-3 mx-auto">
                  <CardHeader>
                    <CardTitle className="text-left">
                      <h4>Resolucion del problema</h4>
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                  {this.state.model.salida}
    
                  </CardBody>
                </Card>
                
              </Row>
          </Jumbotron>  
        </Col>
        </Row>
      </Container>
        
        
        )
    }
    
    
}

export default Derivadas;