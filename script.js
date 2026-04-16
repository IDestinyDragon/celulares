const celularesData = [
    { id: 1, nombre: "Samsung Galaxy S25 Ultra", precio: 29000.00, img: "imagenes/Samsung Galaxy S25 Ultra.jpg", cpu: "Snapdragon 8 Gen 3", ram: "12GB", bat: "5000mAh" },
    { id: 2, nombre: "iPhone 17 de 256 GB", precio: 18000.00, img: "imagenes/iPhone 17 de 256 GB.jpg", cpu: "Apple A18", ram: "8GB", bat: "4422mAh" },
    { id: 3, nombre: "OnePlus 11", precio: 18000.00, img: "imagenes/OnePlus 11.jpg", cpu: "Snapdragon 8 Gen 2", ram: "16GB", bat: "5000mAh" },
    { id: 4, nombre: "Oppo Find X6 Pro", precio: 24000.00, img: "imagenes/Oppo Find X6 Pro.jpg", cpu: "Dimensity 9200", ram: "12GB", bat: "5000mAh" },
    { id: 5, nombre: "Tablet Pro 10", precio: 15000.00, img: "imagenes/Tablet Pro 10.jpg", cpu: "Octa-core 2.4GHz", ram: "6GB", bat: "8000mAh" },
    { id: 6, nombre: "Audífonos SoundMax", precio: 4500.00, img: "imagenes/Audifonos SoundMax.jpg", cpu: "H1 Chip", ram: "N/A", bat: "20h" },
    { id: 7, nombre: "Samsung Galaxy A55", precio: 12000.00, img: "imagenes/Samsung Galaxy A55.jpg", cpu: "Exynos 1480", ram: "8GB", bat: "5000mAh" },
    { id: 8, nombre: "iPhone 17 Pro", precio: 22000.00, img: "imagenes/iPhone 17 Pro.jpg", cpu: "Apple A18 Pro", ram: "8GB", bat: "4852mAh" },
    { id: 9, nombre: "Xiaomi 14", precio: 16000.00, img: "imagenes/Xiaomi 14.jpg", cpu: "Snapdragon 8 Gen 3", ram: "12GB", bat: "4610mAh" },
    { id: 10, nombre: "Google Pixel 9", precio: 19000.00, img: "imagenes/Google Pixel 9.jpg", cpu: "Tensor G4", ram: "12GB", bat: "4700mAh" },
];


let usuarios = [];
let usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo')) || null;
let carrito = usuarioActivo ? (usuarioActivo.carrito || []) : [];

const formatoMoneda = (valor) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);


async function cargarDatos() {
    try {
        const res = await fetch('usuarios.json');
        const desdeArchivo = await res.json();
        const desdeLocal = JSON.parse(localStorage.getItem('usuarios')) || [];

        usuarios = [...desdeArchivo, ...desdeLocal].filter((v, i, a) => a.findIndex(t => (t.email === v.email)) === i);
    } catch (e) {
        console.warn("Error cargando usuarios.json, usando solo LocalStorage");
        usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    }
}


if (document.getElementById('login-form')) {
    const form = document.getElementById('login-form');
    const toggle = document.getElementById('toggle-registro');
    let esRegistro = false;

    toggle.onclick = () => {
        esRegistro = !esRegistro;
        document.getElementById('login-title').textContent = esRegistro ? "Crear Cuenta" : "Iniciar Sesión";
        toggle.textContent = esRegistro ? "Ya tengo cuenta" : "¿No tienes cuenta? Regístrate aquí";
    };

    form.onsubmit = async (e) => {
        e.preventDefault();

        if (usuarios.length === 0) await cargarDatos();

        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;
        const user = usuarios.find(u => u.email === email && u.pass === pass);

        if (esRegistro) {
            if (usuarios.find(u => u.email === email)) return alert("El usuario ya existe");
            const nuevoUsuario = { email, pass, rol: "cliente", carrito: [], pedidos: [] };
            usuarios.push(nuevoUsuario);

            const registradosLocales = JSON.parse(localStorage.getItem('usuarios')) || [];
            registradosLocales.push(nuevoUsuario);
            localStorage.setItem('usuarios', JSON.stringify(registradosLocales));

            alert("Cuenta creada.");
            location.reload();
        } else {
            if (user) {
                localStorage.setItem('usuarioActivo', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                alert("Correo o contraseña incorrectos");
            }
        }
    };
}

function cerrarSesion() {
    localStorage.removeItem('usuarioActivo');
    window.location.href = 'login.html';
}


function actualizarContador() {
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        contador.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    }
}

function guardarTodo() {
    if (usuarioActivo) {
        const index = usuarios.findIndex(u => u.email === usuarioActivo.email);
        if (index !== -1) {
            usuarios[index].carrito = carrito;
            usuarioActivo.carrito = carrito;
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));
        }
    }
    actualizarContador();
}

