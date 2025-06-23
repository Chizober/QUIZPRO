

// (() => {
//   let quiz = [], mcqQuestions = [], subjectiveQuestions = [], theoryQuestions = [];
//   let selectedAnswers = [], subjectiveAnswers = {}, theoryAnswers = {};
//   let studentInfo = null;

//   const QUIZ_TIME = 300;
//   let timer = QUIZ_TIME, timerInterval = null;

//   const quizContentMCQ = document.getElementById("quiz-content-mcq");
//   const quizContentSubj = document.getElementById("quiz-content-subjective");
//   const quizContentTheory = document.getElementById("quiz-content-theory");
//   const resultSummary = document.getElementById("result-summary");
//   const timerDisplay = document.getElementById("timerDisplay");

//   const startScreen = document.getElementById("start-screen");
//   const quizScreen = document.getElementById("quiz-screen");
//   const resultScreen = document.getElementById("result-screen");

//   const stepIndicator = document.getElementById("step-indicator");
//   const btnToSubj = document.getElementById("continue-subjective-btn");
//   const btnToTheory = document.getElementById("continue-theory-btn");
//   const btnFinish = document.getElementById("finish-btn");
//   const btnReturnHome = document.getElementById("return-home-btn");

//   const warningSound = new Audio("warning.mp3");
//   const endSound = new Audio("end.mp3");

//   const themeToggle = document.getElementById("theme-toggle");
//   themeToggle.onclick = () => {
//     document.body.classList.toggle("dark");
//     themeToggle.textContent = document.body.classList.contains("dark") ? "🌙" : "🌞";
//   };

//   function updateStep(step) {
//     stepIndicator.textContent = `Step ${step} of 3`;
//   }

//   function shuffleArray(arr) {
//     return [...arr].sort(() => Math.random() - 0.5);
//   }

//   function updateTimer() {
//     timerDisplay.textContent = `Time: ${timer}s`;
//     if (timer <= 10) {
//       timerDisplay.style.color = "red";
//       warningSound.play();
//     } else if (timer <= 30) {
//       timerDisplay.style.color = "orange";
//     } else {
//       timerDisplay.style.color = "";
//     }
//   }

//   function startQuiz() {
//     timer = QUIZ_TIME;
//     updateTimer();
//     timerInterval = setInterval(() => {
//       timer--;
//       updateTimer();
//       if (timer <= 0) {
//         clearInterval(timerInterval);
//         endSound.play();
//         finishQuiz();
//       }
//     }, 1000);
//   }

//   function renderMCQ() {
//   quizContentMCQ.innerHTML = "";
//   mcqQuestions.forEach((q, i) => {
//     const div = document.createElement("div");
//     div.innerHTML = `<p><strong>Q${i + 1}. ${q.question}</strong></p>`;
//     q.options.forEach(opt => {
//       const btn = document.createElement("button");
//       btn.textContent = opt;
//       btn.className = "option-btn fade-in";
//       btn.onclick = () => {
//         selectedAnswers[i] = opt;
//         Array.from(div.querySelectorAll("button")).forEach(b => b.classList.remove("selected"));
//         btn.classList.add("selected");
//       };
//       div.appendChild(btn);
//     });
//     quizContentMCQ.appendChild(div);
//   });

//    updateStep(1);
//   // Show only "Continue to Subjective" during MCQ step
//   btnToSubj.classList.remove("hidden");
//   btnToTheory.classList.add("hidden");
//   btnFinish.classList.add("hidden");
//   }

//   function assignIdsIfMissing(arr, prefix) {
//     return arr.map((q, i) => {
//       if (!q.id) q.id = `${prefix}_${i}`;
//       return q;
//     });
//   }

//   function renderTextArea(section, data, answers, prefix) {
//     section.innerHTML = "";
//     const normalized = assignIdsIfMissing(data, prefix);
//     normalized.forEach((q, i) => {
//       const div = document.createElement("div");
//       div.classList.add("fade-in");
//       div.innerHTML = `<p><strong>Q${i + 1}. ${q.question}</strong></p>`;
//       const textarea = document.createElement("textarea");
//       textarea.rows = prefix === "theory" ? 5 : 3;
//       textarea.dataset.id = q.id;
//       textarea.value = answers[q.id] || "";
//       textarea.oninput = () => answers[q.id] = textarea.value.trim();
//       div.appendChild(textarea);
//       section.appendChild(div);
//     });
//   }

//   function finishQuiz() {
//     clearInterval(timerInterval);
//     document.querySelectorAll("#quiz-content-subjective textarea").forEach(t => subjectiveAnswers[t.dataset.id] = t.value.trim());
//     document.querySelectorAll("#quiz-content-theory textarea").forEach(t => theoryAnswers[t.dataset.id] = t.value.trim());

