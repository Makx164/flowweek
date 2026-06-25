import { useState, useEffect } from "react";
import { ArrowRight, Smartphone } from "lucide-react";

const FEATURES = [
  { emoji: "🗓️", title: "Smarte Wochenplanung", desc: "Deine Ziele werden automatisch in freie Zeitslots eingeteilt — um deine festen Termine herum." },
  { emoji: "⏱️", title: "Integrierter Timer", desc: "Pomodoro-Technik und Countdown direkt in der App. Starte eine Einheit und bleib fokussiert." },
  { emoji: "⭐", title: "XP & Level-System", desc: "Gamification hält dich motiviert — oder schalte sie aus, ganz wie du willst." },
  { emoji: "📊", title: "Wochenverlauf", desc: "Verfolge deinen Fortschritt über Wochen hinweg. Sieh Trends, Streaks und deine Entwicklung." },
];

const STEPS = [
  { num: "01", title: "Ziele wählen", desc: "Wähle was dir wichtig ist — Sport, Lernen, Kreatives oder eigene Quests." },
  { num: "02", title: "Woche planen", desc: "sidequest verteilt deine Einheiten automatisch auf freie Zeitslots." },
  { num: "03", title: "Dranbleiben", desc: "Timer starten, Notizen machen, Fortschritt sehen. Woche für Woche." },
];

const APP_STORE_URL = "https://apps.apple.com/app/sidequest/id000000000";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=app.sidequest";

