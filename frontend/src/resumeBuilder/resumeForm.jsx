

// import React, { useState, useRef, useContext } from 'react';
// import './resume.css';
// import { Pen, Palette, Trash2, ArrowDownToLine, ArrowLeft, Save, ArrowRight } from "lucide-react";
// import StepProgress from './stepProgress';
// import { motion, AnimatePresence } from 'framer-motion';

// import ProfileInfoForm from './Forms/profileInfoForm.jsx';
// import ContactInfoForm from './Forms/contactInfoForm.jsx';
// import WorkExperienceForm from './Forms/workExperienceForm.jsx';
// import EducationForm from './Forms/educationForm.jsx';
// import SkillInfoForm from './Forms/skillInfoForm.jsx';
// import ProjectDetailsForm from './Forms/projectDetailsForm.jsx';
// import ResumeModal from './resumeModal.jsx';
// import useResumeStore from '../stateManage/useResumeStore.js';
// import { jsPDF } from "jspdf";
// import html2pdf from 'html2pdf.js';
// import CertificationForm from './Forms/certificationForm.jsx';
// import InterestForm from './Forms/interestForm.jsx';
// import ResumeTemplateModal from './resumeTemplateModal.jsx';
// import axios from 'axios';
// import server from '../environment.js';
// import { toast } from 'react-hot-toast';
// import { Loader2 } from 'lucide-react';

// import TemplateOne from './resumeTemplates/templateOne.jsx';
// import TemplateTwo from './resumeTemplates/templateTwo.jsx';
// import TemplateThree from './resumeTemplates/templateThree.jsx';
// import TemplateFour from './resumeTemplates/templateFour.jsx';
// import { ThemeContext } from '../context/ThemeContext';

// const formSteps = [
//   { component: <ProfileInfoForm />, label: 'Profile Info', progress: 0 },
//   { component: <ContactInfoForm />, label: 'Contact Info', progress: 14.29 },
//   { component: <WorkExperienceForm />, label: 'Work Experiencec', progress: 14.29 * 2 },
//   { component: <EducationForm />, label: 'Education', progress: 14.29 * 3 },
//   { component: <SkillInfoForm />, label: 'Skills', progress: 14.29 * 4 },
//   { component: <CertificationForm />, label: 'Certifications', progress: 14.29 * 5 },
//   { component: <InterestForm />, label: 'Interests', progress: 14.29 * 6 },
//   { component: <ProjectDetailsForm />, label: 'Projects', progress: 14.29 * 7 },
// ];

// function ResumeForm() {
//   const { theme } = useContext(ThemeContext);
//   const [direction, setDirection] = useState(1);
//   const [currentStep, setCurrentStep] = useState(0);
//   const stepProgress = ((currentStep + 1) / formSteps.length) * 100;
//   const { resumeData, setResumeData, updateResumeField, selectedResumeId, selectedImageFile, setSelectedImageFile } = useResumeStore();
//   const [loading, setLoading] = useState(false);

//   const templateRef = useRef();

//   const templateData = [
//     { component: <TemplateOne ref={templateRef} /> },
//     { component: <TemplateTwo ref={templateRef} /> },
//     { component: <TemplateThree ref={templateRef} /> },
//     { component: <TemplateFour ref={templateRef} /> }
//   ];

//   const [titleOpen, setTitleOpen] = useState(false);
//   const [title, setTitle] = useState('');
//   const handleOpen = () => setTitleOpen(true);
//   const handleClose = () => setTitleOpen(false);
//   const handleSubmit = () => {
//     setResumeData({
//       ...resumeData,
//       title: title,
//     });
//     handleClose();
//   }

//   const [templateOpen, setTemplateOpen] = useState(false);
//   const [template, setTemplate] = useState('');
//   const handleTemplateOpen = () => setTemplateOpen(true);
//   const handleTemplateClose = () => setTemplateOpen(false);
//   const handleTemplateSubmit = (index) => {
//     setResumeData({
//       ...resumeData,
//       template: {
//         ...resumeData.template,
//         number: index
//       }
//     });
//   }

//   const handleNext = () => {
//     if (currentStep < formSteps.length - 1) {
//       setDirection(1);
//       setCurrentStep(currentStep + 1);
//     }
//   }

//   const handleBack = () => {
//     if (currentStep > 0) {
//       setDirection(-1);
//       setCurrentStep(currentStep - 1);
//     }
//   }

//   const handleDownloadPDF = () => {
//     const element = templateRef.current;
//     const opt = {
//       margin: 0,
//       filename: 'resume.pdf',
//       image: { type: 'jpeg', quality: 1 },
//       html2canvas: {
//         scale: 2,
//         useCORS: true,
//         logging: true,
//         scrollY: 0
//       },
//       jsPDF: {
//         unit: 'mm',
//         format: 'a4',
//         orientation: 'portrait',
//       },
//     };

//     html2pdf().set(opt).from(element).toPdf().get('pdf').save();
//   };

//   const handleSave = async () => {
//     if (!selectedResumeId) return;

//     setLoading(true);

//     try {
//       if(selectedImageFile && selectedImageFile.name && selectedImageFile.size > 0){
//         const { data } = await axios.get(
//           `${server}/getImage`,
//           {},
//           { withCredentials: true }
//         );

//         const imageFormData = new FormData();
//         imageFormData.append("file", selectedImageFile);
//         imageFormData.append('api_key', data.apiKey);
//         imageFormData.append('timestamp', data.timestamp);
//         imageFormData.append('signature', data.signature);

//         const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`;

//         const uploadRes = await axios.post(cloudinaryUrl, imageFormData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });

//         const imageURL = uploadRes.data.secure_url;
//         const publicId = uploadRes.data.public_id;

//         updateResumeField('profileInfo', 'profilePreviewUrl', imageURL);
//         updateResumeField('profileInfo', 'profilePublicId', publicId);
//       }

//       const resumeDetails = useResumeStore.getState().resumeData;
//       const id = selectedResumeId;

//       const { data } = await axios.post(
//         `${server}/resume/edit-resume`,
//         { resumeDetails, id },
//         { withCredentials: true }
//       );

//       setSelectedImageFile(null);

