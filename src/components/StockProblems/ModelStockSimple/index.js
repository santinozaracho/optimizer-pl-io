import React from "react";
import { ButtonGroup, Button, Container, Row, Col, Card, CardBody, CardHeader, CardTitle, Jumbotron} from "reactstrap";
import {Link} from 'react-router-dom';


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
        this.calcularCosto();
    }
    
    calcularCosto(){
        let {demanda, costoDePreparacion, costoDeAlmacenamiento} = this.state;
        return Number(costoDePreparacion) + Number(costoDeAlmacenamiento);
    }

    calcularInventarioOptimo(){
        let {demanda, costoDePreparacion, costoDeAlmacenamiento} = this.state;
        return (Math.sqrt((2*Number(costoDePreparacion)*Number(demanda))/(Number(costoDeAlmacenamiento)))); 
    }

    calcularLongitud(){
        let {demanda, costoDePreparacion, costoDeAlmacenamiento} = this.state;
        let inventario = this.calcularInventarioOptimo();
        return (inventario/Number(demanda)); 
    }
    

    render() { 
        let {demanda, costoDePreparacion, costoDeAlmacenamiento} = this.state;
        let costo = this.calcularCosto();
        let inventario = this.calcularInventarioOptimo();
        let longitud = this.calcularLongitud();
        
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
                                <p><input type="text" placeholder="Ingresar costo de preparacion" name="costoDePreparacion" onChange={this.handleInputChange}></input></p>
                                <p><input type="text" placeholder="Ingresar costo de almacenamiento" name="costoDeAlmacenamiento" onChange={this.handleInputChange}></input></p>
                            </form>
                        </div>              
                    </Col>

                    <Col>
                        <h6>Tu demanda es: {demanda}</h6>
                        <h6>Tu costo de preparacion es: ${costoDePreparacion}</h6>
                        <h6>Tu costo de almacenamiento es: ${costoDeAlmacenamiento}</h6>
                        <h4>El costo total es de: ${costo}</h4>
                        <h4>Cantidad economica de pedido y*= {inventario}</h4>
                        <h4>Longitud del ciclo t0*= {longitud}</h4>
                    </Col>

                    <Row className="btn-volver justify-content-center">
                        <Button href="#" color="primary">Calcular</Button>
                    </Row>
                    <Row>
                        <Link to='./'><Button>Volver</Button></Link>
                    </Row>
                </Jumbotron>
              </Col>
            </Row>
          </Container>
        );
      }



}

export default modelStockSimple;