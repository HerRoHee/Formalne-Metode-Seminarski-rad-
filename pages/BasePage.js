// pages/BasePage.js
const { By, until, Key } = require('selenium-webdriver');

class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  // === COMMON WAIT METHODS ===
  async waitForElement(locator, timeout = 10000) {
    return await this.driver.wait(
      until.elementLocated(locator),
      timeout,
      `Element with locator ${locator} not found within ${timeout}ms`
    );
  }

  async waitForElementVisible(locator, timeout = 10000) {
    const element = await this.waitForElement(locator, timeout);
    return await this.driver.wait(
      until.elementIsVisible(element),
      timeout,
      `Element with locator ${locator} not visible within ${timeout}ms`
    );
  }

  async waitForElementClickable(locator, timeout = 10000) {
    const element = await this.waitForElement(locator, timeout);
    return await this.driver.wait(
      until.elementIsEnabled(element),
      timeout,
      `Element with locator ${locator} not clickable within ${timeout}ms`
    );
  }

  // === COMMON ACTION METHODS ===
  async click(locator) {
    const element = await this.waitForElementClickable(locator);
    await element.click();
  }

  async type(locator, text) {
    const element = await this.waitForElementVisible(locator);
    await element.clear();
    await element.sendKeys(text);
  }

  async getText(locator) {
    const element = await this.waitForElementVisible(locator);
    return await element.getText();
  }

  async getAttribute(locator, attribute) {
    const element = await this.waitForElement(locator);
    return await element.getAttribute(attribute);
  }

  async isElementDisplayed(locator) {
    try {
      const element = await this.waitForElementVisible(locator, 3000);
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  async isElementEnabled(locator) {
    try {
      const element = await this.waitForElement(locator, 3000);
      return await element.isEnabled();
    } catch (error) {
      return false;
    }
  }

  // === NAVIGATION METHODS ===
  async navigateTo(url) {
    await this.driver.get(url);
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  async getPageTitle() {
    return await this.driver.getTitle();
  }

  async refreshPage() {
    await this.driver.navigate().refresh();
  }

  async goBack() {
    await this.driver.navigate().back();
  }

  async goForward() {
    await this.driver.navigate().forward();
  }

  // === FRAME/ALERT METHODS ===
  async switchToFrame(locator) {
    const frame = await this.waitForElement(locator);
    await this.driver.switchTo().frame(frame);
  }

  async switchToDefaultContent() {
    await this.driver.switchTo().defaultContent();
  }

  async acceptAlert() {
    await this.driver.switchTo().alert().accept();
  }

  async dismissAlert() {
    await this.driver.switchTo().alert().dismiss();
  }

  async getAlertText() {
    return await this.driver.switchTo().alert().getText();
  }

  // === SCREENSHOT METHODS ===
  async takeScreenshot(name) {
    const screenshot = await this.driver.takeScreenshot();
    const fs = require('fs');
    const path = require('path');
    
    // Create screenshots directory if it doesn't exist
    const screenshotDir = path.join(__dirname, '..', 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    // Save screenshot
    const screenshotPath = path.join(screenshotDir, `${name}_${Date.now()}.png`);
    fs.writeFileSync(screenshotPath, screenshot, 'base64');
    return screenshotPath;
  }

  // === JAVASCRIPT EXECUTION ===
  async executeScript(script, ...args) {
    return await this.driver.executeScript(script, ...args);
  }

  async scrollToElement(locator) {
    const element = await this.waitForElement(locator);
    await this.executeScript("arguments[0].scrollIntoView(true);", element);
  }

  async scrollToTop() {
    await this.executeScript("window.scrollTo(0, 0);");
  }

  async scrollToBottom() {
    await this.executeScript("window.scrollTo(0, document.body.scrollHeight);");
  }

  // === WINDOW METHODS ===
  async maximizeWindow() {
    await this.driver.manage().window().maximize();
  }

  async setWindowSize(width, height) {
    await this.driver.manage().window().setRect({ width, height });
  }

  async getWindowSize() {
    return await this.driver.manage().window().getRect();
  }

  // === COOKIE METHODS ===
  async addCookie(cookie) {
    await this.driver.manage().addCookie(cookie);
  }

  async getCookies() {
    return await this.driver.manage().getCookies();
  }

  async deleteAllCookies() {
    await this.driver.manage().deleteAllCookies();
  }

  // === LOG METHODS ===
  async getBrowserLogs() {
    return await this.driver.manage().logs().get('browser');
  }

  // === UTILITY METHODS ===
  async sleep(ms) {
    await this.driver.sleep(ms);
  }

  async waitForPageLoad(timeout = 30000) {
    await this.driver.wait(async () => {
      return await this.executeScript("return document.readyState") === "complete";
    }, timeout);
  }

  async getAllElements(locator) {
    return await this.driver.findElements(locator);
  }

  async getElementCount(locator) {
    const elements = await this.getAllElements(locator);
    return elements.length;
  }

  async hoverOverElement(locator) {
    const element = await this.waitForElement(locator);
    const actions = this.driver.actions({ bridge: true });
    await actions.move({ origin: element }).perform();
  }

  async doubleClick(locator) {
    const element = await this.waitForElement(locator);
    const actions = this.driver.actions({ bridge: true });
    await actions.doubleClick(element).perform();
  }

  async rightClick(locator) {
    const element = await this.waitForElement(locator);
    const actions = this.driver.actions({ bridge: true });
    await actions.contextClick(element).perform();
  }

  async dragAndDrop(sourceLocator, targetLocator) {
    const source = await this.waitForElement(sourceLocator);
    const target = await this.waitForElement(targetLocator);
    const actions = this.driver.actions({ bridge: true });
    await actions.dragAndDrop(source, target).perform();
  }

  async sendKeys(locator, ...keys) {
    const element = await this.waitForElement(locator);
    await element.sendKeys(...keys);
  }

  async clearField(locator) {
    const element = await this.waitForElement(locator);
    await element.clear();
  }
}

module.exports = BasePage;