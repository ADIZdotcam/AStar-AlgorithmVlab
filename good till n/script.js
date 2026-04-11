// =====================
// DOM Ready
// =====================
document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");
  const backToTopBtn = document.getElementById("backToTop");
  const navWrapper = document.getElementById("navWrapper");
  const trigger = document.querySelector(".sticky-trigger");

  window.addEventListener("scroll", function () {
    header.classList.toggle("scrolled", window.scrollY > 10);
    backToTopBtn.style.display = window.scrollY > 100 ? "flex" : "none";
  });

  backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => navWrapper.classList.toggle("sticky-nav-wrapper", !e.isIntersecting)),
    { rootMargin: "-60px 0px 0px 0px", threshold: 0 }
  );
  observer.observe(trigger);

  document.getElementById("start-quiz-btn").addEventListener("click", () => {
    document.getElementById("quiz-instructions").style.display = "none";
    document.getElementById("quiz-content").style.display = "flex";
    showQuestion();
  });

  // Highlight active nav link
  const navLinks = document.querySelectorAll(".navigation .link");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navLinks.forEach(l => l.classList.remove("active-link"));
      link.classList.add("active-link");
    });
  });
  document.querySelector('.navigation .link[title="Aim"]').classList.add("active-link");
});

// =====================
// Navigation / Content Switching
// =====================
const TOPIC_IDS = ["aim", "theory", "procedure", "practice", "code", "result", "quiz", "references", "tnt"];
const topicElements = Object.fromEntries(TOPIC_IDS.map(id => [id, document.getElementById(id)]));
let currentTopic = "aim";

function switchContent(topic) {
  if (topic === currentTopic) return;
  topicElements[currentTopic].style.display = "none";
  topicElements[topic].style.display = topic === "quiz" ? "flex" : "block";
  currentTopic = topic;
}

function toggleMenu() {
  document.querySelector(".nav-menu").classList.toggle("show");
}

// =====================
// Copy Code (Python only)
// =====================
document.querySelectorAll(".copy-button").forEach(button => {
  button.addEventListener("click", () => {
    const blockId = button.closest(".code-block").id;
    const codeBlock = document.getElementById(blockId);
    if (!codeBlock) return;
    navigator.clipboard.writeText(codeBlock.querySelector("code").innerText).then(() => {
      button.textContent = "Copied!";
      button.classList.add("copied");
      setTimeout(() => { button.textContent = "Copy"; button.classList.remove("copied"); }, 2000);
    });
  });
});

// =====================
// Quiz Logic
// =====================
const questions = [
  { question: "What is the primary purpose of the A* algorithm?",
    choices: ["A. Finding the shortest path in a weighted graph","B. Sorting elements in an array","C. Compressing data for storage","D. Encrypting messages"], answer: 0 },
  { question: "Which two functions does A* use to determine the best path?",
    choices: ["A. Depth function (D) and Cost function (C)","B. Heuristic function (h) and Cost function (g)","C. Distance function (d) and Weight function (w)","D. Priority function (p) and Search function (s)"], answer: 1 },
  { question: "What property makes A* optimal and complete?",
    choices: ["A. Using a heuristic that never overestimates the cost","B. Expanding all possible nodes before selecting the best path","C. Ignoring the heuristic function for faster execution","D. Only exploring direct neighbors of a node"], answer: 0 },
  { question: "Which data structure is commonly used to efficiently store nodes in A* search?",
    choices: ["A. Queue","B. Stack","C. Priority Queue","D. Linked List"], answer: 2 },
  { question: "In A*, what does the formula f(n) = g(n) + h(n) calculate?",
    choices: ["A. The exact cost from the start node to node n.","B. The total estimated cost of the cheapest path from start to goal via node n.","C. The straight-line distance from node n to the goal.","D. The cost from the start node to the parent of node n."], answer: 1 },
  { question: "What does the 'g(n)' value represent for a given node n?",
    choices: ["A. The estimated cost from node n to the goal.","B. The lowest cost of the path found so far from the start node to node n.","C. The number of neighbors node n has.","D. The total estimated cost of the path through n."], answer: 1 },
  { question: "How does A* differ from Dijkstra's algorithm?",
    choices: ["A. Dijkstra's is only for unweighted graphs.","B. A* uses a heuristic (h) to guide its search, while Dijkstra does not.","C. A* is faster but does not guarantee the shortest path.","D. Dijkstra's algorithm is not used for pathfinding."], answer: 1 },
  { question: "What is the purpose of the 'Open Set' (or Open List) in A*?",
    choices: ["A. To store all nodes that have been visited and fully explored.","B. To store the final path once the goal is reached.","C. To store nodes that have been discovered but not yet fully explored.","D. To store all nodes that cannot be reached."], answer: 2 },
  { question: "If you modify A* to only consider the heuristic value (i.e., f(n) = h(n)), it becomes which algorithm?",
    choices: ["A. Breadth-First Search","B. Depth-First Search","C. Dijkstra's Algorithm","D. Greedy Best-First Search"], answer: 3 },
  { question: "What is the primary reason for using a 'Closed Set' (or Closed List) in A*?",
    choices: ["A. To prevent the algorithm from getting stuck in loops by not re-processing nodes.","B. To store nodes that have a very high heuristic value.","C. To act as a backup for the Open Set.","D. To store only the starting and goal nodes."], answer: 0 }
];

