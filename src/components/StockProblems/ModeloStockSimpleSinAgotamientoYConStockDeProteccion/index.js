import React from "react";
import { ButtonGroup, Button, Container, Row, Col, Card, CardBody, CardHeader, CardTitle, Jumbotron, Dropdown, DropdownItem, ButtonDropdown, DropdownMenu, DropdownToggle} from "reactstrap";
import {InputGroupText,InputGroup, Input,InputGroupAddon,PopoverBody} from 'reactstrap';
import {Link} from 'react-router-dom';
import '../index.css'


class ModeloStockSimpleSinAgotamientoYConStockDeProteccion extends React.Component{
    constructor (props){
        super(props)
        this.state={
            demanda: null, //D
            CostoDeUnaOrden: null, //K
            CostoUnitarioDeAlmacenamiento: null,//h
            LeadTime:null,//L
            costoDeAdquisicion:null,// b
            StockDeProteccion:null,// c2
            T:1
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
    
    calcularTamañoDelLote(){
        let {demanda, CostoDeUnaOrden,T, CostoUnitarioDeAlmacenamiento} = this.state;
        return (Math.sqrt((2*Number(CostoDeUnaOrden)*Number(demanda))/(Number(CostoUnitarioDeAlmacenamiento)*Number(T)))); //y*
    }
    calcularTamañoDelLoteSinRaiz(){
        let {demanda, T, } = this.state;
        let to = this.calcularIntervaloDeUnCiclo()
        return ((demanda*to)/T); //q
    }
    calcularIntervaloDeUnCiclo()
    {
        let {demanda, CostoDeUnaOrden, CostoUnitarioDeAlmacenamiento,T} = this.state;
        return ((2*CostoDeUnaOrden*T)/(demanda*CostoUnitarioDeAlmacenamiento)); //to
    }
   
    calcularIntervaloDeUnCiclo()
    {
        let {demanda, T} = this.state;
        return ((this.calcularTamañoDelLote()*T)/(demanda)); //to
    }

    calcularCostoTotalEsperado(){
        let {costoDeAdquisicion,demanda,CostoDeUnaOrden,CostoUnitarioDeAlmacenamiento,StockDeProteccion,T} = this.state;
        return((costoDeAdquisicion*demanda)+(Math.sqrt(2*CostoDeUnaOrden*demanda*T*CostoUnitarioDeAlmacenamiento)+StockDeProteccion*CostoUnitarioDeAlmacenamiento*T))//CTEo
    }
    
    calcularCostoTotalEsperadoConQ(){
        let {costoDeAdquisicion,demanda,CostoDeUnaOrden,CostoUnitarioDeAlmacenamiento,StockDeProteccion,T} = this.state;
        let q = this.calcularTamañoDelLote();
        return((costoDeAdquisicion*demanda)+(q*CostoUnitarioDeAlmacenamiento*T)/2+CostoDeUnaOrden/(demanda/q)*StockDeProteccion*CostoUnitarioDeAlmacenamiento*T)//CTEo
    }
 
    calcularStockDeReorden(){
        let {LeadTime,demanda,StockDeProteccion} = this.state;
      return((LeadTime*demanda)+StockDeProteccion)//sp
    }
    

    render() { 
        let {demanda, costoDeAdquisicion, CostoUnitarioDeAlmacenamiento, CostoDeUnaOrden, T,LeadTime,StockDeProteccion} = this.state;
        let intervalo = this.calcularIntervaloDeUnCiclo();
        let inventario = this.calcularTamañoDelLote();
        let costoTotal = this.calcularCostoTotalEsperado();
        let puntoDeReorden = this.calcularStockDeReorden();

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
                        <InputGroup className="mt-1" id={"CostoDeUnaOrden"} key={"CostoDeUnaOrden"}>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText name="CostoDeUnaOrden" id="CostoDeUnaOrden">
                                    {"K"}
                                </InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText name="CostoDeUnaOrden" id="CostoDeUnaOrden">
                                    {"$"}
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"CostoDeUnaOrden"}
                            placeholder="Ingresar el costo de preparacion/producción"
                            aria-label="CostoDeUnaOrden"
                            aria-describedby="CostoDeUnaOrden"
                            onChange={this.handleInputChange}
                            />
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText name="CostoDeUnaOrden" id="CostoDeUnaOrden">
                                    {"x pedido"}
                                </InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-1" id={"CostoUnitarioDeAlmacenamiento"} key={"CostoUnitarioDeAlmacenamiento"}>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText name="CostoUnitarioDeAlmacenamiento" id="CostoUnitarioDeAlmacenamiento">
                                    {"c1"}
                                </InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText name="CostoUnitarioDeAlmacenamiento" id="CostoUnitarioDeAlmacenamiento">
                                    {"$"}
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"CostoUnitarioDeAlmacenamiento"}
                            placeholder="Ingresar el costo de almacenamiento"
                            aria-label="CostoUnitarioDeAlmacenamiento"
                            aria-describedby="CostoUnitarioDeAlmacenamiento"
                            onChange={this.handleInputChange}
                            />
                            
                        <InputGroupAddon addonType="prepend">
                                <InputGroupText name="CostoUnitarioDeAlmacenamiento" id="CostoUnitarioDeAlmacenamiento">
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
                        <InputGroup className="mt-1" id={"LeadTime"} key={"LeadTime"}>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText name="LeadTime" id="LeadTime">
                                {"L"}
                            </InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"LeadTime"}
                            placeholder="Ingresar el tiempo de entrega."
                            aria-label="LeadTime"
                            aria-describedby="LeadTime"
                            onChange={this.handleInputChange}
                            />
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText name="LeadTime" id="LeadTime">
                                    {"x dia"}
                                </InputGroupText>
                            </InputGroupAddon>
                        
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-1" id={"costoDeAdquisicion"} key={"costoDeAdquisicion"}>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText name="costoDeAdquisicion" id="costoDeAdquisicion">
                                {"b"}
                            </InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText name="costoDeAdquisicion" id="costoDeAdquisicion">
                                {"$"}
                            </InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"costoDeAdquisicion"}
                            placeholder="Ingresar el costo del producto."
                            aria-label="costoDeAdquisicion"
                            aria-describedby="costoDeAdquisicion"
                            onChange={this.handleInputChange}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-1" id={"StockDeProteccion"} key={"StockDeProteccion"}>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText name="StockDeProteccion" id="StockDeProteccion">
                                {"sp"}
                            </InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText name="StockDeProteccion" id="StockDeProteccion">
                                {"$"}
                            </InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"StockDeProteccion"}
                            placeholder="Ingresar stock de proteccion."
                            aria-label="StockDeProteccion"
                            aria-describedby="StockDeProteccion"
                            onChange={this.handleInputChange}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <h6>Tu demanda es: {demanda}</h6>
                        <h6>Tu costo de preparacion es: ${CostoDeUnaOrden}</h6>
                        <h6>Tu costo de almacenamiento es: ${CostoUnitarioDeAlmacenamiento}</h6>
                        <h6>El tiempo de entrega es: {this.LeadTime}</h6>
                        <h6>El stock de proteccion es:{StockDeProteccion}</h6>
                        <h4>Cantidad economica de pedido y*= {inventario.toFixed(2)}</h4>
                        <h4>Longitud del ciclo t0*= {intervalo.toFixed(2)}</h4>
                        <h4>El costo de inventario TCU(y) es: {costoTotal.toFixed(2)}</h4>
                        <h4>El punto de reorden es: {puntoDeReorden.toFixed(2)}</h4>
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

export default ModeloStockSimpleSinAgotamientoYConStockDeProteccion;