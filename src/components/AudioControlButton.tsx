import { Pause, Play } from 'lucide-react';
import React from 'react';

type Props = {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  setIsPlaying: (state: boolean) => void;
};

const AudioControlButton = ({ audioRef, isPlaying, setIsPlaying }: Props) => {
  const handleToggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed top-6 right-6 z-50 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-red-100 text-red-600 hover:scale-110 transition-transform"
    >
      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
    </button>
  );
};

export default AudioControlButton;
