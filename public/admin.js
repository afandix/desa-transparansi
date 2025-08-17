// ====== public/admin.js ======
import {
  auth,
  onAuthStateChanged,
  signOut,
  db,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "./firebase.js";
import { formatRupiah, fmtPercent, yearOptions } from "./utils.js";

// Proteksi halaman: harus login
onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "./login.html";
});

// Tombol keluar
const btnOut = document.getElementById("btnSignOut");
if (btnOut)
  btnOut.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "./login.html";
  });

// Isi dropdown tahun
const budgetYear = document.getElementById("budgetYear");
const projectYear = document.getElementById("projectYear");
const filterBudgetYear = document.getElementById("filterBudgetYear");
const filterProjectYear = document.getElementById("filterProjectYear");
[budgetYear, projectYear, filterBudgetYear, filterProjectYear].forEach((el) =>
  yearOptions(el)
);

// ---------- CRUD: Anggaran (budgets) ----------
const budgetForm = document.getElementById("budgetForm");
const budgetCategory = document.getElementById("budgetCategory");
const budgetSub = document.getElementById("budgetSub");
const budgetAmount = document.getElementById("budgetAmount");
const budgetRealized = document.getElementById("budgetRealized");
const budgetMsg = document.getElementById("budgetMsg");
const budgetRows = document.getElementById("budgetRows");
const budgetCancel = document.getElementById("budgetCancel");

let editingBudgetId = null;

async function loadBudgets() {
  const y = Number(filterBudgetYear.value);
  const ref = collection(db, "budgets");
  // Urut: category → subcategory (tambahkan index jika diminta Firestore)
  const qy = query(
    ref,
    where("year", "==", y),
    orderBy("category"),
    orderBy("subcategory")
  );
  const snap = await getDocs(qy);
  budgetRows.innerHTML = "";
  snap.forEach((row) => {
    const d = row.data();
    budgetRows.insertAdjacentHTML(
      "beforeend",
      `
      <tr data-id="${row.id}">
        <td>${d.category}</td>
        <td>${d.subcategory}</td>
        <td class="right">${formatRupiah(d.amount)}</td>
        <td class="right">${formatRupiah(d.realized)}</td>
        <td class="right">${fmtPercent(d.realized, d.amount)}</td>
        <td>
          <button class="btn btn-ghost btn-edit">Edit</button>
          <button class="btn btn-ghost btn-delete">Hapus</button>
        </td>
      </tr>
    `
    );
  });
}
filterBudgetYear.addEventListener("change", loadBudgets);
loadBudgets();

budgetForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  budgetMsg.textContent = "Menyimpan...";
  const payload = {
    year: Number(budgetYear.value),
    category: budgetCategory.value,
    subcategory: budgetSub.value.trim(),
    amount: Number(budgetAmount.value || 0),
    realized: Number(budgetRealized.value || 0),
    updatedAt: serverTimestamp(),
  };
  try {
    if (editingBudgetId) {
      await updateDoc(doc(db, "budgets", editingBudgetId), payload);
    } else {
      await addDoc(collection(db, "budgets"), payload);
    }
    budgetMsg.textContent = "Tersimpan.";
    budgetForm.reset();
    editingBudgetId = null;
    budgetCancel.style.display = "none";
    loadBudgets();
  } catch (err) {
    console.error(err);
    budgetMsg.textContent = "Gagal menyimpan: " + (err?.message || "");
  }
});

budgetRows.addEventListener("click", async (e) => {
  const tr = e.target.closest("tr");
  if (!tr) return;
  const id = tr.getAttribute("data-id");
  if (e.target.classList.contains("btn-edit")) {
    budgetYear.value = filterBudgetYear.value;
    budgetCategory.value = tr.children[0].textContent;
    budgetSub.value = tr.children[1].textContent;
    budgetAmount.value = Number(tr.children[2].textContent.replace(/\D/g, ""));
    budgetRealized.value = Number(
      tr.children[3].textContent.replace(/\D/g, "")
    );
    editingBudgetId = id;
    budgetCancel.style.display = "inline-block";
    budgetMsg.textContent = "Mode edit: ubah data lalu Simpan.";
  }
  if (e.target.classList.contains("btn-delete")) {
    if (confirm("Hapus item anggaran ini?")) {
      await deleteDoc(doc(db, "budgets", id));
      loadBudgets();
    }
  }
});
budgetCancel.addEventListener("click", () => {
  editingBudgetId = null;
  budgetForm.reset();
  budgetCancel.style.display = "none";
  budgetMsg.textContent = "";
});

