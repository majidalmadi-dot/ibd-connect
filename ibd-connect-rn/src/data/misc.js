// Countries, gamification, badges, quests, calculator config.
export const COUNTRIES = [
  { c: 'SA', f: '🇸🇦', en: 'Saudi Arabia', ar: 'السعودية', r: 'gcc' },
  { c: 'AE', f: '🇦🇪', en: 'United Arab Emirates', ar: 'الإمارات', r: 'gcc' },
  { c: 'KW', f: '🇰🇼', en: 'Kuwait', ar: 'الكويت', r: 'gcc' },
  { c: 'QA', f: '🇶🇦', en: 'Qatar', ar: 'قطر', r: 'gcc' },
  { c: 'BH', f: '🇧🇭', en: 'Bahrain', ar: 'البحرين', r: 'gcc' },
  { c: 'OM', f: '🇴🇲', en: 'Oman', ar: 'عُمان', r: 'gcc' },
  { c: 'EG', f: '🇪🇬', en: 'Egypt', ar: 'مصر', r: 'mena' },
  { c: 'JO', f: '🇯🇴', en: 'Jordan', ar: 'الأردن', r: 'mena' },
  { c: 'LB', f: '🇱🇧', en: 'Lebanon', ar: 'لبنان', r: 'mena' },
  { c: 'IQ', f: '🇮🇶', en: 'Iraq', ar: 'العراق', r: 'mena' },
  { c: 'PS', f: '🇵🇸', en: 'Palestine', ar: 'فلسطين', r: 'mena' },
  { c: 'YE', f: '🇾🇪', en: 'Yemen', ar: 'اليمن', r: 'mena' },
  { c: 'MA', f: '🇲🇦', en: 'Morocco', ar: 'المغرب', r: 'mena' },
  { c: 'DZ', f: '🇩🇿', en: 'Algeria', ar: 'الجزائر', r: 'mena' },
  { c: 'TN', f: '🇹🇳', en: 'Tunisia', ar: 'تونس', r: 'mena' },
  { c: 'SD', f: '🇸🇩', en: 'Sudan', ar: 'السودان', r: 'mena' },
  { c: 'US', f: '🇺🇸', en: 'United States', ar: 'الولايات المتحدة', r: 'world' },
  { c: 'GB', f: '🇬🇧', en: 'United Kingdom', ar: 'المملكة المتحدة', r: 'world' },
  { c: 'CA', f: '🇨🇦', en: 'Canada', ar: 'كندا', r: 'world' },
  { c: 'DE', f: '🇩🇪', en: 'Germany', ar: 'ألمانيا', r: 'world' },
  { c: 'FR', f: '🇫🇷', en: 'France', ar: 'فرنسا', r: 'world' },
  { c: 'IN', f: '🇮🇳', en: 'India', ar: 'الهند', r: 'world' },
  { c: 'PK', f: '🇵🇰', en: 'Pakistan', ar: 'باكستان', r: 'world' },
  { c: 'TR', f: '🇹🇷', en: 'Türkiye', ar: 'تركيا', r: 'world' },
  { c: 'MY', f: '🇲🇾', en: 'Malaysia', ar: 'ماليزيا', r: 'world' },
];

export const LEVELS = [
  { min: 0, en: 'Seedling', ar: 'بذرة', icon: '🌱' },
  { min: 80, en: 'Sprout', ar: 'برعم', icon: '🌿' },
  { min: 200, en: 'Explorer', ar: 'مستكشف', icon: '🧭' },
  { min: 400, en: 'Pathfinder', ar: 'رائد الطريق', icon: '⭐' },
  { min: 700, en: 'Achiever', ar: 'منجِز', icon: '🏅' },
  { min: 1100, en: 'Champion', ar: 'بطل', icon: '🏆' },
  { min: 1700, en: 'Legend', ar: 'أسطورة', icon: '👑' },
];

export const BADGES = [
  { id: 'first', icon: '🌱', en: 'First log', ar: 'أول تسجيل' },
  { id: 'streak3', icon: '🔥', en: '3-day streak', ar: '٣ أيام متتالية' },
  { id: 'streak7', icon: '⚡', en: '7-day streak', ar: '٧ أيام متتالية' },
  { id: 'allsix', icon: '🎯', en: 'Full day logged', ar: 'يوم مكتمل' },
  { id: 'disc', icon: '🧭', en: 'Self-check done', ar: 'أكملت التقييم' },
  { id: 'logs25', icon: '📚', en: '25 logs', ar: '٢٥ تسجيلًا' },
];

export const QUESTS = [
  { id: 'q_days3', icon: '📅', en: 'Log on 3 different days', ar: 'سجّل في ٣ أيام مختلفة', goal: 3, xp: 50 },
  { id: 'q_full', icon: '🎯', en: 'Complete a full day (5 types)', ar: 'أكمل يومًا كاملًا (٥ أنواع)', goal: 5, xp: 40 },
  { id: 'q_streak7', icon: '🔥', en: 'Reach a 7-day streak', ar: 'حقّق تتابع ٧ أيام', goal: 7, xp: 80 },
  { id: 'q_disc', icon: '🧭', en: 'Finish an IBD-DISC self-check', ar: 'أكمل تقييم IBD-DISC', goal: 1, xp: 30 },
  { id: 'q_logs50', icon: '📚', en: 'Reach 50 total logs', ar: 'بلوغ ٥٠ تسجيلًا', goal: 50, xp: 100 },
];

export const AVATARS = ['🙂', '😊', '😎', '🧑', '👩', '👨', '🧕', '👳', '🦊', '🐼', '🌿', '⭐'];
