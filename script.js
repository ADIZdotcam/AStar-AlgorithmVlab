// =====================
// DOM Ready
// =====================
document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");
  const backToTopBtn = document.getElementById("backToTop");
  const navWrapper = document.getElementById("navWrapper");
  const trigger = document.querySelector(".sticky-trigger");

  // --- Header scroll shrink + Back-to-top visibility (single scroll listener) ---
  window.addEventListener("scroll", function () {
    const scrolled = window.scrollY > 10;
    header.classList.toggle("scrolled", scrolled);

    // Back-to-top button: use flex display to honour button's centered layout
    backToTopBtn.style.display = window.scrollY > 100 ? "flex" : "none";
  });

  // --- Back to top ---
  backToTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // --- Sticky nav using IntersectionObserver ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        navWrapper.classList.toggle("sticky-nav-wrapper", !entry.isIntersecting);
      });
    },
    { rootMargin: "-60px 0px 0px 0px", threshold: 0 }
  );
  observer.observe(trigger);

  // --- Quiz start button ---
  document.getElementById("start-quiz-btn").addEventListener("click", () => {
    document.getElementById("quiz-instructions").style.display = "none";
    document.getElementById("quiz-content").style.display = "flex";
    showQuestion();
  });
});

// =====================
// Navigation / Content Switching
// =====================
const TOPIC_IDS = ["aim", "theory", "procedure", "practice", "code", "result", "quiz", "references", "tnt"];

// Cache elements once
const topicElements = Object.fromEntries(
  TOPIC_IDS.map(id => [id, document.getElementById(id)])
);

let currentTopic = "aim";

function switchContent(topic) {
  if (topic === currentTopic) return;

  const prev = topicElements[currentTopic];
  prev.style.display = "none";
  prev.classList.remove("active-section");

  const next = topicElements[topic];
  next.style.display = topic === "quiz" ? "flex" : "block";
  next.classList.add("active-section");

  currentTopic = topic;
}

// =====================
// Mobile Menu Toggle
// =====================
function toggleMenu() {
  document.querySelector(".nav-menu").classList.toggle("show");
}

// =====================
// Code Block Toggling
// =====================
function toggleCode(language) {
  document.querySelectorAll(".code-block").forEach(block => 
    block.classList.remove("active")
  );

  const target = document.getElementById(language + "Code");
  if (target) target.classList.add("active");
}

// Safe event binding
const cppRadio = document.getElementById("cppRadio");
const pythonRadio = document.getElementById("pythonRadio");

if (cppRadio) {
  cppRadio.addEventListener("change", () => toggleCode("cpp"));
}

if (pythonRadio) {
  pythonRadio.addEventListener("change", () => toggleCode("python"));
}

// =====================
// Copy Code
// =====================
function copyCode(elementId) {
  const codeBlock = document.getElementById(elementId);
  if (!codeBlock) return;
  const code = codeBlock.querySelector("code").innerText;

  navigator.clipboard.writeText(code).then(() => {
    const btn = codeBlock.querySelector(".copy-button");
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = "Copy";
      btn.classList.remove("copied");
    }, 2000);
  }).catch(err => console.error("Could not copy text:", err));
}

document.querySelectorAll(".copy-button").forEach(button => {
  button.addEventListener("click", () => {
    const language = button.closest(".code-block").id.replace("Code", "");
    copyCode(language + "Code");
  });
});

