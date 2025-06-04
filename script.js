
(() => {
  let quiz = [];
  window.onload = () => {
    fetch('questions.json').then(res => res.json()).then(data => {
      quiz = data;
      document.querySelector(".center-container").style.display = 'block';
    });
  };

  // Elements
  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");
  const adminLoginScreen = document.getElementById("admin-login");
  const adminPanelScreen = document.getElementById("admin-panel");
  const startBtn = document.getElementById("start-btn");
  const adminLoginBtn = document.getElementById("admin-login-btn");
  const nextBtn = document.getElementById("next-btn");

  // const timerContainer = document.getElementById('timerDisplay');
  const warningSound = document.getElementById('warningSound');
  const progressBar = document.getElementById("progress");
  const quizContent = document.getElementById("quiz-content");
  const resultSummary = document.getElementById("result-summary");
  const downloadResultBtn = document.getElementById("download-result-btn");
  const newUserBtn = document.getElementById("new-user-btn");
  const studentNameInput = document.getElementById("student-name");
  const studentClassInput = document.getElementById("student-class");
  const startError = document.getElementById("start-error");
  const adminPassInput = document.getElementById("admin-pass");
  const adminLoginSubmitBtn = document.getElementById("admin-login-submit-btn");
  const adminLoginCancelBtn = document.getElementById("admin-login-cancel-btn");
  const adminLoginError = document.getElementById("admin-login-error");
  const downloadAllBtn = document.getElementById("download-all-btn");
  const clearAllBtn = document.getElementById("clear-all-btn");
  const adminLogoutBtn = document.getElementById("admin-logout-btn");
  const adminResultsContainer = document.getElementById("admin-results-container");
  const toggleBtn = document.getElementById("theme-toggle");
  const timerDisplay = document.getElementById('timerDisplay');

  const timerSound = document.getElementById('timerSound');
  const body = document.body;

  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark");
    toggleBtn.textContent = body.classList.contains("dark") ? "🌙" : "🌞";
  });


  // Initial setup      
  const QUIZ_TIME = 60; // total time in seconds for the quiz



  // Set initial theme based on system preference
  // State variables
  let currentQuestionIndex = 0;
  let selectedAnswers = [];
  let timer = QUIZ_TIME;
  let timerInterval = null;
  let studentInfo = null;
  const adminPassword = "admin123"; // change this for admin password
  // Sounds for feedback
  const correctSound = new Audio("./sounds/success.wav");
  const wrongSound = new Audio("./sounds/wrong.mp3");





  // Utility functions
  function saveResult(result) {
    let results = JSON.parse(localStorage.getItem("quizResults") || "[]");
    results.push(result);
    localStorage.setItem("quizResults", JSON.stringify(results));
  }

  function getAllResults() {
    return JSON.parse(localStorage.getItem("quizResults") || "[]");
  }

  function clearAllResults() {
    if (confirm("Are you sure you want to clear ALL quiz results?")) {
      localStorage.removeItem("quizResults");
      alert("All results cleared.");
      adminResultsContainer.innerHTML = "";
    }
  }

  function userExists(name, cls) {
    const results = getAllResults();
    return results.some(r => r.name.toLowerCase() === name.toLowerCase() && r.class.toLowerCase() === cls.toLowerCase());
  }

  function formatDateTime(date) {
    return date.toLocaleString();
  }

  // UI functions
  function showScreen(screen) {
    [startScreen, quizScreen, resultScreen, adminLoginScreen, adminPanelScreen].forEach(s => s.style.display = "none");
    screen.style.display = "block";
  }

  // Render a question with options
  function renderQuestion(index) {
    const q = quiz[index];
    quizContent.innerHTML = `
      <div class="question">Q${index + 1}. ${q.question}</div>
      <div class="options">
        ${q.options.map(opt => `<button type="button" class="option-btn">${opt}</button>`).join("")}
      </div>
    `;
    // Disable next button until an option is selected
    nextBtn.disabled = true;

    // Highlight previously selected answer (if any)
    const optionButtons = quizContent.querySelectorAll(".option-btn");
    optionButtons.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        selectedAnswers[index] = btn.textContent;
        optionButtons.forEach(b => b.disabled = true);
        // Mark correct/wrong on selection
        optionButtons.forEach(b => {
          if (b.textContent === q.answer) b.classList.add("correct");
          else if (b.textContent === selectedAnswers[index]) b.classList.add("wrong");
          // Play sounds
          if (b.textContent === q.answer) {
            correctSound.play();
          } else if (b.textContent === selectedAnswers[index]) {

            wrongSound.play();
          }
        });

        nextBtn.disabled = false;
      });

      // If previously answered, disable buttons and show correct/wrong
      if (selectedAnswers[index]) {
        optionButtons.forEach(b => {
          b.disabled = true;
          if (b.textContent === q.answer) b.classList.add("You selected the correct answer!");
          else if (b.textContent === selectedAnswers[index]) b.classList.add("Oops! That was the wrong answer. ❌");
        });
        nextBtn.disabled = false;
      }
    });

    // Update progress bar
    const progressPercent = ((index) / quiz.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
  }

  // Show result summary after quiz
  function showResult() {
    let correctCount = 0;
    let html = `
                <p class="info"><strong>Name:</strong> ${studentInfo.name}</p>
                <p class="info"><strong>Class:</strong> ${studentInfo.class}</p>
                <p class="info"><strong>Date:</strong> ${formatDateTime(new Date())}</p>
                <p class="info"><strong>Score:</strong>
                 `;

    selectedAnswers.forEach((ans, i) => {
      if (ans === quiz[i].answer) correctCount++;
    });
    html += `${correctCount} / ${quiz.length}`;

    quiz.forEach((q, i) => {
      const userAns = selectedAnswers[i];
      const correct = userAns === q.answer;
      html += `
        <div class="result-question">
          <strong>Q${i + 1}.</strong><strong> ${q.question}</strong>
          <div class="result-answer" ${correct ? 'correct' : 'wrong'}">
            ${correct ? '<i class="fa fa-check correct-icon"></i>' : '<i class="fa fa-times wrong-icon"></i>'}
            Your answer: ${userAns || 'No answer'}
          </div>
          <div>Correct answer:${q.answer}</div>
        <div class="explanation" style="font-style:italic;">Explanation:${q.explanation || ''}</div>
        </div>
      `;
    });

    resultSummary.innerHTML = html;
  }



 const downloadResultPDF = async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const studentName = studentInfo.name || "Student";
  const studentClass = studentInfo.class || "Class";
  const resultText = resultSummary.innerText || resultSummary.textContent || "No result found.";
  const lines = resultText.split('\n').map(l => l.trim()).filter(l => l);

  const loadImageAsBase64 = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 80;
        canvas.height = 80;
        canvas.getContext("2d").drawImage(img, 0, 0, 60, 60);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = url;
    });

  const logoBase64 = await loadImageAsBase64("./logo.png");

  // HEADER
  doc.setFillColor(255, 140, 0);
  doc.rect(0, 0, 210, 25, "F");
  doc.addImage(logoBase64, "PNG", 10, 4, 18, 18);
  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.text("TECHXAGON ACADEMY", 105, 11, { align: "center" });

  doc.setFont("helvetica", "italic");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("Quiz Result Summary", 105, 18, { align: "center" });

  // STUDENT INFO (below header with spacing)
  const infoY = 30;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(50, 50, 50);
  doc.text(` ${studentName} ${studentClass}`, 14, infoY);

  // RESULT BOX
  const boxX = 14, boxY = infoY + 4, boxWidth = 182, boxHeight = 246;
  const padding = 6;
  doc.setDrawColor(63, 81, 181);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 3, 3, "FD");

  // CONTENT
  let y = boxY + padding;
  const maxLineWidth = boxWidth - padding * 2;
  const lineHeight = 6;

  doc.setFontSize(10);

  lines.forEach(line => {
    let trimmed = line.trim();

    if (trimmed.startsWith("Q")) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 20, 20); // 
      trimmed = "  " + trimmed;
    } else if (trimmed.startsWith("Correct Answer:")) {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 150, 0); // Green
    } 
