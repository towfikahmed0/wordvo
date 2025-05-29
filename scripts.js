// Variables
let correctWord;
let correctWordId;
let isAnswered = false;
let ansId;
let isDataLoaded = false;
let wordData = [];

const buttons = Array.from({ length: 4 }, (_, i) => document.getElementById(String(i)));

// DOM Elements
const loadingDiv = document.getElementById("loading");
const gameDiv = document.getElementById("game");
const frontPage = document.getElementById("frontPage");
const nextButton = document.getElementById("next");
const outputField = document.getElementById("outputField");

// Initial UI setup
loadingDiv.style.display = "none";
gameDiv.style.display = "none";
frontPage.style.display = "block";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Load dictionary
(async () => {
    try {
        const startTime = performance.now();
        const response = await fetch('https://raw.githubusercontent.com/towfikahmed0/wordvo/refs/heads/main/EBDictionary.json');
        if (!response.ok) throw new Error('Failed to load JSON');
        wordData = await response.json();
        isDataLoaded = true;
        const endTime = performance.now();
        console.log(`Data loaded in ${Math.round(endTime - startTime)} ms`);
    } catch (error) {
        console.error('Error loading data:', error);
    }
})();

// Wait until data is loaded
async function waitUntilLoaded() {
    while (!isDataLoaded) {
        await sleep(100);
    }
}

// Start the game
async function startGame() {
    loadingDiv.style.display = "flex";
    frontPage.style.display = 'none';
    gameDiv.style.display = "none";

    await waitUntilLoaded();

    loadingDiv.style.display = "none";
    gameDiv.style.display = "flex";

    const startTime = performance.now();

    isAnswered = false;
    nextButton.disabled = true;

    if (typeof ansId === "number") {
        buttons[ansId].className = 'btn btn-secondary option';
        buttons[correctWordId].className = 'btn btn-secondary option';
    }

    const randomIndex = Math.floor(Math.random() * wordData.length);
    const question = wordData[randomIndex];
    correctWord = question.bn;

    outputField.innerHTML = `What is the meaning of <b style="color: #2079da;">'${question.en}'</b>?`;

    const options = new Set();
    while (options.size < 3) {
        const word = wordData[Math.floor(Math.random() * wordData.length)].bn;
        if (word !== correctWord) options.add(word);
    }

    const optionArray = Array.from(options);
    correctWordId = Math.floor(Math.random() * 4);
    optionArray.splice(correctWordId, 0, correctWord);

    for (let i = 0; i < 4; i++) {
        buttons[i].textContent = optionArray[i];
        buttons[i].className = 'btn btn-secondary option';
    }

    const endTime = performance.now();
    console.log(`startGame() executed in ${Math.round(endTime - startTime)} ms`);
}

// Check user's answer
function checkAnswer(answer) {
    if (isAnswered) return;

    isAnswered = true;
    const selectedOption = buttons[answer].textContent;

    if (selectedOption === correctWord) {
        buttons[answer].className = "btn btn-success option";
        buttons[answer].innerHTML += " &#10004;";
    } else {
        buttons[answer].className = "btn btn-danger option";
        buttons[answer].innerHTML += " &#x2718;";
        buttons[correctWordId].className = "btn btn-success option";
        buttons[correctWordId].innerHTML += " &#10004;";
    }

    ansId = answer;
    nextButton.disabled = false;
}
