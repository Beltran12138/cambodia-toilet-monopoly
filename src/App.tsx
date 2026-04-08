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

// ── Dignity Cards data ────────────────────────────────────────────────────────
const DIGNITY_CARDS = [
  {
    id: 'menstruation',
    emoji: '🩸',
    title: '月経困境',
    subtitle: '尊嚴牌 #1',
    color: '#FFADC3',
    bg: '#FFF0F5',
    accent: '#E85588',
    story:
      '没有家庭厕所，每逢月经期，村女索菲亚必须在深夜独自走向田野。她用布料代替卫生棉，因感染反复错过上学。一座私人厕所，能守护她的健康与尊严。',
    impact: '每建一座厕所，减少约 60% 的生殖道感染风险',
  },
  {
    id: 'harassment',
    emoji: '🌙',
    title: '騷擾困境',
    subtitle: '尊嚴牌 #2',
    color: '#C4A8E0',
    bg: '#F5F0FF',
    accent: '#8855CC',
    story:
      '每天傍晚，23岁的雷娅要独自穿越黑暗小路去公共厕所。她曾遭遇跟踪与骚扰，最终因恐惧而选择憋忍到白天。一个安全的家庭厕所，能让她不再担惊受怕。',
    impact: '家庭厕所可将女性夜间外出风险降低 80%',
  },
  {
    id: 'safety',
    emoji: '🛡️',
    title: '安全困境',
    subtitle: '尊嚴牌 #3',
    color: '#FFD6A0',
    bg: '#FFF8EE',
    accent: '#CC7700',
    story:
      '68岁的奶奶康妮每次都要走200米去公共厕所。凹凸不平的泥路让她多次摔倒，髋骨骨折后，如厕成了她最大的恐惧。一座家庭厕所，能让她安全老去。',
    impact: '为老年人提供家庭厕所，可减少 70% 跌倒事故',
  },
];

