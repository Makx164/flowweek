import { ArrowLeft } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Legal pages – Privacy Policy (DSGVO) & Terms of Service                   */
/*  Both in German. Reuse FlowWeek design tokens (Outfit / Inter, purple …).  */
/* -------------------------------------------------------------------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');

.legal{
  --bg:#fdf7ff;--bg2:#f4f0ff;--card:#ffffff;--text:#1d1b2e;--muted:#6f6b86;
  --line:#ece8f6;--accent:#7c5cff;
  font-family:'Inter',system-ui,sans-serif;color:var(--text);background:var(--bg);
  -webkit-font-smoothing:antialiased;min-height:100vh;padding:0 0 80px;
}
.legal *{box-sizing:border-box}

/* header bar */
.legal-header{
  position:sticky;top:0;z-index:40;
  background:rgba(253,247,255,.92);backdrop-filter:blur(12px);
  border-bottom:1px solid var(--line);padding:14px 24px;
}
.legal-header-inner{
  max-width:780px;margin:0 auto;display:flex;align-items:center;gap:14px;
}
.legal-back{
  display:inline-flex;align-items:center;gap:6px;
  background:none;border:none;color:var(--accent);font-family:'Outfit';
  font-weight:700;font-size:15px;cursor:pointer;padding:6px 12px 6px 8px;
  border-radius:10px;transition:.15s;
}
.legal-back:hover{background:rgba(124,92,255,.1)}
.legal-title{
  font-family:'Outfit';font-weight:800;font-size:18px;letter-spacing:-.3px;
}

/* content wrapper */
.legal-body{
  max-width:780px;margin:0 auto;padding:40px 24px 0;
}
.legal-body h1{
  font-family:'Outfit';font-weight:900;font-size:clamp(28px,5vw,38px);
  letter-spacing:-.8px;margin:0 0 8px;line-height:1.15;
}
.legal-body .legal-subtitle{
  color:var(--muted);font-size:15px;margin:0 0 36px;
}
.legal-body h2{
  font-family:'Outfit';font-weight:800;font-size:20px;letter-spacing:-.3px;
  margin:36px 0 12px;padding-top:8px;border-top:1px solid var(--line);
}
.legal-body h2:first-of-type{border-top:none;margin-top:0}
.legal-body h3{
  font-family:'Outfit';font-weight:700;font-size:16px;margin:20px 0 8px;
}
.legal-body p, .legal-body li{
  font-size:15px;line-height:1.7;color:var(--text);margin:0 0 12px;
}
.legal-body ul{
  padding-left:22px;margin:0 0 16px;
}
.legal-body li{margin-bottom:6px}
.legal-body a{color:var(--accent);text-decoration:underline;text-underline-offset:2px}
.legal-body strong{font-weight:600}

.legal-updated{
  margin-top:48px;padding-top:20px;border-top:1px solid var(--line);
  font-size:13px;color:var(--muted);
}

