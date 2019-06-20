import React from 'react';
import {CardBody, Card, CardHeader,CardFooter,UncontrolledTooltip,Row} from 'reactstrap';
import {XYPlot, XAxis, YAxis, HorizontalGridLines,LineSeries, AreaSeries, VerticalGridLines,MarkSeries,DiscreteColorLegend,Hint} from 'react-vis';
import {Expression, Equation} from 'algebra.js';
var randomColor = require('randomcolor');






class GraphicPresentation extends React.Component{
    constructor (props){
        super(props)
        this.state={points:[],lines:[],referencias:[],value:null}
    }

    componentDidMount() {
        if ( this.props.graph ){
            let {variables,restricciones,result} = this.props
            restricciones = restricciones.filter(elem => elem.descripcion!=='');
            variables = variables.filter(elem => elem.descripcion!=='');
            let referencias = this.getColorList(restricciones);
            let {lines,expresiones} = this.getLinesAndExpressions(restricciones);
            console.log('Expresiones');
            console.log(expresiones);
            let points = this.getPoints(variables,restricciones,result.solutionSet,expresiones)
            this.setState({referencias,lines,points});
            
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
                console.log('Expresiones');
                console.log(expresiones);
                let points = this.getPoints(variables,restricciones,result.solutionSet,expresiones)
                this.setState({referencias,lines,points});
            }
        }
    }


    getLinesAndExpressions = restricciones => {
        let expresiones = [];
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
                    if (xEqu > -1 ){return([{x:xEqu,y:0},{x:xEqu,y:10}])}
                }else {
                    console.log(restri.coeficientes);
                    let y = new Expression('y').multiply(restri.coeficientes[1]);
                    let restriEquation = new Equation(y,restri.derecha)
                    expresiones.push({restriEquation,tipo:1})
                    let yEqu = restriEquation.solveFor('y')
                    if ( yEqu > -1) {return([{x:0,y:yEqu},{x:10,y:yEqu}])}               
                } 
            }
        })
        return { lines,expresiones }
    }

    
    getColorList = restricciones => restricciones.map( restri => Object({title: 'R'+restri.ri+' T:'+restri.eq.slice(0,-1), color: randomColor()}))

    getPoints = (variables,restricciones,solutionSet,expresiones) => {  
        //Preparamos el Punto Optimo      
        let solSet = solutionSet
        console.log(solSet);
        
        //Limpiamos nuestro array de Puntos
        let points = [];
        
        //Analizamos las Rectas que cortan en los Ejes.
        expresiones.forEach( exp => {
            
            if (exp.tipo === 2) {
                //Obtenemos Cortes sobre el Eje-X
                let expResultX = Number((new Equation(exp.restriEquation.solveFor('y'),0)).solveFor('x'));
                //Obtenemos el Corte sobre el Eje-Y
                let expResultY = Number((new Equation(exp.restriEquation.solveFor('x'),0)).solveFor('y'));

                if ( expResultY > -1 ) {
                    //Generamos el Punto en Y
                    let pointInAxY = {x:0,y:expResultY,P:points.length+1}
                    //Verificamos el punto en Y con las Restricciones.
                    if (this.verifyPointInRestrictions(pointInAxY,restricciones)){points.push(pointInAxY)}
                }
                if ( expResultX > -1 ) {
                     //Generamos el Punto en X
                    let pointInAxX = {x:expResultX,y:0,P:points.length+1}
                    //Verificamos el punto en X con las Restricciones.
                    if (this.verifyPointInRestrictions(pointInAxX,restricciones)){points.push(pointInAxX)} 
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
                        expResultX = Number((new Equation(exp1.restriEquation.solveFor('y'),exp2.restriEquation.solveFor('y'))).solveFor('x'));
                        expResultY = Number((new Equation(exp1.restriEquation.solveFor('x'),exp2.restriEquation.solveFor('x'))).solveFor('y'));
                    }
                    //Verificamos que no se corten en algun otro cuadrante que no sea el de analisis.
                    if ( expResultX > -1  && expResultY > -1 ) {
                        //Generamos el Punto.
                        let point = {x:expResultX,y:expResultY,P:points.length+1}
                        //Verificamos el Punto.
                        if (this.verifyPointInRestrictions(point,restricciones)){points.push(point)}     
                    }            
                }
            } )

        });

        //Analizamos el Punto Optimo.
        if ( solSet['0'] && solSet['1'] ) {
            points.push({x:Number(solSet['0']),y:Number(solSet['1']),P:'0 - OPTIMO'})
        }else if ( solSet[0] ) {
            points.push({x:Number(solSet['0']),y:0,P:'0 - OPTIMO'})
        }else {
            points.push({x:0,y:Number(solSet['1']),P:'0 - OPTIMO'})
        }
        return points
    }

    verifyPointInPoints = () =>{}

    verifyPointInRestrictions = (point,restricciones) => {
        let verify = true;
        restricciones.forEach( restri => {
            let calIzq = restri.coeficientes[0]*point.x + restri.coeficientes[1]*point.y;
         
            if( restri.eq === '>=' ) {
                console.log('P:'+point+' R:'+calIzq + '>='+ restri.derecha);
                if (calIzq < restri.derecha) {verify=false}
            }else {
                console.log('P:('+point.x+','+point.y+') R:'+calIzq + '<='+ restri.derecha);
                if (calIzq > restri.derecha) {verify=false}
            } } )
        return verify
    }
       
    _forgetValue = () => this.setState({value: null})

    
    _rememberValue = value => this.setState({ value })


    mapperLinesSeries = (lines,referencias) => 
        lines.map((data,index) => <LineSeries key={'L-S-A'+index} color={referencias.length > 0 ?referencias[index].color:'red'} data={data}/>)
    

    render () {
        let {referencias,lines,value,points} = this.state; 

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
                                    onValueMouseOver={this._rememberValue}
                                    onValueMouseOut={this._forgetValue}
                                    data={points}
                                    />
                                {value && <Hint value={value} />} 
                        </XYPlot>
                    </Row>
                    <Row className='mx-auto'><DiscreteColorLegend orientation="horizontal" items={referencias}/></Row>
                </CardBody>
                <CardFooter>
                    Aca va la Tabla
                </CardFooter>
            </Card>
        </CardBody> )
    }
}

export default GraphicPresentation;