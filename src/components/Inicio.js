import React from 'react';
import { Container,Col,Row,ProgressBar } from "react-bootstrap";
import  Configuration  from "./Configuration";
import  Processing  from "./Processing";
import  Presentation  from "./Presentation";
import logo from '../logo.svg';

class Inicio extends React.Component{
    constructor (props){
        super(props)
        this.state={
            params:""
        }
    }
  
    render () {

        var steps = [
            // this step hasn't got a isValidated() function, so it will be considered to be true
            { stepName: "Configuration", component: Configuration },
            // this step will be validated to false
            { stepName: "Processing", component: Processing },
            // this step will never be reachable because of the seconds isValidated() steps function that will always return false
            { stepName: "Presentation", component: Presentation }
          ];
    
        

        return(
            
            <Container fluid className="App">
                <Row className="">
                    <Col xs={12} md={6}  className="mx-auto">
                        <img src={logo} className="App-logo" alt="logo" height="200" />
                        <ProgressBar animated striped variant="primary" now={33} />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6}  className="mt-4 mx-auto">
                        <Configuration></Configuration>
                        <Processing></Processing>
                        <Presentation></Presentation>
                    </Col>
                </Row>
            </Container>

        )
    }
}

export default Inicio;