// =====================
// Quiz Logic
// =====================
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
    question: "Which data structure is commonly used to efficiently store nodes in A* search?",
    choices: [
      "A. Queue",
      "B. Stack",
      "C. Priority Queue",
      "D. Linked List"
    ],
    answer: 2
  },
  {
    question: "In A*, what does the formula f(n) = g(n) + h(n) calculate?",
    choices: [
      "A. The exact cost from the start node to node n.",
      "B. The total estimated cost of the cheapest path from start to goal via node n.",
      "C. The straight-line distance from node n to the goal.",
      "D. The cost from the start node to the parent of node n."
    ],
    answer: 1
  },
  {
    question: "What does the 'g(n)' value represent for a given node n?",
    choices: [
      "A. The estimated cost from node n to the goal.",
      "B. The lowest cost of the path found so far from the start node to node n.",
      "C. The number of neighbors node n has.",
      "D. The total estimated cost of the path through n."
    ],
    answer: 1
  },
  {
    question: "How does A* differ from Dijkstra's algorithm?",
    choices: [
      "A. Dijkstra's is only for unweighted graphs.",
      "B. A* uses a heuristic (h) to guide its search, while Dijkstra does not.",
      "C. A* is faster but does not guarantee the shortest path.",
      "D. Dijkstra's algorithm is not used for pathfinding."
    ],
    answer: 1
  },
  {
    question: "What is the purpose of the 'Open Set' (or Open List) in A*?",
    choices: [
      "A. To store all nodes that have been visited and fully explored.",
      "B. To store the final path once the goal is reached.",
      "C. To store nodes that have been discovered but not yet fully explored.",
      "D. To store all nodes that cannot be reached."
    ],
    answer: 2
  },
  {
    question: "If you modify A* to only consider the heuristic value (i.e., f(n) = h(n)), it becomes which algorithm?",
    choices: [
      "A. Breadth-First Search",
      "B. Depth-First Search",
      "C. Dijkstra's Algorithm",
      "D. Greedy Best-First Search"
    ],
    answer: 3
  },
  {
    question: "What is the primary reason for using a 'Closed Set' (or Closed List) in A*?",
    choices: [
      "A. To prevent the algorithm from getting stuck in loops by not re-processing nodes.",
      "B. To store nodes that have a very high heuristic value.",
      "C. To act as a backup for the Open Set.",
      "D. To store only the starting and goal nodes."
    ],
    answer: 0
  }
];

let currentQuestionIndex = 0;
let score = 0;
const userAnswers = [];

const questionElement = document.getElementById("question");
const choicesContainer = document.getElementById("choices");
const nextButton = document.getElementById("next-btn");
// Use the first (visible) retake button only
const retakeButton = document.querySelector("#quiz-content #retake-btn");

function showQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
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
  if (retakeButton) retakeButton.style.display = "none";
}

function selectAnswer(selectedIndex) {
  const correctAnswer = questions[currentQuestionIndex].answer;
  const choiceButtons = document.querySelectorAll(".choice");

  choiceButtons.forEach((button, index) => {
    button.disabled = true;
    button.style.backgroundColor = index === correctAnswer ? "green" : "red";
    button.style.color = "white";
  });

  userAnswers[currentQuestionIndex] = selectedIndex;
  if (selectedIndex === correctAnswer) score++;

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
  if (retakeButton) retakeButton.style.display = "block";
}

if (retakeButton) {
  retakeButton.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers.length = 0;
    showQuestion();
  });
}

// =====================
// Practice / A* Visualizer
// =====================
const practiceCanvas = document.getElementById("practice-canvas");
const ctx = practiceCanvas.getContext("2d");
const prevStepBtn = document.getElementById("prev-step-btn");
const nextStepBtn = document.getElementById("next-step-btn");
const resetGraphBtn = document.getElementById("reset-graph-btn");
const practiceMessageArea = document.getElementById("practice-message-area");
const algorithmStepsArea = document.getElementById("algorithm-steps-area");

const nodes = [
  { x: 50,  y: 50,  name: "A" },
  { x: 100, y: 170, name: "B" },
  { x: 220, y: 90,  name: "C" },
  { x: 60,  y: 350, name: "D" },
  { x: 400, y: 250, name: "E" },
  { x: 420, y: 100, name: "F" },
  { x: 550, y: 300, name: "G" },
  { x: 530, y: 40,  name: "H" },
  { x: 380, y: 390, name: "I" },
  { x: 565, y: 450, name: "J" },
  { x: 230, y: 350, name: "K" },
  { x: 250, y: 470, name: "L" },
  { x: 40,  y: 450, name: "M" },
  { x: 135, y: 565, name: "N" },
  { x: 400, y: 550, name: "O" },
];

