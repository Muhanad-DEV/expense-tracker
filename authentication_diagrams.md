# Authentication System Diagrams

This document contains all the authentication-related diagrams for the Expense Tracker application.

## 1. Authentication Use Case Diagram (Graphviz)

```dot
digraph UseCase {
  rankdir=TB;
  graph [bgcolor="white"];
  node [shape=box, style="rounded,filled", fontsize=12, color="#90A4AE", fontcolor="#263238", fillcolor="#ECEFF1"];
  edge [color="#607D8B", arrowsize=0.8, penwidth=1.3];

  User [label="User", shape=oval, fillcolor="#E3F2FD", color="#2196F3", fontcolor="#0D47A1"];

  subgraph cluster_auth {
    label="Authentication System";
    style="rounded,filled";
    color="#1976D2";
    fillcolor="#E8F0FE";
    UC_Login [label="Login", fillcolor="#BBDEFB", color="#1976D2"];
    UC_Register [label="Create Account", fillcolor="#BBDEFB", color="#1976D2"];
    UC_Logout [label="Logout", fillcolor="#BBDEFB", color="#1976D2"];
    UC_Validate [label="Validate Session", fillcolor="#BBDEFB", color="#1976D2"];
  }

  subgraph cluster_app {
    label="Expense Tracker App";
    style="rounded,filled";
    color="#2E7D32";
    fillcolor="#E8F5E9";
    UC_AddExpense [label="Add Expense", fillcolor="#C8E6C9", color="#2E7D32"];
    UC_ViewExpenses [label="View Expenses", fillcolor="#C8E6C9", color="#2E7D32"];
    UC_EditExpense [label="Edit Expense", fillcolor="#C8E6C9", color="#2E7D32"];
    UC_DeleteExpense [label="Delete Expense", fillcolor="#C8E6C9", color="#2E7D32"];
  }

  User -> UC_Login;
  User -> UC_Register;
  User -> UC_Logout;

  UC_Login -> UC_Validate;
  UC_Register -> UC_Validate;
  UC_Validate -> UC_AddExpense;
  UC_Validate -> UC_ViewExpenses;
  UC_Validate -> UC_EditExpense;
  UC_Validate -> UC_DeleteExpense;

  UC_Logout -> UC_Login [style=dashed, label="redirect", fontsize=10, color="#9E9E9E", fontcolor="#616161"];
}
```

## 2. Authentication Class Diagram (Graphviz)

```dot
digraph ClassDiagram {
  rankdir=LR;
  graph [bgcolor="white"];
  node [shape=record, fontsize=11, style="filled", color="#B0BEC5", fontcolor="#263238", fillcolor="#FAFAFA"];
  edge [color="#78909C", arrowsize=0.8, penwidth=1.3, fontcolor="#455A64"];

  User [label="{User|+ id: String\l+ name: String\l+ email: String\l+ password: String\l+ createdAt: Date\l}", fillcolor="#E3F2FD", color="#1E88E5"];

  AuthService [label="{AuthService|+ login(email, password): boolean\l+ register(userData): boolean\l+ logout(): void\l+ validateSession(): boolean\l+ getCurrentUser(): User\l}", fillcolor="#FFF8E1", color="#FFA000"];

  Session [label="{Session|+ userId: String\l+ email: String\l+ name: String\l+ loginTime: Date\l}", fillcolor="#F3E5F5", color="#8E24AA"];

  ExpenseTracker [label="{ExpenseTracker|+ addExpense(expense): void\l+ getExpenses(): Expense[]\l+ updateExpense(id, expense): void\l+ deleteExpense(id): void\l}", fillcolor="#E8F5E9", color="#2E7D32"];

  AuthService -> User [label="manages", fontsize=10, color="#42A5F5"];
  AuthService -> Session [label="creates", fontsize=10, color="#AB47BC"];
  Session -> ExpenseTracker [label="authorizes", fontsize=10, color="#66BB6A"];
  User -> ExpenseTracker [label="owns", fontsize=10, color="#26A69A"];
}
```

## 3. Authentication Flow Diagram (Graphviz)

