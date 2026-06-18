// Theme palettes (5 dark + 4 light). Each is a flat color object consumed by components.
export const THEMES = [
  { id: 'midnight', en: 'Midnight', ar: 'منتصف الليل', mode: 'dark',
    bg: '#0B0F14', bg2: '#0F151D', card: '#141C26', card2: '#1B2530', line: '#243140', txt: '#EAF2F8', muted: '#8DA0B2', faint: '#5A6B7B', accent: '#00E0B8', accent2: '#19A0FF', accentD: '#0B3B36', good: '#2BD67B', warn: '#FFB23E', bad: '#FF5C72', purple: '#9B7CFF', coral: '#FF8A6B' },
  { id: 'obsidian', en: 'Obsidian', ar: 'سبج', mode: 'dark',
    bg: '#000000', bg2: '#0B0B0D', card: '#121214', card2: '#1A1A1E', line: '#26262C', txt: '#F2F2F4', muted: '#9A9AA4', faint: '#5E5E68', accent: '#34E1FF', accent2: '#7C8CFF', accentD: '#062a33', good: '#2BD67B', warn: '#FFB23E', bad: '#FF5C72', purple: '#9B7CFF', coral: '#FF8A6B' },
  { id: 'aurora', en: 'Aurora', ar: 'الشفق', mode: 'dark',
    bg: '#0C0A1A', bg2: '#121029', card: '#191636', card2: '#221E45', line: '#332C5C', txt: '#ECEAFB', muted: '#A398C9', faint: '#6B6094', accent: '#9B7CFF', accent2: '#FF7CC8', accentD: '#241a47', good: '#2BD67B', warn: '#FFB23E', bad: '#FF5C72', purple: '#C7A5FF', coral: '#FF8A6B' },
  { id: 'ocean', en: 'Ocean', ar: 'المحيط', mode: 'dark',
    bg: '#06121C', bg2: '#0A1A28', card: '#0F2333', card2: '#163245', line: '#214055', txt: '#E6F3FB', muted: '#86A6BC', faint: '#557089', accent: '#1FC8E8', accent2: '#3BE0C0', accentD: '#06303a', good: '#2BD67B', warn: '#FFB23E', bad: '#FF5C72', purple: '#9B7CFF', coral: '#FF8A6B' },
  { id: 'ember', en: 'Ember', ar: 'الجمر', mode: 'dark',
    bg: '#160D0A', bg2: '#21130E', card: '#2A1913', card2: '#38231A', line: '#4A3024', txt: '#FBEEE6', muted: '#C8A593', faint: '#946C58', accent: '#FF8A4B', accent2: '#FFC24B', accentD: '#3a1d0e', good: '#2BD67B', warn: '#FFB23E', bad: '#FF5C72', purple: '#9B7CFF', coral: '#FF8A6B' },
  { id: 'daylight', en: 'Daylight', ar: 'ضوء النهار', mode: 'light',
    bg: '#EEF2F6', bg2: '#FFFFFF', card: '#FFFFFF', card2: '#EAF0F5', line: '#DCE5EC', txt: '#0F1A24', muted: '#5E7286', faint: '#9AAAB8', accent: '#00B392', accent2: '#0A84FF', accentD: '#D6F4EC', good: '#16A34A', warn: '#D97706', bad: '#E11D48', purple: '#7C5CFF', coral: '#F0682F' },
  { id: 'blossom', en: 'Blossom', ar: 'الزهر', mode: 'light',
    bg: '#FBEEF3', bg2: '#FFFFFF', card: '#FFFFFF', card2: '#FCEEF4', line: '#F2DBE5', txt: '#2A1620', muted: '#9B7385', faint: '#C3A3B2', accent: '#F0468A', accent2: '#9B7CFF', accentD: '#FCE0EC', good: '#16A34A', warn: '#D97706', bad: '#E11D48', purple: '#9B7CFF', coral: '#F0682F' },
  { id: 'mint', en: 'Mint', ar: 'النعناع', mode: 'light',
    bg: '#EAF6EF', bg2: '#FFFFFF', card: '#FFFFFF', card2: '#E6F4EC', line: '#D5EADD', txt: '#0F2418', muted: '#5C7A68', faint: '#9BBBA8', accent: '#1FA85F', accent2: '#0AAFA0', accentD: '#D6F1E1', good: '#16A34A', warn: '#D97706', bad: '#E11D48', purple: '#7C5CFF', coral: '#F0682F' },
  { id: 'sand', en: 'Sand', ar: 'الرمال', mode: 'light',
    bg: '#F5EFE6', bg2: '#FFFDFA', card: '#FFFDFA', card2: '#F2E9DC', line: '#E6DBCB', txt: '#27201A', muted: '#7D6E5C', faint: '#B6A88C', accent: '#C96A3A', accent2: '#D9A441', accentD: '#F3E3D4', good: '#16A34A', warn: '#D97706', bad: '#E11D48', purple: '#7C5CFF', coral: '#C96A3A' },
];

export function getTheme(id) {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}
