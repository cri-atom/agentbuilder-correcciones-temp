// Asistente de Corrección — datos de muestra (ejemplo automotriz del FRD).

const FRENTES = {
  prompt:     { icon: 'target',      label: 'Prompt de agente',        emoji: '🎯' },
  route:      { icon: 'route',       label: 'Orquestación multi-agente', emoji: '🔀' },
  book:       { icon: 'book',        label: 'Base de conocimiento',    emoji: '📚' },
  clipboard:  { icon: 'clipboard',   label: 'Campos de captura',       emoji: '📋' },
  splitArrows:{ icon: 'splitArrows', label: 'Condiciones de handoff',  emoji: '↔' }
};

const RISK = {
  low:  { color: 'var(--success)', bg: 'var(--success-50)', label: 'Bajo riesgo' },
  med:  { color: 'var(--warning)', bg: 'var(--warning-50)', label: 'Riesgo medio' },
  high: { color: 'var(--danger)',  bg: 'var(--danger-50)',  label: 'Alto riesgo' }
};

// diff line: { t: 'ctx'|'add'|'del', s }
const PROPOSALS = [
    {
      id: 'P1', frente: 'prompt', risk: 'low', conf: 'alta', state: 'applied',
      agents: ['Agente Inventario', 'Agente Test Drive'],
      artefacto: 'Prompt · Agente Inventario y Agente Test Drive',
      title: 'Unificar el tratamiento al cliente («usted»)',
      justification: 'El Agente Inventario usa «tú» y el Agente Test Drive usa «usted», generando inconsistencia de tono cuando hay un handoff entre ambos.',
      criterios: [{ k: 'Tone Consistency', d: '+0.30' }],
      casos: 8, casosIds: '#2, #5, #7, #9, #11, #13, #14, #15',
      diffs: [{
        label: 'Prompt · ambos agentes', kind: 'lines',
        lines: [
          { t: 'ctx', s: '## Estilo de comunicación' },
          { t: 'ctx', s: '- Responde de forma clara y breve.' },
          { t: 'add', s: '- Trata SIEMPRE de usted al cliente, en todos los agentes del flujo.' },
        ]
      }]
    },
    {
      id: 'P2', frente: 'route', compose: ['route', 'splitArrows'], risk: 'med', conf: 'alta', state: 'applied',
      agents: ['Agente Inventario'],
      artefacto: 'Prompt · Agente Inventario  +  Condición · Inventario → Financiación',
      title: 'Derivar las consultas de financiación al agente correcto',
      justification: 'El Agente Inventario intenta responder sobre cuotas y financiación sin la KB ni las tools adecuadas. En 6 de 8 casos no deriva y la conversación se resuelve mal.',
      criterios: [{ k: 'Helpfulness', d: '+0.28' }],
      casos: 6, casosIds: '#3, #6, #8, #10, #12, #19',
      composite: true,
      diffs: [
        {
          label: 'Cambio 1 · Prompt · Agente Inventario', kind: 'lines',
          lines: [
            { t: 'ctx', s: '## Alcance del agente' },
            { t: 'add', s: '- No responder consultas sobre planes de pago, cuotas ni requisitos de financiación.' },
            { t: 'add', s: '- Transferir esas consultas al Agente Financiación.' },
          ]
        },
        {
          label: 'Cambio 2 · Condición · Inventario → Financiación', kind: 'beforeafter',
          before: 'El cliente pregunta por financiación.',
          after: 'El cliente consulta sobre planes de pago, cuotas, cálculo de financiación o requisitos para financiar (ej.: «¿en cuántas cuotas?», «¿cuánto pagaría por mes?»).'
        },
      ]
    },
    {
      id: 'P3', frente: 'book', risk: 'low', conf: 'media', state: 'applied',
      agents: ['Agente Inventario'],
      artefacto: 'Base de conocimiento · Tabla «Inventario 2026»',
      title: 'Aclarar cuándo consultar la tabla de inventario',
      justification: 'La tabla dinámica «Inventario 2026» está conectada, pero su descripción dice solo «Inventario». El LLM no entiende que ahí están los precios actualizados y responde con información genérica del prompt.',
      criterios: [{ k: 'Correctness', d: '+0.22' }],
      casos: 5, casosIds: '#1, #4, #16, #18, #22',
      diffs: [{
        label: 'Descripción de la tabla dinámica', kind: 'beforeafter',
        before: 'Inventario',
        after: 'Inventario en tiempo real con precios actualizados, stock por sucursal y características de cada vehículo. Consultar SIEMPRE que el cliente pregunte por un modelo, precio o disponibilidad específica.'
      }]
    },
    {
      id: 'P5', frente: 'splitArrows', risk: 'med', conf: 'alta', state: 'applied',
      agents: ['Agente Inventario'],
      artefacto: 'Condiciones · Inventario → Test Drive  y  Inventario → Agendamiento',
      title: 'Diferenciar dos condiciones de handoff muy similares',
      justification: 'Las condiciones «quiere probar un vehículo» y «quiere agendar» son semánticamente cercanas (>80%); el LLM transfiere al agente equivocado el 38% de las veces.',
      criterios: [{ k: 'Helpfulness', d: '+0.18' }, { k: 'Routing', d: '+0.40' }],
      casos: 4, casosIds: '#7, #11, #20, #24',
      diffs: [
        { label: 'Condición · Inventario → Test Drive', kind: 'beforeafter',
          before: 'El cliente quiere probar un vehículo.',
          after: 'El cliente manifestó interés en probar un modelo durante la visita, antes de decidir la compra (ej.: «quisiera probarlo», «me gustaría manejarlo»).' },
        { label: 'Condición · Inventario → Agendamiento', kind: 'beforeafter',
          before: 'El cliente quiere agendar.',
          after: 'El cliente ya decidió qué vehículo quiere y necesita coordinar fecha de entrega o gestión post-venta (ej.: «cuándo lo tengo», «cuándo lo retiro»).' },
      ]
    },
    {
      id: 'P4', frente: 'clipboard', risk: 'high', conf: 'alta', state: 'pending',
      agents: ['Agente Inventario'],
      artefacto: 'Campo de captura · «DNI» (Agente Inventario)',
      title: 'Pedir el DNI más tarde en la conversación',
      justification: 'El 44% de las conversaciones abandona cuando el agente pide el «DNI» en el primer turno. El cliente aún no construyó confianza y declina compartir información sensible.',
      riskReason: 'Subido a alto: el campo es obligatorio y lo usan nodos downstream en Flowbuilder.',
      criterios: [{ k: 'User Satisfaction', d: '+0.31' }],
      casos: 7, casosIds: '#2, #6, #9, #13, #17, #21, #25',
      diffs: [{
        label: 'Configuración del campo «DNI»', kind: 'field',
        rows: [
          { k: 'Tipo de captura', before: 'Obligatorio', after: 'Obligatorio', same: true },
          { k: 'Momento', before: 'Primer turno', after: 'Antes del agendamiento final (tras elegir modelo y sucursal)' },
          { k: 'Orden sugerido', before: 'DNI → nombre → email', after: 'Nombre → email → DNI' },
        ]
      }]
    },
  ];

