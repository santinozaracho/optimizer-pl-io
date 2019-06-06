import React from 'react';
import { Container,Col,Row,Progress } from "reactstrap";
import ReactWizard from 'react-bootstrap-wizard';
import  Configuration  from "./Configuration";
import  Processing  from "./Processing";
import  Presentation  from "./Presentation";
import logo from '../logo.svg';



class LinealProg extends React.Component{
    constructor (props){
        super(props)
        this.state={
            variables:[{xi:0, descripcion:'',coeficiente:0},{xi:1,descripcion:'',coeficiente:0}],
            restricciones:[{ri:0,descripcion:'',coeficientes:[],eq:'>=',derecha:0}],
            method:"graph",
            objective:"max",
            result:false
        };
    }

    handleRestricciones = restricciones => {
        this.setState({restricciones}); 
    }

    handleVariables = variables => {
        this.setState({variables}); 
    }
    
    handleMethod = method => {
        this.setState({method}); 
    }

    handleObjective = objective => {
        this.setState({objective})
    }

    handleResult = result => {
        this.setState({result})
    }
    handleStepResult = result => {
        this.setState({result})
    }
  
    render () {
        var steps = [
            // this step hasn't got a isValidated() function, so it will be considered to be true
            { stepName: "Configuracion del Modelo", 
            component:Configuration,
            stepProps:{
                status:this.state,
                handleMethod:this.handleMethod,
                handleVariables:this.handleVariables,
                handleRestricciones:this.handleRestricciones,
                handleObjective:this.handleObjective
            }
        },
            // this step will be validated to false
            { stepName: "Detalles del Modelo",
            component:Processing, 
            stepProps:{
                status:this.state,
                handleVariables:this.handleVariables,
                handleStepResult:this.handleStepResult,
                handleRestricciones:this.handleRestricciones,
            }
        },
            // this step will never be reachable because of the seconds isValidated() steps function that will always return false
            { stepName: "Presentacion de los Resultados",
            component:Presentation,
            stepProps:{
                status:this.state,        
                handleResult:this.handleResult,
            }
        }
          ];        
        return(
            <Container fluid className="App">
                <Row className="">
                    <Col xs={12} md={6}  className="mx-auto">
                        <img src={logo} className="App-logo" alt="logo" height="200" />
                        <Progress  animated color="blue" value="33" />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6}  className="my-4 mx-auto">
                        <ReactWizard
                            steps={steps}
                            title="Programacion Lineal"
                            headerTextCenter
                            validate
                            color="blue"
                            previousButtonText="Volver"
                            nextButtonText="Siguiente"
                            finishButtonClick={this.finishButtonClick}
                            />
                     
                    </Col>                        
                </Row>

            </Container>

        )
    }
}

export default LinealProg;