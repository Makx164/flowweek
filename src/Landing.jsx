import { useState, useEffect } from "react";
import {
  Calendar, Clock, Trophy, BarChart2, Sparkles, Target,
  ArrowRight, Shield, Smartphone, Zap, ChevronDown,
  Star, Heart, Brain, Dumbbell, Flame,
} from "lucide-react";

const FEATURES = [
  {
    icon: Calendar,
    color: ["#7c5cff", "#a06bff"],
    title: "Smarte Wochenplanung",
    desc: "Deine Ziele werden automatisch in freie Zeitslots eingeteilt — um deine festen Termine herum.",
  },
  {
    icon: Clock,
    color: ["#4f7dff", "#36c5ff"],
    title: "Integrierter Timer",
    desc: "Pomodoro-Technik und Countdown direkt in der App. Starte eine Einheit und bleib fokussiert.",
  },
  {
    icon: Trophy,
    color: ["#ff9f1c", "#ffd23f"],
    title: "XP & Level-System",
    desc: "Sammle Erfahrungspunkte, steige im Level auf und schalte Erfolge frei. Gamification, die motiviert.",
  },
  {
    icon: BarChart2,
    color: ["#18c29c", "#46d97f"],
    title: "Wochenverlauf & Statistiken",
    desc: "Verfolge deinen Fortschritt über Wochen hinweg. Sieh Trends, Streaks und deine Entwicklung.",
  },
];

const STEPS = [
  { num: "1", title: "Ziele wählen", desc: "Wähle aus was dir wichtig ist — Sport, Lernen, Lesen oder eigene Ziele." },
  { num: "2", title: "Woche planen", desc: "sidequest verteilt deine Einheiten automatisch auf freie Zeitslots." },
  { num: "3", title: "Dranbleiben", desc: "Timer starten, XP sammeln, Level aufsteigen. Woche für Woche besser werden." },
];

const TESTIMONIALS = [
  { name: "Laura M.", text: "Endlich schaffe ich es, regelmäßig Sport und Lernen in meinen Alltag einzubauen.", role: "Studentin" },
  { name: "Tim K.", text: "Das Level-System motiviert mich tatsächlich, dranzubleiben. Besser als jede andere Habit-App.", role: "Software-Entwickler" },
  { name: "Sarah B.", text: "Ich liebe die Wochenübersicht. Man sieht sofort, wie gut man die Woche genutzt hat.", role: "Freelancerin" },
];

