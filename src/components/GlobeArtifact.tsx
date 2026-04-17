import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Globe, RotateCcw, ZoomIn, ZoomOut, MapPin, Search, Loader2, AlertTriangle, RefreshCw, X } from 'lucide-react';

interface GlobeArtifactProps {
  highlightCountry?: string;
  highlightContinent?: string;
  topic?: string;
}

const toRad = (d: number) => (d * Math.PI) / 180;

function orthographicProject(
  lon: number, lat: number,
  rotLon: number, rotLat: number,
  scale: number, cx: number, cy: number
): { x: number; y: number } | null {
  const λ = toRad(lon - rotLon);
  const φ = toRad(lat);
  const φ0 = toRad(rotLat);
  const cosφ = Math.cos(φ), sinφ = Math.sin(φ);
  const cosφ0 = Math.cos(φ0), sinφ0 = Math.sin(φ0);
  const cosλ = Math.cos(λ);
  const dot = sinφ * sinφ0 + cosφ * cosλ * cosφ0;
  if (dot < 0) return null;
  return {
    x: cx + cosφ * Math.sin(λ) * scale,
    y: cy - (sinφ * cosφ0 - cosφ * cosλ * sinφ0) * scale,
  };
}

function drawGeoPolygon(
  ctx: CanvasRenderingContext2D,
  rings: number[][][],
  rotLon: number, rotLat: number,
  scale: number, cx: number, cy: number
): boolean {
  let anyVisible = false;
  ctx.beginPath();
  for (const ring of rings) {
    let penDown = false;
    for (const [lon, lat] of ring) {
      const pt = orthographicProject(lon, lat, rotLon, rotLat, scale, cx, cy);
      if (!pt) { penDown = false; continue; }
      anyVisible = true;
      if (!penDown) { ctx.moveTo(pt.x, pt.y); penDown = true; }
      else ctx.lineTo(pt.x, pt.y);
    }
    if (penDown) ctx.closePath();
  }
  return anyVisible;
}

function isPointInCountry(lon: number, lat: number, feature: any): boolean {
  const geom = feature.geometry;
  const testRings = (rings: number[][][]) => {
    const ring = rings[0];
    if (!ring) return false;
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1];
      const xj = ring[j][0], yj = ring[j][1];
      if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi)
        inside = !inside;
    }
    return inside;
  };
  if (geom.type === 'Polygon') return testRings(geom.coordinates);
  if (geom.type === 'MultiPolygon') return geom.coordinates.some((p: number[][][]) => testRings(p));
  return false;
}

const CONTINENT_COLORS: Record<string, string> = {
  'Africa': '#f59e0b',
  'Asia': '#10b981',
  'Europe': '#3b82f6',
  'North America': '#8b5cf6',
  'South America': '#ec4899',
  'Oceania': '#06b6d4',
  'Antarctica': '#94a3b8',
  'default': '#6366f1',
};

const CONTINENT_CENTERS: Record<string, { lon: number; lat: number; zoom: number }> = {
  'Africa':        { lon:  20,  lat:   2, zoom: 160 },
  'Asia':          { lon:  90,  lat:  35, zoom: 155 },
  'Europe':        { lon:  15,  lat:  52, zoom: 210 },
  'North America': { lon: -100, lat:  45, zoom: 160 },
  'South America': { lon:  -58, lat: -15, zoom: 175 },
  'Oceania':       { lon: 135,  lat: -25, zoom: 195 },
  'Antarctica':    { lon:   0,  lat: -80, zoom: 175 },
};

interface CountryExtra {
  capital: string;
  languages: string;
  currency?: string;
  area?: string;
  gdp?: string;
  demonym?: string;
  timezone?: string;
}