//       toast.success("Resume Updated");
//     } catch (err) {
//       console.log(err);
//       toast.error("Error Occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Define theme styles with our brand colors
//   const themeStyles = {
//     dark: {
//       background: '#000000',
//       cardBg: 'rgba(30, 30, 30, 0.9)',
//       cardBorder: '1px solid rgba(255, 255, 255, 0.12)',
//       text: '#ffffff',
//       textMuted: 'rgba(255, 255, 255, 0.7)',
//       // Unified button colors with our theme
//       buttonPrimary: '#ff6900', // Orange
//       buttonPrimaryHover: '#e55d00', // Darker orange on hover
//       buttonPrimaryText: '#ffffff', // White text on orange
//       buttonSecondary: '#ff6900', // Orange for all buttons
//       buttonSecondaryHover: '#e55d00', // Darker orange on hover
//       buttonSecondaryText: '#ffffff', // White text
//       dangerButton: '#ff6900', // Orange for all buttons
//       dangerButtonHover: '#e55d00', // Darker orange on hover
//       dangerButtonText: '#ffffff', // White text
//       successButton: '#ff6900', // Orange for all buttons
//       successButtonHover: '#e55d00', // Darker orange on hover
//       successButtonText: '#ffffff', // White text
//       navbarBg: 'linear-gradient(to right, #0a0a0a, #111111, #0a0a0a)',
//       disabledButton: 'rgba(255, 105, 0, 0.5)', // Semi-transparent orange
//       disabledText: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
//     },
//     light: {
//       background: 'linear-gradient(to bottom, #f9fafb, #f3f4f6)',
//       cardBg: '#ffffff',
//       cardBorder: '1px solid #e5e7eb',
//       text: '#111827',
//       textMuted: '#6b7280',
//       // Unified button colors with our theme
//       buttonPrimary: '#ff6900', // Orange
//       buttonPrimaryHover: '#e55d00', // Darker orange on hover
//       buttonPrimaryText: '#ffffff', // White text on orange
//       buttonSecondary: '#ff6900', // Orange for all buttons
//       buttonSecondaryHover: '#e55d00', // Darker orange on hover
//       buttonSecondaryText: '#ffffff', // White text
//       dangerButton: '#ff6900', // Orange for all buttons
//       dangerButtonHover: '#e55d00', // Darker orange on hover
//       dangerButtonText: '#ffffff', // White text
//       successButton: '#ff6900', // Orange for all buttons
//       successButtonHover: '#e55d00', // Darker orange on hover
//       successButtonText: '#ffffff', // White text
//       navbarBg: 'linear-gradient(to right, #e0f2fe, #dbeafe, #e0e7ff)',
//       disabledButton: 'rgba(255, 105, 0, 0.5)', // Semi-transparent orange
//       disabledText: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white
//     }
//   };

//   const currentTheme = themeStyles[theme] || themeStyles.light;

//   return (
//     <>
//       <div 
//         className="min-h-screen w-screen flex flex-col items-center pt-4"
//         style={{ background: currentTheme.background, color: currentTheme.text }}
//       >
//         <div 
//           className="w-[90vw] min-h-[72px] rounded-xl shadow-2xl z-10 flex items-center justify-between px-6 text-lg font-medium mt-[50px]"
//           style={{ 
//             background: currentTheme.navbarBg,
//             border: currentTheme.cardBorder,
//             color: currentTheme.text
//           }}
//         >

//           <div className="flex items-center gap-[10px] mr-[20px]">
//             <span className="font-semibold text-xl">
//               {resumeData?.title}
//             </span>
//             <Pen 
//               className="w-5 h-5 transition-colors cursor-pointer"
//               style={{ color: currentTheme.textMuted }}
//               onClick={handleOpen}
//             />
//           </div>

//           <div className="flex items-center gap-4">
//             <button
//               className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-[1.03]"
//               style={{ 
//                 background: currentTheme.buttonPrimary,
//                 color: currentTheme.buttonPrimaryText
//               }}
//               onMouseOver={(e) => {
//                 e.target.style.background = currentTheme.buttonPrimaryHover;
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.background = currentTheme.buttonPrimary;
//               }}
//               onClick={handleSave}
//               disabled={loading}
//             >
//               {loading ? (
//                 <Loader2 className="animate-spin w-4 h-4" />
//               ) : (
//                 <>
//                   <Save className="w-4 h-4" />
//                   <span className="hidden md:block">Save</span>
//                 </>
//               )}
//             </button>

//             <button 
//               className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200"
//               style={{ 
//                 background: currentTheme.buttonSecondary,
//                 color: currentTheme.buttonSecondaryText
//               }}
//               onMouseOver={(e) => {
//                 e.target.style.background = currentTheme.buttonSecondaryHover;
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.background = currentTheme.buttonSecondary;
//               }}
//               onClick={handleTemplateOpen}
//             >
//               <Palette className="w-5 h-5" />
//               <span className="hidden md:block">Theme</span>
//             </button>

//             <button 
//               className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200"
//               style={{ 
//                 background: currentTheme.dangerButton,
//                 color: currentTheme.dangerButtonText
//               }}
//               onMouseOver={(e) => {
//                 e.target.style.background = currentTheme.dangerButtonHover;
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.background = currentTheme.dangerButton;
//               }}
//             >
//               <Trash2 className="w-5 h-5" />
//               <span className="hidden md:block">Delete</span>
//             </button>

//             <button 
//               className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200"
//               style={{ 
//                 background: currentTheme.successButton,
//                 color: currentTheme.successButtonText
//               }}
//               onMouseOver={(e) => {
//                 e.target.style.background = currentTheme.successButtonHover;
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.background = currentTheme.successButton;
//               }}
//               onClick={handleDownloadPDF}
//             >
//               <ArrowDownToLine className="w-5 h-5" />
//               <span className="hidden md:block">Download</span>
//             </button>
//           </div>
//         </div>

//         <div className="w-[90vw] flex flex-col lg:flex-row justify-between gap-6 mt-8">
//           <div 
//             className="w-full lg:w-1/2 h-[75vh] min-h-[500px] rounded-2xl shadow-2xl p-4 z-10"
//             style={{ 
//               background: currentTheme.cardBg,
//               border: currentTheme.cardBorder,
//               color: currentTheme.text
//             }}
//           >
//             <div className="flex flex-col justify-between h-full">
//               <StepProgress progress={formSteps[currentStep].progress} theme={theme} />

//               <div className="flex-grow overflow-y-auto min-h-0 relative overflow-hidden">
//                 <AnimatePresence mode="wait" custom={direction}>
//                   <motion.div
//                     key={currentStep}
//                     custom={direction}
//                     initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
//                     transition={{ duration: 0.3, ease: "easeInOut" }}
//                     className="absolute w-full"
//                   >
//                     {formSteps[currentStep].component}
//                   </motion.div>
//                 </AnimatePresence>
//               </div>

//               <div className="flex justify-between items-center mt-6">
//                 <button
//                   onClick={handleBack}
//                   disabled={currentStep === 0}
//                   className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-[1.03]"
//                   style={{ 
//                     background: currentStep === 0 ? currentTheme.disabledButton : currentTheme.buttonSecondary,
//                     color: currentStep === 0 ? currentTheme.disabledText : currentTheme.buttonSecondaryText
//                   }}
//                   onMouseOver={(e) => {
//                     if (currentStep !== 0) {
//                       e.target.style.background = currentTheme.buttonSecondaryHover;
//                     }
//                   }}
//                   onMouseOut={(e) => {
//                     e.target.style.background = currentStep === 0 ? currentTheme.disabledButton : currentTheme.buttonSecondary;
//                   }}
//                 >
//                   <ArrowLeft className="w-4 h-4" />
//                   <span>Back</span>
//                 </button>

