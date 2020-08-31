import React from "react";
import { Button, Container, Row, Col, Card, Jumbotron} from "reactstrap";
import {InputGroupText,InputGroup, Input,InputGroupAddon, CardText} from 'reactstrap';
import {Link} from 'react-router-dom';
import '../index.css'



class restricciones extends React.Component{
    constructor (props){
        super(props)
        this.state={
            inicio: null,
            fin: null,
            costoDeAdquisicion: null
        }
    }

    handleInputChange = (event) =>{
        this.setState({
            [event.target.name]: event.target.value,
            inputUpdated: true,
        })
    }

    render() {
        let {inicio, fin, costoDeAdquisicion} = this.state;
        let { index } = this.props;
        return(
            <Col>
                <InputGroup className="mt-3">
                    <Input
                    name={"inicio-"+this.props.index}
                    placeholder="Ingresar la cantidad mínima del rango"
                    aria-describedby="costoDeAdquisicion"
                    onChange={this.props.inputValue}
                    />

                    <InputGroupAddon addonType="prepend">
                        <InputGroupText><b>{ this.props.clase && " <= q" + this.props.index || " <= q" + this.props.index + " <"}</b></InputGroupText>
                    </InputGroupAddon>
                    
                    <Input
                    name={"fin-"+this.props.index}
                    placeholder="Ingresar la cantidad máxima del rango"
                    aria-label="costoDeAdquisicion"
                    aria-describedby="costoDeAdquisicion"
                    onChange={this.props.inputValue}
                    className={"restriccion " + this.props.clase}
                    value={this.props.valueRes}
                    />

                    <InputGroupAddon addonType="prepend">
                        <InputGroupText><b>{"b" + this.props.index}</b></InputGroupText>
                    </InputGroupAddon>

                    <Input
                    name={"costoDeAdquisicion-"+this.props.index}
                    placeholder="Ingresar el costo del producto por unidad."
                    aria-label="costoDeAdquisicion"
                    aria-describedby="costoDeAdquisicion"
                    onChange={this.props.inputValue}
                    />   

                </InputGroup>
            </Col>
        )
    }
}


export default restricciones;