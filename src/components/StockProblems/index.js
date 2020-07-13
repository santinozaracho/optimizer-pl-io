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
                  <Link to={"/StockProblems/cantidadEconomicaPedido"}>
                      <Button size='lg' outline color="success">Cantidad Economica de Pedido - Taha</Button>
                      <Button size='lg' outline color="primary" style={{marginLeft:10}}>+</Button>
                  </Link>
                      
              </Col>
            </Row>
            <Row className="mt-3 mx-auto">
              <Col>
                  <Link to={"/StockProblems/modeloWilson"} >
                      <Button size='lg' outline color="success">Modelo Wilson - Sturla</Button>
                      <Button size='lg' outline color="primary" style={{marginLeft:10}}>+</Button>
                  </Link>
              </Col>
            </Row>
            <Row className="mt-3 mx-auto">
              <Col>
                  <Link to={"/StockProblems/ModelStockDiscontinuidadDePrecio"} >
                      <Button size='lg' outline color="success">Modelo stock discontinuidad del precio</Button>
                      <Button size='lg' outline color="primary" style={{marginLeft:10}}>+</Button>
                  </Link>
              </Col>
            </Row>
            <Row className="mt-3 mx-auto">
              <Col>
                  <Link to={"/StockProblems/ModeloStockSimpleSinAgotamientoYConStockDeProteccion"} >
                      <Button size='lg' outline color="success">Modelo Stock Simple Sin Agotamiento Y Con Stock De Proteccion</Button>
                      <Button size='lg' outline color="primary" style={{marginLeft:10}}>+</Button>
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