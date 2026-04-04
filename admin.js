import { db } from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const lista = document.getElementById("listaProductos");

// 🔥 AGREGAR PRODUCTO
window.agregarProducto = async function () {
  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const stock = document.getElementById("stock").value;
  const imagen = document.getElementById("imagen").value;

  if (!nombre || !precio || !stock || !imagen) {
    alert("Completa todo");
    return;
  }

  try {
    await addDoc(collection(db, "productos"), {
      nombre,
      precio: Number(precio),
      stock: Number(stock),
      imagen
    });

    alert("Producto agregado");

    // limpiar inputs
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("imagen").value = "";

    cargarProductos();

  } catch (error) {
    console.error(error);
    alert("Error al guardar producto");
  }
};

// 🔥 MOSTRAR PRODUCTOS EN ADMIN
async function cargarProductos() {
  const querySnapshot = await getDocs(collection(db, "productos"));

  lista.innerHTML = "";

  querySnapshot.forEach((docu) => {
    const p = docu.data();

    lista.innerHTML += `
      <div style="border:1px solid #ccc; padding:10px; margin:10px;">
        <h3>${p.nombre}</h3>
        <p>$${p.precio}</p>
        <p>Stock: ${p.stock}</p>
        <img src="${p.imagen}" width="80"><br><br>
        <button onclick="eliminarProducto('${docu.id}')">Eliminar</button>
      </div>
    `;
  });
}

// 🔥 ELIMINAR PRODUCTO
window.eliminarProducto = async function (id) {
  await deleteDoc(doc(db, "productos", id));
  cargarProductos();
};

// 🔥 CARGAR AL INICIO
cargarProductos();