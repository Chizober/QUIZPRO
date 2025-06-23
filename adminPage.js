// document.addEventListener("DOMContentLoaded", () => {
//   const container = document.getElementById("admin-panel");
//   let results = JSON.parse(localStorage.getItem("quizResults") || "[]");

//   if (!results.length) {
//     container.innerHTML = "<p>No results found.</p>";
//     return;
//   }

//   // Render student results
//   container.innerHTML = results.map((r, index) => {
//     const subjScores = r.subjScores || {};
//     const theoryScores = r.theoryScores || {};

//     let subjHTML = Object.entries(r.subjective || {}).map(([id, ans]) => `
//       <div class="section">
//         <strong>${id}</strong><br>
//         <textarea rows="3" readonly>${ans}</textarea>
//         <label>Score: <input class="score-input" type="number" min="0" max="10" value="${subjScores[id] || 0}" 
//           data-type="subj" data-index="${index}" data-id="${id}"></label>
//       </div>
//     `).join("");

//     let theoryHTML = Object.entries(r.theory || {}).map(([id, ans]) => `
//       <div class="section">
//         <strong>${id}</strong><br>
//         <textarea rows="4" readonly>${ans}</textarea>
//         <label>Score: <input class="score-input" type="number" min="0" max="10" value="${theoryScores[id] || 0}" 
//           data-type="theory" data-index="${index}" data-id="${id}"></label>
//       </div>
//     `).join("");

//     const totalManualScore = getManualScore(subjScores) + getManualScore(theoryScores);
//     const totalScore = (r.score || 0) + totalManualScore;

//     return `
//       <div class="student-box" id="student-${index}">
//         <h2>${r.name} (${r.class})</h2>
//         <p>Date: ${r.date}</p>
//         <p><strong>MCQ:</strong> ${r.score} / ${r.total}</p>
//         <p><strong>Manual Score:</strong> <span id="manual-${index}">${totalManualScore}</span></p>
//         <p><strong>Total Score:</strong> <span id="total-${index}">${totalScore}</span></p>

//         <h4>Subjective Answers</h4>${subjHTML}
//         <h4>Theory Answers</h4>${theoryHTML}
//       </div>
//     `;
//   }).join("");

//   // Attach input listeners
//   document.querySelectorAll(".score-input").forEach(input => {
//     input.addEventListener("input", () => {
//       const index = +input.dataset.index;
//       const id = input.dataset.id;
//       const type = input.dataset.type;
//       const val = parseInt(input.value) || 0;

//       if (!results[index][`${type}Scores`]) results[index][`${type}Scores`] = {};
//       results[index][`${type}Scores`][id] = val;

//       const subjScores = results[index].subjScores || {};
//       const theoryScores = results[index].theoryScores || {};
//       const totalManual = getManualScore(results[index].subjScores) + getManualScore(results[index].theoryScores);
//       const total = (results[index].score || 0) + totalManual;

//       // Update UI
//       document.getElementById(`manual-${index}`).textContent = totalManual;
//       document.getElementById(`total-${index}`).textContent = total;

//       // Save updated result
//       localStorage.setItem("quizResults", JSON.stringify(results));
//     });
//   });

//   function getManualScore(scoreObj = {}) {
//     return Object.values(scoreObj).reduce((sum, val) => sum + (+val || 0), 0);
//   }
// });
// document.addEventListener("DOMContentLoaded", () => {
//   const container = document.getElementById("admin-panel");
//   let results = JSON.parse(localStorage.getItem("quizResults") || "[]");

//   if (!results.length) {
//     container.innerHTML = "<p>No results found.</p>";
//     return;
//   }

//   container.innerHTML = results.map((r, index) => {
//     const subjScores = r.subjScores || {};
//     const theoryScores = r.theoryScores || {};

//     const manualScore = getManualScore(subjScores) + getManualScore(theoryScores);
//     const totalScore = (r.score || 0) + manualScore;

//     // MCQ Section
//     let mcqHTML = r.answers.map((ans, i) => {
//       const q = r.questions?.[i] || {};
//       const correct = q?.answer === ans;
//       return `
//         <tr>
//           <td><strong>Q${i + 1}:</strong> ${q.question || "Unknown"}</td>
//           <td style="color:${correct ? 'green' : 'red'}">${ans || "None"}</td>
//           <td style="color:green">${q.answer || "?"}</td>
//         </tr>
//       `;
//     }).join("");

//     // Subjective Section
//     let subjHTML = Object.entries(r.subjective || {}).map(([id, ans]) => `
//       <div class="section">
//         <strong>${id}:</strong><br>
//         <textarea readonly rows="3">${ans}</textarea>
//         <label>Score: 
//           <input class="score-input" type="number" min="0" max="10" 
//             value="${subjScores[id] || 0}" data-type="subj" 
//             data-index="${index}" data-id="${id}">
//         </label>
//       </div>
//     `).join("");

//     // Theory Section
//     let theoryHTML = Object.entries(r.theory || {}).map(([id, ans]) => `
//       <div class="section">
//         <strong>${id}:</strong><br>
//         <textarea readonly rows="4">${ans}</textarea>
//         <label>Score: 
//           <input class="score-input" type="number" min="0" max="10" 
//             value="${theoryScores[id] || 0}" data-type="theory" 
//             data-index="${index}" data-id="${id}">
//         </label>
//       </div>
//     `).join("");

//     return `
//       <details class="student-box" open>
//         <summary><strong>${r.name} (${r.class})</strong> — <em>${r.date}</em></summary>
//         <p><strong>MCQ Score:</strong> ${r.score} / ${r.total}</p>
//         <p><strong>Manual Score:</strong> <span id="manual-${index}">${manualScore}</span></p>
//         <p><strong>Total Score:</strong> <span id="total-${index}">${totalScore}</span></p>

