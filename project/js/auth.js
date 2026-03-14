/* =======================================
   Auth JavaScript Logic & LocalStorage
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    const checkSession = () => {
        const currentUser = localStorage.getItem('currentUser');
        const path = window.location.pathname;
        
        // If on protected pages and not logged in, redirect to login
        if (!currentUser && (path.includes('dashboard.html') || path.includes('payment.html'))) {
            window.location.href = 'login.html';
        }
        
        // If logged in and on auth pages, redirect to dashboard
        if (currentUser && (path.includes('login.html') || path.includes('register.html'))) {
            window.location.href = 'dashboard.html';
        }

        // Update nav for logged in users
        if (currentUser) {
            updateNavForUser(JSON.parse(currentUser));
        }
    };

    const updateNavForUser = (user) => {
        const navActions = document.querySelector('.nav-actions');
        if (navActions && !window.location.pathname.includes('dashboard.html')) {
            navActions.innerHTML = `
                <span style="margin-right: 16px; font-weight: 500;">Hi, ${user.name.split(' ')[0]}</span>
                <a href="dashboard.html" class="btn btn-primary btn-nav">Dashboard</a>
            `;
        }
    };

    // Run session check on load
    checkSession();

    /* --- Register Flow --- */
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const errorElement = document.getElementById('register-error');
            const submitBtn = document.getElementById('register-submit');
            
            errorElement.style.display = 'none';

            // Basic Validation
            if (password !== confirmPassword) {
                showError(errorElement, "Passwords do not match.");
                return;
            }

            if (password.length < 6) {
                showError(errorElement, "Password must be at least 6 characters.");
                return;
            }

            // Simulate Network Request
            setLoading(submitBtn, 'Creating Account...');
            
            setTimeout(() => {
                // Check for existing user
                let users = JSON.parse(localStorage.getItem('users')) || [];
                if (users.find(u => u.email === email)) {
                    showError(errorElement, "An account with this email already exists.");
                    resetLoading(submitBtn, 'Create Account');
                    return;
                }

                // Save new user
                const newUser = { name, email, phone, password };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                
                // Redirect to login
                window.location.href = 'login.html?registered=true';
            }, 800);
        });
    }

    /* --- Social Login Simulation --- */
    window.simulateSocial = function(provider) {
        const errorElement = document.getElementById('login-error') || document.getElementById('register-error');
        if (errorElement) {
            // Repurpose error element as a success/loading notification
            errorElement.style.display = 'block';
            errorElement.style.background = '#EFF6FF';
            errorElement.style.color = '#2563EB';
            errorElement.style.borderColor = '#BFDBFE';
            errorElement.textContent = `Authenticating with ${provider}...`;
            
            setTimeout(() => {
                const sessionData = { 
                    name: `${provider} User`, 
                    email: `demo@${provider.toLowerCase()}.com`, 
                    timestamp: new Date().getTime() 
                };
                localStorage.setItem('currentUser', JSON.stringify(sessionData));
                window.location.href = 'dashboard.html';
            }, 1200);
        }
    };

    /* --- Login Flow --- */
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        // Show success message if redirected from register
        const urlParams = new URLSearchParams(window.location.search);
        const successMessage = document.getElementById('login-success');
        if (urlParams.get('registered') === 'true' && successMessage) {
            successMessage.style.display = 'block';
            successMessage.textContent = 'Account created successfully. Please login.';
            
            // Remove parameter from URL securely
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorElement = document.getElementById('login-error');
            const submitBtn = document.getElementById('login-submit');
            
            errorElement.style.display = 'none';
            if(successMessage) successMessage.style.display = 'none';

            // Simulate Network Request
            setLoading(submitBtn, 'Signing In...');

            setTimeout(() => {
                let users = JSON.parse(localStorage.getItem('users')) || [];
                const user = users.find(u => u.email === email && u.password === password);

                if (user) {
                    // Set secure session
                    const sessionData = { name: user.name, email: user.email, timestamp: new Date().getTime() };
                    localStorage.setItem('currentUser', JSON.stringify(sessionData));
                    window.location.href = 'dashboard.html';
                } else {
                    showError(errorElement, "Invalid email or password.");
                    resetLoading(submitBtn, 'Login');
                }
            }, 800);
        });
    }

    /* --- Logout Flow --- */
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    /* --- Utilities --- */
    function showError(element, message) {
        if(element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    }

    function setLoading(btn, text) {
        if(btn) {
            btn.disabled = true;
            btn.innerHTML = `<span class="spinner"></span> ${text}`;
            btn.classList.add('loading');
        }
    }

    function resetLoading(btn, text) {
        if(btn) {
            btn.disabled = false;
            btn.innerHTML = text;
            btn.classList.remove('loading');
        }
    }

    /* --- Password Visibility Toggle --- */
    const togglePasswordElems = document.querySelectorAll('.toggle-password');
    togglePasswordElems.forEach(icon => {
        icon.addEventListener('click', function() {
            // Find sibling input
            const input = this.parentElement.querySelector('input');
            if (input.type === 'password') {
                input.type = 'text';
                // Update SVG path for 'eye-off'
                this.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"></path>`;
            } else {
                input.type = 'password';
                // Update SVG path for 'eye'
                this.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`;
            }
        });
    });
});
