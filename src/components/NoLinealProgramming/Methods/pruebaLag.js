const {lagrangeMul} = require('./lagrangeMul')

var objeto = {}
var ultimo = lagrangeMul("x1^2+x2^2+x3^2",["4*x1 +x2^2 + 2*x3 - 14=0"],"min")

//console.log(ultimo)
ultimo.then(resultadoADevolver => {console.log(resultadoADevolver)})