//                 <button
//                   onClick={handleNext}
//                   disabled={currentStep === formSteps.length - 1}
//                   className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-[1.03]"
//                   style={{ 
//                     background: currentStep === formSteps.length - 1 ? currentTheme.disabledButton : currentTheme.buttonPrimary,
//                     color: currentStep === formSteps.length - 1 ? currentTheme.disabledText : currentTheme.buttonPrimaryText
//                   }}
//                   onMouseOver={(e) => {
//                     if (currentStep !== formSteps.length - 1) {
//                       e.target.style.background = currentTheme.buttonPrimaryHover;
//                     }
//                   }}
//                   onMouseOut={(e) => {
//                     e.target.style.background = currentStep === formSteps.length - 1 ? currentTheme.disabledButton : currentTheme.buttonPrimary;
//                   }}
//                 >
//                   <span>Next</span>
//                   <ArrowRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Right Container */}
//           <div 
//             className="w-full lg:w-1/2 h-[75vh] min-h-[500px] rounded-2xl shadow-2xl p-6 z-10"
//             style={{ 
//               background: currentTheme.cardBg,
//               border: currentTheme.cardBorder,
//               color: currentTheme.text
//             }}
//           >
//             <div className="overflow-y-auto h-full relative">
//               {templateData[resumeData.template.number].component}
//             </div>
//           </div>
//         </div>
//       </div>

//       <ResumeModal
//         open={titleOpen}
//         handleClose={handleClose}
//         title={title}
//         setTitle={setTitle}
//         handleSubmit={handleSubmit}
//         theme={theme}
//       />

//       <ResumeTemplateModal
//         open={templateOpen}
//         handleClose={handleTemplateClose}
//         setTemplate={setTemplate}
//         handleSubmit={handleTemplateSubmit}
//         theme={theme}
//       />
//     </>
//   );
// }

// export default ResumeForm;










// import React, { useState, useRef, useContext } from 'react';
// import './resume.css';
// import { Pen, Palette, Trash2, ArrowDownToLine, ArrowLeft, Save, ArrowRight } from "lucide-react";
// import StepProgress from './stepProgress';
// import { motion, AnimatePresence } from 'framer-motion';

// import ProfileInfoForm from './Forms/profileInfoForm.jsx';
// import ContactInfoForm from './Forms/contactInfoForm.jsx';
// import WorkExperienceForm from './Forms/workExperienceForm.jsx';
// import EducationForm from './Forms/educationForm.jsx';
// import SkillInfoForm from './Forms/skillInfoForm.jsx';
// import ProjectDetailsForm from './Forms/projectDetailsForm.jsx';
// import ResumeModal from './resumeModal.jsx';
// import useResumeStore from '../stateManage/useResumeStore.js';
// import { jsPDF } from "jspdf";
// import html2pdf from 'html2pdf.js';
// import CertificationForm from './Forms/certificationForm.jsx';
// import InterestForm from './Forms/interestForm.jsx';
// import ResumeTemplateModal from './resumeTemplateModal.jsx';
// import axios from 'axios';
// import server from '../environment.js';
// import { toast } from 'react-hot-toast';
// import { Loader2 } from 'lucide-react';

// import TemplateOne from './resumeTemplates/templateOne.jsx';
// import TemplateTwo from './resumeTemplates/templateTwo.jsx';
// import TemplateThree from './resumeTemplates/templateThree.jsx';
// import TemplateFour from './resumeTemplates/templateFour.jsx';
// import { ThemeContext } from '../context/ThemeContext';

// const formSteps = [
//   { component: <ProfileInfoForm />, label: 'Profile Info', progress: 0 },
//   { component: <ContactInfoForm />, label: 'Contact Info', progress: 14.29 },
//   { component: <WorkExperienceForm />, label: 'Work Experiencec', progress: 14.29 * 2 },
//   { component: <EducationForm />, label: 'Education', progress: 14.29 * 3 },
//   { component: <SkillInfoForm />, label: 'Skills', progress: 14.29 * 4 },
//   { component: <CertificationForm />, label: 'Certifications', progress: 14.29 * 5 },
//   { component: <InterestForm />, label: 'Interests', progress: 14.29 * 6 },
//   { component: <ProjectDetailsForm />, label: 'Projects', progress: 14.29 * 7 },
// ];

// function ResumeForm() {
//   const { theme } = useContext(ThemeContext);
//   const [direction, setDirection] = useState(1);
//   const [currentStep, setCurrentStep] = useState(0);
//   const stepProgress = ((currentStep + 1) / formSteps.length) * 100;
//   const { resumeData, setResumeData, updateResumeField, selectedResumeId, selectedImageFile, setSelectedImageFile } = useResumeStore();
//   const [loading, setLoading] = useState(false);

//   const templateRef = useRef();

//   const templateData = [
//     { component: <TemplateOne ref={templateRef} /> },
//     { component: <TemplateTwo ref={templateRef} /> },
//     { component: <TemplateThree ref={templateRef} /> },
//     { component: <TemplateFour ref={templateRef} /> }
//   ];

//   const [titleOpen, setTitleOpen] = useState(false);
//   const [title, setTitle] = useState('');
//   const handleOpen = () => setTitleOpen(true);
//   const handleClose = () => setTitleOpen(false);
//   const handleSubmit = () => {
//     setResumeData({
//       ...resumeData,
//       title: title,
//     });
//     handleClose();
//   }

//   const [templateOpen, setTemplateOpen] = useState(false);
//   const [template, setTemplate] = useState('');
//   const handleTemplateOpen = () => setTemplateOpen(true);
//   const handleTemplateClose = () => setTemplateOpen(false);
//   const handleTemplateSubmit = (index) => {
//     setResumeData({
//       ...resumeData,
//       template: {
//         ...resumeData.template,
//         number: index
//       }
//     });
//   }

//   const handleNext = () => {
//     if (currentStep < formSteps.length - 1) {
//       setDirection(1);
//       setCurrentStep(currentStep + 1);
//     }
//   }

//   const handleBack = () => {
//     if (currentStep > 0) {
//       setDirection(-1);
//       setCurrentStep(currentStep - 1);
//     }
//   }

//   const handleDownloadPDF = () => {
//     const element = templateRef.current;
//     const opt = {
//       margin: 0,
//       filename: 'resume.pdf',
//       image: { type: 'jpeg', quality: 1 },
//       html2canvas: {
//         scale: 2,
//         useCORS: true,
//         logging: true,
//         scrollY: 0
//       },
//       jsPDF: {
//         unit: 'mm',
//         format: 'a4',
//         orientation: 'portrait',
//       },
//     };

//     html2pdf().set(opt).from(element).toPdf().get('pdf').save();
//   };

//   const handleSave = async () => {
//     if (!selectedResumeId) return;

//     setLoading(true);

//     try {
//       if(selectedImageFile && selectedImageFile.name && selectedImageFile.size > 0){
//         const { data } = await axios.get(
//           `${server}/getImage`,
//           {},
//           { withCredentials: true }
//         );

//         const imageFormData = new FormData();
//         imageFormData.append("file", selectedImageFile);
//         imageFormData.append('api_key', data.apiKey);
//         imageFormData.append('timestamp', data.timestamp);
//         imageFormData.append('signature', data.signature);

