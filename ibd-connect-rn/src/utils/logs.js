export const TYPE_META = {
  symptom: { icon: '🩺', key: 'symptoms' },
  meal: { icon: '🍽️', key: 'meals' },
  sleep: { icon: '😴', key: 'sleep' },
  mood: { icon: '🌤️', key: 'mood' },
  activity: { icon: '🏃', key: 'activity' },
  bowel: { icon: '🚽', key: 'bowel' },
  steps: { icon: '👟', key: 'tSteps' },
  weight: { icon: '⚖️', key: 'tWeight' },
};

export function logLabel(l, t) {
  const m = TYPE_META[l.type] || { icon: '•', key: 'history' };
  let extra = '';
  if (l.type === 'symptom') extra = t(l.sym || 'symptoms') + ' · ' + t(['mild', 'moderate', 'severe'][(l.sev || 1) - 1]);
  else if (l.type === 'meal') extra = t(l.mealType || 'meals');
  else if (l.type === 'sleep') extra = (l.hours || 0) + 'h · ' + t(['poor', 'fair', 'good', 'great'][(l.qual || 1) - 1]);
  else if (l.type === 'mood') extra = t(['veryLow', 'low', 'okay', 'happy', 'great2'][(l.mood || 1) - 1]);
  else if (l.type === 'activity') extra = t(l.act || 'activity') + ' · ' + (l.mins || 0) + 'm';
  else if (l.type === 'bowel') extra = (l.count || 0) + '× · Bristol ' + (l.bristol || '-');
  else if (l.type === 'steps') extra = (l.steps || 0).toLocaleString() + ' ' + t('steps');
  else if (l.type === 'weight') extra = (l.kg || 0) + ' kg';
  return { icon: m.icon, title: t(m.key), sub: extra };
}

export function fmtTime(iso, isAr) {
  const d = new Date(iso);
  return d.toLocaleTimeString(isAr ? 'ar-SA' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
}
export function fmtDate(iso, isAr) {
  const d = new Date(iso);
  return d.toLocaleDateString(isAr ? 'ar-SA' : 'en-GB', { day: 'numeric', month: 'short' });
}
