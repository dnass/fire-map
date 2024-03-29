import { scaleLinear } from 'd3-scale';
import { area, curveStepAfter } from 'd3-shape';
import { extent } from 'd3-array';

const width = 128,
  height = 64;

const Chart = ({ data, date, dateRange }) => {
  const x = scaleLinear().domain(dateRange).range([0, width]);

  const y = scaleLinear()
    .domain(extent(data, ({ areaCumulative }) => areaCumulative))
    .range([height, 0]);

  const path = area()
    .x(({ date }) => x(date))
    .y0(() => height)
    .y1(({ areaCumulative }) => y(areaCumulative))
    .curve(curveStepAfter);

  return (
    <svg width={width} height={height}>
      <path fill='tomato' opacity={0.3} d={path(data)} />
      <path fill='tomato' d={path(data.filter(d => d.date <= date))} />
    </svg>
  );
};

export default Chart;
