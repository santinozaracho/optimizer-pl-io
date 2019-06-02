import React from 'react';
import { Container,Col,Row,Progress,Jumbotron,Button } from "reactstrap";
import ReactWizard from 'react-bootstrap-wizard';
import  Configuration  from "./Configuration";
import  Processing  from "./Processing";
import  Presentation  from "./Presentation";
import logo from '../logo.svg';
import StepWizard from 'react-step-wizard';



class LinealProg extends React.Component{
    constructor (props){
        super(props)
        this.state={
            variables:[{xi:1, descripcion:'',coeficiente:0},{xi:2,descripcion:'',coeficiente:0}],
            restricciones:[],
            method:"graph",
            objective:"max"
        };
        this.handleRestricciones=this.handleRestricciones.bind(this)
        this.handleVariables=this.handleVariables.bind(this)
        this.handleObjective=this.handleObjective.bind(this)
        this.handleMethod=this.handleMethod.bind(this)
    }

    handleRestricciones (restricciones) {
        console.log(restricciones);
        this.setState({restricciones}); 
    }

    handleVariables (variables) {
        this.setState({variables}); 
    }
    
    handleMethod (method) {
        this.setState({method}); 
    }

    handleObjective (objective) {
        this.setState({objective})
    }
  
    render () {
        var steps = [
            // this step hasn't got a isValidated() function, so it will be considered to be true
            { stepName: "Configuracion del Modelo", 
            component:<Configuration status={this.state} 
            handleMethod={this.handleMethod}
            handleVariables={this.handleVariables}
            handleRestricciones={this.handleRestricciones}
            handleObjective={this.handleObjective} />},
            // this step will be validated to false
            { stepName: "Detalles del Modelo",
            component:<Processing status={this.state} 
            handleMethod={this.handleMethod}
            handleVariables={this.handleVariables}
            handleRestricciones={this.handleRestricciones}
            handleObjective={this.handleObjective} />
        },
            // this step will never be reachable because of the seconds isValidated() steps function that will always return false
            { stepName: "Presentacion de los Resultados",
            component:<Presentation status={this.state} 
            handleMethod={this.handleMethod}
            handleVariables={this.handleVariables}
            handleRestricciones={this.handleRestricciones}
            handleObjective={this.handleObjective} />
        }
          ];        
        return(
            <Container fluid className="App">
                <Row className="">
                    <Col xs={12} md={6}  className="mx-auto">
                        <img src={logo} className="App-logo" alt="logo" height="200" />
                        <Progress  animated color="success" value="25" />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6}  className="mt-3 mx-auto">
                        <ReactWizard
                            progressbar
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