import type { ZiWeiData, PalaceData } from '@/lib/astro';
import { ZIWEI_GRID_LAYOUT } from '@/lib/astro';

interface ZiWeiChartProps {
  data: ZiWeiData;
  selectedPalaceIndex: number;
  onSelectPalace: (index: number) => void;
}

export default function ZiWeiChart({ data, selectedPalaceIndex, onSelectPalace }: ZiWeiChartProps) {
  const palaceMap = new Map<number, PalaceData>();
  data.palaces.forEach((p) => palaceMap.set(p.index, p));

  return (
    <div className="bg-white/[0.02] border border-white/15 rounded-2xl p-4 md:p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-8 bg-gradient-to-b from-white/80 to-white/20 rounded-full" />
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wider">紫微斗數命盤</h2>
      </div>

      {/* Chart Info Bar */}
      <div className="flex flex-wrap gap-x-5 gap-y-1 mb-4 text-xs md:text-sm">
        <InfoItem label="五行局" value={data.fiveElementsClass} highlight />
        <InfoItem label="命主" value={data.soul} />
        <InfoItem label="身主" value={data.body} />
        <InfoItem label="命宮" value={data.earthlyBranchOfSoulPalace + '宮'} />
        <InfoItem label="身宮" value={data.earthlyBranchOfBodyPalace + '宮'} />
      </div>

      {/* 4x4 Grid */}
      <div className="grid grid-cols-4 gap-1 md:gap-1.5 aspect-square max-w-[640px] mx-auto">
        {ZIWEI_GRID_LAYOUT.map((row, rowIdx) =>
          row.map((palaceIdx, colIdx) => {
            if (palaceIdx === -1) {
              return <div key={`${rowIdx}-${colIdx}`} className="flex items-center justify-center" />;
            }
            const palace = palaceMap.get(palaceIdx);
            if (!palace) return <div key={`${rowIdx}-${colIdx}`} />;

            const isSelected = palaceIdx === selectedPalaceIndex;
            const isSoul = palace.name === '命宮';
            const isBody = palace.isBodyPalace;

            return (
              <PalaceCell
                key={`${rowIdx}-${colIdx}`}
                palace={palace}
                isSelected={isSelected}
                isSoul={isSoul}
                isBody={isBody}
                onClick={() => onSelectPalace(palaceIdx)}
              />
            );
          })
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-[10px] md:text-xs text-white/30">
        <LegendDot color="white" label="主星" />
        <LegendDot color="white/60" label="輔星" />
        <LegendDot color="white/30" label="雜耀" />
        <span className="text-white/20">│</span>
        <span>化祿 <span className="text-green-400/70">祿</span></span>
        <span>化權 <span className="text-orange-400/70">權</span></span>
        <span>化科 <span className="text-blue-400/70">科</span></span>
        <span>化忌 <span className="text-red-400/70">忌</span></span>
      </div>
    </div>
  );
}

function PalaceCell({
  palace,
  isSelected,
  isSoul,
  isBody,
  onClick,
}: {
  palace: PalaceData;
  isSelected: boolean;
  isSoul: boolean;
  isBody: boolean;
  onClick: () => void;
}) {
  const mutagenColor = (m?: string) => {
    if (m === '祿') return 'text-green-400/80';
    if (m === '權') return 'text-orange-400/80';
    if (m === '科') return 'text-blue-400/80';
    if (m === '忌') return 'text-red-400/80';
    return '';
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-lg border p-1.5 md:p-2 cursor-pointer transition-all duration-300 overflow-hidden ${
        isSelected
          ? 'border-white/60 bg-white/[0.06] shadow-[0_0_16px_rgba(255,255,255,0.1)] z-10'
          : isSoul
          ? 'border-white/30 bg-white/[0.03] hover:border-white/50'
          : 'border-white/10 bg-white/[0.005] hover:border-white/25 hover:bg-white/[0.02]'
      }`}
    >
      {/* Palace Name & Branch */}
      <div className="flex items-center justify-between mb-1">
        <span className={`text-[10px] md:text-xs font-bold tracking-wider ${isSoul ? 'text-white' : 'text-white/60'}`}>
          {palace.name}
        </span>
        <span className="text-[9px] md:text-[10px] text-white/25">{palace.earthlyBranch}</span>
      </div>

      {/* Body Palace Marker */}
      {isBody && (
        <span className="absolute top-1 right-1 text-[8px] text-white/40">身</span>
      )}

      {/* Major Stars */}
      <div className="space-y-0.5">
        {palace.majorStars.length > 0 ? (
          palace.majorStars.map((s, i) => (
            <div key={i} className="flex items-center gap-0.5 flex-wrap">
              <span className="text-[10px] md:text-xs text-white/80 font-medium leading-tight">
                {s.name}
              </span>
              {s.brightness && (
                <span className="text-[8px] md:text-[9px] text-white/25 leading-tight">{s.brightness}</span>
              )}
              {s.mutagen && (
                <span className={`text-[8px] md:text-[9px] font-bold ${mutagenColor(s.mutagen)}`}>
                  {s.mutagen}
                </span>
              )}
            </div>
          ))
        ) : (
          <span className="text-[9px] md:text-[10px] text-white/15 italic">空宮</span>
        )}
      </div>

      {/* Minor Stars */}
      {palace.minorStars.length > 0 && (
        <div className="mt-1 pt-1 border-t border-white/10 space-y-0.5">
          {palace.minorStars.map((s, i) => (
            <div key={i} className="flex items-center gap-0.5">
              <span className="text-[9px] md:text-[10px] text-white/40 leading-tight">{s.name}</span>
              {s.mutagen && (
                <span className={`text-[8px] md:text-[9px] font-bold ${mutagenColor(s.mutagen)}`}>
                  {s.mutagen}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Decadal Range */}
      <div className="mt-1 pt-1 border-t border-white/10">
        <span className="text-[8px] md:text-[9px] text-white/20">
          {palace.decadal.range[0]}-{palace.decadal.range[1]}歲
        </span>
      </div>
    </div>
  );
}

function InfoItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-white/30">{label}</span>
      <span className={highlight ? 'text-white font-bold' : 'text-white/60'}>{value}</span>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`w-2 h-2 rounded-full bg-${color}`} />
      <span>{label}</span>
    </div>
  );
}
