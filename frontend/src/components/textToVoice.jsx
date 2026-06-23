import React, { useEffect, useRef, useCallback } from "react";
import useConversation from "../stateManage/useConversation";
import axios from "axios";
import server from "../environment";

function TextToVoice({ onStart, onEnd, setStopSpeakingCallback }) {
  const { assistantContent } = useConversation();

  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    onEnd?.();
  }, [onEnd]);

  useEffect(() => {
    if (setStopSpeakingCallback) {
      setStopSpeakingCallback(() => stopSpeaking);
    }
  }, []); 

  const speakText = async () => {
    if (!assistantContent?.trim()) return;

    try {
      onStart?.();

      const response = await axios.post(
        `${server}/speak`,
        { text: assistantContent },
        {
          withCredentials: true,
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!(response.data instanceof Blob)) {
        throw new Error("Server didn't return audio.");
      }

      const url = URL.createObjectURL(response.data);
      audioUrlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        stopSpeaking();
      };

      await audio.play();
    } catch (err) {
      console.error("Voice playback error:", err);
      stopSpeaking();
    }
  };

  useEffect(() => {
    speakText();

    return () => {
      stopSpeaking();
    };
  }, [assistantContent]);

  return null;
}

export default TextToVoice;


