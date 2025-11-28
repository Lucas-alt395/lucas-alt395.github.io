import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

// Auto-load user data
onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem("loggedInUserId");

    if (!loggedInUserId) {
        window.location.href = "index.html";
        return;
    }

    const docRef = doc(db, "users", loggedInUserId);

    getDoc(docRef)
        .then((docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();

                // Basic Info
                document.getElementById("loggedUserFName").innerText = userData.firstName;
                document.getElementById("loggedUserLName").innerText = userData.lastName;
                document.getElementById("loggedUserEmail").innerText = userData.email;
                document.getElementById("loggedUserBalance").innerText = userData.balance;

                // Transactions List
                const txList = document.getElementById("transactionsList");
                txList.innerHTML = "";

                if (Array.isArray(userData.transactions)) {
                    userData.transactions.forEach((t) => {
                        const box = document.createElement("div");
                        box.className = "transactionBox";
                        box.innerHTML = `
                            <strong>Type:</strong> ${t.type}<br>
                            <strong>Bedrag:</strong> ${t.amount} Luukies<br>
                            <strong>Van:</strong> ${t.sender}<br>
                            <strong>Naar:</strong> ${t.reciever}<br>
                            <strong>Datum:</strong> ${t.date}
                        `;
                        txList.appendChild(box);
                    });
                } else {
                    txList.innerHTML = "<i>Geen transacties gevonden.</i>";
                }
            } else {
                console.log("User document not found.");
            }
        })
        .catch((error) => {
            console.error("Error getting document:", error);
        });
});

// Logout
document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("loggedInUserId");
    signOut(auth).then(() => {
        window.location.href = "index.html";
    });
});