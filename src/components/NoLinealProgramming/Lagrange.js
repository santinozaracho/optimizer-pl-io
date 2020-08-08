import React from 'react';
import { ButtonGroup, Button, Container, Row, Col, Card, CardBody, CardHeader, CardTitle, Jumbotron } from "reactstrap";
import { Alert, UncontrolledPopover, PopoverBody, PopoverHeader, Input,InputGroupText,InputGroup,InputGroupAddon, } from "reactstrap";
import logo from "../../components/LinealProgramming/logo.svg";
import Variables from '../LinealProgramming/Configuration/Variables/index'
import ReactDOM from 'react-dom'
const {lagrangeMul} = require('./Methods/lagrangeMul')

//import lagrangeMul from './Methods/lagrangeMul'

class Lagrange extends React.Component{
constructor(props){
    super(props)
    this.state={
        model:{
            funcion:"",
            restricciones: [],
            obj:"max",
        },
        salida:false
    }
}

handleObjective = objective => {
    let { model } = this.state;
    model.obj = objective;
    this.setState({ model });
  };

  handleInput = e =>{
    let nombre = e.target.name;
    let valor = e.target.value;
    let arregloRestricciones = []    
    let { model } = this.state;
    if(nombre === "restricciones")
    {
      //Parseamos la separacion por ; para hacer la carga de restricciones en un arreglo
      arregloRestricciones = valor.split(";");
      
      for (var i = 0; i < arregloRestricciones.length; i++) {
        arregloRestricciones[i] = arregloRestricciones[i].trim()
      }
      //se pone [0] porque probamos cargar una sola restriccion
      model["restricciones"]=arregloRestricciones;
    }
    else{
      model[nombre] = valor;
    }
    this.setState({model})
    console.log("Dentro de handle input")
    console.log(this.state.model)
  }

  resolverLagrange(){
    
    let {funcion, restricciones, obj } = this.state.model;
    console.log("Dentro de resolverLagrange")
    console.log(funcion)
    try{
      lagrangeMul(funcion, ["4*x1+x2^2+2*x3-14=0"],"min")
      .then((solucion) => {
        console.log("Then en resolverLagrange - lagrangeMul")
        console.log(solucion)
        this.setState({salida:solucion})
        this.muestraResultado();
      });
      
    }
    catch(error) {
      console.log(error)
    } 
    console.log(this.state.salida);  
  }


  muestraResultado(){
    let {salida} = this.state
    console.log("En muestraResultado")
    console.log(this.state.salida)
    
      //Resolucion
      
      
      
      let resolucion=(
        <div>
          <b>Caso</b>: 
          {/*
            ptofactible.map((elem,index)=><div>
              <b>X{index+1}</b> : {elem.toFixed(2)}


            </div>)
          */ }
         
          <b>Funcion valuada en el punto:</b> 
        </div>
      )
      
      ReactDOM.render(resolucion, document.getElementById("resolucion"))
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
                <h2>Metodo de Lagrange</h2>
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

              <InputGroup className="mt-1" id="restricciones">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText >
                      <b>Restricciones</b>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="restricciones"
                    placeholder="a*x1 = 0 ;...; b*xn = 0"
                    
                    onChange={this.handleInput}
                    
                  />
                  <UncontrolledPopover flip={false} trigger="focus hover" placement="auto" target="restricciones">
                    <PopoverBody>Aquí debes ingresar las restricciones del modelo, separadas por ;</PopoverBody>
                  </UncontrolledPopover>
              </InputGroup>
              </CardBody>
            </Card>
          </Row>

            <br/>
            <Button
            outline 
            color="success"
            onClick={() => this.resolverLagrange()} >
              Resolver
            </Button>
          
            
          <Row>
            <br/>
            <Card outline color="secondary" id="CardVariables" className="w-100 mt-3 mx-auto">
              <CardHeader>
                <CardTitle className="text-left">
                  <h4>Resolucion del problema</h4>
                </CardTitle>
              </CardHeader>
              <CardBody id="resolucion">
              

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

export default Lagrange;