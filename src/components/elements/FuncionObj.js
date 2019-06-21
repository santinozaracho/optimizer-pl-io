import React from 'react';
import {InputGroup, InputGroupAddon, InputGroupText, Input, UncontrolledTooltip } from 'reactstrap'


const FuncionObj = props => {
    let {variables} = props
    let variablesToFunction = variables
    .filter(vari => vari.descripcion !== '')
    .map( (vari,index) => 
        <React.Fragment key={'divIF'+index}>
            <UncontrolledTooltip flip={false} key={'TTV'+index} placement='auto' target={'IF'+index}>
            {'Aqui debes ingresar el coeficiente de '+vari.descripcion}
            </UncontrolledTooltip>
            <Input key={'IF'+index}
                    id={'IF'+index}
                        type='number'
                        name={vari.xi}
                        placeholder="Coef"
                        className="InputCoeficiente"
                        aria-label="Coeficiente"
                        aria-describedby="coe"
                        onChange={ e => props.handleCoefVar(e)}
                        value={vari.coeficiente}
                        />
            <InputGroupAddon key={'ADDIF'+index} addonType="append">
                <InputGroupText key={'IFD'+index}>{"X"+vari.xi}</InputGroupText>
            </InputGroupAddon>
            {index < variables.filter(vari => vari.descripcion !== '').length-1 && <InputGroupText key={'+IF'+index}>+</InputGroupText>}
        </React.Fragment>) 

    return(
            <InputGroup key={'INPUTFUNCIONAL'}>
                {variablesToFunction}
                <InputGroupText className='mx-1' key='IFOPT'>{' => '+props.objective.toUpperCase()}</InputGroupText>
            </InputGroup>
    
    ) 
}

export default FuncionObj;