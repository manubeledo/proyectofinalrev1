const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}
let carritos = {}
let index = 1;

document.addEventListener('DOMContentLoaded', () => { fetchData() });
document.addEventListener('DOMContentLoaded', () => { carritosData() });

cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e)
})

const fetchData = async () => {
    try{
        const res = await fetch('../database/productos.txt');
        const data = await res.json();
        pintarCards(data);
    } catch(err) {
        console.log(err)
    }
}

const carritosData = async () => {
    try{
        const res = await fetch('../buycarritos.json');
        const data = await res.json();
    } catch(err) {
        console.log(err)
    }
}

// SE CREAN LAS CARDS //
const pintarCards = data => {
    data.forEach(producto => {
        templateCard.getElementById('card-name').textContent = producto.name
        templateCard.getElementById('card-description').textContent = producto.description
        templateCard.getElementById('card-price').textContent = producto.price
        templateCard.getElementById('card-stock').textContent = producto.stock
        templateCard.getElementById('card-img').src= producto.thumbnail
        templateCard.querySelector('.btn-dark').dataset.id = producto.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
    // console.log(e.target);
    // console.log(e.target.classList.contains('button'));
    if (e.target.classList.contains('button')) {
        createCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

// SE CREA EL CARRITO //

const createCarrito = async (objeto) => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('.header').textContent,
        precio: objeto.querySelector('.left').textContent,
        cantidad: 1,
        timestamp: Date.now(),
        codigo: ((Date.now)/100000),
        description: `una descripcion`,
        stock: 100
    }

    if(carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}

    console.log(carrito)
    
    await refreshCar()
    
    pintarCarrito()
}

// SE PINTA EL CARRITO //

const pintarCarrito = async () => {
    items.innerHTML = '';
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelectorAll('td')[2].textContent = producto.timestamp
        templateCarrito.querySelectorAll('td')[3].textContent = producto.description
        templateCarrito.querySelectorAll('td')[4].textContent = producto.stock
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    await refreshCar()
    pintarFooter()

}

// SE CREA EL FOOTER //

const pintarFooter = () => {
    footer.innerHTML = ''
    
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="8">Carrito vacío con innerHTML</th>
        `
        return
    }
    
    // SUMAR CANTIDAD Y SUMAR TOTALES
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })

    const buy = document.querySelector('#buy-carrito')
    
    buy.addEventListener('click', async () => {
        let id = index;
        let date = Date.now()
        datos = [id, date]
        carritos[datos] = carrito;
        console.log(carritos);
        index++
        carrito = {}
        await buyCarritos()
        pintarCarrito()
    })
}

// SE CREA LA ACCION DE LOS BOTONES PARA AUMENTAR Y DISMINUIR CANTIDAD//

const btnAccion = e => {
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        refreshCar()
        pintarCarrito()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
            refreshCar()
        } else {
            carrito[e.target.dataset.id] = {...producto}
            refreshCar()
        }
        pintarCarrito()
    }
    e.stopPropagation()
}

async function refreshCar(){
    await fetch("http://localhost:8080/api/carrito", {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(carrito), // data can be `string` or {object}!
        headers:{ 'Content-Type': 'application/json' }
      })
}

async function buyCarritos(){
    await fetch("http://localhost:8080/api/buycarritos", {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(carritos), // data can be `string` or {object}!
        headers:{ 'Content-Type': 'application/json' }
      })
}
