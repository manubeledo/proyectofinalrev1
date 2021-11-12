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
        const res = await fetch('../carritos.json');
        const datos = await res.json();
        console.log(datos);
        pintarCarrito(datos);
    } catch(err) {
        console.log(err)
    }
}

const pintarCarrito = datos => {
    console.log(datos);
    console.log(Object.values(datos));
    Object.values(datos).forEach(producto => {
        let tbody = document.createElement('tbody')
        tbody.innerHTML = `
          <tr id="card-carrito">
            <td id="id-prod">${producto.id}</td>
            <td id="id-timestamp-prod">4</td>
            <td id="id-nombre">${producto.title}</td>
            <td id="id-description">6</td>
            <td id="id-codigo">7</td>
            <td id="id-foto">8</td>
            <td id="id-preciototal">9</td>
            <td id="id-cantidad">10</td>
            <td id="status">11</td>
            <td id="status">11</td>
            <td id="status">11</td>
          </tr>`
        
        templateCarrito.appendChild(tbody)
        })
}



