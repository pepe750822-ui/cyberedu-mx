import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const ECOEMS_TARGET = new Date('2027-06-15T08:00:00');

const STATS = [
  { value: 2847, suffix: '+', label: 'Estudiantes activos' },
  { value: 90,   suffix: '+', label: 'Videos educativos' },
  { value: 5000, suffix: '+', label: 'Preguntas de práctica' },
  { value: 94,   suffix: '%', label: 'Tasa de aprobación' },
];

const FEATURES = [
  { icon: '🎯', color: 'purple', title: 'Simulador Inteligente',  desc: 'Exámenes con el mismo formato oficial del ECOEMS. Cronometrado, con retroalimentación inmediata y análisis de errores.', tag: 'BioReto Pro v3.0' },
  { icon: '🤖', color: 'cyan',   title: 'Tutor IA 24/7',          desc: 'Pregunta cualquier duda sobre el temario y recibe explicaciones claras al instante. Disponible en cualquier momento.',   tag: '150 tokens incluidos' },
  { icon: '📹', color: 'green',  title: 'Videos estilo anime',     desc: 'Aprende con contenido visual dinámico. Más de 90 videos que hacen que estudiar sea más entretenido y efectivo.',          tag: '90+ videos' },
  { icon: '📊', color: 'amber',  title: 'Área de Subíndices',      desc: 'Calcula tu puntaje estimado y descubre qué preparatorias podrías alcanzar con tu rendimiento actual.',                    tag: 'COMIPEMS 2027' },
  { icon: '📚', color: 'purple', title: 'Acordeón 2027',           desc: 'Resumen completo del temario oficial actualizado. Todo lo que entra en el examen en un solo lugar.',                       tag: 'Temario oficial' },
  { icon: '📱', color: 'cyan',   title: '100% en el celular',      desc: 'Estudia donde quieras. La plataforma funciona perfectamente en cualquier dispositivo sin instalar nada.',                  tag: 'PWA' },
];

const MATERIAS = [
  { emoji: '🔢', name: 'Matemáticas' },
  { emoji: '🔤', name: 'Español' },
  { emoji: '🧪', name: 'Química' },
  { emoji: '⚡', name: 'Física' },
  { emoji: '🌿', name: 'Biología' },
  { emoji: '🌍', name: 'Geografía' },
  { emoji: '📜', name: 'Historia' },
  { emoji: '🏛️', name: 'Cívica y Ética' },
];

const FREE_ITEMS = [
  { t: 'Simulador básico (20 preguntas)', ok: true },
  { t: 'Temario resumido',               ok: true },
  { t: 'Videos introductorios',          ok: true },
  { t: 'Tutor IA',                       ok: false },
  { t: 'Simulador completo',             ok: false },
  { t: 'Acordeón 2027',                  ok: false },
];

const PRO_ITEMS = [
  'Simulador completo (bancos oficiales)',
  '90+ videos estilo anime',
  'Tutor IA — 150 tokens',
  'Acordeón 2027 actualizado',
  'Área de Subíndices COMIPEMS',
  'Acceso de por vida',
];

