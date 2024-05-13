var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function noteNormalize(note) {
  return 1000*(note/SIZE)+200;
}
let worked = false;

let noteInterval = -1;
var oscillator = -1;
function playSort(gainValue=0.2) {
  oscillator = audioCtx.createOscillator();
  var gainNode = audioCtx.createGain(); // Create a gain node

  oscillator.type = 'sine'; // Set oscillator type to sine wave
  oscillator.connect(gainNode); // Connect oscillator to gain node
  gainNode.connect(audioCtx.destination); // Connect gain node to audio destination
  oscillator.frequency.value = noteNormalize(swaps[swaps.length-1][2]); // value in hertz
  gainNode.gain.value = gainValue; // Set the gain value to make the note quieter
  let globalI = 0;
  oscillator.start();
  noteInterval = setInterval(function() {
    if (swaps.length == 0) {clearInterval(noteInterval);noteInterval = -1;oscillator.stop();return;}
    oscillator.frequency.setValueAtTime(noteNormalize(swaps[swaps.length-1][2]),globalI++*opTime/1000);
  },opTime);
}
function playFinal(gainValue=0.2,duration=700) {
  var oscillator2 = audioCtx.createOscillator();
  var gainNode2 = audioCtx.createGain();
  oscillator2.type = 'sine';
  oscillator2.frequency.value = noteNormalize(0);
  oscillator2.connect(gainNode2);
  gainNode2.connect(audioCtx.destination);
  gainNode2.gain.value = gainValue;
  var currentTime = audioCtx.currentTime;
  var endTime = currentTime + duration/1000;
  oscillator2.frequency.setValueAtTime(noteNormalize(0), currentTime);
oscillator2.frequency.exponentialRampToValueAtTime(noteNormalize(SIZE), endTime);

  oscillator2.start();

  setTimeout(
    function() {
      oscillator2.stop();
    }, duration);
}
