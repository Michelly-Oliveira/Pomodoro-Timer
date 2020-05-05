const timer = document.querySelector('.display-timer');
const buttons = document.querySelectorAll('.btn');
const timerOptions = document.querySelectorAll('.option');
const settingsIcon = document.querySelector('i');

const SESSION_MIN = 25;
const SHORT_BREAK_MIN = 5;
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
	resetAudio();

	const whichBtn = this.textContent;

	switch (whichBtn) {
		case 'Start':
			// If timer is paused and we click on the start btn it will unpause it and continue the timer
			if (paused) {
				toggleStop();
			} else {
				// If it's not paused, start the timer from the beginning
				startTimer();
			}
			break;

		case 'Pause':
			toggleStop();
			break;

		case 'Reset':
			reset();
			break;
	}
}

function resetAudio() {
	// Stop audio from playing
	alarmSound.pause();
	// Reset audio time
	alarmSound.currentTime = 0;
}

function startTimer() {
	// clear any interval that's executing
	clearInterval(countdown);
	// Start countdown immediately
	paused = false;
	// Set a time to use
	setMin(timeToUse);
	// Start countdown
	countdown = setInterval(timerCountdown, 1000);
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

function setMin(time) {
	// Use the time selected with the radio buttons
	min = time;
	seconds = 00;
	updateDisplayTimer();
}

function timerCountdown() {
	// If the timer is paused, don't continue the countdown
	if (paused) {
		return;
	}

	// If timer reached the end, stop countdown and clear the interval
	// clear the interval = timerCountdown won't be called every second
	if (timerEnded) {
		clearInterval(countdown);
		return;
	}

	// Reduce the seconds
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

function updateDisplayTimer() {
	// Format time when less than 10, put a zero before the number
	const time = `${min < 10 ? '0' : ''}${min}:${
		seconds < 10 ? '0' : ''
	}${seconds}`;
	// show on screen
	timer.textContent = time;
	// Show on tab
	document.title = time;
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

buttons.forEach((btn) => btn.addEventListener('click', chooseAction));
settingsIcon.addEventListener('click', toggleMenu);
timerOptions.forEach((option) =>
	option.addEventListener('change', selectTimeToUse)
);
