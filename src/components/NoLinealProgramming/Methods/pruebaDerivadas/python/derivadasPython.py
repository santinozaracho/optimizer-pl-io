import math
import scipy.optimize as opt
import compiler
from scitools.StringFunction import StringFunction



def f(variables,functions=None):
    # This is the function that we want to make 0
    print(type(variables))
    # We take the unknowns
    (x,y,z) = variables
    
    
    #first_eq = x * y - 2 * y - 2**x
    #second_eq = math.log(x)-y-math.cos(x)
    first_eq = StringFunction("1 - 2*x")
    print(first_eq)
    second_eq = StringFunction("z**2 - 2*y")
    third_eq = StringFunction("2 + y - 2*z")
    return [first_eq,second_eq,third_eq]

if __name__=="__main__":
    # We just call opt passing the function and an initial value
    
    solution = opt.fsolve(f,(0,0,0)) 
    print("The solution is",solution)
