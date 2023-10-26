class Producto {
  constructor(id, nombre, precio, imagen, categoria) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.imagen = imagen;
    this.categoria = categoria;
  }
}

class BaseDeDatos {
  constructor() {
    this.productos = [];
    this.cargarRegistros();
  }

  async cargarRegistros() {
    const resultado = await fetch("./json/productos.json");
    this.productos = await resultado.json();
    cargarProductos(this.productos);
  }

  traerRegistros() {
    return this.productos;
  }

  registroPorId(id) {
    return this.productos.find((producto) => producto.id === id);
  }

  registrosPorNombre(palabra) {
    return this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(palabra.toLowerCase())
    );
  }

  registrosPorCategoria(categoria) {
    return this.productos.filter((producto) => producto.categoria === categoria);
  }
}

class Carrito {
  constructor() {
    const carritoStorage = JSON.parse(localStorage.getItem("carrito")) ;
    this.carrito = carritoStorage || [];
    this.total = 0;
    this.cantidadProductos = 0;
    this.listar();
  }

  estaEnCarrito({ id }) {
    return this.carrito.find((producto) => producto.id === id);
  }

  agregar(producto) {
    const productoEnCarrito = this.estaEnCarrito(producto);
    if (!productoEnCarrito) {
      this.carrito.push({ ...producto, cantidad: 1 });
    } else {
      productoEnCarrito.cantidad++;
    }
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    this.listar();
  }

  quitar(id) {
    const indice = this.carrito.findIndex((producto) => producto.id === id);
    if (this.carrito[indice].cantidad > 1) {
      this.carrito[indice].cantidad--;
    } else {
      this.carrito.splice(indice, 1);
    }
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    this.listar();
  }

  vaciar() {
    this.total = 0;
    this.cantidadProductos = 0;
    this.carrito = [];
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    this.listar();
  }

  listar() {
    this.total = 0;
    this.cantidadProductos = 0;
    divCarrito.innerHTML = "";
    
    for (const producto of this.carrito) {
      divCarrito.innerHTML += `
        <div class="productoCarrito">
        <h2>${producto.nombre}</h2>
        <p>$${producto.precio}</p>
        <p>Cantidad: ${producto.cantidad}</p>
        <a href="#" class="btnQuitar" data-id="${producto.id}">Quitar del carrito</a>
      </div>
      `;
      this.total += producto.precio * producto.cantidad;
      this.cantidadProductos += producto.cantidad;
    }

    const botonesQuitar = document.querySelectorAll(".btnQuitar");

    for (const boton of botonesQuitar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();
        const idProducto = Number(boton.dataset.id);
        this.quitar(idProducto);
      });
    }
    // Actualizo los contadores del HTML
    spanCantidadProductos.innerText = this.cantidadProductos;
    spanTotalCarrito.innerText = this.total;
  }
}

const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const divProductos = document.querySelector(".productos");
const divCarrito = document.querySelector("#Carrito");
const inputBuscar = document.querySelector("#inputBuscar");
const botonCarrito = document.querySelector("section h1");
const botonesCategorias = document.querySelectorAll(".btnCategoria"); 
const botonComprar = document.querySelector("#botonComprar");

const bd = new BaseDeDatos();
const carrito = new Carrito();

botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", () => {
    const categoria = boton.dataset.categoria;
    // Quitar seleccionado anterior
    const botonSeleccionado = document.querySelector(".seleccionado");
    botonSeleccionado.classList.remove("seleccionado");
    // Se lo agrego a este botón
    boton.classList.add("seleccionado");
    if (categoria == "Todos") {
      cargarProductos(bd.traerRegistros());
    } else {
      cargarProductos(bd.registrosPorCategoria(categoria));
    }
  });
});

cargarProductos(bd.traerRegistros());

function cargarProductos(productos) {
  divProductos.innerHTML = "";
  for (const producto of productos) {
    divProductos.innerHTML += `
      <div class="producto">
        <img src=".${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>Precio: $${producto.precio}</p>
        <button class="btnAgregar" data-id="${producto.id}">Agregar al carrito</button>
      `;
  }

  const botonesAgregar = document.querySelectorAll(".btnAgregar");

  for (const boton of botonesAgregar) {
    boton.addEventListener("click", (event) => {
      event.preventDefault();
      const idProducto = Number(boton.dataset.id);
      const producto = bd.registroPorId(idProducto);
      carrito.agregar(producto);
      Toastify({
        text: `Se ha añadido ${producto.nombre} al carrito`,
        gravity: "bottom",
        position: "center",
        style: {
          background: "linear-gradient(to right, #d15280, #244ced)",
        },
      }).showToast();
    });
  }
}

inputBuscar.addEventListener("input", (event) => {
  event.preventDefault();
  const palabra = inputBuscar.value;
  const productos = bd.registrosPorNombre(palabra);
  cargarProductos(productos);
});

botonCarrito.addEventListener("click", (event) => {
  document.querySelector("section").classList.toggle("ocultar");
});

botonComprar.addEventListener("click", (event) => {
  event.preventDefault();

  Swal.fire({
    title: "¿Seguro que desea comprar los productos?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, gracias",
    cancelButtonText: "No, gracias",
  }).then((result) => {
    if (result.isConfirmed) {
      carrito.vaciar();
      Swal.fire({
        title: "¡LISTO!",
        icon: "success",
        text: "Su compra ha sido realizada.",
        timer: 1500,
      });
    }
  });
});
// Obtén una referencia al elemento de anclaje por su ID