const edges = [
  { start: 0,  end: 1,  cost: 13 },
  { start: 0,  end: 2,  cost: 17 },
  { start: 1,  end: 3,  cost: 18 },
  { start: 1,  end: 10, cost: 22 },
  { start: 1,  end: 2,  cost: 14 },
  { start: 1,  end: 4,  cost: 31 },
  { start: 2,  end: 4,  cost: 24 },
  { start: 2,  end: 5,  cost: 20 },
  { start: 3,  end: 10, cost: 17 },
  { start: 3,  end: 12, cost: 10 },
  { start: 4,  end: 10, cost: 19 },
  { start: 4,  end: 5,  cost: 15 },
  { start: 4,  end: 6,  cost: 15 },
  { start: 4,  end: 8,  cost: 14 },
  { start: 5,  end: 7,  cost: 12 },
  { start: 6,  end: 5,  cost: 23 },
  { start: 6,  end: 9,  cost: 15 },
  { start: 7,  end: 6,  cost: 26 },
  { start: 8,  end: 6,  cost: 19 },
  { start: 8,  end: 10, cost: 15 },
  { start: 8,  end: 11, cost: 15 },
  { start: 8,  end: 14, cost: 16 },
  { start: 9,  end: 8,  cost: 19 },
  { start: 9,  end: 14, cost: 19 },
  { start: 10, end: 11, cost: 12 },
  { start: 11, end: 13, cost: 14 },
  { start: 11, end: 14, cost: 17 },
  { start: 12, end: 13, cost: 14 },
  { start: 13, end: 14, cost: 26 },
];

let startNode = null;
let endNode = null;
let astarStates = [];
let currentStateIndex = 0;

// Helper: find edge cost between two nodes
function getEdgeCost(a, b) {
  const edge = edges.find(
    e => (e.start === a && e.end === b) || (e.start === b && e.end === a)
  );
  return edge ? edge.cost : Infinity;
}

function drawGraph() {
  ctx.clearRect(0, 0, practiceCanvas.width, practiceCanvas.height);

  // Draw edges
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 2;
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  edges.forEach(edge => {
    const s = nodes[edge.start];
    const e = nodes[edge.end];
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(e.x, e.y);
    ctx.stroke();
    ctx.fillText(edge.cost, (s.x + e.x) / 2, (s.y + e.y) / 2 - 10);
  });

  // Draw nodes
  nodes.forEach((node, index) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = index === startNode ? "green" : index === endNode ? "red" : "white";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.name, node.x, node.y);

    if (typeof node.h === "number") {
      ctx.font = "12px Arial";
      ctx.fillText(`h=${node.h}`, node.x, node.y + 15);
    }
  });
}

function getClickedNode(event) {
  const rect = practiceCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return nodes.findIndex(node =>
    Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2) < 20
  );
}

practiceCanvas.addEventListener("click", (event) => {
  if (startNode !== null && endNode !== null) return;

  const clickedNode = getClickedNode(event);
  if (clickedNode === -1) return;

  if (startNode === null) {
    startNode = clickedNode;
    practiceMessageArea.textContent = `Start node selected: ${nodes[startNode].name}. Now, select an end node.`;
  } else if (endNode === null) {
    if (clickedNode === startNode) {
      practiceMessageArea.textContent = "The end node cannot be the same as the start node. Please select a different node.";
    } else {
      endNode = clickedNode;
      runAStar();
    }
  }
  drawGraph();
});

function calculateHeuristics(goalNodeIndex) {
  const goal = nodes[goalNodeIndex];
  nodes.forEach((node, index) => {
    const dx = node.x - goal.x;
    const dy = node.y - goal.y;
    nodes[index].h = Math.round(Math.sqrt(Math.sqrt(dx * dx + dy * dy)) / 2);
  });
}

