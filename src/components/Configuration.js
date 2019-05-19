import React from 'react';
import {Alert} from 'react-bootstrap';

class Configuration extends React.Component{
    constructor (props){
        super(props)
        this.state={
            params:""
        }

    }
    render () {
        return(
            <Alert variant="primary">HELLO BABEEEE</Alert>

        )
    }
}

export default Configuration;