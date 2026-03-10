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
    name: '简单',
    description: '适合新手玩家',
    details: [
      '村民初始 HP: 120',
      '无厕所村庄 HP 损失：-10',
      '建造成本：-20%',
    ],
   color: 'text-green-400',
    borderColor: 'border-green-600',
    bgColor: 'bg-green-900/20',
  },
  NORMAL: {
    name: '普通',
    description: '标准游戏体验',
    details: [
      '村民初始 HP: 100',
      '无厕所村庄 HP 损失：-15',
      '建造成本：标准',
    ],
   color: 'text-[var(--construction-orange)]',
    borderColor: 'border-[var(--construction-orange)]',
    bgColor: 'bg-[var(--construction-orange)]/10',
  },
  HARD: {
    name: '困难',
    description: '挑战性体验',
    details: [
      '村民初始 HP: 80',
      '无厕所村庄 HP 损失：-20',
      '建造成本：标准',
      '获胜评分 x1.5',
    ],
   color: 'text-[var(--danger-red)]',
    borderColor: 'border-[var(--danger-red)]',
    bgColor: 'bg-[var(--danger-red)]/10',
  },
};

const DifficultySelect: React.FC<DifficultySelectProps> = ({
  selectedDifficulty,
  onSelectDifficulty,
  onStartGame,
}) => {
  const t = zhTW;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8">
      <div className="panel-brutalist max-w-4xl w-full bg-[#111] border-4 border-[var(--construction-orange)] p-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl text-white Staatliches mb-2">选择难度</h2>
          <p className="text-[var(--text-secondary)]">选择适合你的游戏难度</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {(Object.keys(DIFFICULTY_INFO) as Difficulty[]).map((difficulty) => {
           const info = DIFFICULTY_INFO[difficulty];
           const isSelected = selectedDifficulty === difficulty;

            return (
              <button
                key={difficulty}
               onClick={() => onSelectDifficulty(difficulty)}
                className={`
                  p-6 border-2 transition-all text-left relative overflow-hidden
                  ${isSelected 
                    ? `${info.borderColor} ${info.bgColor}` 
                    : 'border-[#333] hover:border-[#555]'
                  }
                `}
              >
                {/* 选中指示器 */}
                {isSelected && (
                  <div className={`absolute top-0 right-0 w-8 h-8 ${info.color.replace('text-', 'bg-')} flex items-center justify-center`}>
                    <i className="fas fa-check text-black text-sm"></i>
                  </div>
                )}

                {/* 难度名称 */}
                <div className="flex items-center gap-3 mb-4">
                  <i className={`fas ${
                    difficulty === 'EASY' ? 'fa-seedling' :
                    difficulty === 'NORMAL' ? 'fa-road' :
                    'fa-triangle-exclamation'
                  } text-3xl ${info.color}`}></i>
                  <div>
                    <h3 className={`text-2xl font-bold Staatliches m-0 ${info.color}`}>
                      {info.name}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] m-0">
                      {info.description}
                    </p>
                  </div>
                </div>

                {/* 难度详情 */}
                <ul className="space-y-2">
                  {info.details.map((detail, index) => (
                    <li key={index} className="text-sm text-[var(--text-primary)] flex items-center gap-2">
                      <i className={`fas fa-caret-right ${info.color}`}></i>
                      {detail}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* 开始按钮 */}
        <div className="flex justify-center">
          <button
           onClick={onStartGame}
            className="btn-industrial px-12 py-4 text-xl"
          >
            <i className="fas fa-play"></i> 开始游戏
          </button>
        </div>

        {/* 提示信息 */}
        <div className="mt-6 text-center text-xs text-[var(--text-secondary)]">
          <p>提示：困难难度通关可获得更高的影响力评分</p>
        </div>
      </div>
    </div>
  );
};

export default DifficultySelect;