//         const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`;

//         const uploadRes = await axios.post(cloudinaryUrl, imageFormData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });

//         const imageURL = uploadRes.data.secure_url;
//         const publicId = uploadRes.data.public_id;

//         updateResumeField('profileInfo', 'profilePreviewUrl', imageURL);
//         updateResumeField('profileInfo', 'profilePublicId', publicId);
//       }

//       const resumeDetails = useResumeStore.getState().resumeData;
//       const id = selectedResumeId;

//       const { data } = await axios.post(
//         `${server}/resume/edit-resume`,
//         { resumeDetails, id },
//         { withCredentials: true }
//       );

//       setSelectedImageFile(null);

//       toast.success("Resume Updated");
//     } catch (err) {
//       console.log(err);
//       toast.error("Error Occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Define theme styles with our brand colors
//   const themeStyles = {
//     dark: {
//       background: '#000000',
//       cardBg: '#1a1a1a',
//       cardBorder: '1px solid #333333',
//       text: '#ffffff',
//       textMuted: 'rgba(255, 255, 255, 0.7)',
//       // Unified button colors with our theme
//       buttonPrimary: '#ff6900', // Orange
//       buttonPrimaryHover: '#e55d00', // Darker orange on hover
//       buttonPrimaryText: '#ffffff', // White text on orange
//       buttonSecondary: '#ff6900', // Orange for all buttons
//       buttonSecondaryHover: '#e55d00', // Darker orange on hover
//       buttonSecondaryText: '#ffffff', // White text
//       dangerButton: '#ff6900', // Orange for all buttons
//       dangerButtonHover: '#e55d00', // Darker orange on hover
//       dangerButtonText: '#ffffff', // White text
//       successButton: '#ff6900', // Orange for all buttons
//       successButtonHover: '#e55d00', // Darker orange on hover
//       successButtonText: '#ffffff', // White text
//       navbarBg: '#000000',
//       disabledButton: 'rgba(255, 105, 0, 0.5)', // Semi-transparent orange
//       disabledText: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
//     },
//     light: {
//       background: '#ffffff',
//       cardBg: '#ffffff',
//       cardBorder: '1px solid #e5e7eb',
//       text: '#000000',
//       textMuted: '#4b5563',
//       // Unified button colors with our theme
//       buttonPrimary: '#ff6900', // Orange
//       buttonPrimaryHover: '#e55d00', // Darker orange on hover
//       buttonPrimaryText: '#ffffff', // White text on orange
//       buttonSecondary: '#ff6900', // Orange for all buttons
//       buttonSecondaryHover: '#e55d00', // Darker orange on hover
//       buttonSecondaryText: '#ffffff', // White text
//       dangerButton: '#ff6900', // Orange for all buttons
//       dangerButtonHover: '#e55d00', // Darker orange on hover
//       dangerButtonText: '#ffffff', // White text
//       successButton: '#ff6900', // Orange for all buttons
//       successButtonHover: '#e55d00', // Darker orange on hover
//       successButtonText: '#ffffff', // White text
//       navbarBg: '#ffffff',
//       disabledButton: 'rgba(255, 105, 0, 0.5)', // Semi-transparent orange
//       disabledText: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white
//     }
//   };

//   const currentTheme = themeStyles[theme] || themeStyles.light;

//   return (
//     <>
//       <div 
//         className="min-h-screen w-screen flex flex-col items-center pt-4"
//         style={{ background: currentTheme.background, color: currentTheme.text }}
//       >
//         <div 
//           className="w-[90vw] min-h-[72px] rounded-xl shadow-2xl z-10 flex items-center justify-between px-6 text-lg font-medium mt-[50px]"
//           style={{ 
//             background: currentTheme.navbarBg,
//             border: currentTheme.cardBorder,
//             color: currentTheme.text
//           }}
//         >

//           <div className="flex items-center gap-[10px] mr-[20px]">
//             <span className="font-semibold text-xl" style={{ color: '#ff6900' }}>
//               {resumeData?.title || 'Resume'}
//             </span>
//             <Pen 
//               className="w-5 h-5 transition-colors cursor-pointer"
//               style={{ color: '#ff6900' }}
//               onClick={handleOpen}
//             />
//           </div>

//           <div className="flex items-center gap-4">
//             <button
//               className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-[1.03]"
//               style={{ 
//                 background: '#ff6900',
//                 color: '#ffffff',
//                 border: 'none'
//               }}
//               onMouseOver={(e) => {
//                 e.target.style.background = '#e55d00';
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.background = '#ff6900';
//               }}
//               onClick={handleSave}
//               disabled={loading}
//             >
//               {loading ? (
//                 <Loader2 className="animate-spin w-4 h-4" />
//               ) : (
//                 <>
//                   <Save className="w-4 h-4" />
//                   <span className="hidden md:block">Save</span>
//                 </>
//               )}
//             </button>

//             <button 
//               className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200"
//               style={{ 
//                 background: '#ff6900',
//                 color: '#ffffff',
//                 border: 'none'
//               }}
//               onMouseOver={(e) => {
//                 e.target.style.background = '#e55d00';
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.background = '#ff6900';
//               }}
//               onClick={handleTemplateOpen}
//             >
//               <Palette className="w-5 h-5" />
//               <span className="hidden md:block">Theme</span>
//             </button>

//             <button 
//               className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200"
//               style={{ 
//                 background: '#ff6900',
//                 color: '#ffffff',
//                 border: 'none'
//               }}
//               onMouseOver={(e) => {
//                 e.target.style.background = '#e55d00';
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.background = '#ff6900';
//               }}
//             >
//               <Trash2 className="w-5 h-5" />
//               <span className="hidden md:block">Delete</span>
//             </button>

//             <button 
//               className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200"
//               style={{ 
//                 background: '#ff6900',
//                 color: '#ffffff',
//                 border: 'none'
//               }}
//               onMouseOver={(e) => {
//                 e.target.style.background = '#e55d00';
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.background = '#ff6900';
//               }}
//               onClick={handleDownloadPDF}
//             >
//               <ArrowDownToLine className="w-5 h-5" />
//               <span className="hidden md:block">Download</span>
//             </button>
//           </div>
//         </div>

//         <div className="w-[90vw] flex flex-col lg:flex-row justify-between gap-6 mt-8">
//           <div 
//             className="w-full lg:w-1/2 h-[75vh] min-h-[500px] rounded-2xl shadow-2xl p-4 z-10"
//             style={{ 
//               background: currentTheme.cardBg,
//               border: currentTheme.cardBorder,
//               color: currentTheme.text
//             }}
//           >
//             <div className="flex flex-col justify-between h-full">
//               <StepProgress progress={formSteps[currentStep].progress} theme={theme} />

//               <div className="flex-grow overflow-y-auto min-h-0 relative overflow-hidden">
//                 <AnimatePresence mode="wait" custom={direction}>
//                   <motion.div
//                     key={currentStep}
//                     custom={direction}
//                     initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
//                     transition={{ duration: 0.3, ease: "easeInOut" }}
//                     className="absolute w-full"
//                   >
//                     {formSteps[currentStep].component}
//                   </motion.div>
//                 </AnimatePresence>
//               </div>

