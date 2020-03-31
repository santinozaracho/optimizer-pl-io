import React from 'react';
import {Link} from 'react-router-dom';
import { Button, Jumbotron, Container, Row, Col } from "reactstrap";

const LinealProgramming = () =>{
    return(
        <Container fluid className="App">
        <Row className="">
            <Col xs={12} md={6} className="mx-auto my-5">
                <Jumbotron>
                    <Row>
                        <h2 className="mx-auto">¡Bien!, Ahora Seleccione una Modalidad de Trabajo.</h2>
                    </Row>
                    <Row className="mt-3 mx-auto">
                        <Col>
                            <Link to={"/LinealProgramming/InSteps"}>
                                <Button size='lg' outline color="success">Guiado por Pasos</Button>
                            </Link>
                                
                        </Col>
                    </Row>
                    <Row className="mt-3 mx-auto">
                        <Col>
                            <Link to={"/LinealProgramming/SinglePage"} >
                                <Button size='lg' outline color="success">En Unica Pagina</Button>

                            </Link>
                        </Col>
                    </Row>
                </Jumbotron>
            </Col>
        </Row>
    </Container>
  )
};

export default LinealProgramming;