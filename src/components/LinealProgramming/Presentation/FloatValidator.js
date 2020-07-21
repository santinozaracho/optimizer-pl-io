const isFloat = (n)=>{
    return Number(n) === n && n % 1 !== 0;
}

// console.log(isFloat(10e-9))

module.exports = isFloat