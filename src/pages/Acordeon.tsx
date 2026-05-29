import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Subtema {
  titulo: string;
  contenido: string[];
}

interface Area {
  nombre: string;
  icono: string;
  color: string;
  subtemas: Subtema[];
}

const areas: Area[] = [
  /* ── LENGUAJES ──────────────────────────────────────────────────── */
  {
    nombre: "Español", icono: "📝", color: "yellow",
    subtemas: [
      { titulo: "Fichas bibliográficas", contenido: [
        "Ficha bibliográfica: registra datos de una obra — Apellido, Nombre. Título. Editorial, año, lugar",
        "Ficha de trabajo: contiene información extraída y procesada de la fuente",
        "Ficha de cita textual: reproduce literalmente un fragmento entrecomillado",
        "Tip examen: preguntan para qué sirve cada tipo y qué dato va primero",
      ]},
      { titulo: "Componentes gráficos del texto", contenido: [
        "Títulos y subtítulos: jerarquizan y organizan la información",
        "Índice: localiza y organiza los temas de un libro o documento",
        "Ilustraciones, gráficas y tablas: apoyan visualmente el contenido",
        "Subrayado y recuadros: destacan información relevante",
        "Paráfrasis: reescribir una idea con otras palabras sin perder el significado",
        "Tema: de qué trata TODO el texto | Subtema: parte específica del tema",
        "Orden cronológico: secuencia temporal | Problema-solución: estructura argumentativa",
      ]},
      { titulo: "Gramática y nexos", contenido: [
        "Concordancia: sujeto y predicado deben coincidir en número y persona",
        "Nexos temporales: primero, luego, después, antes, finalmente",
        "Nexos adversativos: pero, aunque, sin embargo, a pesar de, aún",
        "Nexos causales: porque, ya que, debido a, puesto que",
        "Nexos concesivos: aunque, a pesar de que (conceden pero contradicen)",
        "Nexos condicionales: si, siempre que, con tal de que",
        "Jerarquizadores: la razón más importante, en primer lugar, también, finalmente",
        "Coma: enumera elementos, separa vocativo, oraciones coordinadas",
        "Punto y coma: separa oraciones largas relacionadas temáticamente",
        "Dos puntos: antes de enumeración, cita textual o vocativo",
        "Comillas: citas textuales, términos especiales, títulos de obras cortas",
        "Paréntesis: información aclaratoria secundaria",
        "Oración principal: expresa la idea central, puede estar sola",
        "Oración secundaria: depende de la principal (relativa, causal, temporal)",
        "Presente habitual: 'Los niños juegan' | Histórico: 'Colón llega en 1492' | Atemporal: 'El agua hierve a 100°C'",
      ]},
      { titulo: "Tipos de textos", contenido: [
        "Texto informativo: presenta hechos objetivos sin opinión del autor",
        "Texto narrativo: usa pretérito para contar sucesos; copretérito describe el fondo ('era', 'tenía')",
        "Texto legal/administrativo: lenguaje formal — contratos, leyes, oficios",
        "Noticia: responde ¿Qué? ¿Quién? ¿Cuándo? ¿Dónde? ¿Cómo? ¿Por qué?",
        "Reportaje: investiga un tema con mayor profundidad que la noticia",
        "Artículo de opinión: expresa punto de vista del autor ('creo que', 'pienso que')",
        "Hecho: verificable y objetivo | Opinión: subjetiva — 'creo que', 'en mi opinión', 'se cree que'",
        "Texto publicitario: usa hipérbole (exageración) y función apelativa para persuadir",
        "Función expresiva: centrada en el emisor/sentimientos | Apelativa: influir en el receptor | Referencial: informar",
      ]},
    ],
  },
  {
    nombre: "Habilidad Verbal", icono: "🔤", color: "purple",
    subtemas: [
      { titulo: "Comprensión lectora", contenido: [
        "Información explícita: se dice directamente en el texto",
        "Información inferida: se deduce de pistas del texto (no está escrita)",
        "Idea principal: de qué trata TODO el texto (puede estar implícita)",
        "Ideas secundarias: apoyan, explican o ejemplifican la idea principal",
        "Conclusión: cierra el argumento, se infiere de las premisas presentadas",
        "Secuencia: orden en que ocurrieron los acontecimientos",
        "Causa-consecuencia: A provoca B | Oposición: A contrasta con B",
        "General-particular: de lo amplio a lo específico",
        "Analogía: relación de semejanza entre dos conceptos",
        "Cronológica: orden temporal | Ejemplificativa: ilustra con casos específicos",
        "Hecho: comprobable y objetivo | Opinión: 'creo que', 'en mi opinión', 'se cree que'",
        "Significado por contexto: las palabras del entorno dan la pista del significado",
      ]},
      { titulo: "Vocabulario y analogías", contenido: [
        "Sinónimo: mismo significado — súplica=ruego, absurdo=disparatado, ocio=descanso",
        "Antónimo: significado opuesto — implementar≠abolir, árido≠fértil, ocio≠actividad",
        "Analogía tipo-categoría: honradez:virtud = vanidad:defecto",
        "Analogía causa-efecto: canas:vejez = humo:fuego",
        "Analogía individuo-colectivo: abeja:enjambre = perro:jauría = pez:cardumen",
        "Analogía parte-todo: rueda:bicicleta = página:libro",
        "Analogía instrumento-uso: bisturí:cirujano = pincel:pintor",
        "Tip: primero identifica QUÉ tipo de relación existe en el par dado",
      ]},
    ],
  },

  /* ── SABERES Y PENSAMIENTO CIENTÍFICO ────────────────────────────── */
  {
    nombre: "Matemáticas", icono: "🔢", color: "blue",
    subtemas: [
      { titulo: "Números, fracciones y porcentajes", contenido: [
        "Enteros: mismo signo → suma y conserva signo | diferente signo → resta y toma el mayor",
        "Multiplicación: (+)(+)=+ | (-)(-)==+ | (+)(-)=- | cualquier × 0 = 0",
        "Tip: (-5)(2)(-3)(0) = 0 — si hay un cero en la cadena, el producto es cero",
        "Fracciones mismo denominador: suma o resta los numeradores directamente",
        "Fracciones distinto denominador: calcula el MCM y convierte",
        "Porcentaje: %=parte/total×100 | parte=total×(%/100)",
        "Incremento 120%: nuevo=original×(1+1.20)=original×2.20",
        "Ejemplo: 10,000 ratones +120% → 10,000×2.20 = 22,000",
        "Proporcionalidad directa: x/y = constante (más→más)",
        "Proporcionalidad inversa: x×y = constante (más→menos)",
      ]},
      { titulo: "Potencias y radicación", contenido: [
        "a^m × a^n = a^(m+n) — misma base, SUMA exponentes",
        "a^m ÷ a^n = a^(m-n) — misma base, RESTA exponentes",
        "(a^m)^n = a^(m×n) — potencia de potencia, MULTIPLICA exponentes",
        "a^0 = 1 (cualquier base distinta de 0 elevada a 0 es 1)",
        "a^(-n) = 1/a^n (exponente negativo = fracción)",
        "Ejemplo: 2^3 × 2^2 = 2^5 = 32",
        "sqrt(a×b) = sqrt(a) × sqrt(b) | sqrt(a/b) = sqrt(a)/sqrt(b)",
      ]},
      { titulo: "Álgebra y ecuaciones", contenido: [
        "Ecuación 1° grado: ax+b=c → x=(c-b)/a",
        "Ejemplo: 3x-5=10 → 3x=15 → x=5",
        "Sistema por sustitución: despeja una variable y sustituye en la otra ecuación",
        "Sistema por eliminación: suma/resta las ecuaciones para cancelar una variable",
        "Ejemplo: 4x+5y=48 y 3x-y=-2 → de 2a: y=3x+2 → 4x+5(3x+2)=48 → x=2, y=8",
        "Ecuación 2° grado: ax²+bx+c=0",
        "Fórmula general: x=(-b±sqrt(b²-4ac))/2a",
        "Discriminante: b²-4ac>0 dos soluciones | =0 una solución | <0 sin solución real",
        "Factorización (a=1): busca dos números cuyo producto=c y suma=b",
        "Productos notables: (a+b)²=a²+2ab+b² | (a-b)²=a²-2ab+b² | (a+b)(a-b)=a²-b²",
        "Proporcionalidad en plano cartesiano: pendiente m=(y2-y1)/(x2-x1)",
      ]},
      { titulo: "Estadística y probabilidad", contenido: [
        "Media aritmética: suma todos los datos ÷ cantidad de datos",
        "Mediana: valor central al ordenar de menor a mayor",
        "Si hay cantidad par de datos: promedio de los dos valores centrales",
        "Moda: el valor que más se repite (puede haber más de una)",
        "Ejemplo: 6,7,9,7,9,9,9 → Media=56/7=8, Moda=9",
        "Probabilidad: P(A) = casos favorables / casos totales",
        "Ejemplo: dado de 6 caras, P(número par) = 3/6 = 1/2",
        "Tabla de frecuencia relativa: cada frecuencia ÷ total (todas suman 1)",
        "Frecuencia absoluta: cuántas veces aparece un dato",
      ]},
      { titulo: "Geometría", contenido: [
        "Pitágoras: a²+b²=c² (solo triángulos rectángulos, c es la hipotenusa)",
        "Ángulos internos de triángulo suman 180° | de cuadrilátero suman 360°",
        "Semejanza de triángulos: mismos ángulos y lados proporcionales",
        "Área triángulo: base×altura/2 | Área círculo: π×r²",
        "Circunferencia: 2πr | Área rectángulo: base×altura",
        "Área trapecio: (B+b)×h/2 | Área rombo: d1×d2/2",
        "Volumen cubo: lado³ | Volumen cilindro: π×r²×h",
        "Volumen cono: (1/3)×π×r²×h | Esfera: (4/3)×π×r³",
        "sen(θ)=opuesto/hipotenusa | cos(θ)=adyacente/hipotenusa | tan(θ)=opuesto/adyacente",
      ]},
    ],
  },
  {
    nombre: "Habilidad Matemática", icono: "🧩", color: "indigo",
    subtemas: [
      { titulo: "1. Sucesiones numéricas", contenido: [
        "Aritmética: diferencia constante (3,6,9,12 → +3)",
        "Geométrica: razón constante (2,6,18,54 → ×3)",
        "Cuadrática: diferencias de 2do orden crecen de 2 en 2",
        "Fibonacci: suma los dos anteriores (1,1,2,3,5,8,13,21...)",
        "Cuadrados de primos: 4,9,25,49,121... (2²,3²,5²,7²,11²)",
        "Tip: calcula diferencias entre términos consecutivos",
      ]},
      { titulo: "2. Series espaciales", contenido: [
        "Rotación 90° horario: lo que apuntaba arriba apunta a la derecha",
        "Rotación 180°: figura queda invertida",
        "Rotación 270° horario = 90° antihorario",
        "Identifica: giro, reflexión, traslación o cambio de tamaño",
        "Contar figuras compuestas: incluye las que contienen a otras",
      ]},
      { titulo: "3. Imaginación espacial", contenido: [
        "Desarrollo plano de figuras 3D: visualizar qué sólido forma",
        "Cubos y sus vistas: frontal, lateral, superior",
        "Identificar sólido a partir de sus vistas ortogonales",
      ]},
      { titulo: "4. Problemas de razonamiento", contenido: [
        "Regla de tres directa: más→más (150 botellas/20min → 60 botellas=8min)",
        "Regla de tres inversa: más→menos",
        "Problemas de edades: plantea ecuación con variable",
        "MCD: factor común mayor | Ejemplo: MCD(24,36)=12",
        "MCM: múltiplo común menor",
      ]},
    ],
  },
  {
    nombre: "Biología", icono: "🧬", color: "emerald",
    subtemas: [
      { titulo: "Biodiversidad y evolución", contenido: [
        "NMRICRE: Nutrición, Movimiento, Reproducción, Irritabilidad, Crecimiento, Relación, Excreción",
        "Irritabilidad: capacidad de responder a estímulos del ambiente",
        "Darwin: selección natural — el más adaptado sobrevive y se reproduce",
        "Adaptación: cambio hereditario que mejora la supervivencia en el ambiente",
        "Biodiversidad en México: país megadiverso (Oaxaca, Chiapas, Veracruz, Guerrero)",
        "Principal causa de pérdida de biodiversidad: venta clandestina de especies",
        "Desarrollo sustentable: satisfacer necesidades presentes sin comprometer las futuras",
        "Almidón en: papa, maíz, trigo (NO en mantequilla, queso ni carne)",
        "Importancia de conservar ecosistemas: regulan clima, agua, aire y son fuente de recursos",
      ]},
      { titulo: "Transformación de energía (fotosíntesis y respiración)", contenido: [
        "Fotosíntesis: 6CO₂ + 6H₂O + luz → C₆H₁₂O₆ + 6O₂ (ocurre en cloroplastos)",
        "Autótrofos: producen su alimento — plantas, algas, bacterias fotosintéticas",
        "Heterótrofos: dependen de otros — animales, hongos, la mayoría de bacterias",
        "Respiración aerobia: glucosa + O₂ → CO₂ + H₂O + energía (ATP)",
        "Respiración anaerobia: sin O₂ → fermentación (más lenta, menos energía)",
        "Fermentación láctica: yogur, queso | Fermentación alcohólica: pan, cerveza, vino",
        "Ciclo del carbono: fotosíntesis absorbe CO₂, respiración y combustión liberan CO₂",
        "Ciencia y tecnología: pueden tanto preservar como dañar el ambiente",
      ]},
      { titulo: "Nutrición y salud ambiental", contenido: [
        "Dieta equilibrada: todos los nutrimentos en proporción adecuada",
        "Dieta completa: incluye proteínas, carbohidratos, grasas, vitaminas y minerales",
        "Dieta higiénica: libre de contaminantes y microorganismos patógenos",
        "Obesidad: exceso calórico | Desnutrición: déficit de nutrimentos esenciales",
        "Calentamiento global: aumento de CO₂ y CH₄ (gases de invernadero) eleva temperatura",
        "Contaminación atmosférica: industrias, vehículos, quema de basura y combustibles fósiles",
        "Enfermedades respiratorias: asma, bronquitis, EPOC — se agravan con la contaminación",
      ]},
      { titulo: "Reproducción y sexualidad", contenido: [
        "Mitosis: 1 célula → 2 células IDÉNTICAS (para crecer y reparar tejidos)",
        "Meiosis: 1 célula → 4 células con ½ cromosomas (para reproducción sexual)",
        "Reproducción sexual: combina material genético → descendencia DIFERENTE a los progenitores",
        "Reproducción asexual: sin óvulo ni espermatozoide → descendencia IDÉNTICA al progenitor",
        "Anticonceptivos naturales (ritmo, temperatura) < mecánicos (condón) < hormonales (pastilla)",
        "Condón: ÚNICO método que protege contra ITS Y embarazo no deseado simultáneamente",
        "ITS más comunes: VIH/SIDA, sífilis, gonorrea, herpes, VPH",
        "Prevención ITS: abstinencia, condón correcto, vacuna VPH",
      ]},
      { titulo: "Genética", contenido: [
        "Gen: segmento de ADN que codifica una característica hereditaria",
        "Cromosoma: estructura que contiene los genes (humanos: 46 cromosomas = 23 pares)",
        "Genotipo: constitución genética del organismo (AA, Aa, aa)",
        "Fenotipo: cómo se expresa el genotipo (color de ojos, tipo de sangre)",
        "Alelo dominante (A): se expresa aunque haya solo una copia",
        "Alelo recesivo (a): se expresa solo si hay dos copias (aa)",
        "Cuadro de Punnett: predice probabilidades de fenotipos en la descendencia",
        "Manipulación genética: beneficios (vacunas, cultivos resistentes) y riesgos éticos",
      ]},
    ],
  },
  {
    nombre: "Física", icono: "⚡", color: "cyan",
    subtemas: [
      { titulo: "El movimiento", contenido: [
        "Velocidad: magnitud vectorial (tiene dirección) = desplazamiento/tiempo",
        "Rapidez: magnitud escalar (solo tamaño) = distancia/tiempo",
        "Aceleración = (v_final - v_inicial) / tiempo",
        "MRU (Rectilíneo Uniforme): velocidad constante, aceleración = 0",
        "MRUV: velocidad variable, aceleración constante distinta de 0",
        "Caída libre: g = 9.8 m/s² (aprox 10) — sin resistencia del aire",
        "Gráfica posición-tiempo MRU: línea recta | pendiente = velocidad",
        "Gráfica posición-tiempo en reposo: línea horizontal",
        "Gráfica velocidad-tiempo MRU: línea horizontal | MRUV: línea inclinada",
      ]},
      { titulo: "Fuerzas, Newton y energía", contenido: [
        "1ª Ley (Inercia): objeto en reposo sigue en reposo si la fuerza neta es cero",
        "2ª Ley: F = m × a | Ejemplo: m=2kg, a=5m/s² → F=10N",
        "3ª Ley: toda acción tiene una reacción igual y opuesta",
        "Fuerza resultante: suma vectorial de todas las fuerzas",
        "Equilibrio: fuerza resultante = 0",
        "Ley de Gravitación Universal: F = G×m1×m2/r²",
        "Peso = masa × g | Diferencia: masa en kg (intrínseca), peso en N (fuerza)",
        "Energía cinética: Ec = (1/2)×m×v²",
        "Energía potencial: Ep = m×g×h | Ejemplo: 5kg a 20m → Ep=5×10×20=1000J",
        "Conservación: Ec+Ep=constante (sin fricción) — al caer Ep disminuye, Ec aumenta",
        "Trabajo: W = F×d×cos(θ) | θ=90° → W=0 | Unidad: Joule (J)",
      ]},
      { titulo: "Modelo cinético, calor y presión", contenido: [
        "Modelo cinético: toda materia está formada por partículas en movimiento constante",
        "Temperatura: medida del movimiento promedio de partículas (°C o Kelvin)",
        "Calor: energía que se transfiere de un cuerpo caliente a uno frío",
        "Calor ≠ temperatura: el calor es la transferencia, no una propiedad del objeto",
        "Presión: P = fuerza/área | unidad: Pascal (Pa)",
        "Principio de Pascal: la presión aplicada a un fluido se transmite íntegramente",
        "Principio de conservación de energía: la energía ni se crea ni se destruye, se transforma",
      ]},
      { titulo: "Electricidad, magnetismo y ondas", contenido: [
        "Cargas eléctricas: iguales se repelen, opuestas se atraen",
        "Electrización por frotamiento: transfiere electrones entre materiales",
        "Electrización por contacto: el conductor transmite su carga al tocarlo",
        "Electrización por inducción: sin contacto, polariza las cargas del objeto",
        "Campo magnético: generado por corriente eléctrica (electromagnetismo)",
        "Brújula: apunta al norte por el campo magnético terrestre",
        "Inducción electromagnética: mover un conductor en campo magnético genera corriente",
        "Onda: transfiere energía sin transportar materia",
        "Espectro visible: rojo (longitud de onda mayor) → violeta (longitud de onda menor)",
        "Frecuencia y longitud de onda son inversamente proporcionales",
        "Refracción: cambio de velocidad de la luz al pasar entre medios diferentes",
        "Prisma: descompone la luz blanca en el espectro visible (arcoíris)",
      ]},
    ],
  },
  {
    nombre: "Química", icono: "🧪", color: "orange",
    subtemas: [
      { titulo: "Propiedades de la materia", contenido: [
        "Propiedades físicas: observables sin cambiar composición — color, densidad, punto de fusión/ebullición",
        "Propiedades químicas: cómo reacciona — combustibilidad, oxidación, corrosión",
        "Cambio físico: no cambia composición (hielo→agua, triturar sal, doblar papel)",
        "Cambio químico: produce nueva(s) sustancia(s) — combustión, oxidación de manzana, corrosión del hierro",
        "Ley de conservación de la masa: masa reactivos = masa productos",
        "Métodos de separación: filtración (sólido-líquido), destilación (líquidos con diferente punto de ebullición), decantación, cristalización, evaporación",
        "Mezcla homogénea (solución): composición uniforme | Heterogénea: composición variable y observable",
      ]},
      { titulo: "Estructura atómica y tabla periódica", contenido: [
        "Protones (+) y neutrones: en el núcleo | Electrones (-): en orbitales alrededor del núcleo",
        "Número atómico (Z) = cantidad de protones — define el elemento",
        "Número de masa (A) = protones + neutrones | Neutrones = A - Z",
        "Ejemplo: ²⁷Al: Z=13 protones, A=27, neutrones=14",
        "Tabla periódica: ordenada por número atómico creciente",
        "Periodos (filas): 7 periodos — el periodo indica el nivel de energía del último electrón",
        "Grupos (columnas): 18 grupos — mismas propiedades químicas en el mismo grupo",
        "Metales: conductores, maleables, brillantes (izquierda y centro de la tabla)",
        "No metales: malos conductores (derecha de la tabla)",
        "Enlace iónico: metal + no metal (uno cede, otro recibe electrones)",
        "Enlace covalente: no metal + no metal (comparten electrones)",
        "Estructura de Lewis: puntos alrededor del símbolo = electrones de valencia",
        "Ion: átomo que ganó (anión -) o perdió (catión +) electrones",
      ]},
      { titulo: "Reacciones químicas", contenido: [
        "Reactivos → Productos (ecuación química)",
        "Balancear: misma cantidad de átomos de cada elemento en ambos lados",
        "Ejemplo: 2H₂ + O₂ → 2H₂O (balanceada: 4H y 2O en cada lado)",
        "Mol: unidad = 6.022×10²³ partículas (número de Avogadro)",
        "Ácidos: liberan H⁺ en agua | pH < 7 | vinagre, HCl, jugo de limón",
        "Bases: liberan OH⁻ en agua | pH > 7 | jabón, NaOH, bicarbonato",
        "Neutro: pH = 7 (agua pura)",
        "Oxidación: pierde electrones | Reducción: gana electrones",
        "Regla OIL RIG: Oxidación es pérdida (Oxidation Is Loss), Reducción es ganancia (Reduction Is Gain) de electrones",
      ]},
    ],
  },

  /* ── ÉTICA, NATURALEZA Y SOCIEDADES ──────────────────────────────── */
  {
    nombre: "Historia", icono: "📜", color: "red",
    subtemas: [
      { titulo: "S.XVI-XVIII: Renacimiento, humanismo y conquistas", contenido: [
        "1453: turcos toman Constantinopla → bloquean ruta a Asia → Europa busca nuevas rutas",
        "Humanismo: el ser humano como centro del universo (vs teocentrismo medieval)",
        "Renacimiento: renovación cultural, artística y científica en Europa (s.XV-XVI)",
        "Expediciones: Colón (1492 América), Vasco da Gama (India 1498), Magallanes (vuelta al mundo 1519-22)",
        "Conquista de México: Hernán Cortés 1519-1521, alianzas con pueblos oprimidos por aztecas",
      ]},
      { titulo: "S.XVIII-XIX: Ilustración y revoluciones", contenido: [
        "Ilustración: razón y ciencia sobre fe y tradición (s.XVIII)",
        "Enciclopedia: compiló el conocimiento ilustrado (Diderot, D'Alembert)",
        "Independencia EE.UU. 1776: primer Estado moderno democrático",
        "Revolución Francesa 1789: libertad, igualdad, fraternidad → fin del absolutismo",
        "Consecuencias en América: inspiró los movimientos independentistas latinoamericanos",
        "Revolución Industrial (s.XVIII-XIX): máquina de vapor, trabajo asalariado, urbanización",
        "Absolutismo: el rey concentraba todo el poder ('El Estado soy yo' — Luis XIV)",
      ]},
      { titulo: "S.XIX-1920: Nacionalismo, imperialismo y 1ª GM", contenido: [
        "Nacionalismo: identidad basada en lengua, cultura e historia común",
        "Imperialismo: potencias europeas colonizaron África y Asia (s.XIX)",
        "1ª Guerra Mundial 1914-1918: guerra de trincheras, armas químicas, ~20 millones muertos",
        "Detonante: asesinato del Archiduque Francisco Fernando en Sarajevo (28 jun 1914)",
        "Triple Alianza (Alemania, Austria-Hungría, Italia) vs Triple Entente (Francia, GB, Rusia)",
        "Paz de Versalles 1919: Alemania cargó con toda la culpa → resentimiento → causa de la 2ª GM",
      ]},
      { titulo: "1920-1960: Fascismo, nazismo y 2ª GM", contenido: [
        "Fascismo (Italia, Mussolini): Estado totalitario, desintegración del parlamento",
        "Nazismo (Alemania, Hitler): persecución racial, antisemitismo, concepto de raza aria",
        "Clave: fascismo=Estado sobre todo | nazismo=raza sobre todo",
        "2ª GM 1939-1945: inició con invasión alemana a Polonia",
        "Aliados (EE.UU., GB, URSS, Francia) vs Eje (Alemania, Italia, Japón)",
        "Holocausto: genocidio de ~6 millones de judíos y otros grupos",
        "Fin: bomba atómica en Hiroshima y Nagasaki, agosto 1945",
      ]},
      { titulo: "Guerra Fría y mundo contemporáneo", contenido: [
        "Guerra Fría 1947-1991: EE.UU. (capitalismo) vs URSS (socialismo) — sin guerra directa",
        "Herramientas: carrera armamentista, carrera espacial, apoyo a regímenes aliados",
        "Guerras proxy: Corea, Vietnam, Cuba como escenarios de la tensión",
        "Caída del Muro de Berlín 1989 → disolución de la URSS 1991",
        "Guerra del Golfo 1990-91: EE.UU. vs Iraq por invasión de Kuwait (petróleo)",
        "Globalización: interdependencia económica mundial tras el fin de la Guerra Fría",
      ]},
      { titulo: "México prehispánico y colonial", contenido: [
        "Mesoamérica: área cultural — Aztecas (Mexicas), Mayas, Olmecas, Zapotecas, Toltecas",
        "Aztecas: Triple Alianza con Texcoco y Tlacopan — capital Tenochtitlan",
        "Virreinato de Nueva España: inició 1535, duró ~300 años",
        "Audiencia: tribunal superior que administraba justicia en nombre del rey",
        "Inquisición: controlaba la ortodoxia religiosa e ideológica",
        "Economía novohispana: minería de plata (Zacatecas, Guanajuato) como actividad principal",
        "Criollismo: nacidos en América de padres españoles — discriminados pero aspiraban al poder",
        "Absolutismo ilustrado: reformas borbónicas para modernizar y centralizar el imperio",
      ]},
      { titulo: "México independiente: 1821-1910", contenido: [
        "Independencia consumada 1821: Agustín de Iturbide + Plan de Iguala (tres garantías)",
        "Deuda e inestabilidad: México tardó décadas en consolidarse como Estado",
        "Guerra México-EE.UU. 1846-47: pérdida de Texas y la mitad del territorio nacional",
        "Reforma liberal: Benito Juárez, Constitución 1857, separación Iglesia-Estado",
        "Intervención francesa 1862-1867: Maximiliano de Habsburgo como emperador",
        "República Restaurada: Juárez regresa al poder, política anticlerical",
        "Porfiriato 1876-1910: Porfirio Díaz, 'paz y progreso', inversión extranjera, represión",
        "Huelgas de Cananea (1906) y Río Blanco (1907): antecedentes de la Revolución",
      ]},
      { titulo: "Revolución y Constitución de 1917", contenido: [
        "Insurrección maderista 1910: Francisco I. Madero, Plan de San Luis",
        "Líderes: Zapata (tierra y libertad, Plan de Ayala), Villa (norte), Carranza, Obregón",
        "Diversidad regional: cada zona tenía sus propias demandas e ideología",
        "Constitución de 1917: una de las más avanzadas del mundo en su época",
        "Art. 3°: educación laica, gratuita y obligatoria",
        "Art. 27°: tierras y recursos naturales son propiedad originaria de la Nación",
        "Art. 123°: jornada 8 hrs, salario mínimo, descanso semanal, seguridad social",
        "Guerra Cristera 1926-29: conflicto entre el gobierno y la Iglesia católica",
        "Partido único: consolidación del poder en lo que sería el PRI",
      ]},
      { titulo: "México en la era global (1970-2000)", contenido: [
        "Movimiento estudiantil 1968: masacre de Tlatelolco (2 oct), promotor de democracia",
        "Neoliberalismo: privatización de empresas estatales, apertura al mercado externo (1980s-90s)",
        "TLCAN 1994: Tratado de Libre Comercio con EE.UU. y Canadá",
        "Reforma electoral: creación del IFE (1990) para dar legitimidad a las elecciones",
        "Alternancia política 2000: Vicente Fox (PAN) ganó, terminando 71 años del PRI",
        "EZLN 1994: levantamiento zapatista en Chiapas contra el TLCAN y el olvido indígena",
      ]},
    ],
  },
  {
    nombre: "Geografía", icono: "🌍", color: "teal",
    subtemas: [
      { titulo: "Espacio geográfico y mapas", contenido: [
        "Componentes del espacio: naturales (relieve, clima), sociales (población), económicos (producción, transporte, comercio)",
        "Categorías de análisis: región (área con características comunes), paisaje, territorio, lugar",
        "Latitud: distancia al ecuador en paralelos (0°-90° N o S)",
        "Longitud: distancia al meridiano de Greenwich en meridianos (0°-180° E u O)",
        "Husos horarios: 24 zonas de 15° — cada huso = 1 hora de diferencia",
        "SIG: Sistemas de Información Geográfica — capas de datos en mapas digitales",
        "GPS: satélites que determinan coordenadas exactas en cualquier punto del planeta",
        "Mapas temáticos: naturales, económicos, políticos, sociales, culturales",
      ]},
      { titulo: "Recursos naturales y ambiente", contenido: [
        "Rotación (24 hrs): ciclo día-noche | Traslación (365 días): estaciones del año",
        "Placas tectónicas convergentes: zonas de mayor sismicidad y vulcanismo",
        "Ciclo hidrológico: evaporación → condensación → precipitación → infiltración → escurrimiento",
        "Infiltración: recarga mantos freáticos (agua subterránea)",
        "Capas atmósfera: troposfera (clima), estratosfera (ozono), mesosfera, termosfera, exosfera",
        "Biodiversidad: número de especies — México es megadiverso (top 5 mundial)",
        "Especies endémicas: existen SOLO en una región del planeta",
        "Calentamiento global: gases de invernadero (CO₂, CH₄) elevan temperatura media",
        "Ecotecnias: tecnologías que reducen impacto ambiental (paneles solares, biodigestores)",
        "Ecoturismo: turismo que minimiza impacto y beneficia a comunidades locales",
      ]},
      { titulo: "Población y riesgos", contenido: [
        "Población absoluta: número total de personas en un territorio",
        "Densidad (relativa): habitantes por km²",
        "Crecimiento: natalidad - mortalidad + saldo migratorio",
        "Migración interna: dentro del mismo país | Internacional: entre países",
        "Causas de migración: económicas (trabajo), sociales (violencia), ambientales (desastres)",
        "Zonas sísmicas: límites convergentes de placas (Anillo de Fuego del Pacífico)",
        "Riesgos en México: Yucatán=huracanes | CDMX=sismos | costas pacífico=tsunamis",
        "Vulnerabilidad: grado de exposición al daño ante un riesgo natural o social",
      ]},
      { titulo: "Espacios económicos y desigualdad", contenido: [
        "Sector primario: extrae recursos — agricultura, ganadería, pesca, minería",
        "Sector secundario: transforma — industria, manufactura, construcción",
        "Sector terciario: presta servicios — comercio, turismo, educación, salud",
        "Transporte marítimo: el más usado para grandes volúmenes (petróleo, granos)",
        "FMI: 190 miembros, promueve estabilidad financiera y comercio mundial",
        "IDH (Índice de Desarrollo Humano): combina salud, educación e ingreso",
        "Países centrales (IDH alto): EE.UU., Alemania | Periféricos (IDH bajo): África subsahariana",
        "Empresas transnacionales: operan en varios países, concentran capital global",
      ]},
      { titulo: "Cultura, patrimonio y soberanía", contenido: [
        "Diversidad cultural: ~68 lenguas indígenas en México + español",
        "Multiculturalidad: coexistencia de varias culturas en un territorio",
        "Interculturalidad: diálogo activo e intercambio entre culturas",
        "Globalización cultural: homogenización de costumbres por los medios de comunicación",
        "Mar territorial: 12 millas náuticas desde la costa — soberanía plena del Estado",
        "Zona económica exclusiva (ZEE): 200 millas — derechos exclusivos de exploración y explotación",
        "Patrimonio UNESCO México: Teotihuacán, Chichén Itzá, Monte Albán, zonas coloniales (Oaxaca, Puebla, Guanajuato)",
        "Fronteras terrestres: norte con EE.UU., sur con Guatemala y Belice",
      ]},
    ],
  },
  {
    nombre: "Formación Cívica y Ética", icono: "⚖️", color: "pink",
    subtemas: [
      { titulo: "Ética personal y autonomía moral", contenido: [
        "Autonomía moral: decidir con criterio propio basado en valores y reflexión",
        "Heteronomía moral: seguir reglas impuestas sin reflexión propia",
        "Conciencia moral: juicio interno sobre lo correcto e incorrecto",
        "Libertad de decisión: tiene límites cuando afecta los derechos de otros",
        "Empatía: ponerse en el lugar del otro — base del desarrollo moral y social",
        "Diálogo: herramienta para resolver conflictos morales y sociales",
        "Normas morales: reguladas por la conciencia (no por el Estado)",
        "Normas jurídicas: impuestas por el Estado, son obligatorias y coercitivas",
        "Normas sociales: dictadas por la costumbre y la cultura",
        "Valores estéticos: apreciación de la belleza y el arte",
        "Valores económicos: asignados a bienes y servicios según utilidad o escasez",
        "Valores morales: orientados por ideales de justicia, dignidad y bien común",
      ]},
      { titulo: "Identidad y adolescencia", contenido: [
        "Identidad personal: grupos de pertenencia, tradiciones, historias compartidas",
        "Adolescencia: cambios físicos (pubertad), sociales (nuevas relaciones) y afectivos (emociones intensas)",
        "Derechos de adolescentes: salud, educación, recreación, protección contra violencia",
        "Obligaciones: cumplir con estudios, respetar normas, participar en la comunidad",
        "Violencia física: daño corporal | Psicológica: daño emocional, humillación",
        "Violencia económica: explotar laboralmente o pagar menos del salario mínimo",
        "Maltrato, abuso y acoso sexual: son delitos, deben denunciarse",
        "Respuesta asertiva: comunicar límites con claridad y firmeza, sin agredir",
        "Situaciones de riesgo: ITS, adicciones, violencia — requieren información y prevención",
      ]},
      { titulo: "Democracia, Estado y ciudadanía", contenido: [
        "Democracia: el pueblo elige a sus gobernantes mediante el voto (principio de mayoría)",
        "Características: pluralismo, respeto a minorías, separación de poderes, estado de derecho",
        "Soberanía: el poder reside en el pueblo, que lo delega mediante el voto",
        "Componentes del Estado mexicano: población, territorio y gobierno",
        "División de poderes: Ejecutivo (Presidente), Legislativo (Congreso), Judicial (SCJN)",
        "Partidos políticos: representan corrientes ideológicas y canalizan la participación",
        "Participación ciudadana: voto, plebiscito, referéndum, consulta popular, manifestación",
        "Retos de la democracia: corrupción, abstencionismo, desigualdad, violencia política",
        "Derechos humanos: dignidad, autonomía, libertad, igualdad y justicia social",
      ]},
      { titulo: "Constitución, derechos y convivencia", contenido: [
        "Art. 3°: educación laica, gratuita y obligatoria (hasta nivel medio superior)",
        "Art. 27°: tierras, aguas y recursos naturales son propiedad originaria de la Nación",
        "Art. 123°: jornada 8 hrs, descanso semanal, salario mínimo, seguridad social",
        "Derechos fundamentales: nadie puede ser detenido sin orden judicial, libertad de expresión",
        "Obligaciones gubernamentales: proporcionar salud, educación, seguridad y justicia",
        "Función social de los medios: informar, educar, entretener y ejercer vigilancia social",
        "Medios y manipulación: el ciudadano debe ejercer pensamiento crítico",
        "Negociación: proceso donde dos partes con intereses distintos ceden mutuamente para llegar a un acuerdo",
        "Relación humano-naturaleza: responsabilidad de preservar el entorno para generaciones futuras",
      ]},
    ],
  },
];

