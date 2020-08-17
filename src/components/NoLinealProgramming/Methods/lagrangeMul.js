const Parser = require('expr-eval').Parser;
const parser = new Parser();
const math = require('mathjs');
const { exp, expression, nthRootsDependencies } = require('mathjs');
const fetch = require('node-fetch');
const algebrite = require('algebrite')

var checkIfAllPositive = function(str)
{
    str= str.toString()
    let plus = /\[[0-9]|\,[0-9]|^[0-9]/;
    let minus = /-/;
    if(plus.test(str) && !minus.test(str)){
        console.log("Fully positive")
        return true;
    }
    else{
        return false;
    }
}

var checkIfAllNegative = function(str)
{
    str=str.toString()
    let plus = /\[[0-9]|\,[0-9]/;
    let minus = /-/;
    if(minus.test(str) && !plus.test(str)){
        return true;
    }
    else{
        return false
    }
}

//f is the function, g is an array of constraints
const lagrangeMul =async (f,g, objective) => {
    console.log("Iniciando funcion lagrangeMul")
    console.log("Funcion recibida:")
    console.log(f)
    try{
        var nConstraints= g.length
        console.log("El numero de reestricciones es "+nConstraints)
        var resultadoADevolver={
            puntos:[],
            tipo:[]
        }
    
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
        //var url= 'http://localhost:5000/'
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
        url = url.split('+').join('%2B'); // Replace every plus with a %2B
        url = url.split(/\s/g).join(''); // Eliminate spaces for url
        url = url.split('^').join('**'); // Change ^ to **
        
        // Replace every plus with a %2B
        url = url.split('+').join('%2B');
    
        // Eliminate spaces for url
        url = url.split(/\s/g).join('');
    
        // Change ^ to **
        url = url.split('^').join('**');
        console.log("First Url")
        console.log(url)
        var x0=[]
     
        // Fetch to get the variables values
        const traerValores = async (url,callback) => {
            const variable = await fetch(url,{method:'GET'})
            .then(res => res.json())
            .then(json => {
                console.log("json dado por la primera funcion de back")
                console.log(json)
                return callback(json.MESSAGE)
            });
            console.log("Dentro de traerValores, antes de retornar")
            console.log(variable)
            return variable;
        }
    
        var callbackFunction = async (data) =>{
            console.log("Respuesta del back: syssolver")
            console.log(data)
            var respuesta = data
            var stringRespuesta =''
            var num;
            var dem;
            var estadoFraccion = false // Controls if we are processing a fraction or not
            var cont = 0
           
            x0=[]
            var estado = 0 //aca contenemos la posicion del subarreglo de solucion
            if (respuesta.includes('x') || respuesta.includes('I'))
            {
                return false;
            }
            //eliminate whitespace
            respuesta = respuesta.split(' ').join('')
            respuesta = respuesta.split("\)\,\(")
            //facu toco aca
            //((val1, val2,val3),(val1,val))
            //Facu asume que la situazao de ((, se presenta solo al principio, primer elemento. Y que la de )), solo al ultimo
            respuesta[0] = respuesta[0].replace('((','')
            respuesta[respuesta.length-1] = respuesta[respuesta.length-1].replace('))','')
            respuesta[respuesta.length-1] = respuesta[respuesta.length-1].replace('),)','')
            console.log("Respuesta tras parseo inicial")
            console.log(respuesta)
            var arregloRespuesta=[]
            var tempArreglo=[]
            //Transformar el arreglo en un conjunto de subarreglos
            n = n-g.length
            respuesta.forEach(element => {
                tempArreglo=element.split(',')
                arregloRespuesta.push(element.split(','))
            })
            
    
            //Evaluar los elementos en caso de fraccion o raiz
            console.log("Evaluando los elementos de la resolucion del sistema de ecuaciones")
            var tempElement
            tempArreglo=[]
            
            arregloRespuesta.forEach(element =>{
                element.forEach(element2 =>{
                    console.log("Pre evaluacion")
                    console.log(element2)
                    tempElement = element2.split('sqrt').join('Math.sqrt').toString()
                    tempElement = eval(tempElement)
                    tempArreglo.push(tempElement)
                    console.log("Post evaluacion")
                    console.log(tempElement)
                })
                x0.push(tempArreglo)
                tempArreglo=[]
            })
            //console.log("x0")
            //console.log(x0)
    
            //console.log("x0 en lagrangeMul")
            const compruebaExtremo= async function(punto)
            {
                let x0 = punto;
                var m = ladoIzqRestriccion.length; //Columns number of restrictions
                //console.log("n al principio de compruebaExtremo")
                //console.log(n)
                
                // Generate P array, where [[Ng1(x), Ng1(x2)],[Ng2(x1),Ng2(x2)]]
                var P = math.zeros(m,n)
                
                var tempRestriccion;
                var varP;
                var scope = {}
                //console.log("Variables")
                //console.log(variables)
                for (let k = 0; k < variables.length; k++) {
                    scope[variables[k]]=x0[k]    
                }
                for(var i = 0; i < m; i+=1) //each restriction
                {
                    for(var j = 0; j < n; j+=1) //each variable
                    {
                        tempRestriccion = ladoIzqRestriccion[i];   
                        //console.log("tempRestriccion")
                        //console.log(tempRestriccion)
                        varP = variables[j].toString();
                        tempRestriccion = math.derivative(tempRestriccion, varP); 
                        tempRestriccion = math.evaluate(tempRestriccion.toString(),scope)
                        //console.log("tempReestriccion evaluada")
                        //console.log(tempRestriccion)
                        P.subset(math.index(i, j), tempRestriccion);
                    }
                }
    
                // Load P in Hessiano
                var hessiano = math.zeros(m+n,m+n)
                //P deberia ser mas grande
                //console.log(P._data)
                for(var i = 0; i < m; i+=1) //each restriction
                {
                    for(var j = n-1; j < m+n; j+=1) //each variable
                    {
                        let subsetP = P.subset(math.index(i,j-n+1))
                        let indice = math.index(i,j)
                        hessiano.subset(indice, subsetP);
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
                            //console.log(tempDerSeg)
                        }
                        //var tempDerSegP=anotherParser.evaluate(tempDerSeg.toString())
                        derivSegEvaluadas.push(tempDerSeg)
                        Q.subset(math.index(k,l),tempDerSeg)
                    }
                }
                //console.log("Q")
                //console.log(Q)
                //copy Q into Hessian Matrix
                for(var i = 0;i < n; i+=1){
                    for (let j = 0; j < n; j++) {
                        hessiano.subset(math.index(m+i,m+j), Q.subset(math.index(i,j)))
                    }
                }
                
                var elementos=(math.flatten(hessiano))._data
                elementos = elementos.toString()
            
    
                //Generate url for determinant solver
                var tamHessiano = m+n
                var urlDetSolver='https://nlsystemsolver.herokuapp.com/detSolver?n='+tamHessiano+'&elementos='+elementos
                //console.log(urlDetSolver)
    
                await fetch(urlDetSolver,{method:'GET'})
                .then((response) => response.json())
                .then(json => {
                    var ecuacionDeterminante = json.MESSAGE
                
                    ecuacionDeterminante= ecuacionDeterminante.split('**').join('^')
                    ecuacionDeterminante= ecuacionDeterminante.split('k').join('x')
                    //console.log("Ecuacion del determinante")
                    //console.log(ecuacionDeterminante)
                    var resolucion = algebrite.nroots(ecuacionDeterminante)
                    //console.log(resolucion.toString())
                    //Now, we must check whether the values are positives or negatives.
                    //An all positive solution means we face a minimum
                    //An all negative solution means we face a maximum
                     //resolucion= resolucion.toString().split(',')
                    console.log("resolucion como arreglo")
                    resolucion= resolucion.toString()
                    console.log(resolucion)
                    punto = punto.splice(0,punto.length-m)
                    if(checkIfAllPositive(resolucion)){
                        resultadoADevolver.puntos.push(punto)
                        resultadoADevolver.tipo.push("min")
                    }
                    else{
                        if(checkIfAllNegative(resolucion)){
                            resultadoADevolver.puntos.push(punto)
                            resultadoADevolver.tipo.push("max")
                        }
                        else{
                            resultadoADevolver.puntos.push(punto)
                            resultadoADevolver.tipo.push("nae")
                        }
                    }
                    console.log("Despues de hacer la comprobacion")
                    console.log(resultadoADevolver)
                    //return resultadoADevolver;
                })
            }
            x0.forEach(async element =>{
                await compruebaExtremo(element)
            })
            //console.log(x0)
            return resultadoADevolver;    
        }
        var objetoADevolver = await traerValores(url,callbackFunction)
        console.log("lagrangeMul, antes de devolver el valor final")
        console.log(objetoADevolver)
        return objetoADevolver;
    }
    catch(e){
        console.log(e)
    }
    
}
module.exports ={lagrangeMul};
// URL Should be like --> https://nlsystemsolver.herokuapp.com/getmsg/?ecuaciones=1-2*x;z-2*y;2%2By-2*z&variables=x,y,z
// 2*x**2-L1*3x  "2*x^2",["3*x=12"],"max"
//console.log(lagrangeMul("-x1^2 -(x2 -1)^2",["2*x1+x2-1=0"],"min"));
//lagrangeMul("x1^2+x2^2+x3^2",["x1+x2+3*x3-2=0","5*x1+2*x2+-5=0"],"max");

//lagrangeMul("-x1^2 -(x2 -1)^2",["2*x1+x2-1=0"],"max");
//x1^2+x2^2-2*x1-2*x2+4
