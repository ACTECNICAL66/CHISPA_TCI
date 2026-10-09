// Datos de zonificación — sección 6.3 a 6.7 del informe CHISPA
export const ZONES = {
  taller: {
    letter: 'B',
    color: '#FFB300',
    title: 'Taller de microsoldadura · 6 puestos',
    size: '≈ 10 m² · franja este y esquina NE',
    desc: 'Lejos de la puerta (se controla el acceso a herramientas y solventes) y junto a la ventana norte: aprovecha ventilación natural y luz. Los bancos los construyen los propios estudiantes en el taller de la escuela.',
    view: 'taller',
    equip: [
      'Banco murado de trabajo — 2,80 × 0,70 × 0,90 h (4 puestos) · muro este',
      'Banco bajo ventana — 2,00 × 0,70 × 0,90 h (2 puestos) · muro norte',
      'Panel de herramientas con siluetas (metodología 5S) — 2,00 × 0,90 h',
      'Vitrina metálica con llave (herramientas, flux, solventes) — 0,90 × 0,45 × 1,80 h',
      'Cajoneras de componentes clasificados — 2, debajo de bancos',
      'Estaciones de soldadura con control de temperatura (350–450 °C) — 4',
      'Estación rework de aire caliente (montaje superficial) — 1',
      'Lámpara-lupa LED de brazo articulado — 1 por puesto',
      'Multímetro digital — 4 · Fuente de laboratorio 0–30 V — 2',
      'Mantel disipativo + pulsera antiestática (protección ESD) — 6 puestos',
      'Extractor de banco con filtro de carbón activado — 2 (30–60 W)'
    ]
  },
  biblioteca: {
    letter: 'A',
    color: '#3FA7FF',
    title: 'Biblioteca flexible',
    size: '≈ 12 m² · esquina NO · franja norte-oeste',
    desc: 'Ocupa la esquina más luminosa del espacio, junto a la ventana norte, y queda a la vista al ingresar: reafirma que el lugar sigue siendo también biblioteca. Estanterías existentes ancladas al muro norte más un rincón de lectura que hoy no existe.',
    view: 'biblioteca',
    equip: [
      'Estanterías — reuso del mobiliario existente · 1,20 × 0,35 × 1,80 h · ancladas al muro norte',
      'Mesa de lectura / estudio — 1,60 × 0,80 · esquina NO, junto a la ventana norte',
      'Sillas ergonómicas — 4',
      'Alfombra + sillón + lámpara de piso (3.000 K cálida) · rincón de lectura',
      'PC de catálogo digital (OPAC / planilla) · extremo sur del sector',
      'Cartelería con códigos QR por estante'
    ]
  },
  informatica: {
    letter: 'C',
    color: '#7C5CFF',
    title: 'Informática',
    size: '≈ 6 m² · muro sur, frente al pórtico',
    desc: 'Apoyada en el muro sur cerca de la puerta: menor recorrido de cableado hacia el tablero, sin interferir el barrido de la puerta.',
    view: 'informatica',
    equip: [
      'Mesa de trabajo — 2,55 × 0,60 × 0,75 h',
      'PC de escritorio completos — 4',
      'Carro de carga para 10–12 notebooks institucionales — 1'
    ]
  },
  flexible: {
    letter: '★',
    color: '#2ECC8F',
    title: 'Zona flexible central',
    size: '≈ 8 m² · centro del recinto',
    desc: 'El corazón integrador: se reconfigura según la actividad — estudio, trabajo grupal, extensión del taller o exposición. Uso simultáneo: hasta 8 estudiantes de pie o 4 sentados.',
    view: 'flexible',
    equip: [
      '2 mesas plegables con ruedas — 1,60 × 0,70 · se repliegan contra el muro',
      'TV 50" montada en muro este (1,60 h): pizarra digital, clases y simulación de circuitos',
      'Pasillos mínimos de 1,00 m · eje diagonal puerta → centro siempre libre'
    ]
  }
};

export const CAMPUS = {
  school: 'Instituto José Antonio Balseiro — IPET N.º 66',
  course: '6.º A · Nivel secundario',
  city: 'Córdoba Capital · Nueva Córdoba'
};
