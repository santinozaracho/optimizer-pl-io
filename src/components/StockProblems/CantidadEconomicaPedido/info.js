import React from "react";
import {Button, Container, Row, Col, Card, CardText, CardTitle, Jumbotron} from "reactstrap";
import {Link} from 'react-router-dom';
import '../index.css'
import MathJax from "react-mathjax"



const info = () => {
    return(
    <Container fluid className="App">
      <Row>
        <Col xs={12} md={6} className="mx-auto my-5">
          <Jumbotron>
            <Row className="justify-content-center">
                <div>
                    <h2>Modelo cantidad economica de pedido</h2><br></br>
                </div>
            </Row>
            
            <Row style={{marginBottom:10}}>
                <Card body outline color="secondary" >
                    <Row className="justify-content-center">
                        <h5><b>Hipotesis</b></h5>
                    </Row>
                    <ul className='lista'>
                        <li>No tenemos en cuenta si contamos o no con los recursos financieros</li>
                        <li>No hay inflasión</li>
                        <li>No se permiten faltantes</li>
                        <li>Demanda constante y conocida.</li>
                        <li>Resposición instantánea.</li>
                        <li>Costo unitario de almacenamiento por unidad de tiempo h, constante.</li>
                        <li>Costo de preparacion 𝑘, constante.</li>
                        <li>No existen otros costos.</li>
                        <li>Al comienzo de cada periodo no hay stock ni pedidos insatisfechos.</li>
                    </ul>
                </Card>
            </Row>
            <Row style={{marginBottom:10}}>
                <Card body outline color="secondary">
                <Row className="justify-content-center">
                        <h5><b>Formulas</b></h5>
                </Row>
                        
                <MathJax.Provider>
                    <div>
                        <MathJax.Node formula={"Tiempo De Ciclo = \\frac{y}{D}"} />
                    </div>
                </MathJax.Provider>
                <MathJax.Provider>
                    <div>
                        <MathJax.Node formula={"Costo De Preparacion = \\frac{K}{\\frac{y}{D}}"} />
                    </div>
                </MathJax.Provider>
                <MathJax.Provider>
                    <div>
                        <MathJax.Node formula={"Costo Total De Almacenamiento = h*\\frac{y}{2}"} />
                    </div>
                </MathJax.Provider>
                <MathJax.Provider>
                    <div>
                        <MathJax.Node formula={"Costo Total Por Unidad De Tiempo = \\frac{K}{\\frac{y}{D}}+h*\\frac{y}{2}"} />
                    </div>
                </MathJax.Provider>
                <MathJax.Provider>
                    <div>
                        <MathJax.Node formula={"y* = \\sqrt{\\frac{2*K*D}{h}}"} />
                    </div>
                </MathJax.Provider>    
                </Card>
            </Row>
            <Row style={{marginBottom:10}}>
                <Card body outline color="secondary">
                    <Row className="justify-content-center">
                        <h5><b>Variables</b></h5>
                    </Row>
                    <ul className='lista'>
                        <li><b>D: </b>Demanda</li>
                        <li><b>K: </b>Costo de preparacion</li>
                        <li><b>h: </b>Costo de almacenamiento</li>
                        <li><b>L: </b>Tiempo de entrega</li>
                        <li><b>t0*: </b>Longitud de ciclo</li>
                        <li><b>y*: </b>Cantidad economica</li>  
                    </ul>
                </Card>
            </Row>
            <Row className="justify-content-left">
                <Card body outline color="secondary">
                    <CardTitle><b>Bibliografia</b></CardTitle>
                    <CardText>TAHA HAMDY A., “Investigación de Operaciones”, EDITORIAL Pearson Prentice Hall, 2004 </CardText>
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