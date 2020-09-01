import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Jumbotron,
  Container,
  Row,
  Col,
  ButtonGroup,
  UncontrolledTooltip,
} from 'reactstrap';

const Inicio = () => {
  return (
    <Container fluid className='App'>
      <Row className=''>
        <Col xs={12} md={6} className='mx-auto my-5'>
          <Jumbotron>
            <Row>
              <h2 className='mx-auto'>¡Bienvenido! Seleccione una opción.</h2>
            </Row>
            <Row className='mt-3 mx-auto'>
              <Col>
                <Link to={'/LinealProgramming'}>
                  <Button size='lg' outline color='success'>
                    Programación Lineal{' '}
                  </Button>
                </Link>
              </Col>
            </Row>

            <Row className='mt-3 mx-auto'>
              <Col>
                <Link to={'/NoLinealProgramming'}>
                  <Button size='lg' outline color='success'>
                    Programación No Lineal{' '}
                  </Button>
                </Link>
              </Col>
            </Row>

            <Row className='mt-3 mx-auto'>
              <Col>
                <Link to={'/StockProblems'}>
                  <Button size='lg' outline color='success'>
                    Problemas de Inventario
                  </Button>
                </Link>
              </Col>
            </Row>

            <Row className='mt-5'>
              <h5>Colaboradores P. Lineal:</h5>
            </Row>
            <Row>
              <ButtonGroup className='mx-auto'>
                <UncontrolledTooltip target='btnce'>
                  Cardozo, Edgar
                </UncontrolledTooltip>
                <Button
                  id='btnce'
                  outline
                  tag='a'
                  href='https://github.com/EdgarCardozo'
                >
                  CE
                </Button>
                <UncontrolledTooltip target='btndj'>
                  Diaz, Julian
                </UncontrolledTooltip>
                <Button
                  id='btndj'
                  outline
                  tag='a'
                  href='https://github.com/juliandiazok'
                >
                  DJ
                </Button>
                <UncontrolledTooltip target='btnge'>
                  Garcia, Emmanuel
                </UncontrolledTooltip>
                <Button
                  id='btnge'
                  outline
                  tag='a'
                  href='https://github.com/egarcia1997'
                >
                  GE
                </Button>
                <UncontrolledTooltip target='btnss'>
                  Solis, Santiago
                </UncontrolledTooltip>
                <Button
                  id='btnss'
                  outline
                  tag='a'
                  href='https://github.com/santisolis97'
                >
                  SS
                </Button>
                <UncontrolledTooltip target='btnvi'>
                  Vaernet, Ian
                </UncontrolledTooltip>
                <Button
                  id='btnvi'
                  outline
                  tag='a'
                  href='https://github.com/ianv97'
                >
                  VI
                </Button>
                <UncontrolledTooltip target='btnzs'>
                  Zaracho Simonetto, Carlos Santino
                </UncontrolledTooltip>
                <Button
                  id='btnzs'
                  outline
                  tag='a'
                  href='https://github.com/santinozaracho'
                >
                  ZS
                </Button>
              </ButtonGroup>
            </Row>

            <Row className='mt-5'>
              <h5>Colaboradores P. Inventario:</h5>
            </Row>
            <Row>
              <ButtonGroup className='mx-auto'>
                <UncontrolledTooltip target='btnNicolas'>
                  Alegre, Nicolas
                </UncontrolledTooltip>
                <Button
                  id='btnNicolas'
                  outline
                  tag='a'
                  href='https://github.com/nicmalegre'
                >
                  AN
                </Button>
                <UncontrolledTooltip target='btnCarlos'>
                  Lopez, Soto Carlos
                </UncontrolledTooltip>
                <Button
                  id='btnCarlos'
                  outline
                  tag='a'
                  href='https://github.com/Carloslopezsoto'
                >
                  CLS
                </Button>
                <UncontrolledTooltip target='btnJoaquin'>
                  Albarenga, Joaquin
                </UncontrolledTooltip>
                <Button
                  id='btnJoaquin'
                  outline
                  tag='a'
                  href='https://github.com/Joalbarenga'
                >
                  AJ
                </Button>
                <UncontrolledTooltip target='btnRodrigo'>
                  Cuevas, Rodrigo
                </UncontrolledTooltip>
                <Button id='btnRodrigo' outline tag='a' href=''>
                  CR
                </Button>
                <UncontrolledTooltip target='btnMatias'>
                  Saravia, Matias
                </UncontrolledTooltip>
                <Button
                  id='btnMatias'
                  outline
                  tag='a'
                  href='https://github.com/matiasaravia52'
                >
                  SM
                </Button>
                <UncontrolledTooltip target='btnMajo'>
                  Lind, Maria Jose
                </UncontrolledTooltip>
                <Button
                  id='btnMajo'
                  outline
                  tag='a'
                  href='https://github.com/MariaJoseLind'
                >
                  LMJ
                </Button>
              </ButtonGroup>
            </Row>
            <Row className='mt-3'>
              <Col>
                <Button
                  href='https://github.com/santinozaracho/optimizer-pl-io/issues'
                  outline
                >
                  <img
                    height='25px'
                    src='https://img.icons8.com/ios-filled/50/000000/github.png'
                  />
                  Report Issues
                </Button>
              </Col>
              <Col>
                <Button href='mailto:carlosszaracho@gmail.com' outline>
                  Contact Us
                </Button>
              </Col>
            </Row>
          </Jumbotron>
        </Col>
      </Row>
    </Container>
  );
};

export default Inicio;
