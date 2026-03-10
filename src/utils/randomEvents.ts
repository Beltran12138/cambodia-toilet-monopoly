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
  | 'HEALTH_INSPECTION';

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
