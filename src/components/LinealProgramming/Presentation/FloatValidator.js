exports.esFlotante = (n)=>{
    return Number(n) === n && n % 1 !== 0;
}

// console.log(esFlotante(10e-9))

// module.exports = esFlotante