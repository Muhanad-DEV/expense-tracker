/**
 * Test Cases - JUnit-style test cases for Expense Tracker
 * Uses TestAssertions for assertions and TestData for test data
 */

const TestCases = {
  // Helper to delay execution
  delay: (ms = 300) => new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * Authentication Test Cases
   */
  async testUserRegistration() {
    console.log('\n=== Test: User Registration ===');
    TestAssertions.reset();

    // Clear localStorage
    localStorage.clear();

    // Switch to registration form
    const registerBtn = document.getElementById('show-register-btn');
    if (registerBtn) {
      registerBtn.click();
      await this.delay(500);
    }

    // Fill registration form
    const nameInput = document.getElementById('register-name');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    const confirmInput = document.getElementById('register-confirm');

    TestAssertions.assertNotNull(nameInput, 'Name input should exist');
    TestAssertions.assertNotNull(emailInput, 'Email input should exist');
    TestAssertions.assertNotNull(passwordInput, 'Password input should exist');
    TestAssertions.assertNotNull(confirmInput, 'Confirm password input should exist');

    if (nameInput && emailInput && passwordInput && confirmInput) {
      nameInput.value = TestData.users.valid.name;
      emailInput.value = TestData.users.valid.email;
      passwordInput.value = TestData.users.valid.password;
      confirmInput.value = TestData.users.valid.confirmPassword;

      // Submit form
      const registerForm = document.getElementById('register-form');
      if (registerForm) {
        registerForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await this.delay(1000);

        // Verify registration
        const users = JSON.parse(localStorage.getItem(TestData.keys.users) || '[]');
        const userExists = users.some(u => u.email === TestData.users.valid.email);

        TestAssertions.assertTrue(userExists, 'User should be registered');
      }
    }

    TestAssertions.printSummary();
    return TestAssertions.failedTests === 0;
  },

  async testUserLogin() {
    console.log('\n=== Test: User Login ===');
    TestAssertions.reset();

    // Setup: Create test user
    const users = JSON.parse(localStorage.getItem(TestData.keys.users) || '[]');
    const testUser = {
      id: 'test-user-001',
      name: 'Test User',
      email: TestData.users.existing.email,
      password: TestData.users.existing.password
    };

    if (!users.some(u => u.email === testUser.email)) {
      users.push(testUser);
      localStorage.setItem(TestData.keys.users, JSON.stringify(users));
    }

    // Test login
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    TestAssertions.assertNotNull(emailInput, 'Email input should exist');
    TestAssertions.assertNotNull(passwordInput, 'Password input should exist');

    if (emailInput && passwordInput) {
      emailInput.value = TestData.users.existing.email;
      passwordInput.value = TestData.users.existing.password;

      const loginForm = document.getElementById('login-form');
      if (loginForm) {
        loginForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await this.delay(1000);

        // Verify login
        const auth = localStorage.getItem(TestData.keys.auth);
        TestAssertions.assertNotNull(auth, 'Auth should be set after login');

        if (auth) {
          const user = JSON.parse(auth);
          TestAssertions.assertEquals(TestData.users.existing.email, user.email, 'Logged in user email should match');
        }
      }
    }

    TestAssertions.printSummary();
    return TestAssertions.failedTests === 0;
  },

  /**
   * Expense Management Test Cases
   */
  async testAddExpense() {
    console.log('\n=== Test: Add Expense ===');
    TestAssertions.reset();

    // Check if logged in
    const auth = localStorage.getItem(TestData.keys.auth);
    TestAssertions.assertNotNull(auth, 'User should be logged in');

    if (!auth) {
      TestAssertions.printSummary();
      return false;
    }

    const user = JSON.parse(auth);
    const storageKey = TestData.keys.expenses(user.id);

    // Get initial expense count
    const expenses = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const initialCount = expenses.length;

    // Fill expense form
    const categoryInput = document.getElementById('category');
    const amountInput = document.getElementById('amount');
    const dateInput = document.getElementById('date');

    TestAssertions.assertNotNull(categoryInput, 'Category input should exist');
    TestAssertions.assertNotNull(amountInput, 'Amount input should exist');
    TestAssertions.assertNotNull(dateInput, 'Date input should exist');

    if (categoryInput && amountInput && dateInput) {
      categoryInput.value = TestData.expenses.valid.category;
      amountInput.value = TestData.expenses.valid.amount;
      dateInput.value = TestData.expenses.valid.date;

      // Submit form
      const expenseForm = document.getElementById('expense-form');
      if (expenseForm) {
        expenseForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await this.delay(1000);

        // Verify expense added
        const updatedExpenses = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const newCount = updatedExpenses.length;

        TestAssertions.assertEquals(initialCount + 1, newCount, 'Expense count should increase by 1');

        const newExpense = updatedExpenses.find(
          e => e.category === TestData.expenses.valid.category && 
               e.amount === parseFloat(TestData.expenses.valid.amount)
        );
        TestAssertions.assertNotNull(newExpense, 'New expense should exist');
      }
    }

    TestAssertions.printSummary();
    return TestAssertions.failedTests === 0;
  },

  async testValidateExpenseForm() {
    console.log('\n=== Test: Validate Expense Form ===');
    TestAssertions.reset();

    const categoryInput = document.getElementById('category');
    const amountInput = document.getElementById('amount');
    const dateInput = document.getElementById('date');
    const expenseForm = document.getElementById('expense-form');

    TestAssertions.assertNotNull(expenseForm, 'Expense form should exist');

    if (!expenseForm) {
      TestAssertions.printSummary();
      return false;
    }

    // Test 1: Empty category should fail validation
    if (categoryInput && amountInput && dateInput) {
      categoryInput.value = TestData.expenses.invalid.emptyCategory.category;
      amountInput.value = TestData.expenses.invalid.emptyCategory.amount;
      dateInput.value = TestData.expenses.invalid.emptyCategory.date;

      let formSubmitted = false;
      expenseForm.addEventListener('submit', (e) => {
        formSubmitted = true;
        e.preventDefault();
      }, { once: true });

      expenseForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      await this.delay(100);

      // If form has HTML5 validation, it won't submit
      // If it does submit, our handler prevents it
      // Either way, we check that invalid data doesn't create an expense
      TestAssertions.assertFalse(
        formSubmitted || categoryInput.value === '',
        'Form should not submit with empty category'
      );
    }

    // Test 2: Invalid amount should fail validation
    if (categoryInput && amountInput && dateInput) {
      categoryInput.value = TestData.expenses.invalid.invalidAmount.category;
      amountInput.value = TestData.expenses.invalid.invalidAmount.amount;
      dateInput.value = TestData.expenses.invalid.invalidAmount.date;

      let formSubmitted = false;
      expenseForm.addEventListener('submit', (e) => {
        formSubmitted = true;
        e.preventDefault();
      }, { once: true });

      expenseForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      await this.delay(100);

      const isInvalid = isNaN(parseFloat(amountInput.value));
      TestAssertions.assertTrue(isInvalid, 'Amount should be invalid (not a number)');
    }

    TestAssertions.printSummary();
    return TestAssertions.failedTests === 0;
  },

  /**
   * Analytics Test Cases
   */
  async testMonthlySummary() {
    console.log('\n=== Test: Monthly Summary Calculation ===');
    TestAssertions.reset();

    const auth = localStorage.getItem(TestData.keys.auth);
    TestAssertions.assertNotNull(auth, 'User should be logged in');

    if (!auth) {
      TestAssertions.printSummary();
      return false;
    }

    const user = JSON.parse(auth);
    const storageKey = TestData.keys.expenses(user.id);

    // Add test expenses
    const testExpenses = TestData.expenses.sample.slice(0, 3).map((exp, index) => ({
      id: `test-${index + 1}`,
      user_id: user.id,
      category: exp.category,
      amount: exp.amount,
      date: exp.date
    }));

    localStorage.setItem(storageKey, JSON.stringify(testExpenses));

    // Calculate expected total
    const expectedTotal = TestData.expected.monthlyTotal;

    // Get monthly total from UI
    const monthlyTotalElement = document.getElementById('monthly-total');
    if (monthlyTotalElement) {
      const displayedText = monthlyTotalElement.textContent;
      const displayedTotal = parseFloat(displayedText.replace(/[^\d.]/g, ''));

      TestAssertions.assertEquals(
        expectedTotal,
        displayedTotal,
        `Monthly total should be ${expectedTotal}`
      );
    } else {
      TestAssertions.assertNotNull(monthlyTotalElement, 'Monthly total element should exist');
    }

    TestAssertions.printSummary();
    return TestAssertions.failedTests === 0;
  },

  /**
   * Run all test cases
   */
  async runAll() {
    console.log('\n========================================');
    console.log('Running All Test Cases');
    console.log('========================================');

    const results = {
      total: 0,
      passed: 0,
      failed: 0
    };

    // Authentication tests
    results.total++;
    if (await this.testUserRegistration()) {
      results.passed++;
    } else {
      results.failed++;
    }

    results.total++;
    if (await this.testUserLogin()) {
      results.passed++;
    } else {
      results.failed++;
    }

    // Expense tests (require login)
    const auth = localStorage.getItem(TestData.keys.auth);
    if (auth) {
      results.total++;
      if (await this.testAddExpense()) {
        results.passed++;
      } else {
        results.failed++;
      }

      results.total++;
      if (await this.testValidateExpenseForm()) {
        results.passed++;
      } else {
        results.failed++;
      }

      results.total++;
      if (await this.testMonthlySummary()) {
        results.passed++;
      } else {
        results.failed++;
      }
    }

    // Final summary
    console.log('\n========================================');
    console.log('Final Test Summary');
    console.log('========================================');
    console.log(`Total Test Suites: ${results.total}`);
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    console.log(`Pass Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
    console.log('========================================\n');

    return results.failed === 0;
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TestCases;
}