// ── DignityCardsModal ─────────────────────────────────────────────────────────
const DignityCardsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(92, 61, 46, 0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="bounce-in w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{
          background: 'var(--ac-panel)',
          borderRadius: '2rem',
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(92,61,46,0.3)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                color: '#5C3D2E',
                margin: 0,
                fontSize: '1.5rem',
              }}
            >
              尊嚴牌 Dignity Cards
            </h2>
            <p style={{ color: '#9C7A6A', margin: '0.25rem 0 0', fontSize: '0.8rem' }}>
              每一張牌，是一個真實的困境故事
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(92,61,46,0.1)', border: 'none', borderRadius: '50%',
              width: 36, height: 36, cursor: 'pointer', fontSize: '1rem', color: '#9C7A6A',
            }}
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {DIGNITY_CARDS.map((card, i) => (
            <div
              key={card.id}
              className="dignity-card"
              style={{
                borderColor: active === i ? card.accent : `${card.color}80`,
                background: active === i ? card.bg : 'var(--ac-panel)',
              }}
              onClick={() => setActive(active === i ? null : i)}
            >
              <div className="flex items-center gap-3 mb-3">
                <span style={{ fontSize: '2rem' }}>{card.emoji}</span>
                <div>
                  <div
                    style={{
                      fontFamily: "'Baloo 2', sans-serif",
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      color: card.accent,
                    }}
                  >
                    {card.title}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#9C7A6A', fontWeight: 700 }}>
                    {card.subtitle}
                  </div>
                </div>
                <span style={{ marginLeft: 'auto', color: '#9C7A6A', fontSize: '0.8rem' }}>
                  {active === i ? '▲' : '▼'}
                </span>
              </div>

              {active === i && (
                <div className="card-flipping">
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: '#5C3D2E',
                      lineHeight: 1.7,
                      marginBottom: '0.75rem',
                    }}
                  >
                    {card.story}
                  </p>
                  <div
                    style={{
                      background: `${card.accent}15`,
                      borderRadius: '0.75rem',
                      padding: '0.625rem 0.875rem',
                      border: `1px solid ${card.accent}30`,
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: card.accent, fontWeight: 700 }}>
                      📊 {card.impact}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="cta-banner mt-6 text-center">
          <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.9 }}>
            遊戲中的每一座廁所，現實中需要
          </div>
          <div
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 800,
              marginBottom: '0.5rem',
            }}
          >
            HK$3,500 💛
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>
            ADOL Toilet Ownership Plan — 讓遊戲變成現實
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Conversion CTA (shown at game end) ───────────────────────────────────────
const ConversionCTA: React.FC<{ isWon: boolean }> = ({ isWon }) => (
  <div
    style={{
      marginTop: '1.5rem',
      background: isWon
        ? 'linear-gradient(135deg, #5EAB78 0%, #70C8E8 100%)'
        : 'linear-gradient(135deg, #FF8C69 0%, #FFD166 100%)',
      borderRadius: '1.5rem',
      padding: '1.5rem',
      color: '#fff',
      textAlign: 'center',
      boxShadow: '0 8px 32px rgba(94,171,120,0.35)',
    }}
  >
    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
      {isWon ? '🎉' : '💪'}
    </div>
    <h3
      style={{
        fontFamily: "'Baloo 2', sans-serif",
        margin: '0 0 0.375rem',
        fontSize: '1.1rem',
      }}
    >
      讓遊戲變成真實！
    </h3>
    <p style={{ margin: '0 0 1rem', fontSize: '0.825rem', opacity: 0.9 }}>
      {isWon
        ? '你在遊戲中建造了廁所——現實中的每座廁所只需 HK$3,500'
        : '現實比遊戲更難，但改變是可能的——每 HK$3,500 建一座真實的廁所'}
    </p>

    {/* Pricing tiers */}
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div
        style={{
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '1rem',
          padding: '0.875rem',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>🌱</div>
        <div style={{ fontWeight: 800, fontSize: '0.875rem', fontFamily: "'Baloo 2', sans-serif" }}>
          共同擁有
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: 2 }}>HK$50 / 月</div>
        <div style={{ fontSize: '0.7rem', opacity: 0.85, marginTop: 2 }}>
          與他人共建一座廁所
        </div>
      </div>
      <div
        style={{
          background: 'rgba(255,255,255,0.25)',
          borderRadius: '1rem',
          padding: '0.875rem',
          border: '2px solid rgba(255,255,255,0.5)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>🏠</div>
        <div style={{ fontWeight: 800, fontSize: '0.875rem', fontFamily: "'Baloo 2', sans-serif" }}>
          完整擁有
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: 2 }}>HK$3,500</div>
        <div style={{ fontSize: '0.7rem', opacity: 0.85, marginTop: 2 }}>
          獨立捐建一座完整廁所
        </div>
      </div>
    </div>

    {/* QR placeholder + button */}
    <div className="flex items-center justify-center gap-4 flex-wrap">
      <div
        style={{
          background: '#fff',
          borderRadius: '0.875rem',
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* QR code placeholder */}
        <div
          style={{
            width: 64, height: 64,
            background: 'repeating-linear-gradient(45deg, #5EAB78 0, #5EAB78 4px, #fff 0, #fff 8px)',
            borderRadius: '0.5rem',
            opacity: 0.7,
          }}
        />
        <span style={{ fontSize: '0.6rem', color: '#9C7A6A', marginTop: 4 }}>掃碼了解更多</span>
      </div>
      <a
        href="https://adol.org.hk"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: '#fff',
          color: isWon ? '#5EAB78' : '#FF8C69',
          borderRadius: '999px',
          padding: '0.625rem 1.5rem',
          fontWeight: 800,
          fontSize: '0.9rem',
          textDecoration: 'none',
          fontFamily: "'Baloo 2', sans-serif",
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'inline-block',
        }}
      >
        🚽 立即支持 ADOL →
      </a>
    </div>
  </div>
);

