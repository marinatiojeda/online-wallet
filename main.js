// ==========================================
// 1. CONFIGURACIÓN INICIAL (Reseteo y Carga)
// ==========================================
// Esto evita bloqueos limpiando datos antiguos de sesiones pasadas la primera vez
if (!localStorage.getItem("billetera_inicializada")) {
    localStorage.clear();
    localStorage.setItem("saldo", "10000");
    localStorage.setItem("billetera_inicializada", "true");
}

// Historial inicial por defecto ordenado
if (localStorage.getItem("transacciones") === null) {
    const transaccionesIniciales = [
        { fecha: "18/06/2026", tipo: "Transferencia enviada", monto: "-$50,000", estado: "Completado" },
        { fecha: "15/06/2026", tipo: "Transferencia recibida", monto: "+$100,000", estado: "Completado" },
        { fecha: "01/06/2026", tipo: "Transferencia enviada", monto: "-$100,000", estado: "Completado" }
    ];
    localStorage.setItem("transacciones", JSON.stringify(transaccionesIniciales));
}

// Forzamos tus contactos reales en el sistema
const contactosIniciales = ["Rodrigo Morales", "Dayana Gonzalez", "Francisca peña", "Antonella peña", "Agustin Morales"];
localStorage.setItem("contactos", JSON.stringify(contactosIniciales));

// ==========================================
// 2. EFECTOS VISUALES CON JQUERY (Lección 6)
// ==========================================
$(document).ready(function() {
    // Animación de entrada suave para las tarjetas del menú principal
    $(".card").hide().fadeIn(1000);
});

// ==========================================
// 3. LÓGICA DE LOGIN (login.html)
// ==========================================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Detiene la recarga automática errónea
        
        const emailIngresado = document.getElementById("email").value.trim();
        const passwordIngresada = document.getElementById("password").value.trim();

        const correoCorrecto = "m.ojeda.m86@gmail.com";  
        const claveCorrecta = "123456";

        if (emailIngresado === correoCorrecto && passwordIngresada === claveCorrecta) {
            alert("¡Inicio de sesión correcto! Bienvenido.");
            window.location.href = "menu.html"; 
        } else {
            alert("Correo o contraseña incorrectos. Inténtalo de nuevo.");
        }
    });
}

// ==========================================
// 4. MOSTRAR SALDO DINÁMICO
// ==========================================
const balanceText = document.getElementById("balanceText");
if (balanceText) {
    let saldoActual = localStorage.getItem("saldo");
    balanceText.innerText = "$" + Number(saldoActual).toLocaleString();
}

// ==========================================
// 5. DEPOSITAR FONDOS Y REGISTRAR MOVIMIENTO
// ==========================================
const depositForm = document.getElementById("depositForm");
if (depositForm) {
    depositForm.addEventListener("submit", function(event) {
        event.preventDefault(); 
        const montoDepositado = Number(document.getElementById("amount").value);
        let saldoActual = Number(localStorage.getItem("saldo"));

        if (montoDepositado > 0) {
            let nuevoSaldo = saldoActual + montoDepositado;
            localStorage.setItem("saldo", nuevoSaldo.toString());

            // Registrar en el historial de transacciones
            let historial = JSON.parse(localStorage.getItem("transacciones")) || [];
            historial.unshift({
                fecha: new Date().toLocaleDateString(),
                tipo: "Depósito realizado",
                monto: "+$" + montoDepositado.toLocaleString(),
                estado: "Completado"
            });
            localStorage.setItem("transacciones", JSON.stringify(historial));

            alert("¡Depósito realizado con éxito!");
            window.location.href = "menu.html"; 
        } else {
            alert("Por favor, ingresa un monto válido.");
        }
    });
}

// ==========================================
// 6. ENVIAR DINERO Y AUTOCOMPLETAR CONTACTOS (JQuery)
// ==========================================
const contactList = document.getElementById("contactList");
if (contactList) {
    let contactos = JSON.parse(localStorage.getItem("contactos"));
    contactList.innerHTML = "";
    contactos.forEach(c => {
        contactList.innerHTML += `<li class="list-group-item">${c}</li>`;
    });
}

// Simular Autocompletar básico con jQuery al escribir
$("#searchContact").on("input", function() {
    let busqueda = $(this).val().toLowerCase();
    $("#contactList li").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(busqueda) > -1);
    });
});

// Enviar Dinero
const sendForm = document.getElementById("sendForm");
if (sendForm) {
    sendForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const contacto = document.getElementById("searchContact").value;
        const montoAEnviar = Number(document.getElementById("sendAmount").value);
        let saldoActual = Number(localStorage.getItem("saldo"));

        if (montoAEnviar > saldoActual) {
            alert("Fondos insuficientes.");
        } else if (montoAEnviar > 0) {
            let nuevoSaldo = saldoActual - montoAEnviar;
            localStorage.setItem("saldo", nuevoSaldo.toString());

            // Agregar nueva transacción
            let historial = JSON.parse(localStorage.getItem("transacciones")) || [];
            historial.unshift({
                fecha: new Date().toLocaleDateString(),
                tipo: "Envío a " + contacto,
                monto: "-$" + montoAEnviar.toLocaleString(),
                estado: "Completado"
            });
            localStorage.setItem("transacciones", JSON.stringify(historial));

            // Si el contacto es nuevo, agregarlo automáticamente a la lista
            let contactos = JSON.parse(localStorage.getItem("contactos"));
            if (!contactos.includes(contacto)) {
                contactos.push(contacto);
                localStorage.setItem("contactos", JSON.stringify(contactos));
            }

            alert("Transferencia realizada exitosamente.");
            window.location.href = "menu.html"; 
        }
    });
}

// ==========================================
// 7. HISTORIAL DE ÚLTIMOS MOVIMIENTOS
// ==========================================
const transactionTableBody = document.getElementById("transactionTableBody");
if (transactionTableBody) {
    let historial = JSON.parse(localStorage.getItem("transacciones")) || [];
    transactionTableBody.innerHTML = ""; 
    
    historial.forEach(t => {
        let claseMonto = t.monto.includes("+") ? "text-success" : "text-danger";
        transactionTableBody.innerHTML += `
            <tr>
                <td>${t.fecha}</td>
                <td>${t.tipo}</td>
                <td class="${claseMonto}">${t.monto}</td>
                <td><span class="badge bg-success">Completado</span></td>
            </tr>
        `;
    });
}
