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
            demanda: null, //D
            CostoDeUnaOrden: null, //K
            costoDeAlmacenamiento: null,//c1
            costoDeAdquisicion: null, //b
            StockDeProteccion:null,// c2
            unidadesAlmacenamiento: null,
            unidadesDemanda:null,
            loteOptimo:null, //q
            tiempoEntrePedidos: null, //t0
            mostrarResultados: false,
            inputUpdated: false,
            incompleto: false,
            CTE: null,
            T:1,
            CostoDeEscasez: null,
            stockAlmacenado:null,
            
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
        let {demanda, CostoDeUnaOrden,T, CostoUnitarioDeAlmacenamiento, CostoDeEscasez} = this.state;
        let primerRaiz, segundaRaiz, loteOptimo
        primerRaiz = (Math.sqrt((2*Number(CostoDeUnaOrden)*Number(demanda))/(Number(CostoUnitarioDeAlmacenamiento)*Number(T))))
        segundaRaiz = ( Math.sqrt((Number(CostoUnitarioDeAlmacenamiento)+Number(CostoDeEscasez))/(Number(CostoDeEscasez))) );
        loteOptimo = (primerRaiz * segundaRaiz)
        
        if (loteOptimo>demanda){ //Si el q0 calculado es mas grande que la demanda entonces como lote optimo va la demanda
            this.setState({loteOptimo: demanda})
        }else{
            this.setState({loteOptimo})
        }
    }

    //CALCULAR t0
    calcularIntervaloDeUnCiclo()
    {
        let {demanda, CostoDeUnaOrden, CostoUnitarioDeAlmacenamiento,T, CostoDeEscasez} = this.state;
        let primerRaiz, segundaRaiz, loteOptimo
        primerRaiz = (Math.sqrt((2*Number(CostoDeUnaOrden)*Number(T))/(Number(demanda)*Number(CostoUnitarioDeAlmacenamiento))))
        segundaRaiz = ( Math.sqrt((Number(CostoUnitarioDeAlmacenamiento)+Number(CostoDeEscasez))/(Number(CostoDeEscasez))) );
        this.setState({tiempoEntrePedidos: (primerRaiz+segundaRaiz) })
    }

    //CALCULAR CTE
    calcularCostoTotalEsperado(){
        let {costoDeAdquisicion,demanda,CostoDeUnaOrden,CostoUnitarioDeAlmacenamiento,CostoDeEscasez,T} = this.state;
        let bD, raiz2TDKC1, raizc1c2
        bD = (Number(costoDeAdquisicion)*Number(demanda))
        raiz2TDKC1 = (Math.sqrt(2*Number(CostoDeUnaOrden)*Number(demanda)*Number(T)*Number(CostoUnitarioDeAlmacenamiento)))
        raizc1c2 = ( Math.sqrt( (Number(CostoDeEscasez))/(Number(CostoUnitarioDeAlmacenamiento)+(Number(CostoDeEscasez))) ) )
        this.setState({CTE: (bD + (raiz2TDKC1*raizc1c2)) }) //CTEo
    }

    //CALCULAR s
    calcularStockRealAlmacenado(){
        let {demanda,CostoDeUnaOrden,CostoUnitarioDeAlmacenamiento,CostoDeEscasez,T} = this.state;
        let primerRaiz, segundaRaiz
        primerRaiz = (Math.sqrt((2*Number(CostoDeUnaOrden)*Number(demanda))/(Number(CostoUnitarioDeAlmacenamiento)*Number(T))))
        segundaRaiz = ( Math.sqrt((Number(CostoDeEscasez)) / (Number(CostoDeEscasez)+Number(CostoUnitarioDeAlmacenamiento))) )
                
        this.setState({stockAlmacenado: (primerRaiz*segundaRaiz) })
    }
    
    calcularStockDeReorden(){
        let {LeadTime,demanda,StockDeProteccion} = this.state;
      return((LeadTime*demanda)+StockDeProteccion)//sp
    }

    /* //FUNCIONES QUE NO ESTAMOS OCUPANDO
    calcularCostoTotalEsperadoConQ(){
        let {costoDeAdquisicion,demanda,CostoDeUnaOrden,CostoUnitarioDeAlmacenamiento,StockDeProteccion,T} = this.state;
        let q = this.calcularTamañoDelLote();
        return((costoDeAdquisicion*demanda)+(q*CostoUnitarioDeAlmacenamiento*T)/2+CostoDeUnaOrden/(demanda/q)*StockDeProteccion*CostoUnitarioDeAlmacenamiento*T)//CTEo
    }

    calcularIntervaloDeUnCicloSinRaiz()
    {
        let {demanda, T} = this.state;
        return ((this.calcularTamañoDelLote()*T)/(demanda)); //to
    }

    calcularTamañoDelLoteSinRaiz(){
        let {demanda, T, } = this.state;
        let to = this.calcularIntervaloDeUnCiclo()
        return ((demanda*to)/T); //q
    }
    */

    mostrarResultados = () => {
        let {demanda, costoDeAdquisicion, CostoUnitarioDeAlmacenamiento, CostoDeUnaOrden,CostoDeEscasez} = this.state;
        let combinacion1 = [demanda,CostoDeUnaOrden,CostoUnitarioDeAlmacenamiento,costoDeAdquisicion,CostoDeEscasez] //Cargamos un arreglo
        let control1 = combinacion1.every(caso => caso); //Si devuelve true es porque todos los elementos del arreglo estan cargados 
        
        if (control1){ //SI TODOS LOS CAMPOS ESTAN CARGADOS ENTONCES CALCULO TODO Y MUESTRO

            this.calcularTamañoDelLote(); //Calculo q0
            this.calcularIntervaloDeUnCiclo(); //Calculo t0
            this.calcularStockRealAlmacenado(); //Calculo s
            
            setTimeout(() => { //Luego de calcular lo anterior, le doy un tiempo para que calcule el CTE
                this.calcularCostoTotalEsperado();
            }, 1);

            this.setState({mostrarResultados: true})
            this.setState({incompleto: false})

        }else{
            this.setState({incompleto:true}) //PONGO A INCOMPLETO EN TRUE Y MUESTRO LA ALERTA DE COMPLETAR CAMPOS
        }
                      
    }

    render() { 
        let {demanda,CTE,loteOptimo,tiempoEntrePedidos,CostoDeUnaOrden,costoDeAdquisicion, CostoDeEscasez} = this.state;
        let {incompleto,mostrarResultados,CostoUnitarioDeAlmacenamiento,unidadesDemanda,unidadesAlmacenamiento, stockAlmacenado} = this.state;
        
 
        
        return (
            <Container fluid className="App"> 
            <Row>
                <h1>HOLA MAJO</h1>
              <Col xs={12} md={8} className="my-4 mx-auto">
                <Jumbotron>
                    <Col>
                        <h2>Modelo con agotamiento</h2><br></br>                   
                    </Col>
                    
                    <Col> 
                        <InputGroup className="mt-3">
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText><b>{"D"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            className="input-demanda"
                            name={"demanda"}
                            value={demanda}
                            placeholder="Ingresar la demanda"
                            aria-label="Demanda"
                            aria-describedby="demanda"
                            onChange={this.handleInputChange}
                            />
                            <InputGroupAddon className="input-unidades" addonType="prepend">
                            <InputGroupText><b>{"Unidades"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            className="input-unidadesDemanda"
                            name={"unidadesDemanda"}
                            placeholder="Ingresar las unidades de demanda"
                            aria-label="UnidadDemanda"
                            aria-describedby="unidadDemanda"
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
                            value={CostoDeUnaOrden}
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
                                <InputGroupText><b>{"c1"}</b></InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>{"$"}</InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"CostoUnitarioDeAlmacenamiento"}
                            value={CostoUnitarioDeAlmacenamiento}
                            placeholder="Ingresar el costo de almacenamiento"
                            aria-label="CostoUnitarioDeAlmacenamiento"
                            aria-describedby="CostoUnitarioDeAlmacenamiento"
                            onChange={this.handleInputChange}
                            />
                            
                            <InputGroupAddon className="unidadesAlmacenamiento" addonType="prepend">
                                <InputGroupText><b>{"Unidades"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            className=""
                            name={"unidadesAlmacenamiento"}
                            placeholder="Ingresar las unidades de tiempo"
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
                            value={costoDeAdquisicion}
                            placeholder="Ingresar el costo del producto x unidad."
                            aria-label="costoDeAdquisicion"
                            aria-describedby="costoDeAdquisicion"
                            onChange={this.handleInputChange}
                            />                        
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><b>{"c2"}</b></InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>{"$"}</InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"CostoDeEscasez"}
                            value={CostoDeEscasez}
                            placeholder="Ingresar stock de proteccion."
                            aria-label="CostoDeEscasez"
                            aria-describedby="CostoDeEscasez"
                            onChange={this.handleInputChange}
                            />
                        </InputGroup>
                    </Col>
                                        
                    {mostrarResultados && (    //Si mostrarResultados esta en true que quiere decir que apreto el boton y que todos los campos estan completos
                                                          
                    <Col>
                        <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333', marginTop:10}}>
                            <CardText>
                                <h6 style={{display:'inline'}}>El lote optimo es:</h6> <h5 style={{display:'inline'}}><b>{Number(loteOptimo).toFixed(2)}</b></h5><br></br>
                                <h6 style={{display:'inline'}}>El tiempo entre pedidos es:</h6> <h5 style={{display:'inline'}}><b>{Number(tiempoEntrePedidos).toFixed(2)}</b></h5><br></br>
                                <h6 style={{display:'inline'}}>La cantidad de stock almacenado es:</h6> <h5 style={{display:'inline'}}><b>{Number(stockAlmacenado).toFixed(2)} {unidadesDemanda}</b></h5><br></br>
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