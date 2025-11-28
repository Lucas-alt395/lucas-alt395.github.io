// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { 
    getFirestore, 
    setDoc, 
    doc 
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Your Firebase config
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

// Message popup function
function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;

    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}



//////////////////////////////////////////////////////
//  🔹 SIGN UP 
//////////////////////////////////////////////////////

const signUp = document.getElementById('submitSignUp');

if (signUp) {
    signUp.addEventListener('click', (event) => {
        event.preventDefault();

        const email = document.getElementById('rEmail').value;
        const password = document.getElementById('rPassword').value;
        const firstName = document.getElementById('fName').value;
        const lastName = document.getElementById('lName').value;

        const auth = getAuth();
        const db = getFirestore();

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                // 🔥 Full Firestore document structure (matching your screenshot)
                const userData = {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    extrainfo: "",
                    balance: 100,  
                    transactions: [
                        {
                            amount: 100,
                            type: "transfer",
                            sender: "admin@example.com",
                            reciever: email,
                            date: new Date().toLocaleDateString("nl-NL")
                        }
                    ]
                };

                const docRef = doc(db, "users", user.uid);

                setDoc(docRef, userData)
                    .then(() => {
                        showMessage("Account Created Successfully", "signUpMessage");
                        window.location.href = "index.html"; // back to login
                    })
                    .catch((error) => {
                        console.error("Error writing Firestore document:", error);
                        showMessage("Database error", "signUpMessage");
                    });
            })
            .catch((error) => {
                const errorCode = error.code;

                if (errorCode === "auth/email-already-in-use") {
                    showMessage("Email already exists!", "signUpMessage");
                } else {
                    showMessage("Unable to create account", "signUpMessage");
                }
            });
    });
}



//////////////////////////////////////////////////////
//  🔹 SIGN IN 
//////////////////////////////////////////////////////

const signIn = document.getElementById('submitSignIn');

if (signIn) {
    signIn.addEventListener('click', (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const auth = getAuth();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {

                const user = userCredential.user;
                localStorage.setItem("loggedInUserId", user.uid);

                showMessage("Login successful!", "signInMessage");

                setTimeout(() => {
                    window.location.href = "homepage.html";
                }, 1000);
            })
            .catch((error) => {
                const errorCode = error.code;

                if (errorCode === "auth/invalid-credential") {
                    showMessage("Incorrect Email or Password", "signInMessage");
                } else {
                    showMessage("Account does not exist", "signInMessage");
                }
            });
    });
}