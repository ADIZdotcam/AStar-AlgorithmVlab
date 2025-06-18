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

const rows = 5;
const cols = 10;
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

function aStarStep() {
    if (pathFound || openSet.length === 0) {
        if (!pathFound) {
            document.getElementById("stepDetails").innerText = "Can't find path!";
            document.getElementById("nextStep").innerText = "Retake Practical";
            document.getElementById("retakeButton").style.display = "block"; // Show Retake button
        }
        return;
    }

    // Sort openSet by f-cost (can be replaced with a priority queue for efficiency)
    openSet.sort((a, b) => a.f - b.f);
    let current = openSet.shift(); // Remove node with lowest f-cost

    // If goal is reached, reconstruct the path
    if (current === goal) {
        reconstructPath(current);
        pathFound = true;
        document.getElementById("nextStep").innerText = "Retake Practical";
        return;
    }

    // Move current node to closed set
    closedSet.push(current);
    current.element.classList.add("closed-set");

    // Logging for debugging
    let stepLog = `Checking node (${current.row}, ${current.col}):\n`;

    // Get and evaluate neighbors
    let neighbors = getNeighbors(current);
    for (let neighbor of neighbors) {
        if (closedSet.includes(neighbor) || neighbor.wall) continue; // Skip closed/wall nodes

        let tentativeG = current.g + 1; // Assuming uniform movement cost
        if (!openSet.includes(neighbor)) {
            openSet.push(neighbor); // Add to openSet if not already present
        } else if (tentativeG >= neighbor.g) {
            continue; // Skip if no improvement
        }

        // Update neighbor values
        neighbor.g = tentativeG;
        neighbor.h = heuristic(neighbor, goal);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;

        // Update visualization
        neighbor.element.classList.add("open-set");
        neighbor.element.innerText = Math.round(neighbor.f);

        // Log details
        stepLog += ` → Neighbor (${neighbor.row}, ${neighbor.col}): g=${neighbor.g}, h=${neighbor.h.toFixed(2)}, f=${neighbor.f.toFixed(2)}\n`;
    }

    // Display step details
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

function copyCode(elementId) {
    const codeBlock = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(codeBlock).then(() => {
        let button = document.querySelector(".copy-button");
        button.textContent = "Copied!";
        button.style.backgroundColor = "#4CAF50"; // Green color

        setTimeout(() => {
            button.textContent = "Copy";
            button.style.backgroundColor = ""; // Reset to default
        }, 2000);
    }).catch(err => {
        console.error("Failed to copy code: ", err);
    });
}



//practice 2 nodes
const canvasElem = document.getElementById("graphCanvas");
const canvasCtx = canvasElem.getContext("2d");
canvasElem.width = 350;
canvasElem.height = 350;

const tableBody = document.getElementById("info-table").querySelector("tbody");
const nextButton2 = document.getElementById("next");
const backButton = document.getElementById("back");
const resetButton = document.getElementById("reset");

const graphNodes = {
    A: { x: 35, y: 70 },
    B: { x: 140, y: 35 },
    C: { x: 245, y: 70 },
    D: { x: 105, y: 140 },
    E: { x: 210, y: 175 },
    F: { x: 315, y: 140 },
    G: { x: 280, y: 245 },
    H: { x: 140, y: 245 }
};

const graphEdges = [
    ["A", "B", 4], ["A", "D", 2],
    ["B", "C", 3], ["B", "D", 5],
    ["C", "E", 7], ["C", "F", 6],
    ["D", "E", 3], ["D", "H", 8],
    ["E", "G", 2], ["F", "G", 4],
    ["H", "G", 5]
];

const startPoint = "A";
const goalPoint = "G";

const estimateHeuristic = (nodeId, goalId) => {
    const dx = Math.abs(graphNodes[nodeId].x - graphNodes[goalId].x);
    const dy = Math.abs(graphNodes[nodeId].y - graphNodes[goalId].y);
    return dx + dy;
};

function renderGraph(activeQueue, exploredNodes) {
    canvasCtx.clearRect(0, 0, canvasElem.width, canvasElem.height);

    graphEdges.forEach(([src, dst, cost]) => {
        const { x: sx, y: sy } = graphNodes[src];
        const { x: dx, y: dy } = graphNodes[dst];

        canvasCtx.beginPath();
        canvasCtx.moveTo(sx, sy);
        canvasCtx.lineTo(dx, dy);
        canvasCtx.strokeStyle = "black";
        canvasCtx.lineWidth = 2;
        canvasCtx.stroke();

        const midX = (sx + dx) / 2;
        const midY = (sy + dy) / 2;

        const angle = Math.atan2(dy - sy, dx - sx);
        const labelOffset = 15;

        const textX = midX + labelOffset * Math.cos(angle + Math.PI / 2);
        const textY = midY + labelOffset * Math.sin(angle + Math.PI / 2);

        canvasCtx.fillStyle = "red";
        canvasCtx.font = "14px Arial";
        canvasCtx.fillText(cost, textX, textY);
    });

    Object.keys(graphNodes).forEach(nodeId => {
        canvasCtx.beginPath();
        canvasCtx.arc(graphNodes[nodeId].x, graphNodes[nodeId].y, 20, 0, 2 * Math.PI);

        if (nodeId === startPoint) canvasCtx.fillStyle = "green";
        else if (nodeId === goalPoint) canvasCtx.fillStyle = "cyan";
        else if (exploredNodes.includes(nodeId)) canvasCtx.fillStyle = "red";
        else if (activeQueue.map(n => n.id).includes(nodeId)) canvasCtx.fillStyle = "lightgreen";
        else canvasCtx.fillStyle = "lightblue";

        canvasCtx.fill();
        canvasCtx.strokeStyle = "black";
        canvasCtx.stroke();

        canvasCtx.fillStyle = "black";
        canvasCtx.font = "16px Arial";
        canvasCtx.fillText(nodeId, graphNodes[nodeId].x - 5, graphNodes[nodeId].y + 5);
    });
}

let openQueue = [{ id: startPoint, g: 0, h: estimateHeuristic(startPoint, goalPoint), f: 0, from: null }];
let visitedQueue = [];
let stepHistory = [];
let visitedTracker = { [startPoint]: { g: 0, h: estimateHeuristic(startPoint, goalPoint), f: 600, from: "-" } };

function runAStarStep() {
    if (openQueue.length === 0) return;

    openQueue.sort((a, b) => a.f - b.f);
    const currentNode = openQueue.shift();
    visitedQueue.push(currentNode.id);
    stepHistory.push([...visitedQueue]);

    if (visitedQueue.includes(goalPoint)) {
        renderGraph(openQueue, visitedQueue);
        highlightShortestPath();
        return;
    }

    graphEdges.forEach(([src, dst, weight]) => {
        if (src !== currentNode.id) return;
        if (visitedQueue.includes(dst)) return;

        const gScore = currentNode.g + weight;
        const hScore = estimateHeuristic(dst, goalPoint);
        const fScore = gScore + hScore;
        const existingNode = openQueue.find(n => n.id === dst);

        if (!existingNode || gScore < existingNode.g) {
            openQueue.push({ id: dst, g: gScore, h: hScore, f: fScore, from: currentNode.id });
            if (!visitedTracker[dst] || gScore < visitedTracker[dst].g) {
                visitedTracker[dst] = { g: gScore, h: hScore, f: fScore, from: currentNode.id };
            }
        }
    });

    updateTableDisplay();
    renderGraph(openQueue, visitedQueue);
    showQueueInfo();
}

function updateTableDisplay() {
    tableBody.innerHTML = "";
    Object.entries(visitedTracker).forEach(([node, { g, h, f, from }]) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${node}</td><td>${g}</td><td>${h}</td><td>${f}</td><td>${from || "-"}</td>`;
        tableBody.appendChild(row);
    });
}

nextButton2.addEventListener("click", () => {
    runAStarStep();
    showQueueInfo();
});

backButton.addEventListener("click", () => {
    if (stepHistory.length === 0 || visitedQueue.length === 0) return;

    const removedNode = visitedQueue.pop();
    stepHistory.pop();

    Object.keys(visitedTracker).forEach(node => {
        if (visitedTracker[node].from === removedNode) {
            delete visitedTracker[node];
        }
    });

    delete visitedTracker[removedNode];

    openQueue = stepHistory.length > 0
        ? stepHistory[stepHistory.length - 1].map(n => ({
            id: n,
            ...visitedTracker[n]
        }))
        : [{ id: startPoint, g: 0, h: estimateHeuristic(startPoint, goalPoint), f: 600, from: "-" }];

    updateTableDisplay();
    renderGraph(openQueue, visitedQueue);
    showQueueInfo();
});

resetButton.addEventListener("click", () => {
    openQueue = [{ id: startPoint, g: 0, h: estimateHeuristic(startPoint, goalPoint), f: 0, from: null }];
    visitedQueue = [];
    stepHistory = [];
    visitedTracker = { [startPoint]: { g: 0, h: estimateHeuristic(startPoint, goalPoint), f: 600, from: "-" } };
    tableBody.innerHTML = "";
    renderGraph([], []);
});

function highlightShortestPath() {
    let current = goalPoint;
    canvasCtx.strokeStyle = "purple";
    canvasCtx.lineWidth = 4;

    while (current && visitedTracker[current]?.from !== null) {
        const from = visitedTracker[current].from;
        if (!from) break;

        const { x: cx, y: cy } = graphNodes[current];
        const { x: fx, y: fy } = graphNodes[from];

        canvasCtx.beginPath();
        canvasCtx.moveTo(fx, fy);
        canvasCtx.lineTo(cx, cy);
        canvasCtx.stroke();

        current = from;
    }
}

function showQueueInfo() {
    const statusDiv = document.getElementById("open-closed-display");
    const iteration = visitedQueue.length;

    const openText = openQueue.map(n => `(${n.id}, ${n.f})`).join(", ");
    const closedText = visitedQueue.join(", ");

    statusDiv.innerHTML = `Priority Queue (Iteration ${iteration}): Open Set = {${openText}}; Closed Set = {${closedText}}`;
}

renderGraph([], []);
