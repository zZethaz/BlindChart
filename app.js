document.addEventListener('DOMContentLoaded', () => {

    const path = window.location.pathname;

    // Lógica para las páginas de autenticación
    if (path.includes('login.html') || path.includes('registro.html')) {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value;
                if (username) {
                    // Guardar el nombre de usuario en el almacenamiento local para simular la sesión
                    localStorage.setItem('loggedInUser', username);
                    // Redirigir al dashboard
                    window.location.href = 'dashboard.html';
                }
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const password = document.getElementById('new-password').value;
                const confirmPassword = document.getElementById('confirm-password').value;

                if (password !== confirmPassword) {
                    alert('Las contraseñas no coinciden.');
                    return;
                }
                
                alert('¡Registro exitoso! Ahora serás redirigido para iniciar sesión.');
                window.location.href = 'login.html';
            });
        }
    }

    // Lógica para el Dashboard
    if (path.includes('dashboard.html')) {
        // Añadir clase al body para aplicar estilos específicos
        document.body.classList.add('dashboard-body');

        const loggedInUser = localStorage.getItem('loggedInUser');
        
        // Proteger la ruta: si no hay usuario, redirigir al login
        if (!loggedInUser) {
            window.location.href = 'login.html';
            return; // Detener la ejecución del script
        }
        
        // Personalizar el dashboard con los datos del usuario
        const usernameDisplay = document.getElementById('username-display');
        const userInitials = document.getElementById('user-initials');

        if (usernameDisplay) {
            usernameDisplay.textContent = loggedInUser;
        }

        if (userInitials) {
            // Obtener las dos primeras iniciales del nombre de usuario
            userInitials.textContent = loggedInUser.substring(0, 2).toUpperCase();
        }

        // Establecer la fecha actual
        const dateDisplay = document.getElementById('current-date');
        if (dateDisplay) {
            const today = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateDisplay.textContent = today.toLocaleDateString('es-ES', options);
        }

        // Simular Logout
        const userMenuButton = document.getElementById('user-menu-button');
        if (userMenuButton) {
            userMenuButton.addEventListener('click', () => {
                if (confirm('¿Deseas cerrar sesión?')) {
                    localStorage.removeItem('loggedInUser');
                    window.location.href = 'login.html';
                }
            });
        }
    }
});