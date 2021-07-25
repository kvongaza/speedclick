// Speed Click

// Change cell to color
const flipToColor = (element, color) => {

    if (cellsArray[element].state !== color) {
        cellsArray[element].state = color;
        cellsArray[element].style.backgroundColor = color;
        return true;
    }
    return false;
}

// Loop until white tile found
const flipRandomToBlack = (count) => {
    while (count > 0) {

        const r = Math.floor(Math.random() * cellsArray.length);
    
        if (flipToColor(r, "black")) {
            count--;
        }
    }
    return true;
}

// Score Multiplier
let multiCount = 0; //grow this for each black tile clicked. Decrement it constantly.
const multiBarEl = document.querySelector("#multiBar");

const calculateBonus = () => {
    if (multiCount < 5) {
        return 1;
    }
    if (multiCount < 10) {
        return 2;
    }
    if (multiCount < 15) {
        return 3;
    }
    if (multiCount < 20) {
        return 4;
    }
    return 5;
};

const calculateCPS = (timeElapsed) => {
    return clicks / timeElapsed;
};

// initialize three random squares to be black
const cellsArray = Array.from(document.querySelectorAll(".grid span"));
flipRandomToBlack(3);

let score = 0;
let clicks = 0;
let cps = 0;
let elapsed = 0;
let countdown;

const scoreEl = document.querySelector("#score");
const timeEl = document.querySelector("#time");
const cpsEl = document.querySelector("#cps");

// When a cell is clicked
cellsArray.forEach(el => el.addEventListener('mousedown', () => {
    if (!countdown) startTimer();

    if (el.state == "black") {
        multiCount = Math.min(multiCount + 2.5, 25);
        multiBarEl.style.width = `${multiCount/25*100}%`;

        score += calculateBonus(); // score equals prevScore + 1*multiplier.
        scoreEl.textContent = score;

        clicks += 1; // track total clicks
        
        flipRandomToBlack(1);
        el.state = "white";
        el.style.backgroundColor = "white";
    } else lose("You Lose!");
}));

// TODO: requestAnimationFrame instead of setInterval. 
// (Run at framerate to do the updates smoothly)

// start timer
const startTimer = (originalDuration = 30) => {
    let duration = originalDuration;
    if (countdown) clearInterval(countdown);

    countdown = setInterval(() => {
        duration = Math.max(duration - 0.05, 0);
        elapsed = originalDuration - duration;
        multiCount = Math.max(multiCount - .5, 0);
        multiBarEl.style.width = `${multiCount/25*100}%`;

        const minutes = Math.floor(duration / 60).toString().padStart(2, "0");
        const seconds = Math.floor(duration % 60).toString().padStart(2, "0");
        const centis = (duration % 1).toFixed(2).slice(2).padEnd(2, "0");

        timeEl.textContent = minutes + ":" + seconds + "." + centis;
        
        // real time cps
        cps = calculateCPS(elapsed);
        cpsEl.textContent = cps.toFixed(2);

        if (duration <= 0) lose("Times up!");
    }, 50);
};

const prevScoreEl = document.querySelector("#prev-score");
const prevCpsEl = document.querySelector("#prev-cps");
const hiScoreEl = document.querySelector(".hi-score .value");
const hiScoreTimeEl = document.querySelector(".hi-score .time-elapsed");
const hiCpsEl = document.querySelector(".hi-cps .value");
const hiCpsTimeEl = document.querySelector(".hi-cps .time-elapsed");

// you LOSE
const lose = (message) =>
    setTimeout(() => {
        alert(message);

        multiCount = 0;
        multiBarEl.style.width = `0%`;

        prevScoreEl.textContent = score;
        if (parseInt(hiScoreEl.textContent) < score) {
            hiScoreEl.textContent = score;
            hiScoreTimeEl.textContent = elapsed.toFixed(2);
        }

        score = 0;
        scoreEl.textContent = score;

        prevCpsEl.textContent = cps.toFixed(2);
        if (parseFloat(hiCpsEl.textContent) < cps) {
            hiCpsEl.textContent = prevCpsEl.textContent;
            hiCpsTimeEl.textContent = elapsed.toFixed(2);
        }

        clicks = 0;
        cpsEl.textContent = "0.00";

        clearInterval(countdown);
        countdown = undefined;
        timeEl.textContent = "00:30.00";
    }, 0);

/* TODO:
-Add visual for score quantity on screen post click (flash tile green, text in red (score))
-localStorage.setItem("a", "b");
-localStorage.getItem("a") => "b"
*/ 