function agregarAlCarrito(id) {
    if (!usuarioActivo) {
        alert("Debes iniciar sesión para comprar");
        window.location.href = 'login.html';
        return;
    }
    const producto = celularesData.find(p => p.id === id);
    const existe = carrito.find(p => p.id === id);
    existe ? existe.cantidad++ : carrito.push({ ...producto, cantidad: 1 });
    guardarTodo();
    alert(`${producto.nombre} añadido.`);
}
const traducciones = {
    es: {
        pedidos: "Mis Pedidos",
        soporte: "Soporte",
        salir: "Salir",
        titulo: "Nuestros Celulares",
        btnDetalles: "Ver Detalles",
        btnAgregar: "Agregar al Carrito",
        procesador: "Procesador",
        ram: "Memoria RAM",
        bateria: "Batería",
        cerrar: "Cerrar",
        carritoVacio: "Carrito vacío",
        confirmarCompra: "¡Compra realizada con éxito!",
        soporteTitulo: "Centro de Soporte",
        faqTitulo: "Preguntas Frecuentes",
        faq1: "¿Cuál es el tiempo de entrega?",
        res1: "El tiempo estimado es de 3 a 5 días hábiles a nivel nacional.",
        faq2: "¿Los equipos tienen garantía?",
        res2: "Todos nuestros celulares cuentan con 1 año de garantía por defectos de fábrica.",
        contactoTitulo: "Contacto",
        politicasTitulo: "Nuestras Políticas",
        politicasTexto: "Consulta nuestros términos de devolución y tratamiento de datos personales en el documento PDF adjunto en tu factura.",
        historialTitulo: "Historial de Pedidos",
        carritoTitulo: "Tu Carrito",
        loginTitulo: "Iniciar Sesión",
        registroTitulo: "Crear Cuenta",
        emailLabel: "Correo Electrónico",
        passLabel: "Contraseña",
        btnEntrar: "Entrar",
        linkRegistro: "¿No tienes cuenta? Regístrate aquí",
        linkTengoCuenta: "Ya tengo cuenta"
    },
    en: {
        pedidos: "My Orders",
        soporte: "Support",
        salir: "Logout",
        titulo: "Our Phones",
        btnDetalles: "View Details",
        btnAgregar: "Add to Cart",
        procesador: "Processor",
        ram: "RAM Memory",
        bateria: "Battery",
        cerrar: "Close",
        carritoVacio: "Empty Cart",
        confirmarCompra: "Purchase successful!",
        soporteTitulo: "Support Center",
        faqTitulo: "Frequently Asked Questions",
        faq1: "What is the delivery time?",
        res1: "The estimated time is 3 to 5 business days nationwide.",
        faq2: "Do the devices have a warranty?",
        res2: "All our phones have a 1-year warranty for factory defects.",
        contactoTitulo: "Contact",
        politicasTitulo: "Our Policies",
        politicasTexto: "Check our return terms and personal data processing in the PDF document attached to your invoice.",
        historialTitulo: "Order History",
        carritoTitulo: "Your Cart",
        loginTitulo: "Login",
        registroTitulo: "Create Account",
        emailLabel: "Email Address",
        passLabel: "Password",
        btnEntrar: "Sign In",
        linkRegistro: "Don't have an account? Register here",
        linkTengoCuenta: "Already have an account"
    }
};

// 1. SOLUCIÓN IDIOMA: Se recupera de localStorage para persistencia entre páginas
let idiomaActual = localStorage.getItem('idioma') || 'es';

function cambiarIdioma() {
    idiomaActual = (idiomaActual === 'es') ? 'en' : 'es';
    localStorage.setItem('idioma', idiomaActual);
    aplicarTraducciones();
}

function aplicarTraducciones() {
    const t = traducciones[idiomaActual];

    const btnI = document.getElementById('btn-idioma');
    if (btnI) btnI.textContent = idiomaActual === 'es' ? 'EN' : 'ES';

    const mapaTextos = {
        'txt-pedidos': t.pedidos,
        'txt-soporte': t.soporte,
        'txt-salir': t.salir,
        'main-titulo': t.titulo,
        'soporteTitulo': t.soporteTitulo,
        'faqTitulo': t.faqTitulo,
        'faq1': t.faq1,
        'res1': t.res1,
        'faq2': t.faq2,
        'res2': t.res2,
        'contactoTitulo': t.contactoTitulo,
        'politicasTitulo': t.politicasTitulo,
        'politicasTexto': t.politicasTexto
    };

    for (const id in mapaTextos) {
        const elemento = document.getElementById(id);
        if (elemento) {
            const icono = elemento.querySelector('i');
            if (icono) {
                elemento.innerHTML = mapaTextos[id] + " " + icono.outerHTML;
            } else {
                elemento.textContent = mapaTextos[id];
            }
        }
    }

    if (document.getElementById('lista-celulares')) dibujarProductos();
    if (document.getElementById('contenido-carrito')) renderizarCarrito();
}

