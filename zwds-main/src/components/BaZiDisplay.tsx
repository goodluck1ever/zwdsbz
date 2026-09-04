import type { BaZiData } from '@/lib/astro';
import { FIVE_ELEMENTS_COLORS } from '@/lib/astro';

interface BaZiDisplayProps {
  data: BaZiData;
}

export default function BaZiDisplay({ data }: BaZiDisplayProps) {
  const pillars = [
    { label: '年柱', data: data.year, desc: '祖上根基' },
    { label: '月柱', data: data.month, desc: '父母兄弟' },
    { label: '日柱', data: data.day, desc: '自身配偶', isDayMaster: true },
    { label: '時柱', data: data.time, desc: '子女晚運' },
  ];

  const total = Object.values(data.fiveElements).reduce((a, b) => a + b, 0);
  const elements = (['金', '木', '水', '火', '土'] as const).map((e) => ({
    name: e,
    count: data.fiveElements[e],
    percent: total > 0 ? (data.fiveElements[e] / total) * 100 : 0,
  }));

  return (
    <div className="bg-white/[0.02] border border-white/15 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-white/80 to-white/20 rounded-full" />
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wider">八字四柱</h2>
      </div>

      {/* Date Info */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <InfoTag label="公曆" value={data.solarDate} />
        <InfoTag label="農曆" value={data.lunarDate} />
        <InfoTag label="生肖" value={data.zodiac} />
      </div>

      {/* Four Pillars */}
      <div className="grid grid-cols-4 gap-2 md:gap-4 mb-8">
        {pillars.map((p) => (
          <div
            key={p.label}
            className={`relative rounded-xl border p-3 md:p-4 text-center transition-all duration-500 ${
              p.isDayMaster
                ? 'border-white/40 bg-white/[0.05] shadow-[0_0_12px_rgba(255,255,255,0.06)]'
                : 'border-white/15 bg-white/[0.01]'
            }`}
          >
            {p.isDayMaster && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-white text-black text-[10px] font-bold rounded tracking-wider">
                日主
              </div>
            )}
            <div className="text-white/50 text-xs md:text-sm tracking-wider mb-2">{p.label}</div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/[0.05] border border-white/15 flex items-center justify-center text-lg md:text-xl font-bold text-white">
                {p.data.gan}
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/[0.05] border border-white/15 flex items-center justify-center text-lg md:text-xl font-bold text-white/70">
                {p.data.zhi}
              </div>
            </div>
            <div className="text-white/30 text-[10px] md:text-xs mt-2 tracking-wide">{p.data.wuxing}</div>
            <div className="text-white/20 text-[10px] mt-0.5">{p.data.nayin}</div>
            <div className="text-white/20 text-[10px] mt-1">{p.desc}</div>
          </div>
        ))}
      </div>

      {/* Five Elements Distribution */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-base text-white/70 tracking-wider">五行能量分佈</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
        </div>

        <div className="space-y-3">
          {elements.map((el) => (
            <div key={el.name} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{
                  backgroundColor: `${FIVE_ELEMENTS_COLORS[el.name]}15`,
                  border: `1px solid ${FIVE_ELEMENTS_COLORS[el.name]}40`,
                  color: FIVE_ELEMENTS_COLORS[el.name],
                }}
              >
                {el.name}
              </div>
              <div className="flex-1 h-3 bg-white/[0.03] rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${Math.max(el.percent, 4)}%`,
                    backgroundColor: FIVE_ELEMENTS_COLORS[el.name],
                    boxShadow: `0 0 8px ${FIVE_ELEMENTS_COLORS[el.name]}60`,
                  }}
                />
              </div>
              <div className="text-xs text-white/50 w-16 text-right tabular-nums">
                {el.count} ({el.percent.toFixed(0)}%)
              </div>
            </div>
          ))}
        </div>

        {/* Day Master & Ten Gods */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <MiniInfo label="日主" value={data.dayMaster} />
          <MiniInfo label="年柱十神" value={`${data.year.shishenGan}`} />
          <MiniInfo label="月柱十神" value={`${data.month.shishenGan}`} />
          <MiniInfo label="時柱十神" value={`${data.time.shishenGan}`} />
        </div>
      </div>
    </div>
  );
}

function InfoTag({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-white/30">{label}</span>
      <span className="text-white/60">{value}</span>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.01] px-3 py-2">
      <div className="text-white/30 text-[10px] tracking-wide mb-0.5">{label}</div>
      <div className="text-white/60 text-sm">{value}</div>
    </div>
  );
}
