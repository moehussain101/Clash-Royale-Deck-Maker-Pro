import fs from 'fs';

let content = fs.readFileSync('src/data/cards.ts', 'utf8');
const cards = ['mini-pekka', 'balloon', 'goblins', 'magic-archer', 'mega-minion', 'barbarian-barrel', 'knight', 'wizard', 'ice-golem', 'giant', 'dark-prince', 'bowler'];

async function check() {
  for (const c of cards) {
    let r1 = await fetch('https://cdn.royaleapi.com/static/img/cards-150/super-' + c + '.png');
    let r2 = await fetch('https://cdn.royaleapi.com/static/img/cards-150/' + c + '-super.png');
    console.log(c, 'super-X:', r1.status, 'X-super:', r2.status);
  }
}
check();
