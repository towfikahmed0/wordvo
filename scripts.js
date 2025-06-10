// Variables
let correctWord;
let correctWordId;
let isAnswered = false;
let ansId;
let isDataLoaded = false;
let wordData = [];
let question;
let score = 0;

// Buttons
const buttons = Array.from({ length: 4 }, (_, i) => document.getElementById(String(i)));

// DOM Elements
const loadingDiv = document.getElementById("loading");
const gameDiv = document.getElementById("game");
const frontPage = document.getElementById("frontPage");
const nextButton = document.getElementById("nextbtn");
const skipButton = document.getElementById("skipbtn");
const seemoreButton = document.getElementById("seemorebtn");
const outputField = document.getElementById("outputField");
const learnmorediv = document.getElementById("learnmorediv");
const synonymsField = document.getElementById("wordsynonyms");
const antonymsField = document.getElementById("wordantonyms");
const sourceUrlField = document.getElementById("wordsourceurl");
const scoreField = document.getElementById("score");

// Initial UI setup
loadingDiv.style.display = "none";
gameDiv.style.display = "none";
frontPage.style.display = "block";
if (scoreField) scoreField.textContent = `Score: ${score}`;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Load dictionary
(async () => {
    try {
        const startTime = performance.now();
        const response = await fetch('https://raw.githubusercontent.com/towfikahmed0/wordvo/refs/heads/v0.2/EBDictionary.json');
        if (!response.ok) throw new Error('Failed to load JSON');
        wordData = await response.json();
        isDataLoaded = true;
        console.log(`Data loaded in ${Math.round(performance.now() - startTime)} ms`);
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

    isAnswered = false;
    nextButton.style.display = "none";
    skipButton.style.display = "block";
    seemoreButton.style.display = "none";

    if (typeof ansId === "number") {
        buttons[ansId].className = 'btn btn-secondary option';
        buttons[correctWordId].className = 'btn btn-secondary option';
    }

    const randomIndex = Math.floor(Math.random() * wordData.length);
    question = wordData[randomIndex];
    correctWord = question.bn;

    outputField.innerHTML = `What is the meaning of <b style="color: #4a90e2; cursor: pointer;" onclick="playAudio()">'${question.en}' 🔊</b><audio id="myAudio"></audio>?`;
    if (question.audio) document.getElementById("myAudio").src = question.audio;

    const options = new Set();
    while (options.size < 3) {
        const word = wordData[Math.floor(Math.random() * wordData.length)].bn;
        if (word !== correctWord) options.add(word);
    }

    const optionArray = Array.from(options);
    correctWordId = Math.floor(Math.random() * 4);
    optionArray.splice(correctWordId, 0, correctWord);

    buttons.forEach((btn, i) => {
        btn.textContent = optionArray[i];
        btn.className = 'btn btn-secondary option';
    });
    playAudio()
}

function checkAnswer(answer) {
    if (isAnswered) return;

    ansId = answer;
    isAnswered = true;

    nextButton.style.display = "block";
    skipButton.style.display = "none";
    seemoreButton.style.display = "block";

    document.getElementById("wordname").textContent = question.en;
    document.getElementById("worddefinition").textContent = question.definition;
    document.getElementById("wordpronunciation").textContent = question.phonetic;

    antonymsField.textContent = question.ant.length > 0 ? question.ant : "No antonyms found";
    synonymsField.textContent = question.syn.length > 0 ? question.syn : "No synonyms found";

    const isCorrect = buttons[answer].textContent === correctWord;
    buttons[answer].className = isCorrect ? "btn btn-success option" : "btn btn-danger option";
    buttons[answer].innerHTML += isCorrect ? " &#10004;" : " &#x2718;";
    if (!isCorrect) {
        buttons[correctWordId].className = "btn btn-success option";
        buttons[correctWordId].innerHTML += " &#10004;";
    } else {
        score++;
        if (scoreField) scoreField.textContent = `Score: ${score}`;
    }
}

function showmore(btnid) {
    const showLearnMore = btnid !== "backbtn";
    learnmorediv.style.display = showLearnMore ? "block" : "none";
    gameDiv.style.display = showLearnMore ? "none" : "flex";
}

function playAudio() {
    const audio = document.getElementById("myAudio");
    if (audio?.src) {
        audio.play();
    } else {
        alert("Pronunciation is still loading or unavailable.");
    }
}
