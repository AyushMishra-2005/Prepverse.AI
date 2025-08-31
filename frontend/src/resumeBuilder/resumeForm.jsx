import React, { useState, useRef } from 'react';
import './resume.css';
import { Pen, Palette, Trash2, ArrowDownToLine, ArrowLeft, Save, ArrowRight } from "lucide-react";
import StepProgress from './stepProgress';
import { motion, AnimatePresence, number } from 'framer-motion';

import ProfileInfoForm from './Forms/profileInfoForm.jsx'
import ContactInfoForm from './Forms/contactInfoForm.jsx'
import WorkExperienceForm from './Forms/workExperienceForm.jsx'
import EducationForm from './Forms/educationForm.jsx'
import SkillInfoForm from './Forms/skillInfoForm.jsx'
import ProjectDetailsForm from './Forms/projectDetailsForm.jsx';
import ResumeModal from './resumeModal.jsx';
import useResumeStore from '../stateManage/useResumeStore.js';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import html2pdf from 'html2pdf.js';
import CertificationForm from './Forms/certificationForm.jsx';
import InterestForm from './Forms/interestForm.jsx';
import ResumeTemplateModal from './resumeTemplateModal.jsx';
import axios from 'axios';
import server from '../environment.js'
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react';

import TemplateOne from './resumeTemplates/templateOne.jsx';
import TemplateTwo from './resumeTemplates/templateTwo.jsx';


const formSteps = [
  { component: <ProfileInfoForm />, label: 'Profile Info', progress: 0 },
  { component: <ContactInfoForm />, label: 'Contact Info', progress: 14.29 },
  { component: <WorkExperienceForm />, label: 'Work Experiencec', progress: 14.29 * 2 },
  { component: <EducationForm />, label: 'Education', progress: 14.29 * 3 },
  { component: <SkillInfoForm />, label: 'Skills', progress: 14.29 * 4 },
  { component: <CertificationForm />, label: 'Certifications', progress: 14.29 * 5 },
  { component: <InterestForm />, label: 'Interests', progress: 14.29 * 6 },
  { component: <ProjectDetailsForm />, label: 'Projects', progress: 14.29 * 7 },
];



