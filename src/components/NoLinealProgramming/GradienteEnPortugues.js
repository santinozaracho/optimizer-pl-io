const { create, all } = require("mathjs");

const math = create(all);

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

const calculaFuncion = (f, x) => {
  return f.evaluate(separaVariables(x));
};

const derivadaParcial = (f, i) => {
  return math.derivative(f, `x${i}`);
};

const calculaGradiente = (f, x) => x.map((xi, i) => derivadaParcial(f, i + 1));

const valorGradiente = (x, gradiente) => {
  const g = [];
  for (let i = 0; i < x.length; i += 1) {
    g.push(calculaFuncion(gradiente[i], x));
  }
  return g;
};

const criterioParada = (x, gradiente) => {
  const vlrG = valorGradiente(x, gradiente);
  return math.norm(vlrG);
};

module.exports = function funcionGradiente({ f, x0, e, minimize }) {
  // Define vetor gradiente
  const gradiente = calculaGradiente(f, x0);

  return new Promise((resolve) => {
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
        .join(" ")})`
    );
  });
};
