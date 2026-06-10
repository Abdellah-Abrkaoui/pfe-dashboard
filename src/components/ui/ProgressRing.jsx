import { useAppStore } from '../../store/appStore';

export default function ProgressRing({ value = 0, max = 100, unit = '', label = '', color = '#3FB950' }) {
  const theme = useAppStore((s) => s.theme);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const strokeDashoffset = circumference * (1 - progress);

  const trackColor = theme === 'dark' ? '#30363D' : '#D0D7DE';
  const valueTextColor = theme === 'dark' ? '#E6EDF3' : '#1F2328';
  const unitTextColor = theme === 'dark' ? '#8B949E' : '#656D76';

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle
          cx="60" cy="60" r={radius}
          fill="none" stroke={trackColor} strokeWidth="8"
        />
        <circle
          cx="60" cy="60" r={radius}
          fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 60 60)"
          className="transition-all duration-500"
        />
        <text x="60" y="55" textAnchor="middle" fill={valueTextColor} fontSize="18" fontFamily="JetBrains Mono">
          {value}
        </text>
        <text x="60" y="72" textAnchor="middle" fill={unitTextColor} fontSize="11">
          {unit}
        </text>
      </svg>
      {label && <span className="text-xs text-text-secondary mt-1">{label}</span>}
    </div>
  );
}
