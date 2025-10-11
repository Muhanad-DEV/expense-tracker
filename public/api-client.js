// API Client for Expense Tracker
// This module handles all API communication with the Node.js backend

class ApiClient {
  constructor() {
    this.baseURL = '/api';
  }

  // Helper method for making API requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for session
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST'
    });
  }

  // Expense methods
  async getExpenses(filters = {}) {
    const queryParams = new URLSearchParams();
    
    if (filters.month) queryParams.append('month', filters.month);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.search) queryParams.append('search', filters.search);
    
    const endpoint = `/expenses${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async createExpense(expenseData) {
    return this.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData)
    });
  }

  async updateExpense(id, expenseData) {
    return this.request(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expenseData)
    });
  }

  async deleteExpense(id) {
    return this.request(`/expenses/${id}`, {
      method: 'DELETE'
    });
  }

  // Statistics methods
  async getExpenseStats(month = null) {
    const endpoint = month ? `/expenses/stats?month=${month}` : '/expenses/stats';
    return this.request(endpoint);
  }

  async getCategoryTotals(month = null) {
    const endpoint = month ? `/expenses/categories?month=${month}` : '/expenses/categories';
    return this.request(endpoint);
  }
}

// Create global instance
window.apiClient = new ApiClient();
