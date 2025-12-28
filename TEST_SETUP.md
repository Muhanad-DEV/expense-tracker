# Java Selenium Test Setup

## Prerequisites

1. **Java JDK 8 or higher** installed
2. **Maven** or **Gradle** build tool
3. **ChromeDriver** installed and in PATH, or use WebDriverManager

## Dependencies

Add these dependencies to your `pom.xml` (Maven) or `build.gradle` (Gradle):

### Maven (pom.xml)

```xml
<dependencies>
    <!-- JUnit 5 -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.10.0</version>
        <scope>test</scope>
    </dependency>
    
    <!-- Selenium WebDriver -->
    <dependency>
        <groupId>org.seleniumhq.selenium</groupId>
        <artifactId>selenium-java</artifactId>
        <version>4.15.0</version>
    </dependency>
    
    <!-- WebDriverManager (optional - auto-downloads ChromeDriver) -->
    <dependency>
        <groupId>io.github.bonigarcia</groupId>
        <artifactId>webdrivermanager</artifactId>
        <version>5.6.2</version>
    </dependency>
</dependencies>
```

### Gradle (build.gradle)

```gradle
dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'
    testImplementation 'org.seleniumhq.selenium:selenium-java:4.15.0'
    testImplementation 'io.github.bonigarcia:webdrivermanager:5.6.2'
}

test {
    useJUnitPlatform()
}
```

## Running the Tests

### Using Maven

```bash
mvn test
```

### Using Gradle

```bash
gradle test
```

### Using IDE (IntelliJ IDEA / Eclipse)

1. Right-click on `ExpenseTrackerTest.java`
2. Select "Run 'ExpenseTrackerTest'"

## Test Configuration

The test file uses the URL: `https://expense-tracker-psi-nine-16.vercel.app`

To change the URL, modify the `baseUrl` variable in `ExpenseTrackerTest.java`:

```java
private static String baseUrl = "https://expense-tracker-psi-nine-16.vercel.app";
```

## Test Cases

The test suite includes:

1. **testAddExpense** - Tests adding a single expense
2. **testAddMultipleExpenses** - Tests adding multiple expenses
3. **testInvalidExpenseForm** - Tests form validation
4. **testMonthlySummary** - Tests monthly total calculation
5. **testSearchExpenses** - Tests search functionality
6. **testCategoryFilter** - Tests category filtering
7. **testEditExpense** - Tests editing an expense
8. **testDeleteExpense** - Tests deleting an expense
9. **testLogout** - Tests logout functionality

## Notes

- Tests run sequentially using `@BeforeAll` to set up a user account
- Each test assumes the user is logged in (setup in `@BeforeAll`)
- Tests use explicit waits to handle dynamic content loading
- ChromeDriver is required - ensure Chrome browser is installed