// ---------- CRUD: Proyek (projects) ----------
const projectForm = document.getElementById("projectForm");
const projectStatus = document.getElementById("projectStatus");
const projectTitle = document.getElementById("projectTitle");
const projectProgress = document.getElementById("projectProgress");
const projectBudget = document.getElementById("projectBudget");
const projectDesc = document.getElementById("projectDesc");
const projectMsg = document.getElementById("projectMsg");
const projectRows = document.getElementById("projectRows");
const projectCancel = document.getElementById("projectCancel");

let editingProjectId = null;

async function loadProjects() {
  const y = Number(filterProjectYear.value);
  const ref = collection(db, "projects");
  // Urut: status → title (tambahkan index jika diminta Firestore)
  const qy = query(
    ref,
    where("year", "==", y),
    orderBy("status"),
    orderBy("title")
  );
  const snap = await getDocs(qy);
  projectRows.innerHTML = "";
  snap.forEach((row) => {
    const d = row.data();
    projectRows.insertAdjacentHTML(
      "beforeend",
      `
      <tr data-id="${row.id}">
        <td>${d.title}</td>
        <td><span class="badge ${
          d.status === "selesai"
            ? "ok"
            : d.status === "pelaksanaan"
            ? "warn"
            : ""
        }">${d.status}</span></td>
        <td class="right">${Number(d.progress || 0)}%</td>
        <td class="right">${formatRupiah(d.budget)}</td>
        <td>${d.description || ""}</td>
        <td>
          <button class="btn btn-ghost btn-edit">Edit</button>
          <button class="btn btn-ghost btn-delete">Hapus</button>
        </td>
      </tr>
    `
    );
  });
}
filterProjectYear.addEventListener("change", loadProjects);
loadProjects();

projectForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  projectMsg.textContent = "Menyimpan...";
  const payload = {
    year: Number(projectYear.value),
    status: projectStatus.value,
    title: projectTitle.value.trim(),
    progress: Math.max(0, Math.min(100, Number(projectProgress.value || 0))),
    budget: Number(projectBudget.value || 0),
    description: projectDesc.value.trim(),
    updatedAt: serverTimestamp(),
  };
  try {
    if (editingProjectId) {
      await updateDoc(doc(db, "projects", editingProjectId), payload);
    } else {
      await addDoc(collection(db, "projects"), payload);
    }
    projectMsg.textContent = "Tersimpan.";
    projectForm.reset();
    editingProjectId = null;
    projectCancel.style.display = "none";
    loadProjects();
  } catch (err) {
    console.error(err);
    projectMsg.textContent = "Gagal menyimpan: " + (err?.message || "");
  }
});

projectRows.addEventListener("click", async (e) => {
  const tr = e.target.closest("tr");
  if (!tr) return;
  const id = tr.getAttribute("data-id");
  if (e.target.classList.contains("btn-edit")) {
    projectYear.value = filterProjectYear.value;
    projectTitle.value = tr.children[0].textContent;
    projectStatus.value =
      tr.querySelector(".badge")?.textContent || "perencanaan";
    projectProgress.value = Number(
      tr.children[2].textContent.replace(/\D/g, "")
    );
    projectBudget.value = Number(tr.children[3].textContent.replace(/\D/g, ""));
    projectDesc.value = tr.children[4].textContent;
    editingProjectId = id;
    projectCancel.style.display = "inline-block";
    projectMsg.textContent = "Mode edit: ubah data lalu Simpan.";
  }
  if (e.target.classList.contains("btn-delete")) {
    if (confirm("Hapus proyek ini?")) {
      await deleteDoc(doc(db, "projects", id));
      loadProjects();
    }
  }
});
projectCancel.addEventListener("click", () => {
  editingProjectId = null;
  projectForm.reset();
  projectCancel.style.display = "none";
  projectMsg.textContent = "";
});
