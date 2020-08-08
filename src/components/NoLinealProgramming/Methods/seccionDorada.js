// metodo de la seccion dorada 

var Parser = require('expr-eval').Parser;
var parser = new Parser();

const seccionDoradaFuncion = (f, xl, xr, delta, tipo) => { 

    // sentido de la optimizacion
    const tiposValidos = ['max', 'min']
    if(tiposValidos.indexOf(tipo) === -1){
        console.log('Error: el tipo de optimizacion debe ser exactamente max o min')
        return false
    }

    // control de los limites del intervalo xl debe ser menor a xr si o si 
    if( xl >= xr) {
        console.log('Error: xL debe ser menor a xR')
        return false
    } 

    // SECCIO DORADA
    // metodos para obtener x1 y x2 
    var obtenerx1 = (xr, xl) =>  {
        return (xr - ((Math.sqrt(5) - 1 ) / 2) * (xr - xl))
    }
    var obtenerx2 = (xr, xl) =>  {
        return (xl + ((Math.sqrt(5) - 1 ) / 2) * (xr - xl))
    }

    // pasamos f a expr para poder evaluar (evaluate) la funcion de forma sencilla mas adelante
    //var expr = parser.parse(f)
    
    try {
        var expr = parser.parse(f)
        
    } catch (error) {
        return false;       
    }

    var tamIntervalo = xr - xl 

    // para solucionar error de no fin (en lo que refiere al calculo es irrelevante)
    var tamAnterior = 0
    var mismoValor = false

    // tenemos que hacerlo afuera
    var x1 = obtenerx1(xr, xl)
    var x2 = obtenerx2(xr, xl)

    while(tamIntervalo > delta && !mismoValor){

        tamAnterior = tamIntervalo;

        // es la misma f para ambas
        var fx1 = expr.evaluate({x: x1})
        var fx2 = expr.evaluate({x: x2})

        if(tipo === 'max'){
            // maximizacion
            if(fx1 > fx2){
                xr = x2
                x2 = x1 
                x1 = obtenerx1(xr, xl)
            }else if( fx1 < fx2 ){ 
                xl = x1
                x1 = x2
                x2 = obtenerx2(xr, xl)
            } else{
                xl = x1
                x1 = x2
                x2 = obtenerx2(xr, xl)
            }
        } else {
            // minimizacion
            if(fx1 < fx2){
                xr = x2
                x2 = x1 
                x1 = obtenerx1(xr, xl)
            }else if( fx1 > fx2 ){ 
                xl = x1
                x1 = x2
                x2 = obtenerx2(xr, xl)
            } else{
                xl = x1
                x1 = x2
                x2 = obtenerx2(xr, xl)
            }
        }

        tamIntervalo = xr - xl 

        // solucion a un error de no fin
        if(tamAnterior === tamIntervalo){
            mismoValor = true
        }
    }

    // intervalo con el grado de exactitud delta
    return [xl, xr]
}

// var funcion = "x - x^2 + 8/3*x^(12)"
// console.log(seccionDoradaFuncion(funcion, -0.35, -0.1, 0.01, 'min'))

module.exports = seccionDoradaFuncion 