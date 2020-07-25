const algebra = require('algebra.js');
const math = require('mathjs');
const { ptoFactible } = require('./getPtoFactible');
var Parser = require('expr-eval').Parser;
//"[[ '2', '0' ],[ '0', '2' ]]"
//console.log(resultado.derivadas[0].toString())
const getMatrizHessiana = (derivadas,ptoFactible,incognitas,z)=>{
    console.log(derivadas.toString())
    
}

module.exports = {getMatrizHessiana}



