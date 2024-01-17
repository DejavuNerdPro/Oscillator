document.addEventListener('DOMContentLoaded', () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const analyser=audioContext.createAnalyser();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = 'sine';
    oscillator.frequency.value = 440;
    gainNode.gain.value = 0.5;
  
    // Add a button click event listener to start the audio context
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
      audioContext.resume().then(() => {
        oscillator.start();
        visualizeFrequency(analyser);
      });
    });

    //for stopping oscillator
    const stopButton=document.getElementById('stopButton');
    stopButton.addEventListener('click',()=>{
        audioContext.resume().then(()=>{
            oscillator.stop();
        });
    });
  
    // Event listener for the volume control slider
    const volumeSlider = document.getElementById('volume');
    volumeSlider.addEventListener('input', () => {
      gainNode.gain.value = parseFloat(volumeSlider.value);
    });

    // Event listener for the frequency control slider
  const frequencySlider = document.getElementById('frequency');
  const frequencyDisplay = document.getElementById('frequencyDisplay');
  
  frequencySlider.addEventListener('input', () => {
    const newFrequency = parseFloat(frequencySlider.value);
    oscillator.frequency.value = newFrequency;
    frequencyDisplay.textContent = newFrequency.toFixed(2);
  });

  //frequency spreadrum using canvas
  const visualizeFrequency = (analyserNode) => {
    const canvas = document.getElementById('frequencyCanvas');
    const canvasCtx = canvas.getContext('2d');
    const bufferLength = analyserNode.frequencyBinCount;

    console.log("Buffer Length : ",bufferLength);

    const dataArray = new Uint8Array(bufferLength);

    console.log("Visualize Frequency : ", dataArray);

    // Clear the canvas
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const draw = () => {
      analyserNode.getByteFrequencyData(dataArray);

      // Draw the frequency spectrum
      const barWidth = canvas.width/bufferLength;       //(canvas.width / bufferLength) * 2.5;
      console.log("Bar Width : ",barWidth);
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i]/256)*canvas.height;
        console.log("Bar Height : ",barHeight);

        canvasCtx.fillStyle = `rgb(${barHeight}, 50, 50)`;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      requestAnimationFrame(draw);
    };

    draw();
  };

  
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      oscillator.stop();
      oscillator.disconnect();
      gainNode.disconnect();
    });
  });
  