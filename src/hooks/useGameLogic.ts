import { useState, useCallback, useEffect } from 'react';
import { zhTW } from '../locales/zh-TW';
import { getRandomEvent, RandomEvent } from '../utils/randomEvents';
import { saveGameRecord, autoSaveGame } from '../utils/cloudbase';

export type PlayerRole = 'VILLAGER' | 'DONOR_1' | 'DONOR_2' | 'DONOR_3';
export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

// 难度配置
const DIFFICULTY_SETTINGS = {
  EASY: { initialHP: 120, hpLossNoToilet: 10, hpLossLap: 8, costMultiplier: 0.8 },
  NORMAL: { initialHP: 100, hpLossNoToilet: 15, hpLossLap: 10, costMultiplier: 1.0 },
  HARD: { initialHP: 80, hpLossNoToilet: 20, hpLossLap: 12, costMultiplier: 1.0 },
};

export interface Player {
  id: string;
  role: PlayerRole;
  position: number;
  funds: number;
  hp: number;
  laps: number;
  inPrison: boolean;
  prisonTurns: number;
}

export interface Tile {
  id: number;
  name: string;
  nameZh: string;
  type: 'VILLAGE' | 'CHANCE' | 'PRISON' | 'START';
  toiletType: 'NONE' | 'SMALL' | 'LARGE';
  priceSmall: number;
  priceLarge: number;
}

export interface GameStats {
  toiletsBuilt: number;
  smallToiletsBuilt: number;
  largeToiletsBuilt: number;
  totalInvestment: number;
  villagerHP: number;
  lapsCompleted: number;
  gamesPlayed: number;
  gamesWon: number;
  eventsTriggered: number;
}

const BOARD_SIZE = 24;
const t = zhTW;

const INITIAL_PLAYERS: Player[] = [
  { id: 'v1', role: 'VILLAGER', position: 0, funds: 0, hp: 100, laps: 0, inPrison: false, prisonTurns: 0 },
  { id: 'd1', role: 'DONOR_1', position: 0, funds:1000, hp: 0, laps: 0, inPrison: false, prisonTurns: 0 },
  { id: 'd2', role: 'DONOR_2', position: 0, funds: 1000, hp: 0, laps: 0, inPrison: false, prisonTurns: 0 },
  { id: 'd3', role: 'DONOR_3', position: 0, funds: 1000, hp: 0, laps: 0, inPrison: false, prisonTurns: 0 },
];

export const getInitialPlayersForDifficulty = (difficulty: Difficulty): Player[] => {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  return [
    { id: 'v1', role: 'VILLAGER', position: 0, funds: 0, hp: settings.initialHP, laps: 0, inPrison: false, prisonTurns: 0 },
    { id: 'd1', role: 'DONOR_1', position: 0, funds:1000, hp: 0, laps: 0, inPrison: false, prisonTurns: 0 },
    { id: 'd2', role: 'DONOR_2', position: 0, funds:1000, hp: 0, laps: 0, inPrison: false, prisonTurns: 0 },
    { id: 'd3', role: 'DONOR_3', position: 0, funds: 1000, hp: 0, laps: 0, inPrison: false, prisonTurns: 0 },
  ];
};

const VILLAGE_NAMES = [
  '磅湛村 (Kampong Cham)', '磅清揚村 (Kampong Chhnang)', '菩薩村 (Pursat)', 
  '柴楨村 (Svay Rieng)', '波羅勉村 (Prey Veng)', '磅士卑村 (Kampong Speu)', 
  '干丹村 (Kandal)', '茶膠村 (Takeo)', '貢布村 (Kampot)', 
  '柏威夏村 (Preah Vihear)', '暹粒村 (Siem Reap)', '馬德望村 (Battambang)', 
  '拜林村 (Pailin)', '奧多棉吉村 (Oddar Meanchey)', '蒙多基里村 (Mondulkiri)', 
  '拉達那基里村 (Ratanakiri)', '上丁村 (Stung Treng)', '桔井村 (Kratie)', 
  '特本克蒙村 (Tboung Khmum)', '白馬村 (Kep)',
];

