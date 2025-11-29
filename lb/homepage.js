// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// ---------------------------------------
// 🔥 Firebase Configuration
// ---------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyCcpJXEljlctWX28PzeuwxrCGgg9sHqx4Q",
    authDomain: "luukische-bank-reaal.firebaseapp.com",
    projectId: "luukische-bank-reaal",
    storageBucket: "luukische-bank-reaal.firebasestorage.app",
    messagingSenderId: "270642140466",
    appId: "1:270642140466:web:252b99b44eda3d14f4f32b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();


// --------------------------------------------------
// 🚀 FUNCTION: Show floating message
// --------------------------------------------------
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;

    setTimeout(() => {
        messageDiv.style.opacity = 0;
    }, 5000);
}


// --------------------------------------------------
// 🚀 SIGN UP
// --------------------------------------------------
const signUp = document.getElementById("submitSignUp");

signUp.addEventListener("click", async (event) => {
    event.preventDefault();

    const email = document.getElementById("rEmail").value;
    const password = document.getElementById("rPassword").value;
    const firstName = document.getElementById("fName").value;
    const lastName = document.getElementById("lName").value;

    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCred.user.uid;

        // --- Create main user doc ---
        await setDoc(doc(db, "users", uid), {
            email: email,
            firstName: firstName,
            lastName: lastName,
            balance: 200
        });

        // --- Create initial subcollection entry ---
        await addDoc(collection(db, "users", uid, "transactions"), {
            amount: 0,
            sender: "BANK",
            reciever: `${firstName} ${lastName}`,
            date: new Date().toISOString()
        });

        showMessage("Account Created Successfully", "signUpMessage");

        // redirect
        window.location.href = "index.html";

    } catch (error) {
        console.error(error);

        if (error.code === "auth/email-already-in-use") {
            showMessage("Email already exists!", "signUpMessage");
        } else {
            showMessage("Unable to create account", "signUpMessage");
        }
    }
});


// --------------------------------------------------
// 🚀 SIGN IN
// --------------------------------------------------
const signIn = document.getElementById("submitSignIn");

signIn.addEventListener("click", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCred.user.uid;

        localStorage.setItem("loggedInUserId", uid);

        showMessage("Login successful", "signInMessage");
        window.location.href = "homepage.html";

    } catch (error) {
        console.error(error);

        if (error.code === "auth/invalid-credential") {
            showMessage("Wrong email or password", "signInMessage");
        } else {
            showMessage("Account does not exist", "signInMessage");
        }
    }
});