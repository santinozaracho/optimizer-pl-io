import React from 'react';
import {CardBody, Card, CardHeader,CardFooter,Table,Row} from 'reactstrap';
import {XYPlot, XAxis, YAxis, HorizontalGridLines,LineSeries, AreaSeries, VerticalGridLines,MarkSeries,DiscreteColorLegend,Hint} from 'react-vis';
import {Expression, Equation} from 'algebra.js';
var randomColor = require('randomcolor');






class GraphicPresentation extends React.Component{
    constructor (props){
        super(props)
        this.state={coefToValueZ:{x:0,y:0},optimMark:[],points:[],lines:[],referencias:[],value:null}
    }

    componentDidMount() {
        if ( this.props.graph ){
            let {variables,restricciones,result} = this.props
            restricciones = restricciones.filter(elem => elem.descripcion!=='');
            variables = variables.filter(elem => elem.descripcion!=='');
            let coefToValueZ = {x:variables[0].coeficiente,y:variables[1].coeficiente}
            let referencias = this.getColorList(restricciones);
            let {lines,expresiones} = this.getLinesAndExpressions(restricciones);
            
            let points = this.getPoints(variables,restricciones,expresiones,result.solutionSet)
            let optimMark = [points.shift()];
            this.setState({coefToValueZ,referencias,lines,points,optimMark});
            
        }
    }
    componentDidUpdate(prevProps){
        if ( prevProps !== this.props ){
            if ( this.props.graph ){
                let {variables,restricciones,result} = this.props
                restricciones = restricciones.filter(elem => elem.descripcion!=='');
                variables = variables.filter(elem => elem.descripcion!=='');
                let referencias = this.getColorList(restricciones);
                let {lines,expresiones} = this.getLinesAndExpressions(restricciones);
                let points = this.getPoints(variables,restricciones,expresiones,result.solutionSet)
                let optimMark = [points.shift()];
                this.setState({referencias,lines,points,optimMark});
            }
        }
    }


    getLinesAndExpressions = restricciones => {
        let expresiones = [];
        let arrayDeRestriccionesConLosDosCoef =  restricciones.filter(el=> ( el.coeficientes[0] > 0 && el.coeficientes[1] > 0) )
        let highestValueY = Math.max.apply(Math,arrayDeRestriccionesConLosDosCoef.map( restri => (restri.derecha / restri.coeficientes[1])));
        let highestValueX = Math.max.apply(Math,arrayDeRestriccionesConLosDosCoef.map( restri => (restri.derecha / restri.coeficientes[0])));
        
        let lines = restricciones.map( restri => {
            if (restri.coeficientes[0] !== 0  && restri.coeficientes[1] !== 0) {
                console.log(restri.coeficientes);
                let x = new Expression('x').multiply(restri.coeficientes[0]);
                let y = new Expression('y').multiply(restri.coeficientes[1]);
                let expressRestri = new Expression().add(x).add(y);  
                let restriEquation = new Equation(expressRestri,restri.derecha)
                expresiones.push({restriEquation,tipo:2})
                let yEqu = (new Equation(restriEquation.solveFor('x'),0)).solveFor('y');
                let xEqu = (new Equation(restriEquation.solveFor('y'),0)).solveFor('x');
                if (xEqu > -1 && yEqu > -1) {return([{x:0,y:yEqu},{x:xEqu,y:0}])}
            }else {
                if (restri.coeficientes[0] !== 0) {
                    console.log(restri.coeficientes);
                    
                    let x = new Expression('x').multiply(restri.coeficientes[0]);
                    let restriEquation = new Equation(x,restri.derecha)
                    expresiones.push({restriEquation,tipo:0})
                    let xEqu = restriEquation.solveFor('x');
                    if (xEqu > -1 ){return([{x:xEqu,y:0},{x:xEqu,y:highestValueY}])}
                }else {
                    console.log(restri.coeficientes);
                    let y = new Expression('y').multiply(restri.coeficientes[1]);
                    let restriEquation = new Equation(y,restri.derecha)
                    expresiones.push({restriEquation,tipo:1})
                    let yEqu = restriEquation.solveFor('y')
                    if ( yEqu > -1) {return([{x:0,y:yEqu},{x:highestValueX,y:yEqu}])}               
                } 
            }
        })
        return { lines,expresiones }
    }

    
    getColorList = restricciones => restricciones.map( restri => Object({title: 'R'+restri.ri+' Tipo:'+restri.eq, color: randomColor()}))