```dot
digraph Flow {
  rankdir=TB;
  graph [bgcolor="white"];
  node [shape=rectangle, fontsize=11, style="rounded,filled", color="#B0BEC5", fillcolor="#FAFAFA", fontcolor="#263238"];
  edge [color="#78909C", arrowsize=0.8, penwidth=1.3, fontcolor="#546E7A"];

  Start [label="User visits app", shape=circle, width=0.35, height=0.35, fixedsize=true, fillcolor="#263238", color="#263238", fontcolor="#FFFFFF"];
  CheckAuth [label="Is user authenticated?", shape=diamond, fillcolor="#FFE0B2", color="#F57C00"];
  LoginPage [label="Show Login Page", fillcolor="#E1BEE7", color="#8E24AA"];
  MainApp [label="Show Main App", fillcolor="#C8E6C9", color="#2E7D32"];
  LoginChoice [label="User action", shape=diamond, fillcolor="#FFE0B2", color="#F57C00"];
  LoginForm [label="Login Form", fillcolor="#BBDEFB", color="#1976D2"];
  RegisterForm [label="Register Form", fillcolor="#BBDEFB", color="#1976D2"];
  ValidateLogin [label="Validate credentials", shape=diamond, fillcolor="#FFF59D", color="#FBC02D"];
  LoginError [label="Show error message", fillcolor="#FFCDD2", color="#E53935"];
  CreateSession [label="Create session", fillcolor="#DCEDC8", color="#7CB342"];
  ValidateRegister [label="Validate registration", shape=diamond, fillcolor="#FFF59D", color="#FBC02D"];
  RegisterError [label="Show error message", fillcolor="#FFCDD2", color="#E53935"];
  CreateUser [label="Create user account", fillcolor="#DCEDC8", color="#7CB342"];
  LogoutAction [label="User clicks logout", shape=diamond, fillcolor="#FFE0B2", color="#F57C00"];
  ClearSession [label="Clear session", fillcolor="#E0F2F1", color="#26A69A"];

  Start -> CheckAuth;
  CheckAuth -> LoginPage [label="No", fontsize=10, color="#EF6C00", fontcolor="#5D4037"];
  CheckAuth -> MainApp [label="Yes", fontsize=10, color="#2E7D32", fontcolor="#2E7D32"];

  LoginPage -> LoginChoice;
  LoginChoice -> LoginForm [label="Login", fontsize=10, color="#8E24AA"];
  LoginChoice -> RegisterForm [label="Register", fontsize=10, color="#8E24AA"];

  LoginForm -> ValidateLogin;
  ValidateLogin -> LoginError [label="Invalid", fontsize=10, color="#E53935"];
  ValidateLogin -> CreateSession [label="Valid", fontsize=10, color="#7CB342"];

  RegisterForm -> ValidateRegister;
  ValidateRegister -> RegisterError [label="Invalid", fontsize=10, color="#E53935"];
  ValidateRegister -> CreateUser [label="Valid", fontsize=10, color="#7CB342"];

  LoginError -> LoginForm [color="#9E9E9E"];
  RegisterError -> RegisterForm [color="#9E9E0E"];
  CreateUser -> LoginForm [color="#7CB342"];
  CreateSession -> MainApp [color="#2E7D32"];

  MainApp -> LogoutAction;
  LogoutAction -> ClearSession [label="Yes", fontsize=10, color="#00897B"];
  LogoutAction -> MainApp [label="No", fontsize=10, color="#9E9E9E"];
  ClearSession -> LoginPage [color="#00897B"];
}
```

## 4. Authentication State Diagram (Graphviz)

```dot
digraph State {
  rankdir=LR;
  graph [bgcolor="white"];
  node [shape=ellipse, fontsize=11, style="filled", color="#B0BEC5", fillcolor="#FAFAFA", fontcolor="#263238"];
  edge [color="#78909C", arrowsize=0.8, penwidth=1.3, fontcolor="#546E7A"];

  start [shape=point, color="#263238"];
  Unauth [label="Unauthenticated", fillcolor="#FFECB3", color="#F9A825"];
  LoginPage [label="Login Page", fillcolor="#E1BEE7", color="#8E24AA"];
  RegisterPage [label="Register Page", fillcolor="#E1BEE7", color="#8E24AA"];
  Auth [label="Authenticated", fillcolor="#C8E6C9", color="#2E7D32"];
  MainApp [label="Main App", fillcolor="#E0F7FA", color="#00838F"];

  start -> Unauth [color="#455A64"];

  Unauth -> LoginPage [label="visit app", fontsize=10, color="#5E35B1"];
  Unauth -> RegisterPage [label="click register", fontsize=10, color="#5E35B1"];

  LoginPage -> Auth [label="valid login", fontsize=10, color="#43A047"];
  LoginPage -> LoginPage [label="invalid login", fontsize=10, color="#E53935"];
  LoginPage -> RegisterPage [label="click register", fontsize=10, color="#5E35B1"];

  RegisterPage -> LoginPage [label="successful registration", fontsize=10, color="#43A047"];
  RegisterPage -> RegisterPage [label="registration failed", fontsize=10, color="#E53935"];
  RegisterPage -> LoginPage [label="click login", fontsize=10, color="#5E35B1"];

  Auth -> MainApp [label="access granted", fontsize=10, color="#2E7D32"];
  Auth -> Unauth [label="logout", fontsize=10, color="#F4511E"];
  Auth -> Unauth [label="session expired", fontsize=10, style=dashed, color="#9E9E9E"];

  MainApp -> Auth [label="continue session", fontsize=10, color="#00838F"];
  MainApp -> Unauth [label="logout", fontsize=10, color="#F4511E"];
}
```

## 5. Authentication Sequence Diagram (Graphviz)

