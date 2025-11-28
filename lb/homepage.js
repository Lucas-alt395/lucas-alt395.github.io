import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCcpJXEljlctWX28PzeuwxrCGgg9sHqx4Q",
    authDomain: "luukische-bank-reaal.firebaseapp.com",
    projectId: "luukische-bank-reaal",
    storageBucket: "luukische-bank-reaal.firebasestorage.app",
    messagingSenderId: "270642140466",
    appId: "1:270642140466:web:252b99b44eda3d14f4f32b"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, async (user) => {
    const userId = localStorage.getItem('loggedInUserId');
    if (!userId) return (window.location.href = "index.html");

    try {
        const docSnap = await getDoc(doc(db, "users", userId));
        if (!docSnap.exists()) return;

        const data = docSnap.data();

        document.getElementById("loggedUserFName").innerText = data.firstName;
        document.getElementById("loggedUserLName").innerText = data.lastName;
        document.getElementById("loggedUserEmail").innerText = data.email;
        document.getElementById("loggedUserBalance").innerText = data.balance;

        // 🔥 Fix transactions
        let transactions = data.transactions;

        // If Firestore stores them as a map (0, 1, 2...)
        if (!Array.isArray(transactions)) {
            transactions = Object.values(transactions);
        }

        const txContainer = document.getElementById("loggedUserTransactions");

        if (transactions.length > 0) {
            txContainer.innerHTML = "";

            transactions.forEach((tx, index) => {
                const div = document.createElement("div");
                div.style.marginBottom = "15px";

                div.innerHTML = `
                    <strong>Transactie #${index + 1}</strong><br>
                    Type: ${tx.type}<br>
                    Bedrag: ${tx.amount}<br>
                    Datum: ${tx.date}<br>
                    Van: ${tx.sender}<br>
                    Naar: ${tx.reciever}
                `;

                txContainer.appendChild(div);
            });
        } else {
            txContainer.innerHTML = "Geen transacties gevonden.";
        }

    } catch (e) {
        console.error(e);
    }
});

// Logout
document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth).then(() => (window.location.href = "index.html"));
});