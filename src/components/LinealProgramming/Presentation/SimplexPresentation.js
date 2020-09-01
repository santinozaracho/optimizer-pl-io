import React from 'react';
import {Card,CardTitle,CardBody,CardText,CardHeader,Table,CardFooter,Row,Col,Button,Collapse} from 'reactstrap';
import ReferencesList from '../ReferencesList'

class SimplexPresentation extends React.Component{
    constructor (props){
        super(props)
        this.state={details:false}
    }

    //Funcion que en base al uso de una variable, devuelve una tabla con los recursos utilizados
    tablaDeRecursosFoot = (cantUsoVar,variableId) => {
        let {restricciones} = this.props;
        let tableBody = restricciones.filter(item => item.descripcion!== '')
        //Realizamos calculos
        .map( restri => 
            <tr key={'TdeV'+variableId+'R'+restri.ri}><td>{'R'+restri.ri}</td><td>{cantUsoVar*restri.coeficientes[variableId]}</td>
            <td>{restri.derecha-(cantUsoVar*restri.coeficientes[variableId])}</td></tr>)
        return(<Table size='sm' responsive>
            <thead><tr><th>Recurso</th><th>Usado</th><th>Diferencia</th></tr></thead>
            <tbody>{tableBody}</tbody>
        </Table>)

    }

    mapperAnalisisTable = (result) => {
        //El array al cucal enviamos los resultados procesados
        let tableResult=[];
        //Obtenemos el Set de Resultados con Formato [key,value]
        let resultSetArray =  Object.entries(result.solutionSet);
        console.log("Imprimimos el resultsSetArray:" + resultSetArray);
        //Obtenemos la matriz del simplex reducida
        let matrix = result._tableau.matrix;
        //Obtenemos los indices de cada columna
        let indexByCol = result._tableau.varIndexByCol;
        //Obtenemos la Lista de Variables Slack y Reales
        let variablesList = result._tableau.variablesPerIndex
        //Obtenemos la Lista de Variables Reales
        let variablesRealesList = result._tableau.variablesPerIndex.filter(el => !el.isSlack);
        //Contamos la Cantidad de elementos en la fila de resultados (van a ser cero por ser simplex reducido)
        let itemsinCero = matrix[0].length - 1;
        //Obtenemos cuales son las variables que no estan en el set de resultados (van a ser cero)
        let varsEnCero = variablesRealesList.filter( vari => !Object.keys(result.solutionSet).includes(vari.id) )
        //La cantidad de columnas en la fila de resultados - la cantidad de variables nulas, me devuelven la cantidad de slacks
        let slacksEnCero = itemsinCero - varsEnCero.length;

        //Procesamos INFO
        //Primer elemento de la Tabla, el Optimo.
        tableResult.push({name:'Optimo',item:'',value:result.evaluation});
        //Procesamos todos los elementos a producir (result Set)
        resultSetArray.forEach( ([key,value]) => tableResult.push({name:'Producir',item:'X'+key, value}) )
        //Procesamos el uso de los recursos, es decir, los elementos extras de la Fila de Resultados(Matriz)
        if (resultSetArray.length < matrix.length-1) {
            console.log('hola');
        }

        //Procesamos los Costo de Oportunidad y los Valores Marginales
        matrix[0].slice(1)
                .forEach( (col,indCol) => {
                    //Creamos un nuevo item.
                    let item= {name:'',item:'',value:''};
                    //Verificamos si es Slack o Variable Real
                    if (variablesList[indexByCol[indCol+1]].isSlack){
                        item.name = 'Valor Marginal';
                        item.item = 'R'+indexByCol[indCol+1];
                        item.value = Math.abs(col);
                    }else{
                        item.name = 'Costo de Oportunidad';
                        item.item = 'X'+variablesList[indexByCol[indCol+1]].id;
                        item.value = Math.abs(col);
                    }
                    
                    //Empujamos el item a la tabla de resultados
                    tableResult.push(item)})
            
        return tableResult
    }

    cardsVariablesRender = (variables,result) => variables
                                                    .filter(vari => vari.descripcion !== '')
                                                    .map( vari => 
                                                                <Card key={'C-V-'+vari.xi} outline color='secondary' className="w-100 mt-3 mx-auto">
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


    render () {
        //Obtenemos el resultado almacenado
        //Obtenemos las Variables desde las props
        let {variables, restricciones,result} = this.props;
        
        
    
        //Obtenemos  la informacion para la tabla de Analisis
        let itemsTabAnalisis = this.mapperAnalisisTable(result); 
        //Renderizamos el Tablero de analisis
        let elementosTabAnalisis = itemsTabAnalisis.map( (item, index) => <tr key={'T-A-'+index}><td>{item.name}</td><td>{item.item}</td><td>{item.value}</td></tr>);
        
        
            
        let resultAnalisisCard = 
            <Card outline color='secondary' className="w-100 mt-3 mx-auto">
                <CardHeader><CardTitle><h4>Tablero de Analisis</h4></CardTitle></CardHeader>
                <CardBody>
                    <Table>
                        <thead><tr><th></th><th>Elemento</th><th>Valor</th></tr></thead>
                        <tbody>
                            {elementosTabAnalisis}
                        </tbody>
                    </Table>
                </CardBody>
                
            </Card>

        let resultDetalleCard = <Card outline color='secondary' className="w-100 mt-3 mx-auto">
                                    <CardHeader>
                                        <Row>
                                            <Col className="text-left"><CardTitle><h5>Detalle de Variables Y Recursos:</h5></CardTitle></Col>
                                            <Col><Button outline size='sm'
                                                onClick={() => this.setState({details:!this.state.details})} 
                                                color={!this.state.details ? 'success':'danger'}>{!this.state.details ? 'Ver Detalles':'Ocultar Detalles'}</Button>
                                            </Col>
                                        </Row>
                                    </CardHeader>
                                    <Collapse isOpen={this.state.details}>
                                        <CardBody>
                                            {this.cardsVariablesRender(variables,result)}
                                        </CardBody>
                                    </Collapse>
                                </Card>
        return(
                <CardBody>
                    <Row>{resultAnalisisCard}</Row>
                    <Row><ReferencesList variables={variables} restricciones={restricciones}/></Row>
                    <Row>{resultDetalleCard}</Row>
                </CardBody>)
    }
}

export default SimplexPresentation;