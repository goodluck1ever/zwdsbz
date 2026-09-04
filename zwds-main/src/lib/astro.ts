import { Solar, Lunar, LunarYear, SolarUtil } from 'lunar-javascript';
import { astro } from 'iztro';

export interface BirthParams {
  gender: '男' | '女';
  calendarType: 'solar' | 'lunar';
  year: number;
  month: number;
  day: number;
  timeIndex: number;
  isLeapMonth: boolean;
}

export interface PillarData {
  gan: string;
  zhi: string;
  wuxing: string;
  nayin: string;
  shishenGan: string;
  shishenZhi: string[];
}

export interface BaZiData {
  year: PillarData;
  month: PillarData;
  day: PillarData;
  time: PillarData;
  dayMaster: string;
  fiveElements: { 金: number; 木: number; 水: number; 火: number; 土: number };
  lunarDate: string;
  solarDate: string;
  zodiac: string;
}

export interface StarData {
  name: string;
  type: string;
  brightness?: string;
  mutagen?: string;
}

export interface PalaceData {
  index: number;
  name: string;
  isBodyPalace: boolean;
  isOriginalPalace: boolean;
  heavenlyStem: string;
  earthlyBranch: string;
  majorStars: StarData[];
  minorStars: StarData[];
  adjectiveStars: StarData[];
  changsheng12: string;
  boshi12: string;
  decadal: { range: [number, number]; heavenlyStem: string; earthlyBranch: string };
  ages: number[];
}

export interface ZiWeiData {
  gender: string;
  solarDate: string;
  lunarDate: string;
  chineseDate: string;
  time: string;
  timeRange: string;
  sign: string;
  zodiac: string;
  soul: string;
  body: string;
  fiveElementsClass: string;
  earthlyBranchOfSoulPalace: string;
  earthlyBranchOfBodyPalace: string;
  palaces: PalaceData[];
}

export const TIME_OPTIONS = [
  { label: '子時 (23:00-01:00)', value: 0 },
  { label: '丑時 (01:00-03:00)', value: 1 },
  { label: '寅時 (03:00-05:00)', value: 2 },
  { label: '卯時 (05:00-07:00)', value: 3 },
  { label: '辰時 (07:00-09:00)', value: 4 },
  { label: '巳時 (09:00-11:00)', value: 5 },
  { label: '午時 (11:00-13:00)', value: 6 },
  { label: '未時 (13:00-15:00)', value: 7 },
  { label: '申時 (15:00-17:00)', value: 8 },
  { label: '酉時 (17:00-19:00)', value: 9 },
  { label: '戌時 (19:00-21:00)', value: 10 },
  { label: '亥時 (21:00-23:00)', value: 11 },
  { label: '晚子時 (23:00-00:00)', value: 12 },
];

const STEM_ELEMENTS: Record<string, '金' | '木' | '水' | '火' | '土'> = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土',
  己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
};

const BRANCH_ELEMENTS: Record<string, '金' | '木' | '水' | '火' | '土'> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
  午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
};

function timeIndexToHour(timeIndex: number): number {
  return timeIndex === 12 ? 23 : timeIndex * 2;
}

export function calculateBaZi(params: BirthParams): BaZiData {
  const hour = timeIndexToHour(params.timeIndex);
  let lunar: any;

  if (params.calendarType === 'solar') {
    const solar = Solar.fromYmdHms(params.year, params.month, params.day, hour, 0, 0);
    lunar = solar.getLunar();
  } else {
    const month = params.isLeapMonth ? -params.month : params.month;
    lunar = Lunar.fromYmdHms(params.year, month, params.day, hour, 0, 0);
  }

  const ec = lunar.getEightChar();

  const makePillar = (prefix: 'Year' | 'Month' | 'Day' | 'Time'): PillarData => ({
    gan: ec[`get${prefix}Gan`](),
    zhi: ec[`get${prefix}Zhi`](),
    wuxing: ec[`get${prefix}WuXing`](),
    nayin: ec[`get${prefix}NaYin`](),
    shishenGan: ec[`get${prefix}ShiShenGan`](),
    shishenZhi: ec[`get${prefix}ShiShenZhi`](),
  });

  const yearP = makePillar('Year');
  const monthP = makePillar('Month');
  const dayP = makePillar('Day');
  const timeP = makePillar('Time');

  const fiveElements = { 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };
  [yearP, monthP, dayP, timeP].forEach((p) => {
    fiveElements[STEM_ELEMENTS[p.gan]]++;
    fiveElements[BRANCH_ELEMENTS[p.zhi]]++;
  });

  return {
    year: yearP,
    month: monthP,
    day: dayP,
    time: timeP,
    dayMaster: dayP.gan,
    fiveElements,
    lunarDate: lunar.toString(),
    solarDate: lunar.getSolar().toString(),
    zodiac: lunar.getYearShengXiao(),
  };
}