function reconstructPath(node) {
  const path = [];
  let current = node;
  while (current) {
    path.unshift(current.index);
    current = current.parent;
  }
  return path;
}

function getPathString(node) {
  const path = [];
  let current = node;
  while (current) {
    path.unshift(nodes[current.index].name);
    current = current.parent;
  }
  return path.join(" &rarr; ");
}

function runAStar() {
  if (startNode === null || endNode === null) return;

  calculateHeuristics(endNode);

  let openList = [{ index: startNode, g: 0, f: nodes[startNode].h, parent: null }];
  let closedList = [];
  astarStates = [];
  currentStateIndex = 0;

  while (openList.length > 0) {
    openList.sort((a, b) => a.f - b.f);
    const currentNode = openList.shift();
    closedList.push(currentNode.index);

    astarStates.push({
      openList: [...openList],
      closedList: [...closedList],
      currentNode: currentNode,
      path: reconstructPath(currentNode)
    });

    if (currentNode.index === endNode) {
      practiceMessageArea.textContent = "Goal reached!";
      astarStates[astarStates.length - 1].finalPath = reconstructPath(currentNode);
      updateVisualization();
      updateResultSection();
      break;
    }

    const neighbors = edges
      .filter(edge => edge.start === currentNode.index || edge.end === currentNode.index)
      .map(edge => edge.start === currentNode.index ? edge.end : edge.start);

    neighbors.forEach(neighborIndex => {
      if (closedList.includes(neighborIndex)) return;

      const g = currentNode.g + getEdgeCost(currentNode.index, neighborIndex);
      const h = nodes[neighborIndex].h;
      const f = g + h;

      const existingOpen = openList.find(n => n.index === neighborIndex);
      if (!existingOpen) {
        openList.push({ index: neighborIndex, g, f, parent: currentNode });
      } else if (g < existingOpen.g) {
        existingOpen.g = g;
        existingOpen.f = f;
        existingOpen.parent = currentNode;
      }
    });
  }

  updateVisualization();
}

