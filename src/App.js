import './App.css';
import { useState, useEffect } from 'react';
import Map from './components/Map';
import Controls from './components/Controls';

const App = () => {
  const [data, setData] = useState({});
  const [date, setDate] = useState();
  const [visibleArea, setVisibleArea] = useState();

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

  return (
    <div className='App'>
      <Controls {...{ date, setDate, dateRange, cumulative, visibleArea }} />
      <Map {...{ date, perimeters, active, setVisibleArea }} />
    </div>
  );
};

export default App;
