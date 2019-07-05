import React from "react";
import FirebaseOptimizer from './Firebase';
import { Button, Row, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
  

export default class ModalModels extends React.Component {
  constructor(props) {
    super(props);
    this.firebase = new FirebaseOptimizer();
    this.state = {
        logged:false,
        modal: true
    };
  }
  componentDidMount() {
    this.authSubscription = this.firebase.auth.onAuthStateChanged((user) => {
      this.setState({
        loading: false,
        user,
      });
    });
  }

  componentWillUnmount() {
    this.authSubscription();
  }

  signIn = () => {
    this.firebase.doSignInWithGoogle()
  }

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  render() {
    let { logged } = this.state;
    let saveModel =  <Button color="success" outline onClick={this.saveNewModel}>Guardar Modelo</Button> 
    let loadExample = <Button color="warning" outline onClick={this.props.loadExampleModel}>Cargar Ejemplo</Button>
    let listModels
    let loginButton =  <Button color="primary" outline onClick={this.signIn}>Iniciar Session Con Google</Button> 
    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}><h3>Modelos{logged && 'de '+'user'}</h3></ModalHeader>
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

