import React from 'react';
import {  Button, Container, Row, Col, Card, CardBody, CardHeader, CardTitle, Jumbotron } from "reactstrap";
import {UncontrolledPopover, PopoverBody, PopoverHeader, Input,InputGroupText,InputGroup,InputGroupAddon, } from "reactstrap";
import ReactDOM from 'react-dom'
import logo from "../../components/LinealProgramming/logo.svg";
const {metodoDerivadas} = require("../NoLinealProgramming/Methods/pruebaDerivadas/getDerivadas")
class Derivadas extends React.Component{
    constructor(props){
        super(props)
        this.state={
            model:{
                funcion:"",
                incognitas:"",
                
            },
            solucionMetodo:{
              caso:""
            }
            
        }
    }

    
      handleInput = e =>{
        let nombre = e.target.name;
        let valor = e.target.value;
      
        
        let { model } = this.state;
        model[nombre] = valor;
        this.setState({model})
    
        
        
    
      }



    resolucionModelo(){
      let {incognitas, funcion} = this.state.model;
      let arregloIncognitas = [];
      if (funcion!==""){
        if(incognitas!==""){
          arregloIncognitas=incognitas.split(",")
          for (var i = 0; i < arregloIncognitas.length; i++) {
            arregloIncognitas[i] = arregloIncognitas[i].trim()
             }
          
          
          try {
            metodoDerivadas(funcion, arregloIncognitas)
            .then(resp => {
              if(resp!==undefined){
                if(resp.hasOwnProperty("caso")){
                  this.setState({solucionMetodo:resp})
              }}
          
              this.muestraResultado();
            }
            )
          } catch (error) {
            console.log(error)
            
            this.state.solucionMetodo.caso=""
            ReactDOM.render(<></>, document.getElementById("resolucion"))
          } 

        }
      }
    }


    
    
    muestraResultado(){
      let {solucionMetodo} = this.state
      let caso = solucionMetodo.caso
      let resolucion;
      if (caso ===""){
        
        ReactDOM.render(<></>, document.getElementById("resolucion"))
      }
      else if(caso === "metodonovalido"){
        //Metodo no concluye nada
        resolucion = (
        <div> 
        El metodo no es suficiente para concluir algo.
        </div>)
        ReactDOM.render(resolucion, document.getElementById("resolucion"))
      }
      else if(caso === "puntosilla"){
        //Punto de ensilladura
        resolucion = (
          <div> 
          La funcion presenta un punto de ensilladura.
          </div>)
          ReactDOM.render(resolucion, document.getElementById("resolucion"))
      }
      else if(caso === "nonegatividadinvalido"){
        //Condicion de no negatividad incumplida
        resolucion = (
          <div> 
          No cumple la condicion de no negatividad.<br/>
          No se puede determinar por este metodo
          </div>)
          ReactDOM.render(resolucion, document.getElementById("resolucion"))
      }
      else{
        //Resolucion
        let {caso, ptofactible, funcionvaluada} = solucionMetodo
        
        caso = caso.charAt(0).toUpperCase() + caso.slice(1)


        resolucion=(
          <div>
            <b>Caso</b>: {caso}
            {
              ptofactible.map((elem,index)=><div>
                <b>X{index+1}</b> : {elem.toFixed(2)}


              </div>)
            }
            <b>Funcion valuada en el punto:</b> {funcionvaluada.toFixed(4)}
          </div>
        )
        
        ReactDOM.render(resolucion, document.getElementById("resolucion"))
      }
    }

    render(){
      
    
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
                  <InputGroup className="mt-1" id="incognitas">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText >
                          <b>Incognitas</b>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        name="incognitas"
                        placeholder="x1,x2,...,xn"
                        
                        onChange={this.handleInput}
                        
                      />
                      <UncontrolledPopover flip={false} trigger="focus hover" placement="auto" target="incognitas">
                        <PopoverBody>Aquí debes ingresar las incognitas que se encuentren en la funcion separadas por coma.</PopoverBody>
                      </UncontrolledPopover>
                  </InputGroup>
    
    
                  </CardBody>
                  
                </Card>
                
                
               
              </Row>
              <br/>
              <Button
                
                
                outline
                onClick={() => this.resolucionModelo()}
                
                color="success"
              >
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

export default Derivadas;