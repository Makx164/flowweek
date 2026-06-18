import React, {
  useState, useEffect, useRef, useCallback, createContext, useContext,
} from "react";
import {
  Flame, Trophy, Play, Check, X, RotateCw, Calendar, Plus, Trash2,
  Settings as Cog, Target, Sparkles, Sun, Moon, Dumbbell, BookOpen,
  Brain, Droplet, Clock, Pause, Award, Download, ArrowRight,
  Bell, BellOff, BarChart2, Globe, User, LogOut,
} from "lucide-react";
import { fbReady, onAuth, signInGoogle, signInApple, signOutUser, loadCloud, saveCloud } from "./firebase.js";

/* ----------------------------- design tokens ----------------------------- */
const ACCENTS = {
  coral:  ["#ff6b6b", "#ff9f45"],
  violet: ["#7c5cff", "#a06bff"],
  blue:   ["#4f7dff", "#36c5ff"],
  green:  ["#18c29c", "#46d97f"],
  amber:  ["#ff9f1c", "#ffd23f"],
  pink:   ["#ff5fa2", "#ff8fc8"],
};
const ACCENT_KEYS = Object.keys(ACCENTS);

const TYPES = {
  sport: { label: "Sport",       icon: Dumbbell, timer: "countdown" },
  focus: { label: "Fokus",       icon: Brain,    timer: "pomodoro"  },
  habit: { label: "Gewohnheit",  icon: Sparkles, timer: "quick"     },
};

const TEMPLATES = [
  { name: "Workout",        type: "sport", color: "coral",  perWeek: 3, durationMin: 45, pref: "evening",   icon: Dumbbell },
  { name: "Laufen",         type: "sport", color: "blue",   perWeek: 3, durationMin: 30, pref: "morning",   icon: Dumbbell },
  { name: "Lesen",          type: "focus", color: "violet", perWeek: 5, durationMin: 25, pref: "evening",   icon: BookOpen },
  { name: "Lernen",         type: "focus", color: "blue",   perWeek: 4, durationMin: 50, pref: "afternoon", icon: Brain },
  { name: "Meditation",     type: "habit", color: "green",  perWeek: 7, durationMin: 10, pref: "morning",   icon: Brain },
  { name: "Wasser trinken", type: "habit", color: "blue",   perWeek: 7, durationMin: 5,  pref: "any",       icon: Droplet },
  { name: "Früh aufstehen", type: "habit", color: "amber",  perWeek: 7, durationMin: 5,  pref: "morning",   icon: Sun },
];

/* ------------------------------- i18n ------------------------------------ */
const T = {
  de: {
    days:     ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    daysFull: ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"],
    prefs:    { morning:"Morgens", afternoon:"Mittags", evening:"Abends", any:"Egal" },
    types:    { sport:"Sport", focus:"Fokus", habit:"Gewohnheit" },
    // nav
    navToday:"Heute", navWeek:"Woche", navGoals:"Ziele", navMore:"Mehr",
    // header
    levelLabel: (l) => `Level ${l}`,
    // today
    allDone: "Alles erledigt für heute 🎉",
    nothingToday: "Heute steht nichts an",
    allDoneHint: "Stark! Ruh dich aus oder zieh einen Bonus durch.",
    nothingHint: 'Plane deine Woche im Tab "Woche".',
    nextUp: "Als Nächstes",
    xpStat:    (xp, l) => `${xp} XP · Level ${l}`,
    streakStat:(n) => `${n} Tage Bestserie`,
    doneStat:  (n) => `${n} Einheiten erledigt`,
    start:"Starten", done:"Erledigt", skip:"Ausfallen",
    // week
    planWeek: "Woche planen",
    suggestBanner: "Neue Vorschläge — verschieben oder übernehmen.",
    acceptAll: "Alle übernehmen",
    free: "frei",
    // goals
    achievements: "Erfolge", goalsTitle: "Deine Ziele", newGoal: "Neu",
    history: "Wochenverlauf", noHistory: "Nach der ersten abgeschlossenen Woche erscheint hier dein Verlauf.",
    typeLabel: "Typ", perWeekLabel: "Pro Woche", minutesLabel: "Minuten", timeLabel: "Zeit",
    addGoal: "Hinzufügen", cancel: "Abbrechen", goalPlaceholder: "Name des Ziels",
    // badges
    badge1:"Erster Schritt", badge2:"Aufgewärmt", badge3:"In Flammen",
    badge4:"Frühstarter", badge5:"Level 5", badge6:"100 XP",
    // settings
    wakeTitle: "Wachzeiten", wakeStart: "Start", wakeEnd: "Ende",
    blockedTitle: "Feste Termine / Sperrzeiten",
    noBlocked: "Noch keine Sperrzeiten — frei für Vorschläge.",
    recurringLabel: "Wöchentlich wiederholen",
    pomoTitle: "Fokus-Timer (Pomodoro)",
    workLabel: "Arbeit", brkLabel: "Pause",
    notifTitle: "Benachrichtigungen",
    notifHint: "Erhalte eine Erinnerung 15 Minuten vor jeder geplanten Einheit.",
    notifActive: "Aktiv — du bekommst Erinnerungen",
    notifDisable: "Deaktivieren",
    notifEnable: "Benachrichtigungen aktivieren",
    notifUnsupported: "Nicht unterstützt",
    darkMode: "Dunkles Design",
    langTitle: "Sprache",
    accountTitle: "Konto",
    notConfigured: "Firebase nicht konfiguriert — App läuft im Offline-Modus.",
    loggedInAs: (name) => `Angemeldet als ${name}`,
    cloudHint: "Verlauf & Level werden geräteübergreifend synchronisiert.",
    signOut: "Abmelden",
    signInSection: "Anmelden für Cloud-Sync",
    resetAll: "Alles zurücksetzen",
    resetConfirm: "Alles zurücksetzen?",
    storageNote: "Daten bleiben lokal gespeichert. Kein Konto, kein Server.",
    // timer
    focusLabel: "Fokus", breakLabel: "Pause",
    pauseBtn: "Pause", resumeBtn: "Weiter",
    collectXp: "Geschafft — XP einsammeln",
    // replan
    replanTitle: "Etwas dazwischengekommen?",
    replanHint: (day, time) => `Neuer Vorschlag: ${day} ${time}`,
    replanLater: "Später", replanAccept: "Übernehmen",
    // review
    reviewTitle: (key) => `Woche ab ${formatWeekKey(key)}`,
    reviewBonus: (b) => `Wochenbonus: +${b} XP`,
    reviewNewWeek: "Neue Woche starten",
    rateLabel: (r) => r >= 0.8 ? "Hervorragend! 🏆" : r >= 0.5 ? "Gut gemacht! 💪" : "Weiter so! 🌱",
    // onboarding
    onbTagline: "Deine Woche.\nDein Tempo.",
    onbLead: "Plane deine Woche um die Dinge herum, die dir wirklich wichtig sind — und bleib konsequent dabei.",
    onbFeat: [
      { title:"Smarte Wochenplanung", desc:"Deine Ziele werden automatisch in Zeitslots eingeteilt" },
      { title:"Integrierter Timer", desc:"Pomodoro-Technik & Countdown direkt in der App" },
      { title:"XP & Level-System", desc:"Gamification hält dich langfristig motiviert" },
      { title:"Wochenverlauf", desc:"Verfolge Fortschritt und Streaks über Wochen hinweg" },
    ],
    onbStartFree: "Kostenlos starten",
    onbHint: "2 Minuten bis zur ersten geplanten Woche",
    onbGoalsTitle: "Wähle deine Ziele",
    onbGoalsLead: "Wähle aus, was dir wichtig ist. Du kannst alles jederzeit anpassen.",
    onbMore: "Weiter",
    onbWhenTitle: "Wann bist du wach?",
    onbWhenLead: "FlowWeek plant Einheiten nur in diesem Zeitfenster. Feste Termine trägst du später unter Einstellungen ein.",
    onbGo: "Loslegen",
    onbBack: "Zurück",
    // auth
    authTitle: "Anmelden",
    authLead: "Melde dich an, um Verlauf, XP und Level-System auf allen Geräten zu synchronisieren.",
    authGoogle: "Mit Google anmelden",
    authApple: "Mit Apple anmelden",
    authOr: "oder",
    authSkip: "Ohne Konto fortfahren",
    authNote: "Ohne Konto werden deine Daten nur lokal auf diesem Gerät gespeichert.",
    cloudLoaded: "Cloud-Daten geladen ✓",
  },
  en: {
    days:     ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    daysFull: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    prefs:    { morning:"Morning", afternoon:"Afternoon", evening:"Evening", any:"Anytime" },
    types:    { sport:"Sport", focus:"Focus", habit:"Habit" },
    navToday:"Today", navWeek:"Week", navGoals:"Goals", navMore:"More",
    levelLabel: (l) => `Level ${l}`,
    allDone: "All done for today 🎉",
    nothingToday: "Nothing scheduled today",
    allDoneHint: "Great! Rest up or squeeze in a bonus.",
    nothingHint: 'Plan your week in the "Week" tab.',
    nextUp: "Up Next",
    xpStat:    (xp, l) => `${xp} XP · Level ${l}`,
    streakStat:(n) => `${n} day best streak`,
    doneStat:  (n) => `${n} sessions completed`,
    start:"Start", done:"Done", skip:"Skip",
    planWeek: "Plan week",
    suggestBanner: "New suggestions — move or accept.",
    acceptAll: "Accept all",
    free: "free",
    achievements: "Achievements", goalsTitle: "Your Goals", newGoal: "New",
    history: "Weekly history", noHistory: "Your history will appear here after your first completed week.",
    typeLabel: "Type", perWeekLabel: "Per week", minutesLabel: "Minutes", timeLabel: "Time",
    addGoal: "Add", cancel: "Cancel", goalPlaceholder: "Goal name",
    badge1:"First step", badge2:"Warmed up", badge3:"On fire",
    badge4:"Early bird", badge5:"Level 5", badge6:"100 XP",
    wakeTitle: "Awake hours", wakeStart: "Start", wakeEnd: "End",
    blockedTitle: "Blocked times",
    noBlocked: "No blocked times — open for scheduling.",
    recurringLabel: "Repeat weekly",
    pomoTitle: "Focus Timer (Pomodoro)",
    workLabel: "Work", brkLabel: "Break",
    notifTitle: "Notifications",
    notifHint: "Get a reminder 15 minutes before each planned session.",
    notifActive: "Active — you'll receive reminders",
    notifDisable: "Disable",
    notifEnable: "Enable notifications",
    notifUnsupported: "Not supported",
    darkMode: "Dark mode",
    langTitle: "Language",
    accountTitle: "Account",
    notConfigured: "Firebase not configured — app runs in offline mode.",
    loggedInAs: (name) => `Signed in as ${name}`,
    cloudHint: "History & levels sync across all your devices.",
    signOut: "Sign out",
    signInSection: "Sign in for cloud sync",
    resetAll: "Reset everything",
    resetConfirm: "Reset everything?",
    storageNote: "Data is stored locally on this device.",
    focusLabel: "Focus", breakLabel: "Break",
    pauseBtn: "Pause", resumeBtn: "Resume",
    collectXp: "Done — collect XP",
    replanTitle: "Something came up?",
    replanHint: (day, time) => `New suggestion: ${day} ${time}`,
    replanLater: "Later", replanAccept: "Accept",
    reviewTitle: (key) => `Week of ${formatWeekKey(key)}`,
    reviewBonus: (b) => `Week bonus: +${b} XP`,
    reviewNewWeek: "Start new week",
    rateLabel: (r) => r >= 0.8 ? "Outstanding! 🏆" : r >= 0.5 ? "Well done! 💪" : "Keep going! 🌱",
    onbTagline: "Your week.\nYour pace.",
    onbLead: "Plan your week around the things that truly matter to you — and stay consistent.",
    onbFeat: [
      { title:"Smart scheduling", desc:"Your goals are automatically placed into time slots" },
      { title:"Built-in timer", desc:"Pomodoro technique & countdown built right in" },
      { title:"XP & level system", desc:"Gamification keeps you motivated long-term" },
      { title:"Weekly history", desc:"Track progress and streaks across weeks" },
    ],
    onbStartFree: "Start for free",
    onbHint: "2 minutes to your first planned week",
    onbGoalsTitle: "Choose your goals",
    onbGoalsLead: "Pick what matters to you. You can adjust everything later.",
    onbMore: "Continue",
    onbWhenTitle: "When are you awake?",
    onbWhenLead: "FlowWeek only schedules sessions within this window. Add fixed appointments later in Settings.",
    onbGo: "Let's go",
    onbBack: "Back",
    authTitle: "Sign in",
    authLead: "Sign in to sync your history, XP and levels across all your devices.",
    authGoogle: "Sign in with Google",
    authApple: "Sign in with Apple",
    authOr: "or",
    authSkip: "Continue without account",
    authNote: "Without an account your data is only stored locally on this device.",
    cloudLoaded: "Cloud data loaded ✓",
  },
};

