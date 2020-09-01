import React from "react";
import {Button, Container, Row, Col, Card, CardText,Jumbotron} from "reactstrap";
import {InputGroupText,InputGroup, Input,InputGroupAddon} from 'reactstrap';
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
            unidadesDemanda:null,
            mostrarResultados: false,
            inputUpdated: false,
            incompleto: false,
            ym: null,
            loteOptimo:null,
            TCL: null,
            puntoDeReorden: null,
            
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
    
    //CALCULAMOS ym. LA FORMULA ES LA MISMA QUE y* EN EL CASO DE CEP
    calcularInventarioOptimo(){
        let {demanda, costoDePreparacion, costoDeAlmacenamiento, unidadCostoDeAlmacenamiento} = this.state;
        this.setState({ ym: ( Math.sqrt((2*Number(costoDePreparacion)*Number(demanda))/(Number(costoDeAlmacenamiento)*Number(unidadCostoDeAlmacenamiento))) ) }) //ym 
    }
    
    
    //CALCULAMOS EL COSTO CUANDO y <= q
    calcularCostoInventarioMenorIgual()
    {
        let {demanda, costoDePreparacion, costoDeAlmacenamiento, precioC1, ym} = this.state;
        return (Number(demanda)*Number(precioC1) + ((Number(costoDePreparacion)*Number(demanda))/(ym)) + (ym*Number(costoDeAlmacenamiento))/2 ) //TCU1(y)
    }
    
    //CALCULAMOS EL COSTO CUANDO y > q
    calcularCostoInventarioMayor()
    {
        let {demanda, costoDePreparacion, costoDeAlmacenamiento, precioC2, ym} = this.state;
        return (Number(demanda)*Number(precioC2) + ((Number(costoDePreparacion)*Number(demanda))/(ym)) + (ym*Number(costoDeAlmacenamiento))/2 )  //TCU2(y)
    }
    
    calcularCostoInventario(){
        let {limite, ym} = this.state;
        let TCU1, TCU2
        TCU1 = this.calcularCostoInventarioMenorIgual()
        TCU2 = this.calcularCostoInventarioMayor()
        
        if(ym<=limite){
            this.setState({ TCL: TCU1 })
        }
        else{
            this.setState({ TCL: TCU2 })
        }
    }
    
    calcularQ(){
        let {demanda,costoDeAlmacenamiento, costoDePreparacion, precioC2, TCL, ym} = this.state;
        let a = 1;
        let b = (2*(Number(precioC2)*Number(demanda)-TCL))/Number*(costoDeAlmacenamiento);
        let c = (2*Number(costoDePreparacion)*Number(demanda))/Number(costoDeAlmacenamiento)
        
        let valor1 = (-b+Math.sqrt(Math.pow(b,2)-4*a*c))/2*a;
        let valor2 = (-b+Math.sqrt(Math.pow(b,2)-4*a*c))/2*a;
    
        if(valor1 > ym){
            this.setState({ punto: valor1 })
        }else{
            this.setState({ punto: valor2 })
        }
    }
    
    tamañoPedido(){
        let {limite, ym, punto} = this.state;
       
        if((limite>ym) & (limite<punto))
        {
            this.setState({ loteOptimo: limite })
        }else{
            this.setState({ loteOptimo: ym })
        }
    }

    calcularPuntoDeReorden(){
        let {demanda, tiempoDeEntrega} = this.state
        this.setState({puntoDeReorden: (Number(demanda)*Number(tiempoDeEntrega) ) })
    }


    mostrarResultados = () => {
        
        let {demanda, costoDePreparacion, costoDeAlmacenamiento, tiempoDeEntrega, precioC1, precioC2, limite} = this.state;
        let combinacion1 = [demanda, costoDePreparacion, costoDeAlmacenamiento, tiempoDeEntrega, precioC1, precioC2, limite] //Cargamos un arreglo
        let control1 = combinacion1.every(caso => caso); //Si devuelve true es porque todos los elementos del arreglo estan cargados 
        
        if (control1){ //SI TODOS LOS CAMPOS ESTAN CARGADOS ENTONCES CALCULO TODO Y MUESTRO
            this.calcularInventarioOptimo() //Primer paso: calculamos ym
            this.calcularCostoInventarioMenorIgual() //TCU1
            this.calcularCostoInventarioMayor() //TCU2
            
            setTimeout(() => {
                this.calcularCostoInventario() //TCL
                this.calcularQ() //Q
                this.tamañoPedido() //loteOptimo o y*   
            }, 1);

            this.setState({mostrarResultados: true})
            this.setState({incompleto: false})

        }else{
            this.setState({incompleto:true}) //PONGO A INCOMPLETO EN TRUE Y MUESTRO LA ALERTA DE COMPLETAR CAMPOS
        }
        
        
                 
    }

    render() { 
        let {demanda, costoDePreparacion, costoDeAlmacenamiento,unidadesDemanda, loteOptimo, unidadesAlmacenamiento, incompleto} = this.state;
        let {TCL, mostrarResultados, tiempoDeEntrega, puntoDeReorden} = this.state;
 
        
        return (
            <Container fluid className="App"> 
            <Row>
              <Col xs={12} md={8} className="my-4 mx-auto">
                <Jumbotron>
                    <Col>
                        <h2>Modelo CEP Discontinuidades de Precio</h2><br></br>                   
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
                                <InputGroupText><b>{"h"}</b></InputGroupText>
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
                            <InputGroupText><b>{"L"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"tiempoDeEntrega"}
                            value={tiempoDeEntrega}
                            placeholder="Ingresar el tiempo de entrega."
                            aria-label="tiempoDeEntrega"
                            aria-describedby="tiempoDeEntrega"
                            onChange={this.handleInputChange}
                            />            
                        </InputGroup>
                    </Col>
                    
                    <Col>
                    <InputGroup className="mt-3">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText name="precioC1" id="precioC1"><b>{"c1"}</b></InputGroupText>
                        </InputGroupAddon>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>{"$"}</InputGroupText>
                        </InputGroupAddon>
                        <Input
                        name={"precioC1"}
                        placeholder="Ingresar el precio 1"
                        aria-label="precioC1"
                        aria-describedby="precioC1"
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
                            name={"precioC2"}
                            placeholder="Ingresar el precio 2"
                            aria-label="precioC2"
                            aria-describedby="precioC2"
                            onChange={this.handleInputChange}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><b>{"q"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"limite"}
                            placeholder="Ingresar el limite q"
                            aria-label="limite"
                            aria-describedby="limite"
                            onChange={this.handleInputChange}
                            />
                        </InputGroup>
                    </Col>
                                        
                    {mostrarResultados && (    //Si mostrarResultados esta en true que quiere decir que apreto el boton y que todos los campos estan completos
                                                          
                    <Col>
                        <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333', marginTop:10}}>
                            <CardText>
                                <h6 style={{display:'inline'}}>El lote optimo (q0) es:</h6> <h5 style={{display:'inline'}}><b>{Number(loteOptimo).toFixed(2)}</b></h5><br></br>
                                <h6 style={{display:'inline'}}>El costo total esperado (CTE) es:</h6> <h5 style={{display:'inline'}}><b>${Number(TCL).toFixed(2)}</b></h5><br></br>
                                <Col>
                                    <Card body inverse color="primary" style={{marginTop:10, padding: '5px 0 0 0'}}>
                                        <CardText>
                                        <h5>Pedir {Number(loteOptimo).toFixed(2)} {unidadesDemanda} cuando el inventario baje de {Number(puntoDeReorden).toFixed(2)} {unidadesDemanda}</h5>
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

export default modelStockSimple;