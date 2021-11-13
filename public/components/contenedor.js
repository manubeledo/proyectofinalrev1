class Contenedor {

    static id = 1;
    static productos = [];
    
    constructor(name, description, price, thumbnail, stock){
        this.name = name,
        this.description = description,
        this.price = price,
        this.thumbnail = thumbnail,
        this.stock = stock,
        this.id = Contenedor.id++
        Contenedor.productos.push(this)
    }
}

module.exports = Contenedor;