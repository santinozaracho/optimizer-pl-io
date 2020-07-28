import React from 'react';
import ReactDOM from 'react-dom'
import { ButtonGroup, Button, Container, Row, Col, Card, CardBody, CardHeader, CardTitle, Jumbotron } from "reactstrap";
import { Alert, UncontrolledPopover, PopoverBody, PopoverHeader, Input,InputGroupText,InputGroup,InputGroupAddon, } from "reactstrap";
import logo from "../../components/LinealProgramming/logo.svg";
import busquedaFuncion from "./Methods/dicotomica";
import {busquedaBinaria as busquedaTramos} from "./Methods/dicoPorTramos"

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
    let valor = e.target.value
    if(nombre!=="funcion"){
      valor = Number(valor)
    }
    
    let { model } = this.state;
    model[nombre] = valor;
    this.setState({model})
    

  }

  componentDidUpdate(){
    this.resolucionModelo()
  }

  //Resolver el problema si el modelo es completo
  resolucionModelo(){
    let respuesta = false
    let {funcion, extremoA, extremoB, delta, obj } = this.state.model
    
    
    if(funcion!=="" & extremoA!=="" & extremoB!=="" & delta!==""){
      
      
        respuesta = busquedaFuncion(funcion, extremoA, extremoB, delta,obj)
        console.log(respuesta)
        if (respuesta!==false){
          
            this.state.salida = respuesta

            
              let resp = (<div>
                
                <b>Punto xl:</b> {this.state.salida[0].toFixed(3)}
                <br/>
                <b>Punto xr:</b> {this.state.salida[1]}
                
              </div>)
              ReactDOM.render(resp, document.getElementById("resultadosDico"))
              
          
        }else{
          console.log('caca')
          let resp = (<div>
                No se encontro solucion
              </div>)
               ReactDOM.render(resp, document.getElementById("resultadosDico"))
        }
       
    
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
                <h2>Busqueda Dicotomica</h2>
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
                Aquí debes ingresar los elementos necesarios para la resolucion del modelo a traves de la busqueda dicotomica
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
              <InputGroup className="mt-1" id="delta">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText >
                      Delta
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="delta"
                    placeholder="Ingrese un delta"
                    
                    onChange={this.handleInput}
                    type="number"
                  />
                  <UncontrolledPopover flip={false} trigger="focus hover" placement="auto" target="delta">
                    <PopoverBody>Aquí debes ingresar el delta provisto por problema.</PopoverBody>
                  </UncontrolledPopover>
              </InputGroup>

              <br/>

              <InputGroup className="mt-1" id="extremoA">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText >
                      Extremo a
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="extremoA"
                    placeholder="Ingrese el extremo a "
                    
                    onChange={this.handleInput}
                    type="number"
                  />
                  <UncontrolledPopover flip={false} trigger="focus hover" placement="auto" target="extremoA">
                    <PopoverBody>Aquí debes ingresar el extremo a del intervalo.</PopoverBody>
                  </UncontrolledPopover>
              </InputGroup>

              <br/>

              <InputGroup className="mt-1" id="extremoB">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText >
                      Extremo b
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="extremoB"
                    placeholder="Ingrese el extremo b "
                    
                    onChange={this.handleInput}
                    type="number"
                  />
                  <UncontrolledPopover flip={false} trigger="focus hover" placement="auto" target="extremoB">
                    <PopoverBody>Aquí debes ingresar el extremo b del intervalo. El mismo debe ser >a </PopoverBody>
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
              <CardBody id="resultadosDico">
              <div>
                No se encontro solucion
              </div>

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

export default Dicotomica;