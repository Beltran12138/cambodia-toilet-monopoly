import React from 'react';
import type { Player } from '../hooks/useGameLogic';
import { zhTW } from '../locales/zh-TW';

interface PlayerStatsProps {
  players: Player[];
  currentPlayerIndex: number;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ players, currentPlayerIndex }) => {
  const t = zhTW;
  const villager = players.find(p => p.role === 'VILLAGER')!;
  const donors = players.filter(p => p.role.startsWith('DONOR'));

  return (
    <div className="flex flex-col gap-6">
      {/* Villager Status (Main HP Gauge) */}
      <div className="panel-brutalist relative overflow-hidden bg-[#1a1a1a]">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-3xl text-[var(--construction-orange)] m-0 leading-none">{t.roles.VILLAGER}</h2>
            <p className="text-[var(--text-secondary)] text-sm mt-1">{t.stats.lapsCompleted}: {villager.laps} / 5</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-bold text-[var(--danger-red)] Staatliches">{villager.hp}</span>
            <span className="text-sm text-[var(--text-secondary)] block">{t.stats.vitalityHP}</span>
          </div>
        </div>
        
        <div className="hp-gauge">
          <div 
            className="hp-fill" 
            style={{ width: `${Math.min(100, Math.max(0, (villager.hp / 150) * 100))}%` }} 
          />
          {/* Gauge markers */}
          <div className="absolute inset-0 flex justify-between pointer-events-none opacity-20">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-[1px] h-full bg-white" />
            ))}
          </div>
        </div>
        
        {villager.hp < 30 && (
          <div className="mt-2 text-[var(--danger-red)] animate-pulse flex items-center gap-2">
            <i className="fas fa-triangle-exclamation"></i>
            <span className="text-xs font-bold uppercase">{t.stats.critical || '危急衛生條件!'}</span>
          </div>
        )}
      </div>

      {/* Donors List */}
      <div className="grid grid-cols-3 gap-4">
        {donors.map((donor, idx) => (
          <div 
            key={donor.id} 
            className={`
              p-4 border-2 transition-all
              ${currentPlayerIndex === idx + 1 ? 'border-[var(--construction-orange)] bg-[#222]' : 'border-[#333] opacity-60'}
            `}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-[var(--text-secondary)]">{t.roles[`DONOR_${idx + 1}` as keyof typeof t.roles]}</span>
              {currentPlayerIndex === idx + 1 && (
                <span className="text-[10px] bg-[var(--construction-orange)] text-black px-1 font-bold">{t.stats.active || '當前'}</span>
              )}
            </div>
            <div className="text-2xl font-bold Staatliches text-white">
              ${donor.funds}
            </div>
            {donor.inPrison && (
              <div className="mt-2 text-[var(--danger-red)] text-[10px] font-bold uppercase flex items-center gap-1">
                <i className="fas fa-link"></i> {t.stats.inPrison}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerStats;
