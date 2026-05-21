import { cards } from './cards';
import { Card } from './cards';

export interface MetaDeck {
  id: string;
  name: string;
  description: string;
  cardIds: string[];
  winRate: string;
  useRate: string;
}

export const META_DECKS: MetaDeck[] = [
  {
    id: 'meta-log-bait',
    name: 'Classic Log Bait',
    description: 'Bait out your opponent\'s small spells with Princess and Goblin Gang, then punish them with the Goblin Barrel.',
    cardIds: ['goblin-barrel', 'princess', 'goblin-gang', 'inferno-tower', 'log', 'rocket', 'knight', 'ice-spirit'],
    winRate: '52.4%',
    useRate: '8.1%'
  },
  {
    id: 'meta-26-hog',
    name: '2.6 Hog Cycle',
    description: 'Fast-paced cycle deck. Defend cheaply and counter-attack frequently with the Hog Rider.',
    cardIds: ['hog-rider', 'musketeer', 'ice-golem', 'skeletons', 'ice-spirit', 'cannon', 'fireball', 'log'],
    winRate: '49.8%',
    useRate: '12.5%'
  },
  {
    id: 'meta-golem-beatdown',
    name: 'Golem Night Witch Beatdown',
    description: 'Sacrifice tower health to build a massive, unstoppable push during double elixir.',
    cardIds: ['golem', 'night-witch', 'baby-dragon', 'lumberjack', 'mega-minion', 'tornado', 'lightning', 'zap'],
    winRate: '54.1%',
    useRate: '4.2%'
  },
  {
    id: 'meta-xbow-29',
    name: '2.9 X-Bow Cycle',
    description: 'Play solid defense and set up the X-Bow to chip away at the opponent\'s tower.',
    cardIds: ['x-bow', 'tesla', 'archers', 'knight', 'skeletons', 'ice-spirit', 'fireball', 'log'],
    winRate: '51.2%',
    useRate: '3.7%'
  },
  {
    id: 'meta-bridge-spam',
    name: 'PEKKA Bridge Spam',
    description: 'Punish your opponent\'s over-commitments by spanning units at the bridge while relying on PEKKA for rock-solid defense.',
    cardIds: ['pekka', 'battle-ram', 'bandit', 'royal-ghost', 'electro-wizard', 'magic-archer', 'zap', 'poison'],
    winRate: '50.9%',
    useRate: '6.4%'
  },
  {
    id: 'meta-splash-yard',
    name: 'Splash Yard',
    description: 'Control the pace of the game with splash damage troops and Tornado, and counter-attack with Graveyard.',
    cardIds: ['graveyard', 'poison', 'barbarian-barrel', 'tornado', 'baby-dragon', 'ice-wizard', 'knight', 'bomb-tower'],
    winRate: '53.5%',
    useRate: '4.9%'
  }
];

export function getCardsForDeck(cardIds: string[]): Card[] {
  return cardIds.map(id => cards.find(c => c.id === id)).filter(Boolean) as Card[];
}
