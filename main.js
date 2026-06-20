// ==========================================
// 1. CONFIGURACIÓN INICIAL (Reseteo y Carga)
// ==========================================
// Esto evita bloqueos limpiando datos antiguos de sesiones pasadas la primera vez
if (!localStorage.getItem("billetera_inicializada")) {
    localStorage.clear();
    localStorage.setItem("saldo", "100000"); // Aumentamos un poco el saldo inicial para pruebas
    localStorage.setItem("billetera_inicializada", "true");
}

// Historial inicial por defecto ordenado
if (localStorage.getItem("transacciones") === null) {
    const transaccionesIniciales = [
        { fecha: "18/06/2026", tipo: "Transferencia enviada", monto: "-$50,000", detalle: "Envío a Rodrigo Morales (Santander)", estado: "Completado" },
        { fecha: "15/06/2026", tipo: "Transferencia recibida", monto: "+$100,000", detalle: "Carga inicial por ventanilla", estado: "Completado" },
        { fecha: "01/06/2026", tipo: "Transferencia enviada", monto: "-$100,000", detalle: "Pago de servicios públicos", estado: "Completado" }
    ];
    localStorage.setItem("transacciones", JSON.stringify(transaccionesIniciales));
}

// ==========================================
// 2. EFECTOS VISUALES CON JQUERY (Lección 6)
// ==========================================
$(document).ready(function() {
    // Animación de entrada suave para las tarjetas del menú principal o formularios
    $(".card").hide().fadeIn(1000);

    // Variables internas para recordar el contacto cliqueado en sendmoney.html
    let bancoSeleccionado = "";
    let nombreSeleccionado = "";

    // Capturar el evento de clic en los contactos frecuentes de tu lista
    $(document).on('click', '.contacto-item', function() {
        // Resaltar visualmente el seleccionado
        $('.contacto-item').removeClass('selected');
        $(this).addClass('selected');
        
        // Extraer los atributos usando jQuery
        nombreSeleccionado = $(this).attr('data-nombre');
        bancoSeleccionado = $(this).attr('data-banco');
        
        // Autocompletar el campo de búsqueda con el nombre seleccionado
        $('#searchContact').val(nombreSeleccionado);
        
        // Habilitar el botón de enviar dinero si estaba bloqueado
        $('#btnEnviar').prop('disabled', false);
    });

    // Enviar Dinero - Procesamiento adaptado a tu formulario con jQuery
    $('#sendForm').submit(function(event) {
        event.preventDefault();
        
        const montoAEnviar = Number($('#sendAmount').val());
        let saldoActual = Number(localStorage.getItem("saldo"));

        // Si no se usó el clic pero se escribió un nombre a mano, asignamos valores por defecto
        if (!nombreSeleccionado) {
            nombreSeleccionado = $('#searchContact').val();
            bancoSeleccionado = "Otros Bancos";
        }

        if (montoAEnviar > saldoActual) {
            alert("Fondos insuficientes.");
            return;
        } 
        
        if (montoAEnviar > 0) {
            let nuevoSaldo = saldoActual - montoAEnviar;
            localStorage.setItem("saldo", nuevoSaldo.toString());

            // Agregar nueva transacción al historial incluyendo el banco detalladamente
            let historial = JSON.parse(localStorage.getItem("transacciones")) || [];
            historial.unshift({
                fecha: new Date().toLocaleDateString('es-CL'),
                tipo: "Transferencia enviada",
                monto: "-$" + montoAEnviar.toLocaleString('es-CL'),
                // Guardamos el detalle inteligente con el banco aquí
                detalle: `Envío a ${nombreSeleccionado} (${bancoSeleccionado})`,
                estado: "Completado"
            });
            localStorage.setItem("transacciones", JSON.stringify(historial));

            // Mostrar mensaje interactivo usando la alerta de Bootstrap que tienes en el HTML
            $('#confirmacionEnvio')
                .text(`¡Transferencia de $${montoAEnviar.toLocaleString('es-CL')} enviada con éxito a ${nombreSeleccionado} (${bancoSeleccionado})!`)
                .removeClass('d-none');

            // Resetear el formulario e interfaz
            $('#sendForm')[0].reset();
            $('#btnEnviar').prop('disabled', true);
            $('.contacto-item').removeClass('selected');

            // Redirigir suavemente al menú tras 2.5 segundos
            setTimeout(() => {
                window.location.href = "menu.html"; 
            }, 2500);
        } else {
            alert("Por favor ingresa un monto válido.");
        }
    });

    // Simular buscador interactivo con jQuery al escribir en la agenda
    $("#searchContact").on("keyup", function() {
        let busqueda = $(this).val().toLowerCase();
        $("#contactList .contacto-item").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(busqueda) > -1);
        });
    });
});

// ==========================================
// 3. LÓGICA DE LOGIN (login.html)
// ==========================================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); 
        
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
    balanceText.innerText = "$" + Number(saldoActual).toLocaleString('es-CL');
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
                fecha: new Date().toLocaleDateString('es-CL'),
                tipo: "Depósito realizado",
                monto: "+$" + montoDepositado.toLocaleString('es-CL'),
                detalle: "Depósito en efectivo en cuenta propia",
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
// 7. HISTORIAL DE ÚLTIMOS MOVIMIENTOS (transactions.html)
// ==========================================
const transactionTableBody = document.getElementById("transactionTableBody");

if (transactionTableBody) {
    // Función encargada de pintar las filas de la tabla según el filtro seleccionado
    function renderTable(filtro) {
        let historial = JSON.parse(localStorage.getItem("transacciones")) || [];
        transactionTableBody.innerHTML = ""; // Limpiamos las filas anteriores
        
        // Filtrar los datos: si es 'todos' pasan todos, si no, filtramos por tipo exacto
        let movimientosFiltrados = historial.filter(t => {
            if (filtro === "todos") return true;
            return t.tipo === filtro;
        });

        // Si no hay movimientos de ese tipo, mostrar un aviso amigable
        if (movimientosFiltrados.length === 0) {
            transactionTableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted py-3">No hay registros para este tipo de movimiento.</td>
                </tr>`;
            return;
        }

        // Dibujar las filas que superaron el filtro
        movimientosFiltrados.forEach(t => {
            let claseMonto = t.monto.includes("+") ? "text-success" : "text-danger";
            let textoMostrar = t.detalle ? t.detalle : t.tipo; 

            transactionTableBody.innerHTML += `
                <tr>
                    <td>${t.fecha}</td>
                    <td><strong>${t.tipo}</strong><br><small class="text-muted">${textoMostrar}</small></td>
                    <td class="${claseMonto}"><strong>${t.monto}</strong></td>
                    <td><span class="badge bg-success">${t.estado}</span></td>
                </tr>
            `;
        });
    }

    // 1. Carga inicial al entrar a la pantalla (muestra todo por defecto)
    renderTable("todos");

    // 2. Escuchar cuando el usuario elija otra opción en el desplegable (Con jQuery)
    $("#filtroTipo").change(function() {
        let seleccion = $(this).val(); // Captura "todos", "Depósito realizado" o "Transferencia enviada"
        renderTable(seleccion);        // Vuelve a dibujar la tabla con el filtro activo
    });
}
