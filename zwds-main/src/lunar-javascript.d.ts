declare module 'lunar-javascript' {
  export class Solar {
    static fromYmdHms(y: number, m: number, d: number, h: number, mi: number, s: number): Solar;
    static fromYmd(y: number, m: number, d: number): Solar;
    static fromDate(date: Date): Solar;
    getLunar(): Lunar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    toString(): string;
  }
  export class Lunar {
    static fromYmdHms(y: number, m: number, d: number, h: number, mi: number, s: number): Lunar;
    static fromYmd(y: number, m: number, d: number): Lunar;
    static fromDate(date: Date): Lunar;
    getSolar(): Solar;
    getEightChar(): EightChar;
    getYearInGanZhi(): string;
    getYearShengXiao(): string;
    getMonth(): number;
    getDay(): number;
    getTimeZhiIndex(): number;
    toString(): string;
  }
  export class EightChar {
    getYear(): string;
    getMonth(): string;
    getDay(): string;
    getTime(): string;
    getYearGan(): string;
    getYearZhi(): string;
    getMonthGan(): string;
    getMonthZhi(): string;
    getDayGan(): string;
    getDayZhi(): string;
    getTimeGan(): string;
    getTimeZhi(): string;
    getYearWuXing(): string;
    getMonthWuXing(): string;
    getDayWuXing(): string;
    getTimeWuXing(): string;
    getYearNaYin(): string;
    getMonthNaYin(): string;
    getDayNaYin(): string;
    getTimeNaYin(): string;
    getYearShiShenGan(): string;
    getMonthShiShenGan(): string;
    getTimeShiShenGan(): string;
    getYearShiShenZhi(): string[];
    getMonthShiShenZhi(): string[];
    getDayShiShenZhi(): string[];
    getTimeShiShenZhi(): string[];
  }
  export class LunarYear {
    static fromYear(y: number): LunarYear;
    getMonths(): LunarMonth[];
  }
  export class LunarMonth {
    getMonth(): number;
    isLeap(): boolean;
    getDayCount(): number;
    getYear(): number;
  }
  export const SolarUtil: {
    getDaysOfMonth(y: number, m: number): number;
  };
  export const LunarUtil: any;
}
