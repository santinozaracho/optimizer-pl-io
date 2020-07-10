import React from "react";
import { ButtonGroup, Button, Container, Row, Col, Card, CardBody, CardHeader, CardTitle, Jumbotron, Dropdown, DropdownItem, ButtonDropdown, DropdownMenu, DropdownToggle} from "reactstrap";
import {InputGroupText,InputGroup, Input,InputGroupAddon,PopoverBody} from 'reactstrap';
import {Link} from 'react-router-dom';
import '../index.css'


class modelStockSimple extends React.Component{
    constructor (props){
        super(props)
        this.state={
            demanda: null, //D
            costoDePreparacion: null, //K
            costoDeAlmacenamiento: null,//h
            tiempoDeEntrega:null,//L
            precioC1:null,// c1
            precioC2:null,// c2
            limite:null,// q
            punto:null,//Q
            unidadCostoDeAlmacenamiento:1,
            unidadesDemanda:null
        }
    }

     unidadDeTiempo = [
        { label: "Dia", value: 1 },
        { label: "Semana", value: 7 },
        { label: "Mes", value: 31 },
        { label: "Año", value: 365 }
      ];

    handleInputChange = (event) =>{
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    
    calcularInventarioOptimo(){
        let {demanda, costoDePreparacion, costoDeAlmacenamiento, unidadCostoDeAlmacenamiento} = this.state;
        return (Math.sqrt((2*Number(costoDePreparacion)*Number(demanda))/(Number(costoDeAlmacenamiento)*Number(unidadCostoDeAlmacenamiento)))); //y*
    }
    calcularPuntoDeReorden(){
        let {demanda,tiempoDeEntrega} = this.state;
        let duracionCicloDePedido = this.calcularLongitud();//to*
        if(tiempoDeEntrega > duracionCicloDePedido){ //SI L > to*, calculamos Le
        //para politica 1
            
            let n = Math.trunc(tiempoDeEntrega/duracionCicloDePedido);//n
            let tiempoEfectivoDeEntrega= tiempoDeEntrega - (n * duracionCicloDePedido);//Le
            return (tiempoEfectivoDeEntrega * demanda);//punto de reorden
        }else{
            //para politica 2
            return tiempoDeEntrega*demanda;
        }
    }
    calcularLongitud(){
        let {demanda} = this.state;
        let inventario = this.calcularInventarioOptimo();//y*
        return (inventario/Number(demanda)); //to*
    }
    calcularCostoInventarioMenorIgual()
    {
        let {demanda, costoDePreparacion, costoDeAlmacenamiento,unidadCostoDeAlmacenamiento, precioC1} = this.state;
        let y = this.calcularInventarioOptimo();
        let promedioInventario = (y / 2);
        return (demanda*precioC1+(costoDePreparacion*demanda)/y+y*costoDeAlmacenamiento); //TCL(y)
    }
    calcularCostoInventarioMayor()
    {
        let {demanda, costoDePreparacion, costoDeAlmacenamiento,unidadCostoDeAlmacenamiento, precioC2} = this.state;
        let y = this.calcularInventarioOptimo();
        let promedioInventario = (y / 2);
        return (demanda*precioC2+(costoDePreparacion*demanda)/y+y*costoDeAlmacenamiento); //TCL(y)
    }
    calcularCostoInventario(){
        let {limite} = this.state;
        let y = this.calcularInventarioOptimo();//to*
        if(y<=limite)
        {
            return this.calcularCostoInventarioMenorIgual();
        }
        else
        {
            return this.calcularCostoInventarioMayor();
        }
    }
    calularQ()
    {
        let {demanda,costoDeAlmacenamiento, costoDePreparacion, precioC2} = this.state;
        let TCL = this.calcularCostoInventario();
        let a = 1;
        let b = (2*(precioC2*demanda-TCL))/costoDeAlmacenamiento;
        let c = (2*costoDePreparacion*demanda)/costoDeAlmacenamiento
        
        let valor1 = (-b+Math.sqrt(Math.pow(b,2)-4*a*c))/2*a;
        let valor2 = (-b+Math.sqrt(Math.pow(b,2)-4*a*c))/2*a;

        if(valor1> this.calcularInventarioOptimo())
        {
            return valor1;
        }else{
            return valor2;
        }
    }
    tamañoPedido()
    {
        let {limite} = this.state;
        let y = this.calcularInventarioOptimo();
        let Q = this.calularQ();
        if(limite>y & limite<Q)
        {
            return limite;
        }else{
            return y;
        }
    }

    //El orden es el siguiente
    //Calculas y*
    //Despues el punto de reorden
    //Despues pones la politica que te toco (pueden ser 2 proximo commit te subo si queres los metodos que te definan)
    //y por ultimo el costo del inventario
    //si la politica es true entonces la politica es :
    //Pedir {CalcularInventarioOptimo()} unidades cada {CalcularLongitud()} unidades de tiempo
    //sino
    //Pedir la cantidad {CalcularInventarioOptimo()} siempre que la cantidad de inventario baje de {CalcularPuntoDeReorden()} unidades
    render() { 
        let {demanda, costoDePreparacion, costoDeAlmacenamiento, tiempoDeEntrega, precioC1,precioC2,limite} = this.state;
        //let costo = this.calcularCosto();
        let inventario = this.tamañoPedido();
        let longitud = this.calcularLongitud();
        let TCU = this.calcularCostoInventario();
        let puntoDeReorden = this.calcularPuntoDeReorden();

        //AGREGAMOS ESTA FUNCION PARA CONTROLAR QUE DEPENDIENDO DEL TIPO DE POLITICA IMPRIMA UNA COSA O LA OTRA
        let controlarPolitica = a => (tiempoDeEntrega > longitud) ? 
        <h4>Pedir {inventario.toFixed(2)} unidades cuando el inventario baje de {puntoDeReorden.toFixed(2)} unidades</h4> : <h4>Pedir {inventario.toFixed(2)} unidades cada {longitud.toFixed(2)} unidades de tiempo</h4>; 
        
        
        
        return (
            <Container fluid className="App">
            <Row>
              <Col xs={12} md={8} className="my-4 mx-auto">
                <Jumbotron>
                    <Col>
                        <h2>Modelo cantidad económica de pedido con discontinuidades de precio</h2><br></br>                   
                    </Col>
                   
                    <Col> 
                        <InputGroup id={"demanda"} key={"demanda"}>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText name="demanda" id="demanda">
                                    {"D"}
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input
                            className="input-demanda"
                            name={"demanda"}
                            placeholder="Ingresar la demanda"
                            aria-label="Demanda"
                            aria-describedby="demanda"
                            onChange={this.handleInputChange}
                            />
                             <InputGroupAddon addonType="prepend">
                                <InputGroupText name="demanda" id="demanda">
                                    {"Unidades"}
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input
                            className="input-unidadesDemanda"
                            name={"unidadesDemanda"}
                            placeholder="Ingresar las unidades"
                            aria-label="UnidadDemanda"
                            aria-describedby="unidadDemanda"
                            onChange={this.handleInputChange}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-1" id={"costoDePreparacion"} key={"costoDePreparacion"}>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText name="costoDePreparacion" id="costoDePreparacion">
                                    {"K"}
                                </InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText name="costoDePreparacion" id="costoDePreparacion">
                                    {"$"}
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"costoDePreparacion"}
                            placeholder="Ingresar el costo de preparacion/producción"
                            aria-label="costoDePreparacion"
                            aria-describedby="costoDePreparacion"
                            onChange={this.handleInputChange}
                            />
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText name="costoDePreparacion" id="costoDePreparacion">
                                    {"x pedido"}
                                </InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-1" id={"costoDeAlmacenamiento"} key={"costoDeAlmacenamiento"}>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText name="costoDeAlmacenamiento" id="costoDeAlmacenamiento">
                                    {"h"}
                                </InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText name="costoDeAlmacenamiento" id="costoDeAlmacenamiento">
                                    {"$"}
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"costoDeAlmacenamiento"}
                            placeholder="Ingresar el costo de almacenamiento"
                            aria-label="costoDePreparacion"
                            aria-describedby="costoDePreparacion"
                            onChange={this.handleInputChange}
                            />
                            
                        <InputGroupAddon addonType="prepend">
                                <InputGroupText name="costoDeAlmacenamiento" id="costoDeAlmacenamiento">
                                    {"x dia a"}
                                </InputGroupText>
                            </InputGroupAddon>
                        
                        
                        <InputGroupAddon addonType="prepend">
                            <Input type="select" name={"unidadCostoDeAlmacenamiento"} 
                            id="unidadCostoDeAlmacenamiento"
                            onChange={this.handleInputChange}>
                                <option value="1" >Dia</option>
                                <option value="7">Semana</option>
                                <option value="30">Mes</option>
                                <option value="365">Año</option>
                            </Input>
                        </InputGroupAddon>
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-1" id={"tiempoDeEntrega"} key={"tiempoDeEntrega"}>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText name="tiempoDeEntrega" id="tiempoDeEntrega">
                                {"L"}
                            </InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"tiempoDeEntrega"}
                            placeholder="Ingresar el tiempo de entrega."
                            aria-label="tiempoDeEntrega"
                            aria-describedby="tiempoDeEntrega"
                            onChange={this.handleInputChange}
                            />
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText name="costoDeAlmacenamiento" id="costoDeAlmacenamiento">
                                    {"x dia"}
                                </InputGroupText>
                            </InputGroupAddon>
                        
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-1" id={"precioC1"} key={"precioC1"}>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText name="precioC1" id="precioC1">
                                {"c1"}
                            </InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText name="precioC1" id="precioC1">
                                {"$"}
                            </InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"precioC1"}
                            placeholder="Ingresar el precio 1."
                            aria-label="precioC1"
                            aria-describedby="precioC1"
                            onChange={this.handleInputChange}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-1" id={"precioC2"} key={"precioC2"}>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText name="precioC2" id="precioC2">
                                {"c2"}
                            </InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText name="precioC2" id="precioC2">
                                {"$"}
                            </InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"precioC2"}
                            placeholder="Ingresar el precio 2."
                            aria-label="precioC2"
                            aria-describedby="precioC2"
                            onChange={this.handleInputChange}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-1" id={"limite"} key={"limite"}>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText name="limite" id="limite">
                                {"c2"}
                            </InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"limite"}
                            placeholder="Ingresar el limite q."
                            aria-label="limite"
                            aria-describedby="limite"
                            onChange={this.handleInputChange}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <h6>Tu demanda es: {demanda}</h6>
                        <h6>Tu costo de preparacion es: ${costoDePreparacion}</h6>
                        <h6>Tu costo de almacenamiento es: ${costoDeAlmacenamiento}</h6>
                        <h6>El tiempo de entrega es: {this.state.tiempoDeEntrega}</h6>
                        <h4>Cantidad economica de pedido y*= {inventario.toFixed(2)}</h4>
                        <h4>Longitud del ciclo t0*= {longitud.toFixed(2)}</h4>
                        <h4>El costo de inventario TCU(y) es: {TCU.toFixed(2)}</h4>
                        <h4>El punto de reorden es: {puntoDeReorden.toFixed(2)}</h4>
                        {controlarPolitica()}
                    </Col>

                    <Row className="btn-volver justify-content-center">
                        <Link to='./'><Button>Volver</Button></Link>
                        <Button className="btn-Calcular" color="success">Calcular</Button>
                    </Row>
                    <Row>
                        
                    </Row>
                </Jumbotron>
              </Col>
            </Row>
          </Container>
        );
      }



}

export default modelStockSimple;