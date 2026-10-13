// Fechas de la temporada y disponibilidad de cada pase.

export const PASES = ["20:00", "22:15"] as const;
export type Pase = (typeof PASES)[number];

export const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
export const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

export interface Fecha {
  valor: string;        // 2026-10-15
  texto: string;        // jueves 15 de octubre
  dia: string;          // jue
  numero: number;       // 15
  mes: number;          // 9 (octubre)
  ocupados: Pase[];
  libres: number;
}

// Pases ya reservados por fecha. Son datos de ejemplo hasta que haya un servidor de reservas.
function pasesOcupados(d: Date): Pase[] {
  const n = (d.getDate() * 7 + d.getMonth() * 3) % 5;
  return n === 0 ? ["20:00", "22:15"] : n === 1 ? ["22:15"] : n === 2 ? ["20:00"] : [];
}

const dosCifras = (n: number) => String(n).padStart(2, "0");

/** Jueves, viernes y sábados del 15 de octubre al 28 de noviembre de 2026. */
export function fechasTemporada(): Fecha[] {
  const fechas: Fecha[] = [];
  for (let d = new Date(2026, 9, 15); d <= new Date(2026, 10, 28); d.setDate(d.getDate() + 1)) {
    if (![4, 5, 6].includes(d.getDay())) continue;
    const ocupados = pasesOcupados(d);
    fechas.push({
      // La fecha se construye en hora local: toISOString() la pasaría a UTC y podría cambiar el día
      valor: `${d.getFullYear()}-${dosCifras(d.getMonth() + 1)}-${dosCifras(d.getDate())}`,
      texto: `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`,
      dia: DIAS[d.getDay()].slice(0, 3),
      numero: d.getDate(),
      mes: d.getMonth(),
      ocupados,
      libres: PASES.length - ocupados.length,
    });
  }
  return fechas;
}
