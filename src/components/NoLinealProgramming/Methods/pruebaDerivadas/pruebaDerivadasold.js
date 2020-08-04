const algebra = require('algebra.js');
const math = require('mathjs');
const { Expression } = require('algebra.js');
const Equation = algebra.Equation;

//metodo de primera y segunda derivada
var derivadas =[]
//FORMATO DERIVADAS [dgdx2,dgdy2,dgdxy]
const z = "(x-2)^2 + (y-3)^2 +5";
//const z = "-(x-4)^2 -3*(y-2)^2 +24"
const expr = new Expression(z)
//calculo las derivivadas primeras y segundas parcial respecto a x
const incognitas = ['x','y']
const dgdx = math.derivative(z,'x');
const dgdx2 = math.derivative(dgdx,'x')

//calculo las derivadas primeras y segundas parciales respectoa  y

const dgdy = math.derivative(z,'y');
const dgdy2 = math.derivative(dgdy,'y');

//calculo las derivadas cruzadas

const dgdxy = math.derivative(dgdx,'y');
const dgdyx = math.derivative(dgdy,'x');

derivadas.push(dgdx2,dgdy2,dgdxy);

//fhago una funcion para ver si hay puntos que cumplan con la condicion necesaria del gradiente
const puntoFactible = (d1,d2) =>{
    //hago que la libreria algebra parsee la ecuacion, agregandole un =0 para que despues resuelva
    const d11 = new algebra.parse(d1.toString()+"=0");
    const d22 = new algebra.parse(d2.toString()+"=0");
    try {
        //aca hago que resuelva cada ecuacion, sacando x e y
        const x = d11.solveFor('x');
        const y = d22.solveFor('y');
        //retorno los dos valores en un arreglo
        return [x.toString(),y.toString()]
    } catch (error) {
        //si no puede encontrar un punto factible, retorno falso e imprimo el error
        console.log(error);
        return false
    }
}

//Ahora calculo el hessiano con las derivadas valuadas en el punto factible
//FORMATO DERIVADAS [dgdx2,dgdy2,dgdxy]
const getMatrizHessiana = (derivadas,ptoFactible)=>{
    //valuo la derivada2da de x
    const derivada2daX = derivadas[0].evaluate({x:ptoFactible[0]})
    //valuo la derivada2da de y
    const derivada2daY = derivadas[1].evaluate({y:ptoFactible[1]})
    //valuo la derivada cruzada
    const derivadaCruzada = derivadas[2].evaluate({x:ptoFactible[0], y:ptoFactible[1]})
    //armo la matriz del hessiano con las derivadas que calcule
    const hessiano = math.matrix([[derivada2daX,derivadaCruzada],[derivadaCruzada,derivada2daY]])
    return hessiano
}



console.log(dgdx.toString());
console.log(dgdy.toString())
const ptoFactible = puntoFactible(dgdx,dgdy)
console.log(ptoFactible);
//si encuentra un punto factible, paso a calcular el hessiano
if(ptoFactible){
    const hessiano = getMatrizHessiana(derivadas,ptoFactible);
    //evaluo el resultado del hessiano. Si este es mayor a 0 es factible 
    detHessiano = math.det(hessiano);
    if(detHessiano>0){
        console.log("Es un punto factible");
        //Si veo que es factible, tengo que ver que onda  dgdx2
        derivadaX2= hessiano.get([0,0])
        if(derivadaX2 > 0){
            console.log("El valor de dgdx2 es: "+ derivadaX2.toString());
            console.log("MINIMO");
            //console.log(`Evaluando Z(${ptoFactible[0]},${ptoFactible[1]}) = ${expr.eval({x:ptoFactible[0], y:ptoFactible[1]})}`)
        }
        else if(derivadaX2 < 0){
            console.log("El valor de dgdx2 es: "+ derivadaX2.toString());
            console.log("MAXIMO")
        }
        else{
            console.log("El valor de dgdx2 es: "+ derivadaX2.toString());
            console.log("PUNTO DE SILLA");
        }
    }
    else if(detHessiano ==0){
        console.log("No sirve este metodo");
    }
    else{
        console.log("Punto de silla, No extremo")
    }
}