```dot
digraph Sequence {
  // Layout
  rankdir=LR;
  graph [bgcolor="white", ranksep="1.8", nodesep="1.2", pad="0.6", dpi="150", splines=ortho, labelloc=t, fontsize=12];
  node [shape=plaintext, fontsize=11, fontcolor="#263238"];
  edge [color="#78909C", arrowsize=0.9, penwidth=1.4, fontcolor="#455A64", fontsize=10, minlen=2];

  // Participants
  U [label=<
    <TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" COLOR="#1E88E5">
      <TR><TD BGCOLOR="#E3F2FD" WIDTH="140" ALIGN="CENTER"><B>User</B></TD></TR>
    </TABLE>
  >];
  L [label=<
    <TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" COLOR="#8E24AA">
      <TR><TD BGCOLOR="#F3E5F5" WIDTH="180" ALIGN="CENTER"><B>Login Page</B></TD></TR>
    </TABLE>
  >];
  A [label=<
    <TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" COLOR="#FFA000">
      <TR><TD BGCOLOR="#FFF8E1" WIDTH="180" ALIGN="CENTER"><B>Auth Service</B></TD></TR>
    </TABLE>
  >];
  S [label=<
    <TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" COLOR="#00897B">
      <TR><TD BGCOLOR="#E0F2F1" WIDTH="200" ALIGN="CENTER"><B>Session Storage</B></TD></TR>
    </TABLE>
  >];
  M [label=<
    <TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" COLOR="#2E7D32">
      <TR><TD BGCOLOR="#E8F5E9" WIDTH="160" ALIGN="CENTER"><B>Main App</B></TD></TR>
    </TABLE>
  >];

  {rank=same; U; L; A; S; M}

  // Strong spacing between columns
  U -> L [style=invis, weight=30];
  L -> A [style=invis, weight=30];
  A -> S [style=invis, weight=30];
  S -> M [style=invis, weight=30];

  // Visit & auth check
  U -> L [label="Visit app", color="#1E88E5"];
  L -> A [label="Check authentication", color="#8E24AA"];
  A -> S [label="Get session data", color="#FFA000"];
  S -> A [label="No session", style=dashed, color="#00897B", constraint=false];
  A -> L [label="Not authenticated", style=dashed, color="#FFA000", constraint=false];
  L -> U [label="Show login form", style=dashed, color="#8E24AA", constraint=false];

  // Login
  U -> L [label="Enter credentials", color="#1E88E5"];
  L -> A [label="Validate login", color="#8E24AA"];
  A -> S [label="Check user data", color="#FFA000"];
  S -> A [label="User found", style=dashed, color="#00897B", constraint=false];
  A -> S [label="Create session", color="#FFA000"];
  A -> L [label="Login successful", style=dashed, color="#43A047", constraint=false];
  L -> M [label="Redirect to main app", style=dashed, color="#2E7D32", constraint=false];

  // Authenticated usage
  U -> M [label="Use app features", color="#2E7D32"];
  M -> A [label="Validate session", color="#00838F"];
  A -> S [label="Check session", color="#FFA000"];
  S -> A [label="Session valid", style=dashed, color="#00897B", constraint=false];
  A -> M [label="User authenticated", style=dashed, color="#2E7D32", constraint=false];
  M -> U [label="Show protected content", style=dashed, color="#1E88E5", constraint=false];

  // Logout
  U -> M [label="Logout", color="#EF5350"];
  M -> A [label="Clear session", color="#00897B"];
  A -> S [label="Remove session", color="#FFA000"];
  A -> M [label="Logout complete", style=dashed, color="#43A047", constraint=false];
  M -> L [label="Redirect to login", style=dashed, color="#8E24AA", constraint=false];
}
```

## 6. Security Issues Diagram (Graphviz)

```dot
digraph Security {
  rankdir=LR;
  graph [bgcolor="white"];
  node [shape=box, style="rounded,filled", fontsize=11, color="#B0BEC5", fontcolor="#263238", fillcolor="#FAFAFA"];
  edge [arrowsize=0.8, penwidth=1.6, color="#B71C1C", fontcolor="#B71C1C"];

  subgraph cluster_issues {
    label="Intentional Security Issues";
    style="rounded,filled";
    color="#C62828";
    fillcolor="#FFEBEE";
    SI1 [label="Plain text password storage", fillcolor="#FFCDD2", color="#C62828"];
    SI2 [label="No password hashing", fillcolor="#FFCDD2", color="#C62828"];
    SI3 [label="Weak email validation", fillcolor="#FFCDD2", color="#C62828"];
    SI4 [label="No session timeout", fillcolor="#FFCDD2", color="#C62828"];
    SI5 [label="No CSRF protection", fillcolor="#FFCDD2", color="#C62828"];
    SI6 [label="No input sanitization", fillcolor="#FFCDD2", color="#C62828"];
  }

  subgraph cluster_vuln {
    label="Potential Vulnerabilities";
    style="rounded,filled";
    color="#F9A825";
    fillcolor="#FFFDE7";
    V1 [label="Password theft", fillcolor="#FFF59D", color="#F9A825"];
    V2 [label="Session hijacking", fillcolor="#FFF59D", color="#F9A825"];
    V3 [label="XSS attacks", fillcolor="#FFF59D", color="#F9A825"];
    V4 [label="Data manipulation", fillcolor="#FFF59D", color="#F9A825"];
  }

  SI1 -> V1;
  SI2 -> V1;
  SI3 -> V4;
  SI4 -> V2;
  SI5 -> V2;
  SI6 -> V3;
}
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