function ResumeForm() {

  const [direction, setDirection] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const stepProgress = ((currentStep + 1) / formSteps.length) * 100;
  const { resumeData, setResumeData, updateResumeField, selectedResumeId, selectedImageFile, setSelectedImageFile } = useResumeStore();
  const [loading, setLoading] = useState(false);

  const templateRef = useRef();

  const templateData = [
    { component: <TemplateOne ref={templateRef} /> },
    { component: <TemplateTwo ref={templateRef} /> }
  ];

  const [titleOpen, setTitleOpen] = useState(false);
  const [title, setTitle] = useState('');
  const handleOpen = () => setTitleOpen(true);
  const handleClose = () => setTitleOpen(false);
  const handleSubmit = () => {
    setResumeData({
      ...resumeData,
      title: title,
    });
    handleClose();
  }

  const [templateOpen, setTemplateOpen] = useState(false);
  const [template, setTemplate] = useState('');
  const handleTemplateOpen = () => setTemplateOpen(true);
  const handleTemplateClose = () => setTemplateOpen(false);
  const handleTemplateSubmit = (index) => {
    setResumeData({
      ...resumeData,
      template: {
        ...resumeData.template,
        number: index
      }
    });
  }

  const handleNext = () => {
    if (currentStep < formSteps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  }


  const handleDownloadPDF = () => {
    const element = templateRef.current;
    const opt = {
      margin: 0,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: true,
        scrollY: 0
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },

    };

    html2pdf().set(opt).from(element).toPdf().get('pdf').save();
  };

  const handleSave = async () => {
    if (!selectedResumeId) return;

    setLoading(true);

    try {
      if(selectedImageFile && selectedImageFile.name && selectedImageFile.size > 0){

        const { data } = await axios.get(
          `${server}/getImage`,
          {},
          { withCredentials: true }
        );

        const imageFormData = new FormData();
        imageFormData.append("file", selectedImageFile);
        imageFormData.append('api_key', data.apiKey);
        imageFormData.append('timestamp', data.timestamp);
        imageFormData.append('signature', data.signature);

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`;

        const uploadRes = await axios.post(cloudinaryUrl, imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const imageURL = uploadRes.data.secure_url;
        const publicId = uploadRes.data.public_id;

        updateResumeField('profileInfo', 'profilePreviewUrl', imageURL);
        updateResumeField('profileInfo', 'profilePublicId', publicId);
      }

      const resumeDetails = useResumeStore.getState().resumeData;
      const id = selectedResumeId;

      const { data } = await axios.post(
        `${server}/resume/edit-resume`,
        { resumeDetails, id },
        { withCredentials: true }
      );

      setSelectedImageFile(null);

      toast.success("Resume Updated");
    } catch (err) {
      console.log(err);
      toast.error("Error Occurred");
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <div className="gradient-bg min-h-screen w-screen flex flex-col items-center pt-4">
        <div className="w-[90vw] min-h-[72px] bg-gradient-to-r from-[#1f2d3d] via-[#1a2734] to-[#17212b] 
  backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-10 
  flex items-center justify-between px-6 text-white text-lg font-medium mt-[50px]">

          <div className="flex items-center gap-[10px] mr-[20px]">
            <span className="text-white font-semibold text-xl">{resumeData?.title}</span>
            <Pen className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer transition-colors"
              onClick={handleOpen}
            />
          </div>

          <div className="flex items-center gap-4">

            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/30 hover:bg-blue-500/50 text-sm transition-all duration-200 hover:scale-[1.03]"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4 text-blue-100" />
              ) : (
                <>
                  <Save className="w-4 h-4 text-blue-100" />
                  <span className="hidden md:block">Save</span>
                </>
              )}
            </button>

            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition-all duration-200"
              onClick={handleTemplateOpen}
            >
              <Palette className="w-5 h-5 text-white" />
              <span className="hidden md:block">Theme</span>
            </button>

            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-sm transition-all duration-200">
              <Trash2 className="w-5 h-5 text-red-400" />
              <span className="hidden md:block text-red-300">Delete</span>
            </button>

            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-sm transition-all duration-200"
              onClick={handleDownloadPDF}
            >
              <ArrowDownToLine className="w-5 h-5 text-green-400" />
              <span className="hidden md:block text-green-300">Download</span>
            </button>
          </div>
        </div>

        <div className="w-[90vw] flex flex-col lg:flex-row justify-between gap-6 mt-8">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 w-full lg:w-1/2 h-[75vh] min-h-[500px] rounded-2xl shadow-2xl text-white p-4 z-10">
            <div className="flex flex-col justify-between h-full">
              <StepProgress progress={formSteps[currentStep].progress} />

              <div className="flex-grow overflow-y-auto min-h-0 relative overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute w-full"
                  >
                    {formSteps[currentStep].component}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/40 text-sm transition-all duration-200 hover:scale-[1.03] disabled:opacity-30"
                >
                  <ArrowLeft className="w-4 h-4 text-white" />
                  <span className="text-white">Back</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentStep === formSteps.length - 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/40 text-sm transition-all duration-200 hover:scale-[1.03] disabled:opacity-30"
                >
                  <span className="text-white">Next</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>

            </div>

          </div>

          {/* Right Container */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 w-full lg:w-1/2 h-[75vh] min-h-[500px] rounded-2xl shadow-2xl p-6 text-white z-10">
            <div className="overflow-y-auto h-full relative">
              {templateData[resumeData.template.number].component}
            </div>
          </div>
        </div>
      </div>

      <ResumeModal
        open={titleOpen}
        handleClose={handleClose}
        title={title}
        setTitle={setTitle}
        handleSubmit={handleSubmit}
      />

      <ResumeTemplateModal
        open={templateOpen}
        handleClose={handleTemplateClose}
        setTemplate={setTemplate}
        handleSubmit={handleTemplateSubmit}
      />

    </>
  );
}

export default ResumeForm;
