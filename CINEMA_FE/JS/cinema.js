const cinema_URL = "https://studious-giggle-q7p4w755p7qqc97qq-4040.app.github.dev/cinema";
const postCinema_URL = "https://studious-giggle-q7p4w755p7qqc97qq-4040.app.github.dev/cinemas";

let cinemaData = [];

const tbody = document.querySelector("#cinemaTable tbody");
const formSection = document.getElementById("cinemaFormSection");
const cinemaForm = document.getElementById("cinemaForm");

// Render cinemas table
function renderCinemaTable() {
  tbody.innerHTML = "";

  cinemaData.forEach((cinema) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${cinema.cinema_id}</td>
      <td>${cinema.name}</td>
      <td>${cinema.location}</td>
      <td>${cinema.total_screens}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Fetch all cinemas
function fetchCinemas() {
  fetch(cinema_URL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch cinemas");
      return res.json();
    })
    .then(data => {
      cinemaData = data;
      renderCinemaTable();
    })
    .catch(err => console.error(err.message));
}
fetchCinemas();

// Show insert form
function showCinemaForm() {
  formSection.classList.remove("d-none");
  document.getElementById("cinemaFormTitle").innerText = "Insert Cinema";
  cinemaForm.dataset.mode = "insert";
  cinemaForm.reset();
}

// Hide form
function hideCinemaForm() {
  cinemaForm.reset();
  formSection.classList.add("d-none");
}

// Show form button
document.querySelector("#showCinemaFormBtn")?.addEventListener("click", () => {
  showCinemaForm();
});

// Submit form
cinemaForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("cinema_name").value.trim();
  const location = document.getElementById("cinema_location").value.trim();
  const total_screens = parseInt(document.getElementById("total_screens").value.trim());

  if (!name || !location || isNaN(total_screens)) {
    alert("⚠️ All fields are required.");
    return;
  }

  const newCinema = { name, location, total_screens };

  fetch(postCinema_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCinema),
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to insert cinema.");
      return res.json();
    })
    .then(addedCinema => {
      cinemaData.push(addedCinema);
      renderCinemaTable();
      hideCinemaForm();
      alert("✅ New cinema inserted!");
    })
    .catch(err => {
      console.error(err);
      alert("❌ Failed to insert cinema.");
    });
});

// Cancel form
document.getElementById("cancelCinemaFormBtn")?.addEventListener("click", function () {
  hideCinemaForm();
});

let cinemaChartInstance;

const chartBtn = document.getElementById("chartsBtn");
const chartSection = document.getElementById("chartSection");

chartBtn?.addEventListener("click", () => {
  chartSection.classList.toggle("d-none");

  const labels = cinemaData.map(cinema => cinema.name);
  const data = cinemaData.map(cinema => cinema.total_screens);

  const ctx = document.getElementById("cinemaChart").getContext("2d");

  if (cinemaChartInstance) cinemaChartInstance.destroy();

  cinemaChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Total Screens per Cinema",
        data,
        backgroundColor: "skyblue",
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        title: {
          display: true,
          text: "Total Screens per Cinema"
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1
        }
      }
    }
  });
});
