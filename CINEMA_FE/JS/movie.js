const movie_URL = "https://studious-giggle-q7p4w755p7qqc97qq-4040.app.github.dev/movie";
const postMovie_URL = "https://studious-giggle-q7p4w755p7qqc97qq-4040.app.github.dev/movies";

let movieData = [];

const tbody = document.querySelector("#movieTable tbody");
const formSection = document.getElementById("movieFormSection");
const movieForm = document.getElementById("movieForm");

// Render movies table
function renderMovieTable() {
  tbody.innerHTML = "";

  movieData.forEach((movie) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${movie.movie_id}</td>
      <td>${movie.title}</td>
      <td>${movie.genre}</td>
      <td>${movie.duration} min</td>
      <td>${movie.language}</td>
      <td>${movie.release_date}</td>
      <td>${movie.certificate || ""}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Fetch all movies
function fetchMovies() {
  fetch(movie_URL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch movies");
      return res.json();
    })
    .then(data => {
      movieData = data;
      renderMovieTable();
    })
    .catch(err => console.error(err.message));
}
fetchMovies();

// Show insert form
function showMovieForm() {
  formSection.classList.remove("d-none");
  document.getElementById("movieFormTitle").innerText = "Insert Movie";
  movieForm.dataset.mode = "insert";
  movieForm.reset();
}

// Hide form
function hideMovieForm() {
  movieForm.reset();
  formSection.classList.add("d-none");
}

// Show form button
document.querySelector("#showMovieFormBtn")?.addEventListener("click", () => {
  showMovieForm();
});

// Submit form
movieForm.addEventListener("submit", e => {
  e.preventDefault();

  const title = document.getElementById("movie_title").value.trim();
  const genre = document.getElementById("movie_genre").value.trim();
  const duration = parseInt(document.getElementById("movie_duration").value.trim());
  const language = document.getElementById("movie_language").value.trim();
  const release_date = document.getElementById("movie_release_date").value.trim();
  const certificate = document.getElementById("movie_certificate").value.trim();

  if (!title || !genre || isNaN(duration) || !language || !release_date) {
    alert("⚠️ All fields except certificate are required.");
    return;
  }

  const newMovie = { title, genre, duration, language, release_date, certificate };

  fetch(postMovie_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newMovie),
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to insert movie.");
      return res.json();
    })
    .then(addedMovie => {
      movieData.push(addedMovie);
      renderMovieTable();
      hideMovieForm();
      alert("✅ New movie inserted!");
    })
    .catch(err => {
      console.error(err);
      alert("❌ Failed to insert movie.");
    });
});

// Cancel form
document.getElementById("cancelMovieFormBtn")?.addEventListener("click", function () {
  hideMovieForm();
});
