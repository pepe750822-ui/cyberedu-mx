import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin, X, Search } from 'lucide-react';

interface StateInfo {
  id: string;
  name: string;
  capital: string;
  region: string;
  population: string;
  area: string;
  path: string;
  labelX: number;
  labelY: number;
}

interface CityEntry {
  name: string;
  stateId: string;
  stateName: string;
}

// Projection: lon [-118.4, -86.6] → x [0,900], lat [32.75, 14.5] → y [0,510]
// x = (lon + 118.4) / 31.8 * 900
// y = (32.75 - lat) / 18.25 * 510

const REGION_COLORS: Record<string, string> = {
  'Noroeste':    '#3B82F6',
  'Norte':       '#8B5CF6',
  'Noreste':     '#06B6D4',
  'Occidente':   '#F59E0B',
  'Centro':      '#10B981',
  'Sur':         '#EF4444',
  'Sureste':     '#F97316',
};

const STATES: StateInfo[] = [
  {
    id: 'bc', name: 'Baja California', capital: 'Mexicali', region: 'Noroeste',
    population: '3.8M', area: '70,113 km²', labelX: 78, labelY: 68,
    path: 'M40,7 L82,2 L112,4 L120,28 L130,50 L148,74 L175,100 L210,122 L245,132 L240,140 L218,106 L178,80 L155,55 L136,30 L108,14 L62,18 Z'
  },
  {
    id: 'bcs', name: 'Baja California Sur', capital: 'La Paz', region: 'Noroeste',
    population: '0.8M', area: '73,909 km²', labelX: 145, labelY: 250,
    path: 'M245,132 L240,140 L244,162 L250,185 L255,210 L256,235 L252,258 L244,278 L236,295 L228,312 L222,330 L218,348 L215,360 L218,370 L224,366 L230,355 L238,342 L246,325 L254,305 L262,278 L268,252 L272,225 L274,195 L272,168 L266,148 L258,136 Z'
  },
  {
    id: 'son', name: 'Sonora', capital: 'Hermosillo', region: 'Noroeste',
    population: '3.0M', area: '179,503 km²', labelX: 196, labelY: 115,
    path: 'M112,4 L206,4 L248,6 L284,10 L292,46 L294,90 L290,135 L288,162 L270,168 L248,132 L210,122 L175,100 L148,74 L130,50 L120,28 Z'
  },
  {
    id: 'chih', name: 'Chihuahua', capital: 'Chihuahua', region: 'Norte',
    population: '3.8M', area: '247,455 km²', labelX: 355, labelY: 88,
    path: 'M292,46 L340,36 L392,28 L430,26 L436,60 L440,96 L438,130 L432,162 L420,188 L408,200 L388,204 L368,198 L348,188 L330,172 L310,162 L290,158 L288,162 L290,135 L294,90 Z'
  },
  {
    id: 'coah', name: 'Coahuila', capital: 'Saltillo', region: 'Norte',
    population: '3.1M', area: '151,563 km²', labelX: 465, labelY: 112,
    path: 'M430,26 L478,22 L525,28 L548,50 L556,80 L554,112 L548,136 L536,155 L520,162 L504,165 L488,162 L472,158 L456,152 L440,144 L432,162 L420,188 L408,200 L420,196 L436,200 L452,198 L468,192 L484,180 L500,168 L516,158 L532,148 L542,130 L548,108 L546,80 L540,58 L525,40 L490,30 Z'
  },
  {
    id: 'nl', name: 'Nuevo León', capital: 'Monterrey', region: 'Noreste',
    population: '5.8M', area: '64,555 km²', labelX: 533, labelY: 168,
    path: 'M548,50 L570,52 L590,60 L598,84 L595,110 L585,132 L572,148 L556,154 L548,136 L554,112 L556,80 Z'
  },
  {
    id: 'tamps', name: 'Tamaulipas', capital: 'Ciudad Victoria', region: 'Noreste',
    population: '3.7M', area: '80,175 km²', labelX: 575, labelY: 210,
    path: 'M570,52 L610,55 L638,72 L648,100 L645,130 L636,160 L622,188 L608,215 L598,242 L592,270 L588,298 L582,315 L574,308 L562,290 L550,268 L538,248 L528,228 L520,205 L520,180 L532,162 L548,150 L556,154 L572,148 L585,132 L595,110 L598,84 Z'
  },
  {
    id: 'sin', name: 'Sinaloa', capital: 'Culiacán', region: 'Noroeste',
    population: '3.0M', area: '57,377 km²', labelX: 300, labelY: 198,
    path: 'M288,162 L310,162 L330,172 L348,188 L360,202 L366,218 L365,234 L358,250 L348,265 L336,278 L322,288 L308,295 L295,298 L285,292 L278,280 L275,265 L276,248 L280,228 L282,208 L286,188 Z'
  },
  {
    id: 'dgo', name: 'Durango', capital: 'Durango', region: 'Norte',
    population: '1.9M', area: '119,648 km²', labelX: 366, labelY: 240,
    path: 'M348,188 L368,198 L388,204 L408,200 L420,196 L432,200 L442,210 L448,225 L446,242 L440,258 L430,270 L418,280 L404,286 L390,288 L376,286 L364,280 L354,268 L348,255 L348,238 L350,220 L352,204 Z'
  },
  {
    id: 'zac', name: 'Zacatecas', capital: 'Zacatecas', region: 'Norte',
    population: '1.6M', area: '75,539 km²', labelX: 448, labelY: 258,
    path: 'M432,200 L448,195 L464,192 L480,192 L494,200 L502,212 L504,228 L500,244 L492,258 L480,268 L466,275 L452,275 L440,268 L432,256 L430,242 L432,228 L434,214 Z'
  },
  {
    id: 'slp', name: 'San Luis Potosí', capital: 'San Luis Potosí', region: 'Norte',
    population: '2.8M', area: '60,983 km²', labelX: 510, labelY: 248,
    path: 'M494,200 L516,198 L530,200 L545,208 L555,220 L558,234 L554,250 L546,264 L534,274 L520,280 L506,280 L493,273 L484,262 L480,248 L482,234 L488,220 L492,210 Z'
  },
  {
    id: 'nay', name: 'Nayarit', capital: 'Tepic', region: 'Occidente',
    population: '1.2M', area: '27,815 km²', labelX: 324, labelY: 306,
    path: 'M308,295 L322,288 L336,278 L348,265 L358,280 L364,298 L362,315 L356,328 L345,336 L332,340 L320,336 L310,326 L306,312 Z'
  },
  {
    id: 'jal', name: 'Jalisco', capital: 'Guadalajara', region: 'Occidente',
    population: '8.3M', area: '80,137 km²', labelX: 390, labelY: 338,
    path: 'M358,280 L376,286 L390,288 L404,286 L418,280 L430,280 L442,282 L454,290 L462,302 L464,318 L460,334 L452,346 L440,355 L425,360 L410,360 L395,355 L382,346 L370,335 L360,322 L354,308 L352,294 Z'
  },
  {
    id: 'ags', name: 'Aguascalientes', capital: 'Aguascalientes', region: 'Occidente',
    population: '1.4M', area: '5,616 km²', labelX: 452, labelY: 292,
    path: 'M452,275 L462,278 L470,286 L470,298 L463,306 L454,308 L445,302 L442,292 L446,282 Z'
  },
  {
    id: 'gto', name: 'Guanajuato', capital: 'Guanajuato', region: 'Centro',
    population: '6.2M', area: '30,589 km²', labelX: 480, labelY: 316,
    path: 'M480,268 L494,270 L506,274 L516,280 L524,292 L522,308 L514,320 L502,328 L488,330 L475,325 L465,315 L462,302 L464,318 L468,302 L472,290 Z'
  },
  {
    id: 'qro', name: 'Querétaro', capital: 'Querétaro', region: 'Centro',
    population: '2.4M', area: '11,699 km²', labelX: 522, labelY: 316,
    path: 'M524,292 L536,290 L548,296 L556,308 L554,322 L546,332 L534,336 L522,332 L514,322 L514,310 Z'
  },
  {
    id: 'hgo', name: 'Hidalgo', capital: 'Pachuca', region: 'Centro',
    population: '3.1M', area: '20,813 km²', labelX: 554, labelY: 342,
    path: 'M548,296 L562,292 L576,296 L586,308 L585,322 L578,334 L566,342 L554,344 L542,338 L534,330 L536,318 L542,308 Z'
  },
  {
    id: 'col', name: 'Colima', capital: 'Colima', region: 'Occidente',
    population: '0.7M', area: '5,455 km²', labelX: 385, labelY: 374,
    path: 'M378,364 L388,360 L396,366 L398,376 L392,384 L382,384 L376,376 Z'
  },
  {
    id: 'mich', name: 'Michoacán', capital: 'Morelia', region: 'Occidente',
    population: '4.7M', area: '58,643 km²', labelX: 434, labelY: 382,
    path: 'M410,360 L425,360 L440,362 L452,368 L460,380 L460,395 L454,410 L442,420 L428,425 L413,422 L400,414 L390,402 L385,388 L385,374 L390,362 Z'
  },
  {
    id: 'mex', name: 'Estado de México', capital: 'Toluca', region: 'Centro',
    population: '17.4M', area: '22,357 km²', labelX: 515, labelY: 368,
    path: 'M502,344 L516,340 L530,342 L542,350 L548,362 L546,376 L538,386 L526,390 L514,388 L504,380 L498,368 L498,356 Z'
  },
  {
    id: 'cdmx', name: 'Ciudad de México', capital: 'CDMX', region: 'Centro',
    population: '9.2M', area: '1,495 km²', labelX: 543, labelY: 383,
    path: 'M538,372 L544,370 L550,374 L551,382 L546,388 L538,388 L534,382 L535,374 Z'
  },
  {
    id: 'tla', name: 'Tlaxcala', capital: 'Tlaxcala', region: 'Centro',
    population: '1.3M', area: '3,991 km²', labelX: 563, labelY: 368,
    path: 'M556,358 L564,356 L572,360 L574,368 L568,376 L558,376 L554,368 Z'
  },
  {
    id: 'mor', name: 'Morelos', capital: 'Cuernavaca', region: 'Centro',
    population: '2.0M', area: '4,893 km²', labelX: 530, labelY: 400,
    path: 'M514,392 L526,390 L538,394 L541,405 L534,415 L523,416 L514,408 Z'
  },
  {
    id: 'gro', name: 'Guerrero', capital: 'Chilpancingo', region: 'Sur',
    population: '3.5M', area: '63,621 km²', labelX: 472, labelY: 430,
    path: 'M440,420 L455,416 L468,416 L480,422 L490,432 L494,448 L490,464 L480,474 L466,478 L452,474 L440,464 L432,450 L430,435 Z'
  },
  {
    id: 'pue', name: 'Puebla', capital: 'Puebla', region: 'Centro',
    population: '6.6M', area: '34,290 km²', labelX: 574, labelY: 392,
    path: 'M558,360 L572,358 L586,362 L598,372 L605,386 L602,402 L593,414 L580,420 L566,420 L554,412 L546,400 L546,386 L552,374 Z'
  },
  {
    id: 'ver', name: 'Veracruz', capital: 'Xalapa', region: 'Sur',
    population: '8.1M', area: '71,820 km²', labelX: 614, labelY: 348,
    path: 'M574,308 L590,305 L605,312 L616,325 L622,342 L625,360 L624,378 L618,396 L610,412 L600,424 L590,432 L578,436 L566,434 L556,424 L566,420 L580,420 L593,414 L602,402 L605,386 L598,372 L586,362 L572,358 L558,360 L554,344 L562,338 L570,328 Z'
  },
  {
    id: 'oax', name: 'Oaxaca', capital: 'Oaxaca de Juárez', region: 'Sur',
    population: '4.1M', area: '93,793 km²', labelX: 564, labelY: 458,
    path: 'M554,412 L566,420 L578,424 L590,432 L600,440 L608,452 L608,468 L600,482 L588,490 L574,494 L560,490 L548,480 L540,466 L536,450 L538,436 L546,426 L550,414 Z'
  },
  {
    id: 'chis', name: 'Chiapas', capital: 'Tuxtla Gutiérrez', region: 'Sur',
    population: '5.5M', area: '73,887 km²', labelX: 654, labelY: 464,
    path: 'M608,428 L620,425 L634,428 L648,436 L660,448 L665,462 L662,476 L652,486 L638,492 L622,494 L608,490 L596,482 L590,470 L592,456 L600,444 Z'
  },
  {
    id: 'tab', name: 'Tabasco', capital: 'Villahermosa', region: 'Sureste',
    population: '2.4M', area: '24,661 km²', labelX: 648, labelY: 422,
    path: 'M620,406 L634,404 L648,408 L658,418 L660,430 L652,440 L638,444 L624,440 L614,430 L614,418 Z'
  },
  {
    id: 'camp', name: 'Campeche', capital: 'Campeche', region: 'Sureste',
    population: '0.9M', area: '57,507 km²', labelX: 710, labelY: 418,
    path: 'M660,400 L680,396 L700,398 L716,408 L724,424 L722,440 L714,454 L700,462 L684,464 L670,458 L660,448 L654,436 L656,422 Z'
  },
  {
    id: 'yuc', name: 'Yucatán', capital: 'Mérida', region: 'Sureste',
    population: '2.3M', area: '39,524 km²', labelX: 770, labelY: 368,
    path: 'M716,360 L750,350 L785,344 L818,345 L840,352 L848,366 L840,382 L822,394 L800,400 L778,402 L756,398 L736,390 L720,378 L714,366 Z'
  },
  {
    id: 'qroo', name: 'Quintana Roo', capital: 'Chetumal', region: 'Sureste',
    population: '1.9M', area: '44,705 km²', labelX: 852, labelY: 400,
    path: 'M840,352 L868,346 L892,345 L900,360 L898,385 L892,408 L882,428 L866,444 L848,455 L832,458 L818,452 L808,438 L806,420 L812,402 L822,390 L840,382 Z'
  },
];

