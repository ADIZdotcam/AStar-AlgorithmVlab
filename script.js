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
document.addEventListener('DOMContentLoaded', function () {
    createGrid();
});

const rows = 7;
const cols = 15;
let grid = [];
let openSet = [];
let closedSet = [];
let path = [];
let start, goal;
let stepIndex = 0;
let pathFound = false;

// Create grid
function createGrid() {
    const gridElement = document.getElementById("grid");
    gridElement.innerHTML = "";
    gridElement.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener("click", toggleWall);
            gridElement.appendChild(cell);
            grid[i][j] = { 
                row: i, col: j, f: 0, g: 0, h: 0, 
                wall: false, parent: null, element: cell 
            };
        }
    }

    start = grid[0][0];
    goal = grid[rows - 1][cols - 1];
    start.element.classList.add("start");
    goal.element.classList.add("goal");
}

// Toggle walls on click
function toggleWall(event) {
    let row = event.target.dataset.row;
    let col = event.target.dataset.col;
    if ((row == 0 && col == 0) || (row == rows - 1 && col == cols - 1)) return;
    let cell = grid[row][col];
    cell.wall = !cell.wall;
    cell.element.classList.toggle("wall");
}

// Euclidean Distance
function heuristic(a, b) {
    return Math.sqrt((a.row - b.row) ** 2 + (a.col - b.col) ** 2);
}

// Get Neighbors
function getNeighbors(node) {
    let neighbors = [];
    let { row, col } = node;
    let directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    for (let [dx, dy] of directions) {
        let newRow = row + dx;
        let newCol = col + dy;
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            neighbors.push(grid[newRow][newCol]);
        }
    }
    return neighbors;
}

// A* Stepwise Execution
function aStarStep() {
    if (pathFound || openSet.length === 0) {
        if (!pathFound) {
            // If no path is found, show the message and retake button
            document.getElementById("stepDetails").innerText = "Can't find path!";
            document.getElementById("nextStep").innerText = "Retake Practical";
            //document.getElementById("retakeButton").style.display = "block";  // Show Retake button
        }
        return;
    }
    openSet.sort((a, b) => a.f - b.f);
    let current = openSet.shift();

    if (current === goal) {
        reconstructPath(current);
        pathFound = true;
        document.getElementById("nextStep").innerText = "Retake Practical";
        return;
    }

    closedSet.push(current);
    current.element.classList.add("closed-set");

    let stepLog = `Checking node (${current.row}, ${current.col}):\n`;

    let neighbors = getNeighbors(current);
    for (let neighbor of neighbors) {
        if (closedSet.includes(neighbor) || neighbor.wall) continue;

        let tentativeG = current.g + 1;
        if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
        } else if (tentativeG >= neighbor.g) {
            continue;
        }

        neighbor.g = tentativeG;
        neighbor.h = heuristic(neighbor, goal);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;
        neighbor.element.classList.add("open-set");
        neighbor.element.innerText = Math.round(neighbor.f);

        stepLog += ` → Neighbor (${neighbor.row}, ${neighbor.col}): g=${neighbor.g}, h=${neighbor.h.toFixed(2)}, f=${neighbor.f.toFixed(2)}\n`;
    }

    document.getElementById("stepDetails").innerText = stepLog;
}

// Reconstruct Path
function reconstructPath(node) {
    path = [];
    while (node) {
        path.push(node);
        node = node.parent;
    }
    path.reverse();
    drawPath();
}

// Draw Path
function drawPath() {
    for (let node of path) {
        if (node !== start && node !== goal) {
            node.element.classList.add("path");
            node.element.innerText = "✔";
        }
    }
    document.getElementById("stepDetails").innerText = "Shortest path found!";
}

// Start Search
function startSearch() {
    openSet = [start];
    closedSet = [];
    path = [];
    pathFound = false;
    grid.forEach(row => row.forEach(cell => {
        cell.f = cell.g = cell.h = 0;
        cell.parent = null;
        cell.element.classList.remove("closed-set", "open-set", "path");
        if (!cell.wall) cell.element.innerText = "";
    }));
}

// Reset Practice Section for Retake
function resetPracticeSection() {
    // Reset A* related variables and state
    //current = openSet.shift();
    stepIndex = 0;
    pathFound = false;
    openSet = [];
    closedSet = [];
    path = [];
    
    grid.forEach(row => row.forEach(cell => {
        cell.f = cell.g = cell.h = 0;
        cell.parent = null;
        cell.wall = false;  // Reset the wall status explicitly
        cell.element.classList.remove("closed-set", "open-set", "path", "wall");
        cell.element.innerText = "";
    }));
    
    
    // Re-add start and goal cells
    start.element.classList.add("start");
    goal.element.classList.add("goal");
    
    
    // Reset the "Next Step" button visibility and text
    nextStep.style.display = "block";  // Ensure "Next Step" is visible
    nextStep.innerText = "Next Step"; // Reset text to "Next Step"
    
    // Reset the "Retake Practical" button visibility
    retakeButton.style.display = "none";
    // Restart the A* search
    startSearch();

    // Optionally, switch content back to practice section
    switchContent('practice');
}

document.getElementById("nextStep").addEventListener("click", () => {
    if (document.getElementById("nextStep").innerText === "Retake Practical") {
        resetPracticeSection();
        return;
    }

    if (stepIndex === 0) startSearch();
    
    aStarStep();
    stepIndex++;
});

function toggleVideo() {
    const video = document.getElementById("mp4Video");
    const playPauseBtn = document.getElementById("playPauseBtn");

    // Check if the video is playing or paused
    if (video.paused) {
        // Play the video
        video.play();
        playPauseBtn.textContent = "Pause Video";  // Change button text to 'Pause'
    } else {
        // Pause the video
        video.pause();
        playPauseBtn.textContent = "Play Video";  // Change button text to 'Play'
    }
}


