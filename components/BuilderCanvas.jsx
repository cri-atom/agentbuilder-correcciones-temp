'use client';
import { Icon, AtomMark, Sparkles, PlaySolid } from './icons';
import { IconButton } from './primitives';
import React from 'react';
/* Atom Agent Builder — canvas chrome: LogoBar, Toolbar, Canvas (agent nodes).
   Depends on icons.jsx + primitives.jsx. Exposes BuilderCanvas. */
  function LogoBar() {
    return React.createElement('div', {
      style: { position: 'absolute', top: 18, left: 18, display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '8px 16px 8px 10px', boxShadow: 'var(--shadow-sm)', zIndex: 20 }
    },
      React.createElement(AtomMark, { size: 30 }),
      React.createElement('button', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--gray-700)' } }, React.createElement(Icon, { name: 'arrowLeft', size: 20 })),
      React.createElement('span', { style: { fontSize: 16, fontWeight: 500, color: 'var(--gray-700)' } }, 'Nuevo Agente'));
  }

  function Toolbar({ onEval, onToast, onCorregir }) {
    const pill = { width: 38, height: 38, borderRadius: 'var(--r-pill)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink)', border: 'none', background: 'none', transition: 'background .15s' };
    const hov = { onMouseEnter: e => e.currentTarget.style.background = 'var(--surface-2)', onMouseLeave: e => e.currentTarget.style.background = 'transparent' };
    const Pill = (props, child) => React.createElement('button', { style: pill, ...hov, ...props }, child);
    return React.createElement('div', { style: { position: 'absolute', top: 18, right: 18, display: 'flex', alignItems: 'center', gap: 4, background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-pill)', padding: 5, boxShadow: 'var(--shadow-sm)', zIndex: 20 } },
      Pill({ title: 'Corregir con IA', onClick: onCorregir, style: { ...pill, color: 'var(--ai-purple)' } }, React.createElement(Sparkles, { size: 18 })),
      Pill({ title: 'Historial' }, React.createElement(Icon, { name: 'history', size: 18 })),
      Pill({ title: 'Evaluaciones', onClick: onEval }, React.createElement(Icon, { name: 'flask', size: 18 })),
      Pill({ title: 'Probar' }, React.createElement(PlaySolid, { size: 16 })),
      React.createElement('button', { onClick: onToast, style: { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '0 14px', height: 38, borderRadius: 'var(--r-pill)', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }, ...hov }, React.createElement(Icon, { name: 'cloudUpload', size: 18 }), 'Guardar'),
      React.createElement('button', { disabled: true, style: { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '0 16px', height: 38, borderRadius: 'var(--r-pill)', border: 'none', background: 'var(--surface-2)', cursor: 'not-allowed', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--gray-300)' } }, React.createElement(Icon, { name: 'rocket', size: 18 }), 'Publicar'));
  }

  function PlusButton() {
    return React.createElement('button', { style: { width: 40, height: 40, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--gray-700)', margin: '14px auto' }, onMouseEnter: e => e.currentTarget.style.background = 'var(--surface-2)', onMouseLeave: e => e.currentTarget.style.background = '#fff' }, React.createElement(Icon, { name: 'plus', size: 18 }));
  }

  function AgentNode({ title, tools, actions }) {
    const [hover, setHover] = React.useState(false);
    return React.createElement('div', { style: { position: 'relative', width: 320 }, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) },
      React.createElement('div', { style: { background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '18px 20px', boxShadow: 'var(--shadow-xs)', display: 'flex', alignItems: 'center', gap: 14 } },
        React.createElement('div', { style: { width: 46, height: 46, borderRadius: 'var(--r-md)', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', color: 'var(--ink)' } }, React.createElement(Icon, { name: 'bot', size: 24 })),
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' } }, title),
          tools && React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, background: 'var(--surface-2)', borderRadius: 'var(--r-pill)', padding: '3px 9px', fontSize: 12, fontWeight: 600, color: 'var(--gray-700)' } }, React.createElement(Icon, { name: 'wrench', size: 12 }), '+', tools))),
      actions && hover && React.createElement('div', { style: { position: 'absolute', top: 0, right: -52, display: 'flex', flexDirection: 'column', gap: 8 } },
        React.createElement(IconButton, { name: 'copy', title: 'Duplicar' }),
        React.createElement(IconButton, { name: 'trash', danger: true, title: 'Eliminar' })));
  }

  function BuilderCanvas({ onEval, onToast, onCorregir }) {
    return React.createElement('div', { style: { position: 'absolute', inset: 0, background: 'var(--canvas)', backgroundImage: 'radial-gradient(var(--border) 1.1px, transparent 1.1px)', backgroundSize: '20px 20px', overflow: 'hidden' } },
      React.createElement(LogoBar),
      React.createElement(Toolbar, { onEval, onToast, onCorregir }),
      React.createElement('button', { style: { position: 'absolute', top: 110, left: 30, width: 56, height: 56, borderRadius: 'var(--r-lg)', background: 'var(--ink)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }, title: 'Configuración' }, React.createElement(Icon, { name: 'settings', size: 22 })),
      React.createElement('div', { style: { position: 'absolute', top: '50%', left: 280, transform: 'translateY(-50%)' } },
        React.createElement(AgentNode, { title: 'Nuevo Agente' }),
        React.createElement(PlusButton),
        React.createElement(AgentNode, { title: 'Nuevo Subagente', tools: 1, actions: true }),
        React.createElement(PlusButton)));
  }

export { BuilderCanvas };
