import React from "react";
import {Button, Container, Row, Col, Card,CardTitle, Jumbotron} from "reactstrap";
import {CardText} from 'reactstrap';
import {Link} from 'react-router-dom';
import '../index.css'




const info = () => {
    return(
    <Container fluid className="App">
      <Row>
        <Col xs={12} md={6} className="mx-auto my-5">
          <Jumbotron>
            <Row className="justify-content-center">
                <div>
                    <h2>Modelo Discontinuidad del Precio</h2><br></br>
                </div>
            </Row>
            
            <Row style={{marginBottom:10}}>
                <Card body outline color="secondary" >
                    <Row className="justify-content-center">
                        <h5><b>Hipótesis</b></h5>
                    </Row>
                    <ul className='lista'>
                        <li>Tasa constante de demanda con el surtido instantáneo del pedido y sin faltante</li>
                        <li>Una vez pedido el stock se actualiza automaticamente.</li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </Card>
            </Row>
            <Row style={{marginBottom:10}}>
                <Card body outline color="secondary">
                    <Row className="justify-content-center">
                        <h5><b>Variables</b></h5>
                    </Row>
                    <ul className='lista'>
                        <li><b>D: </b>Demanda</li>
                        <li><b>K: </b>Costo de Preparación</li>
                        <li><b>c1: </b>Costo de Almacenamiento</li>
                        <li><b>b: </b>Costo por Compra por Unidad</li>
                        
                    </ul>
                </Card>
            </Row>
            <Row className="justify-content-left">
                <Card body outline color="secondary">
                    <CardTitle><b>Bibliografía</b></CardTitle>
                    <CardText>TAHA HAMDY A., “Investigación de Operaciones”, EDITORIAL Pearson Prentice Hall, 2004</CardText>
                </Card>
            </Row>
            
            
            <Row className="btn-volver justify-content-center">
                <Link to='/StockProblems'><Button>Volver</Button></Link>
            </Row>
          </Jumbotron>
        </Col>
      </Row>
    </Container>
    )
    };
export default info;