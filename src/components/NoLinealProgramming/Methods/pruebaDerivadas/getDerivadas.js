/* eslint-disable no-undef */
const algebra = require('algebra.js');
const math = require('mathjs');
const {ptoFactible} = require('./getPtoFactible')
const {getMatrizHessiana} = require('./getMatrizHessiana')


// const dameElPuntoFactible = (derivadas, incognitas) => {
//     // ptoFactible(resultado.derivadasPrim.toString(),incognitas)
//     ptoFactible(derivadas, incognitas)
//     .then( punto => punto)
// }


const metodoDerivadas = async (z,incognitas)=>{
    try{
    var hessiano;
    var detHessiano;
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
                    filaDerivadas.push(derivada2i.toString())
                })
                derivadas.push(filaDerivadas)
            })
        
        // console.log(derivadas)
            
        salida = {
            "derivadasPrim": derivadasPrimeras,
            "derivadas": derivadas
        }
        return salida
    }
    //const incognitas = ['x1','x2','x3']
    const resultado = getDerivadas(z,incognitas)
    var objetoResultado = {}
    
    arregloDerivadas = []
    for (let i = 0; i < incognitas.length; i++) {
        var filaDerivada =[]
        for (let j = 0; j < incognitas.length; j++) {
            filaDerivada.push(resultado.derivadas[i][j].toString())
            //console.log("FILADERIVADA"+filaDerivada)
        }
        arregloDerivadas.push(filaDerivada);
        
    }
    //console.log("ARREGLO DERIVADAS"+ arregloDerivadas);
    // console.log("MIRA ACA FORRO"+arregloDerivadas)
    //console.log("DERIVADAS PRIM"+resultado.derivadasPrim.toString())
    //console.log(resultado.derivadas[0].toString())
    //console.log(resultado.derivadas[1].toString())
    //console.log(resultado.derivadas[2].toString())
    //console.log(resultado.derivadas.length)
    
    // ESTO TIENE QUE RETORNA EL PUNTO FACTIBLE CON EL CUAL VAMOS A 
    // EVALUAR EN LAS DERIVADAS SEGUNDAS, PERO NOS RETURNA UN PROMISE Y NO SABEMOS QUE HACER
    var puntoFactible = await ptoFactible(resultado.derivadasPrim.toString(),incognitas)
    .then( (punto) => {
        // puntoFactible = punto
        // Promise.resolve(punto) 
        var ptoNoNegativo = punto.every(pto=>{
            return pto>=0
        })
        if(ptoNoNegativo){
            hessiano = getMatrizHessiana(arregloDerivadas,punto,incognitas,z)
            //console.log(`PUNTO FACTIBLE: ${punto}`)
            //console.log(`Mira bro el HESSIANO ES ${hessiano}`)
            detHessiano = math.det(hessiano);
            //console.log(`DETERMINANTE DEL HESSIANO ES ${detHessiano}`)
            //armo el scope para evaluar despues
            var scope = {}
                    for (let k = 0; k < incognitas.length; k++) {
                        scope[incognitas[k]]=punto[k]
                        
                    }
            
            //analizo el caso bidimensional
            if(incognitas.length==2){
                if(detHessiano>0){
                    //console.log("PUNTO FACTIBLE")
                    derivadax2 = hessiano[0][0]
                    if(derivadax2 >0){
                        //console.log(`ELEMENTO 00 ES ${derivadax2}`)
                        //console.log("----------------MINIMO-------------------");
                        //console.log(`EVALUANDO Z EN EL PUNTO : ${punto} `)
                        expressionEvaluada = math.evaluate(z,scope)
                        //console.log("-------------resultado evaluacion---------")
                        //console.log(`FUNCION A EVALUAR : ${z}`)
                        //console.log(`RESULTADO: ${expressionEvaluada}`)
                        objetoResultado["caso"] = "minimo"
                        objetoResultado["ptofactible"] = punto
                        objetoResultado["funcionz"] = z;
                        objetoResultado["funcionvaluada"]=expressionEvaluada;
                        
                    }
                    else if(derivadax2 <0){
                        //console.log(`ELEMENTO 00 ES ${derivadax2}`);
                        //console.log("----------------MAXIMO-------------------");
                        //console.log(`EVALUANDO Z EN EL PUNTO : ${punto} `)
                        expressionEvaluada = math.evaluate(z,scope)
                        //console.log("-------------resultado evaluacion---------")
                        //console.log(`FUNCION A EVALUAR : ${z}`)
                        //console.log(`RESULTADO: ${expressionEvaluada}`)
                        objetoResultado["caso"] = "maximo"
                        objetoResultado["ptofactible"] = punto
                        objetoResultado["funcionz"] = z;
                        objetoResultado["funcionvaluada"]=expressionEvaluada;
                    }
                    else{
                        //console.log(`ELEMENTO 00 ES ${derivadax2}`)
                        //console.log("----------------PUNTO DE SILLA-------------------");
                        objetoResultado["caso"]="puntosilla"
                    }
                }
                else if(detHessiano ==0){
                    //console.log("NO SIRVE ESTE METODO")
                    objetoResultado["caso"]="metodonovalido"
                }
                else{
                    //console.log("PUNTO DE SILLA, NO EXTREMO")
                }
            }
            //si tiene mas de 2 incognitas
            if(incognitas.length>2){
                //console.log("-----------3 VARIABLES--------------")
                //tengo que sacar todos los determinantes de las submatrices del hessiano
                //tengo que hacer una copia de la matriz hessiana, para que no se modifique la original
                matrizHessianaMath = math.clone(math.matrix(hessiano))
                var subMatrices=[]
                // [subMatrizn,subMatrizn-1,subMatrizn-2]
                var SubDeterminantes = []
                // [Detn,Detn-1,Detn-2]
                for (let i = incognitas.length; i > 0; i--) {
                    //meto al arreglo de subDeterminantes de atras para adelante,porque el reize me trimea los datos
                    subMatrices.push(math.clone(matrizHessianaMath.resize([i,i])))
                }
                //ahora que tengo las submatrices, calculo los subdeterminantes
                subMatrices.forEach(subMat=>{
                    SubDeterminantes.push(math.det(subMat._data))
                })
                //Criterio para minimo: si TODOS los subdeterminantes son menores que 0
                //en una variable dejo el arreglo de SubDeterminatnes menos el primer elemento, que es el de la matriz grande
                var subDetsMenos1 = SubDeterminantes.slice(1,SubDeterminantes.length)
                //ahora veo si todos son menores a 0
                var detsMenoresCero = subDetsMenos1.every(det=>{
                    return det<0
                })
                var detsDistintosCero = subDetsMenos1.every(det=>{
                    return det!=0
                })
                if(detsMenoresCero){
                    //console.log("MINIMOOOOOOO:D")
                    //console.log(`EVALUANDO Z EN EL PUNTO : ${punto} `)
                    expressionEvaluada = math.evaluate(z,scope)
                    //console.log("-------------resultado evaluacion---------")
                    //console.log(`FUNCION A EVALUAR : ${z}`)
                    //console.log(`RESULTADO: ${expressionEvaluada}`)
                    objetoResultado["caso"] = "minimo"
                    objetoResultado["ptofactible"] = punto
                    objetoResultado["funcionz"] = z;
                    objetoResultado["funcionvaluada"]=expressionEvaluada;
                }else if(SubDeterminantes[1]>0){
                    //si no es minimo, tengo que analizar los demas casos
                    //Criterio para maximo: Si el det anterior es >0 y el general es <0 y van alternando asi los signos, tengo un maximo
                    //veo si el subdeterminante anterior es mayor a 0
                    //ahora tengo que ver si el determinante actual mas grandee es menor a 0
                    if(SubDeterminantes[0]<0){
                        //console.log("MAXIMOOOOOOOO")
                        expressionEvaluada = math.evaluate(z,scope)
                        //console.log("-------------resultado evaluacion---------")
                        //console.log(`FUNCION A EVALUAR : ${z}`)
                        //console.log(`RESULTADO: ${expressionEvaluada}`)
                        objetoResultado["caso"] = "maximo"
                        objetoResultado["ptofactible"] = punto
                        objetoResultado["funcionz"] = z;
                        objetoResultado["funcionvaluada"]=expressionEvaluada;
                    }
                
                }else if(detsDistintosCero){
                    //console.log("PUNTO DE SILLAAA")
                    objetoResultado["caso"]="puntosilla"
                }else{
                    //console.log("ESTE CRITERIO NO CONCLUYE NADA")
                    objetoResultado["caso"]="metodonovalido"
                }
                //ahora veo si todos los subdets son <0 pero no siguen los patrones de las otras dos condiciones de arriba -> punto de silla
            }
        }
        else{
            //console.log("NO CUMPLE LA CONDICION DE NO NEGATIVIDAD-No se puede determinar por este metodo")
                objetoResultado["caso"] = "nonegatividadinvalido"
                
        }   
    })
    .then(()=>{
        //console.log("RETORNO");
        //console.log(objetoResultado)
        return objetoResultado
    })

    return puntoFactible
}catch(error){
    console.log(error)
}
}

//const z = "x1 + 2*x3 + x2*x3 - x1^2 - x2^2 - x3^2"

//const z = "x1 + 2*x3 + x2*x3 - x1^2 - x2^2 - x3^2"
//const z = "-x1^2 -(x2+1)^2" //Ej4
//const z = "x1 + 2*x3 + x2*x3 - x1^2 - x2^2 - x3^2 +x4^2"
//const z = "x1 + 2*x3 + x1*x3 - x1^2 - x2^2 - x3^2" //Ej5
//const z = "(x1-2)^2 + (x2-3)^2 +5" //EJ1
//const z = "-(x1-4)^2 -3*(x2-2)^2 +24" //Ej3

//este tiene raices creo
//const z = "x1 + 2x3 + x2*x3 - x1^2 - x2^2 - x3^2"
//const incognitas = ['x1','x2','x3']

/*metodoDerivadas(z,incognitas)
.then((p)=>{
    console.log(p)
})*/

//auxiliarDerivadas = [['2*x1', '4'],['5', '3*x2']]


module.exports = {metodoDerivadas}