//     const score = mcqQuestions.filter((q, i) => selectedAnswers[i] === q.answer).length;
//     const result = {
//       name: studentInfo.name,
//       class: studentInfo.class,
//       date: new Date().toLocaleString(),
//       score,
//       total: mcqQuestions.length,
//       answers: selectedAnswers,
//       subjective: subjectiveAnswers,
//       theory: theoryAnswers
//     };
//    let all = JSON.parse(localStorage.getItem("quizResults") || "[]");

// const exists = all.some(r =>
//   r.name.toLowerCase() === result.name.toLowerCase() &&
//   r.class.toLowerCase() === result.class.toLowerCase()
// );

// if (exists) {
//   alert("Duplicate entry detected! You have already submitted this quiz.");
//   return; // prevent saving
// }

// // Only run this if it's a new entry
// all.push(result);
// localStorage.setItem("quizResults", JSON.stringify(all));
// localStorage.setItem(`quizResult_${result.name.toLowerCase()}_${result.class.toLowerCase()}`, "submitted");
// showResult(result);
//   }

//   function showResult(result) {
//     let html = `
//       <div style="text-align:center">
//         <img src="logo-min.png" alt="School Logo" width="100" /><br>
//         <h3>Result Summary</h3>
//       </div>
//       <p><strong>Name:</strong> ${result.name}</p>
//       <p><strong>Class:</strong> ${result.class}</p>
//       <p><strong>Date:</strong> ${result.date}</p>
//       <p><strong>Score:</strong> ${result.score} / ${result.total}</p>
//       <h4>MCQ Answers</h4>`;
//     mcqQuestions.forEach((q, i) => {
//       const isCorrect = result.answers[i] === q.answer;
//       const color = isCorrect ? "green" : "red";
//       html += `<p class="fade-in"><strong>${q.question}</strong><br>
//       <span style="color:${color}">Your Answer: ${result.answers[i] || 'None'}</span> | 
//       <span style="color:green">Correct: ${q.answer}</span></p>`;
//     });
//     html += `<h4>Subjective</h4>`;
//     subjectiveQuestions.forEach(q => {
//       html += `<p class="fade-in"><strong>${q.question}</strong><br>Answer: ${result.subjective[q.id] || 'None'}</p>`;
//     });
//     html += `<h4>Theory</h4>`;
//     theoryQuestions.forEach(q => {
//       html += `<p class="fade-in"><strong>${q.question}</strong><br>Answer: ${result.theory[q.id] || 'None'}</p>`;
//     });

//     const allResults = JSON.parse(localStorage.getItem("quizResults") || "[]");
//     const classResults = allResults.filter(r => r.class.toLowerCase() === result.class.toLowerCase());
//     const averageScore = (classResults.reduce((sum, r) => sum + (r.score || 0), 0) / classResults.length).toFixed(2);
//     html += `<h4>Class Performance</h4>
//     <p>Total Students: ${classResults.length}</p>
//     <p>Average Score: ${averageScore}</p>`;

//     resultSummary.innerHTML = html;

//     startScreen.classList.add("hidden");
//     quizScreen.classList.add("hidden");
//     resultScreen.classList.remove("hidden");
//     resultScreen.scrollIntoView({ behavior: "smooth" });
// btnReturnHome.classList.remove("hidden");

//     btnReturnHome.onclick = () => location.reload();
//   }

//   document.getElementById("start-btn").onclick = () => {
//     const name = document.getElementById("student-name").value.trim();
//     const cls = document.getElementById("student-class").value.trim();
//     if (!name || !cls) return alert("Enter name and class");
//     studentInfo = { name, class: cls };

//     const key = `${name.toLowerCase()}_${cls.toLowerCase()}`;
//     if (localStorage.getItem(`quizResult_${key}`)) {
//       alert("You have already attempted this quiz.");
//       return;
//     }

//     fetch("questions.json").then(res => res.json()).then(data => {
//       const stored = localStorage.getItem(`quiz_${key}`);
//       quiz = stored ? JSON.parse(stored) : shuffleArray(data);
//       if (!stored) localStorage.setItem(`quiz_${key}`, JSON.stringify(quiz));

//       mcqQuestions = quiz.filter(q => q.type === "mcq");
//       subjectiveQuestions = assignIdsIfMissing(quiz.filter(q => q.type === "subjective"), "subj");
//       theoryQuestions = assignIdsIfMissing(quiz.filter(q => q.type === "theory"), "theory");

