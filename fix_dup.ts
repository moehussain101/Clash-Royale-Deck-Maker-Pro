import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/card\.rarity === 'champion' \|\| card\.rarity === 'champion' \|\| card\.rarity === 'champion'/g, "card.rarity === 'champion'");
content = content.replace(/card\.rarity === 'champion' \|\| card\.rarity === 'champion'/g, "card.rarity === 'champion'");
fs.writeFileSync('src/App.tsx', content);
