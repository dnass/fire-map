import './App.css';
import { useState } from 'react';
import Map from './components/Map';
import Controls from './components/Controls';
import { dateRange } from './data';

const App = () => {
  const [date, setDate] = useState(dateRange[1]);

  return (
    <div className='App'>
      <Controls date={date} setDate={setDate} />
      <Map date={date} />
    </div>
  );
};

export default App;
