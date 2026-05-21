import fs from 'fs';
let content = fs.readFileSync('src/data/cards.ts', 'utf8');

const regexToRemove = /\{\s*id:\s*'hero-(mini-pekka|balloon|goblins|magic-archer|mega-minion|barbarian-barrel|knight|wizard|ice-golem|giant)'[\s\S]*?description:\s*'[^']*'\s*\},?\s*/g;
content = content.replace(regexToRemove, '');
content = content.replace(/\/\/ --- User Requested Heroes ---\s*/g, '');

const cardsWithHeroForm = ['mini-pekka', 'balloon', 'goblins', 'magic-archer', 'mega-minion', 'barbarian-barrel', 'knight', 'wizard', 'ice-golem', 'giant'];

for (const card of cardsWithHeroForm) {
  const cardRegex = new RegExp(`(id:\\s*'${card}',[\\s\\S]*?)(hasEvolution:\\s*true,\\s*)?(image:\\s*'[^']+',\\s*description:\\s*'[^']+')`);
  content = content.replace(cardRegex, `$1$2hasHeroForm: true,\n    $3`);
}

fs.writeFileSync('src/data/cards.ts', content);
