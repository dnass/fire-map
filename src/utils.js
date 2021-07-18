import { rollups, sum, cumsum, zip } from 'd3-array';
import { interpolate } from 'd3-interpolate';

export const loop = (fn, interval) => {
  let raf;

  let then = Date.now();

  return (function loop() {
    raf = requestAnimationFrame(loop);

    const now = Date.now();
    const delta = now - then;

    if (delta > interval) {
      then = now - (delta % interval);
      fn();
    }

    return () => cancelAnimationFrame(raf);
  })();
};

export const calculateCumulative = features => {
  const areas = rollups(
    features.sort((a, b) => a.properties.date - b.properties.date),
    v => sum(v, d => d.properties.area),
    d => d.properties.date
  );

  const cumulative = zip(
    areas.map(([d]) => d),
    areas.map(([, d]) => d),
    cumsum(areas, ([, d]) => d)
  ).map(([date, areaToday, areaCumulative]) => ({
    date,
    areaToday,
    areaCumulative
  }));

  return cumulative;
};

export const easeInterpolate = ease => (a, b) => {
  const i = interpolate(a, b);
  return t => i(ease(t));
};
