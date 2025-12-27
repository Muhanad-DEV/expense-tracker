/**
 * Test Assertions Library - JUnit-style assertions for JavaScript
 * Similar to JUnit's assertEquals, assertTrue, assertFalse, etc.
 */

const TestAssertions = {
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  failures: [],

  /**
   * Reset test counters
   */
  reset() {
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.failures = [];
  },

  /**
   * Assert that two values are equal
   * @param {*} expected - Expected value
   * @param {*} actual - Actual value
   * @param {string} message - Optional failure message
   */
  assertEquals(expected, actual, message = '') {
    this.totalTests++;
    if (expected === actual) {
      this.passedTests++;
      return true;
    } else {
      this.failedTests++;
      const errorMsg = message || `Expected ${expected}, but got ${actual}`;
      this.failures.push(errorMsg);
      console.error(`[FAIL] assertEquals: ${errorMsg}`);
      return false;
    }
  },

  /**
   * Assert that two values are not equal
   * @param {*} expected - Expected value
   * @param {*} actual - Actual value
   * @param {string} message - Optional failure message
   */
  assertNotEquals(expected, actual, message = '') {
    this.totalTests++;
    if (expected !== actual) {
      this.passedTests++;
      return true;
    } else {
      this.failedTests++;
      const errorMsg = message || `Expected values to be different, but both are ${actual}`;
      this.failures.push(errorMsg);
      console.error(`[FAIL] assertNotEquals: ${errorMsg}`);
      return false;
    }
  },

  /**
   * Assert that a value is true
   * @param {boolean} condition - Condition to check
   * @param {string} message - Optional failure message
   */
  assertTrue(condition, message = '') {
    this.totalTests++;
    if (condition === true) {
      this.passedTests++;
      return true;
    } else {
      this.failedTests++;
      const errorMsg = message || `Expected true, but got ${condition}`;
      this.failures.push(errorMsg);
      console.error(`[FAIL] assertTrue: ${errorMsg}`);
      return false;
    }
  },

  /**
   * Assert that a value is false
   * @param {boolean} condition - Condition to check
   * @param {string} message - Optional failure message
   */
  assertFalse(condition, message = '') {
    this.totalTests++;
    if (condition === false) {
      this.passedTests++;
      return true;
    } else {
      this.failedTests++;
      const errorMsg = message || `Expected false, but got ${condition}`;
      this.failures.push(errorMsg);
      console.error(`[FAIL] assertFalse: ${errorMsg}`);
      return false;
    }
  },

  /**
   * Assert that a value is null
   * @param {*} value - Value to check
   * @param {string} message - Optional failure message
   */
  assertNull(value, message = '') {
    this.totalTests++;
    if (value === null) {
      this.passedTests++;
      return true;
    } else {
      this.failedTests++;
      const errorMsg = message || `Expected null, but got ${value}`;
      this.failures.push(errorMsg);
      console.error(`[FAIL] assertNull: ${errorMsg}`);
      return false;
    }
  },

  /**
   * Assert that a value is not null
   * @param {*} value - Value to check
   * @param {string} message - Optional failure message
   */
  assertNotNull(value, message = '') {
    this.totalTests++;
    if (value !== null && value !== undefined) {
      this.passedTests++;
      return true;
    } else {
      this.failedTests++;
      const errorMsg = message || `Expected non-null value, but got ${value}`;
      this.failures.push(errorMsg);
      console.error(`[FAIL] assertNotNull: ${errorMsg}`);
      return false;
    }
  },

  /**
   * Assert that an array contains a specific value
   * @param {Array} array - Array to check
   * @param {*} value - Value to find
   * @param {string} message - Optional failure message
   */
  assertContains(array, value, message = '') {
    this.totalTests++;
    if (Array.isArray(array) && array.includes(value)) {
      this.passedTests++;
      return true;
    } else {
      this.failedTests++;
      const errorMsg = message || `Expected array to contain ${value}`;
      this.failures.push(errorMsg);
      console.error(`[FAIL] assertContains: ${errorMsg}`);
      return false;
    }
  },

  /**
   * Assert that an object has a specific property
   * @param {Object} obj - Object to check
   * @param {string} property - Property name
   * @param {string} message - Optional failure message
   */
  assertHasProperty(obj, property, message = '') {
    this.totalTests++;
    if (obj && obj.hasOwnProperty(property)) {
      this.passedTests++;
      return true;
    } else {
      this.failedTests++;
      const errorMsg = message || `Expected object to have property '${property}'`;
      this.failures.push(errorMsg);
      console.error(`[FAIL] assertHasProperty: ${errorMsg}`);
      return false;
    }
  },

  /**
   * Print test summary
   */
  printSummary() {
    console.log('\n========================================');
    console.log('Test Execution Summary');
    console.log('========================================');
    console.log(`Total Tests: ${this.totalTests}`);
    console.log(`Passed: ${this.passedTests}`);
    console.log(`Failed: ${this.failedTests}`);
    console.log(`Pass Rate: ${((this.passedTests / this.totalTests) * 100).toFixed(1)}%`);
    
    if (this.failures.length > 0) {
      console.log('\nFailures:');
      this.failures.forEach((failure, index) => {
        console.log(`${index + 1}. ${failure}`);
      });
    }
    console.log('========================================\n');
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TestAssertions;
}