// ── App ───────────────────────────────────────────────────────────────────────
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
  const currentTile   = tiles[currentPlayer.position];
  const isDonorTurn   = currentPlayer.role.startsWith('DONOR');
  const canBuild      = isDonorTurn && currentTile.type === 'VILLAGE' && !hasActed && hasRolled;
  const t = zhTW;

  const [showSettings,            setShowSettings]            = useState(false);
  const [showDifficultySelect,    setShowDifficultySelect]    = useState(true);
  const [selectedDifficulty,      setSelectedDifficulty]      = useState<Difficulty>('NORMAL');
  const [showContinuePrompt,      setShowContinuePrompt]      = useState(false);
  const [showAchievements,        setShowAchievements]        = useState(false);
  const [showGameStats,           setShowGameStats]           = useState(false);
  const [showDashboardIntegration,setShowDashboardIntegration]= useState(false);
  const [showDignityCards,        setShowDignityCards]        = useState(false);

  useEffect(() => {
    const checkPendingGame = async () => {
      const hasPending = await hasPendingGame();
      if (hasPending) setShowContinuePrompt(true);
    };
    checkPendingGame();
  }, []);

  const handleLoadGame = async () => {
    soundManager.play('click');
    await loadGame();
    setShowContinuePrompt(false);
    setShowDifficultySelect(false);
  };

  const handleNewGame = () => {
    soundManager.play('click');
    resetGame();
    setShowContinuePrompt(false);
    setShowTutorial(true);
    setShowDifficultySelect(true);
  };

  const handleSaveGame = async () => {
    soundManager.play('click');
    await saveGameRecord({ players, tiles, currentPlayerIndex, diceResults, gameStatus, message, hasRolled, hasActed });
    alert('遊戲已保存！');
  };

  const handleStartGame = () => {
    soundManager.play('click');
    startGameWithDifficulty(selectedDifficulty);
    setShowDifficultySelect(false);
  };

  useEffect(() => {
    if (gameStatus === 'WON')  soundManager.play('win');
    else if (gameStatus === 'LOST') soundManager.play('lose');
  }, [gameStatus]);

  useEffect(() => {
    if (currentEvent) incrementEventsTriggered();
  }, [currentEvent]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen p-4 md:p-6"
      style={{ background: 'var(--ac-bg)', color: 'var(--ac-brown)' }}
    >
      {/* ── Header ── */}
      <header
        style={{
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
              color: '#5EAB78',
              margin: 0,
              lineHeight: 1,
            }}
          >
            🌏 THE WAY
          </h1>
          <p
            style={{
              fontSize: '0.8rem',
              color: '#9C7A6A',
              margin: '0.25rem 0 0',
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}
          >
            {t.subtitle}
          </p>
        </div>

        <div className="header-btn-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            onClick={() => { soundManager.play('click'); setShowDignityCards(true); }}
            className="btn-cozy"
            style={{ background: '#FFADC3', boxShadow: '0 4px 0 #E85588, 0 6px 12px rgba(255,173,195,0.3)', fontSize: '0.8rem', padding: '0.4rem 0.875rem' }}
          >
            🩸 尊嚴牌
          </button>
          <button
            onClick={() => { soundManager.play('click'); setShowAchievements(true); }}
            className="btn-cozy-sky"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.875rem' }}
          >
            🏆 成就
          </button>
          <button
            onClick={() => { soundManager.play('click'); setShowSettings(true); }}
            className="btn-cozy-outline"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.875rem' }}
          >
            ⚙️ 設置
          </button>
          <button
            onClick={handleSaveGame}
            disabled={gameStatus !== 'PLAYING'}
            className="btn-cozy-outline"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.875rem' }}
          >
            💾 保存
          </button>
          <button
            onClick={() => setShowTutorial(true)}
            className="btn-cozy-outline"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.875rem' }}
          >
            📖 教學
          </button>
        </div>
      </header>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">

        {/* Board */}
        <div className="lg:col-span-7">
          <Board tiles={tiles} players={players} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <PlayerStats players={players} currentPlayerIndex={currentPlayerIndex} />

          <ImpactDashboard
            toiletsBuilt={toiletsBuilt}
            totalInvestment={totalInvestment}
            villagerHP={players.find(p => p.role === 'VILLAGER')?.hp || 100}
            lapsCompleted={players.find(p => p.role === 'VILLAGER')?.laps || 0}
          />

          <CambodiaStats toiletsBuilt={toiletsBuilt} totalInvestment={totalInvestment} />

          {/* Control panel */}
          <div className="panel-cozy">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3
                  style={{
                    fontFamily: "'Baloo 2', sans-serif",
                    margin: 0,
                    fontSize: '1.1rem',
                    color: '#5C3D2E',
                  }}
                >
                  {t.controls.currentTurn}
                </h3>
                <p
                  style={{
                    color: '#FF8C69',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    margin: '0.2rem 0 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {t.roles[currentPlayer.role as keyof typeof t.roles] || currentPlayer.role}
                </p>
              </div>
              {/* Dice display */}
              <div style={{ display: 'flex', gap: 8 }}>
                {diceResults[0] > 0 ? (
                  [diceResults[0], diceResults[1]].map((d, i) => (
                    <div
                      key={i}
                      style={{
                        width: 40, height: 40,
                        background: '#FFFEF2',
                        borderRadius: '0.75rem',
                        border: '2px solid #FFD166',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Baloo 2', sans-serif",
                        fontWeight: 800,
                        fontSize: '1.3rem',
                        color: '#FF8C69',
                        boxShadow: '0 2px 8px rgba(255,209,102,0.3)',
                      }}
                    >
                      {d}
                    </div>
                  ))
                ) : (
                  <span style={{ color: '#C4A898', fontFamily: "'Baloo 2', sans-serif", fontSize: '1.5rem' }}>—</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => { soundManager.play('dice'); rollDice(); }}
                disabled={gameStatus !== 'PLAYING' || hasRolled}
                className="btn-cozy"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                🎲 {hasRolled ? t.controls.alreadyRolled : t.controls.rollDice}
              </button>
              <button
                onClick={() => { soundManager.play('click'); endTurn(); }}
                disabled={gameStatus !== 'PLAYING' || !hasRolled}
                className="btn-cozy-green"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                ➡️ {t.controls.endTurn}
              </button>
            </div>

            {canBuild && gameStatus === 'PLAYING' && (
              <div
                style={{
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '2px dashed rgba(94,171,120,0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span>🔨</span>
                  <h4
                    style={{
                      fontFamily: "'Baloo 2', sans-serif",
                      color: '#5EAB78',
                      margin: 0,
                      fontSize: '0.95rem',
                    }}
                  >
                    {t.controls.constructionOptions} — {currentTile.nameZh}
                  </h4>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {[
                    { type: 'SMALL' as const, emoji: '🚽', label: t.toiletTypes.SMALL, price: '$200', hp: '+5 HP' },
                    { type: 'LARGE' as const, emoji: '🚿', label: t.toiletTypes.LARGE, price: '$500', hp: '+15 HP' },
                  ].map(opt => (
                    <button
                      key={opt.type}
                      onClick={() => { soundManager.play('build'); buildToilet(currentTile.id, opt.type); }}
                      disabled={
                        (opt.type === 'SMALL' && (currentPlayer.funds < currentTile.priceSmall || currentTile.toiletType !== 'NONE')) ||
                        (opt.type === 'LARGE' && (currentPlayer.funds < currentTile.priceLarge || currentTile.toiletType === 'LARGE'))
                      }
                      style={{
                        background: '#F0FFF4',
                        borderRadius: '0.875rem',
                        border: '2px solid rgba(94,171,120,0.3)',
                        padding: '0.875rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        opacity: 1,
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{opt.emoji}</div>
                      <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#5C3D2E', fontFamily: "'Baloo 2', sans-serif" }}>
                        {opt.label}
                      </div>
                      <div style={{ color: '#5EAB78', fontWeight: 800, fontSize: '1rem', fontFamily: "'Baloo 2', sans-serif" }}>
                        {opt.price}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#9C7A6A', marginTop: 2 }}>
                        {opt.hp} {t.stats.recovery}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Game log */}
          <div className="game-log-cozy">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: '0.75rem',
                color: '#5EAB78',
                fontWeight: 800,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              📋 {t.logTitle}
            </div>
            <div>
              {messageHistory.map((msg, index) => (
                <div key={index} className="log-bubble" style={{ animationDelay: `${index * 40}ms` }}>
                  {msg}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Random Event modal ── */}
      {currentEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(92,61,46,0.6)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="bounce-in max-w-md w-full text-center"
            style={{
              background: 'var(--ac-panel)',
              borderRadius: '2rem',
              padding: '2rem',
              boxShadow: '0 20px 60px rgba(92,61,46,0.3)',
              border: '3px solid var(--ac-yellow)',
            }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>
              {currentEvent.icon?.includes('fa-') ? (
                <i className={`fas ${currentEvent.icon} text-5xl`} style={{ color: '#FF8C69' }}></i>
              ) : (
                '🎲'
              )}
            </div>
            <h3
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: '1.5rem',
                color: '#5C3D2E',
                margin: '0 0 0.5rem',
              }}
            >
              {currentEvent.title}
            </h3>
            <p style={{ color: '#9C7A6A', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
              {currentEvent.description}
            </p>
            <p
              style={{
                color: '#FF8C69',
                fontWeight: 800,
                marginBottom: '1.25rem',
                fontSize: '0.95rem',
              }}
            >
              {message}
            </p>
            <button
              onClick={() => { soundManager.play('click'); confirmEvent(); }}
              className="btn-cozy mx-auto"
              style={{ justifyContent: 'center' }}
            >
              ✅ {t.eventContinue}
            </button>
          </div>
        </div>
      )}

      {/* ── Tutorial ── */}
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}

      {/* ── Continue prompt ── */}
      {showContinuePrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(92,61,46,0.6)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="bounce-in max-w-md w-full text-center"
            style={{
              background: 'var(--ac-panel)',
              borderRadius: '2rem',
              padding: '2rem',
              boxShadow: '0 20px 60px rgba(92,61,46,0.3)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎮</div>
            <h3
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: '1.4rem',
                color: '#5C3D2E',
                margin: '0 0 0.75rem',
              }}
            >
              發現未完成的遊戲
            </h3>
            <p style={{ color: '#9C7A6A', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              是否要繼續之前的遊戲進度？
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleLoadGame}  className="btn-cozy-green" style={{ flex: 1, justifyContent: 'center' }}>
                ▶️ 繼續遊戲
              </button>
              <button onClick={handleNewGame}   className="btn-cozy-outline" style={{ flex: 1, justifyContent: 'center' }}>
                🔄 新遊戲
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Game Over ── */}
      {gameStatus !== 'PLAYING' && !showContinuePrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ background: 'rgba(92,61,46,0.6)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="end-game-panel max-w-lg w-full text-center my-4"
            style={{
              background: 'var(--ac-panel)',
              borderRadius: '2rem',
              padding: '2rem',
              boxShadow: '0 20px 60px rgba(92,61,46,0.3)',
              border: `3px solid ${gameStatus === 'WON' ? '#5EAB78' : '#E85555'}`,
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
              {gameStatus === 'WON' ? '🏆' : '😢'}
            </div>
            <h2
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: '2rem',
                color: gameStatus === 'WON' ? '#5EAB78' : '#E85555',
                margin: '0 0 0.5rem',
              }}
            >
              {gameStatus === 'WON' ? t.gameStatus.won : t.gameStatus.lost}
            </h2>
            <p style={{ color: '#9C7A6A', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {message}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
              <button
                onClick={() => window.location.reload()}
                className="btn-cozy"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                🔄 {t.controls.initializeNewMission}
              </button>
              <button
                onClick={handleSaveGame}
                className="btn-cozy-outline"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                💾 保存記錄
              </button>
            </div>

            {/* Victory/defeat quote */}
            <p
              style={{
                fontSize: '0.8rem',
                fontStyle: 'italic',
                color: gameStatus === 'WON' ? '#5EAB78' : '#E85555',
                opacity: 0.8,
                marginBottom: 0,
              }}
            >
              "{gameStatus === 'WON' ? t.endGame?.victory : t.endGame?.defeat}"
            </p>

            {/* Conversion CTA */}
            <ConversionCTA isWon={gameStatus === 'WON'} />
          </div>
        </div>
      )}

      {/* ── Settings ── */}
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* ── Achievements ── */}
      {showAchievements && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(92,61,46,0.6)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowAchievements(false)}
        >
          <div
            className="relative max-w-2xl w-full flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAchievements(false)}
              className="self-end mb-3 btn-cozy-outline"
              style={{ fontSize: '0.8rem', padding: '0.3rem 0.875rem' }}
            >
              ✕ 關閉
            </button>
            <div
              className="overflow-y-auto panel-cozy"
              style={{ padding: '1.5rem' }}
            >
              <AchievementSystem stats={gameStats} />
            </div>
          </div>
        </div>
      )}

      {/* ── Dashboard Integration ── */}
      {showDashboardIntegration && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(92,61,46,0.5)', backdropFilter: 'blur(8px)' }}
        >
          <div className="relative max-w-2xl w-full flex flex-col max-h-[90vh]">
            <button
              onClick={() => setShowDashboardIntegration(false)}
              className="self-end mb-3 btn-cozy-outline"
              style={{ fontSize: '0.8rem', padding: '0.3rem 0.875rem' }}
            >
              ✕ 關閉面板
            </button>
            <div className="overflow-y-auto panel-cozy p-0">
              <DashboardIntegration gameStats={gameStats} />
            </div>
          </div>
        </div>
      )}

      {/* ── Difficulty Select ── */}
      {showDifficultySelect && (
        <DifficultySelect
          selectedDifficulty={selectedDifficulty}
          onSelectDifficulty={setSelectedDifficulty}
          onStartGame={handleStartGame}
        />
      )}

      {/* ── Dignity Cards ── */}
      {showDignityCards && (
        <DignityCardsModal onClose={() => setShowDignityCards(false)} />
      )}
    </div>
  );
};

export default App;
