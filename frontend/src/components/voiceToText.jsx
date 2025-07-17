import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const VoiceConvertor = ({onTranscriptUpdate, onControlsReady}) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if(onTranscriptUpdate){
      onTranscriptUpdate(transcript);
    }
  }, [transcript, onTranscriptUpdate]);

  useEffect(() => {
    if(onControlsReady){
      onControlsReady({
        startListening: () => {SpeechRecognition.startListening({ continuous: true })},
        stopListening: () => {SpeechRecognition.stopListening()},
        resetTranscript,
        isListening : listening,
      })
    }
  }, [listening, resetTranscript, onControlsReady]);


  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return null;
};

export default VoiceConvertor;