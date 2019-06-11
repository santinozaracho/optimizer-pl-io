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
            variables:[{xi:0, descripcion:'',coeficiente:''},{xi:1,descripcion:'',coeficiente:''}],
            restricciones:[{ri:0,descripcion:'',coeficientes:[],eq:'>=',derecha:''}],
            method:"graph",
            objective:"max",
            integer:false,
            result:false,
            barProg:33
        };
    }
    //Esta funcion maneja el cambio en las restricciones
    handleRestricciones = restricciones => {
        this.setState({restricciones}); 
    }
    //Esta funcion maneja el cambio en las variables
    handleVariables = variables => {
        this.setState({variables}); 
    }
    //Esta funcion maneja el cambio del metodo
    handleMethod = method => {
        this.setState({method}); 
    }
    //Esta funcion maneja el cambio del objetivo de optimizacion
    handleObjective = objective => {
        this.setState({objective})
    }
    toggleInteger = () => this.setState({integer:!this.state.integer});
    //Esta funcion guarda el resultado (inutilizada por el momento)
    handleResult = result => {
        this.setState({result})
    }
    //Esta funcion habilita el calculo en el ultimo paso
    lastStep = step => {
        if (step === 2) {
            this.setState({result:true,barProg:100})
        }else{
            this.setState({result:false,barProg:66})
        }
        
    }

    finishButtonClick = result => {
        console.log('En algun momento va a imprimir resultados');
    }

    loadExampleModel = () =>{
        let variables = [{xi:0, descripcion:'Pantalones (U/dia)',coeficiente:3},{xi:1, descripcion:'Camisas (U/Dia)',coeficiente:1}]
        let restricciones = [{ri:0,descripcion:'Mano de Obra (hs/Dia)',coeficientes:[2,1],eq:'<=',derecha:8},{ri:1,descripcion:'Tela (m2)',coeficientes:[3,1],eq:'<=',derecha:30}]
        this.setState({variables,restricciones,objective:"max"})
    }
  
    render () {
        var steps = [
            // this step hasn't got a isValidated() function, so it will be considered to be true
            { stepName: "Configuracion del Modelo", 
            component:Configuration,
            stepProps:{
                status:this.state,
                loadExampleModel:this.loadExampleModel,
                handleMethod:this.handleMethod,
                handleVariables:this.handleVariables,
                handleRestricciones:this.handleRestricciones,
                lastStep:this.lastStep,
                toggleInteger:this.toggleInteger,
                handleObjective:this.handleObjective
            }
        },
            // this step will be validated to false
            { stepName: "Detalles del Modelo",
            component:Processing, 
            stepProps:{
                status:this.state,
                handleVariables:this.handleVariables,
                lastStep:this.lastStep,
                handleRestricciones:this.handleRestricciones,
            }
        },
            // this step will never be reachable because of the seconds isValidated() steps function that will always return false
            { stepName: "Presentacion de los Resultados",
            component:Presentation,
            stepProps:{
                status:this.state,        
                handleResult:this.handleResult,
                lastStep:this.lastStep
            }
        }
          ];        
        return(
            <Container fluid className="App">
                <Row className="">
                    <Col xs={12} md={6}  className="mx-auto">
                        <img src={logo} className="App-logo" alt="logo" height="200" />
                        <Progress  animated color="blue" value={this.state.barProg} />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6} className="my-4 mx-auto">
                        <ReactWizard
                            steps={steps}
                            title="Programacion Lineal"
                            progressbar
                            headerTextCenter
                            validate
                            color="blue"
                            previousButtonText="Volver"
                            nextButtonText="Siguiente"
                            finishButtonText='Imprimir Resultados'
                            finishButtonClick={this.finishButtonClick}
                            />
                     
                    </Col>                        
                </Row>

            </Container>

        )
    }
}

export default LinealProg;