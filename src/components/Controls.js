import './Controls.css';
import { useState, useEffect } from 'react';
import format from 'date-fns/format';
import Chart from './Chart';
import { dateRange, cumulative } from '../data';

const formatHa = n => `${Math.round(n).toLocaleString()} ha`;

const Controls = ({ date, setDate }) => {
  const [playing, setPlaying] = useState(false);

  const changeDate = increment => {
    const newDate = date + increment * 86400000;
    if (increment > 0) setDate(Math.min(dateRange[1], newDate));
    else if (increment < 0) setDate(Math.max(dateRange[0], newDate));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (playing && date < dateRange[1]) {
        changeDate(1);
      } else {
        setPlaying(false);
      }
    }, 250);

    return () => clearInterval(interval);
  });

  const today = cumulative.find(d => d.date >= date);

  return (
    <div className='panel'>
      <div className='date'>{format(date, 'MMM d, yyyy')}</div>
      <div className='controls'>
        <button onClick={() => changeDate(-1)}>⏮️</button>
        <button onClick={() => setPlaying(!playing)}>
          {playing ? '⏸️' : '▶️'}
        </button>
        <button onClick={() => changeDate(1)}>⏭️</button>
        <input
          type='range'
          min={+dateRange[0]}
          max={+dateRange[1]}
          step={86400000}
          value={date}
          onChange={e => setDate(+e.target.value)}
        />
      </div>
      <div className='controls'>
        <div className='stats'>
          <div>
            <span className='label'>Fire area this day</span>
            <span>{formatHa(today.areaToday)}</span>
          </div>
          <div>
            <span className='label'>Total fire area</span>
            <span>{formatHa(today.areaCumulative)}</span>
          </div>
        </div>
        <Chart data={cumulative} date={date} />
      </div>
    </div>
  );
};

export default Controls;
