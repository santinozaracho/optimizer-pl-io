import React from "react";
import { Button, Container, Row, Col, Card,Jumbotron} from "reactstrap";
import {InputGroupText,InputGroup, Input,InputGroupAddon,CardText,Table} from 'reactstrap';
import {Link} from 'react-router-dom';
import '../index.css';
import Graph from "../Graph";





class CantidadEconomicaPedido extends React.Component{
    constructor (props){
        super(props)
        this.state={
            demanda: null, //D
            costoDePreparacion: null, //K
            costoDeAlmacenamiento: null,//h
            tiempoDeEntrega:null,//L
            politica:null,// establece que politica usar
            unidadCostoDeAlmacenamiento:1, //ESTA NO ESTAMOS OCUPANDO POR EL MOMENTO
            unidadesAlmacenamiento: null,
            unidadesDemanda:null,
            longitudCiclo:null, //t*
            cantidadEconomica:null, //y*
            mostrarResultados: false,
            inputUpdated: false,
            incompleto: false,
            puntoDeReorden: null,
            TCU: null,      
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
    
    //CALCULAR t0*
    calcularLongitud(cantidadEconomic){
        let {demanda, cantidadEconomica} = this.state
       
        if (cantidadEconomic){
            cantidadEconomica = cantidadEconomic 
            console.log("Cantidad economica")
        }
        this.setState({longitudCiclo:(Number(cantidadEconomica)/Number(demanda))}); //to*
        
    }
    
    //CALCULAR y*
    calcularInventarioOptimoEcuacionSimple(){
        let {demanda, longitudCiclo} = this.state;
        this.setState({cantidadEconomica: (demanda*longitudCiclo)});
    }

    //CALCULAR D
    calcularDemandaEcuacionSimple(){
        let {cantidadEconomica, longitudCiclo} = this.state;
        this.setState({demanda: (cantidadEconomica/longitudCiclo)});
    }

    //CALCULAR y* PERO CON LA OTRA FORMULA (la formula de la raiz con K,D, h)
    calcularInventarioOptimo(){ 
        let {demanda, costoDePreparacion, costoDeAlmacenamiento, unidadCostoDeAlmacenamiento} = this.state;
        let cantidadEconomica = (Math.sqrt((2*Number(costoDePreparacion)*Number(demanda))/(Number(costoDeAlmacenamiento)*unidadCostoDeAlmacenamiento)))
        this.setState({cantidadEconomica}); //y*
        return cantidadEconomica;
    }

    //CALCULAR h
    calcularCostoAlmacenamiento(){
        let {demanda, costoDePreparacion, cantidadEconomica} = this.state;
        this.setState({costoDeAlmacenamiento:((2*Number(costoDePreparacion)*Number(demanda)/Math.pow(Number(cantidadEconomica),2)))}); //h
    }
    
    //CALCULAR D PERO CON LA OTRA FORMULA (la formula de la raiz con h, y*, k)
    calcularDemanda(){
        let {costoDePreparacion, costoDeAlmacenamiento, cantidadEconomica} = this.state;
        this.setState({demanda:( (Number(costoDeAlmacenamiento)*Math.pow(Number(cantidadEconomica),2))/ 2*Number(costoDePreparacion) ) }); //D

    }

    //CALCULAR K
    calcularCostoPorPedido(){
        let {demanda, costoDeAlmacenamiento, cantidadEconomica} = this.state;
        this.setState({costoDePreparacion:( (Number(costoDeAlmacenamiento)*Math.pow(Number(cantidadEconomica),2))/ 2*Number(demanda) ) }); //D
        
    }


    //CALCULAR TCU(y)
    calcularCostoInventario()
    {
        let {demanda, costoDePreparacion, costoDeAlmacenamiento,unidadCostoDeAlmacenamiento, cantidadEconomica} = this.state;
        let promedioInventario = (cantidadEconomica / 2);
        this.setState({TCU: ((Number(costoDePreparacion)/(Number(cantidadEconomica) /Number(demanda)))+ (Number(costoDeAlmacenamiento)*Number(unidadCostoDeAlmacenamiento)*promedioInventario))}); //TCL(y)
    }

    
    calcularPuntoDeReorden(){
        let {demanda,politica,tiempoDeEntrega, longitudCiclo} = this.state;
        
        if(tiempoDeEntrega > longitudCiclo){ //SI L > to*, calculamos Le
        //para politica 1 
            let n = Math.trunc(tiempoDeEntrega/longitudCiclo);//n
            let tiempoEfectivoDeEntrega= tiempoDeEntrega - (n * longitudCiclo);//Le
            this.setState({puntoDeReorden: (tiempoEfectivoDeEntrega * demanda)});//punto de reorden
        }else{
            //para politica 2
            this.setState({puntoDeReorden: (tiempoDeEntrega * demanda)})
        }
    }


    mostrarResultados = () => {
        let {demanda, costoDePreparacion, costoDeAlmacenamiento, tiempoDeEntrega,longitudCiclo, cantidadEconomica, mostrarResultados} = this.state;
        let combinacion1 = [cantidadEconomica, demanda] //Calculamos longitudCiclo
        let combinacion2 = [longitudCiclo, demanda] //Calculamos cantidadEconomica
        let combinacion3 = [cantidadEconomica, longitudCiclo] //Calculamos demanda con ecuacion simple

        let control1 = combinacion1.every(caso => caso); //Si devuelve true es porque todos los elementos del arreglo estan cargados 
        let control2 = combinacion2.every(caso => caso);
        let control3 = combinacion3.every(caso => caso);
        
        let combinacion4 = [demanda,costoDePreparacion,costoDeAlmacenamiento] //Calculamos cantidadEconomica y*
        let combinacion5 = [demanda,costoDePreparacion,cantidadEconomica] //Calculamos costoDeAlmacenamiento h
        let combinacion6 = [costoDeAlmacenamiento,costoDePreparacion,cantidadEconomica] //Calculamos demanda D
        let combinacion7 = [demanda,costoDeAlmacenamiento,cantidadEconomica] //Calculamos costoDePreparacion k
        let control4 = combinacion4.every(caso => caso); //Si devuelve true es porque todos los elementos del arreglo estan cargados 
        let control5 = combinacion5.every(caso => caso);
        let control6 = combinacion6.every(caso => caso);
        let control7 = combinacion7.every(caso => caso);


        if((control4 || control5 || control6 || control7) && tiempoDeEntrega){
            if(control1){ //CON ESTOS IF CONTROLAMOS LOS CALCULOS PARA LA PRIMER ECUACION
                //Como aca tendriamos que calcular longitud, o sea t0, como siempre necesitamos calcularlo lo sacamos de aca y pusimos abajo afuera del if               
            } else if (control2){
                this.calcularInventarioOptimoEcuacionSimple()
                
            } else if(control3){
                this.calcularDemandaEcuacionSimple()    
            }
    
            if(control4){
                let cantidadEconomic = this.calcularInventarioOptimo();
                this.calcularLongitud(cantidadEconomic)   
            }else if (control5){
                this.calcularCostoAlmacenamiento()
               
            }else if(control6){
                this.calcularDemanda()
                
            }else if (control7){
                this.calcularCostoPorPedido()
                
            }
            
            setTimeout(() => {
                this.calcularLongitud()
                this.calcularCostoInventario();
                this.calcularPuntoDeReorden();
            }, 1);
            
            this.setState({mostrarResultados: true})
            this.setState({incompleto: false})

        }else{
            this.setState({incompleto:true})
        } 
               
    }

    render() { 
        let {demanda, costoDePreparacion, costoDeAlmacenamiento, tiempoDeEntrega,unidadesDemanda, unidadesAlmacenamiento, incompleto} = this.state;
        let {mostrarResultados, cantidadEconomica, longitudCiclo, puntoDeReorden, TCU} = this.state;
        //let costo = this.calcularCosto();
        

        //AGREGAMOS ESTA FUNCION PARA CONTROLAR QUE DEPENDIENDO DEL TIPO DE POLITICA IMPRIMA UNA COSA O LA OTRA
        let controlarPolitica = (tiempoDeEntrega > longitudCiclo) ? (
        <Col>
            <Card body inverse color="primary" style={{marginTop:10, padding: '5px 0 0 0'}}>
                <CardText>
                <h5>Pedir {Number(cantidadEconomica).toFixed(2)} {unidadesDemanda} cuando el inventario baje de {Number(puntoDeReorden).toFixed(2)} {unidadesDemanda}</h5>
                </CardText>
            </Card>   
        </Col>) : //Si no
        (
            <Col>
                <Card body inverse color="primary" style={{marginTop:10, padding: '5px 0 0 0'}}>
                    <CardText>
                        <h5>Pedir {Number(cantidadEconomica).toFixed(2)} {unidadesDemanda} cada {Number(longitudCiclo).toFixed(2)} {unidadesAlmacenamiento}</h5>
                    </CardText>
                </Card>   
            </Col>
        )
        

        
        return (
            <Container fluid className="App"> 
            <Row>
              <Col xs={12} md={8} className="my-4 mx-auto">
                <Jumbotron>
                    <Col>
                        <h2>Modelo Clásico con Cantidad Económica de Pedido</h2><br></br>                   
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
                                <InputGroupText><b>{"h"}</b></InputGroupText>
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
                        <InputGroup className="mt-3" id={"tiempoDeEntrega"} key={"tiempoDeEntrega"}>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText name="tiempoDeEntrega" id="tiempoDeEntrega">
                                <b>{"L"}</b>
                            </InputGroupText>
                            </InputGroupAddon>
                            <Input
                            type="number" min="0"
                            name={"tiempoDeEntrega"}
                            value={tiempoDeEntrega}
                            placeholder="Ingresar el tiempo de entrega"
                            aria-label="tiempoDeEntrega"
                            aria-describedby="tiempoDeEntrega"
                            onChange={this.handleInputChange}
                            />                        
                        </InputGroup>
                    </Col>
                    
                    
                    {mostrarResultados && (    //Si mostrarResultados esta en true que quiere decir que apreto el boton
                                                          
                    <Col>
                        <Row>
                            <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333', margin: 15}}>
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
                                                <td>t0*</td>
                                                <td>Longitud del Ciclo</td>
                                                <td className="text-left"><b>{Number(longitudCiclo).toFixed(2)} {unidadesAlmacenamiento}</b></td>
                                            </tr>
                                            <tr>
                                                <td>y*</td>
                                                <td>Cantidad Economica</td>
                                                <td className="text-left"><b>{Number(cantidadEconomica).toFixed(2)} {unidadesDemanda}</b></td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td>Punto de Reorden</td>
                                                <td className="text-left"><b>{Number(puntoDeReorden).toFixed(2)} {unidadesDemanda}</b></td>
                                            </tr>
                                            <tr>
                                                <td>TCU(y)</td>
                                                <td>Costo de Inventario</td>
                                                <td className="text-left"><b>${Number(TCU).toFixed(2)}</b></td>
                                            </tr>
                                            
                                        </tbody>
                                    </Table>
                                    {controlarPolitica}
                                </CardText>
                            </Card> 
                        </Row>
                        <Row className="justify-content-end" style={{justifyContent:"center"}}>
                            <Col>
                                <Card body>
                                    <Graph y={cantidadEconomica} t={longitudCiclo} puntoDeReorden={puntoDeReorden} yProm={Number(cantidadEconomica)/2} title={'Gráfico CEP'}/>
                                    <div className='text-center content-align-center'>   
                                        <div className='text-center content-align-center' style={{display:'flex', alignItems:'center', textAlign:'center'}}>
                                            <hr style={{borderTop: '2px dashed green', width:'50px', marginRight:10}}/><td>y* promedio</td>
                                            <hr style={{borderTop: '2px dashed blue', width:'50px', marginRight:10}}/><td>Punto de reorden</td>                                   
                                        </div>
                                    </div>
                                </Card>
                            </Col>
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


export default CantidadEconomicaPedido;