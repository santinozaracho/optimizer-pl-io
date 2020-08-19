import React from 'react';
import {XYPlot, XAxis, YAxis, HorizontalGridLines,LineSeries, VerticalGridLines} from 'react-vis';
import { Container, Row, Col } from 'reactstrap';


const GraphTriangular = ({title, s, t1p, t,}) => {
  
  let line = [{x:0,y:0},{x:t1p,y:s},{x:t,y:0}]
  let lineVerticalT1p = [{x:t1p,y:0},{x:t1p,y:s}]
  let lineHorizontalStockAlmacenado = [{x:0,y:s},{x:t,y:s}]
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
          <LineSeries color='blue' strokeStyle="dashed" data={lineHorizontalStockAlmacenado}/>
          <LineSeries color='green' strokeStyle="dashed" data={lineVerticalT1p}/>
      </XYPlot>
    </Row>
  </Container>
  )
}
export default GraphTriangular;