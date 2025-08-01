const seat_URL = "https://studious-giggle-q7p4w755p7qqc97qq-4040.app.github.dev/seat";
const postSeat_URL = "https://studious-giggle-q7p4w755p7qqc97qq-4040.app.github.dev/seats";

let seatData = [];

const tbody = document.querySelector("#seatTable tbody");
const formSection = document.getElementById("seatFormSection");
const seatForm = document.getElementById("seatForm");

// Render seat table
function renderSeatTable() {
  tbody.innerHTML = "";

  seatData.forEach((seat) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${seat.seat_id}</td>
      <td>${seat.screen_id}</td>
      <td>${seat.seat_number}</td>
      <td>${seat.seat_type}</td>
      <td>${seat.is_available ? "Available" : "Unavailable"}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Fetch all seats
function fetchSeats() {
  fetch(seat_URL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch seats");
      return res.json();
    })
    .then(data => {
      seatData = data;
      renderSeatTable();
    })
    .catch(err => console.error(err.message));
}
fetchSeats();

// Show insert form
function showSeatForm() {
  formSection.classList.remove("d-none");
  document.getElementById("seatFormTitle").innerText = "Insert Seat";
  seatForm.dataset.mode = "insert";
  seatForm.reset();
}

// Hide form
function hideSeatForm() {
  seatForm.reset();
  formSection.classList.add("d-none");
}

// Show form button
document.querySelector("#showSeatFormBtn")?.addEventListener("click", () => {
  showSeatForm();
});

// Submit form
seatForm.addEventListener("submit", e => {
  e.preventDefault();

  const screen_id = parseInt(document.getElementById("screen_id").value.trim());
  const seat_number = document.getElementById("seat_number").value.trim();
  const seat_type = document.getElementById("seat_type").value.trim();
  const is_available = document.getElementById("is_available").checked;

  if (isNaN(screen_id) || !seat_number || !seat_type) {
    alert("⚠️ All fields are required.");
    return;
  }

  const newSeat = { screen_id, seat_number, seat_type, is_available };

  fetch(postSeat_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newSeat),
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to insert seat.");
      return res.json();
    })
    .then(addedSeat => {
      seatData.push(addedSeat);
      renderSeatTable();
      hideSeatForm();
      alert("✅ New seat inserted!");
    })
    .catch(err => {
      console.error(err);
      alert("❌ Failed to insert seat.");
    });
});

// Cancel form
document.getElementById("cancelSeatFormBtn")?.addEventListener("click", function () {
  hideSeatForm();
});

// =====================
// 🎯 Seat Chart Section
// =====================
let seatChartInstance;
const seatChartSection = document.getElementById("chartSection");

document.getElementById("chartsBtn")?.addEventListener("click", () => {
  seatChartSection.classList.toggle("d-none");

  const seatTypes = ["REGULAR", "RECLINER", "VIP"];
  const availableCounts = { REGULAR: 0, RECLINER: 0, VIP: 0 };
  const unavailableCounts = { REGULAR: 0, RECLINER: 0, VIP: 0 };

  seatData.forEach(seat => {
    const type = (seat.seat_type || "").toUpperCase();
    const isAvailable = seat.is_available === true || seat.is_available === "true" || seat.is_available === 1;

    if (seatTypes.includes(type)) {
      if (isAvailable) {
        availableCounts[type]++;
      } else {
        unavailableCounts[type]++;
      }
    }
  });

  const labels = seatTypes;
  const dataAvailable = labels.map(type => availableCounts[type]);
  const dataUnavailable = labels.map(type => unavailableCounts[type]);

  const ctx = document.getElementById("seatTypeChart").getContext("2d");

  if (seatChartInstance) seatChartInstance.destroy();

  seatChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Available",
          data: dataAvailable,
          backgroundColor: "#4caf50"
        },
        {
          label: "Unavailable",
          data: dataUnavailable,
          backgroundColor: "#f44336"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Seat Types Availability"
        },
        legend: {
          position: "top"
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });
});
