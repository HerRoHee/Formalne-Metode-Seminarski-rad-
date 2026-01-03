// pages/BooksPage.js
const { By, until } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class BooksPage extends BasePage {
  constructor(driver) {
    super(driver);
    // Locators
    this.searchBox = By.id('searchBox');
    this.clearSearchButton = By.css('input#searchBox + span'); // "x" button
    this.booksRows = By.css('.rt-tr-group:not(.pad-row) .rt-td:nth-child(2) a');
    this.noRowsDiv = By.css('.rt-noData');
    this.bookTitles = By.css('.rt-tr-group:not(.pad-row) .rt-td:nth-child(2)');
    this.authors = By.css('.rt-tr-group:not(.pad-row) .rt-td:nth-child(3)');
    this.publishers = By.css('.rt-tr-group:not(.pad-row) .rt-td:nth-child(4)');
    this.sortDropdown = By.css('.select-wrap select');
    this.pageSizeDropdown = By.css('.select-page-size');
    this.nextPageButton = By.css('.-next button');
    this.previousPageButton = By.css('.-previous button');
    this.currentPage = By.css('.input[aria-label="jump to page"]');
    this.totalPages = By.css('.-totalPages');
  }

  // === SEARCH METHODS ===
  async performSearch(keyword) {
    await this.type(this.searchBox, keyword);
    // Čekaj da se rezultati ažuriraju
    await this.sleep(800);
  }

  async clearSearch() {
    await this.click(this.clearSearchButton);
    await this.sleep(500);
  }

  async getSearchValue() {
    return await this.getAttribute(this.searchBox, 'value');
  }

  // === BOOK LIST METHODS ===
  async getVisibleBooksCount() {
    return await this.getElementCount(this.booksRows);
  }

  async getAllBookTitles() {
    const titles = [];
    const elements = await this.getAllElements(this.bookTitles);
    for (const element of elements) {
      titles.push(await element.getText());
    }
    return titles;
  }

  async getFirstBookTitle() {
    const element = await this.waitForElement(this.booksRows);
    return await element.getText();
  }

  async getAllAuthors() {
    const authors = [];
    const elements = await this.getAllElements(this.authors);
    for (const element of elements) {
      authors.push(await element.getText());
    }
    return authors;
  }

  async getAllPublishers() {
    const publishers = [];
    const elements = await this.getAllElements(this.publishers);
    for (const element of elements) {
      publishers.push(await element.getText());
    }
    return publishers;
  }

  async clickFirstBook() {
    await this.click(this.booksRows);
    await this.sleep(1000); // Čekaj da se stranica učita
  }

  async clickBookByTitle(title) {
    const books = await this.getAllBookTitles();
    const index = books.findIndex(t => t.includes(title));
    if (index !== -1) {
      const bookLinks = await this.getAllElements(this.booksRows);
      await bookLinks[index].click();
      await this.sleep(1000);
    } else {
      throw new Error(`Book with title containing "${title}" not found`);
    }
  }

  // === TABLE/GRID METHODS ===
  async getNoRowsMessage() {
    try {
      const element = await this.waitForElementVisible(this.noRowsDiv, 3000);
      return await element.getText();
    } catch (error) {
      return null; // Nema poruke "No rows found"
    }
  }

  async isNoRowsMessageDisplayed() {
    return await this.isElementDisplayed(this.noRowsDiv);
  }

  // === SORTING METHODS ===
  async sortBy(optionText) {
    await this.click(this.sortDropdown);
    const optionLocator = By.xpath(`//option[text()="${optionText}"]`);
    await this.click(optionLocator);
    await this.sleep(1000); // Čekaj da se sortira
  }

  async getCurrentSortOption() {
    const select = await this.waitForElement(this.sortDropdown);
    return await select.getAttribute('value');
  }

  // === PAGINATION METHODS ===
  async goToNextPage() {
    if (await this.isElementEnabled(this.nextPageButton)) {
      await this.click(this.nextPageButton);
      await this.sleep(1000);
    }
  }

  async goToPreviousPage() {
    if (await this.isElementEnabled(this.previousPageButton)) {
      await this.click(this.previousPageButton);
      await this.sleep(1000);
    }
  }

  async setPageSize(size) {
    await this.click(this.pageSizeDropdown);
    const optionLocator = By.xpath(`//option[text()="${size}"]`);
    await this.click(optionLocator);
    await this.sleep(1000);
  }

  async getCurrentPage() {
    const element = await this.waitForElement(this.currentPage);
    return await element.getAttribute('value');
  }

  async getTotalPages() {
    const element = await this.waitForElement(this.totalPages);
    const text = await element.getText();
    return parseInt(text.replace('/', ''), 10);
  }

  // === VALIDATION METHODS ===
  async verifySearchResultsContainText(text) {
    const titles = await this.getAllBookTitles();
    const lowerText = text.toLowerCase();
    
    for (const title of titles) {
      if (title.toLowerCase().includes(lowerText)) {
        return true;
      }
    }
    return false;
  }

  async verifyAllSearchResultsContainText(text) {
    const titles = await this.getAllBookTitles();
    const lowerText = text.toLowerCase();
    
    for (const title of titles) {
      if (!title.toLowerCase().includes(lowerText)) {
        return false;
      }
    }
    return titles.length > 0; // Vraća true samo ako ima rezultata i svi sadrže tekst
  }

  // === PERFORMANCE METHODS ===
  async measureSearchResponseTime(searchTerm) {
    const startTime = Date.now();
    await this.performSearch(searchTerm);
    const endTime = Date.now();
    return endTime - startTime;
  }

  // === SPECIAL SEARCH METHODS ===
  async searchAndVerify(searchTerm) {
    await this.performSearch(searchTerm);
    const count = await this.getVisibleBooksCount();
    
    if (count > 0) {
      const containsTerm = await this.verifySearchResultsContainText(searchTerm);
      return { success: true, count, containsTerm };
    } else {
      const noRowsMessage = await this.getNoRowsMessage();
      return { success: false, count, noRowsMessage };
    }
  }

  async searchWithEnterKey(searchTerm) {
    const searchBox = await this.waitForElement(this.searchBox);
    await searchBox.clear();
    await searchBox.sendKeys(searchTerm);
    await searchBox.sendKeys('\uE007'); // Enter key
    await this.sleep(800);
  }

  // === DATA EXTRACTION ===
  async getAllBooksData() {
    const books = [];
    const titles = await this.getAllBookTitles();
    const authors = await this.getAllAuthors();
    const publishers = await this.getAllPublishers();
    
    for (let i = 0; i < titles.length; i++) {
      books.push({
        title: titles[i],
        author: authors[i],
        publisher: publishers[i],
        index: i + 1
      });
    }
    
    return books;
  }

  async saveBooksDataToFile(filename = 'books_data.json') {
    const books = await this.getAllBooksData();
    const fs = require('fs');
    const path = require('path');
    
    const dataDir = path.join(__dirname, '..', 'test-data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(books, null, 2), 'utf8');
    return filePath;
  }
}

module.exports = BooksPage;