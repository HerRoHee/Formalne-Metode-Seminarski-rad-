# Formalne-Metode-Seminarski-rad-

## Studenti
- Hero Esmir (IB220119)
- Šarić Vedad (IB220143)
- Muharemović Said (IB220076)

## Prvi zadatak
Za prvi zadatak odabrana je funkcionalnost pretrage na web stranici https://demoqa.com/books te je svakom tehnikom testiranja testirana i zabilježena u folderu ```test-cases```. Svaka tehnika je zapisana u zasebnom fajlu i numerisana u nazivu samog fajla.

## Drugi zadatak
Svih 10 automatiziranih testova se nalazi u folderu ```tests``` u fajlu ```searchTests.js``` i fajl ```searchTests.js``` se nalazi u istom folderu. ```package.json``` je u samom rootu repozitorija a fajlovi ```BasePage.js``` i ```BooksPage.js``` su u folderu ```pages```

Za testiranje ovih testova neophodno je klonirati repozitorij lokalno. Potom uraditi sljedeće:

1. Otvoriti projekat u VS Code i otvoriti terminal (ili nekom drugom alatu koji ima tu mogućnost) u rootu projekta te pokrenuti komandu ```npm install```
2. Nakon instalacije neophodnih node modula, pokrenuti komandu ```npm test```

## Treći zadatak
Pronađeni defekti se nalaze u dokumentu ```Bug Reports.docx``` u folderu ```bug-reports```

## Napomena
Automatizovani test u drugom zadatku u fajlu ```searchTests.js``` na 156 liniji koda je zakomentarisan zbog Chrome drivera koji ne podržava Unicode emoji karaktere direktno.

Timeout je podešen na 30 sekundi kojeg možete mijenjati u ```package.json``` na 71. liniji koda.