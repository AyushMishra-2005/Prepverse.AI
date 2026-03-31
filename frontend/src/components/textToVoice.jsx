import React, { useEffect, useRef } from "react";
import useConversation from "../stateManage/useConversation";
import axios from 'axios';

function TextToVoice({ onStart, onEnd, setStopSpeakingCallback }) {
  const { assistantContent } = useConversation();
  const audioRef = useRef(null);

  const speakText = async () => {
    if (!assistantContent.trim()) return;

    try {
      onStart?.();

      const response = await axios.post(
        "http://localhost:5000/speak",
        { text: assistantContent },
        {
          headers: { "Content-Type": "application/json" },
          responseType: "blob",
        },
      );

      const blob = response.data;
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        onEnd?.();
        audioRef.current = null;
      };

      audio.play();
    } catch (err) {
      console.error("Voice playback error:", err.message);
      onEnd?.();
    }
  };

  useEffect(() => {
    if (setStopSpeakingCallback) {
      setStopSpeakingCallback(() => () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current = null;
          onEnd?.();
        }
      });
    }
  }, [setStopSpeakingCallback]);

  useEffect(() => {
    speakText();
  }, [assistantContent]);

  return null;
}

export default TextToVoice;









