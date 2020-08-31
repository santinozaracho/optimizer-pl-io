import React from "react";
import { Button, Container, Row, Col, Card, Jumbotron, Table} from "reactstrap";
import {InputGroupText,InputGroup, Input,InputGroupAddon, CardText} from 'reactstrap';
import {Link} from 'react-router-dom';
import Restricciones from './restriccion';
import '../index.css'



class ModeloSimpleSinAgotamiento extends React.Component{
    constructor (props){
        super(props)
        this.state={
            demanda: 0, //D
            CostoDeUnaOrden: 0, //K
            costoDeAlmacenamiento: 0,//c1
            costoDeAdquisicion: null, //b en este caso son varios pero empezamos con 1 (por las restricciones)
            porcentajeAplicadoProducto: 0,
            StockDeProteccion:0,// c2
            unidadesAlmacenamiento: 0,
            unidadesDemanda:0,
            loteOptimo:0, //q
            tiempoEntrePedidos: 0, //t0
            T:0,
            incompleto: false,
            mostrarResultados: false, // bandera para cuando tener disponible los resultados y mostrar el mensaje de abajo
            inputUpdated: false,
            CTE: 0,
            stockAlmacenado:0,
            porcentajeCapitalInmobilizado:0, //p
            listOfElements: [],
            costosDeAdquisicion: null,
            cantRestricciones: 0,
            rest: [],
            rangos: []
        }
    }

    handleInputRestriccionesValueChange = (event) => {
        var objectChildren = event.target;
        var newListOfElements = this.state.listOfElements.slice();

        if (newListOfElements.length < 1) {
            var object = {
                name: null, 
                value: null
            };
            object.name = event.target.name;
            object.value = event.target.value;
            newListOfElements.push(object)
            this.setState({listOfElements: newListOfElements});
        } else {
            var results = false;
            var position;
            for(var i = 0; i < newListOfElements.length; i++) {
                if(newListOfElements[i].name == objectChildren.name) {
                    results = true;
                    position = i;
                    break;
                }
            }

            if (results) {
                var object = newListOfElements[position];
                object.value = objectChildren.value;
                newListOfElements[position] = object;
                this.setState({listOfElements: newListOfElements});
            } else {
                var object = {
                    name: null, 
                    value: null
                };
                object.name = objectChildren.name;
                object.value = objectChildren.value;
                newListOfElements.push(object)
                this.setState({listOfElements: newListOfElements});
            }
        }
    } 

    handleInputRestriccionesChange = (event) => {
        let restricciones = [];
        if (event.target.value > 0){
            let cant = event.target.value;
            for (let index = 0; index < event.target.value; index++) {
                let clase = "";
                let value = undefined;
                if (index == (cant-1)) { 
                    console.log("holaaaa", cant--)
                    clase="last";
                    value= 10000000000;
                }
                restricciones.push(<Restricciones index={index} inputValue={this.handleInputRestriccionesValueChange} clase={clase} valueRes={value} />) 
            }
        }
        this.setState({
            [event.target.name]: event.target.value,
            inputUpdated: true,
            rest: restricciones
        })
    }

    switchWithAtributo(atributo, value, object) {
        switch (atributo) {
            case "inicio":
                object.inicio = value;
                break;
            case "fin":
                object.fin = value;
                break;
            case "costoDeAdquisicion":
                object.costoAdquisicion = value;
                break;   
            default:
                break;
        }
        return object;
    }

