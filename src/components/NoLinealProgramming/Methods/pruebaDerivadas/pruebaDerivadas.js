const algebra = require('algebra.js');
const math = require('mathjs');
const { Expression } = require('algebra.js');
const { e } = require('mathjs');
var Parser = require('expr-eval').Parser;

const metodoDerivadas = (z,incognitas) =>{



//metodo de primera y segunda derivada
var derivadas =[];
//FORMATO DERIVADAS [dgdx2,dgdy2,dgdxy]
// 1ra derivada, 2da derivada y cruzada

// const z = "-(x-4)^2 -3*(y-2)^2 +24";
// const z = "-(x-4)^2 -3*(y-2)^2 +24"               // ejercicio 3 
                     // ejercicio 4
// const z = x1 + 2x3 + x1x3 - x1^2 - x2^2 - x3^2   // ejercicio 5 <-- unico con 3 variables

var parser = new Parser();
var expr = parser.parse(z);
var resultado = []






const calcularDerivadas = (z,incognitas) =>{
    var derivadas =[]
    if(incognitas.length == 2){
        derivadas = []
        //calculo las derivivadas primeras y segundas parcial respecto a x
        const dgdx = math.derivative(z,'x');
        const dgdx2 = math.derivative(dgdx,'x');

        //calculo las derivadas primeras y segundas parciales respectoa  y
        const dgdy = math.derivative(z,'y');
        const dgdy2 = math.derivative(dgdy,'y');

        //calculo las derivadas cruzadas
        const dgdxy = math.derivative(dgdx,'y');
        const dgdyx = math.derivative(dgdy,'x');

        derivadas.push([dgdx2,dgdxy],[dgdyx,dgdy2]);
        return derivadas

    }
    else if (incognitas.length == 3){
        //calculo las derivadas primeras y segundas parcial respecto a x
        derivadas = []
        const dgdx = math.derivative(z,'x');
        const dgdx2 = math.derivative(dgdx,'x');

        //calculo las derivadas primeras y segundas parciales respectoa  y
        const dgdy = math.derivative(z,'y');
        const dgdy2 = math.derivative(dgdy,'y');

        //calculo las derivadas primeras y segundas parciales respecto a z
        const dgdz = math.derivative(z,'z');
        const dgdz2= math.derivative(dgdz,'z');

        //calculo las derivadas cruzadas
        //para x
        const dgdxy = math.derivative(dgdx,'y');
        const dgdxz = math.derivative(dgdx,'z');
        //para y
        const dgdyx = math.derivative(dgdy,'x');
        const dgdyz = math.derivative(dgdy,'z');
        //para z
        const dgdzx = math.derivative(dgdz,'x');
        const dgdzy = math.derivative(dgdz,'y');

        derivadas.push([dgdx2,dgdxy,dgdxz],[dgdyx,dgdy2,dgdyz],[dgdzx,dgdzy,dgdz2])
        return derivadas
    }
    else {
        console.log("cantidad de incognitas invalida");
    }
} 


// puntoFactible NO SE USA CON EL FETCH A HEROKU
// hago una funcion para ver si hay puntos que cumplan con la condicion necesaria del gradiente
const puntoFactible = (z,derivadas) =>{
    if (derivadas.length == 3){
        const dgdx = math.derivative(z,'x');
        const dgdy = math.derivative(z,'y');
        const dgdz = math.derivative(z,'z');
        const d11 = new algebra.parse(dgdx.toString() + "=0");
        const d22 = new algebra.parse(dgdy.toString() + "=0");
        const d33 = new algebra.parse(dgdz.toString() + "=0");
        console.log(d11.toString())
        if(d11.toString().includes('z') && d11.toString().includes('x')){
            const z = d11.solveFor('z')
        }else if((d11.toString().includes('y'))){
            const y = d11.solveFor('y')
        }else{
            const x = d11.solveFor('x')
        }

        console.log(d22.toString())
        if(d11.toString().includes('z')){
            const z = d22.solveFor('z')
        }else if((d22.toString().includes('y'))){
            const y = d22.solveFor('y')
        }else{
            const x = d22.solveFor('x')
        }

        console.log(d33.toString())
        if(d33.toString().includes('z')){
            const z = d33.solveFor('z')
        }else if((d33.toString().includes('y'))){
            const y = d33.solveFor('y')
        }else{
            const x = d33.solveFor('x')
        }

        try {
            
            const x = d11.solveFor('x');
            const y = d22.solveFor('y');
            const z = d33.solveFor('z');
            
            if(x < 0 || y < 0 || z < 0){
                console.log("No cumple con la condicion de no negatividad. no se puede determinar por este metodo");
                return false
            }
            return [x.toString(),y.toString(),z.toString()]
        } catch (error) {
            console.log(error);
            return false
        }
    } else if (derivadas.length ==2){
        const dgdx = math.derivative(z,'x');
        const dgdy = math.derivative(z,'y');
        const d11 = new algebra.parse(dgdx.toString()+"=0");
        const d22 = new algebra.parse(dgdy.toString()+"=0");
        try {
            const x = d11.solveFor('x');
            const y = d22.solveFor('y');
            if(x < 0 || y < 0 ){
                console.log("No cumple con la condicion de no negatividad. no se puede determinar por este metodo");
                return false
            }
            return [x.toString(),y.toString()]
        } catch (error) {
            console.log(error);
            return false
        }
    }

}

//Ahora calculo el hessiano con las derivadas valuadas en el punto factible
//FORMATO DERIVADAS [dgdx2,dgdy2,dgdxy]
const getMatrizHessiana = (derivadas,ptoFactible)=>{
    if(ptoFactible.length ==3){
    const derivada2daX = derivadas[0][0].evaluate({x:ptoFactible[0]})
    //valuo la derivada2da de y
    const derivada2daY = derivadas[1][1].evaluate({y:ptoFactible[1]})
    //valuo la derivada2da de z
    const derivada2daZ = derivadas[2][2].evaluate({z:ptoFactible[2]})

    //valuo las derivadas cruzadas
    const derivadaCruzadaxy = derivadas[0][1].evaluate({x:ptoFactible[0],y:ptoFactible[1]});
    const derivadaCruzadaxz = derivadas[0][2].evaluate({x:ptoFactible[0],z:ptoFactible[2]});
    const derivadaCruzadayx = derivadas[1][0].evaluate({x:ptoFactible[0],y:ptoFactible[1]});
    const derivadaCruzadayz = derivadas[1][2].evaluate({y:ptoFactible[1],z:ptoFactible[2]});
    const derivadaCruzadazx = derivadas[2][0].evaluate({x:ptoFactible[0],z:ptoFactible[2]});
    const derivadaCruzadazy = derivadas[2][1].evaluate({y:ptoFactible[1],z:ptoFactible[2]});

    //formo la matriz hessiana
    const hessiano = math.matrix([[derivada2daX,derivadaCruzadaxy,derivadaCruzadaxz],[derivadaCruzadayx,derivada2daY,derivadaCruzadayz],[derivadaCruzadazx,derivadaCruzadazy,derivada2daZ]])
    return hessiano

    }else if(ptoFactible.length == 2){
        const derivada2daX = derivadas[0][0].evaluate({x:ptoFactible[0]})
        //valuo la derivada2da de y
        const derivada2daY = derivadas[1][1].evaluate({y:ptoFactible[1]})

        //valuo las derivadas cruzadas
        const derivadaCruzadaxy = derivadas[0][1].evaluate({x:ptoFactible[0],y:ptoFactible[1]});
        const derivadaCruzadayx = derivadas[1][0].evaluate({x:ptoFactible[0],y:ptoFactible[1]});

        //formo la matriz hessiana
        const hessiano = math.matrix([[derivada2daX,derivadaCruzadaxy],[derivadaCruzadayx,derivada2daY]]);
        
        return hessiano;

    }else{
        console.log("Cantidad de elementos de punto factible invalidos");
        return false
    }
}




derivadas = calcularDerivadas(z,incognitas);
const ptoFactible = puntoFactible(z,derivadas)


//si encuentra un punto factible, paso a calcular el hessiano
if(ptoFactible){
    console.log(`EL PUNTO FACTIBLE ES ${ptoFactible}`);
    const hessiano = getMatrizHessiana(derivadas,ptoFactible);
    console.log("LA MATRIZ HESSIANA ES :"+ hessiano.toString());
    //evaluo el resultado del hessiano. Si este es mayor a 0 es factible 
    detHessiano = math.det(hessiano);
    console.log(`DETERMINANTE DEL HESSIANO ${detHessiano}`);
    if(detHessiano>0){
        console.log("Es un punto factible");
        //Si veo que es factible, tengo que ver que onda  dgdx2
        derivadaX2= hessiano.get([0,0])
        if(derivadaX2 > 0){
            resultado = []
            console.log("El valor de dgdx2 es: "+ derivadaX2.toString());
            console.log("MINIMO");
            
            if(derivadas.length ==2){
                console.log(`Evaluando Z(${ptoFactible[0]},${ptoFactible[1]})`)
                ptofactible1 = Number(ptoFactible[0]);
                ptofactible2 = Number(ptoFactible[1]);
                expressionEvaluada = expr.evaluate({x:ptofactible1,y:ptofactible2})

            }
            if(derivadas.length ==3){
                ptofactible1 = Number(ptoFactible[0]);
                ptofactible2 = Number(ptoFactible[1]);
                ptofactible3 = Number(ptofactible[2]);
                console.log(`Evaluando Z(${ptoFactible[0]},${ptoFactible[1]},${ptoFactible[2]})`)
                expressionEvaluada = expr.eval({x:ptoFactible[0],y:ptoFactible[1],z:ptoFactible[2]})
            }
            console.log("EXPRESION VALUADA: "+expressionEvaluada.toString());
            resultado.push('minimo',detHessiano,derivadaX2,expressionEvaluada)
            return resultado
        }
        else if(derivadaX2 < 0){
            resultado = []
            console.log("El valor de dgdx2 es: "+ derivadaX2.toString());
            console.log("MAXIMO")
            if(derivadas.length ==2){
                ptofactible1 = Number(ptoFactible[0]);
                ptofactible2 = Number(ptoFactible[1]);
                console.log(`Evaluando Z(${ptoFactible[0]},${ptoFactible[1]})`)
                expressionEvaluada = expr.evaluate({x:ptoFactible[0],y:ptoFactible[1]})
            }
            if(derivadas.length ==3){
                ptofactible1 = Number(ptoFactible[0]);
                ptofactible2 = Number(ptoFactible[1]);
                ptofactible3 = Number(ptofactible[2]);
                console.log(`Evaluando Z(${ptoFactible[0]},${ptoFactible[1]},${ptoFactible[2]})`)
                expressionEvaluada = expr.evaluate({x:ptoFactible[0],y:ptoFactible[1],z:ptoFactible[2]})
            }
            console.log("EXPRESION VALUADA: "+expressionEvaluada.toString());
            resultado.push('maximo',detHessiano,derivadaX2,expressionEvaluada);
            return resultado
        }
        else{
            resultado = []
            console.log("El valor de dgdx2 es: "+ derivadaX2.toString());
            console.log("PUNTO DE SILLA");
            resultado.push('puntosilla',detHessiano,derivadaX2,0);
        }
    }
    else if(detHessiano ==0){
        console.log("No sirve este metodo");
        resultado = []
        resultado.push('metodonosirve')
        return resultado
    }
    else{
        console.log("Punto de silla, No extremo")
        resultado = []
        resultado.push('puntosilla');
        return resultado
    }

}
else{
    return false
}


}
//const z = "(x-2)^2 + (y-3)^2 +5" //Ej1
//const z = "x^2 + 3*y^2 -8*x -6*y +24" //Ej 2
//const z = "-(x-4)^2 -3*(y-2)^2 +24" //EJ 3
//const z = "-x^2 -(y+1)^2" //Ej 4
const z = "x + 2*z + y*z - x^2 - y^2 - z^2" //EJ 5 
const incognitas = ['x','y','z'];

const resultado = metodoDerivadas(z,incognitas);
console.log(resultado);

module.exports = {
    metodoDerivadas : metodoDerivadas
}
