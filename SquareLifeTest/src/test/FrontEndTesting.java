package test;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.TimeoutException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.concurrent.TimeUnit;
import static org.junit.Assert.*;

public class FrontEndTesting {
	WebDriver driver;
	WebElement firstName, secondName, email, submit, exit;
	Select dropdown;
	AgentTesting agentTesting;
	WebDriverWait wait;
	ArrayList<String> tabs;
	final static String WEBSITEURL = "https://localhost:3005/";

	void fillingUpDetails(int n) {
		// Use either by index or visible text
		new Select(driver.findElement(By.id("customer_option"))).selectByIndex(1);
		// fill up name boxes
		driver.findElement(By.id("firstname")).sendKeys("User" + n + "FirstName");
		driver.findElement(By.id("lastname")).sendKeys("User" + n + "LastName");
		driver.findElement(By.id("customer_email")).sendKeys("testing" + n + "@test.com");
		// submit
		driver.findElement(By.className("btn-primary")).click();
	}

	void switchToTab(int tabNum) {
		this.tabs = new ArrayList<String>(driver.getWindowHandles());
		driver.switchTo().window(tabs.get(tabNum));
	}

	void openNewTab() {
		((JavascriptExecutor) driver).executeScript("window.open('about:blank','_blank');");
		tabs = new ArrayList<String>(driver.getWindowHandles());
		driver.switchTo().window(tabs.get(tabs.size() - 1));
	}