function generateAlgorithmSteps(iteration) {
  const state = astarStates[iteration];
  const currentNodeInfo = state.currentNode;
  const currentNodeName = nodes[currentNodeInfo.index].name;
  const isGoal = currentNodeInfo.index === endNode;

  // --- Node selection steps ---
  let stepsHTML = `
    <ol>
      <li>Choose the node with the lowest <i>f-cost</i> from the Open List:
        <strong>${currentNodeName}</strong> (f-cost = ${currentNodeInfo.f.toFixed(1)})</li>
      <li>Move <strong>${currentNodeName}</strong> from the Open List to the Closed List.</li>
      <li>Is <strong>${currentNodeName}</strong> the goal node?
        ${isGoal
          ? `<strong style="color:#1a9e6e;">✔ YES</strong> — Path found!`
          : `<strong>NO</strong> — Evaluate its neighbors.`}
      </li>
    </ol>`;

  // --- Neighbor evaluation ---
  if (!isGoal) {
    const neighbors = edges
      .filter(e => e.start === currentNodeInfo.index || e.end === currentNodeInfo.index)
      .map(e => ({
        index: e.start === currentNodeInfo.index ? e.end : e.start,
        cost: e.cost
      }));

    if (neighbors.length > 0) {
      stepsHTML += `<ul>`;
      neighbors.forEach(neighbor => {
        const neighborName = nodes[neighbor.index].name;
        if (state.closedList.includes(neighbor.index) && iteration > 0) {
          stepsHTML += `<li>Neighbor <strong>${neighborName}</strong>: already in Closed List — skipped.</li>`;
        } else {
          const g = currentNodeInfo.g + neighbor.cost;
          const h = nodes[neighbor.index].h;
          const f = g + h;
          stepsHTML += `
            <li>Neighbor <strong>${neighborName}</strong>:
              <ul>
                <li><b>g-cost</b> = g(${currentNodeName}) + cost(${currentNodeName}→${neighborName})
                  = ${currentNodeInfo.g.toFixed(1)} + ${neighbor.cost} = ${g.toFixed(1)}</li>
                <li><b>h-cost</b> (heuristic to goal) = ${h.toFixed(1)}</li>
                <li><b>f-cost</b> = ${g.toFixed(1)} + ${h.toFixed(1)} = <strong>${f.toFixed(1)}</strong></li>
              </ul>
            </li>`;
        }
      });
      stepsHTML += `</ul>`;
    }
  }

  // --- State summary ---
  const closedNames = state.closedList.map(i => nodes[i].name).join(", ");

  let tableHTML = `<p><strong>Open List:</strong></p>`;
  if (state.openList.length > 0) {
    const sorted = [...state.openList].sort((a, b) => a.f - b.f);
    tableHTML += `
      <div class="step-table-wrap">
        <table class="styled-table">
          <thead><tr><th>Node</th><th>Path</th><th>g(n)</th><th>h(n)</th><th>f(n)</th></tr></thead>
          <tbody>`;
    sorted.forEach(node => {
      tableHTML += `
        <tr>
          <td>${nodes[node.index].name}</td>
          <td>${getPathString(node)}</td>
          <td>${node.g.toFixed(1)}</td>
          <td>${nodes[node.index].h.toFixed(1)}</td>
          <td><strong>${node.f.toFixed(1)}</strong></td>
        </tr>`;
    });
    tableHTML += `</tbody></table></div>`;
  } else {
    tableHTML += `<p><em>None</em></p>`;
  }

  const closedBadges = state.closedList
    .map(i => `<span class="state-badge"><span class="badge-label">✓</span>${nodes[i].name}</span>`)
    .join("");

  return `
    <div class="step-card">
      <h3>Iteration ${iteration + 1}</h3>
      ${stepsHTML}
      <h4>State at end of Iteration ${iteration + 1}</h4>
      ${tableHTML}
      <p style="margin-top:12px;font-weight:600;font-size:0.9rem;color:#005566;">Closed List:</p>
      <div class="state-summary">${closedBadges || '<em style="color:#999">Empty</em>'}</div>
    </div>`;
}

// =====================
// Populate Result Section
// =====================
function updateResultSection() {
  const finalState = astarStates[astarStates.length - 1];
  if (!finalState) return;

  const pathNames = finalState.finalPath
    ? finalState.finalPath.map(i => nodes[i].name).join(" → ")
    : "No path found";

  const totalCost = finalState.currentNode.g.toFixed(1);
  const startName = nodes[startNode].name;
  const endName   = nodes[endNode].name;
  const totalIter = astarStates.length;

  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = `
    <div class="title">Result</div>

    <div class="result-description">
      <p>The A* pathfinding algorithm will apply an appropriate heuristic-based search method to find the shortest path from the start node to the goal node. It will consider both the actual cost to reach a node (g) and the estimated cost to the goal (h), using the formula <strong>f = g + h</strong> to prioritize node exploration. The algorithm will return the path of nodes if a solution is found, or indicate failure (no path) if no path exists.</p>
    </div>

    <div class="result-cards">
      <div class="result-card">
        <h3>Start Node</h3>
        <p><strong>${startName}</strong></p>
      </div>
      <div class="result-card">
        <h3>Goal Node</h3>
        <p><strong>${endName}</strong></p>
      </div>
      <div class="result-card">
        <h3>Total Cost</h3>
        <p><strong>${totalCost}</strong></p>
      </div>
      <div class="result-card">
        <h3>Iterations</h3>
        <p><strong>${totalIter}</strong></p>
      </div>
    </div>

    <div class="result-cards">
      <div class="result-card">
        <h3>Key Points</h3>
        <p><strong>g</strong>: The actual cost from the start node to the current node.</p>
        <p><strong>h</strong>: The heuristic estimate from the current node to the goal.</p>
        <p><strong>f</strong>: The total estimated cost to reach the goal (sum of g and h).</p>
      </div>
    </div>

    <div class="result-output-box">
      <h3>Result:</h3>
      <p>The algorithm will return the shortest path from the start node to the goal node if one exists.</p>
      <p>If no path exists, it will return failure (typically represented as <strong>null</strong> or <strong>-1</strong>).</p>
      <p style="margin-top:14px;">
        Shortest path found: <strong>${pathNames}</strong> — total cost <strong>${totalCost}</strong>
      </p>
    </div>`;
}

