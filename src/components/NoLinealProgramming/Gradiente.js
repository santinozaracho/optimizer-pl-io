const algebra = require('algebra.js');
const math = require('mathjs');
const { Expression } = require('algebra.js');
const { exp } = require('mathjs');
const Equation = algebra.Equation;
const Parser = require('expr-eval').Parser;
var parser = new Parser()


z='-x^2-(y+1)^2';
a=0;
b=0;
e=0

     const expr = parser.parse(z);
     var deltaf = [];
     var x0 = [];
     var x1 = [];
     var valr;
     var dx0;
     var dy0;
     var derivadax;
     var derivaday;

     // Defino el punto X0
     x0 = [a,b];

     // Reemplazo X0 en la funcion z
     Z0 = expr.evaluate({x: x0[0], y: x0[1]});
     Z1 = 0;
     
     while (((Z0-Z1) <= e) || (valr == 0)){
          // Calculo las derivadas de la funcion en x y en y
          derivadax = math.derivative(expr,'x');
          derivaday = math.derivative(expr,'y');

          // Reemplazo x0 en las derivas
          dx0 = derivadax.evaluate({x: x0[0]});
          dy0 = derivaday.evaluate({y: x0[1]});

          // Calculo la funcion en el punto X0
          deltaf = [ dx0 , dy0 ];

          // Genero el punto X1
          x1 = [ x0[0] + deltaf[0]*"r" , x0[1] + deltaf[1]*"r" ];

          // Despejo "r" primero reemplazando los valores de x1 en la funcion y luego despejando
          zr = expr.evaluate({x: x1[0], y: x1[1]});
          valr = zr.solveFor('r');

          // Reemplazo r en X1
          x1 = [ x1[0].evaluate({r: valr}) , x1[1].evaluate({r: valr}) ];

          // Calculamos Z1
          Z1 = expr.evaluate({x: x1[0], y: x1[1]});
     }

console.log(x1)

