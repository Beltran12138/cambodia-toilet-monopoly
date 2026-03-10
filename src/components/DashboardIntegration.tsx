import React, { useState, useEffect } from 'react';
import { GameStats } from '../hooks/useGameLogic';

interface DashboardIntegrationProps {
  gameStats: GameStats;
  onSyncComplete?: () => void;
}

interface DashboardData {
  toiletsBuilt: number;
  totalInvestment: number;
  gamesPlayed: number;
  gamesWon: number;
  impactScore: number;
  achievements: number;
}

const DashboardIntegration: React.FC<DashboardIntegrationProps> = ({ 
  gameStats, 
  onSyncComplete 
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  // 计算影响力分数
  const calculateImpactScore = () => {
   return (
      gameStats.toiletsBuilt * 100 +
      gameStats.totalInvestment / 10 +
      gameStats.gamesWon * 500 +
      gameStats.eventsTriggered * 20
    );
  };

  // 获取成就数量（从 localStorage）
  const getAchievementsCount = () => {
   const saved = localStorage.getItem('theWayAchievements');
   if (saved) {
     return JSON.parse(saved).length;
    }
   return 0;
  };

  // 同步数据到 Dashboard
  const syncToDashboard = async () => {
   setIsSyncing(true);
    
    try {
     const data: DashboardData = {
       toiletsBuilt: gameStats.toiletsBuilt,
       totalInvestment: gameStats.totalInvestment,
        gamesPlayed: gameStats.gamesPlayed,
        gamesWon: gameStats.gamesWon,
        impactScore: calculateImpactScore(),
        achievements: getAchievementsCount(),
      };
      
      // 保存到 localStorage（供 Dashboard 读取）
     localStorage.setItem('theWayDashboardData', JSON.stringify(data));
     localStorage.setItem('theWayLastSyncTime', new Date().toISOString());
      
     setDashboardData(data);
     setLastSyncTime(new Date());
      
      // 如果存在跨窗口通信需求，使用 CustomEvent
      window.dispatchEvent(new CustomEvent('theWayDashboardUpdate', { detail: data }));
      
     onSyncComplete?.();
    } catch (error) {
     console.error('同步到 Dashboard 失败:', error);
    } finally {
     setIsSyncing(false);
    }
  };

  // 自动同步（当数据变化时）
  useEffect(() => {
   const timer = setTimeout(() => {
      syncToDashboard();
    }, 1000); // 1 秒延迟
    
   return () => clearTimeout(timer);
  }, [gameStats]);

  // 加载已保存的 Dashboard 数据
  useEffect(() => {
   const saved = localStorage.getItem('theWayDashboardData');
   if (saved) {
     setDashboardData(JSON.parse(saved));
    }
    
   const savedTime = localStorage.getItem('theWayLastSyncTime');
   if (savedTime) {
     setLastSyncTime(new Date(savedTime));
    }
  }, []);

  return (
    <div className="panel-brutalist bg-[#1a1a1a] border-l-4 border-[var(--construction-orange)]">
      <div className="flex items-center gap-3 mb-6">
        <i className="fas fa-tachometer-alt text-3xl text-[var(--construction-orange)]"></i>
        <h3 className="text-2xl text-white Staatliches m-0">Dashboard 整合</h3>
      </div>

      {/* 同步状态 */}
      <div className="mb-6 p-4 bg-[#111] border-2 border-[#333]">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-[var(--text-secondary)] uppercase">同步狀態</span>
          <div className="flex items-center gap-2">
            {isSyncing ? (
              <>
                <i className="fas fa-spinner fa-spin text-[var(--construction-orange)]"></i>
                <span className="text-sm text-[var(--construction-orange)]">同步中...</span>
              </>
            ) : lastSyncTime ? (
              <>
                <i className="fas fa-check-circle text-green-500"></i>
                <span className="text-sm text-green-500">
                  已於 {lastSyncTime.toLocaleTimeString()} 同步
                </span>
              </>
            ) : (
              <span className="text-sm text-[var(--text-secondary)]">尚未同步</span>
            )}
          </div>
        </div>
        
        <button
         onClick={syncToDashboard}
          disabled={isSyncing}
          className="btn-industrial w-full justify-center"
        >
          <i className={`fas ${isSyncing ? 'fa-spinner fa-spin' : 'fa-sync'}`}></i> 
          {isSyncing ? '同步中...' : '立即同步'}
        </button>
      </div>

      {/* Dashboard 预览 */}
      {dashboardData && (
        <div className="space-y-4">
          <h4 className="text-lg text-[var(--text-secondary)] Staatliches mb-4">影響力數據預覽</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#111] border border-[#333]">
              <div className="text-xs text-[var(--text-secondary)] mb-1">影響力分數</div>
              <div className="text-2xl font-bold text-[var(--vital-blue)]">{dashboardData.impactScore}</div>
            </div>
            
            <div className="p-3 bg-[#111] border border-[#333]">
              <div className="text-xs text-[var(--text-secondary)] mb-1">成就數量</div>
              <div className="text-2xl font-bold text-yellow-400">{dashboardData.achievements}/7</div>
            </div>
            
            <div className="p-3 bg-[#111] border border-[#333]">
              <div className="text-xs text-[var(--text-secondary)] mb-1">遊戲場次</div>
              <div className="text-xl font-bold text-white">{dashboardData.gamesPlayed}</div>
            </div>
            
            <div className="p-3 bg-[#111] border border-[#333]">
              <div className="text-xs text-[var(--text-secondary)] mb-1">勝場</div>
              <div className="text-xl font-bold text-green-500">{dashboardData.gamesWon}</div>
            </div>
          </div>
        </div>
      )}

      {/* 跨窗口通信说明 */}
      <div className="mt-6 p-4 bg-gradient-to-r from-[#111] to-[#1a1a1a] border-2 border-[#333]">
        <div className="flex items-start gap-3">
          <i className="fas fa-info-circle text-[var(--vital-blue)] mt-1"></i>
          <div className="text-xs text-[var(--text-secondary)]">
            <p className="mb-2">
              <strong className="text-white">如何與 Dashboard 整合：</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>打開 <code className="bg-[#222] px-1 rounded">index_the_way_v2.html</code></li>
              <li>遊戲數據會自動同步到 localStorage</li>
              <li>Dashboard 會讀取並顯示遊戲統計</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardIntegration;
