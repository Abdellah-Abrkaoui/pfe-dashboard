import ReactECharts from 'echarts-for-react';
import { useAppStore } from '../../store/appStore';
import { useChartTheme } from '../../utils/chartTheme';

export default function WaterBalanceChart() {
  const history = useAppStore((s) => s.sensorHistory);
  const ct = useChartTheme();

  const option = {
    backgroundColor: 'transparent',
    grid: { top: 50, right: 20, bottom: 60, left: 60 },
    legend: {
      bottom: 10,
      textStyle: { color: ct.legend, fontSize: 11 },
      data: ['Input', 'Drainage', 'Water Used'],
    },
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
      name: 'mL',
      nameTextStyle: { color: ct.axis.label, fontSize: 11 },
      splitLine: { lineStyle: { color: ct.axis.splitLine, type: 'dashed' } },
      axisLabel: { color: ct.axis.label, fontSize: 11 },
    },
    series: [
      {
        name: 'Input',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: '#388BFD' },
        areaStyle: { color: 'rgba(56, 139, 253, 0.15)' },
        data: history.map((d) => [d.timestamp, d.input_mL]),
      },
      {
        name: 'Drainage',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: '#D29922' },
        areaStyle: { color: 'rgba(210, 153, 34, 0.15)' },
        data: history.map((d) => [d.timestamp, d.drainage_mL]),
      },
      {
        name: 'Water Used',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: '#3FB950' },
        areaStyle: { color: 'rgba(63, 185, 80, 0.15)' },
        data: history.map((d) => [d.timestamp, d.water_used_mL]),
      },
    ],
    dataZoom: [{ type: 'inside', start: 0, end: 100 }],
  };

  if (history.length === 0) {
    return <div className="flex items-center justify-center h-[280px] text-text-muted text-sm">Waiting for data...</div>;
  }

  return <ReactECharts option={option} style={{ height: '100%', minHeight: 320 }} />;
}
