document.addEventListener('DOMContentLoaded', function () {
    // head nav
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    const searchButton = document.getElementById('searchbt');
    searchButton.addEventListener('click', performSearch);

});

let topicElements = {
    'aim': document.getElementById('aim'),
    'theory': document.getElementById('theory'),
    'procedure': document.getElementById('procedure'),
    'practice': document.getElementById('practice'),
    'code': document.getElementById('code'),
    'result': document.getElementById('result'),
    'quiz': document.getElementById('quiz'),
    'references': document.getElementById('references'),
    'tnt': document.getElementById('tnt')
};
let currentTopic = 'aim'; // Default topic


function switchContent(topic) {
    if (topic === currentTopic) {
        return;
    }

    topicElements[currentTopic].style.display = 'none';
    topicElements[topic].style.display = 'block';
    currentTopic = topic;
}

const questions = [
    {
        question: "What is the primary purpose of the A* algorithm?",
        choices: [
            "A. Finding the shortest path in a weighted graph",
            "B. Sorting elements in an array",
            "C. Compressing data for storage",
            "D. Encrypting messages"
        ],
        answer: 0
    },
    {
        question: "Which two functions does A* use to determine the best path?",
        choices: [
            "A. Depth function (D) and Cost function (C)",
            "B. Heuristic function (h) and Cost function (g)",
            "C. Distance function (d) and Weight function (w)",
            "D. Priority function (p) and Search function (s)"
        ],
        answer: 1
    },
    {
        question: "What property makes A* optimal and complete?",
        choices: [
            "A. Using a heuristic that never overestimates the cost",
            "B. Expanding all possible nodes before selecting the best path",
            "C. Ignoring the heuristic function for faster execution",
            "D. Only exploring direct neighbors of a node"
        ],
        answer: 0
    },
    {
        question: "Which data structure is commonly used to store nodes in A* search?",
        choices: [
            "A. Queue",
            "B. Stack",
            "C. Priority Queue",
            "D. Linked List"
        ],
        answer: 2
    }
];

let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById("question");
const choicesContainer = document.getElementById("choices");
const nextButton = document.getElementById("next-btn");
const retakeButton = document.getElementById("retake-btn");

function showQuestion() {
    let currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    choicesContainer.innerHTML = "";

    currentQuestion.choices.forEach((choice, index) => {
        const button = document.createElement("button");
        button.textContent = choice;
        button.classList.add("choice");
        button.addEventListener("click", () => selectAnswer(index));
        choicesContainer.appendChild(button);
    });

    nextButton.style.display = "none";
    retakeButton.style.display = "none";
}

function selectAnswer(selectedIndex) {
    const correctAnswer = questions[currentQuestionIndex].answer;
    const choiceButtons = document.querySelectorAll(".choice");

    choiceButtons.forEach((button, index) => {
        if (index === correctAnswer) {
            button.style.backgroundColor = "green";
            button.style.color = "white";
        } else {
            button.style.backgroundColor = "red";
            button.style.color = "white";
        }
    });

    if (selectedIndex === correctAnswer) {
        score++;
    }

    nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
});

function showResults() {
    questionElement.textContent = `Quiz Completed! Your Score: ${score} / ${questions.length}`;
    choicesContainer.innerHTML = "";
    nextButton.style.display = "none";
    retakeButton.style.display = "block";
}

retakeButton.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
});

showQuestion();
