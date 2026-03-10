import React from 'react';
import { zhTW } from '../locales/zh-TW';
import { soundManager } from '../utils/sound';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const [soundEnabled, setSoundEnabled] = React.useState(true);

  React.useEffect(() => {
    // 从 localStorage 读取音效设置
   const saved = localStorage.getItem('theWaySoundEnabled');
    if (saved !== null) {
     const enabled = saved === 'true';
      setSoundEnabled(enabled);
      soundManager.setEnabled(enabled);
    }
  }, []);

  const handleToggleSound = () => {
   const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    soundManager.setEnabled(newValue);
    localStorage.setItem('theWaySoundEnabled', String(newValue));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8">
      <div className="panel-brutalist max-w-md w-full bg-[#111] border-4 border-[var(--construction-orange)] p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl text-white Staatliches m-0">设置</h2>
          <button 
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        {/* 音效设置 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <i className={`fas ${soundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'} text-2xl text-[var(--vital-blue)]`}></i>
              <div>
                <h3 className="text-lg text-white font-bold m-0">游戏音效</h3>
                <p className="text-xs text-[var(--text-secondary)] m-0">开启或关闭所有游戏音效</p>
              </div>
            </div>
            <button
              onClick={handleToggleSound}
              className={`w-16 h-8 rounded-full transition-colors relative ${soundEnabled ? 'bg-[var(--vital-blue)]' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${soundEnabled ? 'left-9' : 'left-1'}`}></div>
            </button>
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-2">
            <p>音效包括：骰子声、建造声、事件卡片、胜利/失败音乐等</p>
          </div>
        </div>

        {/* 关于信息 */}
        <div className="border-t border-[#333] pt-6">
          <h3 className="text-lg text-white Staatliches mb-4">关于 THE WAY</h3>
          <div className="text-sm text-[var(--text-secondary)] space-y-2">
            <p><strong>版本:</strong> 1.0.0</p>
            <p><strong>开发日期:</strong> 2026 年 3月 10 日</p>
            <p><strong>项目:</strong> COMM3400 期中项目</p>
            <p><strong>客户:</strong> 點滴是生命 (A Drop of Life)</p>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="mt-8 flex gap-4">
          <button 
            onClick={onClose}
            className="btn-industrial flex-1"
          >
            <i className="fas fa-check"></i> 完成
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
