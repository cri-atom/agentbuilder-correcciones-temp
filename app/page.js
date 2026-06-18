'use client';

import { useState } from 'react';
import { BuilderCanvas } from '@/components/BuilderCanvas';
import { EvalPanel } from '@/components/EvalPanel';
import { Toast } from '@/components/primitives';

export default function Page() {
  const [evalOpen, setEvalOpen] = useState(true);
  const [toast, setToast] = useState(null);
  const pushToast = (kind, msg) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 3200);
  };

  return (
    <>
      <BuilderCanvas
        onEval={() => setEvalOpen(true)}
        onToast={() => pushToast('success', 'Cambios guardados')}
      />
      {evalOpen && <EvalPanel onClose={() => setEvalOpen(false)} pushToast={pushToast} />}
      {toast && <Toast kind={toast.kind}>{toast.msg}</Toast>}
    </>
  );
}
