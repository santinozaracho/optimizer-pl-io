const algebra = require('algebra.js');
const math = require('mathjs');
const { ptoFactible } = require('./getPtoFactible');
var Parser = require('expr-eval').Parser;

var parser = new Parser();


// [['2*x1', '4'],['5', '3*x2']]

//console.log(resultado.derivadas[0].toString())
const getMatrizHessiana = (derivadas,ptoFactible,incognitas,z)=>{
    
    // console.log(ptoFactible)

    var hessiano = []

    for (let i = 0; i < derivadas.length; i++) {
        for (let j = 0; j < derivadas[i].length; j++) {
            // console.log('elemento ' + i + ';' + j + ':' + derivadas[i][j])
            
            incognitas.forEach(incognita => {
                if(derivadas[i][j].includes(incognita)){

                    // console.log('TENEMOS QUE EVALUAR!!')
                    // var expr = parser.parse(derivadas[i][j]);
                    // var expressionEvaluada = expr.evaluate({incognita: ptofactible1})
                    // console.log(expr)
                }
            });
            
        }
        
    }
}

module.exports = {getMatrizHessiana}



