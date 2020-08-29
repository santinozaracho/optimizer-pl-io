import React from "react";
import {Button, Container, Row, Col, Card, CardText, Jumbotron, CardTitle} from "reactstrap";
import {Link} from 'react-router-dom';
import '../index.css'
import MathJax from "react-mathjax"



const infoModeloSimpleSinAgotamiento = () => {
    return(
    <Container fluid className="App">
      <Row>
        <Col xs={12} md={6} className="mx-auto my-5">
          <Jumbotron>
            <Row className="justify-content-center">
                <div>
                    <h2>Demanda constante con agotamiento o simple con escasez</h2>
                </div>
            </Row>
            
            <Row style={{marginBottom:10}}>
                <Card body outline color="secondary" >
                    <Row className="justify-content-center">
                        <h5><b>Hipotesis</b></h5>
                    </Row>
                    <ul className='lista'>
                        <li>Tasa constante de demanda con el surtido instantáneo del pedido y sin faltante</li>
                        <li>Una vez pedido el stock se actualiza automaticamente.</li>
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
                        <MathJax.Node formula={"q_{0i} = \\sqrt{\\frac{2KD}{T(pb_{i}+C_{I}')}}   "} />
                    </div>
                </MathJax.Provider>
                <MathJax.Provider>
                    <div>
                        <MathJax.Node formula={"CTE_{0}(q_{oi} , b_{i}) = \\frac{D}{q}K+b_{i}D+\\frac{1}{2}qT(pb_{i}C_{i}')"} />
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
                        <li><b>p: </b>Porcentaje de Capital Inmobilizado</li>
                        <li><b>T: </b>Tiempo total</li>
                        <li><b>C’i: </b>Costo efectivo de almacenamient</li>
                        <li><b>bi: </b>Costo  del i-esimoproducto</li>
                        <li><b>q: </b>Lote optimo</li>
                    </ul>
                </Card>
            </Row>
            <Row className="justify-content-left">
                <Card body outline color="secondary">
                    <CardTitle><b>Bibliografia</b></CardTitle>
                    <CardText>Claudio L. R. Sturla</CardText>
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
export default infoModeloSimpleSinAgotamiento;