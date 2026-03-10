/**
 * Dashboard 數據讀取 Hook
 * 
 * 這個模塊提供函數來讀取遊戲同步到 localStorage 的數據
 * 可在 index_the_way_v2.html 中的 React 組件中使用
 * 
 * 使用範例：
 * ```javascript
 * import { getDashboardData, useDashboardData } from './utils/dashboardSync';
 * 
 * // 在 React 組件中
 * const dashboardData = useDashboardData();
 * 
 * // 或在任何地方
 * const data = getDashboardData();
 * ```
 */

export interface DashboardData {
  toiletsBuilt: number;
  totalInvestment: number;
  gamesPlayed: number;
  gamesWon: number;
  impactScore: number;
  achievements: number;
  lastSyncTime?: string;
}

// 從 localStorage 讀取 Dashboard 數據
export const getDashboardData = (): DashboardData | null => {
  try {
  const saved = localStorage.getItem('theWayDashboardData');
   if (saved) {
    const data = JSON.parse(saved);
     const syncTime = localStorage.getItem('theWayLastSyncTime');
    return {
       ...data,
      lastSyncTime: syncTime || undefined,
      };
    }
  return null;
  } catch(error) {
  console.error('讀取 Dashboard 數據失敗:', error);
  return null;
  }
};

// 監聽 Dashboard 數據更新
export const onDashboardUpdate = (callback: (data: DashboardData) => void): () => void => {
  const handler = (event: CustomEvent<DashboardData>) => {
   callback(event.detail);
  };
  
  window.addEventListener('theWayDashboardUpdate', handler as EventListener);
  
  // 返回取消訂閱函數
  return () => {
   window.removeEventListener('theWayDashboardUpdate', handler as EventListener);
  };
};

// 格式化最後同步時間
export const formatLastSyncTime = (isoString?: string): string => {
  if (!isoString) return '尚未同步';
  
  try {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
   
  if (diffMins < 1) return '剛剛';
  if (diffMins < 60) return `${diffMins} 分鐘前`;
   
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} 小時前`;
   
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} 天前`;
  } catch {
  return isoString;
  }
};

// 計算影響力等級
export const getImpactLevel = (score: number): string => {
  if (score >= 5000) return '傳奇守望者';
  if (score >= 3000) return '英雄';
  if (score >= 2000) return '冠軍';
  if (score >= 1000) return '幫助者';
  return '新手';
};

// 獲取影響力等級顏色
export const getImpactLevelColor = (score: number): string => {
  if (score >= 5000) return '#FFD700'; // 金色
  if (score >= 3000) return '#9370DB'; // 紫色
  if (score >= 2000) return '#00CED1'; // 藍色
  if (score >= 1000) return '#32CD32'; // 綠色
  return '#A0A0A0'; // 灰色
};
