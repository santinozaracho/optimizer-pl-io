import React from "react";
import { ButtonGroup, Button, Container, Row, Col, Card, CardBody, CardHeader, CardTitle, Jumbotron, Dropdown, DropdownItem, ButtonDropdown, DropdownMenu, DropdownToggle} from "reactstrap";
import {InputGroupText,InputGroup, Input,InputGroupAddon,PopoverBody, CardText, UncontrolledPopover} from 'reactstrap';
import {Link} from 'react-router-dom';
import '../index.css'
import { Variable } from "javascript-lp-solver/src/expressions";
import MathJax from "react-mathjax"



const infoModeloSimpleSinAgotamiento = () => {
    return(
    <Container fluid className="App">
      <Row>
          <h1>HOLA MAJO</h1>
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
                        <li></li>
                        <li></li>
                        <li></li>
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
                        <MathJax.Node formula={"Costo Total De Preparacion = \\frac{D}{q}*K"} />
                    </div>
                </MathJax.Provider>
                <MathJax.Provider>
                    <div>
                        <MathJax.Node formula={"Costo Total Del Producto = bi*D"} />
                    </div>
                </MathJax.Provider>
                <MathJax.Provider>
                    <div>
                        <MathJax.Node formula={"Costo Total De Almacenamiento = \\frac{1}{2}*q*T*Ci"} />
                    </div>
                </MathJax.Provider>
                <MathJax.Provider>
                    <div>
                        <MathJax.Node formula={"Costo Del Dinero Inmovilizado = P*bi"} />
                    </div>
                </MathJax.Provider>
                <MathJax.Provider>
                    <div>
                        <MathJax.Node formula={"Costo Total Esperado = \\frac{D}{q}*K + b*K + \\frac{1}{2}*q*T*Ci + P*bi"} />
                    </div>
                </MathJax.Provider>    
                <MathJax.Provider>
                    <div>
                        <MathJax.Node formula={"q_{0i} = \\sqrt{\\frac{2*K*D}{T*(P*bi*Ci)}}   "} />
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
                        <li><b>c1: </b>Costo de almacenamiento</li>
                        <li><b>P: porcentaje de interés que se produciría con el dinero inmovilizado</b></li>
                        <li><b>C’i: Costo efectivo de almacenamient</b></li>
                        <li><b>bi: Costo  del i-esimoproducto</b></li>
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