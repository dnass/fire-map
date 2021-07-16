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
