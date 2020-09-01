import React from 'react';
import {XYPlot, XAxis, YAxis, HorizontalGridLines,LineSeries, VerticalGridLines} from 'react-vis';
import { Container, Row, Col } from 'reactstrap';


const GraphAgotamiento = ({title, y, s, Ti, Ti1,}) => {
  
  let line = [{x:0,y:0},{x:0,y:s},{x:Ti,y:-(y-s)},{x:Ti,y:0}]
  let lineEjeX = [{x:0,y:0},{x:Ti,y:0}]
  return (
  <Container>
    <Row className="justify-content-center" style={{margin:0}}>
      <h2>{title}</h2>
      <XYPlot width={500} height={500} id="graphComponent">
          <HorizontalGridLines/>
          <VerticalGridLines/>
          <XAxis title='Tiempo' />
          <YAxis title='Inventario'/>
          <LineSeries color='black' data={line}/>
          <LineSeries color='blue' strokeStyle="dashed" data={lineEjeX}/>
      </XYPlot>
    </Row>
  </Container>
  )
}
export default GraphAgotamiento;