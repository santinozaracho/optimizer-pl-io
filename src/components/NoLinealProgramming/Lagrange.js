import React from 'react';
import { ButtonGroup, Button, Container, Row, Col, Card, CardBody, CardHeader, CardTitle, Jumbotron } from "reactstrap";
import { Alert, UncontrolledPopover, PopoverBody, PopoverHeader, Input,InputGroupText,InputGroup,InputGroupAddon, } from "reactstrap";
import logo from "../../components/LinealProgramming/logo.svg";

import ReactDOM from 'react-dom'
import spinner from '../img/spinner.gif'
const {lagrangeMul} = require('./Methods/lagrangeMul')

//import lagrangeMul from './Methods/lagrangeMul'
//El formato de lo que se devuelve es el siguiente

//salida:{
//  puntos:[[x,y,z], [x2,y2,z2],[x3,y3,z3]],
//  tipos:["min","max","nae",...]
//}
//cada punto es una tupla de valores, y puede tener tres tipos, minimo, maximo, y notanextreme: nae
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
      
      model["restricciones"]=arregloRestricciones;
    }
    else{
      model[nombre] = valor;
    }
    this.setState({model})
    
  }
  wait = function(ms){
    return new Promise((r, j)=>setTimeout(r, ms))
  }

  resolverLagrange(){
    
    let {funcion, restricciones, obj } = this.state.model;
    if(funcion==="" || restricciones[0]==="" || restricciones.length===0){
      ReactDOM.render(<Alert color="danger">Por favor no llame a la funcion sin los datos requeridos</Alert>, document.getElementById("resolucion"))
      setTimeout(()=>{

        ReactDOM.render(<div></div>, document.getElementById("resolucion"))

      },3000)
      return;
    }
    
    try{
      var detectarVarIncorrectas= /[a-wy-z]/
      if(detectarVarIncorrectas.test(restricciones) || detectarVarIncorrectas.test(funcion))
      {
        ReactDOM.render(<Alert color="danger">Las variables utilizadas no son correctas</Alert>, document.getElementById("resolucion"))
      setTimeout(()=>{

        ReactDOM.render(<div></div>, document.getElementById("resolucion"))

      },3000)
      return;
      }
      else{
        lagrangeMul(funcion, restricciones,obj)
      .then((solucion) => {
        ReactDOM.render(<img src={spinner} alt="carga de la resolucion"></img>, document.getElementById("resolucion"))
        this.setState({salida:solucion})
        var prom= this.wait(3000)
        prom.then(()=>{
          this.muestraResultado(solucion)
        })
        
        
        
      })
      }
      
      
      
    }
    catch(error) {
      console.log(error)
    } 
     
  }


  muestraResultado(solucion){
    var resolucion;          
    if (solucion === false || solucion === undefined){
      resolucion = (<div>No existen extremos dentro de los Reales</div>)
    }else{
      let {puntos, tipo} = solucion
      resolucion=(
        <div>
          
          
          {
            puntos.map((elem,indicePunto)=>(
            
              <div>
              <b>Punto{indicePunto}: </b> 
              { 
                elem.map((punto,index)=>
                `${punto.toFixed(4)}; `
                
                )
              } 
              <b>Tipo:</b> {tipo[indicePunto]==="nae"?"No es un extremo":tipo[indicePunto]}
            </div>
            )
          )
        }
            
          
        
        
        </div>
      )
  }
    ReactDOM.render(resolucion, document.getElementById("resolucion"))
  
    }
  


  render(){
    console.log("modelo")
    console.log(this.state.model)
    console.log("salida")
    console.log(this.state.salida)
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