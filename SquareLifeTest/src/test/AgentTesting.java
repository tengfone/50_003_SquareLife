package test;

import java.util.ArrayList;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AgentTesting {
  // TF: agent1@sutd20.com Password1! DH: agent1@company.com Password_123
  // final static String AGENT1_USERNAME = "agent1@sutd20.com";
  // final static String AGENT1_PASSWORD = "Password1!";
  final static String AGENT1_USERNAME = "agent1@company.com";
  final static String AGENT1_PASSWORD = "Password_123";
  final static String RAINBOW_URL = "https://web-sandbox.openrainbow.com/app/1.70.5/index.html";
  String customerFirstName;
  String customerLastName;
  String customerName;
  WebDriver driver;
  WebDriverWait wait;
  Boolean agentLoggedIn, customerSelected;
  ArrayList<String> tabs;


  public AgentTesting(WebDriver driver, String customerFirstName, String customerLastName) {
    this.driver = driver;
    this.wait = new WebDriverWait(driver, 30);
    this.customerFirstName = customerFirstName;
    this.customerLastName = customerLastName;
    this.customerName = customerFirstName + " " + customerLastName;
    this.tabs = new ArrayList<String>(driver.getWindowHandles());
    this.agentLoggedIn = false;
    this.customerSelected = false;
  }

  public void openNewTab() {
    ((JavascriptExecutor) driver).executeScript("window.open('about:blank','_blank');");
    tabs = new ArrayList<String>(driver.getWindowHandles());
    driver.switchTo().window(tabs.get(tabs.size() - 1));
  }

  public void switchToFirstTab() {
    driver.switchTo().window(tabs.get(0));
  }

  public void switchToTab(int tabNum) {
    this.tabs = new ArrayList<String>(driver.getWindowHandles());
    driver.switchTo().window(tabs.get(tabNum));
  }

  public void closeAgentTab() {
    driver.close();
    switchToFirstTab();
  }

  public void agentLogin() throws InterruptedException {
    if (agentLoggedIn)
      return;
    openNewTab();
    driver.get(RAINBOW_URL);
    WebElement usernameField = driver.findElement(By.id("username"));
    usernameField.sendKeys(AGENT1_USERNAME);
    WebElement submitButton =
        driver.findElement(By.xpath("//square-button[@label-dyn='continue']"));
    wait.until(ExpectedConditions.elementToBeClickable(submitButton));
    Thread.sleep(1500);
    submitButton.click();
    WebElement passwordField = wait.until(
        ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@type='password']")));
    wait.until(ExpectedConditions.elementToBeClickable(passwordField));
    passwordField.sendKeys(AGENT1_PASSWORD);
    WebElement connectButton = wait.until(
        ExpectedConditions.elementToBeClickable(By.xpath("//square-button[@label-dyn='connect']")));
    Thread.sleep(1500);
    connectButton.click();

    wait.until(ExpectedConditions
        .urlToBe("https://web-sandbox.openrainbow.com/app/1.70.5/index.html#/main/home"));
    String dismissModalButtonXpath =
        "//button[@class='buttonTour' and contains(.,'Remind me later')]";
    WebElement dismissModalButton = wait
        .until(ExpectedConditions.visibilityOfElementLocated(By.xpath(dismissModalButtonXpath)));
    Thread.sleep(1500);
    dismissModalButton.click();
    agentLoggedIn = true;
  }

  public void getCustomer() {
    if (customerSelected)
      return;
    String customerNameXpath =
        String.format("//div[@id='cell' and contains(., '%s')]", customerName);
    WebElement contactName = driver.findElement(By.xpath(customerNameXpath));
    contactName.click();
    wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("chattextarea")));
    wait.until(ExpectedConditions.elementToBeClickable(By.id("chattextarea")));
    customerSelected = true;
  }

  public Boolean receivedMessage(String message) throws InterruptedException, CustomException {
    agentLogin();
    if (!agentLoggedIn)
      throw new CustomException("Agent not logged in");
    getCustomer();
    if (!customerSelected)
      throw new CustomException("Customer not selected");
    String messageXpath = String.format("//div[@class='line' and contains(text(),'%s')]", message);
    Boolean messageReceived = driver.findElements(By.xpath(messageXpath)).size() > 0;
    // closeAgentTab();
    return messageReceived;
  }

  public void sendMessage(String message) throws InterruptedException, CustomException {
    agentLogin();
    if (!agentLoggedIn)
      throw new CustomException("Agent not logged in");
    getCustomer();
    if (!customerSelected)
      throw new CustomException("Customer not selected");
    WebElement chatTextArea = driver.findElement(By.id("chattextarea"));
    chatTextArea.sendKeys(message);
    chatTextArea.sendKeys(Keys.RETURN);
    // closeAgentTab();
  }

  public void closeConversation() {
    WebElement closeBtn = driver.findElement(By.className("close"));
    closeBtn.click();
  }

  public void setNewCustomer(String firstName, String lastName) {
    this.customerFirstName = firstName;
    this.customerLastName = lastName;
    this.customerName = customerFirstName + " " + customerLastName;
    this.customerSelected = false;

  }

}
