# FlowWeek — Setup & Launch Guide

## 1. Firebase einrichten

### Projekt erstellen
1. Gehe zu https://console.firebase.google.com
2. "Projekt hinzufügen" → Name: `flowweek`
3. Google Analytics deaktivieren (nicht nötig)
4. Projekt erstellen

### Authentication aktivieren
1. Build → Authentication → "Erste Schritte"
2. Anmeldemethoden aktivieren:
   - **E-Mail/Passwort** → Aktivieren
   - **Google** → Aktivieren → Support-E-Mail eintragen
   - **Apple** → Aktivieren (benötigt Apple Developer Account, siehe Abschnitt 3)
3. Unter "Einstellungen" → "Autorisierte Domains":
   - `flowweek-five.vercel.app` hinzufügen
   - Später: eigene Domain hinzufügen

### Firestore Database erstellen
1. Build → Firestore Database → "Datenbank erstellen"
2. Standort: `europe-west3` (Frankfurt)
3. "Im Produktionsmodus starten"
4. Sicherheitsregeln setzen:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write, delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### API-Keys kopieren
1. Projekteinstellungen (Zahnrad) → Allgemein
2. "Web-App" hinzufügen → Name: `FlowWeek Web`
3. Die Config-Werte kopieren

### .env Datei erstellen
Erstelle `.env` im Projekt-Root:
```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=flowweek-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=flowweek-xxxxx
VITE_FIREBASE_APP_ID=1:000000000:web:abc123
```

### Vercel Environment Variables
1. https://vercel.com/dashboard → flowweek → Settings → Environment Variables
2. Dieselben 4 Keys eintragen
3. Redeploy auslösen

---

## 2. Apple Developer Account

### Account erstellen
1. https://developer.apple.com/programs/enroll/
2. Mit Apple ID anmelden (oder neue erstellen)
3. "Enroll" → als Privatperson
4. 99 €/Jahr — Kreditkarte oder Banküberweisung
5. Dauert 24-48h bis Freischaltung

### Apple Sign-In konfigurieren
1. In developer.apple.com → Certificates, Identifiers & Profiles
2. Identifiers → App IDs → Neues App ID:
   - Description: `FlowWeek`
   - Bundle ID: `app.flowweek`
   - Capabilities: "Sign In with Apple" aktivieren
3. Unter Services IDs → Neues Service ID:
   - Identifier: `app.flowweek.auth`
   - "Sign In with Apple" konfigurieren:
     - Domain: `flowweek-xxxxx.firebaseapp.com`
     - Return URL: `https://flowweek-xxxxx.firebaseapp.com/__/auth/handler`
4. In Firebase Console → Authentication → Apple:
   - Service ID eintragen: `app.flowweek.auth`
   - Team ID von developer.apple.com kopieren

---

## 3. iOS App (Xcode)

### Voraussetzungen
- Mac mit Xcode 15+ (aus dem App Store)
- Apple Developer Account (siehe oben)

### App bauen
```bash
npm run build:native    # Baut Web + synct nach native
npm run open:ios        # Öffnet Xcode
```

### In Xcode
1. Target "App" auswählen → Signing & Capabilities
2. Team: Deinen Apple Developer Account auswählen
3. Bundle Identifier: `app.flowweek`
4. "Automatically manage signing" aktivieren
5. iPhone anschließen oder Simulator wählen → Run (⌘R)

### TestFlight Upload
1. In Xcode: Product → Archive
2. Archive auswählen → "Distribute App"
3. "App Store Connect" → Upload
4. In https://appstoreconnect.apple.com → TestFlight:
   - Build erscheint nach 10-20 min
   - Interne Tester einladen

### App Store Submission
1. App Store Connect → "Neue App":
   - Name: `FlowWeek`
   - Bundle ID: `app.flowweek`
   - SKU: `flowweek-001`
   - Primäre Sprache: Deutsch
2. App-Informationen ausfüllen (siehe Abschnitt 5)
3. Build zuweisen
4. "Zur Überprüfung einreichen"
5. Review dauert 24-48h

---

## 4. Android App (Play Store)

### Voraussetzungen
- Android Studio installieren
- Google Play Developer Account (einmalig 25$)
  https://play.google.com/console/signup

