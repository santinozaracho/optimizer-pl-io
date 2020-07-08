import React from 'react';
import {CardBody, Card, CardHeader,CardFooter,Table,Row,Col,CardTitle,Button} from 'reactstrap';
import {XYPlot, XAxis, YAxis, HorizontalGridLines,LineSeries, AreaSeries, VerticalGridLines,MarkSeries,DiscreteColorLegend,Hint} from 'react-vis';
import {Expression, Equation,Fraction} from 'algebra.js';
import ReferencesList from '../ReferencesList';
var randomColor = require('randomcolor');






class GraphicPresentation extends React.Component{
    constructor (props){
        super(props)
        this.state={lineFunctional:[],convexPoints:[],tableResult:'',optimMark:[],points:[],lines:[],referencias:[],value:null,areaGraph:false}
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
        let {lines,expresiones,highestValueX,highestValueY} = this.getLinesAndExpressions(restricciones);
        //Obtenemos los Puntos de marca general
        let {points,convexPoints} = this.getPoints(restricciones,expresiones,result,highestValueX,highestValueY)    
        //Obtenemos el Punto Optimo
        let optimMark = []
        if( Object.entries(result).length ){ optimMark = [this.getOptimPoint(result)]}
        //Obtenemos la Recta del Funcional.
        // console.log('Maximos X:'+highestValueX+', Y:e'+highestValueY);
        let lineFunctional = this.getObjectiveFunctionLine(variables,optimMark[0],highestValueX,highestValueY);
        // console.log(lineFunctional);
        //Obtenemos la Tabla de resultados.
        let tableResult = this.getTableResult(optimMark.concat(points),coefToValueZ,restricciones)
        //Almacenamos el Estado.
        this.setState({referencias,lines,points,optimMark,convexPoints,lineFunctional,tableResult});
    }

    getCoeficientesToEv =  variables => {
        let coef={x:0,y:0};
        coef.x = variables[0].coeficiente;
        coef.y = variables[1].coeficiente;
        return coef
    }


