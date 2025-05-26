// all variables here
let correctWord;
let correctWordId;
let IsAnswered = false;
let ansId;
let isDataLoaded;
let wordData = []
const buttons = [
    document.getElementById("0"),
    document.getElementById("1"),
    document.getElementById("2"),
    document.getElementById("3")
];

// getting elements by ID
const loadingDiv = document.getElementById("loading");
const gameDiv = document.getElementById("game");
const frontPage = document.getElementById("frontPage");


//showing front page as start
loadingDiv.style.display = "none";
gameDiv.style.display = "none";
frontPage.style.display = "block";
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//getting dictionary files
const startTime = performance.now();
fetch('https://raw.githubusercontent.com/towfikahmed0/wordvo/refs/heads/main/EBDictionary.json')
    .then(response => {
        if (!response.ok) throw new Error('Failed to load JSON');
        isDataLoaded = false;
        return response.json();
    })
    .then(data => {
        wordData = data;

        isDataLoaded = true;
        const endTime = performance.now();
        console.log(`Data loaded in ${Math.round(endTime - startTime)} ms`);
    })
    .catch(error => console.error('Error loading data:', error));
//main game func start here
function startGame() {

    // Show game, hide loading and front page
    // Check every 500ms
    loadingDiv.style.display = "flex";
    frontPage.style.display = 'none';
    gameDiv.style.display = "none";
    const intervalId = setInterval(() => {
        if (isDataLoaded) {
            frontPage.style.display = 'none'
            loadingDiv.style.display = "none";
            gameDiv.style.display = "flex";
            const startTime = performance.now();

            //setting an emty option array
            let options = [];

            //
            IsAnswered = false;

            //making next btn disable
            document.getElementById("next").disabled = true;

            //change the color of the user's ans
            if (ansId !== undefined) {
                buttons[ansId].className = 'btn btn-secondary option';
                buttons[correctWordId].className = 'btn btn-secondary option';
            }

            //get random wrd and make ques
            let randomIndex = Math.floor(Math.random() * wordData.length);
            document.getElementById("outputField").innerHTML = `What is the meaning of <b style="color: #2079da;">'${wordData[randomIndex].en}'</b>?`;

            //stor correct wrd
            correctWord = wordData[randomIndex].bn;

            //make options
            while (options.length < 3) {
                let idx = Math.floor(Math.random() * wordData.length);
                let word = wordData[idx].bn;
                if (word !== correctWord && !options.includes(word)) {
                    options.push(word);
                }
            }

            //insert ans into options
            correctWordId = Math.floor(Math.random() * 4);
            options.splice(correctWordId, 0, correctWord);

            //change every 
            for (let i = 0; i < 4; i++) {
                buttons[i].textContent = options[i];
                buttons[i].className = 'btn btn-secondary option';
            }

            const endTime = performance.now();
            console.log(`startGame() executed in ${Math.round(endTime - startTime)} ms`);
            clearInterval(intervalId);
        }
    }, 500);


}

//ans checking func start here
function checkAnswer(answer) {

    if (IsAnswered) return;

    IsAnswered = true;
    //getting user selected opt
    let selectedOption = buttons[answer].textContent;

    //matching crt wrd with slted opt
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
    //opening next btn
    document.getElementById("next").disabled = false;
}
