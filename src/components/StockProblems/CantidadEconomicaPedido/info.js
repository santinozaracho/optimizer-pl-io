import React,{useState} from "react";
import {Button, Container, Row, Col, Card, CardText, CardTitle, Jumbotron, Collapse} from "reactstrap";
import {Link} from 'react-router-dom';
import '../index.css'
import MathJax from "react-mathjax"



const Info = () => {
    //DEFINIMOS ESTOS ESTADOS PARA MANEJAR LOS COLLAPSE
    //Para controlar el collapse de Hipotesis
    const [collapseHipotesis, setCollapseHipotesis] = useState(false);
    const [statusHipotesis, setStatusHipotesis] = useState('+');
    const onEnteredHipotesis = () => setStatusHipotesis('-');
    const onExitedHipotesis = () => setStatusHipotesis('+');
    const toggleHipotesis = () => setCollapseHipotesis(!collapseHipotesis);

    //Para controlar el collapse de Formulas
    const [collapseFormulas, setCollapseFormulas] = useState(false);
    const [statusFormulas, setStatusFormulas] = useState('+');
    const onEnteredFormulas = () => setStatusFormulas('-');
    const onExitedFormulas = () => setStatusFormulas('+');
    const toggleFormulas = () => setCollapseFormulas(!collapseFormulas);

    //Para controlar el collapse de Variables
    const [collapseVariables, setCollapseVariables] = useState(false);
    const [statusVariables, setStatusVariables] = useState('+');
    const onEnteredVariables = () => setStatusVariables('-');
    const onExitedVariables = () => setStatusVariables('+');
    const toggleVariables = () => setCollapseVariables(!collapseVariables);

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
                    <Row className="justify-content-center" onClick={toggleHipotesis} style={{cursor:"pointer"}}>
                        <h5><b>Hipotesis {statusHipotesis}</b></h5>
                    </Row>
                    <Collapse isOpen={collapseHipotesis} onEntered={onEnteredHipotesis} onExited={onExitedHipotesis}>
                        <ul className='lista'>
                            <li>No tenemos en cuenta si contamos o no con los recursos financieros</li>
                            <li>No hay inflación</li>
                            <li>No se permiten faltantes</li>
                            <li>Demanda constante y conocida.</li>
                            <li>Resposición instantánea.</li>
                            <li>Costo unitario de almacenamiento por unidad de tiempo h, constante.</li>
                            <li>Costo de preparacion 𝑘, constante.</li>
                            <li>No existen otros costos.</li>
                            <li>Al comienzo de cada periodo no hay stock ni pedidos insatisfechos.</li>
                        </ul>
                    </Collapse>
                </Card>
            </Row>
            <Row style={{marginBottom:10}}>
                <Card body outline color="secondary">
                <Row className="justify-content-center" onClick={toggleFormulas} style={{cursor:"pointer"}}>
                    <h5><b>Formulas {statusFormulas}</b></h5>
                </Row>

                <Collapse isOpen={collapseFormulas} onEntered={onEnteredFormulas} onExited={onExitedFormulas}>   
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
                </Collapse>   
                </Card>
            </Row>
            <Row style={{marginBottom:10}}>
                <Card body outline color="secondary">
                    <Row className="justify-content-center" onClick={toggleVariables} style={{cursor:"pointer"}}>
                        <h5><b>Variables {statusVariables}</b></h5>
                    </Row>

                    <Collapse isOpen={collapseVariables} onEntered={onEnteredVariables} onExited={onExitedVariables}>
                        <ul className='lista'>
                            <li><b>D: </b>Demanda</li>
                            <li><b>K: </b>Costo de preparacion</li>
                            <li><b>h: </b>Costo de almacenamiento</li>
                            <li><b>L: </b>Tiempo de entrega</li>
                            <li><b>t0*: </b>Longitud de ciclo</li>
                            <li><b>y*: </b>Cantidad economica</li>  
                        </ul>
                    </Collapse>
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
export default Info;