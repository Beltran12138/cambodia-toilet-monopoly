import React from 'react';
import { zhTW } from '../locales/zh-TW';

interface ImpactDashboardProps {
  toiletsBuilt: number;
  totalInvestment: number;
  villagerHP: number;
  lapsCompleted: number;
}

const ImpactDashboard: React.FC<ImpactDashboardProps> = ({
  toiletsBuilt,
  totalInvestment,
  villagerHP,
  lapsCompleted,
}) => {
  const t = zhTW.impact;
  
  // 計算影響力指標
  const calculateImpactLevel = () => {
   const score = toiletsBuilt * 100 + totalInvestment / 10 + (villagerHP - 100) * 2 + lapsCompleted * 50;
    if (score >= 2000) return { level: t.legend, color: 'text-yellow-400', icon: 'fa-crown' };
    if (score >= 1500) return { level: t.hero, color: 'text-purple-400', icon: 'fa-medal' };
    if (score >= 1000) return { level: t.champion, color: 'text-[var(--vital-blue)]', icon: 'fa-trophy' };
    if (score >= 500) return { level: t.helper, color: 'text-green-400', icon: 'fa-star' };
    return { level: t.beginner, color: 'text-[var(--text-secondary)]', icon: 'fa-seedling' };
  };

  // 估算拯救生命數（基於廁所數量和 HP）
  const livesSaved = Math.floor(toiletsBuilt * 2.5 + Math.max(0, villagerHP - 100) * 0.3);
  
  // 衛生評分
  const hygieneScore = Math.min(100, Math.floor((toiletsBuilt / 10) * 100 + (villagerHP / 150) * 100));
  
  const impactLevel = calculateImpactLevel();

  return (
    <div className="panel-brutalist bg-[#1a1a1a] border-l-4 border-[var(--vital-blue)]">
      <div className="flex items-center gap-3 mb-6">
        <i className="fas fa-chart-line text-3xl text-[var(--vital-blue)]"></i>
        <h3 className="text-2xl text-white Staatliches m-0">{t.title}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 拯救生命數 */}
        <div className="p-4 bg-[#111] border-2 border-[var(--vital-blue)]">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-heart text-[var(--danger-red)]"></i>
            <span className="text-xs text-[var(--text-secondary)] uppercase">{t.livesSaved}</span>
          </div>
          <div className="text-3xl font-bold text-white Staatliches">{livesSaved}</div>
        </div>

        {/* 已建廁所數 */}
        <div className="p-4 bg-[#111] border-2 border-[var(--construction-orange)]">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-toilet text-[var(--vital-blue)]"></i>
            <span className="text-xs text-[var(--text-secondary)] uppercase">{t.toiletsBuilt}</span>
          </div>
          <div className="text-3xl font-bold text-white Staatliches">{toiletsBuilt}</div>
        </div>

        {/* 總投資金額 */}
        <div className="p-4 bg-[#111] border-2 border-green-600">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-dollar-sign text-green-500"></i>
            <span className="text-xs text-[var(--text-secondary)] uppercase">{t.totalInvestment}</span>
          </div>
          <div className="text-3xl font-bold text-white Staatliches">${totalInvestment}</div>
        </div>

        {/* 衛生評分 */}
        <div className="p-4 bg-[#111] border-2 border-purple-500">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-pump-soap text-purple-400"></i>
            <span className="text-xs text-[var(--text-secondary)] uppercase">{t.hygieneScore}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold text-white Staatliches">{hygieneScore}%</div>
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-purple-300 transition-all"
                style={{ width: `${hygieneScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 影響力等級 */}
      <div className="mt-6 p-4 bg-gradient-to-r from-[#111] to-[#1a1a1a] border-2 border-[#333]">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-[var(--text-secondary)] uppercase block mb-1">{t.impactLevel}</span>
            <div className={`text-2xl font-bold Staatliches ${impactLevel.color}`}>
              {impactLevel.level}
            </div>
          </div>
          <i className={`fas ${impactLevel.icon} text-5xl ${impactLevel.color} opacity-50`}></i>
        </div>
        
        {/* 經驗進度條 */}
        <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${impactLevel.color.replace('text-', 'bg-')}`}
            style={{ 
              width: `${Math.min(100, (toiletsBuilt * 10 + totalInvestment / 50))}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImpactDashboard;
