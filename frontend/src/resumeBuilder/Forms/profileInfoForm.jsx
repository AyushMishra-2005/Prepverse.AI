import React, { useState } from 'react'
import ImageSelector from '../../components/imageSelector';
import useResumeStore from '../../stateManage/useResumeStore';
import server from '../../environment';
import toast from 'react-hot-toast';
import axios from 'axios';

function ProfileInfoForm() {

  const [imageUrl, setImageUrl] = useState();
  const { resumeData, setResumeData, updateResumeField, selectedResumeId } = useResumeStore();

  const handleProfileImageChange = (imageUrl) => {
    setImageUrl(imageUrl);
    updateResumeField('profileInfo', 'profilePreviewUrl', imageUrl);
  }

  const handleImageRemove = async () => {

    const publicId = resumeData.profileInfo.profilePublicId;

    if (publicId) {
      try {
        const { data } = await axios.post(
          `${server}/deleteImage`,
          { publicId },
          { withCredentials: true }
        );

        if (data.result) {
          updateResumeField('profileInfo', 'profilePreviewUrl', "");
          updateResumeField('profileInfo', 'profilePublicId', "");

          const resumeDetails = useResumeStore.getState().resumeData;;
          const id = selectedResumeId;

          await axios.post(
            `${server}/resume/edit-resume`,
            { resumeDetails, id },
            { withCredentials: true }
          );

          console.log(resumeData);

          toast.success("Image Deleted");
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <div className="space-y-6 p-2">

      <h2 className="text-xl font-semibold text-white mt-2">
        Personal Information
      </h2>

      <ImageSelector
        onImageChange={handleProfileImageChange}
        setImageUrl={resumeData.profileInfo.profilePreviewUrl}
        onImageRemove={() => handleImageRemove()}
      />

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg 
                      text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-blue-500/50 focus:border-transparent transition-all"
            placeholder="John Doe"
            onChange={(e) => {
              updateResumeField('profileInfo', 'fullName', e.target.value);
            }}
            value={resumeData.profileInfo?.fullName}
          />
        </div>

        <div className="flex-1">
          <label htmlFor="designation" className="block text-sm font-medium text-gray-300 mb-1">
            Designation
          </label>
          <input
            type="text"
            id="designation"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg 
                      text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-blue-500/50 focus:border-transparent transition-all"
            placeholder="Frontend Developer"
            onChange={(e) => {
              updateResumeField('profileInfo', 'designation', e.target.value);
            }}
            value={resumeData.profileInfo?.designation}
          />
        </div>
      </div>

      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-300 mb-1">
          Summary
        </label>
        <textarea
          id="summary"
          rows={4}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                    text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-blue-500/50 focus:border-transparent transition-all"
          placeholder="A passionate frontend developer with 5+ years of experience..."
          onChange={(e) => {
            updateResumeField('profileInfo', 'summary', e.target.value);
          }}
          value={resumeData.profileInfo?.summary}
        />
      </div>
    </div>
  )
}

export default ProfileInfoForm