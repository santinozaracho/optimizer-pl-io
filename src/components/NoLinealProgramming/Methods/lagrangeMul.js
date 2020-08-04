const Parser = require('expr-eval').Parser;
const parser = new Parser();
const math = require('mathjs');
const { exp, expression } = require('mathjs');
const fetch = require('node-fetch');



//f is the function, g is an array of constraints
const lagrangeMul = async (f,g, objective) => {
    var nConstraints= g.length


    //first, we create the lagrangian 
    var lagrange = f
    var operator = objective === "max" ? '-' : '+'
    var i=1
    var ladoDerRestriccion=[];
    var ladoIzqRestriccion = [];
    var lagrangeExpr;
    var variables;
    var n = 0; //number of variables
    var todosLagrange=[];
    g.forEach(element => {
        ladoIzqRestriccion.push(element.split('=')[0])
        
        ladoDerRestriccion.push(element.split('=')[1])

        lagrange = lagrange + operator + 'lambda' + i + '*' +Parser.parse(ladoIzqRestriccion[i-1])
        lagrangeExpr = Parser.parse(lagrange)

        variables = lagrangeExpr.variables()
        i+=1
    });

    // Create te URL
    var url = 'https://nlsystemsolver.herokuapp.com/getmsg/' 
    var variablesURL='';
    var ecuacionesURL='';
    variables.forEach(vari =>{
        n+=1
        variablesURL = variablesURL + vari.toString() + ',';
        
        // Here we should make the call to derivate
        ecuacionesURL = ecuacionesURL + math.derivative(lagrange,vari).toString() + ';';
            
    })
    ecuacionesURL = ecuacionesURL.slice(0,ecuacionesURL.length-1);
    variablesURL = variablesURL.slice(0,variablesURL.length-1);

    // Modify the URL to the Python program
    url = url + '?ecuaciones=' + ecuacionesURL + '&variables=' + variablesURL;
    url = url.split('+').join('%2B'); // Replace every plus with a %2B
    url = url.split(/\s/g).join(''); // Eliminate spaces for url
    url = url.split('^').join('**'); // Change ^ to **
    
    var x0=[]
    /*// Fetch to get the variables values
    var respuesta;
    const traerValores = async (url,callback) => {
        fetch(url,{method:'GET'})
        .then(res => res.json())
        .then(json => {
            x1=[]
            x1=callback(json.MESSAGE)
            return await x1;
        })
        return x1;
    }*/
    
    var traerValores = async (url) => {
        try{
            var resultadoFetch = await fetch(url,{method:'GET'})
                .then(res => res.json())
                .then(async respuesta => {
            var respuestaStr = respuesta.MESSAGE
            //respuestaStr = JSON.stringify(respuestaStr);
            //console.log(typeof respuestaStr)
            respuestaStr = respuestaStr.replace("[","");
            respuestaStr = respuestaStr.replace("]","");
            // Paso a un arreglo
            respuestaStr = respuestaStr.replace(/'/g,"");
            respuestaStr = respuestaStr.replace(/ /g,"");
            respuestaStr = respuestaStr.split(",");
            return respuestaStr
        });
        return resultadoFetch
        }
        catch(e)
        {
            console.log(e)
        }
        
    }

    return traerValores(url);
}

// URL Should be like --> https://nlsystemsolver.herokuapp.com/getmsg/?ecuaciones=1-2*x;z-2*y;2%2By-2*z&variables=x,y,z
// 2*x**2-L1*3x  "2*x^2",["3*x=12"],"max"
//console.log(lagrangeMul("-x1^2 -(x2 -1)^2",["2*x1+x2-1=0"],"min"));
//console.log(lagrangeMul("x^2+y^2+z^2",["x+y+3*z-2=0","5*x+2*y+z-5=0"],"max"));
/*var odioMiVida = lagrangeMul("-(x1)^2-(x2)^2-(x3)^2+4*x1+8*x2+16*x3",["x1+x2+x3-2=0","x1+2*x2=0"],"max")
    .then()
    .then(value => {
        return value
    });

console.log(odioMiVida)*/

module.exports ={lagrangeMul};