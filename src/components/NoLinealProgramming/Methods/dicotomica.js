// metodo de busqueda binaria 
// taha pag 731 - pdf 751

var Parser = require('expr-eval').Parser;
var parser = new Parser();

const busquedaFuncion = (f, xl, xr, delta, tipo) => { 


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

    // metodos para obtener x1 y x2 
    var obtenerx1 = (xr, xl, delta) =>  0.5*(xr + xl - delta)
    var obtenerx2 = (xr, xl, delta) =>  0.5*(xr + xl + delta)

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
    
    while(tamIntervalo > delta && !mismoValor){
        
        tamAnterior = tamIntervalo;

        var x1 = obtenerx1(xl, xr, delta)
        var x2 = obtenerx2(xl, xr, delta)

        // es la misma f para ambas
        var fx1 = expr.evaluate({x: x1})
        var fx2 = expr.evaluate({x: x2})

        if(tipo === 'max'){
            // maximizacion
            if(fx1 > fx2){
                xr = x2
            }else if( fx1 < fx2 ){ 
                xl = x1
            } else{
                xl = x1 
                xr = x2 
            }
        } else {
            // minimizacion
            if(fx1 < fx2){
                xr = x2
            }else if( fx1 > fx2 ){ 
                xl = x1
            } else{
                xl = x1 
                xr = x2 
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

//var funcion = "x^(2)+3*x-5"
//console.log(busquedaFuncion(funcion, -5, 2, 0.1, 'min'))

module.exports = busquedaFuncion 