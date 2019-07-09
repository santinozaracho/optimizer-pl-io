import React from 'react';
import Restriction from './Restriction';

const Restrictions = props => {
    
    let {restricciones} = props;
    
    const deleteRes = ri => {
        restricciones.splice(ri, 1)
        restricciones.forEach( (restri,index) => restri.ri = index )
    }
    //Función que se encarga de manejar las modificaciones de restricciones.
    const handleChangeRes = (ri,desc) => {
        //Si el cambio es dejarla vacia entonces eliminamos la restriccion Sino, Almacenamos el valor
        if (desc === '') { deleteRes(ri) }else{ restricciones[ri].descripcion = desc }
        //pedimos al padre que almacene los cambios
        props.handleRestrictions(restricciones);
        //Llamamos a generar si corresponde nueva restriccion
        handleNewRes();
    };
    //Función que se encarga de Añadir una restriccion si es necesario.
    const handleNewRes = () => {
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
            props.handleRestrictions(restricciones);
            }
        }
        };
    handleNewRes();
    return restricciones.map( restri => <Restriction key={'RES-'+restri.ri} handleChange={handleChangeRes} restriccion={restri}/>)
}

export default Restrictions;