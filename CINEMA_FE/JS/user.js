const users_URL = "https://studious-giggle-q7p4w755p7qqc97qq-4040.app.github.dev/user";
const post_URL = "https://studious-giggle-q7p4w755p7qqc97qq-4040.app.github.dev/users"; 

let usersData = [];

const tbody = document.querySelector("#usersTable tbody");
const formSection = document.getElementById("formSection");
const userForm = document.getElementById("userForm");

// Render users table
function renderTable() {
  tbody.innerHTML = "";

  usersData.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.user_id}</td>
      <td>${user.full_name}</td>
      <td>${user.email}</td>
      <td>${user.phone || ""}</td>
      <td>${user.created_at}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Fetch all users on page load
function fetchUsers() {
  fetch(users_URL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    })
    .then(data => {
      usersData = data;
      renderTable();
    })
    .catch(err => console.error(err.message));
}
fetchUsers();

// Show insert form
function showForm() {
  formSection.classList.remove("d-none");
  document.getElementById("formTitle").innerText = "Insert User";
  userForm.dataset.mode = "insert";
  userForm.reset();
}

// Hide form and reset
function hideForm() {
  userForm.reset();
  formSection.classList.add("d-none");
}

// Show form button
document.querySelector("button.btn-success")?.addEventListener("click", () => {
  showForm();
});

// Form submit handler
userForm.addEventListener("submit", e => {
  e.preventDefault();

  const full_name = document.getElementById("full_name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!full_name || !email) {
    alert("⚠️ Full name and email are required.");
    return;
  }

  const newUser = { full_name, email, phone };

  fetch(post_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to insert user.");
      return res.json();
    })
    .then(addedUser => {
      usersData.push(addedUser);
      renderTable();
      hideForm();
      alert("✅ New user inserted!");
    })
    .catch(err => {
      console.error(err);
      alert("❌ Failed to insert user.");
    });
});

document.getElementById("cancelFormBtn").addEventListener("click", function () {
  formSection.classList.add("d-none");
});
