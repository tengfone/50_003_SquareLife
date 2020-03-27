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

import java.util.Collections;
import java.util.concurrent.TimeUnit;
import static org.junit.Assert.*;

public class FrontEndTesting {
	WebDriver driver;
	WebElement firstName, secondName, email, submit;
	Select dropdown;
	AgentTesting agentTesting;
	WebDriverWait wait;
	final static String WEBSITEURL = "https://localhost:3005/";

	@Before
	public void initDriver() throws Exception {
		ChromeOptions options = new ChromeOptions();
		options.setAcceptInsecureCerts(true);
		options.setUnhandledPromptBehaviour(UnexpectedAlertBehaviour.ACCEPT);
		driver = new ChromeDriver(options);
		driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
		wait = new WebDriverWait(driver, 20);
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
		dropdown.selectByIndex(0);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		// Send button
		WebElement send = wait.until(ExpectedConditions.visibilityOfElementLocated(
				By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]")));
		boolean sendEnabled = send.isEnabled();
		assertTrue(sendEnabled);
	}

	/* Firstname field left blank */
	@Test
	public void testFrontPageInvalidName1() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		// Use either by index or visible text
		dropdown.selectByIndex(0);
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
		// Use either by index or visible text
		dropdown.selectByIndex(0);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		// Send button
		WebElement send = wait.until(ExpectedConditions.visibilityOfElementLocated(
				By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]")));
		WebElement usermsg = driver.findElement(By.id("usermsg"));
		usermsg.sendKeys(message);
		send.click();
		messageReceived = agentTesting.receivedMessage(message);
		assertTrue(messageReceived);
	}

	@Test
	public void testAgentReceived2() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		Boolean messageReceived;
		// Set message to be sent
		String message = "!@#$%^&*()_+1234567890-=,./;[]\\";
		// Use either by index or visible text
		dropdown.selectByIndex(0);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		// Send button
		WebElement send = wait.until(ExpectedConditions.visibilityOfElementLocated(
				By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]")));
		WebElement usermsg = driver.findElement(By.id("usermsg"));
		usermsg.sendKeys(message);
		send.click();
		messageReceived = agentTesting.receivedMessage(message);
		assertTrue(messageReceived);
	}

	@Test
	public void testAgentReceived3() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		Boolean messageReceived;
		// Set message to be sent
		String message = " ";
		// Use either by index or visible text
		dropdown.selectByIndex(0);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		// Send button
		WebElement send = wait.until(ExpectedConditions.visibilityOfElementLocated(
				By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]")));
		WebElement usermsg = driver.findElement(By.id("usermsg"));
		usermsg.sendKeys(message);
		send.click();
		messageReceived = agentTesting.receivedMessage(message);
		assertTrue(messageReceived);
	}

	@Test
	public void testAgentReceived4() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		Boolean messageReceived;
		// Set message to be sent
		String message = String.join("", Collections.nCopies(1025, "d"));
		// Use either by index or visible text
		dropdown.selectByIndex(0);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		// Send button
		WebElement send = wait.until(ExpectedConditions.visibilityOfElementLocated(
				By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]")));
		WebElement usermsg = driver.findElement(By.id("usermsg"));
		usermsg.sendKeys(message);
		send.click();
		messageReceived = agentTesting.receivedMessage(message);
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
		dropdown.selectByIndex(0);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		// Send button
		wait.until(ExpectedConditions.visibilityOfElementLocated(
				By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]")));
		agentTesting.sendMessage(message);
		String userChatMessageXpath =
				String.format("//h3[@class='text-left' and contains(text(),'%s')]", message);
		try {
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(userChatMessageXpath)));
			messageReceived = true;
		} catch (TimeoutException e) {
			messageReceived = false;
		}
		assertTrue(messageReceived);
	}

	@Test
	public void testUserReceived2() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		Boolean messageReceived;
		// Set message to be sent
		String message = "!@#$%^&*()_+1234567890-=,./;[]\\";
		// Use either by index or visible text
		dropdown.selectByIndex(0);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		// Send button
		wait.until(ExpectedConditions.visibilityOfElementLocated(
				By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]")));
		agentTesting.sendMessage(message);
		String userChatMessageXpath =
				String.format("//h3[@class='text-left' and contains(text(),'%s')]", message);
		try {
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(userChatMessageXpath)));
			messageReceived = true;
		} catch (TimeoutException e) {
			messageReceived = false;
		}
		assertTrue(messageReceived);
	}

	@Test
	public void testUserReceived3() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		Boolean messageReceived;
		// Set message to be sent
		String message = " ";
		// Use either by index or visible text
		dropdown.selectByIndex(0);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		// Send button
		wait.until(ExpectedConditions.visibilityOfElementLocated(
				By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]")));
		agentTesting.sendMessage(message);
		String userChatMessageXpath =
				String.format("//h3[@class='text-left' and contains(text(),'%s')]", message);
		try {
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(userChatMessageXpath)));
			messageReceived = true;
		} catch (TimeoutException e) {
			messageReceived = false;
		}
		assertTrue(messageReceived);
	}

	@Test
	public void testUserReceived4() throws Exception {
		System.out.println("Starting Test " + new Object() {
		}.getClass().getEnclosingMethod().getName());
		Boolean messageReceived;
		// Set message to be sent
		String message = String.join("", Collections.nCopies(1025, "d"));
		// Use either by index or visible text
		dropdown.selectByIndex(0);
		// fill up name boxes
		firstName.sendKeys("UserFirstName");
		secondName.sendKeys("UserLastName");
		email.sendKeys("testing@test.com");
		// submit
		submit.click();
		// Send button
		wait.until(ExpectedConditions.visibilityOfElementLocated(
				By.xpath("//button[@class='btn btn-primary px-3' and contains(.,'Send')]")));
		agentTesting.sendMessage(message);
		String userChatMessageXpath =
				String.format("//h3[@class='text-left' and contains(text(),'%s')]", message);
		try {
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(userChatMessageXpath)));
			messageReceived = true;
		} catch (TimeoutException e) {
			messageReceived = false;
		}
		assertTrue(messageReceived);
	}
}
