import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, doc, getFirestore } from "firebase/firestore/lite";


const firebaseConfig = {
    apiKey: "AIzaSyDQbMGQiTtondvwzemQoruhSblAZAn9YWs",
    authDomain: "tttc-turbo.firebaseapp.com",
    projectId: "tttc-turbo",
    storageBucket: "tttc-turbo.appspot.com",
    messagingSenderId: "874304113146",
    appId: "1:874304113146:web:da5fbc2e012f47d8507c43",
    measurementId: "G-DJ457VF8Z1",
};

// Initialize our firebase for our application
let app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let db = getFirestore(app);
const blogCollection = collection(db, "blogs");
const userDoc = (userId) => doc(db, "users", userId);
const blogDoc = (blogId) => doc(db, "blogs", blogId)

export {
    auth,
    db,
    blogCollection,
    userDoc,
    blogDoc
}