import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { type Auth } from 'firebase/auth';
import { collection, doc, getFirestore } from 'firebase/firestore/lite';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_API_KEY,
  authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_APP_ID,
  measurementId: import.meta.env.VITE_APP_MEASUREMENT_ID
};

// Initialize our firebase for our application
const app = initializeApp(firebaseConfig);
let auth: Auth;
try {
  auth = getAuth(app);
} catch (err) {
  console.error('Firebase auth initialization failed:', err);
}
const db = getFirestore(app);
const storage = getStorage(app);

const datasetCollection = collection(db, 'datasets');
const feedbackCollection = collection(db, 'feedback');
const templatesCollection = collection(db, 'templates');
const keysCollection = collection(db, 'keys');
const userDoc = (userId) => doc(db, 'users', userId);
const datasetDoc = (datasetId) => doc(db, 'datasets', datasetId);

export {
  auth,
  db,
  datasetCollection,
  userDoc,
  datasetDoc,
  templatesCollection,
  feedbackCollection,
  keysCollection,
  storage
};
