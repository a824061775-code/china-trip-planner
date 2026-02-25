/**
 * Trip Data Templates
 * In a real-world application, this would be fetched from a backend API.
 * The structure is designed to be easily extensible.
 */

export interface Activity {
  time: string;
  location: string; // Keeping for backward compatibility
  description: string;
  priceRange: string;
  recommendation: string;
  
  // New fields
  name_en: string;
  name_zh: string;
  pinyin?: string;
  address_zh: string;
  address_en?: string;
  district_zh?: string;
  map_query: string;
  city_zh: string;
  metro_hint?: string;
}

export interface DayPlan {
  day: number;
  activities: Activity[];
}

export interface CityData {
  [interest: string]: DayPlan[];
}

export interface TripTemplates {
  [city: string]: CityData;
}

export const tripTemplates: TripTemplates = {
  Shanghai: {
    Food: [
      {
        day: 1,
        activities: [
          {
            time: "08:00 - 09:30",
            location: "Jia Jia Tang Bao",
            name_en: "Jia Jia Tang Bao",
            name_zh: "佳家汤包",
            pinyin: "Jiā Jiā Tāng Bāo",
            address_zh: "黄河路90号",
            address_en: "90 Huanghe Rd",
            district_zh: "黄浦区/人民广场",
            map_query: "佳家汤包 黄河路90号",
            city_zh: "上海",
            metro_hint: "地铁1/2/8号线 人民广场站",
            description: "Start your day with legendary Soup Dumplings (Xiaolongbao).",
            priceRange: "$",
            recommendation: "Try the crab meat and pork mix."
          },
          {
            time: "12:00 - 13:30",
            location: "Yu Garden Area",
            name_en: "Yu Garden Old Town",
            name_zh: "豫园老街",
            pinyin: "Yù Yuán Lǎo Jiē",
            address_zh: "安仁街218号",
            address_en: "218 Anren St",
            district_zh: "黄浦区/豫园",
            map_query: "豫园老街",
            city_zh: "上海",
            metro_hint: "地铁10/14号线 豫园站",
            description: "Traditional Shanghainese lunch featuring Braised Pork Belly.",
            priceRange: "$$",
            recommendation: "Look for 'Ben Bang Cai' restaurants."
          },
          {
            time: "18:00 - 20:00",
            location: "The Bund",
            name_en: "The Bund",
            name_zh: "外滩",
            pinyin: "Wài Tān",
            address_zh: "中山东一路",
            address_en: "Zhongshan East 1st Rd",
            district_zh: "黄浦区",
            map_query: "外滩",
            city_zh: "上海",
            metro_hint: "地铁2/10号线 南京东路站",
            description: "Dinner with a view of the futuristic Lujiazui skyline.",
            priceRange: "$$$",
            recommendation: "Book a window seat at Mr & Mrs Bund."
          }
        ]
      }
    ],
    Culture: [
      {
        day: 1,
        activities: [
          {
            time: "09:00 - 12:00",
            location: "Shanghai Museum",
            name_en: "Shanghai Museum",
            name_zh: "上海博物馆",
            pinyin: "Shànghǎi Bówùguǎn",
            address_zh: "人民大道201号",
            address_en: "201 Renmin Ave",
            district_zh: "黄浦区/人民广场",
            map_query: "上海博物馆",
            city_zh: "上海",
            metro_hint: "地铁1/2/8号线 人民广场站",
            description: "Explore ancient Chinese art, bronze, and ceramics.",
            priceRange: "Free",
            recommendation: "The bronze gallery is world-class."
          }
        ]
      }
    ]
  },
  Beijing: {
    Culture: [
      {
        day: 1,
        activities: [
          {
            time: "08:30 - 12:00",
            location: "Forbidden City",
            name_en: "Forbidden City",
            name_zh: "故宫博物院",
            pinyin: "Gùgōng Bówùyuàn",
            address_zh: "景山前街4号",
            address_en: "4 Jingshan Front St",
            district_zh: "东城区",
            map_query: "故宫博物院",
            city_zh: "北京",
            metro_hint: "地铁1号线 天安门东站",
            description: "The imperial palace of the Ming and Qing dynasties.",
            priceRange: "$$",
            recommendation: "Book tickets online at least 7 days in advance."
          }
        ]
      }
    ]
  },
  Chengdu: {
    Nature: [
      {
        day: 1,
        activities: [
          {
            time: "07:30 - 11:00",
            location: "Panda Base",
            name_en: "Chengdu Research Base of Giant Panda Breeding",
            name_zh: "成都大熊猫繁育研究基地",
            pinyin: "Chéngdū Dàxióngmāo Fányù Yánjiū Jīdì",
            address_zh: "熊猫大道1375号",
            address_en: "1375 Panda Ave",
            district_zh: "成华区",
            map_query: "成都大熊猫繁育研究基地",
            city_zh: "成都",
            metro_hint: "地铁3号线 熊猫大道站",
            description: "See giant pandas and red pandas in a naturalistic setting.",
            priceRange: "$$",
            recommendation: "Go early! Pandas are most active during morning feeding."
          }
        ]
      }
    ]
  }
};

// Default fallback for missing combinations
export const defaultActivities: Activity[] = [
  {
    time: "09:00 - 11:00",
    location: "Local Market",
    name_en: "Local Market",
    name_zh: "当地市场",
    pinyin: "Dāngdì Shìchǎng",
    address_zh: "市中心区域",
    map_query: "当地市场",
    city_zh: "城市",
    description: "Explore the local lifestyle and fresh produce.",
    priceRange: "$",
    recommendation: "Great for authentic photos."
  }
];
