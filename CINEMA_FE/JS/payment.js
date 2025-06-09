const payment_URL = "https://studious-giggle-q7p4w755p7qqc97qq-4040.app.github.dev/payment";
const postPayment_URL = "https://studious-giggle-q7p4w755p7qqc97qq-4040.app.github.dev/payments";

let paymentData = [];

const tbody = document.querySelector("#paymentTable tbody");
const formSection = document.getElementById("paymentFormSection");
const paymentForm = document.getElementById("paymentForm");

// Render payments table
function renderPaymentTable() {
  tbody.innerHTML = "";

  paymentData.forEach((payment) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${payment.payment_id}</td>
      <td>${payment.booking_id}</td>
      <td>${payment.amount}</td>
      <td>${payment.payment_method}</td>
      <td>${payment.status}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Fetch all payments
function fetchPayments() {
  fetch(payment_URL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch payments");
      return res.json();
    })
    .then(data => {
      paymentData = data;
      renderPaymentTable();
    })
    .catch(err => console.error(err.message));
}
fetchPayments();

// Show insert form
function showPaymentForm() {
  formSection.classList.remove("d-none");
  document.getElementById("paymentFormTitle").innerText = "Insert Payment";
  paymentForm.dataset.mode = "insert";
  paymentForm.reset();
}

// Hide form
function hidePaymentForm() {
  paymentForm.reset();
  formSection.classList.add("d-none");
}

// Show form button
document.querySelector("#showPaymentFormBtn")?.addEventListener("click", () => {
  showPaymentForm();
});

// Submit form
paymentForm.addEventListener("submit", e => {
  e.preventDefault();

  const booking_id = parseInt(document.getElementById("booking_id").value.trim());
  const amount = parseFloat(document.getElementById("amount").value.trim());
  const payment_method = document.getElementById("payment_method").value.trim();
  const status = document.getElementById("status").value.trim();

  if (isNaN(booking_id) || isNaN(amount) || !payment_method || !status) {
    alert("⚠️ All fields are required.");
    return;
  }

  const newPayment = { booking_id, amount, payment_method, status };

  fetch(postPayment_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPayment),
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to insert payment.");
      return res.json();
    })
    .then(addedPayment => {
      paymentData.push(addedPayment);
      renderPaymentTable();
      hidePaymentForm();
      alert("✅ New payment inserted!");
    })
    .catch(err => {
      console.error(err);
      alert("❌ Failed to insert payment.");
    });
});

// Cancel form
document.getElementById("cancelPaymentFormBtn")?.addEventListener("click", function () {
  hidePaymentForm();
});
