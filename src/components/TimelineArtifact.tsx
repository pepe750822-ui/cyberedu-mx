import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, X, Globe, Flag, LayoutList, Video, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TimelineEvent {
  id: string; year: number; title: string; description: string;
  category: 'mexico' | 'universal'; era: string; icon: string;
  detail: string; ecoems?: string;
  keywords?: string[];
  videoId?: string;
  areaId?: string;
}

const EVENTS: TimelineEvent[] = [
  // ── Historia Universal ─────────────────────────────────────────────────
  { id:'u1', year:1440, title:'Imprenta de Gutenberg', description:'Johannes Gutenberg inventa la imprenta de tipos móviles.', detail:'Permitió la reproducción masiva de libros, democratizó el conocimiento y fue clave en la Reforma Protestante y el Renacimiento.', category:'universal', era:'Renacimiento', icon:'📖', ecoems:'HU 1.1', keywords:['imprenta','gutenberg','renacimiento','libros'], areaId:'historia-universal', videoId:'hu-1' },
  { id:'u2', year:1492, title:'Llegada de Colón a América', description:'Cristóbal Colón llega al Caribe el 12 de octubre.', detail:'Comenzó el encuentro entre Europa y América. Marcó el inicio de la colonización española y el intercambio colombino de plantas, animales y enfermedades.', category:'universal', era:'Renacimiento', icon:'⛵', ecoems:'HU 1.1', keywords:['colon','america','descubrimiento','colonización','conquista'], areaId:'historia-universal', videoId:'hu-1' },
  { id:'u3', year:1517, title:'Reforma Protestante', description:'Martín Lutero publica sus 95 tesis contra la Iglesia Católica.', detail:'Criticó las indulgencias y la corrupción de la Iglesia. Originó el protestantismo y las guerras de religión en Europa. Lutero usó la imprenta para difundir sus ideas.', category:'universal', era:'Renacimiento', icon:'⛪', ecoems:'HU 1.1', keywords:['reforma','lutero','protestante','iglesia','religion'], areaId:'historia-universal', videoId:'hu-1' },
  { id:'u4', year:1687, title:'Ley de Gravitación Universal', description:'Isaac Newton publica los Principia Mathematica.', detail:'Explicó que todos los cuerpos se atraen con una fuerza proporcional a sus masas e inversamente proporcional al cuadrado de la distancia. Base de la física clásica.', category:'universal', era:'Ilustración', icon:'🍎', ecoems:'HU 1.1', keywords:['newton','gravitacion','fisica','ilustracion','ciencia'], areaId:'historia-universal', videoId:'hu-2' },
  { id:'u5', year:1776, title:'Independencia de EE.UU.', description:'Las 13 colonias declaran su independencia de Gran Bretaña.', detail:'Primera nación independiente del continente americano. Inspirada en la Ilustración: igualdad, libertad y soberanía popular. Modelo para las revoluciones latinoamericanas.', category:'universal', era:'Ilustración', icon:'🗽', ecoems:'HU 2.1', keywords:['independencia','eeuu','estados unidos','colonias','libertad','revolucion'], areaId:'historia-universal', videoId:'hu-2' },
  { id:'u6', year:1789, title:'Revolución Francesa', description:'Caída de la Bastilla el 14 de julio; fin del Antiguo Régimen.', detail:'Proclamó los valores de Libertad, Igualdad y Fraternidad. Abolió el feudalismo, creó una república y ejecutó al rey Luis XVI. Difundió el liberalismo por Europa.', category:'universal', era:'Ilustración', icon:'🗼', ecoems:'HU 2.1', keywords:['revolucion','francesa','francia','bastilla','libertad','igualdad','republica'], areaId:'historia-universal', videoId:'hu-2' },
  { id:'u7', year:1804, title:'Imperio de Napoleón Bonaparte', description:'Napoleón se corona emperador de Francia.', detail:'Extendió el control francés por Europa mediante guerras. Difundió el Código Napoleónico y los ideales de la Revolución Francesa. Fue derrotado en Waterloo (1815).', category:'universal', era:'Siglo XIX', icon:'👑', ecoems:'HU 2.1', keywords:['napoleon','francia','imperio','guerra','waterloo'], areaId:'historia-universal', videoId:'hu-2' },
  { id:'u8', year:1848, title:'Año de las Revoluciones en Europa', description:'Oleada revolucionaria en Francia, Alemania, Italia y Austria.', detail:'El "Año de las Revoluciones" combinó demandas liberales y nacionalistas. El Manifiesto Comunista de Marx y Engels también fue publicado este año.', category:'universal', era:'Siglo XIX', icon:'✊', ecoems:'HU 3.1', keywords:['revolucion','europa','marx','comunismo','liberalismo','nacionalismo'], areaId:'historia-universal', videoId:'hu-2' },
  { id:'u9', year:1871, title:'Unificación Alemana', description:'Otto von Bismarck crea el Imperio Alemán (II Reich).', detail:'Prusia unificó los estados germanos mediante tres guerras. Alemania emergió como potencia industrial y militar. Tensión con Francia que conduciría a la WWI.', category:'universal', era:'Siglo XIX', icon:'🦅', ecoems:'HU 3.1', keywords:['alemania','unificacion','bismarck','prusia','reich'], areaId:'historia-universal', videoId:'hu-2' },
  { id:'u10',year:1914, title:'Primera Guerra Mundial', description:'Asesinato del Archiduque Francisco Fernando desencadena la guerra.', detail:'Guerra entre aliados (Francia, Reino Unido, Rusia) y potencias centrales (Alemania, Austria, Imperio Otomano). Nuevas armas: gas, tanques, aviones. ~17 millones de muertos.', category:'universal', era:'Siglo XX', icon:'⚔️', ecoems:'HU 4.1', keywords:['guerra mundial','primera guerra','wwi','1914','trench','ejercito'], areaId:'historia-universal', videoId:'hu-4' },
  { id:'u11',year:1917, title:'Revolución Rusa', description:'Los bolcheviques de Lenin toman el poder en Rusia.', detail:'Derrocó al Zar Nicolás II. Creó la URSS, primer estado comunista del mundo. Generó la Guerra Civil rusa (1917-1922) y la posterior Guerra Fría contra EE.UU.', category:'universal', era:'Siglo XX', icon:'☭', ecoems:'HU 4.1', keywords:['revolucion','rusa','rusia','urss','comunismo','lenin','bolchevique','socialismo'], areaId:'historia-universal', videoId:'hu-4' },
  { id:'u12',year:1929, title:'Gran Depresión', description:'Caída de la Bolsa de Nueva York ("Jueves Negro").', detail:'La peor crisis económica del siglo XX. Desempleo masivo mundial. Facilitó el ascenso de regímenes autoritarios en Europa (Hitler en Alemania, 1933).', category:'universal', era:'Entreguerras', icon:'📉', ecoems:'HU 4.1', keywords:['depresion','crisis','economia','bolsa','desempleo','1929'], areaId:'historia-universal', videoId:'hu-5' },
  { id:'u13',year:1939, title:'Segunda Guerra Mundial', description:'Alemania invade Polonia; inicio de la Segunda Guerra Mundial.', detail:'Conflicto global entre Aliados (EE.UU., URSS, Reino Unido) y Eje (Alemania, Italia, Japón). ~70 millones de muertos. El Holocausto exterminó 6 millones de judíos.', category:'universal', era:'Siglo XX', icon:'💣', ecoems:'HU 4.1', keywords:['guerra mundial','segunda guerra','wwii','1939','hitler','nazi','holocausto'], areaId:'historia-universal', videoId:'hu-6' },
  { id:'u14',year:1945, title:'Fin de la Segunda Guerra Mundial', description:'Capitulación de Alemania (mayo) y Japón (septiembre).', detail:'Las bombas atómicas en Hiroshima y Nagasaki aceleraron la rendición japonesa. Creación de la ONU. Inicio de la Guerra Fría entre EE.UU. y la URSS.', category:'universal', era:'Siglo XX', icon:'🕊️', ecoems:'HU 4.1', keywords:['guerra mundial','segunda guerra','wwii','1945','bomba atomica','hiroshima','onu'], areaId:'historia-universal', videoId:'hu-6' },
  { id:'u15',year:1969, title:'Llegada del Hombre a la Luna', description:'Neil Armstrong pisa la Luna el 20 de julio (Apolo 11).', detail:'Logro máximo de la carrera espacial EE.UU. vs URSS. Armstrong dijo: "Un pequeño paso para el hombre, un gran salto para la humanidad." La URSS nunca logró llegar.', category:'universal', era:'Guerra Fría', icon:'🌕', ecoems:'HU 5.1', keywords:['luna','espacio','nasa','apollo','armstrong','astronauta','carrera espacial'], areaId:'historia-universal', videoId:'hu-7' },
  { id:'u16',year:1989, title:'Caída del Muro de Berlín', description:'Ciudadanos alemanes derriban el muro el 9 de noviembre.', detail:'Símbolo del fin de la Guerra Fría. Alemania se reunificó en 1990. La URSS se disolvió en 1991, poniendo fin al bloque socialista y al bipolarismo mundial.', category:'universal', era:'Fin de siglo', icon:'🧱', ecoems:'HU 5.1', keywords:['muro','berlin','alemania','guerra fria','urss','capitalismo'], areaId:'historia-universal', videoId:'hu-7' },

  // ── Historia de México ─────────────────────────────────────────────────
  { id:'m1', year:-200,  title:'Teotihuacán', description:'Construcción de las pirámides del Sol y la Luna (200 a.C. – 650 d.C.).', detail:'Ciudad más grande de Mesoamérica en su época. Influenció a toda Mesoamérica. Su decadencia hacia el 650 d.C. es un misterio arqueológico.', category:'mexico', era:'Prehispánico', icon:'🏛️', ecoems:'HIS-M 6.1', keywords:['teotihuacan','piramide','prehispanico','mesoamerica','azteca'], areaId:'historia-mexico', videoId:'hm-mx-1' },
  { id:'m2', year:1325,  title:'Fundación de Tenochtitlán', description:'Los aztecas fundan su capital en el lago de Texcoco.', detail:'Según la leyenda, buscaron el signo de un águila sobre un nopal con una serpiente. Tenochtitlán se convirtió en la ciudad más poblada del continente americano.', category:'mexico', era:'Prehispánico', icon:'🦅', ecoems:'HIS-M 6.1', keywords:['tenochtitlan','azteca','mexico','fundacion','lago','texcoco','mexica'], areaId:'historia-mexico', videoId:'hm-mx-1' },
  { id:'m3', year:1519,  title:'Llegada de Hernán Cortés', description:'Cortés desembarca en Veracruz y avanza hacia Tenochtitlán.', detail:'Aliado con pueblos enemigos de los aztecas (tlaxcaltecas). Capturó a Moctezuma II. La Malinche fue su intérprete y consejera clave. Inició la conquista de México.', category:'mexico', era:'Conquista', icon:'⚔️', ecoems:'HIS-M 6.2', keywords:['cortes','conquista','espanoles','veracruz','moctezuma','malinche','tlaxcala'], areaId:'historia-mexico', videoId:'hm-mx-2' },
  { id:'m4', year:1521,  title:'Caída de Tenochtitlán', description:'Los españoles y aliados derrumban el Imperio Azteca.', detail:'Cuauhtémoc, último tlatoani azteca, fue capturado el 13 de agosto de 1521. Esta fecha marca el inicio formal del Virreinato de Nueva España.', category:'mexico', era:'Conquista', icon:'🏰', ecoems:'HIS-M 6.2', keywords:['conquista','tenochtitlan','cuauhtemoc','azteca','espana','virreinato'], areaId:'historia-mexico', videoId:'hm-mx-2' },
  { id:'m5', year:1535,  title:'Virreinato de Nueva España', description:'Creación del primer virreinato con capital en México-Tenochtitlán.', detail:'Antonio de Mendoza fue el primer virrey. Duró 300 años (1535-1821). México fue el virreinato más rico de España por su plata y agricultura.', category:'mexico', era:'Virreinato', icon:'👑', ecoems:'HIS-M 6.3', keywords:['virreinato','nueva espana','colonial','virrey','mendoza','plata'], areaId:'historia-mexico', videoId:'hm-mx-3' },
  { id:'m6', year:1810,  title:'Grito de Independencia', description:'Miguel Hidalgo convoca a la rebelión el 15-16 de septiembre en Dolores.', detail:'Hidalgo tocó la campana de la iglesia de Dolores y lanzó su famoso grito. El ejército insurgente tomó Guanajuato. Inició la guerra de independencia de México.', category:'mexico', era:'Independencia', icon:'🔔', ecoems:'HIS-M 7.3', keywords:['independencia','hidalgo','grito','dolores','septiembre','insurgente','guerra'], areaId:'historia-mexico', videoId:'hm-mx-4' },
  { id:'m7', year:1813,  title:'Congreso de Chilpancingo', description:'Morelos declara la independencia y convoca el primer congreso.', detail:'José María Morelos presentó "Solemnes Actos de la Declaración de Independencia". Redactó el documento "Sentimientos de la Nación" con principios liberales avanzados.', category:'mexico', era:'Independencia', icon:'📜', ecoems:'HIS-M 7.3', keywords:['independencia','morelos','chilpancingo','congress','declaracion','sentimientos nacion'], areaId:'historia-mexico', videoId:'hm-mx-4' },
  { id:'m8', year:1821,  title:'Consumación de la Independencia', description:'Agustín de Iturbide y el Ejército Trigarante entran a la Ciudad de México.', detail:'El Plan de Iguala (Independencia, Religión, Unión) unió realistas e insurgentes. El 27 de septiembre de 1821 se consumó la independencia tras 11 años de guerra.', category:'mexico', era:'Independencia', icon:'🎌', ecoems:'HIS-M 7.3', keywords:['independencia','iturbide','trigarante','iguala','consumacion','libertad'], areaId:'historia-mexico', videoId:'hm-mx-4' },
  { id:'m9', year:1857,  title:'Constitución de 1857', description:'Benito Juárez promulga la constitución liberal.', detail:'Estableció las Leyes de Reforma: separación Iglesia-Estado, libertad de culto, registro civil. Generó la Guerra de Reforma (1858-1861) entre liberales y conservadores.', category:'mexico', era:'Siglo XIX', icon:'⚖️', ecoems:'HIS-M 8.1', keywords:['constitucion','juarez','reforma','liberal','iglesia','ley','1857'], areaId:'historia-mexico', videoId:'hm-mx-5' },
  { id:'m10',year:1910,  title:'Revolución Mexicana', description:'Francisco I. Madero lanza el Plan de San Luis contra Porfirio Díaz.', detail:'La revolución más importante de América Latina en el siglo XX. Emiliano Zapata (tierra y libertad), Pancho Villa (norte), Carranza y Obregón consolidaron el movimiento.', category:'mexico', era:'Revolución', icon:'🐎', ecoems:'HIS-M 9.1', keywords:['revolucion','mexicana','madero','zapata','villa','diaz','porfiriato','carranza'], areaId:'historia-mexico', videoId:'hm-mx-6' },
  { id:'m11',year:1917,  title:'Constitución de 1917', description:'Se promulga en Querétaro la primera constitución social del mundo.', detail:'Artículo 3° (educación pública), Artículo 27° (tierra para ejidos), Artículo 123° (derechos laborales). Primera constitución del mundo con derechos sociales garantizados.', category:'mexico', era:'Revolución', icon:'📃', ecoems:'HIS-M 9.3', keywords:['constitucion','1917','queretaro','social','articulo 3','articulo 27','articulo 123','derechos'], areaId:'historia-mexico', videoId:'hm-mx-7' },
  { id:'m12',year:1929,  title:'Fundación del PNR', description:'Plutarco Elías Calles funda el Partido Nacional Revolucionario (futuro PRI).', detail:'Institucionalizar la revolución y acabar con el caudillismo. Se transformó en PRM (1938) y luego en PRI (1946). Gobernó México por 71 años consecutivos hasta el año 2000.', category:'mexico', era:'Posrevolución', icon:'🏛️', ecoems:'HIS-M 10.1', keywords:['pri','pnr','partido','calles','revolucion','institucionalizacion','politica'], areaId:'historia-mexico', videoId:'hm-mx-7' },
  { id:'m13',year:1938,  title:'Expropiación Petrolera', description:'Lázaro Cárdenas nacionaliza el petróleo el 18 de marzo.', detail:'Creó PEMEX. Las mujeres donaron sus joyas para pagar las indemnizaciones a empresas extranjeras. Uno de los actos de soberanía más importantes de México en el siglo XX.', category:'mexico', era:'Posrevolución', icon:'🛢️', ecoems:'HIS-M 10.1', keywords:['petroleo','expropiacion','cardenas','pemex','nacionalizacion','soberania'], areaId:'historia-mexico', videoId:'hm-mx-7' },
  { id:'m14',year:1968,  title:'Movimiento Estudiantil de 1968', description:'Masacre de Tlatelolco el 2 de octubre.', detail:'Estudiantes protestaban contra el gobierno de Gustavo Díaz Ordaz. El ejército reprimió el mitin. Número de muertos sin precisar oficialmente. Fue 10 días antes de las Olimpiadas de México.', category:'mexico', era:'Siglo XX', icon:'✊', ecoems:'HIS-M 10.1', keywords:['1968','tlatelolco','estudiantes','masacre','olimpiadas','diaz ordaz','movimiento'], areaId:'historia-mexico', videoId:'hm-mx-7' },
  { id:'m15',year:2000,  title:'Alternancia Política', description:'Vicente Fox (PAN) gana la presidencia, terminando 71 años del PRI.', detail:'Primera derrota del PRI en elecciones presidenciales. Considerado el inicio de la democracia electoral moderna en México. Transición pacífica del poder.', category:'mexico', era:'Contemporáneo', icon:'🗳️', ecoems:'HIS-M 10.1', keywords:['2000','fox','pan','pri','democracia','alternancia','elecciones','transicion'], areaId:'historia-mexico', videoId:'hm-mx-7' },
];

