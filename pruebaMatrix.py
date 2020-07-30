from sympy import *
x=symbols('x')
M= Matrix([[1*x,2,3],[3,4,5],[1,4,3]])
print(M.det())
