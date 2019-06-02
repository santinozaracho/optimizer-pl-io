import React from 'react';
import {InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap'


class Variable extends React.Component{
    constructor (props){
        super(props);
        this.state={};
        this.handleInputCoeficiente=this.handleInputCoeficiente.bind(this)
    }
    handleInputCoeficiente (e) {
        let {name,value} = e.target;
        this.props.getCoeficiente(name,value)
    }

    render () {
        return(
            <InputGroup key={this.props.variable.xi}>
                <InputGroupAddon addonType="prepend">
                    <InputGroupText name="xi" id="variable">{"X"+this.props.variable.xi}</InputGroupText>
                    <InputGroupText name="description" id="variable">{this.props.variable.descripcion}</InputGroupText>
                </InputGroupAddon>
                
                <Input width='10px'
                            name={this.props.variable.xi}
                            className='InputCoe'
                            placeholder="Coef"
                            aria-label="Coeficiente"
                            aria-describedby="coe"
                            onChange={this.handleInputCoeficiente}
                            value={this.props.variable.coeficiente}
                            />
                        
            </InputGroup>
        )
    }
}

export default Variable;