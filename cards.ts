export interface Card {
  id: string;
  name: string;
  elixir: number;
  type: 'troop' | 'spell' | 'building';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'champion' | 'hero';
  isChampion?: boolean;
  isHero?: boolean;
  hasEvolution?: boolean;
  hasHeroForm?: boolean;
  evoImage?: string;
  evoDescription?: string;
  image: string;
  description: string;
}

export const cards: Card[] = [
  // --- Heroes / Champions (6) ---
  {
    id: 'monk',
    name: 'Monk',
    elixir: 5,
    type: 'troop',
    rarity: 'champion',
    isChampion: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/monk.png',
    description: 'A master of martial arts. He can deflect projectiles back at the enemies!'
  },
  {
    id: 'archer-queen',
    name: 'Archer Queen',
    elixir: 5,
    type: 'troop',
    rarity: 'champion',
    isChampion: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/archer-queen.png',
    description: 'The Queen of Archers. She can go invisible for a short duration.'
  },
  {
    id: 'mighty-miner',
    name: 'Mighty Miner',
    elixir: 4,
    type: 'troop',
    rarity: 'champion',
    isChampion: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/mighty-miner.png',
    description: 'A hero with a drill that increases damage over time!'
  },
  {
    id: 'golden-knight',
    name: 'Golden Knight',
    elixir: 4,
    type: 'troop',
    rarity: 'champion',
    isChampion: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/golden-knight.png',
    description: 'Dashes through enemies with his impressive hair and sword!'
  },
  {
    id: 'skeleton-king',
    name: 'Skeleton King',
    elixir: 4,
    type: 'troop',
    rarity: 'champion',
    isChampion: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/skeleton-king.png',
    description: 'The King of Skeletons. He can summon a graveyard of his fallen brothers.'
  },
  {
    id: 'little-prince',
    name: 'Little Prince',
    elixir: 3,
    type: 'troop',
    rarity: 'champion',
    isChampion: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/little-prince.png',
    description: 'The Royal Heir! He can call for help from his big friend, Guardian.'
  },
  // --- Legendaries (19) ---
  {
    id: 'log',
    name: 'The Log',
    elixir: 2,
    type: 'spell',
    rarity: 'legendary',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/the-log.png',
    description: 'Crushes everything in its path.'
  },
  {
    id: 'miner',
    name: 'Miner',
    elixir: 3,
    type: 'troop',
    rarity: 'legendary',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/miner.png',
    description: 'Can be placed anywhere on the map.'
  },
  {
    id: 'princess',
    name: 'Princess',
    elixir: 3,
    type: 'troop',
    rarity: 'legendary',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/princess.png',
    description: 'Long range area damage.'
  },
  {
    id: 'ice-wizard',
    name: 'Ice Wizard',
    elixir: 3,
    type: 'troop',
    rarity: 'legendary',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/ice-wizard.png',
    description: 'Slows down enemies with ice.'
  },
  {
    id: 'electro-wizard',
    name: 'Electro Wizard',
    elixir: 4,
    type: 'troop',
    rarity: 'legendary',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/electro-wizard.png',
    description: 'Zaps two targets and stuns them.'
  },
  {
    id: 'bandit',
    name: 'Bandit',
    elixir: 3,
    type: 'troop',
    rarity: 'legendary',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/bandit.png',
    description: 'Dashes through enemies.'
  },
  {
    id: 'royal-ghost',
    name: 'Royal Ghost',
    elixir: 3,
    type: 'troop',
    rarity: 'legendary',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/royal-ghost.png',
    description: 'Invisible until he attacks.'
  },
  {
    id: 'lumberjack',
    name: 'Lumberjack',
    elixir: 4,
    type: 'troop',
    rarity: 'legendary',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/lumberjack.png',
    description: 'Drops Rage upon death.'
  },
  {
    id: 'night-witch',
    name: 'Night Witch',
    elixir: 4,
    type: 'troop',
    rarity: 'legendary',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/night-witch.png',
    description: 'Summons Bats periodically.'
  },
  {
    id: 'magic-archer',
    name: 'Magic Archer',
    elixir: 4,
    type: 'troop',
    rarity: 'legendary',
    hasHeroForm: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/magic-archer.png',
    description: 'Arrows pass through all targets in a line.'
  },
  {
    id: 'inferno-dragon',
    name: 'Inferno Dragon',
    elixir: 4,
    type: 'troop',
    rarity: 'legendary',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/inferno-dragon.png',
    description: 'Focused beam damage that increases over time.'
  },
  {
    id: 'graveyard',
    name: 'Graveyard',
    elixir: 5,
    type: 'spell',
    rarity: 'legendary',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/graveyard.png',
    description: 'Spawns Skeletons over a long duration.'
  },
  {
    id: 'sparky',
    name: 'Sparky',
    elixir: 6,
    type: 'troop',
    rarity: 'legendary',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/sparky.png',
    description: 'Slow charge for massive area damage.'
  },
  {
    id: 'lava-hound',
    name: 'Lava Hound',
    elixir: 7,
    type: 'troop',
    rarity: 'legendary',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/lava-hound.png',
    description: 'Tanky flying unit that spawns Lava Pups.'
  },
  {
    id: 'ram-rider',
    name: 'Ram Rider',
    elixir: 5,
    type: 'troop',
    rarity: 'legendary',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/ram-rider.png',
    description: 'Charges buildings and slows troops.'
  },
  {
    id: 'fisherman',
    name: 'Fisherman',
    elixir: 3,
    type: 'troop',
    rarity: 'legendary',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/fisherman.png',
    description: 'Pulls enemies toward him with a hook.'
  },
  {
    id: 'mother-witch',
    name: 'Mother Witch',
    elixir: 4,
    type: 'troop',
    rarity: 'legendary',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/mother-witch.png',
    description: 'Turns enemies into Cursed Hogs.'
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    elixir: 4,
    type: 'troop',
    rarity: 'legendary',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/phoenix.png',
    description: 'Rebirths from an egg after death.'
  },
  {
    id: 'mega-knight',
    name: 'Mega Knight',
    elixir: 7,
    type: 'troop',
    rarity: 'legendary',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/mega-knight.png',
    description: 'Jumps onto enemies with massive impact damage.'
  },
  {
    id: 'goblin-machine',
    name: 'Goblin Machine',
    elixir: 5,
    type: 'troop',
    rarity: 'legendary',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/goblin-machine.png',
    description: 'A mechanical beast powered by Goblins!'
  },

  // --- Epics (25) ---
  {
    id: 'pekka',
    name: 'P.E.K.K.A',
    elixir: 7,
    type: 'troop',
    rarity: 'epic',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/pekka.png',
    description: 'Powerful melee tank.'
  },
  {
    id: 'golem',
    name: 'Golem',
    elixir: 8,
    type: 'troop',
    rarity: 'epic',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/golem.png',
    description: 'Ultra tanky unit that targets buildings.'
  },
  {
    id: 'balloon',
    name: 'Balloon',
    elixir: 5,
    type: 'troop',
    rarity: 'epic',
    hasHeroForm: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/balloon.png',
    description: 'Heavy air damage to buildings.'
  },
  {
    id: 'goblin-barrel',
    name: 'Goblin Barrel',
    elixir: 3,
    type: 'spell',
    rarity: 'epic',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/goblin-barrel.png',
    description: 'Three Goblins that can land anywhere.'
  },
  {
    id: 'goblin-giant',
    name: 'Goblin Giant',
    elixir: 6,
    type: 'troop',
    rarity: 'epic',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/goblin-giant.png',
    description: 'A heavy-hitting giant with two spear goblins on his back.'
  },
  {
    id: 'x-bow',
    name: 'X-Bow',
    elixir: 6,
    type: 'building',
    rarity: 'epic',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/x-bow.png',
    description: 'Rapid-fire offensive building.'
  },
  {
    id: 'poison',
    name: 'Poison',
    elixir: 4,
    type: 'spell',
    rarity: 'epic',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/poison.png',
    description: 'Area damage over time.'
  },
  {
    id: 'freeze',
    name: 'Freeze',
    elixir: 4,
    type: 'spell',
    rarity: 'epic',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/freeze.png',
    description: 'Stops everything in the area.'
  },
  {
    id: 'rage',
    name: 'Rage',
    elixir: 2,
    type: 'spell',
    rarity: 'epic',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/rage.png',
    description: 'Speeds up units and buildings.'
  },
  {
    id: 'baby-dragon',
    name: 'Baby Dragon',
    elixir: 4,
    type: 'troop',
    rarity: 'epic',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/baby-dragon.png',
    description: 'Airborne area splash.'
  },
  {
    id: 'lightning',
    name: 'Lightning',
    elixir: 6,
    type: 'spell',
    rarity: 'epic',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/lightning.png',
    description: 'Strikes three high-HP targets.'
  },
  {
    id: 'dark-prince',
    name: 'Dark Prince',
    elixir: 4,
    type: 'troop',
    rarity: 'epic',
    hasHeroForm: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/dark-prince.png',
    description: 'Area damage with a shield.'
  },
  {
    id: 'prince',
    name: 'Prince',
    elixir: 5,
    type: 'troop',
    rarity: 'epic',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/prince.png',
    description: 'Charges for double damage.'
  },
  {
    id: 'witch',
    name: 'Witch',
    elixir: 5,
    type: 'troop',
    rarity: 'epic',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/witch.png',
    description: 'Summons Skeletons and deals splash.'
  },
  {
    id: 'bowler',
    name: 'Bowler',
    elixir: 5,
    type: 'troop',
    rarity: 'epic',
    hasHeroForm: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/bowler.png',
    description: 'Bounces rocks that knock back.'
  },
  {
    id: 'executioner',
    name: 'Executioner',
    elixir: 5,
    type: 'troop',
    rarity: 'epic',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/executioner.png',
    description: 'Axe hits twice in a line.'
  },
  {
    id: 'skeleton-army',
    name: 'Skeleton Army',
    elixir: 3,
    type: 'troop',
    rarity: 'epic',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/skeleton-army.png',
    description: 'Swarm of 15 Skeletons.'
  },
  {
    id: 'guards',
    name: 'Guards',
    elixir: 3,
    type: 'troop',
    rarity: 'epic',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/guards.png',
    description: 'Three shielded skeletons.'
  },
  {
    id: 'barbarian-barrel',
    name: 'Barbarian Barrel',
    elixir: 2,
    type: 'spell',
    rarity: 'epic',
    hasHeroForm: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/barbarian-barrel.png',
    description: 'Rolls and pops out a Barbarian.'
  },
  {
    id: 'tornado',
    name: 'Tornado',
    elixir: 3,
    type: 'spell',
    rarity: 'epic',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/tornado.png',
    description: 'Drags units to its center.'
  },
  {
    id: 'clone',
    name: 'Clone',
    elixir: 3,
    type: 'spell',
    rarity: 'epic',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/clone.png',
    description: 'Clones all units in area with 1 HP.'
  },
  {
    id: 'electro-giant',
    name: 'Electro Giant',
    elixir: 7,
    type: 'troop',
    rarity: 'epic',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/electro-giant.png',
    description: 'Zaps enemies that attack him.'
  },
  {
    id: 'electro-dragon',
    name: 'Electro Dragon',
    elixir: 5,
    type: 'troop',
    rarity: 'epic',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/electro-dragon.png',
    description: 'Chain zap attacks.'
  },
  {
    id: 'giant-skeleton',
    name: 'Giant Skeleton',
    elixir: 6,
    type: 'troop',
    rarity: 'epic',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/giant-skeleton.png',
    description: 'Huge bomb damage on death.'
  },
  {
    id: 'hunter',
    name: 'Hunter',
    elixir: 4,
    type: 'troop',
    rarity: 'epic',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/hunter.png',
    description: 'Shotgun blast damage.'
  },
  {
    id: 'wall-breakers',
    name: 'Wall Breakers',
    elixir: 2,
    type: 'troop',
    rarity: 'epic',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/wall-breakers.png',
    description: 'Duo that targets buildings.'
  },
  {
    id: 'goblin-drill',
    name: 'Goblin Drill',
    elixir: 4,
    type: 'building',
    rarity: 'epic',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/goblin-drill.png',
    description: 'Tunnels and spawns Goblins.'
  },
  {
    id: 'goblin-curse',
    name: 'Goblin Curse',
    elixir: 2,
    type: 'spell',
    rarity: 'epic',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/goblin-curse.png',
    description: 'Turns enemy units into Goblins!'
  },
  {
    id: 'void',
    name: 'Void',
    elixir: 3,
    type: 'spell',
    rarity: 'epic',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/void.png',
    description: 'Concentrated dark energy.'
  },

  // --- Rares (28) ---
  {
    id: 'hog-rider',
    name: 'Hog Rider',
    elixir: 4,
    type: 'troop',
    rarity: 'rare',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/hog-rider.png',
    description: 'Fast building-targeter.'
  },
  {
    id: 'fireball',
    name: 'Fireball',
    elixir: 4,
    type: 'spell',
    rarity: 'rare',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/fireball.png',
    description: 'Medium area damage.'
  },
  {
    id: 'mega-minion',
    name: 'Mega Minion',
    elixir: 3,
    type: 'troop',
    rarity: 'rare',
    hasHeroForm: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/mega-minion.png',
    description: 'Armored flying heavy-hitter.'
  },
  {
    id: 'tombstone',
    name: 'Tombstone',
    elixir: 3,
    type: 'building',
    rarity: 'rare',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/tombstone.png',
    description: 'Spawns Skeletons periodically and notably on death.'
  },
  {
    id: 'musketeer',
    name: 'Musketeer',
    elixir: 4,
    type: 'troop',
    rarity: 'rare',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/musketeer.png',
    description: 'Versatile range troop.'
  },
  {
    id: 'valkyrie',
    name: 'Valkyrie',
    elixir: 4,
    type: 'troop',
    rarity: 'rare',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/valkyrie.png',
    description: 'Melee splash damage.'
  },
  {
    id: 'mini-pekka',
    name: 'Mini P.E.K.K.A',
    elixir: 4,
    type: 'troop',
    rarity: 'rare',
    hasHeroForm: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/mini-pekka.png',
    description: 'High damage glass cannon.'
  },
  {
    id: 'wizard',
    name: 'Wizard',
    elixir: 5,
    type: 'troop',
    rarity: 'rare',
    hasEvolution: true,
    hasHeroForm: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/wizard.png',
    description: 'Expensive but powerful splash.'
  },
  {
    id: 'giant',
    name: 'Giant',
    elixir: 5,
    type: 'troop',
    rarity: 'rare',
    hasHeroForm: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/giant.png',
    description: 'Low cost building tank.'
  },
  {
    id: 'ice-golem',
    name: 'Ice Golem',
    elixir: 2,
    type: 'troop',
    rarity: 'rare',
    hasHeroForm: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/ice-golem.png',
    description: 'Cheap kite tank.'
  },
  {
    id: 'battle-ram',
    name: 'Battle Ram',
    elixir: 4,
    type: 'troop',
    rarity: 'rare',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/battle-ram.png',
    description: 'Charges buildings and spawns barbs.'
  },
  {
    id: 'rocket',
    name: 'Rocket',
    elixir: 6,
    type: 'spell',
    rarity: 'rare',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/rocket.png',
    description: 'Massive tower finisher.'
  },
  {
    id: 'inferno-tower',
    name: 'Inferno Tower',
    elixir: 5,
    type: 'building',
    rarity: 'rare',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/inferno-tower.png',
    description: 'Kills tanks easily.'
  },
  {
    id: 'bomb-tower',
    name: 'Bomb Tower',
    elixir: 4,
    type: 'building',
    rarity: 'rare',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/bomb-tower.png',
    description: 'Splash damage building.'
  },
  {
    id: 'elixir-collector',
    name: 'Elixir Collector',
    elixir: 6,
    type: 'building',
    rarity: 'rare',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/elixir-collector.png',
    description: 'Generate extra Elixir.'
  },
  {
    id: 'furnace',
    name: 'Furnace',
    elixir: 4,
    type: 'building',
    rarity: 'rare',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/furnace.png',
    description: 'Spawns Fire Spirits.'
  },
  {
    id: 'goblin-hut',
    name: 'Goblin Hut',
    elixir: 5,
    type: 'building',
    rarity: 'rare',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/goblin-hut.png',
    description: 'Spawns Spear Goblins.'
  },
  {
    id: 'barbarian-hut',
    name: 'Barbarian Hut',
    elixir: 7,
    type: 'building',
    rarity: 'rare',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/barbarian-hut.png',
    description: 'Spawns Barbarians.'
  },
  {
    id: 'goblin-cage',
    name: 'Goblin Cage',
    elixir: 4,
    type: 'building',
    rarity: 'rare',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/goblin-cage.png',
    description: 'Spawns a Brawler.'
  },
  {
    id: 'zappies',
    name: 'Zappies',
    elixir: 4,
    type: 'troop',
    rarity: 'rare',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/zappies.png',
    description: 'Trio of stun machines.'
  },
  {
    id: 'flying-machine',
    name: 'Flying Machine',
    elixir: 4,
    type: 'troop',
    rarity: 'rare',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/flying-machine.png',
    description: 'Long range flying marksman.'
  },
  {
    id: 'royal-hogs',
    name: 'Royal Hogs',
    elixir: 5,
    type: 'troop',
    rarity: 'rare',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/royal-hogs.png',
    description: 'Four pigs that jump rivers.'
  },
  {
    id: 'heal-spirit',
    name: 'Heal Spirit',
    elixir: 1,
    type: 'troop',
    rarity: 'rare',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/heal-spirit.png',
    description: 'Heals friendly troops.'
  },
  {
    id: 'elixir-golem',
    name: 'Elixir Golem',
    elixir: 3,
    type: 'troop',
    rarity: 'rare',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/elixir-golem.png',
    description: 'Gives opponent Elixir on death.'
  },
  {
    id: 'battle-healer',
    name: 'Battle Healer',
    elixir: 4,
    type: 'troop',
    rarity: 'rare',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/battle-healer.png',
    description: 'Passive healing aura.'
  },
  {
    id: 'earthquake',
    name: 'Earthquake',
    elixir: 3,
    type: 'spell',
    rarity: 'rare',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/earthquake.png',
    description: 'Anti-building spell.'
  },
  {
    id: 'three-musks',
    name: 'Three Musketeers',
    elixir: 9,
    type: 'troop',
    rarity: 'rare',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/three-musketeers.png',
    description: 'Ultimate glass cannon swarm.'
  },
  {
    id: 'dart-goblin',
    name: 'Dart Goblin',
    elixir: 3,
    type: 'troop',
    rarity: 'rare',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/dart-goblin.png',
    description: 'Fastest range attacker.'
  },

  // --- Commons (32) ---
  {
    id: 'knight',
    name: 'Knight',
    elixir: 3,
    type: 'troop',
    rarity: 'common',
    hasEvolution: true,
    hasHeroForm: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/knight.png',
    description: 'Reliable melee mini-tank.'
  },
  {
    id: 'archers',
    name: 'Archers',
    elixir: 3,
    type: 'troop',
    rarity: 'common',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/archers.png',
    description: 'Pair of range units.'
  },
  {
    id: 'skeletons',
    name: 'Skeletons',
    elixir: 1,
    type: 'troop',
    rarity: 'common',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/skeletons.png',
    description: 'Cheap 1-elixir distraction.'
  },
  {
    id: 'goblins',
    name: 'Goblins',
    elixir: 2,
    type: 'troop',
    rarity: 'common',
    hasHeroForm: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/goblins.png',
    description: 'Fast melee swarm.'
  },
  {
    id: 'spear-goblins',
    name: 'Spear Goblins',
    elixir: 2,
    type: 'troop',
    rarity: 'common',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/spear-goblins.png',
    description: 'Cheap range distraction.'
  },
  {
    id: 'zap',
    name: 'Zap',
    elixir: 2,
    type: 'spell',
    rarity: 'common',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/zap.png',
    description: 'Stun spell.'
  },
  {
    id: 'arrows',
    name: 'Arrows',
    elixir: 3,
    type: 'spell',
    rarity: 'common',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/arrows.png',
    description: 'Large area cleanup spell.'
  },
  {
    id: 'minions',
    name: 'Minions',
    elixir: 3,
    type: 'troop',
    rarity: 'common',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/minions.png',
    description: 'Flying melee swarm.'
  },
  {
    id: 'minion-horde',
    name: 'Minion Horde',
    elixir: 5,
    type: 'troop',
    rarity: 'common',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/minion-horde.png',
    description: 'High risk high reward flight.'
  },
  {
    id: 'barbarians',
    name: 'Barbarians',
    elixir: 5,
    type: 'troop',
    rarity: 'common',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/barbarians.png',
    description: 'Hard melee defense.'
  },
  {
    id: 'royal-giant',
    name: 'Royal Giant',
    elixir: 6,
    type: 'troop',
    rarity: 'common',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/royal-giant.png',
    description: 'Ranged building-targeter.'
  },
  {
    id: 'royal-recruits',
    name: 'Royal Recruits',
    elixir: 7,
    type: 'troop',
    rarity: 'common',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/royal-recruits.png',
    description: 'Across the map line shield.'
  },
  {
    id: 'snowball',
    name: 'Giant Snowball',
    elixir: 2,
    type: 'spell',
    rarity: 'common',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/giant-snowball.png',
    description: 'Knockback and slow.'
  },
  {
    id: 'bats',
    name: 'Bats',
    elixir: 2,
    type: 'troop',
    rarity: 'common',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/bats.png',
    description: 'Cheap air swarm.'
  },
  {
    id: 'ice-spirit',
    name: 'Ice Spirit',
    elixir: 1,
    type: 'troop',
    rarity: 'common',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/ice-spirit.png',
    description: 'Freezes for 1 elixir.'
  },
  {
    id: 'fire-spirit',
    name: 'Fire Spirit',
    elixir: 1,
    type: 'troop',
    rarity: 'common',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/fire-spirit.png',
    description: 'Splash for 1 elixir.'
  },
  {
    id: 'electro-spirit',
    name: 'Electro Spirit',
    elixir: 1,
    type: 'troop',
    rarity: 'common',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/electro-spirit.png',
    description: 'Chaining stun for 1 elixir.'
  },
  {
    id: 'firecracker',
    name: 'Firecracker',
    elixir: 3,
    type: 'troop',
    rarity: 'common',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/firecracker.png',
    description: 'Self-knockback splash.'
  },
  {
    id: 'skeleton-barrel',
    name: 'Skeleton Barrel',
    elixir: 3,
    type: 'troop',
    rarity: 'common',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/skeleton-barrel.png',
    description: 'Building target swarm.'
  },
  {
    id: 'mortar',
    name: 'Mortar',
    elixir: 4,
    type: 'building',
    rarity: 'common',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/mortar.png',
    description: 'Long distance area building.'
  },
  {
    id: 'cannon',
    name: 'Cannon',
    elixir: 3,
    type: 'building',
    rarity: 'common',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/cannon.png',
    description: 'Cheap building defense.'
  },
  {
    id: 'tesla',
    name: 'Tesla',
    elixir: 4,
    type: 'building',
    rarity: 'common',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/tesla.png',
    description: 'High damage building.'
  },
  {
    id: 'elite-barbarians',
    name: 'Elite Barbarians',
    elixir: 6,
    type: 'troop',
    rarity: 'common',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/elite-barbarians.png',
    description: 'Fast heavy melee duo.'
  },
  {
    id: 'bomber',
    name: 'Bomber',
    elixir: 2,
    type: 'troop',
    rarity: 'common',
    hasEvolution: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/bomber.png',
    description: 'Cheap ground splash.'
  },
  {
    id: 'goblin-gang',
    name: 'Goblin Gang',
    elixir: 3,
    type: 'troop',
    rarity: 'common',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/goblin-gang.png',
    description: 'Mixed melee/range swarm.'
  },
  {
    id: 'cannon-cart',
    name: 'Cannon Cart',
    elixir: 5,
    type: 'troop',
    rarity: 'epic',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/cannon-cart.png',
    description: 'A cannon on wheels!'
  },
  {
    id: 'mirror',
    name: 'Mirror',
    elixir: 0,
    type: 'spell',
    rarity: 'epic',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/mirror.png',
    description: 'Mirrors your last card for +1 Elixir.'
  },
  {
    id: 'royal-delivery',
    name: 'Royal Delivery',
    elixir: 3,
    type: 'spell',
    rarity: 'common',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/royal-delivery.png',
    description: 'Drop damage and a recruit.'
  },
  {
    id: 'rascals',
    name: 'Rascals',
    elixir: 5,
    type: 'troop',
    rarity: 'common',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/rascals.png',
    description: 'Girl power and a boy tank.'
  },
  {
    id: 'skeleton-dragons',
    name: 'Skeleton Dragons',
    elixir: 4,
    type: 'troop',
    rarity: 'common',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/skeleton-dragons.png',
    description: 'Two flying bone spitters.'
  },
  {
    id: 'goblinstein',
    name: 'Goblinstein',
    elixir: 5,
    type: 'troop',
    rarity: 'champion',
    isChampion: true,
    image: 'https://cdn.royaleapi.com/static/img/cards-150/goblinstein.png',
    description: 'Frankenstein but green.'
  },
  {
    id: 'suspicious-bush',
    name: 'Suspicious Bush',
    elixir: 2,
    type: 'troop',
    rarity: 'rare',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/suspicious-bush.png',
    description: 'Sneaky shrubbery.'
  },
  {
    id: 'goblin-demolisher',
    name: 'Goblin Demolisher',
    elixir: 4,
    type: 'troop',
    rarity: 'rare',
    image: 'https://cdn.royaleapi.com/static/img/cards-150/goblin-demolisher.png',
    description: 'Blast master.'
  }
];
