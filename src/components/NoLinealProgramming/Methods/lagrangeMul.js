const Parser = require('expr-eval').Parser;
const parser = new Parser();
const math = require('mathjs');
const { exp, expression, nthRootsDependencies } = require('mathjs');
const fetch = require('node-fetch');
const algebrite = require('algebrite')



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
            
    })
    ecuacionesURL = ecuacionesURL.slice(0,ecuacionesURL.length-1);
    variablesURL = variablesURL.slice(0,variablesURL.length-1);
    console.log(ecuacionesURL)
    url = url + '?ecuaciones=' + ecuacionesURL + '&variables=' + variablesURL;
    
    // Replace every plus with a %2B
    url = url.split('+').join('%2B');

    // Eliminate spaces for url
    url = url.split(/\s/g).join('');

    // Change ^ to **
    url = url.split('^').join('**');
    
    x0=[]
 

    // peto 
    // Fetch to get the variables values
    const traerValores = async (url,callback) => {
        const variable = await fetch(url,{method:'GET'})
        .then(res => res.json())
        .then(json => {
            x1=[]
            return callback(json.MESSAGE)
        });
        
        return variable;
    }

    callbackFunction = (data) =>{
        // console.log(data)
        respuesta = data
        var stringRespuesta =''
        var num;
        var dem;
        var estadoFraccion = false // Controls if we are processing a fraction or not
        var cont = 0
        respuesta = respuesta.replace("[","");
        respuesta = respuesta.replace("]","");
        // Paso a un arreglo
        respuesta = respuesta.replace(/'/g,"")
        respuesta = respuesta.replace(/ /g,"")
        respuesta = respuesta.split(",");
        var x0=[]
        respuesta.forEach(element => {
            // Do some refactoring here in some distant future
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
        console.log("Variables")
        console.log(variables)
        for (let k = 0; k < variables.length; k++) {
            scope[variables[k]]=x0[k]    
        }
        for(var i = 0; i < m; i+=1) //each restriction
        {
            for(var j = 0; j < n; j+=1) //each variable
            {
                tempRestriccion = ladoIzqRestriccion[i];   
                console.log("tempRestriccion")
                console.log(tempRestriccion)
                varP = variables[j].toString();
                tempRestriccion = math.derivative(tempRestriccion, varP); 
                tempRestriccion = math.evaluate(tempRestriccion.toString(),scope)
                console.log("tempReestriccion evaluada")
                console.log(tempRestriccion)
                P.subset(math.index(i, j), tempRestriccion);
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

        var Q= math.zeros(n,n)

        for(let k = 0; k < n; k++)
        {
            derivadasPrimeras.push(math.derivative(lagrange,variables[k]).toString())
            for(let l = 0; l < n; l++)
            {
                tempDerSeg = math.derivative(derivadasPrimeras[k],variables[l]).toString()
                
                derivadasSegundas.push(tempDerSeg)
                tempDerSeg = math.evaluate(tempDerSeg,scope)
                if(k===l)//diagonal points
                {
                    tempDerSeg+= '-k'
                    console.log(tempDerSeg)
                    
                }
                //var tempDerSegP=anotherParser.evaluate(tempDerSeg.toString())
                derivSegEvaluadas.push(tempDerSeg)
                Q.subset(math.index(k,l),tempDerSeg)
            }
        }
        console.log("Q")
        console.log(Q)
        //copy Q into Hessian Matrix
        for(var i = 0;i < n; i+=1){
            for (let j = 0; j < n; j++) {
                hessiano.subset(math.index(m+i,m+j), Q.subset(math.index(i,j)))
            }
        }
        
        var elementos=(math.flatten(hessiano))._data
        elementos = elementos.toString()
       

        //Generate url for determinant solver
        tamHessiano = m+n
        urlDetSolver='https://nlsystemsolver.herokuapp.com/detSolver?n='+tamHessiano+'&elementos='+elementos
        console.log(urlDetSolver)
        
        fetch(urlDetSolver,{method:'GET'})
        .then((response) => response.json())
        .then(json => {
            var ecuacionDeterminante = json.MESSAGE
            
            ecuacionDeterminante= ecuacionDeterminante.split('**').join('^')
            ecuacionDeterminante= ecuacionDeterminante.split('k').join('x')
            console.log("Ecuacion del determinante")
            console.log(ecuacionDeterminante)
            var resolucion = algebrite.nroots(ecuacionDeterminante)
            console.log(resolucion.toString())
            


            
        })


        
        
        
        return x0    
    }
    
    // x0=traerValores(url,callbackFunction);

    traerValores(url,callbackFunction).then(result => console.log(result))
    
    
    //return x0.splice(0,n);
}

// URL Should be like --> https://nlsystemsolver.herokuapp.com/getmsg/?ecuaciones=1-2*x;z-2*y;2%2By-2*z&variables=x,y,z
// 2*x**2-L1*3x  "2*x^2",["3*x=12"],"max"
//console.log(lagrangeMul("-x1^2 -(x2 -1)^2",["2*x1+x2-1=0"],"min"));
//console.log(lagrangeMul("x^2+y^2+z^2",["x^2+y+3*z-2=0","5*x+2*y+z-5=0"],"max"));

lagrangeMul("x1^2 +2*x2^2+10*x3^2",["x1 +x2^2 + x3 - 5=0","x1 +5*x2 +x3 -7 = 0"],"max");
