import ReactECharts from 'echarts-for-react';
import { useAppStore } from '../../store/appStore';
import { useChartTheme } from '../../utils/chartTheme';

export default function MoistureGauge() {
  const history = useAppStore((s) => s.sensorHistory);
  const ct = useChartTheme();

  const option = {
    backgroundColor: 'transparent',
    grid: { top: 40, right: 20, bottom: 40, left: 50 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: ct.tooltip.bg,
      borderColor: ct.tooltip.border,
      textStyle: { color: ct.tooltip.text, fontSize: 12 },
    },
    xAxis: {
      type: 'time',
      splitLine: { show: false },
      axisLine: { lineStyle: { color: ct.axis.line } },
      axisLabel: { color: ct.axis.label, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      name: 'Moisture (%)',
      min: 0,
      max: 100,
      nameTextStyle: { color: ct.axis.label, fontSize: 11 },
      splitLine: { lineStyle: { color: ct.axis.splitLine, type: 'dashed' } },
      axisLabel: { color: ct.axis.label, fontSize: 11 },
    },
    series: [{
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2, color: '#388BFD' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(56, 139, 253, 0.3)' },
            { offset: 1, color: 'rgba(56, 139, 253, 0)' },
          ],
        },
      },
      data: history.map((d) => [d.timestamp, d.soil_pct]),
    }],
    dataZoom: [{ type: 'inside', start: 0, end: 100 }],
  };

  if (history.length === 0) {
    return <div className="flex items-center justify-center h-[280px] text-text-muted text-sm">Waiting for data...</div>;
  }

  return <ReactECharts option={option} style={{ height: '100%', minHeight: 280 }} />;
}
