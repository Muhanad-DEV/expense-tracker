# Eclipse Setup for JUnit 5 Tests

## Quick Fix for "No Test Found" Error

### Option 1: Create Package Structure (Recommended)

1. In Eclipse, right-click on your `src/test/java` folder (or create it if it doesn't exist)
2. Create package: `com.expensetracker.tests`
3. Move `ExpenseTrackerTest.java` into this package
4. The file should be at: `src/test/java/com/expensetracker/tests/ExpenseTrackerTest.java`

### Option 2: Remove Package Declaration

If you prefer to keep the file in the default package:

1. Open `ExpenseTrackerTest.java`
2. Remove the line: `package com.expensetracker.tests;`
3. Save the file

### Option 3: Configure Eclipse Project

1. Right-click on project → **Properties**
2. Go to **Java Build Path** → **Libraries**
3. Ensure JUnit 5 is in the classpath:
   - `junit-jupiter-api-5.10.0.jar`
   - `junit-jupiter-engine-5.10.0.jar`
4. Go to **Java Build Path** → **Source**
5. Ensure `src/test/java` is marked as a test source folder

## Maven Project Setup

If using Maven:

1. Right-click project → **Configure** → **Convert to Maven Project**
2. Eclipse will automatically download dependencies from `pom.xml`
3. Wait for Maven to finish downloading (check bottom right corner)

## Verify Test Configuration

1. Right-click on `ExpenseTrackerTest.java`
2. Select **Run As** → **JUnit Test**
3. If still not working, try:
   - **Run As** → **JUnit Test** (with JUnit 5)
   - Or: **Run As** → **Maven Test**

## Common Issues

### Issue: "No tests found"
**Solution**: 
- Ensure the class has `@Test` annotations
- Check that methods are `public void` and annotated with `@Test`
- Verify JUnit 5 is in the classpath

### Issue: "JUnit version mismatch"
**Solution**: 
- Remove old JUnit 4 from classpath
- Add JUnit 5 dependencies via Maven or manually

### Issue: "ChromeDriver not found"
**Solution**: 
- Install ChromeDriver and add to PATH
- Or use WebDriverManager (already in pom.xml) - it auto-downloads ChromeDriver

## Running Tests

### Via Eclipse:
1. Right-click on test class or method
2. **Run As** → **JUnit Test**

### Via Maven Command Line:
```bash
mvn test
```

### Via Command Line (if not using Maven):
```bash
javac -cp "junit-jupiter-api-5.10.0.jar:selenium-java-4.15.0.jar" ExpenseTrackerTest.java
java -cp ".:junit-jupiter-api-5.10.0.jar:junit-jupiter-engine-5.10.0.jar:selenium-java-4.15.0.jar" org.junit.platform.console.ConsoleLauncher --class-path . --select-class ExpenseTrackerTest
```