//         <h4>MCQ Questions</h4>
//         <table class="mcq-table">
//           <thead><tr><th>Question</th><th>Your Answer</th><th>Correct</th></tr></thead>
//           <tbody>${mcqHTML}</tbody>
//         </table>

//         <h4>Subjective</h4>${subjHTML}
//         <h4>Theory</h4>${theoryHTML}
//       </details>
//     `;
//   }).join("");

//   // Handle manual scoring updates
//   document.querySelectorAll(".score-input").forEach(input => {
//     input.addEventListener("input", () => {
//       const index = +input.dataset.index;
//       const id = input.dataset.id;
//       const type = input.dataset.type;
//       const val = parseInt(input.value) || 0;

//       if (!results[index][`${type}Scores`]) results[index][`${type}Scores`] = {};
//       results[index][`${type}Scores`][id] = val;

//       const subjScores = results[index].subjScores || {};
//       const theoryScores = results[index].theoryScores || {};
//       const manual = getManualScore(subjScores) + getManualScore(theoryScores);
//       const total = (results[index].score || 0) + manual;

//       document.getElementById(`manual-${index}`).textContent = manual;
//       document.getElementById(`total-${index}`).textContent = total;

//       localStorage.setItem("quizResults", JSON.stringify(results));
//     });
//   });

//   function getManualScore(scoreObj = {}) {
//     return Object.values(scoreObj).reduce((sum, val) => sum + (+val || 0), 0);
//   }
// });

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("admin-panel");

  let questions = [];
  try {
    questions = await fetch("questions.json").then(res => res.json());
  } catch (err) {
    container.innerHTML = "<p>Failed to load questions.json</p>";
    console.error(err);
    return;
  }

  const results = JSON.parse(localStorage.getItem("quizResults") || "[]");
  if (!results.length) {
    container.innerHTML = "<p>No results found.</p>";
    return;
  }

  container.innerHTML = results.map((r, index) => {
    const subjScores = r.subjScores || {};
    const theoryScores = r.theoryScores || {};

    const manualScore = getManualScore(subjScores) + getManualScore(theoryScores);
    const totalScore = (r.score || 0) + manualScore;

    // Try to find student-specific shuffled questions
    const key = `${r.name.toLowerCase()}_${r.class.toLowerCase()}`;
    const shuffled = JSON.parse(localStorage.getItem(`quiz_${key}`)) || [];

    const mcq = shuffled.filter(q => q.type === "mcq");

    // MCQ Section
    const mcqHTML = r.answers.map((ans, i) => {
      const q = mcq[i] || {};
      const correct = q.answer === ans;
      return `
        <tr>
          <td><strong>Q${i + 1}:</strong> ${q.question || "Unknown"}</td>
          <td style="color:${correct ? 'green' : 'red'}">${ans || "None"}</td>
          <td style="color:green">${q.answer || "?"}</td>
        </tr>
      `;
    }).join("");

    // Subjective Section
    const subjHTML = Object.entries(r.subjective || {}).map(([id, ans]) => `
      <div class="section">
        <strong>${id}:</strong><br>
        <textarea readonly rows="3">${ans}</textarea>
        <label>Score: 
          <input class="score-input" type="number" min="0" max="10" 
            value="${subjScores[id] || 0}" data-type="subj" 
            data-index="${index}" data-id="${id}">
        </label>
      </div>
    `).join("");

    // Theory Section
    const theoryHTML = Object.entries(r.theory || {}).map(([id, ans]) => `
      <div class="section">
        <strong>${id}:</strong><br>
        <textarea readonly rows="4">${ans}</textarea>
        <label>Score: 
          <input class="score-input" type="number" min="0" max="10" 
            value="${theoryScores[id] || 0}" data-type="theory" 
            data-index="${index}" data-id="${id}">
        </label>
      </div>
    `).join("");

    return `
      <details class="student-box" open>
        <summary><strong>${r.name} (${r.class})</strong> — <em>${r.date}</em></summary>
        <p><strong>MCQ Score:</strong> ${r.score} / ${r.total}</p>
        <p><strong>Manual Score:</strong> <span id="manual-${index}">${manualScore}</span></p>
        <p><strong>Total Score:</strong> <span id="total-${index}">${totalScore}</span></p>

        <h4>MCQ Questions</h4>
        <table class="mcq-table">
          <thead><tr><th>Question</th><th>Your Answer</th><th>Correct</th></tr></thead>
          <tbody>${mcqHTML}</tbody>
        </table>

        <h4>Subjective</h4>${subjHTML}
        <h4>Theory</h4>${theoryHTML}
      </details>
    `;
  }).join("");

  // Handle manual scoring input
  document.querySelectorAll(".score-input").forEach(input => {
    input.addEventListener("input", () => {
      const index = +input.dataset.index;
      const id = input.dataset.id;
      const type = input.dataset.type;
      const val = parseInt(input.value) || 0;

      if (!results[index][`${type}Scores`]) results[index][`${type}Scores`] = {};
      results[index][`${type}Scores`][id] = val;

      const subjScores = results[index].subjScores || {};
      const theoryScores = results[index].theoryScores || {};
      const manual = getManualScore(subjScores) + getManualScore(theoryScores);
      const total = (results[index].score || 0) + manual;

      document.getElementById(`manual-${index}`).textContent = manual;
      document.getElementById(`total-${index}`).textContent = total;

      localStorage.setItem("quizResults", JSON.stringify(results));
    });
  });

  function getManualScore(scoreObj = {}) {
    return Object.values(scoreObj).reduce((sum, val) => sum + (+val || 0), 0);
  }
});