const CITIES: CityEntry[] = [
  { name: 'Tijuana', stateId: 'bc', stateName: 'Baja California' },
  { name: 'Mexicali', stateId: 'bc', stateName: 'Baja California' },
  { name: 'Ensenada', stateId: 'bc', stateName: 'Baja California' },
  { name: 'La Paz', stateId: 'bcs', stateName: 'Baja California Sur' },
  { name: 'Los Cabos', stateId: 'bcs', stateName: 'Baja California Sur' },
  { name: 'Hermosillo', stateId: 'son', stateName: 'Sonora' },
  { name: 'Nogales', stateId: 'son', stateName: 'Sonora' },
  { name: 'Ciudad Obregón', stateId: 'son', stateName: 'Sonora' },
  { name: 'Chihuahua', stateId: 'chih', stateName: 'Chihuahua' },
  { name: 'Ciudad Juárez', stateId: 'chih', stateName: 'Chihuahua' },
  { name: 'Delicias', stateId: 'chih', stateName: 'Chihuahua' },
  { name: 'Saltillo', stateId: 'coah', stateName: 'Coahuila' },
  { name: 'Torreón', stateId: 'coah', stateName: 'Coahuila' },
  { name: 'Monterrey', stateId: 'nl', stateName: 'Nuevo León' },
  { name: 'San Nicolás de los Garza', stateId: 'nl', stateName: 'Nuevo León' },
  { name: 'Guadalupe', stateId: 'nl', stateName: 'Nuevo León' },
  { name: 'Ciudad Victoria', stateId: 'tamps', stateName: 'Tamaulipas' },
  { name: 'Tampico', stateId: 'tamps', stateName: 'Tamaulipas' },
  { name: 'Reynosa', stateId: 'tamps', stateName: 'Tamaulipas' },
  { name: 'Matamoros', stateId: 'tamps', stateName: 'Tamaulipas' },
  { name: 'Culiacán', stateId: 'sin', stateName: 'Sinaloa' },
  { name: 'Mazatlán', stateId: 'sin', stateName: 'Sinaloa' },
  { name: 'Los Mochis', stateId: 'sin', stateName: 'Sinaloa' },
  { name: 'Durango', stateId: 'dgo', stateName: 'Durango' },
  { name: 'Zacatecas', stateId: 'zac', stateName: 'Zacatecas' },
  { name: 'Fresnillo', stateId: 'zac', stateName: 'Zacatecas' },
  { name: 'San Luis Potosí', stateId: 'slp', stateName: 'San Luis Potosí' },
  { name: 'Tepic', stateId: 'nay', stateName: 'Nayarit' },
  { name: 'Guadalajara', stateId: 'jal', stateName: 'Jalisco' },
  { name: 'Puerto Vallarta', stateId: 'jal', stateName: 'Jalisco' },
  { name: 'Zapopan', stateId: 'jal', stateName: 'Jalisco' },
  { name: 'Aguascalientes', stateId: 'ags', stateName: 'Aguascalientes' },
  { name: 'León', stateId: 'gto', stateName: 'Guanajuato' },
  { name: 'Guanajuato', stateId: 'gto', stateName: 'Guanajuato' },
  { name: 'Celaya', stateId: 'gto', stateName: 'Guanajuato' },
  { name: 'Irapuato', stateId: 'gto', stateName: 'Guanajuato' },
  { name: 'Querétaro', stateId: 'qro', stateName: 'Querétaro' },
  { name: 'Pachuca', stateId: 'hgo', stateName: 'Hidalgo' },
  { name: 'Colima', stateId: 'col', stateName: 'Colima' },
  { name: 'Morelia', stateId: 'mich', stateName: 'Michoacán' },
  { name: 'Uruapan', stateId: 'mich', stateName: 'Michoacán' },
  { name: 'Toluca', stateId: 'mex', stateName: 'Estado de México' },
  { name: 'Ecatepec', stateId: 'mex', stateName: 'Estado de México' },
  { name: 'Naucalpan', stateId: 'mex', stateName: 'Estado de México' },
  { name: 'Ciudad de México', stateId: 'cdmx', stateName: 'Ciudad de México' },
  { name: 'Tlaxcala', stateId: 'tla', stateName: 'Tlaxcala' },
  { name: 'Cuernavaca', stateId: 'mor', stateName: 'Morelos' },
  { name: 'Acapulco', stateId: 'gro', stateName: 'Guerrero' },
  { name: 'Chilpancingo', stateId: 'gro', stateName: 'Guerrero' },
  { name: 'Puebla', stateId: 'pue', stateName: 'Puebla' },
  { name: 'Tehuacán', stateId: 'pue', stateName: 'Puebla' },
  { name: 'Veracruz', stateId: 'ver', stateName: 'Veracruz' },
  { name: 'Xalapa', stateId: 'ver', stateName: 'Veracruz' },
  { name: 'Coatzacoalcos', stateId: 'ver', stateName: 'Veracruz' },
  { name: 'Oaxaca', stateId: 'oax', stateName: 'Oaxaca' },
  { name: 'Tuxtla Gutiérrez', stateId: 'chis', stateName: 'Chiapas' },
  { name: 'San Cristóbal de las Casas', stateId: 'chis', stateName: 'Chiapas' },
  { name: 'Villahermosa', stateId: 'tab', stateName: 'Tabasco' },
  { name: 'Campeche', stateId: 'camp', stateName: 'Campeche' },
  { name: 'Mérida', stateId: 'yuc', stateName: 'Yucatán' },
  { name: 'Cancún', stateId: 'qroo', stateName: 'Quintana Roo' },
  { name: 'Playa del Carmen', stateId: 'qroo', stateName: 'Quintana Roo' },
  { name: 'Chetumal', stateId: 'qroo', stateName: 'Quintana Roo' },
];

