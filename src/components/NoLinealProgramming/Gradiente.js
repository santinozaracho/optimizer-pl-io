import React from 'react';

import { ButtonGroup, Button, Container, Row, Col, Card, CardBody, CardHeader, CardTitle, Jumbotron } from "reactstrap";
import { UncontrolledPopover, PopoverBody, PopoverHeader, Input,InputGroupText,InputGroup,InputGroupAddon, } from "reactstrap";
import logo from "../../components/LinealProgramming/logo.svg";


import {funcionGradiente} from "./Methods/Gradiente"

class Gradiente extends React.Component{
constructor(props){
    super(props)
    this.state={
        model:{
            funcion:"",
            puntoInicialA:"",
            puntoInicialB:"",
            obj:"max",
            epsilon:"",
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


  //Ver que en update verifique por la completitud del modelo para la resolucion

  componentDidUpdate(){
    this.resolucionModelo()
  }

  //Resolver el problema si el modelo es completo
  resolucionModelo(){
    let {funcion, puntoInicialA,
    puntoInicialB,
    epsilon } = this.state.model
    let puntoX0 = `(${puntoInicialA},${puntoInicialB})`
    //Metodo every para ver que todos los elementos tengan algo concreto
    //a partir del estado
    if(Array.from(this.state.model).every( elem=> elem!=="" )){
      
      console.log("Completitud")
      //funcionGradiente(funcion, puntoX0, epsilon)
    
    
    }
      

  
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
                <h2>Metodo del gradiente</h2>
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
                Aquí debes ingresar los elementos necesarios para la resolucion del modelo a traves del metodo del Gradiente
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
              <br/>
              Punto X0 - (a;b)
              <Col>
              <InputGroup className="mt-1" id="puntoEnA">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText >
                      a
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="puntoInicialA"
                    placeholder="Ingrese a de X0"
                    
                    onChange={this.handleInput}
                    type="number"
                  />
                  <UncontrolledPopover flip={false} trigger="focus hover" placement="auto" target="puntoEnA">
                    <PopoverBody>Aquí debes ingresar a del punto X0 provisto por problema.</PopoverBody>
                  </UncontrolledPopover>
              </InputGroup>
              <InputGroup className="mt-1" id="puntoEnB">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText >
                      b
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="puntoInicialB"
                    placeholder="Ingrese b de X0"
                    
                    onChange={this.handleInput}
                    type="number"
                  />
                  <UncontrolledPopover flip={false} trigger="focus hover" placement="auto" target="puntoEnB">
                    <PopoverBody>Aquí debes ingresar b del punto X0 provisto por problema.</PopoverBody>
                  </UncontrolledPopover>
              </InputGroup>
              </Col>

              <br/>

              <InputGroup className="mt-1" id="epsilon">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText >
                    ε 
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="epsilon"
                    placeholder="Ingrese Epsilon "
                    
                    onChange={this.handleInput}
                    type="number"
                    min={0}
                  />
                  <UncontrolledPopover flip={false} trigger="focus hover" placement="auto" target="epsilon">
                    <PopoverBody>Aquí debes ingresar el Epsilon provisto por el problema, debe ser >=0</PopoverBody>
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

export default Gradiente;