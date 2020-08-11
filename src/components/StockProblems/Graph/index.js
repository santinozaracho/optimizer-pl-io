import React from 'react';
import {XYPlot, XAxis, YAxis, HorizontalGridLines,LineSeries, VerticalGridLines} from 'react-vis';
import { Container, Row, Col } from 'reactstrap';


const Graph = ({ y, yProm, t, title, sr, puntoDeReorden }) => {
  if (!sr){
    sr = 0
  }
  if (!puntoDeReorden){
    puntoDeReorden = 0
  }
  let line = [{x:0,y:0},{x:0,y},{x:t,y:sr},{x:t,y},{x:(2*t),y:sr},{x:(2*t),y},{x:(3*t),y:sr},{x:(3*t),y},{x:(4*t),y:sr},{x:(4*t),y},{x:(5*t),y:sr},{x:(5*t),y}]
  let linePromedio = [{x:0,y:yProm},{x:(5*t),y:yProm}]
  let linePuntoDeReorden = [{x:0,y:puntoDeReorden},{x:(5*t),y:puntoDeReorden}]
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
          <LineSeries color="blue" strokeStyle="dashed" data={linePuntoDeReorden}/>
      </XYPlot>
    </Row>
  </Container>
  )
}
export default Graph;