### App bauen
```bash
npm run build:native
npm run open:android    # Öffnet Android Studio
```

### Signierter Release-Build
1. In Android Studio: Build → Generate Signed Bundle
2. "Android App Bundle" wählen
3. Keystore erstellen (beim ersten Mal):
   - Sicher aufbewahren! Ohne Keystore kein Update möglich
4. Release-Build generieren

### Play Store Upload
1. Google Play Console → "App erstellen"
2. App-Details ausfüllen (siehe Abschnitt 5)
3. Interner Test → AAB hochladen
4. Store-Eintrag ausfüllen
5. "Zur Überprüfung einreichen"

---

## 5. App Store Metadaten

### App Name
`FlowWeek — Wochenplaner`

### Untertitel (Apple) / Kurzbeschreibung (Google)
`Plane deine Woche. Bleib dran. Level auf.`

### Beschreibung
```
FlowWeek ist dein persönlicher Wochenplaner mit eingebautem Gamification-System.

Wähle deine Ziele — Sport, Lernen, Lesen oder eigene — und FlowWeek verteilt sie automatisch auf freie Zeitslots in deiner Woche. Starte den integrierten Timer, sammle XP und steige im Level auf.

FEATURES:
• Smarte Wochenplanung — Einheiten werden automatisch um deine festen Termine herum geplant
• Pomodoro-Timer & Countdown — direkt in der App
• XP & Level-System — Gamification hält dich langfristig motiviert
• Wochenverlauf — verfolge deinen Fortschritt über Wochen hinweg
• Erfolge & Badges — schalte Auszeichnungen frei
• Notizen & Stimmung — halte fest wie jede Einheit lief
• Cloud-Sync — optional mit Google oder Apple anmelden
• Dunkles Design — für jede Tageszeit
• Komplett kostenlos — keine Werbung, keine In-App-Käufe

Deine Daten gehören dir. FlowWeek speichert alles lokal auf deinem Gerät. Cloud-Sync ist optional und erfordert eine Anmeldung.

Starte jetzt — in 2 Minuten steht dein erster Wochenplan.
```

### Keywords (Apple, max 100 Zeichen)
`wochenplaner,habit,tracker,pomodoro,timer,routine,ziele,gamification,xp,produktivität`

### Kategorie
- Apple: Productivity
- Google: Productivity

### Altersfreigabe
- Apple: 4+ (kein bedenklicher Inhalt)
- Google: USK ab 0

---

## 6. Custom Domain

### Domain kaufen
Empfehlung: `flowweek.app` bei Namecheap oder Cloudflare (~15€/Jahr)

### Bei Vercel konfigurieren
1. Vercel Dashboard → flowweek → Settings → Domains
2. Domain hinzufügen: `flowweek.app`
3. DNS-Einträge bei deinem Domain-Provider setzen:
   - A Record: `76.76.21.21`
   - CNAME: `cname.vercel-dns.com`
4. SSL wird automatisch konfiguriert

### Firebase Auth Domain updaten
1. Firebase Console → Authentication → Settings → Authorized domains
2. `flowweek.app` hinzufügen
3. In `.env` und Vercel: `VITE_FIREBASE_AUTH_DOMAIN=flowweek.app`

---

## 7. Checkliste vor dem Launch

- [ ] Firebase-Projekt erstellt + API-Keys in .env und Vercel
- [ ] Apple Developer Account erstellt
- [ ] Apple Sign-In konfiguriert
- [ ] Google Play Developer Account erstellt
- [ ] iOS-App in Xcode gebaut + TestFlight-Upload
- [ ] Android-App in Android Studio gebaut + Play Store Upload
- [ ] Custom Domain gekauft + bei Vercel konfiguriert
- [ ] Impressum mit echten Daten ausgefüllt
- [ ] Datenschutzerklärung verlinkt
- [ ] App Store Screenshots erstellt (6 Screens pro Gerät)
- [ ] App Store Beschreibung + Keywords eingetragen
- [ ] TestFlight/Interner Test mit 3-5 Personen
- [ ] Feedback einarbeiten
- [ ] Zur Review einreichen
