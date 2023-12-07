const objetos =  [
    {
        manzanas:3,
        peras:2,
        carne:1,
        jugos:5,
        dulces:2
    },
    {
        manzanas:1,
        sandias:1,
        huevos:6,
        jugos:1,
        panes:4
    }
]

const products =[]
let total = 0

objetos.forEach((item)=>{
    const keys = Object.keys(item)
    const values = Object.values(item)
    keys.forEach((key)=>{
        if(!products.includes(key)){
            products.push(key)
        }
    })
    for (const value of values) {
       total +=value
    }

})

console.log(products)
console.log(total)