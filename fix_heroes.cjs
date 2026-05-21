const fs = require('fs');
let content = fs.readFileSync('src/data/cards.ts', 'utf8');

const champions = ['monk', 'archer-queen', 'mighty-miner', 'golden-knight', 'skeleton-king', 'little-prince', 'goblinstein'];

for (let id of champions) {
    let regex = new RegExp(`id: '${id}',([\\s\\S]*?)rarity: 'hero',\\s+isHero: true,`, 'g');
    content = content.replace(regex, `id: '${id}',$1rarity: 'champion',\n    isChampion: true,`);
}

fs.writeFileSync('src/data/cards.ts', content);
console.log('Fixed cards.ts');
