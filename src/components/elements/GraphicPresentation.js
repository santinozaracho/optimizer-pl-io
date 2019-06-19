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
            let {restricciones} = this.props
            restricciones = restricciones.filter(elem => elem.descripcion!=='')
            let referencias = this.getColorList(restricciones);
            let lines = this.getLines(restricciones);
            this.setState({referencias,lines});
        }
    }
    componentDidUpdate(prevProps){
        if ( prevProps !== this.props ){
            if ( this.props.graph ){
                let {restricciones} = this.props
                restricciones = restricciones.filter(elem => elem.descripcion!=='')
                let referencias = this.getColorList(restricciones);
                let lines = this.getLines(restricciones);
                this.setState({referencias,lines});
            }
        }
    }


    getLines = restricciones => 
        restricciones.map( restri => {
            if (restri.coeficientes[0] !== 0  && restri.coeficientes[1] !== 0) {
                console.log(restri.coeficientes);
                let x = new Expression('x').multiply(restri.coeficientes[0]);
                let y = new Expression('y').multiply(restri.coeficientes[1]);
                let expressRestri = new Expression().add(x).add(y);  
                let restriEquation = new Equation(expressRestri,restri.derecha)
                let xEqu = new Equation(restriEquation.solveFor('x'),0);
                let yEqu = new Equation(restriEquation.solveFor('y'),0);
                return([{x:0,y:xEqu.solveFor('y')},{x:yEqu.solveFor('x'),y:0}])
            }else {
                if (restri.coeficientes[0] !== 0) {
                    let x = new Expression('x').multiply(restri.coeficientes[0]);
                    let restriEquation = new Equation(x,restri.derecha)
                    let xEqu = restriEquation.solveFor('x');
                    return([{x:0,y:xEqu},{x:10,y:xEqu}])
                }else {
                    let y = new Expression('y').multiply(restri.coeficientes[1]);
                    let restriEquation = new Equation(y,restri.derecha)
                    let yEqu = restriEquation.solveFor('y')
                    return([{x:yEqu,y:0},{x:yEqu,y:10}])
                } 
            } })

    
    getColorList = restricciones => restricciones.map( restri => Object({title: 'R'+restri.ri, color: randomColor()}))

    getPoints = (variables, restricciones,) => {
        let xPoint,yPoint,pointStr;

        return {x:xPoint,y:yPoint,Punto:pointStr}
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
        let {referencias,lines,value} = this.state; 

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
                                    data={[{x:3,y:5,Punto:'A'},{x:2,y:3,Punto:'B'}]}
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