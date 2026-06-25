import React, {
  useState, useEffect, useRef, useCallback, createContext, useContext,
} from "react";
import {
  Flame, Trophy, Play, Check, X, RotateCw, Calendar, Plus, Trash2,
  Settings as Cog, Target, Sparkles, Sun, Moon, Dumbbell, BookOpen,
  Brain, Droplet, Clock, Pause, Award, Download, ArrowRight,
  Bell, BellOff, BarChart2, Globe, User, LogOut,
  ChevronLeft, ChevronRight, ImageIcon,
  Star, Heart, Music, Coffee, Zap, Bike, Pencil, Leaf, Smile,
  Wind, Mail, Info, ChevronDown, ChevronUp,
  FileText, QrCode, NotebookPen, Smartphone,
} from "lucide-react";
import QRCode from "qrcode";
import { fbReady, onAuth, signInGoogle, signInApple, signInEmail, signUpEmail, signOutUser, loadCloud, saveCloud, deleteAccount, resetPassword } from "./firebase.js";

/* ----------------------------- design tokens ----------------------------- */
const ACCENTS = {
  coral:  ["#E9785A", "#E9785A"],
  violet: ["#8B7EC8", "#8B7EC8"],
  blue:   ["#5B8FA8", "#5B8FA8"],
  green:  ["#7FA08A", "#7FA08A"],
  amber:  ["#C49A5C", "#C49A5C"],
  pink:   ["#C47B8E", "#C47B8E"],
};
const ACCENT_KEYS = Object.keys(ACCENTS);

const TYPES = {
  sport: { label: "Sport",       icon: Dumbbell, timer: "countdown" },
  focus: { label: "Fokus",       icon: Brain,    timer: "pomodoro"  },
  habit: { label: "Gewohnheit",  icon: Sparkles, timer: "quick"     },
};

const TEMPLATES = [
  { name: "Workout",    type: "sport", color: "coral",  perWeek: 3, durationMin: 45, pref: "evening",   iconId: "dumbbell" },
  { name: "Laufen",     type: "sport", color: "blue",   perWeek: 3, durationMin: 30, pref: "morning",   iconId: "wind" },
  { name: "Lesen",      type: "focus", color: "violet", perWeek: 5, durationMin: 25, pref: "evening",   iconId: "book" },
  { name: "Lernen",     type: "focus", color: "amber",  perWeek: 4, durationMin: 50, pref: "afternoon", iconId: "brain" },
  { name: "Meditation", type: "habit", color: "green",  perWeek: 7, durationMin: 10, pref: "morning",   iconId: "leaf" },
];

const CUSTOM_ICONS = [
  { id:"star",     Ic: Star },
  { id:"heart",    Ic: Heart },
  { id:"zap",      Ic: Zap },
  { id:"flame",    Ic: Flame },
  { id:"music",    Ic: Music },
  { id:"coffee",   Ic: Coffee },
  { id:"book",     Ic: BookOpen },
  { id:"brain",    Ic: Brain },
  { id:"dumbbell", Ic: Dumbbell },
  { id:"bike",     Ic: Bike },
  { id:"droplet",  Ic: Droplet },
  { id:"pencil",   Ic: Pencil },
  { id:"leaf",     Ic: Leaf },
  { id:"smile",    Ic: Smile },
  { id:"wind",     Ic: Wind },
  { id:"target",   Ic: Target },
];
const iconById = (id) => (CUSTOM_ICONS.find(x => x.id === id) ?? CUSTOM_ICONS[0]).Ic;
const goalIcon = (g) => g?.iconId ? iconById(g.iconId) : (TYPES[g?.type]?.icon ?? Sparkles);

/* ------------------------------- i18n ------------------------------------ */
const T = {
  de: {
    days:     ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    daysFull: ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"],
    prefs:    { morning:"Morgens", afternoon:"Mittags", evening:"Abends", any:"Egal" },
    types:    { sport:"Sport", focus:"Fokus", habit:"Gewohnheit" },
    // nav
    navToday:"Heute", navWeek:"Woche", navGoals:"Ziele", navNotes:"Notizen", navMore:"Mehr",
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
    badge4:"Frühstarter", badge5:"Level 5", badge6:"100 XP", badge7:"Betatester ❤️",
    badge1Desc:"Schließe deine erste Einheit ab.",
    badge2Desc:"Schließe 5 Einheiten ab.",
    badge3Desc:"Erreiche eine 3er-Serie bei einem Ziel.",
    badge4Desc:"Schließe eine Einheit vor 12 Uhr ab.",
    badge5Desc:"Erreiche Level 5 durch gesammelte XP.",
    badge6Desc:"Sammle insgesamt 100 XP.",
    badge7Desc:"Dabei seit der Beta — danke für dein Vertrauen!",
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
    notifWebOnly: "In der App verfügbar",
    notifWebOnlyHint: "Push-Benachrichtigungen sind nur in der sidequest App (iOS & Android) verfügbar.",
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
    onbWhenLead: "sidequest plant Einheiten nur in diesem Zeitfenster. Feste Termine trägst du im nächsten Schritt eintragen.",
    onbBlockedTitle: "Feste Termine",
    onbBlockedLead: "Trag ein, wann du nicht verfügbar bist — Arbeit, Schule, Arzt etc. sidequest plant drumherum.",
    onbCalUpload: "Kalender-Screenshot hochladen",
    onbCalUploadHint: "Lade einen Screenshot deines Kalenders hoch, um Termine leichter abzulesen.",
    onbGo: "Loslegen",
    onbBack: "Zurück",
    shiftBack: "−30 min",
    shiftFwd: "+30 min",
    // auth
    authTitle: "Anmelden",
    authLead: "Melde dich an, um Verlauf, XP und Level-System auf allen Geräten zu synchronisieren.",
    authGoogle: "Mit Google anmelden",
    authApple: "Mit Apple anmelden",
    authOr: "oder",
    authSkip: "Ohne Konto fortfahren",
    authNote: "Ohne Konto werden deine Daten nur lokal auf diesem Gerät gespeichert.",
    cloudLoaded: "Cloud-Daten geladen ✓",
    customGoalTitle: "Eigenes Ziel",
    customGoalName: "Name des Ziels",
    customGoalDesc: "Beschreibung (optional)",
    customGoalAdd: "Hinzufügen",
    impressumTitle: "Impressum",
    impressumBody: "Maximilian Hillert\n\nE-Mail: hello@yoursidequest.org\n\nVerantwortlich für den Inhalt nach § 55 Abs. 2 RStV:\nMaximilian Hillert",
    contactTitle: "Kontakt",
    contactLead: "Fragen, Feedback oder Bugs? Schreib uns gerne.",
    contactBtn: "E-Mail schreiben",
    contactEmail: "hello@yoursidequest.org",
  },
  en: {
    days:     ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    daysFull: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    prefs:    { morning:"Morning", afternoon:"Afternoon", evening:"Evening", any:"Anytime" },
    types:    { sport:"Sport", focus:"Focus", habit:"Habit" },
    navToday:"Today", navWeek:"Week", navGoals:"Goals", navNotes:"Notes", navMore:"More",
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
    badge4:"Early bird", badge5:"Level 5", badge6:"100 XP", badge7:"Beta tester ❤️",
    badge1Desc:"Complete your first session.",
    badge2Desc:"Complete 5 sessions.",
    badge3Desc:"Reach a 3-session streak on any goal.",
    badge4Desc:"Complete a session before noon.",
    badge5Desc:"Reach level 5 through earned XP.",
    badge6Desc:"Collect a total of 100 XP.",
    badge7Desc:"Here since the beta — thank you for your trust!",
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
    notifWebOnly: "Available in the app",
    notifWebOnlyHint: "Push notifications are only available in the sidequest app (iOS & Android).",
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
    onbWhenLead: "sidequest only schedules sessions within this window. Add fixed appointments in the next step.",
    onbBlockedTitle: "Fixed appointments",
    onbBlockedLead: "Add times when you're unavailable — work, school, doctor etc. sidequest plans around them.",
    onbCalUpload: "Upload calendar screenshot",
    onbCalUploadHint: "Upload a screenshot of your calendar to easily read off your appointments.",
    onbGo: "Let's go",
    onbBack: "Back",
    shiftBack: "−30 min",
    shiftFwd: "+30 min",
    authTitle: "Sign in",
    authLead: "Sign in to sync your history, XP and levels across all your devices.",
    authGoogle: "Sign in with Google",
    authApple: "Sign in with Apple",
    authOr: "or",
    authSkip: "Continue without account",
    authNote: "Without an account your data is only stored locally on this device.",
    cloudLoaded: "Cloud data loaded ✓",
    customGoalTitle: "Custom goal",
    customGoalName: "Goal name",
    customGoalDesc: "Description (optional)",
    customGoalAdd: "Add",
    impressumTitle: "Legal notice",
    impressumBody: "Maximilian Hillert\n\nEmail: hello@yoursidequest.org\n\nResponsible for content: Maximilian Hillert",
    contactTitle: "Contact",
    contactLead: "Questions, feedback or bugs? We'd love to hear from you.",
    contactBtn: "Send an email",
    contactEmail: "hello@yoursidequest.org",
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
  if (!key) return "–";
  const d = new Date(key.includes("-W") ? key.replace(/-W\d+/, "-01-01") : key + "T00:00:00");
  if (isNaN(d)) return key;
  return `${d.getDate()}. ${d.toLocaleDateString("de-DE", { month: "short" })}`;
}
const rateColor = (r) =>
  r >= 0.8 ? "#18c29c, #46d97f" : r >= 0.5 ? "#E9785A, #F2A78C" : "#ff6b6b, #ff9f45";

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
      const s = { id: uid(), goalId: g.id, day: chosen, start, durationMin: g.durationMin, status: "suggested", hasTimer: g.hasTimer ?? true };
      placed.push(s); created.push(s); usedDays.add(chosen); need--;
    }
  }
  return created;
}

function findReplacement(goal, sessions, availability, fromDay, excludeDay, excludeStart) {
  const wake = [availability.wakeStart, availability.wakeEnd];
  const order = [...Array(7).keys()].filter(d=>d>=fromDay).concat([...Array(7).keys()].filter(d=>d<fromDay));
  for (const d of order) {
    const occ = buildOccupied(sessions, availability.busy, d);
    if (d === excludeDay) occ.push([excludeStart, excludeStart + goal.durationMin]);
    let st = findSlot(goal.durationMin, windowFor(goal.pref, wake), occ);
    if (st == null) st = findSlot(goal.durationMin, wake, occ);
    if (st != null) return { id: uid(), goalId: goal.id, day: d, start: st, durationMin: goal.durationMin, status: "suggested", hasTimer: goal.hasTimer ?? true };
  }
  return null;
}

function shiftSession(sess, deltaMin, sessions, availability) {
  const newStart = sess.start + deltaMin;
  const wake = [availability.wakeStart, availability.wakeEnd];
  if (newStart < wake[0] || newStart + sess.durationMin > wake[1]) return null;
  const occ = buildOccupied(sessions.filter(s => s.id !== sess.id), availability.busy, sess.day);
  if (!slotFree(occ, newStart, newStart + sess.durationMin)) return null;
  return { ...sess, start: newStart };
}

