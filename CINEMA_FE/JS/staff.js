const staff_URL = "https://studious-giggle-q7p4w755p7qqc97qq-4040.app.github.dev/staff";
const postStaff_URL = "https://studious-giggle-q7p4w755p7qqc97qq-4040.app.github.dev/staffs";

let staffData = [];

const tbody = document.querySelector("#staffTable tbody");
const formSection = document.getElementById("staffFormSection");
const staffForm = document.getElementById("staffForm");

// Render staff table
function renderStaffTable() {
  tbody.innerHTML = "";

  staffData.forEach((staff) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${staff.staff_id}</td>
      <td>${staff.cinema_id}</td>
      <td>${staff.full_name}</td>
      <td>${staff.role}</td>
      <td>${staff.phone || ""}</td>
      <td>${staff.email}</td>
      <td>${staff.hire_date}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Fetch all staff
function fetchStaff() {
  fetch(staff_URL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch staff");
      return res.json();
    })
    .then(data => {
      staffData = data;
      renderStaffTable();
    })
    .catch(err => console.error(err.message));
}
fetchStaff();

// Show insert form
function showStaffForm() {
  formSection.classList.remove("d-none");
  document.getElementById("staffFormTitle").innerText = "Insert Staff";
  staffForm.dataset.mode = "insert";
  staffForm.reset();
}

// Hide form
function hideStaffForm() {
  staffForm.reset();
  formSection.classList.add("d-none");
}

// Show form button
document.querySelector("#showStaffFormBtn")?.addEventListener("click", () => {
  showStaffForm();
});

// Submit form
staffForm.addEventListener("submit", e => {
  e.preventDefault();

  const cinema_id = parseInt(document.getElementById("cinema_id").value.trim());
  const full_name = document.getElementById("full_name").value.trim();
  const role = document.getElementById("role").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const hire_date = document.getElementById("hire_date").value.trim();

  if (isNaN(cinema_id) || !full_name || !role || !email || !hire_date) {
    alert("⚠️ Please fill all required fields.");
    return;
  }

  const newStaff = { cinema_id, full_name, role, phone, email, hire_date };

  fetch(postStaff_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newStaff),
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to insert staff.");
      return res.json();
    })
    .then(addedStaff => {
      staffData.push(addedStaff);
      renderStaffTable();
      hideStaffForm();
      alert("✅ New staff member inserted!");
    })
    .catch(err => {
      console.error(err);
      alert("❌ Failed to insert staff.");
    });
});

// Cancel form
document.getElementById("cancelStaffFormBtn")?.addEventListener("click", function () {
  hideStaffForm();
});

let staffChartInstance;

document.getElementById("chartsBtn")?.addEventListener("click", () => {
  document.getElementById("chartSection").classList.remove("d-none");

  const roles = ["MANAGER", "CASHIER", "TECHNICIAN", "RECEPTIONIST", "CLEANER", "SECURITY"];
  const roleCounts = {
    MANAGER: 0,
    CASHIER: 0,
    TECHNICIAN: 0,
    RECEPTIONIST: 0,
    CLEANER: 0,
    SECURITY: 0
  };

  staffData.forEach(staff => {
    const role = (staff.role || "").toUpperCase();
    if (roleCounts.hasOwnProperty(role)) {
      roleCounts[role]++;
    }
  });

  const labels = roles;
  const data = roles.map(role => roleCounts[role]);

  const ctx = document.getElementById("staffRoleChart").getContext("2d");

  if (staffChartInstance) staffChartInstance.destroy();

  staffChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Number of Staff",
        data,
        backgroundColor: "#42a5f5"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Staff Role Distribution"
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          precision: 0
        }
      }
    }
  });
});
