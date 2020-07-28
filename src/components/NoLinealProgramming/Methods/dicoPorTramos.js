// metodo de busqueda binaria 
// taha pag 731 - pdf 751

var Parser = require('expr-eval').Parser;
var parser = new Parser();

const busquedaTramos = (funciones, delta, tipo) => { 
    //Javascript pasa arreglos y objetos por referencia en funciones,
    //eliminamos la referencia para que no afecte al funcionamiento en react con lo siguiente:
    var funcionesIntervalos=[];
    for (var i = 0, len = funciones.length; i < len; i++) {
        funcionesIntervalos[i] = {}; // empty object to hold properties added below
        for (var prop in funciones[i]) {
            funcionesIntervalos[i][prop] = funciones[i][prop]; // copy properties from arObj to ar2
        }
    }
    // sentido de la optimizacion
    const tiposValidos = ['max', 'min']
    if(tiposValidos.indexOf(tipo) === -1){
        console.log('Error: el tipo de optimizacion debe ser exactamente max o min')
        return false
    }

    // armo el primer intervalo I_0
    var xl = 9999999999 
    var xr = -9999999999



    funcionesIntervalos.forEach( f => {

        // cargo los nuevos xl y xr 
        if( f.li <= xl){
            xl = f.li
            //console.log('nuevo xl: ', xl)
        }
        if( f.ls >= xr){
            xr = f.ls
            //console.log('nuevo xr: ', xr)
        }
        
        console.log(f.expresion)
        // paso las funciones del objeto a expresiones 
        
        f.expresion = parser.parse(f.expresion);
        
        // console.log('nueva expresion: ')
        // console.log(f.expresion.toString())
    });

    // control de los limites del intervalo xl debe ser menor a xr si o si 
    if( xl >= xr) {
        console.log('Error: xL debe ser menor a xR')
        return false
    } 

    // metodos para obtener x1 y x2 
    
    var obtenerx1 = (xr, xl, delta) =>  0.5*(xr + xl - delta)
    var obtenerx2 = (xr, xl, delta) =>  0.5*(xr + xl + delta)

    // pasamos f a expr para poder evaluar (evaluate) la funcion de forma sencilla mas adelante
    // var expr = parser.parse(f);

    var tamIntervalo = xr - xl 

    // para solucionar error de no fin (en lo que refiere al calculo es irrelevante)
    var tamAnterior = 0
    var mismoValor = false
    
    while(tamIntervalo > delta && !mismoValor){
        
        tamAnterior = tamIntervalo;

        var x1 = obtenerx1(xl, xr, delta)
        var x2 = obtenerx2(xl, xr, delta)

        // PASAR ESTO A MAS DE 2 TRAMOS
        // preguntar donde cae x1 y x2 
        var fx1, fx2
        funcionesIntervalos.forEach( f  => {
            if( x1 >= f.li && x1 <= f.ls ){
                //console.log('el valor ' + x1 + ' valuar en funcion: ' + f.expresion.toString())
                fx1 = f.expresion.evaluate({x: x1})
            }
            if( x2 >= f.li && x2 <= f.ls ){
                //console.log('el valor ' + x2 + ' valuar en funcion: ' + f.expresion.toString())
                fx2 = f.expresion.evaluate({x: x2})
            }
        });

        
        // es la misma f para ambas
        // var fx1 = expr.evaluate({x: x1})
        // var fx2 = expr.evaluate({x: x2})

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
/*
var params = [
    {
        expresion: '3*x',
        li: 0,
        ls: 2
    },
    {
        expresion: '-x/3 + 20/3',
        li: 2,
        ls: 3
    }
]
*/


module.exports = busquedaTramos