import React from "react";
import { Container, Col, Row, Progress } from "reactstrap";
import ModalModels from "../../Models"
import ReactWizard from "react-bootstrap-wizard";
import Configuration from "../Configuration";
import Processing from "../Processing";
import Presentation from "../Presentation";


class InSteps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model:{
        variables: [{ xi: 0, descripcion: "", coeficiente: "" }, { xi: 1, descripcion: "", coeficiente: "" }],
        restricciones: [{ ri: 0, descripcion: "", coeficientes: [], eq: ">=", derecha: "" }],
        method: "graph",
        objective: "max",
        integer: false
      }, 
      result: false,
      barProg: 33,
      modelsOpen:false
    };
  }
  //Esta función maneja el cambio en las restricciones
  handleRestricciones = restricciones => {
    let { model } = this.state;
    model.restricciones = restricciones;
    this.setState({ model, result: false });
  };
  //Esta función maneja el cambio en las variables
  handleVariables = variables => {
    let { model } = this.state;
    model.variables = variables;
    this.setState({ model, result: false });
  };
  //Esta función maneja el cambio del metodo
  handleMethod = method => {
    let { model } = this.state;
    model.method = method;
    this.setState({ model, result: false });
  };
  //Esta función maneja el cambio del objetivo de optimización
  handleObjective = objective => {
    let { model } = this.state;
    model.objective = objective;
    this.setState({ model, result: false });
  };
  toggleInteger = () => {
    let { model } = this.state;
    model.integer = !model.integer;
    this.setState({ model, result: false });

  }
  //Esta función guarda el resultado (inutilizada por el momento)
  handleResult = result => this.setState({ result });

  //Esta función habilita el cálculo en el último paso
  lastStep = step => {
    if (step === 2) {
      this.setState({ barProg: 100 });
    } else {
      this.setState({ barProg: 66 });
    }
  };

  finishButtonClick = result => {
    let {model} = this.state;
      window.print()
  };

  showModels = () => this.setState({modelsOpen:!this.state.modelsOpen})

  setModel = model => this.setState({ model })

  render() {
    let { modelsOpen,model} = this.state
    var steps = [
      // this step hasn't got a isValidated() function, so it will be considered to be true
      {
        stepName: "Configuración del Modelo",
        component: Configuration,
        stepProps: {
          status: model,
          loadExampleModel: this.loadExampleModel,
          handleMethod: this.handleMethod,
          handleVariables: this.handleVariables,
          handleRestricciones: this.handleRestricciones,
          lastStep: this.lastStep,
          toggleInteger: this.toggleInteger,
          handleObjective: this.handleObjective,
          showModels:this.showModels
        }
      },
      {
        stepName: "Detalles del Modelo",
        component: Processing,
        stepProps: {
          status: model,
          handleVariables: this.handleVariables,
          lastStep: this.lastStep,
          handleRestricciones: this.handleRestricciones
        }
      },
      {
        stepName: "Presentación de los Resultados",
        component: Presentation,
        stepProps: {
          status: model,
          handleResult: this.handleResult,
          lastStep: this.lastStep
        }
      }
    ];
    return (
      <Container fluid className="App">
        <Row>
          <Col xs={12} md={8} className="my-4 mx-auto">
            <ReactWizard
              steps={steps}
              title="Programación Lineal"
              progressbar
              headerTextCenter
              validate
              color="blue"
              previousButtonText="Volver"
              nextButtonText="Siguiente"
              nextButtonClasses="bg-primary"
              finishButtonText="Imprimir Resultados"
              finishButtonClick={this.finishButtonClick}
            />
          </Col>
        </Row>
        <Row><ModalModels open={modelsOpen} model={model} setModel={this.setModel} handleClose={this.showModels}/></Row>
      </Container>
    );
  }
}

export default InSteps;
