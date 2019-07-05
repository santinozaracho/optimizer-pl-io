import React from 'react';
import { Button, Jumbotron, Container, Row, Col, ButtonGroup } from "reactstrap";

const Inicio = () =>{
    return(
        <Container fluid className="App">
        <Row className="">
        <Col xs={12} md={6} className="mx-auto my-5">
            <Jumbotron>
            <Row>
                <h2 className="mx-auto">¡Bienvenido! Seleccione una opción.</h2>
            </Row>
            <Row className="mt-2">
                <Col>
                <a href={"/linealProg"}>
                    <Button color="success">Programación Lineal </Button>
                </a>
                </Col>
                <Col>
                <a href={"/noLinealProg"}>
                    <Button color="success">Programación No Lineal </Button>
                </a>
                </Col>
            </Row>
            <Row className="mt-5">
                <h5>Colaboradores:</h5>
            </Row>
            <Row>
                <ButtonGroup className="mx-auto">
                <Button outline tag="a" href="https://github.com/EdgarCardozo">
                    CE
                </Button>
                <Button outline tag="a" href="https://github.com/juliandiazok">
                    DJ
                </Button>
                <Button outline tag="a" href="https://github.com/egarcia1997">
                    GE
                </Button>
                <Button outline tag="a" href="https://github.com/santisolis97">
                    SS
                </Button>
                <Button outline tag="a" href="https://github.com/ianv97">
                    VI
                </Button>
                <Button outline tag="a" href="https://github.com/santinozaracho">
                    ZS
                </Button>
                </ButtonGroup>
            </Row>
            </Jumbotron>
        </Col>
        </Row>
    </Container>
  )
};

export default Inicio;