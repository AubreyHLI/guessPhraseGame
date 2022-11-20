const phrases = [
    'Peter Piper picked a peck of pickled peppers',
    'Betty Botter bought some bitter butter',
    'I have got a date at a quarter to eight',
    'I hate Mondays',
    'We love Holidays',
    'Whole milk tastes better than semiskimmed milk',
    'Strawberry and Blueberry are lovely',
    'To be or not to be that is the question',
    'Jack and Jill climbed up the ladder',
    'I help strangers to pick things on',
    'I open doors to let people through',
    'It is a sight for sore eyes',
    'Get into hot water',
    'Be the luck of the draw',
    'A feast for the eyes'
];
let phrasesObj = phrases.map( phrase => {
    return { 
        content: phrase, 
        isUsed: false 
    };
});
let missed = 0;   // number of hearts the player has missed
let isWin = false;

const overlay =  document.getElementById('overlay-start');
const overlay_start =  document.getElementById('overlay-start');
const overlay_end = document.getElementById('overlay-end');
const btn_start = document.getElementById('btn-start');
const btn_restart = document.getElementById('btn-restart');
const btn_reset = document.getElementById('btn-reset');

let keyboard = document.querySelectorAll('#qwerty button');
let hearts = document.querySelectorAll('.tries img');

btn_start.addEventListener('click', () => {
    overlay_start.style.visibility = 'hidden';
    overlay_end.style.visibility = 'hidden';
    gameInit();
})

// game initialize
function gameInit() {
    console.log("init");
    let randomPhrase = getRandomPhrase(phrasesObj);
    displayPhrase(randomPhrase);
}

btn_reset.addEventListener('click', () => {
    overlay_end.style.visibility = 'hidden';
    gameReset('NewGame');
})

btn_restart.addEventListener('click', () => {
    overlay_end.style.visibility = 'hidden';
    gameReset('Restart');
})

// game reset
function gameReset(model) {
    console.log("reset");
    
    for (btn of keyboard) {
        btn.className = "";
        btn.disabled = false;
    }
    for (let i = 0; i < 5; i++) {
        hearts[i].src = "images/liveHeart.png";
    }
    missed = 0;
    isWin = false;

    const letters = document.querySelectorAll('#phrase ul li');
    if(model === 'Restart') {
        letters.forEach( l => l.classList.remove('show'));
    } else {
        for (let i = 0; i < letters.length; i++) { letters[i].remove(); }
        gameInit();
    }
}

// randomly choose a phrase 
function getRandomPhrase(phsObj) {
    const resultObj = phrasesObj.filter( phrase => !phrase.isUsed );
    let randomIndex = Math.floor( Math.random() * resultObj.length );  
    resultObj[randomIndex].isUsed = true;
    return resultObj[randomIndex].content.split("");
}

// display the random phrase
function displayPhrase(phrase) {
    const phList = document.querySelector('#phrase ul');

    phrase.forEach( letter => {
        let li = document.createElement('li');
        li.textContent = letter;
        li.className = (letter !== " ") ? 'letter' : 'space';
        
        phList.appendChild(li);
    });
}


// clicking kepboard buttons
for (btn of keyboard) {
    btn.addEventListener('click', e => {
        e.target.classList.add('chosen');
        e.target.disabled = true;

        let letterFound = checkLetter(e.target);
        if (letterFound == null) {
            hearts[missed].src = "images/lostHeart.png";
            missed += 1;
        } else {
            e.target.classList.add('correct');
        }
        checkWin();
    });
}



// check if a clicked letter is correct
function checkLetter(btn) {
    const letter_arr = document.getElementsByClassName('letter');
    let result = null;
    for (letter of letter_arr) {     //因为letter_arr是一个HTMLCollection，不同于Array，不能用forEach
        if (letter.textContent.toLowerCase() === btn.textContent) {
            letter.classList.add('show');
            result = letter.textContent;
        }
    }
    return result;
}


// check if win or lost
function checkWin() {
    let lettersNum = document.getElementsByClassName('letter').length;
    let showNum = document.getElementsByClassName('show').length;
    
    let endHeading = document.getElementById('overlay-end_heading');

    if (lettersNum === showNum) {
        overlay_end.className = "win";
        overlay_end.style.visibility = 'visible';
        endHeading.textContent = "Phrase Complete! 🎉🎉";
        btn_restart.textContent = "Restart";
        btn_reset.classList.remove('hidden');
        btn_reset.textContent = "Continue";
        isWin = true;
    } 
    else if (missed >= 5) {
        overlay_end.className = "lose";
        overlay_end.style.visibility = 'visible';
        endHeading.textContent = "You tried all chances :( ";
        btn_restart.textContent = "Try Again";
        btn_reset.classList.add('hidden');
    }
}





