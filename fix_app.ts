import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Line 128
content = content.replace(
  "epic: 2,\n      legendary: 3,\n      hero: 4",
  "epic: 2,\n      legendary: 3,\n      champion: 4,\n      hero: 5"
);

// Lines 162
content = content.replace(
  "card.rarity === 'hero' || card.hasHeroForm",
  "card.rarity === 'champion' || card.rarity === 'hero' || card.hasHeroForm"
);
// Line 164
content = content.replace(
  "card.rarity === 'hero' || card.hasHeroForm",
  "card.rarity === 'champion' || card.rarity === 'hero' || card.hasHeroForm"
);

// Line 289
content = content.replace(
  "validCards.filter(c => c.isHero || c.rarity === 'hero')",
  "validCards.filter(c => c.isChampion || c.rarity === 'champion')"
);
content = content.replace(
  "'Decks can only contain 1 Champion (Hero)!'",
  "'Decks can only contain 1 Champion!'"
);

// Line 340
content = content.replace(
  "(card?.rarity === 'hero' || card?.hasHeroForm)",
  "(card?.rarity === 'champion' || card?.rarity === 'hero' || card?.hasHeroForm)"
);

// Line 357
content = content.replace(
  "(card.rarity === 'hero' || card.hasHeroForm)",
  "(card.rarity === 'champion' || card.rarity === 'hero' || card.hasHeroForm)"
);

// Line 358
content = content.replace(
  "if (card.isHero || card.rarity === 'hero') {",
  "if (card.isChampion || card.rarity === 'champion' || card.isHero || card.rarity === 'hero') {"
);

// Line 373
content = content.replace(
  "(card?.rarity === 'hero' || card?.hasHeroForm)",
  "(card?.rarity === 'champion' || card?.rarity === 'hero' || card?.hasHeroForm)"
);

// Line 448
content = content.replace(
  "card.rarity !== 'hero'",
  "card.rarity !== 'champion' && card.rarity !== 'hero'"
);

// Line 614
content = content.replace(
  "['all', 'common', 'rare', 'epic', 'legendary', 'hero']",
  "['all', 'common', 'rare', 'epic', 'legendary', 'champion', 'hero']"
);

// Line 668 & 676 & 685
content = content.replace(
  /card\.rarity === 'hero' \|\| card\.hasHeroForm/g,
  "card.rarity === 'champion' || card.rarity === 'hero' || card.hasHeroForm"
);

content = content.replace(
  /<div className="bg-amber-600 text-\[8px\] font-black uppercase px-1 rounded shadow-sm">HERO<\/div>/g,
  `<div className="bg-amber-600 text-[8px] font-black uppercase px-1 rounded shadow-sm">{card.rarity === 'champion' ? 'CHAMP' : 'HERO'}</div>`
);

// Line 716 and 947
content = content.replace(
  /card\.rarity === 'hero' && "bg-amber-500\/20 text-amber-400 border-amber-500\/30"/g,
  `card.rarity === 'hero' && "bg-amber-500/20 text-amber-400 border-amber-500/30",\n                        card.rarity === 'champion' && "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"`
);


fs.writeFileSync('src/App.tsx', content);

// index.css
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace('.card-hero {', '.card-champion {\n  @apply border-yellow-400/50 bg-yellow-950/20 shadow-[0_0_20px_rgba(250,204,21,0.2)]; \n}\n.card-hero {\n  @apply border-amber-500/50 bg-amber-950/20;\n}\n/*');
fs.writeFileSync('src/index.css', css);

console.log('App.tsx updated');
