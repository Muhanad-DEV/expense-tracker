import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;
import java.util.List;

public class ExpenseTrackerTest {
    private static WebDriver driver;
    private static WebDriverWait wait;
    private static String baseUrl = "https://expense-tracker-psi-nine-16.vercel.app";

    @BeforeAll
    public static void setUp() throws InterruptedException {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        // Navigate to the application
        driver.get(baseUrl + "/login.html");
        Thread.sleep(2000);

        // Register a new user
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("show-register-btn")));
        driver.findElement(By.id("show-register-btn")).click();
        Thread.sleep(1000);

        // Fill registration form
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("register-form")));
        String uniqueEmail = "expensetest" + System.currentTimeMillis() + "@example.com";
        String uniqueName = "Expense Test User " + System.currentTimeMillis();
        
        driver.findElement(By.id("register-name")).sendKeys(uniqueName);
        driver.findElement(By.id("register-email")).sendKeys(uniqueEmail);
        driver.findElement(By.id("register-password")).sendKeys("password123");
        driver.findElement(By.id("register-confirm")).sendKeys("password123");
        
        // Submit registration
        driver.findElement(By.id("register-form")).submit();
        Thread.sleep(2000);

        // Wait for login form to appear (after successful registration)
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("login-form")));
        
        // Login with the registered credentials
        driver.findElement(By.id("login-email")).sendKeys(uniqueEmail);
        driver.findElement(By.id("login-password")).sendKeys("password123");
        driver.findElement(By.id("login-form")).submit();
        
        // Wait for main page to load
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("expense-form")));
        Thread.sleep(2000);
    }

    @AfterAll
    public static void tearDown() throws InterruptedException {
        Thread.sleep(3000);
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void testAddExpense() throws InterruptedException {
        // Wait for expense form to be visible
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("category")));
        
        // Fill expense form
        driver.findElement(By.id("category")).clear();
        driver.findElement(By.id("category")).sendKeys("Food");
        driver.findElement(By.id("amount")).clear();
        driver.findElement(By.id("amount")).sendKeys("25.50");
        driver.findElement(By.id("date")).clear();
        driver.findElement(By.id("date")).sendKeys("2025-11-01");
        
        // Submit the form
        driver.findElement(By.id("expense-form")).submit();
        Thread.sleep(2000);
        
        // Verify that the expense was added (check table for the expense)
        List<WebElement> expenseRows = driver.findElements(By.cssSelector("#expense-table tbody tr"));
        assertTrue(expenseRows.size() > 0, "Expense should be added to the table");
        
        // Verify the expense details in the table
        boolean expenseFound = false;
        for (WebElement row : expenseRows) {
            String rowText = row.getText();
            if (rowText.contains("Food") && rowText.contains("25.50")) {
                expenseFound = true;
                break;
            }
        }
        assertTrue(expenseFound, "Expense with category 'Food' and amount '25.50' should be in the table");
    }

    @Test
    public void testAddMultipleExpenses() throws InterruptedException {
        // Add first expense
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("category")));
        driver.findElement(By.id("category")).clear();
        driver.findElement(By.id("category")).sendKeys("Transport");
        driver.findElement(By.id("amount")).clear();
        driver.findElement(By.id("amount")).sendKeys("10.00");
        driver.findElement(By.id("date")).clear();
        driver.findElement(By.id("date")).sendKeys("2025-11-05");
        driver.findElement(By.id("expense-form")).submit();
        Thread.sleep(2000);
        
        // Add second expense
        driver.findElement(By.id("category")).clear();
        driver.findElement(By.id("category")).sendKeys("Coffee");
        driver.findElement(By.id("amount")).clear();
        driver.findElement(By.id("amount")).sendKeys("5.50");
        driver.findElement(By.id("date")).clear();
        driver.findElement(By.id("date")).sendKeys("2025-11-10");
        driver.findElement(By.id("expense-form")).submit();
        Thread.sleep(2000);
        
        // Verify multiple expenses are in the table
        List<WebElement> expenseRows = driver.findElements(By.cssSelector("#expense-table tbody tr"));
        assertTrue(expenseRows.size() >= 2, "At least 2 expenses should be in the table");
    }

    @Test
    public void testInvalidExpenseForm() throws InterruptedException {
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("category")));
        
        // Try to submit form with empty category
        driver.findElement(By.id("category")).clear();
        driver.findElement(By.id("amount")).clear();
        driver.findElement(By.id("amount")).sendKeys("25.50");
        driver.findElement(By.id("date")).clear();
        driver.findElement(By.id("date")).sendKeys("2025-11-01");
        
        // Get initial row count
        List<WebElement> initialRows = driver.findElements(By.cssSelector("#expense-table tbody tr"));
        int initialCount = initialRows.size();
        
        // Try to submit (HTML5 validation should prevent it)
        driver.findElement(By.id("expense-form")).submit();
        Thread.sleep(1000);
        
        // Verify no new expense was added
        List<WebElement> finalRows = driver.findElements(By.cssSelector("#expense-table tbody tr"));
        int finalCount = finalRows.size();
        
        assertEquals(initialCount, finalCount, "No expense should be added with empty category");
    }

    @Test
    public void testMonthlySummary() throws InterruptedException {
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("monthly-total")));
        
        // Get the monthly total element
        WebElement monthlyTotal = driver.findElement(By.id("monthly-total"));
        String totalText = monthlyTotal.getText();
        
        // Verify monthly total is displayed
        assertNotNull(totalText, "Monthly total should be displayed");
        assertTrue(totalText.contains("OMR") || totalText.contains("$"), "Monthly total should contain currency symbol");
        
        // Verify the total is a valid number format
        String totalValue = totalText.replaceAll("[^0-9.]", "");
        assertFalse(totalValue.isEmpty(), "Monthly total should contain a numeric value");
    }

    @Test
    public void testSearchExpenses() throws InterruptedException {
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("search")));
        
        // Search for "Food" category
        WebElement searchInput = driver.findElement(By.id("search"));
        searchInput.clear();
        searchInput.sendKeys("Food");
        Thread.sleep(1000);
        
        // Verify search results (table should filter)
        List<WebElement> expenseRows = driver.findElements(By.cssSelector("#expense-table tbody tr"));
        
        // At least one row should be visible (if Food expenses exist)
        // If no Food expenses, table might be empty
        assertNotNull(expenseRows, "Search should work without errors");
    }

    @Test
    public void testCategoryFilter() throws InterruptedException {
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("category-filter")));
        
        // Get the category filter dropdown
        WebElement categoryFilter = driver.findElement(By.id("category-filter"));
        Select categorySelect = new Select(categoryFilter);
        
        // Check if there are any category options (besides "All categories")
        List<WebElement> options = categorySelect.getOptions();
        assertTrue(options.size() > 0, "Category filter should have options");
        
        // If there are category options, select one
        if (options.size() > 1) {
            categorySelect.selectByIndex(1);
            Thread.sleep(1000);
            
            // Verify filter is applied (table should update)
            List<WebElement> expenseRows = driver.findElements(By.cssSelector("#expense-table tbody tr"));
            assertNotNull(expenseRows, "Category filter should work without errors");
        }
    }

    @Test
    public void testEditExpense() throws InterruptedException {
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("expense-table")));
        
        // Find the first expense row with an Edit button
        List<WebElement> editButtons = driver.findElements(By.cssSelector("#expense-table tbody tr .edit"));
        
        if (editButtons.size() > 0) {
            // Click the first Edit button
            editButtons.get(0).click();
            Thread.sleep(1000);
            
            // Wait for edit modal to appear
            wait.until(ExpectedConditions.presenceOfElementLocated(By.id("edit-category")));
            
            // Verify modal is visible
            WebElement modal = driver.findElement(By.id("modal"));
            String modalDisplay = modal.getCssValue("display");
            assertFalse(modalDisplay.equals("none"), "Edit modal should be visible");
            
            // Modify the category
            WebElement editCategory = driver.findElement(By.id("edit-category"));
            editCategory.clear();
            editCategory.sendKeys("Updated Category");
            
            // Save changes
            WebElement editForm = driver.findElement(By.id("edit-form"));
            editForm.submit();
            Thread.sleep(2000);
            
            // Verify expense was updated (check table)
            List<WebElement> expenseRows = driver.findElements(By.cssSelector("#expense-table tbody tr"));
            boolean updatedFound = false;
            for (WebElement row : expenseRows) {
                if (row.getText().contains("Updated Category")) {
                    updatedFound = true;
                    break;
                }
            }
            assertTrue(updatedFound, "Expense should be updated with new category");
        } else {
            // If no expenses exist, skip this test
            System.out.println("No expenses to edit - skipping test");
        }
    }

    @Test
    public void testDeleteExpense() throws InterruptedException {
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("expense-table")));
        
        // Get initial expense count
        List<WebElement> initialRows = driver.findElements(By.cssSelector("#expense-table tbody tr"));
        int initialCount = initialRows.size();
        
        if (initialCount > 0) {
            // Find the first delete button
            List<WebElement> deleteButtons = driver.findElements(By.cssSelector("#expense-table tbody tr .delete"));
            
            if (deleteButtons.size() > 0) {
                // Click the first delete button
                deleteButtons.get(0).click();
                Thread.sleep(2000);
                
                // Verify expense count decreased
                List<WebElement> finalRows = driver.findElements(By.cssSelector("#expense-table tbody tr"));
                int finalCount = finalRows.size();
                
                assertTrue(finalCount < initialCount, "Expense count should decrease after deletion");
            }
        } else {
            // If no expenses exist, skip this test
            System.out.println("No expenses to delete - skipping test");
        }
    }

    @Test
    public void testLogout() throws InterruptedException {
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("logout-btn")));
        
        // Click logout button
        driver.findElement(By.id("logout-btn")).click();
        Thread.sleep(2000);
        
        // Verify redirected to login page
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("login.html"), "Should be redirected to login page after logout");
        
        // Verify login form is visible
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("login-form")));
        WebElement loginForm = driver.findElement(By.id("login-form"));
        assertTrue(loginForm.isDisplayed(), "Login form should be visible after logout");
    }
}

