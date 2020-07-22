import React from "react";
import { ButtonGroup, Button, Container, Row, Col, Card, CardBody, CardHeader, CardTitle, Jumbotron, Dropdown, DropdownItem, ButtonDropdown, DropdownMenu, DropdownToggle} from "reactstrap";
import {InputGroupText,InputGroup, Input,InputGroupAddon,PopoverBody, CardText} from 'reactstrap';
import {Link} from 'react-router-dom';
import '../index.css'
import { Variable } from "javascript-lp-solver/src/expressions";



class ModeloSimpleSinAgotamiento extends React.Component{
    constructor (props){
        super(props)
        this.state={
            demanda: 0, //D
            CostoDeUnaOrden: 0, //K
            costoDeAlmacenamiento: 0,//c1
            costoDeAdquisicion: 0, //b en este caso son varios pero empezamos con 1 (por las restricciones)
            StockDeProteccion:0,// c2
            unidadesAlmacenamiento: 0,
            unidadesDemanda:0,
            loteOptimo:0, //q
            tiempoEntrePedidos: 0, //t0
            T:0,
            incompleto: false,
            mostrarResultados: false, // bandera para cuando tener disponible los resultados y mostrar el mensaje de abajo
            inputUpdated: false,
            CTE: 0,
            stockAlmacenado:0,
            porcentajeCapitalInmobilizado:0 //p
        }
    }

    componentDidUpdate(prevProps, prevState){ //Para comparar mi estado actual con el estado anterior. Verificamos si se actualizo algun campo de los input.
        if(this.state.inputUpdated){
            this.setState({inputUpdated:false})
            this.controlarCambio();
            
        } 
    }

    handleInputChange = (event) =>{
        this.setState({
            [event.target.name]: event.target.value,
            inputUpdated: true,
        })
    }

    //SI HUBO CAMBIOS QUE DESAPAREZCA LA VENTANA QUE MUESTRA LOS RESULTADOS
    controlarCambio = () => { 
        this.setState({mostrarResultados:false})
    }
    

    //q0
    calcularTamañoDelLote(){
        let {demanda, CostoDeUnaOrden,T, CostoUnitarioDeAlmacenamiento, porcentajeCapitalInmobilizado, costoDeAdquisicion, costoDeAlmacenamiento} = this.state;
        let loteOptimo
        console.log(costoDeAlmacenamiento, "costo de almacenamiento")
        CostoUnitarioDeAlmacenamiento = ((Number(porcentajeCapitalInmobilizado)*Number(costoDeAdquisicion))+Number(costoDeAlmacenamiento))*T
        console.log(CostoUnitarioDeAlmacenamiento, "costo de almacenamiento unitario")
        loteOptimo = (Math.sqrt((2*Number(CostoDeUnaOrden)*Number(demanda))/(Number(CostoUnitarioDeAlmacenamiento))));
        
        // if (loteOptimo>demanda){ //Si el q0 calculado es mas grande que la demanda entonces como lote optimo va la demanda
        //     this.setState({loteOptimo: demanda})
        // }else{
            this.setState({loteOptimo})
        //}
    }
    
    //CALCULAR CTE
    calcularCostoTotalEsperado(){
        let {costoDeAdquisicion,demanda,CostoDeUnaOrden,costoDeAlmacenamiento,T, loteOptimo, porcentajeCapitalInmobilizado} = this.state;
        let pp, sp, tp
        console.log(loteOptimo)
        pp = ((Number(demanda)/Number(loteOptimo))*Number(CostoDeUnaOrden));
        console.log(pp)
        sp = (Number(costoDeAdquisicion)*Number(demanda))
        console.log(sp)
        tp = ( (1/2)*loteOptimo*T*(porcentajeCapitalInmobilizado*costoDeAdquisicion*costoDeAlmacenamiento))
        console.log(tp)
        this.setState({CTE: (pp + sp + tp) }) //CTEo
    }
    
    mostrarResultados = () => {
        let {demanda, costoDeAdquisicion, costoDeAlmacenamiento, CostoDeUnaOrden} = this.state;
        let combinacion1 = [demanda,CostoDeUnaOrden,costoDeAlmacenamiento,costoDeAdquisicion] //Cargamos un arreglo
        let control1 = combinacion1.every(caso => caso); //Si devuelve true es porque todos los elementos del arreglo estan cargados 
        
        if (control1){ //SI TODOS LOS CAMPOS ESTAN CARGADOS ENTONCES CALCULO TODO Y MUESTRO

            this.calcularTamañoDelLote(); //Calculo q0
            setTimeout(() => {this.calcularCostoTotalEsperado()},1)
            this.setState({mostrarResultados: true})
            this.setState({incompleto: false})

        }else{
            this.setState({incompleto:true}) //PONGO A INCOMPLETO EN TRUE Y MUESTRO LA ALERTA DE COMPLETAR CAMPOS
        }
                      
    }

