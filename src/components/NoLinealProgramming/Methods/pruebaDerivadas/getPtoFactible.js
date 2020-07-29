/* eslint-disable no-undef */
const algebra = require('algebra.js');
const math = require('mathjs');
const fetch = require('node-fetch');
const { json } = require('mathjs');

const ptoFactible = async (derivadasPrim,variables)=>{
    //console.log(derivadasPrim.toString());
    derivadasPrimarias = derivadasPrim.toString();
    var derivadasSplit = derivadasPrimarias.toString().split(',');
    var urlEcuaciones = "ecuaciones="
    derivadasSplit.forEach(derivada =>{
        urlEcuaciones += derivada +";"
    })
    //resto la ult pos
    urlEcuaciones = urlEcuaciones.substring(0,urlEcuaciones.length-1)
    //saco los espacios 
    urlEcuaciones = urlEcuaciones.replace(/ /g,"")
    //cambio los signos +
    urlEcuaciones = urlEcuaciones.replace('+','%2B')
    //variables
    var urlVariables = "&variables="
    variables.forEach(variable =>{
        urlVariables += variable +","
    })
    //saco coma del final
    urlVariables = urlVariables.substring(0,urlVariables.length-1)
    //https://nlsystemsolver.herokuapp.com/getmsg/?ecuaciones=1-2*x;z-2*y;2%2By-2*z&variables=x,y,z
    var url_base= "https://nlsystemsolver.herokuapp.com/getmsg/?"
    //armo la url final
    url_base += urlEcuaciones + urlVariables
    
    var rtaFetch =""
    
    await fetch(url_base, { method: 'GET'})
    .then(res => res.json()) // expecting a json response
    .then(json => {
        
        //console.log(json.MESSAGE)
        rtaFetch = json.MESSAGE
    }); //ESTO RETORNA TODO UN STRING, NO ARREGLO


    rtaFetch = rtaFetch.replace("[","");
    rtaFetch = rtaFetch.replace("]","");
    //paso a un arreglo
    rtaFetch = rtaFetch.replace(/'/g,"")
    rtaFetch = rtaFetch.replace(/ /g,"")
    rtaFetch = rtaFetch.split(",");
    
    var rtaFetchNum = []
    for (let i = 0; i < rtaFetch.length; i++) {
        //console.log(rtaFetch[i])
        rtaFetchNum.push(eval(rtaFetch[i]))
        
    }
    
    return rtaFetchNum
}

module.exports={ptoFactible}