//               <div className="flex justify-between items-center mt-6">
//                 <button
//                   onClick={handleBack}
//                   disabled={currentStep === 0}
//                   className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-[1.03]"
//                   style={{ 
//                     background: currentStep === 0 ? 'rgba(255, 105, 0, 0.5)' : '#ff6900',
//                     color: '#ffffff',
//                     border: 'none'
//                   }}
//                   onMouseOver={(e) => {
//                     if (currentStep !== 0) {
//                       e.target.style.background = '#e55d00';
//                     }
//                   }}
//                   onMouseOut={(e) => {
//                     e.target.style.background = currentStep === 0 ? 'rgba(255, 105, 0, 0.5)' : '#ff6900';
//                   }}
//                 >
//                   <ArrowLeft className="w-4 h-4" />
//                   <span>Back</span>
//                 </button>

//                 <button
//                   onClick={handleNext}
//                   disabled={currentStep === formSteps.length - 1}
//                   className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-[1.03]"
//                   style={{ 
//                     background: currentStep === formSteps.length - 1 ? 'rgba(255, 105, 0, 0.5)' : '#ff6900',
//                     color: '#ffffff',
//                     border: 'none'
//                   }}
//                   onMouseOver={(e) => {
//                     if (currentStep !== formSteps.length - 1) {
//                       e.target.style.background = '#e55d00';
//                     }
//                   }}
//                   onMouseOut={(e) => {
//                     e.target.style.background = currentStep === formSteps.length - 1 ? 'rgba(255, 105, 0, 0.5)' : '#ff6900';
//                   }}
//                 >
//                   <span>Next</span>
//                   <ArrowRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Right Container */}
//           <div 
//             className="w-full lg:w-1/2 h-[75vh] min-h-[500px] rounded-2xl shadow-2xl p-6 z-10"
//             style={{ 
//               background: currentTheme.cardBg,
//               border: currentTheme.cardBorder,
//               color: currentTheme.text
//             }}
//           >
//             <div className="overflow-y-auto h-full relative">
//               {templateData[resumeData.template.number].component}
//             </div>
//           </div>
//         </div>
//       </div>

//       <ResumeModal
//         open={titleOpen}
//         handleClose={handleClose}
//         title={title}
//         setTitle={setTitle}
//         handleSubmit={handleSubmit}
//         theme={theme}
//       />

//       <ResumeTemplateModal
//         open={templateOpen}
//         handleClose={handleTemplateClose}
//         setTemplate={setTemplate}
//         handleSubmit={handleTemplateSubmit}
//         theme={theme}
//       />
//     </>
//   );
// }

// export default ResumeForm;







// import React, { useState, useRef, useContext } from 'react';
// import './resume.css';
// import { Pen, Palette, Trash2, ArrowDownToLine, ArrowLeft, Save, ArrowRight } from "lucide-react";
// import StepProgress from './stepProgress';
// import { motion, AnimatePresence } from 'framer-motion';

// import ProfileInfoForm from './Forms/profileInfoForm.jsx';
// import ContactInfoForm from './Forms/contactInfoForm.jsx';
// import WorkExperienceForm from './Forms/workExperienceForm.jsx';
// import EducationForm from './Forms/educationForm.jsx';
// import SkillInfoForm from './Forms/skillInfoForm.jsx';
// import ProjectDetailsForm from './Forms/projectDetailsForm.jsx';
// import ResumeModal from './resumeModal.jsx';
// import useResumeStore from '../stateManage/useResumeStore.js';
// import { jsPDF } from "jspdf";
// import html2pdf from 'html2pdf.js';
// import CertificationForm from './Forms/certificationForm.jsx';
// import InterestForm from './Forms/interestForm.jsx';
// import ResumeTemplateModal from './resumeTemplateModal.jsx';
// import axios from 'axios';
// import server from '../environment.js';
// import { toast } from 'react-hot-toast';
// import { Loader2 } from 'lucide-react';

// import TemplateOne from './resumeTemplates/templateOne.jsx';
// import TemplateTwo from './resumeTemplates/templateTwo.jsx';
// import TemplateThree from './resumeTemplates/templateThree.jsx';
// import TemplateFour from './resumeTemplates/templateFour.jsx';
// import { ThemeContext } from '../context/ThemeContext';

// const formSteps = [
//   { component: <ProfileInfoForm />, label: 'Profile Info', progress: 0 },
//   { component: <ContactInfoForm />, label: 'Contact Info', progress: 14.29 },
//   { component: <WorkExperienceForm />, label: 'Work Experiencec', progress: 14.29 * 2 },
//   { component: <EducationForm />, label: 'Education', progress: 14.29 * 3 },
//   { component: <SkillInfoForm />, label: 'Skills', progress: 14.29 * 4 },
//   { component: <CertificationForm />, label: 'Certifications', progress: 14.29 * 5 },
//   { component: <InterestForm />, label: 'Interests', progress: 14.29 * 6 },
//   { component: <ProjectDetailsForm />, label: 'Projects', progress: 14.29 * 7 },
// ];

// function ResumeForm() {
//   const { theme } = useContext(ThemeContext);
//   const [direction, setDirection] = useState(1);
//   const [currentStep, setCurrentStep] = useState(0);
//   const stepProgress = ((currentStep + 1) / formSteps.length) * 100;
//   const { resumeData, setResumeData, updateResumeField, selectedResumeId, selectedImageFile, setSelectedImageFile } = useResumeStore();
//   const [loading, setLoading] = useState(false);

//   const templateRef = useRef();

//   const templateData = [
//     { component: <TemplateOne ref={templateRef} /> },
//     { component: <TemplateTwo ref={templateRef} /> },
//     { component: <TemplateThree ref={templateRef} /> },
//     { component: <TemplateFour ref={templateRef} /> }
//   ];

//   const [titleOpen, setTitleOpen] = useState(false);
//   const [title, setTitle] = useState('');
//   const handleOpen = () => setTitleOpen(true);
//   const handleClose = () => setTitleOpen(false);
//   const handleSubmit = () => {
//     setResumeData({
//       ...resumeData,
//       title: title,
//     });
//     handleClose();
//   }

//   const [templateOpen, setTemplateOpen] = useState(false);
//   const [template, setTemplate] = useState('');
//   const handleTemplateOpen = () => setTemplateOpen(true);
//   const handleTemplateClose = () => setTemplateOpen(false);
//   const handleTemplateSubmit = (index) => {
//     setResumeData({
//       ...resumeData,
//       template: {
//         ...resumeData.template,
//         number: index
//       }
//     });
//   }

//   const handleNext = () => {
//     if (currentStep < formSteps.length - 1) {
//       setDirection(1);
//       setCurrentStep(currentStep + 1);
//     }
//   }

//   const handleBack = () => {
//     if (currentStep > 0) {
//       setDirection(-1);
//       setCurrentStep(currentStep - 1);
//     }
//   }