    handleRangosAndCostosDeAdquisicion() {
        let { listOfElements , rangos} = this.state;
        var atributo, subArrays;
        for (let index = 0; index < listOfElements.length; index++) {
            var element = listOfElements[index];
            var object = {
                inicio: null,
                fin: null,
                costoAdquisicion: null
            }
            subArrays = element.name.split('-');
            atributo = String(subArrays[0]);

            object = this.switchWithAtributo(atributo, element.value, object);
            index++;
            element = listOfElements[index];
            if (index == (listOfElements.length - 1)) {
                atributo = "fin";
                object = this.switchWithAtributo(atributo, 10000000000, object);
            } else {
                subArrays = element.name.split('-');
                atributo = String(subArrays[0]);
                object = this.switchWithAtributo(atributo, element.value, object);
                index++;
                element = listOfElements[index];
            }
            if (element) {
                subArrays = element.name.split('-');
                atributo = String(subArrays[0]);
                object = this.switchWithAtributo(atributo, element.value, object);
                rangos.push(object);
                this.setState({rangos: rangos});
            }
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
    
    determinarLoteOptimo() {
        let {rangos} = this.state;
        rangos = rangos.sort((a, b) => a.costoAdquisicion - b.costoAdquisicion);
        for (var i = 0; i < rangos.length; i++) {
            const costoAdquisicion = rangos[i].costoAdquisicion;
            this.setState({costoDeAdquisicion: costoAdquisicion});
            let loteOptimo = this.calcularTamañoDelLote(costoAdquisicion);
            let rango = rangos[i];
            console.log(rangos, "rangos")
            if (loteOptimo > rango.inicio && loteOptimo < rango.fin) {
                let result = {};
                result.loteOptimo = loteOptimo;
                let costoTotalEsperado = this.calcularCostoTotalEsperado(costoAdquisicion, loteOptimo);
                result.cte = costoTotalEsperado;
                let rangosSobrantes = [];
                for(var j = i ; j > -1; j--) {
                    let elementoSobrante = {};
                    if (j == i) {
                        elementoSobrante.loteOptimo = loteOptimo;
                        elementoSobrante.costoTotalEsperado = costoTotalEsperado;
                        rangosSobrantes.push(elementoSobrante);
                    } else {
                        let rangoSobrante = rangos[j];
                        let costoAdquisicionSobrante = rangos[j].costoAdquisicion;
                        let costoTotalEsperadoSobrante = this.calcularCostoTotalEsperado(costoAdquisicionSobrante, rangoSobrante.inicio);
                        elementoSobrante.loteOptimo = Number(rangoSobrante.inicio);
                        elementoSobrante.costoTotalEsperado = Number(costoTotalEsperadoSobrante);
                        rangosSobrantes.push(elementoSobrante);
                    }
                }
                result.rangosSobrantes = rangosSobrantes;
                return result;
            } 
        }
    }

    //q0
    calcularTamañoDelLote(costoAdquisicion){
        let {demanda, CostoDeUnaOrden,T, CostoUnitarioDeAlmacenamiento, porcentajeCapitalInmobilizado, costoDeAlmacenamiento, porcentajeAplicadoProducto} = this.state;
        let loteOptimo;
        porcentajeCapitalInmobilizado = Number(porcentajeCapitalInmobilizado)/100;
        porcentajeAplicadoProducto = Number(porcentajeAplicadoProducto)/100;
        console.log(demanda, "demanda")
        console.log(CostoDeUnaOrden, "costo de una orden")
        console.log(T, "T")
        
        console.log(porcentajeCapitalInmobilizado, "porcentaje capital inmobilizado")
        console.log(costoAdquisicion, "costo de adquisicion")
        
        console.log(porcentajeAplicadoProducto, "porcentaje aplicado al producto")
        if (Number(porcentajeAplicadoProducto) > 0) {
            costoDeAlmacenamiento = Number(costoAdquisicion) * Number(porcentajeAplicadoProducto);
        }
        console.log(costoDeAlmacenamiento, "costo de almacenamiento")
        CostoUnitarioDeAlmacenamiento = ((Number(porcentajeCapitalInmobilizado)*Number(costoAdquisicion))+Number(costoDeAlmacenamiento))*T
        console.log(CostoUnitarioDeAlmacenamiento, "costo unitario de almacenamiento")
        loteOptimo = (Math.sqrt((2*Number(CostoDeUnaOrden)*Number(demanda))/(Number(CostoUnitarioDeAlmacenamiento))));
        console.log(loteOptimo, "Lote optimo")
        
        return loteOptimo;
    }
    
    //CALCULAR CTE
    calcularCostoTotalEsperado(costoDeAdquisicion, loteOptimo){
        let {demanda,CostoDeUnaOrden,costoDeAlmacenamiento,T, porcentajeCapitalInmobilizado, porcentajeAplicadoProducto} = this.state;
        let pp, sp, tp;
    
        porcentajeAplicadoProducto = Number(porcentajeAplicadoProducto)/100;
        porcentajeCapitalInmobilizado = Number(porcentajeCapitalInmobilizado)/100;
        if (Number(porcentajeAplicadoProducto) > 0) {
            costoDeAlmacenamiento = Number(costoDeAdquisicion) * Number(porcentajeAplicadoProducto);
        }
        pp = ((Number(demanda)*Number(CostoDeUnaOrden))/Number(loteOptimo));
        sp = (Number(costoDeAdquisicion)*Number(demanda));
        tp = ( (1/2)*Number(loteOptimo)*Number(T)*((Number(porcentajeCapitalInmobilizado)*Number(costoDeAdquisicion))+Number(costoDeAlmacenamiento)));
        let CTEO = (pp + sp + tp);
        return CTEO;
    }
    
    mostrarResultados = () => {
        let {demanda, rangos, costoDeAlmacenamiento, CostoDeUnaOrden} = this.state;
        let combinacion1 = [demanda,CostoDeUnaOrden,costoDeAlmacenamiento] //Cargamos un arreglo
        let control1 = combinacion1.every(caso => caso); //Si devuelve true es porque todos los elementos del arreglo estan cargados 
        
        if(this.state.rangos.length < 1){
            this.handleRangosAndCostosDeAdquisicion();
        }
            
        if (control1 && rangos.length > 1){ //SI TODOS LOS CAMPOS ESTAN CARGADOS ENTONCES CALCULO TODO Y MUESTRO    
            var result = this.determinarLoteOptimo();
            let object = result.rangosSobrantes.sort((a, b) => a.costoTotalEsperado - b.costoTotalEsperado)[0];
            this.setState({loteOptimo: object.loteOptimo});
            this.setState({CTE: object.costoTotalEsperado}); //CTEo
            this.setState({mostrarResultados: true});
            this.setState({incompleto: false});
            this.setState({rangos: []});

        }else{
            this.setState({incompleto:true}) //PONGO A INCOMPLETO EN TRUE Y MUESTRO LA ALERTA DE COMPLETAR CAMPOS
        }            
    }

    render() { 
        let {cantRestricciones, CTE,loteOptimo,tiempoEntrePedidos, incompleto,mostrarResultados,unidadesDemanda,unidadesAlmacenamiento} = this.state;
        
        return (
            <Container fluid className="App"> 
            <Row>
              <Col xs={12} md={8} className="my-4 mx-auto">
                <Jumbotron>
                    <Col>
                        <h2>Modelo Simple Sin Agotamiento</h2><br></br>                   
                    </Col>
                    
                    <Col> 
                        <InputGroup className="mt-3">
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText><b>{"Demanda (D)"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            className="input-demanda"
                            name={"demanda"}
                            aria-label="Demanda"
                            aria-describedby="demanda"
                            onChange={this.handleInputChange}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><b>{"Costo de Preparación (K)"}</b></InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>{"$"}</InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"CostoDeUnaOrden"}
                            aria-label="CostoDeUnaOrden"
                            aria-describedby="CostoDeUnaOrden"
                            onChange={this.handleInputChange}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><b>{"Porcentaje de Capital Inmovilizado (p)"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"porcentajeCapitalInmobilizado"}
                            aria-label="porcentajeCapitalInmobilizado"
                            aria-describedby="porcentajeCapitalInmobilizado"
                            onChange={this.handleInputChange}
                            />
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>{"%"}</InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-3">
                            <InputGroupAddon className="unidadesAlmacenamiento" addonType="prepend">
                                <InputGroupText><b>{"Tiempo total (T)"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            className=""
                            name={"T"}
                            onChange={this.handleInputChange}
                            />
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>{"Años"}</InputGroupText>
                            </InputGroupAddon>

                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><b>{"Costo de Almacenamiento (c1')"}</b></InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>{"$"}</InputGroupText>
                            </InputGroupAddon>
                            <Input
                            name={"costoDeAlmacenamiento"}
                            aria-label="costoDeAlmacenamiento"
                            aria-describedby="costoDeAlmacenamiento"
                            onChange={this.handleInputChange}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="porcentaje">
                            <InputGroupAddon addonType="prepend">
                                    <InputGroupText><b>{"Porcentaje aplicado al costo del producto"}</b></InputGroupText>
                                </InputGroupAddon>
                                <Input
                                name={"porcentajeAplicadoProducto"}
                                aria-label="porcentajeAplicadoProducto"
                                aria-describedby="porcentajeAplicadoProducto"
                                onChange={this.handleInputChange}
                                />
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>{"%"}</InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mt-3">
                            <InputGroupAddon className="unidadesAlmacenamiento" addonType="prepend">
                                <InputGroupText><b>{"Cantidad de restricciones"}</b></InputGroupText>
                            </InputGroupAddon>
                            <Input
                            className=""
                            name={"cantRestricciones"}
                            onChange={this.handleInputRestriccionesChange}
                            />
                        </InputGroup>
                    </Col>
                    {cantRestricciones > 0 && (
                        this.state.rest)
                    }
                                       
                    {mostrarResultados && (    //Si mostrarResultados esta en true que quiere decir que apreto el boton y que todos los campos estan completos
                    <Col className="resul">        
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
                                    <td>q0</td>
                                    <td>Lote Óptimo</td>
                                    <td className="text-left"><b>{Math.round(Number(loteOptimo))}</b></td>
                                </tr>
                                <tr>
                                    <td>CTE</td>
                                    <td>Costo Total Esperado</td>
                                    <td className="text-left"><b>$ {Number(CTE).toFixed(2)}</b></td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>                                    
                    )}
                           
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