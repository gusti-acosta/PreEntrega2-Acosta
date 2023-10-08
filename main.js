
class Producto {
    constructor(id, nombre, precio, imagen, categoria) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.categoria = categoria;
    }
}

class BaseDeDatos{
    constructor(){
        this.productos = [];
        // Cargar productos
        this.registro(1, "Bicicletas Overtech Fortis Talle L negro rojo", "80.769", "/img/productos/producto1.jpg", "mas vendido");
        this.registro(2, "Mesa Picnic Plastica Portable 180cm Gardenlife", "15.000", "/img/productos/producto2.jpg", "oferta");
        this.registro(3, "ULTRAFLEX EN POLVO X 300 GRAMOS", "9.498", "/img/productos/producto3.jpg", "nuevo");
        this.registro(4, "Celular Samsung Galaxy A04 64/4GB Negro", "56.999,00", "/img/productos/producto4.jpg", "destacado");
        this.registro(5, "Disco Rigido Externo 1tb Seagate Usb 3.0 Portatil", "38.719", "/img/productos/producto5.jpg", "nuevo");
        this.registro(6, "Aire Split Bgh 3450w Frio Calor Bs35wccr", "259.999", "/img/productos/producto6.jpg", "destacado");
        this.registro(7, "Café Nescafé Dolca Suave", "1.799", "/img/ofertas/oferta1.jpg", "oferta");
        this.registro(8, "Polvo Exquisita Chocolatado 180 Gr", "375", "/img/ofertas/oferta2.jpg", "oferta");
        this.registro(9, "Yerba Mate Amanda Suave 500 Gr", "649", "/img/ofertas/oferta3.jpg", "oferta");
        this.registro(10, "Cápsula La Morenita Colombia 52 Gr", "1.199", "/img/ofertas/oferta4.jpg", "oferta");
        this.registro(11, "Azúcar Plus DIA Común tipo A 1 Kg.", "549", "/img/ofertas/oferta5.jpg", "oferta");
        this.registro(12, "Mate Cocido DIA en saquitos 50 Ud", "209", "/img/ofertas/oferta6.jpg", "oferta");
    }

    registro(id, nombre, precio, imagen, categoria) {
        const producto = new Producto(id, nombre, precio, imagen, categoria);
        this.productos.push(producto);
    }
    traerRegistros(){
        return this.productos;
    }
    // Devuelve todo el catalogo de productos por id
    registroPorId(id) {
        return this.productos.find((producto) => producto.id === id);
    } 
    registroPorNombre(palabra) {
        return this.productos.filter((producto) =>
            producto.nombre.toLowerCase().includes(palabra.toLowerCase())
        );
    }
}

class Carrito {
    constructor(){
        const carritoStorage = JSON.parse(localStorage.getItem("carrito"))
        this.carrito = carritoStorage || [];
        this.totalCarrito = 0;
        this.cantidadProductos = 0;
        this.listar();
    }
    estaEnCarrito({id}){
        return this.carrito.find((producto) => producto.id === id)
    }
    agregar(producto){
        // devuelve undefine si el producto no esta en el carrito
        //   |
        //   |
        const productoEnCarrito = this.estaEnCarrito(producto)
        if (!productoEnCarrito){
            this.carrito.push({...producto, cantidad: 1})
        }else {
            productoEnCarrito.cantidad++;
        }
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
        this.listar();
    }
    quitar(id){
        const indice = this.carrito.findIndex((producto) => producto.id === id);
        if(this.carrito[indice].cantidad > 1){
            this.carrito[indice].cantidad--;
        }else {
           this.carrito.splice(indice, 1); 
        }
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
        this.listar()
    }
    listar(){
        this.total = 0;
        this.cantidadProductos = 0;
        divCarrito.innerHTML = "";

        for (const producto of this.carrito){
            divCarrito.innerHTML += `
                <div class"productoCarrito">
                    <h2>${producto.nombre}</h2>
                    <p>$${producto.precio}</p>
                    <p>Cantidad: ${producto.cantidad}</p>
                    <a href="#" class="btnQuitar" data-id="${producto.id}">Quitar del carrito</a>
                </div>
            `;
            this.total += producto.precio * producto.cantidad;
            this.cantidadProductos += producto.cantidad
        }
        const botonesQuitar = document.querySelectorAll(".btnQuitar")
        for (const boton of botonesQuitar){
            boton.addEventListener("click", (event) => {
                event.preventDefault();
                const idProducto = parseInt(boton.dataset.id)
                this.quitar(idProducto);
            })
        }
        spanCantidadProdecutos.innerText = this.cantidadProductos;
        spanTotalCarrito.innerText = this.total;

    }
}
const BaseDatos = new BaseDeDatos();

// elementos
const spanCantidadProdecutos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const divProductos = document.querySelector(".productos");
const divCarrito = document.querySelector("#Carrito");
const inputBuscar = document.querySelector("#inputBuscar");
const botonCarrito = document.querySelector(".ocultar h1");

const carrito = new Carrito();

cargarProductos(BaseDatos.traerRegistros());

function cargarProductos(productos) {
    divProductos.innerHTML = "";
    for (const producto of productos){
        divProductos.innerHTML += `
        <div class="producto">
            <img src=".${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <button class="btnAgregar" data-id="${producto.id}">Agregar al carrito</button>
        </div>
        `;
    }
    const botonesAgregar = document.querySelectorAll(".btnAgregar");

    for (const boton of botonesAgregar) {
        boton.addEventListener("click", (event) => {
            event.preventDefault();
            const idProducto = parseInt(boton.dataset.id);
            const producto = BaseDatos.registroPorId(idProducto);
            carrito.agregar(producto);
        });
    }

}

// buscador

inputBuscar.addEventListener("input", (event) => {
    event.preventDefault();
    const palabra = inputBuscar.value;
    const productos = BaseDatos.registroPorNombre(palabra)
    cargarProductos(productos);
});

botonCarrito.addEventListener("click", (event) => {
  document.querySelector(".ocultar").classList.toggle("ocultar");
});

