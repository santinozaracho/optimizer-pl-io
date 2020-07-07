import React from 'react';
import {Link} from 'react-router-dom';
import { Button, Jumbotron, Container, Row, Col } from "reactstrap";
import './index.css'

const StockProblems = () => {
    return(
    <Container fluid className="App">
      <Row>
        <Col xs={12} md={6} className="mx-auto my-5">
          <Jumbotron>
            <Row className="justify-content-center">
                <div className="text-center">
                    <h2>PROBLEMAS DE INVENTARIO</h2>
                    <h4>¿Qué modelo desea?</h4>
                </div>
            </Row>
            <Row className="mt-3 mx-auto">
              <Col>
                  <Link to={"/LinealProgramming/InSteps"}>
                      <Button size='lg' outline color="success">Modelo simple con agotamiento</Button>
                  </Link>
                      
              </Col>
            </Row>
            <Row className="mt-3 mx-auto">
              <Col>
                  <Link to={"/LinealProgramming/SinglePage"} >
                      <Button size='lg' outline color="success">Modelo con stock de protección</Button>
                  </Link>
              </Col>
            </Row>
            <Row className="mt-3 mx-auto">
              <Col>
                  <Link to={"/LinealProgramming/SinglePage"} >
                      <Button size='lg' outline color="success">Modelo con agotamiento</Button>
                  </Link>
              </Col>
            </Row>
            <Row className="mt-3 mx-auto">
              <Col>
                  <Link to={"/LinealProgramming/SinglePage"} >
                      <Button size='lg' outline color="success">Modelo con producción</Button>
                  </Link>
              </Col>
            </Row>
            <Row className="mt-3 mx-auto">
              <Col>
                  <Link to={"/LinealProgramming/SinglePage"} >
                      <Button size='lg' outline color="success">Modelo por tamaño de lotes</Button>
                  </Link>
              </Col>
            </Row>

            <Row className="btn-volver justify-content-center">
                <Link to='/home'><Button>Volver</Button></Link>
            </Row>
          </Jumbotron>
        </Col>
      </Row>
    </Container>
    )
    };
export default StockProblems;