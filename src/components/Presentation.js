import React from 'react';
import {Alert} from 'react-bootstrap';

class Presentation extends React.Component{
    constructor (props){
        super(props)
        this.state={
            params:""
        }

    }
    render () {
        return(
            <Alert variant="warning">HELLO PRESENETATIOANON</Alert>

        )
    }
}

export default Presentation;