let currentQuestionIndex = 0, score = 0;
const userAnswers = [];
const questionElement = document.getElementById("question");
const choicesContainer = document.getElementById("choices");
const nextButton = document.getElementById("next-btn");
const retakeButton = document.querySelector("#quiz-content #retake-btn");

function showQuestion() {
  const q = questions[currentQuestionIndex];
  questionElement.textContent = q.question;
  choicesContainer.innerHTML = "";
  q.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.textContent = choice; btn.classList.add("choice");
    btn.addEventListener("click", () => selectAnswer(i));
    choicesContainer.appendChild(btn);
  });
  nextButton.style.display = "none";
  if (retakeButton) retakeButton.style.display = "none";
}

function selectAnswer(selectedIndex) {
  const correct = questions[currentQuestionIndex].answer;
  document.querySelectorAll(".choice").forEach((btn, i) => {
    btn.disabled = true;
    btn.style.backgroundColor = i === correct ? "green" : "red";
    btn.style.color = "white";
  });
  userAnswers[currentQuestionIndex] = selectedIndex;
  if (selectedIndex === correct) score++;
  nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) showQuestion(); else showResults();
});

function showResults() {
  questionElement.textContent = `Quiz Completed! Your Score: ${score} / ${questions.length}`;
  choicesContainer.innerHTML = "";
  nextButton.style.display = "none";
  if (retakeButton) retakeButton.style.display = "block";
}

