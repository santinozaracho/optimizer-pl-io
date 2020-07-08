import React from "react";
import { ButtonGroup, Button, Container, Row, Col, Card, CardBody, CardHeader, CardTitle, Jumbotron } from "reactstrap";
import {InputGroupText,InputGroup, Input,InputGroupAddon,PopoverBody} from 'reactstrap';
import { Alert, UncontrolledPopover, PopoverHeader } from "reactstrap";
import ReactWizard from "react-bootstrap-wizard";


class modelStockSimple extends React.Component{
    constructor (props){
        super(props)
        this.state={
            demanda: null, //D
            costoDePreparacion: null, //K
            costoDeAlmacenamiento: null//h
        }
    }

    handleInputChange = (event) =>{
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    
    render() { 
        let {demanda} = this.state;
        return (
            <Container fluid className="App">
            <Row>
              <Col xs={12} md={8} className="my-4 mx-auto">
                <Jumbotron>
                    <Col>
                        <h1>Cargar el modelo</h1>                   
                    </Col>

                    <Col>
                        <div>
                            <form>
                                <p><input type="text" placeholder="Ingresar demanda" name="demanda" onChange={this.handleInputChange}></input></p>
                            </form>
                        </div>              
                    </Col>

                    <Col>
                        <h3>Tu demanda es: {demanda}</h3>
                    </Col>

                </Jumbotron>
              </Col>
            </Row>
          </Container>
        );
      }



}

export default modelStockSimple;