import { db } from "./firebase.js";

let carrito = [];

const productosRef = db.collection("productos");

// 🔥 TIEMPO REAL
productosRef.onSnapshot((snapshot) => {
  let productos = [];

  snapshot.forEach(docu => {
    productos.push({ id: docu.id, ...docu.data() });
  });

  mostrarProductos(productos);
});

// 🔥 MOSTRAR PRODUCTOS
function mostrarProductos(productos) {
  let contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  let busqueda = document.getElementById("busqueda").value.toLowerCase();
  let categoria = document.getElementById("categoria").value;

  productos.forEach(p => {
    if (
      p.nombre.toLowerCase().includes(busqueda) &&
      (categoria === "todos" || p.categoria === categoria)
    ) {
      contenedor.innerHTML += `
      <div class="card">
        <img src="${p.imagen}">
        <h3>${p.nombre}</h3>
        <p>$${p.precio}</p>
        <p>Stock: ${p.stock}</p>
        <button onclick="agregarCarrito('${p.id}', ${p.stock})">Pedir</button>
      </div>`;
    }
  });
}

// 🔥 AGREGAR AL CARRITO
window.agregarCarrito = async (id, stock) => {
  if (stock <= 0) {
    alert("Sin stock");
    return;
  }

  await db.collection("productos").doc(id).update({
    stock: stock - 1
  });

  carrito.push({ id });

  mostrarCarrito();
};

// 🔥 MOSTRAR CARRITO
function mostrarCarrito() {
  let lista = document.getElementById("listaCarrito");
  let total = 0;
  lista.innerHTML = "";

  carrito.forEach(p => {
    lista.innerHTML += `<p>Producto ID: ${p.id}</p>`;
  });

  document.getElementById("total").innerText = total;
}

// 🔥 HACER PEDIDO
window.hacerPedido = async () => {
  let mensaje = "Pedido:\n";

  carrito.forEach(p => {
    mensaje += `Producto ID: ${p.id}\n`;
  });

  let numero = "9932775108";
  let url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");

  await db.collection("pedidos").add({
    carrito,
    fecha: new Date()
  });

  carrito = [];
  mostrarCarrito();
};

// 🔥 FILTROS
document.getElementById("busqueda").addEventListener("input", () => {
  productosRef.get().then(snapshot => {
    let productos = [];
    snapshot.forEach(docu => {
      productos.push({ id: docu.id, ...docu.data() });
    });
    mostrarProductos(productos);
  });
});

document.getElementById("categoria").addEventListener("change", () => {
  productosRef.get().then(snapshot => {
    let productos = [];
    snapshot.forEach(docu => {
      productos.push({ id: docu.id, ...docu.data() });
    });
    mostrarProductos(productos);
  });
});