const LangCtx = createContext(() => "");
const useT = () => useContext(LangCtx);

/* ------------------------------- helpers --------------------------------- */
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const pad = (n) => String(n).padStart(2, "0");
const minToLabel = (m) => `${Math.floor(m / 60)}:${pad(m % 60)}`;
const todayIndex = () => (new Date().getDay() + 6) % 7;

function getMonday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - todayIndex());
  return d;
}
function dateForDay(i, startMin = 0) {
  const d = new Date(getMonday());
  d.setDate(d.getDate() + i);
  d.setMinutes(startMin);
  return d;
}
const dtLocal = (d) =>
  `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

const levelFromXp = (xp) => 1 + Math.floor(xp / 200);
const xpIntoLevel = (xp) => xp % 200;

const getMondayKey = () => {
  const d = getMonday();
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
};
function formatWeekKey(key) {
  const d = new Date(key + "T00:00:00");
  return `${d.getDate()}. ${d.toLocaleDateString("de-DE", { month: "short" })}`;
}
const rateColor = (r) =>
  r >= 0.8 ? "#18c29c, #46d97f" : r >= 0.5 ? "#7c5cff, #4f7dff" : "#ff6b6b, #ff9f45";

/* --------------------------- scheduling engine --------------------------- */
function buildOccupied(sessions, busy, day) {
  const occ = [];
  busy.filter((b) => b.day === day).forEach((b) => occ.push([b.start, b.end]));
  sessions
    .filter((s) => s.day === day && s.status !== "skipped")
    .forEach((s) => occ.push([s.start, s.start + s.durationMin]));
  return occ;
}
const slotFree = (occ, start, end) =>
  !occ.some(([s, e]) => start < e + 10 && end + 10 > s);

function windowFor(pref, wake) {
  const cl = (a, b) => [Math.max(a, wake[0]), Math.min(b, wake[1])];
  if (pref === "morning")   return cl(360, 720);
  if (pref === "afternoon") return cl(720, 1080);
  if (pref === "evening")   return cl(1080, 1380);
  return [wake[0], wake[1]];
}
function findSlot(dur, win, occ) {
  for (let t = win[0]; t + dur <= win[1]; t += 15) if (slotFree(occ, t, t + dur)) return t;
  return null;
}
const dayLoad = (sessions, d) =>
  sessions.filter((s) => s.day === d && s.status !== "skipped").length;

function planWeek(goals, sessions, availability) {
  const wake = [availability.wakeStart, availability.wakeEnd];
  const placed = [...sessions];
  const created = [];
  for (const g of goals) {
    const have = placed.filter((s) => s.goalId === g.id && s.status !== "skipped").length;
    let need = Math.max(0, g.perWeek - have);
    const usedDays = new Set(placed.filter((s) => s.goalId === g.id).map((s) => s.day));
    let guard = 0;
    while (need > 0 && guard++ < 50) {
      const order = [0,1,2,3,4,5,6].sort((a,b) => dayLoad(placed,a) - dayLoad(placed,b));
      let chosen = null, start = null;
      for (const d of order) {
        if (usedDays.has(d) && usedDays.size < 7) continue;
        const occ = buildOccupied(placed, availability.busy, d);
        let st = findSlot(g.durationMin, windowFor(g.pref, wake), occ);
        if (st == null && g.pref !== "any") st = findSlot(g.durationMin, wake, occ);
        if (st != null) { chosen = d; start = st; break; }
      }
      if (chosen == null) {
        for (const d of order) {
          const occ = buildOccupied(placed, availability.busy, d);
          const st = findSlot(g.durationMin, wake, occ);
          if (st != null) { chosen = d; start = st; break; }
        }
      }
      if (chosen == null) break;
      const s = { id: uid(), goalId: g.id, day: chosen, start, durationMin: g.durationMin, status: "suggested" };
      placed.push(s); created.push(s); usedDays.add(chosen); need--;
    }
  }
  return created;
}

function findReplacement(goal, sessions, availability, fromDay) {
  const wake = [availability.wakeStart, availability.wakeEnd];
  const order = [...Array(7).keys()].filter(d=>d>=fromDay).concat([...Array(7).keys()].filter(d=>d<fromDay));
  for (const d of order) {
    const occ = buildOccupied(sessions, availability.busy, d);
    let st = findSlot(goal.durationMin, windowFor(goal.pref, wake), occ);
    if (st == null) st = findSlot(goal.durationMin, wake, occ);
    if (st != null) return { id: uid(), goalId: goal.id, day: d, start: st, durationMin: goal.durationMin, status: "suggested" };
  }
  return null;
}

/* ------------------------------ ics / google ----------------------------- */
function sessionDates(s) {
  const start = dateForDay(s.day, s.start);
  const end = new Date(start.getTime() + s.durationMin * 60000);
  return { start, end };
}
function downloadIcs(sessions, goals) {
  const gname = (id) => goals.find(g => g.id === id)?.name || "FlowWeek";
  const lines = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//FlowWeek//DE","CALSCALE:GREGORIAN"];
  sessions.forEach(s => {
    const { start, end } = sessionDates(s);
    lines.push("BEGIN:VEVENT",`UID:${s.id}@flowweek`,`DTSTAMP:${dtLocal(new Date())}`,
      `DTSTART:${dtLocal(start)}`,`DTEND:${dtLocal(end)}`,`SUMMARY:${gname(s.goalId)}`,"END:VEVENT");
  });
  lines.push("END:VCALENDAR");
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "flowweek-woche.ics"; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
function googleLink(s, name) {
  const { start, end } = sessionDates(s);
  const p = new URLSearchParams({ action:"TEMPLATE", text:name, dates:`${dtLocal(start)}/${dtLocal(end)}` });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

/* ------------------------------- storage --------------------------------- */
const KEY = "flowweek:v1";
async function loadState() {
  try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : null; }
  catch { return null; }
}
async function saveState(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch { /* quota */ }
}

/* ------------------------------ ui atoms --------------------------------- */
function Ring({ value, size = 132, stroke = 12, from, to, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const id = "g" + Math.round((from?.charCodeAt(1)||0) + (to?.charCodeAt(1)||0) + value*100);
  return (
    <div style={{ position:"relative", width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} /><stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`url(#${id})`} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c*(1-Math.min(1,value))}
          style={{ transition:"stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)" }} />
      </svg>
      <div style={{ position:"absolute", inset:0, display:"grid", placeItems:"center" }}>{children}</div>
    </div>
  );
}
function Bar({ value, from, to, h = 10 }) {
  return (
    <div style={{ height:h, borderRadius:999, background:"var(--line)", overflow:"hidden" }}>
      <div style={{
        height:"100%", width:`${Math.min(100,value*100)}%`, borderRadius:999,
        background:`linear-gradient(90deg, ${from}, ${to})`,
        transition:"width .8s cubic-bezier(.2,.8,.2,1)",
      }} />
    </div>
  );
}
function Confetti({ on }) {
  if (!on) return null;
  const colors = ACCENT_KEYS.flatMap(k => ACCENTS[k]);
  return (
    <div className="fw-confetti" aria-hidden>
      {Array.from({length:44}).map((_,i) => (
        <span key={i} style={{
          left:`${Math.random()*100}%`,
          background:colors[i % colors.length],
          animationDelay:`${Math.random()*.3}s`,
          transform:`rotate(${Math.random()*360}deg)`,
        }} />
      ))}
    </div>
  );
}

/* ----------------------------- login view -------------------------------- */
const GoogleSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);
const AppleSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.41c1.27.07 2.15.63 2.97.65.94-.1 1.84-.67 2.88-.62 1.24.08 2.17.6 2.78 1.53-2.56 1.54-1.96 4.93.74 5.93-.52 1.39-1.2 2.75-2.37 4.38zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

function LoginView({ onSkip }) {
  const t = useT();
  const [loading, setLoading] = useState(null);
  const handleGoogle = async () => {
    setLoading("google");
    try { await signInGoogle(); }
    catch (e) { if (e.code !== "auth/popup-closed-by-user") setLoading(null); else setLoading(null); }
  };
  const handleApple = async () => {
    setLoading("apple");
    try { await signInApple(); }
    catch { setLoading(null); }
  };
  return (
    <div className="fw-onb">
      <div className="fw-onb-card">
        <div className="fw-onb-glow" />
        <div className="fw-login-icon"><Trophy size={28} /></div>
        <div className="fw-logo" style={{ textAlign:"center", marginBottom:6 }}>Flow<span>Week</span></div>
        <h2 className="fw-login-title">{t("authTitle")}</h2>
        <p className="fw-login-lead">{t("authLead")}</p>
        <button className="fw-login-google" onClick={handleGoogle} disabled={!!loading}>
          <GoogleSvg /> {loading === "google" ? "…" : t("authGoogle")}
        </button>
        <button className="fw-login-apple" onClick={handleApple} disabled={!!loading}>
          <AppleSvg /> {loading === "apple" ? "…" : t("authApple")}
        </button>
        <div className="fw-login-divider"><span>{t("authOr")}</span></div>
        <button className="fw-btn ghost wide" onClick={onSkip}>{t("authSkip")}</button>
        <p className="fw-login-note">{t("authNote")}</p>
      </div>
    </div>
  );
}

