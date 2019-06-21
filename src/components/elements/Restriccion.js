import React from 'react';
import {Button,InputGroupText,Card,CardBody,CardHeader,CardTitle ,InputGroup, Input,InputGroupAddon, ButtonGroup,UncontrolledTooltip} from 'reactstrap';

const Restriccion = props => {
    let {coeficientes} = props.restriccion;
    //Verificamos la cantidad de coeficientes dependiendo de la cantidad de variables.
    if (coeficientes.length !== props.cantVariables) {
        //Diferencia de entre las variables y los coeficientes de las restricciones. 
        let diferencia = props.cantVariables - coeficientes.length;
        if ( diferencia > 0 ) {
            for (let index = 0; index < diferencia; index++) {
                coeficientes.push('')       
            }
        }else {
            coeficientes.splice(props.cantVariables)
        }
    }

    let thisEq = props.restriccion.eq;
    let botoneraMaxMin = (<ButtonGroup className='mx-1' key={'Eq'+props.restriccion.ri}>
                                    <Button key={'B<s'+props.restriccion.ri} name='eq' 
                                        onClick={e => {props.handleCoefRes(e,props.restriccion.ri);thisEq='<='}} 
                                        color={thisEq === '<=' ? "primary":"secondary" } 
                                        value='<='>{'<='}</Button>
                                    <Button key={'B='+props.restriccion.ri} name='eq' 
                                        disabled 
                                        onClick={e => {props.handleCoefRes(e,props.restriccion.ri);thisEq='='}} 
                                        color={thisEq === '=' ? "primary":"secondary"} 
                                        value='='>{'='}</Button>
                                    <Button key={'B>'+props.restriccion.ri} name='eq' 
                                        onClick={e => {props.handleCoefRes(e,props.restriccion.ri);thisEq='>='}} 
                                        color={thisEq === '>=' ? "primary":"secondary"} 
                                        value='>='>{'>='}</Button>
                                </ButtonGroup>);
    let inputsRestriccions = coeficientes
    .map((coeficiente,indx) => 
        <React.Fragment key={'divCi'+indx}>
            <Input key={'Ci'+props.restriccion.ri+'r'+indx}
                type="number"
                name={indx}
                placeholder="Coefiente"
                className="InputCoeficiente"
                onChange={e => {props.handleCoefRes(e,props.restriccion.ri)}}
                value={coeficiente}
                />
            <InputGroupAddon key={'IADD'+props.restriccion.ri+'r'+indx} addonType='append'>
                <InputGroupText key={'r'+props.restriccion.ri+'r'+indx}>{'X'+indx}</InputGroupText>
            </InputGroupAddon>
            {indx < coeficientes.length-1 && <InputGroupText key={'+'+props.restriccion.ri+'r'+indx}>+</InputGroupText>}
        </React.Fragment>
            
    )

    return(
        <Card key={'CR'+props.restriccion.ri} id={'CR'+props.restriccion.ri}>
            <UncontrolledTooltip flip={false} key={'TTCR'+props.restriccion.ri} placement='auto' target={'CR'+props.restriccion.ri}>
            {'Aqui debes ingresar los coeficiente de '+props.restriccion.descripcion}
            </UncontrolledTooltip>
            <CardHeader className="p-0 m-0"><CardTitle>{'R'+props.restriccion.ri+':'+props.restriccion.descripcion}</CardTitle></CardHeader>
            <CardBody className="p-0 my-1 mx-auto">
                <InputGroup key={'RT'+props.restriccion.ri}>
                    {inputsRestriccions}
                    {botoneraMaxMin}
                    <Input key={'C'+props.restriccion.ri+'r'+coeficientes.length}
                            type="number"
                            name={'derecha'}
                            placeholder="Coe"
                            className="InputCoeficiente"
                            aria-label="Coe"
                            aria-describedby="restriccion"
                            onChange={e => {props.handleCoefRes(e,props.restriccion.ri)}}
                            value={props.restriccion.derecha}/>
                </InputGroup>
            </CardBody>
        </Card>)
    
}

export default Restriccion;