function drawHighlight(index, color) {
  if (index === startNode || index === endNode) return;
  const n = nodes[index];
  ctx.beginPath();
  ctx.arc(n.x, n.y, 20, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawPathLine(pathIndices, color, lineWidth) {
  if (!pathIndices || pathIndices.length < 2) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  pathIndices.forEach((idx, i) => {
    const n = nodes[idx];
    i === 0 ? ctx.moveTo(n.x, n.y) : ctx.lineTo(n.x, n.y);
  });
  ctx.stroke();
}

function updateVisualization() {
  const state = astarStates[currentStateIndex];
  if (!state) return;

  algorithmStepsArea.innerHTML = generateAlgorithmSteps(currentStateIndex);
  drawGraph();

  state.openList.forEach(node => drawHighlight(node.index, "rgba(255, 255, 0, 0.5)"));
  state.closedList.forEach(index => drawHighlight(index, "rgba(255, 165, 0, 0.5)"));
  drawHighlight(state.currentNode.index, "rgba(144, 238, 144, 0.5)");
  drawPathLine(state.path, "blue", 4);
  if (state.finalPath) drawPathLine(state.finalPath, "red", 4);

  const cn = state.currentNode;
  practiceMessageArea.textContent = `Current Node: ${nodes[cn.index].name}, f=${cn.f.toFixed(2)}, g=${cn.g.toFixed(2)}, h=${nodes[cn.index].h.toFixed(2)}`;
}

nextStepBtn.addEventListener("click", () => {
  if (currentStateIndex < astarStates.length - 1) {
    currentStateIndex++;
    updateVisualization();
  }
});

prevStepBtn.addEventListener("click", () => {
  if (currentStateIndex > 0) {
    currentStateIndex--;
    updateVisualization();
  }
});

resetGraphBtn.addEventListener("click", () => {
  startNode = null;
  endNode = null;
  astarStates = [];
  currentStateIndex = 0;
  nodes.forEach(node => delete node.h);
  practiceMessageArea.textContent = "Select a start node.";
  algorithmStepsArea.innerHTML = "";

  // Restore static result section
  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = `
    <div class="title">Result</div>
    <div class="result-description">
      <p>The A* pathfinding algorithm will apply an appropriate heuristic-based search method to find the shortest path from the start node to the goal node. It will consider both the actual cost to reach a node (g) and the estimated cost to the goal (h), using the formula <strong>f = g + h</strong> to prioritize node exploration. The algorithm will return the path of nodes if a solution is found, or indicate failure (no path) if no path exists.</p>
    </div>
    <div class="result-cards">
      <div class="result-card">
        <h3>Key Points</h3>
        <p><strong>g</strong>: The actual cost from the start node to the current node.</p>
        <p><strong>h</strong>: The heuristic estimate from the current node to the goal.</p>
        <p><strong>f</strong>: The total estimated cost to reach the goal (sum of g and h).</p>
      </div>
    </div>
    <div class="result-output-box">
      <h3>Result:</h3>
      <p>The algorithm will return the shortest path from the start node to the goal node if one exists.</p>
      <p>If no path exists, it will return failure (typically represented as <strong>null</strong> or <strong>-1</strong>).</p>
    </div>`;

  drawGraph();
});

// Initial draw
drawGraph();
practiceMessageArea.textContent = "Select a start node.";
