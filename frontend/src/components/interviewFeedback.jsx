import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "animate.css";
import Lottie from "lottie-react";
import thinkingAnimation from "../assets/animations/thinking.json";
import useConversation from "../stateManage/useConversation";

const InterviewFeedback = ({ data, onBack }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const { setInterviewModelId } = useConversation();

  const feedbackData = data
    ? data.questions.map((q, idx) => ({
      question: q.question,
      answer: data.answers[idx] || "Answer not provided.",
      suggestions: data.reviews[idx]?.review || "No review available.",
      score: data.reviews[idx]?.score ?? 0,
    }))
    : [
      {
        question: "Sample Question 1",
        answer: "Sample Answer 1",
        suggestions: "Be more clear and provide examples.",
        score: 5,
      },
      {
        question: "Sample Question 2",
        answer: "Sample Answer 2",
        suggestions: "Use a structured format.",
        score: 6,
      },
    ];

  const overallFeedback = data?.overAllReview || "No overall feedback available.";
  const totalScore = data?.totalScore ?? 0;

  const participant = data?.participant || {};
  const name = participant.name || "Interview Candidate";
  const email = participant.email || "example@example.com";
  const profilePic =
    participant.profilePicURL || "https://media.istockphoto.com/id/1389348844/photo/studio-shot-of-a-beautiful-young-woman-smiling-while-standing-against-a-grey-background.jpg?s=612x612&w=0&k=20&c=anRTfD_CkOxRdyFtvsiPopOluzKbhBNEQdh4okZImQc=";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate__animated", "animate__fadeInUp");
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = document.querySelectorAll(".question-review-card");
    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, []);

  return (
    <div className="relative overflow-hidden w-[100vw]">
      {/* Background Animation */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-pink-500 opacity-20 rounded-full mix-blend-multiply filter blur-2xl animate-blob"></div>
        <div className="absolute top-40 left-60 w-72 h-72 bg-purple-500 opacity-20 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-20 left-80 w-72 h-72 bg-blue-500 opacity-20 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white p-18 min-h-screen font-sans animate__animated animate__fadeIn">
        {/* Candidate Info */}
        <div className="flex items-center gap-6 mb-10 animate__animated animate__fadeInUp animate__delay-1s">
          <img
            src={profilePic}
            alt={name}
            className="w-24 h-24 object-cover rounded-full border-4 border-cyan-400 shadow-xl hover:scale-110 transition-transform duration-300"
          />
          <div>
            <h2 className="text-3xl font-bold tracking-wide">{name}</h2>
            <p className="text-gray-400 text-sm">{email}</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Score", value: `${totalScore} / ${data?.questions?.length * 10}` },
            { label: "Total Questions", value: `${data?.questions?.length ?? feedbackData.length}` },
            { label: "Role", value: data?.interviewId?.interview?.role || "N/A" },
            {
              label: "Topics",
              value:
                data?.interviewId?.interview?.topics?.join(", ") ||
                "No topics available",
            },
          ].map((item, idx) => (
            <div
              key={item.label}
              className={`backdrop-blur-lg bg-white/10 border border-white/10 p-6 rounded-2xl text-center shadow-lg hover:scale-105 transition-transform duration-300 hover:border-teal-400 animate__animated animate__fadeInUp animate__delay-${idx + 1}s`}
            >
              <p className="text-gray-400">{item.label}</p>
              <h2 className="text-2xl text-sky-400 font-semibold">{item.value}</h2>
            </div>
          ))}
        </div>


        {/* Question Reviews */}
        <div className="mb-12">
          <div className="flex items-center mb-8 gap-4 animate__animated animate__fadeInUp animate__delay-3s">
            <h3 className="text-yellow-300 text-2xl font-semibold whitespace-nowrap">
              Interview Question Reviews
            </h3>
            <div className="w-40 md:w-48">
              <Lottie animationData={thinkingAnimation} loop={true} />
            </div>
          </div>

          {feedbackData.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-800/60 rounded-xl p-4 mb-4 transition-all question-review-card border border-white/10 hover:shadow-[0_0_15px_#0ff] hover:scale-[1.02]"
            >
              <div
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="flex justify-between items-center cursor-pointer px-2"
              >
                <h4 className="text-sky-300 font-semibold text-lg">
                  Q{idx + 1}. {item.question}
                </h4>
                {openIndex === idx ? <FaChevronUp /> : <FaChevronDown />}
              </div>

              {openIndex === idx && (
                <div className="mt-4 space-y-4">
                  <div className="bg-gray-900 rounded-lg p-4 border-l-4 border-green-400">
                    <span className="uppercase text-sm text-gray-400">Your Answer</span>
                    <p className="mt-1">{item.answer}</p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 border-l-4 border-yellow-400">
                    <div className="mb-2">
                      <span
                        className={`inline-block px-3 py-1 text-sm font-bold rounded-full ${item.score >= 7
                            ? "bg-green-500 text-black"
                            : "bg-red-600 text-white"
                          }`}
                      >
                        {item.score}/10
                      </span>
                    </div>
                    <span className="uppercase text-sm text-gray-400">Suggestions</span>
                    <p className="mt-1 text-white/90">{item.suggestions}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Overall Feedback Box */}
        <div className="bg-gradient-to-br from-teal-700 to-cyan-800/80 p-6 rounded-2xl mb-10 shadow-lg border border-cyan-500 max-w-4xl mx-auto animate__animated animate__fadeInUp animate__delay-4s">
          <h4 className="text-xl text-white font-semibold mb-2">Overall Feedback</h4>
          <p className="text-white/90 leading-relaxed">{overallFeedback}</p>
        </div>

        {/* Back to Dashboard */}
        <div className="flex justify-center animate__animated animate__fadeInUp animate__delay-5s">
          <button className="text-sky-400 hover:underline text-base"
            onClick={() => {
              setInterviewModelId('')
              onBack();
            }}
          >
            ← Back 
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedback;
