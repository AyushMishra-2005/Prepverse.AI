import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card.jsx";
import useConversation from '../stateManage/useConversation.js';
import { useAuth } from '../context/AuthProvider.jsx';
import EyeContactDetector from '../components/faceDetector.jsx';

function CandidateSection({ startInterview }) {
  const { candidateAnswer } = useConversation();
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const { authUser } = useAuth();

  React.useEffect(() => {
    if (candidateAnswer.trim()) {
      setIsSpeaking(true);
      const timeout = setTimeout(() => setIsSpeaking(false), 500); 
      return () => clearTimeout(timeout);
    }
  }, [candidateAnswer]);

  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-emerald-50 relative group/card shadow-2xl shadow-emerald-500/30 dark:bg-gray-900 dark:border-emerald-500/30 border-emerald-200 sm:w-[30rem] rounded-xl p-6 border w-[400px] h-[400px] text-center">
        <CardItem translateZ="100" className="h-86 w-full">
          <CardItem translateZ="100" className="w-full h-full flex justify-center items-center">
            {startInterview ? (
              <div className="w-full h-full rounded-lg overflow-hidden">
                <EyeContactDetector />
              </div>
            ) : (
              <Avatar
                alt="Candidate"
                src={authUser?.user.profilePicURL}
                sx={{
                  width: 156,
                  height: 156,
                  border: '4px solid',
                  borderColor: '#10B981',
                  transition: 'box-shadow 0.5s ease-in-out',
                  boxShadow: isSpeaking
                    ? '0px 0px 40px 12px rgba(16, 185, 129, 0.7)' 
                    : '0px 4px 20px rgba(16, 185, 129, 0.5)', 
                }}
              />
            )}
          </CardItem>
        </CardItem>
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          {authUser.user.name}
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}

export default CandidateSection;
