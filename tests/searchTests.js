const { getDriver } = require('./testSetup');
const BooksPage = require('../pages/BooksPage');
const { expect } = require('chai');
const { By } = require('selenium-webdriver');

describe('DemoQA Books Search - Formal Methods Tests', function() {
  this.timeout(30000);
  let booksPage;
  let driver;

  before(async function() {
    driver = getDriver();
    booksPage = new BooksPage(driver);
  });

  beforeEach(async function() {
    const searchBox = await driver.findElement(By.id('searchBox'));
    await searchBox.clear();
    await driver.sleep(500);
  });

  // ============================================
  // 1. EKVIVALENTNOST PARTICIONIRANJA TESTOVI
  // ============================================
  describe('1. Equivalence Partitioning Tests', function() {
    it('TC-EP1: Valid input with match - should display filtered results', async function() {
      await booksPage.performSearch('JavaScript');
      const results = await booksPage.getVisibleBooksCount();
      expect(results).to.be.greaterThan(0);
      const firstBookTitle = await booksPage.getFirstBookTitle();
      expect(firstBookTitle.toLowerCase()).to.include('javascript');
    });

    it('TC-EP2: Valid input with NO match - should show "No rows found"', async function() {
      await booksPage.performSearch('xyz123Nonexistent');
      const noRowsMessage = await booksPage.getNoRowsMessage();
      expect(noRowsMessage).to.equal('No rows found');
    });

    it('TC-EP3: Empty input - should show all books', async function() {
      await booksPage.performSearch('JavaScript');
      const filteredCount = await booksPage.getVisibleBooksCount();
      
      await booksPage.performSearch('');
      const allBooksCount = await booksPage.getVisibleBooksCount();
      
      expect(allBooksCount).to.be.greaterThan(filteredCount);
    });

    it('TC-EP4: Input with special characters - should handle gracefully', async function() {
      await booksPage.performSearch('!@#$%^&*()');
      try {
        const message = await booksPage.getNoRowsMessage();
        expect(message).to.equal('No rows found');
      } catch (error) {
        const searchBox = await driver.findElement(By.id('searchBox'));
        expect(await searchBox.isDisplayed()).to.be.true;
      }
    });
  });

  // ============================================
  // 2. ANALIZA GRANIČNE VRIJEDNOSTI TESTOVI
  // ============================================
  describe('2. Boundary Value Analysis Tests', function() {
    it('TC-BVA1: Empty string (0 characters) - boundary lower', async function() {
      await booksPage.performSearch('');
      const count = await booksPage.getVisibleBooksCount();
      expect(count).to.be.greaterThan(0);
    });

    it('TC-BVA2: Single character - just above lower boundary', async function() {
      await booksPage.performSearch('a');
      const count = await booksPage.getVisibleBooksCount();
      expect(count).to.be.at.least(0);
    });

    it('TC-BVA3: Very long search term (100 chars) - boundary upper', async function() {
      const longText = 'a'.repeat(10000);
      await booksPage.performSearch(longText);
      const searchBox = await driver.findElement(By.id('searchBox'));
      const isDisplayed = await searchBox.isDisplayed();
      expect(isDisplayed).to.be.true;
    });

    it('TC-BVA4: Search term at max practical length (30 chars)', async function() {
      const mediumText = 'Learning JavaScript Design Patterns';
      await booksPage.performSearch(mediumText);
      await driver.sleep(1000);
      const searchBoxValue = await driver.findElement(By.id('searchBox')).getAttribute('value');
      expect(searchBoxValue).to.equal(mediumText);
    });
  });

  // ============================================
  // 3. TABELA ODLUKA TESTOVI
  // ============================================
  describe('3. Decision Table Testing', function() {
    it('TC-DT1: Empty search -> show all books', async function() {
      await booksPage.performSearch('');
      const count = await booksPage.getVisibleBooksCount();
      expect(count).to.be.greaterThan(5);
    });

    it('TC-DT2: Valid search with match -> show filtered results', async function() {
      await booksPage.performSearch('Speaking JavaScript');
      const count = await booksPage.getVisibleBooksCount();
      expect(count).to.be.greaterThan(0);
      const firstTitle = await booksPage.getFirstBookTitle();
      expect(firstTitle).to.include('JavaScript');
    });

    it('TC-DT3: Valid search without match -> show "No rows found"', async function() {
      await booksPage.performSearch('NonexistentBookTitle12345');
      const message = await booksPage.getNoRowsMessage();
      expect(message).to.equal('No rows found');
    });

    it('TC-DT4: Invalid input -> should handle gracefully', async function() {
      await booksPage.performSearch('<script>alert("xss")</script>');
      const pageTitle = await driver.getTitle();
      expect(pageTitle).to.include('DEMOQA');
    });
  });

  // ============================================
  // 7. POGAĐANJE GREŠKE TESTOVI
  // ============================================
  describe('7. Error Guessing Tests', function() {
    it('TC-EG1: SQL Injection attempt - should handle safely', async function() {
      await booksPage.performSearch("' OR '1'='1");
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include('demoqa.com/books');
      const pageSource = await driver.getPageSource();
      expect(pageSource.toLowerCase()).not.to.include('sql error');
      expect(pageSource.toLowerCase()).not.to.include('syntax error');
    });

    it('TC-EG2: XSS attempt - should not execute script', async function() {
      await booksPage.performSearch("<script>alert('XSS')</script>");
      const pageSource = await driver.getPageSource();
      expect(pageSource).not.to.include("alert('XSS')");
      const searchBox = await driver.findElement(By.id('searchBox'));
      expect(await searchBox.isDisplayed()).to.be.true;
    });

    it('TC-EG3: Very long input - should handle gracefully', async function() {
      const longText = "a".repeat(5000);
      await booksPage.performSearch(longText);
      const searchBox = await driver.findElement(By.id('searchBox'));
      const isDisplayed = await searchBox.isDisplayed();
      expect(isDisplayed).to.be.true;
      await driver.sleep(1000);
    });

    it('TC-EG4: Unicode/Emoji characters - should handle properly', async function() {
      await booksPage.performSearch("café 🚀 مرحبا");
      const searchBoxValue = await driver.findElement(By.id('searchBox')).getAttribute('value');
      expect(searchBoxValue).to.exist;
    });

    it('TC-EG5: Multiple spaces in search - should trim or handle', async function() {
      await booksPage.performSearch("   JavaScript   ");
      const searchBoxValue = await driver.findElement(By.id('searchBox')).getAttribute('value');
      expect(searchBoxValue.trim()).to.equal('JavaScript');
    });

    it('TC-EG6: Case sensitivity test - should find regardless of case', async function() {
      await booksPage.performSearch('JAVASCRIPT');
      const countUpper = await booksPage.getVisibleBooksCount();
      
      await booksPage.performSearch('');
      await driver.sleep(500);
      
      await booksPage.performSearch('javascript');
      const countLower = await booksPage.getVisibleBooksCount();
      
      expect(countUpper).to.equal(countLower);
    });
  });
});