/* ================================ APP ==================================== */
export default function App() {
  const [loaded, setLoaded]                     = useState(false);
  const [view, setView]                         = useState("today");
  const [dark, setDark]                         = useState(false);
  const [lang, setLang]                         = useState("de");
  const [onboarded, setOnboarded]               = useState(false);
  const [goals, setGoals]                       = useState([]);
  const [sessions, setSessions]                 = useState([]);
  const [availability, setAvailability]         = useState({ wakeStart:420, wakeEnd:1380, busy:[] });
  const [stats, setStats]                       = useState({ xp:0, done:0, streaks:{}, morningDone:false, currentWeekKey:null });
  const [pomo, setPomo]                         = useState({ work:25, brk:5 });
  const [weekHistory, setWeekHistory]           = useState([]);
  const [showReview, setShowReview]             = useState(false);
  const [pendingReview, setPendingReview]       = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const firedNotifsRef                          = useRef(new Set());
  const [active, setActive]                     = useState(null);
  const [celebrate, setCelebrate]               = useState(false);
  const [toast, setToast]                       = useState(null);
  const [replan, setReplan]                     = useState(null);

  // Auth
  const [user, setUser]                         = useState(undefined);
  const [skippedAuth, setSkippedAuth]           = useState(() => localStorage.getItem("fw:auth:skip") === "1");
  const cloudSyncedRef                          = useRef(false);

  // i18n
  const t = useCallback((key, ...args) => {
    const val = T[lang]?.[key] ?? T.de[key] ?? key;
    return typeof val === "function" ? val(...args) : val;
  }, [lang]);

  /* load from localStorage */
  useEffect(() => {
    (async () => {
      const s = await loadState();
      const currentKey = getMondayKey();
      if (s) {
        const isNewWeek = s.stats?.currentWeekKey && s.stats.currentWeekKey !== currentKey;
        setOnboarded(s.onboarded ?? false);
        setGoals(s.goals ?? []);
        setAvailability(s.availability ?? { wakeStart:420, wakeEnd:1380, busy:[] });
        setPomo(s.pomo ?? { work:25, brk:5 });
        setDark(s.dark ?? false);
        setNotificationsEnabled(s.notificationsEnabled ?? false);
        setLang(s.lang ?? "de");
        if (isNewWeek && s.onboarded) {
          const raw = s.sessions ?? [];
          const planned = raw.filter(x => x.status !== "skipped").length;
          const done    = raw.filter(x => x.status === "done").length;
          const rate = planned > 0 ? done / planned : 0;
          const bonus = rate >= 0.8 ? 50 : rate >= 0.5 ? 25 : 10;
          const summary = { weekKey: s.stats.currentWeekKey, planned, done, rate, bonus };
          setWeekHistory([summary, ...(s.weekHistory ?? [])].slice(0, 12));
          setPendingReview(summary);
          setShowReview(true);
          setSessions([]);
          setStats({ ...(s.stats ?? {}), currentWeekKey: currentKey, morningDone:false, xp:(s.stats?.xp??0)+bonus });
        } else {
          setWeekHistory(s.weekHistory ?? []);
          setSessions(s.sessions ?? []);
          setStats({ ...(s.stats ?? {}), currentWeekKey: currentKey });
        }
      } else {
        setStats(prev => ({ ...prev, currentWeekKey: currentKey }));
      }
      setLoaded(true);
    })();
  }, []);

  /* Firebase auth listener */
  useEffect(() => {
    return onAuth((fbUser) => setUser(fbUser || null));
  }, []);

  /* Cloud sync when user signs in */
  useEffect(() => {
    if (!user || !loaded || cloudSyncedRef.current) return;
    cloudSyncedRef.current = true;
    (async () => {
      const cloud = await loadCloud(user.uid);
      if (cloud?.onboarded && (cloud.stats?.xp ?? 0) >= stats.xp) {
        const currentKey = getMondayKey();
        setOnboarded(cloud.onboarded);
        setGoals(cloud.goals ?? []);
        setSessions(cloud.sessions ?? []);
        setAvailability(cloud.availability ?? { wakeStart:420, wakeEnd:1380, busy:[] });
        setStats({ ...(cloud.stats ?? {}), currentWeekKey: currentKey });
        setPomo(cloud.pomo ?? { work:25, brk:5 });
        setDark(cloud.dark ?? false);
        setWeekHistory(cloud.weekHistory ?? []);
        setLang(cloud.lang ?? "de");
        flash(t("cloudLoaded"));
      } else if (onboarded) {
        await saveCloud(user.uid, { onboarded, goals, sessions, availability, stats, pomo, dark, weekHistory, notificationsEnabled, lang });
      }
    })();
  }, [user, loaded]);

  /* save (debounced) */
  const saveT = useRef();
  useEffect(() => {
    if (!loaded) return;
    clearTimeout(saveT.current);
    const state = { onboarded, goals, sessions, availability, stats, pomo, dark, weekHistory, notificationsEnabled, lang };
    saveT.current = setTimeout(() => {
      saveState(state);
      if (user) saveCloud(user.uid, state);
    }, 400);
  }, [loaded, onboarded, goals, sessions, availability, stats, pomo, dark, weekHistory, notificationsEnabled, lang, user]);

  /* push notification check */
  useEffect(() => {
    if (!notificationsEnabled || !("Notification" in window)) return;
    const check = () => {
      if (Notification.permission !== "granted") return;
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const di = todayIndex();
      sessions.filter(s => s.day === di && (s.status === "planned" || s.status === "suggested")).forEach(s => {
        const key = `${s.id}-${di}`;
        if (nowMin >= s.start-15 && nowMin < s.start-13 && !firedNotifsRef.current.has(key)) {
          firedNotifsRef.current.add(key);
          const g = goals.find(g => g.id === s.goalId);
          try { new Notification(`Gleich: ${g?.name || "Einheit"}`, { body:`Startet um ${minToLabel(s.start)} · ${s.durationMin} min`, tag:key }); }
          catch { /* blocked */ }
        }
      });
    };
    check();
    const iv = setInterval(check, 60000);
    return () => clearInterval(iv);
  }, [notificationsEnabled, sessions, goals]);

  const flash = useCallback((msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); }, []);
  const fireCelebrate = useCallback(() => { setCelebrate(true); setTimeout(() => setCelebrate(false), 1600); }, []);
  const goalById = useCallback((id) => goals.find(g => g.id === id), [goals]);
  const level = levelFromXp(stats.xp);

  /* session actions */
  const completeSession = (sess) => {
    const g = goalById(sess.goalId);
    setSessions(prev => prev.map(s => s.id === sess.id ? { ...s, status:"done" } : s));
    setStats(prev => {
      const prevLevel = levelFromXp(prev.xp);
      const xp = prev.xp + Math.max(10, sess.durationMin);
      const streaks = { ...prev.streaks, [sess.goalId]:(prev.streaks[sess.goalId]||0)+1 };
      const morningDone = prev.morningDone || sess.start < 720;
      if (levelFromXp(xp) > prevLevel) { fireCelebrate(); flash(`Level ${levelFromXp(xp)} erreicht!`); }
      else if (streaks[sess.goalId] === 3) { fireCelebrate(); flash(`${g?.name}: 3er-Serie!`); }
      else flash(`+${Math.max(10, sess.durationMin)} XP für ${g?.name}`);
      return { ...prev, xp, done:prev.done+1, streaks, morningDone };
    });
    setActive(null);
  };

  const skipSession = (sess) => {
    setSessions(prev => prev.map(s => s.id === sess.id ? { ...s, status:"skipped" } : s));
    setStats(prev => ({ ...prev, streaks:{ ...prev.streaks, [sess.goalId]:0 } }));
    const g = goalById(sess.goalId);
    const after = sessions.map(s => s.id === sess.id ? { ...s, status:"skipped" } : s);
    const repl = g ? findReplacement(g, after, availability, sess.day) : null;
    if (repl) setReplan(repl);
    else flash("Kein freier Ersatz-Slot diese Woche gefunden.");
  };

  const acceptReplan = () => {
    setSessions(prev => [...prev, { ...replan, status:"planned" }]);
    flash(t("replanAccept") + " ✓");
    setReplan(null);
  };

  const acceptSuggestion  = (id) => setSessions(prev => prev.map(s => s.id === id ? { ...s, status:"planned" } : s));
  const acceptAll         = () => setSessions(prev => prev.map(s => s.status === "suggested" ? { ...s, status:"planned" } : s));
  const removeSession     = (id) => setSessions(prev => prev.filter(s => s.id !== id));
  const rescheduleSession = (sess) => {
    const g = goalById(sess.goalId);
    const others = sessions.filter(s => s.id !== sess.id);
    const repl = g && findReplacement(g, others, availability, (sess.day+1)%7);
    if (repl) { setSessions([...others, { ...repl, status:sess.status }]); flash("Verschoben ✓"); }
    else flash("Kein anderer Slot frei.");
  };

  const runPlan = () => {
    const created = planWeek(goals, sessions, availability);
    if (created.length) { setSessions(prev => [...prev, ...created]); flash(`${created.length} Einheiten vorgeschlagen`); }
    else flash("Alles schon geplant 🎉");
  };

  const requestNotifPermission = async () => {
    if (!("Notification" in window)) { flash("Dein Browser unterstützt keine Benachrichtigungen."); return; }
    const perm = await Notification.requestPermission();
    if (perm === "granted") { setNotificationsEnabled(true); flash("Benachrichtigungen aktiviert ✓"); }
    else flash("Berechtigung verweigert — bitte in den Browser-Einstellungen erlauben.");
  };

  const handleSkipAuth = () => {
    localStorage.setItem("fw:auth:skip", "1");
    setSkippedAuth(true);
  };

  if (!loaded) return (
    <div style={{ minHeight:"100vh", display:"grid", placeItems:"center", color:"#888" }}>Lädt…</div>
  );

  const showLogin = fbReady && user === null && !skippedAuth;

  return (
    <LangCtx.Provider value={t}>
      <div className={dark ? "fw fw-dark" : "fw"}>
        <style>{CSS}</style>
        <Confetti on={celebrate} />
        {toast && <div className="fw-toast">{toast}</div>}

        {showLogin ? (
          <LoginView onSkip={handleSkipAuth} />
        ) : !onboarded ? (
          <Onboarding
            onDone={(picked, avail) => {
              setGoals(picked); setAvailability(avail);
              const created = planWeek(picked, [], avail);
              setSessions(created); setOnboarded(true); setView("today");
              setStats(prev => ({ ...prev, currentWeekKey: getMondayKey() }));
            }}
          />
        ) : (
          <div className="fw-shell">
            <AppHeader level={level} xp={stats.xp} dark={dark} setDark={setDark} />
            <main className="fw-main">
              {view === "today"    && <TodayView {...{ goals, sessions, stats, level, setActive, completeSession, skipSession, goalById }} />}
              {view === "week"     && <WeekView  {...{ goals, sessions, runPlan, acceptSuggestion, acceptAll, skipSession, rescheduleSession, removeSession, completeSession, setActive, goalById, downloadIcs, googleLink }} />}
              {view === "goals"    && <GoalsView {...{ goals, setGoals, stats, weekHistory }} />}
              {view === "settings" && <SettingsView {...{ availability, setAvailability, pomo, setPomo, dark, setDark, notificationsEnabled, setNotificationsEnabled, requestNotifPermission, lang, setLang, user, skippedAuth, handleSkipAuth, reset: () => { setOnboarded(false); setGoals([]); setSessions([]); setWeekHistory([]); setStats({ xp:0,done:0,streaks:{},morningDone:false,currentWeekKey:getMondayKey() }); cloudSyncedRef.current=false; }}} />}
            </main>
            <AppNav view={view} setView={setView} />
          </div>
        )}

        {active && (
          <TimerOverlay sess={active} goal={goalById(active.goalId)} pomo={pomo}
            onClose={() => setActive(null)} onComplete={completeSession} />
        )}
        {showReview && pendingReview && (
          <WeekReviewModal summary={pendingReview} onContinue={() => {
            setShowReview(false); setPendingReview(null); fireCelebrate();
            const created = planWeek(goals, [], availability);
            if (created.length) { setSessions(created); flash(`Neue Woche geplant: ${created.length} Einheiten`); }
          }} />
        )}
        {replan && (
          <div className="fw-replan">
            <div>
              <strong>{t("replanTitle")}</strong>
              <span>{t("replanHint", t("daysFull")[replan.day], minToLabel(replan.start))}</span>
            </div>
            <div className="fw-replan-btns">
              <button className="fw-btn ghost" onClick={() => setReplan(null)}>{t("replanLater")}</button>
              <button className="fw-btn solid" onClick={acceptReplan}>{t("replanAccept")}</button>
            </div>
          </div>
        )}
      </div>
    </LangCtx.Provider>
  );
}