export default function Landing({ onEnterApp, onShowLegal }) {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="lp">
      <style>{CSS}</style>

      {/* Nav */}
      <nav className={scrollY > 40 ? "lp-nav scrolled" : "lp-nav"}>
        <div className="lp-nav-inner">
          <div className="lp-logo">sidequest</div>
          <div className="lp-nav-right">
            <a href="#features" className="lp-nav-link">Features</a>
            <a href="#how" className="lp-nav-link">So geht's</a>
            <button className="lp-nav-cta" onClick={onEnterApp}>Zur App</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-glow" />
        <div className="lp-hero-glow2" />
        <div className="lp-hero-content">
          <div className="lp-hero-badge"><Sparkles size={14} /> Kostenlos · Keine Werbung</div>
          <h1 className="lp-hero-h1">
            Deine Woche.<br />
            <span className="lp-gradient-text">Dein Tempo.</span>
          </h1>
          <p className="lp-hero-sub">
            Plane deine Woche um die Dinge herum, die dir wirklich wichtig sind — und bleib konsequent dabei.
          </p>
          <div className="lp-hero-btns">
            <button className="lp-btn primary" onClick={onEnterApp}>
              Kostenlos starten <ArrowRight size={18} />
            </button>
          </div>
          <div className="lp-hero-trust">
            <div className="lp-stars">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#ffd23f" color="#ffd23f" />)}
            </div>
            <span>PWA — funktioniert auf jedem Gerät</span>
          </div>
        </div>

        {/* Phone mockup */}
        <div className="lp-phone">
          <div className="lp-phone-frame">
            <div className="lp-phone-screen">
              <div className="lp-mock-header">
                <div className="lp-mock-logo">sidequest</div>
                <div className="lp-mock-pill"><Trophy size={11} /> Level 3</div>
              </div>
              <div className="lp-mock-ring">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#ece8f6" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="url(#mockGrad)" strokeWidth="8"
                    strokeLinecap="round" strokeDasharray={2*Math.PI*42} strokeDashoffset={2*Math.PI*42*0.33}
                    style={{ transform:"rotate(-90deg)", transformOrigin:"center" }} />
                  <defs><linearGradient id="mockGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7c5cff" /><stop offset="100%" stopColor="#36c5ff" />
                  </linearGradient></defs>
                </svg>
                <div className="lp-mock-ring-text">67%</div>
              </div>
              <div className="lp-mock-card" style={{ background:"linear-gradient(135deg,#ff6b6b,#ff9f45)" }}>
                <div className="lp-mock-card-top"><Dumbbell size={14}/> Workout</div>
                <div className="lp-mock-card-sub">45 min · 7:00</div>
              </div>
              <div className="lp-mock-card" style={{ background:"linear-gradient(135deg,#7c5cff,#a06bff)" }}>
                <div className="lp-mock-card-top"><Brain size={14}/> Lesen</div>
                <div className="lp-mock-card-sub">25 min · 19:00</div>
              </div>
              <div className="lp-mock-card done" style={{ background:"linear-gradient(135deg,#18c29c,#46d97f)" }}>
                <div className="lp-mock-card-top"><Sparkles size={14}/> Meditation ✓</div>
                <div className="lp-mock-card-sub">10 min · erledigt</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="lp-section" id="features">
        <div className="lp-section-inner">
          <div className="lp-section-badge"><Target size={14} /> Features</div>
          <h2 className="lp-h2">Alles was du brauchst, um dranzubleiben</h2>
          <p className="lp-section-sub">sidequest kombiniert smarte Planung mit Gamification — damit gute Vorsätze zur Routine werden.</p>
          <div className="lp-features">
            {FEATURES.map((f, i) => {
              const I = f.icon;
              return (
                <div key={i} className="lp-feature">
                  <div className="lp-feature-ico" style={{ background:`linear-gradient(135deg,${f.color[0]},${f.color[1]})` }}>
                    <I size={22} />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="lp-section lp-section-alt" id="how">
        <div className="lp-section-inner">
          <div className="lp-section-badge"><Zap size={14} /> So geht's</div>
          <h2 className="lp-h2">In 2 Minuten zur ersten geplanten Woche</h2>
          <div className="lp-steps">
            {STEPS.map((s, i) => (
              <div key={i} className="lp-step">
                <div className="lp-step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="lp-section">
        <div className="lp-section-inner">
          <div className="lp-section-badge"><Heart size={14} /> Nutzer-Stimmen</div>
          <h2 className="lp-h2">Was unsere Beta-Tester sagen</h2>
          <div className="lp-testimonials">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="lp-testimonial">
                <div className="lp-test-stars">
                  {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="#ffd23f" color="#ffd23f" />)}
                </div>
                <p>"{t.text}"</p>
                <div className="lp-test-author">
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="lp-section lp-section-alt">
        <div className="lp-section-inner">
          <div className="lp-trust-row">
            <div className="lp-trust-item">
              <Shield size={24} />
              <h3>Deine Daten gehören dir</h3>
              <p>Alles wird lokal gespeichert. Kein Tracking, keine Werbung. Cloud-Sync ist optional.</p>
            </div>
            <div className="lp-trust-item">
              <Smartphone size={24} />
              <h3>Überall verfügbar</h3>
              <p>Web, iPhone, Android — eine App für alle Geräte. Installiere sie direkt vom Browser.</p>
            </div>
            <div className="lp-trust-item">
              <Flame size={24} />
              <h3>100% kostenlos</h3>
              <p>Keine versteckten Kosten, keine Premium-Version. sidequest ist und bleibt kostenlos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="lp-cta">
        <div className="lp-cta-glow" />
        <div className="lp-cta-inner">
          <h2>Bereit, deine Woche zu planen?</h2>
          <p>Starte jetzt kostenlos — in 2 Minuten steht dein erster Wochenplan.</p>
          <button className="lp-btn primary lg" onClick={onEnterApp}>
            Kostenlos starten <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-logo">sidequest</div>
          <div className="lp-footer-links">
            <a href="#" onClick={e => { e.preventDefault(); onEnterApp(); }}>Zur App</a>
            <a href="#" onClick={e => { e.preventDefault(); onShowLegal && onShowLegal("privacy"); }}>Datenschutz</a>
            <a href="#" onClick={e => { e.preventDefault(); onShowLegal && onShowLegal("terms"); }}>AGB</a>
            <a href="mailto:hello@yoursidequest.org">Kontakt</a>
          </div>
          <div className="lp-footer-copy">© {new Date().getFullYear()} sidequest. Alle Rechte vorbehalten.</div>
        </div>
      </footer>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');
.lp{
  --bg:#fdf7ff;--bg2:#f4f0ff;--card:#ffffff;--text:#1d1b2e;--muted:#6f6b86;--line:#ece8f6;
  font-family:'Inter',system-ui,sans-serif;color:var(--text);background:var(--bg);
  -webkit-font-smoothing:antialiased;overflow-x:hidden;min-height:100vh;
}
.lp *{box-sizing:border-box}

/* Nav */
.lp-nav{position:fixed;top:0;left:0;right:0;z-index:50;padding:16px 24px;transition:.3s}
.lp-nav.scrolled{background:rgba(250,250,248,.92);backdrop-filter:blur(12px);border-bottom:.5px solid #E8E6E1}
.lp-nav-inner{max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;align-items:center}
.lp-logo{font-weight:500;font-size:20px;letter-spacing:-.5px;color:#1A1A1A}
.lp-nav-right{display:flex;align-items:center;gap:24px}
.lp-nav-link{color:var(--muted);text-decoration:none;font-size:14px;font-weight:500;transition:.15s}
.lp-nav-link:hover{color:var(--text)}
.lp-nav-cta{background:#1A1A1A;color:#FAFAF8;border:none;padding:9px 18px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;transition:.18s}
.lp-nav-cta:hover{opacity:.85}
@media(max-width:600px){.lp-nav-link{display:none}}

/* Hero */
.lp-hero{min-height:100vh;display:flex;align-items:center;justify-content:center;gap:60px;padding:100px 24px 60px;position:relative;overflow:hidden;flex-wrap:wrap}
.lp-hero-glow{position:absolute;top:-200px;left:-100px;width:600px;height:600px;border-radius:999px;background:radial-gradient(circle,#7c5cff22,transparent 70%);pointer-events:none}
.lp-hero-glow2{position:absolute;bottom:-200px;right:-100px;width:500px;height:500px;border-radius:999px;background:radial-gradient(circle,#36c5ff18,transparent 70%);pointer-events:none}
.lp-hero-content{max-width:520px;position:relative;z-index:1}
.lp-hero-badge{display:inline-flex;align-items:center;gap:6px;background:#F5F3EE;color:#999;font-size:12px;font-weight:500;padding:6px 14px;border-radius:6px;margin-bottom:20px;border:.5px solid #E8E6E1}
.lp-hero-h1{font-weight:500;font-size:clamp(36px,6vw,52px);line-height:1.1;letter-spacing:-1.5px;margin:0 0 18px}
.lp-gradient-text{color:#1A1A1A}
.lp-hero-sub{font-size:18px;line-height:1.6;color:var(--muted);margin:0 0 28px;max-width:440px}
.lp-hero-btns{display:flex;gap:12px;flex-wrap:wrap}
.lp-hero-trust{display:flex;align-items:center;gap:10px;margin-top:24px;font-size:13px;color:var(--muted)}
.lp-stars{display:flex;gap:2px}

/* Phone mockup */
.lp-phone{position:relative;z-index:1}
.lp-phone-frame{width:280px;border-radius:36px;background:#1d1b2e;padding:12px;box-shadow:0 40px 80px rgba(30,20,60,.25),0 0 0 1px rgba(255,255,255,.1) inset}
.lp-phone-screen{background:linear-gradient(165deg,#fdf7ff,#eaeeff);border-radius:26px;padding:20px 16px;min-height:420px}
.lp-mock-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.lp-mock-logo{font-family:'Outfit';font-weight:800;font-size:16px}
.lp-mock-logo span{background:linear-gradient(90deg,#7c5cff,#36c5ff);-webkit-background-clip:text;background-clip:text;color:transparent}
.lp-mock-pill{display:flex;align-items:center;gap:4px;font-size:10px;font-weight:700;background:#fff;padding:5px 10px;border-radius:999px;box-shadow:0 4px 12px rgba(0,0,0,.08);font-family:'Outfit';color:#1d1b2e}
.lp-mock-pill svg{color:#ffb020}
.lp-mock-ring{position:relative;display:flex;justify-content:center;margin-bottom:14px}
.lp-mock-ring-text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Outfit';font-weight:800;font-size:22px}
.lp-mock-card{border-radius:14px;padding:12px 14px;color:#fff;margin-bottom:8px}
.lp-mock-card.done{opacity:.7}
.lp-mock-card-top{font-family:'Outfit';font-weight:700;font-size:14px;display:flex;align-items:center;gap:6px}
.lp-mock-card-sub{font-size:11px;opacity:.85;margin-top:2px}
@media(max-width:800px){.lp-phone{margin-top:20px}}

/* Buttons */
.lp-btn{border:none;border-radius:8px;padding:14px 24px;font-size:15px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:.2s}
.lp-btn.primary{background:#1A1A1A;color:#FAFAF8}
.lp-btn.primary:hover{opacity:.85}
.lp-btn.lg{padding:16px 32px;font-size:16px}

/* Sections */
.lp-section{padding:80px 24px}
.lp-section-alt{background:#F5F3EE}
.lp-section-inner{max-width:1100px;margin:0 auto;text-align:center}
.lp-section-badge{display:inline-flex;align-items:center;gap:6px;background:#F5F3EE;color:#999;font-size:11px;font-weight:500;padding:5px 12px;border-radius:6px;margin-bottom:14px;border:.5px solid #E8E6E1;text-transform:uppercase;letter-spacing:.5px}
.lp-h2{font-weight:500;font-size:clamp(26px,4vw,36px);letter-spacing:-.5px;margin:0 0 12px}
.lp-section-sub{color:var(--muted);font-size:16px;max-width:550px;margin:0 auto 40px;line-height:1.6}

/* Features grid */
.lp-features{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;text-align:left}
.lp-feature{background:var(--card);border-radius:12px;padding:24px;border:.5px solid #E8E6E1;transition:.2s}
.lp-feature:hover{border-color:#999}
.lp-feature-ico{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;color:#fff;margin-bottom:14px}
.lp-feature h3{font-weight:500;font-size:16px;margin:0 0 8px}
.lp-feature p{color:var(--muted);font-size:14px;line-height:1.55;margin:0}

/* Steps */
.lp-steps{display:flex;gap:24px;justify-content:center;flex-wrap:wrap}
.lp-step{background:var(--card);border-radius:12px;padding:28px 24px;border:.5px solid #E8E6E1;flex:1;min-width:220px;max-width:300px;text-align:center}
.lp-step-num{width:40px;height:40px;border-radius:10px;background:#1A1A1A;color:#FAFAF8;font-weight:500;font-size:18px;display:grid;place-items:center;margin:0 auto 14px}
.lp-step h3{font-weight:500;font-size:16px;margin:0 0 8px}
.lp-step p{color:var(--muted);font-size:14px;line-height:1.5;margin:0}

/* Testimonials */
.lp-testimonials{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;text-align:left}
.lp-testimonial{background:var(--card);border-radius:12px;padding:24px;border:.5px solid #E8E6E1}
.lp-test-stars{margin-bottom:12px;display:flex;gap:2px}
.lp-testimonial p{font-size:15px;line-height:1.55;margin:0 0 16px;color:var(--text)}
.lp-test-author strong{font-size:14px;display:block}
.lp-test-author span{font-size:12px;color:var(--muted)}

/* Trust row */
.lp-trust-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px;text-align:center}
.lp-trust-item svg{color:#1A1A1A;margin-bottom:12px}
.lp-trust-item h3{font-weight:500;font-size:16px;margin:0 0 8px}
.lp-trust-item p{color:var(--muted);font-size:14px;line-height:1.5;margin:0}

/* CTA */
.lp-cta{padding:80px 24px;text-align:center;position:relative;overflow:hidden}
.lp-cta-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:400px;border-radius:999px;background:radial-gradient(circle,#7c5cff18,transparent 60%);pointer-events:none}
.lp-cta-inner{position:relative;z-index:1}
.lp-cta h2{font-weight:500;font-size:clamp(26px,4vw,34px);letter-spacing:-.5px;margin:0 0 12px}
.lp-cta p{color:var(--muted);font-size:16px;margin:0 0 28px}

/* Footer */
.lp-footer{padding:40px 24px;border-top:.5px solid #E8E6E1}
.lp-footer-inner{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
.lp-footer-links{display:flex;gap:20px}
.lp-footer-links a{color:var(--muted);text-decoration:none;font-size:14px;font-weight:600;transition:.15s}
.lp-footer-links a:hover{color:var(--text)}
.lp-footer-copy{color:var(--muted);font-size:12px}
@media(max-width:600px){
  .lp-footer-inner{flex-direction:column;text-align:center}
}
`;
