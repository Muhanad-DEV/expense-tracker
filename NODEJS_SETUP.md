# Node.js Setup Guide

This guide explains how to convert and run the Expense Tracker as a Node.js application.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database
```bash
npm run init-db
```

### 3. Start the Server
```bash
npm start
```

### 4. Access the Application
- **Login Page**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard

## 📁 Project Structure

```
expense-tracker/
├── server.js              # Main Node.js server
├── public/                # Frontend files
│   ├── index.html         # Dashboard
│   ├── login.html         # Login page
│   ├── styles.css         # Styles
│   ├── app.js            # Dashboard logic
│   ├── auth.js           # Authentication logic
│   └── api-client.js     # API client
├── db.sql                # Database schema
├── init_database.js      # Database initialization
├── package.json          # Dependencies
└── expense_tracker_auth.db # SQLite database
```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run init-db` - Initialize database with sample data
- `npm run client` - Start static file server (for development)

## 🗄️ Database Features

### New Database Schema:
- **users** - User management with authentication
- **user_sessions** - Session management
- **expenses** - User-specific expense tracking
- **user_preferences** - User settings

### Sample Data:
- **User 1**: john@example.com / password123
- **User 2**: jane@example.com / admin

## 🔌 API Endpoints

### Authentication:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Expenses:
- `GET /api/expenses` - Get user expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Statistics:
- `GET /api/expenses/stats` - Get expense statistics
- `GET /api/expenses/categories` - Get category totals

## 🚨 Security Issues (Intentional for Testing)

### Authentication Issues:
- Plain text password storage
- No session timeout
- Weak session validation
- No rate limiting

### Data Validation Issues:
- No input sanitization
- SQL injection vulnerabilities
- No amount validation
- No date format validation

### Access Control Issues:
- Weak authorization checks
- Potential data leakage
- No CSRF protection

## 🧪 Testing Scenarios

### 1. Authentication Testing:
- Test with weak passwords
- Test session persistence
- Test logout functionality
- Test unauthorized access

### 2. Data Validation Testing:
- Enter negative amounts
- Enter invalid dates
- Test SQL injection
- Test XSS attacks

### 3. Security Testing:
- Test password security
- Test session management
- Test access control
- Test data isolation

## 🔄 Conversion Benefits

### From Static to Node.js:
- ✅ **Server-side Authentication**: Proper session management
- ✅ **Database Integration**: Real SQLite database
- ✅ **API Architecture**: RESTful API endpoints
- ✅ **User Isolation**: Each user sees only their data
- ✅ **Scalability**: Easy to add more features
- ✅ **Security Testing**: More realistic security scenarios

### Development Features:
- ✅ **Hot Reload**: Nodemon for development
- ✅ **Error Handling**: Proper error responses
- ✅ **Logging**: Server-side logging
- ✅ **Middleware**: Express middleware stack
- ✅ **CORS**: Cross-origin request handling

## 🛠️ Development Workflow

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Make Changes**: Edit files in `public/` or `server.js`

3. **Test Features**: Use the web interface at http://localhost:3000

4. **Check Logs**: Monitor console for errors and requests

## 📊 Database Management

### View Database:
```bash
sqlite3 expense_tracker_auth.db
.tables
SELECT * FROM users;
SELECT * FROM expenses;
```

### Reset Database:
```bash
rm expense_tracker_auth.db
npm run init-db
```

## 🔒 Security Considerations

### Current Issues (For Testing):
- ❌ No password hashing
- ❌ No input validation
- ❌ No SQL injection protection
- ❌ No CSRF protection
- ❌ No rate limiting
- ❌ No session timeout

### Production Recommendations:
- ✅ Use bcrypt for password hashing
- ✅ Implement input validation
- ✅ Use parameterized queries
- ✅ Add CSRF protection
- ✅ Implement rate limiting
- ✅ Add session timeout
- ✅ Use HTTPS in production
- ✅ Implement proper logging

## 🚀 Deployment Options

### Local Development:
```bash
npm start
```

### Production Deployment:
- **Heroku**: Easy deployment with Procfile
- **DigitalOcean**: VPS deployment
- **AWS**: EC2 or Lambda deployment
- **Docker**: Containerized deployment

The Node.js version provides a more realistic and testable environment for security testing and development!
