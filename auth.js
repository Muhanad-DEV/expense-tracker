// Simple Authentication System
console.log('Auth system loading...');

// Authentication constants
const AUTH_KEY = 'expense-tracker-auth';
const USERS_KEY = 'expense-tracker-users';

// Initialize sample users
function initUsers() {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  if (users.length === 0) {
    const sampleUsers = [
      { id: 'user1', name: 'Test User', email: 'test@example.com', password: 'password123' },
      { id: 'user2', name: 'Demo User', email: 'demo@example.com', password: 'demo123' }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(sampleUsers));
    console.log('Sample users created');
  }
}

// Form switching functions
function showRegisterForm() {
  console.log('Showing register form');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  if (loginForm) loginForm.style.display = 'none';
  if (registerForm) registerForm.style.display = 'block';
}

function showLoginForm() {
  console.log('Showing login form');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  if (registerForm) registerForm.style.display = 'none';
  if (loginForm) loginForm.style.display = 'block';
}

// Show error message
function showError(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.style.display = 'block';
  }
}

// Clear error message
function clearError(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = '';
    element.style.display = 'none';
    element.style.color = ''; // Reset color to default
  }
}

// Show toast notification
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Login function
function handleLogin(event) {
  event.preventDefault();
  console.log('Login form submitted');
  
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  
  if (!email || !password) {
    showError('login-error', 'Please enter both email and password');
    return;
  }
  
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    showError('login-error', 'Invalid email or password');
    return;
  }
  
  // Save authentication
  localStorage.setItem(AUTH_KEY, JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    loginTime: new Date().toISOString()
  }));
  
  showToast('Login successful! Redirecting...', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 500);
}

// Register function
function handleRegister(event) {
  event.preventDefault();
  console.log('Register form submitted');
  
  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm').value;
  
  if (!name || !email || !password || !confirmPassword) {
    showError('register-error', 'Please fill in all fields');
    return;
  }
  
  if (password !== confirmPassword) {
    showError('register-error', 'Passwords do not match');
    return;
  }
  
  if (password.length < 6) {
    showError('register-error', 'Password must be at least 6 characters');
    return;
  }
  
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  
  if (users.find(u => u.email === email)) {
    showError('register-error', 'Email already exists');
    return;
  }
  
  // Create new user
  const newUser = {
    id: 'user_' + Date.now(),
    name: name,
    email: email,
    password: password,
    created_at: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Clear the register form
  document.getElementById('register-form').reset();
  clearError('register-error');
  
  // Show success message
  showToast('🎉 Account created successfully! Please log in with your new credentials.', 'success');
  
  // Switch to login form and pre-fill email
  setTimeout(() => {
    showLoginForm();
    const loginEmailField = document.getElementById('login-email');
    if (loginEmailField) {
      loginEmailField.value = email;
      loginEmailField.focus();
    }
    
    // Show additional success message on login form
    const loginError = document.getElementById('login-error');
    if (loginError) {
      loginError.textContent = '✅ Account created! Please enter your password to log in.';
      loginError.style.color = '#10b981';
      loginError.style.display = 'block';
      
      // Clear this message after 5 seconds
      setTimeout(() => {
        clearError('login-error');
      }, 5000);
    }
  }, 1500);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, setting up auth system');
  
  // Initialize users
  initUsers();
  
  // Check if already logged in
  const auth = localStorage.getItem(AUTH_KEY);
  if (auth) {
    try {
      const user = JSON.parse(auth);
      if (user && user.email) {
        window.location.href = 'index.html';
        return;
      }
    } catch (e) {
      localStorage.removeItem(AUTH_KEY);
    }
  }
  
  // Set up form event listeners
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showRegisterBtn = document.getElementById('show-register-btn');
  const showLoginBtn = document.getElementById('show-login-btn');
  
  console.log('Elements found:', {
    loginForm: !!loginForm,
    registerForm: !!registerForm,
    showRegisterBtn: !!showRegisterBtn,
    showLoginBtn: !!showLoginBtn
  });
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
  
  if (showRegisterBtn) {
    showRegisterBtn.addEventListener('click', function() {
      console.log('Register button clicked!');
      showRegisterForm();
    });
  }
  
  if (showLoginBtn) {
    showLoginBtn.addEventListener('click', function() {
      console.log('Login button clicked!');
      showLoginForm();
    });
  }
  
  console.log('Auth system initialized successfully');
});