    render() { 
        let {CTE,loteOptimo,tiempoEntrePedidos, incompleto,mostrarResultados,unidadesDemanda,unidadesAlmacenamiento} = this.state;
               
        return (
            <Container fluid className="App"> 
            <Row>
              <Col xs={12} md={8} className="my-4 mx-auto">
                <Jumbotron>
                    <Col>
                        <h2>Modelo Simple Sin Agotamiento</h2><br></br>                   
                    </Col>
                    
                    <Col> 
                        <InputGroup className="mt-3">
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText><b>{"D"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            className="input-demanda"
                            name={"demanda"}
                            placeholder="Ingresar la demanda"
                            aria-label="Demanda"
                            aria-describedby="demanda"
                            onChange={this.handleInputChange}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><b>{"K"}</b></InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>{"$"}</InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"CostoDeUnaOrden"}
                            placeholder="Ingresar el costo de preparacion/producción"
                            aria-label="CostoDeUnaOrden"
                            aria-describedby="CostoDeUnaOrden"
                            onChange={this.handleInputChange}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><b>{"p"}</b></InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>{"$"}</InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"porcentajeCapitalInmobilizado"}
                            placeholder="Ingresar el costo de preparacion/producción"
                            aria-label="porcentajeCapitalInmobilizado"
                            aria-describedby="porcentajeCapitalInmobilizado"
                            onChange={this.handleInputChange}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-3">
                            <InputGroupAddon className="unidadesAlmacenamiento" addonType="prepend">
                                <InputGroupText><b>{"T"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            className=""
                            name={"T"}
                            placeholder="Ingresar el tiempo total de simulacion"
                            onChange={this.handleInputChange}
                            />

                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><b>{"c1"}</b></InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>{"$"}</InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"costoDeAlmacenamiento"}
                            placeholder="Ingresar el costo de almacenamiento"
                            aria-label="costoDeAlmacenamiento"
                            aria-describedby="costoDeAlmacenamiento"
                            onChange={this.handleInputChange}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><b>{"b"}</b></InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>{"$"}</InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"costoDeAdquisicion"}
                            placeholder="Ingresar el costo del producto x unidad."
                            aria-label="costoDeAdquisicion"
                            aria-describedby="costoDeAdquisicion"
                            onChange={this.handleInputChange}
                            />                        
                        </InputGroup>
                    </Col>
                                        
                    {mostrarResultados && (    //Si mostrarResultados esta en true que quiere decir que apreto el boton y que todos los campos estan completos
                                                          
                    <Col>
                        <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333', marginTop:10}}>
                            <CardText>
                                <h6 style={{display:'inline'}}>El lote optimo es:</h6> <h5 style={{display:'inline'}}><b>{Number(loteOptimo).toFixed(2)}</b></h5><br></br>
                                <h6 style={{display:'inline'}}>El costo total esperado es:</h6> <h5 style={{display:'inline'}}><b>${Number(CTE).toFixed(2)}</b></h5><br></br>
                                <Col>
                                    <Card body inverse color="primary" style={{marginTop:10, padding: '5px 0 0 0'}}>
                                        <CardText>
                                        <h5>Pedir {Number(loteOptimo).toFixed(2)} {unidadesDemanda} cada {Number(tiempoEntrePedidos).toFixed(2)} {unidadesAlmacenamiento}</h5>
                                        </CardText>
                                    </Card>   
                                </Col>
                            </CardText>
                        </Card>   
                    </Col>)}
                           
                    {incompleto && (
                    <Card className="card-incompleto" body inverse color="danger" style={{padding: '0 0 0 0', marginTop:10}}>
                        <CardText>Complete más campos para poder continuar y luego presione calcular.</CardText>
                    </Card>)}
                    
                    
                    <Row className="btn-volver justify-content-center">
                        <Link to='./'><Button>Volver</Button></Link>
                        <Button className="btn-Calcular" color="success" onClick={this.mostrarResultados}>Calcular</Button>
                    </Row>
                    
                </Jumbotron>
              </Col>
            </Row>
          </Container>
        );
      }



}

export default ModeloSimpleSinAgotamiento;