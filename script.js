//Global Variables for active gameplay found here
let pattern = [2, 2, 4, 3, 2, 1, 2, 4];
let progress = 0; 
let gamePlaying = false;
let tonePlaying = false;
let volume = 0.7;
let clueHoldTime = 1000;
//how long to pause in between clues
const cluePauseTime = 333; 
//how long to wait before starting playback of the clue sequence
const nextClueWaitTime = 1000; 
guessCounter= 0;

// stores the start and stop buttons
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

// variable for the player's (high)score
let currentScore = 0;

// Updates the scores and display them
document.getElementById("currentScore").textContent = "Score: " + currentScore;


function startGame(){
  hideOverlay();
  resetScore();
  // resets progress and starts game by setting gamePlaying to true  
  progress = 0;
  gamePlaying = true;

  // swap the Start and Stop buttons   
  stopBtn.classList.remove("hidden");

  // play clue sequence, officially starting the game
  playClueSequence();
}

function stopGame(){
  // stops game by setting gamePlaying to false
  gamePlaying = false;

 // Serves same purpose as swapping start/stop buttons
  stopBtn.classList.add("hidden");


}

function lightButton(btn){
  //gets bottons by id and adds "lit" class to item
  document.getElementById("Btn"+btn).classList.add("lit")
}

function clearButton(btn){
  //gets bottons by id and removes "lit" class from item
  document.getElementById("Btn"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  // when game is playing, the button is lit 
  //and the tone is played for the duration of clueHoldTime before unlit.
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  context.resume().then(() =>
    {
      //set delay to initial wait time
    let delay = nextClueWaitTime; 
    guessCounter = 0;

    // for each clue that is revealed so far, 
    //we log the number of that clue, wait a bit and play that clue.
    for(let i=0;i<=progress;i++){ 
      console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
      // set a timeout to play that clue
      setTimeout(playSingleClue,delay,pattern[i]) 
      delay += clueHoldTime 
      delay += cluePauseTime;
    }
  });
}

function loseGame(){
  stopGame();
  //presents overlay for losing game
  showOverlay(1);
  }

function winGame(){
  stopGame();
  showOverlay(2);
  }

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }

  if (pattern[guessCounter] == btn)
  {
    if (guessCounter == progress)
      {
        if(progress == pattern.length-1)
        {
          //if the guess was correct, the turn is over, 
          //and this is the last turn, the user wins
          updateScore(1000)
          winGame();
        }
        else
        {
          //if the guess was correct, the turn is over, and this is not the last turn, the user continues
          progress++;
          updateScore(200);
          playClueSequence();
        }
    } else
    {
      //the guess was correct and the turn is not over, we check the next guess
      updateScore(100);
      guessCounter++;
    }
  } else
  {
    //if the guess was incorrect, user loses
    loseGame();
  }
}

//shows overlay depending on start, win, or loss
function showOverlay(x){
  if (x == 2){
    playAudio1();
    document.getElementById("overlay2").style.display = "flex";
  } else if (x == 1){
    playAudio();
    document.getElementById("overlay1").style.display = "flex";
  }else { 
    playAudio2();
    document.getElementById("overlay").style.display = "flex";
  }
}

function hideOverlay(x){
  // based on the value of x, hides the overlay of start, loss, or win
  if (x == 1){
    document.getElementById("overlay1").style.display = "none";
  }else if (x == 2){
    document.getElementById("overlay2").style.display = "none";
  }else{ 
    document.getElementById("overlay").style.display = "none";
  }
}

// Show the overlay when the page loads
window.onload = function () {
  showOverlay(0);
  playAudio2();
};

// Function to quit the game and redirect to another site
function quitGame() {
  window.location.href = "https://drive.google.com/file/d/1ulAwbqeX27Hwo9tcJ3L4RLSSBhe-XCM_/view?usp=sharing&autoplay=1";

}

// Function to update score
function updateScore(points){
  currentScore += points;
    updateScoreDisplay();
}

// Updates score display referring to the element in HTML
function updateScoreDisplay(){
   document.getElementById("scoreDisplay").textContent = "Score: " + currentScore;
}


// Resets Score at end of game
function resetScore(){
  currentScore = 0;
    updateScoreDisplay();
}

//commands for playing audio files
function playAudio() {
  let audio = document.getElementById("myAudio");
  audio.play();
}

function playAudio1() {
  let audio = document.getElementById("myAudio1");
  audio.play();
}

function playAudio2() {
  let audio = document.getElementById("myAudio2");
  audio.play();
}






// Sound Synthesis Functions for Steps 6-8
// You do not need to edit the below code
const freqMap = {
  1: 391.995,
  2: 523.25,
  3: 587.33,
  4: 493.883 
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
let AudioContext = window.AudioContext || window.webkitAudioContext 
let context = new AudioContext()
let o = context.createOscillator()
let g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)