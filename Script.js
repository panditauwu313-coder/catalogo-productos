// 🔥 IMPORTS FIREBASE
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// 🔥 VARIABLES
let precioActual = 0;
const contenedor = document.getElementById("productos");

// 🔥 CARGAR PRODUCTOS DESDE FIREBASE
async function cargarProductos() {
  contenedor.innerHTML = "<p>Cargando...</p>";

  const querySnapshot = await getDocs(collection(db, "productos"));

  contenedor.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const producto = doc.data();

    contenedor.innerHTML += `
      <div class="product-card">
        <img src="https://via.placeholder.com/150">
        <h2>${producto.nombre}</h2>
        <p class="price">$${producto.precio}</p>
        <button onclick="abrirFormulario('${producto.nombre}', ${producto.precio})">
          Pedir
        </button>
      </div>
    `;
  });
}

cargarProductos();

// 🔥 FORMULARIO
window.abrirFormulario = function(producto, precio) {
  document.getElementById("formPopup").style.display = "flex";

  document.getElementById("producto").value = producto;
  document.getElementById("cantidad").value = 1;

  precioActual = precio;

  actualizarTotal();
};

window.cerrarFormulario = function() {
  document.getElementById("formPopup").style.display = "none";
};

function actualizarTotal() {
  const cantidad = document.getElementById("cantidad").value;
  const total = cantidad * precioActual;

  document.getElementById("total").textContent = "Total: $" + total;
}

document.getElementById("cantidad").addEventListener("input", actualizarTotal);

// 🔥 ENVÍO A WHATSAPP (ESTO ES LO QUE TE FALTABA INTEGRAR BIEN)
document.getElementById("pedidoForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombreCliente").value;
  const producto = document.getElementById("producto").value;
  const cantidad = document.getElementById("cantidad").value;
  const notas = document.getElementById("notas").value;

  const total = cantidad * precioActual;

  const mensaje = `🛒 Pedido nuevo:

Nombre: ${nombre}
Producto: ${producto}
Precio: $${precioActual}
Cantidad: ${cantidad}
Total: $${total}
Notas: ${notas}`;

  // ⚠️ IMPORTANTE: SIN espacios
  const numero = "9932775108";

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");

  cerrarFormulario();
  this.reset();
});

// cerrar si da click fuera
window.onclick = function(e) {
  const popup = document.getElementById("formPopup");
  if (e.target === popup) {
    cerrarFormulario();
  }
};