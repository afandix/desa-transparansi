import {
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "./firebase.js";

const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const msg = document.getElementById("loginMsg");

// jika sudah login, langsung ke admin
onAuthStateChanged(auth, (user) => {
  if (user) window.location.href = "./admin.html";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "Memproses...";
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    window.location.href = "./admin.html";
  } catch (err) {
    console.error(err);
    msg.textContent =
      "Gagal login: " + (err?.message || "Periksa email & password.");
  }
});
