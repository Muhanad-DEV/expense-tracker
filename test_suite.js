/**
 * Expense Tracker - Browser Test Suite
 * Run from the browser console on the corresponding page.
 * Tests are safe to run repeatedly; they operate on localStorage only.
 *
 * Usage:
 *   - Open login.html in the browser, then run:
 *       ExpenseTestSuite.runAuthTests();
 *   - After logging in and landing on index.html, run:
 *       ExpenseTestSuite.runExpenseTests();
 *       ExpenseTestSuite.runAnalyticsTests();
 *   - Or run all available tests for the current page:
 *       ExpenseTestSuite.runAll();
 */
(function () {
  const AUTH_KEY = 'expense-tracker-auth';
  const USERS_KEY = 'expense-tracker-users';

  const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

  const log = {
    info: (...args) => console.log('[TEST]', ...args),
    pass: (...args) => console.log('[PASS]', ...args),
    fail: (...args) => console.error('[FAIL]', ...args),
  };

  function setInputValue(el, value) {
    if (!el) return;
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function ensureSampleUser() {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const sample = { id: 'test-user-001', name: 'Test User', email: 'test@example.com', password: 'password123' };
    if (!users.some((u) => u.email === sample.email)) {
      users.push(sample);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      log.info('Seeded sample user');
    }
  }

  function getAuthUser() {
    const auth = localStorage.getItem(AUTH_KEY);
    if (!auth) return null;
    try {
      return JSON.parse(auth);
    } catch (err) {
      return null;
    }
  }

  async function testUserRegistration() {
    log.info('=== TS_AUTH_001: User Registration ===');
    localStorage.removeItem(AUTH_KEY);

    const registerBtn = document.getElementById('show-register-btn');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

    if (!registerForm || !loginForm) {
      log.fail('Registration or login form not found on this page');
      return false;
    }

    if (registerBtn) registerBtn.click();
    if (typeof showRegisterForm === 'function') showRegisterForm();
    if (registerForm.style.display === 'none') registerForm.style.display = 'block';
    loginForm.style.display = 'none';
    await delay(200);

    setInputValue(document.getElementById('register-name'), 'John Doe');
    setInputValue(document.getElementById('register-email'), 'john.doe@test.com');
    setInputValue(document.getElementById('register-password'), 'password123');
    setInputValue(document.getElementById('register-confirm'), 'password123');

    registerForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await delay(1000);

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const userExists = users.some((u) => u.email === 'john.doe@test.com');
    if (userExists) {
      log.pass('User registered successfully');
      return true;
    }
    log.fail('User registration failed');
    return false;
  }

  async function testUserLogin() {
    log.info('=== TS_AUTH_004: User Login ===');
    localStorage.removeItem(AUTH_KEY);
    ensureSampleUser();

    const loginForm = document.getElementById('login-form');
    if (!loginForm) {
      log.fail('Login form not found on this page');
      return false;
    }

    setInputValue(document.getElementById('login-email'), 'test@example.com');
    setInputValue(document.getElementById('login-password'), 'password123');

    loginForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await delay(400); // check before redirect fires

    const auth = getAuthUser();
    if (auth && auth.email === 'test@example.com') {
      log.pass('User logged in successfully', auth.name || '');
      return true;
    }
    log.fail('Login failed');
    return false;
  }

  async function testAddExpense() {
    log.info('=== TS_EXP_001: Add Expense ===');
    const auth = getAuthUser();
    if (!auth) {
      log.fail('User not logged in. Run login test first.');
      return false;
    }

    const storageKey = `expense-tracker:v1:${auth.id}`;
    const before = JSON.parse(localStorage.getItem(storageKey) || '[]');

    const form = document.getElementById('expense-form');
    if (!form) {
      log.fail('Expense form not found on this page');
      return false;
    }

    setInputValue(document.getElementById('category'), 'Food');
    setInputValue(document.getElementById('amount'), '25.50');
    setInputValue(document.getElementById('date'), '2025-11-01');

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await delay(800);

    const after = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (after.length === before.length + 1) {
      const added = after.find((e) => e.category === 'Food' && Number(e.amount) === 25.5);
      if (added) {
        log.pass('Expense added successfully', added);
        return true;
      }
    }
    log.fail('Expense not added');
    return false;
  }

  async function testValidateExpenseForm() {
    log.info('=== TS_EXP_002: Expense Form Validation ===');
    const form = document.getElementById('expense-form');
    const category = document.getElementById('category');
    const amount = document.getElementById('amount');
    const date = document.getElementById('date');

    if (!form || !category || !amount || !date) {
      log.fail('Expense form elements not found on this page');
      return false;
    }

    // Test empty category
    setInputValue(category, '');
    setInputValue(amount, '25.50');
    setInputValue(date, '2025-11-01');

    let submitted = false;
    form.addEventListener(
      'submit',
      (e) => {
        submitted = true;
        e.preventDefault();
      },
      { once: true }
    );
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await delay(150);
    if (submitted) {
      log.fail('Form submitted with empty category');
      return false;
    }
    log.pass('Validation blocked submission with empty category');

    // Test invalid amount
    setInputValue(category, 'Food');
    setInputValue(amount, 'abc');
    setInputValue(date, '2025-11-01');

    submitted = false;
    form.addEventListener(
      'submit',
      (e) => {
        submitted = true;
        e.preventDefault();
      },
      { once: true }
    );
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await delay(150);
    if (submitted) {
      log.fail('Form submitted with invalid amount');
      return false;
    }
    log.pass('Validation blocked submission with invalid amount');
    return true;
  }

  async function testMonthlySummary() {
    log.info('=== TS_ANAL_001: Monthly Summary Calculation ===');
    const auth = getAuthUser();
    if (!auth) {
      log.fail('User not logged in. Run login test first.');
      return false;
    }

    const storageKey = `expense-tracker:v1:${auth.id}`;
    const testExpenses = [
      { id: 't1', user_id: auth.id, category: 'Food', amount: 25.5, date: '2025-11-01' },
      { id: 't2', user_id: auth.id, category: 'Transport', amount: 10.0, date: '2025-11-05' },
      { id: 't3', user_id: auth.id, category: 'Coffee', amount: 5.5, date: '2025-11-10' },
    ];
    localStorage.setItem(storageKey, JSON.stringify(testExpenses));

    // Trigger any render logic if present
    if (typeof render === 'function') {
      try {
        render();
      } catch (err) {
        log.info('Render call failed, continuing with DOM read only');
      }
    }
    await delay(300);

    const monthlyTotalElement = document.getElementById('monthly-total');
    if (!monthlyTotalElement) {
      log.fail('Monthly total element not found on this page');
      return false;
    }

    const displayed = parseFloat(String(monthlyTotalElement.textContent).replace(/[^0-9.]+/g, ''));
    const expected = 25.5 + 10 + 5.5;

    if (Math.abs(displayed - expected) < 0.01) {
      log.pass('Monthly total calculated correctly', { expected, displayed });
      return true;
    }
    log.fail('Monthly total incorrect', { expected, displayed });
    return false;
  }

  async function runAuthTests() {
    const results = [];
    results.push(await testUserRegistration());
    results.push(await testUserLogin());
    summary(results, 'Auth Tests');
    return results.every(Boolean);
  }

  async function runExpenseTests() {
    const results = [];
    results.push(await testAddExpense());
    results.push(await testValidateExpenseForm());
    summary(results, 'Expense Tests');
    return results.every(Boolean);
  }

  async function runAnalyticsTests() {
    const results = [];
    results.push(await testMonthlySummary());
    summary(results, 'Analytics Tests');
    return results.every(Boolean);
  }

  function summary(results, label) {
    const passed = results.filter(Boolean).length;
    const total = results.length;
    const rate = total ? ((passed / total) * 100).toFixed(1) : '0.0';
    log.info(`=== ${label} Summary: ${passed}/${total} passed (${rate}%) ===`);
  }

  async function runAll() {
    const onLoginPage = !!document.getElementById('login-form');
    const onAppPage = !!document.getElementById('expense-form');
    const results = [];

    if (onLoginPage) {
      results.push(await testUserRegistration());
      results.push(await testUserLogin());
    } else {
      log.info('Login page not detected; skipping auth tests.');
    }

    if (onAppPage) {
      results.push(await testAddExpense());
      results.push(await testValidateExpenseForm());
      results.push(await testMonthlySummary());
    } else {
      log.info('App page not detected; skipping expense/analytics tests.');
    }

    summary(results, 'Overall Suite');
    return results.every(Boolean);
  }

  window.ExpenseTestSuite = {
    testUserRegistration,
    testUserLogin,
    testAddExpense,
    testValidateExpenseForm,
    testMonthlySummary,
    runAuthTests,
    runExpenseTests,
    runAnalyticsTests,
    runAll,
  };
})();

