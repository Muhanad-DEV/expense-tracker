# Test Data Document
## Expense Tracker Application

**Project:** Expense Tracker Application  
**Created:** 2025-10-30 
**Last Updated:** 2025-11-01

---

## Test Data Summary

| Category | Count | Description |
|----------|-------|-------------|
| Valid User Accounts | 8 | Standard test user accounts |
| Invalid Registration Data | 12 | Duplicate email, password validation, format errors |
| Invalid Login Data | 8 | Wrong credentials, empty fields |
| Valid Expenses | 50+ | Standard expense entries |
| Invalid Expenses | 15 | Empty fields, invalid formats, boundary values |
| Boundary Test Data | 20 | Edge cases, limits, special characters |

---

## User Test Data

### Valid User Accounts

| User ID | Name | Email | Password | Purpose |
|---------|------|-------|----------|---------|
| U001 | John Doe | john.doe@test.com | password123 | Standard user testing |
| U002 | Jane Smith | jane.smith@test.com | testpass456 | Multi-user isolation testing |
| U003 | Bob Wilson | bob.wilson@example.com | secure789 | Cross-user data testing |
| U004 | Alice Brown | alice.brown@test.com | alice2025 | Registration testing |
| U005 | Charlie Davis | charlie@test.com | charliepass | Login testing |
| U006 | Demo User | demo@test.com | demo123 | Demo account with pre-loaded data |
| U007 | Test User | testuser@test.com | test123 | Empty state testing |
| U008 | Preloaded User | preloaded@test.com | preload123 | Data persistence testing (10 expenses) |

### Invalid Registration Data

| Name | Email | Password | Confirm Password | Expected Result |
|------|-------|----------|------------------|-----------------|
| New User | john.doe@test.com | newpass123 | newpass123 | Registration fails - duplicate email |
| Test User | test1@test.com | pass | pass | Registration fails - password < 6 chars |
| Test User | invalidemail | password123 | password123 | Registration fails - invalid email format |
| Test User | test@test | password123 | password123 | Registration fails - invalid email |
| Test User | test@test.com | password123 | password456 | Registration fails - passwords don't match |

### Invalid Login Data

| Email | Password | Expected Result |
|-------|----------|-----------------|
| nonexistent@test.com | anypassword | Login fails - invalid credentials |
| john.doe@test.com | wrongpassword | Login fails - invalid password |
| (empty) | password123 | Login prevented - email required |
| test@test.com | (empty) | Login prevented - password required |

---

## Expense Test Data

### Valid Expenses

| Test ID | Category | Amount | Date | Purpose |
|---------|----------|--------|------|---------|
| E001 | Food | 25.50 | 2025-03-20 | Basic expense add |
| E002 | Transport | 10.00 | 2025-03-19 | Standard transport expense |
| E003 | Coffee | 5.50 | 2025-03-18 | Small amount expense |
| E004 | Shopping | 89.99 | 2025-03-17 | Large amount expense |
| E005 | Entertainment | 45.00 | 2025-03-16 | Entertainment category |
| E006 | Groceries | 67.25 | 2025-03-15 | Decimal amount |
| E007 | Utilities | 120.00 | 2025-03-14 | Whole number amount |
| E008 | Medical | 150.75 | 2025-03-13 | Medical category |
| E009 | Education | 300.00 | 2025-03-12 | High amount |
| E010 | Travel | 500.50 | 2025-03-11 | Very high amount |

### Invalid Expenses

| Category | Amount | Date | Expected Result |
|----------|--------|------|-----------------|
| (empty) | 25.50 | 2025-03-20 | Validation fails - category required |
| Food | (empty) | 2025-03-20 | Validation fails - amount required |
| Food | 25.50 | (empty) | Validation fails - date required |
| Food | abc | 2025-03-20 | Validation fails - invalid number |
| Food | -50.00 | 2025-03-20 | May be rejected - negative amount |
| Food | 25.50 | 2025-13-45 | Validation fails - invalid date |

---

## Monthly Summary Test Data

### March 2025 Expenses

| Category | Amount | Date |
|----------|--------|------|
| Food | 25.50 | 2025-03-01 |
| Transport | 10.00 | 2025-03-05 |
| Coffee | 5.50 | 2025-03-10 |
| Shopping | 89.99 | 2025-03-15 |
| Food | 30.00 | 2025-03-20 |
| **Total Expected:** | **160.99** | |

### April 2025 Expenses

| Category | Amount | Date |
|----------|--------|------|
| Food | 45.00 | 2025-04-02 |
| Transport | 15.50 | 2025-04-08 |
| Entertainment | 60.00 | 2025-04-15 |
| Groceries | 75.25 | 2025-04-22 |
| **Total Expected:** | **195.75** | |

---

## Category Filter Test Data

### Food Category

| Amount | Date |
|--------|------|
| 25.50 | 2025-03-01 |
| 30.00 | 2025-03-10 |
| 15.75 | 2025-03-20 |
| **Total:** | **71.25** |

### Transport Category

| Amount | Date |
|--------|------|
| 10.00 | 2025-03-05 |
| 12.00 | 2025-03-15 |
| 8.50 | 2025-03-25 |
| **Total:** | **30.50** |

---

## Boundary Value Test Data

| Test Case | Category | Amount | Date | Expected Behavior |
|-----------|----------|--------|------|-------------------|
| Minimum Positive | Food | 0.01 | 2025-03-20 | Should be accepted |
| Small Value | Food | 0.10 | 2025-03-20 | Should be accepted |
| Large Value | Food | 9999.99 | 2025-03-20 | Should be accepted |
| Zero | Food | 0.00 | 2025-03-20 | May be rejected |
| Negative | Food | -10.00 | 2025-03-20 | Should be rejected |

---

## Special Character Test Data

| Category | Amount | Date | Expected Behavior |
|----------|--------|------|-------------------|
| Food & Drink | 25.50 | 2025-03-20 | Should be accepted |
| Transport (Taxi) | 10.00 | 2025-03-20 | Should be accepted |
| Coffee - Starbucks | 5.50 | 2025-03-20 | Should be accepted |
| Food123 | 25.50 | 2025-03-20 | Should be accepted |
| 咖啡 (Coffee) | 5.50 | 2025-03-20 | Unicode - should be accepted |

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-01
**Prepared By:** Testing Team
