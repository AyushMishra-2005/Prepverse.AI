import React, { useState, useContext } from "react";
import "./interviewPage.css";
import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input.jsx";
import Avatar from "@mui/material/Avatar";
import toast from "react-hot-toast";
import axios from "axios";
import server from "../environment.js";
import useConversation from "../stateManage/useConversation.js";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

function AttendInterviews() {
  const placeholders = ["WhatsApp", "Google", "Microsoft", "Amazon", "TCS"];

  const [search, setSearch] = useState("");
  const [interviews, setInterviews] = useState([]);
  const { setInterviewData, setInterviewModelId } = useConversation();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const handleChange = (e) => setSearch(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!search) return toast.error("Please enter valid search!");

    try {
      const { data } = await axios.post(
        `${server}/interview/search-Interviews`,
        { username: search },
        { withCredentials: true }
      );

      if (data?.interviews) {
        if (data.interviews.length === 0) toast.error("No Interview Found");
        setInterviews(data.interviews);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAttendClick = async (topics, role, numOfQns, interviewId) => {
    try {
      const { data } = await axios.post(
        `${server}/interview/generateInterviewQuestions`,
        { topic: topics, role, numOfQns, interviewId },
        { withCredentials: true }
      );

      if (data?.interviewData) {
        setInterviewData({ topic: topics, role, numOfQns });
        setInterviewModelId(data.interviewData._id);
        navigate("/interviewPage");
      }
    } catch (err) {
      console.log(err);
      const errorMessage =
        err.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className={`w-full min-h-screen flex flex-col items-center relative z-10 ${
        theme === "dark" ? "bg-black" : "bg-gray-50"
      }`}
    >
      <div className="flex flex-col w-full max-w-3xl px-6 mt-[4rem]">
        <h2
          className={`text-2xl sm:text-5xl font-bold text-center mb-5 ${
            theme === "dark"
              ? "text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] to-gray-400"
              : "text-gray-800"
          }`}
        >
          Meet Your AI Interview Coach
        </h2>

        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
      </div>

      <div className="w-full max-w-6xl px-6 mt-16 pb-16">
        <h3
          className={`text-2xl font-semibold mb-6 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Available AI Interviews
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {interviews.map((interview, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 shadow-lg flex flex-col justify-between border transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-900 text-white hover:shadow-[0_0_20px_rgba(255,105,0,0.15)] hover:border-[#ff6900]/30"
                  : "bg-white text-gray-900 border-gray-200 hover:shadow-md"
              }`}
            >
              <div>
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <div className="h-[4rem] w-[4rem] rounded-full overflow-hidden border-2 shadow-sm flex justify-center items-center border-gray-600">
                    <Avatar
                      alt={interview.userId.username}
                      src={
                        interview.userId.profilePicURL ||
                        `https://ui-avatars.com/api/?name=${interview.userId.username}&background=random&color=fff&size=128`
                      }
                      sx={{ width: "4rem", height: "4rem" }}
                    />
                  </div>
                </div>

                <h4 className="text-xl font-bold text-center">
                  {interview.userId.username}
                </h4>
                <p
                  className={`text-sm text-center mb-3 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {interview.interview.role}
                </p>

                {/* Topics */}
                <div className="flex flex-wrap justify-center gap-2 my-2">
                  {interview.interview.topics.map((topic, i) => (
                    <span
                      key={i}
                      className={`text-xs px-3 py-1 rounded-full ${
                        theme === "dark"
                          ? "bg-gray-800 text-gray-200"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <p
                  className={`text-center mt-3 text-sm ${
                    theme === "dark" ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Number of Qns:{" "}
                  <span className="font-medium">
                    {interview.interview.numOfQns}
                  </span>
                </p>
              </div>

              {/* Attend Button */}
              <div className="mt-6">
                <button
                  className={`w-full font-medium text-sm py-2 px-4 rounded-full shadow transition duration-300 cursor-pointer ${
                    theme === "dark"
                      ? "bg-[#ff6900] text-black hover:bg-[#ff7f33]"
                      : "bg-[#ff6900] text-black hover:bg-[#ff7f33]"
                  }`}
                  onClick={() =>
                    handleAttendClick(
                      interview.interview.topics.join(", "),
                      interview.interview.role,
                      interview.interview.numOfQns,
                      interview._id
                    )
                  }
                >
                  Attend
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AttendInterviews;
