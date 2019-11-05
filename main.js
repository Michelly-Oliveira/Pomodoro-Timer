const timer = document.querySelector('.display-timer');
const buttons = document.querySelectorAll('.btn');
const timerOptions = document.querySelectorAll('.option');
const settingsIcon = document.querySelector('i');

const SESSION_MIN = 25;
const SHORT_BREAK_MIN = 1;
const LONG_BREAK_MIN = 15;

let timerEnded = false;
let paused = false;
// Start program with 25 min
let timeToUse = SESSION_MIN;

let seconds = 00;
let min;
let countdown;

// Audio
const alarmSound = new Audio('audio/alarm.mp3');

function chooseAction() {
  // Reset audio time
  alarmSound.currentTime = 0;

  const whichBtn = this.textContent;

  switch (whichBtn) {
    case 'Start':
      if (paused) {
        // If timer is paused, when click start should 'unpause' the timer
        // don't start timer again
        toggleStop();
        return;
      }

      startTimer();
      break;

    case 'Pause':
      toggleStop();
      break;

    case 'Reset':
      reset();
      break;
  }
}

function setMin(time) {
  // Use the time selected with the radio buttons
  min = time;
  seconds = 00;
  updateDisplayTimer();
}

function startTimer() {
  // clear any interval that's executing
  clearInterval(countdown);
  // Don't start countdown immediately
  paused = false;
  // Set a time to use
  setMin(timeToUse);
  // Start countdown
  countdown = setInterval(timerCountdown, 1000);
}

function timerCountdown() {
  if (paused) {
    return;
  }

  if (timerEnded) {
    clearInterval(countdown);
    return;
  }

  seconds--;

  // Check if session ended
  if (min == 0 && seconds < 1) {
    alarmSound.play();
    timerEnded = true;
  } // Check if a minute passed
  else if (seconds < 1) {
    min--;
    seconds = 59;
  }

  updateDisplayTimer();
}

function toggleStop() {
  paused = !paused;
}

function reset() {
  timerEnded = false;
  // Don't start countdown automatically
  paused = true;

  setMin(timeToUse);
  updateDisplayTimer();
}

function updateDisplayTimer() {
  // Format time when less than 10
  const display = `${min < 10 ? '0' : ''}${min}:${seconds < 10 ? '0' : ''}${seconds}`;
  // show on screen
  timer.textContent = display;
  // Show on tab
  document.title = display;
}

function selectTimeToUse(e) {
  // See which time option was selected
  switch (e.target.value) {
    case 'session':
      timeToUse = SESSION_MIN;
      break;
    case 'short-break':
      timeToUse = SHORT_BREAK_MIN;
      break;
    case 'long-break':
      timeToUse = LONG_BREAK_MIN;
      break;
  }
  // Don't start countdown automatically
  paused = true;
  // Set the time
  setMin(timeToUse);
}

function toggleMenu() {
  const wrapper = document.querySelector('.container');
  wrapper.classList.toggle('show-options');
}

buttons.forEach(btn => btn.addEventListener('click', chooseAction));
timerOptions.forEach(option => option.addEventListener('change', selectTimeToUse));
settingsIcon.addEventListener('click', toggleMenu);
