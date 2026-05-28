import { useState } from "react";
import { Link } from "react-router-dom";

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
  {
    nombre: "Habilidad Matemática", icono: "🔢", color: "blue",
    subtemas: [
      { titulo: "Sucesiones numéricas y figuras", contenido: [
        "Calcula la diferencia entre términos consecutivos para encontrar el patrón",
        "Suma: 2,5,8,11... → +3 cada vez",
        "Producto: 2,6,18,54... → ×3 cada vez",
        "Cuadrados perfectos: 1,4,9,16,25,36,49...",
        "Números primos: 2,3,5,7,11,13,17,19,23...",
        "Tip: si la diferencia varía, calcula la diferencia de la diferencia (2° nivel)",
      ]},
      { titulo: "Razones y proporciones / Regla de tres", contenido: [
        "Razón: comparación de dos cantidades a:b ó a/b",
        "Regla de tres directa: más → más. Fórmula: x = (b × c) / a",
        "Regla de tres inversa: más → menos. Fórmula: x = (a × b) / c",
        "Ejemplo: Si 3 obreros hacen un muro en 6 días, ¿cuánto tardan 9? → x = (3×6)/9 = 2 días",
        "Proporción: a/b = c/d → a×d = b×c (productos cruzados)",
      ]},
      { titulo: "Porcentajes", contenido: [
        "% de un número: (% / 100) × número",
        "Ejemplo: 30% de 250 = 0.30 × 250 = 75",
        "Descuento: precio final = precio × (1 - %desc/100)",
        "Aumento: precio final = precio × (1 + %aum/100)",
        "¿Qué % es A de B? → (A/B) × 100",
        "Tip: el 10% se calcula moviendo el punto decimal un lugar",
      ]},
      { titulo: "Sistemas de ecuaciones", contenido: [
        "Método sustitución: despeja una variable en una ecuación y sustituye en la otra",
        "Método igualación: despeja la misma variable en ambas ecuaciones e iguala",
        "Método suma/resta (eliminación): multiplica para hacer coeficientes iguales y suma/resta",
        "Ejemplo: x+y=10 y x-y=4 → suma: 2x=14 → x=7, y=3",
        "Verifica siempre sustituyendo en ambas ecuaciones originales",
      ]},
      { titulo: "Geometría: áreas y volúmenes", contenido: [
        "Cuadrado: A = l²  |  Rectángulo: A = b×h",
        "Triángulo: A = (b×h)/2  |  Círculo: A = π×r²",
        "Trapecio: A = ((B+b)/2)×h  |  Rombo: A = (D×d)/2",
        "Cubo: V = l³  |  Cilindro: V = π×r²×h",
        "Pirámide: V = (A base × h)/3  |  Esfera: V = (4/3)×π×r³",
        "Perímetro círculo (circunferencia): C = 2πr",
      ]},
      { titulo: "Estadística: media, mediana, moda", contenido: [
        "Media (promedio): suma de todos los datos ÷ cantidad de datos",
        "Mediana: valor central al ordenar los datos de menor a mayor",
        "Si n es par, mediana = promedio de los dos centrales",
        "Moda: el valor que más se repite (puede haber más de una)",
        "Rango: dato mayor − dato menor",
        "Tip: 'Las 3 M' — Media=aritmética, Mediana=mitad, Moda=más frecuente",
      ]},
    ],
  },
  {
    nombre: "Habilidad Verbal", icono: "📖", color: "purple",
    subtemas: [
      { titulo: "Sinónimos y antónimos", contenido: [
        "Sinónimo: palabra de significado igual o similar (veloz = rápido)",
        "Antónimo: palabra de significado opuesto (frío ≠ caliente)",
        "Tip: busca la raíz de la palabra para deducir su significado",
        "Prefijos útiles: in-/im- (negación), re- (repetición), pre- (antes)",
        "Si no conoces la palabra, descarta los extremos obvios y elige por contexto",
      ]},
      { titulo: "Analogías verbales", contenido: [
        "Estructura: A es a B como C es a D",
        "Tipos de relación: todo-parte, objeto-uso, causa-efecto, especie-género",
        "Ejemplo: Médico : Hospital :: Maestro : Escuela (persona-lugar de trabajo)",
        "Tip: formula la relación en una oración: 'A sirve para B, como C sirve para D'",
        "Mantén el mismo orden de la relación en ambos pares",
      ]},
      { titulo: "Comprensión lectora", contenido: [
        "Lee primero las preguntas, luego el texto — sabrás qué buscar",
        "Idea principal: responde ¿de qué trata el párrafo en general?",
        "Ideas secundarias: detalles que apoyan o explican la idea principal",
        "Inferencia: conclusión lógica que no está escrita explícitamente",
        "Tip: las respuestas casi siempre están en el texto — no inventes",
      ]},
      { titulo: "Nexos y conectores", contenido: [
        "Adición: además, también, asimismo, igualmente",
        "Contraste: pero, sin embargo, aunque, no obstante, a pesar de",
        "Causa: porque, ya que, puesto que, dado que",
        "Consecuencia: por lo tanto, en consecuencia, así que, de ahí que",
        "Tiempo: antes, después, mientras, cuando, finalmente",
        "Tip: identifica si el texto suma, contrasta o explica causas",
      ]},
      { titulo: "Ideas principal y secundaria", contenido: [
        "Idea principal: oración que resume de qué trata el párrafo",
        "Suele estar al inicio o al final del párrafo",
        "Ideas secundarias: ejemplos, detalles y explicaciones de la idea principal",
        "Tip: pregúntate '¿sin esta oración, el párrafo dice lo mismo?' → si sí, es secundaria",
        "El título del texto casi siempre refleja la idea principal general",
      ]},
    ],
  },
  {
    nombre: "Matemáticas", icono: "➗", color: "green",
    subtemas: [
      { titulo: "Operaciones con enteros", contenido: [
        "Suma de mismo signo: suma y conserva el signo",
        "Suma de diferente signo: resta y toma el signo del mayor",
        "Multiplicación/división: igual signo = positivo, diferente signo = negativo",
        "Jerarquía: 1° paréntesis, 2° potencias, 3° × y ÷, 4° + y −",
        "Valor absoluto |−5| = 5 (distancia al cero, siempre positivo)",
      ]},
      { titulo: "Fracciones y decimales", contenido: [
        "Suma/resta: mismo denominador → opera numeradores; diferente → mínimo común múltiplo",
        "Multiplicación: numerador × numerador / denominador × denominador",
        "División: multiplica por la fracción inversa (voltea la segunda fracción)",
        "Fracción a decimal: divide numerador ÷ denominador",
        "Decimal a fracción: escribe sobre 10, 100 o 1000 según los decimales y simplifica",
        "Fracción impropia a mixto: 7/3 = 2 con residuo 1 = 2 1/3",
      ]},
      { titulo: "Potencias y raíces", contenido: [
        "a^n: multiplica a por sí mismo n veces",
        "Producto: a^m × a^n = a^(m+n)  |  Cociente: a^m ÷ a^n = a^(m−n)",
        "Potencia de potencia: (a^m)^n = a^(m×n)",
        "Raíz cuadrada: √a = b si b² = a  |  √9=3, √25=5, √49=7, √100=10",
        "Raíz cúbica: ∛a = b si b³ = a  |  ∛8=2, ∛27=3, ∛125=5",
        "a^0 = 1 siempre (excepto 0^0, indefinido)",
      ]},
      { titulo: "Álgebra: ecuaciones lineales", contenido: [
        "Despeja la incógnita haciendo la operación inversa en ambos lados",
        "Suma ↔ resta, multiplicación ↔ división, potencia ↔ raíz",
        "Ejemplo: 3x + 5 = 17 → 3x = 12 → x = 4",
        "Ecuación con fracciones: multiplica todo por el mínimo común denominador",
        "Verifica: sustituye tu respuesta en la ecuación original",
      ]},
      { titulo: "Geometría analítica", contenido: [
        "Distancia entre dos puntos: d = √[(x₂−x₁)² + (y₂−y₁)²]",
        "Punto medio: M = ((x₁+x₂)/2, (y₁+y₂)/2)",
        "Ecuación de la recta: y = mx + b (m=pendiente, b=ordenada al origen)",
        "Pendiente: m = (y₂−y₁)/(x₂−x₁)",
        "Rectas paralelas: igual pendiente. Perpendiculares: m₁×m₂ = −1",
      ]},
      { titulo: "Probabilidad", contenido: [
        "P(evento) = casos favorables / casos totales posibles",
        "P siempre está entre 0 (imposible) y 1 (seguro)",
        "P(A o B) = P(A) + P(B) − P(A y B)",
        "Eventos independientes: P(A y B) = P(A) × P(B)",
        "Complemento: P(no A) = 1 − P(A)",
        "Ejemplo: dado de 6 caras, P(par) = 3/6 = 1/2",
      ]},
    ],
  },
  {
    nombre: "Español", icono: "✍️", color: "yellow",
    subtemas: [
      { titulo: "Funciones del lenguaje", contenido: [
        "Referencial/informativa: transmite información objetiva (noticia)",
        "Expresiva/emotiva: expresa sentimientos del emisor (poema lírico)",
        "Apelativa/conativa: influye en el receptor (publicidad, orden)",
        "Fática: verificar el canal de comunicación ('¿me escuchas?')",
        "Metalingüística: el lenguaje habla de sí mismo ('la palabra 'perro' tiene 5 letras')",
        "Poética/estética: cuida la forma del mensaje (literatura)",
      ]},
      { titulo: "Recursos literarios", contenido: [
        "Metáfora: comparación sin 'como' ('tus ojos son luceros')",
        "Símil/comparación: con 'como' o 'parece' ('rápido como el viento')",
        "Hipérbole: exageración ('te lo he dicho mil veces')",
        "Personificación: atribuir cualidades humanas a objetos ('el viento susurra')",
        "Aliteración: repetición de sonidos ('tres tristes tigres')",
        "Anáfora: repetición al inicio de versos consecutivos",
      ]},
      { titulo: "Tipos de textos", contenido: [
        "Narrativo: cuenta hechos reales o ficticios (cuento, novela, crónica)",
        "Descriptivo: presenta características de personas, lugares u objetos",
        "Argumentativo: defiende una postura con razones (ensayo, editorial)",
        "Expositivo: explica o informa de manera objetiva (artículo científico)",
        "Instructivo: indica pasos a seguir (receta, manual)",
        "Dialógico: recrea conversaciones (obra de teatro, entrevista)",
      ]},
      { titulo: "Ortografía y puntuación", contenido: [
        "B/V: verbos terminados en -aba (cantaba), prefijo bi- (bicicleta), después de m (también)",
        "H: palabras que empiezan con ia-, ie-, ue-, ui- llevan h (hielo, huevo)",
        "G/J: ge/gi suena como j (girar), gue/gui la u no suena (guerra)",
        "Coma: enumeraciones, vocativos, aclaraciones, oraciones subordinadas antepuestas",
        "Punto y coma: separa oraciones relacionadas largas o enumeraciones complejas",
        "Acento diacrítico: tú/tu, él/el, sé/se, más/mas — cambian significado",
      ]},
      { titulo: "Fichas bibliográficas", contenido: [
        "Libro: Apellido, Nombre. (Año). Título en cursiva. Editorial.",
        "Artículo: Apellido, N. (Año). Título del artículo. Nombre de la revista, vol(num), pp.",
        "Web: Apellido, N. (Año). Título. Recuperado de URL",
        "Dato clave: el apellido del autor va primero, luego coma y nombre",
        "El título del libro o revista siempre va en cursiva o subrayado",
      ]},
      { titulo: "Nexos textuales", contenido: [
        "Adición: además, también, incluso, asimismo, por otro lado",
        "Oposición: pero, sin embargo, aunque, no obstante, a pesar de ello",
        "Causalidad: porque, ya que, puesto que, debido a, dado que",
        "Consecuencia: por lo tanto, en consecuencia, así pues, de modo que",
        "Orden: primero, luego, después, finalmente, a continuación",
        "Tip: identifica qué relación lógica existe entre las dos ideas",
      ]},
    ],
  },
  {
    nombre: "Biología", icono: "🧬", color: "emerald",
    subtemas: [
      { titulo: "Características de los seres vivos", contenido: [
        "Nutrición, respiración, reproducción, irritabilidad, crecimiento, excreción",
        "Organización: átomo → molécula → célula → tejido → órgano → sistema → organismo",
        "Homeostasis: capacidad de mantener condiciones internas estables",
        "Metabolismo: conjunto de reacciones químicas del organismo",
        "Todos los seres vivos están formados por células (teoría celular)",
      ]},
      { titulo: "Célula y sus funciones", contenido: [
        "Procariota: sin núcleo definido, sin organelos membranosos (bacterias)",
        "Eucariota: con núcleo definido y organelos (animales, plantas, hongos)",
        "Membrana celular: controla el paso de sustancias (permeabilidad selectiva)",
        "Mitocondria: produce energía (ATP) — 'central energética'",
        "Ribosomas: sintetizan proteínas  |  Núcleo: contiene el ADN",
        "Cloroplasto (solo vegetal): realiza la fotosíntesis  |  Vacuola: almacenamiento",
      ]},
      { titulo: "Genética y herencia", contenido: [
        "ADN: molécula portadora de la información genética (doble hélice)",
        "Gen: segmento de ADN que codifica una característica",
        "Cromosomas humanos: 46 (23 pares); sexuales XX=mujer, XY=hombre",
        "Leyes de Mendel: dominancia, segregación, herencia independiente",
        "Alelo dominante (D): se expresa aunque haya uno solo",
        "Alelo recesivo (r): solo se expresa si hay dos copias (rr)",
        "Cuadro de Punnett: tabla para predecir combinaciones genéticas",
      ]},
      { titulo: "Ecosistemas y biodiversidad", contenido: [
        "Ecosistema: conjunto de seres vivos + ambiente físico que interactúan",
        "Cadena alimentaria: productor → herbívoro → carnívoro → descomponedor",
        "Productores: plantas (fotosíntesis)  |  Consumidores: animales",
        "Nicho ecológico: papel o función de un organismo en su ecosistema",
        "Biodiversidad: variedad de especies en un ecosistema — México es megadiverso",
        "Factores abióticos: temperatura, luz, agua, suelo (no vivos)",
      ]},
      { titulo: "Evolución y selección natural", contenido: [
        "Darwin: los individuos con características útiles sobreviven más y se reproducen",
        "Selección natural: la naturaleza 'elige' a los más adaptados",
        "Variación: diferencias entre individuos de la misma especie",
        "Mutación: cambio en el ADN — fuente de nueva variación",
        "Especiación: formación de nuevas especies por aislamiento reproductivo",
        "Evidencias: registro fósil, anatomía comparada, biogeografía, ADN",
      ]},
      { titulo: "Reproducción", contenido: [
        "Asexual: un solo progenitor, descendencia genéticamente idéntica (clones)",
        "Tipos asexual: bipartición, gemación, esporulación, fragmentación",
        "Sexual: dos progenitores, variación genética por meiosis y fecundación",
        "Meiosis: división que produce gametos (óvulos y espermatozoides) con n cromosomas",
        "Fecundación: unión de gametos → zigoto con 2n cromosomas",
        "Ciclo menstrual humano: ~28 días; ovulación ≈ día 14",
      ]},
    ],
  },
  {
    nombre: "Química", icono: "⚗️", color: "orange",
    subtemas: [
      { titulo: "Tabla periódica", contenido: [
        "Periodos (filas horizontales): 7 en total — indican número de niveles de energía",
        "Grupos (columnas verticales): 18 — elementos con propiedades similares",
        "Metales: izquierda y centro — buenos conductores, brillo metálico",
        "No metales: derecha — malos conductores, frágiles",
        "Gases nobles (Grupo 18): muy estables, no reaccionan fácilmente (He, Ne, Ar)",
        "Halógenos (Grupo 17): muy reactivos (F, Cl, Br, I)",
      ]},
      { titulo: "Estados de la materia", contenido: [
        "Sólido: forma y volumen definidos, partículas muy juntas y vibran",
        "Líquido: volumen definido, sin forma fija, partículas se deslizan",
        "Gas: sin forma ni volumen fijo, partículas muy separadas y rápidas",
        "Plasma: gas ionizado a muy alta temperatura (4° estado, el más abundante en el universo)",
        "Cambios de estado: fusión (S→L), ebullición (L→G), sublimación (S→G)",
        "Temperatura de ebullición del agua: 100°C  |  Fusión: 0°C",
      ]},
      { titulo: "Enlace químico", contenido: [
        "Iónico: transferencia de electrones entre metal y no metal (NaCl)",
        "Covalente: compartición de electrones entre no metales (H₂O, CO₂)",
        "Covalente polar: los electrones se comparten desigualmente (H₂O)",
        "Covalente apolar: electrones compartidos por igual (O₂, H₂)",
        "Metálico: electrones libres entre iones metálicos — explica conductividad",
        "Regla del octeto: los átomos tienden a tener 8 electrones en su capa externa",
      ]},
      { titulo: "Reacciones químicas", contenido: [
        "Reactivos (izquierda) → Productos (derecha)",
        "Síntesis/combinación: A + B → AB",
        "Descomposición: AB → A + B",
        "Sustitución simple: A + BC → AC + B",
        "Doble sustitución: AB + CD → AD + CB",
        "Combustión: hidrocarburo + O₂ → CO₂ + H₂O",
        "Ley de conservación de masa: la masa total no cambia — ecuación debe balancearse",
      ]},
      { titulo: "Ácidos y bases", contenido: [
        "Ácido: libera H⁺ en agua, pH < 7, sabor agrio (HCl, H₂SO₄, vinagre)",
        "Base/álcali: libera OH⁻ en agua, pH > 7, sabor amargo y resbaladizo (NaOH)",
        "pH neutro: 7 (agua pura)",
        "Escala de pH: 0-6 ácido, 7 neutro, 8-14 básico",
        "Indicador: sustancia que cambia de color según el pH (tornasol, fenolftaleína)",
        "Neutralización: ácido + base → sal + agua",
      ]},
      { titulo: "Número atómico y de masa", contenido: [
        "Número atómico (Z): cantidad de protones = cantidad de electrones en átomo neutro",
        "Número de masa (A): protones + neutrones",
        "Neutrones = A − Z",
        "Isótopos: mismo Z (mismos protones), diferente A (diferente número de neutrones)",
        "Ejemplo: Carbono-12 (Z=6, A=12, 6 neutrones) y Carbono-14 (Z=6, A=14, 8 neutrones)",
        "Ion: átomo con carga (pierde o gana electrones). Catión (+), anión (−)",
      ]},
    ],
  },
  {
    nombre: "Física", icono: "⚡", color: "cyan",
    subtemas: [
      { titulo: "Movimiento y velocidad", contenido: [
        "Velocidad media: v = d/t (distancia entre tiempo)",
        "Unidades: m/s, km/h. Conversión: 1 m/s = 3.6 km/h",
        "Aceleración: a = (vf − vi) / t",
        "MRU (movimiento rectilíneo uniforme): velocidad constante, a = 0",
        "MRUA (aceleración uniforme): v = vi + at, d = vi·t + ½at²",
        "Caída libre: a = g ≈ 10 m/s², sin resistencia del aire",
      ]},
      { titulo: "Leyes de Newton", contenido: [
        "1ª Ley (Inercia): un objeto en reposo/movimiento uniforme permanece así si no actúa fuerza neta",
        "2ª Ley (F = m·a): la fuerza neta es igual a masa × aceleración",
        "3ª Ley (acción-reacción): toda fuerza tiene una fuerza igual y opuesta",
        "Peso: W = m·g (masa × gravedad ≈ 10 m/s²)",
        "Fricción: fuerza que se opone al movimiento entre superficies",
        "Tip: en el examen siempre usan g = 10 m/s²",
      ]},
      { titulo: "Energía cinética y potencial", contenido: [
        "Energía cinética: Ec = ½·m·v²  (energía del movimiento)",
        "Energía potencial gravitacional: Ep = m·g·h  (energía de posición)",
        "Conservación de energía: Ec + Ep = constante (en ausencia de fricción)",
        "Trabajo: W = F·d·cos(θ) (Joules = N·m)",
        "Potencia: P = W/t (Watts = J/s)",
        "Ejemplo: pelota a 5 m de altura con m=2 kg → Ep = 2×10×5 = 100 J",
      ]},
      { titulo: "Electricidad y magnetismo", contenido: [
        "Ley de Ohm: V = I·R (Voltaje = Corriente × Resistencia)",
        "Potencia eléctrica: P = V·I = I²·R",
        "Circuito serie: misma corriente, voltajes se suman, R_total = R1+R2+...",
        "Circuito paralelo: mismo voltaje, corrientes se suman, 1/R_total = 1/R1+1/R2...",
        "Imán: polo norte y sur — polos iguales se repelen, diferentes se atraen",
        "Campo eléctrico: fuerza que actúa sobre cargas eléctricas",
      ]},
      { titulo: "Ondas y sonido", contenido: [
        "Onda: perturbación que transporta energía sin transportar materia",
        "Longitud de onda (λ): distancia entre dos crestas consecutivas",
        "Frecuencia (f): número de oscilaciones por segundo (Hz)",
        "Velocidad: v = f × λ",
        "Sonido: onda mecánica longitudinal — necesita un medio material para propagarse",
        "Velocidad del sonido en aire ≈ 340 m/s  |  Luz en vacío ≈ 3×10⁸ m/s",
      ]},
      { titulo: "Termodinámica", contenido: [
        "Temperatura: medida de la energía cinética promedio de las moléculas",
        "Conversión: °C a K → K = °C + 273  |  K a °C → °C = K − 273",
        "Calor: energía que se transfiere por diferencia de temperatura",
        "1ª Ley: energía no se crea ni destruye, solo se transforma",
        "Conducción: contacto directo  |  Convección: fluidos  |  Radiación: ondas EM",
        "Calor específico: cantidad de calor para elevar 1°C a 1 kg de sustancia",
      ]},
    ],
  },
  {
    nombre: "Historia", icono: "🏛️", color: "red",
    subtemas: [
      { titulo: "Culturas prehispánicas", contenido: [
        "Olmecas (1500-400 a.C.): 'cultura madre', cabezas colosales, Golfo de México",
        "Teotihuacán (100-650 d.C.): pirámide del Sol y Luna, ciudad planificada",
        "Maya (250-900 d.C.): matemáticas, astronomía, calendario, escritura jeroglífica",
        "Azteca/México-Tenochtitlán (1325-1521): fundación en lago Texcoco, Triple Alianza",
        "Zapoteca: Monte Albán, Oaxaca  |  Tolteca: Tula, dios Quetzalcóatl",
        "Mesoamérica: región cultural que incluye México y Centroamérica",
      ]},
      { titulo: "Conquista y Colonia (1521-1810)", contenido: [
        "Hernán Cortés llegó a México en 1519, aliado con tlaxcaltecas",
        "Caída de Tenochtitlán: 13 de agosto de 1521 — captura de Cuauhtémoc",
        "Nueva España: virreinato gobernado por la Corona española",
        "Estratificación social: peninsulares > criollos > mestizos > indígenas > esclavos",
        "Evangelización: frailes (Sahagún, Las Casas) difunden el catolicismo",
        "Encomienda: sistema de trabajo forzado indígena",
      ]},
      { titulo: "Independencia de México (1810-1821)", contenido: [
        "Grito de Independencia: 16 de septiembre de 1810 — Miguel Hidalgo en Dolores",
        "Hidalgo: cura de Dolores, primer líder; fusilado en 1811",
        "Morelos: redactó los 'Sentimientos de la Nación' (1813); fusilado en 1815",
        "Consumación: Agustín de Iturbide + Guerrero = Plan de Iguala (1821)",
        "Tres Garantías: Religión, Independencia, Unión (Ejército Trigarante)",
        "Independencia consumada: 27 de septiembre de 1821",
      ]},
      { titulo: "Reforma y Porfiriato", contenido: [
        "Reforma (1857-1861): Benito Juárez, Constitución de 1857, Leyes de Reforma",
        "Leyes de Reforma: separación Iglesia-Estado, registro civil, cementerios laicos",
        "Intervención francesa (1862-1867): Maximiliano de Habsburgo como emperador",
        "Batalla de Puebla: 5 de mayo de 1862, victoria mexicana sobre Francia",
        "Porfiriato (1876-1910): Porfirio Díaz, modernización, ferrocarriles, desigualdad",
        "Lema porfirista: 'Orden y Progreso'",
      ]},
      { titulo: "Revolución Mexicana (1910-1917)", contenido: [
        "Causa: reelección de Díaz, desigualdad social y económica",
        "Plan de San Luis: Francisco I. Madero convoca a la revolución (1910)",
        "Zapata: Plan de Ayala, 'Tierra y Libertad' — luchó por ejidos en el sur",
        "Villa: División del Norte, norte del país",
        "Constitución de 1917: art. 3° (educación), art. 27° (tierra), art. 123° (trabajo)",
        "Carranza: presidente que promulgó la Constitución; asesinado en 1920",
      ]},
      { titulo: "Guerras mundiales y período de entreguerras", contenido: [
        "1ª Guerra Mundial (1914-1918): Triple Alianza vs. Triple Entente",
        "Detonante: asesinato del archiduque Francisco Fernando en Sarajevo (1914)",
        "Tratado de Versalles (1919): humilla a Alemania, crea las condiciones del nazismo",
        "Entreguerras: Gran Depresión (1929), ascenso de fascismo y nazismo",
        "2ª Guerra Mundial (1939-1945): Aliados vs. Potencias del Eje",
        "Hecho clave: Holocausto, bomba atómica en Hiroshima y Nagasaki (1945)",
        "ONU fundada en 1945 para mantener la paz mundial",
      ]},
    ],
  },
  {
    nombre: "Geografía", icono: "🌍", color: "teal",
    subtemas: [
      { titulo: "Coordenadas geográficas", contenido: [
        "Latitud: distancia en grados al Ecuador (0° a 90° N o S)",
        "Longitud: distancia en grados al meridiano de Greenwich (0° a 180° E o W)",
        "Ecuador (0° lat.) divide al planeta en hemisferio Norte y Sur",
        "Meridiano de Greenwich (0° lon.) divide al planeta en hemisferio Este y Oeste",
        "Trópicos: Cáncer (23.5°N) y Capricornio (23.5°S) — zona cálida intertropical",
        "Círculos polares: Ártico (66.5°N) y Antártico (66.5°S)",
      ]},
      { titulo: "Relieve y clima de México", contenido: [
        "Sierra Madre Occidental: al oeste, estados como Sinaloa, Chihuahua",
        "Sierra Madre Oriental: al este, Tamaulipas, Nuevo León, San Luis Potosí",
        "Eje Neovolcánico: centro del país, volcanes Popocatépetl e Iztaccíhuatl",
        "Clima árido/seco: norte del país (desierto de Sonora y Chihuahua)",
        "Clima tropical húmedo: sureste (Chiapas, Tabasco, Veracruz)",
        "Clima templado: centro (Ciudad de México, Jalisco, Michoacán)",
      ]},
      { titulo: "Sectores económicos", contenido: [
        "Primario: extracción directa de recursos — agricultura, ganadería, minería, pesca",
        "Secundario: transformación de materias primas — industria, manufactura, construcción",
        "Terciario: servicios — comercio, educación, salud, turismo, transporte",
        "México: economía mixta, 15ª más grande del mundo",
        "Principales cultivos: maíz, caña de azúcar, chile, aguacate (1° exportador mundial)",
        "Petróleo: PEMEX, recurso estratégico, exportación importante",
      ]},
      { titulo: "Recursos naturales", contenido: [
        "Renovables: se regeneran a corto plazo (agua, solar, eólica, forestal)",
        "No renovables: se agotan (petróleo, gas, minerales, carbón)",
        "México: 5° lugar en biodiversidad mundial — megadiverso",
        "Biodiversidad: Chiapas, Oaxaca y Veracruz tienen mayor diversidad",
        "Deforestación: pérdida de bosques por agricultura, ganadería y urbanización",
        "Agua: recurso crítico — México tiene zonas con escasez severa",
      ]},
      { titulo: "Población y migración", contenido: [
        "México: aprox. 130 millones de habitantes (2024)",
        "Densidad de población: Ciudad de México es la más densamente poblada",
        "Migración interna: campo → ciudad (urbanización)",
        "Migración externa: México → Estados Unidos (principal corredor migratorio)",
        "Remesas: dinero enviado por migrantes — segunda fuente de divisas de México",
        "Transición demográfica: natalidad baja + mayor esperanza de vida → envejecimiento",
      ]},
      { titulo: "Organizaciones internacionales", contenido: [
        "ONU (1945): mantener la paz y seguridad internacionales, 193 países miembros",
        "OEA: Organización de Estados Americanos — cooperación en el continente",
        "OCDE: países desarrollados que cooperan en economía y políticas públicas",
        "OMC: Organización Mundial del Comercio — regula el comercio internacional",
        "FMI y Banco Mundial: financiamiento para el desarrollo y estabilidad económica",
        "T-MEC (antes TLCAN): tratado comercial México, EUA y Canadá",
      ]},
    ],
  },
  {
    nombre: "Formación Cívica y Ética", icono: "⚖️", color: "pink",
    subtemas: [
      { titulo: "Derechos humanos", contenido: [
        "Son universales, inalienables, indivisibles e interdependientes",
        "Declaración Universal de Derechos Humanos: ONU 1948, 30 artículos",
        "Generaciones: 1ª civiles y políticos, 2ª económicos y sociales, 3ª solidaridad (ambiente, paz)",
        "CNDH: Comisión Nacional de los Derechos Humanos — órgano autónomo en México",
        "Violaciones: tortura, desaparición forzada, discriminación",
        "México ratificó la Convención sobre los Derechos del Niño (CDN)",
      ]},
      { titulo: "Democracia y ciudadanía", contenido: [
        "Democracia: gobierno del pueblo, por el pueblo y para el pueblo",
        "Directa: ciudadanos deciden directamente (referéndum, plebiscito)",
        "Representativa: eligen representantes para gobernar en su nombre",
        "Ciudadanía en México: a los 18 años — derecho a votar y ser votado",
        "INE: organiza elecciones federales — autónomo e imparcial",
        "Principios democráticos: pluralismo, legalidad, tolerancia, participación",
      ]},
      { titulo: "Valores y ética", contenido: [
        "Valores: principios que guían el comportamiento (respeto, honestidad, solidaridad)",
        "Ética: reflexión filosófica sobre el bien y el mal, lo correcto e incorrecto",
        "Dilema moral: situación donde dos valores entran en conflicto",
        "Identidad: conjunto de características que definen a una persona",
        "Autoestima: valoración positiva de uno mismo — base del desarrollo personal",
        "Empatía: capacidad de ponerse en el lugar del otro",
      ]},
      { titulo: "Constitución mexicana", contenido: [
        "Promulgada el 5 de febrero de 1917, sigue vigente con reformas",
        "Art. 1°: garantías individuales y prohibición de discriminación",
        "Art. 3°: derecho a la educación gratuita y laica",
        "Art. 27°: la nación es dueña originaria del territorio (recursos del subsuelo)",
        "Art. 39°: soberanía nacional reside en el pueblo",
        "Art. 123°: derechos laborales (jornada máxima 8 horas, salario mínimo, vacaciones)",
      ]},
      { titulo: "Soberanía nacional", contenido: [
        "Soberanía: poder supremo del Estado para autogobernarse sin interferencia externa",
        "Interna: el Estado tiene autoridad sobre su territorio y población",
        "Externa: reconocimiento internacional de la independencia del país",
        "Principios de política exterior de México: no intervención, autodeterminación",
        "Doctrina Estrada: México no juzga los gobiernos de otros países",
        "ONU reconoce la soberanía de 193 estados miembros",
      ]},
      { titulo: "Resolución de conflictos", contenido: [
        "Conflicto: choque de intereses, necesidades o valores entre personas o grupos",
        "Negociación: ambas partes dialogan y ceden para llegar a un acuerdo",
        "Mediación: un tercero neutral facilita el diálogo sin imponer solución",
        "Arbitraje: un tercero neutral impone una solución que ambas partes aceptan previamente",
        "Cultura de paz: actitud de diálogo, tolerancia y no violencia",
        "Violencia: no es la única ni la mejor forma de resolver conflictos",
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
};

export default function Acordeon() {
  const [openAreas, setOpenAreas] = useState<number[]>([]);
  const [openSubtemas, setOpenSubtemas] = useState<Record<string, boolean>>({});
  const [aiLoading, setAiLoading] = useState<number | null>(null);
  const [aiContent, setAiContent] = useState<Record<number, string>>({});

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
    setAiLoading(idx);
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Dame 3 tips de memorización rápida para el examen ECOEMS sobre ${nombre}. Sé muy breve, máximo 4 puntos cortos con emojis. Sin quiz.`,
          }],
          context: { type: "acordeon", materia: nombre },
        }),
      });
      const data = await res.json();
      const text: string = data.content ?? data.message ?? data.response ?? "Sin respuesta";
      setAiContent((prev) => ({ ...prev, [idx]: text }));
    } catch {
      setAiContent((prev) => ({ ...prev, [idx]: "No se pudo conectar con el tutor IA." }));
    }
    setAiLoading(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Topbar */}
      <div className="no-print sticky top-0 z-10 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-gray-400 hover:text-white text-sm">← Inicio</Link>
          <span className="text-gray-600">|</span>
          <h1 className="text-lg font-bold">📋 Acordeón ECOEMS 2026</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={expandAll} className="text-xs px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
            Expandir todo
          </button>
          <button onClick={collapseAll} className="text-xs px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
            Colapsar todo
          </button>
          <button onClick={() => window.print()} className="text-xs px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 transition-colors font-bold flex items-center gap-1">
            🖨️ Imprimir PDF
          </button>
        </div>
      </div>

      {/* Print title */}
      <div className="print-only hidden text-center py-4">
        <h1 className="text-2xl font-bold">Acordeón ECOEMS 2026</h1>
        <p className="text-sm text-gray-500">cyberedumx.com</p>
      </div>

      {/* Areas */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
        {areas.map((area, i) => {
          const isOpen = openAreas.includes(i);
          const colors = colorMap[area.color];
          return (
            <div key={i} className="acordeon-section rounded-xl overflow-hidden border border-gray-800 print:border-gray-300">
              {/* Area header */}
              <button
                onClick={() => toggleArea(i)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left font-bold text-white ${colors.header} print:bg-gray-200 print:text-black hover:opacity-90 transition-opacity`}
              >
                <span className="flex items-center gap-2">
                  <span>{area.icono}</span>
                  <span>{area.nombre}</span>
                  <span className="text-xs font-normal opacity-75">{area.subtemas.length} temas</span>
                </span>
                <span className="text-base no-print">{isOpen ? "▲" : "▼"}</span>
              </button>

              {isOpen && (
                <div className="bg-gray-900 print:bg-white">
                  {/* Subtemas */}
                  <div className="divide-y divide-gray-800 print:divide-gray-200">
                    {area.subtemas.map((sub, j) => {
                      const key = `${i}-${j}`;
                      const subOpen = openSubtemas[key] ?? false;
                      return (
                        <div key={j}>
                          <button
                            onClick={() => toggleSubtema(key)}
                            className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-800 print:hover:bg-transparent transition-colors"
                          >
                            <span className="flex items-center gap-2 text-sm font-semibold text-gray-100 print:text-black">
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
                        className={`text-xs px-3 py-1.5 rounded-lg text-white font-medium transition-colors flex items-center gap-1.5 ${colors.aiBtn} disabled:opacity-60`}
                      >
                        {aiLoading === i ? (
                          <><span className="animate-spin">⏳</span> Generando...</>
                        ) : (
                          <>🧠 Tips IA para {area.nombre}</>
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
  );
}
