import React, {useState} from "react";
import {Button, Container, Row, Col, Card, CardText, Jumbotron, CardTitle, Collapse} from "reactstrap";
import {Link} from 'react-router-dom';
import '../index.css'
import MathJax from "react-mathjax"



const InfoModeloSimpleSinAgotamiento = () => {
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
                    <h2>Demanda constante con agotamiento o simple con escasez</h2>
                </div>
            </Row>
            
            <Row style={{marginBottom:10}}>
                <Card body outline color="secondary" >
                    <Row className="justify-content-center" onClick={toggleHipotesis} style={{cursor:"pointer"}}>
                        <h5><b>Hipótesis {statusHipotesis}</b></h5>
                    </Row>
                    <Collapse isOpen={collapseHipotesis} onEntered={onEnteredHipotesis} onExited={onExitedHipotesis}>
                        <ul className='lista'>
                            <li>Tasa constante de demanda con el surtido instantáneo del pedido y sin faltantes.</li>
                            <li>Una vez pedido el stock, se actualiza automáticamente.</li>
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
                            <MathJax.Node formula={"q_{0i} = \\sqrt{\\frac{2KD}{T(pb_{i}+C_{I}')}}   "} />
                        </div>
                    </MathJax.Provider>
                    <MathJax.Provider>
                        <div>
                            <MathJax.Node formula={"CTE_{0}(q_{oi} , b_{i}) = \\frac{D}{q}K+b_{i}D+\\frac{1}{2}qT(pb_{i}C_{i}')"} />
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
                            <li><b>D: </b>Demanda</li>
                            <li><b>K: </b>Costo de Preparación</li>
                            <li><b>p: </b>Porcentaje de Capital Inmobilizado</li>
                            <li><b>T: </b>Tiempo Total</li>
                            <li><b>C’i: </b>Costo Efectivo de Almacenamiento</li>
                            <li><b>bi: </b>Costo  del i-ésimo Producto</li>
                            <li><b>q: </b>Lote Óptimo</li>
                        </ul>
                    </Collapse>
                </Card>
            </Row>
            <Row className="justify-content-left">
                <Card body outline color="secondary">
                    <CardTitle><b>Bibliografía</b></CardTitle>
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
export default InfoModeloSimpleSinAgotamiento;