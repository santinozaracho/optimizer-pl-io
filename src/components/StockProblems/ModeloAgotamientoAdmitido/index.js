import React from "react";
import {Button, Container, Row, Col, Card, Jumbotron} from "reactstrap";
import {InputGroupText,InputGroup, Input,InputGroupAddon, CardText, Table, Label} from 'reactstrap';
import {Link} from 'react-router-dom';
import '../index.css'
import GraphAgotamiento from "../Graph/modeloAgotamientoAdmitido";

//CALCULAR Ti
const calcularTiempoTotal = (cantidadDePeriodos, unidadTiempo, pedidosNecesarios) =>{//Necesitamos T en dias que vamos a calcular y n
    let unidadTiempoEnDias;
    if (unidadTiempo === "Año"){
        unidadTiempoEnDias = 365
    } else if (unidadTiempo === "Mes"){
        unidadTiempoEnDias = 30
    }else if (unidadTiempo === "Semana"){
        unidadTiempoEnDias = 30
    }else {
        unidadTiempoEnDias = 1
    }
    let TEnDias = (Number(cantidadDePeriodos) * unidadTiempoEnDias )
    return (TEnDias/Number(pedidosNecesarios))//Calculamos Ti 
}

//CALCULAR Ti1
    //Este es el tiempo que tarda desde que se repone el stock hasta que llega a tener 0 el inventario.
    const calcularTiempoHastaAgotamiento = (tiempoTotal, loteOptimo) =>{
    return ( (Number(loteOptimo) * Number(tiempoTotal))/(Number(loteOptimo)) )  //Calculamos Ti1
    }

    //CALCULAR Ti2
    //Este es el tiempo desde que el inventario esta agotado (0 en stock) hasta que llega al minimo posible de stock negativo
    const calcularTiempoDesdeAgotamiento = (tiempoTotal, tiempoHastaAgotamiento) =>{
        return( Number(tiempoTotal) - Number(tiempoHastaAgotamiento)) //Calculamos Ti2
    }



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
            loteOptimo:null, //q
            tiempoEntrePedidos: null, //t0
            mostrarResultados: false,
            inputUpdated: false,
            incompleto: false,
            CTE: null, //CTE
            CTEoptimo: null, //CTEo
            costoDeEscasez:null, //c2
            costoDeEscasezTotal:null, 
            stockAlmacenado:null, //s
            cantidadDePeriodos:1, //Cuantos unidadTiempo son?
            unidadTiempo: "Año", //Ano, Mes, Semana, Dia
            T:1,
            pedidosNecesarios: null, //n
            tiempoTotal: null, //Ti
            tiempoHastaAgotamiento: null, //Ti1
            tiempoDesdeAgotamiento: null, //Ti2 
            
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
    
    //CALCULAR q
    calcularLoteOptimo() {
        let {demanda, costoDePreparacion,T, costoDeAlmacenamiento, costoDeEscasez} = this.state;
        let primerRaiz, segundaRaiz, loteOptimo
        primerRaiz = (Math.sqrt((2*Number(costoDePreparacion)*Number(demanda))/(Number(costoDeAlmacenamiento)*Number(T))))
        segundaRaiz = ( Math.sqrt((Number(costoDeAlmacenamiento)+Number(costoDeEscasez))/(Number(costoDeEscasez))) );
        loteOptimo = (Number(primerRaiz) * Number(segundaRaiz))
        
        if (loteOptimo>demanda){ //Si el q calculado es mas grande que la demanda entonces como lote optimo va la demanda
            this.setState({loteOptimo: demanda})
        }else{
            this.setState({loteOptimo})
        }
    }

    //CALCULAR s
    calcularStockRealAlmacenado(){
        let {demanda,costoDePreparacion,costoDeAlmacenamiento,costoDeEscasez,T} = this.state;
        let primerRaiz, segundaRaiz
        primerRaiz = (Math.sqrt((2*Number(costoDePreparacion)*Number(demanda))/(Number(costoDeAlmacenamiento)*Number(T))))
        segundaRaiz = ( Math.sqrt((Number(costoDeEscasez)) / (Number(costoDeEscasez)+Number(costoDeAlmacenamiento))) )      
        this.setState({stockAlmacenado: (primerRaiz*segundaRaiz) })
    }

    //CALCULAR n
    //Si hacemos la demanda dividido el lote optimo q podemos saber cuantos pedidos de stock vamos a necesitar
    calcularn(){
        let {demanda, loteOptimo} = this.state;
        this.setState({pedidosNecesarios: (Number(demanda)/Number(loteOptimo)) })

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
        let {costoDePreparacionTotal, costoDeProductoTotal, costoDeAlmacenamientoTotal, costoDeEscasezTotal} = this.state
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
            this.calcularStockRealAlmacenado()
        
            setTimeout(() => {
                this.calcularCostoPreparacionTotal()
                this.calcularCostoProductoTotal()
                this.calcularCostoAlmacenamientoTotal()
                this.calcularCostoEscasezTotal()
                this.calcularCTE()
                this.calcularCTEoptimo()
                this.calcularn()
                
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
        let {costoDeEscasez, stockAlmacenado, costoDeEscasezTotal, cantidadDePeriodos, unidadTiempo} = this.state;
        let {pedidosNecesarios} = this.state;

        let tiempoTotal = calcularTiempoTotal(cantidadDePeriodos, unidadTiempo, pedidosNecesarios)
        let tiempoHastaAgotamiento = calcularTiempoHastaAgotamiento(stockAlmacenado, tiempoTotal, loteOptimo)
        let tiempoDesdeAgotamiento = calcularTiempoDesdeAgotamiento(tiempoTotal, tiempoHastaAgotamiento)
        
        return (
            <Container fluid className="App"> 
            <Row>
              <Col xs={12} md={8} className="my-4 mx-auto">
                <Jumbotron>
                    <Col>
                        <h2>Modelo con Agotamiento</h2><br></br>                   
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
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-3" id={""} key={""}>
                            <InputGroupAddon className="" addonType="prepend">
                                <InputGroupText><b>{"Unidades del Producto"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            className="input-unidadesDemanda"
                            name={"unidadesDemanda"}
                            placeholder="Ej: focos, pantallas, etc."
                            aria-label="UnidadDemanda"
                            aria-describedby="unidadDemanda"
                            onChange={this.handleInputChange}
                            />

                            <InputGroupAddon className="" addonType="prepend">
                                <InputGroupText><b>{"Unidades de Tiempo"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            className="input-unidadesDemanda"
                            name={"cantidadDePeriodos"}
                            placeholder="1"
                            aria-label="cantidadDePeriodos"
                            aria-describedby="cantidadDePeriodos"
                            type="number" min="0"
                            onChange={this.handleInputChange}
                            style={{maxWidth:70}}
                            />      
                            <Input type="select" name="unidadTiempo" id="unidadTiempo" style={{maxWidth:110}} onChange={this.handleInputChange}>
                                <option value={'Año'}>Año</option>
                                <option value={'Mes'}>Mes</option>
                                <option value={'Semana'}>Semana</option>
                                <option value={'Dia'}>Día</option>
                            </Input>
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
                                <InputGroupText><b>{"Periodo"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            className=""
                            name={"unidadesAlmacenamiento"}
                            placeholder={cantidadDePeriodos + ' ' + unidadTiempo}
                            onChange={this.handleInputChange}
                            disabled
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
                    <Col>
                        <InputGroup className="mt-3">
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText><b>{"c2"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            type="number" min="0"
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
                                                <td>Lote Óptimo</td>
                                                <td className="text-left"><b>{Number(loteOptimo).toFixed(2)} {unidadesDemanda}</b></td>
                                            </tr>
                                            <tr>
                                                <td>s</td>
                                                <td>Stock Almacenado</td>
                                                <td className="text-left"><b>{Number(stockAlmacenado).toFixed(4)} {unidadesDemanda}</b></td>
                                            </tr>
                                            <tr>
                                                <td>n</td>
                                                <td>Cantidad de Pedidos</td>
                                                <td className="text-left"><b>{Number(pedidosNecesarios).toFixed(4)}</b></td>
                                            </tr>
                                            <tr>
                                                <td>Ti</td>
                                                <td>Duración de cada Periodo</td>
                                                <td className="text-left"><b>{Number(tiempoTotal).toFixed(4) + ' Dias'}</b></td>
                                            </tr>
                                            {/* ESTO NO MOSTRAMOS PORQUE NO COINCIDE TI1 Y TI2 CON LO QUE ESTAMOS GRAFICANDO.
                                                PODEMOS TRATAR DE SOLUCIONAR O DEJARLO ASI Y ES MUY DIFICIL DE DARSE CUENTA
                                            <tr> 
                                                <td>Ti1</td>
                                                <td>Duracion hasta agotarse</td>
                                                <td className="text-left"><b>{Number(tiempoHastaAgotamiento).toFixed(4) + ' Dias'}</b></td>
                                            </tr>
                                            <tr>
                                                <td>Ti2</td>
                                                <td>Duracion desde que se agota</td>
                                                <td className="text-left"><b>{Number(tiempoDesdeAgotamiento).toFixed(4) + ' Dias'}</b></td>
                                            </tr>*/}
                                            <tr>
                                                <td>CTPrep</td>
                                                <td>Costo Total Preparación</td>
                                                <td className="text-left"><b>$ {Number(costoDePreparacionTotal).toFixed(4)}</b></td>
                                            </tr>
                                            <tr>
                                                <td>CTProd</td>
                                                <td>Costo Total Producto</td>
                                                <td className="text-left"><b>$ {Number(costoDeProductoTotal).toFixed(4)}</b></td>
                                            </tr>
                                            <tr>
                                                <td>CTAlm</td>
                                                <td>Costo Total Almacenamiento</td>
                                                <td className="text-left"><b>$ {Number(costoDeAlmacenamientoTotal).toFixed(4)}</b></td>
                                            </tr>
                                            <tr>
                                                <td>C2</td>
                                                <td>Costo Total de Escasez</td>
                                                <td className="text-left"><b>$ {Number(costoDeEscasezTotal).toFixed(4)}</b></td>
                                            </tr>
                                            <tr>
                                                <td>CTE</td>
                                                <td>Costo Total Esperado</td>
                                                <td className="text-left"><b>$ {Number(CTE).toFixed(4)}</b></td>
                                            </tr>
                                            <tr>
                                                <td>CTEo</td>
                                                <td>Costo Total Esperado Óptimo</td>
                                                <td className="text-left"><b>$ {Number(CTEoptimo).toFixed(4)}</b></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </CardText>
                            </Card>
                        </Row>
                        <Row>
                            <Card body>
                                <GraphAgotamiento title={'Gráfico Modelo con Agotamiento'} y={loteOptimo} s={stockAlmacenado} Ti={tiempoTotal} Ti1={tiempoHastaAgotamiento}/>
                                <div className='text-center content-align-center'>   
                                    <div className='text-center content-align-center' style={{display:'flex', alignItems:'center', textAlign:'center'}}>
                                        <hr style={{borderTop: '2px dashed blue', width:'50px', marginRight:10}}/><td>Eje X</td>                                  
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