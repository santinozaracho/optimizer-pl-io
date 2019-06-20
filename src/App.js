import React from 'react';
import { Button,Jumbotron,Container,Row,Col,ButtonGroup} from "reactstrap";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import  LinealProg  from "./components/LinealProg";
import GraphicPresentation from './components/elements/GraphicPresentation';


const LinealProgramacion = () => <LinealProg></LinealProg>;

const NoLinealProgramacion = () =>  <Container fluid className="App">
                                      <Row className="">
                                          <Col xs={12} md={6}  className="mx-auto my-5">
                                            <Jumbotron className=''>
                                              <Row><h2>La PL No-Lineal recien estara disponible en el 2020.</h2></Row>
                                              <Row><Link to={'/'}><Button className='fluid-left'>Volver</Button></Link></Row>
                                            </Jumbotron>       
                                          </Col>                    
                                      </Row>
                                    </Container>;

const Index = () => 
                  <Container fluid className="App">
                    <Row className="">
                        <Col xs={12} md={6}  className="mx-auto my-5">
                          <Jumbotron>
                            <Row><h2 className='mx-auto'>Bienvenido!!!! Seleccione una opcion.</h2></Row>
                            <Row className='mt-2'>
                              <Col><Link to={'/linealProg'}><Button color='success'>Programacion Lineal </Button></Link></Col>
                              <Col><Link to={'/noLinealProg'}><Button color='success'>Programacion No Lineal </Button></Link></Col>
                            </Row>
                            <Row className='mt-3'>
                              <h5>Colaboradores:</h5>
                            </Row>
                            <Row >
                              <ButtonGroup  className='mx-auto'>
                                <Button  outline tag='a' href='https://github.com/EdgarCardozo'>CE</Button>
                                <Button  outline tag='a' href='https://github.com/juliandiazok'>DJ</Button>
                                <Button  outline tag='a' href='https://github.com/santisolis97'>SS</Button>
                                <Button  outline tag='a' href='https://github.com/ianv97'>VI</Button>
                                <Button  outline tag='a' href='https://github.com/santinozaracho'>ZS</Button>
                              </ButtonGroup>
                            </Row>
                          </Jumbotron>       
                        </Col>                    
                    </Row>
                  </Container>;

const App = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
        <Route exact path="/" component={Index} />
        <Route path="/linealProg" component={LinealProgramacion} />
        <Route path="/noLinealProg/" component={NoLinealProgramacion} />
        
    </Router>
  );
}

export default App;
