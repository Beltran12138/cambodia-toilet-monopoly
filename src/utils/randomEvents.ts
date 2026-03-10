import { zhTW } from '../locales/zh-TW';

export type EventType = 
  | 'OVERSEAS_DONATION_SMALL'
  | 'OVERSEAS_DONATION_LARGE'
  | 'NIGHT_ACCIDENT'
  | 'GOVERNMENT_SUBSIDY'
  | 'VOLUNTEER_HELP'
  | 'DISEASE_OUTBREAK'
  | 'CLEAN_WATER_PROJECT'
  | 'TOILET_MAINTENANCE'
  | 'COMMUNITY_EDUCATION'
  | 'INTERNATIONAL_AID'
  | 'LOCAL_CRAFTSMAN'
  | 'MONSOON_DAMAGE'
  | 'HEALTH_INSPECTION'
  // 新增事件
  | 'NGO_PARTNERSHIP'
  | 'SOLAR_POWER_INSTALL'
  | 'WATER_FILTER_DONATION'
  | 'HYGIENE_WORKSHOP'
  | 'ROAD_CONSTRUCTION'
  | 'MOBILE_CLINIC'
  | 'YOUTH_AMBASSADORS';

export interface RandomEvent {
  id: EventType;
  title: string;
  description: string;
  icon: string;
  color: string;
  effect: (gameState: any) => {
    message: string;
    updates: any;
  };
}

const t = zhTW.events;
const chanceCards = zhTW.chanceCards;

