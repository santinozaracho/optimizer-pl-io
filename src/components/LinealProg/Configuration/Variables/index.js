import React from 'react';
import Variable from './Variable';

const Variables = props => {
    let { variables,method } = props
        //Función que se encarga de manejar las modificaciones en las variables.
        const deleteVar = xi => {
            if (variables.length > 2){
                variables.splice(xi, 1)
                variables.forEach( (vari,index) => vari.xi = index )
            }else{
                variables[xi].descripcion = ''
            }
        }
        //Función que se encarga de manejar las modificaciones de restricciones.
        const handleChangesVar = (xi,desc) => {
            //Si el cambio es dejarla vacia entonces eliminamos la restriccion Sino, Almacenamos el valor
            if (desc === '') { deleteVar(xi) }else{ variables[xi].descripcion = desc }
            //pedimos al padre que almacene los cambios
            props.handleVariables(variables);
        };
        //Función que se encarga de Añadir una Variable si es necesario.
    const handleNewsVar = () => {
        if (method === "simplex") {
            if( variables.length < 20 ){
                //Si el metodo es Simplex, se permite agregar más de dos variables.
                let counterWitheVar = variables.filter(element => element.descripcion.length === 0).length;
                //Si la cantidad de Variables Libres es igual a 0 se agrega una más.
                if (counterWitheVar === 0) {
                variables.push({ xi: variables.length, descripcion: "", coeficiente: "" });
                props.handleVariables(variables);
                }
            }
        } else {
        //Si no lo es, aseguramos que existan solo dos, entonces eliminamos lo que está de más.
            if (variables.length > 2) {
                variables.splice(2);
                props.handleVariables(variables);
            }
        }
    };
    handleNewsVar();
    return variables.map( variable => <Variable key={'VAR-'+variable.xi} handleChanges={handleChangesVar} variable={variable}/> )
}

export default Variables;