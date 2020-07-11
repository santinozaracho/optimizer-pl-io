import React from "react";
import { ButtonGroup, Button, Container, Row, Col, Card, CardBody, CardHeader, CardTitle, Jumbotron, Dropdown, DropdownItem, ButtonDropdown, DropdownMenu, DropdownToggle} from "reactstrap";
import {InputGroupText,InputGroup, Input,InputGroupAddon,PopoverBody, CardText} from 'reactstrap';
import {Link} from 'react-router-dom';
import '../index.css'
import { Variable } from "javascript-lp-solver/src/expressions";



class modelStockSimple extends React.Component{
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
            this.controlarCasos();
            this.calcularResultados()
        } 
    }

    handleInputChange = (event) =>{
        this.setState({
            [event.target.name]: event.target.value,
            inputUpdated: true,
        })
    }
    
    //CALCULAR t0*
    calcularLongitud(){
        let {demanda, cantidadEconomica} = this.state;
        this.setState({longitudCiclo:(Number(cantidadEconomica)/Number(demanda))}); //to*
        console.log(demanda, cantidadEconomica)
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
        this.setState({cantidadEconomica:(Math.sqrt((2*Number(costoDePreparacion)*Number(demanda))/(Number(costoDeAlmacenamiento)*unidadCostoDeAlmacenamiento)))}); //y*
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

    
    controlarCasos = () => { //Con esta funcion vamos a controlar que datos nos ingresa el usuario para ver que calculamos
        this.setState({mostrarResultados:false})
    }

    mostrarResultados = () => {
        let {demanda,tiempoDeEntrega,longitudCiclo, costoDeAlmacenamiento, costoDePreparacion, cantidadEconomica} = this.state;
        let controlCampos = [demanda,tiempoDeEntrega,longitudCiclo, costoDeAlmacenamiento, costoDePreparacion, cantidadEconomica]
        let camposLlenos = !controlCampos.every(caso => caso); //Si todos esos campos no estan llenos faltan completar campos
        
        if(camposLlenos){
            this.setState({incompleto:true})
        }else{
            this.setState({mostrarResultados: true})
            this.setState({incompleto: false})
        }
    }

    calcularResultados = () => {
        let {demanda, costoDePreparacion, costoDeAlmacenamiento, tiempoDeEntrega,longitudCiclo, cantidadEconomica, mostrarResultados} = this.state;
        let combinacion1 = [cantidadEconomica, demanda] //Calculamos longitudCiclo
        let combinacion2 = [longitudCiclo, demanda] //Calculamos cantidadEconomica
        let combinacion3 = [cantidadEconomica, longitudCiclo] //Calculamos demanda con ecuacion simple

        let control1 = combinacion1.every(caso => caso); //Si devuelve true es porque todos los elementos del arreglo estan cargados 
        let control2 = combinacion2.every(caso => caso);
        let control3 = combinacion3.every(caso => caso);
        
        if(control1){ //CON ESTOS IF CONTROLAMOS LOS CALCULOS PARA LA PRIMER ECUACION
            this.calcularLongitud()
            
        } else if (control2){
            this.calcularInventarioOptimoEcuacionSimple()
            
        } else if(control3){
            this.calcularDemandaEcuacionSimple()
            
        }

        let combinacion4 = [demanda,costoDePreparacion,costoDeAlmacenamiento] //Calculamos cantidadEconomica y*
        let combinacion5 = [demanda,costoDePreparacion,cantidadEconomica] //Calculamos costoDeAlmacenamiento h
        let combinacion6 = [costoDeAlmacenamiento,costoDePreparacion,cantidadEconomica] //Calculamos demanda D
        let combinacion7 = [demanda,costoDeAlmacenamiento,cantidadEconomica] //Calculamos costoDePreparacion k
        let control4 = combinacion4.every(caso => caso); //Si devuelve true es porque todos los elementos del arreglo estan cargados 
        let control5 = combinacion5.every(caso => caso);
        let control6 = combinacion6.every(caso => caso);
        let control7 = combinacion7.every(caso => caso);


        if(control4){
            this.calcularInventarioOptimo();
            this.calcularLongitud()
            
        }else if (control5){
            this.calcularCostoAlmacenamiento()
            this.calcularLongitud()
           
        }else if(control6){
            this.calcularDemanda()
            this.calcularLongitud()
            
        }else if (control7){
            this.calcularCostoPorPedido()
            this.calcularLongitud()
            
        }

        this.calcularCostoInventario();
        this.calcularPuntoDeReorden();
    }

    render() { 
        let {demanda, costoDePreparacion, costoDeAlmacenamiento, tiempoDeEntrega,unidadesDemanda, unidadesAlmacenamiento, incompleto} = this.state;
        let {mostrarResultados, cantidadEconomica, longitudCiclo, puntoDeReorden, TCU} = this.state;
        //let costo = this.calcularCosto();
        

        //AGREGAMOS ESTA FUNCION PARA CONTROLAR QUE DEPENDIENDO DEL TIPO DE POLITICA IMPRIMA UNA COSA O LA OTRA
        let controlarPolitica = (tiempoDeEntrega > longitudCiclo) ? 
        <h4>Pedir {Number(cantidadEconomica).toFixed(2)} {unidadesDemanda} cuando el inventario baje de {Number(puntoDeReorden).toFixed(2)} {unidadesDemanda}</h4> : <h4>Pedir {Number(cantidadEconomica).toFixed(2)} {unidadesDemanda} cada {Number(longitudCiclo).toFixed(2)} {unidadesAlmacenamiento}</h4>; 
        
              
        
        return (
            <Container fluid className="App"> 
            <Row>
              <Col xs={12} md={8} className="my-4 mx-auto">
                <Jumbotron>
                    <Col>
                        <h2>Modelo clasico con cantidad economica de pedido</h2><br></br>                   
                    </Col>
                    {/*<Col>
                    <div>
                        <div className="justify-content-center">
                            <div className="info-descarga">
                            <i class="fas fa-info-circle"></i>
                            <a>Las números decimales ingresar con . (Ejemplo: 0.02)</a>
                            </div>
                        </div>
                    </div>
                    </Col>*/}
                   
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
                            placeholder="Ingresar las unidades"
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
                        <InputGroup className="mt-3" id={"tiempoDeEntrega"} key={"tiempoDeEntrega"}>
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText name="tiempoDeEntrega" id="tiempoDeEntrega">
                                <b>{"L"}</b>
                            </InputGroupText>
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
                            <InputGroupText><b>{"t0*"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"longitudCiclo"}
                            value={longitudCiclo}
                            placeholder="Ingresar la longitud del ciclo."
                            onChange={this.handleInputChange}
                            />                        
                        </InputGroup>
                    </Col>

                    <Col>
                        <InputGroup className="mt-3">
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText><b>{"y*"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"cantidadEconomica"}
                            value={cantidadEconomica}
                            placeholder="Ingresar la cantidad economica."
                            onChange={this.handleInputChange}
                            />                        
                        </InputGroup>
                    </Col>
                    
                    
                    {mostrarResultados && (    //Si mostrarResultados esta en true que quiere decir que apreto el boton
                                                          
                    <Col>
                        <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333', marginTop:10}}>
                            <CardText>
                                <h4>El costo de inventario TCU(y) es: ${Number(TCU).toFixed(2)}</h4>
                                <h4>El punto de reorden es: {Number(puntoDeReorden).toFixed(2)}</h4>
                                {controlarPolitica}
                            </CardText>
                        </Card>   
                    </Col>)}
                           
                    {incompleto && (
                    <Card className="card-incompleto" body inverse color="danger" style={{paddingTop:0, paddingBottom:0, paddingLeft:0, paddingRight:0, marginTop:10}}>
                        <CardText>Complete más campos para poder realizar los cálculos y presione calcular.</CardText>
                    </Card>)}
                    
                    
                    <Row className="btn-volver justify-content-center">
                        <Link to='./'><Button>Volver</Button></Link>
                        <Button className="btn-Calcular" color="success" onClick={this.mostrarResultados}>Calcular</Button>
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

export default modelStockSimple;