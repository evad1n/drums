/**
 * Duration of the shortest audio playback duration, when holding audio press down.
 */
const HELD_AUDIO_REPEAT_INTERVAL = 0.03;

/**
 * Keycode map for quick lookup.
 */
const KEYS = Array.from(document.querySelectorAll(".key")).reduce((a, e) => {
    a[e.dataset.key] = true;
    return a;
}, {});

/**
 * Sound data.
 */
const SOUNDS = Array.from(document.querySelectorAll(".key")).reduce((a, e) => {
    const name = e.querySelector(".sound").textContent;
    a[name] = {
        key: e.dataset.key,
        interval: 0,
        containerEl: e,
        soundEl: document.querySelector(`[data-sound='${name}']`),
    };
    return a;
}, {});

// Init

window.addEventListener("keydown", function (e) {
    const k = e.key.toUpperCase();
    if (KEYS[k]) {
        keyDown(k);
    }
});

window.addEventListener("keyup", function (e) {
    const k = e.key.toUpperCase();
    if (KEYS[k]) {
        keyUp(k);
    }
});

const btns = Array.from(document.querySelectorAll(".key"));

for (const b of btns) {
    b.addEventListener("transitionend", removePlayingClasses);
    b.addEventListener("mousedown", mouseDown);
    b.addEventListener("mouseleave", mouseUp);
    b.addEventListener("mouseup", mouseUp);
}

// Functions

function mouseDown(e) {
    const soundName = e.currentTarget.querySelector("span").textContent;
    startSound(soundName);
}

function mouseUp(e) {
    const soundName = e.currentTarget.querySelector("span").textContent;
    endSound(soundName);
}

function keyDown(key) {
    const el = document.querySelector(`[data-key='${key}']`);
    const soundName = el.querySelector("span").textContent;
    startSound(soundName);
}

function keyUp(key) {
    const el = document.querySelector(`[data-key='${key}']`);
    const soundName = el.querySelector("span").textContent;
    endSound(soundName);
}

function startSound(soundName) {
    playSound(soundName);

    // If not already looping
    if (SOUNDS[soundName].interval === 0) {
        // Start interval here
        SOUNDS[soundName].interval = setInterval(() => {
            playSound(soundName);
        }, 1);
    }
}

function endSound(soundName) {
    // Clear interval here
    clearInterval(SOUNDS[soundName].interval);
    SOUNDS[soundName].interval = 0;
    const container = SOUNDS[soundName].containerEl;

    container.classList.remove("playing");
    container.classList.add("not-playing");
}

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
function playSound(name) {
    const sound = SOUNDS[name].soundEl;

    if (
        SOUNDS[name].interval !== 0 &&
        sound.currentTime < HELD_AUDIO_REPEAT_INTERVAL
    ) {
        return;
    }

    const container = SOUNDS[name].containerEl;
    container.classList.remove("not-playing");
    container.classList.add("playing");

    sound.currentTime = 0;
    sound.play();
}

// IDK
function removePlayingClasses(e) {
    if (e.propertyName == "border-left-color") {
        e.target.classList.remove("playing");
        e.target.classList.add("not-playing");
    }
}