//       renderMCQ();
//       renderTextArea(quizContentSubj, subjectiveQuestions, subjectiveAnswers, "subj");
//       renderTextArea(quizContentTheory, theoryQuestions, theoryAnswers, "theory");

//       quizContentSubj.classList.add("hidden");
//       quizContentTheory.classList.add("hidden");

//       startScreen.classList.add("hidden");
//       quizScreen.classList.remove("hidden");
//       resultScreen.classList.add("hidden");

//       startQuiz();
//     }).catch(err => {
//       alert("Failed to load questions.");
//       console.error(err);
//     });
//   };

//   btnToSubj.onclick = () => {
//   if (selectedAnswers.length < mcqQuestions.length || selectedAnswers.includes(undefined)) {
//     alert("Please answer all MCQ questions.");
//     return;
//   }
//   quizContentMCQ.classList.add("hidden");
//   quizContentSubj.classList.remove("hidden");
  

//   // Show only "Continue to Theory" during Subjective step
//   btnToSubj.classList.add("hidden");
//   btnToTheory.classList.remove("hidden");
//   btnFinish.classList.add("hidden");
//   updateStep(2);
// };

//   btnToTheory.onclick = () => {
//   const empty = subjectiveQuestions.some(q => !subjectiveAnswers[q.id]);
//   if (empty) return alert("Answer all subjective questions.");
//   quizContentSubj.classList.add("hidden");
//   quizContentTheory.classList.remove("hidden");

//   // Show only "Finish" during Theory step
//   btnToSubj.classList.add("hidden");
//   btnToTheory.classList.add("hidden");
//   btnFinish.classList.remove("hidden");
//   updateStep(3);
// };


//   btnFinish.onclick = () => {
//     const empty = theoryQuestions.some(q => !theoryAnswers[q.id]);
//     if (empty) return alert("Answer all theory questions.");
//     finishQuiz();
//   };
// })();

(() => {
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

  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");

  const stepIndicator = document.getElementById("step-indicator");
  const btnToSubj = document.getElementById("continue-subjective-btn");
  const btnToTheory = document.getElementById("continue-theory-btn");
  const btnFinish = document.getElementById("finish-btn");
  const btnReturnHome = document.getElementById("return-home-btn");

  const warningSound = new Audio("warning.mp3");
  const endSound = new Audio("end.mp3");

  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.onclick = () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "🌙" : "🌞";
  };

  // Initial button visibility
  btnFinish.classList.add("hidden");
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

  function renderMCQ() {
    quizContentMCQ.innerHTML = "";
    mcqQuestions.forEach((q, i) => {
      const div = document.createElement("div");
      div.innerHTML = `<p><strong>Q${i + 1}. ${q.question}</strong></p>`;
      q.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt;
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

    updateStep(1);
    btnToSubj.classList.remove("hidden");
    btnToTheory.classList.add("hidden");
    btnFinish.classList.add("hidden");
  }

  function assignIdsIfMissing(arr, prefix) {
    return arr.map((q, i) => {
      if (!q.id) q.id = `${prefix}_${i}`;
      return q;
    });
  }

  function renderTextArea(section, data, answers, prefix) {
    section.innerHTML = "";
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
      const color = isCorrect ? "green" : "red";
      html += `<p class="fade-in"><strong>${q.question}</strong><br>
      <span style="color:${color}">Your Answer: ${result.answers[i] || 'None'}</span> | 
      <span style="color:green">Correct: ${q.answer}</span></p>`;
    });
    html += `<h4>Subjective</h4>`;
    subjectiveQuestions.forEach(q => {
      html += `<p class="fade-in"><strong>${q.question}</strong><br>Answer: ${result.subjective[q.id] || 'None'}</p>`;
    });
    html += `<h4>Theory</h4>`;
    theoryQuestions.forEach(q => {
      html += `<p class="fade-in"><strong>${q.question}</strong><br>Answer: ${result.theory[q.id] || 'None'}</p>`;
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

    btnToSubj.classList.add("hidden");
    btnToTheory.classList.remove("hidden");
    btnFinish.classList.add("hidden");
    updateStep(2);
  };

  btnToTheory.onclick = () => {
    const empty = subjectiveQuestions.some(q => !subjectiveAnswers[q.id]);
    if (empty) return alert("Answer all subjective questions.");
    quizContentSubj.classList.add("hidden");
    quizContentTheory.classList.remove("hidden");

    btnToSubj.classList.add("hidden");
    btnToTheory.classList.add("hidden");
    btnFinish.classList.remove("hidden");
    updateStep(3);
  };

  btnFinish.onclick = () => {
    const empty = theoryQuestions.some(q => !theoryAnswers[q.id]);
    if (empty) return alert("Answer all theory questions.");
    finishQuiz();
  };
})();