    getOptimPoint = (solSet) => {
         //Analizamos el Punto Optimo.
         if ( solSet['0'] && solSet['1'] ) {return{x:Number(solSet['0']).toFixed(2),y:Number(solSet['1']).toFixed(2),P:'0 - OPTIMO'}
        }else if ( solSet['0'] ) {return{x:Number(solSet['0']).toFixed(2),y:0,P:'0 - OPTIMO'}
        }else { return{x:0,y:Number(solSet['1']).toFixed(2),P:'0 - OPTIMO'}}
    }

    getPoints = (variables,restricciones,expresiones,solSet) => {    
        //Limpiamos nuestro array de Puntos
        let points = [];
        //El primer punto que obtenemos es el Optimo.
        points.push(this.getOptimPoint(solSet))

        //Analizamos las Rectas que cortan en los Ejes.
        expresiones.forEach( exp => {
            
            if (exp.tipo === 2) {
                //Obtenemos Cortes sobre el Eje-X
                let expResultX = Number((new Equation(exp.restriEquation.solveFor('y'),0)).solveFor('x')).toFixed(2);
                //Obtenemos el Corte sobre el Eje-Y
                let expResultY = Number((new Equation(exp.restriEquation.solveFor('x'),0)).solveFor('y')).toFixed(2);

                if ( expResultY > -1 ) {
                    //Generamos el Punto en Y
                    let pointInAxY = {x:0,y:expResultY,P:points.length}
                    
                    //Verificamos el punto en Y con las Restricciones.
                    if (this.verifyPoint(pointInAxY,restricciones,points)){points.push(pointInAxY)}
                }
                if ( expResultX > -1 ) {
                     //Generamos el Punto en X
                    let pointInAxX = {x:expResultX,y:0,P:points.length}
                    //Verificamos el punto en X con las Restricciones.
                    if (this.verifyPoint(pointInAxX,restricciones,points)){points.push(pointInAxX)} 
                }  
            }
            // //Punto experminental 
            // points.push({x:expResultX,y:expResultY,Info:'EXP'})
        });

        //Analizamos los cortes de las Rectas de Restricciones.
        expresiones.forEach(exp1 => {
            //Validamos cada unas de las Rectas con las demas.
            expresiones.forEach( exp2 => {
                //Verificamos que no sea la misma recta.
                if( exp1 !== exp2) {
                    let expResultX = 0;
                    let expResultY = 0;
                    //Obtenemos  las expresiones y las igualamos para obtener el punto de corte.
                    if ( exp1.tipo === 2 && exp2.tipo === 2 ) {
                        expResultX = Number((new Equation(exp1.restriEquation.solveFor('y'),exp2.restriEquation.solveFor('y'))).solveFor('x')).toFixed(3);
                        expResultY = Number((new Equation(exp1.restriEquation.solveFor('x'),exp2.restriEquation.solveFor('x'))).solveFor('y')).toFixed(3);
                    }
                    //Verificamos que no se corten en algun otro cuadrante que no sea el de analisis.
                    if ( expResultX > -1  && expResultY > -1 ) {
                        //Generamos el Punto.
                        let point = {x:expResultX,y:expResultY,P:points.length}
                        //Verificamos el Punto.
                        if (this.verifyPoint(point,restricciones,points)){points.push(point)}     
                    }            
                }
            } )

        });
        return points
    }
    
