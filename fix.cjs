const fs = require('fs');

// ==== Fix cards.ts ====
let cardsTs = fs.readFileSync('src/data/cards.ts', 'utf8');
const champions = ['monk', 'archer-queen', 'mighty-miner', 'golden-knight', 'skeleton-king', 'little-prince', 'goblinstein'];
for (let id of champions) {
    let regex = new RegExp(`id: '${id}',([\\s\\S]*?)rarity: 'hero',\\s+isHero: true,`, 'g');
    cardsTs = cardsTs.replace(regex, `id: '${id}',$1rarity: 'champion',\n    isChampion: true,`);
}

// Ensure the new heroes are at the bottom of the heroes section or create a new section
const newHeroes = `
  {
    id: 'barbarian-king',
    name: 'Barbarian King',
    elixir: 5,
    type: 'troop',
    rarity: 'hero',
    isHero: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/barbarian-barrel.png', // placeholder
    description: 'The King of Barbarians! Swings his iron fist!'
  },
  {
    id: 'grand-warden',
    name: 'Grand Warden',
    elixir: 4,
    type: 'troop',
    rarity: 'hero',
    isHero: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/heal-spirit.png', // placeholder
    description: 'A magical hero that supports his allies.'
  },
  {
    id: 'royal-champion',
    name: 'Royal Champion',
    elixir: 4,
    type: 'troop',
    rarity: 'hero',
    isHero: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/royal-delivery.png', // placeholder
    description: 'Throws her shield to hit multiple targets!'
  },
  {
    id: 'battle-machine',
    name: 'Battle Machine',
    elixir: 5,
    type: 'troop',
    rarity: 'hero',
    isHero: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/flying-machine.png', // placeholder
    description: 'A powerful machine steered by the Master Builder.'
  },
`;
cardsTs = cardsTs.replace('// --- Legendaries (19) ---', newHeroes + '\n  // --- Legendaries (19) ---');
fs.writeFileSync('src/data/cards.ts', cardsTs);

// ==== Fix index.css ====
let indexCss = fs.readFileSync('src/index.css', 'utf8');
indexCss = indexCss.replace('.card-hero {', '.card-champion {\n  @apply border-yellow-400/50 bg-yellow-950/20 shadow-[0_0_20px_rgba(250,204,21,0.2)]; \n}\n.card-hero {');
fs.writeFileSync('src/index.css', indexCss);

// ==== Fix App.tsx ====
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');
appTsx = appTsx.replace(/'hero'\].map/g, "'champion', 'hero'].map");
// update filter count logic
appTsx = appTsx.replace(/const heroCount = validCards.filter\(c => c\.isHero \|\| c\.rarity === 'hero'\)\.length;/g, "const heroCount = validCards.filter(c => c.isChampion || c.rarity === 'champion').length;");
appTsx = appTsx.replace(/Decks can only contain 1 Champion \(Hero\)!/g, "Decks can only contain 1 Champion!");
// rename rarity check for champion (the yellow tags)
appTsx = appTsx.replace(/card\.rarity === 'hero'/g, "(card.rarity === 'hero' || card.rarity === 'champion')");
appTsx = appTsx.replace(/card\.isHero \|\| \(\(card\.rarity as string\) === 'hero' \|\| card\.rarity === 'champion'\)/g, "card.isHero || card.isChampion || card.rarity === 'hero' || card.rarity === 'champion'");

fs.writeFileSync('src/App.tsx', appTsx);

console.log('Update completed');
