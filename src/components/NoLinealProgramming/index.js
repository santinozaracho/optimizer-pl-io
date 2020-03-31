import React from 'react';
import {Link} from 'react-router-dom';
import { Button, Jumbotron, Container, Row, Col } from "reactstrap";

const NoLinealProgramming = () => {
    return(
    <Container fluid className="App">
      <Row className="">
        <Col xs={12} md={6} className="mx-auto my-5">
          <Jumbotron className="">
            <Row>
              <h2>La Programación No-Lineal aún no está disponible.</h2>
            </Row>
            <Row>
                <Link to='/home'><Button className="fluid-left">Volver</Button></Link>
            </Row>
          </Jumbotron>
        </Col>
      </Row>
    </Container>
    )
    };
export default NoLinealProgramming;