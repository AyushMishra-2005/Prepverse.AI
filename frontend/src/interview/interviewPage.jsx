import { cn } from "../lib/utils.js";
import React, { useEffect, useState, useRef } from "react";
import AssistantPage from "./assistantPage.jsx";
import CandidateSection from "./candidateSection.jsx";
import VoiceConvertor from "../components/voiceToText.jsx";
import useConversation from "../stateManage/useConversation.js";
import axios from "axios";
import TextToVoice from "../components/textToVoice.jsx";
import { useAuth } from "../context/AuthProvider.jsx";
import server from '../environment.js'
import { useNavigate } from 'react-router-dom'
import CountdownTimer from "../components/countDownTimer.jsx";
import InterviewFeedback from "../components/interviewFeedback.jsx";
import creatingReportAnimation from '../assets/animations/creatingReport.json'
import Lottie from "lottie-react";

function InterviewPage() {
  const [spokenText, setSpokenText] = useState("");
  const [recordingStatus, setRecordingStatus] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [controls, setControls] = useState(null);
  const [userMic, setUserMic] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [finishInterview, setFinishInterview] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportData, setReportData] = useState({});
  const [stopSpeaking, setStopSpeaking] = useState(() => () => {});

  const scrollRef = useRef(null);
  const { authUser } = useAuth();
  const navigate = useNavigate();

  const {
    candidateAnswer,
    setCandidateAnswer,
    assistantContent,
    setAssistantContent,
    askedQuestions,
    setAskedQuestions,
    givenAnswers,
    setGivenAnswers,
    interviewData,
    interviewModelId,
    setInterviewModelId,
    distractionDetect,
    setDistractionDetect,
  } = useConversation();
  const [startInterview, setStartInterview] = useState(false);

  useEffect(() => {
    setSpokenText(transcript);
    setCandidateAnswer(transcript);
  }, [transcript]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [spokenText]);

  const handleBeginRecordingButton = () => {
    setRecordingStatus(false);
    controls?.startListening();
  }

  const handleEndInterview = async () => {

    setReportLoading(true);
    stopSpeaking();
    
    try {
      const { data } = await axios.post(
        `${server}/interview/evaluateInterviewResult`,
        { interivewId: interviewModelId },
        { withCredentials: true }
      );

      if (data?.interviewData) {
        console.log(data.interviewData);
        setReportData(data.interviewData);
      }

      setReportLoading(false);
    } catch (err) {
      console.log(err);
      setReportLoading(false);
    }

    setStartInterview(false);
    setAskedQuestions([]);
    setAssistantContent("");
  }

  useEffect(() => {
    if (distractionDetect) {
      handleEndInterview();
    }
  }, [distractionDetect]);


  useEffect(() => {
    if (!aiSpeaking && finishInterview) {
      handleEndInterview();
    }
  }, [aiSpeaking, finishInterview]);

  const handleSendRecording = async () => {
    setSpokenText("");
    setRecordingStatus(true);
    controls?.stopListening();
    controls?.resetTranscript();
    setAiSpeaking(true);

    try {
      const role = interviewData?.role;
      const topic = interviewData?.topic;
      const numOfQns = interviewData?.numOfQns;
      const name = authUser.user.name;
      const previousQuestions = askedQuestions;
      const askedQuestion = assistantContent;
      const givenAnswer = candidateAnswer?.trim() === "" ? "Answer Not Provided." : candidateAnswer;
      const modelId = interviewModelId;

      const { data } = await axios.post(`${server}/interview/generate-question`,
        { role, topic, name, previousQuestions, askedQuestion, givenAnswer, numOfQns, modelId },
        { withCredentials: true }
      );

      setAssistantContent(data.responseData);
      askedQuestions.push(data.question);
      setAskedQuestions(askedQuestions);

      if (data.finishInterview) {
        setFinishInterview(data.finishInterview);
        setAiSpeaking(true);
      }


    } catch (err) {
      console.log(err);
    }

    setCandidateAnswer("");
  }

  const handleStartInterview = async () => {
    setStartInterview(true);
    setUserMic(true);
    setAiSpeaking(true);
    try {
      const role = interviewData?.role;
      const topic = interviewData?.topic;
      const numOfQns = interviewData?.numOfQns;
      const name = authUser.user.name;
      const previousQuestions = askedQuestions;
      const modelId = interviewModelId;

      const { data } = await axios.post(`${server}/interview/generate-question`,
        { role, topic, name, previousQuestions, numOfQns, modelId },
        { withCredentials: true }
      );
      setAssistantContent(data.responseData);
      askedQuestions.push(data.question);
      setAskedQuestions(askedQuestions);
    } catch (err) {
      console.log(err);
    }
  }

  if (reportLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 z-[1000] w-[100vw] h-[100vh] flex flex-col items-center justify-center">
        <div className="w-64 h-64">
          <Lottie animationData={creatingReportAnimation} loop={true} />
        </div>
        <h2 className="text-white text-2xl mt-6 font-semibold animate-pulse">Generating Interview Report...</h2>
      </div>
    );
  }

  if (reportData && Object.keys(reportData).length > 0) {
    return <InterviewFeedback data={reportData} onBack={() => navigate("/")} />;
  }


  return (
    <div className="relative flex h-[100vh] w-[100vw] items-center justify-center bg-white dark:bg-gray-950 mt-6">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,rgba(209,213,219,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(209,213,219,0.3)_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,rgba(55,65,81,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(55,65,81,0.3)_1px,transparent_1px)]",
        )}
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-gray-950"></div>

      {startInterview && userMic && !aiSpeaking && (
        <div className="absolute top-6 right-6 z-50">
          <CountdownTimer duration={askedQuestions[askedQuestions.length - 1]?.time} onComplete={() => {
            handleSendRecording();
          }} />
        </div>
      )}
      <div className="h-[100%] w-[100%] min-h-[100vh] min-w-[100vw] z-20 flex justify-evenly items-center flex-col">
        <div className="h-[80%] w-[100%] flex flex-row justify-evenly">
          <AssistantPage />
          <CandidateSection startInterview={startInterview} />
          <TextToVoice
            onStart={() => setAiSpeaking(true)}
            onEnd={() => setAiSpeaking(false)}
            setStopSpeakingCallback={setStopSpeaking}
          />
        </div>

        <div className="w-[80%] mb-8 flex flex-col items-center space-y-4">
          <div className="w-full relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-75 transition duration-200"></div>
            <div className="relative w-full h-16 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
              <div className="h-full flex items-center">
                <p
                  ref={scrollRef}
                  className="text-gray-900 dark:text-gray-100 text-lg font-medium whitespace-nowrap overflow-x-auto scroll-smooth no-scrollbar"
                >
                  {spokenText || (
                    <span className="text-gray-500 dark:text-gray-400">
                      <span className="text-blue-600 dark:text-blue-400">Waiting...</span> Speak to see text appear
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            {
              recordingStatus ? (
                <button
                  className={cn(
                    "px-6 py-3 font-medium rounded-lg transition-all duration-200 shadow-md transform hover:-translate-y-0.5 focus:outline-none",
                    "bg-gradient-to-r from-blue-600 to-blue-500 text-white",
                    "hover:from-blue-700 hover:to-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50",
                    (!userMic || controls?.isListening || aiSpeaking) && "opacity-50 cursor-not-allowed hover:from-blue-600 hover:to-blue-500"
                  )}
                  onClick={handleBeginRecordingButton}
                  disabled={!userMic || controls?.isListening || aiSpeaking}
                >
                  Begin Recording
                </button>
              ) : (
                <button
                  className={cn(
                    "px-6 py-3 font-medium rounded-lg transition-all duration-200 shadow-md transform hover:-translate-y-0.5 focus:outline-none",
                    "bg-gradient-to-r from-blue-600 to-blue-500 text-white",
                    "hover:from-blue-700 hover:to-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50",
                    (!userMic || !controls?.isListening || aiSpeaking) && "opacity-50 cursor-not-allowed hover:from-blue-600 hover:to-blue-500"
                  )}
                  onClick={handleSendRecording}
                  disabled={!userMic || !controls?.isListening || aiSpeaking}
                >
                  Send Recording
                </button>
              )
            }

            {
              startInterview ? <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                onClick={handleEndInterview}
              >
                End Interview
              </button> : <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                onClick={handleStartInterview}
              >
                Start Interview
              </button>
            }

            <VoiceConvertor
              onTranscriptUpdate={setTranscript}
              onControlsReady={setControls}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewPage