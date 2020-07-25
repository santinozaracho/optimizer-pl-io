const algebra = require('algebra.js');
const math = require('mathjs');
const { ptoFactible } = require('./getPtoFactible');
var Parser = require('expr-eval').Parser;

var parser = new Parser();


// [['2*x1', '4'],['5', '3*x2']]

//console.log(resultado.derivadas[0].toString())
const getMatrizHessiana = (derivadas, ptoFactible, incognitas, z)=>{
    
    // [ x1, x2, x3 , x4, x5, ... , xn]

    // console.log('punto factible: ')
    // console.log(ptoFactible)


    var incognitasExpr = []

    incognitas.forEach(inc => {
        incognitasExpr.push(Parser.parse(inc))
    });

    console.log('incognitas sin convertir: ')
    console.log(incognitas)
    console.log('arreglo de incognitas expr')
    console.log(incognitasExpr)

    var hessiano = []

    for (let i = 0; i < derivadas.length; i++) {
        for (let j = 0; j < derivadas[i].length; j++) {
            console.log('elemento ' + i + ';' + j + ':' + derivadas[i][j])
            
            var posIncognita 
            var expressionEvaluada

            incognitas.forEach(incognita => {
                if(derivadas[i][j].includes(incognita)){

                    console.log('TENEMOS QUE EVALUAR!!')
                    var expr = parser.parse(derivadas[i][j]);
                
                    posIncognita = incognitas.indexOf(incognita)
                    // console.log('posicion de la incognita: ')
                    console.log(posIncognita)

                    console.log(ptoFactible[posIncognita])

                    // console.log(incognita)
                    expressionEvaluada = expr.evaluate({incognita: ptoFactible[posIncognita]})
                    console.log(expressionEvaluada)
                }
            });
            
        }
        
    }
}

module.exports = {getMatrizHessiana}