function nrm(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

interface MexicoMapProps {
  highlightState?: string;
  title?: string;
  description?: string;
}

export default function MexicoMapArtifact({ highlightState, title, description }: MexicoMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<StateInfo | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedStateId, setFocusedStateId] = useState<string | null>(highlightState || null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = useMemo(() => {
    if (!searchValue.trim()) return [];
    const q = nrm(searchValue.trim());
    const results: { label: string; stateId: string; isCity: boolean }[] = [];

    for (const st of STATES) {
      if (nrm(st.name).includes(q)) {
        results.push({ label: st.name, stateId: st.id, isCity: false });
      }
    }
    for (const city of CITIES) {
      if (nrm(city.name).includes(q)) {
        results.push({ label: `${city.name}, ${city.stateName}`, stateId: city.stateId, isCity: true });
      }
    }
    return results.slice(0, 8);
  }, [searchValue]);

  function handleSuggestionSelect(stateId: string, label: string) {
    const st = STATES.find(s => s.id === stateId)!;
    setFocusedStateId(stateId);
    setSelectedState(st);
    setSearchValue(label);
    setShowSuggestions(false);
  }

  function getStateFill(state: StateInfo) {
    const base = REGION_COLORS[state.region] || '#6B7280';
    if (focusedStateId === state.id || hoveredState === state.id) return base;
    if (focusedStateId && focusedStateId !== state.id) return '#D1D5DB';
    return base + 'CC';
  }

  function getStateOpacity(state: StateInfo) {
    if (focusedStateId === state.id) return 1;
    if (hoveredState === state.id) return 0.95;
    if (focusedStateId && focusedStateId !== state.id) return 0.5;
    return 0.82;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {(title || description) && (
        <div className="px-4 pt-4 pb-2">
          {title && <h3 className="text-base font-semibold text-gray-800">{title}</h3>}
          {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
        </div>
      )}

      {/* Search */}
      <div className="px-4 py-2" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar estado o ciudad..."
            value={searchValue}
            onChange={e => { setSearchValue(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
          />
          {searchValue && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => { setSearchValue(''); setFocusedStateId(null); setSelectedState(null); setShowSuggestions(false); }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 flex items-center gap-2"
                  onMouseDown={() => handleSuggestionSelect(s.stateId, s.label)}
                >
                  <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                  <span>{s.label}</span>
                  {s.isCity && <span className="ml-auto text-xs text-gray-400">Ciudad</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="px-2 pb-2 relative" style={{ maxHeight: 360, overflowY: 'hidden' }}>
        <svg
          viewBox="0 0 900 510"
          className="w-full"
          style={{ maxHeight: 340 }}
        >
          {STATES.map(state => (
            <path
              key={state.id}
              d={state.path}
              fill={getStateFill(state)}
              fillOpacity={getStateOpacity(state)}
              stroke="white"
              strokeWidth={1.5}
              style={{ cursor: 'pointer', transition: 'fill 0.15s, fill-opacity 0.15s' }}
              onMouseEnter={() => setHoveredState(state.id)}
              onMouseLeave={() => setHoveredState(null)}
              onClick={() => {
                setSelectedState(prev => prev?.id === state.id ? null : state);
                setFocusedStateId(prev => prev === state.id ? null : state.id);
              }}
            />
          ))}
          {/* State abbreviation labels for larger states */}
          {STATES.filter(s => ['son','chih','coah','tamps','jal','ver','oax','chis','camp','yuc','qroo','sin','dgo','slp'].includes(s.id)).map(state => (
            <text
              key={state.id + '-label'}
              x={state.labelX}
              y={state.labelY}
              fontSize={8}
              fill="white"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ pointerEvents: 'none', fontWeight: 600, opacity: 0.9 }}
            >
              {state.name.split(' ')[0].substring(0, 3).toUpperCase()}
            </text>
          ))}
        </svg>

        {/* Hover tooltip */}
        {hoveredState && !selectedState && (() => {
          const st = STATES.find(s => s.id === hoveredState);
          if (!st) return null;
          return (
            <div className="absolute top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-sm pointer-events-none z-10">
              <p className="font-semibold text-gray-800">{st.name}</p>
              <p className="text-gray-500 text-xs">{st.capital}</p>
            </div>
          );
        })()}
      </div>

      {/* Region legend */}
      <div className="px-4 pb-3">
        <div className="flex flex-wrap gap-2">
          {Object.entries(REGION_COLORS).map(([region, color]) => (
            <span key={region} className="flex items-center gap-1 text-xs text-gray-600">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
              {region}
            </span>
          ))}
        </div>
      </div>

      {/* Selected state detail panel */}
      {selectedState && (
        <div className="mx-4 mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-gray-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" style={{ color: REGION_COLORS[selectedState.region] }} />
                {selectedState.name}
              </h4>
              <p className="text-sm text-gray-500 mt-0.5">Capital: {selectedState.capital}</p>
            </div>
            <button
              className="text-gray-400 hover:text-gray-600 shrink-0"
              onClick={() => { setSelectedState(null); setFocusedStateId(null); }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
            <div className="bg-white rounded-lg p-2 border border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Región</p>
              <p className="font-medium text-gray-700 mt-0.5">{selectedState.region}</p>
            </div>
            <div className="bg-white rounded-lg p-2 border border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Población</p>
              <p className="font-medium text-gray-700 mt-0.5">{selectedState.population}</p>
            </div>
            <div className="bg-white rounded-lg p-2 border border-gray-100 col-span-2">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Superficie</p>
              <p className="font-medium text-gray-700 mt-0.5">{selectedState.area}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
