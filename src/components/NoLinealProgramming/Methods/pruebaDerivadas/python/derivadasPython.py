import sympy
from flask import Flask
from sympy import Symbol
from sympy import nsolve
from sympy import nonlinsolve
app = Flask(__name__)
@app.route('/')
def resolverSistemaNL(ecuations,variables):
    #variablesEcuacion = []
    #for variable in variables:
    arregloExpresiones = []
    arregloIncognitas = []

    if (len(variables)>4):
        print("Cantidad de incognitas invalida")
        return 
    

    for i in range(0,len(variables)):
        variables[i] = Symbol(variables[i])
        print(variables[i])
    print(variables)  
    for ecuation in ecuations:
        arregloExpresiones.append(sympy.sympify(ecuation))
    
    result = nonlinsolve(arregloExpresiones,variables)
    arregloSalida = [str(result.args[0][i]) for i in range(0,len(arregloExpresiones))]
    #print(arregloSalida)
    return arregloSalida
#x = Symbol('x')
#y = Symbol('y')
#expr1=sympy.sympify(s1)
#expr2=sympy.sympify(s2)

#s1="x * y"
#s2="x*2 + y*2 - 17"
ecuations = ["1-2*x","z-2*y","2 +y -2*z"]
variables = ["x","y","z"]
result = resolverSistemaNL(ecuations,variables)
print(result)