if (retakeButton) {
  retakeButton.addEventListener("click", () => {
    currentQuestionIndex = 0; score = 0; userAnswers.length = 0; showQuestion();
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
  { x: 50,  y: 50,  name: "A" }, { x: 100, y: 170, name: "B" },
  { x: 220, y: 90,  name: "C" }, { x: 60,  y: 350, name: "D" },
  { x: 400, y: 250, name: "E" }, { x: 420, y: 100, name: "F" },
  { x: 550, y: 300, name: "G" }, { x: 530, y: 40,  name: "H" },
  { x: 380, y: 390, name: "I" }, { x: 565, y: 450, name: "J" },
  { x: 230, y: 350, name: "K" }, { x: 250, y: 470, name: "L" },
  { x: 40,  y: 450, name: "M" }, { x: 135, y: 565, name: "N" },
  { x: 400, y: 550, name: "O" },
];

const edges = [
  { start: 0, end: 1, cost: 13 }, { start: 0, end: 2, cost: 17 },
  { start: 1, end: 3, cost: 18 }, { start: 1, end: 10, cost: 22 },
  { start: 1, end: 2, cost: 14 }, { start: 1, end: 4, cost: 31 },
  { start: 2, end: 4, cost: 24 }, { start: 2, end: 5, cost: 20 },
  { start: 3, end: 10, cost: 17 }, { start: 3, end: 12, cost: 10 },
  { start: 4, end: 10, cost: 19 }, { start: 4, end: 5, cost: 15 },
  { start: 4, end: 6, cost: 15 }, { start: 4, end: 8, cost: 14 },
  { start: 5, end: 7, cost: 12 }, { start: 6, end: 5, cost: 23 },
  { start: 6, end: 9, cost: 15 }, { start: 7, end: 6, cost: 26 },
  { start: 8, end: 6, cost: 19 }, { start: 8, end: 10, cost: 15 },
  { start: 8, end: 11, cost: 15 }, { start: 8, end: 14, cost: 16 },
  { start: 9, end: 8, cost: 19 }, { start: 9, end: 14, cost: 19 },
  { start: 10, end: 11, cost: 12 }, { start: 11, end: 13, cost: 14 },
  { start: 11, end: 14, cost: 17 }, { start: 12, end: 13, cost: 14 },
  { start: 13, end: 14, cost: 26 },
];

let startNode = null, endNode = null, astarStates = [], currentStateIndex = 0;

function getEdgeCost(a, b) {
  const e = edges.find(e => (e.start===a&&e.end===b)||(e.start===b&&e.end===a));
  return e ? e.cost : Infinity;
}

function drawGraph() {
  ctx.clearRect(0, 0, practiceCanvas.width, practiceCanvas.height);
  edges.forEach(edge => {
    const s = nodes[edge.start], e = nodes[edge.end];
    ctx.beginPath(); ctx.strokeStyle = "#b0c4ce"; ctx.lineWidth = 2;
    ctx.moveTo(s.x, s.y); ctx.lineTo(e.x, e.y); ctx.stroke();
    ctx.fillStyle = "#666"; ctx.font = "bold 11px Arial";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(edge.cost, (s.x+e.x)/2, (s.y+e.y)/2 - 8);
  });
  nodes.forEach((node, idx) => {
    ctx.beginPath(); ctx.arc(node.x, node.y, 20, 0, 2*Math.PI);
    ctx.fillStyle = idx===startNode ? "#22c55e" : idx===endNode ? "#ef4444" : "#f0f9ff";
    ctx.fill();
    ctx.strokeStyle = idx===startNode ? "#15803d" : idx===endNode ? "#b91c1c" : "#003441";
    ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = (idx===startNode||idx===endNode) ? "#fff" : "#003441";
    ctx.font = "bold 13px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(node.name, node.x, node.y);
    if (typeof node.h === "number") {
      ctx.fillStyle = "#888"; ctx.font = "9px Arial";
      ctx.fillText(`h=${node.h}`, node.x, node.y+13);
    }
  });
}

// KEY FIX: scale mouse coords to canvas internal resolution
function getClickedNode(event) {
  const rect = practiceCanvas.getBoundingClientRect();
  const scaleX = practiceCanvas.width  / rect.width;
  const scaleY = practiceCanvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top)  * scaleY;
  return nodes.findIndex(n => Math.hypot(x - n.x, y - n.y) < 22);
}

practiceCanvas.addEventListener("click", (event) => {
  if (startNode !== null && endNode !== null) return;
  const clicked = getClickedNode(event);
  if (clicked === -1) return;
  if (startNode === null) {
    startNode = clicked;
    practiceMessageArea.textContent = `Start: ${nodes[startNode].name} selected. Now select an end node.`;
  } else if (endNode === null) {
    if (clicked === startNode) {
      practiceMessageArea.textContent = "End node cannot be the same as start. Pick a different node.";
    } else {
      endNode = clicked;
      runAStar();
    }
  }
  drawGraph();
});

function calculateHeuristics(goalIdx) {
  const g = nodes[goalIdx];
  nodes.forEach((n, i) => {
    const dx = n.x-g.x, dy = n.y-g.y;
    nodes[i].h = Math.round(Math.sqrt(Math.sqrt(dx*dx+dy*dy))/2);
  });
}

function reconstructPath(node) {
  const p = []; let c = node;
  while (c) { p.unshift(c.index); c = c.parent; }
  return p;
}

function getPathString(node) {
  const p = []; let c = node;
  while (c) { p.unshift(nodes[c.index].name); c = c.parent; }
  return p.join(" → ");
}

function runAStar() {
  if (startNode===null||endNode===null) return;
  calculateHeuristics(endNode);
  let openList = [{ index: startNode, g: 0, f: nodes[startNode].h, parent: null }];
  let closedList = [];
  astarStates = []; currentStateIndex = 0;

  while (openList.length > 0) {
    openList.sort((a,b) => a.f-b.f);
    const cur = openList.shift();
    closedList.push(cur.index);
    astarStates.push({
      openList: openList.map(n=>({...n})),
      closedList: [...closedList],
      currentNode: cur,
      path: reconstructPath(cur)
    });
    if (cur.index === endNode) {
      astarStates[astarStates.length-1].finalPath = reconstructPath(cur);
      practiceMessageArea.textContent = `✔ Goal reached! Path: ${getPathString(cur)}`;
      updateVisualization();
      updateResultSection();
      return;
    }
    edges
      .filter(e => e.start===cur.index||e.end===cur.index)
      .forEach(e => {
        const ni = e.start===cur.index ? e.end : e.start;
        if (closedList.includes(ni)) return;
        const g = cur.g + e.cost, h = nodes[ni].h, f = g+h;
        const ex = openList.find(n=>n.index===ni);
        if (!ex) openList.push({index:ni,g,f,parent:cur});
        else if (g<ex.g) { ex.g=g; ex.f=f; ex.parent=cur; }
      });
  }
  practiceMessageArea.textContent = "No path found between the selected nodes.";
  updateVisualization();
}

// =====================
// Drawing Helpers
// =====================
function drawHighlight(index, fill, stroke) {
  if (index===startNode||index===endNode) return;
  const n = nodes[index];
  ctx.beginPath(); ctx.arc(n.x,n.y,20,0,2*Math.PI);
  ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.strokeStyle=stroke; ctx.lineWidth=2; ctx.stroke(); }
}

