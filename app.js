import { db, collection, addDoc, updateDoc, doc, onSnapshot } from "./firebase.js";

let carrito = [];
let productosGlobal = [];

const productosRef = collection(db, "productos");
const categoriasRef = collection(db, "categorias");

// CATEGORÍAS
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

// MOSTRAR PRODUCTOS
function mostrarProductos() {
  let cont = document.getElementById("productos");
  cont.innerHTML = "";

  let filtro = document.getElementById("categoria").value;
  let busqueda = document.getElementById("busqueda")?.value?.toLowerCase() || "";

  productosGlobal.forEach(p => {
    if (
      (filtro === "todos" || p.categoria === filtro) &&
      p.nombre.toLowerCase().includes(busqueda)
    ) {
      cont.innerHTML += `
      <div class="card">
        <img src="${p.imagen}">
        <h3>${p.nombre}</h3>
        <p>$${p.precio}</p>
        <p>Stock: ${p.stock}</p>
        <button onclick="agregar('${p.id}')">Pedir</button>
      </div>`;
    }
  });
}

document.getElementById("categoria").addEventListener("change", mostrarProductos);

// BUSCADOR
const buscador = document.getElementById("busqueda");
if (buscador) {
  buscador.addEventListener("input", mostrarProductos);
}

// 👉 AGREGAR AL CARRITO (YA NO BAJA STOCK)
window.agregar = (id) => {
  let producto = productosGlobal.find(p => p.id === id);

  if (producto.stock <= 0) return alert("Sin stock");

  carrito.push(producto);
  mostrarCarrito();
};

// MOSTRAR CARRITO
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

// 👉 HACER PEDIDO (AQUÍ SÍ BAJA STOCK)
window.hacerPedido = async () => {
  if (carrito.length === 0) return alert("Carrito vacío");

  let total = document.getElementById("total").innerText;

  let detalle = carrito.map(p => `${p.nombre} ($${p.precio})`).join("\n");

  let nota = document.getElementById("nota")?.value || "Sin notas";

  let mensaje = `Pedido:\n${detalle}\nTotal: $${total}\nNotas: ${nota}`;

  let numero = "9932775108"; // TU NÚMERO
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`);

  // 🔥 DESCONTAR STOCK AQUÍ
  for (let item of carrito) {
    let ref = doc(db, "productos", item.id);

    let productoActual = productosGlobal.find(p => p.id === item.id);
    let nuevoStock = productoActual.stock - 1;

    if (nuevoStock < 0) nuevoStock = 0;

    await updateDoc(ref, { stock: nuevoStock });
  }

  // GUARDAR PEDIDO
 await addDoc(collection(db, "pedidos"), {
  productos: carrito,
  total,
  nota: nota,
  fecha: new Date()
});

  carrito = [];
  mostrarCarrito();
};