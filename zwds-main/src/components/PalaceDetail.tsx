import type { PalaceData } from '@/lib/astro';
import { analyzePalace } from '@/lib/palaceAnalysis';
import { Sparkles, Eye, Lightbulb, X } from 'lucide-react';

interface PalaceDetailProps {
  palace: PalaceData;
  onClose?: () => void;
}

export default function PalaceDetail({ palace, onClose }: PalaceDetailProps) {
  const analysis = analyzePalace(palace);

  return (
    <div className="bg-white/[0.02] border border-white/15 rounded-2xl p-5 md:p-6 backdrop-blur-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-white/80 to-white/20 rounded-full" />
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-wider">{analysis.title}</h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-white/30">
              <span>{palace.heavenlyStem}{palace.earthlyBranch}</span>
              {palace.isBodyPalace && <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/15 text-white/50">身宮</span>}
              {palace.isOriginalPalace && <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/15 text-white/50">來因宮</span>}
            </div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors md:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Stars Summary */}
      <div className="flex flex-wrap gap-2 mb-5">
        {palace.majorStars.map((s, i) => (
          <span key={`maj-${i}`} className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/20 text-xs text-white font-medium">
            {s.name}{s.brightness ? ` ${s.brightness}` : ''}{s.mutagen ? ` 化${s.mutagen}` : ''}
          </span>
        ))}
        {palace.minorStars.map((s, i) => (
          <span key={`min-${i}`} className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white/50">
            {s.name}{s.mutagen ? ` 化${s.mutagen}` : ''}
          </span>
        ))}
        {palace.majorStars.length === 0 && (
          <span className="px-2.5 py-1 rounded-lg bg-white/[0.02] border border-white/8 text-xs text-white/25 italic">空宮</span>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 -mr-1 custom-scroll">
        {/* Personality */}
        <Section icon={<Sparkles size={16} className="text-white/70" />} title="性格解析">
          <div className="space-y-2">
            {analysis.personality.map((p, i) => (
              <p key={i} className="text-sm text-white/60 leading-relaxed">{p}</p>
            ))}
          </div>
        </Section>

        {/* Blind Spots */}
        <Section icon={<Eye size={16} className="text-white/70" />} title="潛在盲點">
          <ul className="space-y-1.5">
            {analysis.blindSpots.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/50 leading-relaxed">
                <span className="text-white/20 mt-0.5">▪</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Suggestions */}
        <Section icon={<Lightbulb size={16} className="text-white/70" />} title="改運建議">
          <ul className="space-y-1.5">
            {analysis.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/50 leading-relaxed">
                <span className="text-white/30 mt-0.5">◆</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Decadal Info */}
        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center gap-4 text-xs text-white/30">
            <span>大限：{palace.decadal.heavenlyStem}{palace.decadal.earthlyBranch} ({palace.decadal.range[0]}-{palace.decadal.range[1]}歲)</span>
            <span>長生：{palace.changsheng12}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-sm font-bold text-white/80 tracking-wider">{title}</h3>
        <div className="flex-1 h-px bg-gradient-to-r from-white/15 to-transparent" />
      </div>
      {children}
    </div>
  );
}
