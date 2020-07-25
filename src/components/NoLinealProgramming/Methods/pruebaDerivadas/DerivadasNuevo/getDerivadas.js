const algebra = require('algebra.js');
const math = require('mathjs');
const {ptoFactible} = require('./getPtoFactible')
const {getMatrizHessiana} = require('./getMatrizHessiana')

const getDerivadas = (z,incognitas) =>{
    cantidadDerivadasH = incognitas.lenght**2
    var derivadas = []
    var filaDerivadas = []
    var derivadasPrimeras = []
        
        incognitas.forEach(incognita => {
            const derivadai = math.derivative(z,incognita)
            derivadasPrimeras.push(derivadai)
        });
        derivadasPrimeras.forEach(derivadaPrimera=>{
            filaDerivadas = []
            incognitas.forEach(incognita=>{
                const derivada2i = math.derivative(derivadaPrimera,incognita);
                filaDerivadas.push(derivada2i)
            })
            derivadas.push(filaDerivadas)
        })
        
        
    salida = {
        "derivadasPrim": derivadasPrimeras,
        "derivadas": derivadas
    }
    return salida
}
//const z="(x1-4)^2 -3*(x2-2)^2 +24"
const z2 = "(x1-2)^2 +(x2-3)^2 +5"
const z3 = "x1 + 2*x3 + x2*x3 - x1^2 - x2^2 - x3^2"
const incognitas = ['x1','x2','x3']
const resultado = getDerivadas(z3,incognitas)
console.log(resultado.derivadas[0][0].toString());
arregloDerivadas = []
for (let i = 0; i < incognitas.length; i++) {
    var filaDerivada =[]
    for (let j = 0; j < incognitas.length; j++) {
        filaDerivada.push(resultado.derivadas[i][j].toString())
    }
    arregloDerivadas.push(filaDerivada);
    
}
console.log("MIRA ACA FORRO"+arregloDerivadas)
//console.log("DERIVADAS PRIM"+resultado.derivadasPrim.toString())
//console.log(resultado.derivadas[0].toString())
//console.log(resultado.derivadas[1].toString())
//console.log(resultado.derivadas[2].toString())
//console.log(resultado.derivadas.length)
puntoFactible =ptoFactible(resultado.derivadasPrim.toString(),incognitas)
getMatrizHessiana(resultado,puntoFactible,incognitas,z3)
module.exports={getDerivadas}
