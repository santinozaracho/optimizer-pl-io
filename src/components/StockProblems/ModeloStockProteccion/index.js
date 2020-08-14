import React from "react";
import {Button, Container, Row, Col, Card,Jumbotron, Table} from "reactstrap";
import {InputGroupText,InputGroup, Input,InputGroupAddon, CardText} from 'reactstrap';
import {Link} from 'react-router-dom';
import '../index.css'
import Graph from "../Graph";



class ModeloStockProteccion extends React.Component{
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
        let {demanda, CostoDeUnaOrden,T, CostoUnitarioDeAlmacenamiento, loteOptimo} = this.state;
        loteOptimo = (Math.sqrt((2*Number(CostoDeUnaOrden)*Number(demanda))/(Number(CostoUnitarioDeAlmacenamiento)*Number(T))));
        
        if (loteOptimo>demanda){ //Si el q0 calculado es mas grande que la demanda entonces como lote optimo va la demanda
            this.setState({loteOptimo: demanda})
        }else{
            this.setState({loteOptimo})
        }
    }

    //CALCULAR t0
    calcularIntervaloDeUnCiclo()
    {
        let {demanda, CostoDeUnaOrden, CostoUnitarioDeAlmacenamiento,T} = this.state;
        this.setState({tiempoEntrePedidos: (Math.sqrt((2*Number(CostoDeUnaOrden)*Number(T))/(Number(demanda)*Number(CostoUnitarioDeAlmacenamiento)))) })
    }

    //CALCULAR CTE
    calcularCostoTotalEsperado(){
        let {costoDeAdquisicion,demanda,CostoDeUnaOrden,CostoUnitarioDeAlmacenamiento,StockDeProteccion,T} = this.state;
        let bD, raiz2TDKC1, spTC1, spb
        bD = (Number(costoDeAdquisicion)*Number(demanda))
        raiz2TDKC1 = (Math.sqrt(2*Number(CostoDeUnaOrden)*Number(demanda)*Number(T)*Number(CostoUnitarioDeAlmacenamiento)))
        spTC1 = (Number(StockDeProteccion)*Number(CostoUnitarioDeAlmacenamiento)*Number(T))
        spb = (Number(StockDeProteccion) * Number(costoDeAdquisicion))
        this.setState({CTE: (bD + raiz2TDKC1 + spTC1 + spb) }) //CTEo
    }
    
    calcularStockDeReorden(){
        let {LeadTime,demanda,StockDeProteccion} = this.state;
      return((LeadTime*demanda)+StockDeProteccion)//sp
    }

    mostrarResultados = () => {
        let {demanda, costoDeAdquisicion, CostoUnitarioDeAlmacenamiento, CostoDeUnaOrden, T,LeadTime,StockDeProteccion} = this.state;
        let combinacion1 = [demanda,CostoDeUnaOrden,CostoUnitarioDeAlmacenamiento,costoDeAdquisicion,StockDeProteccion] //Cargamos un arreglo
        let control1 = combinacion1.every(caso => caso); //Si devuelve true es porque todos los elementos del arreglo estan cargados 
        
        if (control1){ //SI TODOS LOS CAMPOS ESTAN CARGADOS ENTONCES CALCULO TODO Y MUESTRO

            this.calcularTamañoDelLote(); //Calculo q0
            this.calcularIntervaloDeUnCiclo(); //Calculo t0
            
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
        let {demanda,CTE,loteOptimo,tiempoEntrePedidos,CostoDeUnaOrden,costoDeAdquisicion, StockDeProteccion} = this.state;
        let {incompleto,mostrarResultados,CostoUnitarioDeAlmacenamiento,unidadesDemanda,unidadesAlmacenamiento} = this.state;
        
 
        
        return (
            <Container fluid className="App"> 
            <Row>
              <Col xs={12} md={8} className="my-4 mx-auto">
                <Jumbotron>
                    <Col>
                        <h2>Modelo con stock de proteccion</h2><br></br>                   
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
                            placeholder="Ingresar el costo del producto x unidad"
                            aria-label="costoDeAdquisicion"
                            aria-describedby="costoDeAdquisicion"
                            onChange={this.handleInputChange}
                            />                        
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><b>{"sp"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"StockDeProteccion"}
                            placeholder="Ingresar stock de proteccion"
                            aria-label="StockDeProteccion"
                            aria-describedby="StockDeProteccion"
                            onChange={this.handleInputChange}
                            />
                        </InputGroup>
                    </Col>
                                        
                    {mostrarResultados && (    //Si mostrarResultados esta en true que quiere decir que apreto el boton y que todos los campos estan completos
                                                          
                    <Col>
                        <Row>
                            <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333', margin:15}}>
                                <CardText>
                                <Table dark className="text-center">
                                        <thead>
                                            <tr>
                                                <th>Variable</th>
                                                <th>Nombre Variable</th>
                                                <th className="text-left"><b>Resultado</b></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>q</td>
                                                <td>Lote optimo</td>
                                                <td className="text-left"><b>{Number(loteOptimo).toFixed(2)} {unidadesDemanda}</b></td>
                                            </tr>
                                            <tr>
                                                <td>t0</td>
                                                <td>Tiempo entre Pedidos</td>
                                                <td className="text-left"><b>{Number(tiempoEntrePedidos).toFixed(2)} {unidadesAlmacenamiento}</b></td>
                                            </tr>
                                            <tr>
                                                <td>CTPrep</td>
                                                <td>Costo Total Preparacion</td>
                                                <td></td>
                                                {/*<td className="text-left"><b>$ {Number(costoDePreparacionTotal).toFixed(2)}</b></td>*/}
                                            </tr>
                                            <tr>
                                                <td>CTProp</td>
                                                <td>Costo total Producto</td>
                                                <td></td>
                                                {/*<td className="text-left"><b>$ {Number(costoDeProductoTotal).toFixed(2)}</b></td>*/}
                                            </tr>
                                            <tr>
                                                <td>CTA</td>
                                                <td>Costo Total Almacenamiento</td>
                                                <td></td>
                                                {/*<td className="text-left"><b>$ {Number(costoDeAlmacenamientoTotal).toFixed(2)}</b></td>*/}
                                            </tr>
                                            <tr>
                                                <td>CTE</td>
                                                <td>Costo Total Esperado</td>
                                                <td className="text-left"><b>$ {Number(CTE).toFixed(2)}</b></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <Col>
                                        <Card body inverse color="primary" style={{marginTop:10, padding: '5px 0 0 0'}}>
                                            <CardText>
                                            <h5>Pedir {Number(loteOptimo).toFixed(2)} {unidadesDemanda} cada {Number(tiempoEntrePedidos).toFixed(2)} {unidadesAlmacenamiento}</h5>
                                            </CardText>
                                        </Card>   
                                    </Col>
                                </CardText>
                            </Card> 
                        </Row>
                        <Row>
                            <Card body>
                                <Graph y={loteOptimo} t={tiempoEntrePedidos} sr={StockDeProteccion} yProm={Number(loteOptimo)/2} title={'Grafico Stock de Proteccion'}/>
                                <div className='text-center content-align-center'>   
                                    <div className='text-center content-align-center' style={{display:'flex', alignItems:'center', textAlign:'center'}}>
                                        <hr style={{borderTop: '2px dashed green', width:'50px', marginRight:10}}/><td>y* optimo</td>
                                        <hr style={{borderTop: '2px dashed red', width:'50px', marginRight:10}}/><td>Stock de Proteccion</td>                                  
                                    </div>
                                </div>
                            </Card>
                        </Row>  
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

export default ModeloStockProteccion;