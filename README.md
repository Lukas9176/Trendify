# Trendify – LED Ringlampa 26cm

Detta är en enkel hemsida för **Trendify**, där besökare kan se och köpa en LED-ringlampa (26 cm) via Amazon, lämna recensioner och se kommande produkter. Sidan använder ett mörkt tema med pastell-accenter.

---

## Funktioner

- Produktpresentation med bild, beskrivning och köpknapp (Amazon-länk)  
- Recensionssystem där användare kan lämna och se recensioner (sparas i webbläsarens localStorage)  
- Sektion för kommande produkter med bilder och beskrivningar  
- Modern design med mörk bakgrund och pastellfärger  

---

## Filer

- `index.html` – Hemsidan  
- `styles.css` – Stilmallar (CSS)  
- `app.js` – JavaScript för recensioner  

---

## Installation / Köra lokalt

1. Ladda ner eller klona detta repository.  
2. Se till att alla filer (`index.html`, `styles.css`, `app.js`) ligger i samma mapp.  
3. Öppna `index.html` i din webbläsare (Chrome, Firefox, Safari, etc.).  

> Ingen server behövs – sidan är statisk. Recensionerna sparas lokalt i webbläsaren.

---

## Anpassa

- Byt Amazon-länk i `index.html` för att använda din egen affiliate-länk:  
```html
<a href="DIN_AMAZON_LANK" target="_blank" class="btn-buy">Köp på Amazon</a>