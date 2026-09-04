import { useState, useMemo } from 'react';
import { TIME_OPTIONS, getLunarMonths, getSolarDaysInMonth, getLunarDaysInMonth } from '@/lib/astro';
import type { BirthParams } from '@/lib/astro';

interface BirthInputProps {
  onCalculate: (params: BirthParams) => void;
}

const YEARS = Array.from({ length: 120 }, (_, i) => 1900 + i);
const SOLAR_MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function BirthInput({ onCalculate }: BirthInputProps) {
  const [gender, setGender] = useState<'男' | '女'>('男');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(6);
  const [day, setDay] = useState(15);
  const [timeIndex, setTimeIndex] = useState(6);
  const [isLeapMonth, setIsLeapMonth] = useState(false);

  const lunarMonths = useMemo(() => {
    if (calendarType !== 'lunar') return [];
    return getLunarMonths(year);
  }, [year, calendarType]);

  const hasLeapMonth = useMemo(() => {
    return lunarMonths.some((m) => m.isLeap && m.month === month);
  }, [lunarMonths, month]);

  const maxDay = useMemo(() => {
    if (calendarType === 'solar') {
      return getSolarDaysInMonth(year, month);
    }
    return getLunarDaysInMonth(year, month, isLeapMonth);
  }, [year, month, isLeapMonth, calendarType]);

  const effectiveDay = Math.min(day, maxDay);

  const handleCalculate = () => {
    onCalculate({
      gender,
      calendarType,
      year,
      month,
      day: effectiveDay,
      timeIndex,
      isLeapMonth,
    });
  };

  return (
    <div className="bg-white/[0.02] border border-white/15 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-white/80 to-white/20 rounded-full" />
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wider">生辰排盤</h2>
      </div>

      {/* Gender */}
      <div className="mb-5">
        <label className="block text-sm text-white/50 mb-2 tracking-wide">性別</label>
        <div className="flex gap-3">
          {(['男', '女'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`flex-1 py-2.5 rounded-lg border transition-all duration-300 text-sm tracking-wider ${
                gender === g
                  ? 'bg-white/10 border-white/50 text-white shadow-[0_0_12px_rgba(255,255,255,0.08)]'
                  : 'bg-transparent border-white/15 text-white/40 hover:border-white/30 hover:text-white/60'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Type */}
      <div className="mb-5">
        <label className="block text-sm text-white/50 mb-2 tracking-wide">曆法</label>
        <div className="flex gap-3">
          {(['solar', 'lunar'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCalendarType(c)}
              className={`flex-1 py-2.5 rounded-lg border transition-all duration-300 text-sm tracking-wider ${
                calendarType === c
                  ? 'bg-white/10 border-white/50 text-white shadow-[0_0_12px_rgba(255,255,255,0.08)]'
                  : 'bg-transparent border-white/15 text-white/40 hover:border-white/30 hover:text-white/60'
              }`}
            >
              {c === 'solar' ? '公曆' : '農曆'}
            </button>
          ))}
        </div>
      </div>

      {/* Year Month Day */}
      <div className="mb-5">
        <label className="block text-sm text-white/50 mb-2 tracking-wide">出生日期</label>
        <div className="grid grid-cols-3 gap-3">
          <SelectBox value={year} onChange={(v) => setYear(v)} options={YEARS.map((y) => ({ label: `${y}年`, value: y }))} />
          <SelectBox
            value={month}
            onChange={(v) => { setMonth(v); setIsLeapMonth(false); }}
            options={
              calendarType === 'solar'
                ? SOLAR_MONTHS.map((m) => ({ label: `${m}月`, value: m }))
                : lunarMonths.filter((m) => !m.isLeap).map((m) => ({ label: m.label, value: m.month }))
            }
          />
          <SelectBox
            value={effectiveDay}
            onChange={(v) => setDay(v)}
            options={Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => ({ label: `${d}日`, value: d }))}
          />
        </div>

        {/* Leap Month Toggle */}
        {calendarType === 'lunar' && hasLeapMonth && (
          <label className="flex items-center gap-2 mt-3 text-sm text-white/50 cursor-pointer">
            <button
              onClick={() => { setIsLeapMonth(!isLeapMonth); }}
              className={`w-10 h-5 rounded-full transition-all duration-300 relative ${isLeapMonth ? 'bg-white/30' : 'bg-white/10'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 ${isLeapMonth ? 'left-5' : 'left-0.5'}`} />
            </button>
            <span>閏月</span>
          </label>
        )}
      </div>

      {/* Time */}
      <div className="mb-6">
        <label className="block text-sm text-white/50 mb-2 tracking-wide">出生時辰</label>
        <SelectBox
          value={timeIndex}
          onChange={(v) => setTimeIndex(v)}
          options={TIME_OPTIONS.map((t) => ({ label: t.label, value: t.value }))}
          fullWidth
        />
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        className="w-full py-3.5 rounded-lg bg-white/10 border border-white/40 text-white font-bold tracking-[0.2em] text-base transition-all duration-500 hover:bg-white/15 hover:border-white/60 hover:shadow-[0_0_24px_rgba(255,255,255,0.12)] active:scale-[0.98]"
      >
        立即起盤推演
      </button>
    </div>
  );
}

interface SelectBoxProps {
  value: number;
  onChange: (v: number) => void;
  options: { label: string; value: number }[];
  fullWidth?: boolean;
}

function SelectBox({ value, onChange, options, fullWidth }: SelectBoxProps) {
  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full appearance-none bg-black border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white/80 tracking-wide cursor-pointer transition-all duration-300 hover:border-white/40 focus:border-white/60 focus:outline-none focus:shadow-[0_0_8px_rgba(255,255,255,0.08)]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-black text-white">
            {o.label}
          </option>
        ))}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs pointer-events-none">▾</span>
    </div>
  );
}
