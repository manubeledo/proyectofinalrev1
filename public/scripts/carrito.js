console.log("DESDE EL SCRIPT CARRITO")
const cardCarrito = document.getElementById('card-carrito')
const templateCarrito = document.getElementById('carrito')
const nombre = document.getElementById('id-carrito')
const fragment = document.createDocumentFragment()


document.addEventListener('DOMContentLoaded', () => { fetchData() });

// templateCarrito.addEventListener('click', e => {
//     console.log(e);
// })

const fetchData = async () => {
    try{
        console.log("desde el fetch")
        const res = await fetch('../database/buycarritos.json');
        const datos = await res.json();
        console.log(datos);
        pintarCarrito(datos);
    } catch(err) {
        console.log(err)
    }
}

const pintarCarrito = datos => {
    console.log(Object.values(datos).length);
    let i = 0;
    Object.values(datos).forEach( element => {
    console.log(element)
    i++
    let newDiv = document.createElement("div");
    newDiv.style = "border: 3px solid green; padding: 10px"
    let newContent = document.createTextNode(`${JSON.stringify(element)}`);
    newDiv.appendChild(newContent);

    let currentDiv = document.getElementById("div1");
    document.body.insertBefore(newDiv, currentDiv);

    })
}






