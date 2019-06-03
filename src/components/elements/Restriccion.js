import React from 'react';
import {Button,InputGroupText, InputGroup, Input,InputGroupAddon, ButtonGroup} from 'reactstrap';



class Restriccion extends React.Component{
    constructor (props){
        super(props);
        this.handleChangeCoeRestriccion=this.handleChangeCoeRestriccion.bind(this);
        this.handleChangeRigthRestriccion=this.handleChangeRigthRestriccion.bind(this);
        this.handleChangeEqRestriccion=this.handleChangeEqRestriccion.bind(this);
    }


    handleChangeCoeRestriccion(event){
        let {name,value} = event.target
        this.props.restriccion.coeficientes[name]=value
    }

    handleChangeRigthRestriccion (event){
        let {value} = event.target;
        console.log(this.props.restriccion.derecha);
        
        this.props.restriccion.derecha = value
        console.log(value);
        
    }

    handleChangeEqRestriccion (event){
        let {value} = event.target;
        this.props.restriccion.eq = value;
        console.log(this.props.restriccion);
    }

    render () {
        let {coeficientes} = this.props.restriccion
        console.log(coeficientes);
        let thisEq = this.props.restriccion.eq;
        console.log(thisEq);
        let inputsRestriccions = coeficientes.map((coeficiente,indx) => {
            return(<>
                <Input key={'C'+indx}
                    name={indx}
                    placeholder="Coefiente"
                    onChange={this.handleChangeCoeRestriccion}
                    value={coeficiente}
                    />
                {indx === coeficientes.length-1 ? (
                    <ButtonGroup key={'Eq'+this.props.restriccion.ri} name="Inecuation">
                        <Button onClick={this.handleChangeEqRestriccion} color={thisEq === '<=' ? "primary":"secondary" } value='<='>{'<='}</Button>
                        <Button disabled onClick={this.handleChangeEqRestriccion} color={thisEq === '=' ? "primary":"secondary"} value='='>{'='}</Button>
                        <Button onClick={this.handleChangeEqRestriccion} color={thisEq === '>=' ? "primary":"secondary"} value='>='>{'>='}</Button>
                  </ButtonGroup>
                ):(
                    <InputGroupText key={'+'+indx}>+</InputGroupText>
                )}
                </>
                )
        })
        return(
            <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText key={'RR'+this.props.restriccion.ri}>{"R"+this.props.restriccion.ri}</InputGroupText>
                        <InputGroupText key={'RD'+this.props.restriccion.ri}>{this.props.restriccion.descripcion}</InputGroupText>
                    </InputGroupAddon>
                    {inputsRestriccions}
                    <Input key={'C'+coeficientes.length}
                            className='InputCoe'
                            name={'derecha'}
                            placeholder="Coe"
                            aria-label="Coe"
                            aria-describedby="restriccion"
                            onChange={this.handleChangeRigthRestriccion}
                            value={this.props.restriccion.derecha}
                            />
            </InputGroup>
            )
        }
}

export default Restriccion;