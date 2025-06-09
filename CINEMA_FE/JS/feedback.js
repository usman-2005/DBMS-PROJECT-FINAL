const feedback_URL = "https://studious-giggle-q7p4w755p7qqc97qq-4040.app.github.dev/feedback";
const postFeedback_URL = "https://studious-giggle-q7p4w755p7qqc97qq-4040.app.github.dev/feedbacks";

let feedbackData = [];

const tbody = document.querySelector("#feedbackTable tbody");
const formSection = document.getElementById("feedbackFormSection");
const feedbackForm = document.getElementById("feedbackForm");

// Render feedback table
function renderFeedbackTable() {
  tbody.innerHTML = "";

  feedbackData.forEach((fb) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${fb.feedback_id}</td>
      <td>${fb.user_id}</td>
      <td>${fb.movie_id}</td>
      <td>${fb.rating}</td>
      <td>${fb.comment || ""}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Fetch all feedbacks
function fetchFeedback() {
  fetch(feedback_URL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch feedback");
      return res.json();
    })
    .then(data => {
      feedbackData = data;
      renderFeedbackTable();
    })
    .catch(err => console.error(err.message));
}
fetchFeedback();

// Show insert form
function showFeedbackForm() {
  formSection.classList.remove("d-none");
  document.getElementById("feedbackFormTitle").innerText = "Insert Feedback";
  feedbackForm.dataset.mode = "insert";
  feedbackForm.reset();
}

// Hide form
function hideFeedbackForm() {
  feedbackForm.reset();
  formSection.classList.add("d-none");
}

// Show form button
document.querySelector("#showFeedbackFormBtn")?.addEventListener("click", () => {
  showFeedbackForm();
});

// Submit form
feedbackForm.addEventListener("submit", e => {
  e.preventDefault();

  const user_id = parseInt(document.getElementById("user_id").value.trim());
  const movie_id = parseInt(document.getElementById("movie_id").value.trim());
  const rating = parseFloat(document.getElementById("rating").value.trim());
  const comment = document.getElementById("comment").value.trim();

  if (isNaN(user_id) || isNaN(movie_id) || isNaN(rating)) {
    alert("⚠️ User ID, Movie ID, and Rating are required and must be numbers.");
    return;
  }

  const newFeedback = { user_id, movie_id, rating, comment };

  fetch(postFeedback_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newFeedback),
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to insert feedback.");
      return res.json();
    })
    .then(addedFeedback => {
      feedbackData.push(addedFeedback);
      renderFeedbackTable();
      hideFeedbackForm();
      alert("✅ New feedback submitted!");
    })
    .catch(err => {
      console.error(err);
      alert("❌ Failed to submit feedback.");
    });
});

// Cancel form
document.getElementById("cancelFeedbackFormBtn")?.addEventListener("click", function () {
  hideFeedbackForm();
});
