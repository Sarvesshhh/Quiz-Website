const questions = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Lisbon"],
        correct: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        correct: 1
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        options: ["Oxygen", "Gold", "Osmium", "Oxide"],
        correct: 0
    },
    {
        question: "What is the full form of HTML?" ,
        options: ["Hyper Text Markup Language","Hyper Text Multi Language","Hyper Text Multiple Language","Hyper text Preprocessor"],
        correct: 0
    },
    {
        question: "who was the captain of the Indian team in the 2011 World Cup?",
        options: ["Virat Kohli","MS Dhoni","Sachin Tendulkar","Rohit Sharma"],
        correct: 1
    },
    {
        question: "What is the powerhouse of the cell?",
        options: ["Nucleus","Mitochondria","Chromosomes","Cytoplasm"],
        correct: 1
    },
    {
        question: "What is the capital of India",
        options: ["Chennai","Bangalore","Mumbai","Delhi"],
        correct: 3
    },
    {
        question: "How many bones are there in a Human Body?",
        options: ["208","206","207","200"],
        correct: 1
    },
    {
        question: "Who was casted as Dr.DOOM in Avengers Doomsday?",
        options: ["Chris Evans","Chris Hemsworth","Robert Downey Jnr","Tom Holland"],
        correct: 2
    },
    {
        question: "Which city is called as the silicon valley of India?",
        options: ["Bangalore","Chennai","Mumbai","Kolkata"],
        correct: 0
    },
];

let currentQuestionIndex = 0;
let selectedAnswers = Array(questions.length).fill(null); 
let score = 0;
let timeLeft = 120;  
let timer;
window.onload = function () {
    document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
};

function startQuiz() {
    document.getElementById('start-page').classList.add('d-none');
    document.getElementById('quiz-container').classList.remove('d-none');
    loadQuestion(currentQuestionIndex);
    timer = setInterval(updateTimer, 1000);
}

function loadQuestion(index) {
    const question = questions[index];
    document.getElementById('question-text').textContent = `${index + 1}. ${question.question}`;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';  

    question.options.forEach((option, optionIndex) => {
        const optionButton = document.createElement('button');
        optionButton.classList.add('option-btn');  
        optionButton.textContent = option;
        optionButton.disabled = selectedAnswers[currentQuestionIndex] !== null; 

        if (selectedAnswers[currentQuestionIndex] === optionIndex) {
            optionButton.classList.add('selected');
        }

        optionButton.addEventListener('click', () => {
            selectedAnswers[currentQuestionIndex] = optionIndex;
            document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
            optionButton.classList.add('selected'); 
            document.getElementById('next-btn').disabled = false;  
        });

        optionsContainer.appendChild(optionButton);  
    });

    updateNavigationButtons();
    checkOptionSelected();
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');

    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.classList.toggle('d-none', currentQuestionIndex === questions.length - 1);
    submitBtn.classList.toggle('d-none', currentQuestionIndex !== questions.length - 1);
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60 < 10 ? '0' + timeLeft % 60 : timeLeft % 60;
    document.getElementById('time').textContent = `${minutes}:${seconds}`;
    
    if (--timeLeft < 0) {
        clearInterval(timer);
        submitQuiz(true); 
    }
}

function checkOptionSelected() {
    const isAnswered = selectedAnswers[currentQuestionIndex] !== null;
    document.getElementById('next-btn').disabled = !isAnswered;
}

function navigateQuestion(direction) {
    currentQuestionIndex += direction;
    loadQuestion(currentQuestionIndex);
}

function submitQuiz(timeUp = false) {
    clearInterval(timer);
    let correctCount = 0;

    questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correct) {
            correctCount++;
        }
    });

    displayResults(correctCount, timeUp);
}

function displayResults(correctCount, timeUp) {
    document.getElementById('quiz-container').classList.add('d-none');
    document.getElementById('result-container').classList.remove('d-none');
    document.getElementById('score').textContent = `Your score: ${correctCount}/${questions.length}`;
    
    const detailedResults = document.getElementById('detailed-results');
    detailedResults.innerHTML = '';

    if (timeUp) {
        const timeUpMessage = document.createElement('p');
        timeUpMessage.textContent = 'Time is up! Here are your results:';
        timeUpMessage.style.color = '#e74c3c';
        timeUpMessage.style.fontWeight = 'bold';
        detailedResults.appendChild(timeUpMessage);
    }

    questions.forEach((question, index) => {
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = `
            <h5>${index + 1}. ${question.question}</h5>
            <p>Your answer: ${question.options[selectedAnswers[index]] || 'Not answered'}</p>
            <p>Correct answer: ${question.options[question.correct]}</p>
        `;
        detailedResults.appendChild(resultDiv);
    });
}

document.getElementById('next-btn').addEventListener('click', () => navigateQuestion(1));
document.getElementById('prev-btn').addEventListener('click', () => navigateQuestion(-1));
document.getElementById('submit-btn').addEventListener('click', submitQuiz);
document.getElementById('restart-btn').addEventListener('click', () => location.reload());
