import React, {useState} from "react";
import {Button, Container, Row, Col, Card,CardTitle, Jumbotron, Collapse} from "reactstrap";
import {CardText} from 'reactstrap';
import {Link} from 'react-router-dom';
import '../index.css'




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
                    <h2>Modelo Discontinuidad del Precio</h2><br></br>
                </div>
            </Row>
            
            <Row style={{marginBottom:10}}>
                <Card body outline color="secondary" >
                <Row className="justify-content-center" onClick={toggleHipotesis} style={{cursor:"pointer"}}>
                        <h5><b>Hipótesis {statusHipotesis}</b></h5>
                    </Row>
                    <Collapse isOpen={collapseHipotesis} onEntered={onEnteredHipotesis} onExited={onExitedHipotesis}>
                        <ul className='lista'>
                            <li>Tasa constante de demanda con el surtido instantáneo del pedido y sin faltante</li>
                            <li>Una vez pedido el stock se actualiza automaticamente.</li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </Collapse>
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
export default Info;