function drawPathLine(pathIndices, color, lw) {
  if (!pathIndices||pathIndices.length<2) return;
  ctx.save(); ctx.strokeStyle=color; ctx.lineWidth=lw;
  ctx.lineJoin="round"; ctx.lineCap="round";
  ctx.beginPath();
  pathIndices.forEach((idx,i)=>{ const n=nodes[idx]; i===0?ctx.moveTo(n.x,n.y):ctx.lineTo(n.x,n.y); });
  ctx.stroke(); ctx.restore();
}

function drawFinalPath(pathIndices) {
  if (!pathIndices||pathIndices.length<2) return;
  // Glow
  ctx.save();
  ctx.strokeStyle="rgba(239,68,68,0.2)"; ctx.lineWidth=12;
  ctx.lineJoin="round"; ctx.lineCap="round";
  ctx.beginPath();
  pathIndices.forEach((idx,i)=>{ const n=nodes[idx]; i===0?ctx.moveTo(n.x,n.y):ctx.lineTo(n.x,n.y); });
  ctx.stroke();
  // Line
  ctx.strokeStyle="#ef4444"; ctx.lineWidth=4;
  ctx.beginPath();
  pathIndices.forEach((idx,i)=>{ const n=nodes[idx]; i===0?ctx.moveTo(n.x,n.y):ctx.lineTo(n.x,n.y); });
  ctx.stroke();
  ctx.restore();
  // Amber highlighted path nodes
  pathIndices.forEach((idx, i) => {
    if (idx===startNode||idx===endNode) return;
    const n = nodes[idx];
    ctx.save();
    ctx.beginPath(); ctx.arc(n.x,n.y,20,0,2*Math.PI);
    ctx.fillStyle="#fde68a"; ctx.fill();
    ctx.strokeStyle="#ef4444"; ctx.lineWidth=2.5; ctx.stroke();
    ctx.fillStyle="#7c2d12"; ctx.font="bold 13px Arial";
    ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText(nodes[idx].name, n.x, n.y);
    // Step badge
    ctx.beginPath(); ctx.arc(n.x+14, n.y-14, 9, 0, 2*Math.PI);
    ctx.fillStyle="#ef4444"; ctx.fill();
    ctx.fillStyle="#fff"; ctx.font="bold 8px Arial";
    ctx.fillText(i+1, n.x+14, n.y-14);
    ctx.restore();
  });
}

