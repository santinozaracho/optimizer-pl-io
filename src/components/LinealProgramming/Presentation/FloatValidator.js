const esFlotante = (n)=>{
    return Number(n) === n && n % 1 !== 0;
}

const pasarAFraccion = n => {
    var inicial = n.toString() 
    // console.log('inicial: '+inicial)
    var partes = (inicial).split("e");
    // console.log('partes')

    var longitud = 0;
    
    if( partes[0].includes('.')){
        longitud = (partes[0].split('.')[1]).length;
    }
    
    var numerador = Number(partes[0].replace('.',''));
    var denominador= Math.pow(10,(-1*(Number(partes[1])-longitud)))

    return [ numerador, denominador ] // <-- esto es un arreglo
}

export { esFlotante,  pasarAFraccion}