export function calculateZiWei(params: BirthParams): ZiWeiData {
  const gender = params.gender;
  let result: any;

  if (params.calendarType === 'solar') {
    result = astro.bySolar(
      `${params.year}-${params.month}-${params.day}`,
      params.timeIndex,
      gender
    );
  } else {
    result = astro.byLunar(
      `${params.year}-${params.month}-${params.day}`,
      params.timeIndex,
      gender,
      params.isLeapMonth
    );
  }

  return {
    gender: result.gender,
    solarDate: result.solarDate,
    lunarDate: result.lunarDate,
    chineseDate: result.chineseDate,
    time: result.time,
    timeRange: result.timeRange,
    sign: result.sign,
    zodiac: result.zodiac,
    soul: result.soul,
    body: result.body,
    fiveElementsClass: result.fiveElementsClass,
    earthlyBranchOfSoulPalace: result.earthlyBranchOfSoulPalace,
    earthlyBranchOfBodyPalace: result.earthlyBranchOfBodyPalace,
    palaces: result.palaces.map((p: any) => ({
      index: p.index,
      name: p.name,
      isBodyPalace: p.isBodyPalace,
      isOriginalPalace: p.isOriginalPalace,
      heavenlyStem: p.heavenlyStem,
      earthlyBranch: p.earthlyBranch,
      majorStars: p.majorStars.map((s: any) => ({
        name: s.name,
        type: s.type,
        brightness: s.brightness || undefined,
        mutagen: s.mutagen || undefined,
      })),
      minorStars: p.minorStars.map((s: any) => ({
        name: s.name,
        type: s.type,
        brightness: s.brightness || undefined,
        mutagen: s.mutagen || undefined,
      })),
      adjectiveStars: p.adjectiveStars.map((s: any) => ({
        name: s.name,
        type: s.type,
      })),
      changsheng12: p.changsheng12,
      boshi12: p.boshi12,
      decadal: p.decadal,
      ages: p.ages,
    })),
  };
}

export function getLunarMonths(year: number): { month: number; isLeap: boolean; days: number; label: string }[] {
  const lunarYear = LunarYear.fromYear(year);
  const months = lunarYear.getMonths();
  const result: { month: number; isLeap: boolean; days: number; label: string }[] = [];
  for (const m of months) {
    const mMonth = m.getMonth();
    const isLeap = m.isLeap();
    if (mMonth > 0 && mMonth <= 12) {
      result.push({
        month: Math.abs(mMonth),
        isLeap,
        days: m.getDayCount(),
        label: isLeap ? `閏${monthToChinese(Math.abs(mMonth))}月` : `${monthToChinese(Math.abs(mMonth))}月`,
      });
    }
  }
  return result;
}

function monthToChinese(m: number): string {
  const names = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  return names[m - 1] || String(m);
}

export function getSolarDaysInMonth(year: number, month: number): number {
  return SolarUtil.getDaysOfMonth(year, month);
}

export function getLunarDaysInMonth(year: number, month: number, isLeap: boolean): number {
  const months = getLunarMonths(year);
  const found = months.find((m) => m.month === month && m.isLeap === isLeap);
  return found ? found.days : 30;
}

export const ZIWEI_GRID_LAYOUT: number[][] = [
  [3, 4, 5, 6],
  [2, -1, -1, 7],
  [1, -1, -1, 8],
  [0, 11, 10, 9],
];

export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export const FIVE_ELEMENTS_COLORS: Record<string, string> = {
  金: '#D4AF37',
  木: '#4A9D5B',
  水: '#4A7BA8',
  火: '#C85A4A',
  土: '#A8845A',
};

export const FIVE_ELEMENTS_LABELS: Record<string, string> = {
  金: '金',
  木: '木',
  水: '水',
  火: '火',
  土: '土',
};
