import './App.css';
import { useState } from 'react';
import MapGL, { Source, Layer, GeolocateControl } from 'react-map-gl';
import { perimeters, dateRange } from './data';
import union from '@turf/union';
import buffer from '@turf/buffer';

const MAPBOX_TOKEN =
  'pk.eyJ1IjoiZG5sbnNzIiwiYSI6ImNrcXk0b2w0ejE0eGgyc3RmMGhhaXV5MjYifQ.ZLXTR3Qb8ZLP9zSit_Rz0w';

const fill = { 'fill-color': 'tomato' };

const linePaint = {
  'line-blur': 5,
  'line-color': 'tomato'
};

const lineLayout = {
  'line-join': 'bevel'
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

  const filteredPerimeters = {
    type: 'FeatureCollection',
    features: perimeters.filter(d => d.properties.date <= date)
  };

  // const filteredPerimeters = union(
  //   ...perimeters.filter(d => d.properties.date <= date)
  // );

  // console.log(filteredPerimeters);

  return (
    <div className='App'>
      <button onClick={() => setDate(date - 86400000)}>–</button>
      <button onClick={() => setDate(date + 86400000)}>+</button>
      <input
        type='range'
        min={+dateRange[0]}
        max={+dateRange[1]}
        value={date}
        onChange={e => setDate(+e.target.value)}
      />
      {new Date(date).toLocaleDateString()}
      <MapGL
        {...viewport}
        width='100%'
        height='100%'
        mapStyle='mapbox://styles/mapbox/dark-v9'
        onViewportChange={setViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        <GeolocateControl
          showUserLocation={false}
          fitBoundsOptions={{ maxZoom: 8 }}
          style={{ right: 10, top: 10 }}
        />
        <Source type='geojson' data={filteredPerimeters}>
          <Layer id='firefill' type='fill' paint={fill} />
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
        <Source type='raster-dem' url='mapbox://mapbox.mapbox-terrain-dem-v1'>
          <Layer
            id='hillshade'
            type='hillshade'
            beforeId='waterway-river-canal'
          />
        </Source>
      </MapGL>
    </div>
  );
};

export default App;
