import React from 'react';
import {ButtonGroup, Button, Container, Row, Card,CardBody,CardHeader,CardTitle,Alert,InputGroup,InputGroupAddon,InputGroupText, Input} from 'reactstrap';



class Configuration extends React.Component{
    constructor (props){
        super(props);
        this.state={faltaDescrip:''};
    }
    //Funcion que permite validar si se ingresaron todos los cambios correspondientes en la etapa
    isValidated(){
        let {variables,restricciones} = this.props.status;
        let variablesDescriptionsMin = variables.filter( va => va.descripcion !== '');
        let restriccionesDescriptionsMin = restricciones.filter(re => re.descripcion !=='')
        if (variablesDescriptionsMin.length > 1 &  restriccionesDescriptionsMin.length > 0 ) { 
            this.props.lastStep(1)
            return true
        }else {

            if (variablesDescriptionsMin < 2 ){
                this.setState({faltaDescrip:'Dale no seas Guampa poneme como minimo 2 variables'});
                
            }else{
                this.setState({faltaDescrip:'Poneme Alguna Restri pue '});
            }
           
            return false
        }
    }
    //Funcion que se encarga de manejar las modificaciones en las variables.
    handlerInputVar = event => {
        let {value, name} = event.target;
        let {variables} = this.props.status;
        //Asignamos Valor y reasignamos el indice
        variables[name].xi = name; 
        variables[name].descripcion = value;
        if (name>1 && value ==='') {
            //Si la desc esta vacia eliminamos la variable
            variables.splice(name,1)
        }
        //Pasasamos al Padre los cambios realizados en la variable
        this.props.handleVariables(variables);
        //llamamos a la funcion que se encarga de generar nuevas variables.
        this.handleNewsVar(this.props.status.method)      
    }
    //Funcion que se encarga de manejar las modificaciones de restricciones.
    handlerInputRes = event => {
        let {value, name} = event.target;
        let {restricciones} = this.props.status;
        //Asignamos el nuevo cambio 
        restricciones[name].ri = name 
        restricciones[name].descripcion = value;
        if (value === '') {
            //si el cambio es dejarla vacia entonces eliminamos la restriccion
            restricciones.splice(name,1);     
        }
        //pedimos al padre que almacene los cambios
        this.props.handleRestricciones(restricciones);
        //Llamamos a generar si corresponde nueva restriccion
        this.handleNewsRes()
    }
    //Funcion que se encarga de Añadir una restriccion si es necesario.
    handleNewsRes = () => {
        let {restricciones} = this.props.status;
        //Contador de Rescciones sin descripciones.
        let counterWitheRes = restricciones.filter( element => element.descripcion.length === 0).length;
        //Si el contador de restricciones vacias es igual a 0 entonces agregamos una restriccion mas.
        if (counterWitheRes === 0 ) {
            restricciones.push({ri:restricciones.length,descripcion:'',coeficientes:[],eq:'>=',derecha:''})
            this.props.handleRestricciones(restricciones);
        }
    }
    //Funcion que se encarga de Añadir una Variable si es necesario.
    handleNewsVar = method => {
        let {variables} = this.props.status;
        if (method === 'simplex') {
            //Si el metodo es Simplex, se permite agregar mas de dos variables.
            let counterWitheVar = variables.filter( element => element.descripcion.length === 0).length;
            //Si la cantidad de Variables Libres es igual a 0 se agrega una mas.
            if (counterWitheVar === 0 ) {  
                variables.push({xi:variables.length,descripcion:'',coeficiente:''})
                this.props.handleVariables(variables);    
            }
        }else{
            //Si no lo es, aseguramos que existan solo dos, entonces eliminamos lo que este de mas.
            if(variables.length > 2) {     
                variables.splice(2)
                this.props.handleVariables(variables);
            }
        }
        

    }
    
    render () {
        //Obtenemos de las props, las varaibles y restricciones.
        let {variables} = this.props.status;
        let {restricciones} = this.props.status;
        // Generamos los inputs para las Variables
        let variablesARenderizar = variables
        .map( (variable,index) => 
                <InputGroup className="mt-1" key={'VTD'+index}>
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText name="xi" id="variable">{"X"+index}</InputGroupText>
                    </InputGroupAddon>
                    <Input
                        name={index}
                        placeholder="Descripcion de la Variable"
                        aria-label="Descripcion"
                        aria-describedby="variable"
                        onChange={this.handlerInputVar}
                        value={variable.descripcion}/>
                </InputGroup>);
        //Generamos los imputs para las restricciones
        let restriccionesARenderizar = restricciones
        .map( (restriccion,index) => 
                <InputGroup className="mt-1" key={'RTD'+index}>
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText name="ri" id="restriccion">{"R"+index}</InputGroupText>
                    </InputGroupAddon>
                        <Input
                            name={index}
                            placeholder="Descripcion de la Restriccion"
                            aria-label="Descripcion"
                            aria-describedby="restriccion"
                            onChange={this.handlerInputRes}
                            value={restriccion.descripcion}/>        
                </InputGroup>);
        let buttonsMethods = (<ButtonGroup>
                                <Button onClick={() => {this.props.handleMethod('graph');this.handleNewsVar('graph')}} 
                                        active={this.props.status.method === 'graph'}
                                        color='primary'>
                                    GRAFICO
                                </Button>
                                <Button onClick={() => {this.props.handleMethod('simplex');this.handleNewsVar('simplex')}} 
                                        active={this.props.status.method === 'simplex'}
                                        color='primary'>
                                    SIMPLEX
                                </Button>
                            </ButtonGroup>)
        let buttonsOptType = (<ButtonGroup>
                                <Button onClick={() => this.props.handleObjective('max')} 
                                        active={this.props.status.objective === 'max'}
                                        color='primary'>
                                    Maximizacion
                                </Button>
                                <Button onClick={() => this.props.handleObjective('min')} 
                                        active={this.props.status.objective === 'min'}
                                        color='primary'>
                                    Minimizacion
                                </Button>
                            </ButtonGroup>)
        return(
            <>
                <h3>Comenzamos Configurando nuestro Modelo:</h3>
                <Container>
                    <Row>         
                            <Card className="mx-auto">
                                <CardHeader>Metodo a Utilizar:</CardHeader>
                                <CardBody>{buttonsMethods}</CardBody>            
                            </Card>  

                            <Card className="mx-auto">
                                <CardHeader>Tipo de Optimizacion:</CardHeader>
                                <CardBody>{buttonsOptType}</CardBody>  
                            </Card>
                    </Row>
                    <Row>
                        <Card className="w-100 mt-3">
                            <CardHeader><CardTitle className="text-left" ><h4>Variables:</h4></CardTitle></CardHeader>       
                            <CardBody>
                                {variablesARenderizar}
                            </CardBody>
                        </Card>
                    </Row>
                    <Row>
                        <Card className="w-100 mt-3">
                            <CardHeader><CardTitle className="text-left" ><h4>Restricciones:</h4></CardTitle></CardHeader>       
                            <CardBody>
                                {restriccionesARenderizar}
                            </CardBody>
                        </Card>
                    </Row>
                    {this.state.faltaDescrip !== '' && 
                        <Row className="mt-3">
                            <Alert className="mx-auto" color="danger">{this.state.faltaDescrip}</Alert>
                        </Row>}
                </Container>
            </>
        )
    }
}

export default Configuration;