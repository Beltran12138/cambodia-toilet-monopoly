import React from 'react';
import { zhTW } from '../locales/zh-TW';

interface ImpactDashboardProps {
  toiletsBuilt: number;
  totalInvestment: number;
  villagerHP: number;
  lapsCompleted: number;
}

const StatCard: React.FC<{
  emoji: string;
  label: string;
  value: string | number;
  accent: string;
}> = ({ emoji, label, value, accent }) => (
  <div
    style={{
      background: `${accent}12`,
      borderRadius: '1rem',
      border: `2px solid ${accent}30`,
      padding: '0.875rem',
    }}
  >
    <div className="flex items-center gap-2 mb-1">
      <span style={{ fontSize: '1.1rem' }}>{emoji}</span>
      <span style={{ fontSize: '0.65rem', color: '#9C7A6A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
    </div>
    <div
      style={{
        fontFamily: "'Baloo 2', sans-serif",
        fontWeight: 800,
        fontSize: '1.5rem',
        color: accent,
        lineHeight: 1,
      }}
    >
      {value}
    </div>
  </div>
);

const ImpactDashboard: React.FC<ImpactDashboardProps> = ({
  toiletsBuilt,
  totalInvestment,
  villagerHP,
  lapsCompleted,
}) => {
  const t = zhTW.impact;

  const calculateImpactLevel = () => {
    const score = toiletsBuilt * 100 + totalInvestment / 10 + (villagerHP - 100) * 2 + lapsCompleted * 50;
    if (score >= 2000) return { level: t.legend,   emoji: '👑', color: '#F4A800' };
    if (score >= 1500) return { level: t.hero,     emoji: '🥇', color: '#C4A8E0' };
    if (score >= 1000) return { level: t.champion, emoji: '🏆', color: '#70C8E8' };
    if (score >= 500)  return { level: t.helper,   emoji: '⭐', color: '#6BBF6A' };
    return                    { level: t.beginner, emoji: '🌱', color: '#9C7A6A' };
  };

  const livesSaved     = Math.floor(toiletsBuilt * 2.5 + Math.max(0, villagerHP - 100) * 0.3);
  const hygieneScore   = Math.min(100, Math.floor((toiletsBuilt / 10) * 100 + (villagerHP / 150) * 100));
  const impactLevel    = calculateImpactLevel();

  return (
    <div className="panel-cozy" style={{ borderLeft: '4px solid #70C8E8' }}>
      <div className="flex items-center gap-3 mb-4">
        <span style={{ fontSize: '1.5rem' }}>📊</span>
        <h3
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            margin: 0,
            color: '#5C3D2E',
            fontSize: '1.1rem',
          }}
        >
          {t.title}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard emoji="❤️" label={t.livesSaved}      value={livesSaved}           accent="#E85555" />
        <StatCard emoji="🚽" label={t.toiletsBuilt}    value={toiletsBuilt}         accent="#5EAB78" />
        <StatCard emoji="💰" label={t.totalInvestment} value={`$${totalInvestment}`} accent="#6BBF6A" />
        <StatCard emoji="🧼" label={t.hygieneScore}    value={`${hygieneScore}%`}   accent="#C4A8E0" />
      </div>

      {/* Impact level */}
      <div
        style={{
          marginTop: '1rem',
          background: `${impactLevel.color}12`,
          borderRadius: '1rem',
          border: `2px solid ${impactLevel.color}30`,
          padding: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '0.65rem', color: '#9C7A6A', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
            {t.impactLevel}
          </div>
          <div
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 800,
              fontSize: '1.25rem',
              color: impactLevel.color,
            }}
          >
            {impactLevel.level}
          </div>
        </div>
        <span style={{ fontSize: '2.5rem', opacity: 0.6 }} className="sparkle-anim">
          {impactLevel.emoji}
        </span>
      </div>

      {/* Hygiene progress bar */}
      <div className="mt-3">
        <div className="impact-progress">
          <div className="progress-bar" style={{ width: `${hygieneScore}%` }} />
        </div>
      </div>
    </div>
  );
};

export default ImpactDashboard;
