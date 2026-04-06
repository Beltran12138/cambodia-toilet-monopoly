import React from 'react';
import { zhTW } from '../locales/zh-TW';

export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

interface DifficultySelectProps {
  selectedDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onStartGame: () => void;
}

const DIFFICULTY_INFO = {
  EASY: {
    name: '輕鬆',
    emoji: '🌱',
    description: '適合初次探索的旅人',
    details: ['村民初始 HP: 120', '無廁村莊 HP 損失：-10', '建造成本：-20%'],
    accent: '#6BBF6A',
    bg: '#E8F5E9',
  },
  NORMAL: {
    name: '普通',
    emoji: '🏡',
    description: '標準的柬埔寨之旅',
    details: ['村民初始 HP: 100', '無廁村莊 HP 損失：-15', '建造成本：標準'],
    accent: '#FF8C69',
    bg: '#FFF3EE',
  },
  HARD: {
    name: '困難',
    emoji: '⛈️',
    description: '真實的困境挑戰',
    details: ['村民初始 HP: 80', '無廁村莊 HP 損失：-20', '建造成本：標準', '影響力評分 ×1.5'],
    accent: '#E85555',
    bg: '#FFEAEA',
  },
};

const DifficultySelect: React.FC<DifficultySelectProps> = ({
  selectedDifficulty,
  onSelectDifficulty,
  onStartGame,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(92, 61, 46, 0.55)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="bounce-in w-full max-w-2xl"
        style={{
          background: 'var(--ac-panel)',
          borderRadius: '2rem',
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(92, 61, 46, 0.25)',
        }}
      >
        {/* Title */}
        <div className="text-center mb-6">
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎮</div>
          <h2
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              color: '#5C3D2E',
              margin: 0,
              fontSize: '1.75rem',
            }}
          >
            THE WAY
          </h2>
          <p style={{ color: '#9C7A6A', margin: '0.25rem 0 0', fontSize: '0.875rem' }}>
            柬埔寨廁所建設大挑戰 — 選擇難度
          </p>
        </div>

        {/* Difficulty cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {(Object.keys(DIFFICULTY_INFO) as Difficulty[]).map((diff) => {
            const info = DIFFICULTY_INFO[diff];
            const isSelected = selectedDifficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => onSelectDifficulty(diff)}
                style={{
                  background: isSelected ? info.bg : 'var(--ac-cream)',
                  borderRadius: '1.25rem',
                  border: `3px solid ${isSelected ? info.accent : 'rgba(92, 61, 46, 0.12)'}`,
                  padding: '1.25rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                  boxShadow: isSelected ? `0 8px 24px ${info.accent}30` : '0 2px 8px rgba(92,61,46,0.08)',
                  position: 'relative',
                }}
              >
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute', top: 10, right: 10,
                      background: info.accent, color: '#fff',
                      borderRadius: '50%', width: 24, height: 24,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem',
                    }}
                  >
                    ✓
                  </div>
                )}
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{info.emoji}</div>
                <h3
                  style={{
                    fontFamily: "'Baloo 2', sans-serif",
                    color: info.accent,
                    margin: '0 0 0.25rem',
                    fontSize: '1.1rem',
                  }}
                >
                  {info.name}
                </h3>
                <p style={{ color: '#9C7A6A', margin: '0 0 0.75rem', fontSize: '0.75rem' }}>
                  {info.description}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {info.details.map((d, i) => (
                    <li key={i} style={{ fontSize: '0.72rem', color: '#5C3D2E', marginBottom: 4, display: 'flex', gap: 6 }}>
                      <span style={{ color: info.accent }}>▸</span> {d}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* Start button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onStartGame}
            className="btn-cozy px-10 py-3 text-lg"
            style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '1.1rem' }}
          >
            🎲 開始遊戲
          </button>
          <p style={{ color: '#9C7A6A', fontSize: '0.75rem', textAlign: 'center' }}>
            困難模式通關可獲得更高的影響力評分 🏆
          </p>
        </div>
      </div>
    </div>
  );
};

export default DifficultySelect;
