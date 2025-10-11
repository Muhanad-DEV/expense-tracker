const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Database setup
const dbPath = './expense_tracker_auth.db';
let db;

// Initialize database
function initDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database');
      
      // Read and execute schema
      const schemaSQL = fs.readFileSync('./db.sql', 'utf8');
      db.exec(schemaSQL, (err) => {
        if (err) {
          console.error('Error executing schema:', err.message);
          reject(err);
          return;
        }
        console.log('Database schema initialized');
        resolve();
      });
    });
  });
}

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
}));
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration with intentional security issues
app.use(session({
  secret: 'expense-tracker-secret-key', // INTENTIONAL: Weak secret
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // INTENTIONAL: Not secure for testing
    httpOnly: false, // INTENTIONAL: Not httpOnly for testing
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    // INTENTIONAL: Weak session validation
    // NOTE: No session timeout check, no proper validation
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
}

// Routes

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    
    // INTENTIONAL VALIDATION ISSUES FOR TESTING:
    // 1. Weak password validation
    // 2. No email format validation
    // 3. No password confirmation validation
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // NOTE: Password confirmation check is intentionally missing
    // NOTE: Email format validation is intentionally missing
    // NOTE: Password strength validation is intentionally missing
    
    // Check if user exists
    db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (row) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      // INTENTIONAL: Store password in plain text for testing
      const userId = uuidv4();
      const now = new Date().toISOString();
      
      db.run(
        'INSERT INTO users (id, name, email, password, created_at, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, name, email, password, now, 1], // INTENTIONAL: Plain text password
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
          }
          
          // Create session
          req.session.userId = userId;
          req.session.userEmail = email;
          
          res.json({ 
            success: true, 
            message: 'User created successfully',
            user: { id: userId, name, email }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // INTENTIONAL VALIDATION ISSUES FOR TESTING:
  // 1. No input sanitization
  // 2. Weak authentication logic
  // 3. No rate limiting
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  // NOTE: Input sanitization is intentionally missing
  // NOTE: Rate limiting is intentionally missing
  
  db.get('SELECT * FROM users WHERE email = ? AND is_active = 1', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // INTENTIONAL: Simple password comparison without hashing
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    db.run('UPDATE users SET last_login = ? WHERE id = ?', [new Date().toISOString(), user.id]);
    
    // Create session
    req.session.userId = user.id;
    req.session.userEmail = user.email;
    
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email }
    });
  });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Expense routes
app.get('/api/expenses', requireAuth, (req, res) => {
  const { month, category, search } = req.query;
  let query = 'SELECT * FROM expenses WHERE user_id = ?';
  let params = [req.session.userId];
  
  // INTENTIONAL: No input sanitization for SQL injection testing
  if (month) {
    query += ' AND substr(date, 1, 7) = ?';
    params.push(month);
  }
  
  if (category) {
    query += ' AND category LIKE ?';
    params.push(`%${category}%`);
  }
  
  if (search) {
    query += ' AND (category LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  
  query += ' ORDER BY date DESC, created_at DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/api/expenses', requireAuth, (req, res) => {
  const { category, amount, date, description } = req.body;
  
  // INTENTIONAL VALIDATION ISSUES FOR TESTING:
  // 1. No amount validation (allows negative/zero)
  // 2. No date validation
  // 3. No input sanitization
  
  if (!category || !amount || !date) {
    return res.status(400).json({ error: 'Category, amount, and date are required' });
  }
  
  // NOTE: Amount validation is intentionally missing
  // NOTE: Date format validation is intentionally missing
  // NOTE: Input sanitization is intentionally missing
  
  const expenseId = uuidv4();
  const now = new Date().toISOString();
  
  db.run(
    'INSERT INTO expenses (id, user_id, category, amount, date, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [expenseId, req.session.userId, category, amount, date, description || '', now, now],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create expense' });
      }
      
      res.json({ 
        success: true, 
        message: 'Expense created successfully',
        expense: { id: expenseId, category, amount, date, description }
      });
    }
  );
});

app.put('/api/expenses/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const { category, amount, date, description } = req.body;
  
  // INTENTIONAL: No proper authorization check
  // NOTE: Should verify expense belongs to user
  
  db.run(
    'UPDATE expenses SET category = ?, amount = ?, date = ?, description = ?, updated_at = ? WHERE id = ? AND user_id = ?',
    [category, amount, date, description || '', new Date().toISOString(), id, req.session.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update expense' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      
      res.json({ success: true, message: 'Expense updated successfully' });
    }
  );
});

app.delete('/api/expenses/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM expenses WHERE id = ? AND user_id = ?', [id, req.session.userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete expense' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json({ success: true, message: 'Expense deleted successfully' });
  });
});

// Statistics routes
app.get('/api/expenses/stats', requireAuth, (req, res) => {
  const { month } = req.query;
  let query = 'SELECT COUNT(*) as total_expenses, SUM(amount) as total_amount, AVG(amount) as average_amount FROM expenses WHERE user_id = ?';
  let params = [req.session.userId];
  
  if (month) {
    query += ' AND substr(date, 1, 7) = ?';
    params.push(month);
  }
  
  db.get(query, params, (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(row);
  });
});

app.get('/api/expenses/categories', requireAuth, (req, res) => {
  const { month } = req.query;
  let query = 'SELECT category, SUM(amount) as total FROM expenses WHERE user_id = ?';
  let params = [req.session.userId];
  
  if (month) {
    query += ' AND substr(date, 1, 7) = ?';
    params.push(month);
  }
  
  query += ' GROUP BY category ORDER BY total DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Database: ${dbPath}`);
      console.log(`🔒 Security Issues: Enabled for testing`);
      console.log(`\n🧪 Test Credentials:`);
      console.log(`   john@example.com / password123`);
      console.log(`   jane@example.com / admin`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