// Detect correct/wrong answers
  if (trimmed.includes("Correct")) {
    doc.setTextColor(0, 128, 0); // Green
  } else if (trimmed.includes("Wrong")) {
    doc.setTextColor(200, 0, 0); // Red
  } else if (trimmed.startsWith("Explanation")) {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 120); // blue for explanation
       trimmed += "\n";
    } else {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(20, 20, 20); // reset
    }

    const wrapped = doc.splitTextToSize(trimmed, maxLineWidth);
    wrapped.forEach(wrapLine => {
      if (y + lineHeight > 285) return;
      doc.text(wrapLine, boxX + padding, y);
      y += lineHeight;
    });

    y += 1;
  });

  // HIGHLIGHT SCORE (if found)
  const scoreLine = lines.find(line => line.includes("Score:"));
  if (scoreLine) {
    doc.setFillColor(240, 248, 255);
    doc.setDrawColor(0, 102, 204);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.roundedRect(14, 270, 80, 10, 2, 2, "FD");
    doc.text(scoreLine.trim(), 16, 276.5);
  }

  // FOOTER
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(` Generated on: ${new Date().toLocaleString()}`, 110, 293);

  // SAVE
  doc.save(`${studentName}_${studentClass}_result.pdf`);
};



  // Event handlers
  startBtn.onclick = () => {
    const name = studentNameInput.value.trim();
    const cls = studentClassInput.value.trim();

    if (!name || !cls) {
      startError.textContent = "Please enter your name and class.";
      return;
    }

    if (userExists(name, cls)) {
      startError.textContent = "User already took the quiz. Only one attempt allowed.";
      return;
    }

    startError.textContent = "";
    studentInfo = { name, class: cls };
    currentQuestionIndex = 0;
    selectedAnswers = [];
    timer = QUIZ_TIME;

    showScreen(quizScreen);
    renderQuestion(currentQuestionIndex);
    updateTimer();
    timerInterval = setInterval(() => {
      timer--;
      updateTimer();
      if (timer === 5) {
        const finalBeep = new Audio("https://www.soundjay.com/button/sounds/beep-09.mp3");
        finalBeep.play();
      }
      if (timer <= 0) {
        clearInterval(timerInterval);
        alert(" ⏰ Time is up! The quiz will now end.");
        finishQuiz();
      }
    }, 1000);
  };




  function updateTimer() {
    timerDisplay.textContent = timer;

    // Change color based on time
    if (timer <= 10) {
      timerDisplay.classList.remove("warning");
      timerDisplay.classList.add("danger");
    } else if (timer <= 30) {
      timerDisplay.classList.remove("danger");
      timerDisplay.classList.add("warning");
      // Play tick sound
      timerSound.currentTime = 0;
      timerSound.play();
    } else {
      timerDisplay.classList.remove("warning", "danger");
    }



  }

  nextBtn.onclick = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      currentQuestionIndex++;
      renderQuestion(currentQuestionIndex);
    } else {
      finishQuiz();
    }
  };

  function finishQuiz() {
    clearInterval(timerInterval);
    // alert("✅ Quiz finished or time is up!");
    timer = QUIZ_TIME;
    timerDisplay.textContent = timer;
    timerDisplay.classList.remove("warning", "danger");
    saveResult({
      name: studentInfo.name,
      class: studentInfo.class,
      date: formatDateTime(new Date()),
      answers: selectedAnswers
    });
    showScreen(resultScreen);
    showResult();
  }



  newUserBtn.onclick = () => {
    studentNameInput.value = "";
    studentClassInput.value = "";
    selectedAnswers = [];
    currentQuestionIndex = 0;
    timer = QUIZ_TIME;
    studentInfo = null;
    startError.textContent = "";
    showScreen(startScreen);
  };

  // Admin login flow
  adminLoginBtn.onclick = () => {
    adminPassInput.value = "";
    adminLoginError.textContent = "";
    showScreen(adminLoginScreen);
  };

  adminLoginSubmitBtn.onclick = () => {
    const pass = adminPassInput.value;
    if (pass === adminPassword) {
      adminLoginError.textContent = "";
      showScreen(adminPanelScreen);
      renderAdminResults();
    } else {
      adminLoginError.textContent = "Incorrect password.";
    }
  };

  adminLoginCancelBtn.onclick = () => {
    showScreen(startScreen);
  };

  adminLogoutBtn.onclick = () => {
    showScreen(startScreen);
  };

  downloadResultBtn.onclick = () => {
    downloadResultPDF();
  };

  downloadAllBtn.onclick = () => {
    downloadAllResultsPDF();
  };


  clearAllBtn.onclick = () => {
    clearAllResults();
    renderAdminResults();
  };

  // Initialize
  showScreen(startScreen);

})();