// Static enrichment: capital, languages, currency, area, GDP, demonym, timezone
const COUNTRY_INFO: Record<string, CountryExtra> = {
  'Afghanistan': { capital: 'Kabul', languages: 'Dari, Pastún', currency: 'Afgani (AFN)', area: '652,230 km²', gdp: '~14 mil millones USD', demonym: 'Afgano/a', timezone: 'UTC+4:30' },
  'Albania': { capital: 'Tirana', languages: 'Albanés', currency: 'Lek (ALL)', area: '28,748 km²', gdp: '~22 mil millones USD', demonym: 'Albanés/a', timezone: 'UTC+1/+2' },
  'Algeria': { capital: 'Argel', languages: 'Árabe, Bereber', currency: 'Dinar argelino (DZD)', area: '2,381,741 km²', gdp: '~167 mil millones USD', demonym: 'Argelino/a', timezone: 'UTC+1' },
  'Angola': { capital: 'Luanda', languages: 'Portugués', currency: 'Kwanza (AOA)', area: '1,246,700 km²', gdp: '~75 mil millones USD', demonym: 'Angoleño/a', timezone: 'UTC+1' },
  'Argentina': { capital: 'Buenos Aires', languages: 'Español', currency: 'Peso argentino (ARS)', area: '2,780,400 km²', gdp: '~632 mil millones USD', demonym: 'Argentino/a', timezone: 'UTC−3' },
  'Australia': { capital: 'Canberra', languages: 'Inglés', currency: 'Dólar australiano (AUD)', area: '7,692,024 km²', gdp: '~1.69 billones USD', demonym: 'Australiano/a', timezone: 'UTC+8/+11' },
  'Austria': { capital: 'Viena', languages: 'Alemán', currency: 'Euro (EUR)', area: '83,871 km²', gdp: '~480 mil millones USD', demonym: 'Austriaco/a', timezone: 'UTC+1/+2' },
  'Belgium': { capital: 'Bruselas', languages: 'Neerlandés, Francés, Alemán', currency: 'Euro (EUR)', area: '30,528 km²', gdp: '~590 mil millones USD', demonym: 'Belga', timezone: 'UTC+1/+2' },
  'Bolivia': { capital: 'Sucre / La Paz', languages: 'Español, Quechua, Aymara', currency: 'Boliviano (BOB)', area: '1,098,581 km²', gdp: '~44 mil millones USD', demonym: 'Boliviano/a', timezone: 'UTC−4' },
  'Brazil': { capital: 'Brasilia', languages: 'Portugués', currency: 'Real brasileño (BRL)', area: '8,515,767 km²', gdp: '~2.08 billones USD', demonym: 'Brasileño/a', timezone: 'UTC−2/−5' },
  'Cambodia': { capital: 'Nom Pen', languages: 'Jemer', currency: 'Riel (KHR)', area: '181,035 km²', gdp: '~28 mil millones USD', demonym: 'Camboyano/a', timezone: 'UTC+7' },
  'Cameroon': { capital: 'Yaundé', languages: 'Francés, Inglés', currency: 'Franco CFA (XAF)', area: '475,442 km²', gdp: '~44 mil millones USD', demonym: 'Camerunés/a', timezone: 'UTC+1' },
  'Canada': { capital: 'Ottawa', languages: 'Inglés, Francés', currency: 'Dólar canadiense (CAD)', area: '9,984,670 km²', gdp: '~2.14 billones USD', demonym: 'Canadiense', timezone: 'UTC−3.5/−8' },
  'Chile': { capital: 'Santiago', languages: 'Español', currency: 'Peso chileno (CLP)', area: '756,102 km²', gdp: '~317 mil millones USD', demonym: 'Chileno/a', timezone: 'UTC−3/−4' },
  'China': { capital: 'Pekín', languages: 'Mandarín', currency: 'Yuan renminbi (CNY)', area: '9,596,960 km²', gdp: '~17.7 billones USD', demonym: 'Chino/a', timezone: 'UTC+8' },
  'Colombia': { capital: 'Bogotá', languages: 'Español', currency: 'Peso colombiano (COP)', area: '1,141,748 km²', gdp: '~343 mil millones USD', demonym: 'Colombiano/a', timezone: 'UTC−5' },
  'Republic of the Congo': { capital: 'Brazzaville', languages: 'Francés', currency: 'Franco CFA (XAF)', area: '342,000 km²', gdp: '~15 mil millones USD', demonym: 'Congoleño/a', timezone: 'UTC+1' },
  'Democratic Republic of the Congo': { capital: 'Kinshasa', languages: 'Francés, Suajili, Lingala', currency: 'Franco congoleño (CDF)', area: '2,344,858 km²', gdp: '~66 mil millones USD', demonym: 'Congoleño/a', timezone: 'UTC+1/+2' },
  'Costa Rica': { capital: 'San José', languages: 'Español', currency: 'Colón costarricense (CRC)', area: '51,100 km²', gdp: '~68 mil millones USD', demonym: 'Costarricense', timezone: 'UTC−6' },
  'Cuba': { capital: 'La Habana', languages: 'Español', currency: 'Peso cubano (CUP)', area: '109,884 km²', gdp: '~107 mil millones USD', demonym: 'Cubano/a', timezone: 'UTC−5' },
  'Czech Republic': { capital: 'Praga', languages: 'Checo', currency: 'Corona checa (CZK)', area: '78,866 km²', gdp: '~290 mil millones USD', demonym: 'Checo/a', timezone: 'UTC+1/+2' },
  'Denmark': { capital: 'Copenhague', languages: 'Danés', currency: 'Corona danesa (DKK)', area: '43,094 km²', gdp: '~395 mil millones USD', demonym: 'Danés/a', timezone: 'UTC+1/+2' },
  'Dominican Republic': { capital: 'Santo Domingo', languages: 'Español', currency: 'Peso dominicano (DOP)', area: '48,671 km²', gdp: '~94 mil millones USD', demonym: 'Dominicano/a', timezone: 'UTC−4' },
  'Ecuador': { capital: 'Quito', languages: 'Español', currency: 'Dólar estadounidense (USD)', area: '283,561 km²', gdp: '~115 mil millones USD', demonym: 'Ecuatoriano/a', timezone: 'UTC−5' },
  'Egypt': { capital: 'El Cairo', languages: 'Árabe', currency: 'Libra egipcia (EGP)', area: '1,001,450 km²', gdp: '~389 mil millones USD', demonym: 'Egipcio/a', timezone: 'UTC+2' },
  'El Salvador': { capital: 'San Salvador', languages: 'Español', currency: 'Dólar estadounidense (USD)', area: '21,041 km²', gdp: '~32 mil millones USD', demonym: 'Salvadoreño/a', timezone: 'UTC−6' },
  'Ethiopia': { capital: 'Adís Abeba', languages: 'Amhárico', currency: 'Birr etíope (ETB)', area: '1,104,300 km²', gdp: '~126 mil millones USD', demonym: 'Etíope', timezone: 'UTC+3' },
  'Finland': { capital: 'Helsinki', languages: 'Finés, Sueco', currency: 'Euro (EUR)', area: '338,145 km²', gdp: '~303 mil millones USD', demonym: 'Finlandés/a', timezone: 'UTC+2/+3' },
  'France': { capital: 'París', languages: 'Francés', currency: 'Euro (EUR)', area: '551,695 km²', gdp: '~2.94 billones USD', demonym: 'Francés/a', timezone: 'UTC+1/+2' },
  'Germany': { capital: 'Berlín', languages: 'Alemán', currency: 'Euro (EUR)', area: '357,114 km²', gdp: '~4.07 billones USD', demonym: 'Alemán/a', timezone: 'UTC+1/+2' },
  'Ghana': { capital: 'Acra', languages: 'Inglés', currency: 'Cedi ghanés (GHS)', area: '238,533 km²', gdp: '~77 mil millones USD', demonym: 'Ghanés/a', timezone: 'UTC+0' },
  'Greece': { capital: 'Atenas', languages: 'Griego', currency: 'Euro (EUR)', area: '131,957 km²', gdp: '~218 mil millones USD', demonym: 'Griego/a', timezone: 'UTC+2/+3' },
  'Guatemala': { capital: 'Ciudad de Guatemala', languages: 'Español', currency: 'Quetzal (GTQ)', area: '108,889 km²', gdp: '~89 mil millones USD', demonym: 'Guatemalteco/a', timezone: 'UTC−6' },
  'Honduras': { capital: 'Tegucigalpa', languages: 'Español', currency: 'Lempira (HNL)', area: '112,492 km²', gdp: '~33 mil millones USD', demonym: 'Hondureño/a', timezone: 'UTC−6' },
  'Hungary': { capital: 'Budapest', languages: 'Húngaro', currency: 'Forinto (HUF)', area: '93,028 km²', gdp: '~187 mil millones USD', demonym: 'Húngaro/a', timezone: 'UTC+1/+2' },
  'India': { capital: 'Nueva Delhi', languages: 'Hindi, Inglés', currency: 'Rupia india (INR)', area: '3,287,263 km²', gdp: '~3.73 billones USD', demonym: 'Indio/a', timezone: 'UTC+5:30' },
  'Indonesia': { capital: 'Yakarta', languages: 'Indonesio', currency: 'Rupia indonesia (IDR)', area: '1,904,569 km²', gdp: '~1.42 billones USD', demonym: 'Indonesio/a', timezone: 'UTC+7/+9' },
  'Iran': { capital: 'Teherán', languages: 'Persa', currency: 'Rial iraní (IRR)', area: '1,648,195 km²', gdp: '~366 mil millones USD', demonym: 'Iraní', timezone: 'UTC+3:30' },
  'Iraq': { capital: 'Bagdad', languages: 'Árabe, Kurdo', currency: 'Dinar iraquí (IQD)', area: '438,317 km²', gdp: '~265 mil millones USD', demonym: 'Iraquí', timezone: 'UTC+3' },
  'Ireland': { capital: 'Dublín', languages: 'Inglés, Irlandés', currency: 'Euro (EUR)', area: '70,273 km²', gdp: '~533 mil millones USD', demonym: 'Irlandés/a', timezone: 'UTC+0/+1' },
  'Israel': { capital: 'Jerusalén', languages: 'Hebreo, Árabe', currency: 'Séquel nuevo (ILS)', area: '20,770 km²', gdp: '~480 mil millones USD', demonym: 'Israelí', timezone: 'UTC+2/+3' },
  'Italy': { capital: 'Roma', languages: 'Italiano', currency: 'Euro (EUR)', area: '301,340 km²', gdp: '~2.10 billones USD', demonym: 'Italiano/a', timezone: 'UTC+1/+2' },
  'Japan': { capital: 'Tokio', languages: 'Japonés', currency: 'Yen (JPY)', area: '377,975 km²', gdp: '~4.23 billones USD', demonym: 'Japonés/a', timezone: 'UTC+9' },
  'Jordan': { capital: 'Amán', languages: 'Árabe', currency: 'Dinar jordano (JOD)', area: '89,342 km²', gdp: '~46 mil millones USD', demonym: 'Jordano/a', timezone: 'UTC+3' },
  'Kazakhstan': { capital: 'Astana', languages: 'Kazajo, Ruso', currency: 'Tenge (KZT)', area: '2,724,900 km²', gdp: '~225 mil millones USD', demonym: 'Kazajo/a', timezone: 'UTC+5/+6' },
  'Kenya': { capital: 'Nairobi', languages: 'Suajili, Inglés', currency: 'Chelín keniano (KES)', area: '580,367 km²', gdp: '~110 mil millones USD', demonym: 'Keniano/a', timezone: 'UTC+3' },
  'Libya': { capital: 'Trípoli', languages: 'Árabe', currency: 'Dinar libio (LYD)', area: '1,759,541 km²', gdp: '~37 mil millones USD', demonym: 'Libio/a', timezone: 'UTC+2' },
  'Madagascar': { capital: 'Antananarivo', languages: 'Malgache, Francés', currency: 'Ariary (MGA)', area: '587,041 km²', gdp: '~15 mil millones USD', demonym: 'Malgache', timezone: 'UTC+3' },
  'Malaysia': { capital: 'Kuala Lumpur', languages: 'Malayo', currency: 'Ringgit (MYR)', area: '329,847 km²', gdp: '~415 mil millones USD', demonym: 'Malayo/a', timezone: 'UTC+8' },
  'Mali': { capital: 'Bamako', languages: 'Francés', currency: 'Franco CFA (XOF)', area: '1,240,192 km²', gdp: '~18 mil millones USD', demonym: 'Maliense', timezone: 'UTC+0' },
  'Mexico': { capital: 'Ciudad de México', languages: 'Español', currency: 'Peso mexicano (MXN)', area: '1,964,375 km²', gdp: '~1.32 billones USD', demonym: 'Mexicano/a', timezone: 'UTC−6/−8' },
  'Mongolia': { capital: 'Ulán Bator', languages: 'Mongol', currency: 'Tögrög (MNT)', area: '1,564,116 km²', gdp: '~16 mil millones USD', demonym: 'Mongol', timezone: 'UTC+7/+8' },
  'Morocco': { capital: 'Rabat', languages: 'Árabe, Bereber', currency: 'Dírham marroquí (MAD)', area: '446,550 km²', gdp: '~142 mil millones USD', demonym: 'Marroquí', timezone: 'UTC+1' },
  'Mozambique': { capital: 'Maputo', languages: 'Portugués', currency: 'Metical (MZN)', area: '801,590 km²', gdp: '~17 mil millones USD', demonym: 'Mozambiqueño/a', timezone: 'UTC+2' },
  'Myanmar': { capital: 'Naipyidó', languages: 'Birmano', currency: 'Kyat (MMK)', area: '676,578 km²', gdp: '~65 mil millones USD', demonym: 'Birmano/a', timezone: 'UTC+6:30' },
  'Nepal': { capital: 'Katmandú', languages: 'Nepalés', currency: 'Rupia nepalesa (NPR)', area: '147,181 km²', gdp: '~36 mil millones USD', demonym: 'Nepalés/a', timezone: 'UTC+5:45' },
  'Netherlands': { capital: 'Ámsterdam', languages: 'Neerlandés', currency: 'Euro (EUR)', area: '41,543 km²', gdp: '~1.01 billones USD', demonym: 'Neerlandés/a', timezone: 'UTC+1/+2' },
  'New Zealand': { capital: 'Wellington', languages: 'Inglés, Maorí', currency: 'Dólar neozelandés (NZD)', area: '268,021 km²', gdp: '~247 mil millones USD', demonym: 'Neozelandés/a', timezone: 'UTC+12/+13' },
  'Nicaragua': { capital: 'Managua', languages: 'Español', currency: 'Córdoba (NIO)', area: '130,375 km²', gdp: '~16 mil millones USD', demonym: 'Nicaragüense', timezone: 'UTC−6' },
  'Niger': { capital: 'Niamey', languages: 'Francés', currency: 'Franco CFA (XOF)', area: '1,267,000 km²', gdp: '~14 mil millones USD', demonym: 'Nigerino/a', timezone: 'UTC+1' },
  'Nigeria': { capital: 'Abuja', languages: 'Inglés', currency: 'Naira (NGN)', area: '923,768 km²', gdp: '~473 mil millones USD', demonym: 'Nigeriano/a', timezone: 'UTC+1' },
  'North Korea': { capital: 'Pyongyang', languages: 'Coreano', currency: 'Won norcoreano (KPW)', area: '120,538 km²', gdp: '~28 mil millones USD', demonym: 'Norcoreano/a', timezone: 'UTC+9' },
  'Norway': { capital: 'Oslo', languages: 'Noruego', currency: 'Corona noruega (NOK)', area: '385,207 km²', gdp: '~579 mil millones USD', demonym: 'Noruego/a', timezone: 'UTC+1/+2' },
  'Pakistan': { capital: 'Islamabad', languages: 'Urdu, Inglés', currency: 'Rupia pakistaní (PKR)', area: '881,913 km²', gdp: '~376 mil millones USD', demonym: 'Pakistaní', timezone: 'UTC+5' },
  'Panama': { capital: 'Ciudad de Panamá', languages: 'Español', currency: 'Balboa / Dólar USD', area: '75,417 km²', gdp: '~71 mil millones USD', demonym: 'Panameño/a', timezone: 'UTC−5' },
  'Paraguay': { capital: 'Asunción', languages: 'Español, Guaraní', currency: 'Guaraní (PYG)', area: '406,752 km²', gdp: '~43 mil millones USD', demonym: 'Paraguayo/a', timezone: 'UTC−4' },
  'Peru': { capital: 'Lima', languages: 'Español, Quechua', currency: 'Sol (PEN)', area: '1,285,216 km²', gdp: '~242 mil millones USD', demonym: 'Peruano/a', timezone: 'UTC−5' },
  'Philippines': { capital: 'Manila', languages: 'Filipino, Inglés', currency: 'Peso filipino (PHP)', area: '300,000 km²', gdp: '~404 mil millones USD', demonym: 'Filipino/a', timezone: 'UTC+8' },
  'Poland': { capital: 'Varsovia', languages: 'Polaco', currency: 'Esloti (PLN)', area: '312,679 km²', gdp: '~748 mil millones USD', demonym: 'Polaco/a', timezone: 'UTC+1/+2' },
  'Portugal': { capital: 'Lisboa', languages: 'Portugués', currency: 'Euro (EUR)', area: '92,212 km²', gdp: '~255 mil millones USD', demonym: 'Portugués/a', timezone: 'UTC+0/+1' },
  'Romania': { capital: 'Bucarest', languages: 'Rumano', currency: 'Leu (RON)', area: '238,397 km²', gdp: '~284 mil millones USD', demonym: 'Rumano/a', timezone: 'UTC+2/+3' },
  'Russia': { capital: 'Moscú', languages: 'Ruso', currency: 'Rublo (RUB)', area: '17,098,242 km²', gdp: '~1.86 billones USD', demonym: 'Ruso/a', timezone: 'UTC+2/+12' },
  'Saudi Arabia': { capital: 'Riad', languages: 'Árabe', currency: 'Riyal saudí (SAR)', area: '2,149,690 km²', gdp: '~1.06 billones USD', demonym: 'Saudí', timezone: 'UTC+3' },
  'Senegal': { capital: 'Dakar', languages: 'Francés', currency: 'Franco CFA (XOF)', area: '196,722 km²', gdp: '~28 mil millones USD', demonym: 'Senegalés/a', timezone: 'UTC+0' },
  'Somalia': { capital: 'Mogadiscio', languages: 'Somalí, Árabe', currency: 'Chelín somalí (SOS)', area: '637,657 km²', gdp: '~8 mil millones USD', demonym: 'Somalí', timezone: 'UTC+3' },
  'South Africa': { capital: 'Pretoria', languages: 'Zulú, Xhosa, Afrikáans, Inglés', currency: 'Rand (ZAR)', area: '1,219,090 km²', gdp: '~400 mil millones USD', demonym: 'Sudafricano/a', timezone: 'UTC+2' },
  'South Korea': { capital: 'Seúl', languages: 'Coreano', currency: 'Won (KRW)', area: '100,210 km²', gdp: '~1.71 billones USD', demonym: 'Surcoreano/a', timezone: 'UTC+9' },
  'South Sudan': { capital: 'Yuba', languages: 'Inglés', currency: 'Libra sursudanesa (SSP)', area: '644,329 km²', gdp: '~5 mil millones USD', demonym: 'Sursudanés/a', timezone: 'UTC+3' },
  'Spain': { capital: 'Madrid', languages: 'Español', currency: 'Euro (EUR)', area: '505,990 km²', gdp: '~1.58 billones USD', demonym: 'Español/a', timezone: 'UTC+1/+2' },
  'Sudan': { capital: 'Jartum', languages: 'Árabe, Inglés', currency: 'Libra sudanesa (SDG)', area: '1,861,484 km²', gdp: '~35 mil millones USD', demonym: 'Sudanés/a', timezone: 'UTC+3' },
  'Sweden': { capital: 'Estocolmo', languages: 'Sueco', currency: 'Corona sueca (SEK)', area: '450,295 km²', gdp: '~593 mil millones USD', demonym: 'Sueco/a', timezone: 'UTC+1/+2' },
  'Switzerland': { capital: 'Berna', languages: 'Alemán, Francés, Italiano', currency: 'Franco suizo (CHF)', area: '41,285 km²', gdp: '~869 mil millones USD', demonym: 'Suizo/a', timezone: 'UTC+1/+2' },
  'Syria': { capital: 'Damasco', languages: 'Árabe', currency: 'Libra siria (SYP)', area: '185,180 km²', gdp: '~22 mil millones USD', demonym: 'Sirio/a', timezone: 'UTC+3' },
  'United Republic of Tanzania': { capital: 'Dodoma', languages: 'Suajili, Inglés', currency: 'Chelín tanzano (TZS)', area: '945,087 km²', gdp: '~75 mil millones USD', demonym: 'Tanzano/a', timezone: 'UTC+3' },
  'Thailand': { capital: 'Bangkok', languages: 'Tailandés', currency: 'Baht (THB)', area: '513,120 km²', gdp: '~545 mil millones USD', demonym: 'Tailandés/a', timezone: 'UTC+7' },
  'Turkey': { capital: 'Ankara', languages: 'Turco', currency: 'Lira turca (TRY)', area: '783,562 km²', gdp: '~1.03 billones USD', demonym: 'Turco/a', timezone: 'UTC+3' },
  'Turkmenistan': { capital: 'Asjabad', languages: 'Turcomano', currency: 'Manat (TMT)', area: '488,100 km²', gdp: '~48 mil millones USD', demonym: 'Turcomano/a', timezone: 'UTC+5' },
  'Uganda': { capital: 'Kampala', languages: 'Inglés, Suajili', currency: 'Chelín ugandés (UGX)', area: '241,038 km²', gdp: '~49 mil millones USD', demonym: 'Ugandés/a', timezone: 'UTC+3' },
  'Ukraine': { capital: 'Kiev', languages: 'Ucraniano', currency: 'Grivna (UAH)', area: '603,550 km²', gdp: '~160 mil millones USD', demonym: 'Ucraniano/a', timezone: 'UTC+2/+3' },
  'United Arab Emirates': { capital: 'Abu Dabi', languages: 'Árabe', currency: 'Dírham emiratí (AED)', area: '83,600 km²', gdp: '~507 mil millones USD', demonym: 'Emiratí', timezone: 'UTC+4' },
  'England': { capital: 'Londres', languages: 'Inglés', currency: 'Libra esterlina (GBP)', area: '243,610 km²', gdp: '~3.07 billones USD', demonym: 'Británico/a', timezone: 'UTC+0/+1' },
  'USA': { capital: 'Washington D.C.', languages: 'Inglés', currency: 'Dólar estadounidense (USD)', area: '9,833,517 km²', gdp: '~27.4 billones USD', demonym: 'Estadounidense', timezone: 'UTC−5/−10' },
  'Uruguay': { capital: 'Montevideo', languages: 'Español', currency: 'Peso uruguayo (UYU)', area: '176,215 km²', gdp: '~74 mil millones USD', demonym: 'Uruguayo/a', timezone: 'UTC−3' },
  'Uzbekistan': { capital: 'Taskent', languages: 'Uzbeko', currency: 'Som uzbeko (UZS)', area: '448,978 km²', gdp: '~90 mil millones USD', demonym: 'Uzbeko/a', timezone: 'UTC+5' },
  'Venezuela': { capital: 'Caracas', languages: 'Español', currency: 'Bolívar venezolano (VES)', area: '916,445 km²', gdp: '~95 mil millones USD', demonym: 'Venezolano/a', timezone: 'UTC−4' },
  'Vietnam': { capital: 'Hanói', languages: 'Vietnamita', currency: 'Dong (VND)', area: '331,212 km²', gdp: '~449 mil millones USD', demonym: 'Vietnamita', timezone: 'UTC+7' },
  'Yemen': { capital: 'Saná', languages: 'Árabe', currency: 'Rial yemení (YER)', area: '527,968 km²', gdp: '~21 mil millones USD', demonym: 'Yemení', timezone: 'UTC+3' },
  'Zambia': { capital: 'Lusaka', languages: 'Inglés', currency: 'Kwacha (ZMW)', area: '752,618 km²', gdp: '~29 mil millones USD', demonym: 'Zambiano/a', timezone: 'UTC+2' },
  'Zimbabwe': { capital: 'Harare', languages: 'Inglés, Shona, Ndebele', currency: 'Dólar zimbabuense (ZWL)', area: '390,757 km²', gdp: '~24 mil millones USD', demonym: 'Zimbabuense', timezone: 'UTC+2' },
};

