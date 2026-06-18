'use client';
/* Atom Agent Builder — Lucide-style stroke icons + brand mark.
   Stroke 2px, round caps/joins, 24px grid. Mirrors the product's icon set.
   Exposes window.Icon (generic) + named helpers. */
  const S = ({ children, size = 20, stroke = 2, fill = 'none', style }) =>
    React.createElement('svg', {
      xmlns: 'http://www.w3.org/2000/svg', width: size, height: size,
      viewBox: '0 0 24 24', fill, stroke: fill === 'none' ? 'currentColor' : 'none',
      strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round', style
    }, children);

  const P = (d, key) => React.createElement('path', { d, key });
  const Raw = (el) => el;

  const PATHS = {
    arrowLeft: ['m12 19-7-7 7-7', 'M19 12H5'],
    x: ['M18 6 6 18', 'm6 6 12 12'],
    plus: ['M5 12h14', 'M12 5v14'],
    settings: ['M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
    history: ['M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8', 'M3 3v5h5', 'M12 7v5l4 2'],
    flask: ['M10 2v7.31', 'M14 9.3V2', 'M8.5 2h7', 'M14 9.3a6.5 6.5 0 1 1-4 0', 'M5.58 16.5h12.85'],
    play: ['M8 5v14l11-7z'],
    cloudUpload: ['M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242', 'M12 12v9', 'm8 17 4-4 4 4'],
    rocket: ['M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z', 'm12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z', 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0', 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5'],
    wrench: ['M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'],
    copy: ['M8 8m0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2z', 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2'],
    trash: ['M3 6h18', 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6', 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2', 'M10 11v6', 'M14 11v6'],
    pencil: ['M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z', 'm15 5 4 4'],
    activity: ['M3 12h4l3 8 4-16 3 8h4'],
    bot: ['M12 6V2H8', 'm8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z', 'M2 12h2', 'M9 11v2', 'M15 11v2', 'M20 12h2'],
    check: ['M20 6 9 17l-5-5'],
    flag: ['M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z', 'M4 22v-7'],
    help: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3', 'M12 17h.01'],
    calendar: ['M8 2v4', 'M16 2v4', 'M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'],
    user: ['M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
    msgCircle: ['M7.9 20A9 9 0 1 0 4 16.1L2 22z'],
    dots: ['M12 12m-1 0a1 1 0 1 0 2 0 1 1 0 1 0-2 0', 'M12 5m-1 0a1 1 0 1 0 2 0 1 1 0 1 0-2 0', 'M12 19m-1 0a1 1 0 1 0 2 0 1 1 0 1 0-2 0'],
    chevDown: ['m6 9 6 6 6-6'],
    eye: ['M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
    circleX: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'm15 9-6 6', 'm9 9 6 6'],
    target: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
    route: ['M6 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M18 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M11.5 8H16a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H8a3 3 0 0 0-3 3v0a3 3 0 0 0 3 3h4.5'],
    book: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'],
    clipboard: ['M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2', 'M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z', 'M9 12h6', 'M9 16h4'],
    splitArrows: ['M16 3h5v5', 'M8 21H3v-5', 'M21 3l-7.5 7.5', 'M3 21l7.5-7.5'],
    undo: ['M3 7v6h6', 'M3 13a9 9 0 1 0 3-7.7L3 8'],
    externalLink: ['M15 3h6v6', 'M10 14 21 3', 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'],
    alertTriangle: ['m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z', 'M12 9v4', 'M12 17h.01'],
    chevRight: ['m9 18 6-6-6-6'],
    arrowRight: ['M5 12h14', 'm12 5 7 7-7 7'],
    trendUp: ['M16 7h6v6', 'm22 7-8.5 8.5-5-5L2 17']
  };

  function Icon({ name, size = 20, stroke = 2, style }) {
    const ds = PATHS[name];
    if (!ds) return null;
    return S({ size, stroke, style, children: ds.map((d, i) => P(d, i)) });
  }

  // Solid icons (filled)
  function Sparkles({ size = 20, style }) {
    return React.createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24', fill: 'currentColor', style },
      React.createElement('path', { d: 'M12 2l2.2 5.6L20 9.8l-5.8 2.2L12 18l-2.2-6L4 9.8l5.8-2.2z' }),
      React.createElement('path', { d: 'M19 13l.8 2.2L22 16l-2.2.8L19 19l-.8-2.2L16 16l2.2-.8z' }),
    );
  }
  function PlaySolid({ size = 18, style }) {
    return React.createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24', fill: 'currentColor', style },
      React.createElement('path', { d: 'M8 5v14l11-7z' }));
  }
  function CircleCheck({ size = 22, color = '#16A34A', style }) {
    return React.createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', style },
      React.createElement('circle', { cx: 12, cy: 12, r: 10 }), React.createElement('path', { d: 'm9 12 2 2 4-4' }));
  }
  function CircleAlert({ size = 22, color = '#DC2626', style }) {
    return React.createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', style },
      React.createElement('circle', { cx: 12, cy: 12, r: 10 }), React.createElement('path', { d: 'M12 8v4' }), React.createElement('path', { d: 'M12 16h.01' }));
  }
  function AtomMark({ size = 28, style }) {
    return React.createElement('img', { src: (window.__resources && window.__resources.atomIsotype) || 'assets/atom-isotype.svg', width: size, height: size, alt: 'Atom', style });
  }

export { Icon, Sparkles, PlaySolid, CircleCheck, CircleAlert, AtomMark };