@media(max-width:600px){
  .legal-body{padding:28px 18px 0}
  .legal-body h2{font-size:18px}
}
`;

/* ========================================================================== */
/*  Datenschutzerklaerung (Privacy Policy)                                    */
/* ========================================================================== */

export function PrivacyPolicy({ onBack }) {
  return (
    <div className="legal">
      <style>{CSS}</style>

      <header className="legal-header">
        <div className="legal-header-inner">
          <button className="legal-back" onClick={onBack}>
            <ArrowLeft size={18} /> Zurueck
          </button>
          <span className="legal-title">Datenschutz</span>
        </div>
      </header>

      <div className="legal-body">
        <h1>Datenschutzerklaerung</h1>
        <p className="legal-subtitle">
          Informationen zur Verarbeitung personenbezogener Daten gemaess DSGVO
        </p>

        {/* 1 */}
        <h2>1. Verantwortlicher</h2>
        <p>
          Verantwortlich fuer die Datenverarbeitung im Sinne der
          Datenschutz-Grundverordnung (DSGVO) ist:
        </p>
        <p>
          Maximilian Hillert<br />
          Deutschland<br />
          E-Mail: hello@yoursidequest.org
        </p>

        {/* 2 */}
        <h2>2. Ueberblick ueber die Datenverarbeitung</h2>
        <p>
          FlowWeek ist eine Progressive Web App (PWA) zur Wochenplanung mit
          Gamification-Elementen. Die App funktioniert grundsaetzlich vollstaendig
          offline und speichert alle Nutzerdaten lokal auf deinem Geraet. Eine
          Cloud-Synchronisierung ueber Firebase ist optional und erfordert deine
          ausdrueckliche Anmeldung.
        </p>
        <p>
          <strong>Wichtig:</strong> FlowWeek verwendet kein Tracking, keine
          Analyse-Tools, keine Werbenetzwerke und setzt keine eigenen Cookies.
        </p>

        {/* 3 */}
        <h2>3. Welche Daten werden verarbeitet?</h2>

        <h3>3.1 Lokale Speicherung (localStorage)</h3>
        <p>
          Alle Daten, die du in der App eingibst (Ziele, Wochenplaene, Einheiten,
          Statistiken, XP, Fortschritt, Einstellungen), werden ausschliesslich im
          localStorage deines Browsers gespeichert. Diese Daten verlassen dein
          Geraet nicht, solange du die Cloud-Synchronisierung nicht aktivierst.
        </p>
        <ul>
          <li>Deine Ziele und deren Konfiguration (Name, Typ, Haeufigkeit, Dauer)</li>
          <li>Wochenplaene und erledigte Einheiten</li>
          <li>XP, Level, Streaks und freigeschaltete Badges</li>
          <li>Notizen und persoenliche Einstellungen (Farbschema, Sprache etc.)</li>
          <li>Wochenverlauf und Statistiken</li>
        </ul>
        <p>
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO
          (Vertragserfullung bzw. Durchfuehrung vorvertraglicher Massnahmen) sowie
          Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), soweit du zusaetzliche
          Funktionen aktivierst.
        </p>

        <h3>3.2 Firebase Authentication (optional)</h3>
        <p>
          Wenn du dich fuer die Cloud-Synchronisierung entscheidest, kannst du dich
          mit einem der folgenden Verfahren anmelden:
        </p>
        <ul>
          <li>Google-Konto (OAuth)</li>
          <li>Apple-ID (OAuth)</li>
          <li>E-Mail-Adresse und Passwort</li>
        </ul>
        <p>
          Dabei werden folgende Daten durch Firebase Authentication verarbeitet:
        </p>
        <ul>
          <li>E-Mail-Adresse</li>
          <li>Anzeigename (sofern vom Anbieter uebermittelt)</li>
          <li>Profilbild-URL (sofern vom Anbieter uebermittelt)</li>
          <li>Eindeutige Benutzer-ID (Firebase UID)</li>
          <li>Anmelde-Zeitstempel</li>
        </ul>
        <p>
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO
          (ausdrueckliche Einwilligung durch aktive Anmeldung).
        </p>

        <h3>3.3 Cloud Firestore (optional)</h3>
        <p>
          Nach erfolgreicher Anmeldung werden deine App-Daten (Ziele, Wochenplaene,
          Fortschritt, Einstellungen) zusaetzlich in Google Cloud Firestore
          gespeichert, damit du sie geraetuebergreifend synchronisieren kannst.
          Die gespeicherten Daten entsprechen den unter 3.1 beschriebenen lokalen
          Daten, ergaenzt um deine Firebase UID zur Zuordnung.
        </p>
        <p>
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO
          (Einwilligung) in Verbindung mit Art. 6 Abs. 1 lit. b DSGVO
          (Vertragserfullung — Bereitstellung der Cloud-Sync-Funktion).
        </p>

        {/* 4 */}
        <h2>4. Push-Benachrichtigungen</h2>
        <p>
          FlowWeek kann Browser-Push-Benachrichtigungen senden, um dich an
          geplante Einheiten zu erinnern. Die Aktivierung erfolgt ausschliesslich
          auf deine ausdrueckliche Anforderung hin ueber die integrierte
          Browser-Berechtigungsabfrage. Du kannst Push-Benachrichtigungen jederzeit
          in den Einstellungen deines Browsers oder in der App deaktivieren.
        </p>
        <p>
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO
          (Einwilligung).
        </p>

        {/* 5 */}
        <h2>5. Auftragsverarbeiter</h2>

        <h3>5.1 Google / Firebase</h3>
        <p>
          Fuer die optionale Cloud-Synchronisierung nutzen wir Dienste von
          Google LLC (Firebase Authentication, Cloud Firestore). Google verarbeitet
          personenbezogene Daten in unserem Auftrag gemaess Art. 28 DSGVO.
        </p>
        <p>
          Google LLC ist unter dem EU-US Data Privacy Framework zertifiziert und
          bietet angemessene Garantien gemaess Art. 46 DSGVO fuer die
          Datenuebermittlung in die USA. Weitere Informationen findest du in der{" "}
          <a
            href="https://firebase.google.com/support/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Firebase-Datenschutzerklaerung
          </a>.
        </p>

        <h3>5.2 Vercel (Hosting)</h3>
        <p>
          FlowWeek wird ueber Vercel Inc. gehostet. Beim Abruf der App werden
          technisch notwendige Verbindungsdaten (IP-Adresse, Zeitstempel,
          angeforderte Ressource, Browser-Informationen) in Server-Logfiles
          verarbeitet. Diese Daten dienen ausschliesslich der technischen
          Bereitstellung und Sicherheit.
        </p>
        <p>
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
          (berechtigtes Interesse an der sicheren Bereitstellung der App). Weitere
          Informationen findest du in der{" "}
          <a
            href="https://vercel.com/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vercel-Datenschutzerklaerung
          </a>.
        </p>

        {/* 6 */}
        <h2>6. Kein Tracking und keine Werbung</h2>
        <p>
          FlowWeek verwendet keine Analyse-Tools (z. B. Google Analytics), keine
          Werbenetzwerke, keine Social-Media-Plugins und kein sonstiges Tracking.
          Es werden keine Nutzungsprofile erstellt und keine Daten an Dritte zu
          Werbe- oder Analysezwecken weitergegeben.
        </p>

        {/* 7 */}
        <h2>7. Cookies</h2>
        <p>
          FlowWeek setzt keine eigenen Cookies. Sofern du die
          Cloud-Synchronisierung ueber Firebase aktivierst, koennen technisch
          notwendige Cookies durch Firebase gesetzt werden, die ausschliesslich der
          Authentifizierung dienen.
        </p>

        {/* 8 */}
        <h2>8. Speicherdauer und Loeschung</h2>
        <ul>
          <li>
            <strong>Lokale Daten (localStorage):</strong> Verbleiben auf deinem
            Geraet, bis du sie manuell loeschst (App-Einstellungen oder
            Browser-Daten loeschen).
          </li>
          <li>
            <strong>Firebase-Daten:</strong> Werden gespeichert, solange dein Konto
            besteht. Du kannst dein Konto und alle zugehoerigen Cloud-Daten
            jederzeit ueber die Einstellungen der App loeschen. Nach Kontoloeschung
            werden alle Daten innerhalb von 30 Tagen vollstaendig aus den
            Firebase-Systemen entfernt.
          </li>
          <li>
            <strong>Server-Logfiles (Vercel):</strong> Werden in der Regel
            innerhalb von 30 Tagen automatisch geloescht.
          </li>
        </ul>

        {/* 9 */}
        <h2>9. Deine Rechte</h2>
        <p>
          Du hast gemaess DSGVO jederzeit folgende Rechte bezueglich deiner
          personenbezogenen Daten:
        </p>
        <ul>
          <li>
            <strong>Auskunft (Art. 15 DSGVO):</strong> Du kannst Auskunft ueber
            die von uns verarbeiteten personenbezogenen Daten verlangen.
          </li>
          <li>
            <strong>Berichtigung (Art. 16 DSGVO):</strong> Du kannst die
            Berichtigung unrichtiger oder die Vervollstaendigung unvollstaendiger
            Daten verlangen.
          </li>
          <li>
            <strong>Loeschung (Art. 17 DSGVO):</strong> Du kannst die Loeschung
            deiner personenbezogenen Daten verlangen, sofern keine gesetzliche
            Aufbewahrungspflicht entgegensteht.
          </li>
          <li>
            <strong>Einschraenkung (Art. 18 DSGVO):</strong> Du kannst die
            Einschraenkung der Verarbeitung deiner Daten verlangen.
          </li>
          <li>
            <strong>Datenportabilitaet (Art. 20 DSGVO):</strong> Du kannst
            verlangen, dass wir dir deine Daten in einem strukturierten, gaengigen
            und maschinenlesbaren Format uebergeben.
          </li>
          <li>
            <strong>Widerspruch (Art. 21 DSGVO):</strong> Du kannst der
            Verarbeitung deiner Daten widersprechen, soweit diese auf einem
            berechtigten Interesse beruht.
          </li>
          <li>
            <strong>Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO):</strong> Du
            kannst eine erteilte Einwilligung jederzeit mit Wirkung fuer die
            Zukunft widerrufen (z. B. durch Abmelden von der Cloud-Synchronisierung
            oder Deaktivieren von Push-Benachrichtigungen).
          </li>
          <li>
            <strong>Beschwerderecht (Art. 77 DSGVO):</strong> Du hast das Recht,
            dich bei einer Datenschutz-Aufsichtsbehoerde zu beschweren.
          </li>
        </ul>

        {/* 10 */}
        <h2>10. Kontakt fuer Datenschutzanfragen</h2>
        <p>
          Fuer Auskuenfte, Loeschungsanfragen oder sonstige Anliegen zum
          Datenschutz wende dich bitte an:
        </p>
        <p>
          Maximilian Hillert<br />
          E-Mail: hello@yoursidequest.org
        </p>

        {/* 11 */}
        <h2>11. Aenderungen dieser Datenschutzerklaerung</h2>
        <p>
          Wir behalten uns vor, diese Datenschutzerklaerung anzupassen, um sie an
          geaenderte Rechtslagen oder Aenderungen der App anzupassen. Die jeweils
          aktuelle Fassung ist stets in der App abrufbar.
        </p>

        <p className="legal-updated">
          Stand: Juni 2026
        </p>
      </div>
    </div>
  );
}

/* ========================================================================== */
/*  Nutzungsbedingungen (Terms of Service)                                    */
/* ========================================================================== */

export function TermsOfService({ onBack }) {
  return (
    <div className="legal">
      <style>{CSS}</style>

      <header className="legal-header">
        <div className="legal-header-inner">
          <button className="legal-back" onClick={onBack}>
            <ArrowLeft size={18} /> Zurueck
          </button>
          <span className="legal-title">Nutzungsbedingungen</span>
        </div>
      </header>

      <div className="legal-body">
        <h1>Nutzungsbedingungen</h1>
        <p className="legal-subtitle">
          Allgemeine Bedingungen fuer die Nutzung von FlowWeek
        </p>

        {/* 1 */}
        <h2>1. Geltungsbereich</h2>
        <p>
          Diese Nutzungsbedingungen gelten fuer die Nutzung der Web-App
          "FlowWeek" (nachfolgend "die App"), die als Progressive Web App (PWA)
          unter flowweek.app bereitgestellt wird. Betreiber der App ist:
        </p>
        <p>
          Maximilian Hillert<br />
          Deutschland<br />
          E-Mail: hello@yoursidequest.org
        </p>
        <p>
          Mit der Nutzung der App erklaerst du dich mit diesen
          Nutzungsbedingungen einverstanden. Wenn du nicht einverstanden bist,
          darfst du die App nicht nutzen.
        </p>

        {/* 2 */}
        <h2>2. Leistungsbeschreibung</h2>
        <p>
          FlowWeek ist eine kostenlose Wochenplanungs-App mit
          Gamification-Elementen. Die App bietet folgende Funktionen:
        </p>
        <ul>
          <li>Erstellung und Verwaltung persoenlicher Wochenziele</li>
          <li>Automatische Wochenplanung mit Zeitslot-Zuweisung</li>
          <li>Integrierter Timer (Pomodoro / Countdown)</li>
          <li>XP- und Level-System, Badges und Streaks</li>
          <li>Wochenverlauf und Statistiken</li>
          <li>Optionale Cloud-Synchronisierung ueber Firebase</li>
          <li>Push-Benachrichtigungen (optional)</li>
        </ul>
        <p>
          Die App wird in der aktuellen Form ("as is") bereitgestellt. Ein
          Anspruch auf bestimmte Funktionen, staendige Verfuegbarkeit oder
          Weiterentwicklung besteht nicht.
        </p>

        {/* 3 */}
        <h2>3. Konto und Verantwortung</h2>
        <p>
          Die Grundfunktionen der App koennen ohne Registrierung genutzt werden.
          Alle Daten werden dabei lokal auf deinem Geraet gespeichert.
        </p>
        <p>
          Fuer die optionale Cloud-Synchronisierung ist eine Anmeldung ueber
          Google, Apple oder E-Mail/Passwort erforderlich. Du bist
          verantwortlich fuer:
        </p>
        <ul>
          <li>die Sicherheit deiner Zugangsdaten,</li>
          <li>alle Aktivitaeten, die ueber dein Konto stattfinden,</li>
          <li>die Richtigkeit der von dir angegebenen Daten.</li>
        </ul>
        <p>
          Solltest du eine unbefugte Nutzung deines Kontos feststellen, bitte
          uns umgehend informieren.
        </p>

        {/* 4 */}
        <h2>4. Zulaessige Nutzung</h2>
        <p>Du verpflichtest dich, die App ausschliesslich fuer ihren bestimmungsgemaessen
          Zweck (persoenliche Wochenplanung) zu nutzen. Insbesondere ist es
          untersagt:</p>
        <ul>
          <li>die App oder Teile davon zu dekompilieren, zu kopieren oder
            weiterzuverbreiten (soweit nicht gesetzlich erlaubt),</li>
          <li>automatisierte Zugriffe (Bots, Scraper) auf die App
            auszufuehren,</li>
          <li>die App zu nutzen, um rechtswidrige, beleidigende oder schaedliche
            Inhalte zu verarbeiten oder zu verbreiten,</li>
          <li>Sicherheitsmechanismen der App oder der zugrunde liegenden
            Infrastruktur zu umgehen oder zu stoeren.</li>
        </ul>
        <p>
          Bei Verstoessen behalten wir uns vor, den Zugang zur App oder die
          Cloud-Synchronisierung einzuschraenken oder zu sperren.
        </p>

        {/* 5 */}
        <h2>5. Datenschutz</h2>
        <p>
          Informationen zur Verarbeitung personenbezogener Daten findest du in
          unserer Datenschutzerklaerung, die Bestandteil dieser
          Nutzungsbedingungen ist.
        </p>

        {/* 6 */}
        <h2>6. Verfuegbarkeit</h2>
        <p>
          Wir bemuehen uns, die App moeglichst unterbrechungsfrei zur
          Verfuegung zu stellen. Ein Anspruch auf staendige Verfuegbarkeit
          besteht jedoch nicht. Wartungsarbeiten, technische Stoerungen oder
          hoehere Gewalt koennen zu voruebergehenden Einschraenkungen fuehren.
          Die Offline-Funktionalitaet der App (localStorage) bleibt davon
          unberuehrt.
        </p>

        {/* 7 */}
        <h2>7. Haftungsbeschraenkung</h2>
        <p>
          Die App wird kostenlos und ohne Gewaehrleistung bereitgestellt.
        </p>
        <ul>
          <li>
            <strong>Haftung fuer Vorsatz und grobe Fahrlaessigkeit:</strong> Wir
            haften unbeschraenkt fuer Schaeden, die durch vorsaetzliches oder grob
            fahrlaessiges Verhalten verursacht werden.
          </li>
          <li>
            <strong>Haftung fuer leichte Fahrlaessigkeit:</strong> Bei leichter
            Fahrlaessigkeit haften wir nur bei Verletzung wesentlicher
            Vertragspflichten (Kardinalpflichten), und auch dann nur begrenzt auf
            den vorhersehbaren, vertragstypischen Schaden.
          </li>
          <li>
            <strong>Datenverlust:</strong> Wir haften nicht fuer den Verlust
            lokal gespeicherter Daten (z. B. durch Loeschen der Browserdaten). Fuer
            Cloud-Daten gelten die vorstehenden Regelungen. Wir empfehlen
            regelmaessige Nutzung der Export-Funktion.
          </li>
          <li>
            <strong>Drittanbieter:</strong> Fuer die Verfuegbarkeit und
            Sicherheit von Drittanbieter-Diensten (Firebase, Vercel) uebernehmen
            wir keine Haftung.
          </li>
        </ul>
        <p>
          Die Haftungsbeschraenkung gilt nicht fuer Schaeden aus der Verletzung
          des Lebens, des Koerpers oder der Gesundheit sowie fuer Ansprueche
          nach dem Produkthaftungsgesetz.
        </p>

        {/* 8 */}
        <h2>8. Geistiges Eigentum</h2>
        <p>
          Alle Rechte an der App, ihrem Design, ihrem Code und ihren Inhalten
          liegen beim Betreiber, sofern nicht anders angegeben. Die Nutzung der
          App gewaehrt dir ein einfaches, nicht uebertragbares Recht zur
          bestimmungsgemaessen Verwendung. Weitergehende Rechte werden nicht
          eingeraeumt.
        </p>

        {/* 9 */}
        <h2>9. Aenderungen der Nutzungsbedingungen</h2>
        <p>
          Wir behalten uns vor, diese Nutzungsbedingungen jederzeit zu aendern.
          Aenderungen werden in der App veroeffentlicht. Die fortgesetzte
          Nutzung der App nach Veroeffentlichung geaenderter Bedingungen gilt
          als Zustimmung. Bei wesentlichen Aenderungen werden wir dich
          gesondert informieren (z. B. ueber die App oder per E-Mail, sofern ein
          Konto besteht).
        </p>

        {/* 10 */}
        <h2>10. Kuendigung</h2>
        <p>
          Du kannst die Nutzung der App jederzeit beenden, indem du die App
          nicht mehr verwendest. Wenn du ein Konto fuer die
          Cloud-Synchronisierung hast, kannst du es jederzeit ueber die
          App-Einstellungen loeschen. Wir behalten uns vor, den Zugang zur App
          bei Verstoessen gegen diese Nutzungsbedingungen einzuschraenken oder
          zu sperren.
        </p>

        {/* 11 */}
        <h2>11. Anwendbares Recht und Gerichtsstand</h2>
        <p>
          Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des
          UN-Kaufrechts. Sofern du Verbraucher bist, bleiben zwingende
          Verbraucherschutzbestimmungen deines Wohnsitzstaates unberuehrt.
        </p>
        <p>
          Sofern du Kaufmann, juristische Person des oeffentlichen Rechts oder
          oeffentlich-rechtliches Sondervermoegen bist, ist Gerichtsstand der
          Sitz des Betreibers.
        </p>

        {/* 12 */}
        <h2>12. Salvatorische Klausel</h2>
        <p>
          Sollten einzelne Bestimmungen dieser Nutzungsbedingungen unwirksam
          sein oder werden, bleibt die Wirksamkeit der uebrigen Bestimmungen
          unberuehrt. An die Stelle der unwirksamen Bestimmung tritt eine
          Regelung, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am
          naechsten kommt.
        </p>

        {/* 13 */}
        <h2>13. Kontakt</h2>
        <p>
          Bei Fragen zu diesen Nutzungsbedingungen wende dich bitte an:
        </p>
        <p>
          Maximilian Hillert<br />
          E-Mail: hello@yoursidequest.org
        </p>

        <p className="legal-updated">
          Stand: Juni 2026
        </p>
      </div>
    </div>
  );
}