// Alternate names (from AI props) → exact GeoJSON feature names
const COUNTRY_ALIASES: Record<string, string> = {
  'united states of america': 'USA',
  'united states': 'USA',
  'estados unidos': 'USA',
  'us': 'USA',
  'u.s.': 'USA',
  'u.s.a.': 'USA',
  'tanzania': 'United Republic of Tanzania',
  'united kingdom': 'England',
  'great britain': 'England',
  'uk': 'England',
  'britain': 'England',
  'reino unido': 'England',
  'dr congo': 'Democratic Republic of the Congo',
  'drc': 'Democratic Republic of the Congo',
  'congo dr': 'Democratic Republic of the Congo',
  'congo, dem. rep.': 'Democratic Republic of the Congo',
  'congo': 'Republic of the Congo',
  'republic of congo': 'Republic of the Congo',
};

function formatPop(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + ' mil millones';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' millones';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + ' mil';
  return n.toString();
}

// Compute lon/lat center of a country. Returns geoName (exact GeoJSON name) alongside coords.
function computeCountryCenter(countryName: string, geoData: any): { lon: number; lat: number; geoName: string } | null {
  if (!geoData || !countryName) return null;
  const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  // Resolve alias first (e.g. "United States of America" → "USA")
  const resolved = COUNTRY_ALIASES[norm(countryName)] ?? countryName;
  const target = norm(resolved);
  const feature = geoData.features.find((f: any) =>
    norm(f.properties?.name || '') === target ||
    norm(f.properties?.formal_en || '') === target
  );
  if (!feature) return null;
  const geoName: string = feature.properties.name;
  let coords = feature.geometry.type === 'Polygon'
    ? feature.geometry.coordinates[0]
    : feature.geometry.coordinates[0][0];
  if (Array.isArray(coords[0]) && Array.isArray(coords[0][0])) coords = coords[0];
  let avgLon = 0, avgLat = 0;
  const n = Math.min(coords.length, 50);
  for (let i = 0; i < n; i++) { avgLon += coords[i][0]; avgLat += coords[i][1]; }
  return { lon: avgLon / n, lat: avgLat / n, geoName };
}

