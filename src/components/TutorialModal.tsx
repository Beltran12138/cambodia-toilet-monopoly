import React, { useState, useEffect } from 'react';
import { zhTW } from '../locales/zh-TW';

interface TutorialModalProps {
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const t = zhTW.tutorial;

  useEffect(() => {
    // 只在首次加载时检查，显示一次后不再自动关闭
  }, []);

  const handleNext = () => {
    if (currentStep < t.steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('hasSeenTutorial', 'true');
      onClose();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8">
      <div className="panel-brutalist max-w-3xl w-full bg-[#111] border-4 border-[var(--construction-orange)] p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl text-[var(--construction-orange)] Staatliches m-0">{t.title}</h2>
          <button 
            onClick={handleSkip}
            className="text-[var(--text-secondary)] hover:text-white transition-all"
          >
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        {/* 歡迎頁面 */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <i className="fas fa-toilet text-6xl text-[var(--vital-blue)] mb-6"></i>
              <h3 className="text-2xl text-white mb-4">{t.welcome}</h3>
              <p className="text-[var(--text-secondary)]">{t.objectiveDesc}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="p-4 border-2 border-[var(--vital-blue)] bg-[#1a1a1a]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">V</div>
                  <h4 className="text-xl text-[var(--vital-blue)] Staatliches">{t.villagerRole}</h4>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{t.villagerDesc}</p>
              </div>
              
              <div className="p-4 border-2 border-[var(--construction-orange)] bg-[#1a1a1a]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--construction-orange)] flex items-center justify-center text-black font-bold">D</div>
                  <h4 className="text-xl text-[var(--construction-orange)] Staatliches">{t.donorRole}</h4>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{t.donorDesc}</p>
              </div>
            </div>
          </div>
        )}

        {/* 遊戲步驟 */}
        {currentStep >= 1 && currentStep <= t.steps.length && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-6xl font-bold text-[var(--construction-orange)] opacity-30">
                {String(currentStep).padStart(2, '0')}
              </div>
              <p className="text-xl text-white flex-1">{t.steps[currentStep - 1]}</p>
            </div>
            
            {/* 進度指示器 */}
            <div className="flex gap-2 justify-center mt-8">
              {Array.from({ length: t.steps.length }).map((_, i) => (
                <div 
                  key={i}
                  className={`h-2 flex-1 max-w-[60px] transition-all ${
                    i < currentStep 
                      ? 'bg-[var(--construction-orange)]' 
                      : 'bg-[#333]'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* 提示頁面 */}
        {currentStep === t.steps.length + 1 && (
          <div className="text-center py-8">
            <i className="fas fa-lightbulb text-6xl text-[var(--construction-orange)] mb-6"></i>
            <h3 className="text-2xl text-white mb-4">{t.tips}</h3>
            <p className="text-[var(--text-secondary)]">{t.tipsDesc}</p>
          </div>
        )}

        {/* 按鈕 */}
        <div className="flex gap-4 mt-8">
          {currentStep > 0 && (
            <button 
              onClick={() => setCurrentStep(currentStep - 1)}
              className="btn-industrial flex-1"
            >
              <i className="fas fa-arrow-left"></i> {currentStep === 1 ? t.startGame : '上一步'}
            </button>
          )}
          {currentStep === 0 && (
            <button 
              onClick={handleNext}
              className="btn-industrial flex-1"
            >
              {t.startGame} <i className="fas fa-play"></i>
            </button>
          )}
          {currentStep > 0 && currentStep <= t.steps.length + 1 && (
            <button 
              onClick={handleNext}
              className="btn-industrial flex-1"
            >
              {currentStep === t.steps.length + 1 ? '開始遊戲' : '下一步'} <i className="fas fa-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
