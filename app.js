// Inicializar Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD8Q5INY_EfTlyKp_vlnJZP9xWeqH_QhBg",
  authDomain: "catalogo-farid.firebaseapp.com",
  projectId: "catalogo-farid",
  storageBucket: "catalogo-farid.appspot.com",
  messagingSenderId: "603623739227",
  appId: "1:603623739227:web:9367d301443e5978a1147e"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let carrito = [];

// Esperar a que cargue el DOM
document.addEventListener("DOMContentLoaded", () => {

  const productosRef = db.collection("productos");

  // Mostrar productos en tiempo real
  productosRef.onSnapshot((snapshot) => {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    const busqueda = document.getElementById("busqueda").value.toLowerCase();
    const categoria = document.getElementById("categoria").value;

    snapshot.forEach(docu => {
      const p = docu.data();
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
          <button onclick="agregarCarrito('${docu.id}', ${p.stock})">Pedir</button>
        </div>`;
      }
    });
  });

  // Filtrado al escribir o cambiar categoría
  document.getElementById("busqueda").addEventListener("input", () => {
    productosRef.get().then(snapshot => {
      mostrarProductos(snapshot);
    });
  });

  document.getElementById("categoria").addEventListener("change", () => {
    productosRef.get().then(snapshot => {
      mostrarProductos(snapshot);
    });
  });
});

// Funciones del carrito
function mostrarProductos(snapshot) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";
  const busqueda = document.getElementById("busqueda").value.toLowerCase();
  const categoria = document.getElementById("categoria").value;

  snapshot.forEach(docu => {
    const p = docu.data();
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
        <button onclick="agregarCarrito('${docu.id}', ${p.stock})">Pedir</button>
      </div>`;
    }
  });
}

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

function mostrarCarrito() {
  const lista = document.getElementById("listaCarrito");
  lista.innerHTML = "";
  carrito.forEach(p => {
    lista.innerHTML += `<p>Producto ID: ${p.id}</p>`;
  });
  document.getElementById("total").innerText = carrito.length;
}

window.hacerPedido = async () => {
  let mensaje = "Pedido:\n";
  carrito.forEach(p => {
    mensaje += `Producto ID: ${p.id}\n`;
  });

  const numero = "9932775108";
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");

  await db.collection("pedidos").add({
    carrito,
    fecha: new Date()
  });

  carrito = [];
  mostrarCarrito();
};