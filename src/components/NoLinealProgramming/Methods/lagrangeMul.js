var Parser = require('expr-eval').Parser
var parser = new Parser()

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
    g.forEach(element => {
        ladoIzqRestriccion.push(element.split('=')[0])

        ladoDerRestriccion.push(element.split('=')[1])


        //console.log(ladoDerRestriccion);
        //console.log(ladoIzqRestriccion);
        lagrange = lagrange + operator+ 'lambda' + i+ '*' +Parser.parse(ladoIzqRestriccion[i-1])
        lagrangeExpr = Parser.parse(lagrange)

        variables = lagrangeExpr.variables()
        
        
        
    });
    
    variables.forEach(vari =>{
        console.log(vari);
        //ACA DEBERIAMOS HACER LA LLAMADA PARA DERIVAR


        
    })
    return lagrange
}

console.log(lagrangeMul("2*x^2",["3*x=12"],"max"))

