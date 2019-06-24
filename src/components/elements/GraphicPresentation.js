import React from 'react';
import {CardBody, Card, CardHeader,CardFooter,Table,Row} from 'reactstrap';
import {XYPlot, XAxis, YAxis, HorizontalGridLines,LineSeries, AreaSeries, VerticalGridLines,MarkSeries,DiscreteColorLegend,Hint} from 'react-vis';
import {Expression, Equation} from 'algebra.js';
var randomColor = require('randomcolor');






class GraphicPresentation extends React.Component{
    constructor (props){
        super(props)
        this.state={convexPoints:[],coefToValueZ:{x:0,y:0},optimMark:[],points:[],lines:[],referencias:[],value:null}
    }

    componentDidMount() {
        if ( this.props.graph ){
            this.updateState()
        }
    }

    componentDidUpdate(prevProps){
        if ( prevProps !== this.props ){
            if ( this.props.graph ){
                this.updateState()
            }
        }
    }

    updateState = () =>{
        let {variables,restricciones,result} = this.props
        //Filtramos las restricciones y variables que no fueron filtradas antes.
        restricciones = restricciones.filter(elem => elem.descripcion!=='');
        variables = variables.filter(elem => elem.descripcion!=='');
        //Obtenemos los coeficientes a evaluar en el Z
        let coefToValueZ = this.getCoeficientesToEv(variables)
        //Obtenemos la paleta de colores.
        let referencias = this.getColorList(restricciones);
        //Obtenemos las Lineas y las Expresiones
        let {lines,expresiones} = this.getLinesAndExpressions(restricciones);
        //Obtenemos los Puntos de marca general
        let {points,convexPoints} = this.getPoints(restricciones,expresiones,result,coefToValueZ)
        //Obtenemos el Punto Optimo
        let optimMark = []
        if( Object.entries(result).length ){ optimMark = [this.getOptimPoint(result)]}
        //Almacenamos el Estado.
        this.setState({referencias,lines,points,optimMark,coefToValueZ,convexPoints});
    }

    getCoeficientesToEv =  variables => {
        let coef={x:0,y:0};
        coef.x = variables[0].coeficiente;
        coef.y = variables[1].coeficiente;
        return coef
    }


