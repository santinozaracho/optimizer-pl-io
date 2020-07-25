const algebra = require('algebra.js');
const math = require('mathjs');
const { ptoFactible } = require('./getPtoFactible');
const { i } = require('mathjs');
var Parser = require('expr-eval').Parser;

var parser = new Parser();


// [['2*x1', '4'],['5', '3*x2']]

//console.log(resultado.derivadas[0].toString())
const getMatrizHessiana = (derivadas, ptoFactible, incognitas, z)=>{
    
    // [ x1, x2, x3 , x4, x5, ... , xn]

    // console.log('punto factible: ')
    // console.log(ptoFactible)


    var incognitasExpr = []
    
    //console.log('Tengo esta expresion')
    //console.log(derivadas)
    //onsole.log('incognitas sin convertir: ')
    //console.log(incognitas)
  

    var hessiano = []
    var scope = {}
    for (let k = 0; k < incognitas.length; k++) {
        scope[incognitas[k]]=ptoFactible[k]
        
    }

    for (let i = 0; i < derivadas.length; i++) {
        var lineaHessiano = []
        for (let j = 0; j < derivadas[i].length; j++) {
            //console.log('elemento ' + i + ';' + j + ':' + derivadas[i][j])
            
            var posIncognita 
            var expressionEvaluada
            /*
            incognitas.forEach(incognita => {
                if(derivadas[i][j].includes(incognita)){

                    console.log('TENEMOS QUE EVALUAR!!')
                    //var expr = parser.parse(derivadas[i][j]);
                
                    posIncognita = incognitas.indexOf(incognita)
                    //console.log('posicion de la incognita: ')
                    //console.log(posIncognita)
                    //console.log("valor de la incognita")
                    //console.log(ptoFactible[posIncognita])

                    
                    //console.log(incognita)
                    //expressionEvaluada = expr.evaluate({incognita: ptoFactible[posIncognita]})
                    expressionEvaluada = math.evaluate(derivadas[i][j],scope)
                    console.log("RESULTADO PAPACHO, evalue")
                    console.log(expressionEvaluada)
                }
                else{
                    console.log("RESULTADO PAPACHO,no evalue")
                    console.log(derivadas[i][j])
                }
            });
            */
            expressionEvaluada = math.evaluate(derivadas[i][j],scope)
            console.log("RESULTADO PAPACHO")
            console.log(expressionEvaluada)
            lineaHessiano.push(expressionEvaluada)
            

        }
        hessiano.push(lineaHessiano)
        
    }
    console.log(hessiano)
}

module.exports = {getMatrizHessiana}


