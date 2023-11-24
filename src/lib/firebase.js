import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, doc, getFirestore } from "firebase/firestore/lite";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_API_KEY,
    authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_APP_ID,
    measurementId: import.meta.env.VITE_APP_MEASUREMENT_ID,
};

// Initialize our firebase for our application
let app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let db = getFirestore(app);
const datasetCollection = collection(db, "datasets");
const templatesCollection = collection(db, "templates");
const userDoc = (userId) => doc(db, "users", userId);
const datasetDoc = (datasetId) => doc(db, "datasets", datasetId)

export {
    auth,
    db,
    datasetCollection,
    userDoc,
    datasetDoc,
    templatesCollection
}