    getLinesAndExpressions = restricciones => {
        //Tipos de Expresiones: 0: Constante en X; 1: Constante en Y; 2: Recta con pendiente.
        let expresiones = [];
        let arrayDeRestriccionesConLosDosCoef =  restricciones.filter(el=> ( el.coeficientes[0] > 0 && el.coeficientes[1] > 0) )
        let highestValueY = Math.max.apply(Math,arrayDeRestriccionesConLosDosCoef.map( restri => (restri.derecha / restri.coeficientes[1])));
        let highestValueX = Math.max.apply(Math,arrayDeRestriccionesConLosDosCoef.map( restri => (restri.derecha / restri.coeficientes[0])));
        console.log('Ymax: '+highestValueY+' Xmax:'+highestValueX);
        
        let lines = restricciones.map( restri => {
            //Si posee ambos coeficientes entoces es una recta con pendiente.
            if (restri.coeficientes[0] !== 0  && restri.coeficientes[1] !== 0) {
                let x = new Expression('x').multiply(restri.coeficientes[0]);
                let y = new Expression('y').multiply(restri.coeficientes[1]);
                let expressRestri = new Expression().add(x).add(y);  
                let restriEquation = new Equation(expressRestri,restri.derecha)
                expresiones.push({restriEquation,tipo:2})
                let yEqu = (new Equation(restriEquation.solveFor('x'),0)).solveFor('y');
                let xEqu = (new Equation(restriEquation.solveFor('y'),0)).solveFor('x');
                //Analizamos pendientes positivas y negativas
                if (xEqu >= 0 && yEqu >= 0) {
                    //Si es Pendiente negativa tenemos que corta en los puntos +x y +y
                    if (restri.eq === '>=') {
                        return([{x:0,y:yEqu,y0:highestValueY},{x:xEqu,y:0,y0:highestValueY},{x:highestValueX,y:0,y0:highestValueY}])
                    }else{
                        return([{x:0,y:yEqu},{x:xEqu,y:0}])
                    }
                    
                }else{
                    //Si es Pendiente positiva solo corta en +x o en +y
                    if(yEqu >= 0){
                        //Si corta en +y , entonces calculamos el punto para el grafico en +x
                        let relation = Math.abs(yEqu/xEqu)
                        let valY = yEqu+highestValueX*relation
                        //Si el valor calculado para Y es menor al maximo, lo llevamos hasta alli y actualizamos el Xmax
                        if (valY < highestValueY){
                            valY = highestValueY
                            highestValueX = (highestValueY-yEqu)/relation
                            console.log('NewXMAX: '+highestValueX);
                        }else{
                            highestValueY = valY            
                            console.log('NewYMAX: '+highestValueY);
                        }
                        return([{x:0,y:yEqu},{x:highestValueX,y:valY}])
                    }else{
                        if (xEqu >= 0) {
                            //Si corta en +x , entonces calculamos el punto para el grafico en +y
                            let relation = Math.abs(xEqu/yEqu)
                            let valX = xEqu+highestValueY*relation
                            //Si el valor calculado para Y es menor al maximo, lo llevamos hasta alli y actualizamos el YMax
                            if (valX < highestValueX){
                                valX = highestValueX
                                highestValueY = (highestValueX-xEqu)/relation
                                console.log('NewYMAX: '+highestValueY);
                            }else{
                                highestValueX = valX
                                console.log('NewXMAX: '+highestValueX);
                            }
                            console.log(xEqu+' '+yEqu);
                            return([{x:xEqu,y:0},{x:valX,y:highestValueY}])
                        }
                    }
                }
            }else {
                //Sino, es una constante.
                if (restri.coeficientes[0] !== 0) {
                    //Constante en X
                    let x = new Expression('x').multiply(restri.coeficientes[0]);
                    let restriEquation = new Equation(x,restri.derecha)
                    expresiones.push({restriEquation,tipo:0})
                    let xEqu = restriEquation.solveFor('x');
                    if (xEqu >= 0 ){
                        return([{x:xEqu,y:0},{x:xEqu,y:highestValueY}])
                    }
                }else {
                    //Constante en Y
                    let y = new Expression('y').multiply(restri.coeficientes[1]);
                    let restriEquation = new Equation(y,restri.derecha)
                    expresiones.push({restriEquation,tipo:1})
                    let yEqu = restriEquation.solveFor('y')
                    if ( yEqu >= 0) {
                        return([{x:0,y:yEqu},{x:highestValueX,y:yEqu}])
                    }               
                } 
            }
        })
        return { lines,expresiones }
    }

    
    getColorList = restricciones => restricciones.map( restri => Object({title: 'R'+restri.ri+' Tipo:'+restri.eq, color: randomColor({hue: 'random',luminosity: 'ligth'})}))

    getOptimPoint = solSet => {
        console.log('Generating Optim Point');
        //Analizamos el Punto Optimo.
        if ( solSet['0'] && solSet['1'] ) {return{x:Number(solSet['0']).toFixed(2),y:Number(solSet['1']).toFixed(2),P:'0 - OPTIMO'}
        }else if ( solSet['0'] ) {return{x:Number(solSet['0']).toFixed(2),y:(0).toFixed(2),P:'0 - OPTIMO'}
        }else { return{x:(0).toFixed(2),y:Number(solSet['1']).toFixed(2),P:'0 - OPTIMO'}}
    }