function updateVisualization() {
  const state = astarStates[currentStateIndex];
  if (!state) return;
  algorithmStepsArea.innerHTML = generateAlgorithmSteps(currentStateIndex);
  drawGraph();
  state.openList.forEach(n => drawHighlight(n.index,"rgba(253,224,71,0.6)","#ca8a04"));
  state.closedList.forEach(i => drawHighlight(i,"rgba(251,146,60,0.55)","#ea580c"));
  drawHighlight(state.currentNode.index,"rgba(134,239,172,0.7)","#16a34a");
  drawPathLine(state.path,"rgba(59,130,246,0.6)",3);
  if (state.finalPath) drawFinalPath(state.finalPath);
  // Re-draw labels on top
  nodes.forEach((node,idx) => {
    if (state.finalPath&&state.finalPath.includes(idx)&&idx!==startNode&&idx!==endNode) return;
    ctx.fillStyle=(idx===startNode||idx===endNode)?"#fff":"#003441";
    ctx.font="bold 13px Arial"; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText(node.name, node.x, node.y);
  });
  const cn = state.currentNode;
  if (!state.finalPath) {
    practiceMessageArea.textContent = `Node: ${nodes[cn.index].name}  |  f = ${cn.f.toFixed(2)}  |  g = ${cn.g.toFixed(2)}  |  h = ${nodes[cn.index].h.toFixed(2)}`;
  }
}

// =====================
// Step Card HTML
// =====================
function generateAlgorithmSteps(iteration) {
  const state = astarStates[iteration];
  const info = state.currentNode;
  const name = nodes[info.index].name;
  const isGoal = info.index === endNode;

  let stepsHTML = `<ol>
    <li>Pick node with lowest <i>f-cost</i> from Open List: <strong>${name}</strong> (f = ${info.f.toFixed(1)})</li>
    <li>Move <strong>${name}</strong> → Closed List.</li>
    <li>Is <strong>${name}</strong> the goal? ${isGoal
      ? `<strong class="goal-yes">✔ YES — Path found!</strong>`
      : `<strong>NO</strong> — evaluate neighbors.`}</li>
  </ol>`;

  if (!isGoal) {
    const neighbors = edges
      .filter(e=>e.start===info.index||e.end===info.index)
      .map(e=>({index:e.start===info.index?e.end:e.start, cost:e.cost}));
    if (neighbors.length) {
      stepsHTML += `<ul class="neighbor-list">`;
      neighbors.forEach(nb => {
        const nbName = nodes[nb.index].name;
        if (state.closedList.includes(nb.index)&&iteration>0) {
          stepsHTML += `<li class="skipped">Neighbor <strong>${nbName}</strong>: in Closed List — skipped.</li>`;
        } else {
          const g=info.g+nb.cost, h=nodes[nb.index].h, f=g+h;
          stepsHTML += `<li>Neighbor <strong>${nbName}</strong>:
            <ul class="cost-breakdown">
              <li><span class="cost-label g">g</span> = ${info.g.toFixed(1)} + ${nb.cost} = <strong>${g.toFixed(1)}</strong></li>
              <li><span class="cost-label h">h</span> = <strong>${h.toFixed(1)}</strong></li>
              <li><span class="cost-label f">f</span> = ${g.toFixed(1)} + ${h.toFixed(1)} = <strong>${f.toFixed(1)}</strong></li>
            </ul></li>`;
        }
      });
      stepsHTML += `</ul>`;
    }
  }

  let pathBanner = "";
  if (isGoal && state.finalPath) {
    const pathStr = state.finalPath.map(i=>nodes[i].name).join(" → ");
    pathBanner = `<div class="final-path-banner">
      <span class="path-label">🏁 Shortest Path</span>
      <span class="path-nodes">${pathStr}</span>
      <span class="path-cost">Total cost: <strong>${info.g.toFixed(1)}</strong></span>
    </div>`;
  }

  let tableHTML = `<p class="list-heading"><strong>Open List</strong></p>`;
  if (state.openList.length>0) {
    const sorted=[...state.openList].sort((a,b)=>a.f-b.f);
    tableHTML += `<div class="step-table-wrap"><table class="styled-table">
      <thead><tr><th>Node</th><th>Path</th><th>g(n)</th><th>h(n)</th><th>f(n)</th></tr></thead><tbody>`;
    sorted.forEach(n=>{
      tableHTML+=`<tr>
        <td><strong>${nodes[n.index].name}</strong></td>
        <td>${getPathString(n)}</td>
        <td>${n.g.toFixed(1)}</td>
        <td>${nodes[n.index].h.toFixed(1)}</td>
        <td><strong>${n.f.toFixed(1)}</strong></td></tr>`;
    });
    tableHTML+=`</tbody></table></div>`;
  } else { tableHTML+=`<p class="empty-list">Empty</p>`; }

  const badges = state.closedList
    .map(i=>`<span class="state-badge"><span class="badge-label">✓</span>${nodes[i].name}</span>`).join("");

  return `<div class="step-card">
    <h3>Iteration ${iteration+1}</h3>
    ${stepsHTML}
    ${pathBanner}
    <h4>State after Iteration ${iteration+1}</h4>
    ${tableHTML}
    <p class="closed-heading">Closed List:</p>
    <div class="state-summary">${badges||'<em class="empty-list">Empty</em>'}</div>
  </div>`;
}

