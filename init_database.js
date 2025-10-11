// Database initialization script for Expense Tracker with Authentication
// This script creates the database with the new schema

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'expense_tracker_auth.db');

// Remove existing database if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Removed existing database file');
}

// Create new database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error creating database:', err.message);
    return;
  }
  console.log('Connected to SQLite database');
});

// Read and execute the SQL schema
const schemaSQL = fs.readFileSync(path.join(__dirname, 'db.sql'), 'utf8');

db.exec(schemaSQL, (err) => {
  if (err) {
    console.error('Error executing schema:', err.message);
    return;
  }
  console.log('Database schema created successfully');
  
  // Insert sample data for testing
  insertSampleData();
});

function insertSampleData() {
  // Sample users (with intentional security issues for testing)
  const sampleUsers = [
    {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123', // INTENTIONAL: Plain text password
      created_at: new Date().toISOString(),
      last_login: null
    },
    {
      id: 'user-2', 
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'admin', // INTENTIONAL: Weak password
      created_at: new Date().toISOString(),
      last_login: null
    }
  ];

  // Insert sample users
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password, created_at, last_login, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  sampleUsers.forEach(user => {
    insertUser.run(
      user.id,
      user.name, 
      user.email,
      user.password, // INTENTIONAL: Storing plain text
      user.created_at,
      user.last_login,
      1
    );
  });

  insertUser.finalize();

  // Sample expenses for user 1
  const sampleExpenses = [
    {
      id: 'expense-1',
      user_id: 'user-1',
      category: 'Food',
      amount: 25.50,
      date: '2024-01-15',
      description: 'Lunch at restaurant',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'expense-2',
      user_id: 'user-1', 
      category: 'Transport',
      amount: 10.00,
      date: '2024-01-16',
      description: 'Taxi fare',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'expense-3',
      user_id: 'user-1',
      category: 'Entertainment',
      amount: 50.00,
      date: '2024-01-17',
      description: 'Movie tickets',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'expense-4',
      user_id: 'user-2',
      category: 'Shopping',
      amount: 75.25,
      date: '2024-01-18',
      description: 'Clothing purchase',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Insert sample expenses
  const insertExpense = db.prepare(`
    INSERT INTO expenses (id, user_id, category, amount, date, description, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  sampleExpenses.forEach(expense => {
    insertExpense.run(
      expense.id,
      expense.user_id,
      expense.category,
      expense.amount,
      expense.date,
      expense.description,
      expense.created_at,
      expense.updated_at
    );
  });

  insertExpense.finalize();

  // Insert user preferences
  const insertPreferences = db.prepare(`
    INSERT INTO user_preferences (user_id, currency, date_format, theme, notifications)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertPreferences.run('user-1', 'OMR', 'YYYY-MM-DD', 'light', 1);
  insertPreferences.run('user-2', 'USD', 'MM/DD/YYYY', 'dark', 0);

  insertPreferences.finalize();

  console.log('Sample data inserted successfully');
  
  // Close database connection
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
      return;
    }
    console.log('Database initialization completed');
    console.log('Database file created:', dbPath);
    console.log('\nSample users created:');
    console.log('1. john@example.com / password123');
    console.log('2. jane@example.com / admin');
    console.log('\nINTENTIONAL SECURITY ISSUES FOR TESTING:');
    console.log('- Passwords stored in plain text');
    console.log('- Weak password validation');
    console.log('- No password hashing');
    console.log('- No session timeout');
  });
}
