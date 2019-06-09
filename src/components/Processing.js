import React from 'react';
import {Container, Row, Card,CardBody,CardHeader,CardTitle,Alert,Button,Col,Collapse,ListGroup,ListGroupItem,Badge} from 'reactstrap';
import Restriccion from './elements/Restriccion';
import FuncionObj from './elements/FuncionObj';



class Processing extends React.Component{
    constructor (props){
        super(props);
        this.state={faltaCoe:'',references:false};

    }

    isValidated() {
        //Verificando si los coeficientes de las variables no son nulos
        let verifQty = this.props.status.variables
        .filter(va => va.descripcion !== '')
        .every( va => va.coeficiente !== '')
        if (verifQty) {
            this.props.lastStep(2);
            this.setState({faltaCoe:''})
            return true
        }else{
            this.setState({faltaCoe:'Rellename pue todos los Coeficientes no seas Guampa'})
            return false
        }

    }

    //En el Siguiente Handler, Se toma del input de una variable en particular el coeficiente.
    handleCoefVar = event => {        
        let {value, name} = event.target;
        if (value) {
            let {variables} = this.props.status;
            variables[name].coeficiente = parseInt(value);
            this.props.handleVariables(variables);
            console.log(this.props.status.variables);
        }
    }

    handleCoefRes = (event,ri) => {
        let {name,value } = event.target
        let {restricciones} = this.props.status;
        console.log('En la Res:'+ri+', en el campo:'+name+',con el valor:'+value);
        
        switch (name) {
            case 'derecha':
                    restricciones[ri].derecha = parseInt(value)
                break;
            case 'eq':
                    restricciones[ri].eq = value
                break;
            default:
                    restricciones[ri].coeficientes[name]= parseInt(value)
                break;
        }
        console.log(restricciones);
        this.props.handleRestricciones(restricciones);
    }

    listDescriptionsVarItems = array => array.filter(item => item.descripcion !== '')
        .map(item => <ListGroupItem key={'DLGIV'+item.xi} className="justify-content-between"><Badge>{'X'+item.xi}</Badge>{' '+item.descripcion}</ListGroupItem>)
    
    listDescriptionsResItems = array => array.filter(item => item.descripcion !== '')
        .map(item => <ListGroupItem key={'DLGIR'+item.ri} className="justify-content-between"><Badge>{'R'+item.ri}</Badge>{' '+item.descripcion}</ListGroupItem>)
    


    render() {
        //Obtenemos las propiedades del Super
        let {variables} = this.props.status;        
        let {restricciones} = this.props.status;
        let varsOperativas = variables.filter(va => va.descripcion !== '').length;

        //Generamos el renderizado para cada una de los elementos de los arreglos obtenidos anteriormente.

        let restriccionesInput = restricciones
        .filter(item => item.descripcion !== '')
        .map( (restriccion,index) =>
                <Restriccion className="mt-1" 
                key={'R'+index} 
                handleCoefRes={this.handleCoefRes} 
                cantVariables={varsOperativas} 
                restriccion={restriccion}/>);
        
        return(
            <>
            <h3>Cargamos los datos de nuestro Modelo:</h3>
            <Container>
                <Row>
                    <Card className="w-100 mt-3">
                            <CardHeader>
                                <Row>
                                    <Col className="text-left"><CardTitle><h4>Referencias:</h4></CardTitle></Col>
                                    <Col><Button outline size='sm'
                                        onClick={() => this.setState({references:!this.state.references})} 
                                        color={!this.state.references ? 'success':'danger'}>{!this.state.references ? 'Ver Referencias':'Ocultar Referencias'}</Button>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <Collapse isOpen={this.state.references}>
                                <CardBody>
                                    <h5 className='text-left'>Variables:</h5>
                                    <ListGroup>
                                        {this.listDescriptionsVarItems(variables)}
                                    </ListGroup>
                                    <h5 className='text-left'>Restricciones:</h5>
                                    <ListGroup>
                                        {this.listDescriptionsResItems(restricciones)}
                                    </ListGroup>
                                                                    
                                </CardBody>
                            </Collapse> 
                            
                    </Card>
                </Row>
                <Row>
                    <Card className="w-100 mt-3">
                        <CardHeader><CardTitle className="text-left"><h4>Funcion Objetivo:</h4></CardTitle></CardHeader>       
                        <CardBody className="mx-auto">
                            <FuncionObj variables={variables} handleCoefVar={this.handleCoefVar} objective={this.props.status.objective}/>
                        </CardBody>
                    </Card>
                </Row>
                <Row>
                    <Card className="w-100 mt-3">
                        <CardHeader><CardTitle className="text-left"><h4>Restricciones:</h4></CardTitle></CardHeader>       
                        <CardBody>
                            {restriccionesInput}
                        </CardBody>
                    </Card>
                </Row>
                {this.state.faltaCoe !== '' && 
                        <Row className="mt-3">
                            <Alert className="mx-auto" color="danger">{this.state.faltaCoe}</Alert>
                        </Row>}
            </Container>
            </>
        )
    }
}

export default Processing;