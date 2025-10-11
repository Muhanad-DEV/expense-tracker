-- SQLite schema for Expense Tracker
-- Tables
CREATE TABLE IF NOT EXISTS expense (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  amount REAL NOT NULL CHECK (amount > 0),
  date TEXT NOT NULL -- ISO-8601 YYYY-MM-DD
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_expense_date ON expense(date);
CREATE INDEX IF NOT EXISTS idx_expense_category ON expense(category);

-- Sample data removed for clean start

-- Queries
-- 1) List expenses ordered by date desc
SELECT id, date, category, amount FROM expense ORDER BY date DESC, id DESC;

-- 2) Monthly total
SELECT substr(date, 1, 7) AS month, SUM(amount) AS total
FROM expense
GROUP BY month
ORDER BY month DESC;

-- 3) Total by category for a given month (:month = 'YYYY-MM')
SELECT category, SUM(amount) AS total
FROM expense
WHERE substr(date, 1, 7) = :month
GROUP BY category
ORDER BY total DESC;

-- 4) Add expense (parameters: :category, :amount, :date)
INSERT INTO expense (category, amount, date) VALUES (:category, :amount, :date);

-- 5) Delete by id
DELETE FROM expense WHERE id = :id;