const ACTIONS = [
    {
      id: 'A1', type: 'Herramienta', icon: 'wrench',
      title: 'Conectar Google Calendar al Agente Test Drive',
      why: 'El agente intenta agendar test drives pero no tiene cómo hacerlo realmente. Resolvería 6 de 15 casos fallidos. Mejora estimada en Helpfulness: +0.35.',
      casos: '#12, #14, #17, #21, #23, #28',
      target: 'la pantalla de tools del Agente Test Drive',
      followup: {
        frente: 'prompt',
        title: 'Instrucciones para usar Google Calendar',
        body: 'Agregar al prompt del Agente Test Drive instrucciones sobre cómo invocar @[Google Calendar · Crear evento]: cuándo usarla, qué campos pasar y qué hacer si el slot no está disponible.'
      }
    },
  ];

const RECS = [
    'Agregar ejemplos concretos dentro de la condición Inventario → Test Drive para mayor robustez ante variaciones de redacción del cliente.',
    'Etiquetar los documentos de fichas técnicas por modelo para mejorar la recuperación semántica de la KB.',
  ];

const EVAL = {
    name: 'Evaluación agente automotriz',
    cases: 15, low: 9,
    globalBefore: 0.62,
    criteria: [
      ['Tone Consistency', 0.42],
      ['Helpfulness', 0.42],
      ['Correctness', 0.55],
      ['User Satisfaction', 0.58],
      ['Prompt injection', 0.90],
    ]
  };

const COMPARE = {
    before: 0.62, after: 0.81, delta: '+0.19',
    mejoraron: 9, empeoraron: 1, igual: 5,
    tiempo: '2m 14s', costo: '$0.42',
    rows: [
      ['Tone Consistency', 0.42, 0.74],
      ['Helpfulness', 0.42, 0.70],
      ['Correctness', 0.55, 0.78],
      ['User Satisfaction', 0.58, 0.58],
      ['Prompt injection', 0.90, 0.88],
    ],
    regresiones: 1,
    casos: [
      ['#3', 0.40, 0.82, 'up'],
      ['#6', 0.38, 0.79, 'up'],
      ['#8', 0.45, 0.74, 'up'],
      ['#11', 0.52, 0.80, 'up'],
      ['#2', 0.55, 0.55, 'eq'],
      ['#19', 0.88, 0.61, 'down'],
    ]
  };

export const CORR = { FRENTES, RISK, PROPOSALS, ACTIONS, RECS, EVAL, COMPARE };
