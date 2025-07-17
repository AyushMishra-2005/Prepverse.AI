import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckCameraAndMic({onContinue}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [micAccessible, setMicAccessible] = useState(false);
  const [camWorking, setCamWorking] = useState(false);
  const [checking, setChecking] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const navigate = useNavigate();

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const checkPermissionsAndDevices = async () => {
    setChecking(true);
    setPermissionError(false);
    setMicAccessible(false);
    setCamWorking(false);
    stopStream();

    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === "videoinput");

      const preferredCam =
        videoDevices.find(device =>
          /built-in|integrated|internal/i.test(device.label)
        ) || videoDevices[0];

      const constraints = {
        video: preferredCam ? { deviceId: { exact: preferredCam.deviceId } } : true,
        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCamWorking(true);
        };
      }

      const hasAudioTrack = stream.getAudioTracks().length > 0;
      setMicAccessible(hasAudioTrack);

      setChecking(false);
    } catch (err) {
      console.error("Permission denied or media error:", err);
      setPermissionError(true);
      setChecking(false);
    }
  };

  useEffect(() => {
    checkPermissionsAndDevices();
    return () => {
      stopStream();
    };
  }, []);

  const handleContinue = () => {
    if (micAccessible && camWorking) {
      stopStream();
      onContinue?.();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center px-6 py-12 w-full">
      <div className="max-w-3xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold">Device Check</h1>
        <p className="text-gray-300">
          Please allow access to your camera and microphone to continue to the interview.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-start gap-12 mt-10">
          <div className="flex flex-col items-center">
            <div className="w-64 h-48 rounded-xl border-2 border-white shadow-md flex items-center justify-center bg-black">
              <video
                ref={videoRef}
                className="w-full h-full object-cover rounded-xl"
                autoPlay
                muted
                playsInline
              />
            </div>
            <p className="mt-3 text-lg font-medium">
              Camera:{" "}
              <span className={camWorking ? "text-green-400" : "text-red-400"}>
                {camWorking ? "Working" : "Not Detected"}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-64 h-48 rounded-xl border-2 border-white shadow-md flex items-center justify-center text-6xl bg-black">
              {micAccessible ? "🎤" : "🚫🎤"}
            </div>
            <p className="mt-3 text-lg font-medium">
              Microphone:{" "}
              <span className={micAccessible ? "text-green-400" : "text-red-400"}>
                {micAccessible ? "Accessible" : "Not Detected"}
              </span>
            </p>
          </div>
        </div>

        {checking ? (
          <p className="mt-8 text-gray-400">Checking devices...</p>
        ) : (
          <>
            {permissionError && (
              <div className="bg-red-900 text-red-300 p-4 mt-6 rounded-lg shadow-md">
                <p>Permission denied or devices not accessible.</p>
                <p className="mt-1">Please allow camera and microphone access in your browser settings.</p>
                <button
                  onClick={checkPermissionsAndDevices}
                  className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  🔁 Retry
                </button>
              </div>
            )}

            <button
              onClick={handleContinue}
              disabled={!(micAccessible && camWorking)}
              className={`mt-6 px-6 py-3 rounded-xl font-semibold text-white transition ${
                micAccessible && camWorking
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-700 cursor-not-allowed"
              }`}
            >
              Continue to Interview
            </button>
          </>
        )}
      </div>
    </div>
  );
}
