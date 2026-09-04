import { CalendarHeart, Phone } from 'lucide-react';

export default function ConsultationCTA() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.04] via-black to-white/[0.04] p-6 md:p-10 text-center">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-white/[0.04] rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-white/[0.02] rounded-full blur-2xl" />

      <div className="relative">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/[0.05] border border-white/20 mb-4">
          <CalendarHeart size={28} className="text-white/80" />
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-white tracking-wider mb-3">
          預約大師 1 對 1 深度諮詢
        </h3>

        <p className="text-sm md:text-base text-white/40 max-w-md mx-auto mb-6 leading-relaxed">
          命盤推演僅為命運之輪廓，深度解析方能洞察玄機。
          <br />
          由資深命理大師為您逐一拆解命盤，指引人生方向。
        </p>

        <button
          onClick={() => {
            const el = document.getElementById('consultation-form');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-white/10 border border-white/40 text-white font-bold tracking-[0.15em] transition-all duration-500 hover:bg-white/15 hover:border-white/60 hover:shadow-[0_0_28px_rgba(255,255,255,0.1)] hover:scale-[1.03] active:scale-[0.98]"
        >
          <Phone size={18} />
          立即預約諮詢
        </button>
      </div>
    </div>
  );
}