    getPoints = (restricciones,expresiones,solSet,coefToValueZ) => {
        console.log('Getting Points');
        //Definimos las Funciones necesarias para el buen funcionamiento de esta Funcion.

        const getAreaPointsForConvex = points => {
            const calcAng = (point,p) => Math.atan2(point.y - p.y, point.x - p.x) * 180 / Math.PI + 180;
            
            let pointsList = [...points];
            if ( verifyPoint({x:0,y:0},restricciones,points) ){
                            pointsList.push({x:0,y:0})
                        }
            let orderedPoints = [];
            let count = 0;
            let point = pointsList[0];
            orderedPoints.push(point)
            pointsList.splice(0,1) 
            while ( pointsList.length && count < 3 ) {
                console.log('Nuevo Ciclo, Punto Actual');
                console.log(point);
                console.log(pointsList);
                //Encuentra el punto que tiene el angulo minimo
                let minAngle = pointsList.reduce( (min,p) => calcAng(point,p) < min ? calcAng(point,p) : min, 361);
                // let arrayCalcResult = pointsList.map()
                // let indexNewPoint = pointsList.find
                // let newPoint = pointsList.find( p => p )
                console.log(minAngle); 
                if (minAngle < 361) {
                    let indNewPoint = pointsList.findIndex(p => calcAng(point,p) === minAngle);
                    point = pointsList[indNewPoint]
                    console.log(point);
                    orderedPoints.push(point)
                    pointsList.splice(indNewPoint,1)           
                }else{count++}
            }
            orderedPoints.push(orderedPoints[0])
            return orderedPoints

            // points.forEach( p => {

            // })

            // let pointsArea = [...points];

            // if ( verifyPoint({x:0,y:0},restricciones,pointsArea) ){
            //     pointsArea.push({x:0,y:0})
            // }
            
            // pointsArea.sort( (a,b) => Math.atan2(a.y - b.y, a.x - b.x) ? 1 : -1 );
            // console.log(pointsArea);
            
            // pointsArea.push(pointsArea[0])
            // console.log(pointsArea);

            // return pointsArea
        }
        
        //Funcion que se encarga de realizar las verificaciones correspondientes para agregar un punto o no.
        const verifyPoint = (point, restricciones, points) => {
            if (point.x >= 0 && point.y >= 0 ){
                if ( !verifyPointInPoints(point,points) ) {
                    if ( verifyPointInRestrictions(point,restricciones) ) { return true } else return false
                }else return false
            }else return false
        }

        //Funcion que se encarga de Verificar si un punto ya se encuentra en la lista de puntos (o ya fue verificado antes).
        const verifyPointInPoints = (point,points) => points.some( pointL => (pointL.x === point.x.toFixed(2) && pointL.y === point.y.toFixed(2)) )
        
        //Funcion que se encarga de verificar que un punto cumpla con todas las Restricciones.
        const verifyPointInRestrictions = (point,restricciones) => restricciones.every( restri => {
                    let calIzq = (restri.coeficientes[0]*point.x + restri.coeficientes[1]*point.y);
                    if( restri.eq === '>=' ) {
                        console.log('P:('+point.x +','+point.y+') :'+calIzq+' >='+ restri.derecha );                        
                        return ( calIzq >= restri.derecha ) 
                    }else { 
                        console.log('P:('+point.x +','+point.y+') :'+calIzq+' <='+ restri.derecha );                        
                        return ( calIzq <= restri.derecha )} 
                })
        // Funcion que devuelve un punto verificado y que corta en un Eje.
        const getPointAxFromExpCenX = ( exp ) => {       
            //Obtenemos el Corte sobre el Eje-Y
            let expResultX = Number((new Equation(exp.solveFor('y'),0)).solveFor('x'));
            if ( expResultX >= 0 ) {
                //Generamos el Punto en X
                let point = {x:expResultX,y:0,P:points.length}
                //Verificamos el punto en X con las Restricciones.
                if (verifyPoint(point,restricciones,points)){
                    point.x=point.x.toFixed(2)
                    point.y=point.y.toFixed(2)
                    return point} 
            }
        };
        // Funcion que devuelve un punto verificado y que corta en un Eje.
        const getPointAxFromExpCenY = ( exp ) => {       
            //Obtenemos el Corte sobre el Eje-Y
            let expResultY = Number((new Equation(exp.solveFor('x'),0)).solveFor('y'));
            if ( expResultY >= 0 ) {
                //Generamos el Punto en Y
                let point = {x:0,y:expResultY,P:points.length}
                //Verificamos el punto en Y con las Restricciones.
                if (verifyPoint(point,restricciones,points)){
                    point.x=point.x.toFixed(2)
                    point.y=point.y.toFixed(2)
                    return point} 
            }   
        };
        const getPointAxFromExpY = ( expY ) => {
            //Obtenemos el Corte sobre el Eje-Y
            let expResultY = Number(expY.solveFor('y'));
            if ( expResultY >= 0 ) {
                //Generamos el Punto en Y
                let point = {x:0,y:expResultY,P:points.length}
                //Verificamos el punto en Y con las Restricciones.
                if (verifyPoint(point,restricciones,points)){
                    point.x=point.x.toFixed(2)
                    point.y=point.y.toFixed(2)
                    return point} 
            }
            
        };
        const getPointAxFromExpX = (expX) => {
            //Obtenemos Cortes sobre el Eje-X
            let expResultX = Number(expX.solveFor('x'));
            if ( expResultX >= 0 ) {
                //Generamos el Punto en X
                let point = {x:expResultX,y:0,P:points.length}
                //Verificamos el punto en X con las Restricciones.
                if (verifyPoint(point,restricciones,points)){
                    point.x=point.x.toFixed(2)
                    point.y=point.y.toFixed(2)
                    return point} 
            } 
        }
        //Funcion que devuelve un punto verificado con una Expresion en X y otra en Y
        const getPointFromExpXExpY = ( expX,expY ) => {
            let xRes = Number(expX.solveFor('x'));
            let yRes = Number(expY.solveFor('y'));
            //Verificamos que no se corten en algun otro cuadrante que no sea el de analisis.
            if ( xRes >= 0  && yRes >= 0 ) {
                //Generamos el Punto.
                let point = {x:xRes,y:yRes,P:points.length}
                //Verificamos el Punto.
                if (verifyPoint(point,restricciones,points)){
                    point.x=point.x.toFixed(2)
                    point.y=point.y.toFixed(2)
                    return point} 
            }
        };
        //Funcion que devuelve un punto verificado con una Expresion Completa y otra en Y
        const getPointFromExpCExpY = ( expC,expY ) => {
            console.log('EXP C y Recta Y');
            let expResultY = Number(expY.solveFor('y'));
            let expResultX = Number((new Equation(expC.solveFor('y'),expY.solveFor('y'))).solveFor('x'));
            //Verificamos que no se corten en algun otro cuadrante que no sea el de analisis.
            if ( expResultX >= 0  && expResultY >= 0 ) {
                //Generamos el Punto.
                let point = {x:expResultX,y:expResultY,P:points.length}
                //Verificamos el Punto.
                if (verifyPoint(point,restricciones,points)){
                    point.x=point.x.toFixed(2)
                    point.y=point.y.toFixed(2)
                    return point} 
            }
        };
        //Funcion que devuelve un punto verificado con una Expresion Completa y otra en X
        const getPointFromExpCExpX = ( expC,expX ) => {
            console.log('EXP C y Recta X');
            let expResultX = Number(expX.solveFor('x'));
            let expResultY = Number((new Equation(expC.solveFor('x'),expX.solveFor('x'))).solveFor('y'));
            //Verificamos que no se corten en algun otro cuadrante que no sea el de analisis.
            if ( expResultX >= 0  && expResultY >= 0 ) {
                //Generamos el Punto.
                let point = {x:expResultX,y:expResultY,P:points.length}
                //Verificamos el Punto.
                if (verifyPoint(point,restricciones,points)){
                    point.x=point.x.toFixed(2)
                    point.y=point.y.toFixed(2)
                    return point}
            } 
        };
        //Funcion que devuelve un punto verificado con dos Expresion Completas.
        const getPointFromTwoExpC = (exp1,exp2) => {
            let expResultX = Number((new Equation(exp1.restriEquation.solveFor('y'),exp2.restriEquation.solveFor('y'))).solveFor('x'));
            let expResultY = Number((new Equation(exp1.restriEquation.solveFor('x'),exp2.restriEquation.solveFor('x'))).solveFor('y'));
            //Verificamos que no se corten en algun otro cuadrante que no sea el de analisis.
            if ( expResultX >= 0  && expResultY >= 0 ) {
                //Generamos el Punto.
                let point = {x:expResultX,y:expResultY,P:points.length}
                //Verificamos el Punto.
                if (verifyPoint(point,restricciones,points)){
                    point.x=point.x.toFixed(2)
                    point.y=point.y.toFixed(2)
                    return point}
                } 
        };
        //Funcion que devuelve Un punto de Dos Expresiones
        const getPointFromTwoExp = (exp1,exp2) => {
            try {
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
            } catch (error) {
                console.log(error);     
            }
            
        };
        
        //Limpiamos nuestro array de Puntos
        let points = [];
        
        //El primer punto que obtenemos es el Optimo, ya que deseamos que no se repita.
        if ( Object.entries(solSet).length ){ points.push(this.getOptimPoint(solSet)) }
        

        //Analizamos las Rectas que cortan en los Ejes o Rectas sin pendiente.
        expresiones.forEach( exp => {
            if (exp.tipo === 2) {
                //Si es Completa Corta en los dos Ejes
                let pointX = getPointAxFromExpCenX(exp.restriEquation);
                if (pointX) { points.push(pointX) }
                let pointY = getPointAxFromExpCenY(exp.restriEquation)
                if (pointY) { points.push(pointY) }
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

        //Obtenemos la secuencia de puntos que define nuestro Convexo.
        let convexPoints = getAreaPointsForConvex(points);
        console.log('Puntos:');
        console.log(convexPoints);
        

        //Debemos eliminar el punto optimo para que no se imprima en las marcas simples.
        if( Object.entries(solSet).length ){ points.shift() }
        return {points,convexPoints}
    }

  
    
    //Funcion que se encarga de devolverme la tabla.
    getTableResult = (points,coeficientes) =>
        <Table>
            <thead><tr><th>Punto</th><th>Resultado</th><th>X0</th><th>X1</th></tr></thead>
            <tbody>{points.map(point => <tr key={'T-P-'+point.P}><td>P:{point.P}</td><td>{(coeficientes.x*point.x + coeficientes.y*point.y).toFixed(2)}</td><td>{point.x}</td><td>{point.y}</td></tr>)}</tbody>
        </Table>
     
    //Funcion que encarga de ocultar la descripcion del punto.  
    hidePoint = () => this.setState({value: null})

    //Funcion que se encarga de mostrar la descripcion del punto.
    showPoint = value => this.setState({ value })


    mapperAreaSeries = (lines,referencias) => 
        lines.map((data,index) => <AreaSeries key={'L-S-A'+index} opacity={0.3} color={referencias.length > 0 ?referencias[index].color:'red'} data={data}/>)
    
    mapperLinesSeries = (lines,referencias) => 
    lines.map((data,index) => <LineSeries key={'L-S-L'+index} color={referencias.length > 0 ?referencias[index].color:'red'} data={data}/>)


    render () {
        let {referencias,lines,value,points,optimMark,coefToValueZ,convexPoints} = this.state;
        return( 
        <CardBody>
            <Card>
                <CardHeader>Grafico</CardHeader>
                <CardBody>
                    <Row className='mx-auto'>
                        <XYPlot onMouseLeave={() => this.setState({pointer: null})} width={526} height={526}>
                            <HorizontalGridLines/>
                            <VerticalGridLines/>
                            <XAxis title='Variable X0' />
                            <YAxis  title='Variable X1'/>

                            {this.mapperAreaSeries(lines,referencias)}
                            
                            {this.mapperLinesSeries(lines,referencias)}

                            <AreaSeries color='green' opacity={0.6} data={convexPoints}/>
                            
                            <MarkSeries onValueMouseOver={this.showPoint} onValueMouseOut={this.hidePoint}
                                        color={'blue'} opacity={0.7} data={points}/>
                            
                            <MarkSeries onValueMouseOver={this.showPoint} onValueMouseOut={this.hidePoint}
                                        color={'green'} data={optimMark}/>
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