    //Funcion que se encarga de devolverme la tabla.
    getTableResult = (points,coeficientes) =>
        <Table>
            <thead><tr><th>Punto</th><th>Resultado</th><th>X0</th><th>X1</th></tr></thead>
            <tbody>{points.map(point => <tr key={'T-P-'+point.P}><td>P:{point.P}</td><td>{coeficientes.x*point.x + coeficientes.y*point.y}</td><td>{point.x}</td><td>{point.y}</td></tr>)}</tbody>
        </Table>
    
    //Funcion que se encarga de realizar las verificaciones correspondientes para agregar un punto o no.
    verifyPoint = (point, restricciones, points) => {
        if ( !this.verifyPointInPoints(point,points) ) {
            console.log('P:('+point.x +','+point.y+') NotIn' );
            if ( this.verifyPointInRestrictions(point,restricciones) ) { return true } else return false
        }else return false
    }

    //Funcion que se encarga de Verificar si un punto ya se encuentra en la lista de puntos (o ya fue verificado antes).
    verifyPointInPoints = (point,points) => points.some( pointL =>{
        console.log(points);
        console.log(point);
        console.log(pointL);
        console.log((pointL.x === point.x && pointL.y === point.y));
        
        return(pointL.x === point.x && pointL.y === point.y)})
    
    //Funcion que se encarga de verificar que un punto cumpla con todas las Restricciones.
    verifyPointInRestrictions = (point,restricciones) => restricciones.every( 
            restri => {
                let calIzq = (restri.coeficientes[0]*point.x + restri.coeficientes[1]*point.y).toFixed(3);
                if( restri.eq === '>=' ) {
                    console.log('P:('+point.x+','+point.y+')  R:'+calIzq + '>='+ restri.derecha);
                    return ( calIzq >= restri.derecha ) 
                }else {
                    console.log('P:('+point.x+','+point.y+') R:'+calIzq + '<='+ restri.derecha);
                    return ( calIzq <= restri.derecha )
                } } )
    
    //Funcion que encarga de ocultar la descripcion del punto.  
    hidePoint = () => this.setState({value: null})

    //Funcion que se encarga de mostrar la descripcion del punto.
    showPoint = value => this.setState({ value })


    mapperLinesSeries = (lines,referencias) => 
        lines.map((data,index) => <LineSeries key={'L-S-A'+index} color={referencias.length > 0 ?referencias[index].color:'red'} data={data}/>)
    

    render () {
        let {referencias,lines,value,points,optimMark,coefToValueZ} = this.state;
        return( 
        <CardBody>
            <Card>
                <CardHeader>Grafico</CardHeader>
                <CardBody>
                    <Row className='mx-auto'>
                        <XYPlot
                            onMouseLeave={() => this.setState({pointer: null})}
                            width={500}
                            height={400}>
                                <HorizontalGridLines/>
                                <VerticalGridLines/>
                                <XAxis title='Variable X0' />
                                <YAxis  title='Variable X1'/>
                                
                                {this.mapperLinesSeries(lines,referencias)}
                            
                                <MarkSeries
                                    onValueMouseOver={this.showPoint}
                                    onValueMouseOut={this.hidePoint}
                                    color={'blue'}
                                    opacity={0.7}
                                    data={points}
                                    />
                                <MarkSeries
                                    onValueMouseOver={this.showPoint}
                                    onValueMouseOut={this.hidePoint}
                                    color={'green'}
                                    data={optimMark}
                                    />
                                {value && <Hint value={value} />} 
                        </XYPlot>
                    </Row>
                    <Row className='mx-auto'><DiscreteColorLegend orientation="horizontal" items={referencias}/></Row>
                </CardBody>
                <CardFooter>
                    {this.getTableResult(optimMark.concat(points),coefToValueZ)}
                </CardFooter>
            </Card>
        </CardBody> )
    }
}

export default GraphicPresentation;