const tween = KUTE.fromTo(
    '#blob1',
    { path: '#blob1' },
    { path: '#blob2' },
    { repeat: 999, duration: 6000, yoyo: true }
  ).start();