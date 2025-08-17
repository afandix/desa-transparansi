// ====== public/app.js ======
import { db, collection, query, where, getDocs, orderBy } from "./firebase.js";
import { formatRupiah, fmtPercent, yearOptions } from "./utils.js";

const yearSelect = document.getElementById("yearSelect");
const budgetBody = document.getElementById("budgetBody");
const statAmount = document.getElementById("statAmount");
const statRealized = document.getElementById("statRealized");
const statPercent = document.getElementById("statPercent");
const budgetTotalAmount = document.getElementById("budgetTotalAmount");
const budgetTotalRealized = document.getElementById("budgetTotalRealized");
const budgetTotalPercent = document.getElementById("budgetTotalPercent");
const projectList = document.getElementById("projectList");

yearOptions(yearSelect, 3);

async function loadBudgets(year) {
  const ref = collection(db, "budgets");
  const qy = query(
    ref,
    where("year", "==", Number(year)),
    orderBy("category"),
    orderBy("subcategory")
  );
  const snap = await getDocs(qy);
  let rows = "",
    totalAmount = 0,
    totalRealized = 0;
  snap.forEach((d) => {
    const x = d.data();
    totalAmount += Number(x.amount || 0);
    totalRealized += Number(x.realized || 0);
    rows += `
      <tr>
        <td>${x.category}</td>
        <td>${x.subcategory}</td>
        <td class="right">${formatRupiah(x.amount)}</td>
        <td class="right">${formatRupiah(x.realized)}</td>
        <td class="right">${fmtPercent(x.realized, x.amount)}</td>
      </tr>`;
  });
  budgetBody.innerHTML =
    rows ||
    `<tr><td colspan="5" class="small">Belum ada data anggaran untuk tahun ini.</td></tr>`;
  budgetTotalAmount.textContent = formatRupiah(totalAmount);
  budgetTotalRealized.textContent = formatRupiah(totalRealized);
  budgetTotalPercent.textContent = fmtPercent(totalRealized, totalAmount);
  statAmount.textContent = formatRupiah(totalAmount);
  statRealized.textContent = formatRupiah(totalRealized);
  statPercent.textContent = fmtPercent(totalRealized, totalAmount);
}

async function loadProjects(year) {
  const ref = collection(db, "projects");
  const qy = query(
    ref,
    where("year", "==", Number(year)),
    orderBy("status"),
    orderBy("title")
  );
  const snap = await getDocs(qy);
  if (snap.empty) {
    projectList.textContent = "Belum ada proyek untuk tahun ini.";
    return;
  }
  const items = [];
  snap.forEach((d) => {
    const x = d.data();
    const badge =
      x.status === "selesai" ? "ok" : x.status === "pelaksanaan" ? "warn" : "";
    items.push(`
      <div class="card mt-12">
        <div class="flex" style="justify-content:space-between;">
          <div><strong>${x.title}</strong></div>
          <div><span class="badge ${badge}">${x.status}</span></div>
        </div>
        <div class="small mt-12">Progress: <strong>${Number(
          x.progress || 0
        )}%</strong> • Anggaran: <strong>${formatRupiah(
      x.budget
    )}</strong></div>
        ${x.description ? `<div class="mt-12">${x.description}</div>` : ``}
      </div>
    `);
  });
  projectList.innerHTML = items.join("");
}

async function refresh() {
  const y = yearSelect.value;
  await Promise.all([loadBudgets(y), loadProjects(y)]);
}

yearSelect.addEventListener("change", refresh);
refresh();
