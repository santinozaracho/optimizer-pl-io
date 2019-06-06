import React from 'react';
import {InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap'


const Variable = props=> {
    return(
        <InputGroup key={'VI'+props.variable.xi}>
            <InputGroupAddon addonType="prepend">
                <InputGroupText name="xi" id="variable">{"X"+props.variable.xi}</InputGroupText>
                <InputGroupText name="description" id="variable">{props.variable.descripcion}</InputGroupText>
            </InputGroupAddon>
            
            <Input      type='number'
                        name={props.variable.xi}
                        className='InputCoe'
                        placeholder="Coef"
                        aria-label="Coeficiente"
                        aria-describedby="coe"
                        onChange={ e => props.handleCoefVar(e)}
                        value={props.variable.coeficiente}
                        />
                    
        </InputGroup>
    ) 
}

export default Variable;