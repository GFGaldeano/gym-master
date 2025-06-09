'use client';

import { useEffect, useState } from 'react';

export default function FechaHora() {
  const [fechaHora, setFechaHora] = useState<string>(() =>
    new Date().toLocaleString('es-PE', {
      dateStyle: 'short',
      timeStyle: 'medium',
    })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFechaHora(
        new Date().toLocaleString('es-PE', {
          dateStyle: 'short',
          timeStyle: 'medium',
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-sm text-gray-600 font-medium">
      {fechaHora}
    </div>
  );
}
