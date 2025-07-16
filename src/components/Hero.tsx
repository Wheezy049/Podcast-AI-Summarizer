import React from "react";

function Hero() {
  return (
    <section className="max-w-[1268px] w-full h-auto flex flex-col items-center mx-auto lg:px-0 px-[24px] pt-[100px]">
      <div className="w-full max-w-[1068px] animate-fade-in">
        <div className="relative gap-[24px] w-full max-w-[1068px] md:mb-12 flex flex-col items-center justify-center">
          <div className="gap-[16px] flex flex-col items-center pt-[40px] relative">
            <h1 className="text-[32px] md:text-[48px] lg:text-[48px] text-[#1A1A1A] font-bold leading-[40px] md:leading-[72px] text-center animate-slide-up opacity-0 animate-delay-[100ms]">
              AI Podcast Summarizer
            </h1>
            <p className="text-[14px] md:text-[17px] font-medium leading-[24px] md:leading-[27.32px] text-center text-[#555555] animate-slide-up opacity-0 animate-delay-[200ms]">
              Upload a podcast, audio, or video file or enter a URL to generate a summary
            </p>
            <button
              className="transition md:h-[56px] h-[40px] md:px-[56px] px-[24px] md:py-[16px] py-0 rounded-[32px] bg-[#1A1A1A] text-white text-[14px] leading-[24px] mt-[24px] duration-300 mb-[40px] hover:-translate-y-1 animate-slide-up opacity-0 animate-delay-[300ms]"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
