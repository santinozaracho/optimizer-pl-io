import React from 'react';
import {Alert} from 'reactstrap';

class Presentation extends React.Component{
    constructor (props){
        super(props)
        this.state={
            params:""
        }

    }
    render () {
        return(
            <Alert color="warning">HELLO PRESENETATIOANON</Alert>

        )
    }
}

export default Presentation;