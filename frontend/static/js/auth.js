/**
 * Lógica de Autenticación para Login y Registro
 * Integrado con EncorelyAPI (Facade)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ======== LÓGICA DE LOGIN ========
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnSubmit = document.getElementById('btn-login-submit');
            const errorDiv = document.getElementById('login-error');
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Estado de Carga (Loading state)
            btnSubmit.querySelector('.btn-text').style.display = 'none';
            btnSubmit.querySelector('.btn-spinner').style.display = 'inline';
            btnSubmit.disabled = true;
            errorDiv.style.display = 'none';
            
            try {
                // Llamada Facade a la API
                const data = await api.post('/auth/login/', { username, password });
                
                // Guardar tokens y redireccionar
                sessionStorage.setItem('access_token', data.access);
                sessionStorage.setItem('refresh_token', data.refresh);
                
                // Guardar datos básicos del usuario
                if (data.user) {
                    sessionStorage.setItem('user_info', JSON.stringify(data.user));
                }
                
                // Redirección exitosa (Si ya tiene swipes al radar, si no a swipe)
                const userInfo = data.user || {};
                window.location.href = userInfo.has_enough_swipes ? '/radar/' : '/swipe/';
                
            } catch (err) {
                // Mostrar error inline
                errorDiv.textContent = "Credenciales incorrectas. Inténtalo de nuevo.";
                errorDiv.style.display = 'block';
                
                // Restaurar botón
                btnSubmit.querySelector('.btn-text').style.display = 'inline';
                btnSubmit.querySelector('.btn-spinner').style.display = 'none';
                btnSubmit.disabled = false;
            }
        });
    }

    // ======== LÓGICA DE REGISTRO ========
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        const deptSelect = document.getElementById('reg-department');
        const citySelect = document.getElementById('reg-city');

        // 1. Cargar departamentos al iniciar
        const loadDepartments = async () => {
            try {
                const response = await fetch('https://api-colombia.com/api/v1/Department');
                const departments = await response.json();
                
                deptSelect.innerHTML = '<option value="">Selecciona Departamento</option>';
                departments.sort((a, b) => a.name.localeCompare(b.name)).forEach(dept => {
                    const option = document.createElement('option');
                    option.value = dept.id;
                    option.textContent = dept.name;
                    deptSelect.appendChild(option);
                });
            } catch (err) {
                console.error("Error cargando departamentos:", err);
                deptSelect.innerHTML = '<option value="">Error al cargar</option>';
            }
        };

        loadDepartments();

        // 2. Cargar ciudades al cambiar departamento
        deptSelect.addEventListener('change', async () => {
            const deptId = deptSelect.value;
            if (!deptId) {
                citySelect.innerHTML = '<option value="">Selecciona un departamento primero</option>';
                citySelect.disabled = true;
                return;
            }

            citySelect.disabled = true;
            citySelect.innerHTML = '<option value="">Cargando ciudades...</option>';

            try {
                const response = await fetch(`https://api-colombia.com/api/v1/Department/${deptId}/cities`);
                const cities = await response.json();
                
                citySelect.innerHTML = '<option value="">Selecciona Ciudad</option>';
                cities.sort((a, b) => a.name.localeCompare(b.name)).forEach(city => {
                    const option = document.createElement('option');
                    option.value = city.name;
                    option.textContent = city.name;
                    citySelect.appendChild(option);
                });
                citySelect.disabled = false;
            } catch (err) {
                console.error("Error cargando ciudades:", err);
                citySelect.innerHTML = '<option value="">Error al cargar</option>';
            }
        });

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnSubmit = document.getElementById('btn-register-submit');
            const errorDiv = document.getElementById('register-error');
            
            // Recoger datos
            const payload = {
                username: document.getElementById('reg-username').value,
                email: document.getElementById('reg-email').value,
                display_name: document.getElementById('reg-display-name').value,
                city: citySelect.value, // Usar el valor del select
                concert_mood: document.getElementById('reg-concert-mood').value,
                password: document.getElementById('reg-password').value,
                password_confirm: document.getElementById('reg-password-confirm').value,
            };
            
            // Validar contraseñas en frontend preventivamente
            if (payload.password !== payload.password_confirm) {
                errorDiv.textContent = "Las contraseñas no coinciden.";
                errorDiv.style.display = 'block';
                return;
            }

            // Validar ciudad seleccionada
            if (!payload.city) {
                errorDiv.textContent = "Por favor selecciona una ciudad.";
                errorDiv.style.display = 'block';
                return;
            }

            // Estado de Carga (Loading state)
            btnSubmit.querySelector('.btn-text').style.display = 'none';
            btnSubmit.querySelector('.btn-spinner').style.display = 'inline';
            btnSubmit.disabled = true;
            errorDiv.style.display = 'none';
            
            try {
                // Llamada Facade para crear el usuario
                await api.post('/auth/register/', payload);
                
                // Si el registro fue exitoso, hacer login automático
                const loginData = await api.post('/auth/login/', { 
                    username: payload.username, 
                    password: payload.password 
                });
                
                sessionStorage.setItem('access_token', loginData.access);
                sessionStorage.setItem('refresh_token', loginData.refresh);
                if (loginData.user) {
                    sessionStorage.setItem('user_info', JSON.stringify(loginData.user));
                }
                
                // Redirigir al inicio (Swipe porque es nuevo)
                window.location.href = '/swipe/';
                
            } catch (err) {
                // Manejar validaciones de la API (ej: email repetido)
                let errorMsg = "Error en el registro. Verifica los datos.";
                if (err.data) {
                    if (err.data.email) errorMsg = err.data.email[0];
                    else if (err.data.username) errorMsg = err.data.username[0];
                    else if (err.data.password) errorMsg = err.data.password[0];
                    else if (err.data.non_field_errors) errorMsg = err.data.non_field_errors[0];
                }
                
                errorDiv.textContent = errorMsg;
                errorDiv.style.display = 'block';
                
                // Restaurar botón
                btnSubmit.querySelector('.btn-text').style.display = 'inline';
                btnSubmit.querySelector('.btn-spinner').style.display = 'none';
                btnSubmit.disabled = false;
            }
        });
    }
});
