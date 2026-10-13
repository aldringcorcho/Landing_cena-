"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { fechasTemporada, MESES, PASES } from "@/lib/temporada";
import TarjetasBrillo from "./TarjetasBrillo";

interface Confirmacion {
  nombre: string;
  fecha: string;
  pase: string;
  email: string;
}

type Campo = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const PREGUNTAS = [
  { id: "trabajo", texto: "¿A qué te dedicas ahora?", obligatoria: true },
  { id: "vida", texto: "¿Cómo es un día normal para ti? ¿Con quién lo pasas?", obligatoria: true },
  { id: "intereses", texto: "¿Qué te gusta hacer en tu tiempo libre?", obligatoria: true },
  { id: "objetivos", texto: "¿Qué te gustaría haber conseguido dentro de treinta años?", obligatoria: true },
  { id: "miedo", texto: "¿Hay algo del futuro que te preocupe?", obligatoria: false },
  { id: "limites", texto: "¿Hay algún tema del que prefieras no hablar durante la cena?", obligatoria: false },
];

export default function Reservas() {
  const fechas = useMemo(fechasTemporada, []);
  const form = useRef<HTMLFormElement>(null);
  const cuestionario = useRef<HTMLDivElement>(null);
  const gracias = useRef<HTMLDivElement>(null);

  const [fechaElegida, setFechaElegida] = useState<string | null>(null);
  const [abierto, setAbierto] = useState(false);
  const [error, setError] = useState("");
  const [confirmacion, setConfirmacion] = useState<Confirmacion | null>(null);

  const pasesOcupados = fechas.find((f) => f.valor === fechaElegida)?.ocupados ?? [];

  // Campos de los pasos 1 y 2 (fecha, pase y datos personales)
  const camposPrevios = (): Campo[] =>
    [...(form.current?.querySelectorAll("fieldset") ?? [])]
      .slice(0, 2)
      .flatMap((f) => [...f.querySelectorAll<Campo>("input, select, textarea")]);

  // El cuestionario se abre cuando los pasos 1 y 2 son válidos y se vuelve a cerrar si alguno
  // deja de serlo (por ejemplo, al borrar el teléfono). Lo escrito en él se conserva.
  const revisarPasos = (e?: { target: EventTarget }) => {
    if (e && cuestionario.current?.contains(e.target as Node)) return;
    const completos = camposPrevios().every((c) => c.checkValidity());
    setAbierto(completos);
    if (completos) setError("");
  };

  // Al elegir fecha, se desmarca el pase si ese día ya está reservado
  const elegirFecha = (valor: string) => {
    setFechaElegida(valor);
    const ocupados = fechas.find((f) => f.valor === valor)?.ocupados ?? [];
    form.current?.querySelectorAll<HTMLInputElement>('input[name="pase"]').forEach((p) => {
      if (ocupados.includes(p.value as (typeof PASES)[number])) p.checked = false;
    });
  };

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    // Mientras el cuestionario está cerrado, solo cuentan los campos de los pasos 1 y 2
    const primero = abierto
      ? f.querySelector<Campo>(":invalid")
      : camposPrevios().find((c) => !c.checkValidity());
    if (primero) {
      setError(`Falta completar ${primero.dataset.etiqueta ?? "este campo"}.`);
      primero.focus();
      return;
    }
    const datos = new FormData(f);
    setConfirmacion({
      nombre: String(datos.get("nombre")).trim().split(" ")[0],
      fecha: fechas.find((x) => x.valor === datos.get("fecha"))?.texto ?? "",
      pase: String(datos.get("pase")),
      email: String(datos.get("email")).trim(),
    });
  };

  useEffect(() => {
    if (confirmacion) gracias.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [confirmacion]);

  // Fechas agrupadas por mes para pintar un título por mes
  const porMes = useMemo(() => {
    const grupos = new Map<number, typeof fechas>();
    fechas.forEach((f) => grupos.set(f.mes, [...(grupos.get(f.mes) ?? []), f]));
    return [...grupos];
  }, [fechas]);

  return (
    <section id="reservas">
      <div className="estrecho">
        <h2>Reservas</h2>
        <p className="seccion-intro">
          De jueves a sábado, del 15 de octubre al 28 de noviembre. Dos pases por noche, una persona por pase.
        </p>
      </div>

      <div className="vidrio">
        {confirmacion ? (
          <div className="gracias" ref={gracias} role="status">
            <h3>Gracias, {confirmacion.nombre}. Tu mesa está apartada.</h3>
            <p>Te esperamos el {confirmacion.fecha} a las {confirmacion.pase}. Te guardamos la plaza 15 minutos mientras completas el pago.</p>
            <p>Te mandaremos la confirmación a {confirmacion.email}.</p>
          </div>
        ) : (
          <form ref={form} noValidate onSubmit={enviar} onInput={revisarPasos} onChange={revisarPasos}>
            <fieldset>
              <legend>1. Fecha y pase</legend>
              <div className="campo">
                {/* Sin título visible: la leyenda "1. Fecha y pase" ya lo dice. El nombre queda para lectores de pantalla */}
                {/* Las entradas tienen el mismo brillo que sigue al cursor que las tarjetas de "Cómo funciona" */}
                <TarjetasBrillo className="tickets" selector=".ticket" role="radiogroup" aria-label="Fecha">
                  {porMes.map(([mes, delMes]) => [
                    <p className="mes" key={`mes-${mes}`}>{MESES[mes]}</p>,
                    ...delMes.map((f) => (
                      <label key={f.valor} className={f.libres === 1 ? "ticket ultima" : "ticket"}>
                        <input
                          type="radio"
                          name="fecha"
                          value={f.valor}
                          required
                          disabled={f.libres === 0}
                          data-etiqueta="la fecha"
                          aria-label={`${f.texto}, ${f.libres === 0 ? "completo" : f.libres === 1 ? "queda 1 plaza" : "quedan 2 plazas"}`}
                          onChange={() => elegirFecha(f.valor)}
                        />
                        <span className="dia">{f.dia}</span>
                        <span className="num">{f.numero}</span>
                        <span className="plazas">{f.libres === 0 ? "Completo" : f.libres === 1 ? "Solo 1 plaza" : "2 plazas"}</span>
                      </label>
                    )),
                  ])}
                </TarjetasBrillo>
              </div>
              <div className="campo">
                <p className="etiqueta" id="titulo-pase">Pase</p>
                <div className="opciones" role="radiogroup" aria-labelledby="titulo-pase">
                  {/* "required" en los dos: si solo lo llevara el primero y ese pase estuviera
                      ocupado (desactivado), el navegador dejaría de exigir un pase */}
                  {PASES.map((p) => (
                    <label key={p}>
                      <input type="radio" name="pase" value={p} required disabled={pasesOcupados.includes(p)} data-etiqueta="el pase" /> {p}
                    </label>
                  ))}
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>2. Tus datos</legend>
              <div className="fila">
                <div className="campo">
                  <label htmlFor="nombre">Nombre y apellidos <small className="obligatorio">obligatorio</small></label>
                  <input id="nombre" name="nombre" type="text" autoComplete="name" required data-etiqueta="«Nombre y apellidos»" />
                </div>
                <div className="campo">
                  <label htmlFor="edad">Edad</label>
                  <input id="edad" name="edad" type="number" min={18} max={99} inputMode="numeric" required data-etiqueta="«Edad» (de 18 a 99)" />
                </div>
              </div>
              <div className="fila">
                <div className="campo">
                  <label htmlFor="email">Email <small className="obligatorio">obligatorio</small></label>
                  <input id="email" name="email" type="email" autoComplete="email" required data-etiqueta="«Email»" />
                </div>
                <div className="campo">
                  <label htmlFor="telefono">Teléfono <small className="obligatorio">obligatorio</small></label>
                  <input id="telefono" name="telefono" type="tel" autoComplete="tel" required pattern="[0-9+\(\)\s\-]{9,}" title="Al menos 9 dígitos" data-etiqueta="«Teléfono»" />
                </div>
              </div>
            </fieldset>

            {/* El cuestionario se despliega solo cuando la fecha, el pase y los datos están completos */}
            <p className={abierto ? "aviso-paso oculto-suave" : "aviso-paso"}>
              Completa fecha, pase y datos para seguir con el cuestionario.
            </p>
            <div className={abierto ? "desplegable abierto" : "desplegable"} ref={cuestionario} inert={!abierto}>
              <div className="desplegable-interior">
                <fieldset>
                  <legend>3. Cuestionario</legend>
                  <p className="ayuda">El actor prepara su personaje con estas respuestas. No hay respuestas buenas o malas.</p>
                  {PREGUNTAS.map((q) => (
                    <div className="campo" key={q.id}>
                      <label htmlFor={q.id}>{q.texto} {!q.obligatoria && <small>(opcional)</small>}</label>
                      <textarea id={q.id} name={q.id} required={q.obligatoria} data-etiqueta={`«${q.texto}»`} />
                    </div>
                  ))}
                  <div className="campo">
                    <label htmlFor="alergias">Alergias o intolerancias <small>(opcional)</small></label>
                    <input id="alergias" name="alergias" type="text" />
                  </div>
                </fieldset>

                <label className="check">
                  <input type="checkbox" name="acepto" required data-etiqueta="la casilla de aceptación" /> Acepto que el equipo lea mis respuestas para preparar la función.
                  No se comparten con nadie.
                </label>

                <div className="final">
                  <button className="boton" type="submit">Reservar por 95 €</button>
                  <p>El pago se hace en el siguiente paso.</p>
                </div>
              </div>
            </div>
            <p className="error" role="alert">{error}</p>
          </form>
        )}
      </div>
    </section>
  );
}
