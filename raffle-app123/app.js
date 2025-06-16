import { auth, db } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const register = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  await createUserWithEmailAndPassword(auth, email, password);
};

const login = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  await signInWithEmailAndPassword(auth, email, password);
};

const saveTicket = async () => {
  const ticketName = document.getElementById("ticketName").value;
  const ticketNumber = document.getElementById("ticketNumber").value;
  const user = auth.currentUser;
  if (user) {
    await addDoc(collection(db, "users", user.uid, "tickets"), {
      name: ticketName,
      number: ticketNumber
    });
    loadTickets(user.uid);
  }
};

const loadTickets = async (uid) => {
  const querySnapshot = await getDocs(collection(db, "users", uid, "tickets"));
  const list = document.getElementById("ticketList");
  list.innerHTML = "";
  querySnapshot.forEach((doc) => {
    const li = document.createElement("li");
    li.textContent = `${doc.data().name} - ${doc.data().number}`;
    list.appendChild(li);
  });
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("dashboard").style.display = "block";
    loadTickets(user.uid);
  }
});

window.register = register;
window.login = login;
window.saveTicket = saveTicket;
