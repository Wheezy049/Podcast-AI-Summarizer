import React from "react";

function Summarizer() {
  return (
    <div className="w-full">
      <div className="relative bg-white border-dashed w-full md:h-[280px] h-[300px] max-w-6xl mb-4 mx-auto border-[1px] border-[#7E97B4] rounded-lg flex flex-col items-center justify-center hover:bg-[#F97316]/5 hover:border-[#F97316] transition ease-in-out delay-150">
        <input
          type="file"
          accept="audio/*,video/*"
          // onChange={handleFileChange}
          className="hidden"
          id="audioUpload"
          // ref={fileInputRef}
        />
        <label
          htmlFor="audioUpload"
          className="w-full h-full mx-auto cursor-pointer self-stretch flex flex-col items-center justify-center px-5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
          >
            <mask
              id="mask0_16145_81277"
              style={{ maskType: "luminance" }}
              maskUnits="userSpaceOnUse"
              x="10"
              y="20"
              width="110"
              height="80"
            >
              <path
                d="M65 80C81.5685 80 95 66.5685 95 50C95 33.4315 81.5685 20 65 20C48.4315 20 35 33.4315 35 50C35 66.5685 48.4315 80 65 80Z"
                fill="white"
              />
              <path d="M85 60H40V100H85V60Z" fill="white" />
              <path
                d="M55 40H40C23.4315 40 10 53.4315 10 70C10 86.5685 23.4315 100 40 100H55C71.5685 100 85 86.5685 85 70C85 53.4315 71.5685 40 55 40Z"
                fill="white"
              />
              <path
                d="M95 50H80C66.1929 50 55 61.1929 55 75C55 88.8071 66.1929 100 80 100H95C108.807 100 120 88.8071 120 75C120 61.1929 108.807 50 95 50Z"
                fill="white"
              />
              <path
                d="M58.9941 75.9985H70.9941V60.9985H58.9941V75.9985Z"
                fill="black"
              />
              <path d="M50 64.0015H80L65 49.0015L50 64.0015Z" fill="black" />
            </mask>
            <g mask="url(#mask0_16145_81277)">
              <path d="M120 0H0V120H120V0Z" fill="#D0D5DD" />
            </g>
          </svg>
          <p className=" text-[16px] md:text-[20px] text-[#475467] pt-3">
            <span className="text-[#F97316]">Upload</span> or drag and drop an
            Audio file.
          </p>
          <span className="block text-[#71717A] text-sm md:text-base">
            MAX 25mb (MP4, MP3)
          </span>
          {/* {errMsg && (
                                  <p className="text-red-500 mt-2">{errMsg}</p>
                                )} */}
        </label>
      </div>
      <div className="flex items-center justify-between gap-4 w-full max-w-6xl mx-auto px-4 py-2 border border-[#CBD5E1] rounded-[8px]">
  {/* input url */}
  <div className="flex items-center gap-2 w-full">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.5521 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.46997L11.75 5.17997"
        stroke="#667085"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.0002 11.0002C13.5707 10.4261 13.0228 9.95104 12.3936 9.60729C11.7645 9.26353 11.0687 9.05911 10.3535 9.00789C9.63841 8.95667 8.92061 9.05986 8.24885 9.31044C7.5771 9.56103 6.96709 9.95316 6.4602 10.4602L3.4602 13.4602C2.54941 14.4032 2.04544 15.6662 2.05683 16.9772C2.06822 18.2882 2.59407 19.5423 3.52111 20.4693C4.44815 21.3964 5.70221 21.9222 7.01319 21.9336C8.32418 21.945 9.58719 21.441 10.5302 20.5302L12.2402 18.8202"
        stroke="#667085"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <input
      type="text"
      placeholder="Apple podcast link (MAX: 10 minutes)"
      className="w-full focus:outline-none text-sm text-[#1A1A1A] placeholder:text-[#94A3B8]"
    />
  </div>

  {/* Upload button */}
  <button
    className="shrink-0 py-2 px-5 rounded-[4px] bg-[#F97316] text-white hover:bg-[#ea6d0e] focus:outline-none"
  >
    Submit
  </button>
</div>

    </div>
  );
}

export default Summarizer;
