const Parser = require('expr-eval').Parser;
const parser = new Parser();
const math = require('mathjs');
const { exp, expression } = require('mathjs');
const fetch = require('node-fetch');



//f is the function, g is an array of constraints
const lagrangeMul =(f,g, objective) => {
    var nConstraints= g.length


    //first, we create the lagrangian 
    var lagrange = f
    var operator = objective === "max" ? '-' : '+'
    var i=1
    var ladoDerRestriccion=[];
    var ladoIzqRestriccion = [];
    var lagrangeExpr;
    var variables;
    var n= 0; //number of variables
    g.forEach(element => {
        ladoIzqRestriccion.push(element.split('=')[0])
        
        ladoDerRestriccion.push(element.split('=')[1])

        //console.log(ladoDerRestriccion);
        //console.log(ladoIzqRestriccion);
        lagrange = lagrange + operator + 'lambda' + i + '*' +Parser.parse(ladoIzqRestriccion[i-1])
        lagrangeExpr = Parser.parse(lagrange)

        variables = lagrangeExpr.variables()
        i+=1
    });
    
    var url = 'https://nlsystemsolver.herokuapp.com/getmsg/' 
    var variablesURL='';
    var ecuacionesURL='';
    variables.forEach(vari =>{
        n+=1
        variablesURL = variablesURL + vari.toString() + ',';
        
        // Here we should make the call to derivate
        ecuacionesURL = ecuacionesURL + math.derivative(lagrange,vari).toString() + ';';
        //console.log(url);
            
    })
    ecuacionesURL = ecuacionesURL.slice(0,ecuacionesURL.length-1);
    variablesURL = variablesURL.slice(0,variablesURL.length-1);

    url = url + '?ecuaciones=' + ecuacionesURL + '&variables=' + variablesURL;
    
    //replace every plus with a %2B
    url = url.split('+').join('%2B');

    //eliminate spaces for url
    url = url.split(/\s/g).join('');

    //change ^ to **
    url = url.split('^').join('**');
    console.log(url);
    

    // Fetch to get the variables values
    var respuesta;
    const traerValores = (url,callback) => {
        fetch(url,{method:'GET'})
        .then(res => res.json())
        .then(json => {
            callback(json.MESSAGE)})
    }

    callbackFunction = (data) =>{
        console.log(data)
        respuesta = data
        var stringRespuesta =''
        var num;
        var dem;
        var estadoFraccion = false //controls if we are processing a fraction or not
        var cont = 0
        respuesta = respuesta.replace("[","");
        respuesta = respuesta.replace("]","");
        //paso a un arreglo
        respuesta = respuesta.replace(/'/g,"")
        respuesta = respuesta.replace(/ /g,"")
        respuesta = respuesta.split(",");
        console.log(respuesta)
        var x0=[]
        respuesta.forEach(element => {
            x0.push(eval(element))
        })
        console.log(x0)
        var m = ladoIzqRestriccion.length; //Columns number of restrictions
        console.log('values of m and n')
        console.log(n,m)
        n = n-g.length //substracting the lambdas
        //var x0 = math.zeros(n,m); //Aca tenemos una matriz con cosas que ni idea que son
        //generate P array, where [[Ng1(x), Ng1(x2)],[Ng2(x1),Ng2(x2)]]
        var P = math.zeros(m,n)
        /*
        for(var i = 0; i < m; i+=1)
        {
            //each restriction
            for(var j = 0; j < n; j+=1)
            {
                //each variable

                P[i][j]
            }
        }
        */
        var hessiano = math.zeros(m+n,m+n)
        console.log(hessiano.toString())
    }

    traerValores(url,callbackFunction)

}
// URL Should be like --> https://nlsystemsolver.herokuapp.com/getmsg/?ecuaciones=1-2*x;z-2*y;2%2By-2*z&variables=x,y,z
//2*x**2-L1*3x  "2*x^2",["3*x=12"],"max"
console.log(lagrangeMul("x^2+y^2+z^2",["x+y+3*z-2=0","5*x+2*y+z-5=0"],"max"));

