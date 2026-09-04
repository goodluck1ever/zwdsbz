import type { PalaceData, StarData } from './astro';

export interface PalaceAnalysis {
  title: string;
  personality: string[];
  blindSpots: string[];
  suggestions: string[];
}

const MAJOR_STAR_KEYWORDS: Record<string, { traits: string; positive: string[]; negative: string[] }> = {
  紫微: {
    traits: '帝王之星，尊貴威嚴，領袖氣質',
    positive: ['天生具備領導魅力', '處事大方得體', '有強烈的責任感', '追求高品質生活'],
    negative: ['容易剛愎自用', '過度好面子', '不願接受批評', '孤高自傲'],
  },
  天機: {
    traits: '智慧之星，思維敏捷，善於謀劃',
    positive: ['思維活躍、反應靈敏', '擅長分析與策劃', '具備強烈求知慾', '適應力強'],
    negative: ['想得多做得少', '容易焦慮多慮', '情緒起伏大', '優柔寡斷'],
  },
  太陽: {
    traits: '光明之星，熱情慷慨，博愛公正',
    positive: ['性格開朗熱情', '樂於助人', '有正義感', '精力充沛'],
    negative: ['過度操勞', '好大喜功', '忽略自身需求', '感情用事'],
  },
  武曲: {
    traits: '財星，剛毅果決，重視實際',
    positive: ['意志堅定', '執行力強', '理財能力佳', '務實不虛浮'],
    negative: ['過於剛硬', '缺乏柔情', '容易得罪人', '孤僻寡合'],
  },
  天同: {
    traits: '福星，溫和樂天，情感豐富',
    positive: ['性格溫和善良', '知足常樂', '人緣極佳', '享受生活'],
    negative: ['缺乏進取心', '過於安逸', '優柔寡斷', '依賴心強'],
  },
  廉貞: {
    traits: '次桃花星，能幹好勝，情感複雜',
    positive: ['能力出眾', '公私分明', '應對進退得宜', '具備藝術天分'],
    negative: ['情緒極端', '容易陷入感情糾紛', '好勝心過強', '內心矛盾'],
  },
  天府: {
    traits: '令星，穩重包容，善於理財',
    positive: ['穩重踏實', '具備理財天賦', '包容力強', '有領導統御能力'],
    negative: ['過於保守', '缺乏冒險精神', '容易安於現狀', '固執己見'],
  },
  太陰: {
    traits: '母星，溫柔細膩，重感情顧家',
    positive: ['心思細膩', '重視家庭', '富有浪漫情懷', '理財謹慎'],
    negative: ['多愁善感', '優柔寡斷', '缺乏魄力', '過度敏感'],
  },
  貪狼: {
    traits: '桃花星，多才多藝，欲望強烈',
    positive: ['才華洋溢', '社交能力極佳', '學習能力強', '充滿魅力'],
    negative: ['慾望過多', '容易沉迷享樂', '感情複雜', '做事不夠專一'],
  },
  巨門: {
    traits: '暗星，口才出眾，善於分析',
    positive: ['口才極佳', '邏輯清晰', '洞察力強', '擅長研究'],
    negative: ['容易招惹是非', '多疑多慮', '言語傷人', '人際關係波折'],
  },
  天相: {
    traits: '印星，溫文爾雅，輔佐之才',
    positive: ['處事圓融', '樂於助人', '有正義感', '具備協調能力'],
    negative: ['過度在意他人看法', '優柔寡斷', '容易被人利用', '缺乏主見'],
  },
  天梁: {
    traits: '蔭星，正直磊落，喜助人',
    positive: ['正直善良', '樂於照顧他人', '有逢凶化吉之運', '沉穩可靠'],
    negative: ['過度操心', '喜歡說教', '孤芳自賞', '容易自尋煩惱'],
  },
  七殺: {
    traits: '將星，勇敢果決，開創力強',
    positive: ['勇氣十足', '開創精神強', '獨立自主', '做事有魄力'],
    negative: ['衝動莽撞', '人際關係緊張', '不易妥協', '容易孤軍奮戰'],
  },
  破軍: {
    traits: '耗星，破舊立新，變動不居',
    positive: ['勇於改變', '具備開創力', '不畏艱難', '生命力旺盛'],
    negative: ['行事衝動', '感情波折多', '難以安定', '破壞力強'],
  },
  '空宮': {
    traits: '無主星坐守，借星安宮',
    positive: ['性格多變靈活', '適應力極強', '不受限於框架', '潛力多元'],
    negative: ['缺乏明確方向', '容易受環境影響', '定力不足', '隨波逐流'],
  },
};

