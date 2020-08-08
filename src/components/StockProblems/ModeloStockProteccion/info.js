import React from "react";
import { ButtonGroup, Button, Container, Row, Col, Card, CardBody, CardHeader, CardTitle, Jumbotron, Dropdown, DropdownItem, ButtonDropdown, DropdownMenu, DropdownToggle} from "reactstrap";
import {InputGroupText,InputGroup, Input,InputGroupAddon,PopoverBody, CardText, UncontrolledPopover} from 'reactstrap';
import {Link} from 'react-router-dom';
import '../index.css'
import { Variable } from "javascript-lp-solver/src/expressions";
import MathJax from "react-mathjax"



const info = () => {
    return(
    <Container fluid className="App">
      <Row>
        <Col xs={12} md={6} className="mx-auto my-5">
          <Jumbotron>
            <Row className="justify-content-center">
                <div>
                    <h2>Demanda Constante con inventario de contingencia</h2>
                    <h5>Modelo con stock de proteccion</h5><br></br>
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
                        <li>Costo unitario de almacenamiento por unidad de tiempo 𝑐1, constante.</li>
                        <li>Costo de preparacion 𝑘, constante.</li>
                        <li>Costo unitario de producto 𝑏, constante.</li>
                        <li>No existen otros costos.</li>
                        <li>No existen restricciones.</li>
                        <li>Se mantiene almacenada una cantidad 𝑆𝑝 en forma permanente.</li>
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
                        <MathJax.Node formula={"Costo Total De Preparacion = \\frac{D}{q}*K"} />
                    </div>
                </MathJax.Provider>
                <MathJax.Provider>
                    <div>
                        <MathJax.Node formula={"Costo Total Del Producto = b*D"} />
                    </div>
                </MathJax.Provider>
                <MathJax.Provider>
                    <div>
                        <MathJax.Node formula={"Costo Total De Almacenamiento = \\frac{1}{2}*q*T*c1"} />
                    </div>
                </MathJax.Provider>
                <MathJax.Provider>
                    <div>
                        <MathJax.Node formula={"Costo De Adquisición de Sp = sp*b"} />
                    </div>
                </MathJax.Provider>
                <MathJax.Provider>
                    <div>
                        <MathJax.Node formula={"Costo De Mantenimiento de sp = sp*T*c1"} />
                    </div>
                </MathJax.Provider>
                <MathJax.Provider>
                    <div>
                        <MathJax.Node formula={"Costo Total Esperado = \\frac{D}{q}*K + b*D + \\frac{1}{2}*q*T*c1 +sp*b +sp*T*c1"} />
                    </div>
                </MathJax.Provider>    
                <MathJax.Provider>
                    <div>
                        <MathJax.Node formula={"Costo Total Esperado Optimo =  b*D + \\sqrt{2*T*D*K*c1} +sp*b +sp*T*c1 "} />
                    </div>
                </MathJax.Provider>    
                <MathJax.Provider>
                    <div>
                        <MathJax.Node formula={"q_{0} = \\sqrt{\\frac{2*K*D}{T*c1}} "} />
                    </div>
                </MathJax.Provider>    
                <MathJax.Provider>
                    <div>
                        <MathJax.Node formula={"To = \\frac{T}{n_{0}} = \\frac{T*q_{0}}{D} = \\sqrt{\\frac{2*K*T}{D*c1}} "} />
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
                        <li><b>b: </b>Costo unitario de producto</li>
                        <li><b>sp: </b>Stock de protección</li>
                        <li><b>T: </b>Tiempo Total</li>
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
export default info;