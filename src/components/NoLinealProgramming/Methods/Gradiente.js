const algebra = require('algebra.js');
const math = require('mathjs');
const { Expression } = require('algebra.js');
const { exp, expression } = require('mathjs');
const Equation = algebra.Equation;
const Parser = require('expr-eval').Parser;
var parser = new Parser();
const algebrite = require('algebrite');

//console.log(algebrite.nroots('-(0*(0*x))^2-(0*(-2*x)+1)^2').toString())     -(x-4)^2-(3*(y-2)^2)-4  -(x^2)-(y+1)^2
const fGradiente = (funcionObjetivo,puntoa,puntob,e,Objetivo) => {
     
     var Z=funcionObjetivo.toString();
     var a=puntoa;
     var b=puntob;
     var epsilon=0;
     var objetivo=Objetivo.toString();
     const expr = parser.parse(Z);

     var deltaf = [];
     var x0 = [];
     var x1conR = [];
     var x1 = [];
     var valorR;
     var ZconR;
     var derivadaExpr = [];
     var Z0;
     var Z1;
     var helper;
     var regder = /\d r/;
     var regiz = /r \d/;

     // Defino el punto X0
     x0 = [a,b];

     // Reemplazo X0 en la funcion z
     Z0 = expr.evaluate({x: x0[0], y: x0[1]});
     Z1 = 0;
     valorR = 1;
     var salida = 0;

     // Calculo las derivadas de la funcion en x y en y
     derivadaExpr = [ math.derivative(expr.toString(),'x') , math.derivative(expr.toString(),'y')];

     while (((math.abs(valorR)) >= epsilon) && (salida < 999)){
          epsilon=e;
          // La variable salida representa la condicion en la que el punto se encuentra en el infinito
          salida = salida + 1;

          // Reemplazo x0 en las derivas 
          deltaf = [ derivadaExpr[0].evaluate({x: x0[0], y: x0[1]}) , derivadaExpr[1].evaluate({x: x0[1], y: x0[1]})];

          if (math.abs(parseFloat(deltaf[0].toString())) < 0.0001){
               deltaf[0]=0;
          }
          if (math.abs(parseFloat(deltaf[1].toString())) < 0.0001){
               deltaf[1]=0;
          }
          if (objetivo=='max'){
               deltaf = ['('+deltaf[0]+'*r)','('+deltaf[1]+'*r)'];
          }else{
               deltaf = ['-('+deltaf[0]+'*r)','-('+deltaf[1]+'*r)'];
          }
          deltaf = [ math.simplify(deltaf[0]) , math.simplify(deltaf[1]) ];

          // Genero el punto X1 el cual contiene una variable r que despues tendremos que despejar
          if (x0[0]===0){
               x1conR[0]='('+deltaf[0]+')';
          }else{
               x1conR[0]=x0[0]+'('+deltaf[0]+')';
          }

          if (x0[1]===0){
               x1conR[1]='('+deltaf[1]+')';
          }else{
               x1conR[1]=x0[1]+'('+deltaf[1]+')';
          }
          //x1conR = [ x0[0]+'('+deltaf[0]+')' , x0[1] +'('+ deltaf[1]+')' ];
          x1conR = [ math.simplify(x1conR[0]) , math.simplify(x1conR[1]) ];

          x1conR = [ (x1conR[0].toString()) , (x1conR[1].toString()) ];

          // Aca se corrige el error de que por algun motivo elimina el simbolo *
          if (x1conR[0].match(regder) != null)
          {
               x1conR[0]=x1conR[0].split(" r").join("* r");
          }
          if (x1conR[1].match(regder) != null)
          {
               x1conR[1]=x1conR[1].split(" r").join("* r");
          }

          if (x1conR[0].match(regiz) != null)
          {
               x1conR[0]=x1conR[0].split("r ").join("r *");
          }
          if (x1conR[1].match(regiz) != null)
          {
               x1conR[1]=x1conR[1].split("r ").join("r *");
          }
          
          //x1conR = [ x1conR[0].split("r").join("* r") , x1conR[1].split("r").join("* r") ];
          //x1conR = [ x1conR[0].split("* *").join("*") , x1conR[1].split("* *").join("*") ];

          // Se simplifica para que sea mas facil realizar la wea
          x1conR = [ math.simplify(x1conR[0]) , math.simplify(x1conR[1]) ];



          // Reemplazo los valores de X1 en la funcion objetivo y luego despejo r
          ZconR = Z.split("x").join(x1conR[0]);
          ZconR = ZconR.split("y").join(x1conR[1]);

          if ( (ZconR).includes("r") ){
               //Aca se despejaria r pero nada anda
               helper = ZconR.split("r").join("x");
               helper = math.simplify(helper);
               helper = (helper.toString()).split("+ -").join("-");
               if (helper=="0"){
                    valorR=0;
               }else{
                    valorR = algebrite.nroots(helper.toString());
               }
               

               valorR = valorR.toString()
               valorR = valorR[1]+valorR[2]+valorR[3]+valorR[4]+valorR[5]+valorR[6]+valorR[7]
               valorR = parseFloat(valorR);
          } else {
               valorR = 0;
               break;
          }

          // Reemplazo r en X1
          x1 = [ (Parser.parse(x1conR[0].toString())).evaluate({r: eval(valorR)}) , (Parser.parse(x1conR[1].toString())).evaluate({r: eval(valorR.toString())}) ];

          // Calculamos 
          Z1 = expr.evaluate({x: x1[0], y: x1[1]});
          x0 = [ x1[0] , x1[1] ];

     }

     if ((isNaN(x1[0])) || (isNaN(x1[1]))){
          x1 = [ -Infinity , Infinity ];
     } 

     /*if (math.abs(Z0-Z1) < epsilon){
          salida=1999;
     }*/
     return x1;


}

module.exports = fGradiente
