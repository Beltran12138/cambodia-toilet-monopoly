import React, { useEffect, useState } from 'react';
import { useGameLogic, Difficulty } from './hooks/useGameLogic';
import Board from './components/Board';
import PlayerStats from './components/PlayerStats';
import TutorialModal from './components/TutorialModal';
import ImpactDashboard from './components/ImpactDashboard';
import CambodiaStats from './components/CambodiaStats';
import SettingsPanel from './components/SettingsPanel';
import DifficultySelect from './components/DifficultySelect';
import AchievementSystem from './components/AchievementSystem';
import GameStats from './components/GameStats';
import DashboardIntegration from './components/DashboardIntegration';
import { zhTW } from './locales/zh-TW';
import { saveGameRecord, hasPendingGame } from './utils/cloudbase';
import { soundManager } from './utils/sound';

const App: React.FC = () => {
  const {
  players,
  tiles,
   currentPlayerIndex,
    diceResults,
    gameStatus,
    message,
    messageHistory,
    rollDice,
    buildToilet,
    endTurn,
  confirmEvent,
   currentEvent,
    showTutorial,
   setShowTutorial,
   loadGame,
    resetGame,
  toiletsBuilt,
  totalInvestment,
    hasRolled,
    hasActed,
    difficulty,
   setDifficulty,
    startGameWithDifficulty,
    gameStats,
   incrementEventsTriggered,
  } = useGameLogic();

  const currentPlayer = players[currentPlayerIndex];
  const currentTile = tiles[currentPlayer.position];
  const isDonorTurn = currentPlayer.role.startsWith('DONOR');
  const canBuild = isDonorTurn && currentTile.type === 'VILLAGE' && !hasActed && hasRolled;
  const t = zhTW;

  // 設置面板狀態
  const [showSettings, setShowSettings] = useState(false);
  
  // 難度選擇狀態
  const [showDifficultySelect, setShowDifficultySelect] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('NORMAL');

  // 檢查是否有待繼續的遊戲
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);
  
  // 成就系统显示
  const [showAchievements, setShowAchievements] = useState(false);
  
  // 游戏统计显示
  const [showGameStats, setShowGameStats] = useState(false);
  
  // Dashboard 整合显示
  const [showDashboardIntegration, setShowDashboardIntegration] = useState(false);

  useEffect(() => {
    // 檢查是否有保存的遊戲記錄
  const checkPendingGame = async () => {
    const hasPending = await hasPendingGame();
    if (hasPending) {
       setShowContinuePrompt(true);
      }
    };
    checkPendingGame();
  }, []);

  // 載入遊戲
  const handleLoadGame = async () => {
    soundManager.play('click');
    await loadGame();
   setShowContinuePrompt(false);
   setShowDifficultySelect(false);
  };

  // 新遊戲
  const handleNewGame = () => {
    soundManager.play('click');
    resetGame();
   setShowContinuePrompt(false);
   setShowTutorial(true);
   setShowDifficultySelect(true);
  };

  // 保存遊戲
  const handleSaveGame = async () => {
    soundManager.play('click');
    await saveGameRecord({
    players,
    tiles,
     currentPlayerIndex,
      diceResults,
      gameStatus,
      message,
      hasRolled,
      hasActed
    });
    alert('遊戲已保存！');
  };

  // 開始遊戲（從難度選擇）
  const handleStartGame = () => {
    soundManager.play('click');
    startGameWithDifficulty(selectedDifficulty);
   setShowDifficultySelect(false);
  };

  // 游戏状态变化时播放音效
  useEffect(() => {
  if (gameStatus === 'WON') {
      soundManager.play('win');
    } else if (gameStatus === 'LOST') {
      soundManager.play('lose');
    }
  }, [gameStatus]);

  // 当事件触发时更新统计
  useEffect(() => {
  if (currentEvent) {
    incrementEventsTriggered();
    }
  }, [currentEvent]);

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 md:p-8">
      {/* 標題頭部 */}
      <header className="mb-6 md:mb-12 border-b-2 border-[#333] pb-4 md:pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl text-[var(--construction-orange)] m-0 Staatliches leading-none">THE WAY</h1>
            <p className="text-base md:text-xl text-[var(--text-secondary)] uppercase tracking-[0.3em] font-light">{t.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            <button 
             onClick={() => { soundManager.play('click'); setShowAchievements(true); }}
              className="btn-industrial text-xs md:text-sm px-3 py-2 md:px-4 md:py-2"
            >
              <i className="fas fa-trophy"></i> <span className="hidden sm:inline">成就</span>
            </button>
            <button 
            onClick={() => { soundManager.play('click'); setShowSettings(true); }}
              className="btn-industrial text-xs md:text-sm px-3 py-2 md:px-4 md:py-2"
            >
              <i className="fas fa-cog"></i> <span className="hidden sm:inline">設置</span>
            </button>
            <button 
            onClick={handleSaveGame}
              className="btn-industrial text-xs md:text-sm px-3 py-2 md:px-4 md:py-2"
              disabled={gameStatus !== 'PLAYING'}
            >
              <i className="fas fa-save"></i> <span className="hidden sm:inline">{t.controls.saveGame || '保存遊戲'}</span>
            </button>
            <button 
            onClick={() => setShowTutorial(true)}
              className="btn-industrial text-xs md:text-sm px-3 py-2 md:px-4 md:py-2"
            >
              <i className="fas fa-book"></i> <span className="hidden sm:inline">{t.tutorial.title}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 遊戲主界面 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-12">
        {/* 左側：棋盤 */}
        <div className="col-span-12 lg:col-span-7">
          <Board tiles={tiles} players={players} />
        </div>

        {/* 右側：狀態和控制 */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-4 md:gap-8">
          {/* 玩家統計 */}
          <PlayerStats players={players} currentPlayerIndex={currentPlayerIndex} />

          {/* 影響力儀表板 */}
          <ImpactDashboard 
          toiletsBuilt={toiletsBuilt}
          totalInvestment={totalInvestment}
            villagerHP={players.find(p => p.role === 'VILLAGER')?.hp || 100}
            lapsCompleted={players.find(p => p.role === 'VILLAGER')?.laps || 0}
          />

          {/* 柬埔寨衛生數據 */}
          <CambodiaStats 
          toiletsBuilt={toiletsBuilt}
          totalInvestment={totalInvestment}
          />

          {/* 遊戲控制 */}
          <div className="panel-brutalist bg-[#1a1a1a]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl text-white Staatliches m-0">{t.controls.currentTurn}</h3>
                <p className="text-[var(--construction-orange)] font-bold text-sm tracking-widest uppercase">
                  {t.roles[currentPlayer.role as keyof typeof t.roles] || currentPlayer.role}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block">{t.controls.diceResult}</span>
                <div className="flex gap-2 justify-end mt-1">
                  {diceResults[0] > 0 ? (
                    <>
                      <span className="text-3xl text-white font-bold Staatliches bg-[#333] w-10 h-10 flex items-center justify-center border border-[var(--construction-orange)]">{diceResults[0]}</span>
                      <span className="text-3xl text-white font-bold Staatliches bg-[#333] w-10 h-10 flex items-center justify-center border border-[var(--construction-orange)]">{diceResults[1]}</span>
                    </>
                  ) : (
                    <span className="text-3xl text-white font-bold Staatliches">--</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
               onClick={() => { soundManager.play('dice'); rollDice(); }}
                disabled={gameStatus !== 'PLAYING' || hasRolled}
                className="btn-industrial flex-1"
              >
                <i className="fas fa-dice"></i> {hasRolled ? t.controls.alreadyRolled || '已投擲' : t.controls.rollDice}
              </button>
              
              <button 
               onClick={() => { soundManager.play('click'); endTurn(); }}
                disabled={gameStatus !== 'PLAYING' || !hasRolled}
                className="btn-industrial-blue flex-1"
              >
                <i className="fas fa-forward"></i> {t.controls.endTurn || '結束回合'}
              </button>
            </div>

            {canBuild && gameStatus === 'PLAYING' && (
              <div className="mt-8 pt-8 border-t border-[#333] animate-in slide-in-from-top duration-300">
                <div className="flex items-center gap-2 mb-4">
                   <i className="fas fa-hammer text-[var(--vital-blue)]"></i>
                   <h4 className="text-lg text-[var(--vital-blue)] Staatliches m-0">{t.controls.constructionOptions} ({currentTile.nameZh})</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                   onClick={() => { soundManager.play('build'); buildToilet(currentTile.id, 'SMALL'); }}
                    disabled={currentPlayer.funds < currentTile.priceSmall || currentTile.toiletType !== 'NONE'}
                    className="p-3 border-2 border-[#444] hover:border-[var(--vital-blue)] text-left group transition-all"
                  >
                    <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block mb-1">{t.toiletTypes.SMALL}</span>
                    <span className="text-lg font-bold text-white block">$200</span>
                    <span className="text-[10px] text-[var(--vital-blue)] font-bold uppercase opacity-0 group-hover:opacity-100 transition-all">+5 HP {t.stats.recovery || '恢復'}</span>
                  </button>
                  <button 
                   onClick={() => { soundManager.play('build'); buildToilet(currentTile.id, 'LARGE'); }}
                    disabled={currentPlayer.funds < currentTile.priceLarge || currentTile.toiletType === 'LARGE'}
                    className="p-3 border-2 border-[#444] hover:border-[var(--vital-blue)] text-left group transition-all"
                  >
                    <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block mb-1">{t.toiletTypes.LARGE}</span>
                    <span className="text-lg font-bold text-white block">$500</span>
                    <span className="text-[10px] text-[var(--vital-blue)] font-bold uppercase opacity-0 group-hover:opacity-100 transition-all">+15 HP {t.stats.recovery || '恢復'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 遊戲日誌 */}
          <div className="flex-1 bg-black/50 border-2 border-[#333] p-4 font-mono text-sm overflow-y-auto max-h-[300px]">
            <div className="flex items-center gap-2 mb-4 text-[var(--construction-orange)]">
              <i className="fas fa-terminal"></i>
              <span className="font-bold uppercase text-[10px] tracking-widest">{t.logTitle || '任務日誌_'}</span>
            </div>
            <div className="space-y-2">
              {messageHistory.map((msg, index) => (
                <div 
                  key={index} 
                  className={`text-[var(--text-primary)] animate-in fade-in slide-in-from-left duration-300 ${index === 0 ? 'text-white font-bold' : 'text-[var(--text-secondary)] text-xs'}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-[var(--construction-orange)] mr-2">&gt;</span>
                  {msg}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 隨機事件彈窗 */}
      {currentEvent && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8">
          <div className="panel-brutalist max-w-md w-full bg-[#111] border-4 border-[var(--construction-orange)] p-8 text-center">
            <i className={`fas ${currentEvent.icon} text-6xl ${currentEvent.color} mb-4`}></i>
            <h3 className="text-3xl text-white Staatliches mb-2">{currentEvent.title}</h3>
            <p className="text-[var(--text-secondary)] mb-6">{currentEvent.description}</p>
            <p className="text-lg text-[var(--construction-orange)] font-bold mb-6">{message}</p>
            <button 
            onClick={() => { soundManager.play('click'); confirmEvent(); }}
              className="btn-industrial mx-auto"
            >
              {t.eventContinue || '繼續'} <i className="fas fa-check"></i>
            </button>
          </div>
        </div>
      )}

      {/* 教程彈窗 */}
      {showTutorial && (
        <TutorialModal onClose={() => setShowTutorial(false)} />
      )}

      {/* 繼續遊戲提示 */}
      {showContinuePrompt && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8">
          <div className="panel-brutalist max-w-md w-full bg-[#111] border-4 border-[var(--construction-orange)] p-8 text-center">
            <i className="fas fa-gamepad text-6xl text-[var(--vital-blue)] mb-4"></i>
            <h3 className="text-3xl text-white Staatliches mb-4">發現未完成的遊戲</h3>
            <p className="text-[var(--text-secondary)] mb-8">是否要繼續之前的遊戲進度？</p>
            <div className="flex gap-4">
              <button 
              onClick={handleLoadGame}
                className="btn-industrial flex-1"
              >
                <i className="fas fa-play"></i> 繼續遊戲
              </button>
              <button 
              onClick={handleNewGame}
                className="btn-industrial flex-1 bg-[#333]"
              >
                <i className="fas fa-redo"></i> 新遊戲
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 遊戲結束覆蓋層 */}
      {gameStatus !== 'PLAYING' && !showContinuePrompt && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8">
          <div className="panel-brutalist max-w-2xl w-full text-center bg-[#111] border-4 border-[var(--construction-orange)] p-12">
            <i className={`fas ${gameStatus === 'WON' ? 'fa-award text-[var(--vital-blue)]' : 'fa-skull-crossbones text-[var(--danger-red)]'} text-8xl mb-8`}></i>
            <h2 className="text-7xl text-white Staatliches mb-4 tracking-tighter">
              {gameStatus === 'WON' ? t.gameStatus.won: t.gameStatus.lost}
            </h2>
            <p className="text-xl text-[var(--text-secondary)] mb-12 uppercase tracking-widest">
              {message}
            </p>
            <div className="flex gap-4">
              <button 
              onClick={() => window.location.reload()}
                className="btn-industrial flex-1 px-12 py-4 text-2xl"
              >
                <i className="fas fa-redo"></i> {t.controls.initializeNewMission}
              </button>
              <button 
              onClick={handleSaveGame}
                className="btn-industrial flex-1 px-12 py-4 text-2xl"
              >
                <i className="fas fa-save"></i> 保存記錄
              </button>
            </div>
            {gameStatus === 'WON' && (
              <div className="mt-12 pt-12 border-t border-[#333]">
                <p className="text-sm text-[var(--vital-blue)] font-bold italic">"{t.endGame.victory}"</p>
              </div>
            )}
            {gameStatus === 'LOST' && (
              <div className="mt-12 pt-12 border-t border-[#333]">
                <p className="text-sm text-[var(--danger-red)] font-bold italic">"{t.endGame.defeat}"</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 設置面板 */}
      <SettingsPanel 
       isOpen={showSettings}
       onClose={() => setShowSettings(false)}
      />
      
      {/* 成就系統面板 */}
      {showAchievements && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-8">
          <div className="relative max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <button 
             onClick={() => setShowAchievements(false)}
             className="absolute -top-12 right-0 text-white flex items-center gap-2 font-bold hover:text-[var(--construction-orange)] transition-colors"
            >
              <i className="fas fa-times"></i> 關閉
            </button>
            <AchievementSystem stats={gameStats} />
          </div>
        </div>
      )}

      {/* Dashboard 整合面板 */}
      {showDashboardIntegration && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-8">
          <div className="relative max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <button 
           onClick={() => setShowDashboardIntegration(false)}
             className="absolute -top-12 right-0 text-white flex items-center gap-2 font-bold hover:text-[var(--construction-orange)] transition-colors"
            >
              <i className="fas fa-times"></i> 關閉
            </button>
            <DashboardIntegration gameStats={gameStats} />
          </div>
        </div>
      )}

      {/* 難度選擇 */}
      {showDifficultySelect && (
        <DifficultySelect
         selectedDifficulty={selectedDifficulty}
         onSelectDifficulty={setSelectedDifficulty}
         onStartGame={handleStartGame}
        />
      )}
    </div>
  );
};

export default App;
