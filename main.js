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
/* TODO: 
Dynamically update the multiBar with each black tile clicked.
Constantly reduce the multiBar by 1 at a set rate. (E.g., 1 every 0.5s)
Calculate score based on the current multiCount value, for a given interval.
..
*/

let multiCount = 0; //grow this for each black tile clicked. Decrement it constantly.

const calculateBonus = (multiCount) => {
    if (0 <= multiCount <= 5) {
        return 1;
    }
    if (6 <= multiCount <= 10) {
        return 2;
    }
    if (11 <= multiCount <= 15) {
        return 3;
    }
    if (16 <= multiCount <= 20) {
        return 4;
    }
    if (21 <= multiCount) {
        return 5;
    }
};


// initialize three random squares to be black
const cellsArray = Array.from(document.querySelectorAll(".grid span"));
flipRandomToBlack(3);

// When a cell is clicked
// Logic: if clicked tile is black -> score++, find white tile in array -> change it to black
// -> change clicked tile to white (destination color)

let score = 0;
let countdown;
const scoreEl = document.querySelector("#score");
const timeEl = document.querySelector("#time");

cellsArray.forEach(el => el.addEventListener('mousedown', () => {
    if (!countdown) startTimer();
    // el.state = el.state;
    if (el.state == "black") {
        multiCount++;
        score = score + calculateBonus(multiCount); // score equals prevScore + 1*multiplier.
        // score++;
        scoreEl.textContent = score;
        flipRandomToBlack(1);
        el.state = "white";
        el.style.backgroundColor = "white";
    }
    else {
        // alert("You Lose!");
        lose("You Lose!");
        // score = 0;
        // scoreEl.textContent = score;
    }
}));

// start timer
const startTimer = (duration = 30) => {
    if (countdown) clearInterval(countdown);

    countdown = setInterval(() => {
        duration--;

        const minutes = parseInt(duration / 60, 10).toString().padStart(2, "0");
        const seconds = parseInt(duration % 60, 10).toString().padStart(2, "0");

        timeEl.textContent = minutes + ":" + seconds;

        if (duration === 0) lose("Times up!");
    }, 1000);
}

// you LOSE
const lose = (message) =>
    setTimeout(() => {
        alert(message);

        multiCount = 0;
        score = 0;
        scoreEl.textContent = score;

        clearInterval(countdown);
        countdown = undefined;
        timeEl.textContent = "00:30";
    }, 0);




// Random notes
// 1) Renaming flipRandomToBlack to something like changeColor, and make it accept an actual element instead of an index (so you'd pass  cellsArray[element]).
// 2) Implement an actual flipRandomToBlack, which is basically lines 60-63. You can then just call it three times.
// 3) Your event listener can then call changeColor(element, "white") and then flipRandomToBlack() (or in reverse order if you want to ensure the cell moves).
// potential time functions to use: setTimeout, setInterval, requestAnimationFrame
// https://stackoverflow.com/questions/20618355/how-to-write-a-countdown-timer-in-javascript