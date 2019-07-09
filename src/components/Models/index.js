import React from "react";
import FirebaseOptimizer from './Firebase';
import { Input, Button, Row, Col, Modal, ModalBody, ModalHeader, ModalFooter, Table, Spinner } from "reactstrap";
  

export default class ModalModels extends React.Component {
  constructor(props) {
    super(props);
    this.firebase = new FirebaseOptimizer();
    this.state = { loading:false,logged:false, user:'', descModel:'',saveMenu:false , models:[]};
  }

  componentDidMount() {
    this.setState({loadig:true})
    this.authSubscription = this.firebase.auth.onAuthStateChanged( user => {
      if( user ){
        console.log('Logged');
        this.setState({ logged: true, user:user.displayName });
        this.dbSubscribe = this.firebase.getModelsReference().onSnapshot(snapshot => {
          let models = [];
    
          snapshot.forEach(doc =>
            models.push({ model:doc.data().model, description: doc.id }),
          );
          console.log(models);
          this.setState({
            models,
            loading: false,
          });
        });
        
      }else{
        this.dbSubscribe && this.dbSubscribe();
        console.log('No Logged');
        this.setState({ logged: false, user:'', models:[] });
      }
      
    });
      
    
   
  }

  componentWillUnmount() {
    this.authSubscription();
    this.dbSubscribe && this.dbSubscribe();
    this.setState({ logged:false, user:'', models:[] });
  }

  saveNewModel = () => {
    let { descModel } = this.state;
    if (descModel) {
      this.firebase.getModelsReference().doc(descModel).set({'model':this.props.model})
      .then(ok => this.setState({ descModel:'', saveMenu:false}))
      .catch(err=> console.log(err));
    }
  }

  signIn = () => this.firebase.doSignInWithGoogle().then( user => console.log('Signin'))

  logOut = () => this.firebase.doSignOut().then( info => console.log('SignOut'))

  toggle = () => this.props.handleClose()

  loadModel = model => { this.props.setModel(model); this.toggle(); }

  deleteModel = id => this.firebase.deleteModel(id)
 
  openSaveModel = () => this.setState({saveMenu:!this.state.saveMenu})

  handleDesc = (e) => this.setState({descModel:e.target.value})

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
    this.loadModel(model)
  };
  

  render() {
    let { logged ,user, descModel, saveMenu, models} = this.state;
    
    let openSaveModelMenu =  
      <Col>
        <Row><Input required valid={descModel.length!==0} onChange={this.handleDesc} value={descModel} placeholder='Descripcion del Modelo'/></Row>
        <Row className='mt-2'><Col sm={8} className='text-center'><Button color="success" outline onClick={this.saveNewModel}>Guardar Modelo Actual</Button></Col>
      <Col sm={4} className='text-center'><Button color="danger" outline onClick={this.openSaveModel}>Cancelar</Button></Col></Row></Col>
    
    let closeSaveModelMenu =
      <Col>
        <Row>
          <Col sm={6} className='text-center'><Button color="success" outline onClick={this.openSaveModel}>Nuevo Modelo</Button></Col>
          <Col sm={6} className='text-center'><Button color="primary" outline onClick={this.logOut}>Cerrar Session</Button></Col>
        </Row>
      </Col>    
    
    let loadExample = <Col sm={12} className='text-center'><Button color="warning" outline onClick={this.loadExampleModel}>Cargar Modelo de Ejemplo</Button></Col>
    
    let loginButton = <Col sm={12} className='text-center'><Button color="primary" outline onClick={this.signIn}>Iniciar Session Con Google</Button></Col>
  
    let tableModels = 
      <Col sm={12}>
        <Table responsive striped>
          <thead><tr><th>Descripcion</th><th></th><th></th></tr></thead>
          <tbody>{models.map( model => <tr key={'M-M-'+model.description}><td>{model.description}</td><td className='btnSize'><Button size='sm' onClick={e => this.loadModel(model.model)}color='success'>Cargar</Button></td><td className='btnSize'><Button size='sm' onClick={e => this.deleteModel(model.description)} color='danger'>Eliminar</Button></td></tr>)}</tbody>
        </Table>
      </Col>

    let saveModel = saveMenu ? openSaveModelMenu : closeSaveModelMenu;

    let modelTableWSpinner = models.length ? tableModels : <Col className='text-center' sm={12}><Spinner type='grow' color='black'/></Col>
    
    let modalBody = logged ? modelTableWSpinner : loadExample 
    
    let modalFooter = logged ? saveModel : loginButton
    
    return (
      <div>
        <Modal isOpen={this.props.open} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Modelos {logged && ' de '+user}</ModalHeader>
          <ModalBody><Row className='mx-auto w-100'>{ modalBody }</Row></ModalBody>
          <ModalFooter><Row className='mx-auto w-100'>{ modalFooter }</Row></ModalFooter>
        </Modal>
      </div>
    );
  }
}