//   const handleDownloadPDF = () => {
//     const element = templateRef.current;
//     const opt = {
//       margin: 0,
//       filename: 'resume.pdf',
//       image: { type: 'jpeg', quality: 1 },
//       html2canvas: {
//         scale: 2,
//         useCORS: true,
//         logging: true,
//         scrollY: 0
//       },
//       jsPDF: {
//         unit: 'mm',
//         format: 'a4',
//         orientation: 'portrait',
//       },
//     };

//     html2pdf().set(opt).from(element).toPdf().get('pdf').save();
//   };

//   const handleSave = async () => {
//     if (!selectedResumeId) return;

//     setLoading(true);

//     try {
//       if(selectedImageFile && selectedImageFile.name && selectedImageFile.size > 0){
//         const { data } = await axios.get(
//           `${server}/getImage`,
//           {},
//           { withCredentials: true }
//         );

//         const imageFormData = new FormData();
//         imageFormData.append("file", selectedImageFile);
//         imageFormData.append('api_key', data.apiKey);
//         imageFormData.append('timestamp', data.timestamp);
//         imageFormData.append('signature', data.signature);

//         const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`;

//         const uploadRes = await axios.post(cloudinaryUrl, imageFormData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });

//         const imageURL = uploadRes.data.secure_url;
//         const publicId = uploadRes.data.public_id;

//         updateResumeField('profileInfo', 'profilePreviewUrl', imageURL);
//         updateResumeField('profileInfo', 'profilePublicId', publicId);
//       }

//       const resumeDetails = useResumeStore.getState().resumeData;
//       const id = selectedResumeId;

//       const { data } = await axios.post(
//         `${server}/resume/edit-resume`,
//         { resumeDetails, id },
//         { withCredentials: true }
//       );

//       setSelectedImageFile(null);

//       toast.success("Resume Updated");
//     } catch (err) {
//       console.log(err);
//       toast.error("Error Occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Define theme styles with our brand colors
//   const themeStyles = {
//     dark: {
//       background: '#000000',
//       cardBg: '#1a1a1a',
//       cardBorder: '1px solid #333333',
//       text: '#ffffff',
//       textMuted: 'rgba(255, 255, 255, 0.7)',
//       // Unified button colors with our theme
//       buttonPrimary: '#ff6900', // Orange
//       buttonPrimaryHover: '#e55d00', // Darker orange on hover
//       buttonPrimaryText: '#ffffff', // White text on orange
//       buttonSecondary: '#ff6900', // Orange for all buttons
//       buttonSecondaryHover: '#e55d00', // Darker orange on hover
//       buttonSecondaryText: '#ffffff', // White text
//       dangerButton: '#ff6900', // Orange for all buttons
//       dangerButtonHover: '#e55d00', // Darker orange on hover
//       dangerButtonText: '#ffffff', // White text
//       successButton: '#ff6900', // Orange for all buttons
//       successButtonHover: '#e55d00', // Darker orange on hover
//       successButtonText: '#ffffff', // White text
//       navbarBg: '#000000',
//       disabledButton: 'rgba(255, 105, 0, 0.5)', // Semi-transparent orange
//       disabledText: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
//       // Scrollbar colors
//       scrollbarTrack: '#000000',
//       scrollbarThumb: '#ff6900',
//       scrollbarThumbHover: '#e55d00',
//     },
//     light: {
//       background: '#ffffff',
//       cardBg: '#ffffff',
//       cardBorder: '1px solid #e5e7eb',
//       text: '#000000',
//       textMuted: '#4b5563',
//       // Unified button colors with our theme
//       buttonPrimary: '#ff6900', // Orange
//       buttonPrimaryHover: '#e55d00', // Darker orange on hover
//       buttonPrimaryText: '#ffffff', // White text on orange
//       buttonSecondary: '#ff6900', // Orange for all buttons
//       buttonSecondaryHover: '#e55d00', // Darker orange on hover
//       buttonSecondaryText: '#ffffff', // White text
//       dangerButton: '#ff6900', // Orange for all buttons
//       dangerButtonHover: '#e55d00', // Darker orange on hover
//       dangerButtonText: '#ffffff', // White text
//       successButton: '#ff6900', // Orange for all buttons
//       successButtonHover: '#e55d00', // Darker orange on hover
//       successButtonText: '#ffffff', // White text
//       navbarBg: '#ffffff',
//       disabledButton: 'rgba(255, 105, 0, 0.5)', // Semi-transparent orange
//       disabledText: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white
//       // Scrollbar colors
//       scrollbarTrack: '#ffffff',
//       scrollbarThumb: '#ff6900',
//       scrollbarThumbHover: '#e55d00',
//     }
//   };

//   const currentTheme = themeStyles[theme] || themeStyles.light;

//   return (
//     <>
//       <style>
//         {`
//           /* Custom scrollbar styling */
//           ::-webkit-scrollbar {
//             width: 8px;
//             height: 8px;
//           }
          
//           ::-webkit-scrollbar-track {
//             background: ${currentTheme.scrollbarTrack};
//           }
          
//           ::-webkit-scrollbar-thumb {
//             background: ${currentTheme.scrollbarThumb};
//             border-radius: 4px;
//           }
          
//           ::-webkit-scrollbar-thumb:hover {
//             background: ${currentTheme.scrollbarThumbHover};
//           }
          
//           /* For Firefox */
//           * {
//             scrollbar-width: thin;
//             scrollbar-color: ${currentTheme.scrollbarThumb} ${currentTheme.scrollbarTrack};
//           }
//         `}
//       </style>
      
//       <div 
//         className="min-h-screen w-screen flex flex-col items-center pt-4"
//         style={{ background: currentTheme.background, color: currentTheme.text }}
//       >
//         <div 
//           className="w-[90vw] min-h-[72px] rounded-xl shadow-2xl z-10 flex items-center justify-between px-6 text-lg font-medium mt-[50px]"
//           style={{ 
//             background: currentTheme.navbarBg,
//             border: currentTheme.cardBorder,
//             color: currentTheme.text
//           }}
//         >

//           <div className="flex items-center gap-[10px] mr-[20px]">
//             <span className="font-semibold text-xl" style={{ color: '#ff6900' }}>
//               {resumeData?.title || 'Resume'}
//             </span>
//             <Pen 
//               className="w-5 h-5 transition-colors cursor-pointer"
//               style={{ color: '#ff6900' }}
//               onClick={handleOpen}
//             />
//           </div>

//           <div className="flex items-center gap-4">
//             <button
//               className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-[1.03]"
//               style={{ 
//                 background: '#ff6900',
//                 color: '#ffffff',
//                 border: 'none'
//               }}
//               onMouseOver={(e) => {
//                 e.target.style.background = '#e55d00';
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.background = '#ff6900';
//               }}
//               onClick={handleSave}
//               disabled={loading}
//             >
//               {loading ? (
//                 <Loader2 className="animate-spin w-4 h-4" />
//               ) : (
//                 <>
//                   <Save className="w-4 h-4" />
//                   <span className="hidden md:block">Save</span>
//                 </>
//               )}
//             </button>

