import React from 'react';
import {Card,CardTitle,CardBody,CardText,CardHeader,Table,CardFooter,Row,Col,Button,Collapse} from 'reactstrap';
import solver from 'javascript-lp-solver';

let convertAppToModelForSolverPrimal = datosApp => {
    //Obtenemos los Datos de la aplicacion
    let {restricciones,variables,objective,integer} = datosApp;
    variables = variables.filter(item => item.descripcion !== '');
    restricciones = restricciones.filter(item => item.descripcion !== '');
    //Precargamos el Modelo
    let model = {optimize:'coeficiente',opType:'',constraints:{},variables:{},ints:{}};
    
    //Tratamos el objetivo
    model.opType = objective;

    //Verificamos si se desea PL Entera
    if (integer) {
        variables.forEach(vari => model.ints[vari.xi]=1)
    }    
    //Tratamos las Variables
    variables.forEach( vari => {  
            //Generamos una nueva Variable
            let newVari = {};
            newVari.coeficiente = vari.coeficiente;
            restricciones.forEach(restri =>
                    newVari['r'+restri.ri] = restri.coeficientes[vari.xi]);
            console.log(newVari);
            model.variables[vari.xi] = newVari;
        });
    //Tratamos las Restricciones
    restricciones.forEach(restri => {
            if(restri.eq === '>='){ 
                let res = {};
                res.min = restri.derecha     
                model.constraints['r'+restri.ri] = res;
            }else{
                let res = {};
                res.max = restri.derecha
                model.constraints['r'+restri.ri] = res;
            }});
    
    return model
}
        


class Presentation extends React.Component{
    constructor (props){
        super(props)
        this.state={result:false,resultDual:false,details:false}
    }

    componentDidMount() {
        if (this.props.status.result){
            this.calculateResults()
            console.log(this.state.result);
            console.log(this.state.resultDual);
        }

    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps){
            if (this.props.status.result){
                this.calculateResults()
            }  
        }
    }

    //Funcion de Calculo del modelo.
    calculateResults = () => {
        //Convertimos la App en Modelo para Solver.js
        let model = convertAppToModelForSolverPrimal(this.props.status);
        console.log(model);
        
        //solver.js soluciona y nos devuelve 
        let result = solver.Solve(model,false,true);
        console.log(result);
        
        this.setState({result})
    }

    //funcion que en base al uso de una variable, devuelve una tabla con los recursos utilizados
    tablaDeRecursosFoot = (cantUsoVar,variableId) => {
        let {restricciones} = this.props.status;
        let tableBody = restricciones.filter(item => item.descripcion!== '')
        //Realizamos calculos
        .map( restri => 
            <tr key={'TdeR'+variableId}><td>{'R'+restri.ri}</td><td>{cantUsoVar*restri.coeficientes[variableId]}</td>
            <td>{restri.derecha-(cantUsoVar*restri.coeficientes[variableId])}</td></tr>)
        return(<Table size='sm' responsive>
            <thead><th>Recurso</th><th>Usado</th><th>Diferencia</th></thead>
            <tbody>{tableBody}</tbody>
        </Table>)

    }

    render () {
        let {result} = this.state
        let {variables} = this.props.status;
        let resultVariablesCards = <p></p>;
        let resultDetalleCard = <p></p>;
        let resultAnalisisCard = <p></p>;
        if (result.feasible) { 
            resultVariablesCards = variables
                .filter(vari => vari.descripcion !== '')
                .map( vari => 
                            <Card key={'Card'+vari.xi} outline color='secondary' className="w-100 mt-3 mx-auto">
                                <CardHeader><CardTitle>{'Variable: X'+vari.xi}</CardTitle></CardHeader>    
                                <CardBody>
                                    <Row><CardText>{
                                        result.solutionSet[vari.xi] ? 
                                        'Se recomienda producir '+result.solutionSet[vari.xi]+' unidades':
                                        'No se recomienda la produccion'}
                                        {' de '+vari.descripcion}</CardText>
                                    </Row>
                                    <Row></Row> 
                        
                                </CardBody>
                                <CardFooter>
                                    <CardText>Tabla de Recursos:</CardText>
                                    {result.solutionSet[vari.xi] ? 
                                    this.tablaDeRecursosFoot(result.solutionSet[vari.xi],vari.xi):'Sin Consumo de Recursos'}
                                </CardFooter>
                
                            </Card>)
            resultAnalisisCard = 
                            <Card outline color='secondary' className="w-100 mt-3 mx-auto">
                                <CardHeader><CardTitle><h4>Tabla de Analisis</h4></CardTitle></CardHeader>
                                <CardBody>
                                    <Table>
                                        <thead><th>Algo</th></thead>
                                        <tbody><tr><td>eso de ese algo</td></tr></tbody>
                                    </Table>
                                </CardBody>
                            </Card>
            resultDetalleCard = <Card outline color='secondary' className="w-100 mt-3 mx-auto">
                                    <CardHeader>
                                        <Row>
                                            <Col className="text-left"><CardTitle><h4>Detalle de Variables Y Recursos:</h4></CardTitle></Col>
                                            <Col><Button outline size='sm'
                                                onClick={() => this.setState({details:!this.state.details})} 
                                                color={!this.state.details ? 'success':'danger'}>{!this.state.details ? 'Ver Detalles':'Ocultar Referencias'}</Button>
                                            </Col>
                                        </Row>
                                   </CardHeader>
                                    <Collapse isOpen={this.state.details}>
                                        <CardBody>
                                            {resultVariablesCards}
                                        </CardBody>
                                    </Collapse>
                                </Card>

        }
    
       
       return(
            <> 
                <Card outline color='info' className="w-100 mt-3 mx-auto">
                    <CardHeader><CardTitle><h3>{result.feasible ? 'El resultado optimo es: '+result.evaluation:'Solucion No Factible'}</h3></CardTitle></CardHeader>
                    <CardBody>
                        {resultAnalisisCard}
                        {resultDetalleCard}
                    </CardBody>
                </Card>  
            </>

        )
    }
}

export default Presentation;