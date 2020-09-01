import React from "react";
import { Button, Container, Row, Col, Card,Jumbotron} from "reactstrap";
import {InputGroupText,InputGroup, Input,InputGroupAddon,CardText, Table} from 'reactstrap';
import {Link} from 'react-router-dom';
import '../index.css'
import Graph from "../Graph";



class ModeloWilson extends React.Component{
    constructor (props){
        super(props)
        this.state={
            demanda: null, //D
            costoDePreparacion: null, //K
            costoDePreparacionTotal: null,
            costoDeAlmacenamiento: null,//c1
            costoDeAlmacenamientoTotal: null,
            costoDeProducto: null, //b
            costoDeProductoTotal: null,
            unidadesAlmacenamiento: null,
            unidadesDemanda:null,
            loteOptimo:null, //q
            tiempoEntrePedidos: null, //t0
            mostrarResultados: false,
            inputUpdated: false,
            incompleto: false,
            CTE: null,
            CTEoptimo: null,
            n: null,
            
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
    
    //CALCULAR q0
    calcularLoteOptimo() {
        let {costoDePreparacion, demanda, costoDeAlmacenamiento} = this.state;
        let loteOptimo
        loteOptimo = (Math.sqrt((2*Number(costoDePreparacion)*Number(demanda))/(Number(costoDeAlmacenamiento))));
        
        if (loteOptimo>demanda){ //Si el q0 calculado es mas grande que la demanda entonces como lote optimo va la demanda
            this.setState({loteOptimo: demanda})
        }else{
            this.setState({loteOptimo})
        }
    }

    //CALCULAR t0
    calcularTiempoEntrePedidos(){
        let {costoDePreparacion, demanda, costoDeAlmacenamiento} = this.state
        this.setState({tiempoEntrePedidos: (Math.sqrt(2*Number(costoDePreparacion)/ ((Number(demanda))*(Number(costoDeAlmacenamiento))))) })
        

    }

    //CALCULAR COSTO DE PREPARACION TOTAL
    calcularCostoPreparacionTotal(){
        let {demanda, loteOptimo, costoDePreparacion} = this.state;
        this.setState({costoDePreparacionTotal: ((Number(demanda)/Number(loteOptimo))*Number(costoDePreparacion)) })
    }

    //CALCULAR COSTO DEL PRODUCTO TOTAL
    calcularCostoProductoTotal(){
        let {costoDeProducto, demanda} = this.state;
        this.setState({costoDeProductoTotal: (Number(costoDeProducto)*Number(demanda)) })
    }

    //CALCULAR COSTO TOTAL DE ALMACENAMIENTO
    calcularCostoAlmacenamientoTotal(){
        let {loteOptimo, costoDeAlmacenamiento} = this.state;
        this.setState({costoDeAlmacenamientoTotal: ((1/2)*Number(loteOptimo)*Number(costoDeAlmacenamiento)) })
    }

    //CALCULAR n
    calcularn(){
        let {demanda, loteOptimo} = this.state
        this.setState({ n: ( Number(demanda)/Number(loteOptimo) ) })
    }

    //CALCULAR CTE 
    calcularCTE(){
        let {costoDePreparacionTotal, costoDeProductoTotal, costoDeAlmacenamientoTotal} = this.state
        let sum = (Number(costoDePreparacionTotal) + Number(costoDeProductoTotal) + Number(costoDeAlmacenamientoTotal))
        this.setState({CTE: (Number(sum))})
    }

    //CALCULAR CTE OPTIMO
    calcularCTEoptimo(){
        let {costoDeProducto, costoDeAlmacenamiento, demanda, costoDePreparacion} = this.state
        let bD, raiz2TDKC1
        bD = (Number(costoDeProducto)*Number(demanda))
        raiz2TDKC1 = ( Math.sqrt(2*Number(demanda)*Number(costoDePreparacion)*Number(costoDeAlmacenamiento)) )
        console.log(bD,raiz2TDKC1)
        this.setState({CTEoptimo: (bD + raiz2TDKC1)})
        console.log(bD + raiz2TDKC1)
    }


    mostrarResultados = () => {
        
        let {demanda, costoDePreparacion, costoDeAlmacenamiento, costoDeProducto} = this.state;
        let combinacion1 = [demanda, costoDePreparacion, costoDeAlmacenamiento, costoDeProducto] //Cargamos un arreglo
        let control1 = combinacion1.every(caso => caso); //Si devuelve true es porque todos los elementos del arreglo estan cargados 
        
        if (control1){ //SI TODOS LOS CAMPOS ESTAN CARGADOS ENTONCES CALCULO TODO Y MUESTRO
            this.calcularLoteOptimo()
            this.calcularTiempoEntrePedidos()
        
            setTimeout(() => {
                this.calcularn()
                this.calcularCostoPreparacionTotal()
                this.calcularCostoProductoTotal()
                this.calcularCostoAlmacenamientoTotal()
                this.calcularCTE()
                this.calcularCTEoptimo()
            }, 1);

            this.setState({mostrarResultados: true})
            this.setState({incompleto: false})

        }else{
            this.setState({incompleto:true}) //PONGO A INCOMPLETO EN TRUE Y MUESTRO LA ALERTA DE COMPLETAR CAMPOS
        }
        
        
                 
    }

    render() { 
        let {demanda, costoDePreparacion, costoDeAlmacenamiento,unidadesDemanda, loteOptimo, unidadesAlmacenamiento, incompleto, CTEoptimo} = this.state;
        let {costoDeProducto, costoDeProductoTotal, costoDePreparacionTotal, costoDeAlmacenamientoTotal, CTE, mostrarResultados, tiempoEntrePedidos, n} = this.state;
 
        
        return (
            <Container fluid className="App"> 
            <Row>
              <Col xs={12} md={8} className="my-4 mx-auto">
                <Jumbotron>
                    <Col>
                        <h2>Modelo Wilson</h2><br></br>                   
                    </Col>
                    
                    <Col> 
                        <InputGroup className="mt-3" id={"demanda"} key={"demanda"}>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText><b>{"D"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            type="number" min="0"
                            className="input-demanda"
                            name={"demanda"}
                            value={demanda}
                            placeholder="Ingresar la demanda"
                            aria-label="Demanda"
                            aria-describedby="demanda"
                            onChange={this.handleInputChange}
                            />
                            <InputGroupAddon className="input-unidades" addonType="prepend">
                            <InputGroupText><b>{"Unidades de D"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            className="input-unidadesDemanda"
                            name={"unidadesDemanda"}
                            placeholder="Ej: kg, pantallas, etc."
                            aria-label="UnidadDemanda"
                            aria-describedby="unidadDemanda"
                            onChange={this.handleInputChange}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-3" id={"costoDePreparacion"} key={"costoDePreparacion"}>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText><b>{"K"}</b></InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText>{"$"}</InputGroupText>
                            </InputGroupAddon>
                            <Input
                            type="number" min="0"
                            name={"costoDePreparacion"}
                            value={costoDePreparacion}
                            placeholder="Ingresar el costo por pedido"
                            aria-label="costoDePreparacion"
                            aria-describedby="costoDePreparacion"
                            onChange={this.handleInputChange}
                            />
                            
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-3" id={"costoDeAlmacenamiento"} key={"costoDeAlmacenamiento"}>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><b>{"c1"}</b></InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText >{"$"}</InputGroupText>
                            </InputGroupAddon>
                            <Input
                            type="number" min="0"
                            name={"costoDeAlmacenamiento"}
                            value={costoDeAlmacenamiento}
                            placeholder="Ingresar el costo de almacenamiento"
                            aria-label="costoDePreparacion"
                            aria-describedby="costoDePreparacion"
                            onChange={this.handleInputChange}
                            />  
                            
                            <InputGroupAddon className="unidadesAlmacenamiento" addonType="prepend">
                                <InputGroupText><b>{"Unidades de T"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            className=""
                            name={"unidadesAlmacenamiento"}
                            placeholder="Ej: día, semana, año, etc."
                            onChange={this.handleInputChange}
                            />
                        
                        </InputGroup>
                    </Col>
                    
                    <Col>
                        <InputGroup className="mt-3">
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText><b>{"b"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            type="number" min="0"
                            name={"costoDeProducto"}
                            value={costoDeProducto}
                            placeholder="Ingresar el costo del producto por unidad"
                            aria-label="costoDeProducto"
                            aria-describedby="costoDeProducto"
                            onChange={this.handleInputChange}
                            />                        
                        </InputGroup>
                    </Col>
                                        
                    {mostrarResultados && (    //Si mostrarResultados esta en true que quiere decir que apreto el boton y que todos los campos estan completos
                                                          
                    <Col>
                        <Row>
                            <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333', margin:15}}>
                                <CardText className="text-left">
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
                                                <td>Lote Óptimo</td>
                                                <td className="text-left"><b>{Number(loteOptimo).toFixed(2)} {unidadesDemanda}</b></td>
                                            </tr>
                                            <tr>
                                                <td>t0</td>
                                                <td>Tiempo entre Pedidos</td>
                                                <td className="text-left"><b>{Number(tiempoEntrePedidos).toFixed(2)} {unidadesAlmacenamiento}</b></td>
                                            </tr>
                                            <tr>
                                                <td>n</td>
                                                <td></td>
                                                <td className="text-left"><b>{Number(n).toFixed(2)}</b></td>
                                            </tr>
                                            <tr>
                                                <td>CTPrep</td>
                                                <td>Costo Total Preparación</td>
                                                <td className="text-left"><b>$ {Number(costoDePreparacionTotal).toFixed(2)}</b></td>
                                            </tr>
                                            <tr>
                                                <td>CTProd</td>
                                                <td>Costo Total Producto</td>
                                                <td className="text-left"><b>$ {Number(costoDeProductoTotal).toFixed(2)}</b></td>
                                            </tr>
                                            <tr>
                                                <td>CTAlm</td>
                                                <td>Costo Total Almacenamiento</td>
                                                <td className="text-left"><b>$ {Number(costoDeAlmacenamientoTotal).toFixed(2)}</b></td>
                                            </tr>
                                            <tr>
                                                <td>CTE</td>
                                                <td>Costo Total Esperado</td>
                                                <td className="text-left"><b>$ {Number(CTE).toFixed(2)}</b></td>
                                            </tr>
                                            <tr>
                                                <td>CTEo</td>
                                                <td>Costo Total Esperado Óptimo</td>
                                                <td className="text-left"><b>$ {Number(CTEoptimo).toFixed(2)}</b></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <Col>
                                        <Card body inverse color="primary" style={{marginTop:10, padding: '5px 0 0 0'}}>
                                            <CardText className="text-center">
                                            <h5>Pedir {Number(loteOptimo).toFixed(2)} {unidadesDemanda} cada {Number(tiempoEntrePedidos).toFixed(2)} {unidadesAlmacenamiento}</h5>
                                            </CardText>
                                        </Card>   
                                    </Col>
                                </CardText>
                            </Card>
                        </Row>
                        <Row>
                            <Card body>
                                <Graph y={loteOptimo} t={tiempoEntrePedidos} yProm={Number(loteOptimo)/2} title={'Gráfico Modelo Wilson'}/>
                                <div className='text-center content-align-center'>   
                                    <div className='text-center content-align-center' style={{display:'flex', alignItems:'center', textAlign:'center'}}>
                                        <hr style={{borderTop: '2px dashed green', width:'50px', marginRight:10}}/><td>y* promedio</td>                                  
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

export default ModeloWilson;