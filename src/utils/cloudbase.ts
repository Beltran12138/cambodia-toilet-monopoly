import cloudbase from "@cloudbase/js-sdk";

export const ENV_ID = import.meta.env.VITE_ENV_ID || "theway-2gfdpspmc0387027";
export const isValidEnvId = ENV_ID && ENV_ID !== "your-env-id";
const PUBLISHABLE_KEY = import.meta.env.VITE_PUBLISHABLE_KEY || "";

export interface GameRecord {
  _id?: string;
  playerId: string;
  createdAt: number;
  updatedAt: number;
  gameData: {
  players: any[];
  tiles: any[];
  currentPlayerIndex: number;
    diceResults: number[];
    gameStatus: string;
    message: string;
    hasRolled?: boolean;
    hasActed?: boolean;
  };
  stats: {
  toiletsBuilt: number;
  totalInvestment: number;
    lapsCompleted: number;
  };
}

export const init = (config: { env?: string; timeout?: number; accessKey?: string } = {}) => {
  const appConfig = {
    env: config.env || ENV_ID,
  timeout: config.timeout || 15000,
    accessKey: config.accessKey || PUBLISHABLE_KEY,
  };
  if (!appConfig.accessKey) {
  console.warn("客户端 Publishable Key 未配置，使用匿名访问");
  }
  return cloudbase.init(appConfig);
};

export const app = init();

export const getDatabase = () => {
  try {
    return app.database();
  } catch (error) {
  console.error("数据库初始化失败:", error);
    return null;
  }
};

export const saveGameRecord = async (gameData: any): Promise<GameRecord | null> => {
  try {
  const db = getDatabase();
  if (db) {
    const collection = db.collection('game_records');
      let playerId = localStorage.getItem('theWayPlayerId');
    if (!playerId) {
      playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;
        localStorage.setItem('theWayPlayerId', playerId);
      }
    const existingRecord = await getGameRecord();
    const record: GameRecord = {
      playerId,
        createdAt: existingRecord?.createdAt || Date.now(),
        updatedAt: Date.now(),
        gameData,
        stats: calculateStats(gameData),
      };
    if (existingRecord?._id) {
        await collection.doc(existingRecord._id).update(record);
      console.log('游戏记录已更新到云数据库');
      } else {
      const result = await collection.add(record);
      console.log('游戏记录已创建到云数据库');
        record._id = String((result as any).id || Date.now());
      }
      return record;
    }
  } catch (error) {
  console.error('保存到云数据库失败:', error);
  }
  console.log('保存到 localStorage');
  const playerId = localStorage.getItem('theWayPlayerId') || `player_${Date.now()}`;
  localStorage.setItem('theWayPlayerId', playerId);
  localStorage.setItem('theWayGameRecord', JSON.stringify(gameData));
  return null;
};

export const getGameRecord = async (): Promise<GameRecord | null> => {
  const playerId = localStorage.getItem('theWayPlayerId');
  try {
  const db = getDatabase();
  if (db && playerId) {
    const collection = db.collection('game_records');
    const query = await collection.where({ playerId }).orderBy('updatedAt', 'desc').limit(1).get();
    if (query.data && query.data.length > 0) {
      console.log('从云数据库加载游戏记录');
        return query.data[0] as GameRecord;
      }
    }
  } catch (error) {
  console.error('从云数据库加载失败:', error);
  }
  const localRecord = localStorage.getItem('theWayGameRecord');
  if (localRecord) {
  console.log('从 localStorage 加载游戏记录');
    return JSON.parse(localRecord) as GameRecord;
  }
  return null;
};

export const deleteGameRecord = async (): Promise<void> => {
  try {
  const db = getDatabase();
  if (db) {
    const collection = db.collection('game_records');
    const existingRecord = await getGameRecord();
    if (existingRecord?._id) {
        await collection.doc(existingRecord._id).remove();
      console.log('游戏记录已从云数据库删除');
      }
    }
  } catch (error) {
  console.error('从云数据库删除失败:', error);
  }
  localStorage.removeItem('theWayGameRecord');
  localStorage.removeItem('theWayPlayerId');
};

const calculateStats = (gameData: any) => {
  const toiletsBuilt = gameData.tiles.filter((t: any) => t.type === 'VILLAGE' && t.toiletType !== 'NONE').length;
  const initialFunds = 3000;
  const currentFunds = gameData.players.filter((p: any) => p.role.startsWith('DONOR')).reduce((sum: number, p: any) => sum + p.funds, 0);
  const totalInvestment = initialFunds - currentFunds;
  const villager = gameData.players.find((p: any) => p.role.startsWith('VILLAGER'));
  const lapsCompleted = villager?.laps || 0;
  return { toiletsBuilt, totalInvestment, lapsCompleted };
};

export const autoSaveGame = (gameData: any) => {
  const debounceKey = 'theWayAutoSaveDebounce';
  const lastSave = parseInt(localStorage.getItem(debounceKey) || '0');
  const now = Date.now();
  if (now - lastSave > 30000) {
    saveGameRecord(gameData);
    localStorage.setItem(debounceKey, now.toString());
  }
};

export const hasPendingGame = async (): Promise<boolean> => {
  const record = await getGameRecord();
  return record !== null && record.gameData.gameStatus === 'PLAYING';
};

export const checkEnvironment = () => {
  if (!isValidEnvId) {
  console.error("云开发环境ID 未配置");
    return false;
  }
  return true;
};

export default {
  init,
  app,
  getDatabase,
  saveGameRecord,
  getGameRecord,
  deleteGameRecord,
  autoSaveGame,
  hasPendingGame,
  checkEnvironment,
  isValidEnvId,
};
