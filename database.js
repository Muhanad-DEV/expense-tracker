// Database service module for Expense Tracker
// This module provides database operations with intentional security issues for testing

class DatabaseService {
  constructor() {
    this.db = null;
    this.dbPath = './expense_tracker_auth.db';
  }

  // Initialize database connection
  async init() {
    return new Promise((resolve, reject) => {
      // For browser environment, we'll use localStorage
      // In a real application, this would connect to a proper database
      console.log('Database service initialized (using localStorage for demo)');
      resolve();
    });
  }

  // User Management Methods
  async createUser(userData) {
    // INTENTIONAL SECURITY ISSUE: No password hashing
    const users = this.getUsers();
    const newUser = {
      id: crypto.randomUUID(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // INTENTIONAL: Plain text storage
      created_at: new Date().toISOString(),
      last_login: null,
      is_active: 1
    };
    
    users.push(newUser);
    localStorage.setItem('expense-tracker-users', JSON.stringify(users));
    return newUser;
  }

  async findUserByEmail(email) {
    const users = this.getUsers();
    return users.find(user => user.email === email && user.is_active === 1);
  }

  async updateUserLogin(userId) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.last_login = new Date().toISOString();
      localStorage.setItem('expense-tracker-users', JSON.stringify(users));
    }
  }

  // Session Management Methods
  async createSession(userId) {
    const sessions = this.getSessions();
    const sessionId = crypto.randomUUID();
    const session = {
      id: sessionId,
      user_id: userId,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      is_active: 1
    };
    
    sessions.push(session);
    localStorage.setItem('expense-tracker-sessions', JSON.stringify(sessions));
    return session;
  }

  async validateSession(sessionId) {
    const sessions = this.getSessions();
    const session = sessions.find(s => s.id === sessionId && s.is_active === 1);
    
    if (!session) return null;
    
    // INTENTIONAL SECURITY ISSUE: No session timeout validation
    // NOTE: Session expiration check is intentionally missing
    
    const users = this.getUsers();
    const user = users.find(u => u.id === session.user_id);
    
    return user ? { ...session, user } : null;
  }

  async deactivateSession(sessionId) {
    const sessions = this.getSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      session.is_active = 0;
      localStorage.setItem('expense-tracker-sessions', JSON.stringify(sessions));
    }
  }

  // Expense Management Methods
  async createExpense(userId, expenseData) {
    const expenses = this.getExpenses();
    const newExpense = {
      id: crypto.randomUUID(),
      user_id: userId,
      category: expenseData.category,
      amount: expenseData.amount,
      date: expenseData.date,
      description: expenseData.description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    expenses.push(newExpense);
    localStorage.setItem('expense-tracker-expenses', JSON.stringify(expenses));
    return newExpense;
  }

  async getUserExpenses(userId, filters = {}) {
    let expenses = this.getExpenses().filter(expense => expense.user_id === userId);
    
    // Apply filters
    if (filters.category) {
      expenses = expenses.filter(expense => 
        expense.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }
    
    if (filters.month) {
      expenses = expenses.filter(expense => 
        expense.date.startsWith(filters.month)
      );
    }
    
    if (filters.search) {
      expenses = expenses.filter(expense => 
        expense.category.toLowerCase().includes(filters.search.toLowerCase()) ||
        (expense.description && expense.description.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }
    
    // Sort by date descending
    return expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async updateExpense(userId, expenseId, expenseData) {
    const expenses = this.getExpenses();
    const expense = expenses.find(e => e.id === expenseId && e.user_id === userId);
    
    if (expense) {
      expense.category = expenseData.category;
      expense.amount = expenseData.amount;
      expense.date = expenseData.date;
      expense.description = expenseData.description || '';
      expense.updated_at = new Date().toISOString();
      
      localStorage.setItem('expense-tracker-expenses', JSON.stringify(expenses));
      return expense;
    }
    
    return null;
  }

  async deleteExpense(userId, expenseId) {
    const expenses = this.getExpenses();
    const filteredExpenses = expenses.filter(e => !(e.id === expenseId && e.user_id === userId));
    
    if (filteredExpenses.length < expenses.length) {
      localStorage.setItem('expense-tracker-expenses', JSON.stringify(filteredExpenses));
      return true;
    }
    
    return false;
  }

  async getExpenseStats(userId) {
    const expenses = this.getExpenses().filter(e => e.user_id === userId);
    
    if (expenses.length === 0) {
      return {
        total_expenses: 0,
        total_amount: 0,
        average_amount: 0,
        min_amount: 0,
        max_amount: 0
      };
    }
    
    const amounts = expenses.map(e => parseFloat(e.amount));
    const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);
    
    return {
      total_expenses: expenses.length,
      total_amount: totalAmount,
      average_amount: totalAmount / expenses.length,
      min_amount: Math.min(...amounts),
      max_amount: Math.max(...amounts)
    };
  }

  async getMonthlyTotals(userId) {
    const expenses = this.getExpenses().filter(e => e.user_id === userId);
    const monthlyTotals = {};
    
    expenses.forEach(expense => {
      const month = expense.date.substring(0, 7); // YYYY-MM
      monthlyTotals[month] = (monthlyTotals[month] || 0) + parseFloat(expense.amount);
    });
    
    return Object.entries(monthlyTotals)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => b.month.localeCompare(a.month));
  }

  async getCategoryTotals(userId, month = null) {
    let expenses = this.getExpenses().filter(e => e.user_id === userId);
    
    if (month) {
      expenses = expenses.filter(e => e.date.startsWith(month));
    }
    
    const categoryTotals = {};
    
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + parseFloat(expense.amount);
    });
    
    return Object.entries(categoryTotals)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }

  // User Preferences Methods
  async getUserPreferences(userId) {
    const preferences = this.getUserPreferences();
    return preferences.find(p => p.user_id === userId) || {
      user_id: userId,
      currency: 'OMR',
      date_format: 'YYYY-MM-DD',
      theme: 'light',
      notifications: 1
    };
  }

  async updateUserPreferences(userId, preferences) {
    const allPreferences = this.getUserPreferences();
    const existingIndex = allPreferences.findIndex(p => p.user_id === userId);
    
    const newPreferences = {
      user_id: userId,
      currency: preferences.currency || 'OMR',
      date_format: preferences.date_format || 'YYYY-MM-DD',
      theme: preferences.theme || 'light',
      notifications: preferences.notifications !== undefined ? preferences.notifications : 1
    };
    
    if (existingIndex >= 0) {
      allPreferences[existingIndex] = newPreferences;
    } else {
      allPreferences.push(newPreferences);
    }
    
    localStorage.setItem('expense-tracker-preferences', JSON.stringify(allPreferences));
    return newPreferences;
  }

  // Helper Methods
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem('expense-tracker-users') || '[]');
    } catch (e) {
      return [];
    }
  }

  getSessions() {
    try {
      return JSON.parse(localStorage.getItem('expense-tracker-sessions') || '[]');
    } catch (e) {
      return [];
    }
  }

  getExpenses() {
    try {
      return JSON.parse(localStorage.getItem('expense-tracker-expenses') || '[]');
    } catch (e) {
      return [];
    }
  }

  getUserPreferences() {
    try {
      return JSON.parse(localStorage.getItem('expense-tracker-preferences') || '[]');
    } catch (e) {
      return [];
    }
  }

  // Cleanup expired sessions (should be called periodically)
  async cleanupExpiredSessions() {
    const sessions = this.getSessions();
    const now = new Date().toISOString();
    const activeSessions = sessions.filter(s => s.expires_at > now);
    
    if (activeSessions.length < sessions.length) {
      localStorage.setItem('expense-tracker-sessions', JSON.stringify(activeSessions));
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DatabaseService;
} else {
  window.DatabaseService = DatabaseService;
}
