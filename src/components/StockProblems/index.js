import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import { Button, Jumbotron, Container, Row, Col, Tooltip, tolltipOpen} from "reactstrap";
import './index.css'

import {BsFillInfoSquareFill} from "react-icons/bs"



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
                <Link to={"/StockProblems/CantidadEconomicaPedido"}>
                    <Button size='lg' outline color="success">Cantidad Economica de Pedido - Taha</Button>
                </Link>
                <Link to={"/StockProblems/CantidadEconomicaPedido/info.js"} >
                  <BsFillInfoSquareFill color='info' style={{color:'#17A2B8', marginLeft:10, fontSize:30}}></BsFillInfoSquareFill>
                </Link>
              </Col>
            </Row>
            <Row className="mt-3 mx-auto">
              <Col>
                 <Link to={"/StockProblems/ModeloWilson"} >
                    <Button size='lg' outline color="success">Modelo Wilson - Sturla</Button>
                </Link>
                <Link to={"/StockProblems/ModeloWilson/info.js"} >
                  <BsFillInfoSquareFill color='info' style={{color:'#17A2B8', marginLeft:10, fontSize:30}}></BsFillInfoSquareFill>
                </Link>
              </Col>
            </Row>
            <Row className="mt-3 mx-auto">
              <Col>
                <Link to={"/StockProblems/ModeloStockProteccion"} >
                      <Button size='lg' outline color="success">Modelo con stock de proteccion</Button>
                </Link>
                <Link to={"/StockProblems/ModeloStockProteccion/info.js"} >
                  <BsFillInfoSquareFill color='info' style={{color:'#17A2B8', marginLeft:10, fontSize:30}}></BsFillInfoSquareFill>
                </Link>
              </Col>
            </Row>
            <Row className="mt-3 mx-auto">
              <Col>
                <Link to={"/StockProblems/ModeloAgotamientoAdmitido"} >
                    <Button size='lg' outline color="success">Modelo con Agotamiento</Button>
                </Link>
                <Link to={"/StockProblems/ModeloAgotamientoAdmitido/info.js"} >
                  <BsFillInfoSquareFill color='info' style={{color:'#17A2B8', marginLeft:10, fontSize:30}}></BsFillInfoSquareFill>
                </Link>
              </Col>
            </Row>
            <Row className="mt-3 mx-auto">
              <Col>
                <Link to={"/StockProblems/ModeloTriangular"} >
                    <Button size='lg' outline color="success">Modelo Triangular</Button>
                </Link>
                <Link to={"/StockProblems/ModeloTriangular/info.js"} >
                  <BsFillInfoSquareFill color='info' style={{color:'#17A2B8', marginLeft:10, fontSize:30}}></BsFillInfoSquareFill>
                </Link>
              </Col>
            </Row>
            {/*<Row className="mt-3 mx-auto">
              <Col>
                <Link to={"/StockProblems/ModelStockDiscontinuidadDePrecio"} >
                    <Button size='lg' outline color="success">Modelo stock discontinuidad del precio</Button>
                </Link>
                <Link to={"/StockProblems/ModelStockDiscontinuidadDePrecio/info.js"}>
                  <BsFillInfoSquareFill color='info' style={{color:'#17A2B8', marginLeft:10, fontSize:30}}></BsFillInfoSquareFill>
                </Link>
              </Col>
            </Row>*/}
            <Row className="mt-3 mx-auto">
              <Col>
                <Link to={"StockProblems/modeloSimpleSinAgotamiento"} >
                    <Button size='lg' outline color="success">Modelo simple sin Agotamiento [WIP]</Button>
                </Link>
                <Link to={"StockProblems/modeloSimpleSinAgotamiento/info.js"} >
                    <BsFillInfoSquareFill color='info' style={{color:'#17A2B8', marginLeft:10, fontSize:30}}></BsFillInfoSquareFill>
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