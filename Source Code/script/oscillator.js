document.addEventListener('DOMContentLoaded', () => {
    // Create an audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
    // Create an oscillator
    const oscillator = audioContext.createOscillator();
  
    // Create a gain node for volume control
    const gainNode = audioContext.createGain();
  
    // Connect the oscillator to the gain node, and the gain node to the audio context destination
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
  
    // Set initial values
    oscillator.type = 'sine'; // Sine wave
    oscillator.frequency.value = 440; // Frequency in hertz (A4 note)
    gainNode.gain.value = 0.5; // Initial volume
  
    // Start the oscillator
    oscillator.start();
  
    // Event listener for the volume control slider
    const volumeSlider = document.getElementById('volume');
    volumeSlider.addEventListener('input', () => {
      // Update the gain value based on the slider position
      gainNode.gain.value = parseFloat(volumeSlider.value);
    });
  
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      oscillator.stop();
      oscillator.disconnect();
      gainNode.disconnect();
    });
  });
  