// =====================
// Result Section
// =====================
function updateResultSection() {
  const fs = astarStates[astarStates.length-1];
  if (!fs||!fs.finalPath) return;
  const pathNames = fs.finalPath.map(i=>nodes[i].name).join(" → ");
  const cost = fs.currentNode.g.toFixed(1);
  const sName = nodes[startNode].name, eName = nodes[endNode].name;
  const iters = astarStates.length;
  document.getElementById("result").innerHTML = `
    <div class="title">Result</div>
    <div class="result-description">
      <p>The A* pathfinding algorithm will apply an appropriate heuristic-based search method to find the shortest path from the start node to the goal node. It will consider both the actual cost to reach a node (g) and the estimated cost to the goal (h), using the formula <strong>f = g + h</strong> to prioritize node exploration. The algorithm will return the path of nodes if a solution is found, or indicate failure (no path) if no path exists.</p>
    </div>
    <div class="result-path-visual">
      ${fs.finalPath.map((idx,i)=>`
        <span class="path-node-pill ${idx===startNode?'start':idx===endNode?'end':''}">${nodes[idx].name}</span>
        ${i<fs.finalPath.length-1?'<span class="path-arrow">→</span>':''}
      `).join("")}
    </div>
    <div class="result-cards">
      <div class="result-card"><h3>Start Node</h3><p class="result-value">${sName}</p></div>
      <div class="result-card"><h3>Goal Node</h3><p class="result-value">${eName}</p></div>
      <div class="result-card"><h3>Total Cost</h3><p class="result-value">${cost}</p></div>
      <div class="result-card"><h3>Iterations</h3><p class="result-value">${iters}</p></div>
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
      <p class="result-final-line">Shortest path: <strong>${pathNames}</strong> — cost <strong>${cost}</strong></p>
    </div>`;
}

const STATIC_RESULT = `
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

nextStepBtn.addEventListener("click", () => { if (currentStateIndex<astarStates.length-1){currentStateIndex++;updateVisualization();} });
prevStepBtn.addEventListener("click", () => { if (currentStateIndex>0){currentStateIndex--;updateVisualization();} });
resetGraphBtn.addEventListener("click", () => {
  startNode=null; endNode=null; astarStates=[]; currentStateIndex=0;
  nodes.forEach(n=>delete n.h);
  practiceMessageArea.textContent="Select a start node.";
  algorithmStepsArea.innerHTML="";
  document.getElementById("result").innerHTML=STATIC_RESULT;
  drawGraph();
});

drawGraph();
practiceMessageArea.textContent = "Select a start node.";
