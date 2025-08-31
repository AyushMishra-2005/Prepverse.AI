import React from 'react'
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card.jsx";
import Lottie from 'lottie-react';
import animation from '../assets/animations/aiAssistant.json';

function AssistantPage() {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-indigo-50 relative group/card shadow-2xl shadow-indigo-500/30 dark:bg-gray-900 dark:border-indigo-500/30 border-indigo-200 sm:w-[30rem] rounded-xl p-6 border w-[400px] h-[400px] text-center">
        <CardItem translateZ="100" className="w-full h-86">
          <Lottie 
            animationData={animation} 
            loop={true}
            className="h-76 w-full object-cover rounded-xl group-hover/card:shadow-xl"
          />
        </CardItem>
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          AI Interviewer
        </CardItem>
      </CardBody>
    </CardContainer>
  )
}

export default AssistantPage
