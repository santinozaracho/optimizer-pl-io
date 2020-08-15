import React from "react";
import {Button, Container, Row, Col, Card, Jumbotron} from "reactstrap";
import {InputGroupText,InputGroup, Input,InputGroupAddon, CardText, Table} from 'reactstrap';
import {Link} from 'react-router-dom';
import '../index.css'
import Graph from "../Graph";



class ModeloAgotamientoAdmitido extends React.Component{
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
            costoDeEscasez:null,
            costoDeEscasezTotal:null,
            stockAlmacenado:null,
            T:1
            
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
        let {demanda, costoDePreparacion,T, costoDeAlmacenamiento, costoDeEscasez} = this.state;
        let primerRaiz, segundaRaiz, loteOptimo
        primerRaiz = (Math.sqrt((2*Number(costoDePreparacion)*Number(demanda))/(Number(costoDeAlmacenamiento)*Number(T))))
        segundaRaiz = ( Math.sqrt((Number(costoDeAlmacenamiento)+Number(costoDeEscasez))/(Number(costoDeEscasez))) );
        loteOptimo = (Number(primerRaiz) * Number(segundaRaiz))
        
        if (loteOptimo>demanda){ //Si el q0 calculado es mas grande que la demanda entonces como lote optimo va la demanda
            this.setState({loteOptimo: demanda})
        }else{
            this.setState({loteOptimo})
        }
    }

    //CALCULAR t0
    calcularTiempoEntrePedidos(){
        let {demanda, costoDePreparacion, costoDeAlmacenamiento,T, costoDeEscasez} = this.state;
        let primerRaiz, segundaRaiz, loteOptimo
        primerRaiz = (Math.sqrt((2*Number(costoDePreparacion)*Number(T))/(Number(demanda)*Number(costoDeAlmacenamiento))))
        segundaRaiz = ( Math.sqrt((Number(costoDeAlmacenamiento)+Number(costoDeEscasez))/(Number(costoDeEscasez))) );
        this.setState({tiempoEntrePedidos: (primerRaiz+segundaRaiz) })
    }

    //CALCULAR S
    calcularStockRealAlmacenado(){
        let {demanda,costoDePreparacion,costoDeAlmacenamiento,costoDeEscasez,T} = this.state;
        let primerRaiz, segundaRaiz
        primerRaiz = (Math.sqrt((2*Number(costoDePreparacion)*Number(demanda))/(Number(costoDeAlmacenamiento)*Number(T))))
        segundaRaiz = ( Math.sqrt((Number(costoDeEscasez)) / (Number(costoDeEscasez)+Number(costoDeAlmacenamiento))) )      
        this.setState({stockAlmacenado: (primerRaiz*segundaRaiz) })
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
        let {stockAlmacenado, costoDeEscasez,loteOptimo} = this.state;
        this.setState({costoDeAlmacenamientoTotal: ((1/2)*(1/Number(loteOptimo))*(Math.pow((Number(loteOptimo)-Number(stockAlmacenado)),2))*Number(costoDeEscasez)) })
    }

    //CALCULAR COSTO TOTAL ESCESEZ
    calcularCostoEscasezTotal(){
        let {stockAlmacenado, costoDeAlmacenamiento,loteOptimo} = this.state;
        this.setState({costoDeEscasezTotal: ((1/2)*(Math.pow(Number(stockAlmacenado),2))*(Number(1)/Number(loteOptimo))*Number(costoDeAlmacenamiento)) })
    } 

    //CALCULAR CTE 
    calcularCTE(){
        let {costoDePreparacionTotal, costoDeProductoTotal, costoDeAlmacenamientoTotal, costoDeEscasezTotal, CTE} = this.state
        let sum = (Number(costoDePreparacionTotal) + Number(costoDeProductoTotal) + Number(costoDeAlmacenamientoTotal)) + Number(costoDeEscasezTotal)
        this.setState({CTE: (Number(sum))}) //CTE 
    }

    //CALCULAR CTE OPTIMO
    calcularCTEoptimo(){
        let {costoDeProducto,demanda,costoDePreparacion,costoDeAlmacenamiento,costoDeEscasez,T} = this.state;
        let bD, raiz2TDKC1, raizc1c2
        bD = (Number(costoDeProducto)*Number(demanda))
        raiz2TDKC1 = (Math.sqrt(2*Number(costoDePreparacion)*Number(demanda)*Number(T)*Number(costoDeAlmacenamiento)))
        raizc1c2 = ( Math.sqrt( (Number(costoDeEscasez))/(Number(costoDeAlmacenamiento)+(Number(costoDeEscasez))) ) )
        this.setState({CTEoptimo: (bD + (raiz2TDKC1*raizc1c2)) }) //CTEo
    }


    mostrarResultados = () => {
        
        let {demanda, costoDePreparacion, costoDeAlmacenamiento, costoDeProducto,costoDeEscasez} = this.state;
        let combinacion1 = [demanda, costoDePreparacion, costoDeAlmacenamiento, costoDeProducto,costoDeEscasez] //Cargamos un arreglo
        let control1 = combinacion1.every(caso => caso); //Si devuelve true es porque todos los elementos del arreglo estan cargados 
        
        if (control1){ //SI TODOS LOS CAMPOS ESTAN CARGADOS ENTONCES CALCULO TODO Y MUESTRO
            this.calcularLoteOptimo()
            this.calcularTiempoEntrePedidos()
            this.calcularStockRealAlmacenado()
        
            setTimeout(() => {
                this.calcularCostoPreparacionTotal()
                this.calcularCostoProductoTotal()
                this.calcularCostoAlmacenamientoTotal()
                this.calcularCostoEscasezTotal()
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
        let {costoDeProducto, costoDeProductoTotal, costoDePreparacionTotal, costoDeAlmacenamientoTotal, CTE, mostrarResultados, tiempoEntrePedidos} = this.state;
        let {costoDeEscasez, stockAlmacenado, costoDeEscasezTotal} = this.state;
        
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
                        <InputGroup className="mt-3" id={"costoDePreparacion"} key={"costoDePreparacion"}>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText><b>{"K"}</b></InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText>{"$"}</InputGroupText>
                            </InputGroupAddon>
                            <Input
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
                            name={"costoDeAlmacenamiento"}
                            value={costoDeAlmacenamiento}
                            placeholder="Ingresar el costo de almacenamiento"
                            aria-label="costoDePreparacion"
                            aria-describedby="costoDePreparacion"
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
                            <Input
                            name={"costoDeProducto"}
                            value={costoDeProducto}
                            placeholder="Ingresar el costo del producto x unidad"
                            aria-label="costoDeProducto"
                            aria-describedby="costoDeProducto"
                            onChange={this.handleInputChange}
                            />                        
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-3">
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText><b>{"c2"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"costoDeEscasez"}
                            value={costoDeEscasez}
                            placeholder="Ingresar el costo de escasez"
                            aria-label="costoDeEscasez"
                            aria-describedby="costoDeEscasez"
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
                                                <td>Lote optimo</td>
                                                <td className="text-left"><b>{Number(loteOptimo).toFixed(2)} {unidadesDemanda}</b></td>
                                            </tr>
                                            <tr>
                                                <td>t0</td>
                                                <td>Tiempo entre Pedidos</td>
                                                <td className="text-left"><b>{Number(tiempoEntrePedidos).toFixed(2)} {unidadesAlmacenamiento}</b></td>
                                            </tr>
                                            <tr>
                                                <td>s</td>
                                                <td>Stock Almacenado</td>
                                                <td className="text-left"><b>{Number(stockAlmacenado).toFixed(2)} {unidadesDemanda}</b></td>
                                            </tr>
                                            <tr>
                                                <td>CTPrep</td>
                                                <td>Costo Total Preparacion</td>
                                                <td className="text-left"><b>$ {Number(costoDePreparacionTotal).toFixed(2)}</b></td>
                                            </tr>
                                            <tr>
                                                <td>CTProp</td>
                                                <td>Costo total Producto</td>
                                                <td className="text-left"><b>$ {Number(costoDeProductoTotal).toFixed(2)}</b></td>
                                            </tr>
                                            <tr>
                                                <td>CTAlm</td>
                                                <td>Costo Total Almacenamiento</td>
                                                <td className="text-left"><b>$ {Number(costoDeAlmacenamientoTotal).toFixed(2)}</b></td>
                                            </tr>
                                            <tr>
                                                <td>C2</td>
                                                <td>Costo Total de Escasez</td>
                                                <td className="text-left"><b>$ {Number(costoDeEscasezTotal).toFixed(2)}</b></td>
                                            </tr>
                                            <tr>
                                                <td>CTE</td>
                                                <td>Costo Total Esperado</td>
                                                <td className="text-left"><b>$ {Number(CTE).toFixed(2)}</b></td>
                                            </tr>
                                            <tr>
                                                <td>CTEo</td>
                                                <td>Costo Total Esperado Optimo</td>
                                                <td className="text-left"><b>$ {Number(CTEoptimo).toFixed(2)}</b></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </CardText>
                            </Card>
                        </Row>
                        <Row>
                            <Card body>
                                <Graph title={'Grafico Modelo con Agotamiento'}/>
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

export default ModeloAgotamientoAdmitido;