//             <button 
//               className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200"
//               style={{ 
//                 background: '#ff6900',
//                 color: '#ffffff',
//                 border: 'none'
//               }}
//               onMouseOver={(e) => {
//                 e.target.style.background = '#e55d00';
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.background = '#ff6900';
//               }}
//               onClick={handleTemplateOpen}
//             >
//               <Palette className="w-5 h-5" />
//               <span className="hidden md:block">Theme</span>
//             </button>

//             <button 
//               className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200"
//               style={{ 
//                 background: '#ff6900',
//                 color: '#ffffff',
//                 border: 'none'
//               }}
//               onMouseOver={(e) => {
//                 e.target.style.background = '#e55d00';
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.background = '#ff6900';
//               }}
//             >
//               <Trash2 className="w-5 h-5" />
//               <span className="hidden md:block">Delete</span>
//             </button>

//             <button 
//               className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200"
//               style={{ 
//                 background: '#ff6900',
//                 color: '#ffffff',
//                 border: 'none'
//               }}
//               onMouseOver={(e) => {
//                 e.target.style.background = '#e55d00';
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.background = '#ff6900';
//               }}
//               onClick={handleDownloadPDF}
//             >
//               <ArrowDownToLine className="w-5 h-5" />
//               <span className="hidden md:block">Download</span>
//             </button>
//           </div>
//         </div>

//         <div className="w-[90vw] flex flex-col lg:flex-row justify-between gap-6 mt-8">
//           <div 
//             className="w-full lg:w-1/2 h-[75vh] min-h-[500px] rounded-2xl shadow-2xl p-4 z-10"
//             style={{ 
//               background: currentTheme.cardBg,
//               border: currentTheme.cardBorder,
//               color: currentTheme.text
//             }}
//           >
//             <div className="flex flex-col justify-between h-full">
//               <StepProgress progress={formSteps[currentStep].progress} theme={theme} />

//               <div className="flex-grow overflow-y-auto min-h-0 relative overflow-hidden">
//                 <AnimatePresence mode="wait" custom={direction}>
//                   <motion.div
//                     key={currentStep}
//                     custom={direction}
//                     initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
//                     transition={{ duration: 0.3, ease: "easeInOut" }}
//                     className="absolute w-full"
//                   >
//                     {formSteps[currentStep].component}
//                   </motion.div>
//                 </AnimatePresence>
//               </div>

//               <div className="flex justify-between items-center mt-6">
//                 <button
//                   onClick={handleBack}
//                   disabled={currentStep === 0}
//                   className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-[1.03]"
//                   style={{ 
//                     background: currentStep === 0 ? 'rgba(255, 105, 0, 0.5)' : '#ff6900',
//                     color: '#ffffff',
//                     border: 'none'
//                   }}
//                   onMouseOver={(e) => {
//                     if (currentStep !== 0) {
//                       e.target.style.background = '#e55d00';
//                     }
//                   }}
//                   onMouseOut={(e) => {
//                     e.target.style.background = currentStep === 0 ? 'rgba(255, 105, 0, 0.5)' : '#ff6900';
//                   }}
//                 >
//                   <ArrowLeft className="w-4 h-4" />
//                   <span>Back</span>
//                 </button>

//                 <button
//                   onClick={handleNext}
//                   disabled={currentStep === formSteps.length - 1}
//                   className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-[1.03]"
//                   style={{ 
//                     background: currentStep === formSteps.length - 1 ? 'rgba(255, 105, 0, 0.5)' : '#ff6900',
//                     color: '#ffffff',
//                     border: 'none'
//                   }}
//                   onMouseOver={(e) => {
//                     if (currentStep !== formSteps.length - 1) {
//                       e.target.style.background = '#e55d00';
//                     }
//                   }}
//                   onMouseOut={(e) => {
//                     e.target.style.background = currentStep === formSteps.length - 1 ? 'rgba(255, 105, 0, 0.5)' : '#ff6900';
//                   }}
//                 >
//                   <span>Next</span>
//                   <ArrowRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Right Container */}
//           <div 
//             className="w-full lg:w-1/2 h-[75vh] min-h-[500px] rounded-2xl shadow-2xl p-6 z-10"
//             style={{ 
//               background: currentTheme.cardBg,
//               border: currentTheme.cardBorder,
//               color: currentTheme.text
//             }}
//           >
//             <div className="overflow-y-auto h-full relative">
//               {templateData[resumeData.template.number].component}
//             </div>
//           </div>
//         </div>
//       </div>

//       <ResumeModal
//         open={titleOpen}
//         handleClose={handleClose}
//         title={title}
//         setTitle={setTitle}
//         handleSubmit={handleSubmit}
//         theme={theme}
//       />

//       <ResumeTemplateModal
//         open={templateOpen}
//         handleClose={handleTemplateClose}
//         setTemplate={setTemplate}
//         handleSubmit={handleTemplateSubmit}
//         theme={theme}
//       />
//     </>
//   );
// }

// export default ResumeForm;


import React, { useState, useRef, useContext } from 'react';
import './resume.css';
import { Pen, Palette, Trash2, ArrowDownToLine, ArrowLeft, Save, ArrowRight } from "lucide-react";
import StepProgress from './stepProgress';
import { motion, AnimatePresence } from 'framer-motion';