const colorMap: Record<string, { header: string; dot: string; tag: string; aiBtn: string }> = {
  blue:    { header: "bg-blue-600",    dot: "bg-blue-400",    tag: "bg-blue-900/40 text-blue-300",    aiBtn: "bg-blue-700 hover:bg-blue-600" },
  purple:  { header: "bg-purple-600",  dot: "bg-purple-400",  tag: "bg-purple-900/40 text-purple-300",  aiBtn: "bg-purple-700 hover:bg-purple-600" },
  green:   { header: "bg-green-600",   dot: "bg-green-400",   tag: "bg-green-900/40 text-green-300",   aiBtn: "bg-green-700 hover:bg-green-600" },
  yellow:  { header: "bg-yellow-500",  dot: "bg-yellow-400",  tag: "bg-yellow-900/40 text-yellow-200",  aiBtn: "bg-yellow-600 hover:bg-yellow-500" },
  emerald: { header: "bg-emerald-600", dot: "bg-emerald-400", tag: "bg-emerald-900/40 text-emerald-300", aiBtn: "bg-emerald-700 hover:bg-emerald-600" },
  orange:  { header: "bg-orange-500",  dot: "bg-orange-400",  tag: "bg-orange-900/40 text-orange-300",  aiBtn: "bg-orange-600 hover:bg-orange-500" },
  cyan:    { header: "bg-cyan-600",    dot: "bg-cyan-400",    tag: "bg-cyan-900/40 text-cyan-300",    aiBtn: "bg-cyan-700 hover:bg-cyan-600" },
  red:     { header: "bg-red-600",     dot: "bg-red-400",     tag: "bg-red-900/40 text-red-300",     aiBtn: "bg-red-700 hover:bg-red-600" },
  teal:    { header: "bg-teal-600",    dot: "bg-teal-400",    tag: "bg-teal-900/40 text-teal-300",    aiBtn: "bg-teal-700 hover:bg-teal-600" },
  pink:    { header: "bg-pink-600",    dot: "bg-pink-400",    tag: "bg-pink-900/40 text-pink-300",    aiBtn: "bg-pink-700 hover:bg-pink-600" },
  indigo:  { header: "bg-indigo-600",  dot: "bg-indigo-400",  tag: "bg-indigo-900/40 text-indigo-300",  aiBtn: "bg-indigo-700 hover:bg-indigo-600" },
};

