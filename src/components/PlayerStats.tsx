import React from 'react';
import type { Player } from '../hooks/useGameLogic';
import { zhTW } from '../locales/zh-TW';

interface PlayerStatsProps {
  players: Player[];
  currentPlayerIndex: number;
}

const DONOR_COLORS  = ['#FF8C69', '#70C8E8', '#FFD166'];
const DONOR_EMOJIS  = ['⭐', '💙', '🌟'];

const HeartHP: React.FC<{ hp: number; maxHp?: number }> = ({ hp, maxHp = 100 }) => {
  const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const color = pct > 60 ? '#6BBF6A' : pct > 30 ? '#FFB347' : '#E85555';
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span style={{ color, fontWeight: 800, fontSize: '1.4rem', fontFamily: "'Baloo 2', sans-serif" }}>
          {hp}
        </span>
        <span style={{ color: '#9C7A6A', fontSize: '0.7rem' }}>/ {maxHp} HP</span>
      </div>
      <div className="hp-gauge">
        <div
          className="hp-fill"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
          }}
        />
      </div>
    </div>
  );
};

const PlayerStats: React.FC<PlayerStatsProps> = ({ players, currentPlayerIndex }) => {
  const t = zhTW;
  const villager = players.find(p => p.role === 'VILLAGER')!;
  const donors    = players.filter(p => p.role.startsWith('DONOR'));

  return (
    <div className="flex flex-col gap-4">
      {/* Villager card */}
      <div className="panel-cozy">
        <div className="flex items-start gap-4">
          <div
            style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, #A8E6CF, #FFD6B0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', flexShrink: 0,
              border: '3px solid rgba(94, 171, 120, 0.3)',
            }}
          >
            🧕
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <h3 style={{ fontFamily: "'Baloo 2', sans-serif", color: '#5EAB78', margin: 0, fontSize: '1.1rem' }}>
                {t.roles.VILLAGER}
              </h3>
              <span style={{ fontSize: '0.7rem', color: '#9C7A6A' }}>
                {t.stats.lapsCompleted}: <strong style={{ color: '#5EAB78' }}>{villager.laps}</strong> / 5
              </span>
            </div>
            <HeartHP hp={villager.hp} maxHp={120} />
            {villager.hp < 30 && (
              <div
                className="mt-2 flex items-center gap-1 animate-pulse"
                style={{ color: '#E85555', fontSize: '0.75rem', fontWeight: 700 }}
              >
                ⚠️ {t.stats.critical}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Donor cards */}
      <div className="grid grid-cols-3 gap-3">
        {donors.map((donor, idx) => {
          const isActive = currentPlayerIndex === idx + 1;
          return (
            <div
              key={donor.id}
              style={{
                background: isActive ? `${DONOR_COLORS[idx]}18` : 'var(--ac-panel)',
                borderRadius: '1rem',
                border: `2px solid ${isActive ? DONOR_COLORS[idx] : 'rgba(110, 180, 130, 0.2)'}`,
                padding: '0.75rem',
                transition: 'all 0.2s',
                opacity: isActive ? 1 : 0.65,
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <span style={{ fontSize: '1.2rem' }}>{DONOR_EMOJIS[idx]}</span>
                {isActive && (
                  <span
                    style={{
                      fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase',
                      background: DONOR_COLORS[idx], color: '#fff',
                      borderRadius: '999px', padding: '1px 6px',
                    }}
                  >
                    當前
                  </span>
                )}
              </div>
              <div
                style={{
                  fontFamily: "'Baloo 2', sans-serif",
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: isActive ? DONOR_COLORS[idx] : '#5C3D2E',
                }}
              >
                ${donor.funds}
              </div>
              <div style={{ fontSize: '0.6rem', color: '#9C7A6A', marginTop: 2 }}>
                {t.roles[`DONOR_${idx + 1}` as keyof typeof t.roles]}
              </div>
              {donor.inPrison && (
                <div style={{ fontSize: '0.65rem', color: '#E85555', fontWeight: 700, marginTop: 4 }}>
                  😵 {t.stats.inPrison}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerStats;
