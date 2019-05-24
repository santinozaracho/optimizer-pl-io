import React from 'react';
import { Container,Col,Row,ProgressBar } from "react-bootstrap";
import  Configuration  from "./Configuration";
import  Processing  from "./Processing";
import  Presentation  from "./Presentation";
import logo from '../logo.svg';
import StepWizard from 'react-step-wizard';


class Inicio extends React.Component{
    constructor (props){
        super(props)
        this.state={
            params:""
        }
    }
  
    render () {

        return(
            
            <Container fluid className="App">
                <Row className="">
                    <Col xs={12} md={6}  className="mx-auto">
                        <img src={logo} className="App-logo" alt="logo" height="200" />
                        <ProgressBar animated striped variant="primary" now={33} />
                    </Col>
                </Row>
                <Row>
                    <StepWizard lg={12} md={6}  className="mt-4 mx-auto">
                        <Configuration></Configuration>
                        <Processing></Processing>
                        <Presentation></Presentation>
                    </StepWizard>
                </Row>
            </Container>

        )
    }
}

export default Inicio;