-- Expense Tracker Database Schema with Authentication
-- SQLite Database

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT 1
);

-- Expenses table (renamed from 'expense' to 'expenses')
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Sample data (optional - for testing)
INSERT OR IGNORE INTO users (id, name, email, password) VALUES 
(1, 'Test User', 'test@example.com', 'password123'),
(2, 'Demo User', 'demo@example.com', 'demo123');

INSERT OR IGNORE INTO expenses (user_id, category, amount, date, description) VALUES 
(1, 'Food', 25.50, '2024-01-15', 'Lunch at restaurant'),
(1, 'Transport', 12.00, '2024-01-15', 'Bus fare'),
(1, 'Entertainment', 45.00, '2024-01-16', 'Movie tickets'),
(2, 'Food', 18.75, '2024-01-16', 'Coffee and snacks'),
(2, 'Shopping', 89.99, '2024-01-17', 'New clothes');

-- Queries for common operations

-- Get all expenses for a user
-- SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC;

-- Get expenses by category for a user
-- SELECT * FROM expenses WHERE user_id = ? AND category = ? ORDER BY date DESC;

-- Get expenses by date range for a user
-- SELECT * FROM expenses WHERE user_id = ? AND date BETWEEN ? AND ? ORDER BY date DESC;

-- Get total expenses by category for a user
-- SELECT category, SUM(amount) as total FROM expenses WHERE user_id = ? GROUP BY category;

-- Get monthly total for a user
-- SELECT strftime('%Y-%m', date) as month, SUM(amount) as total FROM expenses WHERE user_id = ? GROUP BY month ORDER BY month DESC;

-- Update expense
-- UPDATE expenses SET category = ?, amount = ?, date = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?;

-- Delete expense
-- DELETE FROM expenses WHERE id = ? AND user_id = ?;

-- User authentication queries
-- SELECT * FROM users WHERE email = ? AND is_active = 1;
-- UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?;
