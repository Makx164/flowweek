import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Users, BarChart2, Clock, Flame, Trash2, Search, RefreshCw } from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
.adm{font-family:'Inter',system-ui,sans-serif;color:#1A1A1A;background:#FAFAF8;min-height:100vh;padding:0 0 40px}
.adm *{box-sizing:border-box}
.adm-header{position:sticky;top:0;z-index:40;background:rgba(250,250,248,.92);backdrop-filter:blur(12px);border-bottom:.5px solid #E8E6E1;padding:14px 24px}
.adm-header-inner{max-width:900px;margin:0 auto;display:flex;align-items:center;gap:14px}
.adm-back{display:inline-flex;align-items:center;gap:6px;background:none;border:none;color:#534AB7;font-weight:500;font-size:14px;cursor:pointer;padding:0}
.adm-title{font-size:16px;font-weight:500}
.adm-body{max-width:900px;margin:0 auto;padding:20px 24px}
.adm-login{max-width:360px;margin:80px auto;text-align:center}
.adm-login h2{font-size:20px;font-weight:500;margin:0 0 8px}
.adm-login p{color:#999;font-size:13px;margin:0 0 20px}
.adm-login input{width:100%;border:.5px solid #E8E6E1;border-radius:8px;padding:10px 12px;font-size:14px;margin-bottom:10px;background:#fff;color:#1A1A1A}
.adm-login input:focus{outline:none;border-color:#1A1A1A}
.adm-login button{width:100%;background:#1A1A1A;color:#FAFAF8;border:none;border-radius:8px;padding:11px;font-size:14px;font-weight:500;cursor:pointer}
.adm-login .err{color:#E24B4A;font-size:12px;margin:8px 0}
.adm-metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:24px}
.adm-metric{background:#fff;border:.5px solid #E8E6E1;border-radius:10px;padding:16px}
.adm-metric-label{font-size:11px;color:#999;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
.adm-metric-value{font-size:24px;font-weight:500}
.adm-metric-sub{font-size:11px;color:#999;margin-top:2px}
.adm-section{margin-bottom:24px}
.adm-section-h{font-size:13px;font-weight:500;color:#999;text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px;display:flex;align-items:center;gap:8px}
.adm-search{display:flex;gap:8px;margin-bottom:14px}
.adm-search input{flex:1;border:.5px solid #E8E6E1;border-radius:8px;padding:8px 12px;font-size:13px;background:#fff;color:#1A1A1A}
.adm-search input:focus{outline:none;border-color:#1A1A1A}
.adm-search button{border:.5px solid #E8E6E1;border-radius:8px;padding:8px 12px;background:#fff;cursor:pointer;color:#999;display:flex;align-items:center;gap:5px;font-size:12px;font-weight:500}
.adm-table{width:100%;border-collapse:collapse}
.adm-table th{font-size:11px;color:#999;text-transform:uppercase;letter-spacing:.5px;font-weight:500;text-align:left;padding:8px 10px;border-bottom:.5px solid #E8E6E1}
.adm-table td{font-size:13px;padding:10px;border-bottom:.5px solid #E8E6E1}
.adm-table tr:last-child td{border-bottom:none}
.adm-table tr:hover td{background:#F5F3EE}
.adm-badge{font-size:10px;padding:2px 8px;border-radius:4px;font-weight:500}
.adm-badge.active{background:#1D9E7518;color:#1D9E75}
.adm-badge.inactive{background:#E8E6E1;color:#999}
.adm-empty{text-align:center;padding:40px;color:#999;font-size:13px}
.adm-btn-sm{border:.5px solid #E8E6E1;border-radius:6px;padding:4px 8px;background:none;cursor:pointer;color:#999;font-size:11px}
.adm-btn-sm:hover{border-color:#999;color:#1A1A1A}
.adm-btn-sm.danger{border-color:rgba(228,75,74,.3);color:#E24B4A}
.adm-note{background:#F5F3EE;border:.5px solid #E8E6E1;border-radius:8px;padding:12px 14px;font-size:12px;color:#999;line-height:1.5;margin-bottom:20px}
`;

const ADMIN_PASS = "sidequest2026";

export default function AdminDashboard({ onBack }) {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const login = (e) => {
    e.preventDefault();
    if (pass === ADMIN_PASS) { setAuthed(true); setErr(""); }
    else setErr("Falsches Passwort.");
  };

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { getFirestore, collection, getDocs } = await import("firebase/firestore");
      const { getApps } = await import("firebase/app");
      if (!getApps().length) { setLoading(false); return; }
      const db = getFirestore();
      const snap = await getDocs(collection(db, "users"));
      const list = [];
      snap.forEach(doc => {
        const d = doc.data();
        list.push({
          uid: doc.id,
          name: d.goals?.map(g => g.name).join(", ") || "–",
          xp: d.stats?.xp ?? 0,
          done: d.stats?.done ?? 0,
          goals: d.goals?.length ?? 0,
          sessions: d.sessions?.length ?? 0,
          level: 1 + Math.floor((d.stats?.xp ?? 0) / 200),
          streak: Math.max(0, ...Object.values(d.stats?.streaks || { _: 0 })),
          isBeta: !!d.stats?.isBetaUser,
          lang: d.lang ?? "de",
          dark: !!d.dark,
          gamification: d.gamification !== false,
        });
      });
      setUsers(list);
    } catch (e) {
      console.error("Admin load failed:", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { if (authed) loadUsers(); }, [authed, loadUsers]);

  const filtered = users.filter(u =>
    u.uid.toLowerCase().includes(search.toLowerCase()) ||
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalXp = users.reduce((s, u) => s + u.xp, 0);
  const totalDone = users.reduce((s, u) => s + u.done, 0);
  const avgLevel = users.length ? (users.reduce((s, u) => s + u.level, 0) / users.length).toFixed(1) : "–";
  const activeUsers = users.filter(u => u.done > 0).length;

  if (!authed) {
    return (
      <div className="adm">
        <style>{CSS}</style>
        <div className="adm-header">
          <div className="adm-header-inner">
            <button className="adm-back" onClick={onBack}><ArrowLeft size={16}/> Zurück</button>
            <span className="adm-title">Admin</span>
          </div>
        </div>
        <form className="adm-login" onSubmit={login}>
          <h2>Admin Dashboard</h2>
          <p>Passwort eingeben um fortzufahren.</p>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Passwort" autoFocus />
          {err && <div className="err">{err}</div>}
          <button type="submit">Anmelden</button>
        </form>
      </div>
    );
  }

  return (
    <div className="adm">
      <style>{CSS}</style>
      <div className="adm-header">
        <div className="adm-header-inner">
          <button className="adm-back" onClick={onBack}><ArrowLeft size={16}/> Zurück</button>
          <span className="adm-title">Admin Dashboard</span>
        </div>
      </div>
      <div className="adm-body">
        <div className="adm-note">
          Dashboard liest Firestore-Daten direkt. Keine Firebase-Config = keine Daten.
          Nutzer-Dokumente werden unter /users/&lbrace;uid&rbrace; gespeichert.
        </div>

        <div className="adm-metrics">
          <div className="adm-metric">
            <div className="adm-metric-label"><Users size={12}/> Nutzer</div>
            <div className="adm-metric-value">{users.length}</div>
            <div className="adm-metric-sub">{activeUsers} aktiv</div>
          </div>
          <div className="adm-metric">
            <div className="adm-metric-label"><BarChart2 size={12}/> Einheiten</div>
            <div className="adm-metric-value">{totalDone}</div>
            <div className="adm-metric-sub">gesamt erledigt</div>
          </div>
          <div className="adm-metric">
            <div className="adm-metric-label"><Flame size={12}/> XP</div>
            <div className="adm-metric-value">{totalXp.toLocaleString()}</div>
            <div className="adm-metric-sub">gesamt gesammelt</div>
          </div>
          <div className="adm-metric">
            <div className="adm-metric-label"><Clock size={12}/> Avg Level</div>
            <div className="adm-metric-value">{avgLevel}</div>
            <div className="adm-metric-sub">Durchschnitt</div>
          </div>
        </div>

        <div className="adm-section">
          <div className="adm-section-h"><Users size={14}/> Nutzer ({filtered.length})</div>
          <div className="adm-search">
            <input placeholder="Suche nach UID oder Zielen..." value={search} onChange={e => setSearch(e.target.value)} />
            <button onClick={loadUsers} disabled={loading}><RefreshCw size={13}/> {loading ? "..." : "Laden"}</button>
          </div>

          {users.length === 0 ? (
            <div className="adm-empty">
              {loading ? "Lade Nutzerdaten..." : "Keine Nutzerdaten gefunden. Firebase konfiguriert?"}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>UID</th>
                    <th>Ziele</th>
                    <th>Level</th>
                    <th>XP</th>
                    <th>Erledigt</th>
                    <th>Serie</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u.uid}>
                      <td style={{ fontFamily: "monospace", fontSize: 11 }}>{u.uid.slice(0, 12)}...</td>
                      <td>{u.name}</td>
                      <td>{u.level}</td>
                      <td>{u.xp}</td>
                      <td>{u.done}</td>
                      <td>{u.streak}</td>
                      <td>
                        <span className={u.done > 0 ? "adm-badge active" : "adm-badge inactive"}>
                          {u.done > 0 ? "aktiv" : "inaktiv"}
                        </span>
                        {u.isBeta && <span className="adm-badge active" style={{ marginLeft: 4 }}>beta</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
