# Authentication System Diagrams

This document contains all the authentication-related diagrams for the Expense Tracker application.

## 1. Authentication Use Case Diagram

```mermaid
graph TB
    User["👤 User"]
    
    subgraph AuthSystem["Authentication System"]
        UC_Login["Login"]
        UC_Register["Create Account"]
        UC_Logout["Logout"]
        UC_Validate["Validate Session"]
    end
    
    subgraph AppSystem["Expense Tracker App"]
        UC_AddExpense["Add Expense"]
        UC_ViewExpenses["View Expenses"]
        UC_EditExpense["Edit Expense"]
        UC_DeleteExpense["Delete Expense"]
    end
    
    User --> UC_Login
    User --> UC_Register
    User --> UC_Logout
    
    UC_Login --> UC_Validate
    UC_Register --> UC_Validate
    UC_Validate --> UC_AddExpense
    UC_Validate --> UC_ViewExpenses
    UC_Validate --> UC_EditExpense
    UC_Validate --> UC_DeleteExpense
    
    UC_Logout -.-> UC_Login : redirect
```

## 2. Authentication Class Diagram

```mermaid
classDiagram
    class User {
        +String id
        +String name
        +String email
        +String password
        +Date createdAt
    }
    
    class AuthService {
        +login(email, password) boolean
        +register(userData) boolean
        +logout() void
        +validateSession() boolean
        +getCurrentUser() User
    }
    
    class Session {
        +String userId
        +String email
        +String name
        +Date loginTime
    }
    
    class ExpenseTracker {
        +addExpense(expense) void
        +getExpenses() Expense[]
        +updateExpense(id, expense) void
        +deleteExpense(id) void
    }
    
    AuthService --> User : manages
    AuthService --> Session : creates
    Session --> ExpenseTracker : authorizes
    User --> ExpenseTracker : owns
```

## 3. Authentication Flow Diagram

```mermaid
flowchart TD
    Start([User visits app]) --> CheckAuth{Is user authenticated?}
    
    CheckAuth -->|No| LoginPage[Show Login Page]
    CheckAuth -->|Yes| MainApp[Show Main App]
    
    LoginPage --> LoginChoice{User action}
    LoginChoice -->|Login| LoginForm[Login Form]
    LoginChoice -->|Register| RegisterForm[Register Form]
    
    LoginForm --> ValidateLogin{Validate credentials}
    ValidateLogin -->|Invalid| LoginError[Show error message]
    ValidateLogin -->|Valid| CreateSession[Create session]
    
    RegisterForm --> ValidateRegister{Validate registration}
    ValidateRegister -->|Invalid| RegisterError[Show error message]
    ValidateRegister -->|Valid| CreateUser[Create user account]
    
    LoginError --> LoginForm
    RegisterError --> RegisterForm
    
    CreateUser --> LoginForm
    CreateSession --> MainApp
    
    MainApp --> LogoutAction{User clicks logout}
    LogoutAction -->|Yes| ClearSession[Clear session]
    LogoutAction -->|No| MainApp
    
    ClearSession --> LoginPage
```

## 4. Authentication State Diagram

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated
    
    Unauthenticated --> LoginPage : visit app
    Unauthenticated --> RegisterPage : click register
    
    LoginPage --> Authenticated : valid login
    LoginPage --> LoginPage : invalid login
    LoginPage --> RegisterPage : click register
    
    RegisterPage --> LoginPage : successful registration
    RegisterPage --> RegisterPage : registration failed
    RegisterPage --> LoginPage : click login
    
    Authenticated --> MainApp : access granted
    Authenticated --> Unauthenticated : logout
    Authenticated --> Unauthenticated : session expired
    
    MainApp --> Authenticated : continue session
    MainApp --> Unauthenticated : logout
```

## 5. Authentication Sequence Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant L as Login Page
    participant A as Auth Service
    participant S as Session Storage
    participant M as Main App
    
    U->>L: Visit app
    L->>A: Check authentication
    A->>S: Get session data
    S-->>A: No session
    A-->>L: Not authenticated
    L-->>U: Show login form
    
    U->>L: Enter credentials
    L->>A: Validate login
    A->>S: Check user data
    S-->>A: User found
    A->>S: Create session
    A-->>L: Login successful
    L-->>M: Redirect to main app
    
    U->>M: Use app features
    M->>A: Validate session
    A->>S: Check session
    S-->>A: Session valid
    A-->>M: User authenticated
    M-->>U: Show protected content
    
    U->>M: Logout
    M->>A: Clear session
    A->>S: Remove session
    A-->>M: Logout complete
    M-->>L: Redirect to login
```

## 6. Security Issues Diagram (Intentional for Testing)

```mermaid
graph TB
    subgraph SecurityIssues["Intentional Security Issues"]
        SI1["Plain text password storage"]
        SI2["No password hashing"]
        SI3["Weak email validation"]
        SI4["No session timeout"]
        SI5["No CSRF protection"]
        SI6["No input sanitization"]
    end
    
    subgraph Vulnerabilities["Potential Vulnerabilities"]
        V1["Password theft"]
        V2["Session hijacking"]
        V3["XSS attacks"]
        V4["Data manipulation"]
    end
    
    SI1 --> V1
    SI2 --> V1
    SI3 --> V4
    SI4 --> V2
    SI5 --> V2
    SI6 --> V3
```

## Code Changes for Authentication Testing

The following intentional authentication issues have been introduced for testing purposes:

### Issues Added:

1. **Password Security Issue**: Passwords are stored in plain text without hashing
2. **Email Validation Issue**: Email format validation is missing or weakened
3. **Session Security Issue**: No session timeout or proper session management
4. **Input Validation Issue**: No proper input sanitization for user data
5. **Authentication Bypass Issue**: Weak authentication checks

### Files Modified:
- `login.html` - Authentication interface
- `auth.js` - Authentication logic with intentional security gaps
- `app.js` - Main app with authentication requirements
- `styles.css` - Authentication page styling

### Testing Scenarios:
- Test with weak passwords
- Test with invalid email formats
- Test session persistence
- Test authentication bypass attempts
- Test input injection attacks

These issues are marked with comments in the code and should be fixed during security testing phases.
