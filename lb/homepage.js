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
        // Firestore refs
const auth = firebase.auth();
const db = firebase.firestore();

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "index.html"; // redirect if not logged in
    return;
  }

  const userRef = db.collection("users").doc(user.uid);
  const transRef = userRef.collection("transactions");

  // ---------- ADD TRANSACTION ----------
  const form = document.getElementById("newTransactionForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const amount = Number(document.getElementById("transAmount").value);
    const description = document.getElementById("transDesc").value;
    const msg = document.getElementById("transMessage");

    try {
      await transRef.add({
        amount: amount,
        description: description,
        timestamp: firebase.firestore.Timestamp.now()
      });

      msg.innerText = "Transaction added!";
      msg.style.color = "green";

      form.reset();

      // Reload transaction list
      loadTransactions();

    } catch (err) {
      msg.innerText = "Error: " + err.message;
      msg.style.color = "red";
    }
  });

  // ---------- LOAD TRANSACTIONS ----------
  async function loadTransactions() {
    const list = document.getElementById("transactionsList");
    list.innerHTML = "Loading...";

    const snap = await transRef.orderBy("timestamp", "desc").get();

    list.innerHTML = "";
    snap.forEach(d => {
      const item = d.data();
      const li = document.createElement("li");
      li.textContent = `${item.amount}€ - ${item.description}`;
      list.appendChild(li);
    });
  }

  loadTransactions();
});

    } catch (e) {
        console.error(e);
    }
});

// Logout
document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth).then(() => (window.location.href = "index.html"));
});