/* ------------------------------- header / nav ---------------------------- */
function AppHeader({ level, xp, dark, setDark }) {
  const t = useT();
  return (
    <header className="fw-header">
      <div>
        <div className="fw-logo">Flow<span>Week</span></div>
        <div className="fw-sub">{t("daysFull")[todayIndex()]}, {new Date().toLocaleDateString("de-DE", { day:"numeric", month:"long" })}</div>
      </div>
      <div className="fw-header-right">
        <div className="fw-levelpill"><Trophy size={15} /><span>{t("levelLabel", level)}</span></div>
        <div className="fw-xpmini"><Bar value={xpIntoLevel(xp)/200} from="#7c5cff" to="#36c5ff" h={6} /></div>
        <button className="fw-icon-btn" onClick={() => setDark(d => !d)} aria-label="Theme">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
function AppNav({ view, setView }) {
  const t = useT();
  const items = [
    { k:"today", labelKey:"navToday", icon:Clock },
    { k:"week",  labelKey:"navWeek",  icon:Calendar },
    { k:"goals", labelKey:"navGoals", icon:Target },
    { k:"settings", labelKey:"navMore", icon:Cog },
  ];
  return (
    <nav className="fw-nav">
      {items.map(it => {
        const I = it.icon;
        return (
          <button key={it.k} className={view === it.k ? "fw-navi active" : "fw-navi"} onClick={() => setView(it.k)}>
            <I size={20} /><span>{t(it.labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ------------------------------- onboarding ------------------------------ */
const FEAT_ICONS = [Calendar, Clock, Trophy, BarChart2];
const FEAT_COLORS = ["violet", "blue", "amber", "green"];

function Onboarding({ onDone }) {
  const t = useT();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(() =>
    TEMPLATES.filter(t => ["Workout","Lesen","Meditation"].includes(t.name)).map(t => ({
      id:uid(), name:t.name, type:t.type, color:t.color, perWeek:t.perWeek, durationMin:t.durationMin, pref:t.pref,
    }))
  );
  const [wake, setWake] = useState({ start:7, end:23 });

  const toggle = (tmpl) => {
    const exists = picked.find(p => p.name === tmpl.name);
    if (exists) setPicked(picked.filter(p => p.name !== tmpl.name));
    else setPicked([...picked, { id:uid(), name:tmpl.name, type:tmpl.type, color:tmpl.color, perWeek:tmpl.perWeek, durationMin:tmpl.durationMin, pref:tmpl.pref }]);
  };

  return (
    <div className="fw-onb">
      <div className="fw-onb-card">
        <div className="fw-onb-glow" />

        {/* Step 0 — Splash */}
        {step === 0 && (
          <>
            <div className="fw-splash-icon-wrap">
              <div className="fw-splash-icon">F</div>
            </div>
            <div className="fw-logo big" style={{ textAlign:"center" }}>Flow<span>Week</span></div>
            <p className="fw-splash-tagline">{t("onbTagline").split("\n").map((line,i) => <span key={i}>{line}<br/></span>)}</p>
            <p className="fw-onb-lead">{t("onbLead")}</p>
            <div className="fw-splash-feats">
              {t("onbFeat").map((f, i) => {
                const I = FEAT_ICONS[i];
                const [c1, c2] = ACCENTS[FEAT_COLORS[i]];
                return (
                  <div key={i} className="fw-splash-feat">
                    <div className="fw-splash-feat-ico" style={{ background:`linear-gradient(135deg,${c1},${c2})` }}>
                      <I size={17} />
                    </div>
                    <div>
                      <div className="fw-splash-feat-title">{f.title}</div>
                      <div className="fw-splash-feat-desc">{f.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="fw-btn solid wide" onClick={() => setStep(1)}>
              {t("onbStartFree")} <ArrowRight size={18} />
            </button>
            <p className="fw-splash-hint">{t("onbHint")}</p>
          </>
        )}

        {/* Step 1 — Goals */}
        {step === 1 && (
          <>
            <div className="fw-onb-h"><Target size={22} /> {t("onbGoalsTitle")}</div>
            <p className="fw-onb-lead">{t("onbGoalsLead")}</p>
            <div className="fw-templates">
              {TEMPLATES.map(tmpl => {
                const on = !!picked.find(p => p.name === tmpl.name);
                const [c1, c2] = ACCENTS[tmpl.color];
                const I = tmpl.icon;
                return (
                  <button key={tmpl.name} onClick={() => toggle(tmpl)}
                    className={on ? "fw-tmpl on" : "fw-tmpl"}
                    style={on ? { background:`linear-gradient(135deg,${c1},${c2})`, color:"#fff", borderColor:"transparent" } : {}}>
                    <I size={18} /><span>{tmpl.name}</span>
                    <small>{tmpl.perWeek}×/Woche · {tmpl.durationMin}min</small>
                  </button>
                );
              })}
            </div>
            <div className="fw-onb-row">
              <button className="fw-btn ghost" onClick={() => setStep(0)}>{t("onbBack")}</button>
              <button className="fw-btn solid" disabled={!picked.length} onClick={() => setStep(2)}>
                {t("onbMore")} <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}

        {/* Step 2 — Wake time */}
        {step === 2 && (
          <>
            <div className="fw-onb-h"><Clock size={22} /> {t("onbWhenTitle")}</div>
            <p className="fw-onb-lead">{t("onbWhenLead")}</p>
            <div className="fw-wake">
              <label>{t("wakeStart")}
                <input type="number" min="0" max="23" value={wake.start}
                  onChange={e => setWake({ ...wake, start:+e.target.value })} /> Uhr
              </label>
              <label>{t("wakeEnd")}
                <input type="number" min="1" max="24" value={wake.end}
                  onChange={e => setWake({ ...wake, end:+e.target.value })} /> Uhr
              </label>
            </div>
            <div className="fw-onb-row">
              <button className="fw-btn ghost" onClick={() => setStep(1)}>{t("onbBack")}</button>
              <button className="fw-btn solid" onClick={() =>
                onDone(picked, { wakeStart:wake.start*60, wakeEnd:wake.end*60, busy:[] })}>
                {t("onbGo")} <Sparkles size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* -------------------------------- today ---------------------------------- */
function TodayView({ goals, sessions, stats, level, setActive, completeSession, skipSession, goalById }) {
  const t = useT();
  const di = todayIndex();
  const todays = sessions.filter(s => s.day === di && s.status !== "skipped").sort((a,b) => a.start - b.start);
  const doneToday = todays.filter(s => s.status === "done").length;
  const progress = todays.length ? doneToday / todays.length : 0;
  const next = todays.find(s => s.status !== "done");
  return (
    <div className="fw-stack">
      <section className="fw-hero">
        <Ring value={progress} from="#7c5cff" to="#36c5ff">
          <div className="fw-hero-center">
            <div className="fw-hero-pct">{Math.round(progress*100)}%</div>
            <div className="fw-hero-lbl">{doneToday}/{todays.length} {t("navToday").toLowerCase()}</div>
          </div>
        </Ring>
        <div className="fw-hero-meta">
          <div className="fw-stat"><Trophy size={16} />{t("xpStat", stats.xp, level)}</div>
          <div className="fw-stat"><Flame  size={16} />{t("streakStat", Math.max(0,...Object.values(stats.streaks||{}),0))}</div>
          <div className="fw-stat"><Check  size={16} />{t("doneStat", stats.done)}</div>
        </div>
      </section>
      {next ? (
        <NextCard sess={next} goal={goalById(next.goalId)} onStart={() => setActive(next)} onDone={() => completeSession(next)} />
      ) : (
        <div className="fw-empty">
          <Sparkles size={28} />
          <strong>{todays.length ? t("allDone") : t("nothingToday")}</strong>
          <span>{todays.length ? t("allDoneHint") : t("nothingHint")}</span>
        </div>
      )}
      {todays.length > 0 && (
        <section>
          <div className="fw-section-h">{t("navToday")}</div>
          {todays.map(s => (
            <SessionRow key={s.id} sess={s} goal={goalById(s.goalId)}
              onStart={() => setActive(s)} onDone={() => completeSession(s)} onSkip={() => skipSession(s)} />
          ))}
        </section>
      )}
    </div>
  );
}

function NextCard({ sess, goal, onStart, onDone }) {
  const t = useT();
  if (!goal) return null;
  const [c1, c2] = ACCENTS[goal.color];
  const I = TYPES[goal.type].icon;
  return (
    <div className="fw-next" style={{ background:`linear-gradient(135deg,${c1},${c2})` }}>
      <div className="fw-next-top">
        <span className="fw-next-eyebrow">{t("nextUp")}</span>
        <span className="fw-next-time"><Clock size={14} /> {minToLabel(sess.start)}</span>
      </div>
      <div className="fw-next-title"><I size={24} /> {goal.name}</div>
      <div className="fw-next-meta">{sess.durationMin} min · {TYPES[goal.type].label}</div>
      <div className="fw-next-btns">
        <button className="fw-btn white" onClick={onStart}><Play size={18} /> {t("start")}</button>
        <button className="fw-btn glass" onClick={onDone}><Check size={18} /> {t("done")}</button>
      </div>
    </div>
  );
}

function SessionRow({ sess, goal, onStart, onDone, onSkip, compact }) {
  const t = useT();
  if (!goal) return null;
  const [c1, c2] = ACCENTS[goal.color];
  const I = TYPES[goal.type].icon;
  const done = sess.status === "done";
  return (
    <div className={done ? "fw-row done" : "fw-row"}>
      <div className="fw-row-ico" style={{ background:`linear-gradient(135deg,${c1},${c2})` }}><I size={18} /></div>
      <div className="fw-row-body">
        <div className="fw-row-title">{goal.name}</div>
        <div className="fw-row-sub">{minToLabel(sess.start)} · {sess.durationMin} min</div>
      </div>
      {done ? (
        <div className="fw-row-check"><Check size={18} /></div>
      ) : (
        <div className="fw-row-actions">
          {!compact && <button className="fw-mini" onClick={onStart} aria-label={t("start")}><Play size={16} /></button>}
          <button className="fw-mini ok" onClick={onDone} aria-label={t("done")}><Check size={16} /></button>
          {onSkip && <button className="fw-mini no" onClick={onSkip} aria-label={t("skip")}><X size={16} /></button>}
        </div>
      )}
    </div>
  );
}

/* --------------------------------- week ---------------------------------- */
function WeekView({ goals, sessions, runPlan, acceptAll, acceptSuggestion, skipSession,
  rescheduleSession, removeSession, completeSession, setActive, goalById }) {
  const t = useT();
  const hasSuggestions = sessions.some(s => s.status === "suggested");
  const planned = sessions.filter(s => s.status === "planned" || s.status === "done");
  return (
    <div className="fw-stack">
      <div className="fw-week-bar">
        <button className="fw-btn solid" onClick={runPlan}><Sparkles size={16} /> {t("planWeek")}</button>
        <button className="fw-btn ghost" onClick={() => downloadIcs(planned, goals)} disabled={!planned.length}>
          <Download size={15} /> .ics
        </button>
      </div>
      {hasSuggestions && (
        <div className="fw-suggest-banner">
          <span><Sparkles size={15} /> {t("suggestBanner")}</span>
          <button className="fw-btn solid sm" onClick={acceptAll}>{t("acceptAll")}</button>
        </div>
      )}
      {t("daysFull").map((dayName, i) => {
        const day = sessions.filter(s => s.day === i && s.status !== "skipped").sort((a,b) => a.start - b.start);
        const isToday = i === todayIndex();
        return (
          <section key={i} className={isToday ? "fw-day today" : "fw-day"}>
            <div className="fw-day-h">
              <span>{dayName}</span>
              {isToday && <em>{t("navToday")}</em>}
            </div>
            {day.length === 0 ? <div className="fw-day-empty">{t("free")}</div> : (
              day.map(s => {
                const goal = goalById(s.goalId);
                if (!goal) return null;
                const [c1, c2] = ACCENTS[goal.color];
                const I = TYPES[goal.type].icon;
                const suggested = s.status === "suggested";
                return (
                  <div key={s.id} className={suggested ? "fw-week-card suggested" : "fw-week-card"}>
                    <div className="fw-wc-ico" style={{ background:`linear-gradient(135deg,${c1},${c2})` }}><I size={16}/></div>
                    <div className="fw-wc-body">
                      <div className="fw-wc-title">{goal.name}{s.status==="done"&&<Check size={14}/>}</div>
                      <div className="fw-wc-sub">{minToLabel(s.start)} · {s.durationMin} min</div>
                    </div>
                    <div className="fw-wc-actions">
                      {suggested ? (
                        <>
                          <a className="fw-mini g" href={googleLink(s,goal.name)} target="_blank" rel="noreferrer"><Calendar size={15}/></a>
                          <button className="fw-mini" onClick={() => rescheduleSession(s)}><RotateCw size={15}/></button>
                          <button className="fw-mini ok" onClick={() => acceptSuggestion(s.id)}><Check size={15}/></button>
                          <button className="fw-mini no" onClick={() => removeSession(s.id)}><X size={15}/></button>
                        </>
                      ) : s.status === "done" ? (
                        <a className="fw-mini g" href={googleLink(s,goal.name)} target="_blank" rel="noreferrer"><Calendar size={15}/></a>
                      ) : (
                        <>
                          <a className="fw-mini g" href={googleLink(s,goal.name)} target="_blank" rel="noreferrer"><Calendar size={15}/></a>
                          <button className="fw-mini" onClick={() => setActive(s)}><Play size={15}/></button>
                          <button className="fw-mini ok" onClick={() => completeSession(s)}><Check size={15}/></button>
                          <button className="fw-mini no" onClick={() => skipSession(s)}><X size={15}/></button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </section>
        );
      })}
    </div>
  );
}

/* --------------------------------- goals --------------------------------- */
function GoalsView({ goals, setGoals, stats, weekHistory }) {
  const t = useT();
  const [adding, setAdding] = useState(false);
  const update = (id, patch) => setGoals(goals.map(g => g.id === id ? { ...g, ...patch } : g));
  const remove = (id) => setGoals(goals.filter(g => g.id !== id));
  const add = (g) => { setGoals([...goals, g]); setAdding(false); };
  const badges = computeBadges(stats, t);
  return (
    <div className="fw-stack">
      <StatsSection weekHistory={weekHistory} />
      <section className="fw-badges">
        <div className="fw-section-h"><Award size={16} /> {t("achievements")}</div>
        <div className="fw-badge-grid">
          {badges.map(b => (
            <div key={b.name} className={b.got ? "fw-badge got" : "fw-badge"}>
              <b.icon size={18}/><span>{b.name}</span>
            </div>
          ))}
        </div>
      </section>
      <div className="fw-section-h between">
        <span><Target size={16} /> {t("goalsTitle")}</span>
        <button className="fw-btn ghost sm" onClick={() => setAdding(v => !v)}><Plus size={15} /> {t("newGoal")}</button>
      </div>
      {adding && <GoalEditor onSave={add} onCancel={() => setAdding(false)} />}
      {goals.map(g => {
        const [c1, c2] = ACCENTS[g.color];
        const I = TYPES[g.type].icon;
        const streak = stats.streaks?.[g.id] || 0;
        return (
          <div key={g.id} className="fw-goal-card">
            <div className="fw-goal-top">
              <div className="fw-goal-ico" style={{ background:`linear-gradient(135deg,${c1},${c2})` }}><I size={18}/></div>
              <input className="fw-goal-name" value={g.name} onChange={e => update(g.id,{name:e.target.value})} />
              {streak > 0 && <span className="fw-goal-streak"><Flame size={13}/> {streak}</span>}
              <button className="fw-mini no" onClick={() => remove(g.id)}><Trash2 size={15}/></button>
            </div>
            <div className="fw-goal-grid">
              <label>{t("perWeekLabel")}<input type="number" min="1" max="7" value={g.perWeek} onChange={e=>update(g.id,{perWeek:+e.target.value})}/></label>
              <label>{t("minutesLabel")}<input type="number" min="5" step="5" value={g.durationMin} onChange={e=>update(g.id,{durationMin:+e.target.value})}/></label>
              <label>{t("timeLabel")}
                <select value={g.pref} onChange={e=>update(g.id,{pref:e.target.value})}>
                  {Object.entries(t("prefs")).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                </select>
              </label>
            </div>
            <div className="fw-goal-colors">
              {ACCENT_KEYS.map(k=>(
                <button key={k} onClick={()=>update(g.id,{color:k})}
                  className={g.color===k?"fw-dot sel":"fw-dot"}
                  style={{ background:`linear-gradient(135deg,${ACCENTS[k][0]},${ACCENTS[k][1]})` }} aria-label={k}/>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GoalEditor({ onSave, onCancel }) {
  const t = useT();
  const [f, setF] = useState({ name:"", type:"habit", color:"violet", perWeek:3, durationMin:30, pref:"any" });
  return (
    <div className="fw-goal-card">
      <input className="fw-goal-name solo" placeholder={t("goalPlaceholder")} value={f.name}
        onChange={e => setF({...f, name:e.target.value})} />
      <div className="fw-goal-grid">
        <label>{t("typeLabel")}
          <select value={f.type} onChange={e=>setF({...f,type:e.target.value})}>
            {Object.entries(t("types")).map(([k,v])=><option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label>{t("perWeekLabel")}<input type="number" min="1" max="7" value={f.perWeek} onChange={e=>setF({...f,perWeek:+e.target.value})}/></label>
        <label>{t("minutesLabel")}<input type="number" min="5" step="5" value={f.durationMin} onChange={e=>setF({...f,durationMin:+e.target.value})}/></label>
      </div>
      <div className="fw-goal-colors">
        {ACCENT_KEYS.map(k=>(
          <button key={k} onClick={()=>setF({...f,color:k})} className={f.color===k?"fw-dot sel":"fw-dot"}
            style={{ background:`linear-gradient(135deg,${ACCENTS[k][0]},${ACCENTS[k][1]})` }} aria-label={k}/>
        ))}
      </div>
      <div className="fw-onb-row">
        <button className="fw-btn ghost" onClick={onCancel}>{t("cancel")}</button>
        <button className="fw-btn solid" disabled={!f.name.trim()} onClick={()=>onSave({...f,id:uid()})}>{t("addGoal")}</button>
      </div>
    </div>
  );
}

function computeBadges(stats, t) {
  const maxStreak = Math.max(0, ...Object.values(stats.streaks||{}), 0);
  return [
    { name:t("badge1"), icon:Check,   got:stats.done>=1 },
    { name:t("badge2"), icon:Dumbbell,got:stats.done>=5 },
    { name:t("badge3"), icon:Flame,   got:maxStreak>=3 },
    { name:t("badge4"), icon:Sun,     got:!!stats.morningDone },
    { name:t("badge5"), icon:Trophy,  got:levelFromXp(stats.xp)>=5 },
    { name:t("badge6"), icon:Sparkles,got:stats.xp>=100 },
  ];
}

function StatsSection({ weekHistory }) {
  const t = useT();
  return (
    <section className="fw-panel">
      <div className="fw-section-h"><BarChart2 size={16} /> {t("history")}</div>
      {weekHistory.length === 0 ? (
        <div className="fw-day-empty">{t("noHistory")}</div>
      ) : (
        <div className="fw-stats-list">
          {weekHistory.map(w => (
            <div key={w.weekKey} className="fw-stats-row">
              <div className="fw-stats-label">{formatWeekKey(w.weekKey)}</div>
              <div className="fw-stats-bar-wrap">
                <div className="fw-stats-bar" style={{ width:`${Math.round(w.rate*100)}%`, background:`linear-gradient(90deg,${rateColor(w.rate)})` }} />
              </div>
              <div className="fw-stats-meta">
                <span className="fw-stats-pct">{Math.round(w.rate*100)}%</span>
                <span className="fw-stats-count">{w.done}/{w.planned}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* NEW: Weekly review modal */
function WeekReviewModal({ summary, onContinue }) {
  const t = useT();
  const { planned, done, rate, bonus, weekKey } = summary;
  const [c1, c2] = rate >= 0.8 ? ACCENTS.green : rate >= 0.5 ? ACCENTS.violet : ACCENTS.coral;
  return (
    <div className="fw-overlay">
      <div className="fw-review">
        <div className="fw-review-badge" style={{ background:`linear-gradient(135deg,${c1},${c2})` }}><Trophy size={28}/></div>
        <div className="fw-review-week">{t("reviewTitle", weekKey)}</div>
        <div className="fw-review-headline">{t("rateLabel", rate)}</div>
        <div className="fw-review-ring">
          <Ring value={rate} size={120} stroke={12} from={c1} to={c2}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Outfit'", fontWeight:800, fontSize:26 }}>{Math.round(rate*100)}%</div>
              <div style={{ fontSize:11, color:"var(--muted)" }}>{done}/{planned}</div>
            </div>
          </Ring>
        </div>
        <div className="fw-review-stats">
          <div className="fw-review-stat"><Check size={16}/><span>{done} erledigt</span></div>
          <div className="fw-review-stat"><X size={16}/><span>{planned-done} ausgelassen</span></div>
        </div>
        <div className="fw-review-bonus" style={{ background:`linear-gradient(135deg,${c1}22,${c2}22)`, borderColor:c1 }}>
          <Sparkles size={16} style={{ color:c1 }}/>
          <span>{t("reviewBonus", bonus)}</span>
        </div>
        <button className="fw-btn solid wide" style={{ marginTop:18 }} onClick={onContinue}>
          {t("reviewNewWeek")} <ArrowRight size={18}/>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- settings -------------------------------- */
function SettingsView({ availability, setAvailability, pomo, setPomo, dark, setDark,
  notificationsEnabled, setNotificationsEnabled, requestNotifPermission, lang, setLang,
  user, skippedAuth, handleSkipAuth, reset }) {
  const t = useT();
  const [busy, setBusy] = useState({ day:0, start:"9", end:"17", label:"", recurring:true });
  const addBusy = () => {
    if (+busy.end <= +busy.start) return;
    setAvailability({ ...availability, busy:[...availability.busy, { day:busy.day, start:+busy.start*60, end:+busy.end*60, label:busy.label||"Termin", recurring:busy.recurring }] });
    setBusy({ ...busy, label:"" });
  };
  const removeBusy = (i) => setAvailability({ ...availability, busy:availability.busy.filter((_,x)=>x!==i) });
  const canNotify = typeof window!=="undefined" && "Notification" in window;

  return (
    <div className="fw-stack">
      {/* Wachzeiten */}
      <section className="fw-panel">
        <div className="fw-section-h"><Clock size={16}/> {t("wakeTitle")}</div>
        <div className="fw-wake">
          <label>{t("wakeStart")} <input type="number" min="0" max="23" value={availability.wakeStart/60}
            onChange={e=>setAvailability({...availability,wakeStart:+e.target.value*60})}/> Uhr</label>
          <label>{t("wakeEnd")} <input type="number" min="1" max="24" value={availability.wakeEnd/60}
            onChange={e=>setAvailability({...availability,wakeEnd:+e.target.value*60})}/> Uhr</label>
        </div>
      </section>

      {/* Sperrzeiten */}
      <section className="fw-panel">
        <div className="fw-section-h"><Calendar size={16}/> {t("blockedTitle")}</div>
        {availability.busy.length===0 && <div className="fw-day-empty">{t("noBlocked")}</div>}
        {availability.busy.map((b,i)=>(
          <div className="fw-busy-row" key={i}>
            <span>{b.recurring && <span className="fw-recurring-badge"><RotateCw size={11}/></span>}{t("daysFull")[b.day]} · {minToLabel(b.start)}–{minToLabel(b.end)} · {b.label}</span>
            <button className="fw-mini no" onClick={()=>removeBusy(i)}><Trash2 size={14}/></button>
          </div>
        ))}
        <div className="fw-busy-add">
          <select value={busy.day} onChange={e=>setBusy({...busy,day:+e.target.value})}>
            {t("daysFull").map((d,i)=><option key={i} value={i}>{d}</option>)}
          </select>
          <input type="number" min="0" max="23" value={busy.start} onChange={e=>setBusy({...busy,start:e.target.value})}/>
          <input type="number" min="1" max="24" value={busy.end} onChange={e=>setBusy({...busy,end:e.target.value})}/>
          <input placeholder="Label" value={busy.label} onChange={e=>setBusy({...busy,label:e.target.value})}/>
          <button className="fw-mini ok" onClick={addBusy}><Plus size={15}/></button>
        </div>
        <div className="fw-busy-recurring">
          <label className="fw-recurring-label">
            <input type="checkbox" checked={busy.recurring} onChange={e=>setBusy({...busy,recurring:e.target.checked})}/>
            <RotateCw size={13}/> {t("recurringLabel")}
          </label>
        </div>
      </section>

      {/* Pomodoro */}
      <section className="fw-panel">
        <div className="fw-section-h"><Brain size={16}/> {t("pomoTitle")}</div>
        <div className="fw-wake">
          <label>{t("workLabel")} <input type="number" min="5" max="90" value={pomo.work} onChange={e=>setPomo({...pomo,work:+e.target.value})}/> min</label>
          <label>{t("brkLabel")} <input type="number" min="1" max="30" value={pomo.brk} onChange={e=>setPomo({...pomo,brk:+e.target.value})}/> min</label>
        </div>
      </section>

      {/* Notifications */}
      <section className="fw-panel">
        <div className="fw-section-h"><Bell size={16}/> {t("notifTitle")}</div>
        <p style={{ color:"var(--muted)", fontSize:13, margin:"0 0 12px" }}>{t("notifHint")}</p>
        {notificationsEnabled ? (
          <div className="fw-notif-active">
            <Bell size={15}/> {t("notifActive")}
            <button className="fw-btn ghost sm" style={{ marginLeft:"auto" }} onClick={()=>setNotificationsEnabled(false)}>
              <BellOff size={14}/> {t("notifDisable")}
            </button>
          </div>
        ) : (
          <button className="fw-btn solid wide" onClick={requestNotifPermission} disabled={!canNotify}>
            <Bell size={16}/> {canNotify ? t("notifEnable") : t("notifUnsupported")}
          </button>
        )}
      </section>

      {/* Sprache */}
      <section className="fw-panel">
        <div className="fw-section-h"><Globe size={16}/> {t("langTitle")}</div>
        <div className="fw-lang-row">
          {["de","en"].map(l => (
            <button key={l} className={lang===l ? "fw-lang-btn active" : "fw-lang-btn"} onClick={()=>setLang(l)}>
              {l === "de" ? "🇩🇪 Deutsch" : "🇬🇧 English"}
            </button>
          ))}
        </div>
      </section>

      {/* Konto */}
      <section className="fw-panel">
        <div className="fw-section-h"><User size={16}/> {t("accountTitle")}</div>
        {!fbReady ? (
          <div className="fw-day-empty">{t("notConfigured")}</div>
        ) : user ? (
          <>
            <div className="fw-account-row">
              {user.photoURL && <img src={user.photoURL} className="fw-account-avatar" alt="" />}
              <div>
                <div style={{ fontWeight:700, fontSize:14 }}>{user.displayName || user.email}</div>
                <div style={{ fontSize:12, color:"var(--muted)" }}>{t("cloudHint")}</div>
              </div>
            </div>
            <button className="fw-btn ghost wide" style={{ marginTop:10 }} onClick={()=>signOutUser()}>
              <LogOut size={15}/> {t("signOut")}
            </button>
          </>
        ) : (
          <>
            <div className="fw-day-empty" style={{ marginBottom:10 }}>{t("signInSection")}</div>
            <button className="fw-login-google" onClick={async()=>{ try{await signInGoogle();}catch{}}}>
              <GoogleSvg/> {t("authGoogle")}
            </button>
          </>
        )}
      </section>

      {/* Dark mode */}
      <section className="fw-panel">
        <div className="fw-toggle-row">
          <span>{t("darkMode")}</span>
          <button className={dark?"fw-switch on":"fw-switch"} onClick={()=>setDark(d=>!d)}><i/></button>
        </div>
      </section>

      <button className="fw-btn danger wide" onClick={()=>{ if(confirm(t("resetConfirm"))) reset(); }}>
        <Trash2 size={15}/> {t("resetAll")}
      </button>
      <div className="fw-foot">{t("storageNote")}</div>
    </div>
  );
}

/* ------------------------------- timer ----------------------------------- */
function TimerOverlay({ sess, goal, pomo, onClose, onComplete }) {
  const t = useT();
  const type = goal ? TYPES[goal.type].timer : "countdown";
  const isPomo = type === "pomodoro";
  const totalTarget = sess.durationMin * 60;
  const [running, setRunning]   = useState(true);
  const [phase, setPhase]       = useState("work");
  const [left, setLeft]         = useState(isPomo ? pomo.work*60 : sess.durationMin*60);
  const [workDone, setWorkDone] = useState(0);

  useEffect(() => {
    if (!running) return;
    const tick = setInterval(() => {
      setLeft(l => {
        if (l > 1) {
          if (isPomo && phase==="work") setWorkDone(w=>w+1);
          return l - 1;
        }
        if (!isPomo) { setRunning(false); return 0; }
        if (phase==="work") {
          const nd = workDone+1;
          setWorkDone(nd);
          if (nd >= totalTarget) { setRunning(false); return 0; }
          setPhase("break"); return pomo.brk*60;
        } else { setPhase("work"); return pomo.work*60; }
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [running, phase, isPomo, pomo.work, pomo.brk, workDone, totalTarget]);

  const finished = !isPomo ? left===0 : workDone>=totalTarget;
  const [c1, c2] = goal ? ACCENTS[goal.color] : ACCENTS.violet;
  const progress = isPomo ? Math.min(1, workDone/totalTarget) : 1 - left/(sess.durationMin*60);
  const mm = Math.floor(left/60), ss = left%60;

  return (
    <div className="fw-overlay">
      <div className="fw-timer">
        <button className="fw-overlay-close" onClick={onClose}><X size={20}/></button>
        <div className="fw-timer-eyebrow">
          {goal?.name}{isPomo && <span className={phase==="work"?"fw-phase work":"fw-phase brk"}>{phase==="work" ? t("focusLabel") : t("breakLabel")}</span>}
        </div>
        <Ring value={progress} size={240} stroke={16} from={c1} to={c2}>
          <div className="fw-timer-center">
            <div className="fw-timer-time">{pad(mm)}:{pad(ss)}</div>
            {isPomo && <div className="fw-timer-sub">{Math.floor(workDone/60)}/{sess.durationMin} min {t("focusLabel")}</div>}
          </div>
        </Ring>
        <div className="fw-timer-btns">
          {!finished ? (
            <>
              <button className="fw-btn ghost" onClick={()=>setRunning(r=>!r)}>
                {running ? <><Pause size={18}/> {t("pauseBtn")}</> : <><Play size={18}/> {t("resumeBtn")}</>}
              </button>
              <button className="fw-btn solid" onClick={()=>onComplete(sess)}><Check size={18}/> {t("done")}</button>
            </>
          ) : (
            <button className="fw-btn solid wide pulse" onClick={()=>onComplete(sess)}>
              <Check size={18}/> {t("collectXp")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- css ----------------------------------- */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');
.fw{
  --bg1:#fdf7ff; --bg2:#eaeeff; --card:#ffffff; --card2:#f7f5fd;
  --text:#1d1b2e; --muted:#6f6b86; --line:#ece8f6; --shadow:0 10px 30px rgba(60,40,120,.10);
  font-family:'Inter',system-ui,sans-serif; color:var(--text);
  min-height:100vh; background:linear-gradient(165deg,var(--bg1),var(--bg2)); position:relative;
  -webkit-font-smoothing:antialiased;
}
.fw-dark{
  --bg1:#15131f; --bg2:#0c1124; --card:#1c1a2b; --card2:#211e30;
  --text:#f2f0fb; --muted:#a39fbb; --line:#2c2942; --shadow:0 12px 34px rgba(0,0,0,.5);
}
.fw *{box-sizing:border-box}
.fw-shell{max-width:560px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column}
.fw-main{flex:1;padding:14px 16px 92px}
.fw-stack>*+*{margin-top:14px}

/* header */
.fw-header{display:flex;justify-content:space-between;align-items:center;padding:16px 18px 8px;max-width:560px;margin:0 auto;width:100%}
.fw-logo{font-family:'Outfit';font-weight:800;font-size:22px;letter-spacing:-.5px}
.fw-logo span{background:linear-gradient(90deg,#7c5cff,#36c5ff);-webkit-background-clip:text;background-clip:text;color:transparent}
.fw-logo.big{font-size:34px}
.fw-sub{color:var(--muted);font-size:12.5px;margin-top:2px}
.fw-header-right{display:flex;align-items:center;gap:10px}
.fw-levelpill{display:flex;align-items:center;gap:6px;font-weight:700;font-size:12.5px;background:var(--card);padding:7px 11px;border-radius:999px;box-shadow:var(--shadow);font-family:'Outfit'}
.fw-levelpill svg{color:#ffb020}
.fw-xpmini{width:64px}
.fw-icon-btn{border:none;background:var(--card);width:38px;height:38px;border-radius:12px;display:grid;place-items:center;color:var(--text);box-shadow:var(--shadow);cursor:pointer}

/* nav */
.fw-nav{position:fixed;bottom:0;left:0;right:0;max-width:560px;margin:0 auto;background:var(--card);
  border-top:1px solid var(--line);display:flex;justify-content:space-around;padding:8px 6px 10px;backdrop-filter:blur(8px);z-index:20}
.fw-navi{flex:1;border:none;background:none;display:flex;flex-direction:column;align-items:center;gap:3px;
  color:var(--muted);font-size:11px;font-weight:600;cursor:pointer;padding:4px;border-radius:12px;transition:.2s}
.fw-navi.active{color:#7c5cff}
.fw-navi.active svg{transform:translateY(-1px)}

/* hero */
.fw-hero{background:var(--card);border-radius:24px;padding:22px;box-shadow:var(--shadow);display:flex;gap:18px;align-items:center}
.fw-hero-center{text-align:center}
.fw-hero-pct{font-family:'Outfit';font-weight:800;font-size:30px;line-height:1}
.fw-hero-lbl{color:var(--muted);font-size:12px;margin-top:3px}
.fw-hero-meta{flex:1;display:flex;flex-direction:column;gap:9px}
.fw-stat{display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:600}
.fw-stat svg{color:#7c5cff}

/* next card */
.fw-next{border-radius:24px;padding:20px;color:#fff;box-shadow:var(--shadow)}
.fw-next-top{display:flex;justify-content:space-between;align-items:center;opacity:.95}
.fw-next-eyebrow{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;opacity:.85}
.fw-next-time{display:flex;align-items:center;gap:5px;font-size:13px;font-weight:600}
.fw-next-title{font-family:'Outfit';font-weight:800;font-size:25px;display:flex;align-items:center;gap:10px;margin-top:8px}
.fw-next-meta{opacity:.9;font-size:13.5px;margin-top:2px}
.fw-next-btns{display:flex;gap:10px;margin-top:16px}

/* rows */
.fw-section-h{font-family:'Outfit';font-weight:700;font-size:15px;margin:4px 2px 10px;display:flex;align-items:center;gap:7px}
.fw-section-h.between{justify-content:space-between}
.fw-section-h svg{color:#7c5cff}
.fw-row{display:flex;align-items:center;gap:12px;background:var(--card);border-radius:16px;padding:11px 13px;box-shadow:var(--shadow);margin-bottom:9px}
.fw-row.done{opacity:.58}
.fw-row-ico{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;color:#fff;flex-shrink:0}
.fw-row-body{flex:1;min-width:0}
.fw-row-title{font-weight:700;font-size:14.5px}
.fw-row-sub{color:var(--muted);font-size:12.5px}
.fw-row-actions{display:flex;gap:6px}
.fw-row-check{width:30px;height:30px;border-radius:9px;background:#18c29c;color:#fff;display:grid;place-items:center}
.fw-mini{border:none;width:32px;height:32px;border-radius:10px;background:var(--card2);color:var(--text);display:grid;place-items:center;cursor:pointer;transition:.15s;text-decoration:none}
.fw-mini:hover{transform:translateY(-1px)}
.fw-mini.ok{background:#18c29c;color:#fff}
.fw-mini.no{background:rgba(255,90,90,.14);color:#ff5a5a}
.fw-mini.g{background:rgba(124,92,255,.14);color:#7c5cff}

/* empty */
.fw-empty{background:var(--card);border-radius:24px;padding:30px 22px;text-align:center;box-shadow:var(--shadow);display:flex;flex-direction:column;align-items:center;gap:7px}
.fw-empty svg{color:#7c5cff}
.fw-empty strong{font-family:'Outfit';font-size:17px}
.fw-empty span{color:var(--muted);font-size:13px}

/* week */
.fw-week-bar{display:flex;justify-content:space-between;align-items:center}
.fw-suggest-banner{display:flex;justify-content:space-between;align-items:center;gap:10px;background:rgba(124,92,255,.12);border:1px solid rgba(124,92,255,.25);border-radius:16px;padding:11px 14px;font-size:13px;font-weight:600;color:#7c5cff}
.fw-suggest-banner span{display:flex;align-items:center;gap:7px}
.fw-day{background:var(--card);border-radius:18px;padding:13px 14px;box-shadow:var(--shadow)}
.fw-day.today{outline:2px solid rgba(124,92,255,.4)}
.fw-day-h{display:flex;justify-content:space-between;align-items:center;font-family:'Outfit';font-weight:700;font-size:14px;margin-bottom:9px}
.fw-day-h em{font-style:normal;font-size:11px;font-weight:700;color:#7c5cff;background:rgba(124,92,255,.12);padding:2px 8px;border-radius:999px}
.fw-day-empty{color:var(--muted);font-size:12.5px;padding:3px 2px}
.fw-week-card{display:flex;align-items:center;gap:11px;padding:8px 4px;border-bottom:1px solid var(--line)}
.fw-week-card:last-child{border-bottom:none}
.fw-week-card.suggested .fw-wc-title{font-style:italic}
.fw-wc-ico{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;color:#fff;flex-shrink:0}
.fw-wc-body{flex:1;min-width:0}
.fw-wc-title{font-weight:700;font-size:13.5px;display:flex;align-items:center;gap:5px}
.fw-wc-title svg{color:#18c29c}
.fw-wc-sub{color:var(--muted);font-size:12px}
.fw-wc-actions{display:flex;gap:5px}

/* goals */
.fw-badges .fw-badge-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}
.fw-badge{background:var(--card);border-radius:14px;padding:13px 8px;text-align:center;box-shadow:var(--shadow);opacity:.45;display:flex;flex-direction:column;align-items:center;gap:6px;font-size:11px;font-weight:600}
.fw-badge svg{color:var(--muted)}
.fw-badge.got{opacity:1}
.fw-badge.got svg{color:#ffb020}
.fw-goal-card{background:var(--card);border-radius:18px;padding:15px;box-shadow:var(--shadow)}
.fw-goal-top{display:flex;align-items:center;gap:10px}
.fw-goal-ico{width:36px;height:36px;border-radius:11px;display:grid;place-items:center;color:#fff;flex-shrink:0}
.fw-goal-name{flex:1;border:none;background:none;font-family:'Outfit';font-weight:700;font-size:16px;color:var(--text);min-width:0;border-bottom:1.5px solid transparent;padding:2px 0}
.fw-goal-name:focus{outline:none;border-bottom-color:#7c5cff}
.fw-goal-name.solo{width:100%;border-bottom:1.5px solid var(--line);margin-bottom:12px}
.fw-goal-streak{display:flex;align-items:center;gap:3px;font-size:12px;font-weight:700;color:#ff7a45}
.fw-goal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:13px}
.fw-goal-grid label,.fw-wake label{display:flex;flex-direction:column;gap:5px;font-size:11.5px;font-weight:600;color:var(--muted)}
.fw-goal-grid input,.fw-goal-grid select,.fw-wake input{border:1.5px solid var(--line);background:var(--card2);border-radius:10px;padding:8px;font-size:14px;color:var(--text);font-weight:600}
.fw-goal-grid input:focus,.fw-goal-grid select:focus,.fw-wake input:focus{outline:none;border-color:#7c5cff}
.fw-goal-colors{display:flex;gap:8px;margin-top:13px}
.fw-dot{width:26px;height:26px;border-radius:999px;border:2px solid transparent;cursor:pointer;padding:0}
.fw-dot.sel{border-color:var(--text);transform:scale(1.12)}

/* settings */
.fw-panel{background:var(--card);border-radius:18px;padding:15px;box-shadow:var(--shadow)}
.fw-wake{display:flex;gap:18px;align-items:flex-end}
.fw-wake input{width:62px;text-align:center}
.fw-busy-row{display:flex;justify-content:space-between;align-items:center;font-size:13px;padding:7px 0;border-bottom:1px solid var(--line)}
.fw-busy-add{display:flex;gap:6px;margin-top:11px;align-items:center;flex-wrap:wrap}
.fw-busy-add select,.fw-busy-add input{border:1.5px solid var(--line);background:var(--card2);border-radius:9px;padding:7px;font-size:13px;color:var(--text)}
.fw-busy-add input[type=number]{width:54px}
.fw-busy-add input:not([type]){flex:1;min-width:80px}
.fw-busy-recurring{margin-top:10px;padding-top:10px;border-top:1px solid var(--line)}
.fw-recurring-label{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:var(--muted);cursor:pointer}
.fw-recurring-label input[type=checkbox]{accent-color:#7c5cff;width:16px;height:16px}
.fw-recurring-badge{display:inline-flex;align-items:center;margin-right:5px;color:#7c5cff}
.fw-toggle-row{display:flex;justify-content:space-between;align-items:center;font-weight:600;font-size:14px}
.fw-switch{width:48px;height:28px;border-radius:999px;border:none;background:var(--line);position:relative;cursor:pointer;transition:.2s}
.fw-switch.on{background:linear-gradient(90deg,#7c5cff,#36c5ff)}
.fw-switch i{position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:999px;background:#fff;transition:.2s}
.fw-switch.on i{left:23px}
.fw-foot{text-align:center;color:var(--muted);font-size:11.5px;padding:6px 20px}
.fw-notif-active{display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:600;color:#18c29c;background:rgba(24,194,156,.1);border-radius:12px;padding:10px 12px}
.fw-lang-row{display:flex;gap:10px;margin-top:6px}
.fw-lang-btn{flex:1;border:1.5px solid var(--line);background:var(--card2);border-radius:12px;padding:10px;font-size:13.5px;font-weight:700;cursor:pointer;color:var(--text);transition:.15s}
.fw-lang-btn.active{border-color:#7c5cff;background:rgba(124,92,255,.12);color:#7c5cff}
.fw-account-row{display:flex;align-items:center;gap:12px}
.fw-account-avatar{width:40px;height:40px;border-radius:999px;object-fit:cover}

/* buttons */
.fw-btn{border:none;border-radius:13px;padding:11px 16px;font-size:14px;font-weight:700;font-family:'Outfit';cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:.18s}
.fw-btn:disabled{opacity:.4;cursor:not-allowed}
.fw-btn:not(:disabled):hover{transform:translateY(-1px)}
.fw-btn.solid{background:linear-gradient(135deg,#7c5cff,#4f7dff);color:#fff;box-shadow:0 8px 20px rgba(124,92,255,.35)}
.fw-btn.ghost{background:var(--card);color:var(--text);box-shadow:var(--shadow)}
.fw-btn.white{background:#fff;color:#1d1b2e}
.fw-btn.glass{background:rgba(255,255,255,.22);color:#fff;backdrop-filter:blur(4px)}
.fw-btn.danger{background:rgba(255,90,90,.13);color:#ff5a5a}
.fw-btn.wide{width:100%}
.fw-btn.sm{padding:8px 12px;font-size:12.5px}
.fw-btn.pulse{animation:fwpulse 1.4s infinite}

/* onboarding */
.fw-onb{min-height:100vh;display:grid;place-items:center;padding:20px}
.fw-onb-card{max-width:480px;width:100%;background:var(--card);border-radius:28px;padding:28px 24px;box-shadow:var(--shadow);position:relative;overflow:hidden}
.fw-onb-glow{position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:999px;background:radial-gradient(circle,#7c5cff44,transparent 70%)}
.fw-onb-lead{color:var(--muted);font-size:14px;line-height:1.55;margin:10px 0 18px}
.fw-onb-h{font-family:'Outfit';font-weight:800;font-size:22px;display:flex;align-items:center;gap:9px}
.fw-onb-h svg{color:#7c5cff}
.fw-templates{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}
.fw-tmpl{border:1.5px solid var(--line);background:var(--card2);border-radius:15px;padding:13px;cursor:pointer;display:flex;flex-direction:column;gap:4px;color:var(--text);transition:.18s;text-align:left}
.fw-tmpl svg{margin-bottom:2px}
.fw-tmpl span{font-weight:700;font-size:14px;font-family:'Outfit'}
.fw-tmpl small{font-size:11px;opacity:.7}
.fw-tmpl:hover{transform:translateY(-2px)}
.fw-onb-row{display:flex;gap:10px;justify-content:flex-end;margin-top:18px}

/* NEW: splash screen */
.fw-splash-icon-wrap{display:flex;justify-content:center;margin-bottom:12px}
.fw-splash-icon{width:76px;height:76px;border-radius:24px;background:linear-gradient(135deg,#7c5cff,#36c5ff);display:grid;place-items:center;color:#fff;font-family:'Outfit';font-weight:800;font-size:38px;box-shadow:0 12px 32px rgba(124,92,255,.4)}
.fw-splash-tagline{font-family:'Outfit';font-weight:800;font-size:30px;line-height:1.18;text-align:center;margin:6px 0 8px;letter-spacing:-.5px}
.fw-splash-feats{display:flex;flex-direction:column;gap:10px;margin:14px 0 20px}
.fw-splash-feat{display:flex;align-items:center;gap:12px;background:var(--card2);border-radius:14px;padding:11px 12px}
.fw-splash-feat-ico{width:36px;height:36px;border-radius:11px;display:grid;place-items:center;color:#fff;flex-shrink:0}
.fw-splash-feat-title{font-weight:700;font-size:13.5px;margin-bottom:2px}
.fw-splash-feat-desc{font-size:12px;color:var(--muted)}
.fw-splash-hint{text-align:center;color:var(--muted);font-size:12px;margin-top:8px}

/* login */
.fw-login-icon{width:56px;height:56px;border-radius:18px;background:linear-gradient(135deg,#7c5cff,#36c5ff);display:grid;place-items:center;color:#fff;margin:0 auto 12px}
.fw-login-title{font-family:'Outfit';font-weight:800;font-size:22px;text-align:center;margin:0 0 6px}
.fw-login-lead{color:var(--muted);font-size:13.5px;line-height:1.5;text-align:center;margin:0 0 18px}
.fw-login-google,.fw-login-apple{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;border-radius:14px;padding:13px 16px;font-weight:700;font-size:14.5px;cursor:pointer;transition:.18s;border:none;margin-bottom:10px}
.fw-login-google{border:1.5px solid var(--line);background:var(--card);color:var(--text)}
.fw-login-google:hover{border-color:#7c5cff;transform:translateY(-1px)}
.fw-login-apple{background:#1d1b2e;color:#fff}
.fw-dark .fw-login-apple{background:#f2f0fb;color:#1d1b2e}
.fw-login-apple:hover{transform:translateY(-1px);opacity:.92}
.fw-login-divider{display:flex;align-items:center;gap:12px;color:var(--muted);font-size:12px;margin:4px 0 12px}
.fw-login-divider::before,.fw-login-divider::after{content:'';flex:1;height:1px;background:var(--line)}
.fw-login-note{text-align:center;color:var(--muted);font-size:11.5px;margin-top:12px}

/* overlay / timer — FIXED: flex column + align center */
.fw-overlay{position:fixed;inset:0;background:rgba(20,16,40,.55);backdrop-filter:blur(10px);display:grid;place-items:center;z-index:50;padding:20px}
.fw-timer{background:var(--card);border-radius:30px;padding:30px 26px;box-shadow:var(--shadow);text-align:center;position:relative;max-width:380px;width:100%;display:flex;flex-direction:column;align-items:center}
.fw-overlay-close{position:absolute;top:16px;right:16px;border:none;background:var(--card2);width:36px;height:36px;border-radius:11px;display:grid;place-items:center;cursor:pointer;color:var(--text)}
.fw-timer-eyebrow{font-family:'Outfit';font-weight:700;font-size:18px;margin-bottom:18px;display:flex;align-items:center;justify-content:center;gap:9px;width:100%}
.fw-phase{font-size:11px;padding:3px 9px;border-radius:999px;font-weight:700}
.fw-phase.work{background:rgba(124,92,255,.15);color:#7c5cff}
.fw-phase.brk{background:rgba(24,194,156,.15);color:#18c29c}
.fw-timer-center{text-align:center}
.fw-timer-time{font-family:'Outfit';font-weight:800;font-size:48px;letter-spacing:-1px;font-variant-numeric:tabular-nums}
.fw-timer-sub{color:var(--muted);font-size:13px;margin-top:4px}
.fw-timer-btns{display:flex;gap:11px;margin-top:24px;justify-content:center;width:100%}

/* replan banner */
.fw-replan{position:fixed;bottom:84px;left:14px;right:14px;max-width:534px;margin:0 auto;background:var(--card);border-radius:18px;padding:14px 16px;box-shadow:var(--shadow);display:flex;justify-content:space-between;align-items:center;gap:12px;z-index:30;border:1.5px solid rgba(124,92,255,.3)}
.fw-replan strong{font-family:'Outfit';font-size:14px;display:block}
.fw-replan span{color:var(--muted);font-size:12.5px}
.fw-replan-btns{display:flex;gap:8px;flex-shrink:0}

/* toast */
.fw-toast{position:fixed;top:18px;left:50%;transform:translateX(-50%);background:#1d1b2e;color:#fff;padding:11px 18px;border-radius:13px;font-size:13.5px;font-weight:600;z-index:60;box-shadow:0 10px 30px rgba(0,0,0,.3);animation:fwtoast .3s;white-space:nowrap}
.fw-dark .fw-toast{background:#322e48}

/* weekly review */
.fw-review{background:var(--card);border-radius:30px;padding:28px 24px;box-shadow:var(--shadow);text-align:center;max-width:380px;width:100%}
.fw-review-badge{width:64px;height:64px;border-radius:20px;display:grid;place-items:center;color:#fff;margin:0 auto 14px}
.fw-review-week{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;margin-bottom:4px}
.fw-review-headline{font-family:'Outfit';font-weight:800;font-size:22px;margin-bottom:18px}
.fw-review-ring{display:flex;justify-content:center;margin-bottom:18px}
.fw-review-stats{display:flex;justify-content:center;gap:22px;margin-bottom:16px}
.fw-review-stat{display:flex;align-items:center;gap:6px;font-size:14px;font-weight:600}
.fw-review-stat svg{color:var(--muted)}
.fw-review-bonus{display:flex;align-items:center;justify-content:center;gap:8px;border:1.5px solid;border-radius:14px;padding:12px 16px;font-size:14px;font-weight:600}
.fw-review-bonus strong{font-size:16px}

/* long-term stats */
.fw-stats-list{display:flex;flex-direction:column;gap:10px;margin-top:4px}
.fw-stats-row{display:flex;align-items:center;gap:10px}
.fw-stats-label{font-size:12px;font-weight:700;color:var(--muted);width:48px;flex-shrink:0}
.fw-stats-bar-wrap{flex:1;height:10px;border-radius:999px;background:var(--line);overflow:hidden}
.fw-stats-bar{height:100%;border-radius:999px;transition:width .8s cubic-bezier(.2,.8,.2,1)}
.fw-stats-meta{display:flex;flex-direction:column;align-items:flex-end;gap:1px;width:38px;flex-shrink:0}
.fw-stats-pct{font-size:12px;font-weight:700}
.fw-stats-count{font-size:10px;color:var(--muted)}

/* confetti */
.fw-confetti{position:fixed;inset:0;pointer-events:none;z-index:80;overflow:hidden}
.fw-confetti span{position:absolute;top:-12px;width:9px;height:14px;border-radius:2px;animation:fwfall 1.4s ease-in forwards}
@keyframes fwfall{to{transform:translateY(105vh) rotate(540deg);opacity:.2}}
@keyframes fwpulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
@keyframes fwtoast{from{opacity:0;transform:translate(-50%,-10px)}to{opacity:1;transform:translate(-50%,0)}}
@media (prefers-reduced-motion:reduce){.fw *{animation:none!important;transition:none!important}}
`;
