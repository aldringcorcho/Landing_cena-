// Logotipo: un plato visto desde arriba con una llama en el centro.
// El plato es la cena; la llama, la vela que alumbra la conversación; la marca en lo alto
// del borde recuerda la aguja de un reloj: el paso del tiempo.

export function Simbolo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="24" cy="24" r="15.5" stroke="currentColor" strokeWidth="1" opacity=".45" />
      <path d="M24 2.5v4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M24 13c3.4 4.6 6 7.7 6 12a6 6 0 0 1-12 0c0-4.3 2.6-7.4 6-12z" fill="currentColor" />
      <path d="M24 21.5c1.5 2 2.6 3.4 2.6 5.2a2.6 2.6 0 0 1-5.2 0c0-1.8 1.1-3.2 2.6-5.2z" fill="var(--noche)" opacity=".55" />
    </svg>
  );
}

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      <Simbolo className="logo-simbolo" />
      <span className="logo-texto">
        <span className="logo-l1">Cena con</span>
        <span className="logo-l2">tu futuro yo</span>
      </span>
    </span>
  );
}
