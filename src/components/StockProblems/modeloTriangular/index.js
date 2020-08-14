import React from "react";
import {Button, Container, Row, Col, Card, Jumbotron} from "reactstrap";
import {InputGroupText,InputGroup, Input,InputGroupAddon, CardText} from 'reactstrap';
import {Link} from 'react-router-dom';
import '../index.css'



class ModeloTriangular extends React.Component{
    constructor (props){
        super(props)
        this.state={
            demanda: null, //D
            CostoDeUnaOrden: null, //K
            costoDeAlmacenamiento: null,//c1
            costoDeAdquisicion: null, //b
            unidadesAlmacenamiento: null,
            unidadesDemanda:null,
            loteOptimo:null, //q
            tiempoEntrePedidos: null, //t0
            mostrarResultados: false,
            inputUpdated: false,
            incompleto: false,
            CTE: null,
            T:1,
            VelocidadDeProduccion:null,
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
        let {demanda, CostoDeUnaOrden,T, CostoUnitarioDeAlmacenamiento, loteOptimo,VelocidadDeProduccion} = this.state;
        let numerador, denominador, demandaUnitaria
        demandaUnitaria= (Number(demanda)/Number(T))
        numerador = ( 2*Number(CostoDeUnaOrden)*Number(demandaUnitaria)*Number(VelocidadDeProduccion) )
        denominador = ( Number(CostoUnitarioDeAlmacenamiento)*(Number(VelocidadDeProduccion)-Number(demandaUnitaria)) )
        loteOptimo = (Math.sqrt(numerador/denominador));
        
        //NO SE SI VA ESTO 
        if (loteOptimo>demanda){ //Si el q0 calculado es mas grande que la demanda entonces como lote optimo va la demanda
            this.setState({loteOptimo: demanda})
        }else{
            this.setState({loteOptimo})
        }
    }

    

    //CALCULAR CTE
    calcularCostoTotalEsperado(){
        let {costoDeAdquisicion,demanda,CostoDeUnaOrden,costoDeAlmacenamiento,T,VelocidadDeProduccion, loteOptimo} = this.state;
        let bD, costoTotalDePreparacion, costoTotalDeAlmacenamiento, demandaUnitaria

        
        costoTotalDePreparacion = (Number(demanda)/(loteOptimo*Number(CostoDeUnaOrden)))
        bD = (Number(costoDeAdquisicion)*Number(demanda))//Costo total del producto
        demandaUnitaria = ( Number(demanda)/Number(T) )
        costoTotalDeAlmacenamiento = ((loteOptimo*Number(T)*Number(costoDeAlmacenamiento)*(1-(demandaUnitaria/Number(VelocidadDeProduccion))))/2)
        
        this.setState({CTE: (costoTotalDePreparacion + bD + costoTotalDeAlmacenamiento) }) //CTEo
    }
    
    

    mostrarResultados = () => {
        let {demanda, costoDeAdquisicion, CostoUnitarioDeAlmacenamiento, CostoDeUnaOrden,VelocidadDeProduccion} = this.state;
        let combinacion1 = [demanda,CostoDeUnaOrden,CostoUnitarioDeAlmacenamiento,costoDeAdquisicion,VelocidadDeProduccion] //Cargamos un arreglo
        let control1 = combinacion1.every(caso => caso); //Si devuelve true es porque todos los elementos del arreglo estan cargados 
        
        if (control1){ //SI TODOS LOS CAMPOS ESTAN CARGADOS ENTONCES CALCULO TODO Y MUESTRO
            this.calcularTamañoDelLote(); //Calculo q0
            
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
        let {demanda,CTE,loteOptimo,tiempoEntrePedidos,CostoDeUnaOrden,costoDeAdquisicion, VelocidadDeProduccion} = this.state;
        let {incompleto,mostrarResultados,CostoUnitarioDeAlmacenamiento,unidadesDemanda,unidadesAlmacenamiento} = this.state;
        
 
        
        return (
            <Container fluid className="App"> 
            <Row>
              <Col xs={12} md={8} className="my-4 mx-auto">
                <Jumbotron>
                    <Col>
                        <h2>Modelo Triangular</h2><br></br>                   
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
                                <InputGroupText><b>{"P"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"VelocidadDeProduccion"}
                            value={VelocidadDeProduccion}
                            placeholder="Ingresar Velocidad De Produccion"
                            aria-label="VelocidadDeProduccion"
                            aria-describedby="VelocidadDeProduccion"
                            onChange={this.handleInputChange}
                            />
                        </InputGroup>
                    </Col>
                                        
                    {mostrarResultados && (    //Si mostrarResultados esta en true que quiere decir que apreto el boton y que todos los campos estan completos
                                                          
                    <Col>
                        <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333', marginTop:10}}>
                            <CardText>
                                <h6 style={{display:'inline'}}>El lote optimo es:</h6> <h5 style={{display:'inline'}}><b>{Number(loteOptimo).toFixed(2)} {unidadesDemanda}</b></h5><br></br>
                                <h6 style={{display:'inline'}}>El costo total esperado es:</h6> <h5 style={{display:'inline'}}><b>${Number(CTE).toFixed(2)}</b></h5><br></br>
                                {/*<Col>
                                    <Card body inverse color="primary" style={{marginTop:10, padding: '5px 0 0 0'}}>
                                        <CardText>
                                        <h5>Pedir {Number(loteOptimo).toFixed(2)} {unidadesDemanda} cada {Number(tiempoEntrePedidos).toFixed(2)} {unidadesAlmacenamiento}</h5>
                                        </CardText>
                                    </Card>   
                                </Col>*/}
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

export default ModeloTriangular;