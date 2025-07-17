import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BackgroundLines } from "../components/ui/background-lines.jsx";
import { ColourfulText } from "../components/ui/colourful-text.jsx";
import { ImagesSlider } from "../components/ui/images-slider.jsx";
import ContainerBox from "./containerBox.jsx";
import { ScrollerComponent } from "./scrollerComponent.jsx";
import WorkFlow from "./WorkFlow.jsx";

function HomeComponent() {
  const imageRef = useRef(null);

  const images = [
    "https://sbscyber.com/hs-fs/hubfs/Images/BlogImages/AdobeStock_604631734.jpeg?width=8000&height=4064&name=AdobeStock_604631734.jpeg",
    "https://www.ttnews.com/sites/default/files/2023-09/iTECH-Dysart-1200.jpg",
    "https://media.licdn.com/dms/image/v2/D4E12AQHKzw6UvrCJ3Q/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1735926830143?e=2147483647&v=beta&t=dILdJD0aBd3IJOnt13DwQ6oR4heH4FIqHc2CBp8lzks",
  ];

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      if (!imageElement) return;
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-[200vh] bg-black">
      <div className="h-[70vh] flex flex-col justify-center items-center text-white px-4">
        <BackgroundLines className="flex items-center justify-center w-full flex-col gap-6">
          <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold text-center relative z-20 font-sans">
            The smartest <ColourfulText text="AI interview experience" /> <br /> built just for you
          </h1>
          <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-400 text-center">
            Get expert guidance through AI-driven interviews and smart resume creation.
            Practice, improve, and build your career with intelligent support.
          </p>
        </BackgroundLines>
      </div>

      <div className="hero-image-wrapper md:mt-0 w-[100vw] flex justify-center h-[50rem]">
        <div
          ref={imageRef}
          className="hero-image w-[80vw] transition-all duration-500"
        >
          <ImagesSlider className="h-[40rem]" images={images}>
            <motion.div
              initial={{ opacity: 0, y: -80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="z-50 flex flex-col justify-center items-center"
            >
              <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
                AI meets interviews: <br /> Your smartest prep ever
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4"
              >
                <span>Join now →</span>
                <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
              </motion.button>
            </motion.div>
          </ImagesSlider>
        </div>
      </div>

      <WorkFlow/>

      <div >
        <ContainerBox/>
      </div>

      <div className="mb-10">
        <ScrollerComponent/>
      </div>
      
    </div>
  );
}

export default HomeComponent;
