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
    var todosLagrange=[];
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
        // Paso a un arreglo
        respuesta = respuesta.replace(/'/g,"")
        respuesta = respuesta.replace(/ /g,"")
        respuesta = respuesta.split(",");
        console.log('Respuesta')
        console.log(respuesta)
        console.log('Tipo de respuesta: '+typeof respuesta)
        var x0=[]
        respuesta.forEach(element => {
            //do some refactoring here in some distant future
            x0.push(eval((element.split('sqrt').join('Math.sqrt')).toString()))
        })
        console.log('x0')
        console.log(x0)

        var m = ladoIzqRestriccion.length; //Columns number of restrictions
        n = n-g.length //substracting the lambdas
        
        // Generate P array, where [[Ng1(x), Ng1(x2)],[Ng2(x1),Ng2(x2)]]
        var P = math.zeros(m,n)
        
        var tempRestriccion;
        var varP;
        var scope = {}
        for (let k = 0; k < variables.length; k++) {
            scope[variables[k]]=x0[k]    
        }
        console.log('scope')
        console.log(scope)
        for(var i = 0; i < m; i+=1) //each restriction
        {
            for(var j = 0; j < n; j+=1) //each variable
            {
                tempRestriccion = ladoIzqRestriccion[i];   
                varP = variables[j].toString();
                tempRestriccion = math.derivative(tempRestriccion, varP); 
                tempRestriccionParsed = Parser.parse(tempRestriccion.toString());
                P.subset(math.index(i, j), tempRestriccionParsed.evaluate({ varP : x0[j] }));
            }
        }

        // Load P in Hessiano
        var hessiano = math.zeros(m+n,m+n)
        for(var i = 0; i < m; i+=1) //each restriction
        {
            for(var j = n-1; j < m+n; j+=1) //each variable
            {
                hessiano.subset(math.index(i, j), P.subset(math.index(i,j-n+1)));
            }
        }

        // Load P^T in Hessiano
        for(var i = n-1; i < m+n; i+=1) //each restriction
        {
            for(var j = 0; j < m; j+=1) //each variable
            {   
                hessiano.subset(math.index(i, j), P.subset(math.index(j,i-n+1)));
            }
        }
        
        //Generate Q

        var derivadasPrimeras=[]
        var derivadasSegundas=[]
        var derivSegEvaluadas =[]
        var tempDerSeg;
        console.log('n')
        console.log(n)

        var Q= math.zeros(n,n)
        console.log("Q")
        console.log(Q)
        for(let k = 0; k < n; k++)
        {
            derivadasPrimeras.push(math.derivative(lagrange,variables[k]).toString())
            for(let l = 0; l < n; l++)
            {
                tempDerSeg = math.derivative(derivadasPrimeras[k],variables[l]).toString()
                derivadasSegundas.push(tempDerSeg)
                tempDerSeg = math.evaluate(tempDerSeg,scope)
                derivSegEvaluadas.push(tempDerSeg)
                Q.subset(math.index(k,l),tempDerSeg)
            }
        }
        console.log("Q")
        console.log(Q)
        /*
        for(var i = 0;i < n; i+=1){
            for (let j = 0; j < n; j++) {
                
            }
        }
        */
       /*
        console.log(derivadasPrimeras.toString())
        console.log(derivadasSegundas.toString())

        console.log(hessiano.toString())
        */
    }

    traerValores(url,callbackFunction)

}
// URL Should be like --> https://nlsystemsolver.herokuapp.com/getmsg/?ecuaciones=1-2*x;z-2*y;2%2By-2*z&variables=x,y,z
//2*x**2-L1*3x  "2*x^2",["3*x=12"],"max"
console.log(lagrangeMul("x^2+y^2+z^2",["x+y+3*z-2=0","5*x+2*y+z-5=0"],"max"));

