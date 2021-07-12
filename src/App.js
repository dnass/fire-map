import './App.css';
import { useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { rollups, sum, cumsum, zip } from 'd3-array';
import differenceInDays from 'date-fns/differenceInDays';
import Map from './components/Map';
import Controls from './components/Controls';
import { perimeters, dateRange } from './data';

const opacity = scaleLinear().domain([0, 7]).range([0.9, 0.3]).clamp(true);

const App = () => {
  const [date, setDate] = useState(dateRange[1]);

  const features = perimeters.map(d => {
    d.properties.diff = differenceInDays(date, d.properties.date);
    d.properties.opacity = opacity(d.properties.diff);
    return d;
  });

  const areas = rollups(
    features,
    v => sum(v, d => d.properties.area),
    d => d.properties.date
  );

  const cumulative = zip(
    areas.map(([d]) => d),
    areas.map(([, d]) => d),
    cumsum(areas, ([, d]) => d)
  ).map(([date, areaToday, areaCumulative]) => ({
    date,
    areaToday,
    areaCumulative
  }));

  const data = {
    type: 'FeatureCollection',
    features: features.filter(d => d.properties.diff >= 0)
  };

  return (
    <div className='App'>
      <Controls date={date} setDate={setDate} areas={cumulative} />
      <Map data={data} />
    </div>
  );
};

export default App;