const INITIAL_TILES: Tile[] = Array.from({ length: BOARD_SIZE }, (_, i) => {
  if (i === 0) return { id: i, name: 'START', nameZh: t.tileTypes.START, type: 'START', toiletType: 'NONE', priceSmall: 0, priceLarge: 0 };
  if (i === 6) return { id: i, name: 'PRISON', nameZh: t.tileTypes.PRISON, type: 'PRISON', toiletType: 'NONE', priceSmall: 0, priceLarge: 0 };
  if (i % 4 === 0) return { id: i, name: 'CHANCE', nameZh: t.tileTypes.CHANCE, type: 'CHANCE', toiletType: 'NONE', priceSmall: 0, priceLarge: 0 };
  
  const villageIndex = Math.floor(i / 4) * 5 + (i % 4);
  return { 
  id: i, 
    name: `VILLAGE ${i}`, 
    nameZh: VILLAGE_NAMES[i % VILLAGE_NAMES.length] || `村莊 ${i}`,
    type: 'VILLAGE', 
  toiletType: 'NONE', 
    priceSmall: 200, 
    priceLarge: 500 
  };
});

interface UseGameLogicReturn {
  players: Player[];
  tiles: Tile[];
  currentPlayerIndex: number;
  diceResults: [number, number];
  gameStatus: 'PLAYING' | 'WON' | 'LOST';
  message: string;
  messageHistory: string[];
  rollDice: () => void;
  buildToilet: (tileId: number, type: 'SMALL' | 'LARGE') => void;
  endTurn: () => void;
  confirmEvent: () => void;
  currentEvent: RandomEvent | null;
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;
  loadGame: () => Promise<void>;
  resetGame: () => void;
  toiletsBuilt: number;
  totalInvestment: number;
  hasRolled: boolean;
  hasActed: boolean;
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  startGameWithDifficulty: (difficulty: Difficulty) => void;
  gameStats: GameStats;
  incrementEventsTriggered: () => void;
}