import ProfileInfoForm from './Forms/profileInfoForm.jsx';
import ContactInfoForm from './Forms/contactInfoForm.jsx';
import WorkExperienceForm from './Forms/workExperienceForm.jsx';
import EducationForm from './Forms/educationForm.jsx';
import SkillInfoForm from './Forms/skillInfoForm.jsx';
import ProjectDetailsForm from './Forms/projectDetailsForm.jsx';
import ResumeModal from './resumeModal.jsx';
import useResumeStore from '../stateManage/useResumeStore.js';
import { jsPDF } from "jspdf";
import html2pdf from 'html2pdf.js';
import CertificationForm from './Forms/certificationForm.jsx';
import InterestForm from './Forms/interestForm.jsx';
import ResumeTemplateModal from './resumeTemplateModal.jsx';
import axios from 'axios';
import server from '../environment.js';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import TemplateOne from './resumeTemplates/templateOne.jsx';
import TemplateTwo from './resumeTemplates/templateTwo.jsx';
import TemplateThree from './resumeTemplates/templateThree.jsx';
import TemplateFour from './resumeTemplates/templateFour.jsx';
import { ThemeContext } from '../context/ThemeContext';

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
  const { theme } = useContext(ThemeContext);
  const [direction, setDirection] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const stepProgress = ((currentStep + 1) / formSteps.length) * 100;
  const { resumeData, setResumeData, updateResumeField, selectedResumeId, selectedImageFile, setSelectedImageFile } = useResumeStore();
  const [loading, setLoading] = useState(false);

  const templateRef = useRef();

  const templateData = [
    { component: <TemplateOne ref={templateRef} /> },
    { component: <TemplateTwo ref={templateRef} /> },
    { component: <TemplateThree ref={templateRef} /> },
    { component: <TemplateFour ref={templateRef} /> }
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

  // Define theme styles with our brand colors
  const themeStyles = {
    dark: {
      background: '#000000',
      cardBg: '#1a1a1a',
      cardBorder: '1px solid #333333',
      text: '#ffffff',
      textMuted: 'rgba(255, 255, 255, 0.7)',
      // Unified button colors with our theme
      buttonPrimary: '#ff6900', // Orange
      buttonPrimaryHover: '#e55d00', // Darker orange on hover
      buttonPrimaryText: '#ffffff', // White text on orange
      buttonSecondary: '#ff6900', // Orange for all buttons
      buttonSecondaryHover: '#e55d00', // Darker orange on hover
      buttonSecondaryText: '#ffffff', // White text
      dangerButton: '#ff6900', // Orange for all buttons
      dangerButtonHover: '#e55d00', // Darker orange on hover
      dangerButtonText: '#ffffff', // White text
      successButton: '#ff6900', // Orange for all buttons
      successButtonHover: '#e55d00', // Darker orange on hover
      successButtonText: '#ffffff', // White text
      navbarBg: '#000000',
      disabledButton: 'rgba(255, 105, 0, 0.5)', // Semi-transparent orange
      disabledText: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
      // Scrollbar colors - updated to gray
      scrollbarTrack: '#1a1a1a',
      scrollbarThumb: '#888',
      scrollbarThumbHover: '#666',
    },
    light: {
      background: '#ffffff',
      cardBg: '#ffffff',
      cardBorder: '1px solid #e5e7eb',
      text: '#000000',
      textMuted: '#4b5563',
      // Unified button colors with our theme
      buttonPrimary: '#ff6900', // Orange
      buttonPrimaryHover: '#e55d00', // Darker orange on hover
      buttonPrimaryText: '#ffffff', // White text on orange
      buttonSecondary: '#ff6900', // Orange for all buttons
      buttonSecondaryHover: '#e55d00', // Darker orange on hover
      buttonSecondaryText: '#ffffff', // White text
      dangerButton: '#ff6900', // Orange for all buttons
      dangerButtonHover: '#e55d00', // Darker orange on hover
      dangerButtonText: '#ffffff', // White text
      successButton: '#ff6900', // Orange for all buttons
      successButtonHover: '#e55d00', // Darker orange on hover
      successButtonText: '#ffffff', // White text
      navbarBg: '#ffffff',
      disabledButton: 'rgba(255, 105, 0, 0.5)', // Semi-transparent orange
      disabledText: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white
      // Scrollbar colors - updated to gray
      scrollbarTrack: '#f5f5f5',
      scrollbarThumb: '#888',
      scrollbarThumbHover: '#666',
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  return (
    <>
      <style>
        {`
          /* Custom scrollbar styling */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: ${currentTheme.scrollbarTrack};
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: ${currentTheme.scrollbarThumb};
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${currentTheme.scrollbarThumbHover};
          }
          
          /* For Firefox */
          * {
            scrollbar-width: thin;
            scrollbar-color: ${currentTheme.scrollbarThumb} ${currentTheme.scrollbarTrack};
          }
        `}
      </style>
      
      <div 
        className="min-h-screen w-screen flex flex-col items-center pt-4"
        style={{ background: currentTheme.background, color: currentTheme.text }}
      >
        <div 
          className="w-[90vw] min-h-[72px] rounded-xl shadow-2xl z-10 flex items-center justify-between px-6 text-lg font-medium mt-[50px]"
          style={{ 
            background: currentTheme.navbarBg,
            border: currentTheme.cardBorder,
            color: currentTheme.text
          }}
        >

          <div className="flex items-center gap-[10px] mr-[20px]">
            <span className="font-semibold text-xl" style={{ color: '#ff6900' }}>
              {resumeData?.title || 'Resume'}
            </span>
            <Pen 
              className="w-5 h-5 transition-colors cursor-pointer"
              style={{ color: '#ff6900' }}
              onClick={handleOpen}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-[1.03]"
              style={{ 
                background: '#ff6900',
                color: '#ffffff',
                border: 'none'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#e55d00';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#ff6900';
              }}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span className="hidden md:block">Save</span>
                </>
              )}
            </button>

            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200"
              style={{ 
                background: '#ff6900',
                color: '#ffffff',
                border: 'none'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#e55d00';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#ff6900';
              }}
              onClick={handleTemplateOpen}
            >
              <Palette className="w-5 h-5" />
              <span className="hidden md:block">Theme</span>
            </button>

            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200"
              style={{ 
                background: '#ff6900',
                color: '#ffffff',
                border: 'none'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#e55d00';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#ff6900';
              }}
            >
              <Trash2 className="w-5 h-5" />
              <span className="hidden md:block">Delete</span>
            </button>

            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200"
              style={{ 
                background: '#ff6900',
                color: '#ffffff',
                border: 'none'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#e55d00';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#ff6900';
              }}
              onClick={handleDownloadPDF}
            >
              <ArrowDownToLine className="w-5 h-5" />
              <span className="hidden md:block">Download</span>
            </button>
          </div>
        </div>

        <div className="w-[90vw] flex flex-col lg:flex-row justify-between gap-6 mt-8">
          <div 
            className="w-full lg:w-1/2 h-[75vh] min-h-[500px] rounded-2xl shadow-2xl p-4 z-10"
            style={{ 
              background: currentTheme.cardBg,
              border: currentTheme.cardBorder,
              color: currentTheme.text
            }}
          >
            <div className="flex flex-col justify-between h-full">
              <StepProgress progress={formSteps[currentStep].progress} theme={theme} />

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
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-[1.03]"
                  style={{ 
                    background: currentStep === 0 ? 'rgba(255, 105, 0, 0.5)' : '#ff6900',
                    color: '#ffffff',
                    border: 'none'
                  }}
                  onMouseOver={(e) => {
                    if (currentStep !== 0) {
                      e.target.style.background = '#e55d00';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = currentStep === 0 ? 'rgba(255, 105, 0, 0.5)' : '#ff6900';
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentStep === formSteps.length - 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-[1.03]"
                  style={{ 
                    background: currentStep === formSteps.length - 1 ? 'rgba(255, 105, 0, 0.5)' : '#ff6900',
                    color: '#ffffff',
                    border: 'none'
                  }}
                  onMouseOver={(e) => {
                    if (currentStep !== formSteps.length - 1) {
                      e.target.style.background = '#e55d00';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = currentStep === formSteps.length - 1 ? 'rgba(255, 105, 0, 0.5)' : '#ff6900';
                  }}
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Container */}
          <div 
            className="w-full lg:w-1/2 h-[75vh] min-h-[500px] rounded-2xl shadow-2xl p-6 z-10"
            style={{ 
              background: currentTheme.cardBg,
              border: currentTheme.cardBorder,
              color: currentTheme.text
            }}
          >
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
        theme={theme}
      />

      <ResumeTemplateModal
        open={templateOpen}
        handleClose={handleTemplateClose}
        setTemplate={setTemplate}
        handleSubmit={handleTemplateSubmit}
        theme={theme}
      />
    </>
  );
}

export default ResumeForm;