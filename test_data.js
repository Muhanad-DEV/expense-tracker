/**
 * Test Data - Sample data for testing Expense Tracker
 */

const TestData = {
  // User test data
  users: {
    valid: {
      name: 'John Doe',
      email: 'john.doe@test.com',
      password: 'password123',
      confirmPassword: 'password123'
    },
    invalid: {
      name: '',
      email: 'invalid-email',
      password: '123',
      confirmPassword: '456'
    },
    existing: {
      email: 'test@example.com',
      password: 'password123'
    }
  },

  // Expense test data
  expenses: {
    valid: {
      category: 'Food',
      amount: '25.50',
      date: '2025-11-01'
    },
    invalid: {
      emptyCategory: {
        category: '',
        amount: '25.50',
        date: '2025-11-01'
      },
      invalidAmount: {
        category: 'Food',
        amount: 'abc',
        date: '2025-11-01'
      },
      emptyAmount: {
        category: 'Food',
        amount: '',
        date: '2025-11-01'
      }
    },
    sample: [
      { category: 'Food', amount: 25.50, date: '2025-11-01' },
      { category: 'Transport', amount: 10.00, date: '2025-11-05' },
      { category: 'Coffee', amount: 5.50, date: '2025-11-10' },
      { category: 'Food', amount: 15.00, date: '2025-11-15' },
      { category: 'Transport', amount: 5.00, date: '2025-11-20' }
    ]
  },

  // Expected results
  expected: {
    monthlyTotal: 41.00, // Sum of first 3 sample expenses
    foodTotal: 40.50, // Sum of Food expenses
    transportTotal: 15.00, // Sum of Transport expenses
    expenseCount: 3
  },

  // Storage keys
  keys: {
    auth: 'expense-tracker-auth',
    users: 'expense-tracker-users',
    expenses: (userId) => `expense-tracker:v1:${userId}`
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TestData;
}

