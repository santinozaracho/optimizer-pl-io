const {lagrangeMul} = require('./lagrangeMul')

var objeto = {}
var ultimo = lagrangeMul("-(x1)^2-(x2)^2-(x3)^2+4*x1+8*x2+16*x3",["x1+x2+x3-2=0","x1+2*x2=0"],"max")


console.log(ultimo)