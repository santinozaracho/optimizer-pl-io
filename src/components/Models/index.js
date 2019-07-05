import React from "react";
import FirebaseOptimizer from './Firebase';
import { Button, Row, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
  

export default class ModalModels extends React.Component {
  constructor(props) {
    super(props);
    this.firebase = new FirebaseOptimizer();
    this.state = {
        logged:false
    };
  }
  componentDidMount() {
    this.authSubscription = this.firebase.auth.onAuthStateChanged( user => {
      this.setState({
        loading: false,
        user,
      });
    });
  }

  componentWillUnmount() {
    this.authSubscription();
  }

  signIn = () => this.firebase.doSignInWithGoogle()

  toggle = () => this.props.handleClose()

  handleModel = model => {
    this.props.setModel(model);
    this.toggle();
  }

  loadExampleModel = () => {
    let variables = [
      { xi: 0, descripcion: "Pantalones (u/día)", coeficiente: 3 },
      { xi: 1, descripcion: "Camisas (u/día)", coeficiente: 1 }
    ];
    let restricciones = [
      { ri: 0, descripcion: "Mano de obra (hs/día)", coeficientes: [1, 1], eq: "<=", derecha: 8 },
      { ri: 1, descripcion: "Minimo de Produccion (u/día)", coeficientes: [1, 6], eq: ">=", derecha: 14 }
    ];
    let model = {
      variables,
      restricciones, 
      integer: false, 
      method: "graph", 
      objective: "max"
    }
    this.handleModel(model)
  };
  

  render() {
    let { logged } = this.state;
    let saveModel =  <Button color="success" outline onClick={this.saveNewModel}>Guardar Modelo</Button> 
    let loadExample = <Button color="warning" outline onClick={this.loadExampleModel}>Cargar Ejemplo</Button>
    let listModels
    let loginButton =  <Button color="primary" outline onClick={this.signIn}>Iniciar Session Con Google</Button> 
    return (
      <div>
        <Modal isOpen={this.props.open} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Modelos{logged && ' de '+'user'}</ModalHeader>
          <ModalBody className='mx-auto'>
              { logged ? listModels : loginButton }
          </ModalBody>
          <ModalFooter className='mx-auto'>
              { logged ? saveModel : loadExample }
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

