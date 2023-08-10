const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();

const file = document.getElementById("file-input");
const canvasElement = document.getElementById("canvas");
const h3 = document.getElementById('name')
const audio = document.getElementById("audio");
const volumeControl = document.querySelector("#volume");

const gainNode = audioContext.createGain();

const WIDTH = canvasElement.width;
const HEIGHT = canvasElement.height;



const canvas = canvasElement.getContext("2d");

file.onchange = function () {
    const files = this.files;
    audio.src = URL.createObjectURL(files[0]);

    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    source.connect(gainNode);
    source.connect(audioContext.destination);
    analyser.connect(audioContext.destination);
}


function draw() {
    requestAnimationFrame(draw);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyser.getByteTimeDomainData(dataArray);

    canvas.clearRect(0, 0, WIDTH, HEIGHT);


    canvas.fillStyle = "rgb(0, 0, 0)";
    canvas.fillRect(0, 0, WIDTH, HEIGHT);



    const barWidth = (WIDTH / bufferLength) * 3.0;
    let barHeight;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        canvas.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        canvas.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);

        x += barWidth + 1;
    }
}


volumeControl.addEventListener(
    "input",
    () => {
        gainNode.gain.value = volumeControl.value;
    },
    false,
);


const playButton = document.querySelector("button");
playButton.addEventListener("click", () => {
    console.log('test')
    // Check if context is in suspended state (autoplay policy)
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    // Play or pause track depending on state
    if (playButton.dataset.playing === "false") {
        audio.play();
        draw();
        playButton.dataset.playing = "true";
    } else if (playButton.dataset.playing === "true") {
        audio.pause();
        playButton.dataset.playing = "false";
    }
},
    false,
);


audio.addEventListener(
    "ended",
    () => {
        playButton.dataset.playing = "false";
    },
    false,
);