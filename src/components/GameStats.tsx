import React from 'react';
import { GameStats as GameStatsType } from '../hooks/useGameLogic';
import { zhTW } from '../locales/zh-TW';

interface GameStatsProps {
  stats: GameStatsType;
}

const GameStats: React.FC<GameStatsProps> = ({ stats }) => {
  const t = zhTW.stats;

  // 计算胜率
  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;

  // 计算平均每局建造厕所数
  const avgToiletsPerGame = stats.gamesPlayed > 0
    ? (stats.toiletsBuilt / stats.gamesPlayed).toFixed(1)
    : '0';

  return (
    <div className="panel-brutalist bg-[#1a1a1a] border-l-4 border-[var(--vital-blue)]">
      <div className="flex items-center gap-3 mb-6">
        <i className="fas fa-chart-bar text-3xl text-[var(--vital-blue)]"></i>
        <h3 className="text-2xl text-white Staatliches m-0">{t.title}</h3>
      </div>

      {/* 核心统计 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {/* 游戏次数 */}
        <div className="p-4 bg-[#111] border-2 border-[#333]">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-gamepad text-[var(--construction-orange)]"></i>
            <span className="text-xs text-[var(--text-secondary)] uppercase">{t.gamesPlayed}</span>
          </div>
          <div className="text-3xl font-bold text-white Staatliches">{stats.gamesPlayed}</div>
        </div>

        {/* 胜利次数 */}
        <div className="p-4 bg-[#111] border-2 border-green-600">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-trophy text-green-500"></i>
            <span className="text-xs text-[var(--text-secondary)] uppercase">{t.gamesWon}</span>
          </div>
          <div className="text-3xl font-bold text-white Staatliches">{stats.gamesWon}</div>
        </div>

        {/* 胜率 */}
        <div className="p-4 bg-[#111] border-2 border-purple-500">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-percent text-purple-400"></i>
            <span className="text-xs text-[var(--text-secondary)] uppercase">{t.winRate}</span>
          </div>
          <div className="text-3xl font-bold text-white Staatliches">{winRate}%</div>
        </div>
      </div>

      {/* 建造统计 */}
      <div className="mb-6 p-4 bg-[#111] border-2 border-[var(--vital-blue)]">
        <h4 className="text-lg text-[var(--vital-blue)] Staatliches mb-4 flex items-center gap-2">
          <i className="fas fa-toilet"></i> {t.constructionStats}
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white Staatliches">{stats.toiletsBuilt}</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase mt-1">{t.totalToilets}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white Staatliches">{stats.smallToiletsBuilt}</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase mt-1">{t.smallToilets}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white Staatliches">{stats.largeToiletsBuilt}</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase mt-1">{t.largeToilets}</div>
          </div>
        </div>
      </div>

      {/* 影响力统计 */}
      <div className="mb-6 p-4 bg-[#111] border-2 border-green-600">
        <h4 className="text-lg text-green-500 Staatliches mb-4 flex items-center gap-2">
          <i className="fas fa-heart"></i> {t.impactStats}
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--text-secondary)]">{t.totalInvestment}</span>
            <span className="text-xl font-bold text-white">${stats.totalInvestment}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--text-secondary)]">{t.eventsTriggered}</span>
            <span className="text-xl font-bold text-white">{stats.eventsTriggered}</span>
          </div>
        </div>
      </div>

      {/* 平均数据 */}
      <div className="p-4 bg-gradient-to-r from-[#111] to-[#1a1a1a] border-2 border-[#333]">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-[var(--text-secondary)] uppercase block mb-1">{t.avgToiletsPerGame}</span>
            <div className="text-xl font-bold text-white Staatliches">{avgToiletsPerGame}</div>
          </div>
          <i className="fas fa-calculator text-4xl text-[var(--text-secondary)] opacity-30"></i>
        </div>
      </div>
    </div>
  );
};

export default GameStats;
