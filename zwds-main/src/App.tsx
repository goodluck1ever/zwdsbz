import { useState, useRef, useEffect } from 'react';
import BirthInput from '@/components/BirthInput';
import BaZiDisplay from '@/components/BaZiDisplay';
import ZiWeiChart from '@/components/ZiWeiChart';
import PalaceDetail from '@/components/PalaceDetail';
import ConsultationCTA from '@/components/ConsultationCTA';
import { calculateBaZi, calculateZiWei } from '@/lib/astro';
import type { BirthParams, BaZiData, ZiWeiData } from '@/lib/astro';
import { Sparkles, Stars, Moon, Scroll } from 'lucide-react';

export default function App() {
  const [baZiData, setBaZiData] = useState<BaZiData | null>(null);
  const [ziWeiData, setZiWeiData] = useState<ZiWeiData | null>(null);
  const [selectedPalaceIndex, setSelectedPalaceIndex] = useState<number>(-1);
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCalculate = (params: BirthParams) => {
    setIsCalculating(true);
    setTimeout(() => {
      const baZi = calculateBaZi(params);
      const ziWei = calculateZiWei(params);
      setBaZiData(baZi);
      setZiWeiData(ziWei);
      const soulPalace = ziWei.palaces.find((p) => p.name === '命宮');
      setSelectedPalaceIndex(soulPalace?.index ?? 0);
      setShowResults(true);
      setIsCalculating(false);
    }, 800);
  };

  useEffect(() => {
    if (showResults && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showResults]);

  const selectedPalace = ziWeiData?.palaces.find((p) => p.index === selectedPalaceIndex);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Background Ambient Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.015] rounded-full blur-[100px]" />
      </div>

      {/* Decorative Grid Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10">
        {/* Top Quote */}
        <div className="text-center pt-8 md:pt-12 px-4">
          <div className="inline-block">
            <p className="text-xl md:text-3xl text-white/70 tracking-[0.1em] font-light leading-relaxed">
              「自天佑之，吉無不利。」
            </p>
            <p className="text-sm md:text-base text-white/35 mt-2 tracking-[0.15em]">——《易經·大有卦》</p>
          </div>
          <div className="mt-4 w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto" />
        </div>

        {/* Header */}
        <header className="text-center pt-8 md:pt-12 pb-8 px-4">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.03]">
            <Stars size={14} className="text-white/50" />
            <span className="text-xs text-white/50 tracking-[0.3em]">紫微斗數 · 八字命理</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-[0.15em] mb-3 text-white">
            紫微斗數與八字
          </h1>
          <h2 className="text-xl md:text-2xl text-white/50 tracking-[0.2em] mb-4">
            線上排盤與分析系統
          </h2>
          <p className="text-sm md:text-base text-white/40 max-w-xl mx-auto leading-relaxed tracking-wide">
            命運從非注定，看懂自己，就是改運的開始。
          </p>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 pb-16">
          {/* Input Section */}
          <div className="max-w-md mx-auto mb-8">
            <BirthInput onCalculate={handleCalculate} />
          </div>

          {/* Calculating Indicator */}
          {isCalculating && (
            <div className="flex flex-col items-center gap-4 py-16">
              <div className="relative">
                <Moon size={48} className="text-white/60 animate-pulse" />
                <Sparkles size={20} className="text-white/40 absolute -top-1 -right-1 animate-ping" />
              </div>
              <p className="text-white/50 tracking-[0.2em] text-sm animate-pulse">推演命盤中...</p>
            </div>
          )}

          {/* Results Section */}
          {showResults && baZiData && ziWeiData && !isCalculating && (
            <div ref={resultsRef} className="space-y-6 md:space-y-8 animate-fade-in-up">
              {/* BaZi Section */}
              <BaZiDisplay data={baZiData} />

              {/* ZiWei Chart + Detail */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ZiWeiChart
                  data={ziWeiData}
                  selectedPalaceIndex={selectedPalaceIndex}
                  onSelectPalace={setSelectedPalaceIndex}
                />
                {selectedPalace && (
                  <PalaceDetail palace={selectedPalace} />
                )}
              </div>

              {/* Palace Quick Select */}
              <PalaceQuickSelect
                palaces={ziWeiData.palaces}
                selectedIndex={selectedPalaceIndex}
                onSelect={setSelectedPalaceIndex}
              />

              {/* Consultation CTA */}
              <ConsultationCTA />
            </div>
          )}

          {/* Empty State */}
          {!showResults && !isCalculating && (
            <div className="text-center py-16">
              <Scroll size={48} className="text-white/15 mx-auto mb-4" />
              <p className="text-white/25 text-sm tracking-wider">
                請輸入您的生辰資訊，開始命盤推演
              </p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 px-4 text-center">
          {/* Bottom Quote */}
          <div className="mb-6 max-w-2xl mx-auto">
            <p className="text-lg md:text-2xl text-white/60 tracking-[0.08em] font-light leading-relaxed">
              「當潛意識沒有進入意識時，它就是你的命運，而你只會稱之為巧合。」
            </p>
            <p className="text-sm md:text-base text-white/35 mt-3 tracking-[0.15em]">—— 卡爾·榮格（Carl Jung）</p>
          </div>
          <p className="text-xs text-white/20 tracking-wider">
            紫微斗數與八字線上排盤系統 · 命理僅供參考，命運掌握在自己手中
          </p>
        </footer>
      </div>
    </div>
  );
}

function PalaceQuickSelect({
  palaces,
  selectedIndex,
  onSelect,
}: {
  palaces: ZiWeiData['palaces'];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  const order = ['命宮', '兄弟', '夫妻', '子女', '財帛', '疾厄', '遷移', '仆役', '官祿', '田宅', '福德', '父母'];
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {order.map((name) => {
        const p = palaces.find((pp) => pp.name === name);
        if (!p) return null;
        const isActive = p.index === selectedIndex;
        return (
          <button
            key={name}
            onClick={() => onSelect(p.index)}
            className={`px-3 py-1.5 rounded-lg text-xs tracking-wider transition-all duration-300 border ${
              isActive
                ? 'bg-white/10 border-white/60 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                : 'bg-transparent border-white/15 text-white/40 hover:border-white/30 hover:text-white/60'
            }`}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}
