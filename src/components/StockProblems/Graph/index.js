import React from 'react';
import {XYPlot, XAxis, YAxis, HorizontalGridLines,LineSeries, AreaSeries, VerticalGridLines,MarkSeries,DiscreteColorLegend,Hint} from 'react-vis';
import { Container, Row, Col } from 'reactstrap';


const Graph = ({ y, yProm, t0, title, sr }) => {
  if (!sr){
    sr = 0
  }
  let line = [{x:0,y:sr},{x:0,y},{x:1,y:sr},{x:1,y},{x:2,y:sr},{x:2,y},{x:3,y:sr},{x:3,y},{x:4,y:sr},{x:4,y},{x:5,y:sr},{x:5,y}]
  let linePromedio = [{x:0,y:yProm},{x:5,y:yProm}]
  return (
  <Container>
    <Row className="justify-content-center" style={{margin:0}}>
      <h2>{title}</h2>
      <XYPlot width={500} height={500}>
          <HorizontalGridLines/>
          <VerticalGridLines/>
          
          <XAxis title='Tiempo' />
          <YAxis title='Inventario'/>
          <LineSeries color='black' data={line}/>
          <LineSeries strokeStyle="dashed" data={linePromedio}/>
      </XYPlot>
    </Row>
  </Container>
  )
}
export default Graph;