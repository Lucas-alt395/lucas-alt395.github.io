// homepage.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase config (same as your other files)
const firebaseConfig = {
  apiKey: "AIzaSyCcpJXEljlctWX28PzeuwxrCGgg9sHqx4Q",
  authDomain: "luukische-bank-reaal.firebaseapp.com",
  projectId: "luukische-bank-reaal",
  storageBucket: "luukische-bank-reaal.firebasestorage.app",
  messagingSenderId: "270642140466",
  appId: "1:270642140466:web:252b99b44eda3d14f4f32b"
};

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// helper
function safeSetText(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerText = text ?? "";
}

// Wait for auth state — still use localStorage as fallback
onAuthStateChanged(auth, async (user) => {
  try {
    // *** This line was removed earlier — it's back now ***
    // prefer the signed-in user's uid, otherwise use localStorage
    const userId = user?.uid || localStorage.getItem("loggedInUserId");

    if (!userId) {
      console.warn("No UID found (auth + localStorage missing). Redirecting to login.");
      window.location.href = "index.html";
      return;
    }

    console.log("Loading homepage for uid:", userId);

    // Load the user document
    const userDocRef = doc(db, "users", userId);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      console.warn("User document not found for uid:", userId);
      window.location.href = "index.html";
      return;
    }

    const data = userSnap.data();

    safeSetText("loggedUserFName", data.firstName || "");
    safeSetText("loggedUserLName", data.lastName || "");
    safeSetText("loggedUserEmail", data.email || "");
    safeSetText("loggedUserBalance", data.balance ?? "0");

    // Load transactions from subcollection users/{uid}/transactions
    const txContainer = document.getElementById("loggedUserTransactions");
    if (!txContainer) return;

    txContainer.innerHTML = "Laden...";

    const txColl = collection(db, "users", userId, "transactions");

    // Try ordering by createdAt if you store it, otherwise just fetch
    let txQuery;
    try {
      txQuery = query(txColl, orderBy("createdAt", "desc"));
    } catch (e) {
      // if createdAt doesn't exist or orderBy throws, fallback to txColl directly
      txQuery = txColl;
    }

    const txSnap = await getDocs(txQuery);

    if (txSnap.empty) {
      txContainer.innerHTML = "Geen transacties gevonden.";
    } else {
      txContainer.innerHTML = "";
      // build array (so we can sort or inspect if needed)
      const txArr = [];
      txSnap.forEach(docSnap => {
        const tx = docSnap.data();
        tx._id = docSnap.id;
        txArr.push(tx);
      });

      // Optional: if createdAt is a Firestore Timestamp, you could sort here.
      // Render
      txArr.forEach((tx, i) => {
        const div = document.createElement("div");
        div.className = "transactionBox";
        div.style.marginBottom = "12px";
        div.innerHTML = `
          <strong>Transactie ${i+1}</strong><br>
          Bedrag: ${tx.amount ?? "—"} Luukies<br>
          Datum: ${tx.date ?? tx.createdAt ?? "—"}<br>
          Van: ${tx.from ?? tx.sender ?? "—"}<br>
          Naar: ${tx.to ?? tx.reciever ?? "—"}<br>
          Beschrijving: ${tx.description ?? "—"}
        `;
        txContainer.appendChild(div);
      });
    }

  } catch (err) {
    console.error("homepage load error:", err);
    const txContainer = document.getElementById("loggedUserTransactions");
    if (txContainer) txContainer.innerText = "Error bij laden transacties — check console.";
  }
});

// Logout (safe guard)
const logoutEl = document.getElementById("logout");
if (logoutEl) {
  logoutEl.addEventListener("click", async () => {
    try {
      localStorage.removeItem("loggedInUserId");
      await signOut(auth);
      window.location.href = "index.html";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  });
}