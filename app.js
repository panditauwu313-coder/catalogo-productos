import { db, collection, addDoc, doc, onSnapshot, runTransaction } from "./firebase.js";

let carrito = [];
let productosGlobal = [];
let categoriaActiva = "todos";

const productosRef = collection(db, "productos");
const categoriasRef = collection(db, "categorias");

const $ = id => document.getElementById(id);
const escapeHTML = s => String(s ?? "").replace(/[&<>"']/g, c => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));

const PLACEHOLDER_ICON = `<span class="ph-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></span>`;

const imgTag = (src, alt) => src
  ? `<img src="${escapeHTML(src)}" alt="${escapeHTML(alt)}" loading="lazy">`
  : PLACEHOLDER_ICON;

// CATEGORÍAS
onSnapshot(categoriasRef, snap => {
  let chips = `<button class="chip ${categoriaActiva === "todos" ? "active" : ""}" data-cat="todos">Todas</button>`;

  snap.forEach(docu => {
    const nombre = docu.data().nombre;
    chips += `<button class="chip ${categoriaActiva === nombre ? "active" : ""}" data-cat="${escapeHTML(nombre)}">${escapeHTML(nombre)}</button>`;
  });

  $("filtros").innerHTML = chips;

  document.querySelectorAll("#filtros .chip").forEach(chip => {
    chip.addEventListener("click", () => {
      categoriaActiva = chip.dataset.cat;
      document.querySelectorAll("#filtros .chip").forEach(c => c.classList.toggle("active", c === chip));
      mostrarProductos();
    });
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
  const cont = $("productos");
  const busqueda = $("busqueda")?.value?.toLowerCase().trim() || "";

  const visibles = productosGlobal.filter(p =>
    p.disponible !== false &&
    (categoriaActiva === "todos" || p.categoria === categoriaActiva) &&
    p.nombre.toLowerCase().includes(busqueda)
  );

  if (visibles.length === 0) {
    cont.innerHTML = `<p class="empty">No hay productos que coincidan.</p>`;
    return;
  }

  cont.innerHTML = visibles.map(p => `
    <article class="card">
      <div class="card-img ${p.imagen ? "" : "placeholder"}">${imgTag(p.imagen, p.nombre)}</div>
      <div class="card-body">
        <h3 class="card-name">${escapeHTML(p.nombre)}</h3>
        <p class="card-price">$${p.precio}</p>
        <p class="card-stock ${p.stock <= 0 ? "out" : ""}">${p.stock > 0 ? `Stock: ${p.stock}` : "Agotado"}</p>
        <button class="btn btn-primary" onclick="agregar('${p.id}')" ${p.stock <= 0 ? "disabled" : ""}>Agregar</button>
      </div>
    </article>
  `).join("");
}

// EVENTOS UI
$("busqueda").addEventListener("input", mostrarProductos);
$("cartBtn").addEventListener("click", abrirCarrito);
$("closeCart").addEventListener("click", cerrarCarrito);
$("overlay").addEventListener("click", cerrarCarrito);

function abrirCarrito() {
  $("drawer").classList.add("open");
  $("overlay").classList.add("open");
  $("drawer").setAttribute("aria-hidden", "false");
}

function cerrarCarrito() {
  $("drawer").classList.remove("open");
  $("overlay").classList.remove("open");
  $("drawer").setAttribute("aria-hidden", "true");
}

// CARRITO
window.agregar = (id) => {
  const producto = productosGlobal.find(p => p.id === id);
  if (!producto || producto.stock <= 0) return;

  const existente = carrito.find(i => i.id === id);
  if (existente) {
    if (existente.qty >= producto.stock) return;
    existente.qty++;
  } else {
    carrito.push({ ...producto, qty: 1 });
  }

  mostrarCarrito();
};

window.cambiarCantidad = (id, delta) => {
  const item = carrito.find(i => i.id === id);
  const producto = productosGlobal.find(p => p.id === id);
  if (!item || !producto) return;

  item.qty += delta;
  if (item.qty <= 0) {
    carrito = carrito.filter(i => i.id !== id);
  } else if (item.qty > producto.stock) {
    item.qty = producto.stock;
  }

  mostrarCarrito();
};

function mostrarCarrito() {
  const lista = $("listaCarrito");
  const total = carrito.reduce((acc, i) => acc + i.precio * i.qty, 0);
  const cantidad = carrito.reduce((acc, i) => acc + i.qty, 0);

  $("total").innerText = total;

  const badge = $("cartBadge");
  badge.innerText = cantidad;
  badge.classList.toggle("hidden", cantidad === 0);

  if (carrito.length === 0) {
    lista.innerHTML = `<p class="empty">Tu carrito está vacío.</p>`;
    return;
  }

  lista.innerHTML = carrito.map(i => `
    <div class="cart-item">
      <div class="cart-item-img ${i.imagen ? "" : "placeholder"}">${imgTag(i.imagen, i.nombre)}</div>
      <div class="cart-item-info">
        <p class="cart-item-name">${escapeHTML(i.nombre)}</p>
        <p class="cart-item-price">$${i.precio}</p>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="cambiarCantidad('${i.id}', -1)">&minus;</button>
        <span>${i.qty}</span>
        <button class="qty-btn" onclick="cambiarCantidad('${i.id}', 1)">+</button>
      </div>
    </div>
  `).join("");
}

// HACER PEDIDO
window.hacerPedido = async () => {
  if (carrito.length === 0) return;

  const btn = $("btnPedido");
  btn.disabled = true;
  btn.innerText = "Procesando...";

  try {
    const total = carrito.reduce((acc, i) => acc + i.precio * i.qty, 0);

    // 1) Descontar stock (atómico, sin negativos)
    for (const item of carrito) {
      const ref = doc(db, "productos", item.id);
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) return;
        const actual = Number(snap.data().stock) || 0;
        tx.update(ref, { stock: Math.max(actual - item.qty, 0) });
      });
    }

    // 2) Guardar el pedido
    await addDoc(collection(db, "pedidos"), {
      productos: carrito,
      total,
      fecha: new Date()
    });

    // 3) Abrir WhatsApp
    const detalle = carrito.map(i => `${i.nombre} x${i.qty} ($${i.precio})`).join("\n");
    const mensaje = `Pedido:\n${detalle}\nTotal: $${total}`;
    const numero = "529932775108";
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`);

    carrito = [];
    mostrarCarrito();
    cerrarCarrito();
  } catch (err) {
    alert(`No se pudo completar el pedido:\n${err.message || err}`);
  } finally {
    btn.disabled = false;
    btn.innerText = "Hacer pedido";
  }
};
