import React from 'react';
import {CardBody, Card, CardHeader} from 'reactstrap';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';





class GraphicPresentation extends React.Component{
    constructor (props){
        super(props)
        this.state={}
    }


    render () {
        return( 
            <CardBody>
                <Card>
                    <CardHeader>Hola grafico</CardHeader>
                    <CardBody>
                    <XYPlot
                        getX={d => d[0]}
                        getY={d => d[1]}
                        width={300}
                        height={300}>
                        <HorizontalGridLines />
                        <LineSeries
                            data={[
                            [5,10],
                            [3,15]
                            ]}/>
                            <LineSeries
                            data={[
                            [1,1],
                            [4,4]
                            ]}/>
                        <XAxis />
                        <YAxis />
                    </XYPlot>
                    </CardBody>
                </Card>
            </CardBody>
        )
    }
}

export default GraphicPresentation;