# Database Security Issues for Testing

This document outlines the intentional security vulnerabilities in the Expense Tracker database implementation for testing purposes.

## 🚨 Intentional Security Issues

### 1. **Password Storage Issues**
- **Issue**: Passwords are stored in plain text without hashing
- **Location**: `users` table, `password` column
- **Impact**: Passwords can be easily read from database
- **Testing**: Check if passwords are visible in database files

### 2. **Session Management Issues**
- **Issue**: No session timeout validation
- **Location**: `user_sessions` table validation logic
- **Impact**: Sessions never expire, allowing indefinite access
- **Testing**: Create session and verify it doesn't expire

### 3. **Input Validation Issues**
- **Issue**: No SQL injection protection in queries
- **Location**: All database queries
- **Impact**: Potential SQL injection attacks
- **Testing**: Try SQL injection in form inputs

### 4. **Data Validation Issues**
- **Issue**: Removed CHECK constraints for amount validation
- **Location**: `expenses` table, `amount` column
- **Impact**: Negative amounts and zero amounts are allowed
- **Testing**: Try entering negative or zero amounts

### 5. **Access Control Issues**
- **Issue**: Weak user ID validation in expense operations
- **Location**: Expense CRUD operations
- **Impact**: Potential unauthorized access to other users' data
- **Testing**: Try accessing expenses with different user IDs

## 📊 Database Schema Changes

### New Tables Added:

#### `users` Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY, -- UUID
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- INTENTIONAL: Plain text
  created_at TEXT NOT NULL,
  last_login TEXT,
  is_active INTEGER DEFAULT 1
);
```

#### `user_sessions` Table
```sql
CREATE TABLE user_sessions (
  id TEXT PRIMARY KEY, -- Session ID
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### `expenses` Table (Modified)
```sql
CREATE TABLE expenses (
  id TEXT PRIMARY KEY, -- UUID
  user_id TEXT NOT NULL,
  category TEXT NOT NULL,
  amount REAL NOT NULL, -- INTENTIONAL: No CHECK constraint
  date TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### `user_preferences` Table
```sql
CREATE TABLE user_preferences (
  user_id TEXT PRIMARY KEY,
  currency TEXT DEFAULT 'OMR',
  date_format TEXT DEFAULT 'YYYY-MM-DD',
  theme TEXT DEFAULT 'light',
  notifications INTEGER DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🔧 Database Initialization

### Setup Instructions:
1. Install dependencies: `npm install`
2. Initialize database: `npm run init-db`
3. Start application: `npm start`

### Sample Data Created:
- **User 1**: john@example.com / password123
- **User 2**: jane@example.com / admin

## 🧪 Testing Scenarios

### Password Security Testing:
1. Check if passwords are stored in plain text
2. Verify no password hashing is applied
3. Test weak password acceptance

### Session Security Testing:
1. Create a session and verify it doesn't expire
2. Test session hijacking scenarios
3. Verify no session timeout enforcement

### Data Validation Testing:
1. Enter negative amounts in expenses
2. Enter zero amounts in expenses
3. Test SQL injection in form fields
4. Try accessing other users' data

### Authentication Testing:
1. Test with invalid credentials
2. Test session persistence
3. Test logout functionality
4. Test unauthorized access attempts

## 🛠️ Files Modified for Database Changes:

- `db.sql` - Updated schema with user authentication
- `database.js` - Database service with intentional security issues
- `init_database.js` - Database initialization script
- `package.json` - Added database dependencies
- `DATABASE_SECURITY_ISSUES.md` - This documentation

## 🔒 Security Best Practices (For Reference)

### What Should Be Implemented:
1. **Password Hashing**: Use bcrypt or similar
2. **Session Timeout**: Implement proper session expiration
3. **Input Validation**: Sanitize all user inputs
4. **SQL Injection Protection**: Use parameterized queries
5. **Access Control**: Proper authorization checks
6. **Data Validation**: Enforce business rules in database

### Current Implementation Issues:
- ❌ No password hashing
- ❌ No session timeout
- ❌ No input sanitization
- ❌ No SQL injection protection
- ❌ Weak access control
- ❌ No data validation constraints

These issues are intentionally left for testing and educational purposes.
