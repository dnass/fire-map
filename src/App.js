import './App.css';
import { useState, useEffect } from 'react';
import MapGL, {
  Source,
  Layer,
  GeolocateControl,
  WebMercatorViewport,
  AttributionControl
} from 'react-map-gl';
import { scaleLinear } from 'd3-scale';
import { perimeters, dateRange } from './data';
import differenceInDays from 'date-fns/differenceInDays';

const MAPBOX_TOKEN =
  'pk.eyJ1IjoiZG5sbnNzIiwiYSI6ImNrcXk0b2w0ejE0eGgyc3RmMGhhaXV5MjYifQ.ZLXTR3Qb8ZLP9zSit_Rz0w';

const ONE_DAY = 86400000;

const fill = {
  'fill-color': 'tomato',
  'fill-outline-color': 'rgba(0,0,0,0)',
  'fill-opacity': ['get', 'opacity']
};

const lineLayout = {
  'line-join': 'bevel'
};

const opacity = scaleLinear().domain([0, 7]).range([0.9, 0.3]).clamp(true);

const App = () => {
  const [viewport, setViewport] = useState(
    new WebMercatorViewport({
      width: window.innerWidth,
      height: window.innerHeight
    }).fitBounds([
      [-135, 42],
      [-61, 63]
    ])
  );

  const [date, setDate] = useState(dateRange[1]);

  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playing && date < dateRange[1]) {
        setDate(date + ONE_DAY);
      } else {
        setPlaying(false);
      }
    }, 250);

    return () => clearInterval(interval);
  });

  const perimeter = {
    type: 'FeatureCollection',
    features: perimeters
      .map(d => {
        d.properties.diff = differenceInDays(date, d.properties.date);
        d.properties.opacity = opacity(d.properties.diff);
        return d;
      })
      .filter(d => d.properties.diff >= 0)
  };

  const play = () => {};

  return (
    <div className='App'>
      <div className='controls'>
        <button onClick={() => setDate(Math.max(date - ONE_DAY, dateRange[0]))}>
          ⏮️
        </button>
        <button onClick={() => setPlaying(!playing)}>
          {playing ? '⏸️' : '▶️'}
        </button>
        <button onClick={() => setDate(Math.min(date + ONE_DAY, dateRange[1]))}>
          ⏭️
        </button>
        <input
          type='range'
          min={+dateRange[0]}
          max={+dateRange[1]}
          value={date}
          onChange={e => setDate(+e.target.value)}
        />
        <span>{new Date(date).toLocaleDateString()}</span>
      </div>
      <MapGL
        {...viewport}
        width='100%'
        height='100%'
        mapStyle='mapbox://styles/mapbox/dark-v9'
        onViewportChange={setViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
      >
        <GeolocateControl
          showUserLocation={false}
          fitBoundsOptions={{ maxZoom: 8 }}
          style={{ right: 10, top: 10 }}
        />
        <Source type='geojson' data={perimeter}>
          <Layer id='outerfill' type='fill' paint={fill} />
          {[10, 7, 4, 1].map(width => {
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
                  'line-opacity': [
                    'step',
                    ['zoom'],
                    0,
                    7,
                    ['case', ['==', ['get', 'opacity'], 0.9], 0.7, 0]
                  ]
                }}
                layout={lineLayout}
              />
            );
          })}
        </Source>
        <Source type='raster-dem' url='mapbox://mapbox.mapbox-terrain-dem-v1'>
          <Layer
            id='hillshade'
            type='hillshade'
            paint={{
              'hillshade-highlight-color': 'rgba(200, 200, 200, 0.4)',
              'hillshade-shadow-color': 'rgba(25, 25, 25, 0.6)'
            }}
            beforeId='waterway-river-canal'
          />
        </Source>
        <AttributionControl
          style={{
            bottom: 0,
            right: 0,
            fontFamily: 'sans-serif',
            fontSize: 12
          }}
          customAttribution={
            'By <a href="https://danielnass.net">Daniel Nass</a> | Data from <a href="https://cwfis.cfs.nrcan.gc.ca/index.php/datamart/metadata/fm3buffered">Canadian Forest Service</a>'
          }
        />
      </MapGL>
    </div>
  );
};

export default App;
