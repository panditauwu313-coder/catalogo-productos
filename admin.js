window.agregarProducto = async function () {
  console.log("click detectado"); // 👈 aquí sí

  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;

  if (!nombre || !precio) {
    alert("Completa los campos");
    return;
  }

  await addDoc(collection(db, "productos"), {
    nombre: nombre,
    precio: Number(precio)
  });

  alert("Producto agregado");

  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
};