async function iniciarApp() {
    await cargarDatos();
    dibujarProductos();
    actualizarContador();
    aplicarTraducciones();
}

function dibujarProductos() {
    const contenedor = document.getElementById('lista-celulares');
    if (!contenedor) return;

    const t = traducciones[idiomaActual];

    contenedor.innerHTML = "";
    celularesData.forEach(prod => {
        const div = document.createElement('div');
        div.className = 'celular-item';
        div.innerHTML = `
            <img src="${prod.img}" alt="${prod.nombre}">
            <h3>${prod.nombre}</h3>
            <p>${formatoMoneda(prod.precio)}</p>
            <div style="display:flex; flex-direction:column; gap:5px;">
                <button class="btn-detalle" onclick="verDetalles(${prod.id})">${t.btnDetalles}</button>
                <button class="btn-agregar" onclick="agregarAlCarrito(${prod.id})">${t.btnAgregar}</button>
            </div>`;
        contenedor.appendChild(div);
    });
}
function verDetalles(id) {
    const p = celularesData.find(x => x.id === id);
    const t = traducciones[idiomaActual];
    const modal = `
        <div id="modal-overlay" onclick="this.remove()" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;justify-content:center;align-items:center;z-index:1000;">
            <div class="modal-content" onclick="event.stopPropagation()" style="background:white;padding:25px;border-radius:12px;max-width:400px;width:90%;">
                <h2 style="margin-top:0;">${p.nombre}</h2>
                <p><strong>${t.procesador}:</strong> ${p.cpu}</p>
                <p><strong>${t.ram}:</strong> ${p.ram}</p>
                <p><strong>${t.bateria}:</strong> ${p.bat}</p>
                <button onclick="document.getElementById('modal-overlay').remove()" style="width:100%;padding:10px;margin-top:10px;cursor:pointer;">${t.cerrar}</button>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', modal);
}

function renderizarCarrito() {
    const contenedor = document.getElementById('contenido-carrito');
    const totalContenedor = document.getElementById('total-carrito-contenedor');
    if (!contenedor) return;

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>Carrito vacío</p>";
        if(totalContenedor) totalContenedor.innerHTML = "";
        return;
    }

    let totalGlobal = 0;
    let html = `<table><tr><th>Producto</th><th>Cant.</th><th>Subtotal</th><th>Acción</th></tr>`;
    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        totalGlobal += subtotal;
        html += `<tr><td>${item.nombre}</td><td>${item.cantidad}</td><td>${formatoMoneda(subtotal)}</td>
                 <td><button class="btn-eliminar" onclick="eliminar(${index})">Eliminar</button></td></tr>`;
    });
    contenedor.innerHTML = html + `</table>`;

    if(totalContenedor) {
        const esAdmin = usuarioActivo && usuarioActivo.rol === "admin";
        totalContenedor.innerHTML = `
            <p style="font-size:1.5rem; font-weight:bold;">Total: ${formatoMoneda(totalGlobal)}</p>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                ${esAdmin ? `<button onclick="generarBackupLog()" class="btn-agregar" style="background: #3498db; width:auto; padding:10px 20px;">Descargar Log del Día</button>` : ''}
                <button onclick="finalizarCompra()" class="btn-agregar" style="background: #27ae60; width:auto; padding:10px 20px;">Finalizar Compra</button>
            </div>`;
    }
}

function eliminar(index) {
    carrito[index].cantidad > 1 ? carrito[index].cantidad-- : carrito.splice(index, 1);
    guardarTodo();
    renderizarCarrito();
}


function finalizarCompra() {
    if (carrito.length === 0) return;

    const t = traducciones[idiomaActual];


    const ticketCompra = {
        fecha: new Date().toLocaleString(),
        cliente: usuarioActivo.email,
        productos: carrito,
        total: carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)
    };


    const blob = new Blob([JSON.stringify(ticketCompra, null, 2)], { type: "application/json" });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Compra_${usuarioActivo.email}_${Date.now()}.json`;
    a.click();

    alert(t.confirmarCompra);
    carrito = [];
    guardarTodo();
    location.reload();
}

function generarBackupLog() {
    const hoy = new Date();
    const dataLog = {
        tienda: "TechStore",
        fecha: hoy.toLocaleDateString(),
        clientes: usuarios.length,
        totalVenta: carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)
    };
    const blob = new Blob([JSON.stringify(dataLog, null, 2)], { type: "application/json" });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `LOG_${hoy.getDate()}.json`;
    a.click();
}


async function iniciarApp() {
    await cargarDatos();
    dibujarProductos();
    actualizarContador();
    aplicarTraducciones();
    if (document.getElementById('contenido-carrito')) renderizarCarrito();
}

iniciarApp();