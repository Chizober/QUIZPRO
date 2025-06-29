

document.addEventListener("DOMContentLoaded", () => {
  let quiz = [], mcqQuestions = [], subjectiveQuestions = [], theoryQuestions = [];
  let selectedAnswers = [], subjectiveAnswers = {}, theoryAnswers = {};
  let studentInfo = null;

  const QUIZ_TIME = 300;
  let timer = QUIZ_TIME, timerInterval = null;

  const quizContentMCQ = document.getElementById("quiz-content-mcq");
  const quizContentSubj = document.getElementById("quiz-content-subjective");
  const quizContentTheory = document.getElementById("quiz-content-theory");
  const resultSummary = document.getElementById("result-summary");
  const timerDisplay = document.getElementById("timerDisplay");
  const download = document.getElementById("download")
  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");

  const stepIndicator = document.getElementById("step-indicator");
  const btnToSubj = document.getElementById("continue-subjective-btn");
  const btnToTheory = document.getElementById("continue-theory-btn");
  const btnFinish = document.getElementById("finish-btn");
  
  const btnReturnHome = document.getElementById("return-home-btn");
  const errorDisplay = document.getElementById("login-error");

  const warningSound = new Audio("./sounds/success.wav");
  const endSound = new Audio("./sounds/wrong.mp3");

  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.onclick = () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "🌙" : "🌞";
  };

  btnReturnHome.classList.add("hidden");
  btnToSubj.classList.add("hidden");
  btnToTheory.classList.add("hidden");

  function updateStep(step) {
    stepIndicator.textContent = `Step ${step} of 3`;
  }

  function shuffleArray(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function updateTimer() {
    timerDisplay.textContent = `Time: ${timer}s`;
    if (timer <= 10) {
      timerDisplay.style.color = "red";
      warningSound.play();
    } else if (timer <= 30) {
      timerDisplay.style.color = "orange";
    } else {
      timerDisplay.style.color = "";
    }
  }


  function startQuiz() {
    timer = QUIZ_TIME;
    updateTimer();
    timerInterval = setInterval(() => {
      timer--;
      updateTimer();
      if (timer <= 0) {
        clearInterval(timerInterval);
        endSound.play();
        finishQuiz();
      }
    }, 1000);
  }

 
  function assignIdsIfMissing(arr, prefix) {
    return arr.map((q, i) => {
      if (!q.id) q.id = `${prefix}_${i}`;
      return q;
    });
  }


function renderMCQ() {
  quizContentMCQ.innerHTML = "<h3 class='mcq'>MCQ Section</h3>";

  mcqQuestions.forEach((q, i) => {
    const div = document.createElement("div");
     div.className = "options";
    div.innerHTML = `<p><strong>Q${i + 1}. ${q.question}</strong></p>`;

    q.options.forEach((opt, j) => {
      const btn = document.createElement("button");
      const label = String.fromCharCode(97 + j); // a, b, c, d
      btn.textContent = `${label}) ${opt}`;
      btn.className = "option-btn fade-in";
      btn.onclick = () => {
        selectedAnswers[i] = opt;
        Array.from(div.querySelectorAll("button")).forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
      };
      div.appendChild(btn);
    });

    quizContentMCQ.appendChild(div);
  });

  // Show MCQ section only
  quizContentMCQ.classList.remove("hidden");
  quizContentSubj.classList.add("hidden");
  quizContentTheory.classList.add("hidden");

  updateStep(1);

  // Show only the "Continue to Subjective" button
  btnToSubj.classList.remove("hidden");
  btnToTheory.classList.add("hidden");
}

function renderTextArea(section, data, answers, prefix) {
  const sectionTitle = prefix === "subj" ? "Subjective Section" : "Theory Section";

 section.innerHTML = `
    <h3 class='mcq'>${sectionTitle}</h3>
  `;
  const normalized = assignIdsIfMissing(data, prefix);
  normalized.forEach((q, i) => {
    const div = document.createElement("div");
    div.classList.add("fade-in");
    div.innerHTML = `<p><strong>Q${i + 1}. ${q.question}</strong></p>`;
    const textarea = document.createElement("textarea");
    textarea.rows = prefix === "theory" ? 5 : 3;
    textarea.dataset.id = q.id;
    textarea.value = answers[q.id] || "";
    textarea.oninput = () => answers[q.id] = textarea.value.trim();
    div.appendChild(textarea);
    section.appendChild(div);
  });
}


  function finishQuiz() {
    clearInterval(timerInterval);
    document.querySelectorAll("#quiz-content-subjective textarea").forEach(t => subjectiveAnswers[t.dataset.id] = t.value.trim());
    document.querySelectorAll("#quiz-content-theory textarea").forEach(t => theoryAnswers[t.dataset.id] = t.value.trim());
 const empty = theoryQuestions.some(q => !theoryAnswers[q.id]);
  // if (empty) return alert("Answer all theory questions.");
    const score = mcqQuestions.filter((q, i) => selectedAnswers[i] === q.answer).length;
    const result = {
      name: studentInfo.name,
      class: studentInfo.class,
      date: new Date().toLocaleString(),
      score,
      total: mcqQuestions.length,
      answers: selectedAnswers,
      subjective: subjectiveAnswers,
      theory: theoryAnswers
    };
    let all = JSON.parse(localStorage.getItem("quizResults") || "[]");

    const exists = all.some(r =>
      r.name.toLowerCase() === result.name.toLowerCase() &&
      r.class.toLowerCase() === result.class.toLowerCase()
    );

    if (exists) {
      alert("Duplicate entry detected! You have already submitted this quiz.");
      return;
    }

    all.push(result);
    localStorage.setItem("quizResults", JSON.stringify(all));
    localStorage.setItem(`quizResult_${result.name.toLowerCase()}_${result.class.toLowerCase()}`, "submitted");
    showResult(result);
  }
btnFinish.onclick = () => finishQuiz();

  function showResult(result) {
    let html = `
      <div style="text-align:center">
        <img src="logo-min.png" alt="School Logo" width="100" /><br>
        <h3>Result Summary</h3>
      </div>
      <p><strong>Name:</strong> ${result.name}</p>
      <p><strong>Class:</strong> ${result.class}</p>
      <p><strong>Date:</strong> ${result.date}</p>
      <p><strong>Score:</strong> ${result.score} / ${result.total}</p>
      <h4>MCQ Answers</h4>`;
    mcqQuestions.forEach((q, i) => {
  const isCorrect = result.answers[i] === q.answer;
  const answerColor = isCorrect ? "green" : "red";
  const correctness = isCorrect ? "✔ Correct" : "✘ Incorrect";
  html += `<p class="fade-in"><strong style="color:black">${q.question}</strong><br>
  <span style="color:black">Your Answer: ${result.answers[i] || 'None'}</span> | 
  <span style="color:${answerColor}">${correctness}</span> | 
  <span style="color:green">Correct: ${q.answer}</span></p>`;
});
html += `<h4>Subjective</h4>`;
subjectiveQuestions.forEach(q => {
  html += `<p class="fade-in"><strong style="color:black">${q.question}</strong><br>
  <span style="color:black">Answer: ${result.subjective[q.id] || 'None'}</span></p>`;
});

html += `<h4>Theory</h4>`;
theoryQuestions.forEach(q => {
  html += `<p class="fade-in"><strong style="color:black">${q.question}</strong><br>
  <span style="color:black">Answer: ${result.theory[q.id] || 'None'}</span></p>`;
});

    const allResults = JSON.parse(localStorage.getItem("quizResults") || "[]");
    const classResults = allResults.filter(r => r.class.toLowerCase() === result.class.toLowerCase());
    const averageScore = (classResults.reduce((sum, r) => sum + (r.score || 0), 0) / classResults.length).toFixed(2);
    html += `<h4>Class Performance</h4>
    <p>Total Students: ${classResults.length}</p>
    <p>Average Score: ${averageScore}</p>`;

    resultSummary.innerHTML = html;

    startScreen.classList.add("hidden");
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    resultScreen.scrollIntoView({ behavior: "smooth" });

    btnReturnHome.classList.remove("hidden");
    btnReturnHome.onclick = () => location.reload();
  }

  document.getElementById("start-btn").onclick = () => {
    const name = document.getElementById("student-name").value.trim();
    const cls = document.getElementById("student-class").value.trim();
    if (!name || !cls) return alert("Enter name and class");
    studentInfo = { name, class: cls };

    const key = `${name.toLowerCase()}_${cls.toLowerCase()}`;
    if (localStorage.getItem(`quizResult_${key}`)) {
      alert("You have already attempted this quiz.");
      return;
    }

    fetch("questions.json").then(res => res.json()).then(data => {
      const stored = localStorage.getItem(`quiz_${key}`);
      quiz = stored ? JSON.parse(stored) : shuffleArray(data);
      if (!stored) localStorage.setItem(`quiz_${key}`, JSON.stringify(quiz));

      mcqQuestions = quiz.filter(q => q.type === "mcq");
      subjectiveQuestions = assignIdsIfMissing(quiz.filter(q => q.type === "subjective"), "subj");
      theoryQuestions = assignIdsIfMissing(quiz.filter(q => q.type === "theory"), "theory");

      renderMCQ();
      renderTextArea(quizContentSubj, subjectiveQuestions, subjectiveAnswers, "subj");
      renderTextArea(quizContentTheory, theoryQuestions, theoryAnswers, "theory");

      quizContentSubj.classList.add("hidden");
      quizContentTheory.classList.add("hidden");
      

      startScreen.classList.add("hidden");
      quizScreen.classList.remove("hidden");
      resultScreen.classList.add("hidden");
btnFinish.classList.add("hidden");

      startQuiz();
    }).catch(err => {
      alert("Failed to load questions.");
      console.error(err);
    });
  };

  btnToSubj.onclick = () => {
  if (selectedAnswers.length < mcqQuestions.length || selectedAnswers.includes(undefined)) {
    alert("Please answer all MCQ questions.");
    return;
  }
  quizContentMCQ.classList.add("hidden");
  quizContentSubj.classList.remove("hidden");
  quizContentTheory.classList.add("hidden");

  btnToSubj.classList.add("hidden");
  btnToTheory.classList.remove("hidden");

  updateStep(2);
};

btnToTheory.onclick = () => {
  const empty = subjectiveQuestions.some(q => !subjectiveAnswers[q.id]);
  if (empty) return alert("Answer all subjective questions.");

  // Show only theory section
  quizContentSubj.classList.add("hidden");
  quizContentTheory.classList.remove("hidden");

  // Hide the other buttons
  btnToSubj.classList.add("hidden");
  btnToTheory.classList.add("hidden");

  // ✅ SHOW the finish button only here
  btnFinish.classList.remove("hidden");

  // Optional: show section title (if you added them)
  document.getElementById("mcq-title")?.classList.add("hidden");
  document.getElementById("subjective-title")?.classList.add("hidden");
  document.getElementById("theory-title")?.classList.remove("hidden");

  updateStep(3);
};
// function exportStudentResults() {
//   const results = JSON.parse(localStorage.getItem("quizResults") || "[]");
//   const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });

//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = "student-results.json"; // You can personalize this by student name
//   link.click();
// }
function exportMyResult() {
  const name = studentInfo.name.toLowerCase();
  const className = studentInfo.class.toLowerCase();
  const key = `${name}_${className}`;

  const questionsUsed = JSON.parse(localStorage.getItem(`quiz_${key}`)) || [];
  const results = JSON.parse(localStorage.getItem("quizResults") || "[]");

  const studentResult = results.find(r =>
    r.name.toLowerCase() === name && r.class.toLowerCase() === className
  );

  if (!studentResult) return alert("No result found for this student.");

  const fullExport = {
    ...studentResult,
    questionsUsed
  };

  const blob = new Blob([JSON.stringify(fullExport, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${studentResult.name}_${studentResult.class}_result.json`;
  link.click();
}

download.onclick =()=>exportMyResult();

});
