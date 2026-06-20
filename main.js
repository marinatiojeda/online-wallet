// ==========================================
// 1. ESTADO DE LA APLICACIÓN 
// ==========================================
// Usamos localStorage para que el saldo y los movimientos no se borren al recargar la página.
if (localStorage.getItem("saldo") === null) {
    localStorage.setItem("saldo", "10000"); 
}

// ==========================================
// 2. LÓGICA DE LA PANTALLA: LOGIN (login.html)
// ==========================================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // ==========================================
// 2. LÓGICA DE LA PANTALLA: LOGIN (login.html)
// ==========================================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Evita que la página se recargue sola
        
        // 1. Capturamos lo que el usuario escribió en el formulario
        const emailIngresado = document.getElementById("email").value;
        const passwordIngresada = document.getElementById("password").value;

        // 2. AQUÍ CONFIGURAS TU CORREO Y CLAVE ESPECÍFICOS
        const correoCorrecto = "tu_correo@billetera.com"; // <-- Cambia esto por el correo que quieras
        const claveCorrecta = "123456";                 // <-- Cambia esto por la contraseña que quieras

        // 3. Validamos si lo ingresado coincide con lo configurado
        if (emailIngresado === correoCorrecto && passwordIngresada === claveCorrecta) {
            alert("¡Inicio de sesión correcto! Bienvenido.");
            window.location.href = "menu.html"; // Redirige al menú principal
        } else {
            // Si algo está mal, muestra una alerta de error (Aspecto de UX evaluado)
            alert("Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.");
        }
    });
}
        
        // 1. Capturamos lo que el usuario escribió en el formulario
        const emailIngresado = document.getElementById("email").value;
        const passwordIngresada = document.getElementById("password").value;

        // 2. CORREO Y CLAVE 
        const correoCorrecto = "m.ojeda.m86@gmail.com"; 
        const claveCorrecta = "123456";                 

        // 3. Validamos si lo ingresado coincide con lo configurado
        if (emailIngresado === correoCorrecto && passwordIngresada === claveCorrecta) {
            alert("¡Inicio de sesión correcto! Bienvenido.");
            window.location.href = "menu.html"; // Redirige al menú principal
        } else {
            // muestra una alerta de error 
            alert("Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.");
        }
    });
}
// ==========================================
// 3.PANTALLA: MENU PRINCIPAL (menu.html)
// ==========================================
const balanceText = document.getElementById("balanceText");
if (balanceText) {
    // Mostramos el saldo actual guardado en la billetera
    let saldoActual = localStorage.getItem("saldo");
    balanceText.innerText = "$" + Number(saldoActual).toLocaleString();
}

// ==========================================
// 4. LÓGICA DE LA PANTALLA: DEPOSITAR (deposit.html)
// ==========================================
const depositForm = document.getElementById("depositForm");
if (depositForm) {
    depositForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const montoDepositado = Number(document.getElementById("amount").value);
        let saldoActual = Number(localStorage.getItem("saldo"));

        if (montoDepositado > 0) {
            // Sumamos el depósito al saldo
            let nuevoSaldo = saldoActual + montoDepositado;
            localStorage.setItem("saldo", nuevoSaldo.toString());

            alert("Depósito realizado con éxito. Sumaste: $" + montoDepositado);
            window.location.href = "menu.html"; // Volvemos al menú para ver el saldo actualizado
        } else {
            alert("Por favor, ingresa un monto válido.");
        }
    });
}

// ==========================================
// 5. PANTALLA: ENVIAR DINERO (sendmoney.html)
// ==========================================
const sendForm = document.getElementById("sendForm");
if (sendForm) {
    sendForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const contacto = document.getElementById("searchContact").value;
        const montoAEnviar = Number(document.getElementById("sendAmount").value);
        let saldoActual = Number(localStorage.getItem("saldo"));

        if (montoAEnviar > saldoActual) {
            alert("Fondos insuficientes. Tu saldo actual es de: $" + saldoActual);
        } else if (montoAEnviar > 0) {
            // Restamos el envío del saldo
            let nuevoSaldo = saldoActual - montoAEnviar;
            localStorage.setItem("saldo", nuevoSaldo.toString());

            alert("Transferencia exitosa de $" + montoAEnviar + " enviada a " + contacto);
            window.location.href = "menu.html"; // Volvemos al menú
        } else {
            alert("Por favor, ingresa un monto válido.");
        }
    });
}