const p2 = (n: number) => String(n).padStart(2, '0');

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollPct, setScrollPct]     = useState(0);
  const [cd, setCd]                   = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [counts, setCounts]           = useState(STATS.map(() => 0));
  const statsRef                      = useRef<HTMLDivElement>(null);
  const cardRefs                      = useRef<(HTMLDivElement | null)[]>([]);
  const pillRefs                      = useRef<(HTMLDivElement | null)[]>([]);
  const priceRefs                     = useRef<(HTMLDivElement | null)[]>([]);
  const countersStarted               = useRef(false);

  // Scroll progress bar
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      setScrollPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Countdown timer
  useEffect(() => {
    const tick = () => {
      const diff = ECOEMS_TARGET.getTime() - Date.now();
      if (diff <= 0) return;
      setCd({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Animated counters
  const startCounters = useCallback(() => {
    if (countersStarted.current) return;
    countersStarted.current = true;
    STATS.forEach((stat, idx) => {
      const step = stat.value / (2000 / 16);
      let cur = 0;
      const id = setInterval(() => {
        cur += step;
        if (cur >= stat.value) {
          setCounts(p => { const a = [...p]; a[idx] = stat.value; return a; });
          clearInterval(id);
        } else {
          setCounts(p => { const a = [...p]; a[idx] = Math.floor(cur); return a; });
        }
      }, 16);
    });
  }, []);

  // IntersectionObserver for scroll animations
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('lp-vis'); obs.unobserve(e.target); } }),
      { threshold: 0.15 }
    );
    const statsObs = new IntersectionObserver(
      entries => { if (entries[0]?.isIntersecting) { startCounters(); statsObs.disconnect(); } },
      { threshold: 0.3 }
    );
    [...cardRefs.current, ...pillRefs.current, ...priceRefs.current].forEach(el => el && obs.observe(el));
    if (statsRef.current) statsObs.observe(statsRef.current);
    return () => { obs.disconnect(); statsObs.disconnect(); };
  }, [startCounters]);

  return (
    <>
      {/* ── Scroll progress bar ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, height: 3, zIndex: 200, width: `${scrollPct}%`, background: 'linear-gradient(90deg,#7c3aed,#06b6d4)', transition: 'width 0.1s' }} />

      <div className="lp-root">

        {/* ── NAV ── */}
        <nav className="lp-nav">
          <div className="lp-logo">Cyber<span>Edu</span> MX</div>
          <div className="lp-nav-links">
            <a href="#features">Características</a>
            <a href="#materias">Materias</a>
            <a href="#pricing">Precios</a>
            <a href="#pricing" className="lp-nav-cta">Empezar gratis</a>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="lp-hero">
          <div className="lp-hero-bg" />
          <div className="lp-hero-grid" />
          <div className="lp-hero-content">
            <div className="lp-badge">
              <span className="lp-dot" />
              ECOEMS 2027 — Preparación oficial
            </div>

            <h1 className="lp-h1">
              Domina el examen.<br />
              Entra a tu <span className="lp-grad">preparatoria.</span>
            </h1>

            <p className="lp-sub">
              Simuladores inteligentes, temario actualizado y Tutor IA disponible 24/7.{' '}
              Todo lo que necesitas para el <strong style={{ color: '#f9fafb' }}>ECOEMS 2027</strong>.
            </p>

            <div className="lp-actions">
              <button className="lp-btn-pri" onClick={() => navigate('/auth')}>🚀 Empezar gratis</button>
              <a className="lp-btn-sec" href="#features">Ver cómo funciona</a>
            </div>

            <div className="lp-stats" ref={statsRef}>
              {STATS.map((s, i) => (
                <div key={i} className="lp-stat">
                  <div className="lp-stat-num">
                    <span>{counts[i].toLocaleString()}</span>{s.suffix}
                  </div>
                  <div className="lp-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COUNTDOWN ── */}
        <section className="lp-countdown">
          <p className="lp-sec-label">⏳ Cuenta regresiva</p>
          <h2 className="lp-cd-title">
            El <span>ECOEMS 2027</span> se aplica aproximadamente en
          </h2>
          <div className="lp-cd-grid">
            {[
              { v: cd.d,     l: 'Días' },
              { v: p2(cd.h), l: 'Horas' },
              { v: p2(cd.m), l: 'Minutos' },
              { v: p2(cd.s), l: 'Segundos' },
            ].map(({ v, l }) => (
              <div key={l} className="lp-cd-box">
                <span className="lp-cd-num">{v}</span>
                <span className="lp-cd-lbl">{l}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="lp-features">
          <div className="lp-sec-hdr">
            <p className="lp-sec-label">✨ Herramientas</p>
            <h2>Todo para que pases el ECOEMS</h2>
          </div>
          <div className="lp-feat-grid">
            {FEATURES.map((f, i) => (
              <div key={i} ref={el => { cardRefs.current[i] = el; }} className="lp-card" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className={`lp-icon lp-icon-${f.color}`}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <span className="lp-tag">{f.tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── MATERIAS ── */}
        <section id="materias" className="lp-materias">
          <div className="lp-materias-inner">
            <div className="lp-sec-hdr">
              <p className="lp-sec-label">📖 Temario</p>
              <h2>Todas las materias del ECOEMS</h2>
            </div>
            <div className="lp-mat-grid">
              {MATERIAS.map((m, i) => (
                <div key={i} ref={el => { pillRefs.current[i] = el; }} className="lp-pill" style={{ transitionDelay: `${i * 0.05}s` }}>
                  <span className="lp-pill-emoji">{m.emoji}</span>
                  {m.name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="lp-pricing">
          <p className="lp-sec-label">💎 Planes</p>
          <h2>Elige tu plan</h2>
          <p className="lp-pricing-sub">Sin suscripciones. Pago único, acceso completo.</p>
          <div className="lp-price-grid">
            {/* Free */}
            <div ref={el => { priceRefs.current[0] = el; }} className="lp-card" style={{ textAlign: 'left', transitionDelay: '0s' }}>
              <p className="lp-plan-name">Gratis</p>
              <p className="lp-plan-price">$0 <span>MXN</span></p>
              <p className="lp-plan-desc">Para empezar a explorar</p>
              <ul className="lp-plan-list">
                {FREE_ITEMS.map(f => (
                  <li key={f.t} className={f.ok ? '' : 'lp-locked'}>{f.t}</li>
                ))}
              </ul>
              <button className="lp-btn-sec lp-full" onClick={() => navigate('/auth')}>Empezar gratis</button>
            </div>

            {/* Pro */}
            <div ref={el => { priceRefs.current[1] = el; }} className="lp-card lp-card-feat" style={{ textAlign: 'left', transitionDelay: '0.15s' }}>
              <div className="lp-popular">⭐ Más popular</div>
              <p className="lp-plan-name">Pro</p>
              <p className="lp-plan-price">$90 <span>MXN · pago único</span></p>
              <p className="lp-plan-desc">Todo lo que necesitas para pasar</p>
              <ul className="lp-plan-list">
                {PRO_ITEMS.map(f => <li key={f}>{f}</li>)}
              </ul>
              <button className="lp-btn-pri lp-full" onClick={() => navigate('/tokens')}>Obtener acceso Pro</button>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="lp-cta">
          <h2>
            ¿Listo para entrar a tu<br />
            <span>preparatoria soñada?</span>
          </h2>
          <p>Únete a miles de estudiantes que ya se preparan con CyberEdu MX</p>
          <div className="lp-actions">
            <button className="lp-btn-pri lp-lg" onClick={() => navigate('/auth')}>🚀 Empezar ahora</button>
            <a className="lp-btn-sec lp-lg" href="#features">Ver características</a>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="lp-footer">
          <p>
            © 2026 <a href="#">CyberEdu MX</a> — Preparación ECOEMS 2027 ·{' '}
            <a href="#">Privacidad</a> · <a href="#">Contacto</a>
          </p>
        </footer>
      </div>

      {/* ── Global styles scoped to landing ── */}
      <style>{`
        .lp-root {
          background: #0a0e1a;
          color: #f9fafb;
          font-family: 'Segoe UI', system-ui, sans-serif;
          overflow-x: hidden;
        }

        /* NAV */
        .lp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 1rem 2rem;
          display: flex; justify-content: space-between; align-items: center;
          background: rgba(10,14,26,0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(124,58,237,0.2);
        }
        .lp-logo { font-size: 1.25rem; font-weight: 700; color: #7c3aed; letter-spacing: -0.5px; }
        .lp-logo span { color: #06b6d4; }
        .lp-nav-links { display: flex; gap: 0.25rem; }
        .lp-nav-links a {
          color: #9ca3af; text-decoration: none; font-size: 0.9rem;
          padding: 0.4rem 1rem; border-radius: 6px; transition: all 0.2s;
        }
        .lp-nav-links a:hover { color: #f9fafb; background: rgba(124,58,237,0.15); }
        .lp-nav-cta { background: #7c3aed !important; color: white !important; font-weight: 600 !important; }
        .lp-nav-cta:hover { background: #5b21b6 !important; }
        @media (max-width: 640px) { .lp-nav-links { display: none; } }

        /* HERO */
        .lp-hero {
          min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center; text-align: center;
          padding: 6rem 2rem 4rem; position: relative; overflow: hidden;
        }
        .lp-hero-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 30%, rgba(124,58,237,0.15) 0%, transparent 70%),
                      radial-gradient(ellipse 40% 40% at 80% 60%, rgba(6,182,212,0.08) 0%, transparent 60%);
        }
        .lp-hero-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%);
        }
        .lp-hero-content { position: relative; z-index: 1; max-width: 800px; }

        /* Badge */
        .lp-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.3);
          color: #a78bfa; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.05em;
          padding: 0.35rem 1rem; border-radius: 999px; margin-bottom: 2rem;
          animation: lpFadeInDown 0.6s ease both;
        }
        .lp-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #a78bfa;
          animation: lpPulse 2s infinite; display: inline-block;
        }

        /* H1 */
        .lp-h1 {
          font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 800; line-height: 1.1;
          letter-spacing: -2px; margin: 0; animation: lpFadeInUp 0.7s ease 0.1s both;
        }
        .lp-grad {
          background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .lp-sub {
          font-size: 1.15rem; color: #9ca3af; max-width: 560px; margin: 1.5rem auto;
          line-height: 1.7; animation: lpFadeInUp 0.7s ease 0.2s both;
        }

        .lp-actions {
          display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
          margin-top: 2rem; animation: lpFadeInUp 0.7s ease 0.3s both;
        }

        /* STATS */
        .lp-stats {
          display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap;
          margin-top: 4rem; padding-top: 3rem; border-top: 1px solid rgba(255,255,255,0.08);
          animation: lpFadeInUp 0.7s ease 0.4s both;
        }
        .lp-stat { text-align: center; }
        .lp-stat-num { font-size: 2rem; font-weight: 800; }
        .lp-stat-num span { color: #7c3aed; }
        .lp-stat-lbl { font-size: 0.8rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 0.25rem; }
        @media (max-width: 640px) { .lp-stats { gap: 1.5rem; } }

        /* COUNTDOWN */
        .lp-countdown {
          padding: 5rem 2rem; text-align: center;
          background: #111827;
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .lp-sec-label { font-size: 0.8rem; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; margin-bottom: 0.75rem; }
        .lp-cd-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 2.5rem; color: #9ca3af; }
        .lp-cd-title span { color: #f9fafb; }
        .lp-cd-grid { display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; }
        .lp-cd-box {
          background: #1f2937; border: 1px solid rgba(124,58,237,0.2); border-radius: 16px;
          padding: 1.5rem 2rem; min-width: 110px;
        }
        .lp-cd-num { font-size: 3rem; font-weight: 800; color: #7c3aed; display: block; line-height: 1; }
        .lp-cd-lbl { font-size: 0.75rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.5rem; display: block; }
        @media (max-width: 640px) {
          .lp-cd-grid { gap: 0.75rem; }
          .lp-cd-box { padding: 1rem 1.25rem; min-width: 80px; }
          .lp-cd-num { font-size: 2rem; }
        }

        /* FEATURES */
        .lp-features { padding: 6rem 2rem; max-width: 1200px; margin: 0 auto; }
        .lp-sec-hdr { text-align: center; margin-bottom: 4rem; }
        .lp-sec-hdr h2 { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800; letter-spacing: -1px; margin-top: 0.5rem; }
        .lp-feat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }

        /* CARDS */
        .lp-card {
          background: #111827; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px;
          padding: 2rem; transition: all 0.4s;
          opacity: 0; transform: translateY(30px);
        }
        .lp-card.lp-vis { opacity: 1; transform: translateY(0); }
        .lp-card:hover { border-color: rgba(124,58,237,0.3); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(124,58,237,0.1); }
        .lp-card-feat {
          border-color: #7c3aed !important;
          background: linear-gradient(180deg, rgba(124,58,237,0.08) 0%, #111827 100%) !important;
          position: relative;
        }
        .lp-card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; margin-top: 0; }
        .lp-card p  { font-size: 0.9rem; color: #9ca3af; line-height: 1.6; margin: 0; }

        .lp-icon {
          width: 48px; height: 48px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem; margin-bottom: 1.25rem;
        }
        .lp-icon-purple { background: rgba(124,58,237,0.15); }
        .lp-icon-cyan   { background: rgba(6,182,212,0.15); }
        .lp-icon-green  { background: rgba(16,185,129,0.15); }
        .lp-icon-amber  { background: rgba(245,158,11,0.15); }

        .lp-tag {
          display: inline-block; margin-top: 1rem;
          background: rgba(124,58,237,0.1); color: #a78bfa;
          font-size: 0.75rem; font-weight: 600; padding: 0.2rem 0.6rem; border-radius: 6px;
        }

        /* MATERIAS */
        .lp-materias { padding: 6rem 2rem; background: #111827; }
        .lp-materias-inner { max-width: 1000px; margin: 0 auto; }
        .lp-mat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-top: 3rem; }
        .lp-pill {
          display: flex; align-items: center; gap: 0.75rem;
          background: #1f2937; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px;
          padding: 1rem 1.25rem; font-size: 0.9rem; font-weight: 600;
          opacity: 0; transform: scale(0.9); transition: all 0.3s; cursor: default;
        }
        .lp-pill.lp-vis { opacity: 1; transform: scale(1); }
        .lp-pill:hover { border-color: rgba(124,58,237,0.4); background: rgba(124,58,237,0.08); }
        .lp-pill-emoji { font-size: 1.2rem; }

        /* PRICING */
        .lp-pricing { padding: 6rem 2rem; max-width: 1000px; margin: 0 auto; text-align: center; }
        .lp-pricing-sub { color: #9ca3af; margin-top: 0.75rem; }
        .lp-pricing h2 { font-size: clamp(1.8rem,4vw,2.8rem); font-weight: 800; letter-spacing: -1px; margin-top: 0.5rem; }
        .lp-price-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 3rem; }

        .lp-popular {
          position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
          background: #7c3aed; color: white; font-size: 0.75rem; font-weight: 700;
          padding: 0.25rem 1rem; border-radius: 999px; white-space: nowrap;
        }
        .lp-plan-name { font-size: 0.85rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; margin: 0; }
        .lp-plan-price { font-size: 2.5rem; font-weight: 800; margin: 0.75rem 0; }
        .lp-plan-price span { font-size: 1rem; font-weight: 400; color: #9ca3af; }
        .lp-plan-desc { font-size: 0.9rem; color: #9ca3af; margin-bottom: 1.5rem; margin-top: 0; }
        .lp-plan-list { list-style: none; margin-bottom: 2rem; padding: 0; }
        .lp-plan-list li {
          display: flex; align-items: center; gap: 0.6rem;
          font-size: 0.9rem; padding: 0.4rem 0; color: #9ca3af;
        }
        .lp-plan-list li::before { content: '✓'; color: #10b981; font-weight: 700; }
        .lp-plan-list li.lp-locked { color: #6b7280; }
        .lp-plan-list li.lp-locked::before { content: '✗'; color: #6b7280; }

        /* CTA */
        .lp-cta {
          padding: 8rem 2rem; text-align: center;
          background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.12) 0%, transparent 70%);
        }
        .lp-cta h2 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; letter-spacing: -1.5px; margin: 0; }
        .lp-cta h2 span { color: #7c3aed; }
        .lp-cta p { font-size: 1.1rem; color: #9ca3af; margin: 1rem 0 2.5rem; }

        /* FOOTER */
        .lp-footer {
          padding: 2rem; text-align: center;
          border-top: 1px solid rgba(255,255,255,0.06);
          color: #6b7280; font-size: 0.85rem;
        }
        .lp-footer a { color: #7c3aed; text-decoration: none; }

        /* BUTTONS */
        .lp-btn-pri {
          background: #7c3aed; color: white; border: none;
          padding: 0.85rem 2rem; border-radius: 10px; font-size: 1rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block;
        }
        .lp-btn-pri:hover { background: #5b21b6; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(124,58,237,0.4); }
        .lp-btn-sec {
          background: transparent; color: #9ca3af; border: 1px solid rgba(255,255,255,0.15);
          padding: 0.85rem 2rem; border-radius: 10px; font-size: 1rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block;
        }
        .lp-btn-sec:hover { color: #f9fafb; border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.05); }
        .lp-full  { width: 100%; text-align: center; }
        .lp-lg    { font-size: 1.1rem !important; padding: 1rem 2.5rem !important; }

        /* ANIMATIONS */
        @keyframes lpFadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes lpFadeInUp   { from { opacity: 0; transform: translateY(20px);  } to { opacity: 1; transform: translateY(0); } }
        @keyframes lpPulse      { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </>
  );
}
