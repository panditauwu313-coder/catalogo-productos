import { db, collection, addDoc, getDocs, updateDoc, doc, onSnapshot } from "./firebase.js";

// 🔥 Carrito
let carrito = [];

// 🔥 Referencia a Firebase
const productosRef = collection(db, "productos");

// 🔥 TIEMPO REAL
onSnapshot(productosRef, (snapshot) => {
  let productos = [];

  snapshot.forEach(docu => {
    productos.push({ id: docu.id, ...docu.data() });
  });

  mostrarProductos(productos);
});

// 🔥 MOSTRAR PRODUCTOS CON FILTROS
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

// 🔥 AGREGAR AL CARRITO (con Firebase)
window.agregarCarrito = async (id, stock) => {
  if (stock <= 0) {
    alert("Sin stock");
    return;
  }

  const ref = doc(db, "productos", id);

  await updateDoc(ref, {
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

// 🔥 HACER PEDIDO (WhatsApp + Firebase)
window.hacerPedido = async () => {
  let mensaje = "Pedido:\n";

  carrito.forEach(p => {
    mensaje += `Producto ID: ${p.id}\n`;
  });

  let numero = "9932775108"; // CAMBIA ESTO
  let url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");

  // 🔥 Guardar pedido en Firebase
  await addDoc(collection(db, "pedidos"), {
    carrito,
    fecha: new Date()
  });

  carrito = [];
  mostrarCarrito();
};

// 🔥 EVENTOS FILTROS
document.getElementById("busqueda").addEventListener("input", () => {
  getDocs(productosRef).then(snapshot => {
    let productos = [];
    snapshot.forEach(docu => {
      productos.push({ id: docu.id, ...docu.data() });
    });
    mostrarProductos(productos);
  });
});

document.getElementById("categoria").addEventListener("change", () => {
  getDocs(productosRef).then(snapshot => {
    let productos = [];
    snapshot.forEach(docu => {
      productos.push({ id: docu.id, ...docu.data() });
    });
    mostrarProductos(productos);
  });
});