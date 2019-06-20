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
                expresiones.push(restriEquation)
                let yEqu = (new Equation(restriEquation.solveFor('x'),0)).solveFor('y');
                let xEqu = (new Equation(restriEquation.solveFor('y'),0)).solveFor('x');
                return([{x:0,y:yEqu},{x:xEqu,y:0}])
            }else {
                if (restri.coeficientes[0] !== 0) {
                    let x = new Expression('x').multiply(restri.coeficientes[0]);
                    let restriEquation = new Equation(x,restri.derecha)
                    expresiones.push(restriEquation)
                    let xEqu = restriEquation.solveFor('x');
                    return([{x:0,y:xEqu},{x:10,y:xEqu}])
                }else {
                    let y = new Expression('y').multiply(restri.coeficientes[1]);
                    let restriEquation = new Equation(y,restri.derecha)
                    expresiones.push(restriEquation)
                    let yEqu = restriEquation.solveFor('y')
                    return([{x:yEqu,y:0},{x:yEqu,y:10}])
                } 
            }
        })
        return { lines,expresiones }
    }

    
    getColorList = restricciones => restricciones.map( restri => Object({title: 'R'+restri.ri, color: randomColor()}))

    getPoints = (variables,restricciones,solutionSet,expresiones) => {        
        let solSet = Object.entries(solutionSet)
        let maybePoints = [];
        

        expresiones.forEach( (exp,index) => {
            let expResultX = (new Equation(exp.solveFor('y'),0)).solveFor('x')
            let expResultY = (new Equation(exp.solveFor('x'),0)).solveFor('y')
            maybePoints.push({x:0,y:Number(expResultY),Punto:'P'+index});
            maybePoints.push({x:Number(expResultX),y:0,Punto:'P'+index});
            });
        expresiones.forEach(exp1 => {
            expresiones.forEach( exp2 => {
                if( exp1 !== exp2) {
                    let expResultX = (new Equation(exp1.solveFor('y'),exp2.solveFor('y'))).solveFor('x');
                    let expResultY = (new Equation(exp1.solveFor('x'),exp2.solveFor('x'))).solveFor('y');
                    if ( Number(expResultX) > -1  && Number(expResultY) > -1 ) {
                        maybePoints.push({x:Number(expResultX),y:Number(expResultY),Point:'P'})
                    }            
                }
            } )

        });

        if ( solSet[0] && solSet[1] ) {
            maybePoints.push({x:Number(solSet[0][1]),y:Number(solSet[1][1]),Punto:'P1 - OPTIMO'})
        }else if ( solSet[0] ) {            
            maybePoints.push({x:Number(solSet[0][1]),y:0,Punto:'P1 - OPTIMO'})
        }else {
            maybePoints.push({x:0,y:Number(solSet[1][1]),Punto:'P1 - OPTIMO'})
        }
        return maybePoints
    }
       
    _forgetValue = () => {
        this.setState({
            value: null
        });
        };
    
    _rememberValue = value => {
    this.setState({value});
    };


    mapperLinesSeries = (lines,referencias) => 
        lines.map((data,index) => <AreaSeries key={'L-S-A'+index} opacity={0.3} color={referencias.length > 0 ?referencias[index].color:'red'} data={data}/>)
    

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
                            width={400}
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