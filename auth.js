// auth.js - Authentication functionality

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
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!validateEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long.', 'error');
        return;
    }
    
    // Simulate login (replace with actual authentication)
    showMessage('Login successful! Redirecting...', 'success');
    setTimeout(() => {
        window.location.href = 'home.html'; // Redirect to home page
    }, 1500);
});

// Signup form submission
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const isProvider = document.getElementById('signup-provider').checked;
    
    if (name.trim().length < 2) {
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
    
    // Simulate signup (replace with actual registration)
    showMessage('Account created successfully! Redirecting to login...', 'success');
    setTimeout(() => {
        showTab('login');
    }, 1500);
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