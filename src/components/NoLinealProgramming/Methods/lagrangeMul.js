var Parser = require('expr-eval').Parser
var parser = new Parser()

//f is the function, g is an array of constraints
const lagrangeMul =(f,g, objective) => {
    var nConstraints= g.length


    //first, we create the lagrangian 
    lagrange = f
    operator = objective === "max" ? '-' : '+'
    i=1
    g.forEach(element => {
        
        lagrange = lagrange + operator+ 'L' + i+ '*' +Parser.parse(element)

    });
    console.log(typeof lagrange)

    return lagrange.toString()
}

console.log(lagrangeMul("2*x^2",["3*x"],"max"))
