const show_URL = "https://studious-giggle-q7p4w755p7qqc97qq-4040.app.github.dev/show";
const postShow_URL = "https://studious-giggle-q7p4w755p7qqc97qq-4040.app.github.dev/shows";

let showData = [];

const tbody = document.querySelector("#showTable tbody");
const formSection = document.getElementById("showFormSection");
const showForm = document.getElementById("showForm");

// Render shows table
function renderShowTable() {
  tbody.innerHTML = "";

  showData.forEach((show) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${show.show_id}</td>
      <td>${show.movie_id}</td>
      <td>${show.screen_id}</td>
      <td>${show.show_date}</td>
      <td>${show.start_time}</td>
      <td>${show.end_time}</td>
      <td>${show.price}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Fetch all shows
function fetchShows() {
  fetch(show_URL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch shows");
      return res.json();
    })
    .then(data => {
      showData = data;
      renderShowTable();
    })
    .catch(err => console.error(err.message));
}
fetchShows();

// Show insert form
function showShowForm() {
  formSection.classList.remove("d-none");
  document.getElementById("showFormTitle").innerText = "Insert Show";
  showForm.dataset.mode = "insert";
  showForm.reset();
}

// Hide form
function hideShowForm() {
  showForm.reset();
  formSection.classList.add("d-none");
}

// Show form button
document.querySelector("#showShowFormBtn")?.addEventListener("click", () => {
  showShowForm();
});

// Submit form
showForm.addEventListener("submit", e => {
  e.preventDefault();

  const movie_id = parseInt(document.getElementById("movie_id").value.trim());
  const screen_id = parseInt(document.getElementById("screen_id").value.trim());
  const show_date = document.getElementById("show_date").value.trim();
  const start_time = document.getElementById("start_time").value.trim();
  const end_time = document.getElementById("end_time").value.trim();
  const price = parseFloat(document.getElementById("price").value.trim());

  if (
    isNaN(movie_id) || isNaN(screen_id) || !show_date ||
    !start_time || !end_time || isNaN(price)
  ) {
    alert("⚠️ All fields are required.");
    return;
  }

  const newShow = { movie_id, screen_id, show_date, start_time, end_time, price };

  fetch(postShow_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newShow),
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to insert show.");
      return res.json();
    })
    .then(addedShow => {
      showData.push(addedShow);
      renderShowTable();
      hideShowForm();
      alert("✅ New show inserted!");
    })
    .catch(err => {
      console.error(err);
      alert("❌ Failed to insert show.");
    });
});

// Cancel form
document.getElementById("cancelShowFormBtn")?.addEventListener("click", function () {
  hideShowForm();
});

let showChartInstance;

document.getElementById("chartsBtn")?.addEventListener("click", () => {
  document.getElementById("chartSection").classList.remove("d-none");

  const showsPerDay = {};
  const showsPerScreen = {};

  showData.forEach(show => {
    // Count by Date
    const date = show.show_date;
    showsPerDay[date] = (showsPerDay[date] || 0) + 1;

    // Count by Screen
    const screenId = show.screen_id;
    showsPerScreen[screenId] = (showsPerScreen[screenId] || 0) + 1;
  });

  const dayLabels = Object.keys(showsPerDay);
  const screenLabels = Object.keys(showsPerScreen);
  const dayCounts = Object.values(showsPerDay);
  const screenCounts = Object.values(showsPerScreen);

  const ctx = document.getElementById("showChart").getContext("2d");

  if (showChartInstance) showChartInstance.destroy();

  showChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [...dayLabels, ...screenLabels.map(s => `Screen ${s}`)],
      datasets: [{
        label: "Shows per Day",
        data: [...dayCounts, ...Array(screenCounts.length).fill(null)],
        backgroundColor: "steelblue"
      }, {
        label: "Shows per Screen",
        data: [...Array(dayCounts.length).fill(null), ...screenCounts],
        backgroundColor: "orange"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Shows per Day vs Shows per Screen"
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

