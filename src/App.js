import './App.css';
import { useState, useEffect } from 'react';
import Map from './components/Map';
import Controls from './components/Controls';
import { parseData } from './utils';

const App = () => {
  const [perimeters, setPerimeters] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [cumulative, setCumulative] = useState([]);
  const [date, setDate] = useState();

  useEffect(() => {
    (async () => {
      const data = await import('./data/perimeters.json');
      const { perimeters, dateRange, cumulative } = parseData(data);

      setPerimeters(perimeters);
      setDateRange(dateRange);
      setCumulative(cumulative);
      setDate(dateRange[1]);
    })();
  }, []);

  return (
    <div className='App'>
      <Controls {...{ date, setDate, dateRange, cumulative }} />
      <Map {...{ date, perimeters }} />
    </div>
  );
};

export default App;
