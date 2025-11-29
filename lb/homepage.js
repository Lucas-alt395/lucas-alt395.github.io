import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { 
    getFirestore, 
    getDoc, 
    doc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

    if (!userId) {
        console.log("User ID missing → redirecting");
        window.location.href = "index.html";
        return;
    }

    try {
        // Load user profile
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.log("User doc doesn't exist");
            return;
        }

        const data = docSnap.data();

        // Fill homepage user info
        document.getElementById("loggedUserFName").innerText = data.firstName;
        document.getElementById("loggedUserLName").innerText = data.lastName;
        document.getElementById("loggedUserEmail").innerText = data.email;
        document.getElementById("loggedUserBalance").innerText = data.balance;

        // === Load subcollection "transactions" ===
        const txContainer = document.getElementById("loggedUserTransactions");

        const txRef = collection(db, "users", userId, "transactions");
        const txSnap = await getDocs(txRef);

        if (txSnap.empty) {
            txContainer.innerHTML = "Geen transacties gevonden.";
        } else {
            txContainer.innerHTML = ""; // clear

            txSnap.forEach((txDoc) => {
                const tx = txDoc.data();

                const div = document.createElement("div");
                div.style.marginBottom = "15px";

                div.innerHTML = `
                    <strong>Transactie</strong><br>
                    Bedrag: <strong>Ł${tx.amount}</strong><br>
                    Datum: <strong>${tx.date}</strong><br>
                    Van: <strong>${tx.from}</strong><br>
                    Naar: <strong>${tx.to}</strong><br>
                    Beschrijving: <strong>${tx.description}</strong>
                `;

                txContainer.appendChild(div);
            });
        }

    } catch (error) {
        console.error("Error loading user:", error);
    }
});

// ==== LOGOUT ====
document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
        .then(() => (window.location.href = "index.html"))
        .catch((err) => console.error("Logout failed:", err));
});