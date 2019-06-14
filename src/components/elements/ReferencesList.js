import React from 'react';
import {Row, Card,CardBody,CardHeader,CardTitle,Button,Col,Collapse,ListGroup,ListGroupItem,Badge} from 'reactstrap';

class ReferencesList extends React.Component{
    constructor (props){
        super(props);
        this.state={references:false};

    }

    listDescriptionsVarItems = array => array.filter(item => item.descripcion !== '')
        .map(item => <ListGroupItem key={'DLGIV'+item.xi} className="justify-content-between"><Badge>{'X'+item.xi}</Badge>{' '+item.descripcion}</ListGroupItem>)
    
    listDescriptionsResItems = array => array.filter(item => item.descripcion !== '')
        .map(item => <ListGroupItem key={'DLGIR'+item.ri} className="justify-content-between"><Badge>{'R'+item.ri}</Badge>{' '+item.descripcion}</ListGroupItem>)
    
    render() {
        //Obtenemos las propiedades del Super
        let {variables} = this.props;        
        let {restricciones} = this.props;

        return(
                    <Card outline color='secondary' className="w-100 mt-3">
                            <CardHeader>
                                <Row>
                                    <Col className="text-left"><CardTitle><h4>Referencias:</h4></CardTitle></Col>
                                    <Col><Button outline size='sm'
                                        onClick={() => this.setState({references:!this.state.references})} 
                                        color={!this.state.references ? 'success':'danger'}>{!this.state.references ? 'Ver Referencias':'Ocultar Referencias'}</Button>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <Collapse isOpen={this.state.references}>
                                <CardBody>
                                    <h5 className='text-left'>Variables:</h5>
                                    <ListGroup>
                                        {this.listDescriptionsVarItems(variables)}
                                    </ListGroup>
                                    <h5 className='text-left'>Restricciones:</h5>
                                    <ListGroup>
                                        {this.listDescriptionsResItems(restricciones)}
                                    </ListGroup>
                                                                    
                                </CardBody>
                            </Collapse>                       
                    </Card>
        )
    }
}

export default ReferencesList;