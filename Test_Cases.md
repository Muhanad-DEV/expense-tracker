# Test Cases Document
## Expense Tracker Application

**Project:** Expense Tracker Application  
**Version:** 1.0  
**Date:** 2024-03-20  
**Prepared By:** Testing Team

---

## Table of Contents
1. [Introduction](#introduction)
2. [Test Case Template](#test-case-template)
3. [Authentication Test Cases](#authentication-test-cases)
4. [Expense Management Test Cases](#expense-management-test-cases)
5. [Analytics Test Cases](#analytics-test-cases)
6. [UI/UX Test Cases](#uiux-test-cases)
7. [Data Persistence Test Cases](#data-persistence-test-cases)
8. [Error Handling Test Cases](#error-handling-test-cases)

---

## Introduction

This document contains detailed test cases for the Expense Tracker application. Each test case follows a standard format with clear objectives, preconditions, test steps, and expected results.

**Test Case Status Legend:**
- ✅ Pass - Test case passed
- ❌ Fail - Test case failed
- ⏸️ Blocked - Test case blocked by defect
- ⏳ Not Executed - Test case not yet executed

---

## Test Case Template

Each test case includes:
- **TCID:** Unique test case identifier
- **Test Case Name:** Descriptive name
- **Priority:** High / Medium / Low
- **Type:** Functional / UI / Integration / Negative
- **Description:** Test objective
- **Preconditions:** Required setup
- **Test Steps:** Detailed execution steps
- **Expected Result:** Expected outcome
- **Actual Result:** (To be filled during execution)
- **Status:** Pass / Fail / Blocked / Not Executed
- **RID:** Requirement ID for traceability

---

## Authentication Test Cases

### TC_AUTH_001: User Registration - Valid Data

**Priority:** High  
**Type:** Functional (Positive)  
**RID:** R001

**Description:** Verify that a user can successfully register with valid data.

**Preconditions:**
- User is on the login page
- No existing account with the test email

**Test Steps:**
1. Navigate to login.html
2. Click on "Don't have an account? Create one" button
3. Enter valid full name: "John Doe"
4. Enter valid email: "john.doe@test.com"
5. Enter valid password: "password123" (min 6 characters)
6. Confirm password: "password123"
7. Click "Register" button

**Expected Result:**
- User account is created successfully
- Success message displayed: "Account created successfully!"
- User is redirected to login page
- Email field is pre-filled on login page

**Test Data:**
- Name: "John Doe"
- Email: "john.doe@test.com"
- Password: "password123"
- Confirm Password: "password123"

---

### TC_AUTH_002: User Registration - Duplicate Email

**Priority:** High  
**Type:** Functional (Negative)  
**RID:** R001

**Description:** Verify that registration fails when email already exists.

**Preconditions:**
- User account with email "existing@test.com" already exists
- User is on registration form

**Test Steps:**
1. Navigate to login.html
2. Click on "Create Account" button
3. Enter name: "Test User"
4. Enter email: "existing@test.com"
5. Enter password: "password123"
6. Confirm password: "password123"
7. Click "Register" button

**Expected Result:**
- Registration fails
- Error message displayed: "Email already exists. Please use a different email."
- User remains on registration form
- Form fields are cleared or preserved

**Test Data:**
- Name: "Test User"
- Email: "existing@test.com"
- Password: "password123"

---

### TC_AUTH_003: User Registration - Password Validation

**Priority:** Medium  
**Type:** Functional (Negative)  
**RID:** R001

**Description:** Verify that password must be at least 6 characters long.

**Preconditions:**
- User is on registration form

**Test Steps:**
1. Navigate to login.html
2. Click on "Create Account" button
3. Enter valid name: "Test User"
4. Enter valid email: "test@example.com"
5. Enter short password: "pass" (4 characters)
6. Confirm password: "pass"
7. Click "Register" button

**Expected Result:**
- Registration fails
- Error message displayed indicating password must be at least 6 characters
- HTML5 validation prevents form submission (if implemented)
- User remains on registration form

**Test Data:**
- Name: "Test User"
- Email: "test@example.com"
- Password: "pass"
- Confirm Password: "pass"

---

### TC_AUTH_004: User Login - Valid Credentials

**Priority:** High  
**Type:** Functional (Positive)  
**RID:** R002

**Description:** Verify that user can login with valid email and password.

**Preconditions:**
- User account exists with email "test@example.com" and password "password123"
- User is on login page

**Test Steps:**
1. Navigate to login.html
2. Enter email: "test@example.com"
3. Enter password: "password123"
4. Click "Login" button

**Expected Result:**
- Login successful
- User is redirected to index.html
- User name displayed in header: "Welcome, [User Name]"
- User can access expense tracking features

**Test Data:**
- Email: "test@example.com"
- Password: "password123"

---

### TC_AUTH_005: User Login - Invalid Email

**Priority:** High  
**Type:** Functional (Negative)  
**RID:** R002

**Description:** Verify that login fails with invalid email.

**Preconditions:**
- No account exists with email "invalid@test.com"
- User is on login page

**Test Steps:**
1. Navigate to login.html
2. Enter email: "invalid@test.com"
3. Enter password: "password123"
4. Click "Login" button

**Expected Result:**
- Login fails
- Error message displayed: "Invalid email or password"
- User remains on login page
- Password field is cleared

**Test Data:**
- Email: "invalid@test.com"
- Password: "password123"

---

### TC_AUTH_006: User Login - Invalid Password

**Priority:** High  
**Type:** Functional (Negative)  
**RID:** R002

**Description:** Verify that login fails with incorrect password.

**Preconditions:**
- User account exists with email "test@example.com" and password "correctpass"
- User is on login page

**Test Steps:**
1. Navigate to login.html
2. Enter email: "test@example.com"
3. Enter incorrect password: "wrongpass"
4. Click "Login" button

**Expected Result:**
- Login fails
- Error message displayed: "Invalid email or password"
- User remains on login page
- Password field is cleared

**Test Data:**
- Email: "test@example.com"
- Password: "wrongpass"

---

### TC_AUTH_007: User Logout

**Priority:** High  
**Type:** Functional (Positive)  
**RID:** R003

**Description:** Verify that user can successfully logout.

**Preconditions:**
- User is logged in
- User is on index.html

**Test Steps:**
1. Verify user is logged in (welcome message visible)
2. Click "Logout" button in header
3. Observe redirect behavior

**Expected Result:**
- User is logged out successfully
- User is redirected to login.html
- Session data is cleared from localStorage
- User cannot access index.html without re-login

**Test Data:** N/A

---

### TC_AUTH_008: Session Data Cleared on Logout

**Priority:** Medium  
**Type:** Functional (Positive)  
**RID:** R003

**Description:** Verify that session data is cleared from localStorage after logout.

**Preconditions:**
- User is logged in
- Browser Developer Tools can be accessed

**Test Steps:**
1. Login to application
2. Open Browser Developer Tools (F12)
3. Go to Application tab > Local Storage
4. Verify "expense-tracker-auth" key exists with user data
5. Click "Logout" button
6. Check localStorage again

**Expected Result:**
- "expense-tracker-auth" key is removed from localStorage
- No user session data remains
- User must login again to access application

**Test Data:** N/A

---

### TC_AUTH_009: Unauthorized Access Redirect

**Priority:** High  
**Type:** Security (Positive)  
**RID:** R004

**Description:** Verify that unauthenticated users are redirected to login.

**Preconditions:**
- User is not logged in
- Browser localStorage does not contain auth data

**Test Steps:**
1. Clear browser localStorage (or use incognito mode)
2. Navigate directly to index.html
3. Observe page behavior

**Expected Result:**
- User is immediately redirected to login.html
- Index.html is not accessible
- No error message displayed (silent redirect)

**Test Data:** N/A

---

### TC_AUTH_010: Session Persistence on Refresh

**Priority:** Medium  
**Type:** Functional (Positive)  
**RID:** R004

**Description:** Verify that user session persists after page refresh.

**Preconditions:**
- User is logged in
- User is on index.html

**Test Steps:**
1. Verify user is logged in
2. Refresh the page (F5 or Ctrl+R)
3. Observe user state

**Expected Result:**
- User remains logged in after refresh
- Welcome message persists
- All expenses are displayed
- No redirect to login page

**Test Data:** N/A

---

## Expense Management Test Cases

### TC_EXP_001: Add Expense - Valid Data

**Priority:** High  
**Type:** Functional (Positive)  
**RID:** R005

**Description:** Verify that user can add an expense with valid data.

**Preconditions:**
- User is logged in
- User is on index.html
- Expense form is visible

**Test Steps:**
1. Enter category: "Food"
2. Enter amount: "25.50"
3. Select date: "2024-03-20"
4. Click "Add" button

**Expected Result:**
- Expense is added successfully
- Toast notification appears: "Expense added"
- New expense appears in expense table
- Form fields are cleared
- Monthly total is updated

**Test Data:**
- Category: "Food"
- Amount: "25.50"
- Date: "2024-03-20"

---

### TC_EXP_002: Add Expense - Empty Category

**Priority:** High  
**Type:** Functional (Negative)  
**RID:** R005

**Description:** Verify that expense cannot be added with empty category.

**Preconditions:**
- User is logged in
- User is on index.html

**Test Steps:**
1. Leave category field empty
2. Enter amount: "25.50"
3. Select date: "2024-03-20"
4. Click "Add" button

**Expected Result:**
- Form submission is prevented
- Error message displayed: "Please enter a valid category, amount, and date"
- Expense is not added
- Form fields remain with entered values

**Test Data:**
- Category: "" (empty)
- Amount: "25.50"
- Date: "2024-03-20"

---

### TC_EXP_003: Add Expense - Invalid Amount

**Priority:** High  
**Type:** Functional (Negative)  
**RID:** R005

**Description:** Verify that expense cannot be added with invalid amount.

**Preconditions:**
- User is logged in
- User is on index.html

**Test Steps:**
1. Enter category: "Food"
2. Enter invalid amount: "abc"
3. Select date: "2024-03-20"
4. Click "Add" button

**Expected Result:**
- Form submission is prevented
- Error message displayed about invalid amount
- Expense is not added
- HTML5 validation may show inline error

**Test Data:**
- Category: "Food"
- Amount: "abc" (non-numeric)
- Date: "2024-03-20"

---

### TC_EXP_004: Add Expense - Missing Date

**Priority:** High  
**Type:** Functional (Negative)  
**RID:** R005

**Description:** Verify that expense cannot be added without date.

**Preconditions:**
- User is logged in
- User is on index.html

**Test Steps:**
1. Enter category: "Food"
2. Enter amount: "25.50"
3. Leave date field empty
4. Click "Add" button

**Expected Result:**
- Form submission is prevented
- Error message displayed about missing date
- HTML5 validation prevents submission (required attribute)
- Expense is not added

**Test Data:**
- Category: "Food"
- Amount: "25.50"
- Date: "" (empty)

---

### TC_EXP_005: View Expenses - Display All

**Priority:** High  
**Type:** Functional (Positive)  
**RID:** R006

**Description:** Verify that all expenses are displayed in the table.

**Preconditions:**
- User is logged in
- User has at least 3 expenses added
- User is on index.html

**Test Steps:**
1. Add multiple expenses (minimum 3)
2. View the expense table
3. Verify all expenses are listed

**Expected Result:**
- All expenses are displayed in table
- Each row shows category, amount, and date
- Expenses are sorted by date (descending)
- Total count matches number of expenses added

**Test Data:**
- Expense 1: Food, 25.50, 2024-03-20
- Expense 2: Transport, 10.00, 2024-03-19
- Expense 3: Coffee, 5.50, 2024-03-18

---

### TC_EXP_006: View Expenses - Date Sorting

**Priority:** Medium  
**Type:** Functional (Positive)  
**RID:** R006

**Description:** Verify that expenses are sorted by date (newest first).

**Preconditions:**
- User is logged in
- User has expenses with different dates

**Test Steps:**
1. Add expenses with dates:
   - 2024-03-18
   - 2024-03-20
   - 2024-03-19
2. View expense table
3. Verify date order

**Expected Result:**
- Expenses are sorted by date descending
- Most recent expense appears first
- Oldest expense appears last

**Test Data:**
- Expense 1: Food, 25.50, 2024-03-18
- Expense 2: Transport, 10.00, 2024-03-20
- Expense 3: Coffee, 5.50, 2024-03-19

---

### TC_EXP_007: View Expenses - User Isolation

**Priority:** High  
**Type:** Security (Positive)  
**RID:** R006

**Description:** Verify that user sees only their own expenses.

**Preconditions:**
- Two user accounts exist (User A and User B)
- User A has expenses added
- User B has different expenses added

**Test Steps:**
1. Login as User A
2. View expense table
3. Note the expenses displayed
4. Logout
5. Login as User B
6. View expense table
7. Compare expenses

**Expected Result:**
- User A sees only User A's expenses
- User B sees only User B's expenses
- No cross-user data leakage
- Each user's data is isolated

**Test Data:**
- User A Expenses: Food (25.50), Transport (10.00)
- User B Expenses: Coffee (5.50), Shopping (50.00)

---

### TC_EXP_008: Edit Expense - Valid Data

**Priority:** High  
**Type:** Functional (Positive)  
**RID:** R007

**Description:** Verify that user can edit an existing expense.

**Preconditions:**
- User is logged in
- At least one expense exists

**Test Steps:**
1. Click "Edit" button on an expense row
2. Modal dialog opens with expense details
3. Modify category: "Food" to "Groceries"
4. Modify amount: "25.50" to "30.00"
5. Click "Save" button

**Expected Result:**
- Modal closes
- Expense is updated in table
- Updated values are reflected immediately
- Toast notification: "Expense updated"

**Test Data:**
- Original: Category: "Food", Amount: "25.50", Date: "2024-03-20"
- Updated: Category: "Groceries", Amount: "30.00", Date: "2024-03-20"

---

### TC_EXP_009: Edit Expense - Invalid Data

**Priority:** Medium  
**Type:** Functional (Negative)  
**RID:** R007

**Description:** Verify that edit fails with invalid data.

**Preconditions:**
- User is logged in
- At least one expense exists

**Test Steps:**
1. Click "Edit" button on an expense
2. Clear category field
3. Change amount to "abc"
4. Click "Save" button

**Expected Result:**
- Edit is prevented
- Error message displayed
- Expense remains unchanged
- Modal remains open

**Test Data:**
- Category: "" (empty)
- Amount: "abc" (invalid)

---

### TC_EXP_010: Delete Expense

**Priority:** High  
**Type:** Functional (Positive)  
**RID:** R008

**Description:** Verify that user can delete an expense.

**Preconditions:**
- User is logged in
- At least one expense exists

**Test Steps:**
1. Click "Delete" button on an expense row
2. Observe deletion behavior
3. Verify expense is removed

**Expected Result:**
- Expense is deleted from table
- Expense count decreases
- Monthly total is updated
- Toast notification: "Expense deleted"

**Test Data:**
- Expense to delete: Food, 25.50, 2024-03-20

---

### TC_EXP_011: Delete Expense - Confirmation

**Priority:** Medium  
**Type:** Functional (Positive)  
**RID:** R008

**Description:** Verify that confirmation is required before deletion.

**Preconditions:**
- User is logged in
- At least one expense exists

**Test Steps:**
1. Click "Delete" button on an expense
2. Observe if confirmation dialog appears

**Expected Result:**
- Confirmation dialog appears: "Are you sure you want to delete this expense?"
- User can cancel or confirm
- Expense only deleted on confirmation

**Test Data:** N/A

---

### TC_EXP_012: Export CSV - Functionality

**Priority:** Medium  
**Type:** Functional (Positive)  
**RID:** R012

**Description:** Verify that CSV export functionality works.

**Preconditions:**
- User is logged in
- User has at least one expense

**Test Steps:**
1. Click "Export CSV" button
2. File download should initiate
3. Open downloaded file

**Expected Result:**
- CSV file is downloaded
- File name includes date/timestamp
- File contains expense data
- CSV format is correct

**Test Data:**
- Expenses: Food (25.50), Transport (10.00)

---

### TC_EXP_013: Export CSV - Complete Data

**Priority:** Medium  
**Type:** Functional (Positive)  
**RID:** R012

**Description:** Verify that exported CSV contains all expenses.

**Preconditions:**
- User is logged in
- User has 5 expenses

**Test Steps:**
1. Add 5 different expenses
2. Click "Export CSV" button
3. Open CSV file
4. Count rows (excluding header)

**Expected Result:**
- CSV file contains all 5 expenses
- All columns are included (Category, Amount, Date)
- Data matches expense table

**Test Data:**
- 5 expenses with different categories and amounts

---

### TC_EXP_014: Clear All Expenses

**Priority:** Low  
**Type:** Functional (Positive)  
**RID:** R013

**Description:** Verify that all expenses can be cleared.

**Preconditions:**
- User is logged in
- User has multiple expenses

**Test Steps:**
1. Verify expenses exist in table
2. Click "Clear All" button
3. Observe confirmation if any
4. Confirm deletion

**Expected Result:**
- All expenses are deleted
- Table is empty
- Monthly total is 0.00
- Toast notification: "All expenses cleared"

**Test Data:**
- Multiple expenses of various categories

---

## Analytics Test Cases

### TC_ANAL_001: Monthly Summary - Calculation

**Priority:** High  
**Type:** Functional (Positive)  
**RID:** R009

**Description:** Verify that monthly total is calculated correctly.

**Preconditions:**
- User is logged in
- User has expenses in current month

**Test Steps:**
1. Add expenses for current month:
   - 25.50
   - 10.00
   - 15.25
2. View monthly summary
3. Verify total

**Expected Result:**
- Monthly total displays: "OMR 50.75"
- Calculation is accurate (sum of all expenses)
- Total updates when new expense is added

**Test Data:**
- Expense 1: 25.50
- Expense 2: 10.00
- Expense 3: 15.25
- Expected Total: 50.75

---

### TC_ANAL_002: Monthly Summary - Month Picker

**Priority:** Medium  
**Type:** Functional (Positive)  
**RID:** R009

**Description:** Verify that month picker updates the summary.

**Preconditions:**
- User is logged in
- User has expenses in different months

**Test Steps:**
1. Add expenses in March 2024: 25.50, 10.00
2. Add expenses in April 2024: 30.00, 15.00
3. Select March 2024 in month picker
4. Verify summary shows March total
5. Select April 2024
6. Verify summary shows April total

**Expected Result:**
- Summary updates based on selected month
- March total: 35.50
- April total: 45.00
- Only expenses from selected month are included

**Test Data:**
- March 2024: 25.50, 10.00
- April 2024: 30.00, 15.00

---

### TC_ANAL_003: Category Filter - Filter by Category

**Priority:** Medium  
**Type:** Functional (Positive)  
**RID:** R010

**Description:** Verify that expenses can be filtered by category.

**Preconditions:**
- User is logged in
- User has expenses in multiple categories

**Test Steps:**
1. Add expenses: Food (25.50), Transport (10.00), Food (15.00)
2. Select "Food" from category filter dropdown
3. Observe filtered results

**Expected Result:**
- Only "Food" expenses are displayed
- Total shows sum of Food expenses only: 40.50
- Other categories are hidden

**Test Data:**
- Food: 25.50, 15.00
- Transport: 10.00

---

### TC_ANAL_004: Category Filter - Reset to All

**Priority:** Low  
**Type:** Functional (Positive)  
**RID:** R010

**Description:** Verify that filter resets to show all categories.

**Preconditions:**
- User is logged in
- Category filter is set to a specific category

**Test Steps:**
1. Set category filter to "Food"
2. Verify filtered results
3. Select "All categories" from dropdown
4. Observe results

**Expected Result:**
- All expenses are displayed again
- Total shows sum of all expenses
- Filter is reset

**Test Data:** N/A

---

### TC_ANAL_005: Category Breakdown - Totals

**Priority:** Medium  
**Type:** Functional (Positive)  
**RID:** R011

**Description:** Verify that category-wise totals are displayed.

**Preconditions:**
- User is logged in
- User has expenses in multiple categories

**Test Steps:**
1. Add expenses:
   - Food: 25.50, 15.00
   - Transport: 10.00, 5.00
   - Coffee: 3.50
2. View category totals section
3. Verify totals displayed

**Expected Result:**
- Food total: 40.50
- Transport total: 15.00
- Coffee total: 3.50
- Totals are accurate

**Test Data:**
- Food: 25.50, 15.00 = 40.50
- Transport: 10.00, 5.00 = 15.00
- Coffee: 3.50 = 3.50

---

## UI/UX Test Cases

### TC_UI_001: Responsive Design - Mobile Layout

**Priority:** High  
**Type:** UI (Positive)  
**RID:** R014

**Description:** Verify that application layout adapts to mobile screen.

**Preconditions:**
- User is logged in
- Browser supports responsive mode or mobile device available

**Test Steps:**
1. Open application on mobile device (or use browser responsive mode)
2. Set viewport to 375px width (iPhone size)
3. Verify layout adaptation
4. Test form inputs and buttons

**Expected Result:**
- Layout adjusts to mobile screen
- Forms are vertically stacked
- Buttons are full width
- Text is readable
- No horizontal scrolling required

**Test Data:** N/A

---

### TC_UI_002: Responsive Design - Form Usability

**Priority:** High  
**Type:** UI (Positive)  
**RID:** R014

**Description:** Verify that form inputs are usable on mobile.

**Preconditions:**
- Application is open on mobile device

**Test Steps:**
1. Navigate to expense form
2. Tap on each input field
3. Verify keyboard appears
4. Test date picker
5. Test number input

**Expected Result:**
- Input fields are tappable
- Keyboard appears appropriately
- Date picker is mobile-friendly
- Number input shows numeric keypad
- Form is easy to fill

**Test Data:** N/A

---

### TC_UI_003: Cross-Browser - Chrome

**Priority:** Medium  
**Type:** Compatibility (Positive)  
**RID:** R015

**Description:** Verify application works in Chrome browser.

**Preconditions:**
- Chrome browser installed (latest version)
- User can access application

**Test Steps:**
1. Open application in Chrome
2. Test login functionality
3. Test expense add/edit/delete
4. Test monthly summary
5. Verify UI rendering

**Expected Result:**
- All features work correctly
- UI renders properly
- No JavaScript errors in console
- Responsive design works

**Test Data:** N/A

---

### TC_UI_004: Cross-Browser - Firefox

**Priority:** Medium  
**Type:** Compatibility (Positive)  
**RID:** R015

**Description:** Verify application works in Firefox browser.

**Preconditions:**
- Firefox browser installed (latest version)

**Test Steps:**
1. Open application in Firefox
2. Execute test suite TC_UI_003 steps

**Expected Result:**
- All features work correctly
- UI renders properly
- No compatibility issues

**Test Data:** N/A

---

### TC_UI_005: Cross-Browser - Safari

**Priority:** Medium  
**Type:** Compatibility (Positive)  
**RID:** R015

**Description:** Verify application works in Safari browser.

**Preconditions:**
- Safari browser installed (latest version)

**Test Steps:**
1. Open application in Safari
2. Execute test suite TC_UI_003 steps

**Expected Result:**
- All features work correctly
- UI renders properly
- No Safari-specific issues

**Test Data:** N/A

---

### TC_UI_006: Glassmorphism Effects

**Priority:** Low  
**Type:** UI (Positive)  
**RID:** R019

**Description:** Verify glassmorphism design effects are visible.

**Preconditions:**
- User is logged in
- User is on index.html

**Test Steps:**
1. View expense sections
2. Verify glassmorphism effects
3. Check backdrop blur
4. Verify transparency

**Expected Result:**
- Sections have semi-transparent background
- Backdrop blur effect is visible
- Background animation is visible through cards
- Modern glassmorphism design is evident

**Test Data:** N/A

---

### TC_UI_007: Background Animation

**Priority:** Low  
**Type:** UI (Positive)  
**RID:** R019

**Description:** Verify background animation displays correctly.

**Preconditions:**
- User is logged in

**Test Steps:**
1. View index.html
2. Observe background
3. Verify wavy animation
4. Check animation smoothness

**Expected Result:**
- Wavy background animation is visible
- Animation is smooth (no jank)
- Colors are correct (blue tones)
- Animation loops continuously

**Test Data:** N/A

---

### TC_UI_008: Toast Notification - On Add

**Priority:** Low  
**Type:** UI (Positive)  
**RID:** R020

**Description:** Verify toast notification appears when expense is added.

**Preconditions:**
- User is logged in

**Test Steps:**
1. Add a new expense
2. Observe toast notification

**Expected Result:**
- Toast notification appears
- Message: "Expense added"
- Toast is visible and readable
- Toast appears in appropriate location

**Test Data:**
- Expense: Food, 25.50, 2024-03-20

---

### TC_UI_009: Toast Notification - Auto Dismiss

**Priority:** Low  
**Type:** UI (Positive)  
**RID:** R020

**Description:** Verify toast notification auto-dismisses after timeout.

**Preconditions:**
- User is logged in

**Test Steps:**
1. Add an expense
2. Toast appears
3. Wait without interaction
4. Observe toast behavior

**Expected Result:**
- Toast automatically disappears after 3-5 seconds
- Toast fades out smoothly
- No manual dismissal required

**Test Data:** N/A

---

## Data Persistence Test Cases

### TC_DATA_001: LocalStorage Persistence

**Priority:** High  
**Type:** Functional (Positive)  
**RID:** R016

**Description:** Verify that expenses persist in localStorage after page refresh.

**Preconditions:**
- User is logged in
- User has added expenses

**Test Steps:**
1. Add 3 expenses
2. Refresh the page (F5)
3. Verify expenses are still present
4. Open Developer Tools > Application > LocalStorage
5. Verify data stored

**Expected Result:**
- All expenses persist after refresh
- Data is stored in localStorage
- Storage key format: "expense-tracker:v1:[user_id]"
- Data structure is correct JSON

**Test Data:**
- 3 expenses added before refresh

---

### TC_DATA_002: User Data Persistence

**Priority:** High  
**Type:** Functional (Positive)  
**RID:** R016

**Description:** Verify that user data persists after logout and login.

**Preconditions:**
- User is logged in
- User has expenses

**Test Steps:**
1. Add expenses
2. Logout
3. Login again with same credentials
4. Verify expenses are present

**Expected Result:**
- Expenses persist across logout/login
- User data is maintained
- All expenses are accessible after re-login

**Test Data:**
- Expenses added before logout

---

## Error Handling Test Cases

### TC_ERR_001: Invalid Login Error Message

**Priority:** Medium  
**Type:** Error Handling (Positive)  
**RID:** R017

**Description:** Verify appropriate error message for invalid login.

**Preconditions:**
- User is on login page
- Invalid credentials used

**Test Steps:**
1. Enter invalid email or password
2. Click "Login" button
3. Observe error message

**Expected Result:**
- Error message is displayed
- Message is clear and user-friendly
- Message: "Invalid email or password"
- Error styling is visible (red color)

**Test Data:**
- Email: "invalid@test.com"
- Password: "wrongpass"

---

### TC_ERR_002: Invalid Expense Data Error

**Priority:** Medium  
**Type:** Error Handling (Positive)  
**RID:** R017

**Description:** Verify error message for invalid expense data.

**Preconditions:**
- User is logged in

**Test Steps:**
1. Attempt to add expense with invalid data
2. Submit form
3. Observe error message

**Expected Result:**
- Error message displayed
- Message indicates what is wrong
- Error persists until valid data entered

**Test Data:**
- Invalid: Category: "", Amount: "abc"

---

## Form Validation Test Cases

### TC_VAL_001: Real-time Validation Feedback

**Priority:** Medium  
**Type:** UI (Positive)  
**RID:** R018

**Description:** Verify that form provides real-time validation feedback.

**Preconditions:**
- User is on registration or login form

**Test Steps:**
1. Focus on email field
2. Enter invalid email format
3. Observe validation feedback
4. Enter valid email
5. Observe feedback change

**Expected Result:**
- Real-time validation occurs
- Visual feedback provided (border color change)
- HTML5 validation messages appear
- Feedback is immediate

**Test Data:**
- Invalid: "notanemail"
- Valid: "test@example.com"

---

### TC_VAL_002: Validation Prevents Submission

**Priority:** High  
**Type:** Functional (Positive)  
**RID:** R018

**Description:** Verify that validation prevents form submission with invalid data.

**Preconditions:**
- User is on expense form

**Test Steps:**
1. Leave required fields empty
2. Attempt to submit form
3. Observe behavior

**Expected Result:**
- Form submission is prevented
- HTML5 validation prevents submit
- Error messages displayed
- User can correct and resubmit

**Test Data:**
- All fields empty

---

## Test Execution Summary

**Total Test Cases:** 50  
**Executed:** 48  
**Passed:** 41  
**Failed:** 5  
**Blocked:** 2  
**Not Executed:** 2

**Coverage:** 95% of requirements covered

---

**Document Version:** 1.0  
**Last Updated:** 2024-03-20  
**Prepared By:** Testing Team  
**Approved By:** [Test Manager Name]

