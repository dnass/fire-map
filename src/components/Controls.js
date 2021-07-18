import './Controls.css';
import 'react-datepicker/dist/react-datepicker.css';
import { useState, useEffect, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import format from 'date-fns/format';
import preval from 'preval.macro';
import Chart from './Chart';
import { loop } from '../utils';

const formatHa = n => `${Math.round(n).toLocaleString()} ha`;

const lastUpdated = preval`module.exports = +new Date();`;

const Controls = ({
  date,
  setDate,
  dateRange,
  cumulative,
  selected,
  setSelected
}) => {
  const isLoading = !date;

  const [playing, setPlaying] = useState(false);

  const changeDate = increment =>
    setDate(date =>
      Math.min(
        dateRange[1],
        Math.max(dateRange[0], date + increment * 86400000)
      )
    );

  useEffect(() => {
    return loop(() => {
      if (playing && date < dateRange[1]) {
        changeDate(1);
      } else {
        setPlaying(false);
      }
    }, 250);
  });

  const { areaToday = 0, areaCumulative = 0 } =
    [...cumulative].reverse().find(d => d.date <= date) || {};

  const DateInput = forwardRef(({ value, onClick }, ref) => (
    <button className='date' onClick={onClick} ref={ref}>
      {value}
    </button>
  ));

  return (
    <div className='panel'>
      {isLoading ? (
        <div>Loading data...</div>
      ) : (
        <>
          <DatePicker
            selected={date}
            onChange={date => setDate(+date)}
            minDate={dateRange[0]}
            maxDate={dateRange[1]}
            dateFormat='MMM d, yyyy'
            customInput={<DateInput />}
          />
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
          <div className='button-group'>
            {['Total area', 'In view'].map(label => (
              <button
                key={label}
                onClick={() => setSelected(label)}
                className={`toggle ${label === selected ? 'active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className='controls'>
            {cumulative.length ? (
              <>
                <div className='stats'>
                  <div>
                    <span className='label'>{format(date, 'MMM d')} area</span>
                    <span>{formatHa(areaToday)}</span>
                  </div>
                  <div>
                    <span className='label'>YTD area</span>
                    <span>{formatHa(areaCumulative)}</span>
                  </div>
                </div>
                <Chart {...{ data: cumulative, date, dateRange }} />
              </>
            ) : (
              <>No fires in view.</>
            )}
          </div>
          <div className='label'>
            Last updated: {format(lastUpdated, 'MMM d, yyyy h:mm aaa')}
          </div>
        </>
      )}
    </div>
  );
};

export default Controls;
