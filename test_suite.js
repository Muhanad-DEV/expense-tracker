/**
 * Expense Tracker - Test Suite Runner
 * JUnit-style testing framework
 * 
 * Usage:
 *   1. Load test files in order:
 *      - test_assertions.js
 *      - test_data.js
 *      - test_cases.js
 *      - test_suite.js
 *   
 *   2. Run tests:
 *      TestSuite.runAll()           // Run all tests
 *      TestSuite.runAuthTests()     // Run authentication tests only
 *      TestSuite.runExpenseTests()  // Run expense tests only
 *      TestSuite.runAnalyticsTests() // Run analytics tests only
 */

const TestSuite = {
  /**
   * Run all authentication tests
   */
  async runAuthTests() {
    console.log('\n========================================');
    console.log('Authentication Tests');
    console.log('========================================');
    
    const results = {
      total: 0,
      passed: 0,
      failed: 0
    };

    // Test User Registration
    results.total++;
    try {
      const passed = await TestCases.testUserRegistration();
      if (passed) {
        results.passed++;
        console.log('[PASS] User Registration Test Suite');
      } else {
        results.failed++;
        console.log('[FAIL] User Registration Test Suite');
      }
    } catch (error) {
      results.failed++;
      console.error('[ERROR] User Registration Test Suite:', error);
    }

    // Test User Login
    results.total++;
    try {
      const passed = await TestCases.testUserLogin();
      if (passed) {
        results.passed++;
        console.log('[PASS] User Login Test Suite');
      } else {
        results.failed++;
        console.log('[FAIL] User Login Test Suite');
      }
    } catch (error) {
      results.failed++;
      console.error('[ERROR] User Login Test Suite:', error);
    }

    this.printSummary('Authentication Tests', results);
    return results.failed === 0;
  },

  /**
   * Run all expense management tests
   */
  async runExpenseTests() {
    console.log('\n========================================');
    console.log('Expense Management Tests');
    console.log('========================================');

    // Check if user is logged in
    const auth = localStorage.getItem(TestData.keys.auth);
    if (!auth) {
      console.error('[ERROR] User must be logged in to run expense tests');
      console.log('Please run TestSuite.runAuthTests() first or log in manually');
      return false;
    }

    const results = {
      total: 0,
      passed: 0,
      failed: 0
    };

    // Test Add Expense
    results.total++;
    try {
      const passed = await TestCases.testAddExpense();
      if (passed) {
        results.passed++;
        console.log('[PASS] Add Expense Test Suite');
      } else {
        results.failed++;
        console.log('[FAIL] Add Expense Test Suite');
      }
    } catch (error) {
      results.failed++;
      console.error('[ERROR] Add Expense Test Suite:', error);
    }

    // Test Form Validation
    results.total++;
    try {
      const passed = await TestCases.testValidateExpenseForm();
      if (passed) {
        results.passed++;
        console.log('[PASS] Form Validation Test Suite');
      } else {
        results.failed++;
        console.log('[FAIL] Form Validation Test Suite');
      }
    } catch (error) {
      results.failed++;
      console.error('[ERROR] Form Validation Test Suite:', error);
    }

    this.printSummary('Expense Management Tests', results);
    return results.failed === 0;
  },

  /**
   * Run all analytics tests
   */
  async runAnalyticsTests() {
    console.log('\n========================================');
    console.log('Analytics Tests');
    console.log('========================================');

    // Check if user is logged in
    const auth = localStorage.getItem(TestData.keys.auth);
    if (!auth) {
      console.error('[ERROR] User must be logged in to run analytics tests');
      console.log('Please run TestSuite.runAuthTests() first or log in manually');
      return false;
    }

    const results = {
      total: 0,
      passed: 0,
      failed: 0
    };

    // Test Monthly Summary
    results.total++;
    try {
      const passed = await TestCases.testMonthlySummary();
      if (passed) {
        results.passed++;
        console.log('[PASS] Monthly Summary Test Suite');
      } else {
        results.failed++;
        console.log('[FAIL] Monthly Summary Test Suite');
      }
    } catch (error) {
      results.failed++;
      console.error('[ERROR] Monthly Summary Test Suite:', error);
    }

    this.printSummary('Analytics Tests', results);
    return results.failed === 0;
  },

  /**
   * Run all tests
   */
  async runAll() {
    console.log('\n========================================');
    console.log('Expense Tracker - Complete Test Suite');
    console.log('========================================\n');

    const results = {
      total: 0,
      passed: 0,
      failed: 0
    };

    // Run authentication tests
    const authResults = await this.runAuthTests();
    results.total += 2; // Two test suites
    if (authResults) {
      results.passed += 2;
    } else {
      results.failed += 2;
    }

    // Check if we can proceed with expense tests
    const auth = localStorage.getItem(TestData.keys.auth);
    if (auth) {
      // Run expense tests
      const expenseResults = await this.runExpenseTests();
      results.total += 2; // Two test suites
      if (expenseResults) {
        results.passed += 2;
      } else {
        results.failed += 2;
      }

      // Run analytics tests
      const analyticsResults = await this.runAnalyticsTests();
      results.total += 1; // One test suite
      if (analyticsResults) {
        results.passed += 1;
      } else {
        results.failed += 1;
      }
    } else {
      console.log('\n[SKIP] Expense and Analytics tests require login');
      console.log('Please log in and run TestSuite.runExpenseTests() and TestSuite.runAnalyticsTests()');
    }

    // Final summary
    console.log('\n========================================');
    console.log('Final Test Suite Summary');
    console.log('========================================');
    console.log(`Total Test Suites: ${results.total}`);
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    if (results.total > 0) {
      console.log(`Pass Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
    }
    console.log('========================================\n');

    return results.failed === 0;
  },

  /**
   * Print summary for a test category
   */
  printSummary(category, results) {
    console.log(`\n${category} Summary:`);
    console.log(`  Total: ${results.total}`);
    console.log(`  Passed: ${results.passed}`);
    console.log(`  Failed: ${results.failed}`);
    if (results.total > 0) {
      console.log(`  Pass Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
    }
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TestSuite;
}
