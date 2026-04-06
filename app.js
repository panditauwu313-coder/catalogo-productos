import { db, collection, addDoc, updateDoc, doc, onSnapshot } from "./firebase.js";

let carrito = [];
let productosGlobal = [];

const productosRef = collection(db, "productos");
const categoriasRef = collection(db, "categorias");

// CATEGORÍAS DINÁMICAS
onSnapshot(categoriasRef, snap => {
  let select = document.getElementById("categoria");
  select.innerHTML = `<option value="todos">Todas</option>`;

  snap.forEach(docu => {
    select.innerHTML += `<option value="${docu.data().nombre}">${docu.data().nombre}</option>`;
  });
});

// PRODUCTOS
onSnapshot(productosRef, snap => {
  productosGlobal = [];
  snap.forEach(docu => {
    productosGlobal.push({ id: docu.id, ...docu.data() });
  });
  mostrarProductos();
});

function mostrarProductos() {
  let cont = document.getElementById("productos");
  cont.innerHTML = "";

  let filtro = document.getElementById("categoria").value;

  productosGlobal.forEach(p => {
    if (filtro === "todos" || p.categoria === filtro) {
      cont.innerHTML += `
      <div class="card">
        <img src="${p.imagen}">
        <h3>${p.nombre}</h3>
        <p>$${p.precio}</p>
        <p>Stock: ${p.stock}</p>
        <button onclick="agregar('${p.id}', ${p.stock})">Pedir</button>
      </div>`;
    }
  });
}

document.getElementById("categoria").addEventListener("change", mostrarProductos);

window.agregar = async (id, stock) => {
  if (stock <= 0) return alert("Sin stock");

  let producto = productosGlobal.find(p => p.id === id);

  carrito.push(producto);

  await updateDoc(doc(db, "productos", id), {
    stock: stock - 1
  });

  mostrarCarrito();
};

function mostrarCarrito() {
  let lista = document.getElementById("listaCarrito");
  let total = 0;

  lista.innerHTML = "";

  carrito.forEach(p => {
    lista.innerHTML += `<p>${p.nombre} - $${p.precio}</p>`;
    total += p.precio;
  });

  document.getElementById("total").innerText = total;
}

window.hacerPedido = async () => {
  let total = document.getElementById("total").innerText;

  let detalle = carrito.map(p => `${p.nombre} ($${p.precio})`).join("\n");

  let mensaje = `Pedido:\n${detalle}\nTotal: $${total}`;

  let numero = "521XXXXXXXXXX";
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`);

  await addDoc(collection(db, "pedidos"), {
    productos: carrito,
    total,
    fecha: new Date()
  });

  carrito = [];
  mostrarCarrito();
};