(() => {
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
  async function checkAuth() {
    try {
      // Check if we have a valid session by trying to get expenses
      await apiClient.getExpenses();
      // If successful, redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      // Not authenticated, stay on login page
      console.log('Not authenticated');
    }
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
    element.classList.add('show');
  }

  // Clear error message
  function clearError(element) {
    element.textContent = '';
    element.classList.remove('show');
  }

  // Password toggle functionality
  function setupPasswordToggle(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    
    if (toggle && input) {
      toggle.addEventListener('click', () => {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        
        const icon = toggle.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
      });
    }
  }

  // Password strength checker
  function checkPasswordStrength(password) {
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    let strength = 0;
    let strengthLabel = '';
    
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    strengthBar.className = 'strength-fill';
    
    if (strength <= 2) {
      strengthBar.classList.add('weak');
      strengthLabel = 'Weak';
    } else if (strength <= 4) {
      strengthBar.classList.add('fair');
      strengthLabel = 'Fair';
    } else if (strength <= 5) {
      strengthBar.classList.add('good');
      strengthLabel = 'Good';
    } else {
      strengthBar.classList.add('strong');
      strengthLabel = 'Strong';
    }
    
    strengthText.textContent = `Password strength: ${strengthLabel}`;
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
  loginForm.addEventListener('submit', async (e) => {
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
    
    try {
      const response = await apiClient.login({ email, password });
      
      toast('Login successful! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (error) {
      showError(loginError, error.message || 'Login failed. Please try again.');
    }
  });

  // Register functionality
  registerForm.addEventListener('submit', async (e) => {
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
    
    try {
      const response = await apiClient.register({ name, email, password, confirmPassword });
      
      toast('Account created successfully! Please sign in.', 'success');
      setTimeout(() => {
        switchToLogin();
        document.getElementById('login-email').value = email;
      }, 1000);
    } catch (error) {
      showError(registerError, error.message || 'Registration failed. Please try again.');
    }
  });

  // Event listeners for form switching
  showRegisterBtn.addEventListener('click', switchToRegister);
  showLoginBtn.addEventListener('click', switchToLogin);

  // Setup password toggles
  setupPasswordToggle('login-password-toggle', 'login-password');
  setupPasswordToggle('register-password-toggle', 'register-password');
  setupPasswordToggle('register-confirm-toggle', 'register-confirm');

  // Setup password strength checker
  const registerPasswordInput = document.getElementById('register-password');
  if (registerPasswordInput) {
    registerPasswordInput.addEventListener('input', (e) => {
      checkPasswordStrength(e.target.value);
    });
  }

  // Check authentication on page load
  checkAuth();
})();
