import { StrictMode, useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import FlowWeekApp from "./FlowWeek.jsx";
import Landing from "./Landing.jsx";
import { PrivacyPolicy, TermsOfService } from "./Legal.jsx";
import AdminDashboard from "./Admin.jsx";

function Root() {
  const [view, setView] = useState(() => {
    if (window.location.hash === "#admin") return "admin";
    try {
      const s = localStorage.getItem("sidequest:v1") || localStorage.getItem("flowweek:v1");
      if (s) {
        const d = JSON.parse(s);
        if (d.onboarded) return "app";
      }
    } catch {}
    return localStorage.getItem("fw:enter") === "1" ? "app" : "landing";
  });

  const [returnTo, setReturnTo] = useState("landing");

  const showLegal = useCallback((page) => {
    setReturnTo(view);
    setView(page);
  }, [view]);

  useEffect(() => {
    window.__showLegal = showLegal;
    window.__goToLanding = () => { localStorage.removeItem("fw:enter"); setView("landing"); };
    return () => { delete window.__showLegal; delete window.__goToLanding; };
  }, [showLegal]);

  const enterApp = () => {
    localStorage.setItem("fw:enter", "1");
    setView("app");
  };

  const goBack = () => setView(returnTo);

  if (view === "admin") return <AdminDashboard onBack={() => setView("app")} />;
  if (view === "privacy") return <PrivacyPolicy onBack={goBack} />;
  if (view === "terms") return <TermsOfService onBack={goBack} />;
  if (view === "app") return <FlowWeekApp />;
  return <Landing onEnterApp={enterApp} onShowLegal={showLegal} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
