import React from 'react';
import {Alert} from 'react-bootstrap';

class Processing extends React.Component{
    constructor (props){
        super(props)
        this.state={
            params:""
        }

    }
    render () {
        return(
            <Alert variant="success">HELLO PROCESOS</Alert>

        )
    }
}

export default Processing;