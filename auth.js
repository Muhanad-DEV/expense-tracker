(() => {
  // Authentication state management
  const AUTH_KEY = 'expense-tracker-auth';
  const USERS_KEY = 'expense-tracker-users';
  
  // DOM elements
  const loginSection = document.getElementById('login-section');
  const registerSection = document.getElementById('register-section');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showRegisterBtn = document.getElementById('show-register');
  const showLoginBtn = document.getElementById('show-login');
  const loginError = document.getElementById('login-error');
  const registerError = document.getElementById('register-error');

  // Check if user is already logged in
  function checkAuth() {
    const auth = localStorage.getItem(AUTH_KEY);
    if (auth) {
      try {
        const user = JSON.parse(auth);
        if (user && user.email) {
          window.location.href = 'index.html';
          return true;
        }
      } catch (e) {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    return false;
  }

  // Get users from localStorage
  function getUsers() {
    try {
      const users = localStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (e) {
      return [];
    }
  }

  // Save users to localStorage
  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  // Show toast message
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

  // Show error message
  function showError(element, message) {
    if (element) {
      element.textContent = message;
      element.style.display = 'block';
    }
  }

  // Clear error message
  function clearError(element) {
    if (element) {
      element.textContent = '';
      element.style.display = 'none';
    }
  }

  // Validate email format
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Switch between login and register forms
  function switchToRegister(e) {
    if (e) e.preventDefault();
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
    clearError(loginError);
    if (registerForm) registerForm.reset();
  }

  function switchToLogin(e) {
    if (e) e.preventDefault();
    registerSection.style.display = 'none';
    loginSection.style.display = 'block';
    clearError(registerError);
    if (loginForm) loginForm.reset();
  }

  // Login functionality
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError(loginError);
      
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      
      // Basic validation
      if (!email || !password) {
        showError(loginError, 'Please enter both email and password');
        return;
      }
      
      if (!isValidEmail(email)) {
        showError(loginError, 'Please enter a valid email address');
        return;
      }
      
      // Check user credentials
      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        showError(loginError, 'Invalid email or password');
        return;
      }
      
      // Save authentication state
      const authData = {
        id: user.id,
        email: user.email,
        name: user.name,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      
      showToast('Login successful! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 500);
    });
  }

  // Register functionality
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError(registerError);
      
      const name = document.getElementById('register-name').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm').value;
      
      // Validation
      if (!name || !email || !password || !confirmPassword) {
        showError(registerError, 'Please fill in all fields');
        return;
      }
      
      if (name.length < 2) {
        showError(registerError, 'Name must be at least 2 characters long');
        return;
      }
      
      if (!isValidEmail(email)) {
        showError(registerError, 'Please enter a valid email address');
        return;
      }
      
      if (password.length < 6) {
        showError(registerError, 'Password must be at least 6 characters long');
        return;
      }
      
      if (password !== confirmPassword) {
        showError(registerError, 'Passwords do not match');
        return;
      }
      
      // Check if user already exists
      const users = getUsers();
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        showError(registerError, 'An account with this email already exists');
        return;
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: name,
        email: email,
        password: password, // NOTE: Storing plain text for demo purposes
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      saveUsers(users);
      
      showToast('Account created successfully! Please sign in', 'success');
      setTimeout(() => {
        switchToLogin();
        document.getElementById('login-email').value = email;
        document.getElementById('login-email').focus();
      }, 1000);
    });
  }

  // Event listeners for form switching
  if (showRegisterBtn) {
    showRegisterBtn.addEventListener('click', switchToRegister);
  }
  
  if (showLoginBtn) {
    showLoginBtn.addEventListener('click', switchToLogin);
  }

  // Check authentication on page load
  checkAuth();
})();
