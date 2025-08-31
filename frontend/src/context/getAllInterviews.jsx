import React, { useEffect, useState, createContext, useContext } from 'react';

import axios from 'axios';
import server from '../environment';

const InterviewContext = createContext();

export const InterviewsProvider = ({ children }) => {

  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const { data } = await axios.post(
          `${server}/interview/getAll-Interviews`,
          {},
          {withCredentials : true}
        );

        if (data?.interviews) {
          setInterviews(data.interviews);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchInterviews();
  }, []);

  return(
    <InterviewContext.Provider value={{interviews}}>
      {children}
    </InterviewContext.Provider>
  );

}


export const useGetAllInterviews = () => useContext(InterviewContext);






















