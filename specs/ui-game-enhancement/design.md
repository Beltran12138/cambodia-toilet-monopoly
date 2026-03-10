# 技术方案设计

## 架构概述

基于现有 React + TypeScript + Vite 架构，采用渐进式增强策略。

```
src/
├── components/
│   ├── Board.tsx              # 棋盘组件（增强动画）
│   ├── PlayerStats.tsx        # 玩家状态（增强 HP 仪表盘）
│   ├── ImpactDashboard.tsx    # 影响力仪表板
│   ├── TutorialModal.tsx      # 教程弹窗（交互式改进）
│   ├── CambodiaStats.tsx      # 柬埔寨数据
│   ├── AchievementPanel.tsx   # [新增] 成就面板
│   ├── GameStatsPanel.tsx     # [新增] 游戏统计面板
│   ├── DifficultySelect.tsx   # [新增] 难度选择
│   └── SettingsPanel.tsx      # [新增] 设置面板（音效开关等）
├── hooks/
│   ├── useGameLogic.ts        # 核心逻辑（扩展难度、成就）
│   ├── useAnimation.ts        # [新增] 动画管理 Hook
│   └── useAchievements.ts     # [新增] 成就系统 Hook
├── utils/
│   ├── randomEvents.ts        # 随机事件（新增 7 个事件）
│   ├── sound.ts               # 音效管理（完善）
│   ├── achievements.ts        # [新增] 成就定义和数据
│   └── statistics.ts          # [新增] 统计数据计算
├── locales/
│   └── zh-TW.ts               # 翻译文件（扩展新内容）
└── assets/
    └── sounds/                # [新增] 音效文件
```

## 技术栈

- **动画**: CSS Transitions + Keyframes + Framer Motion（轻量级）
- **状态管理**: 现有 React Hooks（不引入额外库）
- **音效**: HTML5 Audio API
- **响应式**: Tailwind CSS breakpoints + CSS Grid/Flexbox
- **数据存储**: localStorage（成就和统计）

## 关键技术实现

### 1. 玩家移动动画

```typescript
// useAnimation.ts
const animatePlayerMove = async (from: number, to: number, playerId: string) => {
  const steps = Math.abs(to - from);
  for (let i = 0; i < steps; i++) {
    await new Promise(resolve => setTimeout(resolve, 300));
    updatePlayerPosition(playerId, from + i + 1);
  }
};
```

### 2. 成就系统设计

```typescript
// achievements.ts
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (gameState: GameState) => boolean;
  unlocked: boolean;
}

export const checkAchievements = (state: GameState): Achievement[] => {
  return ACHIEVEMENTS.filter(ach => ach.condition(state) && !ach.unlocked);
};
```

### 3. 难度配置

```typescript
// useGameLogic.ts
export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

const DIFFICULTY_SETTINGS = {
  EASY: { initialHP: 120, hpLossNoToilet: 10, costMultiplier: 0.8 },
  NORMAL: { initialHP: 100, hpLossNoToilet: 15, costMultiplier: 1.0 },
  HARD: { initialHP: 80, hpLossNoToilet: 20, costMultiplier: 1.0 },
};
```

### 4. 响应式断点

```css
/* Tailwind 配置 */
sm: 640px   /* 手机横屏 */
md: 768px   /* 平板竖屏 */
lg: 1024px  /* 平板横屏 */
xl: 1280px  /* 笔记本 */
2xl: 1920px /* 桌面 */
```

## 数据库设计（CloudBase）

### 成就记录集合 `achievements`

```typescript
{
  _id: string,
  playerId: string,
  achievements: {
    id: string,
    unlockedAt: number
  }[],
  stats: {
    gamesPlayed: number,
    gamesWon: number,
   totalToiletsBuilt: number,
    bestScore: number
  },
  updatedAt: number
}
```

## 测试策略

1. **单元测试**: Jest + React Testing Library
   - 成就解锁逻辑测试
   - 难度设置测试
   - 统计数据计算测试

2. **E2E 测试**: Playwright
   - 完整游戏流程测试
   - 响应式布局测试
   - 动画性能测试

## 安全性

1. 所有客户端逻辑保持透明，无敏感数据
2. CloudBase 规则限制只能读写自己的存档
3. 成就系统防作弊（简单校验时间戳合理性）

## 性能优化

1. 使用 React.memo 优化组件重渲染
2. 动画使用 requestAnimationFrame
3. 音效预加载，避免延迟
4. 图片使用 WebP 格式，适当压缩

## 可访问性

1. 所有图标按钮添加 aria-label
2. 支持键盘导航（Tab 键切换）
3. 颜色对比度符合 WCAG AA 标准
4. 提供"减少动画"选项（针对晕动症用户）