const PALACE_BASE_ANALYSIS: Record<string, { domain: string; desc: string }> = {
  命宮: { domain: '先天格局與核心性格', desc: '命宮是整張命盤的核心，代表你與生俱來的天賦、性格傾向與人生格局。' },
  兄弟: { domain: '手足情誼與平輩關係', desc: '兄弟宮反映你與兄弟姐妹、同事及平輩之間的互動模式與緣分深淺。' },
  夫妻: { domain: '婚姻情感與伴侶關係', desc: '夫妻宮揭示你對感情的態度、婚姻的樣貌以及與伴侶的相處模式。' },
  子女: { domain: '子女緣分與晚輩關係', desc: '子女宮代表你與子女的緣分、對待晚輩的方式，以及生育方面的狀況。' },
  財帛: { domain: '財富運勢與理財模式', desc: '財帛宮反映你的賺錢能力、理財觀念以及一生財運的起伏。' },
  疾厄: { domain: '健康體質與身心狀況', desc: '疾厄宮揭示你的體質傾向、容易出現的健康問題及身心狀態。' },
  遷移: { domain: '外出運勢與社交展現', desc: '遷移宮代表你在外發展的機遇、人際社交能力以及旅行運勢。' },
  仆役: { domain: '人際交友與貴人運', desc: '仆役宮反映你與朋友、下屬的關係，以及交友圈對你的影響。' },
  官祿: { domain: '事業發展與工作成就', desc: '官祿宮是事業宮，揭示你的職業取向、工作態度及事業成就高度。' },
  田宅: { domain: '家庭不動產與居住環境', desc: '田宅宮代表你的家庭環境、不動產運勢以及內在的安全感來源。' },
  福德: { domain: '精神世界與內心享受', desc: '福德宮反映你的精神狀態、內心世界、興趣愛好及福報深淺。' },
  父母: { domain: '長輩緣分與原生家庭', desc: '父母宮揭示你與父母長輩的關係、原生家庭的影響及教養方式。' },
};

function getStarKeywords(stars: StarData[]): { traits: string; positive: string[]; negative: string[] } {
  if (stars.length === 0) return MAJOR_STAR_KEYWORDS['空宮'];
  const main = stars[0];
  return MAJOR_STAR_KEYWORDS[main.name] || MAJOR_STAR_KEYWORDS['空宮'];
}

export function analyzePalace(palace: PalaceData): PalaceAnalysis {
  const base = PALACE_BASE_ANALYSIS[palace.name] || { domain: '此宮位', desc: '' };
  const kw = getStarKeywords(palace.majorStars);

  const mutagens = palace.majorStars
    .concat(palace.minorStars)
    .filter((s) => s.mutagen)
    .map((s) => `${s.name}化${s.mutagen}`);

  let mutagenNote = '';
  if (mutagens.length > 0) {
    const m = mutagens[0];
    if (m.includes('化祿')) mutagenNote = `此宮有${m}，代表在${base.domain}方面有豐盛的機遇與好運加持。`;
    else if (m.includes('化權')) mutagenNote = `此宮有${m}，代表在${base.domain}方面有強烈的掌控欲與行動力。`;
    else if (m.includes('化科')) mutagenNote = `此宮有${m}，代表在${base.domain}方面有良好的名聲與貴人相助。`;
    else if (m.includes('化忌')) mutagenNote = `此宮有${m}，代表在${base.domain}方面容易遇到阻礙與執念，需特別留意。`;
  }

  const personalityIntro = palace.majorStars.length > 0
    ? `${base.desc} 此宮由${palace.majorStars.map((s) => s.name).join('、')}坐守，${kw.traits}。`
    : `${base.desc} 此宮為空宮，性格特質受對宮與三方四正星曜影響較大，${kw.traits}。`;

  if (mutagenNote) {
    personalityIntro + ' ' + mutagenNote;
  }

  const personality = [
    personalityIntro,
    ...kw.positive.map((p) => p),
  ];

  if (mutagenNote) {
    personality.push(mutagenNote);
  }

  const blindSpots = kw.negative;

  const suggestions = generateSuggestions(palace, kw);

  return {
    title: `${palace.name} · ${base.domain}`,
    personality,
    blindSpots,
    suggestions,
  };
}

