import React from 'react';
import {Button,InputGroupText, InputGroup, Input,InputGroupAddon, ButtonGroup} from 'reactstrap';



const Restriccion = props => {

    let {coeficientes} = props.restriccion
    if (coeficientes.length !== props.cantVariables) {        
        let diferencia = props.cantVariables - coeficientes.length;
        if ( diferencia > 0) {
            for (let index = 0; index < diferencia; index++) {
                coeficientes.push(0)       
            }
        }else {
            coeficientes.splice(props.cantVariables)
        }
    }

    let thisEq = props.restriccion.eq;
    let inputsRestriccions = coeficientes.map((coeficiente,indx) => {
        return(<>
            <Input key={'C'+props.restriccion.ri+'r'+indx}
                name={indx}
                placeholder="Coefiente"
                onChange={e => {props.handleCoefRes(e,props.restriccion.ri)}}
                value={coeficiente}
                />
            {indx === coeficientes.length-1 ? (
                <ButtonGroup key={'Eq'+props.restriccion.ri}>
                    <Button name='eq' 
                        onClick={e => {props.handleCoefRes(e,props.restriccion.ri);thisEq='<='}} 
                        active={thisEq === '<=' ? "primary":"secondary" } 
                        value='<='>{'<='}</Button>
                    <Button name='eq' 
                        disabled 
                        onClick={e => {props.handleCoefRes(e,props.restriccion.ri);thisEq='='}} 
                        active={thisEq === '=' ? "primary":"secondary"} 
                        value='='>{'='}</Button>
                    <Button name='eq' 
                        onClick={e => {props.handleCoefRes(e,props.restriccion.ri);thisEq='>='}} 
                        active={thisEq === '>=' ? true:false} 
                        value='>='>{'>='}</Button>
                </ButtonGroup>
            ):(
                <InputGroupText key={'+'+props.restriccion.ri+'r'+indx}>+</InputGroupText>
            )}
            </>
            )
    })
    return(
        <InputGroup>
                <InputGroupAddon addonType="prepend">
                    <InputGroupText key={'RR'+props.restriccion.ri}>{"R"+props.restriccion.ri}</InputGroupText>
                    <InputGroupText key={'RD'+props.restriccion.ri}>{props.restriccion.descripcion}</InputGroupText>
                </InputGroupAddon>
                {inputsRestriccions}
                <Input key={'C'+props.restriccion.ri+'r'+coeficientes.length}
                        className='InputCoe'
                        name={'derecha'}
                        placeholder="Coe"
                        aria-label="Coe"
                        aria-describedby="restriccion"
                        onChange={e => {props.handleCoefRes(e,props.restriccion.ri)}}
                        value={props.restriccion.derecha}
                        />
        </InputGroup>
        )
    
}

export default Restriccion;