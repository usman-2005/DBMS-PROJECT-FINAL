const screen_URL = "https://studious-giggle-q7p4w755p7qqc97qq-4040.app.github.dev/screen";
const postScreen_URL = "https://studious-giggle-q7p4w755p7qqc97qq-4040.app.github.dev/screens";

let screenData = [];

const tbody = document.querySelector("#screenTable tbody");
const formSection = document.getElementById("screenFormSection");
const screenForm = document.getElementById("screenForm");

// Render screens table
function renderScreenTable() {
  tbody.innerHTML = "";

  screenData.forEach((screen) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${screen.screen_id}</td>
      <td>${screen.cinema_id}</td>
      <td>${screen.screen_number}</td>
      <td>${screen.total_seats}</td>
      <td>${screen.type}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Fetch all screens
function fetchScreens() {
  fetch(screen_URL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch screens");
      return res.json();
    })
    .then(data => {
      screenData = data;
      renderScreenTable();
    })
    .catch(err => console.error(err.message));
}
fetchScreens();

// Show insert form
function showScreenForm() {
  formSection.classList.remove("d-none");
  document.getElementById("screenFormTitle").innerText = "Insert Screen";
  screenForm.dataset.mode = "insert";
  screenForm.reset();
}

// Hide form
function hideScreenForm() {
  screenForm.reset();
  formSection.classList.add("d-none");
}

// Show form button
document.querySelector("#showScreenFormBtn")?.addEventListener("click", () => {
  showScreenForm();
});

// Submit form
screenForm.addEventListener("submit", e => {
  e.preventDefault();

  const cinema_id = parseInt(document.getElementById("cinema_id").value.trim());
  const screen_number = document.getElementById("screen_number").value.trim();
  const total_seats = parseInt(document.getElementById("total_seats").value.trim());
  const type = document.getElementById("screen_type").value.trim();

  if (isNaN(cinema_id) || !screen_number || isNaN(total_seats) || !type) {
    alert("⚠️ All fields are required.");
    return;
  }

  const newScreen = { cinema_id, screen_number, total_seats, type };

  fetch(postScreen_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newScreen),
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to insert screen.");
      return res.json();
    })
    .then(addedScreen => {
      screenData.push(addedScreen);
      renderScreenTable();
      hideScreenForm();
      alert("✅ New screen inserted!");
    })
    .catch(err => {
      console.error(err);
      alert("❌ Failed to insert screen.");
    });
});

// Cancel form
document.getElementById("cancelScreenFormBtn")?.addEventListener("click", function () {
  hideScreenForm();
});
