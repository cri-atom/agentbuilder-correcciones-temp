'use client';
import React from 'react';
import { Icon } from './icons';

/* Atom Agent Builder — UI primitives. Depends on icons.jsx + colors_and_type.css.
   Exposes: Button, IconButton, Badge, StatusText, Checkbox, SegmentedControl,
   SelectionTile, OptionCard, Field, TextInput, TextArea, Toast, HelpDot. */

  /* ---- Button ---- */
  function Button({ variant = 'primary', children, onClick, icon, disabled, style }) {
    const base = {
      fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em',
      borderRadius: 'var(--r-md)', padding: '10px 18px', border: '1px solid transparent',
      cursor: disabled ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center',
      gap: 8, transition: 'background .15s,border-color .15s,color .15s', whiteSpace: 'nowrap'
    };
    const variants = {
      primary: { background: 'var(--ink)', color: '#fff' },
      secondary: { background: '#fff', color: 'var(--ink)', borderColor: 'var(--border)' },
      ghost: { background: '#fff', color: 'var(--ink)', borderColor: 'var(--border)' },
      disabled: { background: 'var(--surface-2)', color: 'var(--gray-300)' }
    };
    const v = disabled ? variants.disabled : variants[variant];
    return React.createElement('button', {
      onClick: disabled ? undefined : onClick, style: { ...base, ...v, ...style },
      onMouseEnter: e => { if (disabled) return; if (variant === 'primary') e.currentTarget.style.background = '#1f1f22'; else e.currentTarget.style.background = 'var(--surface-2)'; },
      onMouseLeave: e => { if (disabled) return; e.currentTarget.style.background = v.background; }
    }, icon && React.createElement(Icon, { name: icon, size: 16 }), children);
  }

  /* ---- Icon button (square) ---- */
  function IconButton({ name, onClick, size = 38, title, danger, style, children }) {
    return React.createElement('button', {
      onClick, title,
      style: {
        width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--r-md)', background: '#fff', border: '1px solid var(--border)',
        color: danger ? 'var(--danger)' : 'var(--ink)', cursor: 'pointer', transition: 'background .15s',
        ...style
      },
      onMouseEnter: e => e.currentTarget.style.background = 'var(--surface-2)',
      onMouseLeave: e => e.currentTarget.style.background = '#fff'
    }, children || React.createElement(Icon, { name, size: 17 }));
  }

  /* ---- Badge ---- */
  function Badge({ kind = 'ai', children }) {
    const styles = {
      ai: { background: 'var(--ai-purple-50)', color: 'var(--ai-purple-text)' },
      live: { background: 'var(--info-50)', color: 'var(--info)' },
      neutral: { background: 'var(--surface-2)', color: 'var(--gray-700)' }
    };
    return React.createElement('span', {
      style: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 600, padding: '3px 10px', borderRadius: 'var(--r-pill)', ...styles[kind] }
    }, kind === 'ai' && React.createElement(window.Sparkles, { size: 12 }), children);
  }

  const STATUS_COLOR = { Completada: 'var(--success)', 'Evaluando…': 'var(--warning)', Cancelada: 'var(--gray-500)', Error: 'var(--danger)', Borrador: 'var(--gray-500)' };
  function StatusText({ value }) {
    return React.createElement('span', { style: { color: STATUS_COLOR[value] || 'var(--gray-500)', fontWeight: value === 'Cancelada' || value === 'Borrador' ? 400 : 600, fontSize: 14 } }, value);
  }

  /* ---- Checkbox ---- */
  function Checkbox({ checked, onChange }) {
    return React.createElement('div', {
      onClick: e => { e.stopPropagation(); onChange && onChange(!checked); },
      style: {
        width: 20, height: 20, borderRadius: 6, flex: 'none', cursor: 'pointer',
        border: checked ? '1.5px solid var(--ink)' : '1.5px solid var(--border-strong)',
        background: checked ? 'var(--ink)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .12s'
      }
    }, checked && React.createElement(Icon, { name: 'check', size: 12, stroke: 3.5, style: { color: '#fff' } }));
  }

  /* ---- Segmented control ---- */
  function SegmentedControl({ options, value, onChange }) {
    return React.createElement('div', { style: { display: 'flex', gap: 10, flexWrap: 'wrap' } },
      options.map(opt => {
        const sel = value === opt;
        return React.createElement('button', {
          key: opt, onClick: () => onChange(opt),
          style: {
            fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: sel ? 600 : 500,
            padding: '9px 18px', minWidth: 56, textAlign: 'center', cursor: 'pointer',
            border: sel ? '1.5px solid var(--ink)' : '1px solid var(--border)',
            borderRadius: 'var(--r-md)', background: '#fff', color: sel ? 'var(--ink)' : 'var(--gray-500)', transition: 'all .12s'
          }
        }, opt);
      }));
  }

  /* ---- Selection tile (icon + title + desc, big) ---- */
  function SelectionTile({ icon, ai, title, desc, onClick }) {
    return React.createElement('div', {
      onClick,
      style: { border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 18, cursor: 'pointer', transition: 'border-color .15s,box-shadow .15s', flex: 1 },
      onMouseEnter: e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; },
      onMouseLeave: e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }
    },
      React.createElement('div', { style: { color: ai ? 'var(--ai-purple)' : 'var(--ink)', marginBottom: 14 } },
        ai ? React.createElement(window.Sparkles, { size: 24 }) : React.createElement(Icon, { name: icon, size: 24 })),
      React.createElement('div', { style: { fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' } }, title),
      React.createElement('div', { style: { fontSize: 14, color: 'var(--gray-500)', marginTop: 4 } }, desc));
  }

  /* ---- Option card with checkbox (personalities / criteria) ---- */
  function OptionCard({ title, desc, checked, onChange, editable, onEdit }) {
    return React.createElement('div', {
      onClick: () => editable ? (onEdit && onEdit()) : (onChange && onChange(!checked)),
      style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '13px 16px', cursor: 'pointer', background: editable ? 'var(--surface-1)' : '#fff' }
    },
      React.createElement('div', null,
        React.createElement('div', { style: { fontSize: 15, fontWeight: 600 } }, title),
        React.createElement('div', { style: { fontSize: 13, color: 'var(--gray-500)', marginTop: 2 } }, desc)),
      editable ? React.createElement(Icon, { name: 'pencil', size: 16, style: { color: 'var(--gray-400)' } })
        : React.createElement(Checkbox, { checked, onChange }));
  }

  /* ---- Field wrapper + inputs ---- */
  function Field({ label, children, help }) {
    return React.createElement('div', { style: { marginBottom: 22 } },
      React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600, marginBottom: 8 } }, label, help && React.createElement(HelpDot)),
      children);
  }
  const inputStyle = { width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-sans)', fontSize: 14, padding: '11px 13px', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', color: 'var(--ink)', background: '#fff', outline: 'none' };
  function TextInput(props) {
    return React.createElement('input', { ...props, style: { ...inputStyle, ...(props.style || {}) }, onFocus: e => e.target.style.borderColor = 'var(--ink)', onBlur: e => e.target.style.borderColor = 'var(--border)' });
  }
  function TextArea({ max = 200, value = '', onChange, placeholder, rows = 3 }) {
    return React.createElement('div', { style: { position: 'relative' } },
      React.createElement('textarea', { value, onChange: e => onChange && onChange(e.target.value), placeholder, rows, style: { ...inputStyle, resize: 'none' }, onFocus: e => e.target.style.borderColor = 'var(--ink)', onBlur: e => e.target.style.borderColor = 'var(--border)' }),
      React.createElement('span', { style: { position: 'absolute', right: 11, bottom: 9, fontSize: 11, color: 'var(--gray-400)', fontFamily: 'var(--font-mono)' } }, `${value.length}/${max}`));
  }
  function HelpDot() {
    return React.createElement('span', { style: { color: 'var(--gray-300)', display: 'inline-flex' } }, React.createElement(Icon, { name: 'help', size: 15 }));
  }

  /* ---- Toast ---- */
  function Toast({ kind = 'success', children }) {
    return React.createElement('div', {
      style: { position: 'fixed', right: 28, bottom: 28, display: 'flex', alignItems: 'center', gap: 11, background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '14px 18px', boxShadow: 'var(--shadow-lg)', fontSize: 15, fontWeight: 500, maxWidth: 430, zIndex: 60, animation: 'toastIn .25s ease' }
    },
      kind === 'success' ? React.createElement(window.CircleCheck, { size: 22 }) : React.createElement(window.CircleAlert, { size: 22 }),
      children);
  }

export { Button, IconButton, Badge, StatusText, Checkbox, SegmentedControl, SelectionTile, OptionCard, Field, TextInput, TextArea, Toast, HelpDot };
