-- SQLite schema for Expense Tracker with Authentication
-- User Management Tables
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- UUID
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- INTENTIONAL: Plain text for testing purposes
  created_at TEXT NOT NULL, -- ISO-8601 timestamp
  last_login TEXT, -- ISO-8601 timestamp
  is_active INTEGER DEFAULT 1 -- 1 = active, 0 = inactive
);

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY, -- Session ID
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL, -- ISO-8601 timestamp
  expires_at TEXT NOT NULL, -- ISO-8601 timestamp
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Modified Expense Table with User Association
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY, -- UUID
  user_id TEXT NOT NULL,
  category TEXT NOT NULL,
  amount REAL NOT NULL, -- INTENTIONAL: Removed CHECK constraint for testing
  date TEXT NOT NULL, -- ISO-8601 YYYY-MM-DD
  description TEXT, -- Optional description
  created_at TEXT NOT NULL, -- ISO-8601 timestamp
  updated_at TEXT NOT NULL, -- ISO-8601 timestamp
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id TEXT PRIMARY KEY,
  currency TEXT DEFAULT 'OMR',
  date_format TEXT DEFAULT 'YYYY-MM-DD',
  theme TEXT DEFAULT 'light',
  notifications INTEGER DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_expenses_user ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date);

-- Sample data removed for clean start

-- Note: The following are example queries for reference only
-- They should not be executed during schema creation

/*
-- Authentication Queries
-- 1) Create new user
INSERT INTO users (id, name, email, password, created_at) 
VALUES (:id, :name, :email, :password, :created_at);

-- 2) Find user by email
SELECT id, name, email, password, created_at, last_login, is_active 
FROM users WHERE email = :email AND is_active = 1;

-- 3) Update last login
UPDATE users SET last_login = :last_login WHERE id = :user_id;

-- 4) Create user session
INSERT INTO user_sessions (id, user_id, created_at, expires_at) 
VALUES (:session_id, :user_id, :created_at, :expires_at);

-- 5) Validate session
SELECT s.id, s.user_id, s.expires_at, u.name, u.email 
FROM user_sessions s 
JOIN users u ON s.user_id = u.id 
WHERE s.id = :session_id AND s.is_active = 1 AND s.expires_at > :current_time;

-- 6) Deactivate session (logout)
UPDATE user_sessions SET is_active = 0 WHERE id = :session_id;

-- 7) Clean expired sessions
DELETE FROM user_sessions WHERE expires_at < :current_time;

-- Expense Management Queries (User-Specific)
-- 8) List user expenses ordered by date desc
SELECT id, date, category, amount, description, created_at, updated_at 
FROM expenses 
WHERE user_id = :user_id 
ORDER BY date DESC, created_at DESC;

-- 9) Monthly total for user
SELECT substr(date, 1, 7) AS month, SUM(amount) AS total
FROM expenses
WHERE user_id = :user_id
GROUP BY month
ORDER BY month DESC;

-- 10) Total by category for a given month and user
SELECT category, SUM(amount) AS total
FROM expenses
WHERE user_id = :user_id AND substr(date, 1, 7) = :month
GROUP BY category
ORDER BY total DESC;

-- 11) Add expense for user
INSERT INTO expenses (id, user_id, category, amount, date, description, created_at, updated_at) 
VALUES (:id, :user_id, :category, :amount, :date, :description, :created_at, :updated_at);

-- 12) Update expense
UPDATE expenses 
SET category = :category, amount = :amount, date = :date, description = :description, updated_at = :updated_at 
WHERE id = :id AND user_id = :user_id;

-- 13) Delete expense by id (user-specific)
DELETE FROM expenses WHERE id = :id AND user_id = :user_id;

-- 14) Get user preferences
SELECT currency, date_format, theme, notifications 
FROM user_preferences 
WHERE user_id = :user_id;

-- 15) Update user preferences
INSERT OR REPLACE INTO user_preferences (user_id, currency, date_format, theme, notifications) 
VALUES (:user_id, :currency, :date_format, :theme, :notifications);

-- 16) Search expenses by category (user-specific)
SELECT id, date, category, amount, description 
FROM expenses 
WHERE user_id = :user_id AND category LIKE :search_term 
ORDER BY date DESC;

-- 17) Get expense statistics for user
SELECT 
  COUNT(*) as total_expenses,
  SUM(amount) as total_amount,
  AVG(amount) as average_amount,
  MIN(amount) as min_amount,
  MAX(amount) as max_amount
FROM expenses 
WHERE user_id = :user_id;

-- 18) Get monthly expense trend for user
SELECT 
  substr(date, 1, 7) AS month,
  COUNT(*) as expense_count,
  SUM(amount) as total_amount
FROM expenses 
WHERE user_id = :user_id 
GROUP BY month 
ORDER BY month DESC 
LIMIT 12;
*/


