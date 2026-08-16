const candles = [
  {x: 108, y: 84},
  {x: 134, y:  86},
  {x: 158, y:  80},
  {x: 184, y:  80},
  {x: 210, y:  90},
  {x: 228, y:  76},
  {x: 252, y:  84},
  {x: 268, y: 86},
];

let blown = 0;
const svg = document.getElementById('cSvg');
const ns  = 'http://www.w3.org/2000/svg';

candles.forEach((c, i) => {
  const g = document.createElementNS(ns, 'g');
  g.id = 'cd' + i;

  /* Flame */
  const flameG = document.createElementNS(ns, 'g');
  flameG.id = 'fl' + i;

  const outer = document.createElementNS(ns, 'ellipse');
  outer.setAttribute('cx', c.x);
  outer.setAttribute('cy', c.y - 9);
  outer.setAttribute('rx', '5');
  outer.setAttribute('ry', '9');
  outer.setAttribute('fill', '#ffaa00');
  outer.setAttribute('opacity', '0.95');

  const inner = document.createElementNS(ns, 'ellipse');
  inner.setAttribute('cx', c.x);
  inner.setAttribute('cy', c.y - 7);
  inner.setAttribute('rx', '2.5');
  inner.setAttribute('ry', '5');
  inner.setAttribute('fill', '#fff9c4');
  inner.setAttribute('opacity', '0.9');

  flameG.appendChild(outer);
  flameG.appendChild(inner);

  /* Smoke */
  const smokeG = document.createElementNS(ns, 'g');
  smokeG.id = 'sm' + i;
  smokeG.style.opacity = '0';

  for (let p = 0; p < 4; p++) {
    const puff = document.createElementNS(ns, 'ellipse');
    puff.setAttribute('cx', c.x + (p % 2 === 0 ? -1.5 : 1.5));
    puff.setAttribute('cy', c.y - 12 - p * 7);
    puff.setAttribute('rx', String(3 + p * 0.5));
    puff.setAttribute('ry', String(3 + p * 0.3));
    puff.setAttribute('fill', '#999');
    puff.setAttribute('opacity', String(0.55 - p * 0.12));
    smokeG.appendChild(puff);
  }

  /* Hit area */
  const hit = document.createElementNS(ns, 'ellipse');
  hit.setAttribute('cx', c.x);
  hit.setAttribute('cy', c.y - 9);
  hit.setAttribute('rx', '14');
  hit.setAttribute('ry', '18');
  hit.setAttribute('fill', 'transparent');
  hit.setAttribute('class', 'candle-hit');

  g.appendChild(flameG);
  g.appendChild(smokeG);
  g.appendChild(hit);
  svg.appendChild(g);

  /* Click */
  hit.addEventListener('click', () => {
    if (flameG.style.display === 'none') return;
    flameG.style.display = 'none';

    const puffs = Array.from(smokeG.querySelectorAll('ellipse'));
    smokeG.style.opacity = '1';

    puffs.forEach((p, pi) => {
      p.style.transition = 'none';
      p.style.opacity = String(0.55 - pi * 0.12);
    });

    requestAnimationFrame(() => requestAnimationFrame(() => {
      puffs.forEach((p, pi) => {
        const origCy = parseFloat(p.getAttribute('cy'));
        p.style.transition =
          'cy 0.8s ease ' + (pi * 0.09) + 's, opacity 0.8s ease ' + (pi * 0.09) + 's';
        p.setAttribute('cy', String(origCy - 18));
        p.style.opacity = '0';
      });
    }));

    blown++;
    if (blown === candles.length) {
      const btn = document.getElementById('next-btn');
      btn.style.display = 'flex';
    }
  });
});
