const yearElement = document.querySelector("[data-year]");
const birthdayDialog = document.querySelector(".birthday-dialog");
const closeButtons = document.querySelectorAll("[data-close-dialog]");
const musicToggle = document.querySelector("[data-music-toggle]");
const musicLabel = document.querySelector("[data-music-label]");

const birthdayMelody = [
  [392, 0.5], [392, 0.5], [440, 1], [392, 1], [523.25, 1], [493.88, 2],
  [392, 0.5], [392, 0.5], [440, 1], [392, 1], [587.33, 1], [523.25, 2],
  [392, 0.5], [392, 0.5], [783.99, 1], [659.25, 1], [523.25, 1], [493.88, 1], [440, 2],
  [698.46, 0.5], [698.46, 0.5], [659.25, 1], [523.25, 1], [587.33, 1], [523.25, 2],
];

let audioContext;
let melodyTimer;
let scheduledNotes = [];
let isMusicPlaying = false;

function updateMusicControl() {
  if (!musicToggle || !musicLabel) return;
  musicToggle.setAttribute("aria-pressed", String(isMusicPlaying));
  musicLabel.textContent = isMusicPlaying ? "Birthday tune playing" : "Play birthday tune";
}

function scheduleBirthdayMelody() {
  if (!audioContext || !isMusicPlaying || !birthdayDialog?.open) return;

  const beatLength = 0.38;
  let noteStart = audioContext.currentTime + 0.08;

  birthdayMelody.forEach(([frequency, beats]) => {
    const duration = beats * beatLength;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.075, noteStart + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + duration * 0.92);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(noteStart);
    oscillator.stop(noteStart + duration);
    scheduledNotes.push(oscillator);
    oscillator.addEventListener("ended", () => {
      scheduledNotes = scheduledNotes.filter((note) => note !== oscillator);
    });
    noteStart += duration;
  });

  const loopDelay = Math.max(0, (noteStart - audioContext.currentTime + 0.7) * 1000);
  melodyTimer = window.setTimeout(scheduleBirthdayMelody, loopDelay);
}

async function startBirthdayMusic() {
  if (isMusicPlaying || !birthdayDialog?.open) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  audioContext ||= new AudioContext();
  await audioContext.resume();
  if (audioContext.state !== "running") return;

  isMusicPlaying = true;
  updateMusicControl();
  scheduleBirthdayMelody();
}

function stopBirthdayMusic() {
  isMusicPlaying = false;
  window.clearTimeout(melodyTimer);
  scheduledNotes.forEach((note) => {
    try { note.stop(); } catch (_) { /* The note already ended. */ }
  });
  scheduledNotes = [];
  updateMusicControl();
}

if (yearElement) yearElement.textContent = `© ${new Date().getFullYear()} Psykin`;

if (birthdayDialog) {
  birthdayDialog.showModal();
  closeButtons.forEach((button) => button.addEventListener("click", () => birthdayDialog.close()));
  birthdayDialog.addEventListener("click", (event) => {
    if (event.target === birthdayDialog) birthdayDialog.close();
  });
  birthdayDialog.addEventListener("close", stopBirthdayMusic);
  musicToggle?.addEventListener("click", () => {
    if (isMusicPlaying) stopBirthdayMusic();
    else startBirthdayMusic();
  });
  startBirthdayMusic();
}