function generateSuggestions(palace: PalaceData, kw: { traits: string; positive: string[]; negative: string[] }): string[] {
  const suggestions: string[] = [];
  const hasJi = palace.majorStars.concat(palace.minorStars).some((s) => s.mutagen === '忌');
  const hasLu = palace.majorStars.concat(palace.minorStars).some((s) => s.mutagen === '祿');

  if (hasJi) {
    suggestions.push(`此宮有化忌星，建議在${PALACE_BASE_ANALYSIS[palace.name]?.domain || '相關領域'}保持平常心，不強求、不執著，以柔克剛。`);
  }
  if (hasLu) {
    suggestions.push(`此宮有化祿加持，宜把握${PALACE_BASE_ANALYSIS[palace.name]?.domain || '相關領域'}的機遇，但切忌因順境而懈怠。`);
  }

  if (palace.name === '命宮') {
    suggestions.push('善用主星正面特質，同時留意負面傾向，以覺察代替壓抑。');
    suggestions.push('培養一項能讓心沉澱的興趣或修行，平衡內在能量。');
  } else if (palace.name === '夫妻') {
    suggestions.push('在感情中學習包容與溝通，避免將自身期待投射於伴侶。');
    suggestions.push('給予彼此適當空間，以尊重取代控制，關係方能長久。');
  } else if (palace.name === '官祿') {
    suggestions.push('依循主星特質選擇適合的職業方向，順性而為事半功倍。');
    suggestions.push('事業發展宜穩紮穩打，避免急功近利而失去根基。');
  } else if (palace.name === '財帛') {
    suggestions.push('建立穩健的理財習慣，量入為出，避免衝動消費。');
    suggestions.push('可考慮多元收入來源，但不宜過度投機。');
  } else if (palace.name === '疾厄') {
    suggestions.push('留意星曜對應的臟腑健康，定期健檢、規律作息。');
    suggestions.push('培養運動習慣，身心並重，情緒管理同樣關鍵。');
  } else if (palace.name === '遷移') {
    suggestions.push('把握外出發展的機遇，拓展人脈與視野。');
    suggestions.push('在外保持低調謹慎，注意人身與財物安全。');
  } else if (palace.name === '田宅') {
    suggestions.push('用心經營家庭氛圍，居家環境影響內在安定感。');
    suggestions.push('不動產投資宜量力而為，以自住為優先考量。');
  } else if (palace.name === '福德') {
    suggestions.push('培養正向的精神生活，冥想、閱讀或藝術皆能滋養心靈。');
    suggestions.push('學習放下執念，福報來自於內心的豐足而非外求。');
  } else if (palace.name === '父母') {
    suggestions.push('以感恩之心面對原生家庭，理解代際差異帶來的觀念落差。');
    suggestions.push('主動修復與長輩的關係，孝順是最好的福田。');
  } else if (palace.name === '兄弟') {
    suggestions.push('珍惜手足情誼，以真誠溝通化解潛在的競爭心結。');
    suggestions.push('在合作中明確分工，避免因利益損傷感情。');
  } else if (palace.name === '子女') {
    suggestions.push('以尊重與陪伴取代控制，給予下一代成長的空間。');
    suggestions.push('因材施教，順應孩子的天賦而非自身的期待。');
  } else if (palace.name === '仆役') {
    suggestions.push('慎選交友圈，良師益友能助你更上一層樓。');
    suggestions.push('在人際互動中保持真誠，但也要設立健康的界線。');
  }

  if (suggestions.length < 2) {
    suggestions.push(`覺察${kw.negative[0] || '自身盲點'}的傾向，以行動修正而非自責。`);
    suggestions.push('保持開放心態，接納生命中的變化與考驗。');
  }

  return suggestions;
}
