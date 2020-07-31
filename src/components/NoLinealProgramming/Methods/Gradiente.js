const math = require("mathjs");

// Funcion que engloba todas las funciones
const funcionGradiente = (f,x0,e) => {
  var cont=0;
  const separaVariables = (x) => {
    const scope = x.map((xi, i) => {
      const name = `x${i + 1}`;
      return { [name]: xi };
    });
    
    const target = {};
    for (let i = 0; i < scope.length; i += 1) {
      Object.assign(target, scope[i]);
    }
    return target;
  };

  // Calcula la funcion para un valor de x
  const calculaFuncion = (f, x) => {
    return f.evaluate(separaVariables(x));
  };

  // deriva la funcion respecto de xi
  const derivadaParcial = (f, i) => {
    return math.derivative(f, `x${i}`);
  };

  // Indica la direccion en que se tiene que seguir para la proxima iteracion
  const calculaGradiente = (f, x) => x.map((xi, i) => derivadaParcial(f, i + 1));

  // Calcula el gradiente 
  const valorGradiente = (x, gradiente) => {
    const g = [];
    for (let i = 0; i < x.length; i += 1) {
      g.push(calculaFuncion(gradiente[i], x));
    }
    return g;
  };

  // Verifica que se cumpla la condicion de parada
  const criterioParada = (x, gradiente) => {
    const vlrG = valorGradiente(x, gradiente);
    return math.norm(vlrG);
  };

  const llamadoGradiente = ( f, x0, e ) => {
    // Define vetor gradiente
    if (e == 0){
      e = 0.1;
    }

    const gradiente = calculaGradiente(f, x0);

    
    return new Promise((resolve) => {
      const minimize = (f, e) => {
        let eps = e;
        if (e === undefined) eps = 1;
      
        const d1 = math.derivative(f, "x");
        const d2 = math.derivative(d1, "x");
      
        // Calcula el punto proximo
        const min = (k, x) => {
          
          if (k > 99) return x;
      
          const f1 = d1.evaluate({ x });
          const f2 = d2.evaluate({ x });
      
          if (math.abs(f1) < eps * 0.001) return x;
      
          // calcula el proximo Xi
          const xn = x - f1 / f2;
          
          // Indica si se cumple con la condicion de parada
          if (math.abs(xn - x) / math.max(math.abs(xn), 1) < eps * 0.001) {return xn};
      
          return min(k + 1, xn);
        };
      
        return min(0, 0);
      };

      const min = (k, x) => {
        let fP = f;

        // Define la direccion de busqueda
        const d = math.multiply(-1, valorGradiente(x, gradiente));

        // Substituye incognitas por xk+lambda*d
        for (let i = 0; i < x0.length; i += 1)
          fP = fP.replace(new RegExp(`x${i + 1}`, "g"), `(${x[i]}+x*${d[i]})`);

        // Encuentra el valor de lambda
        const lambda = minimize(fP);

        // Encuentra el nuevo valor de x
        // eslint-disable-next-line no-param-reassign
        x = math.add(x, math.multiply(lambda, d));

        if (k > 9999) return x; // Numero de interaciones alto
        if (criterioParada(x, gradiente) < e) return x; // Para CP < e
        return min(k + 1, x);
      };
      return resolve(
        `X* = (${min(0, x0)
          .map((xi) => xi.toFixed(4))
          .join(" ")}) ${cont}`
          
      );
    });
  };

  return llamadoGradiente(f,x0,e);
};

//funcionGradiente('(-x1)^2 - (x2+1)^2',[0,0],0.1).then((p) => { console.log(p.toString()) })

module.exports = funcionGradiente;

//funcionGradiente("(x1)^2 ",[0,0],0.1).then((p) => { console.log(p.toString()) });