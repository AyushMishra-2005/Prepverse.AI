import './App.css'
import InterviewPage from './interview/interviewPage';
import { NavbarDemo } from './components/navBar';
import HomeComponent from './home/home';
import Footer from './components/footerComponent';
import SignupForm from './components/signUp';
import Login from './components/login';
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthProvider';
import Logout from './components/logout';
import InterviewForm from './interview/interviewForm';
import useConversation from './stateManage/useConversation';
import { useEffect } from 'react';
import axios from 'axios'
import server from './environment';
import { Navigate } from 'react-router-dom';
import QuizPage from './quiz/QuizPage';
import QuizStart from './quiz/QuizeStart';
import ResumeLandingPage from './resumeBuilder/resumeLandingPage';
import ResumeForm from './resumeBuilder/resumeForm';
import useResumeStore from './stateManage/useResumeStore';
import SelectResume from './resumeBuilder/selectResume';
import { ResumesProvider } from './context/getAllResume';
import AttendInterviews from './companyInterview/attendInterviewsPage';
import { AiInterviewLandingPage } from './companyInterview/aiInterviewLandingPage';
import CreateInterviewPage from './companyInterview/createInterviewPage';
import { AttandantPage } from './companyInterview/attandantPage';
import { InterviewsProvider } from './context/getAllInterviews';
import InterviewFeedback from './components/interviewFeedback';
import { MockInterviewLandingPage } from './interview/interviewLandingPage';
import Lottie from 'lottie-react';
import pageNotFound from './assets/animations/errorAnimation.json'
import ProfileInterviewForm from './interview/profileInterviewForm';

function App() {

  const { authUser, setAuthUser } = useAuth();
  const { interviewModelId } = useConversation();
  const { resumeData } = useResumeStore();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(
          `${server}/verify-token`,
          { withCredentials: true }
        );
      } catch (err) {
        localStorage.removeItem('authUserData');
        setAuthUser(null);
      }
    }
    checkSession();
  }, []);



  return (
    <>

      <div className="flex flex-col min-h-screen">

        <Toaster
          toastOptions={{
            style: {
              zIndex: 9999,
            },
          }}
        />
        <div className="fixed top-0 left-0 w-full z-30">
          <NavbarDemo />
        </div>

        <div className='flex flex-col items-center h-[100%] w-[100vw] bg-black'>
          <Routes>
            <Route path='/' element={<HomeComponent />} />
            <Route
              path='/interviewPage'
              element={
                authUser &&
                  interviewModelId ? (
                  <InterviewPage />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path='/signup' element={authUser ? <HomeComponent /> : <SignupForm />} />
            <Route path='/login' element={authUser ? <HomeComponent /> : <Login />} />
            <Route path="*" element={
              <>
                <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center bg-black text-white">
                  <Lottie animationData={pageNotFound} loop={true} className="w-[400px] h-[400px]" />
                </div>
              </>
            } />
            <Route path='/logout' element={authUser ? <Logout /> : <HomeComponent />} />
            <Route path='/interviewForm' element={authUser ? <InterviewForm /> : <Navigate to="/login" replace />} />
            <Route path='/quiz' element={authUser ? <QuizPage /> : <Navigate to="/login" replace />} />
            <Route path='/quiz/start' element={authUser ? <QuizStart /> : <Navigate to="/login" replace />} />
            <Route path='/resume' element={authUser ? <ResumeLandingPage /> : <Navigate to="/login" replace />} />
            <Route
              path='/resume/selectResume'
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
            <Route path='/resume/resumeForm' element={authUser && resumeData?.title ? <ResumeForm /> : <Navigate to="/resume/selectResume" replace />} />
            <Route path='/aiInterviews' element={authUser ? <AiInterviewLandingPage /> : <Navigate to="/" replace />} />
            <Route path='/aiInterviews/attendInterview' element={authUser ? <AttendInterviews /> : <Navigate to="/" replace />} />

            <Route
              path='/aiInterviews/createInterview'
              element={authUser ? (
                <InterviewsProvider>
                  <CreateInterviewPage />
                </InterviewsProvider>
              ) : (<Navigate to="/" replace />)}
            />

            <Route path='/aiInterviews/createInterview/attandants' element={authUser ? <AttandantPage /> : <Navigate to="/" replace />} />

            <Route path='/interview/result' element={authUser ? <InterviewFeedback /> : <Navigate to="/" replace />} />

            <Route path='/mockInterviewLandingPage' element={authUser ? <MockInterviewLandingPage /> : <Navigate to="/" replace />} />

            <Route path='/profileInterviewForm' element={authUser ? <ProfileInterviewForm /> : <Navigate to="/mockInterviewLandingPage" replace />} />

          </Routes>
        </div>

        <Footer />
      </div>

    </>
  )
}

export default App
