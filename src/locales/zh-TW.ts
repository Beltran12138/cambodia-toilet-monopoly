// 繁體中文翻譯文件
export const zhTW = {
  // 遊戲標題
  title: 'THE WAY',
  subtitle: '柬埔寨廁所大富翁挑戰賽',
  
  // 遊戲狀態
  gameStatus: {
   playing: '遊戲進行中',
    won: '任務成功',
    lost: '任務失敗',
  },
  
  // 玩家角色
  roles: {
    VILLAGER: '柬埔寨村民',
    DONOR_1: '捐贈者一號',
    DONOR_2: '捐贈者二號',
    DONOR_3: '捐贈者三號',
  },
  
  // 地圖格子類型
  tileTypes: {
    START: '起點',
    PRISON: '監獄',
    CHANCE: '機會',
    VILLAGE: '村莊',
  },
  
  // 廁所類型
  toiletTypes: {
    NONE: '無廁所',
    SMALL: '小型廁所',
    LARGE: '大型廁所',
  },
  
  // 遊戲控制
  controls: {
    rollDice: '擲骰子',
    buildToilet: '建造廁所',
    endTurn: '結束回合',
    alreadyRolled: '已投擲',
   currentTurn: '當前回合',
    diceResult: '骰子結果',
   constructionOptions: '建造選項',
    initializeNewMission: '開始新任務',
    saveGame: '保存遊戲',
  },
  
  // 事件相關
  eventContinue: '繼續',
  logTitle: '任務日誌_',
  
  // 統計資訊
  stats: {
    vitalityHP: '生命力 HP',
    lapsCompleted: '已完成圈數',
    funds: '資金',
    inPrison: '入獄中',
    recovery: '恢復',
    active: '當前',
    critical: '危急衛生條件！',
  },
  
  // 事件訊息
  events: {
    gameStarted: '遊戲開始！村民先手。',
    villagerLap: '村民完成一圈！因惡劣環境 HP -10。',
    noToilet: '村民在{name}沒有廁所！HP -15。',
    smallToilet: '村民在{name}有小型廁所。HP +5。',
    largeToilet: '村民在{name}有大型廁所。HP +15。',
    donorPrison: '捐贈者{role}進入監獄！',
    overseasDonation: '收到海外捐助！資金 +200。',
   constructionCostIncrease: '建築成本增加！資金 -100。',
    prisonEscape: '玩家{role}擲出雙{num}逃離監獄！',
    prisonFine: '玩家{role}在三回合後支付罰金獲釋！',
    stillInPrison: '玩家{role}仍在監獄中。擲出雙數逃離。',
    builtToilet: '在{name}建造了{type}廁所！',
    insufficientFunds: '資金不足！',
    victory: '勝利！村莊現在衛生了。',
    gameOver: '村民 HP 歸零，遊戲結束。',
    
    // 新增隨機事件
    overseasDonationLarge: '獲得海外慈善基金會大額捐助！資金 +500。',
    nightAccident: '夜晚如廁遇險！村民 HP -10，捐贈者資金 -150（醫療費用）。',
    governmentSubsidy: '獲得政府衛生補貼！所有捐贈者資金 +100。',
    volunteerHelp: '志願者協助建設！免費建造一個小型廁所。',
    diseaseOutbreak: '疾病爆發！村民 HP -20，需要更多廁所預防。',
    cleanWaterProject: '潔淨水專案啟動！村民 HP +10。',
   toiletMaintenance: '廁所需維護！捐贈者資金 -80。',
   communityEducation: '社區衛生教育成功！村民 HP +8。',
    internationalAid: '國際援助到達！所有捐贈者資金 +150。',
    localCraftsman: '當地工匠加入！建造成本降低 20%。',
    monsoonDamage: '季風破壞！一個廁所被毀壞。',
    healthInspection: '衛生檢查通過！獎勵資金 +120。',
  },
  
  // 勝利/失敗訊息
  endGame: {
    victory: '你透過衛生設施拯救了生命！',
    defeat: '村民因衛生條件惡劣而無法生存。',
  },
  
  // 教程
  tutorial: {
   title: '遊戲說明',
    welcome: '歡迎來到 THE WAY：柬埔寨廁所大富翁挑戰賽',
    objective: '遊戲目標',
    objectiveDesc: '幫助柬埔寨村民在走完 5 圈的過程中保持存活（HP > 0），或累積到 150 HP 以獲勝。',
    roles: '玩家角色',
    rolesDesc: '遊戲中有 4 位玩家：1 位村民和 3 位捐贈者，輪流進行遊戲。',
    villagerRole: '村民',
    villagerDesc: '起始 HP 為 100。經過沒有廁所的村莊會損失 HP，使用廁所可恢復 HP。',
    donorRole: '捐贈者',
    donorDesc: '每位捐贈者起始資金為 $1000。經過村莊時可以建造廁所來幫助村民。',
    howToPlay: '如何遊玩',
    steps: [
      '點擊「擲骰子」按鈕移動當前玩家',
      '村民經過無廁所村莊時 HP -15',
      '捐贈者在村莊格時可以建造廁所',
      '小型廁所 ($200): 村民 HP +5',
      '大型廁所 ($500): 村民 HP +15',
      '村民完成 5 圈或 HP 達到 150 即獲勝',
      '村民 HP 歸零則遊戲失敗',
    ],
   tips: '提示',
   tipsDesc: '合理分配資金建造廁所，關注村民的 HP 狀態，在關鍵位置建造大型廁所可以更快恢復 HP。',
    startGame: '開始遊戲',
    close: '關閉',
  },
  
  // 影響力儀表板
  impact: {
   title: '影響力儀表板',
    livesSaved: '拯救生命數',
   toiletsBuilt: '已建廁所數',
    villagesServed: '服務村莊數',
    hygieneScore: '衛生評分',
   totalInvestment: '總投資金額',
    impactLevel: '影響力等級',
    beginner: '初學者',
    helper: '協助者',
    champion: '捍衛者',
    hero: '英雄',
    legend: '傳奇',
  },
  
  // 機會卡片
  chanceCards: {
    overseasDonation: '海外捐助',
    overseasDonationDesc: '你收到了來自海外的慈善捐助！',
    nightAccident: '夜晚如廁遇險',
    nightAccidentDesc: '村民在夜晚使用簡陋廁所時發生意外...',
    governmentSubsidy: '政府補貼',
    governmentSubsidyDesc: '政府提供了衛生設施補貼！',
    volunteerHelp: '志願者協助',
    volunteerHelpDesc: '一群志願者主動幫忙建設廁所！',
    diseaseOutbreak: '疾病爆發',
    diseaseOutbreakDesc: '由於缺乏衛生設施，村莊爆發疾病...',
    cleanWaterProject: '潔淨水專案',
    cleanWaterProjectDesc: '新的潔淨水專案啟動了！',
   toiletMaintenance: '廁所維護',
   toiletMaintenanceDesc: '廁所需要定期維護...',
   communityEducation: '社區教育',
   communityEducationDesc: '衛生教育課程取得成功！',
    internationalAid: '國際援助',
    internationalAidDesc: '國際組織提供了援助資金！',
    localCraftsman: '當地工匠',
    localCraftsmanDesc: '當地工匠以優惠價格協助建設！',
    monsoonDamage: '季風破壞',
    monsoonDamageDesc: '季風摧毀了一個廁所...',
    healthInspection: '衛生檢查',
    healthInspectionDesc: '衛生檢查獲得優秀評價！',
  },
};

export type LocaleType = typeof zhTW;
