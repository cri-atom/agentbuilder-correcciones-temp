'use client';
import { Icon, Sparkles } from './icons';
import { Badge, StatusText, Button } from './primitives';
import { CORR } from './correctorData';
import React from 'react';
/* Asistente de Corrección con IA — wizard completo.
   Depende de icons.jsx, primitives.jsx, correctorData.jsx.
   Expone EntryCard, ConfigModal, CorrectorPanel. */
  const { useState } = React;  const C = CORR;
  const h = React.createElement;

  const AI = 'var(--ai-purple)';
  const fmt = n => n.toFixed(2);
  const scoreColor = n => n >= 0.7 ? 'var(--success)' : n >= 0.4 ? 'var(--warning)' : 'var(--danger)';

  /* ---------- shared bits ---------- */
  function RiskBadge({ risk }) {
    const r = C.RISK[risk];
    return h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, padding: '3px 9px', borderRadius: 'var(--r-pill)', background: r.bg, color: r.color } },
      h('span', { style: { width: 7, height: 7, borderRadius: '50%', background: r.color } }), r.label);
  }
  function FrenteTag({ frente }) {
    const f = C.FRENTES[frente];
    return h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--gray-700)' } },
      h(Icon, { name: f.icon, size: 15, style: { color: 'var(--ink)' } }), f.label);
  }
  function Confianza({ v }) {
    const map = { alta: 'var(--success)', media: 'var(--warning)', baja: 'var(--danger)' };
    return h('span', { style: { fontSize: 12.5, color: 'var(--gray-500)' } }, 'Confianza ',
      h('span', { style: { color: map[v], fontWeight: 600 } }, v));
  }
  function AgentChip({ name }) {
    return h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--gray-700)', background: 'var(--surface-2)', borderRadius: 'var(--r-pill)', padding: '3px 10px' } },
      h(Icon, { name: 'bot', size: 12 }), name);
  }

  /* ---------- diff renderers ---------- */
  function Diff({ d }) {
    if (d.kind === 'lines') {
      return h('div', { style: { marginTop: 10 } },
        d.label && h('div', { style: { fontSize: 12.5, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 6 } }, d.label),
        h('div', { style: { border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden', fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.6 } },
          d.lines.map((l, i) => {
            const bg = l.t === 'add' ? 'var(--success-50)' : l.t === 'del' ? 'var(--danger-50)' : '#fff';
            const bar = l.t === 'add' ? 'var(--success)' : l.t === 'del' ? 'var(--danger)' : 'transparent';
            const pre = l.t === 'add' ? '+' : l.t === 'del' ? '−' : '\u00a0';
            const col = l.t === 'add' ? 'var(--success)' : l.t === 'del' ? 'var(--danger)' : 'var(--gray-400)';
            return h('div', { key: i, style: { display: 'flex', background: bg, borderLeft: '3px solid ' + bar } },
              h('span', { style: { width: 22, textAlign: 'center', color: col, flex: 'none', userSelect: 'none' } }, pre),
              h('span', { style: { padding: '4px 10px 4px 2px', color: l.t === 'del' ? 'var(--gray-500)' : 'var(--ink)', textDecoration: l.t === 'del' ? 'line-through' : 'none' } }, l.s));
          })));
    }
    if (d.kind === 'beforeafter') {
      const Row = (lab, txt, kind) => h('div', { style: { display: 'flex', gap: 10, padding: '9px 12px', background: kind === 'del' ? 'var(--danger-50)' : 'var(--success-50)', borderLeft: '3px solid ' + (kind === 'del' ? 'var(--danger)' : 'var(--success)') } },
        h('span', { style: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: kind === 'del' ? 'var(--danger)' : 'var(--success)', flex: 'none', width: 44, paddingTop: 1 } }, lab),
        h('span', { style: { fontSize: 13.5, lineHeight: 1.5, color: 'var(--ink)' } }, txt));
      return h('div', { style: { marginTop: 10 } },
        d.label && h('div', { style: { fontSize: 12.5, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 6 } }, d.label),
        h('div', { style: { border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden' } }, Row('Antes', d.before, 'del'), Row('Ahora', d.after, 'add')));
    }
    if (d.kind === 'field') {
      return h('div', { style: { marginTop: 10 } },
        d.label && h('div', { style: { fontSize: 12.5, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 6 } }, d.label),
        h('div', { style: { border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden' } },
          d.rows.map((r, i) => h('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderTop: i ? '1px solid var(--surface-2)' : 'none', fontSize: 13.5 } },
            h('span', { style: { width: 120, flex: 'none', color: 'var(--gray-500)' } }, r.k),
            r.same
              ? h('span', { style: { color: 'var(--gray-700)' } }, r.before)
              : h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
                  h('span', { style: { color: 'var(--gray-500)', textDecoration: 'line-through' } }, r.before),
                  h(Icon, { name: 'arrowRight', size: 13, style: { color: 'var(--gray-400)' } }),
                  h('span', { style: { color: 'var(--ink)', fontWeight: 600 } }, r.after))))));
    }
    return null;
  }

  /* ---------- proposal card ---------- */
  function ProposalCard({ p, mode, onAction, onEdit }) {
    const [open, setOpen] = useState(false);
    const discarded = p.state === 'discarded';
    return h('div', { style: { border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', background: '#fff', opacity: discarded ? 0.55 : 1, transition: 'opacity .15s' } },
      h('div', { onClick: () => setOpen(o => !o), style: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '15px 16px', cursor: 'pointer' } },
        h(Icon, { name: 'chevRight', size: 18, style: { color: 'var(--gray-400)', marginTop: 2, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .15s', flex: 'none' } }),
        h('div', { style: { flex: 1, minWidth: 0 } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 } },
            h(RiskBadge, { risk: p.risk }),
            p.composite && h('span', { style: { fontSize: 11.5, fontWeight: 600, color: AI, background: 'var(--ai-purple-50)', borderRadius: 'var(--r-pill)', padding: '3px 9px' } }, 'Propuesta compuesta'),
            discarded && h('span', { style: { fontSize: 12, color: 'var(--gray-400)', fontWeight: 600 } }, 'Descartada')),
          h('div', { style: { fontSize: 15.5, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 4 } }, p.title),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', fontSize: 12.5, color: 'var(--gray-500)' } },
            h(FrenteTag, { frente: p.frente }),
            h('span', null, p.casos + ' casos'),
            p.criterios.map(c => h('span', { key: c.k, style: { color: 'var(--success)', fontWeight: 600 } }, c.k + ' ' + c.d)))),
        h('div', { style: { flex: 'none', textAlign: 'right' } },
          h('div', { style: { fontSize: 11.5, color: 'var(--gray-400)' } }, p.id))),
      open && h('div', { style: { padding: '0 16px 16px 46px' } },
        h('div', { style: { fontSize: 13.5, color: 'var(--gray-700)', lineHeight: 1.55, marginBottom: 6 } }, p.justification),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 4 } },
          h(Confianza, { v: p.conf }),
          h('span', { style: { fontSize: 12.5, color: 'var(--gray-500)' } }, 'Casos: ', h('a', { style: { color: AI, fontWeight: 600, cursor: 'pointer' } }, p.casosIds))),
        p.riskReason && h('div', { style: { display: 'flex', alignItems: 'center', gap: 7, marginTop: 8, fontSize: 12.5, color: 'var(--danger)', background: 'var(--danger-50)', borderRadius: 'var(--r-md)', padding: '8px 11px' } },
          h(Icon, { name: 'alertTriangle', size: 15 }), p.riskReason),
        p.agents && h('div', { style: { display: 'flex', gap: 7, marginTop: 10, flexWrap: 'wrap' } }, p.agents.map(a => h(AgentChip, { key: a, name: a }))),
        p.diffs.map((d, i) => h(Diff, { key: i, d })),
        p.composite && h('div', { style: { fontSize: 12, color: 'var(--gray-500)', marginTop: 8, fontStyle: 'italic' } }, 'Los cambios se aplican de forma atómica: o todos o ninguno.')),
      !discarded && h('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderTop: '1px solid var(--surface-2)' } }, renderActions(p, mode, onAction, onEdit)));
  }

  function renderActions(p, mode, onAction, onEdit) {
    const ghost = { variant: 'ghost' };
    if (mode === 'review') {
      return [
        h(Button, { key: 'a', variant: 'primary', icon: 'check', onClick: () => onAction(p.id, 'accept') }, 'Aceptar'),
        h(Button, { key: 'e', ...ghost, icon: 'pencil', onClick: () => onEdit(p) }, 'Editar'),
        h(Button, { key: 'd', ...ghost, onClick: () => onAction(p.id, 'discard') }, 'Descartar'),
      ];
    }
    // resumen (auto)
    if (p.state === 'applied') {
      return [
        h('span', { key: 's', style: { display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: 'var(--success)', flex: 1 } }, h(Icon, { name: 'check', size: 16, stroke: 2.5 }), 'Aplicado al draft'),
        h(Button, { key: 'r', ...ghost, icon: 'undo', onClick: () => onAction(p.id, 'revert') }, 'Revertir'),
      ];
    }
    if (p.state === 'pending') {
      return [
        h('span', { key: 's', style: { display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: 'var(--danger)', flex: 1 } }, h(Icon, { name: 'alertTriangle', size: 16 }), 'Requiere tu aprobación'),
        h(Button, { key: 'e', ...ghost, icon: 'pencil', onClick: () => onEdit(p) }, 'Editar'),
        h(Button, { key: 'd', ...ghost, onClick: () => onAction(p.id, 'discard') }, 'Descartar'),
        h(Button, { key: 'a', variant: 'primary', onClick: () => onAction(p.id, 'accept') }, 'Aplicar'),
      ];
    }
    return null;
  }

  /* ---------- shell ---------- */
  function Shell({ title, ai, onBack, onClose, footer, children }) {
    return h('div', { style: { position: 'absolute', top: 0, right: 0, bottom: 0, width: '56%', minWidth: 660, background: '#fff', boxShadow: 'var(--shadow-lg)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', zIndex: 40, animation: 'panelIn .28s cubic-bezier(.4,0,.2,1)' } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 13, padding: '20px 26px 16px', flex: 'none', borderBottom: '1px solid var(--surface-2)' } },
        onBack && h('button', { onClick: onBack, style: { border: 'none', background: 'none', cursor: 'pointer', color: 'var(--ink)', display: 'flex', padding: 0 } }, h(Icon, { name: 'arrowLeft', size: 24 })),
        ai && h(Sparkles, { size: 22, style: { color: AI, flex: 'none' } }),
        h('h1', { style: { margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, title),
        h('button', { onClick: onClose, style: { border: 'none', background: 'none', cursor: 'pointer', color: 'var(--gray-500)', display: 'flex', padding: 4 } }, h(Icon, { name: 'x', size: 24 }))),
      h('div', { style: { flex: 1, overflowY: 'auto', padding: '20px 26px 28px' } }, children),
      footer && h('div', { style: { flex: 'none', padding: '14px 26px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 } }, footer));
  }

  function SectionTitle({ children, count, sub }) {
    return h('div', { style: { margin: '26px 0 12px' } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 9, fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' } }, children,
        count != null && h('span', { style: { fontSize: 13, fontWeight: 600, color: 'var(--gray-400)' } }, count)),
      sub && h('div', { style: { fontSize: 13, color: 'var(--gray-500)', marginTop: 3 } }, sub));
  }

  /* ============ ENTRY CARD (HU-01 results summary) ============ */
  function EntryCard({ onCorregir }) {
    const e = C.EVAL;
    return h('div', { style: { width: 440, background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-md)', padding: 22 } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--gray-500)', marginBottom: 8 } }, h(Icon, { name: 'flask', size: 15 }), 'Resumen de evaluación'),
      h('div', { style: { fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 } }, e.name),
      h('div', { style: { display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 } },
        h('span', { style: { fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', color: scoreColor(e.globalBefore) } }, fmt(e.globalBefore)),
        h('span', { style: { fontSize: 13.5, color: 'var(--gray-500)' } }, 'score global · ' + e.cases + ' casos')),
      h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 18 } },
        e.criteria.map(([k, v]) => h('span', { key: k, style: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, borderRadius: 'var(--r-pill)', padding: '4px 10px', background: v < 0.7 ? 'var(--danger-50)' : 'var(--surface-2)', color: v < 0.7 ? 'var(--danger)' : 'var(--gray-700)' } }, k, h('span', null, fmt(v))))),
      h('button', { onClick: onCorregir, style: { width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, padding: '13px', borderRadius: 'var(--r-md)', border: 'none', background: 'var(--ink)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, transition: 'background .15s' }, onMouseEnter: ev => ev.currentTarget.style.background = '#1f1f22', onMouseLeave: ev => ev.currentTarget.style.background = 'var(--ink)' },
        h(Sparkles, { size: 18 }), 'Corregir con IA'),
      h('div', { style: { fontSize: 12, color: 'var(--gray-400)', textAlign: 'center', marginTop: 9 } }, '5 criterios por debajo del 100%'));
  }

  /* ============ CONFIG MODAL (HU-01) ============ */
  function ConfigPanel({ onClose, onBack, onAnalyze, info }) {
    const i = info || { name: 'Evaluación', total: 15, failed: 9 };
    const [scope, setScope] = useState('low');
    const [mode, setMode] = useState('auto');
    const OptRow = (val, sel, set, title, desc, badge) => h('div', { onClick: () => set(val), style: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 15px', border: (sel === val ? '1.5px solid var(--ink)' : '1px solid var(--border)'), borderRadius: 'var(--r-lg)', cursor: 'pointer', background: '#fff' } },
      h('span', { style: { width: 18, height: 18, borderRadius: '50%', flex: 'none', marginTop: 1, border: sel === val ? '5px solid var(--ink)' : '1.5px solid var(--border-strong)', transition: 'all .12s' } }),
      h('div', { style: { flex: 1 } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14.5, fontWeight: 600 } }, title, badge && h('span', { style: { fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', background: 'var(--surface-2)', borderRadius: 'var(--r-pill)', padding: '2px 8px' } }, badge)),
        h('div', { style: { fontSize: 13, color: 'var(--gray-500)', marginTop: 2 } }, desc)));
    return h(Shell, { title: 'Corregir con IA', ai: true, onBack, onClose,
      footer: [
        h(Button, { key: 'c', variant: 'ghost', onClick: onBack }, 'Cancelar'),
        h('div', { key: 's', style: { flex: 1 } }),
        h(Button, { key: 'a', variant: 'primary', onClick: () => onAnalyze(scope, mode) }, [h(Sparkles, { key: 'i', size: 16 }), ' Analizar con IA']),
      ] },
      h('p', { style: { fontSize: 14, color: 'var(--gray-500)', margin: '0 0 22px', lineHeight: 1.5 } }, 'El asistente analizará los casos con scores bajos de ', h('b', { style: { color: 'var(--ink)' } }, i.name), ' y propondrá correcciones sobre la configuración de tu agente.'),
      h('div', { style: { fontSize: 13.5, fontWeight: 600, marginBottom: 10 } }, 'Alcance del análisis'),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 26 } },
        OptRow('all', scope, setScope, 'Todo el experimento', 'Analiza los ' + i.total + ' casos del dataset.'),
        OptRow('low', scope, setScope, 'Solo los casos por debajo del umbral', 'Analiza los ' + i.failed + ' casos con score promedio < 0.7.', 'Recomendado'),
        OptRow('sel', scope, setScope, 'Solo los casos seleccionados', 'Habilitado al seleccionar casos en la tabla.')),
      h('div', { style: { fontSize: 13.5, fontWeight: 600, marginBottom: 10 } }, 'Modo de aplicación'),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 9 } },
        OptRow('auto', mode, setMode, 'Automático', 'Aplica los cambios de bajo y medio riesgo a un draft; los de alto riesgo quedan pendientes de aprobación.', 'Por defecto'),
        OptRow('sup', mode, setMode, 'Supervisado', 'Propone todos los cambios; ninguno se aplica sin tu aprobación explícita.')));
  }

  /* ============ ANALYZING (HU-02) ============ */
  function Analyzing({ onClose, onDone, info }) {
    const i = info || { name: 'Evaluación', failed: 9 };
    const steps = [
      'Leyendo el reasoning del LLM-as-judge en los casos fallidos',
      'Recorriendo los threads turno por turno (qué agente respondió)',
      'Cruzando con la configuración actual de los 5 frentes',
      'Detectando patrones comunes entre los casos',
      'Mapeando cada causa raíz a su frente de mejora',
    ];
    const [done, setDone] = useState(0);
    React.useEffect(() => {
      if (done >= steps.length) { const t = setTimeout(onDone, 650); return () => clearTimeout(t); }
      const t = setTimeout(() => setDone(d => d + 1), done === 0 ? 500 : 620);
      return () => clearTimeout(t);
    }, [done]);
    return h(Shell, { title: 'Corregir con IA', ai: true, onClose },
      h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 0 30px' } },
        h('div', { style: { position: 'relative', width: 64, height: 64, marginBottom: 22 } },
          h('div', { style: { position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid var(--ai-purple-50)', borderTopColor: AI, animation: 'spin .9s linear infinite' } }),
          h(Sparkles, { size: 26, style: { color: AI, position: 'absolute', inset: 0, margin: 'auto' } })),
        h('div', { style: { fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em' } }, done >= steps.length ? 'Análisis completo' : 'Analizando ' + i.failed + ' casos…'),
        h('div', { style: { fontSize: 14, color: 'var(--gray-500)', marginTop: 4 } }, i.name)),
      h('div', { style: { maxWidth: 460, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 4 } },
        steps.map((s, i) => {
          const state = i < done ? 'done' : i === done ? 'active' : 'idle';
          return h('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 12, padding: '11px 4px', opacity: state === 'idle' ? 0.4 : 1, transition: 'opacity .3s' } },
            h('span', { style: { width: 22, height: 22, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
              state === 'done' ? h(Icon, { name: 'check', size: 18, stroke: 2.5, style: { color: 'var(--success)' } })
                : state === 'active' ? h('span', { style: { width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--ai-purple-50)', borderTopColor: AI, animation: 'spin .8s linear infinite' } })
                : h('span', { style: { width: 8, height: 8, borderRadius: '50%', background: 'var(--border-strong)' } })),
            h('span', { style: { fontSize: 14, color: state === 'done' ? 'var(--ink)' : 'var(--gray-700)' } }, s));
        })));
  }

  /* ============ ACTION CARD (HU-08bis) ============ */
  function ActionCard({ a, onAction }) {
    return h('div', { style: { border: '1px solid var(--danger)', borderRadius: 'var(--r-lg)', background: 'var(--danger-50)', padding: '16px 18px' } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 } },
        h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--danger)', background: '#fff', borderRadius: 'var(--r-pill)', padding: '3px 9px' } }, h(Icon, { name: a.icon, size: 13 }), a.type)),
      h('div', { style: { fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 6 } }, a.title),
      h('div', { style: { fontSize: 13.5, color: 'var(--gray-700)', lineHeight: 1.55, marginBottom: 8 } }, a.why),
      h('div', { style: { fontSize: 12.5, color: 'var(--gray-500)', marginBottom: 14 } }, 'Casos afectados: ', h('span', { style: { color: 'var(--danger)', fontWeight: 600 } }, a.casos)),
      h('div', { style: { display: 'flex', gap: 10, flexWrap: 'wrap' } },
        h(Button, { variant: 'primary', icon: 'externalLink', onClick: () => onAction(a.id, 'now') }, 'Hacer ahora'),
        h(Button, { variant: 'ghost', onClick: () => onAction(a.id, 'later') }, 'Lo hago después'),
        h(Button, { variant: 'ghost', onClick: () => onAction(a.id, 'dismiss') }, 'No es relevante')));
  }

  /* ============ EDIT MODAL ============ */
  function EditModal({ p, onClose, onSave }) {
    const d0 = p.diffs[0];
    const initial = d0.kind === 'beforeafter' ? d0.after : d0.kind === 'lines' ? d0.lines.filter(l => l.t !== 'del').map(l => l.s).join('\n') : (d0.rows[1] ? d0.rows[1].after : '');
    const [txt, setTxt] = useState(initial);
    return h('div', { style: { position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 95 } },
      h('div', { style: { width: 560, maxWidth: '92%', background: '#fff', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-lg)', padding: '24px 26px' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 } }, h('h2', { style: { margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', flex: 1 } }, 'Editar propuesta'), h('button', { onClick: onClose, style: { border: 'none', background: 'none', cursor: 'pointer', color: 'var(--gray-500)', display: 'flex' } }, h(Icon, { name: 'x', size: 22 }))),
        h('div', { style: { fontSize: 13, color: 'var(--gray-500)', marginBottom: 16 } }, p.artefacto),
        h('textarea', { value: txt, onChange: e => setTxt(e.target.value), rows: 6, style: { width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.5, padding: '12px 13px', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', resize: 'vertical', outline: 'none' }, onFocus: e => e.target.style.borderColor = 'var(--ink)', onBlur: e => e.target.style.borderColor = 'var(--border)' }),
        h('div', { style: { display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 18 } },
          h(Button, { variant: 'ghost', onClick: onClose }, 'Cancelar'),
          h(Button, { variant: 'primary', onClick: () => onSave(p.id) }, 'Guardar y aplicar'))));
  }

export const CorrectorBits = { Shell, SectionTitle, ProposalCard, ActionCard, EditModal, Analyzing, RiskBadge, FrenteTag, scoreColor, fmt, AI };
export { EntryCard, ConfigPanel };
