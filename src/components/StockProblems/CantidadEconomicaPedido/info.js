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
                        <h5><b>Hipótesis {statusHipotesis}</b></h5>
                    </Row>
                    
                    <Collapse isOpen={collapseHipotesis} onEntered={onEnteredHipotesis} onExited={onExitedHipotesis}>
                        <ul className='lista'>
                            <li>No tenemos en cuenta si contamos o no con los recursos financieros.</li>
                            <li>No se permiten faltantes.</li>
                            <li>Demanda constante y conocida.</li>
                            <li>No considera un stock de reposición instantáneo: puede transcurrir un tiempo de entrega positivo L, 
                                entre que se realiza un pedido y se recibe el mismo.</li>
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
                    <h5><b>Fórmulas {statusFormulas}</b></h5>
                </Row>

                <Collapse isOpen={collapseFormulas} onEntered={onEnteredFormulas} onExited={onExitedFormulas}>   
                    <MathJax.Provider>
                        <div>
                            <MathJax.Node formula={"Cantidad Economica = y* = \\sqrt{\\frac{2*K*D}{h}}"} />
                        </div>
                    </MathJax.Provider>
                    <MathJax.Provider>
                        <div>
                            <MathJax.Node formula={"Tiempo De Ciclo = t0 = \\frac{y}{D}"} />
                        </div>
                    </MathJax.Provider>
                    <MathJax.Provider>
                        <div>
                            <MathJax.Node formula={"n = EnteroMayor<=\\frac{L}{t0}"} />
                        </div>
                    </MathJax.Provider>
                    <MathJax.Provider>
                        <div>
                            <MathJax.Node formula={"Le = L- n t0"} />
                        </div>
                    </MathJax.Provider>
                    <MathJax.Provider>
                        <div>
                            <MathJax.Node formula={"Costo Total Por Unidad De Tiempo = TCU = \\frac{K}{\\frac{y}{D}}+h*\\frac{y}{2}"} />
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
                        <ul className='text-left'>
                            <li><b>D: </b>Tasa de demanda (unidades por unidad de tiempo)</li>
                            <li><b>K: </b>Costo de preparación correspondiente a la colocación de un pedido ($/pedido)</li>
                            <li><b>h: </b>Costo de almacenamiento ($ por unidad en inventario por unidad de tiempo)</li>
                            <li><b>L: </b>Tiempo de Entrega</li>
                            <li><b>Le: </b>Tiempo efectivo de entrega</li>
                            <li><b>t0*: </b>Duración del ciclo de pedido (unidades de tiempo)</li>
                            <li><b>y*: </b>Cantidad económica de pedido (cantidad de unidades)</li>
                            <li><b>TCU: </b>Costo total por unidad de tiempo</li>  
                        </ul>
                        <Row className="text-left" style={{marginLeft:5}}>
                            <p>Para calcular de manera óptima el punto de reorden este modelo plantea utilizar <b>2 políticas:</b></p>
                            <ul>    
                                <li>
                                    <b>Politica 1:</b> Si el tiempo de entrega L es menor que la longitud del ciclo t*0, entonces:
                                    <i> “Pedir y* unidades cada t*0 unidades de tiempo.”</i>
                                </li> <br/>
                                <li>
                                    <b>Politica 2:</b> Si el tiempo de entrega L es mayor que la longitud del ciclo t*0, entonces:
                                    <ul>
                                        <li>Calcular Le.</li>
                                        <li>El punto de reorden será: Le.D (unidades)</li>
                                        <li><i>“Pedir la cantidad y* siempre que la cantidad de inventario baja a LeD unidades.”</i></li>
                                    </ul>    
                                </li>
                            </ul>
                        </Row>
                    </Collapse>
                </Card>
            </Row>
            <Row className="justify-content-left">
                <Card body outline color="secondary">
                    <CardTitle><b>Bibliografía</b></CardTitle>
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