    getLinesAndExpressions = restricciones => {
        const getFrac = real => new Fraction(Math.pow(10,(real - real.toFixed()).toString().length - 2)*real, Math.pow(10,(real - real.toFixed()).toString().length - 2)) 
        //Tipos de Expresiones: 0: Constante en X; 1: Constante en Y; 2: Recta con pendiente.
        let expresiones = [];
        let arrayDeRestriccionesConLosDosCoef =  restricciones.filter(el=> ( el.coeficientes[0] > 0 && el.coeficientes[1] > 0) )
        let highestValueY = Math.max.apply(Math,arrayDeRestriccionesConLosDosCoef.map( restri => (restri.derecha / restri.coeficientes[1])));
        let highestValueX = Math.max.apply(Math,arrayDeRestriccionesConLosDosCoef.map( restri => (restri.derecha / restri.coeficientes[0])));
        // console.log('Ymax: '+highestValueY+' Xmax:'+highestValueX);
        
        let lines = restricciones.map( restri => {
      

            let xNum = !Number.isInteger(Number(restri.coeficientes[0])) ? getFrac(Number(restri.coeficientes[0])):Number(restri.coeficientes[0]);

            let yNum = !Number.isInteger(Number(restri.coeficientes[1])) ? getFrac(Number(restri.coeficientes[1])):Number(restri.coeficientes[1]);
 
            //Si posee ambos coeficientes entoces es una recta con pendiente.
            if ( xNum !== 0  &&  yNum!== 0) {
                let x = new Expression('x').multiply(xNum);
                let y = new Expression('y').multiply(yNum);
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
                            // console.log('NewXMAX: '+highestValueX);
                        }else{
                            highestValueY = valY            
                            // console.log('NewYMAX: '+highestValueY);
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
                                // console.log('NewYMAX: '+highestValueY);
                            }else{
                                highestValueX = valX
                                // console.log('NewXMAX: '+highestValueX);
                            }
                            // console.log(xEqu+' '+yEqu);
                            return([{x:xEqu,y:0},{x:valX,y:highestValueY}])
                        }
                    }
                }
            }else {
                //Sino, es una constante.
                if (xNum !== 0) {
                    //Constante en X
                    let x = new Expression('x').multiply(xNum);
                    let restriEquation = new Equation(x,restri.derecha)
                    expresiones.push({restriEquation,tipo:0})
                    let xEqu = restriEquation.solveFor('x');
                    if (xEqu >= 0 ){
                        return([{x:xEqu,y:0},{x:xEqu,y:highestValueY}])
                    }
                }else {
                    //Constante en Y
                    let y = new Expression('y').multiply(yNum);
                    let restriEquation = new Equation(y,restri.derecha)
                    expresiones.push({restriEquation,tipo:1})
                    let yEqu = restriEquation.solveFor('y')
                    if ( yEqu >= 0) {
                        return([{x:0,y:yEqu},{x:highestValueX,y:yEqu}])
                    }               
                } 
            }
        })
        // console.log('MAXS:'+highestValueX+'y:'+highestValueY);
        
        return { lines,expresiones,highestValueX,highestValueY }
    }

    getColorList = restricciones => restricciones.map( restri => Object({title: 'R'+restri.ri+' Tipo:'+restri.eq, color: randomColor({hue: 'random',luminosity: 'ligth'})}))

    getOptimPoint = solSet => {
        console.log('Generating Optim Point');
        //Analizamos el Punto Optimo.
        if ( solSet['0'] && solSet['1'] ) {return{x:Number(solSet['0']).toFixed(2),y:Number(solSet['1']).toFixed(2),P:'0 - OPTIMO'}
        }else if ( solSet['0'] ) {return{x:Number(solSet['0']).toFixed(2),y:(0).toFixed(2),P:'0 - OPTIMO'}
        }else { return{x:(0).toFixed(2),y:Number(solSet['1']).toFixed(2),P:'0 - OPTIMO'}}
    }

    getObjectiveFunctionLine = (variables,optimPoint,xMax,yMax) => {
        console.log('Getting OF Line');
        //Funcion que devuelve una Fraccion de Algebra.js a partir de un numero real.
        const getFrac = real => new Fraction(Math.pow(10,(real - real.toFixed()).toString().length - 2)*real, Math.pow(10,(real - real.toFixed()).toString().length - 2)) 
        if (optimPoint){
            try {
                if (variables[0].coeficiente !== 0  && variables[1].coeficiente !== 0) {

                    let xPoint = !Number.isInteger(Number(optimPoint.x)) ? getFrac(Number(optimPoint.x)):Number(optimPoint.x);

                    let yPoint = !Number.isInteger(Number(optimPoint.y)) ? getFrac(Number(optimPoint.y)):Number(optimPoint.y);
               
                    let xExp = new Expression('x').subtract(xPoint).multiply(variables[0].coeficiente);
                    let yExp = new Expression('y').subtract(yPoint).multiply(variables[1].coeficiente);
                    
                    let expFunObj = new Equation(new Expression().add(xExp).add(yExp),0);  
          
                    let xEqu = (new Equation(expFunObj.solveFor('y'),0)).solveFor('x');

                    let yEqu = (new Equation(expFunObj.solveFor('x'),0)).solveFor('y');
        
                    //Analizamos pendientes positivas y negativas
                    // console.log('Result Y: '+yEqu.toString());
                    // console.log('yMax: '+yMax);
                    // console.log('Result X: '+xEqu.toString());
                    // console.log('xMax: '+xMax);
                    //Analizamos los Puntos
                    if (xEqu >= 0 && yEqu >=0){
                        
                            if (xEqu > xMax && yEqu > yMax) {
                                let yRelation = (xEqu/yEqu)
                                let xRelation = (yEqu/xEqu)
                                let xVal = xEqu - yMax/xRelation
                                let yVal = yEqu - xMax/yRelation
                                return [{x:xMax,y:yVal},{x:xVal,y:yMax}]
                            }else if (xEqu <= xMax && yEqu <= yMax) {
                                return [{x:xEqu,y:0},{x:0,y:yEqu}]
                            }else if (xEqu > xMax){
                                    let yRelation = (xEqu/yEqu)
                                    let yVal = yEqu - xMax/yRelation
                                    return [{x:xMax,y:yVal},{x:0,y:yEqu}]
                                }else{
                                    let xRelation = (yEqu/xEqu)
                                    let xVal = xEqu - yMax/xRelation
                                    return [{x:xEqu,y:0},{x:xVal,y:yMax}]
                                }
                    }else if ( xEqu < 0 && yEqu < 0 ) {
                        // console.log('Los dos Neg');
                        return [{x:xEqu,y:0},{x:0,y:yEqu}]
                    }else if ( xEqu >= 0 ) {
                        // console.log('Solo xEqu pos');
                        if (xEqu > xMax){
                            let yRelation = (xEqu/yEqu)
                            let yVal = yEqu - xMax/yRelation
                            return [{x:xMax,y:yVal},{x:0,y:yEqu}]
                        }else{
                            let xRelation = (yEqu/xEqu)
                            let xVal = xEqu - yMax/xRelation
                            if (xVal > xMax){
                                // console.log('Caso XVal > xMax');
                                
                                let xRelation = Math.abs(yEqu/xEqu)
                                let yVal = xMax*xRelation + yEqu
                                return [{x:xEqu,y:0},{x:xMax,y:yVal}]
                            }else{
                                // console.log('Caso Comun');            
                                return [{x:xEqu,y:0},{x:xVal,y:yMax}]
                            }    
                        }
                    }else{
                        // console.log('Solo yEqu pos')
                        if (yEqu > yMax){
                            console.log('Caso pendiente de desarrollo, Que hacemos? damos mas altura para mostrar la recta?');
                            return []
                        }else{
                            let yRelation = Math.abs(yEqu/xEqu)
                            let xVal = yRelation * (yMax - yEqu)
                            if (xVal > xMax){
                                console.log('Caso PENDIENTE DE VERIFICACION XVal > xMAx');
                                let xRelation = Math.abs(xEqu/yEqu)
                                let yVal = xMax*xRelation + yEqu
                                return [{x:xEqu,y:0},{x:xMax,y:yVal}]
                            }else{
                                // console.log('Caso Comun');            
                                return [{x:0,y:yEqu},{x:xVal,y:yMax}]
                            }    
                        }
                    }
                }else if( variables[0].coeficiente !== 0) {
                    // console.log('Sin puendiente, Constante en X'); 
                    //Constante en X
                    
                    let xPoint = !Number.isInteger(Number(optimPoint.x)) ? getFrac(Number(optimPoint.x)):Number(optimPoint.x);
                    let xExp = new Expression('x').subtract(xPoint).multiply(variables[0].coeficiente);   
                    let xEqu = (new Equation(xExp,0)).solveFor('x');
                   
                    if (xEqu >= 0 ){
                        return([{x:xEqu,y:0},{x:xEqu,y:yMax}])
                    }     
                }else{

                    // console.log('Sin pendiente, Constante en Y');
                    //Constante en Y
                    let yPoint = !Number.isInteger(Number(optimPoint.y)) ? getFrac(Number(optimPoint.y)):Number(optimPoint.y);
                    let yExp = new Expression('y').subtract(yPoint).multiply(variables[1].coeficiente);
                    let yEqu = (new Equation(yExp,0)).solveFor('y');
                    if (yEqu >= 0 ){
                        return([{x:0,y:yEqu},{x:xMax,y:yEqu}])
                    }     
                }
                
            } catch (error) {
                console.log(error);
                return [] 
            }

        }else return []      
    }

    getPoints = (restricciones,expresiones,solSet,xMax,yMax) => {
        //Definimos las Funciones necesarias para el buen funcionamiento de esta Funcion
        const getAreaPointsForConvex = points => {
            //Funcion que calcula el Angulo entre dos puntos.
            const calcAng = (point,p) => Math.atan2(point.y - p.y, point.x - p.x) * 180 / Math.PI + 180;
            //Precargamos puntos que podrian definir el convexo.
            let possiblePoints = [{x:0,y:0},{x:xMax,y:yMax},{x:Number(points[0].x),y:0},{x:0,y:Number(points[0].y)},{x:xMax,y:Number(points[0].y)},{x:Number(points[0].x),y:xMax}]            
            //Obtenemos la lista de puntos
            let pointsList = [...points];
            //Verificamos puntos que podrian definir el convexo.
            possiblePoints.forEach( p => (verifyPoint(p,restricciones,points)) && pointsList.push(p) ) 
            //Nos aseguramos de tomar el punto que este en el extremo derecho.
            pointsList.sort((a,b) => a.x<b.x ? 1:-1);
            //Creamos nuestra Output
            let orderedPoints = [];
            let point = pointsList[0];
            orderedPoints.push(point)
            pointsList.splice(0,1) 
            while ( pointsList.length ) {
                //Encuentra el punto que tiene el angulo minimo
                let minAngle = pointsList.reduce( (min,p) => calcAng(point,p) < min ? calcAng(point,p) : min, 361);
                if (minAngle < 361) {
                    let indNewPoint = pointsList.findIndex(p => calcAng(point,p) === minAngle);
                    point = pointsList[indNewPoint]
                    orderedPoints.push(point)
                    pointsList.splice(indNewPoint,1)           
                } else { 
                    console.log('Cant find any Angle');
                    break}
            }
            orderedPoints.push(orderedPoints[0])
            return orderedPoints
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
                        // console.log('P:('+point.x +','+point.y+') :'+calIzq+' >='+ restri.derecha );                        
                        return ( calIzq >= restri.derecha ) 
                    }else { 
                        // console.log('P:('+point.x +','+point.y+') :'+calIzq+' <='+ restri.derecha );                        
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
            // console.log('EXP C y Recta Y');
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
            // console.log('EXP C y Recta X');
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
        // console.log('Puntos:');
        // console.log(convexPoints);
        //Debemos eliminar el punto optimo para que no se imprima en las marcas simples.
        if( Object.entries(solSet).length ){ points.shift() }
        return {points,convexPoints}
    }

    //Funcion que se encarga de devolverme la tabla.
    getTableResult = (points,coeficientes,restricciones) =>{ 
        const calcSlacksValue = point => {
            return restricciones.map( restri => <td key={'S-C-'+point.P+'-'+restri.ri}>{(Math.abs(restri.coeficientes[0]*point.x+restri.coeficientes[1]*point.y - restri.derecha)).toFixed(2)}</td>)
        }
        const calcResult = point =>{return (Math.abs(coeficientes.x*point.x + coeficientes.y*point.y)).toFixed(2)}
        console.log("IMPRIMIENDO RESULT:" + calcResult);
        let slacksTitles = restricciones.map(restri => <th key={'S-T-'+restri.ri}>{'S'+restri.ri}</th>)
        return( <Table>
                    <thead><tr><th>Punto</th><th>Resultado</th><th>X0</th><th>X1</th>{slacksTitles}</tr></thead>
                    <tbody>{points.map(point => <tr key={'T-P-'+point.P}><td>P:{point.P}</td><td>{calcResult(point)}</td><td>{point.x}</td><td>{point.y}</td>{calcSlacksValue(point)}</tr>)}</tbody>
                </Table>)
    }
       
     
    //Funcion que encarga de ocultar la descripcion del punto.  
    hidePoint = () => this.setState({value: null})

    //Funcion que se encarga de mostrar la descripcion del punto.
    showPoint = value => this.setState({ value })


    mapperAreaSeries = (lines,referencias) => 
        lines.map((data,index) => <AreaSeries key={'L-S-A'+index} opacity={0.3} color={referencias.length > 0 ?referencias[index].color:'red'} data={data}/>)
    
    mapperLinesSeries = (lines,referencias) => 
    lines.map((data,index) => <LineSeries key={'L-S-L'+index} color={referencias.length > 0 ?referencias[index].color:'red'} data={data}/>)


    render () {
        let {variables,restricciones} = this.props
        let {referencias,lines,value,points,optimMark,convexPoints,lineFunctional,areaGraph,tableResult} = this.state;
        return( 
        <CardBody>
            <Card outline color='secondary'>
                <CardHeader>
                    <Row>
                        <Col className="text-left"><CardTitle><h4>Grafico:</h4></CardTitle></Col>
                        <Col><Button outline size='sm'
                            onClick={() => this.setState({areaGraph:!this.state.areaGraph})} 
                            color={!this.state.areaGraph ? 'success':'danger'}>{!this.state.areaGraph ? 'Ver Sombra de Restricciones':'Ocultar Sombra de Restricciones'}</Button>
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Row className='mx-auto GraphClass'>
                        <XYPlot onMouseLeave={() => this.setState({pointer: null})} width={500} height={500}>
                            <HorizontalGridLines/>
                            <VerticalGridLines/>
                            <XAxis title='Variable X0' />
                            <YAxis  title='Variable X1'/>

                            {areaGraph && this.mapperAreaSeries(lines,referencias)}
                            
                            {this.mapperLinesSeries(lines,referencias)}

                            <AreaSeries fill='green' stroke='#fffff' style={{strokeWidth: 0}} opacity={0.6} data={convexPoints}/>

                            <LineSeries color='red' strokeStyle='dashed' data={lineFunctional}/>
                            
                            <MarkSeries onValueMouseOver={this.showPoint} onValueMouseOut={this.hidePoint}
                                        color={'blue'} opacity={0.7} data={points}/>
                            
                            <MarkSeries onValueMouseOver={this.showPoint} onValueMouseOut={this.hidePoint}
                                        color={'green'} data={optimMark}/>
                            {value && <Hint value={value} />}

                        </XYPlot>
                    </Row>
                    <Row className='mx-auto'><DiscreteColorLegend orientation="horizontal" items={referencias}/></Row>
                    <Row><ReferencesList variables={variables} restricciones={restricciones}/></Row>
                </CardBody>
                <CardFooter>
                    {tableResult}
                </CardFooter>
            </Card>
        </CardBody> )
    }
}

export default GraphicPresentation;