import "./App.css";
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import { Toaster } from "react-hot-toast";

import { NavbarDemo } from "./components/navBar";
import Footer from "./components/footerComponent";
import SignupForm from "./components/signUp";
import Login from "./components/login";
import Logout from "./components/logout";
import InterviewFeedback from "./components/interviewFeedback";
import ResumeProcessingPage from "./components/resumeProgressPage";
import ProfilePage from "./components/profilePage";

import HomeComponent from "./home/home";
import Home2 from "./Home2/home2";   // ✅ New import

import InterviewPage from "./interview/interviewPage";
import InterviewForm from "./interview/interviewForm";
import ProfileInterviewForm from "./interview/profileInterviewForm";
import { MockInterviewLandingPage } from "./interview/interviewLandingPage";

import QuizPage from "./quiz/QuizPage";
import QuizStart from "./quiz/QuizeStart";

import ResumeLandingPage from "./resumeBuilder/resumeLandingPage";
import ResumeForm from "./resumeBuilder/resumeForm";
import SelectResume from "./resumeBuilder/selectResume";

import AttendInterviews from "./companyInterview/attendInterviewsPage";
import { AiInterviewLandingPage } from "./companyInterview/aiInterviewLandingPage";
import CreateInterviewPage from "./companyInterview/createInterviewPage";
import { AttandantPage } from "./companyInterview/attandantPage";

import { ResumesProvider } from "./context/getAllResume";
import { InterviewsProvider } from "./context/getAllInterviews";
import { useAuth } from "./context/AuthProvider";

import useConversation from "./stateManage/useConversation";
import useResumeStore from "./stateManage/useResumeStore";

import server from "./environment";
import pageNotFound from "./assets/animations/errorAnimation.json";

function App() {
  const { authUser, setAuthUser } = useAuth();
  const { interviewModelId } = useConversation();
  const { resumeData } = useResumeStore();

  useEffect(() => {
    const checkSession = async () => {
      try {
        await axios.get(`${server}/verify-token`, { withCredentials: true });
      } catch (err) {
        localStorage.removeItem("authUserData");
        setAuthUser(null);
      }
    };
    checkSession();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster
        toastOptions={{
          style: { zIndex: 9999 },
        }}
      />

      <div className="fixed top-0 left-0 w-full z-30">
        <NavbarDemo />
      </div>

      <div className="flex flex-col items-center h-[100%] w-[100vw] bg-black">
        <Routes>
          {/* Home Pages */}
          <Route path="/" element={<HomeComponent />} />
          <Route path="/home2" element={<Home2 />} />   {/* ✅ Added new route */}

          {/* Interview */}
          <Route
            path="/interviewPage"
            element={
              authUser && interviewModelId ? <InterviewPage /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/interviewForm"
            element={authUser ? <InterviewForm /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profileInterviewForm"
            element={
              authUser ? <ProfileInterviewForm /> : <Navigate to="/mockInterviewLandingPage" replace />
            }
          />
          <Route
            path="/interview/result"
            element={authUser ? <InterviewFeedback /> : <Navigate to="/" replace />}
          />

          {/* Auth */}
          <Route path="/signup" element={authUser ? <HomeComponent /> : <SignupForm />} />
          <Route path="/login" element={authUser ? <HomeComponent /> : <Login />} />
          <Route path="/logout" element={authUser ? <Logout /> : <HomeComponent />} />

          {/* Quiz */}
          <Route path="/quiz" element={authUser ? <QuizPage /> : <Navigate to="/login" replace />} />
          <Route path="/quiz/start" element={authUser ? <QuizStart /> : <Navigate to="/login" replace />} />

          {/* Resume */}
          <Route path="/resume" element={authUser ? <ResumeLandingPage /> : <Navigate to="/login" replace />} />
          <Route
            path="/resume/selectResume"
            element={
              authUser ? (
                <ResumesProvider>
                  <SelectResume />
                </ResumesProvider>
              ) : (
                <Navigate to="/resume" replace />
              )
            }
          />
          <Route
            path="/resume/resumeForm"
            element={
              authUser && resumeData?.title ? <ResumeForm /> : <Navigate to="/resume/selectResume" replace />
            }
          />
          <Route
            path="/ResumeProcessingPage"
            element={authUser ? <ResumeProcessingPage /> : <Navigate to="/" replace />}
          />

          {/* AI Interviews */}
          <Route
            path="/aiInterviews"
            element={authUser ? <AiInterviewLandingPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/aiInterviews/attendInterview"
            element={authUser ? <AttendInterviews /> : <Navigate to="/" replace />}
          />
          <Route
            path="/aiInterviews/createInterview"
            element={
              authUser ? (
                <InterviewsProvider>
                  <CreateInterviewPage />
                </InterviewsProvider>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/aiInterviews/createInterview/attandants"
            element={authUser ? <AttandantPage /> : <Navigate to="/" replace />}
          />

          {/* Mock Interview */}
          <Route
            path="/mockInterviewLandingPage"
            element={authUser ? <MockInterviewLandingPage /> : <Navigate to="/" replace />}
          />

          {/* Profile */}
          <Route path="/profilePage" element={authUser ? <ProfilePage /> : <Navigate to="/" replace />} />

          {/* Internships */}
          <Route
            path="/internships"
            element={authUser ? <InternshipPage /> : <Navigate to="/login" replace />}
          />

          {/* Page Not Found */}
          <Route
            path="*"
            element={
              <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center bg-black text-white">
                <Lottie animationData={pageNotFound} loop={true} className="w-[400px] h-[400px]" />
              </div>
            }
          />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
