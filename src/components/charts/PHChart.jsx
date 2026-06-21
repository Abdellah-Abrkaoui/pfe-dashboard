import ReactECharts from 'echarts-for-react';
import { useAppStore } from '../../store/appStore';
import { useChartTheme } from '../../utils/chartTheme';

export default function PHChart({ showGauge = false }) {
  const history = useAppStore((s) => s.sensorHistory);
  const latestReading = useAppStore((s) => s.latestReading);
  const ct = useChartTheme();

  if (showGauge) {
    const gaugeOption = {
      backgroundColor: 'transparent',
      series: [{
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 14,
        splitNumber: 7,
        radius: '90%',
        center: ['50%', '70%'],
        axisLine: {
          lineStyle: {
            width: 12,
            color: [
              [0.39, '#F85149'],
              [0.46, '#3FB950'],
              [0.54, '#D29922'],
              [1, '#F85149'],
            ],
          },
        },
        pointer: { width: 4, length: '60%', itemStyle: { color: ct.pointer } },
        axisTick: { show: false },
        splitLine: { length: 12, lineStyle: { color: ct.axis.line } },
        axisLabel: { color: ct.axis.label, fontSize: 10, distance: 15 },
        detail: {
          valueAnimation: true,
          fontSize: 22,
          fontFamily: 'JetBrains Mono',
          color: ct.pointer,
          offsetCenter: [0, '20%'],
          formatter: '{value}',
        },
        data: [{ value: latestReading.ph }],
      }],
    };
    return <ReactECharts option={gaugeOption} style={{ height: '100%', minHeight: 200 }} />;
  }

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
      name: 'pH',
      min: 4,
      max: 9,
      nameTextStyle: { color: ct.axis.label, fontSize: 11 },
      splitLine: { lineStyle: { color: ct.axis.splitLine, type: 'dashed' } },
      axisLabel: { color: ct.axis.label, fontSize: 11 },
    },
    visualMap: {
      show: false,
      pieces: [
        { lte: 5.5, color: '#F85149' },
        { gt: 5.5, lte: 6.8, color: '#3FB950' },
        { gt: 6.8, lte: 7.5, color: '#D29922' },
        { gt: 7.5, color: '#F85149' },
      ],
    },
    series: [{
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2 },
      data: history.map((d) => [d.timestamp, d.ph]),
    }],
  };

  if (history.length === 0) {
    return <div className="flex items-center justify-center h-[280px] text-text-muted text-sm">Waiting for data...</div>;
  }

  return <ReactECharts option={option} style={{ height: 280 }} />;
}
