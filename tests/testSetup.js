// testSetup.js
const { Builder, Browser } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');

let driver;

const mochaHooks = {
  beforeAll: async function() {
    this.timeout(30000);
    let options = new chrome.Options();
    // options.addArguments('--headless'); // Opcija za "headless" testiranje
    // options.addArguments('--no-sandbox');
    // options.addArguments('--disable-dev-shm-usage');
    
    driver = await new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeOptions(options)
      .build();
      
    await driver.manage().window().maximize();
    await driver.get('https://demoqa.com/books');
  },
  
  afterAll: async function() {
    this.timeout(10000);
    if (driver) {
      await driver.quit();
    }
  }
};

function getDriver() {
  return driver;
}

exports.mochaHooks = mochaHooks;
exports.getDriver = getDriver;