// auth.js - Authentication functionality

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
    const re = /^\+?[0-9\s\-().]{7,20}$/;
    return re.test(String(phone).trim());
}

function showMessage(message, type) {
    // Basic inline feedback message, fallback to alert if not found
    let msgEl = document.querySelector('.auth-message');
    if (!msgEl) {
        msgEl = document.createElement('div');
        msgEl.className = 'auth-message';
        msgEl.style.position = 'fixed';
        msgEl.style.top = '10px';
        msgEl.style.right = '10px';
        msgEl.style.padding = '10px 14px';
        msgEl.style.borderRadius = '6px';
        msgEl.style.zIndex = '9999';
        msgEl.style.boxShadow = '0 0 12px rgba(0,0,0,0.2)';
        document.body.appendChild(msgEl);
    }
    msgEl.textContent = message;
    msgEl.style.backgroundColor = type === 'success' ? '#4CAF50' : '#e74c3c';
    msgEl.style.color = '#fff';

    setTimeout(() => {
        if (msgEl.parentElement) {
            msgEl.remove();
        }
    }, 2500);
}

function showTab(tabName) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginTab = document.querySelector('.tab-button[onclick*="login"]');
    const signupTab = document.querySelector('.tab-button[onclick*="signup"]');

    if (tabName === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        loginTab.classList.remove('active');
        signupTab.classList.add('active');
    }
}

function toggleProviderFields() {
    const providerCheckbox = document.getElementById('signup-provider');
    const providerFields = document.getElementById('provider-fields');
    
    if (providerCheckbox.checked) {
        providerFields.style.display = 'block';
    } else {
        providerFields.style.display = 'none';
    }
}

// Login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    
    if (!validateEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long.', 'error');
        return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('youutilityUsers') || '[]');
    const foundUser = existingUsers.find(u => u.email === email && u.password === password);

    if (!foundUser) {
        showMessage('Invalid email or password. Please try again or sign up.', 'error');
        return;
    }

    // Persist current user and redirect to dashboard/home
    localStorage.setItem('youutilityCurrentUser', JSON.stringify(foundUser));
    showMessage('Login successful! Redirecting to dashboard...', 'success');

    setTimeout(() => {
        if (foundUser.isProvider) {
            window.location.href = 'provider-dashboard.html';
        } else {
            window.location.href = 'home.html';
        }
    }, 1200);
});

// Signup form submission
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const phone = document.getElementById('signup-phone').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const isProvider = document.getElementById('signup-provider').checked;
    
    if (name.length < 2) {
        showMessage('Please enter a valid full name.', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    if (!validatePhone(phone)) {
        showMessage('Please enter a valid phone number.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long.', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match.', 'error');
        return;
    }
    
    if (isProvider) {
        const serviceType = document.getElementById('signup-service-type').value;
        const experience = document.getElementById('signup-experience').value;
        
        if (!serviceType) {
            showMessage('Please select a service type.', 'error');
            return;
        }
        
        if (experience === '' || experience < 0) {
            showMessage('Please enter valid years of experience.', 'error');
            return;
        }
    }

    const existingUsers = JSON.parse(localStorage.getItem('youutilityUsers') || '[]');
    if (existingUsers.some(u => u.email === email)) {
        showMessage('An account with this email already exists. Please log in instead.', 'error');
        showTab('login');
        return;
    }

    const user = {
        name,
        email,
        phone,
        password,
        isProvider,
        serviceType: isProvider ? document.getElementById('signup-service-type').value : '',
        experience: isProvider ? document.getElementById('signup-experience').value : '',
        registeredAt: new Date().toISOString()
    };

    existingUsers.push(user);
    localStorage.setItem('youutilityUsers', JSON.stringify(existingUsers));

    showMessage('Account created successfully! Redirecting...', 'success');
    setTimeout(() => {
        localStorage.setItem('youutilityCurrentUser', JSON.stringify(user));
        if (isProvider) {
            window.location.href = 'provider-dashboard.html';
        } else {
            window.location.href = 'home.html';
        }
    }, 1200);
});

// Password confirmation validation
document.getElementById('signup-confirm-password').addEventListener('input', function() {
    const password = document.getElementById('signup-password').value;
    const confirmPassword = this.value;
    
    if (password !== confirmPassword) {
        this.setCustomValidity('Passwords do not match');
    } else {
        this.setCustomValidity('');
    }
});