export default function Acordeon() {
  const { session, user } = useAuth();
  const navigate = useNavigate();
  const [openAreas, setOpenAreas] = useState<number[]>([]);
  const [openSubtemas, setOpenSubtemas] = useState<Record<string, boolean>>({});
  const [aiLoading, setAiLoading] = useState<number | null>(null);
  const [aiContent, setAiContent] = useState<Record<number, string>>({});

  const cleanTipsText = (text: string) =>
    text
      .replace(/<recommendation>[\s\S]*?<\/recommendation>/g, "")
      .replace(/```mermaid[\s\S]*?```/g, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/\[.*?\]\(citation:\/\/.*?\)/g, "")
      .replace(/<quiz>[\s\S]*?<\/quiz>/g, "")
      .replace(/<[a-z_]+>[\s\S]*?<\/[a-z_]+>/g, "")
      .trim();

  const toggleArea = (i: number) =>
    setOpenAreas((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);

  const toggleSubtema = (key: string) =>
    setOpenSubtemas((prev) => ({ ...prev, [key]: !prev[key] }));

  const expandAll = () => {
    setOpenAreas(areas.map((_, i) => i));
    const all: Record<string, boolean> = {};
    areas.forEach((a, i) => a.subtemas.forEach((_, j) => { all[`${i}-${j}`] = true; }));
    setOpenSubtemas(all);
  };

  const collapseAll = () => {
    setOpenAreas([]);
    setOpenSubtemas({});
  };

  const generarAcordeonIA = async (idx: number, nombre: string) => {
    if (!session?.access_token) {
      setAiContent((prev) => ({ ...prev, [idx]: "⚠️ Inicia sesión para usar el tutor IA." }));
      return;
    }
    setAiLoading(idx);
    setAiContent((prev) => ({ ...prev, [idx]: "" }));
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Dame 3 tips de memorización rápida para el examen ECOEMS sobre ${nombre}. Sé muy breve, máximo 4 puntos cortos con emojis. Sin quiz.`,
          }],
          context: { type: "acordeon", materia: nombre },
        }),
      });

      if (!res.ok || !res.body) {
        setAiContent((prev) => ({ ...prev, [idx]: "Error al conectar con el tutor IA." }));
        setAiLoading(null);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let newline: number;
        while ((newline = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newline);
          buffer = buffer.slice(newline + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const chunk: string =
              parsed.content ??
              parsed.choices?.[0]?.delta?.content ??
              (parsed.type === "content_block_delta" ? parsed.delta?.text : undefined) ??
              "";
            if (chunk) {
              accumulated += chunk;
              setAiContent((prev) => ({ ...prev, [idx]: cleanTipsText(accumulated) }));
            }
          } catch { /* ignore malformed SSE line */ }
        }
      }

      if (!accumulated) setAiContent((prev) => ({ ...prev, [idx]: "Sin respuesta del tutor." }));
    } catch {
      setAiContent((prev) => ({ ...prev, [idx]: "No se pudo conectar con el tutor IA." }));
    }
    setAiLoading(null);
  };

  const handlePrint = () => {
    expandAll();
    setTimeout(() => window.print(), 400);
  };

  const handlePrintByMateria = () => {
    expandAll();
    document.body.classList.add('print-by-materia');
    setTimeout(() => {
      window.print();
      document.body.classList.remove('print-by-materia');
    }, 400);
  };

  const handleProtectedAction = (action: () => void) => {
    if (!user) { navigate("/auth"); return; }
    action();
  };

  return (
    <>
    {/* ── Print-only layout: dense newspaper-style grid ───────────── */}
    <div className="acordeon-print-layout hidden">
      <h1 className="acordeon-titulo">📋 Acordeón ECOEMS 2026 — cyberedumx.com</h1>
      <div className="acordeon-print-grid">
        {areas.map((area) => (
          <div key={area.nombre} className="acordeon-print-card">
            <div className="acordeon-print-header">{area.icono} {area.nombre}</div>
            <div className="acordeon-print-body">
              {area.subtemas.map((sub) => (
                <div key={sub.titulo}>
                  <strong>{sub.titulo}:</strong>
                  <ul>
                    {sub.contenido.map((item, k) => (
                      <li key={k}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* ── Screen layout ────────────────────────────────────────────── */}
    <div className="acordeon-screen-only min-h-screen bg-gray-950 text-white">
      {/* Topbar */}
      <div className="no-print sticky top-0 z-10 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-gray-400 hover:text-white text-sm">← Inicio</Link>
          <span className="text-gray-600">|</span>
          <h1 className="text-lg font-bold">📋 Acordeón ECOEMS 2026</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleProtectedAction(expandAll)}
            className={`text-xs px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors${!user ? " opacity-50" : ""}`}
            title={!user ? "🔒 Regístrate gratis para usar esta función" : undefined}
          >
            📂 Expandir todo{!user && " 🔒"}
          </button>
          <button
            onClick={() => handleProtectedAction(collapseAll)}
            className={`text-xs px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors${!user ? " opacity-50" : ""}`}
            title={!user ? "🔒 Regístrate gratis para usar esta función" : undefined}
          >
            📁 Colapsar todo{!user && " 🔒"}
          </button>
          <button
            onClick={() => handleProtectedAction(handlePrint)}
            className={`text-xs px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 transition-colors font-bold flex items-center gap-1${!user ? " opacity-50" : ""}`}
            title={!user ? "🔒 Regístrate gratis para imprimir" : undefined}
          >
            🖨️ Imprimir PDF{!user && " 🔒"}
          </button>
          <button
            onClick={() => handleProtectedAction(handlePrintByMateria)}
            className={`text-xs px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors font-bold flex items-center gap-1${!user ? " opacity-50" : ""}`}
            title={!user ? "🔒 Regístrate gratis para imprimir" : undefined}
          >
            🖨️ Imprimir por Materia{!user && " 🔒"}
          </button>
        </div>
      </div>

      {/* Print title */}
      <div className="print-only hidden text-center py-4">
        <h1 className="acordeon-titulo text-2xl font-bold">Acordeón ECOEMS 2026</h1>
        <p className="text-sm text-gray-500">cyberedumx.com</p>
      </div>

      {/* Areas */}
      <div className="acordeon-grid max-w-3xl mx-auto px-4 py-6 space-y-3">
        {areas.map((area, i) => {
          const isOpen = openAreas.includes(i);
          const colors = colorMap[area.color];
          return (
            <div key={i} className="acordeon-section acordeon-materia rounded-xl overflow-hidden border border-gray-800 print:border-gray-300">
              {/* Area header */}
              <button
                onClick={() => toggleArea(i)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left font-bold text-white ${colors.header} print:bg-gray-200 print:text-black hover:opacity-90 transition-opacity`}
              >
                <span className="acordeon-materia-titulo flex items-center gap-2">
                  <span>{area.icono}</span>
                  <span>{area.nombre}</span>
                  <span className="text-xs font-normal opacity-75">{area.subtemas.length} temas</span>
                </span>
                <span className="text-base no-print">{isOpen ? "▲" : "▼"}</span>
              </button>

              {isOpen && (
                <div className="acordeon-contenido bg-gray-900 print:bg-white">
                  {/* Subtemas */}
                  <div className="divide-y divide-gray-800 print:divide-gray-200">
                    {area.subtemas.map((sub, j) => {
                      const key = `${i}-${j}`;
                      const subOpen = openSubtemas[key] ?? false;
                      return (
                        <div key={j}>
                          <button
                            onClick={() => user ? toggleSubtema(key) : navigate("/auth")}
                            className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-800 print:hover:bg-transparent transition-colors"
                          >
                            <span className="acordeon-subtema-titulo flex items-center gap-2 text-sm font-semibold text-gray-100 print:text-black">
                              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
                              {sub.titulo}
                            </span>
                            <span className="text-xs text-gray-500 no-print">{subOpen ? "▲" : "▼"}</span>
                          </button>

                          {subOpen && (
                            <ul className="px-6 pb-3 space-y-1.5 print:px-4">
                              {sub.contenido.map((linea, k) => (
                                <li key={k} className={`text-xs rounded px-2 py-1 ${colors.tag} print:bg-transparent print:text-black print:px-0`}>
                                  {linea}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* AI expand button */}
                  <div className="no-print px-4 py-3 border-t border-gray-800">
                    {aiContent[i] ? (
                      <div className="text-xs text-gray-300 bg-gray-800 rounded-lg p-3 whitespace-pre-wrap">
                        {aiContent[i]}
                        <button
                          onClick={() => setAiContent((prev) => { const n = { ...prev }; delete n[i]; return n; })}
                          className="block mt-2 text-gray-500 hover:text-gray-300 text-xs"
                        >
                          ✕ Cerrar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => generarAcordeonIA(i, area.nombre)}
                        disabled={aiLoading === i}
                        title={!session?.access_token ? "Inicia sesión para usar el tutor IA" : undefined}
                        className={`text-xs px-3 py-1.5 rounded-lg text-white font-medium transition-colors flex items-center gap-1.5 ${colors.aiBtn} disabled:opacity-60`}
                      >
                        {aiLoading === i ? (
                          <><span className="animate-spin">⏳</span> Generando...</>
                        ) : session?.access_token ? (
                          <>🧠 Tips IA para {area.nombre}</>
                        ) : (
                          <>🔒 Tips IA (requiere sesión)</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="no-print text-center py-8 text-gray-600 text-xs">
        cyberedumx.com — ECOEMS 2026
      </div>
    </div>
    </>
  );
}
