import React from 'react';
import {Button,InputGroupText, InputGroup, Input,InputGroupAddon, ButtonGroup} from 'reactstrap';



class Restriccion extends React.Component{
    constructor (props){
        super(props);
        this.state={coeficientes:[0,0]};
        this.handleChangeRestriccion=this.handleChangeRestriccion.bind(this);
    }

    componentDidMount(){
        this.setState({coeficientes:this.props.restriccion.coeficientes,
            derecha:this.props.restriccion.derecha,
            eq:this.props.restriccion.eq,
            descripcion:this.props.restriccion.descripcion})

    }

    handleChangeRestriccion(){
        console.log("change");
        
    }


    render () {
        let {coeficientes} = this.state
        console.log(coeficientes);
        let thisEq = this.props.restriccion.eq;
        
        let inputsRestriccions = coeficientes.map((coeficiente,indx) => {
            return(<>
                <Input key={'C'+indx}
                    name={indx}
                    placeholder="Coefiente"
                    onChange={this.handleChangeRestriccion}
                    value={coeficiente}
                    />
                {indx === coeficientes.length-1 ? (
                    <ButtonGroup key={'Eq0'}name="Inecuation">
                        <Button color={thisEq === '<=' ? "primary":"secondary" }>{'<='}</Button>
                        <Button disabled color={thisEq === '=' ? "primary":"secondary" }>{'='}</Button>
                        <Button color={thisEq === '>=' ? "primary":"secondary" }>{'>='}</Button>
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
                        <InputGroupText key='Rindx'>{"R"+this.props.restriccion.ri}</InputGroupText>
                        <InputGroupText key='Rdesc'>{"R"+this.props.restriccion.descripcion}</InputGroupText>
                    </InputGroupAddon>
                    {inputsRestriccions}
                    <Input key={'C'+coeficientes.length}
                            className='InputCoe'
                            name={'Derecha'}
                            placeholder="Coe"
                            aria-label="Coe"
                            aria-describedby="restriccion"
                            onChange={this.handleChangeRestriccion}
                            value={this.props.restriccion.derecha}
                            />
            </InputGroup>
            )
        }
}

export default Restriccion;