	@Before
	public void initDriver() throws Exception {
		ChromeOptions options = new ChromeOptions();
		options.setAcceptInsecureCerts(true);
		options.setUnhandledPromptBehaviour(UnexpectedAlertBehaviour.ACCEPT);
		driver = new ChromeDriver(options);
		driver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS);
		wait = new WebDriverWait(driver, 40);
		agentTesting = new AgentTesting(driver, "UserFirstName", "UserLastName");
		driver.get(WEBSITEURL);
		firstName = driver.findElement(By.id("firstname"));
		secondName = driver.findElement(By.id("lastname"));
		email = driver.findElement(By.id("customer_email"));
		dropdown = new Select(driver.findElement(By.id("customer_option")));
		submit = driver.findElement(By.className("btn-primary"));
	}

	@After
	public void safeDriverQuit() {
		driver.quit();
	}

	// Test 1 : Insert FirstName, LastName, Email and connect to agent
	@Test
	public void testFrontPageSuccessful() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		// Use either by index or visible text
		agentTesting.agentLogin();
		agentTesting.switchToFirstTab();
		dropdown.selectByIndex(1);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		// Send button
		WebElement send = wait.until(ExpectedConditions.elementToBeClickable(
				By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]")));
		boolean sendEnabled = send.isEnabled();
		WebElement exitBtn = driver.findElement(By.id("exit"));
		exitBtn.click();
		try {
			driver.switchTo().alert().accept();
		} catch (NoAlertPresentException e) {
			// That's fine.
		}
		agentTesting.switchToTab(1);
		agentTesting.closeConversation();
		Thread.sleep(2000);
		assertTrue(sendEnabled);
	}

	/* Firstname field left blank */
	@Test
	public void testFrontPageInvalidName1() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		// Use either by index or visible text
		dropdown.selectByIndex(1);
		// fill up name boxes
		firstName.sendKeys("");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		Boolean submitted = !driver.getCurrentUrl().equals(WEBSITEURL);
		assertTrue(submitted);
	}

	/* Lastname Field left blank */
	@Test
	public void testFrontPageInvalidName2() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		// Use either by index or visible text
		dropdown.selectByIndex(0);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		Boolean submitted = !driver.getCurrentUrl().equals(WEBSITEURL);
		assertTrue(submitted);
	}

	/* Special Characters and Symbols in First Name field */
	/*
	 * Expected: Passed. Rainbow allows special symbols and characters in the name fields.
	 */
	@Test
	public void testFrontPageInvalidName3() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		// Use either by index or visible text
		dropdown.selectByIndex(0);
		// fill up name boxes
		firstName.sendKeys("A@asgdjfm!");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		Boolean submitted = !driver.getCurrentUrl().equals(WEBSITEURL);
		assertTrue(submitted);
	}

	/* Special Characters and Symbols in Lastname field */
	/*
	 * Expected: Passed. Rainbow allows special symbols and characters in the name fields.
	 */
	@Test
	public void testFrontPageInvalidName4() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		// Use either by index or visible text
		dropdown.selectByIndex(0);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys(":qwra+isn-a2'[");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		Boolean submitted = !driver.getCurrentUrl().equals(WEBSITEURL);
		assertTrue(submitted);
	}

	/* Very Long First Name */
	/* Expected: Pass. Reason: Input field limited to 30 char */
	@Test
	public void testFrontPageInvalidName5() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		// Use either by index or visible text
		dropdown.selectByIndex(0);
		String reallyLongFirstName = String.join("", Collections.nCopies(1000, "s"));
		// fill up name boxes
		firstName.sendKeys(reallyLongFirstName);
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		Boolean submitted = !driver.getCurrentUrl().equals(WEBSITEURL);
		assertTrue(submitted);
	}

	/* Really Long Last Name */
	/* Expected: Pass. Reason: Input field limited to 30 char */
	@Test
	public void testFrontPageInvalidName6() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		// Use either by index or visible text
		dropdown.selectByIndex(0);
		String reallyLongLastName = String.join("", Collections.nCopies(1000, "d"));
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys(reallyLongLastName);
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		Boolean submitted = !driver.getCurrentUrl().equals(WEBSITEURL);
		assertTrue(submitted);
	}

	/* Invalid Email */
	@Test
	public void testFrontPageEmail1() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		// Use either by index or visible text
		dropdown.selectByIndex(0);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing.com");
		// submit
		submit.click();
		Boolean submitted = !driver.getCurrentUrl().equals(WEBSITEURL);
		assertTrue(submitted);
	}

	@Test
	public void testFrontPageEmail2() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		// Use either by index or visible text
		dropdown.selectByIndex(0);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@.com");
		// submit
		submit.click();
		Boolean submitted = !driver.getCurrentUrl().equals(WEBSITEURL);
		assertTrue(submitted);
	}

	@Test
	public void testFrontPageEmail3() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		// Use either by index or visible text
		dropdown.selectByIndex(0);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("tes@!ting@.com");
		// submit
		submit.click();
		Boolean submitted = !driver.getCurrentUrl().equals(WEBSITEURL);
		assertTrue(submitted);
	}

	@Test
	public void testFrontPageEmail4() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		// Use either by index or visible text
		dropdown.selectByIndex(0);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@.comm");
		// submit
		submit.click();
		Boolean submitted = !driver.getCurrentUrl().equals(WEBSITEURL);
		assertTrue(submitted);
	}

	@Test
	public void testFrontPageEmail5() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		// Use either by index or visible text
		dropdown.selectByIndex(0);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("");
		// submit
		submit.click();
		Boolean submitted = !driver.getCurrentUrl().equals(WEBSITEURL);
		assertTrue(submitted);
	}

	/* Tests if agent receives the EXACT message sent from the user */
	@Test
	public void testAgentReceived1() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		Boolean messageReceived;
		// Set message to be sent
		String message = "hello";
		// Set agent to online
		agentTesting.agentLogin();
		agentTesting.switchToFirstTab();
		// Use either by index or visible text
		dropdown.selectByIndex(1);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		// Send button
		WebElement send = wait.until(ExpectedConditions.elementToBeClickable(
				By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]")));
		WebElement usermsg = driver.findElement(By.id("usermsg"));
		usermsg.sendKeys(message);
		send.click();
		agentTesting.switchToTab(1);
		messageReceived = agentTesting.receivedMessage(message);
		agentTesting.sendMessage("//endchat");
		Thread.sleep(2000);
		agentTesting.closeConversation();
		Thread.sleep(2000);

		assertTrue(messageReceived);
	}

	@Test
	public void testAgentReceived2() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		Boolean messageReceived;
		// Set message to be sent
		String message = "!@#$%^&*()_+1234567890-=,./;[]\\";
		// Set agent to online
		agentTesting.agentLogin();
		agentTesting.switchToFirstTab();
		// Use either by index or visible text
		dropdown.selectByIndex(1);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		// Send button
		WebElement send = wait.until(ExpectedConditions.elementToBeClickable(
				By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]")));
		WebElement usermsg = driver.findElement(By.id("usermsg"));
		usermsg.sendKeys(message);
		send.click();
		agentTesting.switchToTab(1);
		messageReceived = agentTesting.receivedMessage(message);
		agentTesting.sendMessage("//endchat");
		Thread.sleep(2000);
		agentTesting.closeConversation();
		Thread.sleep(2000);
		assertTrue(messageReceived);
	}

	@Test
	public void testAgentReceived3() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		Boolean messageReceived;
		// Set message to be sent
		String message = " ";
		// Set agent to online
		agentTesting.agentLogin();
		agentTesting.switchToFirstTab();
		// Use either by index or visible text
		dropdown.selectByIndex(1);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		// Send button
		WebElement send = wait.until(ExpectedConditions.elementToBeClickable(
				By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]")));
		WebElement usermsg = driver.findElement(By.id("usermsg"));
		usermsg.sendKeys(message);
		send.click();
		agentTesting.switchToTab(1);
		messageReceived = agentTesting.receivedMessage(message);
		agentTesting.sendMessage("//endchat");
		Thread.sleep(2000);
		agentTesting.closeConversation();
		Thread.sleep(2000);
		assertTrue(messageReceived);
	}

	/*
	 * Expected: Failed
	 */
	@Test
	public void testAgentReceived4() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		Boolean messageReceived;
		// Set message to be sent
		String message = String.join("", Collections.nCopies(1025, "d"));
		// Set agent to online
		agentTesting.agentLogin();
		agentTesting.switchToFirstTab();
		// Use either by index or visible text
		dropdown.selectByIndex(1);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		// Send button
		WebElement send = wait.until(ExpectedConditions.elementToBeClickable(
				By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]")));
		WebElement usermsg = driver.findElement(By.id("usermsg"));
		usermsg.sendKeys(message);
		send.click();
		agentTesting.switchToTab(1);
		messageReceived = agentTesting.receivedMessage(message);
		agentTesting.sendMessage("//endchat");
		Thread.sleep(2000);
		agentTesting.closeConversation();
		Thread.sleep(2000);
		assertTrue(messageReceived);
	}

	/* Tests if the user receives the EXACT message from the agent */
	@Test
	public void testUserReceived1() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		Boolean messageReceived;
		// Set message to be sent
		String message = "HELLO";
		// Use either by index or visible text
		// Set agent to online
		agentTesting.agentLogin();
		agentTesting.switchToFirstTab();
		dropdown.selectByIndex(1);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		// Send button
		wait.until(ExpectedConditions.elementToBeClickable(
				By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]")));
		agentTesting.switchToTab(1);
		agentTesting.sendMessage(message);
		agentTesting.switchToFirstTab();
		String userChatMessageXpath =
				String.format("//h3[@class='text-left' and contains(text(),'%s')]", message);
		try {
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(userChatMessageXpath)));
			messageReceived = true;
		} catch (TimeoutException e) {
			messageReceived = false;
		}
		agentTesting.switchToTab(1);
		agentTesting.sendMessage("//endchat");
		Thread.sleep(2000);
		agentTesting.closeConversation();
		Thread.sleep(2000);
		assertTrue(messageReceived);
	}

	@Test
	public void testUserReceived2() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		Boolean messageReceived;
		// Set message to be sent
		String message = "!@#$%^&*()_+1234567890-=,./;[]\\";
		// Set agent to online
		agentTesting.agentLogin();
		agentTesting.switchToFirstTab();
		// Use either by index or visible text
		dropdown.selectByIndex(1);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		// Send button
		wait.until(ExpectedConditions.elementToBeClickable(
				By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]")));
		agentTesting.switchToTab(1);
		agentTesting.sendMessage(message);
		agentTesting.switchToFirstTab();
		String userChatMessageXpath =
				String.format("//h3[@class='text-left' and contains(text(),'%s')]", message);
		try {
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(userChatMessageXpath)));
			messageReceived = true;
		} catch (TimeoutException e) {
			messageReceived = false;
		}
		agentTesting.switchToTab(1);
		agentTesting.sendMessage("//endchat");
		Thread.sleep(2000);
		agentTesting.closeConversation();
		Thread.sleep(2000);
		assertTrue(messageReceived);
	}

	@Test
	public void testUserReceived3() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		Boolean messageReceived;
		// Set message to be sent
		String message = " ";
		// Set agent to online
		agentTesting.agentLogin();
		agentTesting.switchToFirstTab();
		// Use either by index or visible text
		dropdown.selectByIndex(1);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		// Send button
		wait.until(ExpectedConditions.elementToBeClickable(
				By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]")));
		agentTesting.switchToTab(1);
		agentTesting.sendMessage(message);
		agentTesting.switchToFirstTab();
		String userChatMessageXpath =
				String.format("//h3[@class='text-left' and contains(text(),'%s')]", message);
		try {
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(userChatMessageXpath)));
			messageReceived = true;
		} catch (TimeoutException e) {
			messageReceived = false;
		}
		agentTesting.switchToTab(1);
		agentTesting.sendMessage("//endchat");
		Thread.sleep(2000);
		agentTesting.closeConversation();
		Thread.sleep(2000);
		assertTrue(messageReceived);
	}

	@Test
	public void testUserReceived4() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		Boolean messageReceived;
		// Set message to be sent
		String message = String.join("", Collections.nCopies(1025, "d"));
		// Set agent to online
		agentTesting.agentLogin();
		agentTesting.switchToFirstTab();
		// Use either by index or visible text
		dropdown.selectByIndex(1);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		// Send button
		wait.until(ExpectedConditions.elementToBeClickable(
				By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]")));
		agentTesting.switchToTab(1);
		agentTesting.sendMessage(message);
		agentTesting.switchToFirstTab();
		String userChatMessageXpath =
				String.format("//h3[@class='text-left' and contains(text(),'%s')]", message);
		try {
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(userChatMessageXpath)));
			messageReceived = true;
		} catch (TimeoutException e) {
			messageReceived = false;
		}
		agentTesting.switchToTab(1);
		agentTesting.sendMessage("//endchat");
		Thread.sleep(2000);
		agentTesting.closeConversation();
		Thread.sleep(2000);
		assertTrue(messageReceived);
	}

	/*
	 * Expected: Failed
	 */
	@Test
	public void testXSSInjection1() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		Boolean noAlertDialog;
		// Set XSS to be sent
		String testXSSScript = "<script>alert('XML Injection Successful')</script>";
		// Use either by index or visible text
		dropdown.selectByIndex(1);
		// fill up name boxes
		firstName.sendKeys(testXSSScript);
		secondName.sendKeys(testXSSScript);
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		// Check if the alert dialog pops up
		try {
			driver.switchTo().alert();
			noAlertDialog = false;
		} catch (NoAlertPresentException e) {
			noAlertDialog = true;
		}

		assertTrue(noAlertDialog);
	}

	@Test
	public void testXSSInjection2() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		Boolean noAlertDialog;
		// Set XSS to be sent
		String testXSSScript = "<script>alert('XML Injection Successful')</script>";
		agentTesting.agentLogin();
		agentTesting.switchToFirstTab();
		// Use either by index or visible text
		dropdown.selectByIndex(1);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		// Send button
		WebElement send = wait.until(ExpectedConditions.elementToBeClickable(
				By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]")));
		WebElement usermsg = driver.findElement(By.id("usermsg"));
		usermsg.sendKeys(testXSSScript);
		send.click();
		// Check if the alert dialog pops up
		try {
			driver.switchTo().alert();
			noAlertDialog = false;
		} catch (NoAlertPresentException e) {
			noAlertDialog = true;
		}
		agentTesting.switchToTab(1);
		agentTesting.sendMessage("//endchat");
		Thread.sleep(2000);
		agentTesting.closeConversation();
		Thread.sleep(2000);

		assertTrue(noAlertDialog);
	}

	/*
	 * *PRE-REQUISITE* Accepts 2nd option from DropDown Task with Pre-set 1 Available Agents in
	 * Queue.
	 */
	@Test
	public void testQueueSystem() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		agentTesting.agentLogin(); // Tab 1
		agentTesting.setNewCustomer("User1FirstName", "User1LastName");
		agentTesting.switchToFirstTab();
		fillingUpDetails(1); // Tab 0
		openNewTab();
		driver.get(WEBSITEURL);
		fillingUpDetails(2); // Tab 2
		switchToTab(0);
		try {
			wait.until(ExpectedConditions.elementToBeClickable(
					By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]")));
			switchToTab(1);
			agentTesting.sendMessage("//endchat");
			Thread.sleep(2000);
			agentTesting.closeConversation();
			Thread.sleep(2000);
			agentTesting.setNewCustomer("User2FirstName", "User2LastName");
			switchToTab(0);
			wait.until(ExpectedConditions.not(ExpectedConditions.elementToBeClickable(
					By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]"))));
			switchToTab(2);
			wait.until(ExpectedConditions.elementToBeClickable(
					By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]")));
			switchToTab(1);
			agentTesting.sendMessage("//endchat");
			Thread.sleep(2000);
			agentTesting.closeConversation();
			Thread.sleep(2000);
			switchToTab(2);
			wait.until(ExpectedConditions.not(ExpectedConditions.elementToBeClickable(
					By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]"))));
			assert true;
		} catch (TimeoutException e) {
			assert false;
		}
	}
}
