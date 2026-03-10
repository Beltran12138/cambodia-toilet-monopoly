import React, { useState, useEffect } from 'react';
import { zhTW } from '../locales/zh-TW';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  condition: (stats: AchievementStats) => boolean;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

export interface AchievementStats {
  toiletsBuilt: number;
  totalInvestment: number;
  villagerHP: number;
  lapsCompleted: number;
  gamesPlayed: number;
  gamesWon: number;
  eventsTriggered: number;
  smallToiletsBuilt: number;
  largeToiletsBuilt: number;
}

interface AchievementSystemProps {
  stats: AchievementStats;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'FIRST_TOILET',
   title: '第一座廁所',
    description: '建造你的第一座廁所，邁出改變的第一步',
    icon: 'fa-toilet',
   color: 'text-[var(--vital-blue)]',
   condition: (stats) => stats.toiletsBuilt >= 1,
    unlocked: false,
  },
  {
    id: 'BUILDER_5',
   title: '基建先鋒',
    description: '累計建造 5 座廁所',
    icon: 'fa-hammer',
   color: 'text-orange-400',
   condition: (stats) => stats.toiletsBuilt >= 5,
    unlocked: false,
  },
  {
    id: 'DONOR_GOLD',
   title: '黃金捐贈者',
    description: '累計投資超過 $2000',
    icon: 'fa-coins',
   color: 'text-yellow-400',
   condition: (stats) => stats.totalInvestment >= 2000,
    unlocked: false,
  },
  {
    id: 'LIFESAVER',
   title: '生命守護者',
    description: '村民 HP 達到 150 滿值',
    icon: 'fa-heart',
   color: 'text-[var(--danger-red)]',
   condition: (stats) => stats.villagerHP >= 150,
    unlocked: false,
  },
  {
    id: 'MARATHON',
   title: '馬拉松完成者',
    description: '村民完成 5 圈旅程',
    icon: 'fa-flag-checkered',
   color: 'text-green-400',
   condition: (stats) => stats.lapsCompleted >= 5,
    unlocked: false,
  },
  {
    id: 'SURVIVOR',
   title: '堅韌幸存者',
    description: '在村民 HP 低於 30 的情況下獲勝',
    icon: 'fa-shield-halved',
   color: 'text-purple-400',
   condition: (stats) => stats.gamesWon >= 1 && stats.villagerHP < 50,
    unlocked: false,
  },
  {
    id: 'PHILANTHROPIST',
   title: '慈善家',
    description: '建造 3 座大型廁所',
    icon: 'fa-restroom',
   color: 'text-cyan-400',
   condition: (stats) => stats.largeToiletsBuilt >= 3,
    unlocked: false,
  },
];

const AchievementSystem: React.FC<AchievementSystemProps> = ({ stats, onAchievementUnlocked }) => {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    // 从 localStorage 加载已解锁的成就
   const saved = localStorage.getItem('theWayAchievements');
   if (saved) {
     const unlockedIds = JSON.parse(saved);
      return ACHIEVEMENTS.map(a => ({
        ...a,
        unlocked: unlockedIds.includes(a.id),
      }));
    }
    return ACHIEVEMENTS;
  });

  const [showNotification, setShowNotification] = useState<Achievement | null>(null);

  useEffect(() => {
   const newUnlockedIds: string[] = [];
    
    achievements.forEach(achievement => {
     if (!achievement.unlocked && achievement.condition(stats)) {
        // 解锁成就
       const updated = achievements.map(a => 
          a.id === achievement.id ? { ...a, unlocked: true } : a
        );
        setAchievements(updated);
        newUnlockedIds.push(achievement.id);
        
        // 显示通知
        setShowNotification(achievement);
        
        // 触发回调
        onAchievementUnlocked?.(achievement);
        
        // 播放音效
       const audio = new Audio('/sounds/achievement.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      }
      
     if (achievement.unlocked) {
        newUnlockedIds.push(achievement.id);
      }
    });

    // 保存到 localStorage
   if (newUnlockedIds.length > 0) {
     localStorage.setItem('theWayAchievements', JSON.stringify(newUnlockedIds));
    }
  }, [stats]);

  useEffect(() => {
   if (showNotification) {
     const timer= setTimeout(() => {
        setShowNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progress = (unlockedCount / achievements.length) * 100;

  return (
    <>
      {/* 成就通知 */}
      {showNotification && (
        <div className="fixed top-8 right-8 z-[100] animate-in slide-in-from-right duration-500">
          <div className="panel-brutalist bg-gradient-to-r from-[#1a1a1a] to-[#222] border-2 border-[var(--construction-orange)] p-6 min-w-[320px] achievement-notification">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full bg-[#111] flex items-center justify-center border-2 border-[var(--construction-orange)]`}>
                <i className={`fas ${showNotification.icon} text-3xl ${showNotification.color}`}></i>
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-[var(--construction-orange)] uppercase tracking-widest font-bold mb-1">
                  成就解鎖！
                </p>
                <h4 className="text-xl text-white Staatliches m-0">{showNotification.title}</h4>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{showNotification.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 成就面板（可嵌入设置或单独页面） */}
      <div className="panel-brutalist bg-[#1a1a1a] border-l-4 border-[var(--construction-orange)]">
        <div className="flex items-center gap-3 mb-6">
          <i className="fas fa-trophy text-3xl text-[var(--construction-orange)]"></i>
          <h3 className="text-2xl text-white Staatliches m-0">成就系統</h3>
        </div>

        {/* 总进度 */}
        <div className="mb-6 p-4 bg-[#111] border-2 border-[#333]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-[var(--text-secondary)] uppercase">總進度</span>
            <span className="text-sm font-bold text-white">{unlockedCount}/{achievements.length}</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[var(--construction-orange)] to-yellow-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 成就列表 */}
        <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
          {achievements.map(achievement => (
            <div 
              key={achievement.id}
              className={`p-4 border-2 transition-all ${
                achievement.unlocked 
                  ? 'bg-[#111] border-[var(--construction-orange)]' 
                  : 'bg-[#0a0a0a] border-[#333] opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  achievement.unlocked ? 'bg-[#1a1a1a]' : 'bg-[#111]'
                }`}>
                  <i className={`fas ${achievement.icon} text-2xl ${
                    achievement.unlocked ? achievement.color : 'text-gray-600'
                  }`}></i>
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-bold Staatliches ${
                    achievement.unlocked ? 'text-white' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                    {achievement.description}
                  </p>
                </div>
                {achievement.unlocked && (
                  <i className="fas fa-check-circle text-green-500 text-xl"></i>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AchievementSystem;
