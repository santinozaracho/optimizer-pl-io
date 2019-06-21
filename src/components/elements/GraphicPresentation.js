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
                    let x = new Expression('x').multiply(restri.coeficientes[0]);
                    let restriEquation = new Equation(x,restri.derecha)
                    expresiones.push({restriEquation,tipo:0})
                    let xEqu = restriEquation.solveFor('x');
                    if (xEqu > -1 ){return([{x:xEqu,y:0},{x:xEqu,y:highestValueY}])}
                }else {
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
         if ( solSet['0'] && solSet['1'] ) {return{x:Number(solSet['0']).toFixed(4),y:Number(solSet['1']).toFixed(4),P:'0 - OPTIMO'}
        }else if ( solSet['0'] ) {return{x:Number(solSet['0']).toFixed(4),y:0,P:'0 - OPTIMO'}
        }else { return{x:0,y:Number(solSet['1']).toFixed(4),P:'0 - OPTIMO'}}
    }

    getPoints = (variables,restricciones,expresiones,solSet) => {

        //Definimos las Funciones necesarias para el buen funcionamiento de esta Funcion.

        //Funcion que se encarga de realizar las verificaciones correspondientes para agregar un punto o no.
        const verifyPoint = (point, restricciones, points) => {
            if ( !verifyPointInPoints(point,points) ) {
                if ( verifyPointInRestrictions(point,restricciones) ) { return true } else return false
            }else return false
        }

        //Funcion que se encarga de Verificar si un punto ya se encuentra en la lista de puntos (o ya fue verificado antes).
        const verifyPointInPoints = (point,points) => points.some( pointL => (pointL.x === point.x && pointL.y === point.y) )
        
        //Funcion que se encarga de verificar que un punto cumpla con todas las Restricciones.
        const verifyPointInRestrictions = (point,restricciones) => restricciones.every( restri => {
                    let calIzq = (restri.coeficientes[0]*point.x + restri.coeficientes[1]*point.y).toFixed(4);
                    if( restri.eq === '>=' ) {
                        console.log('P:('+point.x +','+point.y+') :'+calIzq+' >='+ restri.derecha );                        
                        return ( calIzq >= restri.derecha ) 
                    }else { 
                        console.log('P:('+point.x +','+point.y+') :'+calIzq+' <='+ restri.derecha );                        
                        return ( calIzq <= restri.derecha )} 
                })
        // Funcion que devuelve un punto verificado y que corta en un Eje.
        const getPointAxFromExpC = ( exp ) => {       
            //Obtenemos el Corte sobre el Eje-Y
            let expResultY = Number((new Equation(exp.solveFor('x'),0)).solveFor('y')).toFixed(4);
            let expResultX = Number((new Equation(exp.solveFor('y'),0)).solveFor('x')).toFixed(4);
            if ( expResultX > -1 ) {
                //Generamos el Punto en X
                let pointInAxX = {x:expResultX,y:0,P:points.length}
                //Verificamos el punto en X con las Restricciones.
                if (verifyPoint(pointInAxX,restricciones,points)){return pointInAxX} 
            } 
            if ( expResultY > -1 ) {
                //Generamos el Punto en Y
                let pointInAxY = {x:0,y:expResultY,P:points.length}
                //Verificamos el punto en Y con las Restricciones.
                if (verifyPoint(pointInAxY,restricciones,points)){return pointInAxY}
            }   
        };
        const getPointAxFromExpY = ( expY ) => {
            //Obtenemos el Corte sobre el Eje-Y
            let expResultY = Number(expY.solveFor('y')).toFixed(4);

            if ( expResultY > -1 ) {
                //Generamos el Punto en Y
                let pointInAxY = {x:0,y:expResultY,P:points.length}
                //Verificamos el punto en Y con las Restricciones.
                if (verifyPoint(pointInAxY,restricciones,points)){return pointInAxY}
            }
            
        };
        const getPointAxFromExpX = (expX) => {
            //Obtenemos Cortes sobre el Eje-X
            let expResultX = Number(expX.solveFor('x')).toFixed(4);

            if ( expResultX > -1 ) {
                //Generamos el Punto en X
                let pointInAxX = {x:expResultX,y:0,P:points.length}
                //Verificamos el punto en X con las Restricciones.
                if (verifyPoint(pointInAxX,restricciones,points)){return pointInAxX} 
            } 
        }
        //Funcion que devuelve un punto verificado con una Expresion en X y otra en Y
        const getPointFromExpXExpY = ( expX,expY ) => {
            let xRes = Number(expX.solveFor('x')).toFixed(4);
            let yRes = Number(expY.solveFor('y')).toFixed(4);
            //Verificamos que no se corten en algun otro cuadrante que no sea el de analisis.
            if ( xRes > -1  && yRes > -1 ) {
                //Generamos el Punto.
                let point = {x:xRes,y:yRes,P:points.length}
                //Verificamos el Punto.
                if (verifyPoint(point,restricciones,points)){return point}     
                }
        };
        //Funcion que devuelve un punto verificado con una Expresion Completa y otra en Y
        const getPointFromExpCExpY = ( expC,expY ) => {
            console.log('EXP C y Recta Y');
            let expResultY = Number(expY.solveFor('y')).toFixed(4);
            let expResultX = Number((new Equation(expC.solveFor('y'),expY.solveFor('y'))).solveFor('x')).toFixed(4);
            //Verificamos que no se corten en algun otro cuadrante que no sea el de analisis.
            if ( expResultX > -1  && expResultY > -1 ) {
                //Generamos el Punto.
                let point = {x:expResultX,y:expResultY,P:points.length}
                //Verificamos el Punto.
                if (verifyPoint(point,restricciones,points)){return point}}
        };
        //Funcion que devuelve un punto verificado con una Expresion Completa y otra en X
        const getPointFromExpCExpX = ( expC,expX ) => {
            console.log('EXP C y Recta X');
            let expResultX = Number(expX.solveFor('x')).toFixed(4);
            let expResultY = Number((new Equation(expC.solveFor('x'),expX.solveFor('x'))).solveFor('y')).toFixed(4);
            //Verificamos que no se corten en algun otro cuadrante que no sea el de analisis.
            if ( expResultX > -1  && expResultY > -1 ) {
                //Generamos el Punto.
                let point = {x:expResultX,y:expResultY,P:points.length}
                //Verificamos el Punto.
                if (verifyPoint(point,restricciones,points)){return point}}
        };
        //Funcion que devuelve un punto verificado con dos Expresion Completas.
        const getPointFromTwoExpC = (exp1,exp2) =>{
            let expResultX = Number((new Equation(exp1.restriEquation.solveFor('y'),exp2.restriEquation.solveFor('y'))).solveFor('x')).toFixed(4);
            let expResultY = Number((new Equation(exp1.restriEquation.solveFor('x'),exp2.restriEquation.solveFor('x'))).solveFor('y')).toFixed(4);
            //Verificamos que no se corten en algun otro cuadrante que no sea el de analisis.
            if ( expResultX > -1  && expResultY > -1 ) {
                //Generamos el Punto.
                let point = {x:expResultX,y:expResultY,P:points.length}
                //Verificamos el Punto.
                if (verifyPoint(point,restricciones,points)){return point}}
        };
        //Funcion que devuelve Un punto de Dos Expresiones
        const getPointFromTwoExp = (exp1,exp2) => {
            //Verificamos los Tipos
            if ( exp1.tipo === 2 && exp2.tipo === 2 ) {
                //Caso de que son dos rectas Completas
                return getPointFromTwoExpC(exp1,exp2)  
            }else if( exp1.tipo === 2){
                //La primera es Recta completa y la otra o solo de X o solo de Y
                if( exp2.tipo === 0) { return getPointFromExpCExpX(exp1.restriEquation,exp2.restriEquation) 
                }else return getPointFromExpCExpY(exp1.restriEquation,exp2.restriEquation)
            }else if( exp2.tipo === 2 ){
                //La seguna es la Recta completa entonces la otra es o solo de X o solo de Y
                if( exp1.tipo === 0) { return getPointFromExpCExpX(exp2.restriEquation,exp1.restriEquation)
                }else return getPointFromExpCExpY(exp2.restriEquation,exp1.restriEquation)
            }else if (exp1.tipo === 0){
                //Si la primera es una recta Solo de X y la otra puede ser de Y
                if( exp2.tipo === 1) { return getPointFromExpXExpY(exp1.restriEquation,exp2.restriEquation) }
            }else{
                //Si la Primera es una recta solo de Y y la otra puede ser de X
                if( exp2.tipo === 0) { return getPointFromExpXExpY(exp2.restriEquation,exp1.restriEquation) }
            }
        };

        //Limpiamos nuestro array de Puntos
        let points = [];
        //El primer punto que obtenemos es el Optimo.
        points.push(this.getOptimPoint(solSet))

        //Analizamos las Rectas que cortan en los Ejes o Rectas sin pendiente.
        expresiones.forEach( exp => {
            if (exp.tipo === 2) {
                //Si es Completa Corta en los dos Ejes
                let point = getPointAxFromExpC(exp.restriEquation);
                if (point) { points.push(point) }


            }else if(exp.tipo === 0){
                //Solo Corta en X
                let point = getPointAxFromExpX(exp.restriEquation);
                if (point) { points.push(point) }

            }else{
                //Solo corta en Y
                let point = getPointAxFromExpY(exp.restriEquation);
                if (point) { points.push(point) }
            }
        })

        //Analizamos los cortes de las Rectas de Restricciones.
        expresiones.forEach( exp1 => {
            //Validamos cada unas de las Rectas con las demas.
            expresiones.forEach( exp2 => {
                //Verificamos que no sea la misma recta.
                if( exp1 !== exp2 ) {
                    let point = getPointFromTwoExp(exp1,exp2);
                    if (point) {points.push(point)}
                } 
            })
        });
        
        return points
    }

  
    
    //Funcion que se encarga de devolverme la tabla.
    getTableResult = (points,coeficientes) =>
        <Table>
            <thead><tr><th>Punto</th><th>Resultado</th><th>X0</th><th>X1</th></tr></thead>
            <tbody>{points.map(point => <tr key={'T-P-'+point.P}><td>P:{point.P}</td><td>{coeficientes.x*point.x + coeficientes.y*point.y}</td><td>{point.x}</td><td>{point.y}</td></tr>)}</tbody>
        </Table>
     
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