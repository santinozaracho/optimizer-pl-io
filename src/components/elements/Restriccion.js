import React from 'react';
import {Tooltip, ToggleButtonGroup, ToggleButton, Button, Jumbotron, Container, Row, Col, Card, InputGroup, FormControl, OverlayTrigger} from 'react-bootstrap';



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
        
        let inputsRestriccions = coeficientes.map((coeficiente,indx) => {
            return(<>
                <FormControl key={indx}
                    name={indx}
                    placeholder="Coe"
                    aria-label="Coe"
                    aria-describedby="restriccion"
                    onChange={this.handleChangeRestriccion}
                    value={coeficiente}
                    />
                
                <InputGroup.Text name="ri" id="restriccion">+</InputGroup.Text>
                    
                </>
                )
        })
        return(
            <>
            <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text name="ri" id="restriccion">{"R"+this.props.restriccion.ri}</InputGroup.Text>
                        <InputGroup.Text name="ri" id="restriccion">{"R"+this.props.restriccion.descripcion}</InputGroup.Text>
                    </InputGroup.Prepend>
                    {inputsRestriccions}
            </InputGroup>
            </>
            )
        }
}

export default Restriccion;