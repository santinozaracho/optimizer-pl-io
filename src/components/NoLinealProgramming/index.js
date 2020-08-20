import React from 'react';
import {Link} from 'react-router-dom';
import { Button, Jumbotron, Container, Row, Col } from "reactstrap";

import logo from "../LinealProgramming/logo.svg";
class NoLinealProgramming extends React.Component {


  render() {
    
    
    return (
      <Container fluid className="App">
        
        <Row className="">
          <Col xs={12} md={6} className="mx-auto">
            <img src={logo} className="App-logo" alt="logo" height="200" />
          </Col>
        </Row>
        <Row>
          
          <Col xs={12} md={6} className="my-4 mx-auto ">
            <Row>
                <Jumbotron className='w-100'>
                <h2><b>Programacion No lineal</b></h2>
                <br/>
                <h4>Seleccione un metodo de resolucion</h4>
                <h5>Se recomienda no cargar problemas de Programación Lineal en esta sección</h5>
                <Row className="mt-3 mx-auto">
                        <Col>
                            <Link to={"/NoLinealProgramming/Gradiente"}>
                                <Button size='lg' outline color="success">Metodo del gradiente</Button>
                            </Link>
                                
                        </Col>
                    </Row>
                    <Row className="mt-3 mx-auto">
                        <Col>
                            <Link to={"/NoLinealProgramming/Dicotomica"} >
                                <Button size='lg' outline color="success">Busqueda Dicotomica</Button>

                            </Link>
                        </Col>
                    </Row> 
                    <Row className="mt-3 mx-auto">
                        <Col>
                            <Link to={"/NoLinealProgramming/Derivadas"} >
                                <Button size='lg' outline color="success">Metodo de las derivadas</Button>

                            </Link>
                        </Col>
                    </Row>  
                    <Row className="mt-3 mx-auto">
                        <Col>
                            <Link to={"/NoLinealProgramming/Lagrange"} >
                                <Button size='lg' outline color="success">Metodo de Lagrange</Button>

                            </Link>
                        </Col>
                    </Row> 
                    <Row className="mt-3 mx-auto">
                        <Col>
                            <Link to={"/NoLinealProgramming/Aurea"} >
                                <Button size='lg' outline color="success">Metodo Seccion dorada</Button>

                            </Link>
                        </Col>
                    </Row>
                    
                </Jumbotron>  
            </Row>

            
            
          
          </Col>
        </Row>
        
      </Container>
    );
  }
}
export default NoLinealProgramming;