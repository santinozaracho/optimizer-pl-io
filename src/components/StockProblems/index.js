import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import { Button, Jumbotron, Container, Row, Col, UncontrolledTooltip} from "reactstrap";
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
                 <Link to={"/StockProblems/ModeloWilson"} >
                    <UncontrolledTooltip target='button-wilson'>Demanda deterministica constante y reposicion instantanea</UncontrolledTooltip>
                    <Button size='lg' outline color="success" id='button-wilson'>Modelo Wilson - Sturla</Button>
                </Link>
                <Link to={"/StockProblems/ModeloWilson/info.js"} >
                  <UncontrolledTooltip target='info-wilson'>Más Información</UncontrolledTooltip>
                  <BsFillInfoSquareFill id="info-wilson" color='info' style={{color:'#17A2B8', marginLeft:10, fontSize:30}}></BsFillInfoSquareFill>
                </Link>
              </Col>
            </Row>
            <Row className="mt-3 mx-auto">
              <Col>
                <Link to={"/StockProblems/CantidadEconomicaPedido"}>
                  <UncontrolledTooltip target='button-cantidadEconomica'>Demanda deterministica constante y reposicion no instantanea</UncontrolledTooltip>
                  <Button size='lg' outline color="success" id='button-cantidadEconomica'>Cantidad Economica de Pedido - Taha</Button>
                </Link>
                <Link to={"/StockProblems/CantidadEconomicaPedido/info.js"} >
                  <UncontrolledTooltip target='info-cantidadEconomica'>Más Información</UncontrolledTooltip>
                  <BsFillInfoSquareFill id="info-cantidadEconomica" color='info' style={{color:'#17A2B8', marginLeft:10, fontSize:30}}></BsFillInfoSquareFill>
                </Link>
              </Col>
            </Row>
            <Row className="mt-3 mx-auto">
              <Col>
                <Link to={"/StockProblems/ModeloStockProteccion"} >
                    <UncontrolledTooltip target='button-stockProteccion'>Demanda constante con inventario de contingencia</UncontrolledTooltip>
                    <Button size='lg' outline color="success" id='button-stockProteccion'>Modelo con stock de proteccion</Button>
                </Link>
                <Link to={"/StockProblems/ModeloStockProteccion/info.js"} >
                  <UncontrolledTooltip target='info-stockProteccion'>Más Información</UncontrolledTooltip>
                  <BsFillInfoSquareFill id="info-stockProteccion" color='info' style={{color:'#17A2B8', marginLeft:10, fontSize:30}}></BsFillInfoSquareFill>
                </Link>
              </Col>
            </Row>
            <Row className="mt-3 mx-auto">
              <Col>
                <Link to={"/StockProblems/ModeloAgotamientoAdmitido"} >
                  {/*<UncontrolledTooltip target='button-agotamiento'>Demanda constante con inventario de contingencia</UncontrolledTooltip>*/}
                  <Button size='lg' outline color="success" id='button-agotamiento'>Modelo con Agotamiento</Button>
                </Link>
                <Link to={"/StockProblems/ModeloAgotamientoAdmitido/info.js"} >
                  <UncontrolledTooltip target='info-agotamiento'>Más Información</UncontrolledTooltip>
                  <BsFillInfoSquareFill id="info-agotamiento" color='info' style={{color:'#17A2B8', marginLeft:10, fontSize:30}}></BsFillInfoSquareFill>
                </Link>
              </Col>
            </Row>
            <Row className="mt-3 mx-auto">
              <Col>
                <Link to={"/StockProblems/ModeloTriangular"} >
                  <UncontrolledTooltip target='button-triangular'>Reaprovisionamiento no instantaneo</UncontrolledTooltip>
                  <Button id="button-triangular" size='lg' outline color="success">Modelo Triangular</Button>
                </Link>
                <Link to={"/StockProblems/ModeloTriangular/info.js"} >
                  <UncontrolledTooltip target='info-triangular'>Más Información</UncontrolledTooltip>
                  <BsFillInfoSquareFill id="info-triangular" color='info' style={{color:'#17A2B8', marginLeft:10, fontSize:30}}></BsFillInfoSquareFill>
                </Link>
              </Col>
            </Row>
            <Row className="mt-3 mx-auto">
              <Col>
                <Link to={"StockProblems/modeloSimpleSinAgotamiento"} >
                    <Button size='lg' outline color="success">Modelo simple sin Agotamiento [WIP]</Button>
                </Link>
                <Link to={"StockProblems/modeloSimpleSinAgotamiento/info.js"} >
                  <UncontrolledTooltip target='info-wip'>Más Información</UncontrolledTooltip>
                  <BsFillInfoSquareFill id="info-wip" color='info' style={{color:'#17A2B8', marginLeft:10, fontSize:30}}></BsFillInfoSquareFill>
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