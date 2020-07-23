
const {metodoDerivadas} = require('./pruebaDerivadas');


describe("Ejercicio 1",()=>{
    test("Metodo de las derivadas para ejercicio 1",()=>{
        const incognitas = ['x','y'];
        expect(metodoDerivadas("(x-2)^2 + (y-3)^2 +5",incognitas)).toEqual([ 'minimo', 4, 2, 5 ]);
    })
})
describe("Ejercicio 2",()=>{
  test("Metodo de las derivadas para ejercicio 2",()=>{
      const incognitas = ['x','y'];
      expect(metodoDerivadas("x^2 + 3*y^2 -8*x -6*y +24",incognitas)).toEqual([ 'minimo', 12, 2, 5 ]);
  })
})
describe("Ejercicio 3",()=>{
  test("Metodo de las derivadas para ejercicio 3",()=>{
      const incognitas = ['x','y'];
      expect(metodoDerivadas("-(x-4)^2 -3*(y-2)^2 +24",incognitas)).toEqual([ 'maximo', 12, -2, 24 ]);
  })
})
describe("Ejercicio 4",()=>{
  test("Metodo de las derivadas para ejercicio 4",()=>{
      const incognitas = ['x','y'];
      expect(metodoDerivadas("-x^2 -(y+1)^2",incognitas)).toEqual(false);
  })
})