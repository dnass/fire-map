import 'mapbox-gl/dist/mapbox-gl.css';
// import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useState, useRef } from 'react';
import MapGL, {
  Source,
  Layer,
  GeolocateControl,
  AttributionControl,
  ScaleControl,
  WebMercatorViewport
} from 'react-map-gl';
// import Geocoder from 'react-map-gl-geocoder';
import { scaleLinear } from 'd3-scale';
import { easeCubicOut } from 'd3-ease';
import { easeInterpolate } from '../utils';

const MAPBOX_TOKEN =
  'pk.eyJ1IjoiZG5sbnNzIiwiYSI6ImNrcXk0b2w0ejE0eGgyc3RmMGhhaXV5MjYifQ.ZLXTR3Qb8ZLP9zSit_Rz0w';

const opacity = scaleLinear()
  .domain([0, 7])
  .range([0.9, 0.3])
  .interpolate(easeInterpolate(easeCubicOut))
  .clamp(true);

const Map = ({
  perimeters = [],
  active = [],
  date,
  updateVisibleArea,
  setBounds
}) => {
  const mapRef = useRef();
  // const geocoderRef = useRef();

  const [viewport, setViewport] = useState(
    new WebMercatorViewport({
      width: window.innerWidth,
      height: window.innerHeight
    }).fitBounds([
      [-135, 42],
      [-61, 63]
    ])
  );

  const onViewportChange = viewport => {
    setViewport(viewport);

    const bounds = new WebMercatorViewport({
      width: window.innerWidth,
      height: window.innerHeight,
      ...viewport
    }).getBounds();

    setBounds(bounds);
  };

  const opacities = perimeters.map(d => {
    const diff = (date - d.properties.date) / 86400000;
    return diff < 0 ? 0 : opacity(diff);
  });

  const labelOpacities = active.map(d => (d.startDate <= date ? 0.8 : 0));

  return (
    <>
      {/* <div
        ref={geocoderRef}
        style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}
      /> */}
      <MapGL
        {...viewport}
        width='100%'
        height='100%'
        mapStyle='mapbox://styles/mapbox/dark-v9'
        onViewportChange={onViewportChange}
        onLoad={() => mapRef.current.getMap().on('render', updateVisibleArea)}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
        ref={mapRef}
      >
        {/* <Geocoder
          mapRef={mapRef}
          containerRef={geocoderRef}
          onViewportChange={setViewport}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          position='top-right'
          zoom={9}
          marker={false}
          countries='ca'
        /> */}
        <GeolocateControl
          showUserLocation={false}
          fitBoundsOptions={{ maxZoom: 8 }}
          style={{ right: 10, top: 10 }}
        />
        <Source
          type='geojson'
          data={{ type: 'FeatureCollection', features: perimeters }}
        >
          <Layer
            id='perimeter-fill'
            type='fill'
            paint={{
              'fill-color': 'tomato',
              'fill-outline-color': 'rgba(0,0,0,0)',
              'fill-opacity': ['at', ['get', 'id'], ['literal', opacities]]
            }}
          />
          {[10, 7, 4, 1].map(width => (
            <Layer
              key={width}
              id={`perimeter-line-${width}`}
              type='line'
              paint={{
                'line-blur': width,
                'line-width': width,
                'line-color':
                  width === 1 ? 'rgba(255, 255, 255, 0.6)' : 'tomato',
                'line-opacity': [
                  'step',
                  ['zoom'],
                  0,
                  6,
                  [
                    'case',
                    ['==', ['at', ['get', 'id'], ['literal', opacities]], 0.9],
                    0.7,
                    0
                  ]
                ]
              }}
              layout={{ 'line-join': 'bevel' }}
            />
          ))}
        </Source>
        <Source
          type='geojson'
          data={{
            type: 'FeatureCollection',
            features: active.map(({ coordinates, ...properties }) => ({
              geometry: { type: 'Point', coordinates },
              properties
            }))
          }}
        >
          <Layer
            id='labels'
            type='symbol'
            paint={{
              'text-color': '#fff',
              'text-halo-color': '#222',
              'text-halo-width': 1,
              'text-opacity': [
                'step',
                ['zoom'],
                0,
                5,
                ['at', ['get', 'id'], ['literal', labelOpacities]]
              ]
            }}
            layout={{ 'text-field': ['get', 'name'], 'text-size': 11 }}
          />
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
        <ScaleControl
          maxWidth={120}
          style={{ left: 5, bottom: 40, fontFamily: 'sans-serif' }}
        />
        <AttributionControl
          style={{
            bottom: 0,
            right: 0,
            fontFamily: 'sans-serif',
            fontSize: 12
          }}
          customAttribution='By <a href="https://danielnass.net">Daniel Nass</a> | Data from <a href="https://cwfis.cfs.nrcan.gc.ca/index.php/datamart/metadata/fm3buffered">Canadian Forest Service</a>'
        />
      </MapGL>
    </>
  );
};

export default Map;
