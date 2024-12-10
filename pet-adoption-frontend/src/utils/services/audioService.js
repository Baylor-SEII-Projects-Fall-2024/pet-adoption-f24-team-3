import { useState, useEffect } from 'react';

let audioInstance = null;

export const useAudioManager = () => {
  const [audio, setAudio] = useState(null);

  const loadAudio = (src) => {
    // Stop any existing audio
    if (audioInstance) {
      audioInstance.pause();
      audioInstance = null;
    }

    // Create new audio instance
    const newAudio = new Audio(src);
    audioInstance = newAudio;
    setAudio(newAudio);
    return newAudio;
  };

  const playAudio = () => {
    if (audioInstance) {
      audioInstance.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
  };

  const stopAudio = () => {
    if (audioInstance) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioInstance) {
        audioInstance.pause();
        audioInstance = null;
      }
    };
  }, []);

  return { loadAudio, playAudio, stopAudio };
};
