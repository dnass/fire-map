import './App.css';
import { useState, useEffect } from 'react';
import Map from './components/Map';
import Controls from './components/Controls';
// import Minimap from './components/Minimap';
import { calculateCumulative } from './utils';

const App = () => {
  const [data, setData] = useState({});
  const [date, setDate] = useState();
  const [visible, setVisible] = useState([]);
  const [selected, setSelected] = useState('Total area');
  const [bounds, setBounds] = useState([[], []]);

  useEffect(() => {
    (async () => setData(await import('./data')))();
  }, []);

  const {
    perimeters = [],
    dateRange = [],
    cumulative = [],
    active = []
  } = data;

  if (!date && dateRange.length) setDate(dateRange[1]);

  const updateVisibleArea = ({ target: map }) => {
    if (!map.loaded() || !map.getLayer('perimeter-fill')) return;

    const cumulative = calculateCumulative(
      map.queryRenderedFeatures(null, {
        layers: ['perimeter-fill']
      })
    );

    setVisible(cumulative);
  };

  return (
    <div className='App'>
      <Controls
        {...{ date, setDate, dateRange, selected, setSelected }}
        cumulative={selected === 'Total area' ? cumulative : visible}
      />
      {/* <Minimap {...{ bounds }} /> */}
      <Map {...{ date, perimeters, active, updateVisibleArea, setBounds }} />
    </div>
  );
};

export default App;
