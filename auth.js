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
  const toasts = document.getElementById('toasts');

  // Check if user is already logged in
  function checkAuth() {
    const auth = localStorage.getItem(AUTH_KEY);
    if (auth) {
      try {
        const user = JSON.parse(auth);
        if (user && user.email) {
          // Redirect to main app
          window.location.href = 'index.html';
          return;
        }
      } catch (e) {
        localStorage.removeItem(AUTH_KEY);
      }
    }
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
  function toast(message, type = 'success') {
    if (!toasts) return;
    const div = document.createElement('div');
    div.className = `toast toast-${type}`;
    div.textContent = message;
    toasts.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  }

  // Show error message
  function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
  }

  // Clear error message
  function clearError(element) {
    element.textContent = '';
    element.style.display = 'none';
  }

  // Switch between login and register forms
  function switchToRegister() {
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
    clearError(loginError);
    registerForm.reset();
  }

  function switchToLogin() {
    registerSection.style.display = 'none';
    loginSection.style.display = 'block';
    clearError(registerError);
    loginForm.reset();
  }

  // Login functionality
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError(loginError);
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    // INTENTIONAL VALIDATION ISSUES FOR TESTING:
    // 1. Email validation is weakened - doesn't check proper email format
    // 2. Password validation is missing - accepts empty passwords
    // 3. User existence check is incomplete
    
    if (!email || !password) {
      showError(loginError, 'Please enter both email and password.');
      return;
    }
    
    // NOTE: Email format validation is intentionally missing
    // NOTE: Password strength validation is intentionally missing
    
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      showError(loginError, 'User not found. Please check your email or create an account.');
      return;
    }
    
    // INTENTIONAL SECURITY ISSUE: Simple password comparison without hashing
    // NOTE: This is intentionally insecure for testing purposes
    if (user.password !== password) {
      showError(loginError, 'Invalid password. Please try again.');
      return;
    }
    
    // Save authentication state
    localStorage.setItem(AUTH_KEY, JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      loginTime: new Date().toISOString()
    }));
    
    toast('Login successful! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  });

  // Register functionality
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError(registerError);
    
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    
    // INTENTIONAL VALIDATION ISSUES FOR TESTING:
    // 1. Name validation is missing - accepts empty names
    // 2. Email format validation is missing
    // 3. Password confirmation validation is weakened
    // 4. Password strength validation is missing
    
    if (!name || !email || !password || !confirmPassword) {
      showError(registerError, 'Please fill in all fields.');
      return;
    }
    
    // NOTE: Name length validation is intentionally missing
    // NOTE: Email format validation is intentionally missing
    // NOTE: Password strength validation is intentionally missing
    
    if (password !== confirmPassword) {
      showError(registerError, 'Passwords do not match.');
      return;
    }
    
    // Check if user already exists
    const users = getUsers();
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      showError(registerError, 'An account with this email already exists.');
      return;
    }
    
    // Create new user
    const newUser = {
      id: crypto.randomUUID(),
      name: name,
      email: email,
      password: password, // INTENTIONAL: Storing plain text password for testing
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    toast('Account created successfully! Please sign in.', 'success');
    setTimeout(() => {
      switchToLogin();
      document.getElementById('login-email').value = email;
    }, 1000);
  });

  // Event listeners for form switching
  showRegisterBtn.addEventListener('click', switchToRegister);
  showLoginBtn.addEventListener('click', switchToLogin);

  // Check authentication on page load
  checkAuth();
})();