export const randomEvents: RandomEvent[] = [
  {
   id: 'OVERSEAS_DONATION_SMALL',
  title: chanceCards.overseasDonation,
   description: chanceCards.overseasDonationDesc,
    icon: 'fa-hand-holding-dollar',
  color: 'text-green-400',
    effect: () => ({
      message: t.overseasDonation,
      updates: { fundsChange: 200 },
    }),
  },
  {
   id: 'OVERSEAS_DONATION_LARGE',
  title: chanceCards.overseasDonation,
   description: chanceCards.overseasDonationDesc,
    icon: 'fa-hand-holding-dollar',
  color: 'text-green-300',
    effect: () => ({
      message: t.overseasDonationLarge,
      updates: { fundsChange: 500 },
    }),
  },
  {
   id: 'NIGHT_ACCIDENT',
  title: chanceCards.nightAccident,
   description: chanceCards.nightAccidentDesc,
    icon: 'fa-triangle-exclamation',
  color: 'text-[var(--danger-red)]',
    effect: () => ({
      message: t.nightAccident,
      updates: { hpChange: -10, fundsChange: -150 },
    }),
  },
  {
   id: 'GOVERNMENT_SUBSIDY',
  title: chanceCards.governmentSubsidy,
   description: chanceCards.governmentSubsidyDesc,
    icon: 'fa-building-columns',
  color: 'text-blue-400',
    effect: () => ({
      message: t.governmentSubsidy,
      updates: { fundsChange: 100 },
    }),
  },
  {
   id: 'VOLUNTEER_HELP',
  title: chanceCards.volunteerHelp,
   description: chanceCards.volunteerHelpDesc,
    icon: 'fa-hands-helping',
  color: 'text-yellow-400',
    effect: () => ({
      message: t.volunteerHelp,
      updates: { freeToilet: true },
    }),
  },
  {
   id: 'DISEASE_OUTBREAK',
  title: chanceCards.diseaseOutbreak,
   description: chanceCards.diseaseOutbreakDesc,
    icon: 'fa-virus',
  color: 'text-purple-400',
    effect: () => ({
      message: t.diseaseOutbreak,
      updates: { hpChange: -20 },
    }),
  },
  {
   id: 'CLEAN_WATER_PROJECT',
  title: chanceCards.cleanWaterProject,
   description: chanceCards.cleanWaterProjectDesc,
    icon: 'fa-faucet-drip',
  color: 'text-[var(--vital-blue)]',
    effect: () => ({
      message: t.cleanWaterProject,
      updates: { hpChange: 10 },
    }),
  },
  {
   id: 'TOILET_MAINTENANCE',
  title: chanceCards.toiletMaintenance,
   description: chanceCards.toiletMaintenanceDesc,
    icon: 'fa-screwdriver-wrench',
  color: 'text-orange-400',
    effect: () => ({
      message: t.toiletMaintenance,
      updates: { fundsChange: -80 },
    }),
  },
  {
   id: 'COMMUNITY_EDUCATION',
  title: chanceCards.communityEducation,
   description: chanceCards.communityEducationDesc,
    icon: 'fa-chalkboard-user',
  color: 'text-pink-400',
    effect: () => ({
      message: t.communityEducation,
      updates: { hpChange: 8 },
    }),
  },
  {
   id: 'INTERNATIONAL_AID',
  title: chanceCards.internationalAid,
   description: chanceCards.internationalAidDesc,
    icon: 'fa-globe',
  color: 'text-cyan-400',
    effect: () => ({
      message: t.internationalAid,
      updates: { fundsChange: 150 },
    }),
  },
  {
   id: 'LOCAL_CRAFTSMAN',
  title: chanceCards.localCraftsman,
   description: chanceCards.localCraftsmanDesc,
    icon: 'fa-hammer',
  color: 'text-amber-600',
    effect: () => ({
      message: t.localCraftsman,
      updates: { discountRate: 0.8 },
    }),
  },
  {
   id: 'MONSOON_DAMAGE',
  title: chanceCards.monsoonDamage,
   description: chanceCards.monsoonDamageDesc,
    icon: 'fa-cloud-showers-heavy',
  color: 'text-gray-400',
    effect: (gameState) => {
      // 摧毀一個隨機廁所
    const villagesWithToilets = gameState.tiles
        .filter((t: any) => t.type === 'VILLAGE' && t.toiletType !== 'NONE')
        .map((t: any) => t.id);
      
      let destroyedTile = -1;
     if (villagesWithToilets.length > 0) {
       destroyedTile = villagesWithToilets[Math.floor(Math.random() * villagesWithToilets.length)];
      }
      
      return {
        message: t.monsoonDamage + (destroyedTile >= 0 ? ` (村莊 ${destroyedTile})` : ''),
        updates: { destroyToiletTile: destroyedTile },
      };
    },
  },
  {
   id: 'HEALTH_INSPECTION',
  title: chanceCards.healthInspection,
   description: chanceCards.healthInspectionDesc,
    icon: 'fa-clipboard-check',
  color: 'text-emerald-400',
    effect: () => ({
      message: t.healthInspection,
      updates: { fundsChange: 120 },
    }),
  },
  
  // ========== 新增 7 个随机事件 ==========
  
  {
   id: 'NGO_PARTNERSHIP',
  title: '非政府組織合作',
   description: '当地 NGO 寻求合作，共同推动卫生项目',
    icon: 'fa-handshake',
  color: 'text-indigo-400',
    effect: () => ({
      message: '與 NGO 建立合作夥伴關係！獲得資金支持 $250，村民 HP +12',
      updates: { fundsChange: 250, hpChange: 12 },
    }),
  },
  {
   id: 'SOLAR_POWER_INSTALL',
  title: '太陽能照明安裝',
   description: '为厕所安装太阳能照明系统，提升夜间安全性',
    icon: 'fa-solar-panel',
  color: 'text-yellow-300',
    effect: () => ({
      message: '太陽能照明系統安裝完成！村民夜間如廁更安全，HP +18',
      updates: { hpChange: 18 },
    }),
  },
  {
   id: 'WATER_FILTER_DONATION',
  title: '淨水器捐贈',
   description: '慈善机构捐赠净水器，改善水质',
    icon: 'fa-filter',
  color: 'text-blue-300',
    effect: () => ({
      message: '收到淨水器捐贈！水質改善，村民 HP +15',
      updates: { hpChange: 15 },
    }),
  },
  {
   id: 'HYGIENE_WORKSHOP',
  title: '衛生教育工作坊',
   description: '举办卫生知识讲座，提升社区健康意识',
    icon: 'fa-chalkboard-teacher',
  color: 'text-teal-400',
    effect: () => ({
      message: '衛生教育工作坊成功舉辦！社區健康意識提升，村民 HP +10，獲得資金 $80',
      updates: { hpChange: 10, fundsChange: 80 },
    }),
  },
  {
   id: 'ROAD_CONSTRUCTION',
  title: '道路建設項目',
   description: '政府修建通往村庄的道路，降低运输成本',
    icon: 'fa-road',
  color: 'text-stone-400',
    effect: () => ({
      message: '道路建設完成！運輸成本降低，下次建造享受 7 折優惠',
      updates: { discountRate: 0.7 },
    }),
  },
  {
   id: 'MOBILE_CLINIC',
  title: '流動醫療隊',
   description: '流动医疗队进村提供免费诊疗服务',
    icon: 'fa-truck-medical',
  color: 'text-red-400',
    effect: () => ({
      message: '流動醫療隊提供免費診療！村民健康狀況大幅改善，HP +25',
      updates: { hpChange: 25 },
    }),
  },
  {
   id: 'YOUTH_AMBASSADORS',
  title: '青年大使計劃',
  description: '青年志愿者成为卫生大使，推广厕所使用',
    icon: 'fa-users-rays',
  color: 'text-violet-400',
    effect: (gameState) => {
      // 随机免费建造一个厕所
    const villagesWithoutToilets = gameState.tiles
        .filter((t: any) => t.type === 'VILLAGE' && t.toiletType === 'NONE')
        .map((t: any) => t.id);
      
      let builtTile = -1;
     if (villagesWithoutToilets.length > 0) {
        builtTile = villagesWithoutToilets[Math.floor(Math.random() * villagesWithoutToilets.length)];
      }
      
      return {
        message: builtTile >= 0 
          ? `青年大使協助建造廁所！在村莊 ${builtTile} 免費建造一座小廁所`
          : '所有村莊已有廁所，青年大使提供資金支持 $100',
        updates: { 
          freeToilet: builtTile >= 0,
          fundsChange: builtTile < 0 ? 100 : 0,
          buildFreeToiletAt: builtTile
        },
      };
    },
  },
];

// 根據權重隨機選擇事件
export const getRandomEvent = (): RandomEvent => {
  const weights = [
   25, // OVERSEAS_DONATION_SMALL
    10, // OVERSEAS_DONATION_LARGE
    15, // NIGHT_ACCIDENT
    20, // GOVERNMENT_SUBSIDY
    15, // VOLUNTEER_HELP
    10, // DISEASE_OUTBREAK
    20, // CLEAN_WATER_PROJECT
    15, // TOILET_MAINTENANCE
    20, // COMMUNITY_EDUCATION
    15, // INTERNATIONAL_AID
    15, // LOCAL_CRAFTSMAN
    10, // MONSOON_DAMAGE
   20, // HEALTH_INSPECTION
    // 新增事件权重
    18, // NGO_PARTNERSHIP
    12, // SOLAR_POWER_INSTALL
    15, // WATER_FILTER_DONATION
    18, // HYGIENE_WORKSHOP
    10, // ROAD_CONSTRUCTION
    12, // MOBILE_CLINIC
    15, // YOUTH_AMBASSADORS
  ];

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < randomEvents.length; i++) {
    random -= weights[i];
   if (random <= 0) {
      return randomEvents[i];
    }
  }
  
  return randomEvents[0];
};
