const algebra = require('algebra.js');
const math = require('mathjs');
const { Expression } = require('algebra.js');
const { exp } = require('mathjs');
const Equation = algebra.Equation;
const Parser = require('expr-eval').Parser;
var parser = new Parser()


var z="-x^2-(y+1)^2";
var a=0;
var b=0;
var e=1;
const expr = parser.parse(z);
var deltaf = [];
var x0 = [];
var x1conR = [];
var x1 = [];
var valorR;
var ZconR;
var derivadaExpr = [];
var Z0;
var Z1;

console.log(expr.toString());

// Defino el punto X0
x0 = [a,b];

// Reemplazo X0 en la funcion z
Z0 = expr.evaluate({x: x0[0], y: x0[1]});
Z1 = 0;
     
while (((Z0-Z1) <= e) || (valr == 0)){
     // Calculo las derivadas de la funcion en x y en y
     derivadaExpr = [ math.derivative(expr.toString(),'x') , math.derivative(expr.toString(),'y')];

     // Reemplazo x0 en las derivas 
     deltaf = [ derivadaExpr[0].evaluate({x: x0[0]}) , derivadaExpr[1].evaluate({y: x0[1]})];
     
     // Genero el punto X1 el cual contiene una variable r que despues tendremos que despejar
     x1conR = [ (x0[0] + (deltaf[0]+"r")) , (x0[1] + (deltaf[1]+"r")) ];

     // Reemplazo los valores de X1 en la funcion objetivo y luego despejo r
     ZconR = expr.evaluate({x: x1conR[0], y: x1conR[1]});
     valorR = ZconR.solveFor("r");

     // Reemplazo r en X1
     x1 = [ x1conR[0].evaluate({r: valorR}) , x1conR[1].evaluate({r: valorR}) ];

     // Calculamos Z1
     Z1 = expr.evaluate({x: x1[0], y: x1[1]});
}

console.log(x1)

