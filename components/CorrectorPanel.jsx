'use client';
import { Icon } from './icons';
import { Button, Badge } from './primitives';
import { CORR } from './correctorData';
import { CorrectorBits, ConfigPanel } from './correctorBits';
import React from 'react';
/* Asistente de Corrección con IA — panels + router.
   Depende de corrector.jsx (CorrectorBits), correctorData.jsx.
   Expone CorrectorPanel. */
  const { useState } = React;  const C = CORR;
  const B = CorrectorBits;
  const { Shell, SectionTitle, ProposalCard, ActionCard, EditModal, Analyzing, scoreColor, fmt, AI } = B;
  const h = React.createElement;

  function Banner({ tone, icon, children }) {
    const map = { info: ['var(--info-50)', 'var(--info)'], warn: ['var(--warning-50)', 'var(--warning)'], ok: ['var(--success-50)', 'var(--success)'] };
    const [bg, col] = map[tone] || map.info;
    return h('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 10, background: bg, borderRadius: 'var(--r-md)', padding: '12px 14px', fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.5 } },
      h(Icon, { name: icon, size: 17, style: { color: col, flex: 'none', marginTop: 1 } }), h('div', null, children));
  }

  function RecCard({ text }) {
    return h('div', { style: { display: 'flex', gap: 11, border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '13px 15px', background: 'var(--surface-1)' } },
      h(Icon, { name: 'sparkles', size: 16, style: { color: 'var(--gray-400)', flex: 'none', marginTop: 1 } }),
      h('div', { style: { fontSize: 13.5, color: 'var(--gray-700)', lineHeight: 1.5 } }, text));
  }

  /* ============ RESUMEN (HU-10) ============ */
  function Resumen({ props_, actions, forcedSup, onAction, onActionCard, onActionBtn, onEdit, onRerun, onClose }) {
    const applied = props_.filter(p => p.state === 'applied');
    const pending = props_.filter(p => p.state === 'pending');
    const openActions = actions.filter(a => a.status === 'open' || a.status === 'later');
    const FR = ['prompt', 'route', 'book', 'clipboard', 'splitArrows'];
    const footer = [
      h(Button, { key: 'disc', variant: 'ghost', onClick: onClose }, 'Descartar draft'),
      h('div', { key: 'sp', style: { flex: 1 } }),
      h(Button, { key: 'sim', variant: 'ghost', icon: 'play', onClick: () => onActionBtn('sim') }, 'Probar en simulador'),
      h(Button, { key: 'run', variant: 'primary', icon: 'play', onClick: onRerun }, 'Re-ejecutar evaluación'),
    ];
    return h(Shell, { title: 'Corregir con IA', ai: true, onClose, footer },
      h(Banner, { tone: 'ok', icon: 'check' },
        h('b', null, 'Se aplicaron ' + applied.length + ' cambios al draft de tu agente.'),
        pending.length ? ' ' + pending.length + ' cambio' + (pending.length > 1 ? 's' : '') + ' requiere' + (pending.length > 1 ? 'n' : '') + ' tu aprobación.' : ''),
      forcedSup && h('div', { style: { marginTop: 10 } }, h(Banner, { tone: 'warn', icon: 'alertTriangle' },
        h('b', null, 'Detectamos cambios que requieren tu acción.'), ' Continuamos en modo supervisado para que revises todo antes de aplicar.')),

      openActions.length > 0 && h('div', null,
        h(SectionTitle, { count: openActions.length, sub: 'Cambios fuera del alcance del asistente que debés ejecutar vos.' }, h(Icon, { name: 'wrench', size: 18 }), 'Acciones requeridas antes de continuar'),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } }, openActions.map(a => h(ActionCard, { key: a.id, a, onAction: onActionCard })))),

      h(SectionTitle, { count: applied.length }, 'Aplicados al draft'),
      applied.length === 0 ? h('div', { style: { fontSize: 13.5, color: 'var(--gray-400)' } }, 'Sin cambios aplicados todavía.')
        : h('div', { style: { display: 'flex', flexDirection: 'column', gap: 18 } },
          FR.filter(fr => applied.some(p => p.frente === fr)).map(fr =>
            h('div', { key: fr },
              h('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9 } }, h(Icon, { name: C.FRENTES[fr].icon, size: 15, style: { color: 'var(--ink)' } }), C.FRENTES[fr].label),
              h('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } }, applied.filter(p => p.frente === fr).map(p => h(ProposalCard, { key: p.id, p, mode: 'resumen', onAction, onEdit })))))),

      pending.length > 0 && h('div', null,
        h(SectionTitle, { count: pending.length, sub: 'Alto riesgo — requieren tu aprobación incluso en modo automático.' }, 'Pendientes de aprobación'),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } }, pending.map(p => h(ProposalCard, { key: p.id, p, mode: 'resumen', onAction, onEdit })))),

      h(SectionTitle, { sub: 'Sugerencias informativas que no bloquean el flujo.' }, 'Recomendaciones generales'),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } }, C.RECS.map((r, i) => h(RecCard, { key: i, text: r }))),
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, padding: '12px 14px', border: '1px dashed var(--border-strong)', borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--gray-500)' } },
        h(Icon, { name: 'history', size: 15 }), 'El draft nunca está activo en producción. Tu agente sigue corriendo con la versión publicada hasta que publiques.'));
  }

  /* ============ REVIEW (HU-11) ============ */
  function Review({ props_, onAction, onEdit, onBulk, onClose }) {
    const pending = props_.filter(p => p.state === 'proposed');
    const total = props_.length;
    const reviewed = total - pending.length;
    const current = pending[0];
    if (!current) return null;
    const footer = [
      h(Button, { key: 'low', variant: 'ghost', onClick: () => onBulk('low') }, 'Aceptar todo lo de bajo riesgo'),
      h(Button, { key: 'none', variant: 'ghost', onClick: () => onBulk('discard') }, 'Descartar todo'),
      h('div', { key: 'sp', style: { flex: 1 } }),
      h('span', { key: 'c', style: { fontSize: 13, color: 'var(--gray-500)', fontWeight: 600 } }, 'Propuesta ' + (reviewed + 1) + ' de ' + total),
    ];
    return h(Shell, { title: 'Corregir con IA · Revisión', ai: true, onClose, footer },
      h('div', { style: { height: 5, borderRadius: 99, background: 'var(--surface-2)', overflow: 'hidden', marginBottom: 18 } },
        h('div', { style: { height: '100%', width: (reviewed / total * 100) + '%', background: AI, borderRadius: 99, transition: 'width .3s' } })),
      h('div', { style: { fontSize: 13.5, color: 'var(--gray-500)', marginBottom: 14 } }, 'Revisá cada propuesta y decidí: aceptar, editar o descartar. Nada se aplica sin tu aprobación.'),
      h('div', { key: current.id, style: { animation: 'panelIn .2s ease' } }, h(ProposalCard, { p: current, mode: 'review', onAction, onEdit })));
  }

  /* ============ RERUN (HU-13) ============ */
  function Rerun({ onClose, onBack, onComplete, info }) {
    const i = info || { total: 15, failed: 9 };
    const [scope, setScope] = useState('failed');
    const [running, setRunning] = useState(false);
    React.useEffect(() => {
      if (!running) return;
      const t = setTimeout(onComplete, 2000); return () => clearTimeout(t);
    }, [running]);
    const Opt = (val, title, desc, badge) => h('div', { onClick: () => setScope(val), style: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 15px', border: scope === val ? '1.5px solid var(--ink)' : '1px solid var(--border)', borderRadius: 'var(--r-lg)', cursor: 'pointer' } },
      h('span', { style: { width: 18, height: 18, borderRadius: '50%', flex: 'none', marginTop: 1, border: scope === val ? '5px solid var(--ink)' : '1.5px solid var(--border-strong)' } }),
      h('div', null, h('div', { style: { display: 'flex', gap: 8, alignItems: 'center', fontSize: 14.5, fontWeight: 600 } }, title, badge && h('span', { style: { fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', background: 'var(--surface-2)', borderRadius: 'var(--r-pill)', padding: '2px 8px' } }, badge)), h('div', { style: { fontSize: 13, color: 'var(--gray-500)', marginTop: 2 } }, desc)));
    if (running) return h(Shell, { title: 'Re-ejecutar evaluación', onClose },
      h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '70px 0' } },
        h('div', { style: { width: 56, height: 56, borderRadius: '50%', border: '3px solid var(--surface-2)', borderTopColor: 'var(--ink)', animation: 'spin .9s linear infinite', marginBottom: 22 } }),
        h('div', { style: { fontSize: 18, fontWeight: 700 } }, 'Re-ejecutando sobre el draft…'),
        h('div', { style: { fontSize: 14, color: 'var(--gray-500)', marginTop: 4 } }, 'Corriendo los casos que originalmente fallaron')));
    return h(Shell, { title: 'Re-ejecutar evaluación', onBack, onClose,
      footer: [h(Button, { key: 'c', variant: 'ghost', onClick: onBack }, 'Cancelar'), h('div', { key: 's', style: { flex: 1 } }), h(Button, { key: 'r', variant: 'primary', icon: 'play', onClick: () => setRunning(true) }, 'Re-ejecutar')] },
      h('p', { style: { fontSize: 14, color: 'var(--gray-500)', margin: '2px 0 18px', lineHeight: 1.5 } }, 'Corré la evaluación de origen sobre el draft para validar que los cambios mejoraron los scores y no introdujeron regresiones.'),
      h('div', { style: { fontSize: 13.5, fontWeight: 600, marginBottom: 10 } }, 'Alcance de la re-ejecución'),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 9 } },
        Opt('all', 'Re-ejecutar todo', 'Corre la evaluación completa sobre los ' + i.total + ' casos.'),
        Opt('failed', 'Solo casos fallidos', 'Corre los ' + i.failed + ' casos que originalmente fallaron.', 'Recomendado'),
        Opt('affected', 'Solo casos afectados', 'Corre solo los casos vinculados a las correcciones aplicadas.')));
  }

  /* ============ COMPARE (HU-14) ============ */
  function Compare({ onClose, onBack, onPublish, onIterate }) {
    const d = C.COMPARE;
    const deltaColor = n => n > 0 ? 'var(--success)' : n < 0 ? 'var(--danger)' : 'var(--gray-400)';
    const footer = [
      h(Button, { key: 'd', variant: 'ghost', onClick: onClose }, 'Descartar el draft'),
      h('div', { key: 's', style: { flex: 1 } }),
      h(Button, { key: 'it', variant: 'ghost', icon: 'undo', onClick: onIterate }, 'Volver a iterar'),
      h(Button, { key: 'p', variant: 'primary', icon: 'rocket', onClick: onPublish }, 'Publicar el draft'),
    ];
    const th = { textAlign: 'right', fontSize: 12.5, fontWeight: 600, color: 'var(--gray-500)', padding: '0 0 8px' };
    return h(Shell, { title: 'Comparación de scores', onBack, onClose, footer },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 24, padding: '6px 0 20px' } },
        h('div', null,
          h('div', { style: { fontSize: 13.5, color: 'var(--gray-500)', marginBottom: 4 } }, 'Score global'),
          h('div', { style: { display: 'flex', alignItems: 'baseline', gap: 12 } },
            h('span', { style: { fontSize: 30, fontWeight: 700, color: 'var(--gray-400)', textDecoration: 'line-through' } }, fmt(d.before)),
            h(Icon, { name: 'arrowRight', size: 22, style: { color: 'var(--gray-400)' } }),
            h('span', { style: { fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--success)' } }, fmt(d.after)),
            h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 16, fontWeight: 700, color: 'var(--success)' } }, h(Icon, { name: 'trendUp', size: 18 }), d.delta))),
        h('div', { style: { display: 'flex', gap: 18, marginLeft: 'auto', textAlign: 'center' } },
          [['Mejoraron', d.mejoraron, 'var(--success)'], ['Empeoraron', d.empeoraron, 'var(--danger)'], ['Igual', d.igual, 'var(--gray-500)']].map(([k, v, c]) =>
            h('div', { key: k }, h('div', { style: { fontSize: 24, fontWeight: 800, color: c } }, v), h('div', { style: { fontSize: 12, color: 'var(--gray-500)' } }, k))))),
      h('div', { style: { fontSize: 12.5, color: 'var(--gray-400)', marginBottom: 18 } }, 'Re-ejecución de ' + (d.mejoraron + d.empeoraron + d.igual) + ' casos · ' + d.tiempo + ' · ' + d.costo),

      d.regresiones > 0 && h('div', { style: { marginBottom: 18 } }, h(Banner, { tone: 'warn', icon: 'alertTriangle' }, h('b', null, 'Atención: ' + d.regresiones + ' caso que antes pasaba ahora falla.'), ' Revisalo antes de publicar.')),

      h('div', { style: { fontSize: 16, fontWeight: 700, marginBottom: 12 } }, 'Detalle por criterio'),
      h('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: 14, marginBottom: 26 } },
        h('thead', null, h('tr', null, h('th', { style: { ...th, textAlign: 'left' } }, 'Criterio'), h('th', { style: th }, 'Antes'), h('th', { style: th }, 'Después'), h('th', { style: th }, 'Δ'))),
        h('tbody', null, d.rows.map(([k, a, b]) => {
          const delta = +(b - a).toFixed(2);
          return h('tr', { key: k },
            h('td', { style: { padding: '9px 0', borderTop: '1px solid var(--surface-2)' } }, k),
            h('td', { style: { padding: '9px 0', borderTop: '1px solid var(--surface-2)', textAlign: 'right', color: 'var(--gray-500)' } }, fmt(a)),
            h('td', { style: { padding: '9px 0', borderTop: '1px solid var(--surface-2)', textAlign: 'right', fontWeight: 700, color: scoreColor(b) } }, fmt(b)),
            h('td', { style: { padding: '9px 0', borderTop: '1px solid var(--surface-2)', textAlign: 'right', fontWeight: 700, color: deltaColor(delta) } }, (delta > 0 ? '+' : '') + delta.toFixed(2)));
        }))),

      h('div', { style: { fontSize: 16, fontWeight: 700, marginBottom: 12 } }, 'Detalle por caso'),
      h('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: 14 } },
        h('thead', null, h('tr', null, h('th', { style: { ...th, textAlign: 'left' } }, 'Caso'), h('th', { style: th }, 'Antes'), h('th', { style: th }, 'Después'), h('th', { style: { ...th, textAlign: 'center' } }, 'Estado'))),
        h('tbody', null, d.casos.map(([id, a, b, st]) => h('tr', { key: id, style: { cursor: 'pointer' }, onMouseEnter: e => e.currentTarget.style.background = 'var(--surface-1)', onMouseLeave: e => e.currentTarget.style.background = 'transparent' },
          h('td', { style: { padding: '11px 0', borderTop: '1px solid var(--surface-2)', fontWeight: 600 } }, id),
          h('td', { style: { padding: '11px 0', borderTop: '1px solid var(--surface-2)', textAlign: 'right', color: 'var(--gray-500)' } }, fmt(a)),
          h('td', { style: { padding: '11px 0', borderTop: '1px solid var(--surface-2)', textAlign: 'right', fontWeight: 700, color: scoreColor(b) } }, fmt(b)),
          h('td', { style: { padding: '11px 0', borderTop: '1px solid var(--surface-2)', textAlign: 'center' } },
            st === 'up' ? h('span', { style: { color: 'var(--success)', fontWeight: 600, fontSize: 13 } }, '✅ Mejoró')
              : st === 'down' ? h('span', { style: { color: 'var(--danger)', fontWeight: 600, fontSize: 13 } }, '⚠ Empeoró')
              : h('span', { style: { color: 'var(--gray-500)', fontSize: 13 } }, '➖ Igual')))))));
  }

  /* ============ ROUTER ============ */
  function CorrectorPanel({ onClose, onBack, pushToast, evalInfo }) {
    const info = evalInfo || { name: 'Evaluación', total: 15, failed: 9 };
    const [view, setView] = useState('config');
    const [mode, setMode] = useState('auto');
    const [props_, setProps] = useState([]);
    const [actions, setActions] = useState(() => C.ACTIONS.map(a => ({ ...a, status: 'open' })));
    const [editing, setEditing] = useState(null);

    const startAnalysis = (scope, m) => {
      setMode(m);
      setProps(C.PROPOSALS.map(p => ({ ...p, state: m === 'sup' ? 'proposed' : (p.risk === 'high' ? 'pending' : 'applied') })));
      setActions(C.ACTIONS.map(a => ({ ...a, status: 'open' })));
      setView('analyzing');
    };

    const forcedSup = actions.some(a => a.status === 'open' || a.status === 'later');

    const setPState = (id, state) => setProps(ps => ps.map(p => p.id === id ? { ...p, state } : p));

    const onAction = (id, act) => {
      if (act === 'accept') { setPState(id, 'applied'); pushToast('success', 'Cambio aplicado al draft'); }
      else if (act === 'discard') { setPState(id, 'discarded'); pushToast('success', 'Propuesta descartada'); }
      else if (act === 'revert') { setPState(id, 'discarded'); pushToast('success', 'Cambio revertido en el draft'); }
    };
    const onActionCard = (id, what) => {
      if (what === 'now') {
        setActions(as => as.map(a => a.id === id ? { ...a, status: 'done' } : a));
        pushToast('success', '✅ Cambio detectado: Google Calendar conectado. Generando nuevas propuestas…');
        const a = C.ACTIONS.find(x => x.id === id);
        if (a && a.followup) setTimeout(() => setProps(ps => ps.some(p => p.id === 'F-' + id) ? ps : [...ps, {
          id: 'F-' + id, frente: a.followup.frente, risk: 'low', conf: 'alta', state: mode === 'sup' ? 'proposed' : 'applied',
          agents: ['Agente Test Drive'], artefacto: 'Prompt · Agente Test Drive', title: a.followup.title, justification: a.followup.body,
          criterios: [{ k: 'Helpfulness', d: '+0.35' }], casos: 6, casosIds: a.casos,
          diffs: [{ label: 'Prompt · Agente Test Drive', kind: 'lines', lines: [
            { t: 'ctx', s: '## Agendamiento' }, { t: 'add', s: '- Usar @[Google Calendar · Crear evento] para reservar el test drive.' }, { t: 'add', s: '- Si el horario no está disponible, ofrecer los 2 slots libres más cercanos.' }] }]
        }]), 700);
      } else if (what === 'later') setActions(as => as.map(a => a.id === id ? { ...a, status: 'later' } : a));
      else if (what === 'dismiss') setActions(as => as.map(a => a.id === id ? { ...a, status: 'dismissed' } : a));
    };
    const onActionBtn = (what) => { if (what === 'sim') pushToast('success', 'Draft compilado · disponible en el simulador'); };

    const onBulk = (kind) => {
      if (kind === 'low') { setProps(ps => ps.map(p => p.state === 'proposed' && p.risk === 'low' ? { ...p, state: 'applied' } : p)); pushToast('success', 'Propuestas de bajo riesgo aplicadas'); }
      else if (kind === 'discard') { setProps(ps => ps.map(p => p.state === 'proposed' ? { ...p, state: 'discarded' } : p)); }
    };
    // when review finishes (no proposed left) move to resumen
    React.useEffect(() => {
      if (view === 'review' && !props_.some(p => p.state === 'proposed')) { const t = setTimeout(() => setView('resumen'), 250); return () => clearTimeout(t); }
    }, [view, props_]);

    const onReviewAction = (id, act) => { if (act === 'accept') { setPState(id, 'applied'); } else if (act === 'discard') { setPState(id, 'discarded'); } };

    let screen;
    if (view === 'config') screen = h(ConfigPanel, { onClose, onBack, onAnalyze: startAnalysis, info });
    else if (view === 'analyzing') screen = h(Analyzing, { onClose, info, onDone: () => setView(mode === 'sup' ? 'review' : 'resumen') });
    else if (view === 'review') screen = h(Review, { props_, onAction: onReviewAction, onEdit: setEditing, onBulk, onClose });
    else if (view === 'resumen') screen = h(Resumen, { props_, actions, forcedSup, onAction, onActionCard, onActionBtn, onEdit: setEditing, onRerun: () => setView('rerun'), onClose });
    else if (view === 'rerun') screen = h(Rerun, { onClose, info, onBack: () => setView('resumen'), onComplete: () => setView('compare') });
    else if (view === 'compare') screen = h(Compare, { onClose, onBack: () => setView('rerun'), onPublish: () => { pushToast('success', 'Draft publicado como nueva versión (Generada por Asistente IA)'); onClose(); }, onIterate: () => setView('resumen') });

    return h(React.Fragment, null, screen, editing && h(EditModal, { p: editing, onClose: () => setEditing(null), onSave: (id) => { setEditing(null); setPState(id, 'applied'); pushToast('success', 'Propuesta editada y aplicada'); } }));
  }

export { CorrectorPanel };