/* ------------------------------ ics / google ----------------------------- */
function sessionDates(s) {
  const start = dateForDay(s.day, s.start);
  const end = new Date(start.getTime() + s.durationMin * 60000);
  return { start, end };
}
function downloadIcs(sessions, goals) {
  const gname = (id) => goals.find(g => g.id === id)?.name || "sidequest";
  const lines = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//sidequest//DE","CALSCALE:GREGORIAN"];
  sessions.forEach(s => {
    const { start, end } = sessionDates(s);
    lines.push("BEGIN:VEVENT",`UID:${s.id}@sidequest`,`DTSTAMP:${dtLocal(new Date())}`,
      `DTSTART:${dtLocal(start)}`,`DTEND:${dtLocal(end)}`,`SUMMARY:${gname(s.goalId)}`,"END:VEVENT");
  });
  lines.push("END:VCALENDAR");
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "sidequest-woche.ics"; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
function googleLink(s, name) {
  const { start, end } = sessionDates(s);
  const p = new URLSearchParams({ action:"TEMPLATE", text:name, dates:`${dtLocal(start)}/${dtLocal(end)}` });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

/* ------------------------------- storage --------------------------------- */
const KEY = "sidequest:v1";
async function loadState() {
  try {
    let r = localStorage.getItem(KEY);
    if (!r) { r = localStorage.getItem("flowweek:v1"); if (r) localStorage.setItem(KEY, r); }
    return r ? JSON.parse(r) : null;
  } catch { return null; }
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
        <div className="fw-logo" style={{ textAlign:"center", marginBottom:6 }}>sidequest</div>
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

function migrateAvailability(av) {
  if (!av) return { wakeStart:420, wakeEnd:1380, busy:[] };
  if (av.wakeStart !== undefined) return av;
  // old format: { wake:7, sleep:23, busy:[] }
  return { wakeStart:(av.wake??7)*60, wakeEnd:(av.sleep??23)*60, busy:av.busy??[] };
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
  const [stats, setStats]                       = useState({ xp:0, done:0, streaks:{}, morningDone:false, currentWeekKey:null, isBetaUser:true });
  const [pomo, setPomo]                         = useState({ work:25, brk:5 });
  const [weekHistory, setWeekHistory]           = useState([]);
  const [showReview, setShowReview]             = useState(false);
  const [pendingReview, setPendingReview]       = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const firedNotifsRef                          = useRef(new Set());
  const [active, setActive]                     = useState(null);
  const [statsOpen, setStatsOpen]               = useState(false);
  const [celebrate, setCelebrate]               = useState(false);
  const [toast, setToast]                       = useState(null);
  const [replan, setReplan]                     = useState(null);
  const [gamification, setGamification]         = useState(true);
  const [exportMode, setExportMode]             = useState("google");
  const [questDetail, setQuestDetail]           = useState(null);
  const [levelUp, setLevelUp]                   = useState(null);

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
        setAvailability(migrateAvailability(s.availability));
        setPomo(s.pomo ?? { work:25, brk:5 });
        setDark(s.dark ?? false);
        setNotificationsEnabled(s.notificationsEnabled ?? false);
        setLang(s.lang ?? "de");
        setGamification(s.gamification ?? true);
        if (isNewWeek && s.onboarded) {
          const raw = s.sessions ?? [];
          const planned = raw.filter(x => x.status !== "skipped").length;
          const done    = raw.filter(x => x.status === "done").length;
          const rate = planned > 0 ? done / planned : 0;
          const bonus = rate >= 0.8 ? 50 : rate >= 0.5 ? 25 : 10;
          const summary = { weekKey: s.stats.currentWeekKey, planned, done, rate, bonus };
          const prevHistory = (s.weekHistory ?? []).filter(h => h.weekKey !== summary.weekKey);
          setWeekHistory([summary, ...prevHistory].slice(0, 12));
          setPendingReview(summary);
          setShowReview(true);
          setSessions([]);
          setStats({ ...(s.stats ?? {}), currentWeekKey: currentKey, morningDone:false, xp:(s.stats?.xp??0)+bonus, isBetaUser: true });
        } else {
          setWeekHistory(s.weekHistory ?? []);
          setSessions(s.sessions ?? []);
          setStats({ ...(s.stats ?? {}), currentWeekKey: currentKey, isBetaUser: true });
        }
      } else {
        setStats(prev => ({ ...prev, currentWeekKey: currentKey, isBetaUser: true }));
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
        setAvailability(migrateAvailability(cloud.availability));
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
    const state = { onboarded, goals, sessions, availability, stats, pomo, dark, weekHistory, notificationsEnabled, lang, gamification };
    saveT.current = setTimeout(() => {
      saveState(state);
      if (user) saveCloud(user.uid, state);
    }, 400);
  }, [loaded, onboarded, goals, sessions, availability, stats, pomo, dark, weekHistory, notificationsEnabled, lang, gamification, user]);

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
    if (sess.status === "done") return;
    const g = goalById(sess.goalId);
    const sessName = g?.name ?? sess.customName ?? "Einheit";
    setSessions(prev => prev.map(s => s.id === sess.id ? { ...s, status:"done" } : s));
    setStats(prev => {
      const prevLevel = levelFromXp(prev.xp);
      const xp = prev.xp + Math.max(10, sess.durationMin);
      const streaks = sess.goalId ? { ...prev.streaks, [sess.goalId]:(prev.streaks[sess.goalId]||0)+1 } : prev.streaks;
      const morningDone = prev.morningDone || sess.start < 720;
      if (gamification) {
        if (levelFromXp(xp) > prevLevel) { setLevelUp({ level:levelFromXp(xp), done:prev.done+1 }); fireCelebrate(); }
        else if (sess.goalId && streaks[sess.goalId] === 3) { fireCelebrate(); flash(`${sessName}: 3er-Serie!`); }
        else flash(`+${Math.max(10, sess.durationMin)} XP für ${sessName}`);
      } else {
        flash(`${sessName} erledigt ✓`);
      }
      return { ...prev, xp, done:prev.done+1, streaks, morningDone };
    });
    setActive(null);
  };

  const skipSession = (sess) => {
    if (sess.status === "done" || sess.status === "skipped") return;
    setSessions(prev => prev.map(s => s.id === sess.id ? { ...s, status:"skipped" } : s));
    if (sess.goalId) setStats(prev => ({ ...prev, streaks:{ ...prev.streaks, [sess.goalId]:0 } }));
    const g = goalById(sess.goalId);
    if (!g) { flash("Übersprungen."); return; }
    const after = sessions.map(s => s.id === sess.id ? { ...s, status:"skipped" } : s);
    const repl = findReplacement(g, after, availability, (sess.day + 1) % 7, sess.day, sess.start);
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
  const shiftSess = (sess, delta) => {
    const shifted = shiftSession(sess, delta, sessions, availability);
    if (shifted) setSessions(prev => prev.map(s => s.id === sess.id ? shifted : s));
    else flash(delta < 0 ? "Kein freier Slot früher." : "Kein freier Slot später.");
  };

  const moveSession = (sessId, newDay) => {
    setSessions(prev => {
      const sess = prev.find(s => s.id === sessId);
      if (!sess || sess.day === newDay) return prev;
      const others = prev.filter(s => s.id !== sessId);
      const occ = buildOccupied(others, availability.busy, newDay);
      const start = slotFree(occ, sess.start, sess.start + sess.durationMin)
        ? sess.start
        : findSlot(sess.durationMin, [availability.wakeStart, availability.wakeEnd], occ);
      if (start === null) { flash("Kein freier Slot an diesem Tag."); return prev; }
      return [...others, { ...sess, day: newDay, start }];
    });
  };

  const addManualSession = (sess) => {
    setSessions(prev => [...prev, { ...sess, id: uid(), status: "planned" }]);
    flash("Einheit hinzugefügt ✓");
  };

  const editSession = (id, patch) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
    flash("Gespeichert ✓");
  };
  const addNote = (id, note, mood) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, note, mood } : s));
  };
  const rescheduleSession = (sess) => {
    const g = goalById(sess.goalId);
    const others = sessions.filter(s => s.id !== sess.id);
    const repl = g && findReplacement(g, others, availability, (sess.day+1)%7);
    if (repl) { setSessions([...others, { ...repl, status:sess.status }]); flash("Verschoben ✓"); }
    else flash("Kein anderer Slot frei.");
  };

  const runPlan = (reset = false) => {
    if (reset) {
      const fresh = planWeek(goals, [], availability);
      setSessions(fresh);
      flash(`Woche neu geplant: ${fresh.length} Vorschläge`);
    } else {
      const created = planWeek(goals, sessions, availability);
      if (created.length) { setSessions(prev => [...prev, ...created]); flash(`${created.length} Einheiten vorgeschlagen`); }
      else flash("Alles schon geplant 🎉");
    }
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

  return (
    <LangCtx.Provider value={t}>
      <div className={dark ? "fw fw-dark" : "fw"}>
        <style>{CSS}</style>
        <Confetti on={celebrate} />
        {toast && <div className="fw-toast">{toast}</div>}

        {!onboarded ? (
          <Onboarding
            fbReady={fbReady}
            onBack={window.__goToLanding}
            onDone={(picked, avail) => {
              setGoals(picked); setAvailability(avail);
              const created = planWeek(picked, [], avail);
              setSessions(created); setOnboarded(true); setView("today");
              setStats(prev => ({ ...prev, currentWeekKey: getMondayKey() }));
            }}
          />
        ) : (
          <div className="fw-shell">
            <AppHeader level={level} xp={stats.xp} dark={dark} setDark={setDark} onLevelClick={() => setStatsOpen(true)} gamification={gamification} />
            <main className="fw-main">
              {view === "today"    && <TodayView {...{ goals, sessions, stats, level, setActive, completeSession, skipSession, goalById, addNote, gamification, exportMode, setQuestDetail }} />}
              {view === "week"     && <WeekView  {...{ goals, sessions, availability, runPlan, acceptSuggestion, acceptAll, skipSession, rescheduleSession, removeSession, completeSession, setActive, goalById, shiftSess, moveSession, addManualSession, editSession, addNote, exportMode, setExportMode }} />}
              {view === "goals"    && <GoalsView {...{ goals, setGoals, stats, weekHistory, sessions, gamification }} />}
              {view === "notes"    && <NotesView {...{ goals, sessions, goalById, addNote }} />}
              {view === "settings" && <SettingsView {...{ availability, setAvailability, pomo, setPomo, dark, setDark, notificationsEnabled, setNotificationsEnabled, requestNotifPermission, lang, setLang, user, skippedAuth, handleSkipAuth, gamification, setGamification, reset: () => { setOnboarded(false); setGoals([]); setSessions([]); setWeekHistory([]); setStats({ xp:0,done:0,streaks:{},morningDone:false,currentWeekKey:getMondayKey() }); cloudSyncedRef.current=false; }}} />}
            </main>
            <AppNav view={view} setView={setView} />
          </div>
        )}

        {statsOpen && gamification && (
          <StatsModal level={level} xp={stats.xp} stats={stats} goals={goals} sessions={sessions} weekHistory={weekHistory} onClose={() => setStatsOpen(false)} />
        )}
        {questDetail && (
          <QuestDetail sess={questDetail.sess} goal={questDetail.goal} stats={stats} gamification={gamification}
            onClose={() => setQuestDetail(null)} onComplete={completeSession} onSkip={skipSession} onStart={setActive} />
        )}
        {levelUp && (
          <LevelUpScreen level={levelUp.level} done={levelUp.done} onContinue={() => setLevelUp(null)} />
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
function AppHeader({ level, xp, dark, setDark, onLevelClick, gamification }) {
  const t = useT();
  return (
    <header className="fw-header">
      <div className="fw-logo">sidequest</div>
      <div className="fw-header-right">
        <span className="fw-header-date">{t("daysFull")[todayIndex()]}, {new Date().toLocaleDateString("de-DE", { day:"numeric", month:"long" })}</span>
        {gamification && <button className="fw-levelpill" onClick={onLevelClick}>lvl {level}</button>}
        <button className="fw-icon-btn" onClick={() => setDark(d => !d)} aria-label="Theme">
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
function AppNav({ view, setView }) {
  return (
    <nav className="fw-nav">
      <button className={view === "today" ? "fw-navi active" : "fw-navi"} onClick={() => setView("today")}>
        <span className="fw-navi-emoji">🏠</span>
      </button>
      <button className={view === "week" ? "fw-navi active" : "fw-navi"} onClick={() => setView("week")}>
        <span className="fw-navi-emoji">🗓️</span>
      </button>
      <button className="fw-nav-center" onClick={() => setView("week")}>
        <Plus size={24} />
      </button>
      <button className={view === "goals" ? "fw-navi active" : "fw-navi"} onClick={() => setView("goals")}>
        <span className="fw-navi-emoji">📊</span>
      </button>
      <button className={view === "settings" ? "fw-navi active" : "fw-navi"} onClick={() => setView("settings")}>
        <span className="fw-navi-emoji">👤</span>
      </button>
    </nav>
  );
}

/* ------------------------------- onboarding ------------------------------ */
const FEAT_ICONS = [Calendar, Clock, Trophy, BarChart2];
const FEAT_COLORS = ["coral", "blue", "amber", "green"];
const FEAT_EMOJIS = ["🗓️", "⏱️", "⭐", "📊"];

function Onboarding({ onDone, fbReady, onBack }) {
  const t = useT();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(() =>
    TEMPLATES.filter(t => ["Workout","Lesen","Meditation"].includes(t.name)).map(t => ({
      id:uid(), name:t.name, type:t.type, color:t.color, perWeek:t.perWeek, durationMin:t.durationMin, pref:t.pref, iconId:t.iconId,
    }))
  );
  const [wake, setWake] = useState({ start:7, end:23 });
  const [busyList, setBusyList] = useState([]);
  const [busyForm, setBusyForm] = useState({ day:0, start:"9", end:"17", label:"", recurring:true });
  const [calImg, setCalImg] = useState(null);

  // auth on splash
  const [authLoading, setAuthLoading] = useState(null);
  const [authError, setAuthError] = useState("");
  const [emailExpanded, setEmailExpanded] = useState(false);
  const [emailMode, setEmailMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogle = async () => {
    setAuthLoading("google"); setAuthError("");
    try { await signInGoogle(); setStep(1); }
    catch (e) { if (e.code !== "auth/popup-closed-by-user") setAuthError("Google-Anmeldung fehlgeschlagen."); setAuthLoading(null); }
  };
  const handleApple = async () => {
    setAuthLoading("apple"); setAuthError("");
    try { await signInApple(); setStep(1); }
    catch { setAuthError("Apple-Anmeldung fehlgeschlagen."); setAuthLoading(null); }
  };
  const [showResetHint, setShowResetHint] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleEmail = async (e) => {
    e.preventDefault(); setAuthLoading("email"); setAuthError(""); setShowResetHint(false);
    try {
      if (emailMode === "signin") await signInEmail(email, password);
      else await signUpEmail(email, password);
      setStep(1);
    } catch (err) {
      let msg;
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        msg = "Falsches Passwort.";
        setShowResetHint(true);
      } else if (err.code === "auth/user-not-found") {
        msg = "Kein Konto mit dieser E-Mail gefunden. Wechsel zu Registrieren.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "Diese E-Mail ist bereits registriert. Wechsel zu Anmelden.";
      } else if (err.code === "auth/weak-password") {
        msg = "Passwort zu kurz — mindestens 6 Zeichen.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Ungültige E-Mail-Adresse.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Zu viele Versuche. Bitte warte einen Moment.";
      } else {
        msg = "Fehler: " + (err.message || err.code);
      }
      setAuthError(msg);
      setAuthLoading(null);
    }
  };

  const handleResetPassword = async () => {
    if (!email) { setAuthError("Bitte gib zuerst deine E-Mail-Adresse ein."); return; }
    try {
      await resetPassword(email);
      setResetSent(true);
      setAuthError("");
      setShowResetHint(false);
    } catch (err) {
      if (err.code === "auth/user-not-found") setAuthError("Kein Konto mit dieser E-Mail gefunden.");
      else setAuthError("Fehler beim Senden. Bitte versuche es erneut.");
    }
  };

  const toggle = (tmpl) => {
    const exists = picked.find(p => p.name === tmpl.name);
    if (exists) setPicked(picked.filter(p => p.name !== tmpl.name));
    else setPicked([...picked, { id:uid(), name:tmpl.name, type:tmpl.type, color:tmpl.color, perWeek:tmpl.perWeek, durationMin:tmpl.durationMin, pref:tmpl.pref, iconId:tmpl.iconId }]);
  };

  return (
    <div className="fw-onb">
      <div className="fw-onb-card">
        <div className="fw-onb-glow" />

        {/* Step 0 — Splash + auth */}
        {step === 0 && (
          <>
            {onBack && <button className="fw-onb-back" onClick={onBack}><ArrowRight size={16} style={{ transform:"rotate(180deg)" }} /> Zurück zur Website</button>}
            <div className="fw-splash-icon-wrap">
              <div className="fw-splash-icon">sq</div>
            </div>
            <div className="fw-logo big serif" style={{ textAlign:"center" }}>sidequest</div>
            <p className="fw-splash-tagline serif">{t("onbTagline").split("\n").map((line,i) => <span key={i}>{line}<br/></span>)}</p>
            <p className="fw-onb-lead">{t("onbLead")}</p>
            <div className="fw-splash-feats">
              {t("onbFeat").map((f, i) => (
                  <div key={i} className="fw-splash-feat">
                    <div className="fw-splash-feat-emoji">{FEAT_EMOJIS[i]}</div>
                    <div>
                      <div className="fw-splash-feat-title">{f.title}</div>
                      <div className="fw-splash-feat-desc">{f.desc}</div>
                    </div>
                  </div>
              ))}
            </div>

            {/* Primary CTA */}
            <button className="fw-btn solid wide" style={{ marginTop:4 }} onClick={() => setStep(1)}>
              {t("onbStartFree")} <ArrowRight size={18} />
            </button>

            {/* Auth section — always visible */}
            <div className="fw-splash-or"><span>oder anmelden</span></div>

            {!fbReady && (
              <div className="fw-auth-notice">
                Anmeldung noch nicht konfiguriert — starte einfach ohne Konto.
              </div>
            )}

            {/* Email form */}
            {fbReady && (emailExpanded ? (
              <form className="fw-email-form" onSubmit={handleEmail}>
                <input type="email" placeholder="E-Mail" value={email} required
                  onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Passwort" value={password} required minLength={6}
                  onChange={e => setPassword(e.target.value)} />
                <div className="fw-email-mode">
                  <button type="button" className={emailMode==="signin"?"fw-mode-btn active":"fw-mode-btn"}
                    onClick={() => setEmailMode("signin")}>Anmelden</button>
                  <button type="button" className={emailMode==="signup"?"fw-mode-btn active":"fw-mode-btn"}
                    onClick={() => setEmailMode("signup")}>Registrieren</button>
                </div>
                {authError && <div className="fw-auth-error">{authError}</div>}
                {resetSent && <div className="fw-auth-success">Link zum Zurücksetzen wurde an {email} gesendet.</div>}
                <button type="submit" className="fw-btn solid wide" disabled={authLoading==="email"}>
                  {authLoading==="email" ? "…" : emailMode==="signin" ? "Anmelden" : "Konto erstellen"}
                </button>
                {emailMode === "signin" && (
                  <button type="button" className="fw-reset-link" style={{ marginTop:8 }} onClick={handleResetPassword}>
                    Passwort vergessen?
                  </button>
                )}
                <button type="button" className="fw-btn ghost wide" style={{ marginTop:6 }}
                  onClick={() => { setEmailExpanded(false); setAuthError(""); setShowResetHint(false); setResetSent(false); }}>Zurück</button>
              </form>
            ) : (
              <button className="fw-splash-email-btn" onClick={() => setEmailExpanded(true)}>
                Mit E-Mail anmelden
              </button>
            ))}

            {/* Google + Apple — always shown, disabled without Firebase */}
            <div className="fw-splash-socials">
              <button className="fw-social-btn" onClick={fbReady ? handleGoogle : undefined}
                disabled={!!authLoading} style={!fbReady ? { opacity:.4, cursor:"default" } : {}}>
                <GoogleSvg /> {authLoading==="google" ? "…" : "Google"}
              </button>
              <button className="fw-social-btn apple" onClick={fbReady ? handleApple : undefined}
                disabled={!!authLoading} style={!fbReady ? { opacity:.4, cursor:"default" } : {}}>
                <AppleSvg /> {authLoading==="apple" ? "…" : "Apple"}
              </button>
            </div>
            {authError && !emailExpanded && <div className="fw-auth-error">{authError}</div>}

            <p className="fw-splash-hint">{t("onbHint")}</p>
          </>
        )}

        {/* Step 1 — Goals */}
        {step === 1 && (
          <>
            <div className="fw-onb-h serif"><Target size={22} /> {t("onbGoalsTitle")}</div>
            <p className="fw-onb-lead">{t("onbGoalsLead")}</p>
            <div className="fw-templates">
              {TEMPLATES.map(tmpl => {
                const on = !!picked.find(p => p.name === tmpl.name);
                const [c1] = ACCENTS[tmpl.color];
                const I = iconById(tmpl.iconId);
                return (
                  <button key={tmpl.name} onClick={() => toggle(tmpl)}
                    className={on ? "fw-tmpl on" : "fw-tmpl"}
                    style={on ? { background:c1, color:"#fff", borderColor:"transparent" } : {}}>
                    <I size={16} /><span>{tmpl.name}</span>
                    <small>{tmpl.perWeek}×/Woche · {tmpl.durationMin}min</small>
                  </button>
                );
              })}
            </div>

            {/* Custom goals already added — shown as removable cards */}
            {picked.filter(p => !TEMPLATES.some(t => t.name === p.name)).map(p => {
              const [c1, c2] = ACCENTS[p.color];
              const I = p.iconId ? iconById(p.iconId) : Sparkles;
              return (
                <div key={p.id} className="fw-custom-goal-pill" style={{ background:`linear-gradient(135deg,${c1},${c2})` }}>
                  <I size={16} style={{ flexShrink:0 }} />
                  <span>{p.name}</span>
                  <small>{p.perWeek}×/Woche · {p.durationMin} min</small>
                  <button className="fw-mini-x" onClick={() => setPicked(prev => prev.filter(x => x.id !== p.id))} aria-label="Entfernen">
                    <X size={13} />
                  </button>
                </div>
              );
            })}

            {/* Custom goal box */}
            <CustomGoalBox onAdd={(g) => setPicked(prev => [...prev, g])} />

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
            <div className="fw-onb-h serif"><Clock size={22} /> {t("onbWhenTitle")}</div>
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
              <button className="fw-btn solid" onClick={() => setStep(3)}>
                {t("onbMore")} <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}

        {/* Step 3 — Blocked times + calendar screenshot */}
        {step === 3 && (
          <>
            <div className="fw-onb-h serif"><Calendar size={22} /> {t("onbBlockedTitle")}</div>
            <p className="fw-onb-lead">{t("onbBlockedLead")}</p>

            {/* Calendar screenshot — subtle helper */}
            <div className="fw-cal-upload-row">
              <label className="fw-cal-upload-icon" title="Kalender-Screenshot als Referenz">
                <ImageIcon size={14} />
                <input type="file" accept="image/*" style={{ display:"none" }}
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const r = new FileReader();
                    r.onload = ev => setCalImg(ev.target.result);
                    r.readAsDataURL(f);
                  }} />
              </label>
              {calImg && <button className="fw-mini no" style={{ width:24, height:24 }} onClick={() => setCalImg(null)}><X size={12}/></button>}
            </div>

            {calImg && (
              <div className="fw-cal-preview">
                <img src={calImg} alt="Kalender" />
              </div>
            )}

            {/* Blocked time list */}
            {busyList.length > 0 && (
              <div className="fw-busy-list">
                {busyList.map((b, i) => (
                  <div key={i} className="fw-busy-row">
                    <span>{b.recurring && <RotateCw size={11} style={{ marginRight:4, color:"var(--accent)" }}/>}
                      {t("daysFull")[b.day]} · {minToLabel(b.start)}–{minToLabel(b.end)}
                      {b.label ? ` · ${b.label}` : ""}
                    </span>
                    <button className="fw-mini no" onClick={() => setBusyList(busyList.filter((_,x)=>x!==i))}><Trash2 size={13}/></button>
                  </div>
                ))}
              </div>
            )}

            {/* Add form */}
            <div className="fw-busy-add">
              <select value={busyForm.day} onChange={e => setBusyForm({...busyForm, day:+e.target.value})}>
                {t("daysFull").map((d,i) => <option key={i} value={i}>{d}</option>)}
              </select>
              <input type="number" min="0" max="23" value={busyForm.start}
                onChange={e => setBusyForm({...busyForm, start:e.target.value})} />
              <span style={{ color:"var(--muted)", fontSize:12 }}>–</span>
              <input type="number" min="1" max="24" value={busyForm.end}
                onChange={e => setBusyForm({...busyForm, end:e.target.value})} />
              <input placeholder="Label (optional)" value={busyForm.label}
                onChange={e => setBusyForm({...busyForm, label:e.target.value})} style={{ flex:1, minWidth:80 }} />
              <button className="fw-mini ok" onClick={() => {
                if (+busyForm.end <= +busyForm.start) return;
                setBusyList([...busyList, { day:busyForm.day, start:+busyForm.start*60, end:+busyForm.end*60, label:busyForm.label||"Termin", recurring:busyForm.recurring }]);
                setBusyForm({...busyForm, label:""});
              }}><Plus size={15}/></button>
            </div>
            <div className="fw-busy-recurring">
              <label className="fw-recurring-label">
                <input type="checkbox" checked={busyForm.recurring} onChange={e => setBusyForm({...busyForm, recurring:e.target.checked})} />
                <RotateCw size={13}/> {t("recurringLabel")}
              </label>
            </div>

            <div className="fw-onb-row">
              <button className="fw-btn ghost" onClick={() => setStep(2)}>{t("onbBack")}</button>
              <button className="fw-btn solid" onClick={() =>
                onDone(picked, { wakeStart:wake.start*60, wakeEnd:wake.end*60, busy:busyList })}>
                {t("onbGo")} <Sparkles size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- custom goal box --------------------------- */
function CustomGoalBox({ onAdd }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [iconId, setIconId] = useState("star");
  const [color, setColor] = useState("violet");
  const [perWeek, setPerWeek] = useState(3);
  const [durationMin, setDurationMin] = useState(30);
  const [pref, setPref] = useState("any");
  const [type, setType] = useState("habit");

  const reset = () => { setName(""); setDesc(""); setIconId("star"); setColor("violet"); setPerWeek(3); setDurationMin(30); setPref("any"); setType("habit"); setOpen(false); };
  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({ id: uid(), name: name.trim(), desc, iconId, color, type, perWeek, durationMin, pref });
    reset();
  };

  const [c1, c2] = ACCENTS[color];
  const I = iconById(iconId);

  return (
    <div className="fw-custom-goal">
      <button className="fw-custom-goal-toggle" onClick={() => setOpen(o => !o)}>
        <div className="fw-custom-goal-ico" style={{ background:`linear-gradient(135deg,${c1},${c2})` }}>
          <I size={16} />
        </div>
        <span>{t("customGoalTitle")}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="fw-custom-goal-form">
          <input className="fw-cg-name" placeholder={t("customGoalName")} value={name}
            onChange={e => setName(e.target.value)} />
          <input className="fw-cg-desc" placeholder={t("customGoalDesc")} value={desc}
            onChange={e => setDesc(e.target.value)} />

          {/* Icon picker */}
          <div className="fw-cg-icons">
            {CUSTOM_ICONS.map(({ id, Ic }) => (
              <button key={id} onClick={() => setIconId(id)}
                className={iconId === id ? "fw-cg-icon sel" : "fw-cg-icon"}
                style={iconId === id ? { background:`linear-gradient(135deg,${c1},${c2})`, color:"#fff" } : {}}>
                <Ic size={16} />
              </button>
            ))}
          </div>

          {/* Color + type + rhythm */}
          <div className="fw-cg-row">
            <div className="fw-goal-colors" style={{ marginTop:0 }}>
              {ACCENT_KEYS.map(k => (
                <button key={k} onClick={() => setColor(k)}
                  className={color === k ? "fw-dot sel" : "fw-dot"}
                  style={{ background:`linear-gradient(135deg,${ACCENTS[k][0]},${ACCENTS[k][1]})` }} />
              ))}
            </div>
          </div>

          <div className="fw-goal-grid" style={{ marginTop:10 }}>
            <label>{t("typeLabel")}
              <select value={type} onChange={e => setType(e.target.value)}>
                {Object.entries(t("types")).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label>{t("perWeekLabel")}
              <input type="number" min="1" max="7" value={perWeek} onChange={e => setPerWeek(+e.target.value)} />
            </label>
            <label>{t("minutesLabel")}
              <input type="number" min="5" step="5" value={durationMin} onChange={e => setDurationMin(+e.target.value)} />
            </label>
            <label>{t("timeLabel")}
              <select value={pref} onChange={e => setPref(e.target.value)}>
                {Object.entries(t("prefs")).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
          </div>

          <div className="fw-onb-row" style={{ marginTop:12 }}>
            <button className="fw-btn ghost" onClick={reset}>{t("cancel")}</button>
            <button className="fw-btn solid" disabled={!name.trim()} onClick={handleAdd}>
              <Plus size={16} /> {t("customGoalAdd")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------- today ---------------------------------- */
function TodayView({ goals, sessions, stats, level, setActive, completeSession, skipSession, goalById, addNote, gamification, exportMode, setQuestDetail }) {
  const t = useT();
  const di = todayIndex();
  const todays = sessions.filter(s => s.day === di && s.status !== "skipped").sort((a,b) => a.start - b.start);
  const doneToday = todays.filter(s => s.status === "done").length;
  const progress = todays.length ? doneToday / todays.length : 0;
  const next = todays.find(s => s.status !== "done");
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Guten Morgen." : hour < 17 ? "Guten Tag." : "Guten Abend.";
  return (
    <div className="fw-stack">
      <section className="fw-hero">
        <div className="fw-greeting">{greeting}</div>
        <div className="fw-greeting-sub">
          {todays.length ? `${todays.length} Quests heute. ${doneToday === todays.length ? "Alles erledigt." : `${doneToday}/${todays.length} erledigt.`}` : "Heute stehen keine Quests an."}
        </div>
        {todays.length > 0 && (
          <div className="fw-progress">
            <div className="fw-progress-bar">
              {todays.map(s => {
                const g = goalById(s.goalId);
                const [c] = ACCENTS[g?.color ?? s.customColor ?? "violet"];
                return <div key={s.id} className="fw-progress-fill" style={{ flex:1, background: s.status === "done" ? c : "var(--line)", borderRadius:999 }} />;
              })}
            </div>
          </div>
        )}
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
              onStart={() => setActive(s)} onDone={() => completeSession(s)} onSkip={() => skipSession(s)} addNote={addNote} exportMode={exportMode}
              onClick={() => setQuestDetail && setQuestDetail({ sess:s, goal:goalById(s.goalId) })} />
          ))}
        </section>
      )}
    </div>
  );
}

function NextCard({ sess, goal, onStart, onDone }) {
  const t = useT();
  const name  = goal?.name ?? sess.customName ?? "Einheit";
  const color = goal?.color ?? sess.customColor ?? "violet";
  const [c1] = ACCENTS[color];
  const I = goal ? goalIcon(goal) : (sess.customIconId ? iconById(sess.customIconId) : Sparkles);
  const showTimer = (goal?.hasTimer ?? true) && sess.hasTimer !== false;
  return (
    <div className="fw-next" style={{ background:c1 }}>
      <div className="fw-next-top">
        <div className="fw-next-dot"><I size={20}/></div>
        <div className="fw-next-info">
          <div className="fw-next-title">{name}</div>
          <div className="fw-next-meta">{sess.durationMin} min · {minToLabel(sess.start)}</div>
        </div>
      </div>
      <div className="fw-next-btns">
        {showTimer && <button className="fw-btn outline" onClick={onStart}><Play size={16} /> {t("start")}</button>}
        <button className="fw-btn solid" onClick={onDone}><Check size={16} /> {t("done")}</button>
      </div>
    </div>
  );
}

function SessionRow({ sess, goal, onStart, onDone, onSkip, compact, addNote, exportMode, onClick }) {
  const t = useT();
  const [noteOpen, setNoteOpen] = useState(false);
  const name  = goal?.name ?? sess.customName ?? "Einheit";
  const color = goal?.color ?? sess.customColor ?? "violet";
  const [c1] = ACCENTS[color];
  const I = goal ? goalIcon(goal) : (sess.customIconId ? iconById(sess.customIconId) : Sparkles);
  const done = sess.status === "done";
  const showTimer = (goal?.hasTimer ?? true) && sess.hasTimer !== false;
  return (
    <>
      <div className={done ? "fw-row done" : "fw-row"} style={{ cursor: onClick ? "pointer" : undefined }}>
        <div className="fw-row-ico" style={{ background:c1, color:"#fff" }} onClick={onClick}><I size={18}/></div>
        <div className="fw-row-body" onClick={onClick}>
          <div className="fw-row-title">{name}</div>
          <div className="fw-row-sub">{minToLabel(sess.start)} · {sess.durationMin} min
            {done && sess.mood && <span className="fw-row-mood">{sess.mood}</span>}
          </div>
          {done && sess.note && <div className="fw-row-note-preview">{sess.note}</div>}
        </div>
        {done ? (
          <div className="fw-row-actions">
            <button className="fw-mini note" onClick={() => setNoteOpen(true)} aria-label="Notiz"><FileText size={16}/></button>
            <SessionCalBtn sess={sess} name={name} exportMode={exportMode || "google"} />
          </div>
        ) : (
          <div className="fw-row-actions">
            {!compact && showTimer && <button className="fw-mini" onClick={onStart} aria-label={t("start")}><Play size={16} /></button>}
            <button className="fw-mini ok" onClick={onDone} aria-label={t("done")}><Check size={16} /></button>
            {onSkip && <button className="fw-mini no" onClick={onSkip} aria-label={t("skip")}><X size={16} /></button>}
          </div>
        )}
      </div>
      {noteOpen && <NoteModal sess={sess} goal={{ name, color, ...(goal||{}) }} onSave={(note, mood) => { addNote && addNote(sess.id, note, mood); setNoteOpen(false); }} onClose={() => setNoteOpen(false)} />}
    </>
  );
}

/* --------------------------------- note modal ---------------------------------- */
const MOODS = ["😴","😐","🙂","💪","🔥"];
function NoteModal({ sess, goal, onSave, onClose }) {
  const [note, setNote] = useState(sess?.note || "");
  const [mood, setMood] = useState(sess?.mood || "");
  if (!sess || !goal) return null;
  const [c1, c2] = ACCENTS[goal.color];
  return (
    <div className="fw-sheet-bg" onClick={onClose}>
      <div className="fw-sheet" onClick={e => e.stopPropagation()}>
        <div className="fw-sheet-handle" />
        <div className="fw-sheet-hdr">
          <div className="fw-sheet-hdr-ico" style={{ background:`linear-gradient(135deg,${c1},${c2})` }}><NotebookPen size={16}/></div>
          <div className="fw-sheet-hdr-text">
            <div className="fw-sheet-hdr-title">Notiz · {goal.name}</div>
            <div className="fw-sheet-hdr-sub">{minToLabel(sess.start)} · {sess.durationMin} min</div>
          </div>
          <button className="fw-sheet-close" onClick={onClose}><X size={18}/></button>
        </div>

        <div className="fw-note-mood-row">
          {MOODS.map(m => (
            <button key={m} className={mood===m?"fw-mood-btn active":"fw-mood-btn"} onClick={() => setMood(m===mood?"":m)}>{m}</button>
          ))}
        </div>

        <textarea
          className="fw-note-area"
          placeholder="Wie lief die Einheit? Was hat geholfen? Was möchtest du beim nächsten Mal verbessern?"
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={5}
          autoFocus
        />

        <div className="fw-sheet-actions">
          <button className="fw-btn glass" onClick={onClose}>Abbrechen</button>
          <button className="fw-btn solid" onClick={() => onSave(note, mood)}>
            <Check size={16}/> Speichern
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- calendar export ----------------------------- */
function CalendarExportMenu({ planned, goals, exportMode, setExportMode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);
  const gname = (id) => goals.find(g => g.id === id)?.name || "sidequest";
  const runExport = (mode) => {
    setExportMode(mode);
    if (mode === "ics") downloadIcs(planned, goals);
    else planned.forEach(s => window.open(googleLink(s, gname(s.goalId)), "_blank"));
    setOpen(false);
  };
  const label = exportMode === "ics" ? ".ics" : "Google";
  const Ico = exportMode === "ics" ? Download : Calendar;
  return (
    <div style={{ position:"relative" }} ref={ref}>
      <button className="fw-btn ghost" onClick={() => setOpen(v => !v)} disabled={!planned.length}>
        <Ico size={14} /> {label} <ChevronDown size={12}/>
      </button>
      {open && (
        <div className="fw-export-menu">
          <button onClick={() => runExport("ics")} className={exportMode==="ics"?"active":""}>
            <Download size={15}/> .ics herunterladen
          </button>
          <button onClick={() => runExport("google")} className={exportMode==="google"?"active":""}>
            <Calendar size={15}/> Google Kalender
          </button>
        </div>
      )}
    </div>
  );
}

function SessionCalBtn({ sess, name, exportMode }) {
  if (exportMode === "google") {
    return <a className="fw-mini" href={googleLink(sess, name)} target="_blank" rel="noreferrer" aria-label="Kalender"><Calendar size={14}/></a>;
  }
  const exportIcs = () => {
    const lines = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//SideQuest//DE","CALSCALE:GREGORIAN"];
    const { start, end } = sessionDates(sess);
    lines.push("BEGIN:VEVENT",`UID:${sess.id}@sidequest`,`DTSTAMP:${dtLocal(new Date())}`,
      `DTSTART:${dtLocal(start)}`,`DTEND:${dtLocal(end)}`,`SUMMARY:${name}`,"END:VEVENT","END:VCALENDAR");
    const blob = new Blob([lines.join("\r\n")], { type:"text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${name.replace(/\s+/g,"-")}.ics`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };
  return <button className="fw-mini" onClick={exportIcs} aria-label="Kalender"><Download size={14}/></button>;
}

/* --------------------------------- week ---------------------------------- */
function WeekView({ goals, sessions, availability, runPlan, acceptAll, acceptSuggestion, skipSession,
  rescheduleSession, removeSession, completeSession, setActive, goalById, shiftSess,
  moveSession, addManualSession, editSession, addNote, exportMode, setExportMode }) {
  const t = useT();
  const [dragId, setDragId]       = useState(null);
  const [dragOver, setDragOver]   = useState(null);
  const [modal, setModal]         = useState(null);
  const [planMenu, setPlanMenu]   = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const hasSuggestions = sessions.some(s => s.status === "suggested");
  const planned = sessions.filter(s => s.status === "planned" || s.status === "done");

  const handleDragStart = (e, id) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e, dayIdx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(dayIdx);
  };
  const handleDrop = (e, dayIdx) => {
    e.preventDefault();
    if (dragId) moveSession(dragId, dayIdx);
    setDragId(null); setDragOver(null);
  };

  return (
    <div className="fw-stack">
      <div className="fw-week-bar">
        <div style={{ position:"relative" }}>
          <button className="fw-btn solid" onClick={() => setPlanMenu(v => !v)}>
            <Sparkles size={16} /> {t("planWeek")} <ChevronDown size={14}/>
          </button>
          {planMenu && (
            <div className="fw-plan-menu">
              {!confirmReset ? (
                <button onClick={() => setConfirmReset(true)}>
                  <RotateCw size={15}/> Woche neu planen
                </button>
              ) : (
                <div className="fw-plan-menu-confirm">
                  <span>Wirklich zurücksetzen?</span>
                  <div style={{display:"flex",gap:6,marginTop:6}}>
                    <button className="fw-plan-confirm-yes" onClick={() => { runPlan(true); setPlanMenu(false); setConfirmReset(false); }}>Ja</button>
                    <button className="fw-plan-confirm-no" onClick={() => setConfirmReset(false)}>Nein</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <CalendarExportMenu planned={planned} goals={goals} exportMode={exportMode} setExportMode={setExportMode} />
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
        const isOver  = dragOver === i;
        return (
          <section key={i}
            className={["fw-day", isToday && "today", isOver && "drag-over"].filter(Boolean).join(" ")}
            onDragOver={e => handleDragOver(e, i)}
            onDragLeave={() => setDragOver(null)}
            onDrop={e => handleDrop(e, i)}>
            <div className="fw-day-h">
              <span>{dayName}</span>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                {isToday && <em>{t("navToday")}</em>}
                <button className="fw-day-add" onClick={() => setModal({ mode:"add", day:i })} title="Einheit hinzufügen">
                  <Plus size={14}/>
                </button>
              </div>
            </div>
            {day.length === 0
              ? <div className="fw-day-empty">{isOver ? "Hier ablegen ↓" : t("free")}</div>
              : day.map(s => {
                const goal = goalById(s.goalId);
                const name  = goal?.name ?? s.customName ?? "?";
                const color = goal?.color ?? s.customColor ?? "violet";
                const itype = goal?.type  ?? s.customType  ?? "habit";
                const [c1, c2] = ACCENTS[color];
                const I = s.customIconId ? iconById(s.customIconId) : (goal ? goalIcon(goal) : Sparkles);
                const suggested = s.status === "suggested";
                const isDragging = dragId === s.id;
                return (
                  <div key={s.id}
                    draggable={s.status !== "done"}
                    onDragStart={e => handleDragStart(e, s.id)}
                    onDragEnd={() => { setDragId(null); setDragOver(null); }}
                    className={["fw-week-card", suggested && "suggested", isDragging && "dragging"].filter(Boolean).join(" ")}>
                    <div className="fw-drag-handle" aria-hidden>⠿</div>
                    <div className="fw-wc-ico" style={{ background:c1 }}><I size={14}/></div>
                    <div className="fw-wc-body">
                      <div className="fw-wc-title">{name}{s.status==="done"&&<Check size={14}/>}</div>
                      <div className="fw-wc-sub">{minToLabel(s.start)} · {s.durationMin} min</div>
                    </div>
                    <div className="fw-wc-actions">
                      {suggested ? (
                        <>
                          <button className="fw-mini" title="-30 min" onClick={() => shiftSess(s, -30)}><ChevronLeft size={15}/></button>
                          <button className="fw-mini" title="+30 min" onClick={() => shiftSess(s, 30)}><ChevronRight size={15}/></button>
                          <button className="fw-mini" onClick={() => rescheduleSession(s)}><RotateCw size={15}/></button>
                          <button className="fw-mini ok" onClick={() => acceptSuggestion(s.id)}><Check size={15}/></button>
                          <button className="fw-mini no" onClick={() => removeSession(s.id)}><X size={15}/></button>
                        </>
                      ) : s.status === "done" ? (
                        <>
                          <button className="fw-mini note" onClick={() => setModal({ mode:"note", sess:s })}><FileText size={14}/></button>
                          <SessionCalBtn sess={s} name={name} exportMode={exportMode} />
                        </>
                      ) : (
                        <>
                          <button className="fw-mini" onClick={() => setModal({ mode:"edit", sess:s })}><Pencil size={14}/></button>
                          {goalById(s.goalId)?.hasTimer !== false && s.hasTimer !== false && <button className="fw-mini" onClick={() => setActive(s)}><Play size={15}/></button>}
                          <button className="fw-mini ok" onClick={() => completeSession(s)}><Check size={15}/></button>
                          <button className="fw-mini no" onClick={() => skipSession(s)}><X size={15}/></button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            }
          </section>
        );
      })}

      {modal && modal.mode !== "note" && (
        <SessionModal
          modal={modal}
          goals={goals}
          sessions={sessions}
          availability={availability}
          onAdd={addManualSession}
          onEdit={editSession}
          onClose={() => setModal(null)}
        />
      )}
      {modal && modal.mode === "note" && (
        <NoteModal
          sess={modal.sess}
          goal={goalById(modal.sess?.goalId)}
          onSave={(note, mood) => { addNote && addNote(modal.sess.id, note, mood); setModal(null); }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

function SessionModal({ modal, goals, sessions, availability, onAdd, onEdit, onClose }) {
  const t = useT();
  const isEdit = modal.mode === "edit";
  const sess   = modal.sess;

  const existingGoal = isEdit ? goals.find(g => g.id === sess?.goalId) : null;

  const [day,         setDay]         = useState(isEdit ? sess.day         : modal.day ?? todayIndex());
  const [startH,      setStartH]      = useState(isEdit ? Math.floor(sess.start/60) : 9);
  const [startM,      setStartM]      = useState(isEdit ? sess.start%60   : 0);
  const [durationMin, setDurationMin] = useState(isEdit ? sess.durationMin : 30);
  const [goalId,      setGoalId]      = useState(isEdit ? (sess.goalId ?? "") : (goals[0]?.id ?? ""));
  const [customName,  setCustomName]  = useState(isEdit ? (sess.customName ?? "") : "");
  const [customColor, setCustomColor] = useState(isEdit ? (sess.customColor ?? "violet") : "violet");
  const [customIcon,  setCustomIcon]  = useState(isEdit ? (sess.customIconId ?? "star") : "star");
  const [hasTimer,    setHasTimer]    = useState(isEdit ? (sess.hasTimer ?? true) : true);

  const useCustom = goalId === "";

  const handleSave = () => {
    const start = startH * 60 + startM;
    if (isEdit) {
      const patch = { day, start, durationMin, hasTimer };
      if (!sess.goalId) { patch.customName = customName; patch.customColor = customColor; patch.customIconId = customIcon; }
      onEdit(sess.id, patch);
    } else {
      if (useCustom) {
        onAdd({ goalId: null, customName: customName || "Einheit", customColor, customIconId: customIcon, day, start, durationMin, hasTimer });
      } else {
        onAdd({ goalId, day, start, durationMin, hasTimer });
      }
    }
    onClose();
  };

  return (
    <div className="fw-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="fw-session-modal">
        <div className="fw-session-modal-header">
          <strong>{isEdit ? "Einheit bearbeiten" : "Einheit hinzufügen"}</strong>
          <button className="fw-mini" onClick={onClose}><X size={16}/></button>
        </div>

        {/* Goal picker — only for new sessions */}
        {!isEdit && (
          <div className="fw-sm-group">
            <label>Ziel</label>
            <select value={goalId} onChange={e => setGoalId(e.target.value)}>
              {goals.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              <option value="">— Eigener Eintrag —</option>
            </select>
          </div>
        )}

        {/* Custom name + icon when no goal */}
        {(!isEdit || !sess?.goalId) && useCustom && (
          <>
            <div className="fw-sm-group">
              <label>Name</label>
              <input value={customName} onChange={e => setCustomName(e.target.value)} placeholder="z.B. Spaziergang" />
            </div>
            <div className="fw-sm-group">
              <label>Icon</label>
              <div className="fw-cg-icons">
                {CUSTOM_ICONS.slice(0,8).map(({ id, Ic }) => {
                  const [c1,c2] = ACCENTS[customColor];
                  return (
                    <button key={id} type="button" onClick={() => setCustomIcon(id)}
                      className={customIcon===id?"fw-cg-icon sel":"fw-cg-icon"}
                      style={customIcon===id?{background:`linear-gradient(135deg,${c1},${c2})`,color:"#fff"}:{}}>
                      <Ic size={15}/>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="fw-sm-group">
              <label>Farbe</label>
              <div className="fw-goal-colors" style={{ marginTop:0 }}>
                {ACCENT_KEYS.map(k => (
                  <button key={k} type="button" onClick={() => setCustomColor(k)}
                    className={customColor===k?"fw-dot sel":"fw-dot"}
                    style={{ background:`linear-gradient(135deg,${ACCENTS[k][0]},${ACCENTS[k][1]})` }} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Day */}
        <div className="fw-sm-group">
          <label>Tag</label>
          <select value={day} onChange={e => setDay(+e.target.value)}>
            {t("daysFull").map((d,i) => <option key={i} value={i}>{d}</option>)}
          </select>
        </div>

        {/* Time */}
        <div className="fw-sm-row">
          <div className="fw-sm-group" style={{ flex:1 }}>
            <label>Uhrzeit</label>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <input type="number" min="0" max="23" value={startH} onChange={e => setStartH(+e.target.value)} style={{ width:56, textAlign:"center" }} />
              <span style={{ color:"var(--muted)" }}>:</span>
              <select value={startM} onChange={e => setStartM(+e.target.value)} style={{ width:64 }}>
                {[0,15,30,45].map(m => <option key={m} value={m}>{pad(m)}</option>)}
              </select>
            </div>
          </div>
          <div className="fw-sm-group" style={{ flex:1 }}>
            <label>Dauer (min)</label>
            <input type="number" min="5" step="5" value={durationMin} onChange={e => setDurationMin(+e.target.value)} />
          </div>
        </div>

        {/* Timer toggle */}
        <div className="fw-sm-toggle">
          <div>
            <div style={{ fontWeight:700, fontSize:14 }}>Mit Timer</div>
            <div style={{ color:"var(--muted)", fontSize:12 }}>Startet Pomodoro oder Countdown beim Abspielen</div>
          </div>
          <button className={hasTimer ? "fw-switch on" : "fw-switch"} type="button" onClick={() => setHasTimer(v => !v)}>
            <i/>
          </button>
        </div>

        <button className="fw-btn solid wide" style={{ marginTop:12 }} onClick={handleSave}>
          <Check size={16}/> {isEdit ? "Speichern" : "Hinzufügen"}
        </button>
      </div>
    </div>
  );
}

/* --------------------------------- goals --------------------------------- */
function GoalsView({ goals, setGoals, stats, weekHistory, sessions, gamification }) {
  const t = useT();
  const [adding, setAdding] = useState(false);
  const update = (id, patch) => setGoals(goals.map(g => g.id === id ? { ...g, ...patch } : g));
  const remove = (id) => setGoals(goals.filter(g => g.id !== id));
  const add = (g) => { setGoals([...goals, g]); setAdding(false); };
  return (
    <div className="fw-stack">
      <StatsSection weekHistory={weekHistory} goals={goals} stats={stats} sessions={sessions} />
      <div className="fw-section-h between">
        <span><Target size={16} /> {t("goalsTitle")}</span>
        <button className="fw-btn ghost sm" onClick={() => setAdding(v => !v)}><Plus size={15} /> {t("newGoal")}</button>
      </div>
      {adding && <GoalEditor onSave={add} onCancel={() => setAdding(false)} />}
      {goals.map(g => {
        const [c1, c2] = ACCENTS[g.color];
        const I = goalIcon(g);
        const streak = stats.streaks?.[g.id] || 0;
        return (
          <div key={g.id} className="fw-goal-card">
            <div className="fw-goal-top">
              <div className="fw-goal-ico" style={{ background:`${c1}14`, color:c1 }}><I size={16}/></div>
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
            <div className="fw-cg-icons" style={{ marginTop:10 }}>
              {CUSTOM_ICONS.map(({ id, Ic }) => (
                <button key={id} onClick={() => update(g.id, { iconId:id })}
                  className={(g.iconId||"dumbbell")===id?"fw-cg-icon sel":"fw-cg-icon"}
                  style={(g.iconId||"dumbbell")===id?{ background:`${c1}14`, color:c1, borderColor:c1 }:{}}>
                  <Ic size={14}/>
                </button>
              ))}
            </div>
            <div className="fw-goal-colors">
              {ACCENT_KEYS.map(k=>(
                <button key={k} onClick={()=>update(g.id,{color:k})}
                  className={g.color===k?"fw-dot sel":"fw-dot"}
                  style={{ background:ACCENTS[k][0] }} aria-label={k}/>
              ))}
            </div>
            <div className="fw-goal-timer-row">
              <span><Clock size={13}/> Mit Timer</span>
              <button className={(g.hasTimer??true)?"fw-switch on":"fw-switch"} onClick={()=>update(g.id,{hasTimer:!(g.hasTimer??true)})}><i/></button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GoalEditor({ onSave, onCancel }) {
  const t = useT();
  const [f, setF] = useState({ name:"", type:"habit", color:"violet", iconId:"star", perWeek:3, durationMin:30, pref:"any", hasTimer:true });
  const [c1] = ACCENTS[f.color];
  return (
    <div className="fw-goal-card">
      <input className="fw-goal-name solo" placeholder={t("goalPlaceholder")} value={f.name}
        onChange={e => setF({...f, name:e.target.value})} />
      <div className="fw-goal-grid">
        <label>{t("perWeekLabel")}<input type="number" min="1" max="7" value={f.perWeek} onChange={e=>setF({...f,perWeek:+e.target.value})}/></label>
        <label>{t("minutesLabel")}<input type="number" min="5" step="5" value={f.durationMin} onChange={e=>setF({...f,durationMin:+e.target.value})}/></label>
        <label>{t("timeLabel")}
          <select value={f.pref} onChange={e=>setF({...f,pref:e.target.value})}>
            {Object.entries(t("prefs")).map(([k,v])=><option key={k} value={k}>{v}</option>)}
          </select>
        </label>
      </div>
      <div className="fw-cg-icons" style={{ marginTop:10 }}>
        {CUSTOM_ICONS.map(({ id, Ic }) => (
          <button key={id} onClick={() => setF({...f, iconId:id})}
            className={f.iconId===id?"fw-cg-icon sel":"fw-cg-icon"}
            style={f.iconId===id?{ background:`${c1}14`, color:c1, borderColor:c1 }:{}}>
            <Ic size={14}/>
          </button>
        ))}
      </div>
      <div className="fw-goal-colors">
        {ACCENT_KEYS.map(k=>(
          <button key={k} onClick={()=>setF({...f,color:k})} className={f.color===k?"fw-dot sel":"fw-dot"}
            style={{ background:ACCENTS[k][0] }} aria-label={k}/>
        ))}
      </div>
      <div className="fw-goal-timer-row">
        <span><Clock size={13}/> Mit Timer</span>
        <button className={f.hasTimer?"fw-switch on":"fw-switch"} type="button" onClick={()=>setF({...f,hasTimer:!f.hasTimer})}><i/></button>
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
    { name:t("badge1"), desc:t("badge1Desc"), icon:Check,    got:stats.done>=1 },
    { name:t("badge2"), desc:t("badge2Desc"), icon:Dumbbell, got:stats.done>=5 },
    { name:t("badge3"), desc:t("badge3Desc"), icon:Flame,    got:maxStreak>=3 },
    { name:t("badge4"), desc:t("badge4Desc"), icon:Sun,      got:!!stats.morningDone },
    { name:t("badge5"), desc:t("badge5Desc"), icon:Trophy,   got:levelFromXp(stats.xp)>=5 },
    { name:t("badge6"), desc:t("badge6Desc"), icon:Sparkles, got:stats.xp>=100 },
    { name:t("badge7"), desc:t("badge7Desc"), icon:Heart,    got:!!stats.isBetaUser },
  ];
}

function BadgeItem({ badge, size = 18 }) {
  const [open, setOpen] = useState(false);
  const I = badge.icon;
  return (
    <>
      <button className={badge.got ? "fw-badge got" : "fw-badge"} onClick={() => setOpen(true)}>
        <I size={size}/><span>{badge.name}</span>
      </button>
      {open && (
        <div className="fw-badge-popup-bg" onClick={() => setOpen(false)}>
          <div className="fw-badge-popup" onClick={e => e.stopPropagation()}>
            <div className={badge.got ? "fw-badge-popup-ico got" : "fw-badge-popup-ico"}>
              <I size={28}/>
            </div>
            <div className="fw-badge-popup-name">{badge.name}</div>
            <div className="fw-badge-popup-desc">{badge.desc}</div>
            <div className={badge.got ? "fw-badge-popup-status unlocked" : "fw-badge-popup-status locked"}>{badge.got ? "✓ Freigeschaltet" : "Noch nicht erreicht"}</div>
            <button className="fw-btn ghost sm" style={{ marginTop:10 }} onClick={() => setOpen(false)}>Schließen</button>
          </div>
        </div>
      )}
    </>
  );
}

function StatsModal({ level, xp, stats, goals, sessions, weekHistory, onClose }) {
  const t = useT();
  const badges = computeBadges(stats, t);
  const xpToNext = 200 - xpIntoLevel(xp);
  const totalMinutes = (sessions || []).filter(s => s.status === "done").reduce((a, s) => a + s.durationMin, 0);
  const bestStreak = Math.max(0, ...Object.values(stats?.streaks || {}), 0);

  return (
    <div className="fw-sheet-bg" onClick={onClose}>
      <div className="fw-sheet fw-stats-modal" onClick={e => e.stopPropagation()}>
        <div className="fw-sheet-handle" />
        <div className="fw-stats-modal-hero">
          <div className="fw-stats-modal-trophy"><Trophy size={32}/></div>
          <div className="fw-stats-modal-level">Level {level}</div>
          <div className="fw-stats-modal-xp">{xp} XP · noch {xpToNext} XP bis Level {level+1}</div>
          <div className="fw-stats-modal-bar">
            <div className="fw-stats-modal-bar-fill" style={{ width:`${(xpIntoLevel(xp)/200)*100}%` }}/>
          </div>
        </div>

        <div className="fw-stats-chips" style={{marginTop:0}}>
          <div className="fw-stats-chip"><Flame size={14}/><span>{bestStreak} Serie</span></div>
          <div className="fw-stats-chip"><Check size={14}/><span>{stats.done} erledigt</span></div>
          <div className="fw-stats-chip"><Clock size={14}/><span>{Math.round(totalMinutes/60*10)/10} h</span></div>
          <div className="fw-stats-chip"><BarChart2 size={14}/><span>{weekHistory.length} Wochen</span></div>
        </div>

        <div className="fw-section-h" style={{marginTop:16}}><Award size={15}/> Erfolge</div>
        <div className="fw-badge-grid">
          {badges.map(b => <BadgeItem key={b.name} badge={b} size={20} />)}
        </div>

        {weekHistory.length > 0 && (
          <>
            <div className="fw-section-h" style={{marginTop:16}}><BarChart2 size={15}/> Wochenverlauf</div>
            <div className="fw-stats-list">
              {weekHistory.slice(0,6).map(w => (
                <div key={w.weekKey} className="fw-stats-row">
                  <div className="fw-stats-label">{formatWeekKey(w.weekKey)}</div>
                  <div className="fw-stats-bar-wrap">
                    <div className="fw-stats-bar" style={{ width:`${Math.round(w.rate*100)}%`, background:`linear-gradient(90deg,${rateColor(w.rate)})` }}/>
                  </div>
                  <div className="fw-stats-meta">
                    <span className="fw-stats-pct">{Math.round(w.rate*100)}%</span>
                    <span className="fw-stats-count">{w.done}/{w.planned}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <button className="fw-btn glass wide" style={{marginTop:16}} onClick={onClose}>Schließen</button>
      </div>
    </div>
  );
}

function StatsSection({ weekHistory, goals, stats, sessions }) {
  const t = useT();
  const [tab, setTab] = useState("history"); // "history" | "goals"

  const totalMinutes = (sessions || []).filter(s => s.status === "done")
    .reduce((acc, s) => acc + s.durationMin, 0);
  const bestStreak = Math.max(0, ...Object.values(stats?.streaks || {}), 0);

  return (
    <section className="fw-panel">
      <div className="fw-section-h"><BarChart2 size={16} /> Statistiken</div>

      {/* Summary chips */}
      <div className="fw-stats-chips">
        <div className="fw-stats-chip"><Flame size={14}/><span>{bestStreak} Tage Serie</span></div>
        <div className="fw-stats-chip"><Clock size={14}/><span>{Math.round(totalMinutes/60 * 10)/10} h</span></div>
        <div className="fw-stats-chip"><Check size={14}/><span>{stats?.done ?? 0} Einheiten</span></div>
      </div>

      {/* Tab switch */}
      <div className="fw-stats-tabs">
        <button className={tab==="history"?"fw-stats-tab active":"fw-stats-tab"} onClick={()=>setTab("history")}>
          Wochenverlauf
        </button>
        <button className={tab==="goals"?"fw-stats-tab active":"fw-stats-tab"} onClick={()=>setTab("goals")}>
          Ziel-Übersicht
        </button>
      </div>

      {tab === "history" && (
        weekHistory.length === 0 ? (
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
        )
      )}

      {tab === "goals" && (
        <div className="fw-stats-list">
          {(goals || []).map(g => {
            const done = (sessions||[]).filter(s => s.goalId === g.id && s.status === "done").length;
            const streak = stats?.streaks?.[g.id] || 0;
            const [c1, c2] = ACCENTS[g.color];
            const I = goalIcon(g);
            return (
              <div key={g.id} className="fw-goal-stat-row">
                <div className="fw-goal-stat-ico" style={{ background:`${c1}14`, color:c1 }}><I size={14}/></div>
                <div className="fw-goal-stat-body">
                  <div className="fw-goal-stat-name">{g.name}</div>
                  <div className="fw-goal-stat-sub">{done} erledigt · {streak > 0 ? `${streak} Serie` : "keine aktive Serie"}</div>
                </div>
                <div className="fw-goal-stat-xp">{done}×</div>
              </div>
            );
          })}
          {(!goals || goals.length === 0) && <div className="fw-day-empty">Noch keine Ziele</div>}
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

/* --------------------------------- qr section ---------------------------------- */
function QrSection() {
  const [qrUrl, setQrUrl] = useState("");
  const url = typeof window !== "undefined" ? window.location.origin : "";
  useEffect(() => {
    if (!url) return;
    QRCode.toDataURL(url, { width:200, margin:2, color:{ dark:"#1d1b2e", light:"#ffffff" } })
      .then(setQrUrl).catch(() => {});
  }, [url]);
  return (
    <section className="fw-panel fw-qr-section">
      <div className="fw-section-h"><QrCode size={16}/> App auf anderem Gerät öffnen</div>
      <p className="fw-qr-lead">Scanne den QR-Code mit deinem Smartphone um sidequest direkt zu öffnen und als App zu installieren.</p>
      {qrUrl && (
        <div className="fw-qr-wrap">
          <img src={qrUrl} alt="QR Code" className="fw-qr-img" />
          <div className="fw-qr-url">{url}</div>
        </div>
      )}
      <div className="fw-qr-hint">
        <span>iOS: Teilen → „Zum Home-Bildschirm"</span>
        <span>Android: Menü → „App installieren"</span>
      </div>
    </section>
  );
}

/* --------------------------------- mood trend ---------------------------------- */
function MoodTrend({ sessions }) {
  const withMood = (sessions || []).filter(s => s.status === "done" && s.mood);
  if (withMood.length < 2) return null;

  const moodVal = { "😴":1, "😐":2, "🙂":3, "💪":4, "🔥":5 };
  const sorted = [...withMood].sort((a, b) => a.day - b.day);
  const half = Math.ceil(sorted.length / 2);
  const older = sorted.slice(0, half);
  const newer = sorted.slice(-half);
  const avg = (arr) => arr.reduce((s, x) => s + (moodVal[x.mood] || 3), 0) / arr.length;
  const oldAvg = avg(older);
  const newAvg = avg(newer);
  const diff = newAvg - oldAvg;

  const counts = {};
  withMood.forEach(s => { counts[s.mood] = (counts[s.mood] || 0) + 1; });
  const topMoods = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const total = withMood.length;

  const trendLabel = diff > 0.3 ? "Aufwärtstrend" : diff < -0.3 ? "Abwärtstrend" : "Stabil";
  const trendArrow = diff > 0.3 ? "↗" : diff < -0.3 ? "↘" : "→";

  return (
    <section className="fw-panel fw-mood-trend">
      <div className="fw-section-h"><span style={{ fontSize:16 }}>Stimmung</span></div>
      <div className="fw-mood-trend-row">
        <div className="fw-mood-trend-arrow">{trendArrow}</div>
        <div className="fw-mood-trend-info">
          <div className="fw-mood-trend-label">{trendLabel}</div>
          <div className="fw-mood-trend-sub">{total} Einträge diese Woche</div>
        </div>
      </div>
      <div className="fw-mood-bars">
        {topMoods.map(([mood, count]) => (
          <div key={mood} className="fw-mood-bar-row">
            <span className="fw-mood-bar-emoji">{mood}</span>
            <div className="fw-mood-bar-track">
              <div className="fw-mood-bar-fill" style={{ width:`${(count/total)*100}%` }} />
            </div>
            <span className="fw-mood-bar-count">{count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------- notes view ---------------------------------- */
function NotesView({ goals, sessions, goalById, addNote }) {
  const [noteModal, setNoteModal] = useState(null);
  const [openGoal, setOpenGoal] = useState(null);

  const noted = (sessions || []).filter(s => s.status === "done");
  const byGoal = {};
  noted.forEach(s => {
    if (!byGoal[s.goalId]) byGoal[s.goalId] = [];
    byGoal[s.goalId].push(s);
  });

  const DAY_LABELS = ["Mo","Di","Mi","Do","Fr","Sa","So"];

  return (
    <div className="fw-stack">
      <MoodTrend sessions={sessions} />
      <section className="fw-panel">
        <div className="fw-section-h"><NotebookPen size={16}/> Notizen</div>
        {goals.length === 0 && <div className="fw-day-empty">Noch keine Ziele</div>}
        {goals.map(g => {
          const entries = (byGoal[g.id] || []).sort((a,b) => b.day - a.day);
          const [c1, c2] = ACCENTS[g.color];
          const I = goalIcon(g);
          const withNote = entries.filter(s => s.note || s.mood);
          const isOpen = openGoal === g.id;
          return (
            <div key={g.id} className="fw-notes-goal">
              <button className="fw-notes-goal-hdr" onClick={() => setOpenGoal(isOpen ? null : g.id)}>
                <div className="fw-notes-goal-ico" style={{ background:`${c1}14`, color:c1 }}><I size={13}/></div>
                <div className="fw-notes-goal-name">{g.name}</div>
                <div className="fw-notes-goal-count">{withNote.length} {withNote.length===1?"Notiz":"Notizen"}</div>
                <div className="fw-notes-goal-arrow">{isOpen ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}</div>
              </button>

              {isOpen && (
                <div className="fw-notes-entries">
                  {entries.length === 0 && <div className="fw-notes-empty">Noch keine Einheiten erledigt</div>}
                  {entries.map(s => (
                    <div key={s.id} className="fw-note-entry">
                      <div className="fw-note-entry-meta">
                        <span>{DAY_LABELS[s.day]} · {minToLabel(s.start)} · {s.durationMin} min</span>
                        {s.mood && <span className="fw-note-mood">{s.mood}</span>}
                        <button className="fw-mini note" onClick={() => setNoteModal({ sess:s, goal:g })} title="Notiz bearbeiten"><Pencil size={13}/></button>
                      </div>
                      {s.note
                        ? <div className="fw-note-text">{s.note}</div>
                        : <div className="fw-note-empty-hint" onClick={() => setNoteModal({ sess:s, goal:g })}>+ Notiz hinzufügen</div>
                      }
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {noteModal && (
        <NoteModal
          sess={noteModal.sess}
          goal={noteModal.goal}
          onSave={(note, mood) => { addNote(noteModal.sess.id, note, mood); setNoteModal(null); }}
          onClose={() => setNoteModal(null)}
        />
      )}
    </div>
  );
}

function CollapsiblePanel({ icon, title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="fw-panel">
      <button className="fw-collapsible-header" onClick={() => setOpen(o => !o)}>
        <div className="fw-section-h" style={{ margin:0 }}>{icon} {title}</div>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="fw-collapsible-body">{children}</div>}
    </section>
  );
}

function DeleteAccountButton({ onDelete }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  if (step === 0) return (
    <button className="fw-btn danger wide" style={{ marginTop:8 }} onClick={() => setStep(1)}>
      <Trash2 size={14}/> Konto löschen
    </button>
  );
  return (
    <div className="fw-delete-confirm">
      <p>Dein Konto und alle Cloud-Daten werden unwiderruflich gelöscht. Lokale Daten bleiben auf diesem Gerät.</p>
      <div style={{ display:"flex", gap:8 }}>
        <button className="fw-btn ghost sm" onClick={() => setStep(0)}>Abbrechen</button>
        <button className="fw-btn danger sm" disabled={loading} onClick={async () => {
          setLoading(true); await onDelete(); setStep(0); setLoading(false);
        }}>
          {loading ? "…" : "Endgültig löschen"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- settings -------------------------------- */
function SettingsView({ availability, setAvailability, pomo, setPomo, dark, setDark,
  notificationsEnabled, setNotificationsEnabled, requestNotifPermission, lang, setLang,
  user, skippedAuth, handleSkipAuth, gamification, setGamification, reset }) {
  const t = useT();
  const [busy, setBusy] = useState({ day:0, start:"9", end:"17", label:"", recurring:true });
  const [editingBusy, setEditingBusy] = useState(null); // index being edited
  const [busyEdit, setBusyEdit] = useState(null);
  const addBusy = () => {
    if (+busy.end <= +busy.start) return;
    setAvailability({ ...availability, busy:[...availability.busy, { day:busy.day, start:+busy.start*60, end:+busy.end*60, label:busy.label||"Termin", recurring:busy.recurring }] });
    setBusy({ ...busy, label:"" });
  };
  const removeBusy = (i) => setAvailability({ ...availability, busy:availability.busy.filter((_,x)=>x!==i) });
  const startEditBusy = (i) => {
    const b = availability.busy[i];
    setEditingBusy(i);
    setBusyEdit({ day:b.day, start:String(b.start/60), end:String(b.end/60), label:b.label, recurring:b.recurring??false });
  };
  const saveBusyEdit = () => {
    if (!busyEdit || +busyEdit.end <= +busyEdit.start) return;
    const updated = availability.busy.map((b,x) => x===editingBusy
      ? { day:busyEdit.day, start:+busyEdit.start*60, end:+busyEdit.end*60, label:busyEdit.label||"Termin", recurring:busyEdit.recurring }
      : b);
    setAvailability({ ...availability, busy:updated });
    setEditingBusy(null); setBusyEdit(null);
  };
  const isNative = typeof window !== "undefined" && window.Capacitor?.isNativePlatform?.();
  const canNotify = typeof window!=="undefined" && ("Notification" in window || isNative);

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
          editingBusy === i && busyEdit ? (
            <div key={i} className="fw-busy-edit">
              <div className="fw-busy-add" style={{ flexWrap:"wrap" }}>
                <select value={busyEdit.day} onChange={e=>setBusyEdit({...busyEdit,day:+e.target.value})}>
                  {t("daysFull").map((d,j)=><option key={j} value={j}>{d}</option>)}
                </select>
                <input type="number" min="0" max="23" value={busyEdit.start} onChange={e=>setBusyEdit({...busyEdit,start:e.target.value})}/>
                <input type="number" min="1" max="24" value={busyEdit.end} onChange={e=>setBusyEdit({...busyEdit,end:e.target.value})}/>
                <input placeholder="Label" value={busyEdit.label} onChange={e=>setBusyEdit({...busyEdit,label:e.target.value})} style={{ flex:1, minWidth:70 }}/>
              </div>
              <div className="fw-busy-recurring">
                <label className="fw-recurring-label">
                  <input type="checkbox" checked={busyEdit.recurring} onChange={e=>setBusyEdit({...busyEdit,recurring:e.target.checked})}/>
                  <RotateCw size={13}/> {t("recurringLabel")}
                </label>
              </div>
              <div style={{ display:"flex", gap:6, marginTop:8 }}>
                <button className="fw-btn ghost sm" onClick={()=>{setEditingBusy(null);setBusyEdit(null);}}>Abbrechen</button>
                <button className="fw-btn solid sm" onClick={saveBusyEdit}><Check size={14}/> Speichern</button>
              </div>
            </div>
          ) : (
            <div className="fw-busy-row" key={i}>
              <span>{b.recurring && <span className="fw-recurring-badge"><RotateCw size={11}/></span>}{t("daysFull")[b.day]} · {minToLabel(b.start)}–{minToLabel(b.end)} · {b.label}</span>
              <div style={{ display:"flex", gap:5 }}>
                <button className="fw-mini" onClick={()=>startEditBusy(i)}><Pencil size={13}/></button>
                <button className="fw-mini no" onClick={()=>removeBusy(i)}><Trash2 size={13}/></button>
              </div>
            </div>
          )
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
        {isNative ? (
          notificationsEnabled ? (
            <div className="fw-notif-active">
              <Bell size={15}/> {t("notifActive")}
              <button className="fw-btn ghost sm" style={{ marginLeft:"auto" }} onClick={()=>setNotificationsEnabled(false)}>
                <BellOff size={14}/> {t("notifDisable")}
              </button>
            </div>
          ) : (
            <button className="fw-btn solid wide" onClick={requestNotifPermission}>
              <Bell size={16}/> {t("notifEnable")}
            </button>
          )
        ) : (
          <div className="fw-notif-web-hint">
            <Smartphone size={16}/>
            <div>
              <div style={{ fontWeight:600, fontSize:14 }}>{t("notifWebOnly")}</div>
              <div style={{ color:"var(--muted)", fontSize:12, marginTop:2 }}>{t("notifWebOnlyHint")}</div>
            </div>
          </div>
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
            <DeleteAccountButton onDelete={async () => { try { await deleteAccount(); } catch {} reset(); }} />
          </>
        ) : (
          <>
            <div className="fw-day-empty" style={{ marginBottom:10 }}>{t("signInSection")}</div>
            <button className="fw-login-google" onClick={async()=>{ try{await signInGoogle();}catch{}}}>
              <GoogleSvg/> {t("authGoogle")}
            </button>
            <button className="fw-login-apple" onClick={async()=>{ try{await signInApple();}catch{}}}>
              <AppleSvg/> {t("authApple")}
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

      {/* Gamification */}
      <section className="fw-panel">
        <div className="fw-toggle-row">
          <div>
            <div style={{ fontWeight:500, fontSize:14 }}>Gamification</div>
            <div style={{ color:"var(--muted)", fontSize:12, marginTop:2 }}>XP, Level und Erfolge anzeigen</div>
          </div>
          <button className={gamification?"fw-switch on":"fw-switch"} onClick={()=>setGamification(g=>!g)}><i/></button>
        </div>
      </section>

      {/* QR Code Sync — nur im Browser zeigen */}
      {!(typeof window !== "undefined" && window.Capacitor?.isNativePlatform?.()) && <QrSection />}

      <button className="fw-btn danger wide" onClick={()=>{ if(confirm(t("resetConfirm"))) reset(); }}>
        <Trash2 size={15}/> {t("resetAll")}
      </button>

      {/* Kontakt */}
      <CollapsiblePanel icon={<Mail size={16}/>} title={t("contactTitle")}>
        <p style={{ color:"var(--muted)", fontSize:13, margin:"0 0 12px", lineHeight:1.5 }}>{t("contactLead")}</p>
        <a className="fw-btn solid wide" href={`mailto:${t("contactEmail")}`}>
          <Mail size={15}/> {t("contactBtn")}
        </a>
      </CollapsiblePanel>

      {/* Rechtliches */}
      <section className="fw-panel">
        <div className="fw-section-h"><FileText size={16}/> Rechtliches</div>
        <div className="fw-legal-links">
          <a href="#" onClick={e => { e.preventDefault(); window.__showLegal?.("privacy"); }}>Datenschutzerklärung</a>
          <a href="#" onClick={e => { e.preventDefault(); window.__showLegal?.("terms"); }}>Nutzungsbedingungen</a>
        </div>
      </section>

      {/* Impressum */}
      <CollapsiblePanel icon={<Info size={16}/>} title={t("impressumTitle")}>
        <pre className="fw-impressum">{t("impressumBody")}</pre>
      </CollapsiblePanel>

      <div className="fw-foot">{t("storageNote")}</div>
    </div>
  );
}

/* ------------------------------ quest detail ------------------------------ */
function QuestDetail({ sess, goal, onClose, onComplete, onSkip, onStart, gamification, stats }) {
  const t = useT();
  const name = goal?.name ?? sess.customName ?? "Einheit";
  const color = goal?.color ?? sess.customColor ?? "coral";
  const [c1] = ACCENTS[color];
  const I = goal ? goalIcon(goal) : (sess.customIconId ? iconById(sess.customIconId) : Sparkles);
  const streak = goal ? (stats?.streaks?.[goal.id] || 0) : 0;
  const done = sess.status === "done";
  const xpAmount = Math.max(10, sess.durationMin);
  return (
    <div className="fw-overlay">
      <div className="fw-quest-detail">
        <div className="fw-qd-hero" style={{ background:`radial-gradient(circle at 30% 25%, ${c1}cc, ${c1})` }}>
          <button className="fw-qd-back" onClick={onClose}><ArrowRight size={18} style={{ transform:"rotate(180deg)" }} /></button>
          <div className="fw-qd-emoji"><I size={48} /></div>
          {gamification && <div className="fw-qd-xp-pill">+{xpAmount} XP</div>}
          <div className="fw-qd-title serif">{name}</div>
        </div>
        <div className="fw-qd-body">
          <div className="fw-qd-meta">
            <div><div className="fw-qd-meta-label">WANN</div><div className="fw-qd-meta-value">{t("daysFull")[sess.day]} · {minToLabel(sess.start)}</div></div>
            <div><div className="fw-qd-meta-label">DAUER</div><div className="fw-qd-meta-value">{sess.durationMin} Min</div></div>
            {gamification && streak > 0 && <div><div className="fw-qd-meta-label">STREAK</div><div className="fw-qd-meta-value" style={{ color:"var(--accent)" }}>🔥 {streak} Tage</div></div>}
          </div>
          {goal?.desc && <p className="fw-qd-desc">{goal.desc}</p>}
          {!done && (
            <>
              <button className="fw-btn solid wide" style={{ marginTop:"auto" }} onClick={() => { onComplete(sess); onClose(); }}>
                Als erledigt markieren ✓
              </button>
              <button className="fw-qd-secondary" onClick={() => { onSkip(sess); onClose(); }}>Verschieben</button>
            </>
          )}
          {done && <div className="fw-qd-done-badge">✓ Erledigt</div>}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ level up --------------------------------- */
function LevelUpScreen({ level, done, onContinue }) {
  return (
    <div className="fw-overlay">
      <div className="fw-levelup">
        <div className="fw-levelup-sparkle" style={{ top:90, left:50 }}>✨</div>
        <div className="fw-levelup-sparkle" style={{ top:150, right:46 }}>✨</div>
        <div className="fw-levelup-sparkle" style={{ bottom:200, left:60 }}>⭐</div>
        <div className="fw-levelup-ring">
          <div className="fw-levelup-circle">
            <span className="fw-levelup-num serif">{level}</span>
          </div>
        </div>
        <div className="fw-levelup-label">LEVEL UP</div>
        <div className="fw-levelup-title serif">Du bist im<br/>Flow!</div>
        <div className="fw-levelup-sub">{done} Quests diese Woche. Eine neue Auszeichnung wartet auf dich.</div>
        <div className="fw-levelup-badges">
          <div className="fw-levelup-badge">🏅</div>
          <div className="fw-levelup-badge">🌿</div>
          <div className="fw-levelup-badge locked">🔒</div>
        </div>
        <button className="fw-btn ghost wide" style={{ marginTop:30 }} onClick={onContinue}>Weiter</button>
      </div>
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
          {goal?.name ?? sess.customName ?? "Timer"}{isPomo && <span className={phase==="work"?"fw-phase work":"fw-phase brk"}>{phase==="work" ? t("focusLabel") : t("breakLabel")}</span>}
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
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Newsreader:wght@400;500;600&display=swap');
.fw{
  --bg1:#FBF6EE; --bg2:#EFE5D7; --card:#ffffff; --card2:#EFE5D7;
  --text:#2A2420; --muted:#9a8d7e; --line:#e3d9cc; --shadow:0 2px 10px -4px rgba(60,40,30,.18); --accent:#E9785A; --sage:#7FA08A;
  font-family:'DM Sans',system-ui,-apple-system,sans-serif; color:var(--text);
  min-height:100vh; background:var(--bg1); position:relative;
  -webkit-font-smoothing:antialiased;
}
.fw-dark{
  --bg1:#1a1714; --bg2:#252019; --card:#252019; --card2:#302a22;
  --text:#F0EDE8; --muted:#9a8d7e; --line:#3a332b; --shadow:0 2px 10px -4px rgba(0,0,0,.4); --accent:#E9785A; --sage:#7FA08A;
}
.fw .serif{font-family:'Newsreader',Georgia,serif}
.fw *{box-sizing:border-box}
.fw-shell{max-width:560px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column}
.fw-main{flex:1;padding:14px 16px calc(env(safe-area-inset-bottom,10px) + 82px)}
.fw-stack>*+*{margin-top:18px}

/* header */
.fw-header{display:flex;justify-content:space-between;align-items:center;padding:16px 22px 14px;padding-top:env(safe-area-inset-top,16px);max-width:560px;margin:0 auto;width:100%}
.fw-logo{font-family:'Newsreader',Georgia,serif;font-weight:400;font-size:22px;letter-spacing:-.02em;color:var(--text)}
.fw-logo.big{font-size:32px}
.fw-header-date{color:var(--muted);font-size:12px;font-weight:500}
.fw-header-right{display:flex;align-items:center;gap:12px}
.fw-levelpill{font-weight:700;font-size:13px;background:var(--card);padding:8px 14px;border-radius:999px;box-shadow:var(--shadow);cursor:pointer;color:var(--accent);transition:.15s;border:none;display:flex;align-items:center;gap:6px}
.fw-levelpill:hover{transform:translateY(-1px)}

/* stats modal */
.fw-stats-modal{max-height:85vh;overflow-y:auto}
.fw-stats-modal-hero{text-align:center;padding:16px 0 12px;border-bottom:.5px solid var(--line);margin-bottom:14px}
.fw-stats-modal-trophy{width:56px;height:56px;border-radius:14px;background:var(--card2);border:.5px solid var(--line);display:flex;align-items:center;justify-content:center;color:var(--text);margin:0 auto 10px}
.fw-stats-modal-level{font-size:20px;font-weight:600}
.fw-stats-modal-xp{font-size:12px;color:var(--muted);margin:4px 0 10px}
.fw-stats-modal-bar{height:4px;border-radius:2px;background:var(--line);overflow:hidden;width:100%}
.fw-stats-modal-bar-fill{height:100%;border-radius:2px;background:var(--text);transition:width .6s}
.fw-badge-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}
.fw-icon-btn{border:none;background:var(--card);width:38px;height:38px;border-radius:50%;display:grid;place-items:center;color:var(--muted);cursor:pointer;transition:.15s;box-shadow:var(--shadow)}
.fw-icon-btn:hover{color:var(--text)}

/* nav */
.fw-nav{position:fixed;bottom:0;left:0;right:0;max-width:560px;margin:0 auto;background:var(--bg1);
  display:flex;justify-content:space-around;padding:10px 6px calc(env(safe-area-inset-bottom,10px) + 4px);backdrop-filter:blur(12px);z-index:20}
.fw-navi{flex:1;border:none;background:none;display:flex;flex-direction:column;align-items:center;gap:3px;
  color:var(--muted);font-size:11px;font-weight:500;cursor:pointer;padding:8px 4px;border-radius:12px;transition:.2s;min-height:48px;justify-content:center}
.fw-navi.active{color:var(--accent)}

/* hero */
.fw-hero{padding:6px 0 10px}
.fw-greeting{font-family:'Newsreader',Georgia,serif;font-size:32px;font-weight:400;letter-spacing:-.02em;color:var(--text)}
.fw-greeting-sub{font-size:15px;color:var(--muted);margin-top:8px;line-height:1.5}
.fw-progress{margin-top:18px}
.fw-progress-bar{height:8px;border-radius:999px;background:var(--bg2);overflow:hidden;display:flex;gap:3px}
.fw-progress-fill{height:100%;border-radius:999px;transition:width .6s}

/* next card */
.fw-next{border-radius:28px;padding:22px;color:#fff}
.fw-next-top{display:flex;align-items:center;gap:14px}
.fw-next-dot{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;flex-shrink:0;background:rgba(255,255,255,.25);color:#fff}
.fw-next-info{flex:1}
.fw-next-title{font-family:'Newsreader',Georgia,serif;font-weight:400;font-size:22px;color:#fff}
.fw-next-meta{color:rgba(255,255,255,.8);font-size:13px;margin-top:3px}
.fw-next-btns{display:flex;gap:10px;margin-top:18px}

/* rows */
.fw-section-h{font-weight:600;font-size:13px;margin:4px 2px 14px;display:flex;align-items:center;gap:7px;color:var(--muted);text-transform:uppercase;letter-spacing:.12em}
.fw-section-h.between{justify-content:space-between}
.fw-section-h svg{color:var(--muted)}
.fw-row{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:28px;margin-bottom:10px;background:var(--card);box-shadow:var(--shadow)}
.fw-row:last-child{margin-bottom:0}
.fw-row.done{opacity:.55}
.fw-row-ico{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;flex-shrink:0}
.fw-row-body{flex:1;min-width:0}
.fw-row-title{font-weight:600;font-size:15px;color:var(--text)}
.fw-row-sub{color:var(--muted);font-size:12px}
.fw-row-actions{display:flex;gap:5px}
.fw-row-check{width:28px;height:28px;border-radius:7px;background:var(--text);color:var(--bg1);display:grid;place-items:center}
.fw-mini{border:none;width:36px;height:36px;border-radius:50%;background:var(--bg2);color:var(--text);display:grid;place-items:center;cursor:pointer;transition:.15s;text-decoration:none}
.fw-mini:hover{background:var(--line)}
.fw-mini.ok{background:var(--text);color:var(--bg1)}
.fw-mini.no{background:rgba(233,120,90,.12);color:var(--accent)}
.fw-mini.g{background:var(--bg2);color:var(--accent)}
.fw-mini.note{background:var(--bg2);color:var(--muted)}

/* empty */
.fw-empty{padding:30px 22px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:7px}
.fw-empty svg{color:var(--muted)}
.fw-empty strong{font-size:15px;font-weight:500}
.fw-empty span{color:var(--muted);font-size:13px}

/* week */
.fw-week-bar{display:flex;justify-content:space-between;align-items:center}
.fw-suggest-banner{display:flex;justify-content:space-between;align-items:center;gap:10px;background:var(--card2);border:.5px solid var(--line);border-radius:10px;padding:11px 14px;font-size:12px;font-weight:500;color:var(--text)}
.fw-suggest-banner span{display:flex;align-items:center;gap:7px}
.fw-day{background:transparent;border-radius:0;padding:0 0 16px;border-bottom:1px solid var(--line)}
.fw-day.today .fw-day-h span{color:var(--accent)}
.fw-day-h{display:flex;justify-content:space-between;align-items:center;font-weight:600;font-size:14px;margin-bottom:10px}
.fw-day-h em{font-style:normal;font-size:11px;font-weight:600;color:var(--accent);background:rgba(233,120,90,.1);padding:4px 10px;border-radius:999px}
.fw-day-empty{color:var(--muted);font-size:12.5px;padding:3px 2px}
.fw-week-card{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:28px;margin-bottom:8px;background:var(--card);box-shadow:var(--shadow)}
.fw-week-card:last-child{margin-bottom:0}
.fw-week-card.suggested{opacity:.65}
.fw-wc-ico{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;flex-shrink:0;color:#fff}
.fw-wc-body{flex:1;min-width:0}
.fw-wc-title{font-weight:600;font-size:14px;display:flex;align-items:center;gap:5px;color:var(--text)}
.fw-wc-title svg{color:var(--sage)}
.fw-wc-sub{color:var(--muted);font-size:12px}
.fw-wc-actions{display:flex;gap:4px}

/* goals */
.fw-badges .fw-badge-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.fw-badge{background:var(--card2);border-radius:8px;padding:12px 8px;text-align:center;opacity:.4;display:flex;flex-direction:column;align-items:center;gap:5px;font-size:10px;font-weight:500;border:.5px solid var(--line);cursor:pointer;color:var(--text);transition:.15s;width:100%}
.fw-badge:hover{border-color:var(--muted)}
.fw-badge svg{color:var(--muted)}
.fw-badge.got{opacity:1}
.fw-badge.got svg{color:var(--text)}
.fw-badge-popup-bg{position:fixed;inset:0;background:rgba(42,36,32,.45);z-index:70;display:grid;place-items:center;padding:20px}
.fw-badge-popup{background:var(--bg1);border-radius:28px;padding:30px 26px;box-shadow:0 20px 50px -15px rgba(42,36,32,.4);text-align:center;max-width:280px;width:100%;animation:fw-slide-up .2s ease}
.fw-badge-popup-ico{width:68px;height:68px;border-radius:50%;background:var(--bg2);display:grid;place-items:center;margin:0 auto 14px;color:var(--muted)}
.fw-badge-popup-ico.got{background:var(--accent);color:#fff}
.fw-badge-popup-name{font-family:'Outfit';font-weight:800;font-size:18px;margin-bottom:6px}
.fw-badge-popup-desc{font-size:13px;color:var(--muted);line-height:1.5;margin-bottom:10px}
.fw-badge-popup-status{font-size:12px;font-weight:700}
.fw-badge-popup-status.unlocked{color:#18c29c}
.fw-badge-popup-status.locked{color:var(--muted)}
.fw-goal-card{background:var(--card);border-radius:28px;padding:20px;box-shadow:var(--shadow)}
.fw-goal-top{display:flex;align-items:center;gap:10px}
.fw-goal-ico{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;flex-shrink:0}
.fw-goal-name{flex:1;border:none;background:none;font-weight:500;font-size:15px;color:var(--text);min-width:0;border-bottom:.5px solid transparent;padding:2px 0}
.fw-goal-name:focus{outline:none;border-bottom-color:var(--text)}
.fw-goal-name.solo{width:100%;border-bottom:.5px solid var(--line);margin-bottom:12px}
.fw-goal-streak{display:flex;align-items:center;gap:3px;font-size:11px;font-weight:500;color:var(--muted)}
.fw-goal-grid{display:grid;grid-template-columns:60px 1fr 90px;gap:8px;margin-top:13px}
.fw-goal-grid label,.fw-wake label{display:flex;flex-direction:column;gap:5px;font-size:11.5px;font-weight:600;color:var(--muted)}
.fw-goal-grid input,.fw-goal-grid select,.fw-wake input{border:1.5px solid var(--line);background:var(--card2);border-radius:10px;padding:8px;font-size:14px;color:var(--text);font-weight:600}
.fw-goal-grid input:focus,.fw-goal-grid select:focus,.fw-wake input:focus{outline:none;border-color:var(--accent)}
.fw-goal-colors{display:flex;gap:8px;margin-top:13px}
.fw-dot{width:24px;height:24px;border-radius:999px;border:2px solid transparent;cursor:pointer;padding:0;flex-shrink:0}
.fw-dot.sel{border-color:var(--text);transform:scale(1.12)}

/* settings */
.fw-panel{background:var(--card);border-radius:28px;padding:20px;box-shadow:var(--shadow)}
.fw-wake{display:flex;gap:18px;align-items:flex-end}
.fw-wake input{width:62px;text-align:center}
.fw-busy-row{display:flex;justify-content:space-between;align-items:center;font-size:13px;padding:7px 0;border-bottom:1px solid var(--line)}
.fw-busy-add{display:flex;gap:6px;margin-top:11px;align-items:center;flex-wrap:wrap}
.fw-busy-add select,.fw-busy-add input{border:1.5px solid var(--line);background:var(--card2);border-radius:9px;padding:7px;font-size:13px;color:var(--text)}
.fw-busy-add input[type=number]{width:54px}
.fw-busy-add input:not([type]){flex:1;min-width:80px}
.fw-busy-recurring{margin-top:10px;padding-top:10px;border-top:1px solid var(--line)}
.fw-recurring-label{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:var(--muted);cursor:pointer}
.fw-recurring-label input[type=checkbox]{accent-color:var(--accent);width:16px;height:16px}
.fw-recurring-badge{display:inline-flex;align-items:center;margin-right:5px;color:var(--accent)}
.fw-toggle-row{display:flex;justify-content:space-between;align-items:center;font-weight:600;font-size:14px}
.fw-switch{width:52px;height:30px;border-radius:999px;border:none;background:var(--bg2);position:relative;cursor:pointer;transition:.2s}
.fw-switch.on{background:var(--sage)}
.fw-switch i{position:absolute;top:3px;left:3px;width:24px;height:24px;border-radius:999px;background:#fff;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.15)}
.fw-switch.on i{left:25px}
.fw-foot{text-align:center;color:var(--muted);font-size:11.5px;padding:6px 20px}
.fw-notif-active{display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:600;color:#18c29c;background:rgba(24,194,156,.1);border-radius:12px;padding:10px 12px}
.fw-notif-web-hint{display:flex;align-items:flex-start;gap:10px;font-size:13.5px;color:var(--muted);background:var(--surface);border-radius:12px;padding:12px 14px}
.fw-lang-row{display:flex;gap:10px;margin-top:6px}
.fw-lang-btn{flex:1;border:1.5px solid var(--line);background:var(--card2);border-radius:12px;padding:10px;font-size:13.5px;font-weight:700;cursor:pointer;color:var(--text);transition:.15s}
.fw-lang-btn.active{border-color:var(--accent);background:rgba(124,92,255,.12);color:var(--accent)}
.fw-account-row{display:flex;align-items:center;gap:12px}
.fw-account-avatar{width:40px;height:40px;border-radius:999px;object-fit:cover}
.fw-delete-confirm{background:rgba(255,90,90,.08);border:1.5px solid rgba(255,90,90,.25);border-radius:14px;padding:14px;margin-top:10px}
.fw-delete-confirm p{font-size:13px;color:#ff5a5a;line-height:1.5;margin:0 0 12px}
.fw-legal-links{display:flex;flex-direction:column;gap:8px}
.fw-legal-links a{color:var(--accent);font-size:14px;font-weight:600;text-decoration:none;padding:8px 0;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:6px}
.fw-legal-links a:last-child{border-bottom:none}
.fw-legal-links a:hover{text-decoration:underline}

/* buttons */
.fw-btn{border:none;border-radius:999px;padding:14px 22px;font-size:15px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:.15s;background:var(--card);color:var(--text);box-shadow:var(--shadow)}
.fw-btn:disabled{opacity:.35;cursor:not-allowed}
.fw-btn:not(:disabled):hover{transform:translateY(-1px)}
.fw-btn.solid{background:var(--text);color:var(--bg1);box-shadow:0 4px 14px -4px rgba(42,36,32,.4)}
.fw-btn.solid:not(:disabled):hover{opacity:.9}
.fw-btn.outline{background:rgba(255,255,255,.9);color:var(--text);box-shadow:var(--shadow)}
.fw-btn.ghost{background:var(--card);color:var(--text);box-shadow:var(--shadow)}
.fw-btn.danger{background:rgba(233,120,90,.1);color:var(--accent);box-shadow:none}
.fw-btn.wide{width:100%}
.fw-btn.sm{padding:10px 16px;font-size:13px}
.fw-btn.pulse{animation:fwpulse 1.4s infinite}

/* onboarding */
.fw-onb{min-height:100vh;display:grid;place-items:center;padding:20px;padding-top:calc(env(safe-area-inset-top,20px) + 10px);background:linear-gradient(180deg,#F4E2D6,var(--bg1) 60%)}
.fw-onb-card{max-width:480px;width:100%;background:var(--card);border-radius:32px;padding:32px 26px;box-shadow:0 20px 50px -15px rgba(60,40,30,.2);position:relative;overflow:hidden}
.fw-onb-back{display:flex;align-items:center;gap:6px;background:none;border:none;color:var(--muted);font-size:13px;font-weight:500;cursor:pointer;padding:0;margin-bottom:16px;font-family:'DM Sans',sans-serif}
.fw-onb-back:hover{color:var(--text)}
.fw-onb-glow{display:none}
.fw-onb-lead{color:var(--muted);font-size:15px;line-height:1.55;margin:10px 0 20px}
.fw-onb-h{font-family:'Newsreader',Georgia,serif;font-weight:400;font-size:26px;display:flex;align-items:center;gap:9px;letter-spacing:-.02em}
.fw-onb-h svg{color:var(--accent)}
.fw-templates{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}
.fw-tmpl{border:1.5px solid var(--line);background:var(--card2);border-radius:15px;padding:13px;cursor:pointer;display:flex;flex-direction:column;gap:4px;color:var(--text);transition:.18s;text-align:left}
.fw-tmpl svg{margin-bottom:2px}
.fw-tmpl span{font-weight:700;font-size:14px;font-family:'Outfit'}
.fw-tmpl small{font-size:11px;opacity:.7}
.fw-tmpl:hover{transform:translateY(-2px)}
.fw-onb-row{display:flex;gap:10px;justify-content:flex-end;margin-top:18px}

/* splash screen */
.fw-splash-icon-wrap{display:flex;justify-content:center;margin-bottom:12px}
.fw-splash-icon{width:72px;height:72px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Newsreader',Georgia,serif;font-weight:400;font-size:28px;letter-spacing:-.02em;line-height:1;box-shadow:0 8px 24px -8px rgba(233,120,90,.5)}
.fw-splash-tagline{font-weight:400;font-size:28px;line-height:1.1;text-align:center;margin:8px 0 14px;letter-spacing:-.02em;color:var(--text)}
.fw-splash-feats{display:flex;flex-direction:column;gap:10px;margin:16px 0 22px}
.fw-splash-feat{display:flex;align-items:center;gap:14px;background:var(--bg1);border-radius:20px;padding:14px 16px}
.fw-splash-feat-ico{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;color:#fff;flex-shrink:0}
.fw-splash-feat-emoji{width:42px;height:42px;border-radius:50%;background:var(--bg2);display:grid;place-items:center;font-size:20px;flex-shrink:0}
.fw-splash-feat-title{font-weight:600;font-size:15px;margin-bottom:2px;color:var(--text)}
.fw-splash-feat-desc{font-size:12px;color:var(--muted)}
.fw-splash-hint{text-align:center;color:var(--muted);font-size:12px;margin-top:8px}

/* bottom sheet / modal overlay */
.fw-sheet-bg{position:fixed;inset:0;background:rgba(42,36,32,.4);z-index:50;display:flex;align-items:flex-end;justify-content:center}
.fw-sheet{background:var(--bg1);border-radius:28px 28px 0 0;width:100%;max-width:560px;padding:14px 22px 36px;display:flex;flex-direction:column;gap:14px}
.fw-sheet-handle{width:40px;height:4px;border-radius:999px;background:var(--line);margin:0 auto 6px}
.fw-sheet-hdr{display:flex;align-items:center;gap:10px;padding-bottom:12px;border-bottom:1px solid var(--line)}
.fw-sheet-hdr-ico{width:36px;height:36px;border-radius:11px;display:grid;place-items:center;color:#fff;flex-shrink:0}
.fw-sheet-hdr-text{flex:1}
.fw-sheet-hdr-title{font-size:15px;font-weight:700}
.fw-sheet-hdr-sub{font-size:12px;color:var(--muted)}
.fw-sheet-close{border:none;background:none;color:var(--muted);cursor:pointer;padding:4px}
.fw-sheet-actions{display:flex;gap:8px;margin-top:4px}

/* login */
.fw-login-icon{width:56px;height:56px;border-radius:18px;background:linear-gradient(135deg,var(--accent),#36c5ff);display:grid;place-items:center;color:#fff;margin:0 auto 12px}
.fw-login-title{font-family:'Outfit';font-weight:800;font-size:22px;text-align:center;margin:0 0 6px}
.fw-login-lead{color:var(--muted);font-size:13.5px;line-height:1.5;text-align:center;margin:0 0 18px}
.fw-login-google,.fw-login-apple{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;border-radius:14px;padding:13px 16px;font-weight:700;font-size:14.5px;cursor:pointer;transition:.18s;border:none;margin-bottom:10px}
.fw-login-google{border:1.5px solid var(--line);background:var(--card);color:var(--text)}
.fw-login-google:hover{border-color:var(--accent);transform:translateY(-1px)}
.fw-login-apple{background:#1d1b2e;color:#fff}
.fw-dark .fw-login-apple{background:#f2f0fb;color:#1d1b2e}
.fw-login-apple:hover{transform:translateY(-1px);opacity:.92}
.fw-login-divider{display:flex;align-items:center;gap:12px;color:var(--muted);font-size:12px;margin:4px 0 12px}
.fw-login-divider::before,.fw-login-divider::after{content:'';flex:1;height:1px;background:var(--line)}
.fw-login-note{text-align:center;color:var(--muted);font-size:11.5px;margin-top:12px}

/* overlay / timer */
.fw-overlay{position:fixed;inset:0;background:rgba(42,36,32,.5);backdrop-filter:blur(8px);display:grid;place-items:center;z-index:50;padding:20px}
.fw-timer{background:var(--bg1);border-radius:32px;padding:34px 28px;text-align:center;position:relative;max-width:380px;width:100%;display:flex;flex-direction:column;align-items:center;box-shadow:0 20px 50px -15px rgba(42,36,32,.4)}
.fw-overlay-close{position:absolute;top:18px;right:18px;border:none;background:var(--bg2);width:36px;height:36px;border-radius:50%;display:grid;place-items:center;cursor:pointer;color:var(--muted)}
.fw-timer-eyebrow{font-weight:500;font-size:16px;margin-bottom:18px;display:flex;align-items:center;justify-content:center;gap:9px;width:100%}
.fw-phase{font-size:10px;padding:3px 8px;border-radius:4px;font-weight:500}
.fw-phase.work{background:var(--card2);color:var(--text)}
.fw-phase.brk{background:var(--card2);color:var(--muted)}
.fw-timer-center{text-align:center}
.fw-timer-time{font-weight:500;font-size:48px;letter-spacing:-2px;font-variant-numeric:tabular-nums}
.fw-timer-sub{color:var(--muted);font-size:13px;margin-top:4px}
.fw-timer-btns{display:flex;gap:11px;margin-top:24px;justify-content:center;width:100%}

/* replan banner */
/* quest detail */
.fw-quest-detail{width:100%;max-width:420px;background:var(--bg1);border-radius:32px;overflow:hidden;box-shadow:0 20px 50px -15px rgba(42,36,32,.4);max-height:90vh;display:flex;flex-direction:column}
.fw-qd-hero{height:280px;position:relative;display:flex;flex-direction:column;justify-content:flex-end;padding:26px;color:#fff}
.fw-qd-back{position:absolute;top:18px;left:20px;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.25);display:grid;place-items:center;color:#fff;border:none;cursor:pointer}
.fw-qd-emoji{position:absolute;top:40px;right:30px;opacity:.5;color:rgba(255,255,255,.6)}
.fw-qd-xp-pill{display:inline-block;background:rgba(255,255,255,.9);color:var(--accent);font-size:12px;font-weight:700;padding:6px 14px;border-radius:999px;margin-bottom:12px;width:fit-content}
.fw-qd-title{font-size:34px;line-height:1.08;letter-spacing:-.02em;font-weight:400;color:#fff}
.fw-qd-body{padding:26px;display:flex;flex-direction:column;flex:1}
.fw-qd-meta{display:flex;gap:24px;margin-bottom:20px}
.fw-qd-meta-label{font-size:11px;color:var(--muted);font-weight:600;letter-spacing:.1em}
.fw-qd-meta-value{font-size:16px;font-weight:600;color:var(--text);margin-top:3px}
.fw-qd-desc{font-size:15px;color:var(--muted);line-height:1.55;margin-bottom:20px}
.fw-qd-secondary{background:none;border:none;color:var(--muted);font-size:14px;font-weight:500;cursor:pointer;text-align:center;padding:12px;margin-top:8px}
.fw-qd-done-badge{text-align:center;font-size:16px;font-weight:600;color:var(--sage);padding:20px;background:rgba(127,160,138,.1);border-radius:20px;margin-top:auto}

/* level up */
.fw-levelup{width:100%;max-width:420px;background:linear-gradient(180deg,var(--accent),#C85638);border-radius:32px;padding:40px 34px;text-align:center;color:#fff;position:relative;overflow:hidden}
.fw-levelup-sparkle{position:absolute;font-size:22px;pointer-events:none;animation:fwpulse 2s infinite}
.fw-levelup-ring{width:170px;height:170px;border-radius:50%;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;margin:30px auto}
.fw-levelup-circle{width:118px;height:118px;border-radius:50%;background:var(--bg1);display:flex;align-items:center;justify-content:center;box-shadow:0 14px 30px -8px rgba(0,0,0,.3)}
.fw-levelup-num{font-size:54px;color:var(--accent);font-weight:600}
.fw-levelup-label{font-size:14px;font-weight:700;color:rgba(255,255,255,.85);letter-spacing:.18em;margin-top:10px}
.fw-levelup-title{font-size:38px;line-height:1.08;letter-spacing:-.02em;margin-top:8px;font-weight:400}
.fw-levelup-sub{font-size:15px;color:rgba(255,255,255,.85);margin-top:14px;line-height:1.5}
.fw-levelup-badges{display:flex;gap:14px;justify-content:center;margin-top:26px}
.fw-levelup-badge{width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.95);display:flex;align-items:center;justify-content:center;font-size:26px}
.fw-levelup-badge.locked{background:rgba(255,255,255,.3)}

/* nav center button */
.fw-nav-center{width:56px;height:56px;border-radius:50%;background:var(--accent);color:#fff;border:none;display:grid;place-items:center;cursor:pointer;margin-top:-22px;box-shadow:0 8px 18px -6px rgba(233,120,90,.6);transition:.15s}
.fw-nav-center:hover{transform:translateY(-2px)}
.fw-navi-emoji{font-size:22px}

.fw-replan{position:fixed;bottom:84px;left:14px;right:14px;max-width:534px;margin:0 auto;background:var(--card);border-radius:24px;padding:16px 20px;box-shadow:0 12px 30px -8px rgba(42,36,32,.3);display:flex;justify-content:space-between;align-items:center;gap:12px;z-index:30}
.fw-replan strong{font-size:13px;font-weight:500;display:block}
.fw-replan span{color:var(--muted);font-size:12px}
.fw-replan-btns{display:flex;gap:8px;flex-shrink:0}

/* toast */
.fw-toast{position:fixed;top:env(safe-area-inset-top,18px);left:50%;transform:translateX(-50%);background:var(--text);color:var(--bg1);padding:12px 22px;border-radius:999px;font-size:14px;font-weight:600;z-index:60;animation:fwtoast .3s;white-space:nowrap;box-shadow:0 8px 20px -6px rgba(42,36,32,.4);margin-top:8px}

/* weekly review */
.fw-review{background:var(--bg1);border-radius:32px;padding:32px 28px;text-align:center;max-width:380px;width:100%;box-shadow:0 20px 50px -15px rgba(42,36,32,.4)}
.fw-review-badge{width:60px;height:60px;border-radius:50%;display:grid;place-items:center;color:#fff;margin:0 auto 16px}
.fw-review-week{font-size:11px;font-weight:500;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;margin-bottom:4px}
.fw-review-headline{font-weight:500;font-size:20px;margin-bottom:18px}
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

/* plan menu dropdown */
.fw-plan-menu{position:absolute;top:calc(100% + 6px);right:0;z-index:40;background:var(--card);border-radius:10px;min-width:200px;overflow:hidden;border:.5px solid var(--line)}
.fw-plan-menu button{display:flex;align-items:center;gap:8px;width:100%;padding:11px 14px;background:none;border:none;font-size:13px;color:var(--text);cursor:pointer;text-align:left;transition:.15s}
.fw-plan-menu button:hover{background:var(--card2)}
.fw-plan-menu-confirm{padding:12px 16px;border-top:1px solid var(--line);font-size:13px;font-weight:600;color:var(--text)}
.fw-plan-confirm-yes{flex:1;padding:6px 12px;border-radius:8px;border:none;background:linear-gradient(90deg,var(--accent),#36c5ff);color:#fff;font-size:13px;font-weight:700;cursor:pointer}
.fw-plan-confirm-no{flex:1;padding:6px 12px;border-radius:8px;border:1.5px solid var(--line);background:none;color:var(--muted);font-size:13px;font-weight:700;cursor:pointer}

/* export dropdown */
.fw-export-menu{position:absolute;top:calc(100% + 6px);right:0;z-index:40;background:var(--card);border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,.18);min-width:200px;overflow:hidden;border:1px solid var(--line)}
.fw-export-menu button{display:flex;align-items:center;gap:8px;width:100%;padding:12px 16px;background:none;border:none;font-size:14px;color:var(--text);cursor:pointer;text-align:left;transition:.15s}
.fw-export-menu button:hover{background:var(--card2);color:var(--accent)}
.fw-export-menu button+button{border-top:.5px solid var(--line)}
.fw-export-menu button.active{font-weight:500;color:var(--text)}

/* busy time edit row */
.fw-busy-edit{background:var(--card2);border-radius:12px;padding:10px 12px;display:flex;flex-direction:column;gap:8px;margin-bottom:4px}
.fw-busy-edit-row{display:flex;align-items:center;gap:8px}
.fw-busy-edit input[type=time]{flex:1;border:1.5px solid var(--line);background:var(--card);border-radius:10px;padding:8px 10px;font-size:13px;color:var(--text)}
.fw-busy-edit input[type=text]{flex:1;border:1.5px solid var(--line);background:var(--card);border-radius:10px;padding:8px 10px;font-size:13px;color:var(--text)}
.fw-busy-edit-actions{display:flex;gap:6px;justify-content:flex-end}

/* goal timer toggle row */
.fw-goal-timer-row{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;margin-top:6px;border-top:1px solid var(--line)}
.fw-goal-timer-row span{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--muted)}

/* stats chips + tabs */
.fw-stats-chips{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}
.fw-stats-chip{display:flex;align-items:center;gap:6px;padding:8px 14px;background:var(--card);border-radius:999px;font-size:13px;font-weight:600;color:var(--text);box-shadow:var(--shadow)}
.fw-stats-chip svg{color:var(--accent)}
.fw-stats-tabs{display:flex;gap:4px;background:var(--bg2);border-radius:999px;padding:4px;margin-bottom:14px}
.fw-stats-tab{flex:1;border:none;background:none;padding:10px;font-size:13px;font-weight:600;color:var(--muted);cursor:pointer;transition:.15s;border-radius:999px}
.fw-stats-tab.active{background:var(--card);color:var(--text);box-shadow:var(--shadow)}

/* per-goal stat rows */
.fw-goal-stat-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--line)}
.fw-goal-stat-row:last-child{border-bottom:none}
.fw-goal-stat-ico{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff}
.fw-goal-stat-body{flex:1;min-width:0}
.fw-goal-stat-name{font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fw-goal-stat-sub{font-size:11px;color:var(--muted);margin-top:1px}
.fw-goal-stat-xp{font-size:12px;font-weight:700;color:var(--accent);flex-shrink:0}

/* note modal */
.fw-note-mood-row{display:flex;gap:10px;justify-content:center;margin:8px 0 14px}
.fw-mood-btn{font-size:26px;border:2px solid transparent;border-radius:12px;padding:6px 10px;background:var(--card2);cursor:pointer;transition:.15s;line-height:1}
.fw-mood-btn.active{border-color:var(--accent);background:rgba(124,92,255,.12)}
.fw-note-area{width:100%;border:1.5px solid var(--line);background:var(--card2);border-radius:14px;padding:12px 14px;font-size:14px;color:var(--text);resize:none;font-family:inherit;line-height:1.6;box-sizing:border-box}
.fw-note-area:focus{outline:none;border-color:var(--accent)}
.fw-mini.note{color:var(--accent)}
.fw-row-mood{margin-left:6px;font-size:16px}
.fw-row-note-preview{font-size:11px;color:var(--muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px}

/* notes view */
.fw-notes-goal{border-bottom:1px solid var(--line)}
.fw-notes-goal:last-child{border-bottom:none}
.fw-notes-goal-hdr{display:flex;align-items:center;gap:10px;width:100%;border:none;background:none;padding:12px 0;cursor:pointer;text-align:left;color:var(--text)}
.fw-notes-goal-ico{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;flex-shrink:0}
.fw-notes-goal-name{flex:1;font-size:14px;font-weight:500;color:var(--text)}
.fw-notes-goal-count{font-size:12px;color:var(--muted);white-space:nowrap}
.fw-notes-goal-arrow{color:var(--muted);flex-shrink:0}
.fw-notes-entries{display:flex;flex-direction:column;gap:10px;padding:0 0 14px 38px}
.fw-notes-empty{font-size:13px;color:var(--muted)}
.fw-note-entry{background:var(--card2);border-radius:12px;padding:10px 12px}
.fw-note-entry-meta{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--muted);margin-bottom:4px}
.fw-note-entry-meta span:first-child{flex:1}
.fw-note-mood{font-size:16px}
.fw-note-text{font-size:13px;color:var(--text);line-height:1.5;white-space:pre-wrap}
.fw-note-empty-hint{font-size:12px;color:var(--accent);cursor:pointer;padding:4px 0}

/* mood trend */
.fw-mood-trend-row{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.fw-mood-trend-arrow{font-size:24px;width:40px;height:40px;border-radius:10px;background:var(--card2);display:grid;place-items:center;flex-shrink:0;border:.5px solid var(--line)}
.fw-mood-trend-info{flex:1}
.fw-mood-trend-label{font-size:14px;font-weight:500}
.fw-mood-trend-sub{font-size:11px;color:var(--muted);margin-top:1px}
.fw-mood-bars{display:flex;flex-direction:column;gap:8px}
.fw-mood-bar-row{display:flex;align-items:center;gap:8px}
.fw-mood-bar-emoji{font-size:18px;width:24px;text-align:center;flex-shrink:0}
.fw-mood-bar-track{flex:1;height:6px;border-radius:3px;background:var(--line);overflow:hidden}
.fw-mood-bar-fill{height:100%;border-radius:3px;background:var(--text);transition:width .4s}
.fw-mood-bar-count{font-size:11px;color:var(--muted);width:20px;text-align:right;flex-shrink:0}

/* qr section */
.fw-qr-section{text-align:center}
.fw-qr-lead{font-size:13px;color:var(--muted);line-height:1.5;margin:6px 0 14px}
.fw-qr-wrap{display:flex;flex-direction:column;align-items:center;gap:8px;margin-bottom:12px}
.fw-qr-img{border-radius:12px;width:180px;height:180px}
.fw-qr-url{font-size:11px;color:var(--muted);word-break:break-all}
.fw-qr-hint{display:flex;flex-direction:column;gap:4px;font-size:11px;color:var(--muted);background:var(--card2);border-radius:10px;padding:10px 14px;text-align:left}

/* confetti */
.fw-confetti{position:fixed;inset:0;pointer-events:none;z-index:80;overflow:hidden}
.fw-confetti span{position:absolute;top:-12px;width:9px;height:14px;border-radius:2px;animation:fwfall 1.4s ease-in forwards}
@keyframes fwfall{to{transform:translateY(105vh) rotate(540deg);opacity:.2}}
@keyframes fwpulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
@keyframes fwtoast{from{opacity:0;transform:translate(-50%,-10px)}to{opacity:1;transform:translate(-50%,0)}}
@media (prefers-reduced-motion:reduce){.fw *{animation:none!important;transition:none!important}}

/* splash auth */
.fw-splash-or{display:flex;align-items:center;gap:10px;color:var(--muted);font-size:12px;margin:14px 0 10px}
.fw-splash-or::before,.fw-splash-or::after{content:'';flex:1;height:1px;background:var(--line)}
.fw-splash-email-btn{width:100%;border:1.5px solid var(--line);background:none;border-radius:13px;padding:11px;font-size:14px;font-weight:600;color:var(--text);cursor:pointer;transition:.15s;margin-bottom:8px}
.fw-splash-email-btn:hover{border-color:var(--accent);color:var(--accent)}
.fw-splash-socials{display:flex;gap:9px;margin-top:4px}
.fw-social-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;border:1.5px solid var(--line);background:var(--card2);border-radius:13px;padding:11px;font-size:13.5px;font-weight:700;cursor:pointer;color:var(--text);transition:.15s}
.fw-social-btn:hover{border-color:var(--accent);transform:translateY(-1px)}
.fw-social-btn.apple{background:#1d1b2e;color:#fff;border-color:transparent}
.fw-dark .fw-social-btn.apple{background:#f2f0fb;color:#1d1b2e}
.fw-email-form{display:flex;flex-direction:column;gap:8px;width:100%;margin-bottom:4px}
.fw-email-form input{border:1.5px solid var(--line);background:var(--card2);border-radius:12px;padding:11px 13px;font-size:14px;color:var(--text);width:100%}
.fw-email-form input:focus{outline:none;border-color:var(--accent)}
.fw-email-mode{display:flex;gap:6px}
.fw-mode-btn{flex:1;border:1.5px solid var(--line);background:none;border-radius:10px;padding:8px;font-size:13px;font-weight:700;cursor:pointer;color:var(--muted);transition:.15s}
.fw-mode-btn.active{border-color:var(--accent);color:var(--accent);background:rgba(124,92,255,.1)}
.fw-auth-error{font-size:12.5px;color:#ff5a5a;text-align:center;padding:2px 0}
.fw-auth-success{font-size:12.5px;color:#18c29c;text-align:center;padding:4px 0}
.fw-reset-link{background:none;border:none;color:var(--muted);font-size:12.5px;cursor:pointer;text-decoration:underline;text-underline-offset:2px;padding:0;font-family:inherit}
.fw-reset-link:hover{color:var(--text)}
.fw-auth-notice{font-size:12px;color:var(--muted);text-align:center;padding:6px 10px;background:var(--card2);border-radius:10px;margin-bottom:6px}

/* custom goal pill (added goals in onboarding) */
.fw-custom-goal-pill{display:flex;align-items:center;gap:9px;border-radius:14px;padding:11px 13px;color:#fff;margin-top:8px;font-weight:700;font-size:14px;font-family:'Outfit'}
.fw-custom-goal-pill small{font-size:11px;opacity:.8;font-weight:500;margin-left:auto;white-space:nowrap}
.fw-mini-x{border:none;background:rgba(255,255,255,.25);width:26px;height:26px;border-radius:8px;display:grid;place-items:center;cursor:pointer;color:#fff;flex-shrink:0;margin-left:4px}
.fw-mini-x:hover{background:rgba(255,255,255,.4)}

/* custom goal box */
.fw-custom-goal{border:1.5px dashed var(--line);border-radius:16px;overflow:hidden;margin-top:6px}
.fw-custom-goal-toggle{width:100%;display:flex;align-items:center;gap:10px;background:none;border:none;padding:12px 14px;cursor:pointer;color:var(--text);font-weight:700;font-size:14px;font-family:'Outfit'}
.fw-custom-goal-toggle:hover{background:var(--card2)}
.fw-custom-goal-toggle svg:last-child{margin-left:auto;color:var(--muted)}
.fw-custom-goal-ico{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;color:#fff;flex-shrink:0}
.fw-custom-goal-form{padding:0 14px 14px;display:flex;flex-direction:column;gap:0}
.fw-cg-name{width:100%;border:1.5px solid var(--line);background:var(--card2);border-radius:11px;padding:10px 12px;font-size:15px;font-weight:700;font-family:'Outfit';color:var(--text);margin-bottom:8px}
.fw-cg-name:focus{outline:none;border-color:var(--accent)}
.fw-cg-desc{width:100%;border:1.5px solid var(--line);background:var(--card2);border-radius:11px;padding:9px 12px;font-size:13px;color:var(--text);margin-bottom:10px}
.fw-cg-desc:focus{outline:none;border-color:var(--accent)}
.fw-cg-icons{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px}
.fw-cg-icon{width:30px;height:30px;border-radius:8px;border:1.5px solid var(--line);background:var(--card2);display:grid;place-items:center;cursor:pointer;color:var(--text);transition:.15s;flex-shrink:0}
.fw-cg-icon:hover{border-color:var(--accent)}
.fw-cg-icon.sel{border-color:transparent}
.fw-cg-row{display:flex;align-items:center;gap:10px}

/* drag & drop */
.fw-day.drag-over{outline:2px solid var(--accent);background:rgba(124,92,255,.05)}
.fw-week-card.dragging{opacity:.4}
.fw-week-card[draggable=true]{cursor:grab}
.fw-week-card[draggable=true]:active{cursor:grabbing}
.fw-drag-handle{color:var(--line);font-size:14px;margin-right:2px;cursor:grab;user-select:none;line-height:1}
.fw-day-add{border:none;background:none;color:var(--muted);cursor:pointer;width:26px;height:26px;border-radius:8px;display:grid;place-items:center;transition:.15s}
.fw-day-add:hover{background:rgba(124,92,255,.12);color:var(--accent)}

/* session modal */
.fw-session-modal{background:var(--card);border-radius:24px 24px 0 0;padding:22px 20px 32px;width:100%;max-width:560px;position:fixed;bottom:0;left:50%;transform:translateX(-50%);box-shadow:0 -12px 40px rgba(0,0,0,.25);z-index:55;animation:fw-slide-up .25s ease}
@keyframes fw-slide-up{from{transform:translateX(-50%) translateY(100%)}to{transform:translateX(-50%) translateY(0)}}
.fw-session-modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.fw-session-modal-header strong{font-family:'Outfit';font-weight:800;font-size:18px}
.fw-sm-group{display:flex;flex-direction:column;gap:5px;margin-bottom:12px}
.fw-sm-group label{font-size:11.5px;font-weight:700;color:var(--muted)}
.fw-sm-group select,.fw-sm-group input{border:1.5px solid var(--line);background:var(--card2);border-radius:11px;padding:9px 11px;font-size:14px;color:var(--text);width:100%}
.fw-sm-group select:focus,.fw-sm-group input:focus{outline:none;border-color:var(--accent)}
.fw-sm-row{display:flex;gap:12px}
.fw-sm-toggle{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 0;border-top:1px solid var(--line);margin-top:4px}

/* collapsible panel */
.fw-collapsible-header{width:100%;display:flex;justify-content:space-between;align-items:center;background:none;border:none;cursor:pointer;padding:0;color:var(--muted)}
.fw-collapsible-body{margin-top:12px;padding-top:12px;border-top:1px solid var(--line)}
.fw-impressum{white-space:pre-wrap;font-family:'Inter',system-ui;font-size:12.5px;color:var(--muted);line-height:1.65;margin:0;background:var(--card2);border-radius:10px;padding:12px}

/* calendar upload */
.fw-cal-upload-row{display:flex;align-items:center;gap:6px;margin-bottom:8px}
.fw-cal-upload-icon{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;border:1.5px solid var(--line);color:var(--muted);cursor:pointer;transition:.15s}
.fw-cal-upload-icon:hover{border-color:var(--accent);color:var(--accent)}
.fw-cal-preview{border-radius:14px;overflow:hidden;margin-bottom:12px;max-height:200px;border:1.5px solid var(--line)}
.fw-cal-preview img{width:100%;object-fit:cover;display:block}
.fw-busy-list{display:flex;flex-direction:column;gap:4px;margin-bottom:10px}
`;