let CACHED_GEO_DATA: any = null;
let DATA_PROMISE: Promise<any> | null = null;

const GlobeArtifact: React.FC<GlobeArtifactProps> = ({ highlightCountry, highlightContinent, topic }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const [geoData, setGeoData] = useState<any>(CACHED_GEO_DATA);

  // Initialize rotation/zoom centered on the highlight country if data is already cached
  const [rotLon, setRotLon] = useState(() => {
    if (highlightCountry && CACHED_GEO_DATA) {
      const c = computeCountryCenter(highlightCountry, CACHED_GEO_DATA);
      if (c) return c.lon;
    }
    return -90;
  });
  const [rotLat, setRotLat] = useState(() => {
    if (highlightCountry && CACHED_GEO_DATA) {
      const c = computeCountryCenter(highlightCountry, CACHED_GEO_DATA);
      if (c) return c.lat;
    }
    return 20;
  });
  const [scale, setScale] = useState(() => (highlightCountry && CACHED_GEO_DATA ? 220 : 180));
  const [dragging, setDragging] = useState(false);
  const [dragOrigin, setDragOrigin] = useState({ x: 0, y: 0, lon: 0, lat: 0 });
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(() => {
    if (highlightCountry && CACHED_GEO_DATA) {
      const c = computeCountryCenter(highlightCountry, CACHED_GEO_DATA);
      return c ? c.geoName : null;
    }
    return null;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(!CACHED_GEO_DATA);
  const [error, setError] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState(() => !(highlightCountry && CACHED_GEO_DATA));
  const canvasSize = 420;

  // ── Data loading ──────────────────────────────────────────────
  const loadData = useCallback(() => {
    let mounted = true;
    setError(false);
    if (CACHED_GEO_DATA) { setGeoData(CACHED_GEO_DATA); setLoading(false); return; }
    if (!DATA_PROMISE) {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 20000);
      DATA_PROMISE = fetch(
        'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson',
        { signal: ctrl.signal }
      ).then(r => r.json()).then(data => { clearTimeout(tid); CACHED_GEO_DATA = data; return data; })
       .catch(err => { clearTimeout(tid); DATA_PROMISE = null; throw err; });
    }
    setLoading(true);
    DATA_PROMISE.then(data => { if (mounted) { setGeoData(data); setLoading(false); } })
      .catch(() => { if (mounted) { setLoading(false); setError(true); DATA_PROMISE = null; } });
    return () => { mounted = false; };
  }, []);

  useEffect(() => { return loadData(); }, [loadData]);

  // ── Center on country/continent ───────────────────────────────
  const centerOn = useCallback((countryName: string, targetScale?: number) => {
    if (!geoData || !countryName) return;
    const c = computeCountryCenter(countryName, geoData);
    if (!c) return;
    setRotLon(c.lon);
    setRotLat(c.lat);
    if (targetScale) setScale(targetScale);
    setAutoRotate(false);
  }, [geoData]);

  const centerOnContinent = useCallback((continent: string) => {
    const c = CONTINENT_CENTERS[continent];
    if (!c) return;
    setRotLon(c.lon);
    setRotLat(c.lat);
    setScale(c.zoom);
    setAutoRotate(false);
    setSelectedCountry(null);
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  // ── Auto-center on prop (runs when data loads asynchronously) ─
  useEffect(() => {
    if (highlightCountry && geoData) {
      const result = computeCountryCenter(highlightCountry, geoData);
      if (result) {
        setRotLon(result.lon);
        setRotLat(result.lat);
        setScale(220);
        setAutoRotate(false);
        setSelectedCountry(result.geoName);
      }
    }
  }, [highlightCountry, geoData]);

  // ── Auto-rotate ───────────────────────────────────────────────
  useEffect(() => {
    if (!autoRotate) { cancelAnimationFrame(animFrameRef.current); return; }
    const tick = () => { setRotLon(p => p - 0.15); animFrameRef.current = requestAnimationFrame(tick); };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [autoRotate]);

  // ── Canvas render ─────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !geoData) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    ctx.clearRect(0, 0, W, H);

    const grad = ctx.createRadialGradient(cx - scale * 0.2, cy - scale * 0.2, 0, cx, cy, scale);
    grad.addColorStop(0, '#1e3a5f');
    grad.addColorStop(1, '#0f172a');
    ctx.beginPath(); ctx.arc(cx, cy, scale, 0, Math.PI * 2);
    ctx.fillStyle = grad; ctx.fill();
    ctx.strokeStyle = 'rgba(99,102,241,0.4)'; ctx.lineWidth = 2; ctx.stroke();

    if (!geoData?.features) return;

    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 0.5;
    for (let lon = -180; lon <= 180; lon += 30) {
      ctx.beginPath(); let f = true;
      for (let lat = -90; lat <= 90; lat += 2) {
        const pt = orthographicProject(lon, lat, rotLon, rotLat, scale, cx, cy);
        if (!pt) { f = true; continue; }
        f ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y); f = false;
      }
      ctx.stroke();
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath(); let f = true;
      for (let lon = -180; lon <= 181; lon += 2) {
        const pt = orthographicProject(lon, lat, rotLon, rotLat, scale, cx, cy);
        if (!pt) { f = true; continue; }
        f ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y); f = false;
      }
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1;
    ctx.beginPath(); let eq = true;
    for (let lon = -180; lon <= 181; lon += 1) {
      const pt = orthographicProject(lon, 0, rotLon, rotLat, scale, cx, cy);
      if (!pt) { eq = true; continue; }
      eq ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y); eq = false;
    }
    ctx.stroke();

    for (const feature of geoData.features) {
      const name: string = feature.properties?.name || '';
      const continent: string = feature.properties?.continent || 'default';
      const isSelected = selectedCountry?.toLowerCase() === name.toLowerCase();
      const isHovered = hoveredCountry?.toLowerCase() === name.toLowerCase();
      const isContHighlight = highlightContinent && continent === highlightContinent;
      const baseColor = CONTINENT_COLORS[continent] || CONTINENT_COLORS['default'];
      const polys: number[][][][] =
        feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;

      for (const poly of polys) {
        const visible = drawGeoPolygon(ctx, poly, rotLon, rotLat, scale, cx, cy);
        if (!visible) continue;
        if (isSelected) {
          ctx.fillStyle = '#f59e0b'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5;
        } else if (isHovered) {
          ctx.fillStyle = baseColor + 'dd'; ctx.strokeStyle = '#ffffff88'; ctx.lineWidth = 1;
        } else if (isContHighlight) {
          ctx.fillStyle = baseColor + 'aa'; ctx.strokeStyle = '#ffffff44'; ctx.lineWidth = 0.5;
        } else {
          ctx.fillStyle = baseColor + '55'; ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 0.4;
        }
        ctx.fill(); ctx.stroke();
      }
    }

    if (selectedCountry) {
      const feat = geoData.features.find((f: any) => f.properties?.name?.toLowerCase() === selectedCountry.toLowerCase());
      if (feat) {
        const geom = feat.geometry;
        const fc: number[][] = geom.type === 'Polygon' ? geom.coordinates[0] : geom.coordinates[0][0];
        const mid = Math.floor(fc.length / 2);
        const pt = orthographicProject(fc[mid][0], fc[mid][1], rotLon, rotLat, scale, cx, cy);
        if (pt) {
          ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 13px Inter, sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.shadowColor = '#000'; ctx.shadowBlur = 6;
          ctx.fillText(selectedCountry, pt.x, pt.y - 14); ctx.shadowBlur = 0;
          ctx.beginPath(); ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b'; ctx.fill();
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
        }
      }
    }
  }, [geoData, rotLon, rotLat, scale, hoveredCountry, selectedCountry, highlightContinent]);

  // ── Coordinate helper (CSS px → canvas logical px) ────────────
  const toCanvas = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  }, []);

  // ── Unproject canvas position → lon/lat ───────────────────────
  const unproject = useCallback((mx: number, my: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const dx = mx - cx, dy = my - cy;
    if (dx * dx + dy * dy > scale * scale) return null;
    const x = dx / scale, y = -dy / scale;
    const z2 = 1 - x * x - y * y;
    if (z2 < 0) return null;
    const z = Math.sqrt(z2);
    const φ0 = toRad(rotLat);
    const lat = Math.asin(y * Math.cos(φ0) + z * Math.sin(φ0)) * 180 / Math.PI;
    const lon = rotLon + Math.atan2(x, z * Math.cos(φ0) - y * Math.sin(φ0)) * 180 / Math.PI;
    return { lon, lat };
  }, [rotLon, rotLat, scale]);

  // ── Mouse drag to rotate ──────────────────────────────────────
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setAutoRotate(false);
    setDragging(true);
    setDragOrigin({ x: e.clientX, y: e.clientY, lon: rotLon, lat: rotLat });
  }, [rotLon, rotLat]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragging) {
      const dx = e.clientX - dragOrigin.x;
      const dy = e.clientY - dragOrigin.y;
      setRotLon(dragOrigin.lon - dx * 0.4);
      setRotLat(Math.max(-90, Math.min(90, dragOrigin.lat + dy * 0.4)));
      return;
    }
    if (!geoData) return;
    const { x, y } = toCanvas(e.clientX, e.clientY);
    const pos = unproject(x, y);
    if (!pos) { setHoveredCountry(null); return; }
    const found = geoData.features.find((f: any) => isPointInCountry(pos.lon, pos.lat, f));
    setHoveredCountry(found?.properties?.name || null);
  }, [dragging, dragOrigin, geoData, toCanvas, unproject]);

  const handleMouseUp = useCallback(() => setDragging(false), []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Ignore tiny drags misidentified as clicks
    if (Math.abs(e.clientX - dragOrigin.x) > 5 || Math.abs(e.clientY - dragOrigin.y) > 5) return;
    if (!geoData) return;
    const { x, y } = toCanvas(e.clientX, e.clientY);
    const pos = unproject(x, y);
    if (!pos) return;
    const found = geoData.features.find((f: any) => isPointInCountry(pos.lon, pos.lat, f));
    if (found) {
      setSelectedCountry(found.properties.name);
    }
  }, [geoData, toCanvas, unproject, dragOrigin]);

  // ── Scroll to zoom ────────────────────────────────────────────
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale(p => Math.max(100, Math.min(400, p - e.deltaY * 0.3)));
  }, []);

  // ── Touch drag to rotate ──────────────────────────────────────
  const touchStart = useRef<{ x: number; y: number; lon: number; lat: number } | null>(null);
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setAutoRotate(false);
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStart.current = { dist: Math.hypot(dx, dy), scale };
      touchStart.current = null;
    } else {
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY, lon: rotLon, lat: rotLat };
      pinchStart.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStart.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / pinchStart.current.dist;
      setScale(Math.max(100, Math.min(400, pinchStart.current.scale * ratio)));
      return;
    }
    if (!touchStart.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    setRotLon(touchStart.current.lon - dx * 0.4);
    setRotLat(Math.max(-90, Math.min(90, touchStart.current.lat + dy * 0.4)));
  };

  // ── Search with autocomplete ──────────────────────────────────
  const handleSearchInput = (q: string) => {
    setSearchQuery(q);
    if (!q || !geoData) { setSearchResults([]); return; }
    const norm = q.toLowerCase();
    const matches = geoData.features
      .filter((f: any) => f.properties?.name?.toLowerCase().includes(norm))
      .map((f: any) => f.properties.name as string)
      .slice(0, 6);
    setSearchResults(matches);
  };

  const selectSearchResult = (name: string) => {
    setSearchQuery(name);
    setSearchResults([]);
    setSelectedCountry(name);
    centerOn(name, 230);
  };

  // Normalize rotLon to [-180, 180] for slider display
  const displayLon = ((rotLon % 360) + 540) % 360 - 180;

  // ── Country data for panel ────────────────────────────────────
  const selectedInfo = geoData?.features?.find(
    (f: any) => f.properties?.name?.toLowerCase() === selectedCountry?.toLowerCase()
  );
  const geoProps = selectedInfo?.properties || {};
  const extraInfo = selectedCountry ? COUNTRY_INFO[selectedCountry] : undefined;

  return (
    <div className="bg-slate-950 rounded-3xl border border-white/10 overflow-hidden shadow-2xl my-4">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-slate-900/50">
        <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Globe className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h3 className="font-black text-white text-sm uppercase tracking-tighter">Globo Terráqueo Interactivo</h3>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
            {topic || 'Arrastra para rotar · Scroll para zoom · Clic en un país'}
          </p>
        </div>
        <button
          onClick={() => setAutoRotate(v => !v)}
          className={`ml-auto px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
            autoRotate ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/10 text-white/40'
          }`}
        >
          {autoRotate ? '⟳ Girando' : '⏸ Pausado'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Canvas */}
        <div className="relative flex-1 min-h-[350px] bg-slate-900/50 flex items-center justify-center">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 z-20 backdrop-blur-sm">
              <Loader2 className="h-10 w-10 text-blue-400 animate-spin mb-3" />
              <p className="text-xs font-black text-white uppercase tracking-[0.2em] animate-pulse">Generando Globo 3D...</p>
            </div>
          )}
          {error && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 z-20 p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
              <p className="text-sm font-bold text-white mb-2">No se pudo cargar el mapa</p>
              <p className="text-xs text-slate-400 mb-6 max-w-[200px]">Verifica tu conexión e intenta de nuevo.</p>
              <button
                onClick={() => loadData()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-black uppercase transition-all hover:bg-blue-500/30"
              >
                <RefreshCw className="h-4 w-4" /> Reintentar
              </button>
            </div>
          )}

          {!loading && !error && highlightCountry && !autoRotate && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-slate-950/80 border border-white/10 rounded-full backdrop-blur-md">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Localizando: {highlightCountry}
              </p>
            </div>
          )}

          <canvas
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            className="rounded-2xl"
            style={{ cursor: dragging ? 'grabbing' : hoveredCountry ? 'pointer' : 'grab' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { handleMouseUp(); setHoveredCountry(null); }}
            onClick={handleClick}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => { touchStart.current = null; pinchStart.current = null; }}
          />

          {hoveredCountry && !dragging && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-slate-800/90 border border-white/10 backdrop-blur-sm pointer-events-none">
              <p className="text-white text-xs font-bold">{hoveredCountry}</p>
            </div>
          )}
        </div>

        {/* Panel lateral */}
        <div className="flex-1 p-4 flex flex-col gap-3 min-w-0 max-w-xs">

          {/* Búsqueda con autocomplete */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar país..."
              value={searchQuery}
              onChange={e => handleSearchInput(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 z-30 bg-slate-800 border border-white/10 rounded-xl overflow-hidden shadow-xl">
                {searchResults.map(name => (
                  <button
                    key={name}
                    onClick={() => selectSearchResult(name)}
                    className="w-full text-left px-3 py-2 text-xs text-white/70 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
                  >
                    <MapPin className="h-3 w-3 text-amber-400 flex-shrink-0" />
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Zoom + Reset */}
          <div className="flex gap-2">
            <button onClick={() => setScale(p => Math.min(400, p + 30))}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all text-xs font-black">
              <ZoomIn className="h-3.5 w-3.5" /> +
            </button>
            <button onClick={() => setScale(p => Math.max(100, p - 30))}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all text-xs font-black">
              <ZoomOut className="h-3.5 w-3.5" /> −
            </button>
            <button
              onClick={() => { setRotLon(-90); setRotLat(20); setScale(180); setSelectedCountry(null); setAutoRotate(true); setSearchQuery(''); setSearchResults([]); }}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all"
              title="Resetear vista"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Sliders de posición — sincronizados con drag/touch */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-3">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Posición manual</p>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Latitud</span>
                <span className="text-[10px] font-bold text-white/50">{Math.max(-90, Math.min(90, rotLat)).toFixed(1)}°</span>
              </div>
              <input
                type="range"
                min="-90" max="90" step="0.5"
                value={Math.max(-90, Math.min(90, rotLat))}
                onChange={e => { setRotLat(parseFloat(e.target.value)); setAutoRotate(false); }}
                className="w-full h-1.5 rounded-full appearance-none bg-white/10 accent-blue-500 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Longitud</span>
                <span className="text-[10px] font-bold text-white/50">{displayLon.toFixed(1)}°</span>
              </div>
              <input
                type="range"
                min="-180" max="180" step="1"
                value={displayLon}
                onChange={e => { setRotLon(parseFloat(e.target.value)); setAutoRotate(false); }}
                className="w-full h-1.5 rounded-full appearance-none bg-white/10 accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* País seleccionado — panel de características */}
          {selectedCountry && selectedInfo ? (
            <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  <h4 className="font-black text-white text-sm leading-tight">{selectedCountry}</h4>
                </div>
                <button onClick={() => setSelectedCountry(null)} className="text-white/20 hover:text-white/60 transition-all ml-2 flex-shrink-0">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Continente */}
                {geoProps.continent && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Continente</span>
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: CONTINENT_COLORS[geoProps.continent] }} />
                      <span style={{ color: CONTINENT_COLORS[geoProps.continent] }}>{geoProps.continent}</span>
                    </span>
                  </div>
                )}

                {/* Capital */}
                {extraInfo?.capital && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex-shrink-0">Capital</span>
                    <span className="text-xs font-bold text-white text-right">{extraInfo.capital}</span>
                  </div>
                )}

                {/* Población */}
                {geoProps.pop_est && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Población</span>
                    <span className="text-xs font-bold text-white">{formatPop(Number(geoProps.pop_est))}</span>
                  </div>
                )}

                {/* Idioma */}
                {extraInfo?.languages && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex-shrink-0">Idioma(s)</span>
                    <span className="text-xs font-bold text-white text-right">{extraInfo.languages}</span>
                  </div>
                )}

                {/* Gentilicio */}
                {extraInfo?.demonym && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex-shrink-0">Gentilicio</span>
                    <span className="text-xs font-bold text-white text-right">{extraInfo.demonym}</span>
                  </div>
                )}

                {/* Moneda */}
                {extraInfo?.currency && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex-shrink-0">Moneda</span>
                    <span className="text-xs font-bold text-white text-right">{extraInfo.currency}</span>
                  </div>
                )}

                {/* Extensión territorial */}
                {extraInfo?.area && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex-shrink-0">Extensión</span>
                    <span className="text-xs font-bold text-white text-right">{extraInfo.area}</span>
                  </div>
                )}

                {/* PIB */}
                {extraInfo?.gdp && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex-shrink-0">PIB aprox.</span>
                    <span className="text-xs font-bold text-white text-right">{extraInfo.gdp}</span>
                  </div>
                )}

                {/* Zona horaria */}
                {extraInfo?.timezone && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex-shrink-0">Zona horaria</span>
                    <span className="text-xs font-bold text-white text-right">{extraInfo.timezone}</span>
                  </div>
                )}

                {/* Subregión */}
                {geoProps.subregion && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex-shrink-0">Subregión</span>
                    <span className="text-xs font-bold text-white text-right">{geoProps.subregion}</span>
                  </div>
                )}
              </div>

              {/* Ir al continente */}
              {geoProps.continent && CONTINENT_CENTERS[geoProps.continent] && (
                <button
                  onClick={() => centerOnContinent(geoProps.continent)}
                  className="mt-4 w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border"
                  style={{
                    backgroundColor: CONTINENT_COLORS[geoProps.continent] + '22',
                    borderColor: CONTINENT_COLORS[geoProps.continent] + '44',
                    color: CONTINENT_COLORS[geoProps.continent],
                  }}
                >
                  Ver todo {geoProps.continent}
                </button>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 text-center py-6">
              <Globe className="h-7 w-7 text-white/10" />
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">
                Clic en un país para ver sus características
              </p>
            </div>
          )}

          {/* Leyenda de continentes — clickeable */}
          <div className="space-y-1">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Navegar por continente</p>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(CONTINENT_CENTERS).map(([cont]) => (
                <button
                  key={cont}
                  onClick={() => centerOnContinent(cont)}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 hover:text-white transition-all px-2 py-1.5 rounded-lg hover:bg-white/5 text-left"
                >
                  <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CONTINENT_COLORS[cont] }} />
                  {cont}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobeArtifact;