function StoreBadges() {
  return (
    <div className="lp-store-badges">
      <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="lp-badge">
        <svg viewBox="0 0 120 40" width="135" height="45">
          <rect width="120" height="40" rx="6" fill="#000"/>
          <text x="42" y="13" fill="#fff" fontSize="7" fontFamily="system-ui,sans-serif">Laden im</text>
          <text x="42" y="26" fill="#fff" fontSize="13" fontWeight="600" fontFamily="system-ui,sans-serif">App Store</text>
          <g transform="translate(12,8)" fill="#fff">
            <path d="M18.9 14.3c0-3.1 2.5-4.6 2.6-4.6-1.4-2.1-3.6-2.3-4.4-2.4-1.9-.2-3.6 1.1-4.6 1.1-.9 0-2.4-1.1-4-1.1-2 0-3.9 1.2-5 3-2.1 3.7-.5 9.1 1.5 12.1 1 1.5 2.2 3.1 3.8 3 1.5-.1 2.1-1 3.9-1s2.4 1 4 1 2.7-1.5 3.7-2.9c1.2-1.7 1.6-3.3 1.7-3.4-.1 0-3.2-1.2-3.2-4.8zM15.8 5.3c.8-1 1.4-2.4 1.2-3.8-1.2.1-2.7.8-3.5 1.8-.8.9-1.5 2.3-1.3 3.7 1.4.1 2.8-.7 3.6-1.7z" transform="scale(0.72)"/>
          </g>
        </svg>
      </a>
      <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="lp-badge">
        <svg viewBox="0 0 135 40" width="152" height="45">
          <rect width="135" height="40" rx="6" fill="#000"/>
          <text x="50" y="13" fill="#fff" fontSize="7" fontFamily="system-ui,sans-serif">JETZT BEI</text>
          <text x="50" y="26" fill="#fff" fontSize="13" fontWeight="600" fontFamily="system-ui,sans-serif">Google Play</text>
          <g transform="translate(12,8)">
            <path d="M4 2.5l10 7.5L4 17.5V2.5z" fill="#4285F4"/>
            <path d="M4 2.5l10 7.5 4-3L4 0v2.5z" fill="#34A853"/>
            <path d="M4 17.5l10-7.5 4 3L4 20v-2.5z" fill="#EA4335"/>
            <path d="M14 10l4-3v6l-4-3z" fill="#FBBC05"/>
          </g>
        </svg>
      </a>
    </div>
  );
}

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

      <nav className={scrollY > 40 ? "lp-nav scrolled" : "lp-nav"}>
        <div className="lp-nav-inner">
          <div className="lp-logo serif">sidequest</div>
          <div className="lp-nav-right">
            <a href="#features" className="lp-nav-link">Features</a>
            <a href="#how" className="lp-nav-link">So geht's</a>
            <button className="lp-nav-cta" onClick={onEnterApp}>WebApp</button>
          </div>
        </div>
      </nav>

      <section className="lp-hero">
        <div className="lp-hero-content">
          <div className="lp-hero-pills">
            <span className="lp-pill clay">🏃 Bewegung</span>
            <span className="lp-pill sage">📚 Lernen</span>
            <span className="lp-pill light">🎨 Kreativ</span>
            <span className="lp-pill light">🧘 Ruhe</span>
          </div>
          <h1 className="lp-hero-h1 serif">
            Plane deine Woche<br/>um das herum, was<br/>dich lebendig macht.
          </h1>
          <p className="lp-hero-sub">
            Warm, ruhig, verspielt. Gamification ist da, wenn du sie willst — und weg, wenn nicht.
          </p>
          <StoreBadges />
          <button className="lp-btn-webapp" onClick={onEnterApp}>
            <Smartphone size={16} /> WebApp nutzen
          </button>
        </div>

        <div className="lp-phone">
          <div className="lp-phone-frame">
            <div className="lp-phone-screen">
              <div className="lp-mock-sub">DEINE WOCHE</div>
              <div className="lp-mock-title serif">Mo – So</div>
              <div className="lp-mock-bar"><div className="lp-mock-bar-fill" /></div>
              <div className="lp-mock-quest clay">
                <div className="lp-mock-quest-name">Morgenlauf 🏃</div>
                <div className="lp-mock-quest-meta">7:00 · 30 min</div>
              </div>
              <div className="lp-mock-quest white">
                <div className="lp-mock-quest-name dark">Aquarell 🎨</div>
                <div className="lp-mock-quest-meta dark">18:30 · Kreativ</div>
              </div>
              <div className="lp-mock-quest sage">
                <div className="lp-mock-quest-name">Waldspaziergang 🌿</div>
                <div className="lp-mock-quest-meta">17:00 · Natur</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section" id="features">
        <div className="lp-section-inner">
          <div className="lp-section-label">FEATURES</div>
          <h2 className="lp-h2 serif">Alles was du brauchst,<br/>um dranzubleiben</h2>
          <div className="lp-features">
            {FEATURES.map((f, i) => (
              <div key={i} className="lp-feature">
                <div className="lp-feature-emoji">{f.emoji}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section lp-section-warm" id="how">
        <div className="lp-section-inner">
          <div className="lp-section-label">SO GEHT'S</div>
          <h2 className="lp-h2 serif">In 2 Minuten zur<br/>ersten geplanten Woche</h2>
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

      <section className="lp-section">
        <div className="lp-section-inner">
          <div className="lp-trust-row">
            <div className="lp-trust-item">
              <div className="lp-trust-emoji">🔒</div>
              <h3>Deine Daten gehören dir</h3>
              <p>Lokal gespeichert. Kein Tracking, keine Werbung. Cloud-Sync ist optional.</p>
            </div>
            <div className="lp-trust-item">
              <div className="lp-trust-emoji">📱</div>
              <h3>Überall verfügbar</h3>
              <p>Web, iPhone, Android — eine App für alle Geräte.</p>
            </div>
            <div className="lp-trust-item">
              <div className="lp-trust-emoji">✨</div>
              <h3>100% kostenlos</h3>
              <p>Keine versteckten Kosten. sidequest ist und bleibt kostenlos.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-cta">
        <div className="lp-cta-inner">
          <h2 className="serif">Bereit, deine Woche<br/>zu planen?</h2>
          <p>Hol dir die App — oder starte direkt im Browser.</p>
          <StoreBadges />
          <button className="lp-btn-webapp lg" onClick={onEnterApp}>
            <Smartphone size={18} /> WebApp nutzen
          </button>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-logo serif">sidequest</div>
          <div className="lp-footer-links">
            <a href="#" onClick={e => { e.preventDefault(); onEnterApp(); }}>WebApp</a>
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
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Newsreader:wght@400;500;600&display=swap');
.lp{
  --bg:#FBF6EE;--card:#ffffff;--text:#2A2420;--muted:#7a6f64;--clay:#E9785A;--sage:#7FA08A;--surface:#EFE5D7;--peach:#F4E2D6;
  font-family:'DM Sans',system-ui,sans-serif;color:var(--text);background:var(--bg);
  -webkit-font-smoothing:antialiased;overflow-x:hidden;min-height:100vh;
}
.lp *{box-sizing:border-box}
.serif{font-family:'Newsreader',Georgia,serif}

.lp-nav{position:fixed;top:0;left:0;right:0;z-index:50;padding:18px 24px;transition:.3s}
.lp-nav.scrolled{background:rgba(251,246,238,.92);backdrop-filter:blur(12px)}
.lp-nav-inner{max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;align-items:center}
.lp-logo{font-size:24px;letter-spacing:-.02em;color:var(--text)}
.lp-nav-right{display:flex;align-items:center;gap:24px}
.lp-nav-link{color:var(--muted);text-decoration:none;font-size:15px;font-weight:500;transition:.15s}
.lp-nav-link:hover{color:var(--text)}
.lp-nav-cta{background:var(--text);color:var(--bg);border:none;padding:11px 22px;border-radius:999px;font-size:15px;font-weight:600;cursor:pointer;transition:.18s}
.lp-nav-cta:hover{opacity:.85}
@media(max-width:600px){.lp-nav-link{display:none}}

.lp-hero{min-height:100vh;display:flex;align-items:center;justify-content:center;gap:60px;padding:120px 24px 80px;position:relative;overflow:hidden;flex-wrap:wrap;background:linear-gradient(180deg,var(--peach),var(--bg) 60%)}
.lp-hero-content{max-width:540px;position:relative;z-index:1}
.lp-hero-pills{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:24px}
.lp-pill{border-radius:999px;padding:10px 18px;font-size:14px;font-weight:500}
.lp-pill.clay{background:var(--clay);color:#fff;font-weight:600}
.lp-pill.sage{background:var(--sage);color:#fff;font-weight:600}
.lp-pill.light{background:#fff;color:var(--text);box-shadow:0 2px 8px -3px rgba(60,40,30,.2)}
.lp-hero-h1{font-size:clamp(34px,5.5vw,52px);line-height:1.08;letter-spacing:-.02em;margin:0 0 20px;font-weight:400}
.lp-hero-sub{font-size:17px;line-height:1.55;color:var(--muted);margin:0 0 30px;max-width:440px}

.lp-store-badges{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:16px}
.lp-badge{display:block;transition:.2s}
.lp-badge:hover{transform:translateY(-2px);opacity:.9}
.lp-badge svg{display:block}

.lp-btn-webapp{border:none;border-radius:999px;padding:12px 24px;font-size:15px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:.2s;font-family:'DM Sans',sans-serif;background:transparent;color:var(--muted);text-decoration:underline;text-underline-offset:3px}
.lp-btn-webapp:hover{color:var(--text)}
.lp-btn-webapp.lg{font-size:16px;padding:14px 28px;margin-top:12px}

.lp-phone{position:relative;z-index:1}
.lp-phone-frame{width:300px;background:var(--bg);border-radius:36px;padding:18px 20px 24px;box-shadow:0 40px 80px -20px rgba(60,40,30,.25),0 0 0 8px #1f1a16;overflow:hidden}
.lp-phone-screen{min-height:380px}
.lp-mock-sub{font-size:12px;color:var(--muted);font-weight:600;letter-spacing:.1em}
.lp-mock-title{font-size:32px;color:var(--text);letter-spacing:-.02em;margin-top:4px}
.lp-mock-bar{height:8px;border-radius:999px;background:var(--surface);overflow:hidden;margin:16px 0 20px}
.lp-mock-bar-fill{height:100%;width:64%;border-radius:999px;background:linear-gradient(90deg,var(--clay),#F2A78C)}
.lp-mock-quest{border-radius:20px;padding:14px 16px;margin-bottom:10px}
.lp-mock-quest.clay{background:var(--clay);color:#fff}
.lp-mock-quest.sage{background:var(--sage);color:#fff}
.lp-mock-quest.white{background:#fff;box-shadow:0 2px 10px -4px rgba(60,40,30,.18)}
.lp-mock-quest-name{font-weight:600;font-size:15px}
.lp-mock-quest-name.dark{color:var(--text)}
.lp-mock-quest-meta{font-size:12px;opacity:.8;margin-top:2px}
.lp-mock-quest-meta.dark{color:var(--muted);opacity:1}
@media(max-width:800px){.lp-phone{margin-top:20px}}

.lp-section{padding:90px 24px}
.lp-section-warm{background:var(--peach)}
.lp-section-inner{max-width:1100px;margin:0 auto;text-align:center}
.lp-section-label{font-size:13px;font-weight:600;color:var(--muted);letter-spacing:.15em;margin-bottom:14px}
.lp-h2{font-size:clamp(28px,4vw,42px);letter-spacing:-.02em;margin:0 0 16px;font-weight:400;line-height:1.15}

.lp-features{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;text-align:left;margin-top:40px}
.lp-feature{background:var(--card);border-radius:28px;padding:28px;box-shadow:0 2px 10px -4px rgba(60,40,30,.18);transition:.2s}
.lp-feature:hover{transform:translateY(-3px);box-shadow:0 8px 24px -8px rgba(60,40,30,.2)}
.lp-feature-emoji{font-size:28px;margin-bottom:14px}
.lp-feature h3{font-weight:600;font-size:17px;margin:0 0 8px}
.lp-feature p{color:var(--muted);font-size:14px;line-height:1.55;margin:0}

.lp-steps{display:flex;gap:20px;justify-content:center;flex-wrap:wrap;margin-top:40px}
.lp-step{background:var(--card);border-radius:28px;padding:32px 26px;box-shadow:0 2px 10px -4px rgba(60,40,30,.18);flex:1;min-width:220px;max-width:300px;text-align:center}
.lp-step-num{width:48px;height:48px;border-radius:50%;background:var(--clay);color:#fff;font-weight:700;font-size:16px;display:grid;place-items:center;margin:0 auto 16px}
.lp-step h3{font-weight:600;font-size:17px;margin:0 0 8px}
.lp-step p{color:var(--muted);font-size:14px;line-height:1.5;margin:0}

.lp-trust-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px;text-align:center}
.lp-trust-emoji{font-size:32px;margin-bottom:14px}
.lp-trust-item h3{font-weight:600;font-size:17px;margin:0 0 8px}
.lp-trust-item p{color:var(--muted);font-size:14px;line-height:1.5;margin:0}

.lp-cta{padding:100px 24px;text-align:center;background:linear-gradient(180deg,var(--bg),var(--peach))}
.lp-cta-inner{position:relative;z-index:1}
.lp-cta h2{font-size:clamp(28px,4vw,40px);letter-spacing:-.02em;margin:0 0 14px;font-weight:400;line-height:1.15}
.lp-cta p{color:var(--muted);font-size:17px;margin:0 0 30px}

.lp-footer{padding:40px 24px;border-top:1px solid var(--surface)}
.lp-footer-inner{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
.lp-footer-links{display:flex;gap:20px}
.lp-footer-links a{color:var(--muted);text-decoration:none;font-size:14px;font-weight:600;transition:.15s}
.lp-footer-links a:hover{color:var(--text)}
.lp-footer-copy{color:var(--muted);font-size:12px}
@media(max-width:600px){.lp-footer-inner{flex-direction:column;text-align:center}}
`;
