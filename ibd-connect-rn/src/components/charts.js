import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Path, Rect, Polyline, Polygon, Line, G } from 'react-native-svg';
import { useStore } from '../store/Store';

// Single progress ring with centered content
export function Ring({ size = 120, stroke = 11, value = 0, max = 1, color, track, label }) {
  const { theme } = useStore();
  const r = size / 2 - stroke; const c = 2 * Math.PI * r;
  const p = Math.min(value / (max || 1), 1);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track || theme.bg2} strokeWidth={stroke} fill="none" />
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={color || theme.accent} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p)} />
      </Svg>
      {label != null ? <Text style={{ fontSize: size * 0.3 }}>{label}</Text> : null}
    </View>
  );
}

// Apple-style triple concentric rings (goals = [{val,goal,color}])
export function TriRings({ size = 120, goals }) {
  const { theme } = useStore();
  const cfgR = [size / 2 - 8, size / 2 - 22, size / 2 - 36];
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        {goals.map((g, i) => {
          const r = cfgR[i]; const c = 2 * Math.PI * r; const p = Math.min(g.val / g.goal, 1);
          return (
            <G key={i}>
              <Circle cx={size / 2} cy={size / 2} r={r} stroke={theme.bg2} strokeWidth={11} fill="none" opacity={0.7} />
              <Circle cx={size / 2} cy={size / 2} r={r} stroke={g.color} strokeWidth={11} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p)} />
            </G>
          );
        })}
      </Svg>
      <Text style={{ fontSize: 24 }}>{goals.every((x) => x.val >= x.goal) ? '🎉' : '💪'}</Text>
    </View>
  );
}

// Semicircular gauge 0..100
export function Gauge({ pct, width = 200 }) {
  const { theme } = useStore();
  const p = Math.max(0, Math.min(100, pct));
  const r = 70, cx = 90, cy = 90; const circ = Math.PI * r;
  return (
    <Svg width={width} height={width * 0.56} viewBox="0 0 180 104">
      <Path d="M20 90 A70 70 0 0 1 160 90" fill="none" stroke={theme.bg2} strokeWidth={14} strokeLinecap="round" />
      <Path d="M20 90 A70 70 0 0 1 160 90" fill="none" stroke={theme.accent} strokeWidth={14} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - p / 100)} />
    </Svg>
  );
}

// Vertical bar chart. data=[{label,value}]
export function BarChart({ data, color, height = 150 }) {
  const { theme, isAr } = useStore();
  const w = 300; const max = Math.max(1, ...data.map((d) => d.value));
  const pad = 22; const bw = (w - pad) / data.length;
  return (
    <View>
      <Svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
        {data.map((d, i) => {
          const bh = (d.value / max) * (height - 24);
          return <Rect key={i} x={i * bw + bw * 0.18 + pad} y={height - 18 - bh} width={bw * 0.64} height={Math.max(1, bh)} rx={5} fill={color || theme.accent} />;
        })}
      </Svg>
      <View style={{ flexDirection: isAr ? 'row-reverse' : 'row', justifyContent: 'space-between', marginTop: 2 }}>
        {data.map((d, i) => (
          <Text key={i} numberOfLines={1} style={{ color: theme.faint, fontSize: 9, flex: 1, textAlign: 'center' }}>{d.label}</Text>
        ))}
      </View>
    </View>
  );
}

// Line chart with area. values = number[] (nulls allowed)
export function LineChart({ values, color, height = 130, maxY }) {
  const { theme } = useStore();
  const w = 300; const vals = values.map((v) => (v == null ? 0 : v));
  const max = maxY || Math.max(1, ...vals);
  const n = values.length;
  const pts = vals.map((v, i) => `${((i / (n - 1 || 1)) * w).toFixed(1)},${(height - 6 - (v / max) * (height - 14)).toFixed(1)}`).join(' ');
  const area = `0,${height} ${pts} ${w},${height}`;
  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      <Polygon points={area} fill={color || theme.accent} opacity={0.12} />
      <Polyline points={pts} fill="none" stroke={color || theme.accent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// Mini sparkline
export function Sparkline({ values, color, height = 32 }) {
  const { theme } = useStore();
  const w = 120; const n = values.length; if (!n) return null;
  const max = Math.max(1, ...values);
  const pts = values.map((v, i) => `${((i / (n - 1 || 1)) * w).toFixed(1)},${(height - (v / max) * (height - 4) - 2).toFixed(1)}`).join(' ');
  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      <Polygon points={`0,${height} ${pts} ${w},${height}`} fill={color || theme.accent} opacity={0.1} />
      <Polyline points={pts} fill="none" stroke={color || theme.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// IBD-DISC radar (the "disk"). data = number[10] 0..10, labels = string[10]
export function Radar({ data, labels, size = 280, color }) {
  const { theme } = useStore();
  const cx = size / 2, cy = size / 2, R = size / 2 - 38; const N = data.length; const max = 10;
  const ang = (i) => (Math.PI * 2 * i) / N - Math.PI / 2;
  const pt = (i, val) => [cx + Math.cos(ang(i)) * R * (val / max), cy + Math.sin(ang(i)) * R * (val / max)];
  const poly = data.map((v, i) => pt(i, v).join(',')).join(' ');
  const rings = [2, 4, 6, 8, 10];
  return (
    <Svg width={size} height={size}>
      {rings.map((rv, k) => (
        <Polygon key={k} points={data.map((_, i) => pt(i, rv).join(',')).join(' ')} fill="none" stroke={theme.line} strokeWidth={1} />
      ))}
      {data.map((_, i) => { const [x, y] = pt(i, max); return <Line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={theme.line} strokeWidth={1} />; })}
      <Polygon points={poly} fill={(color || theme.purple) + '33'} stroke={color || theme.purple} strokeWidth={2} />
      {data.map((v, i) => { const [x, y] = pt(i, v); return <Circle key={i} cx={x} cy={y} r={3} fill={color || theme.purple} />; })}
    </Svg>
  );
}

// Logging heatmap (grid of N day squares)
export function Heatmap({ days, valueFor }) {
  const { theme } = useStore();
  const arr = days;
  const color = (lvl) => {
    const mix = (a, p) => a; // RN can't color-mix; use opacity tiers
    const tiers = [theme.bg2, theme.accent + '4D', theme.accent + '80', theme.accent + 'B3', theme.accent];
    return tiers[Math.max(0, Math.min(4, lvl))];
  };
  const lvlOf = (c) => (c === 0 ? 0 : c < 2 ? 1 : c < 4 ? 2 : c < 6 ? 3 : 4);
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
      {arr.map((d, i) => {
        const c = valueFor(d);
        return <View key={i} style={{ width: '6%', aspectRatio: 1, borderRadius: 4, backgroundColor: color(lvlOf(c)), borderColor: theme.line, borderWidth: 1 }} />;
      })}
    </View>
  );
}
