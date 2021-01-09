// Duration of the shortest audio playback duration, for looping purposes
const MIN_AUDIO_DURATION = 0.03;
const KEYS = Array.from(document.querySelectorAll('.key'), x => parseInt(x.dataset.key));

let btns = Array.from(document.querySelectorAll('.key'));

function removePlaying(e) {
	if (e.propertyName == 'border-left-color') {
		e.target.classList.remove("playing");
		e.target.classList.add("not-playing");
	}
};

let mouseDownLoop = null;

function clickPlay(e) {
	let el = document.querySelectorAll("[data-key='" + e.currentTarget.dataset.key + "']");
	mouseDownLoop = setInterval(() => {
		playSound(el);
	}, MIN_AUDIO_DURATION);
};

function keyPlay(e) {
	let el = document.querySelectorAll("[data-key='" + e.keyCode + "']");
	playSound(el);
};

function playSound(el) {
	if (el[1].paused || el[1].currentTime > MIN_AUDIO_DURATION) {
		el[0].classList.remove("not-playing");
		el[0].classList.add("playing");
		el[1].currentTime = 0;
		el[1].play();
	}
}


for (var i = 0; i < btns.length; i++) {
	btns[i].addEventListener('transitionend', removePlaying);
	btns[i].addEventListener('mousedown', clickPlay);
}



window.addEventListener('keydown', function (e) {
	//Checks to make sure playSound is only called on valid keys
	KEYS.forEach(function (f) {
		if (e.keyCode == f) {
			keyPlay(e);
		}
	});
});

window.addEventListener('mouseup', () => clearInterval(mouseDownLoop));