type Filter = 'all' | 'mexico' | 'universal';

function matchesKeyword(ev: TimelineEvent, kw: string): boolean {
  if (!kw) return true;
  const q = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return (
    normalize(ev.title).includes(q) ||
    normalize(ev.description).includes(q) ||
    normalize(ev.detail).includes(q) ||
    normalize(ev.era).includes(q) ||
    (ev.keywords ?? []).some(k => normalize(k).includes(q))
  );
}

function getInitialState(focus: string): { filter: Filter; keyword: string } {
  const f = focus.trim().toLowerCase();
  if (!f) return { filter: 'all', keyword: '' };
  if (f === 'universal') return { filter: 'universal', keyword: '' };
  if (f === 'mexico' || f === 'méxico') return { filter: 'mexico', keyword: '' };
  // keyword focus: show all events filtered by term
  return { filter: 'all', keyword: focus.trim() };
}

export default function TimelineArtifact({ focus = '' }: { focus?: string }) {
  const navigate = useNavigate();
  const init = getInitialState(focus);
  const [filter, setFilter] = useState<Filter>(init.filter);
  const [keyword, setKeyword] = useState(init.keyword);
  const [eraFilter, setEraFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<TimelineEvent | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const displayedEras = React.useMemo(() => {
    const baseEvents = EVENTS.filter(e => filter === 'all' || e.category === filter);
    return [...new Set(baseEvents.map(e => e.era))];
  }, [filter]);

  const events = React.useMemo(() => {
    return EVENTS
      .filter(e => filter === 'all' || e.category === filter)
      .filter(e => !eraFilter || e.era === eraFilter)
      .filter(e => matchesKeyword(e, keyword))
      .sort((a, b) => a.year - b.year);
  }, [filter, eraFilter, keyword]);

  // Sync state with focus prop if it changes
  useEffect(() => {
    const next = getInitialState(focus);
    setFilter(next.filter);
    setKeyword(next.keyword);
    setEraFilter(null);
    setSelected(null);
  }, [focus]);

  // Scroll back to start when filter changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [filter, eraFilter, keyword]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, scrollLeft: scrollRef.current.scrollLeft };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - (e.clientX - dragStart.current.x);
  };
  const onMouseUp = () => setIsDragging(false);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  const allEras = [...new Set(EVENTS.map(e => e.era))];
  const eraColors = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#14b8a6','#f97316','#a855f7','#22c55e'];
  const getEraColor = (era: string) => eraColors[allEras.indexOf(era) % eraColors.length];

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3 flex-wrap">
        <Clock className="h-4 w-4 text-violet-400 shrink-0" />
        <span className="text-sm font-black uppercase tracking-widest text-white">Línea del Tiempo</span>
        <div className="ml-auto flex gap-1 flex-wrap">
          {([
            { id: 'all',       label: 'Todos',     Icon: LayoutList, active: 'bg-slate-600' },
            { id: 'mexico',    label: 'México',     Icon: Flag,       active: 'bg-emerald-500' },
            { id: 'universal', label: 'Universal',  Icon: Globe,      active: 'bg-violet-500' },
          ] as const).map(({ id, label, Icon, active }) => (
            <button
              key={id}
              onClick={() => { setFilter(id); setEraFilter(null); setSelected(null); }}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === id ? `${active} text-white` : 'text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <Icon className="h-3 w-3" /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Keyword filter badge (only shown when active) */}
      {(keyword || eraFilter) && (
        <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filtros:</span>
          {keyword && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-[10px] font-black text-violet-300">
              Búsqueda: {keyword}
              <button onClick={() => setKeyword('')} className="ml-0.5 hover:text-white transition-colors">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}
          {eraFilter && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black text-white"
              style={{ borderColor: getEraColor(eraFilter) + '50' }}>
              Época: {eraFilter}
              <button onClick={() => setEraFilter(null)} className="ml-0.5 hover:text-white transition-colors">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}
          <span className="text-[9px] text-slate-500 ml-auto">{events.length} evento{events.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Era legend / buttons */}
      <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-none border-b border-white/5 bg-slate-900/40">
        {displayedEras.map((era) => {
          const color = getEraColor(era);
          const isActive = eraFilter === era;
          return (
            <button
              key={era}
              onClick={() => { setEraFilter(isActive ? null : era); setSelected(null); }}
              className={`text-[9px] font-black uppercase tracking-wider whitespace-nowrap px-3 py-1.5 rounded-full border transition-all ${
                isActive ? 'scale-105 shadow-lg' : 'opacity-60 hover:opacity-100 hover:scale-105'
              }`}
              style={{
                color: isActive ? '#fff' : color,
                borderColor: color + (isActive ? '' : '40'),
                background: isActive ? color : color + '15',
                boxShadow: isActive ? `0 0 10px ${color}40` : 'none'
              }}
            >
              {era}
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {events.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-slate-500 font-bold">No se encontraron eventos para "{keyword}".</p>
          <button
            onClick={() => setKeyword('')}
            className="mt-3 text-[11px] font-black text-violet-400 hover:text-violet-300 uppercase tracking-widest"
          >
            Ver todos los eventos →
          </button>
        </div>
      )}

      {/* Timeline track */}
      {events.length > 0 && (
        <div className="relative">
          <button onClick={() => scroll('left')} className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-full p-1 text-white">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scroll('right')} className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-full p-1 text-white">
            <ChevronRight className="h-4 w-4" />
          </button>

          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-none px-10 py-6 cursor-grab active:cursor-grabbing"
            style={{ userSelect: 'none' }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            <div className="relative" style={{ minWidth: events.length * 140 + 80 }}>
              {/* Line */}
              <div className="absolute top-[52px] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="flex gap-4 items-start">
                {events.map((ev) => {
                  const color = getEraColor(ev.era);
                  const isSelected = selected?.id === ev.id;
                  return (
                    <div
                      key={ev.id}
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                      style={{ minWidth: 120 }}
                      onClick={(e) => { if (!isDragging) { e.stopPropagation(); setSelected(isSelected ? null : ev); }}}
                    >
                      <span className="text-[10px] font-black tracking-widest text-slate-400 group-hover:text-white transition-colors">
                        {ev.year < 0 ? `${Math.abs(ev.year)} a.C.` : ev.year}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-base border-2 transition-all ${isSelected ? 'scale-125 shadow-lg' : 'group-hover:scale-110'}`}
                        style={{
                          background: isSelected ? color : color + '20',
                          borderColor: color,
                          boxShadow: isSelected ? `0 0 12px ${color}60` : undefined,
                        }}
                      >
                        <span style={{ fontSize: 14 }}>{ev.icon}</span>
                      </div>
                      <p className="text-[10px] font-bold text-center text-slate-300 group-hover:text-white transition-colors leading-tight" style={{ maxWidth: 110 }}>
                        {ev.title}
                      </p>
                      {ev.ecoems && (
                        <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full border"
                          style={{ color, borderColor: color + '50', background: color + '15' }}>
                          {ev.ecoems}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <p className="text-center text-[9px] text-slate-600 pb-2">← Arrastra para navegar →</p>
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <div className="border-t border-white/10 p-4 bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl filter drop-shadow-md">{selected.icon}</span>
              <div>
                <p className="text-sm font-black text-white uppercase tracking-tight">{selected.title}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {selected.year < 0 ? `${Math.abs(selected.year)} a.C.` : selected.year} · {selected.era}
                  {' · '}<span className={selected.category === 'mexico' ? 'text-emerald-400' : 'text-violet-400'}>
                    {selected.category === 'mexico' ? '🇲🇽 México' : '🌍 Universal'}
                  </span>
                </p>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white p-1 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-[1fr,auto] gap-4 items-center">
            <p className="text-[12px] text-slate-200 leading-relaxed italic">{selected.detail}</p>
            
            {(selected.videoId && selected.areaId) && (
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('cyberedu:close-chat'));
                  navigate(`/area/${selected.areaId}?video=${selected.videoId}`);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                <PlayCircle className="h-4 w-4" />
                Ver video del tema →
              </button>
            )}
          </div>

          {selected.ecoems && (
            <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-violet-400/80 border-t border-white/5 pt-3">
              📚 Cita ECOEMS: [{selected.ecoems}]
            </p>
          )}
        </div>
      )}
    </div>
  );
}
