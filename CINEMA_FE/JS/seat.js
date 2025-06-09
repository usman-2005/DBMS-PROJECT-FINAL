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
