import React from "react";
import { ButtonGroup, Button, Container, Row, Col, Card, CardBody, CardHeader, CardTitle, Jumbotron, Dropdown, DropdownItem, ButtonDropdown, DropdownMenu, DropdownToggle} from "reactstrap";
import {InputGroupText,InputGroup, Input,InputGroupAddon,PopoverBody} from 'reactstrap';
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
            caso0: false,
            caso1: false,
            caso2: false,
            caso3: false,
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
        //let inventario = this.calcularInventarioOptimo();//y*
        this.setState({longitudCiclo:(cantidadEconomica/Number(demanda))}); //to*
    }
    
    //CALCULAR y*
    calcularInventarioOptimoEcuacionSimple(){
        let {demanda, longitudCiclo} = this.state;
        this.setState({cantidadEconomica: (demanda*longitudCiclo)});
    }

    //CALCULAR D
    calcularDemanda(){
        let {cantidadEconomica, longitudCiclo} = this.state;
        this.setState({demanda: (cantidadEconomica/longitudCiclo)});
    }

    //CALCULAR y* PERO CON LA OTRA FORMULA (la formula de la raiz con K,D, h)
    calcularInventarioOptimo(){ 
        let {demanda, costoDePreparacion, costoDeAlmacenamiento, unidadCostoDeAlmacenamiento} = this.state;
        this.setState({cantidadEconomica:(Math.sqrt((2*Number(costoDePreparacion)*Number(demanda))/(Number(costoDeAlmacenamiento)*unidadCostoDeAlmacenamiento)))}); //y*
    }

    //CALCULAR h
    

    //CALCULAR D PERO CON LA OTRA FORMULA (la formula de la raiz con h, y*, k)

    //CALCULAR K


    //CALCULAR TCU(y)
    calcularCostoInventario()
    {
        let {demanda, costoDePreparacion, costoDeAlmacenamiento,unidadCostoDeAlmacenamiento, cantidadEconomica} = this.state;
        
        let promedioInventario = (cantidadEconomica / 2);
        return ((costoDePreparacion/(cantidadEconomica /demanda))+ (costoDeAlmacenamiento*unidadCostoDeAlmacenamiento*promedioInventario)); //TCL(y)
    }

    

    calcularPuntoDeReorden(){
        let {demanda,politica,tiempoDeEntrega, longitudCiclo} = this.state;
        
        if(tiempoDeEntrega > longitudCiclo){ //SI L > to*, calculamos Le
        //para politica 1 
            let n = Math.trunc(tiempoDeEntrega/longitudCiclo);//n
            let tiempoEfectivoDeEntrega= tiempoDeEntrega - (n * longitudCiclo);//Le
            return (tiempoEfectivoDeEntrega * demanda);//punto de reorden
        }else{
            //para politica 2

            return (tiempoDeEntrega * demanda); //punto de reorden en esta politica se calcula L*demanda
        }
    }

    
    controlarCasos = () => { //Con esta funcion vamos a controlar que datos nos ingresa el usuario para ver que calculamos
        this.controlarCaso0();
        this.setState({mostrarResultados:false})
    }

    controlarCaso0 = () =>{
        let {demanda, costoDePreparacion, costoDeAlmacenamiento, tiempoDeEntrega} = this.state;
        let camposAControlar = [demanda, costoDePreparacion, costoDeAlmacenamiento, tiempoDeEntrega]
        let caso0 = camposAControlar.every(campo => campo)

        this.setState({caso0});  
    }
    
   /*{ calcularResultados = () => {
        let {caso0, caso1, caso2, caso3} = this.state;
        let casosAControlar = [caso0, caso1, caso2, caso3]
        let mostrarResultados = casosAControlar.some(caso => caso); //Some will return true if any predicate is true
        let incompleto = !casosAControlar.some(caso => caso); //Every will return true if all predicate is true. 
                                                                //Como esta negado, si existe alguno que este en falso every va a devolver false, y entonces incompleto se pone en true y activa el mensaje
        this.setState({mostrarResultados, incompleto}) //Esto asigna mostrarResultados (la variable) a mostrarResultados el estado del objeto

    }*/ 

    calcularResultados = () => {
        let {demanda, costoDePreparacion, costoDeAlmacenamiento, tiempoDeEntrega,} = this.state;
        let controlar = [demanda, costoDePreparacion, costoDeAlmacenamiento, tiempoDeEntrega]
        let mostrarResultados = controlar.every(caso => caso); //Si devuelve true es porque todos estan cargados entonces mostramos 
        this.calcularInventarioOptimo();
        this.calcularLongitud();
        if(mostrarResultados){
            this.setState({mostrarResultados})
        } else{
            this.setState({incompleto:true})
        }
    }


    //El orden es el siguiente
    //Calculas y*
    //Despues el punto de reorden
    //Despues pones la politica que te toco (pueden ser 2 proximo commit te subo si queres los metodos que te definan)
    //y por ultimo el costo del inventario
    //si la politica es true entonces la politica es :
    //Pedir {CalcularInventarioOptimo()} unidades cada {CalcularLongitud()} unidades de tiempo
    //sino
    //Pedir la cantidad {CalcularInventarioOptimo()} siempre que la cantidad de inventario baje de {CalcularPuntoDeReorden()} unidades
    render() { 
        let {demanda, costoDePreparacion, costoDeAlmacenamiento, tiempoDeEntrega,unidadesDemanda, unidadesAlmacenamiento, incompleto} = this.state;
        let {caso0, caso1, caso2, caso3, mostrarResultados, cantidadEconomica, longitudCiclo, puntoDeReorden, TCU} = this.state;
        //let costo = this.calcularCosto();
        console.log(longitudCiclo)

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
                    
                    
                    {mostrarResultados && caso0 && (    //Si mostrarResultados esta en true que quiere decir que apreto el boton
                                                        //Y ademas los campos del caso0 estan completos mostramos esto  
                    <Col>
                        <h4>El costo de inventario TCU(y) es: ${Number(TCU).toFixed(2)}</h4>
                        <h4>El punto de reorden es: {Number(puntoDeReorden).toFixed(2)}</h4>
                        {controlarPolitica}
                    </Col>)
                    }
                    {caso1 && <h4>TU CASO ES EL 1</h4>}
                    {caso2 && <h4>TU CASO ES EL 2</h4>}
                    {caso3 && <h4>TU CASO ES EL 3</h4>}
                       
                    {incompleto && <h1>INCOMPLETO</h1>}
                    
                    
                    <Row className="btn-volver justify-content-center">
                        <Link to='./'><Button>Volver</Button></Link>
                        <Button className="btn-Calcular" color="success" onClick={this.calcularResultados}>Calcular</Button>
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