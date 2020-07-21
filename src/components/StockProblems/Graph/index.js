import React from 'react';
import {XYPlot, XAxis, YAxis, HorizontalGridLines,LineSeries, AreaSeries, VerticalGridLines,MarkSeries,DiscreteColorLegend,Hint} from 'react-vis';


const Graph = ({ y, yProm, t0, title, sr }) => {
  if (!sr){
    sr = 0
  }
  let line = [{x:0,y:sr},{x:0,y},{x:1,y:sr},{x:1,y},{x:2,y:sr},{x:2,y},{x:3,y:sr},{x:3,y}]
  let linePromedio = [{x:0,y:yProm},{x:5,y:yProm}]
  return (
  <div>
    <h2>{title}</h2>
    <XYPlot width={500} height={500}>
        <HorizontalGridLines/>
        <VerticalGridLines/>
        
        <XAxis title='Tiempo' />
        <YAxis title='Inventario'/>
        <LineSeries data={line}/>
        <LineSeries strokeStyle="dashed" data={linePromedio}/>
    </XYPlot>
  </div>
  )
}
export default Graph;