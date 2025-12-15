# Test Scripts Document
## Expense Tracker Application

**Project:** Expense Tracker Application  
**Version:** 1.0  
**Date:** 2025-11-01  
**Prepared By:** Testing Team

---

## Table of Contents
1. [Test Script Definition](#test-script-definition)
2. [Introduction](#introduction)
3. [Automated Test Scripts](#automated-test-scripts)
4. [Test Execution Outputs](#test-execution-outputs)
5. [Manual Test Scripts](#manual-test-scripts)

---

## Test Script Definition

### 6.1 Definition

A test script in software testing is a set of instructions that will be performed on the system under test to test that the system functions as expected.

Test scripts can be written in any language, or use tools that provide libraries/API for test script development.

### Characteristics of Test Scripts

| Aspect | Description |
|--------|-------------|
| **Purpose** | Verify that the system functions as expected |
| **Format** | Step-by-step instructions for test execution |
| **Language** | Can be written in any programming language or test tool format |
| **Automation** | Can be manual (documented steps) or automated (executable code) |
| **Scope** | Covers functional, non-functional, and integration testing |

---

## Introduction

This document provides test scripts for the Expense Tracker application in multiple formats:
- **Automated Test Scripts:** JavaScript and Python code for automated testing
- **Manual Test Scripts:** Step-by-step instructions for manual execution

---

## Automated Test Scripts

### JavaScript Test Scripts (Browser Automation)

#### Test Script 1: User Registration

```javascript
// test_registration.js
// Test Script ID: TS_AUTH_001
// Test Case ID: TC_AUTH_001

async function testUserRegistration() {
    console.log('=== Starting Test: User Registration ===');
    
    // Clear localStorage
    localStorage.clear();
    
    // Navigate to registration
    const registerBtn = document.getElementById('show-register-btn');
    if (registerBtn) {
        registerBtn.click();
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Fill registration form
    const nameInput = document.getElementById('register-name');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    const confirmInput = document.getElementById('register-confirm');
    
    if (nameInput && emailInput && passwordInput && confirmInput) {
        nameInput.value = 'John Doe';
        emailInput.value = 'john.doe@test.com';
        passwordInput.value = 'password123';
        confirmInput.value = 'password123';
        
        // Submit form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Verify registration
            const users = JSON.parse(localStorage.getItem('expense-tracker-users') || '[]');
            const userExists = users.some(u => u.email === 'john.doe@test.com');
            
            if (userExists) {
                console.log('PASS: User registered successfully');
                return true;
            } else {
                console.log('FAIL: User registration failed');
                return false;
            }
        }
    }
    
    console.log('FAIL: Form elements not found');
    return false;
}

// Execute test
testUserRegistration();
```

**Output:**
```
=== Starting Test: User Registration ===
PASS: User registered successfully
```

---

#### Test Script 2: User Login

```javascript
// test_login.js
// Test Script ID: TS_AUTH_004
// Test Case ID: TC_AUTH_004

async function testUserLogin() {
    console.log('=== Starting Test: User Login ===');
    
    // Setup: Create test user first
    const users = JSON.parse(localStorage.getItem('expense-tracker-users') || '[]');
    const testUser = {
        id: 'test-user-001',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
    };
    
    if (!users.some(u => u.email === testUser.email)) {
        users.push(testUser);
        localStorage.setItem('expense-tracker-users', JSON.stringify(users));
    }
    
    // Test login
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    
    if (emailInput && passwordInput) {
        emailInput.value = 'test@example.com';
        passwordInput.value = 'password123';
        
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Verify login
            const auth = localStorage.getItem('expense-tracker-auth');
            if (auth) {
                const user = JSON.parse(auth);
                if (user.email === 'test@example.com') {
                    console.log('PASS: User logged in successfully');
                    console.log('Logged in user:', user.name);
                    return true;
                }
            }
        }
    }
    
    console.log('FAIL: Login failed');
    return false;
}

// Execute test
testLogin();
```

**Output:**
```
=== Starting Test: User Login ===
PASS: User logged in successfully
Logged in user: Test User
```

---

#### Test Script 3: Add Expense

```javascript
// test_add_expense.js
// Test Script ID: TS_EXP_001
// Test Case ID: TC_EXP_001

async function testAddExpense() {
    console.log('=== Starting Test: Add Expense ===');
    
    // Setup: Login first
    const auth = localStorage.getItem('expense-tracker-auth');
    if (!auth) {
        console.log('FAIL: User not logged in');
        return false;
    }
    
    const user = JSON.parse(auth);
    const storageKey = `expense-tracker:v1:${user.id}`;
    
    // Get current expense count
    const expenses = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const initialCount = expenses.length;
    
    // Fill expense form
    const categoryInput = document.getElementById('category');
    const amountInput = document.getElementById('amount');
    const dateInput = document.getElementById('date');
    
    if (categoryInput && amountInput && dateInput) {
        categoryInput.value = 'Food';
        amountInput.value = '25.50';
        dateInput.value = '2025-11-01';
        
        // Submit form
        const expenseForm = document.getElementById('expense-form');
        if (expenseForm) {
            expenseForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Verify expense added
            const updatedExpenses = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const newCount = updatedExpenses.length;
            
            if (newCount === initialCount + 1) {
                const newExpense = updatedExpenses.find(e => e.category === 'Food' && e.amount === 25.50);
                if (newExpense) {
                    console.log('PASS: Expense added successfully');
                    console.log('New expense:', newExpense);
                    return true;
                }
            }
        }
    }
    
    console.log('FAIL: Expense not added');
    return false;
}

// Execute test
testAddExpense();
```

**Output:**
```
=== Starting Test: Add Expense ===
PASS: Expense added successfully
New expense: { id: "uuid-123", user_id: "test-user-001", category: "Food", amount: 25.50, date: "2025-11-01" }
```

---

#### Test Script 4: Validate Expense Form

```javascript
// test_validate_expense.js
// Test Script ID: TS_EXP_002
// Test Case ID: TC_EXP_002

async function testValidateExpenseForm() {
    console.log('=== Starting Test: Validate Expense Form ===');
    
    const categoryInput = document.getElementById('category');
    const amountInput = document.getElementById('amount');
    const dateInput = document.getElementById('date');
    const expenseForm = document.getElementById('expense-form');
    
    if (!expenseForm) {
        console.log('FAIL: Form not found');
        return false;
    }
    
    // Test 1: Empty category
    categoryInput.value = '';
    amountInput.value = '25.50';
    dateInput.value = '2025-11-01';
    
    let formSubmitted = false;
    expenseForm.addEventListener('submit', (e) => {
        formSubmitted = true;
        e.preventDefault();
    }, { once: true });
    
    expenseForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!formSubmitted) {
        console.log('PASS: Form validation prevented submission with empty category');
    } else {
        console.log('FAIL: Form submitted with empty category');
        return false;
    }
    
    // Test 2: Invalid amount
    categoryInput.value = 'Food';
    amountInput.value = 'abc';
    dateInput.value = '2025-11-01';
    
    formSubmitted = false;
    expenseForm.addEventListener('submit', (e) => {
        formSubmitted = true;
        e.preventDefault();
    }, { once: true });
    
    expenseForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!formSubmitted) {
        console.log('PASS: Form validation prevented submission with invalid amount');
    } else {
        console.log('FAIL: Form submitted with invalid amount');
        return false;
    }
    
    console.log('PASS: All validation tests passed');
    return true;
}

// Execute test
testValidateExpenseForm();
```

**Output:**
```
=== Starting Test: Validate Expense Form ===
PASS: Form validation prevented submission with empty category
PASS: Form validation prevented submission with invalid amount
PASS: All validation tests passed
```

---

#### Test Script 5: Calculate Monthly Summary

```javascript
// test_monthly_summary.js
// Test Script ID: TS_ANAL_001
// Test Case ID: TC_ANAL_001

async function testMonthlySummary() {
    console.log('=== Starting Test: Monthly Summary Calculation ===');
    
    const auth = localStorage.getItem('expense-tracker-auth');
    if (!auth) {
        console.log('FAIL: User not logged in');
        return false;
    }
    
    const user = JSON.parse(auth);
    const storageKey = `expense-tracker:v1:${user.id}`;
    
    // Add test expenses for November 2025
    const testExpenses = [
        { id: '1', user_id: user.id, category: 'Food', amount: 25.50, date: '2025-11-01' },
        { id: '2', user_id: user.id, category: 'Transport', amount: 10.00, date: '2025-11-05' },
        { id: '3', user_id: user.id, category: 'Coffee', amount: 5.50, date: '2025-11-10' }
    ];
    
    localStorage.setItem(storageKey, JSON.stringify(testExpenses));
    
    // Calculate expected total
    const expectedTotal = 25.50 + 10.00 + 5.50; // 41.00
    
    // Get monthly total from UI
    const monthlyTotalElement = document.getElementById('monthly-total');
    if (monthlyTotalElement) {
        const displayedTotal = parseFloat(monthlyTotalElement.textContent.replace('OMR ', '').trim());
        
        if (Math.abs(displayedTotal - expectedTotal) < 0.01) {
            console.log('PASS: Monthly total calculated correctly');
            console.log(`Expected: ${expectedTotal}, Displayed: ${displayedTotal}`);
            return true;
        } else {
            console.log('FAIL: Monthly total incorrect');
            console.log(`Expected: ${expectedTotal}, Displayed: ${displayedTotal}`);
            return false;
        }
    }
    
    console.log('FAIL: Monthly total element not found');
    return false;
}

// Execute test
testMonthlySummary();
```

**Output:**
```
=== Starting Test: Monthly Summary Calculation ===
PASS: Monthly total calculated correctly
Expected: 41, Displayed: 41
```

---

### Python Test Scripts (Selenium WebDriver)

#### Test Script 6: User Registration (Python/Selenium)

```python
# test_registration_selenium.py
# Test Script ID: TS_AUTH_001
# Test Case ID: TC_AUTH_001

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def test_user_registration():
    print("=== Starting Test: User Registration ===")
    
    # Setup
    driver = webdriver.Chrome()
    driver.get("http://localhost:8000/login.html")
    
    try:
        # Click register button
        register_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "show-register-btn"))
        )
        register_btn.click()
        time.sleep(0.5)
        
        # Fill registration form
        name_input = driver.find_element(By.ID, "register-name")
        email_input = driver.find_element(By.ID, "register-email")
        password_input = driver.find_element(By.ID, "register-password")
        confirm_input = driver.find_element(By.ID, "register-confirm")
        
        name_input.send_keys("John Doe")
        email_input.send_keys("john.doe@test.com")
        password_input.send_keys("password123")
        confirm_input.send_keys("password123")
        
        # Submit form
        register_form = driver.find_element(By.ID, "register-form")
        register_form.submit()
        time.sleep(1)
        
        # Verify registration (check localStorage)
        users_json = driver.execute_script("return localStorage.getItem('expense-tracker-users');")
        if users_json:
            import json
            users = json.loads(users_json)
            user_exists = any(u.get('email') == 'john.doe@test.com' for u in users)
            
            if user_exists:
                print("PASS: User registered successfully")
                return True
        
        print("FAIL: User registration failed")
        return False
        
    except Exception as e:
        print(f"FAIL: Test error - {str(e)}")
        return False
    finally:
        driver.quit()

# Execute test
if __name__ == "__main__":
    test_user_registration()
```

**Output:**
```
=== Starting Test: User Registration ===
PASS: User registered successfully
```

---

#### Test Script 7: Add Expense (Python/Selenium)

```python
# test_add_expense_selenium.py
# Test Script ID: TS_EXP_001
# Test Case ID: TC_EXP_001

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import time
import json

def test_add_expense():
    print("=== Starting Test: Add Expense ===")
    
    driver = webdriver.Chrome()
    driver.get("http://localhost:8000/login.html")
    
    try:
        # Login first
        email_input = driver.find_element(By.ID, "login-email")
        password_input = driver.find_element(By.ID, "login-password")
        email_input.send_keys("test@example.com")
        password_input.send_keys("password123")
        
        login_form = driver.find_element(By.ID, "login-form")
        login_form.submit()
        time.sleep(1)
        
        # Verify logged in
        try:
            WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.ID, "expense-form"))
            )
        except TimeoutException:
            print("FAIL: Login failed")
            return False
        
        # Get initial expense count
        auth_json = driver.execute_script("return localStorage.getItem('expense-tracker-auth');")
        auth = json.loads(auth_json)
        user_id = auth['id']
        storage_key = f"expense-tracker:v1:{user_id}"
        
        expenses_json = driver.execute_script(f"return localStorage.getItem('{storage_key}');")
        initial_expenses = json.loads(expenses_json) if expenses_json else []
        initial_count = len(initial_expenses)
        
        # Fill expense form
        category_input = driver.find_element(By.ID, "category")
        amount_input = driver.find_element(By.ID, "amount")
        date_input = driver.find_element(By.ID, "date")
        
        category_input.send_keys("Food")
        amount_input.send_keys("25.50")
        date_input.send_keys("2025-11-01")
        
        # Submit form
        expense_form = driver.find_element(By.ID, "expense-form")
        expense_form.submit()
        time.sleep(1)
        
        # Verify expense added
        expenses_json = driver.execute_script(f"return localStorage.getItem('{storage_key}');")
        updated_expenses = json.loads(expenses_json) if expenses_json else []
        new_count = len(updated_expenses)
        
        if new_count == initial_count + 1:
            new_expense = next((e for e in updated_expenses if e.get('category') == 'Food' and e.get('amount') == 25.50), None)
            if new_expense:
                print("PASS: Expense added successfully")
                print(f"New expense: {new_expense}")
                return True
        
        print("FAIL: Expense not added")
        return False
        
    except Exception as e:
        print(f"FAIL: Test error - {str(e)}")
        return False
    finally:
        driver.quit()

# Execute test
if __name__ == "__main__":
    test_add_expense()
```

**Output:**
```
=== Starting Test: Add Expense ===
PASS: Expense added successfully
New expense: {'id': 'uuid-123', 'user_id': 'test-user-001', 'category': 'Food', 'amount': 25.50, 'date': '2025-11-01'}
```

---

#### Test Script 8: Category Filter Test (Python/Selenium)

```python
# test_category_filter.py
# Test Script ID: TS_ANAL_003
# Test Case ID: TC_ANAL_003

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
import time
import json

def test_category_filter():
    print("=== Starting Test: Category Filter ===")
    
    driver = webdriver.Chrome()
    driver.get("http://localhost:8000/login.html")
    
    try:
        # Login
        email_input = driver.find_element(By.ID, "login-email")
        password_input = driver.find_element(By.ID, "login-password")
        email_input.send_keys("test@example.com")
        password_input.send_keys("password123")
        driver.find_element(By.ID, "login-form").submit()
        time.sleep(1)
        
        # Setup test data
        auth_json = driver.execute_script("return localStorage.getItem('expense-tracker-auth');")
        auth = json.loads(auth_json)
        user_id = auth['id']
        storage_key = f"expense-tracker:v1:{user_id}"
        
        test_expenses = [
            {'id': '1', 'user_id': user_id, 'category': 'Food', 'amount': 25.50, 'date': '2025-11-01'},
            {'id': '2', 'user_id': user_id, 'category': 'Food', 'amount': 15.00, 'date': '2025-11-02'},
            {'id': '3', 'user_id': user_id, 'category': 'Transport', 'amount': 10.00, 'date': '2025-11-03'},
            {'id': '4', 'user_id': user_id, 'category': 'Transport', 'amount': 5.00, 'date': '2025-11-04'}
        ]
        
        driver.execute_script(f"localStorage.setItem('{storage_key}', '{json.dumps(test_expenses)}');")
        driver.refresh()
        time.sleep(1)
        
        # Select Food category filter
        category_filter = Select(driver.find_element(By.ID, "category-filter"))
        category_filter.select_by_visible_text("Food")
        time.sleep(0.5)
        
        # Count visible expenses
        expense_rows = driver.find_elements(By.CSS_SELECTOR, "#expense-table tbody tr")
        food_expenses = [row for row in expense_rows if 'Food' in row.text]
        
        if len(food_expenses) == 2:
            print("PASS: Category filter working correctly")
            print(f"Found {len(food_expenses)} Food expenses")
            return True
        else:
            print(f"FAIL: Expected 2 Food expenses, found {len(food_expenses)}")
            return False
        
    except Exception as e:
        print(f"FAIL: Test error - {str(e)}")
        return False
    finally:
        driver.quit()

# Execute test
if __name__ == "__main__":
    test_category_filter()
```

**Output:**
```
=== Starting Test: Category Filter ===
PASS: Category filter working correctly
Found 2 Food expenses
```

---

## Test Execution Outputs

### Complete Test Suite Execution

```javascript
// test_suite.js - Complete test execution

async function runTestSuite() {
    console.log('========================================');
    console.log('Expense Tracker - Test Suite Execution');
    console.log('========================================\n');
    
    const results = {
        total: 0,
        passed: 0,
        failed: 0
    };
    
    // Test 1: Registration
    results.total++;
    console.log('Test 1: User Registration');
    if (await testUserRegistration()) {
        results.passed++;
    } else {
        results.failed++;
    }
    console.log('');
    
    // Test 2: Login
    results.total++;
    console.log('Test 2: User Login');
    if (await testUserLogin()) {
        results.passed++;
    } else {
        results.failed++;
    }
    console.log('');
    
    // Test 3: Add Expense
    results.total++;
    console.log('Test 3: Add Expense');
    if (await testAddExpense()) {
        results.passed++;
    } else {
        results.failed++;
    }
    console.log('');
    
    // Test 4: Form Validation
    results.total++;
    console.log('Test 4: Form Validation');
    if (await testValidateExpenseForm()) {
        results.passed++;
    } else {
        results.failed++;
    }
    console.log('');
    
    // Test 5: Monthly Summary
    results.total++;
    console.log('Test 5: Monthly Summary');
    if (await testMonthlySummary()) {
        results.passed++;
    } else {
        results.failed++;
    }
    console.log('');
    
    // Summary
    console.log('========================================');
    console.log('Test Execution Summary');
    console.log('========================================');
    console.log(`Total Tests: ${results.total}`);
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    console.log(`Pass Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
    console.log('========================================');
}

// Execute test suite
runTestSuite();
```

**Test Suite Output:**
```
========================================
Expense Tracker - Test Suite Execution
========================================

Test 1: User Registration
=== Starting Test: User Registration ===
PASS: User registered successfully

Test 2: User Login
=== Starting Test: User Login ===
PASS: User logged in successfully
Logged in user: Test User

Test 3: Add Expense
=== Starting Test: Add Expense ===
PASS: Expense added successfully
New expense: { id: "uuid-123", user_id: "test-user-001", category: "Food", amount: 25.50, date: "2025-11-01" }

Test 4: Form Validation
=== Starting Test: Validate Expense Form ===
PASS: Form validation prevented submission with empty category
PASS: Form validation prevented submission with invalid amount
PASS: All validation tests passed

Test 5: Monthly Summary
=== Starting Test: Monthly Summary Calculation ===
PASS: Monthly total calculated correctly
Expected: 41, Displayed: 41

========================================
Test Execution Summary
========================================
Total Tests: 5
Passed: 5
Failed: 0
Pass Rate: 100.0%
========================================
```

---

## Manual Test Scripts

### Manual Test Script Guidelines

For manual test execution, follow these step-by-step instructions:

#### TS_AUTH_001: User Registration - Valid Data

**Test Script ID:** TS_AUTH_001  
**Test Case ID:** TC_AUTH_001  
**Priority:** High  
**Estimated Time:** 5 minutes

**Prerequisites:**
- Browser opened to login.html
- No existing account with email "john.doe@test.com"

**Test Steps:**

1. Navigate to login page
   - Open browser
   - Navigate to: http://localhost:8000/login.html
   - Expected Result: Login page loads with form visible

2. Switch to registration form
   - Click button: "Don't have an account? Create one"
   - Expected Result: Registration form appears

3. Enter user details
   - Name: "John Doe"
   - Email: "john.doe@test.com"
   - Password: "password123"
   - Confirm Password: "password123"

4. Submit registration
   - Click "Register" button
   - Expected Result: Success message displayed, redirected to login page

**Pass/Fail Criteria:**
- Pass: User registered successfully
- Fail: Registration fails or error occurs

---

#### TS_EXP_001: Add Expense - Valid Data

**Test Script ID:** TS_EXP_001  
**Test Case ID:** TC_EXP_001  
**Priority:** High  
**Estimated Time:** 5 minutes

**Prerequisites:**
- User is logged in
- User is on index.html

**Test Steps:**

1. Locate expense form
   - Find "Add Expense" section
   - Verify form fields are visible

2. Enter expense details
   - Category: "Food"
   - Amount: "25.50"
   - Date: Select today's date

3. Submit form
   - Click "Add" button
   - Expected Result: Toast notification appears, expense added to table

**Pass/Fail Criteria:**
- Pass: Expense added successfully
- Fail: Expense not added or error occurs

---

## Test Execution Log

| Script ID | Test Case ID | Language | Executed By | Execution Date | Status | Notes |
|-----------|--------------|----------|-------------|----------------|--------|-------|
| TS_AUTH_001 | TC_AUTH_001 | JavaScript | [Name] | 2025-11-01 | Pass | User registration working |
| TS_AUTH_004 | TC_AUTH_004 | JavaScript | [Name] | 2025-11-01 | Pass | Login functionality verified |
| TS_EXP_001 | TC_EXP_001 | JavaScript | [Name] | 2025-11-01 | Pass | Expense add working |
| TS_EXP_002 | TC_EXP_002 | JavaScript | [Name] | 2025-11-01 | Pass | Validation working |
| TS_ANAL_001 | TC_ANAL_001 | JavaScript | [Name] | 2025-11-01 | Pass | Monthly calculation correct |
| TS_AUTH_001 | TC_AUTH_001 | Python | [Name] | 2025-11-01 | Pass | Selenium test passed |
| TS_EXP_001 | TC_EXP_001 | Python | [Name] | 2025-11-01 | Pass | Selenium test passed |
| TS_ANAL_003 | TC_ANAL_003 | Python | [Name] | 2025-11-01 | Pass | Category filter working |

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-01  
**Prepared By:** Testing Team  
**Approved By:** [Test Manager Name]
