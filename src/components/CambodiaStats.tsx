import React, { useState } from 'react';

interface CambodiaStatsProps {
  toiletsBuilt: number;
  totalInvestment: number;
}

const CambodiaStats: React.FC<CambodiaStatsProps> = ({ toiletsBuilt, totalInvestment }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 柬埔寨真实卫生数据 (基于最新研究)
  const realStats = {
    ruralOpenDefecation: '25%', // 2022年数据
    urbanOpenDefecation: '0%',  // 2020年已消除
    safelyManagedSanitation: '29%', // 2022年
    ruralWaterAccess: '73%', // 2022年
    schoolsWithSanitation: '32%', // 2022年
    diarrheaDeaths: '1.2-1.4%', // 厕所普及减少的腹泻病
    targetYear: '2030',
    population: '1700万',
  };

  // 游戏进度对应的真实影响
  const gameImpact = {
    livesSaved: Math.floor(toiletsBuilt * 2.5),
    hygieneAwareness: Math.min(100, toiletsBuilt * 10),
    communityHealth: Math.min(100, Math.floor(totalInvestment / 50)),
  };

  return (
    <div className="panel-cozy" style={{ borderLeft: '4px solid #FF8C69' }}>
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '1.5rem' }}>🌏</span>
          <h3 style={{ fontFamily: "'Baloo 2', sans-serif", color: '#5C3D2E', margin: 0, fontSize: '1.05rem' }}>柬埔寨衛生現況</h3>
        </div>
        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-[var(--text-secondary)]`}></i>
      </div>

      {/* 折叠内容 */}
      {isExpanded && (
        <div className="mt-6 space-y-6 animate-in slide-in-from-top duration-300">
          {/* 真实数据 */}
          <div>
            <h4 className="text-sm text-[var(--construction-orange)] font-bold uppercase mb-3">
              <i className="fas fa-database mr-2"></i>
              真實統計數據
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl" style={{ background: 'var(--ac-sand)', border: '1.5px solid rgba(92,61,46,0.15)' }}>
                <div className="text-xs uppercase" style={{ color: 'var(--ac-brown-mid)', fontWeight: 600 }}>農村露天排便</div>
                <div className="text-2xl font-bold text-[var(--danger-red)]">{realStats.ruralOpenDefecation}</div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'var(--ac-sand)', border: '1.5px solid rgba(92,61,46,0.15)' }}>
                <div className="text-xs uppercase" style={{ color: 'var(--ac-brown-mid)', fontWeight: 600 }}>城市露天排便</div>
                <div className="text-2xl font-bold text-[var(--vital-blue)]">{realStats.urbanOpenDefecation}</div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'var(--ac-sand)', border: '1.5px solid rgba(92,61,46,0.15)' }}>
                <div className="text-xs uppercase" style={{ color: 'var(--ac-brown-mid)', fontWeight: 600 }}>安全衛生設施</div>
                <div className="text-2xl font-bold text-[var(--construction-orange)]">{realStats.safelyManagedSanitation}</div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'var(--ac-sand)', border: '1.5px solid rgba(92,61,46,0.15)' }}>
                <div className="text-xs uppercase" style={{ color: 'var(--ac-brown-mid)', fontWeight: 600 }}>學校衛生設施</div>
                <div className="text-2xl font-bold text-[var(--danger-red)]">{realStats.schoolsWithSanitation}</div>
              </div>
            </div>
          </div>

          {/* 游戏影响 */}
          <div>
            <h4 className="text-sm text-[var(--vital-blue)] font-bold uppercase mb-3">
              <i className="fas fa-heart mr-2"></i>
              遊戲中你的貢獻
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">拯救生命估計</span>
                <span className="text-xl font-bold text-[var(--vital-blue)]">{gameImpact.livesSaved}+</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">衛生意識提升</span>
                <div className="flex-1 mx-3 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(92,61,46,0.12)' }}>
                  <div 
                    className="h-full bg-[var(--vital-blue)] transition-all"
                    style={{ width: `${gameImpact.hygieneAwareness}%` }}
                  />
                </div>
                <span className="text-sm text-[var(--vital-blue)]">{gameImpact.hygieneAwareness}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">社區健康</span>
                <div className="flex-1 mx-3 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(92,61,46,0.12)' }}>
                  <div 
                    className="h-full bg-[var(--construction-orange)] transition-all"
                    style={{ width: `${gameImpact.communityHealth}%` }}
                  />
                </div>
                <span className="text-sm text-[var(--construction-orange)]">{gameImpact.communityHealth}%</span>
              </div>
            </div>
          </div>

          {/* 行动号召 */}
          <div className="p-4 bg-gradient-to-r from-[var(--clay-red)]/20 to-transparent border border-[var(--clay-red)]">
            <p className="text-sm text-[var(--text-primary)] italic">
              "{realStats.population} 人中，仍有 {realStats.ruralOpenDefecation} 的農村人口無法使用基本衛生設施。"
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-2">
              資料來源：聯合國兒童基金會 / 世界銀行 (2022-2024)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CambodiaStats;