export const useGameLogic = (): UseGameLogicReturn => {
  const [difficulty, setDifficulty] = useState<Difficulty>('NORMAL');
  const [players, setPlayers] = useState<Player[]>(() => getInitialPlayersForDifficulty('NORMAL'));
  const [tiles, setTiles] = useState<Tile[]>(INITIAL_TILES);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceResults, setDiceResults] = useState<[number, number]>([0, 0]);
  const [gameStatus, setGameStatus] = useState<'PLAYING' | 'WON' | 'LOST'>('PLAYING');
  const [message, setMessage] = useState(t.events.gameStarted);
  const [messageHistory, setMessageHistory] = useState<string[]>([t.events.gameStarted]);
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [discountRate, setDiscountRate] = useState(1);
  const [hasRolled, setHasRolled] = useState(false);
  const [hasActed, setHasActed] = useState(false);
  const [eventsTriggered, setEventsTriggered] = useState(0);
  
  // 游戏统计
  const [gameStats, setGameStats] = useState<GameStats>(() => {
  const saved = localStorage.getItem('theWayGameStats');
   return saved ? JSON.parse(saved) : {
    toiletsBuilt: 0,
      smallToiletsBuilt: 0,
      largeToiletsBuilt: 0,
    totalInvestment: 0,
      villagerHP: 100,
      lapsCompleted: 0,
     gamesPlayed: 0,
     gamesWon: 0,
      eventsTriggered: 0,
    };
  });

  // 计算当前厕所建造数和总投资（移到前面避免引用错误）
  const toiletsBuilt = tiles.filter(t => t.type === 'VILLAGE' && t.toiletType !== 'NONE').length;
  const initialFunds = 3000;
  const currentFunds = players.filter(p => p.role.startsWith('DONOR')).reduce((sum, p) => sum + p.funds, 0);
  const totalInvestment = initialFunds - currentFunds;

  const startGameWithDifficulty = useCallback((difficulty: Difficulty) => {
  setDifficulty(difficulty);
  setPlayers(getInitialPlayersForDifficulty(difficulty));
  setTiles(INITIAL_TILES);
  setCurrentPlayerIndex(0);
  setDiceResults([0, 0]);
  setGameStatus('PLAYING');
  setMessage(t.events.gameStarted);
  setMessageHistory([t.events.gameStarted]);
  setCurrentEvent(null);
  setDiscountRate(1);
  setHasRolled(false);
  setHasActed(false);
  setShowTutorial(false);
    // 增加游戏次数
  setGameStats(prev => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
  }, []);

  const addMessage = useCallback((newMessage: string) => {
  setMessage(newMessage);
  setMessageHistory(prev => {
    const updated = [newMessage, ...prev];
     return updated.slice(0, 20);
    });
  }, []);

  const endTurn = useCallback(() => {
  setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
  setDiscountRate(1);
  setHasRolled(false);
  setHasActed(false);
  setDiceResults([0, 0]);
  setCurrentEvent(null);
  }, [players.length]);

  const movePlayer= useCallback((d1: number, d2: number) => {
  if (gameStatus !== 'PLAYING') return;
  const steps = d1 + d2;
  const settings = DIFFICULTY_SETTINGS[difficulty];

  setPlayers((prevPlayers) => {
    const newPlayers = [...prevPlayers];
    const player= { ...newPlayers[currentPlayerIndex] };
      let eventMessage = '';

    if (player.inPrison) {
      if (d1 === d2) {
        player.inPrison = false;
        player.prisonTurns = 0;
          eventMessage = t.events.prisonEscape.replace('{role}', player.role).replace('{num}', String(d1));
        } else {
        player.prisonTurns += 1;
        if (player.prisonTurns >= 3) {
          player.inPrison = false;
          player.funds -= 50;
          player.prisonTurns = 0;
            eventMessage = t.events.prisonFine.replace('{role}', player.role);
          } else {
            eventMessage = t.events.stillInPrison.replace('{role}', player.role);
          setMessage(eventMessage);
            newPlayers[currentPlayerIndex] = player;
           return newPlayers;
          }
        }
      }

    const oldPos = player.position;
    const newPos = (oldPos + steps) % BOARD_SIZE;
      
    if (newPos < oldPos) {
      player.laps += 1;
      if (player.role.startsWith('VILLAGER')) {
        player.hp -= settings.hpLossLap;
          eventMessage = t.events.villagerLap;
        }
      }

    player.position = newPos;
      newPlayers[currentPlayerIndex] = player;
      
    const tile = tiles[newPos];
    if (player.role.startsWith('VILLAGER')) {
      if (tile.type === 'VILLAGE') {
        if (tile.toiletType === 'NONE') {
          player.hp -= settings.hpLossNoToilet;
            eventMessage = t.events.noToilet.replace('{name}', tile.nameZh);
          } else if (tile.toiletType === 'SMALL') {
          player.hp += 5;
            eventMessage = t.events.smallToilet.replace('{name}', tile.nameZh);
          } else if (tile.toiletType === 'LARGE') {
          player.hp += 15;
            eventMessage = t.events.largeToilet.replace('{name}', tile.nameZh);
          }
        }
      } else {
      if (tile.type === 'PRISON') {
        player.inPrison = true;
          eventMessage = t.events.donorPrison.replace('{role}', player.role);
        }
      if (tile.type === 'CHANCE') {
        const randomEvent = getRandomEvent();
        setCurrentEvent(randomEvent);
          eventMessage = randomEvent.title; 
        }
      }

    setMessage(eventMessage || message);
     return newPlayers;
    });
  }, [currentPlayerIndex, gameStatus, tiles, message, difficulty]);

  const rollDice = useCallback(() => {
  if (hasRolled) return;
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  setDiceResults([d1, d2]);
  setHasRolled(true);
    movePlayer(d1, d2);
  }, [movePlayer, hasRolled]);

  const buildToilet = useCallback((tileId: number, type: 'SMALL' | 'LARGE') => {
  const currentPlayer= players[currentPlayerIndex];
  if (currentPlayer.role.startsWith('VILLAGER')) return;
  if (currentPlayer.position !== tileId) return; 
  if (hasActed) return; 

  const tile = tiles[tileId];
  const baseCost = type === 'SMALL' ? tile.priceSmall : tile.priceLarge;
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const cost = Math.floor(baseCost * discountRate * settings.costMultiplier);

  if (currentPlayer.funds >= cost) {
    setPlayers((prev) => {
      const next = [...prev];
        next[currentPlayerIndex] = { ...next[currentPlayerIndex], funds: next[currentPlayerIndex].funds - cost };
       return next;
      });
    setTiles((prev) => {
      const next = [...prev];
        next[tileId] = { ...next[tileId], toiletType: type };
       return next;
      });
    setHasActed(true);
      
      // 更新统计
    setGameStats(prev => ({
        ...prev,
      toiletsBuilt: prev.toiletsBuilt +1,
        smallToiletsBuilt: type === 'SMALL' ? prev.smallToiletsBuilt + 1 : prev.smallToiletsBuilt,
        largeToiletsBuilt: type === 'LARGE' ? prev.largeToiletsBuilt + 1 : prev.largeToiletsBuilt,
      }));
      
    setMessage(t.events.builtToilet.replace('{name}', tile.nameZh).replace('{type}', type === 'SMALL' ? t.toiletTypes.SMALL : t.toiletTypes.LARGE));
    autoSaveGame({ players, tiles, currentPlayerIndex, diceResults, gameStatus, message });
    } else {
    setMessage(t.events.insufficientFunds);
    }
  }, [currentPlayerIndex, players, tiles, discountRate, diceResults, gameStatus, message, hasActed, difficulty]);

  const confirmEvent = useCallback(() => {
  if (!currentEvent) return;
    
  const eventEffect = currentEvent.effect({ tiles, players });
    
  setPlayers((prevPlayers) => {
    const newPlayers = [...prevPlayers];
    const player= { ...newPlayers[currentPlayerIndex] };
      
    if (eventEffect.updates.fundsChange) {
      player.funds += eventEffect.updates.fundsChange;
      }
    if (eventEffect.updates.hpChange) {
        newPlayers[0] = { ...newPlayers[0], hp: newPlayers[0].hp + eventEffect.updates.hpChange };
      }
    if (eventEffect.updates.freeToilet && player.role.startsWith('DONOR')) {
      const currentTile = tiles[player.position];
      if (currentTile.type === 'VILLAGE' && currentTile.toiletType === 'NONE') {
        setTiles((prev) => {
          const next = [...prev];
            next[player.position] = { ...next[player.position], toiletType: 'SMALL' };
           return next;
          });
         // 更新统计
       setGameStats(prev => ({
           ...prev,
        toiletsBuilt: prev.toiletsBuilt + 1,
           smallToiletsBuilt: prev.smallToiletsBuilt + 1,
         }));
        }
      }
     // 處理 YOUTH_AMBASSADORS 事件的免費廁所建造
   if (eventEffect.updates.buildFreeToiletAt >= 0) {
     setTiles((prev) => {
       const next = [...prev];
       if (next[eventEffect.updates.buildFreeToiletAt]) {
           next[eventEffect.updates.buildFreeToiletAt] = { 
             ...next[eventEffect.updates.buildFreeToiletAt], 
          toiletType: 'SMALL' 
           };
         }
        return next;
       });
       // 更新统计
     setGameStats(prev => ({
         ...prev,
      toiletsBuilt: prev.toiletsBuilt + 1,
         smallToiletsBuilt: prev.smallToiletsBuilt + 1,
       }));
      }
   if (eventEffect.updates.discountRate) {
     setDiscountRate(eventEffect.updates.discountRate);
      }
   if (eventEffect.updates.destroyToiletTile >= 0) {
     setTiles((prev) => {
       const next = [...prev];
       const tile = next[eventEffect.updates.destroyToiletTile];
       if (tile && tile.type === 'VILLAGE') {
            next[eventEffect.updates.destroyToiletTile] = { ...tile, toiletType: 'NONE' };
          }
         return next;
        });
      }
      
      newPlayers[currentPlayerIndex] = player;
     return newPlayers;
    });

  setMessage(eventEffect.message);
  setCurrentEvent(null);
  }, [currentEvent, currentPlayerIndex, players, tiles]);

  useEffect(() => {
  const villager = players.find(p => p.role.startsWith('VILLAGER'));
  if (villager) {
    if (villager.hp <= 0) {
      setGameStatus('LOST');
      setMessage(t.events.gameOver);
      } else if (villager.laps >= 5 || villager.hp >= 150) {
      setGameStatus('WON');
      setMessage(t.events.victory);
      }
    }
  }, [players]);

  // 保存游戏统计到 localStorage
  useEffect(() => {
  const statsWithRealtime = {
      ...gameStats,
    toiletsBuilt,
    totalInvestment,
      villagerHP: players.find(p => p.role === 'VILLAGER')?.hp || 100,
      lapsCompleted: players.find(p => p.role === 'VILLAGER')?.laps || 0,
    };
  localStorage.setItem('theWayGameStats', JSON.stringify(statsWithRealtime));
  }, [gameStats, toiletsBuilt, totalInvestment, players]);

  const loadGame = useCallback(async () => {
    try {
    const cloudbase = await import('../utils/cloudbase');
    const record = await cloudbase.getGameRecord();
      
    if (record && record.gameData) {
      setPlayers(record.gameData.players);
      setTiles(record.gameData.tiles);
      setCurrentPlayerIndex(record.gameData.currentPlayerIndex);
      setDiceResults(record.gameData.diceResults as [number, number] || [0, 0]);
      setGameStatus(record.gameData.gameStatus as 'PLAYING' | 'WON' | 'LOST');
      setMessage(record.gameData.message);
      setHasRolled(record.gameData.hasRolled || false);
      setHasActed(record.gameData.hasActed || false);
      setShowTutorial(false);
      console.log('遊戲記錄已載入');
      }
    } catch (error) {
    console.error('載入遊戲記錄失敗:', error);
    }
  }, []);

  const resetGame = useCallback(() => {
  setPlayers(getInitialPlayersForDifficulty(difficulty));
  setTiles(INITIAL_TILES);
  setCurrentPlayerIndex(0);
  setDiceResults([0, 0]);
  setGameStatus('PLAYING');
  setMessage(t.events.gameStarted);
  setMessageHistory([t.events.gameStarted]);
  setCurrentEvent(null);
  setDiscountRate(1);
  setShowTutorial(true);
  localStorage.removeItem('theWayGameRecord');
  localStorage.removeItem('theWayPlayerId');
  }, [difficulty]);

  // 增加事件触发统计
  const incrementEventsTriggered = useCallback(() => {
  setEventsTriggered(prev => prev + 1);
  setGameStats(prev => ({ ...prev, eventsTriggered: prev.eventsTriggered + 1 }));
  }, []);

  return {
  players,
  tiles,
   currentPlayerIndex,
    diceResults,
   gameStatus,
    message,
    messageHistory,
    rollDice,
    buildToilet,
    endTurn,
  confirmEvent,
   currentEvent,
    showTutorial,
  setShowTutorial,
  loadGame,
   resetGame,
  toiletsBuilt,
  totalInvestment,
    hasRolled,
    hasActed,
    difficulty,
  setDifficulty,
   startGameWithDifficulty,
   gameStats,
  incrementEventsTriggered,
  };
};
