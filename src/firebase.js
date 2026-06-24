import { initializeApp, getApps } from "firebase/app";
import {
  getAuth, GoogleAuthProvider, OAuthProvider,
  signInWithPopup, signOut, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

const cfg = {
  apiKey:        import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:     import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId:         import.meta.env.VITE_FIREBASE_APP_ID,
};

export const fbReady = !!cfg.apiKey;

let _auth, _db;
if (fbReady) {
  const app = getApps().length ? getApps()[0] : initializeApp(cfg);
  _auth = getAuth(app);
  _db   = getFirestore(app);
}

export const signInGoogle = () =>
  signInWithPopup(_auth, new GoogleAuthProvider());

export const signInApple = () => {
  const p = new OAuthProvider("apple.com");
  p.addScope("email");
  p.addScope("name");
  return signInWithPopup(_auth, p);
};

export const signOutUser = () => signOut(_auth);

export const signInEmail = (email, password) =>
  signInWithEmailAndPassword(_auth, email, password);

export const signUpEmail = (email, password) =>
  createUserWithEmailAndPassword(_auth, email, password);

export const onAuth = (cb) => {
  if (!fbReady) { setTimeout(() => cb(null), 0); return () => {}; }
  return onAuthStateChanged(_auth, cb);
};

export async function loadCloud(uid) {
  if (!_db) return null;
  try {
    const snap = await getDoc(doc(_db, "users", uid));
    return snap.exists() ? snap.data() : null;
  } catch { return null; }
}

export async function saveCloud(uid, state) {
  if (!_db || !uid) return;
  try { await setDoc(doc(_db, "users", uid), state); }
  catch { /* offline / permissions */ }
}

export async function deleteAccount() {
  const user = _auth?.currentUser;
  if (!user) return;
  try { await deleteDoc(doc(_db, "users", user.uid)); } catch { /* ignore */ }
  await user.delete();
}
