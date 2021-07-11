import './App.css';
import { useState } from 'react';
import MapGL, { Source, Layer } from 'react-map-gl';
import { perimeters, dateRange } from './data';

const MAPBOX_TOKEN =
  'pk.eyJ1IjoiZG5sbnNzIiwiYSI6ImNrcXk0b2w0ejE0eGgyc3RmMGhhaXV5MjYifQ.ZLXTR3Qb8ZLP9zSit_Rz0w';

const fill = { 'fill-color': 'tomato', 'fill-opacity': 0.7 };

const linePaint = {
  'line-blur': 5,
  'line-color': 'tomato'
};

const lineLayout = {
  'line-join': 'round'
};

const App = () => {
  const [viewport, setViewport] = useState({
    latitude: 60,
    longitude: -100,
    zoom: 3,
    bearing: 0,
    pitch: 0
  });

  const [date, setDate] = useState(dateRange[1]);

  return (
    <div className='App'>
      <input
        type='range'
        min={+dateRange[0]}
        max={+dateRange[1]}
        onChange={e => setDate(e.target.value)}
      />
      {/* {new Date(date).toString()} */}
      <MapGL
        {...viewport}
        width='100%'
        height='100%'
        mapStyle='mapbox://styles/mapbox/dark-v9'
        onViewportChange={setViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        <Source type='geojson' data={perimeters}>
          {/* <Layer id='firefill' type='fill' paint={fill} /> */}
          {[12, 8, 4, 1].map(width => {
            const bright = width === 1;

            return (
              <Layer
                key={width}
                id={`line-${width}`}
                type='line'
                paint={{
                  'line-blur': width,
                  'line-width': width,
                  'line-color': bright ? '#ffa291' : 'tomato',
                  'line-opacity': 0.8
                }}
                layout={lineLayout}
              />
            );
          })}
        </Source>
      </MapGL>
    </div>
  );
};

export default App;
