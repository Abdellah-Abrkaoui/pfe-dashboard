import { useAppStore } from '../store/appStore';

const darkTheme = {
  tooltip: { bg: '#1C2128', border: '#30363D', text: '#E6EDF3' },
  axis: { line: '#30363D', label: '#8B949E', splitLine: '#30363D' },
  legend: '#8B949E',
  pointer: '#E6EDF3',
  ring: { track: '#30363D', valueText: '#E6EDF3', unitText: '#8B949E' },
};

const lightTheme = {
  tooltip: { bg: '#FFFFFF', border: '#D0D7DE', text: '#1F2328' },
  axis: { line: '#D0D7DE', label: '#656D76', splitLine: '#E8EAED' },
  legend: '#656D76',
  pointer: '#1F2328',
  ring: { track: '#D0D7DE', valueText: '#1F2328', unitText: '#656D76' },
};

export function useChartTheme() {
  const theme = useAppStore((s) => s.theme);
  return theme === 'dark' ? darkTheme : lightTheme;
}
