function handleSearch(inputText) {
  if (inputText === null || inputText === undefined) {
    displayError("Invalid input"); // Statement 1, Decision 1 (DA)
    return;
  } // Decision 1 (NE)

  let cleanText = inputText.trim();

  if (cleanText.length === 0) {
    displayAllBooks(); // Statement 2, Decision 2 (DA)
    return;
  } // Decision 2 (NE)

  if (!isValidInput(cleanText)) { // funkcija za provjeru validnosti teksta
    displayError("Invalid characters"); // Statement 3, Decision 3 (DA)
    return;
  } // Decision 3 (NE)

  let results = findBooks(cleanText); // pretraga

  if (results.length > 0) {
    displayResults(results); // Statement 4, Decision 4 (DA)
  } else {
    displayNoResults(); // Statement 5, Decision 4 (NE)
  }
}