import React from "react";
import { ButtonGroup, Button, Container, Row, Col, Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import {
  Alert,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  UncontrolledPopover,
  PopoverBody,
  PopoverHeader
} from "reactstrap";

class Configuration extends React.Component {
  constructor(props) {
    super(props);
    this.state = { faltaDescrip: "" };
  }

  componentDidMount() {
    this.handleNewsRes();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.handleNewsRes();
      this.handleNewsVar(this.props.status.method);
    }
  }
  //Función que permite validar si se ingresaron todos los cambios correspondientes en la etapa
  isValidated() {
    let { variables, restricciones } = this.props.status;
    let variablesDescriptionsMin = variables.filter(va => va.descripcion !== "");
    let restriccionesDescriptionsMin = restricciones.filter(re => re.descripcion !== "");
    if ((variablesDescriptionsMin.length > 1) & (restriccionesDescriptionsMin.length > 0)) {
      this.props.lastStep(1);
      this.setState({ faltaDescrip: "" });
      return true;
    } else if (variablesDescriptionsMin.length < 2) {
      this.setState({ faltaDescrip: "Se necesitan como mínimo dos variables" });
    } else if (restriccionesDescriptionsMin.length < 1) {
      this.setState({ faltaDescrip: "Se necesita como mínimo una restricción" });
    }
    return false;
  }
  //Función que se encarga de manejar las modificaciones en las variables.
  handlerInputVar = event => {
    let { value, name } = event.target;
    let { variables } = this.props.status;
    //Asignamos Valor y reasignamos el indice
    variables[name].xi = name;
    variables[name].descripcion = value;
    if (name > 1 && value === "") {
      //Si la desc esta vacía eliminamos la variable
      variables.splice(name, 1);
    }
    //Pasasamos al Padre los cambios realizados en la variable
    this.props.handleVariables(variables);
    //llamamos a la función que se encarga de generar nuevas variables.
    this.handleNewsVar(this.props.status.method);
  };
  //Función que se encarga de manejar las modificaciones de restricciones.
  handlerInputRes = event => {
    let { value, name } = event.target;
    let { restricciones } = this.props.status;
    //Asignamos el nuevo cambio
    restricciones[name].ri = name;
    restricciones[name].descripcion = value;
    if (value === "") {
      //si el cambio es dejarla vacia entonces eliminamos la restriccion
      restricciones.splice(name, 1);
    }
    //pedimos al padre que almacene los cambios
    this.props.handleRestricciones(restricciones);
    //Llamamos a generar si corresponde nueva restriccion
    this.handleNewsRes();
  };
  //Función que se encarga de Añadir una restriccion si es necesario.
  handleNewsRes = () => {
    let { restricciones } = this.props.status;
    //Agregamos Tope de Restricciones
    if(restricciones.length < 30 ){
      //Contador de Rescciones sin descripciones.
      let counterWitheRes = restricciones.filter(element => element.descripcion.length === 0).length;
      //Si el contador de restricciones vacias es igual a 0 entonces agregamos una restriccion mas.
        if (counterWitheRes === 0) {
          restricciones.push({
            ri: restricciones.length,
            descripcion: "",
            coeficientes: [],
            eq: ">=",
            derecha: ""
          });
          this.props.handleRestricciones(restricciones);
        }
      }
    };
   
  //Función que se encarga de Añadir una Variable si es necesario.
  handleNewsVar = method => {
    let { variables } = this.props.status;
    if (method === "simplex") {
      if( variables.length < 20 ){
        //Si el metodo es Simplex, se permite agregar más de dos variables.
        let counterWitheVar = variables.filter(element => element.descripcion.length === 0).length;
        //Si la cantidad de Variables Libres es igual a 0 se agrega una más.
        if (counterWitheVar === 0) {
          variables.push({ xi: variables.length, descripcion: "", coeficiente: "" });
          this.props.handleVariables(variables);
        }
      }
    } else {
      //Si no lo es, aseguramos que existan solo dos, entonces eliminamos lo que está de más.
      if (variables.length > 2) {
        variables.splice(2);
        this.props.handleVariables(variables);
      }
    }
  };

  render() {
    //Obtenemos de las props, las varaibles y restricciones.
    let { variables } = this.props.status;
    let { restricciones } = this.props.status;
    // Generamos los inputs para las Variables
    let variablesARenderizar = variables.map((variable, index) => (
      <InputGroup className="mt-1" id={"XTT" + index} key={"VTD" + index}>
        <InputGroupAddon addonType="prepend">
          <InputGroupText name="xi" id="variable">
            {"X" + index}
          </InputGroupText>
        </InputGroupAddon>
        <Input
          name={index}
          placeholder="Descripcion de la Variable"
          aria-label="Descripcion"
          aria-describedby="variable"
          onChange={this.handlerInputVar}
          value={variable.descripcion}
        />
        <UncontrolledPopover flip={false} trigger="focus hover" placement="auto" target={"XTT" + index}>
          <PopoverBody>Aquí debes ingresar qué representa la variable en el modelo.</PopoverBody>
        </UncontrolledPopover>
      </InputGroup>
    ));
    //Generamos los imputs para las restricciones
    let restriccionesARenderizar = restricciones.map((restriccion, index) => (
      <InputGroup className="mt-1" id={"TTR" + index} key={"RTD" + index}>
        <InputGroupAddon addonType="prepend">
          <InputGroupText name="ri" id="restriccion">
            {"R" + index}
          </InputGroupText>
        </InputGroupAddon>
        <Input
          name={index}
          placeholder="Descripcion de la Restriccion"
          aria-label="Descripcion"
          aria-describedby="restriccion"
          onChange={this.handlerInputRes}
          value={restriccion.descripcion}
        />
        <UncontrolledPopover flip={false} trigger="focus hover" placement="auto" target={"TTR" + index}>
          <PopoverBody>Aquí debes ingresar qué representa la restricción en el modelo.</PopoverBody>
        </UncontrolledPopover>
      </InputGroup>
    ));
    let buttonsMethods = (
      <ButtonGroup id="ButtUtil">
        <Button
          outline
          onClick={() => {
            this.props.handleMethod("graph");
            this.handleNewsVar("graph");
          }}
          active={this.props.status.method === "graph"}
          color="primary"
        >
          Gráfico
        </Button>
        <Button
          outline
          onClick={() => {
            this.props.handleMethod("simplex");
            this.handleNewsVar("simplex");
          }}
          active={this.props.status.method === "simplex"}
          color="primary"
        >
          Simplex
        </Button>
      </ButtonGroup>
    );
    let buttonsOptType = (
      <ButtonGroup>
        <Button
          outline
          onClick={() => this.props.handleObjective("max")}
          active={this.props.status.objective === "max"}
          color="primary"
        >
          Maximizar
        </Button>
        <Button
          outline
          onClick={() => this.props.handleObjective("min")}
          active={this.props.status.objective === "min"}
          color="primary"
        >
          Minimizar
        </Button>
      </ButtonGroup>
    );

    return (
      <>
        <h3>Comenzamos configurando nuestro modelo</h3>
        <Container>
          <Row>
            <Col>
              <UncontrolledPopover flip={false} trigger="hover" placement="top" target="CardInteger">
                <PopoverBody>Esta función activa o desactiva la Programacion Lineal Entera.</PopoverBody>
              </UncontrolledPopover>
              <Card outline color="secondary" id="CardInteger" className="mt-2 mx-auto">
                <CardHeader>Programación entera</CardHeader>
                <CardBody>
                  <Button
                    outline
                    color={this.props.status.integer ? "success" : "danger"}
                    onClick={() => this.props.toggleInteger()}
                  >
                    {this.props.status.integer ? "Activa" : "Inactiva"}
                  </Button>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <UncontrolledPopover flip={false} trigger="hover" placement="top" target="CardModel">
                <PopoverBody>
                  Esta función cargará un modelo predefinido con el objeto de probar el funcionamiento de la
                  aplicación.
                </PopoverBody>
              </UncontrolledPopover>
              <Card outline color="secondary" id="CardModel" className="mt-2 mx-auto">
                <CardHeader>Modelo de ejemplo</CardHeader>
                <CardBody>
                  <Button color="warning" outline onClick={this.props.loadExampleModel}>
                    Cargar
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <UncontrolledPopover flip={false} trigger="hover" placement="top" target="CardUtil">
                <PopoverBody>
                  Aquí debes seleccionar el método de cálculo y visualización de los resultados.
                </PopoverBody>
              </UncontrolledPopover>
              <Card outline color="secondary" id="CardUtil" className="mt-3 mx-auto">
                <CardHeader>Método a utilizar</CardHeader>
                <CardBody>{buttonsMethods}</CardBody>
              </Card>
            </Col>

            <Col>
              <UncontrolledPopover flip={false} trigger="hover" placement="top" target="CardOpt">
                <PopoverBody>
                  Y aquí el tipo de optimizacion que deseas realizar: si deseas maximizar o minimizar la
                  función.
                </PopoverBody>
              </UncontrolledPopover>
              <Card outline color="secondary" id="CardOpt" className="mt-3 mx-auto">
                <CardHeader>Tipo de optimización</CardHeader>
                <CardBody>{buttonsOptType}</CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <UncontrolledPopover flip={false} trigger="hover" placement="top" target="CardVariables">
              <PopoverHeader>Variables</PopoverHeader>
              <PopoverBody>
                Aquí debes ingresar las variables que formarán parte del modelo, las mismas son de carga
                dinámica.
              </PopoverBody>
            </UncontrolledPopover>
            <Card outline color="secondary" id="CardVariables" className="w-100 mt-3 mx-auto">
              <CardHeader>
                <CardTitle className="text-left">
                  <h4>Variables</h4>
                </CardTitle>
              </CardHeader>
              <CardBody>{variablesARenderizar}</CardBody>
            </Card>
          </Row>
          <Row>
            <UncontrolledPopover flip={false} trigger="hover" placement="top" target="CardRestri">
              <PopoverHeader>Restricciones</PopoverHeader>
              <PopoverBody>
                Aquí debes ingresar las restricciones que formarán parte del modelo, éstas también son de
                carga dinámica.
              </PopoverBody>
            </UncontrolledPopover>
            <Card outline color="secondary" id="CardRestri" className="w-100 mt-3 mx-auto">
              <CardHeader>
                <CardTitle className="text-left">
                  <h4>Restricciones</h4>
                </CardTitle>
              </CardHeader>
              <CardBody>{restriccionesARenderizar}</CardBody>
            </Card>
          </Row>
          {this.state.faltaDescrip !== "" && (
            <Row className="mt-3">
              <Alert className="mx-auto" color="danger">
                {this.state.faltaDescrip}
              </Alert>
            </Row>
          )}
        </Container>
      </>
    );
  }
}

export default Configuration;
