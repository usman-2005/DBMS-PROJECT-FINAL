const booking_URL = "https://studious-giggle-q7p4w755p7qqc97qq-4040.app.github.dev/booking";
const postBooking_URL = "https://studious-giggle-q7p4w755p7qqc97qq-4040.app.github.dev/bookings";

let bookingData = [];

const tbody = document.querySelector("#bookingTable tbody");
const formSection = document.getElementById("bookingFormSection");
const bookingForm = document.getElementById("bookingForm");

// Render bookings table
function renderBookingTable() {
  tbody.innerHTML = "";

  bookingData.forEach((booking) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${booking.booking_id}</td>
      <td>${booking.user_id}</td>
      <td>${booking.show_id}</td>
      <td>${booking.total_amount}</td>
      <td>${booking.status}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Fetch all bookings
function fetchBookings() {
  fetch(booking_URL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    })
    .then(data => {
      bookingData = data;
      renderBookingTable();
    })
    .catch(err => console.error(err.message));
}
fetchBookings();

// Show insert form
function showBookingForm() {
  formSection.classList.remove("d-none");
  document.getElementById("bookingFormTitle").innerText = "Insert Booking";
  bookingForm.dataset.mode = "insert";
  bookingForm.reset();
}

// Hide form
function hideBookingForm() {
  bookingForm.reset();
  formSection.classList.add("d-none");
}

// Show form button
document.querySelector("#showBookingFormBtn")?.addEventListener("click", () => {
  showBookingForm();
});

// Submit form
bookingForm.addEventListener("submit", e => {
  e.preventDefault();

  const user_id = parseInt(document.getElementById("user_id").value.trim());
  const show_id = parseInt(document.getElementById("show_id").value.trim());
  const total_amount = parseFloat(document.getElementById("total_amount").value.trim());
  const status = document.getElementById("status").value.trim();

  if (isNaN(user_id) || isNaN(show_id) || isNaN(total_amount) || !status) {
    alert("⚠️ All fields are required.");
    return;
  }

  const newBooking = { user_id, show_id, total_amount, status };

  fetch(postBooking_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newBooking),
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to insert booking.");
      return res.json();
    })
    .then(addedBooking => {
      bookingData.push(addedBooking);
      renderBookingTable();
      hideBookingForm();
      alert("✅ New booking inserted!");
    })
    .catch(err => {
      console.error(err);
      alert("❌ Failed to insert booking.");
    });
});

// Cancel form
document.getElementById("cancelBookingFormBtn")?.addEventListener("click", function () {
  hideBookingForm();
});
