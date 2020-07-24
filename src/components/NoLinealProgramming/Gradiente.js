const algebra = require('algebra.js');
const math = require('mathjs');
const { Expression } = require('algebra.js');
const { exp, expression } = require('mathjs');
const Equation = algebra.Equation;
const Parser = require('expr-eval').Parser;
var parser = new Parser()


var z="(1-x)^2 + 5*(y-x^2)^2";
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
var ZdespejeR;

console.log(expr.toString());

// Defino el punto X0
x0 = [a,b];

// Reemplazo X0 en la funcion z
Z0 = expr.evaluate({x: x0[0], y: x0[1]});
Z1 = 0;
valorR = 1;

// Calculo las derivadas de la funcion en x y en y
derivadaExpr = [ math.derivative(expr.toString(),'x') , math.derivative(expr.toString(),'y')];

while ((math.abs(Z0-Z1) <= e) && (valorR != 0)){

     // Reemplazo x0 en las derivas 
     deltaf = [ derivadaExpr[0].evaluate({x: x0[0], y: x0[1]}) , derivadaExpr[1].evaluate({x: x0[1], y: x0[1]})];

     // Genero el punto X1 el cual contiene una variable r que despues tendremos que despejar
     x1conR = [ (x0[0] + "+" + "("+ (deltaf[0]+" * r)")) , (x0[1] + "+" + "(" + (deltaf[1]+" * r)")) ];

     // Reemplazo los valores de X1 en la funcion objetivo y luego despejo r
     ZconR = expr.substitute("x", Parser.parse(x1conR[0]));
     ZconR = ZconR.substitute("y", Parser.parse(x1conR[1]));
     ZconR = ZconR.toString() + " = 0";
     console.log(ZconR.toString());
     ZdespejeR = new algebra.parse(ZconR.toString());
     console.log(ZdespejeR);
     if ( (ZdespejeR.toString()).includes("r") ){
          //Aca se despejaria r pero nada anda
          
          //helper = new algebra.parse(ZdespejeR.toString()); /////Aca esta el error
          //console.log(helper.toString());
          //ZdespejeR = ZdespejeR.substitute("r", Parser.parse(helper.toString()));
          //valorR = ZdespejeR.solveFor("r");
     } else {
          valorR = 0;
     }

     // Reemplazo r en X1
     x1 = [ (Parser.parse(x1conR[0])).evaluate({r: eval(valorR.toString())}) , (Parser.parse(x1conR[1])).evaluate({r: eval(valorR.toString())}) ];
     // Calculamos Z1
     Z1 = expr.evaluate({x: x1[0], y: x1[1]});
     if ((math.abs(Z0-Z1) <= e) || (valorR == 0)){
          x0 = [ x1[0] , x1[1] ];
     }
     console.log(valorR);
} 

console.log(x1);

