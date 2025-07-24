"use client";
import { Copy, X } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import ProgressBar from "./ProgressBar";
import Image from "next/image";

interface Copy {
  summaryText: string;
  transcriptText: string;
}

interface VolumeBarProps {
  volume: number;
  onVolumeChange: (newVolume: number) => void;
}

function Summarizer() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<
    number | null
  >(null);
  const [showHover, setShowHover] = useState<boolean>(false);
  const [openResult, setOpenResult] = useState<boolean>(false);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [option, setOption] = useState("summary");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [summaryText, setSummaryText] = useState<string>("");
  const [transcriptText, setTranscriptText] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [linkUrlError, setLinkUrlError] = useState<string>("");

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const text =
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptates aspernatur nulla nam dolor quis alias suscipit cupiditate sit, nisi perspiciatis illum unde deleniti molestiae sequi? Delectus ipsam, facilis, ex distinctio totam amet quod iure, culpa fugiat doloribus error exercitationem laboriosam? Quia nihil cum error dolore voluptatum vel natus perspiciatis labore recusandae totam dignissimos eveniet ut voluptas molestiae praesentium corporis, inventore voluptates tempora cumque ad voluptate amet possimus quisquam! Sed aut beatae aliquam, laudantium quod magni quasi ut inventore in vero! Commodi asperiores similique at eum ipsum ratione, vitae eos debitis doloribus doloremque, libero aspernatur enim, unde magni iste quos aliquid!";

  const dummyTranscript = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const acceptedFormats = ["audio/mpeg", "video/mp4"];
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile && acceptedFormats.includes(selectedFile.type)) {
      setFile(selectedFile);
      setErrMsg("");
      handleUpload(selectedFile);
    } else {
      setFile(null);
      setErrMsg("Please upload a valid MP3 or MP4 file.");
    }
  };
  useEffect(() => {
    if (errMsg || linkUrlError) {
      const timer = setTimeout(() => {
        setErrMsg("");
        setLinkUrlError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errMsg, linkUrlError]);

  const handleUpload = async (audioUrl: File | string) => {
    setIsUploading(true);
    setErrMsg("");
    setUploadProgress(0);

    let fileSize: number;

    if (typeof audioUrl !== "string") {
      fileSize = audioUrl.size;

      const maxFileSize = 25 * 1024 * 1024;

      if (fileSize > maxFileSize) {
        setIsUploading(false);
        setErrMsg("File size exceeds the 25MB limit.");
        return;
      }

      const chunkSize = 1024 * 50;
      let uploadedSize = 0;

      const simulateUpload = () => {
        return new Promise<void>((resolve) => {
          const startTime = Date.now();
          const interval = setInterval(() => {
            uploadedSize += chunkSize;
            if (uploadedSize > fileSize) uploadedSize = fileSize;

            const progress = Math.round((uploadedSize / fileSize) * 100);
            setUploadProgress(progress);
            const elapsedTime = (Date.now() - startTime) / 1000;
            const uploadSpeed = uploadedSize / elapsedTime;
            const remainingBytes = fileSize - uploadedSize;
            const remainingTime = remainingBytes / uploadSpeed;

            setEstimatedTimeRemaining(Math.max(0, Math.round(remainingTime)));

            if (uploadedSize >= fileSize) {
              clearInterval(interval);
              setIsComplete(true);
              setIsUploading(false);
              resolve();
            }
          }, 50);
        });
      };

      await simulateUpload();
    }
    toast.success("Uploading Successful");
    setIsButtonDisabled(false);
  };

  const truncateFileName = (
    name: string | undefined,
    maxLength: number = 40
  ): string => {
    if (!name) return "";

    if (name.length <= maxLength) return name;

    const halfLength = Math.floor(maxLength / 2);
    const firstHalf = name.slice(0, halfLength - 1);
    const secondHalf = name.slice(-halfLength + 2);

    return `${firstHalf}...${secondHalf}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + "" + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile && acceptedFormats.includes(droppedFile.type)) {
      setFile(droppedFile);
      handleUpload(droppedFile);
    } else {
      setFile(null);
      setErrMsg("Please upload a valid MP3 or MP4 file.");
    }
  };

  const handleCancelUpload = () => {
    setFile(null);
    setOpenResult(false);
    setIsSummarizing(false);
    setAudioUrl(null);
    setIsComplete(false);
    setIsUploading(false);
    setInputUrl("");
    setUploadProgress(0);
    setErrMsg("");
    setIsButtonDisabled(false);
  };

  const handleSummarize = () => {
    if (!audioUrl) {
      toast.error("Please select a file first or enter a valid URL!");
      return;
    }

    setIsSummarizing(true);

    try {
      setTimeout(() => {
        setIsSummarizing(false);
        setOpenResult(true);
        setIsUploading(false);
        setErrMsg("");
        setIsComplete(true);
        setSummaryText(text);
        setTranscriptText(dummyTranscript);
        toast.success("Summary successful");
        setIsButtonDisabled(true);
      }, 5000);
    } catch (error) {
      console.error("Error uploading file or URL:", error);
      setOpenResult(false);
      setIsSummarizing(false);
      toast.error(
        "There was an error uploading the file or URL. Please try again."
      );
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [audioRef, volume, isMuted]);

  useEffect(() => {
    if (file) {
      const fileType = file.type;
      const url = URL.createObjectURL(file);

      setAudioUrl(url);

      if (fileType === "audio/mp4" || fileType === "video/mp4") {
        setAudioUrl(url);
      } else if (fileType === "audio/mp3") {
        setAudioUrl(url);
      }
    }
  }, [file]);

  const parseDuration = (duration: string): number => {
    const regex = /(?:(\d+)hr)?\s*(\d+)?min/;
    const match = regex.exec(duration);

    if (!match) return 0;

    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match[2] ? parseInt(match[2], 10) : 0;

    return hours * 3600 + minutes * 60;
  };

  // useEffect(() => {
  //   if (inputUrl) {
  //     const seconds = parseDuration(urlDuration);
  //     setDuration(seconds);
  //   }
  // }, [urlDuration, inputUrl]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    } else if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          await audioRef.current.pause();
        } else {
          await audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error("Error toggling audio playback:", error);
      }
    }
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    const formattedHours = hours < 10 ? `0${hours}hrs` : `${hours}hrs`;
    const formattedMinutes = `${minutes}min`;
    const formattedSeconds = seconds < 10 ? `0${seconds}sec` : `${seconds}sec`;

    return ` ${formattedMinutes} ${formattedSeconds}`;
  };

  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const increaseSpeed = () => {
    if (playbackRate < 2) {
      const newRate = Math.min(playbackRate + 0.25, 2);
      setPlaybackRate(newRate);
      if (audioRef.current) {
        audioRef.current.playbackRate = newRate;
      }
    }
  };

  const decreaseSpeed = () => {
    if (playbackRate > 0.5) {
      const newRate = Math.max(playbackRate - 0.25, 0.5);
      setPlaybackRate(newRate);
      if (audioRef.current) {
        audioRef.current.playbackRate = newRate;
      }
    }
  };

  const forwardAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        audioRef.current.duration
      );
    }
  };

  const rewindAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 10,
        0
      );
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const copyText = ({ summaryText, transcriptText }: Copy) => {
    let textToCopy = "";
    if (option === "summary") {
      textToCopy = summaryText;
    } else {
      textToCopy = transcriptText;
    }

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  function formatTranscript(transcript: string, duration?: number): string[] {
    // Default to 3 minutes if duration is empty
    const fallbackDuration = 180;
    const actualDuration =
      duration && duration > 0 ? duration : fallbackDuration;

    const sentences = transcript
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const interval = 30; // every 30 seconds
    const totalParagraphs = Math.ceil(actualDuration / interval);

    const paragraphs: string[] = [];
    const sentencesPerParagraph = Math.ceil(sentences.length / totalParagraphs);

    for (let i = 0; i < totalParagraphs; i++) {
      const startTime = i * interval;
      const minutes = String(Math.floor(startTime / 60)).padStart(2, "0");
      const seconds = String(startTime % 60).padStart(2, "0");
      const timestamp = `${minutes}:${seconds}`;

      const paragraphSentences = sentences.slice(
        i * sentencesPerParagraph,
        (i + 1) * sentencesPerParagraph
      );

      if (paragraphSentences.length > 0) {
        const paragraph = `<p class="mb-4"><strong>[${timestamp}]</strong> ${paragraphSentences.join(
          " "
        )}</p>`;
        paragraphs.push(paragraph);
      }
    }

    return paragraphs;
  }

  const breakTextIntoParagraphs = (
    text: string,
    maxWordsPerParagraph: number
  ): string[] => {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const paragraphs: string[] = [];
    let currentParagraph: string[] = [];
    let currentWordCount = 0;

    sentences.forEach((sentence) => {
      const sentenceWords = sentence.split(" ");
      const sentenceWordCount = sentenceWords.length;

      if (currentWordCount + sentenceWordCount > maxWordsPerParagraph) {
        paragraphs.push(currentParagraph.join(" "));
        currentParagraph = [];
        currentWordCount = 0;
      }

      currentParagraph.push(sentence);
      currentWordCount += sentenceWordCount;
    });

    if (currentParagraph.length > 0) {
      paragraphs.push(currentParagraph.join(" "));
    }

    return paragraphs;
  };

  const validatePodcastUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      const allowedHosts = ["podcasts.apple.com", "open.spotify.com"];
      const audioExtensions = [".mp3", ".m4a"];

      const isFromAllowedHost = allowedHosts.some((host) =>
        parsedUrl.hostname.includes(host)
      );

      const hasAudioExtension = audioExtensions.some((ext) =>
        parsedUrl.pathname.toLowerCase().endsWith(ext)
      );

      return isFromAllowedHost || hasAudioExtension;
    } catch {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const value = e.target.value;

    setInputUrl(value);

    if (linkUrlError) {
      setLinkUrlError("");
    }
  };

  const handleSummarizeLink = () => {
    if (inputUrl && !validatePodcastUrl(inputUrl)) {
      setLinkUrlError(
        "Please enter a valid podcast audio URL ending in .mp3 or .m4a"
      );
      return;
    }

    setIsSummarizing(true);

    try {
      setTimeout(() => {
        setIsSummarizing(false);
        setOpenResult(true);
        setIsUploading(false);
        setErrMsg("");
        setLinkUrlError("");
        setIsComplete(false);
        setSummaryText(text);
        setTranscriptText(dummyTranscript);
        toast.success("Summary successful");
        setIsButtonDisabled(true);
      }, 5000);
    } catch (error) {
      console.error("Error uploading file or URL:", error);
      setOpenResult(false);
      setIsSummarizing(false);
      toast.error(
        "There was an error uploading the file or URL. Please try again."
      );
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center mx-auto">
      <div className="w-full mx-auto items-center flex flex-col justify-center lg:max-w-6xl mb-6">
        {isComplete ? (
          <>
            {file && (
              <>
                <div className="space-y-2 relative bg-white border-dashed w-[90%] sm:w-[80%] md:w-[80%] lg:w-[85%] xl:w-[90%] max-w-6xl h-[260px] sm:h-[280px] md:h-[300px]  my-5 mx-auto border-[1px] border-[#7E97B4] rounded-lg flex flex-row items-center justify-between p-5 md:p-10 hover:bg-[#F97316]/5 hover:border-[#F97316] transition ease-in-out delay-150">
                  <div className="flex gap-4 md:gap-8 sm:justify-center md:justify-normal items-center">
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="62"
                        height="62"
                        viewBox="0 0 62 62"
                        fill="none"
                      >
                        <path
                          d="M23.2501 33.5832V12.9165C23.2501 10.0748 25.5751 7.74984 28.4167 7.74984H51.6667C54.5084 7.74984 56.8334 10.0748 56.8334 12.9165V28.4165H47.9726L44.6659 23.9215C44.6338 23.868 44.5883 23.8237 44.534 23.793C44.4797 23.7623 44.4183 23.7461 44.3559 23.7461C44.2935 23.7461 44.2321 23.7623 44.1778 23.793C44.1235 23.8237 44.0781 23.868 44.0459 23.9215L38.9051 30.9998C38.7501 31.1548 38.4401 31.1807 38.2851 30.9998L34.5909 26.479C34.5541 26.4364 34.5084 26.4021 34.4572 26.3787C34.4059 26.3552 34.3502 26.3431 34.2938 26.3431C34.2375 26.3431 34.1817 26.3552 34.1305 26.3787C34.0792 26.4021 34.0336 26.4364 33.9967 26.479L28.5459 33.3507C28.3392 33.5832 28.5201 33.9707 28.8301 33.9707H45.2084V38.7498H28.4167C25.5492 38.7498 23.2501 36.4507 23.2501 33.5832ZM15.5001 56.8332V54.2498H10.3334V56.8332H5.16675V5.1665H10.3334V7.74984H15.5001V5.1665H21.6742C19.4784 7.07817 18.0834 9.8165 18.0834 12.9165V33.5832C18.0834 39.2923 22.7076 43.9165 28.4167 43.9165H40.5584C37.8976 46.0607 36.1667 49.2898 36.1667 52.9582C36.1667 54.3273 36.4509 55.619 36.8901 56.8332H15.5001ZM10.3334 18.0832H15.5001V12.9165H10.3334V18.0832ZM10.3334 28.4165H15.5001V23.2498H10.3334V28.4165ZM10.3334 38.7498H15.5001V33.5832H10.3334V38.7498ZM15.5001 49.0832V43.9165H10.3334V49.0832H15.5001ZM59.4167 33.5832V38.7498H54.2501V52.9582C54.2501 54.671 53.5697 56.3137 52.3585 57.5249C51.1473 58.7361 49.5046 59.4165 47.7917 59.4165C46.0789 59.4165 44.4362 58.7361 43.225 57.5249C42.0138 56.3137 41.3334 54.671 41.3334 52.9582C41.334 51.8861 41.6014 50.831 42.1116 49.8881C42.6218 48.9452 43.3586 48.1441 44.2558 47.5572C45.1529 46.9702 46.182 46.6158 47.2503 46.5259C48.3186 46.436 49.3925 46.6135 50.3751 47.0423V33.5832H59.4167Z"
                          fill="#475467"
                        />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base md:text-xl text-left font-bold text-[#292D32] mb-2">
                        {truncateFileName(file?.name)}
                      </p>
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M16.2806 9.21937C16.3504 9.28903 16.4057 9.37175 16.4434 9.46279C16.4812 9.55384 16.5006 9.65144 16.5006 9.75C16.5006 9.84856 16.4812 9.94616 16.4434 10.0372C16.4057 10.1283 16.3504 10.211 16.2806 10.2806L11.0306 15.5306C10.961 15.6004 10.8783 15.6557 10.7872 15.6934C10.6962 15.7312 10.5986 15.7506 10.5 15.7506C10.4014 15.7506 10.3038 15.7312 10.2128 15.6934C10.1218 15.6557 10.039 15.6004 9.96938 15.5306L7.71938 13.2806C7.57865 13.1399 7.49959 12.949 7.49959 12.75C7.49959 12.551 7.57865 12.3601 7.71938 12.2194C7.86011 12.0786 8.05098 11.9996 8.25 11.9996C8.44903 11.9996 8.6399 12.0786 8.78063 12.2194L10.5 13.9397L15.2194 9.21937C15.289 9.14964 15.3718 9.09432 15.4628 9.05658C15.5538 9.01884 15.6514 8.99941 15.75 8.99941C15.8486 8.99941 15.9462 9.01884 16.0372 9.05658C16.1283 9.09432 16.211 9.14964 16.2806 9.21937ZM21.75 12C21.75 13.9284 21.1782 15.8134 20.1068 17.4168C19.0355 19.0202 17.5127 20.2699 15.7312 21.0078C13.9496 21.7458 11.9892 21.9389 10.0979 21.5627C8.20656 21.1865 6.46928 20.2579 5.10571 18.8943C3.74215 17.5307 2.81355 15.7934 2.43735 13.9021C2.06114 12.0108 2.25422 10.0504 2.99218 8.26884C3.73013 6.48726 4.97982 4.96451 6.58319 3.89317C8.18657 2.82183 10.0716 2.25 12 2.25C14.585 2.25273 17.0634 3.28084 18.8913 5.10872C20.7192 6.93661 21.7473 9.41498 21.75 12ZM20.25 12C20.25 10.3683 19.7661 8.77325 18.8596 7.41655C17.9531 6.05984 16.6646 5.00242 15.1571 4.37799C13.6497 3.75357 11.9909 3.59019 10.3905 3.90852C8.79017 4.22685 7.32016 5.01259 6.16637 6.16637C5.01259 7.32015 4.22685 8.79016 3.90853 10.3905C3.5902 11.9908 3.75358 13.6496 4.378 15.1571C5.00242 16.6646 6.05984 17.9531 7.41655 18.8596C8.77326 19.7661 10.3683 20.25 12 20.25C14.1873 20.2475 16.2843 19.3775 17.8309 17.8309C19.3775 16.2843 20.2475 14.1873 20.25 12Z"
                            fill="#35BB26"
                          />
                        </svg>
                        <span className="text-[#555] text-sm md:text-xl">
                          Upload complete
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleCancelUpload}
                    onMouseEnter={() => setShowHover(true)}
                    onMouseLeave={() => setShowHover(false)}
                    className="absolute right-4 top-4"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="31"
                      viewBox="0 0 30 31"
                      fill="none"
                    >
                      <path
                        d="M15 28.9375C7.5875 28.9375 1.5625 22.9125 1.5625 15.5C1.5625 8.0875 7.5875 2.0625 15 2.0625C22.4125 2.0625 28.4375 8.0875 28.4375 15.5C28.4375 22.9125 22.4125 28.9375 15 28.9375ZM15 3.9375C8.625 3.9375 3.4375 9.125 3.4375 15.5C3.4375 21.875 8.625 27.0625 15 27.0625C21.375 27.0625 26.5625 21.875 26.5625 15.5C26.5625 9.125 21.375 3.9375 15 3.9375Z"
                        fill="#292D32"
                      />
                      <path
                        d="M11.4617 19.9742C11.2242 19.9742 10.9867 19.8867 10.7992 19.6992C10.4367 19.3367 10.4367 18.7367 10.7992 18.3742L17.8742 11.2992C18.2367 10.9367 18.8367 10.9367 19.1992 11.2992C19.5617 11.6617 19.5617 12.2617 19.1992 12.6242L12.1242 19.6992C11.9492 19.8867 11.6992 19.9742 11.4617 19.9742Z"
                        fill="#292D32"
                      />
                      <path
                        d="M18.5367 19.9742C18.2992 19.9742 18.0617 19.8867 17.8742 19.6992L10.7992 12.6242C10.4367 12.2617 10.4367 11.6617 10.7992 11.2992C11.1617 10.9367 11.7617 10.9367 12.1242 11.2992L19.1992 18.3742C19.5617 18.7367 19.5617 19.3367 19.1992 19.6992C19.0117 19.8867 18.7742 19.9742 18.5367 19.9742Z"
                        fill="#292D32"
                      />
                    </svg>
                  </button>
                  {showHover && (
                    <div className="absolute right-0 -top-5 px-2 py-1 flex bg-white text-[#222224] text-[16px] font-medium rounded-[4px] shadow-lg">
                      Remove file
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSummarize}
                  disabled={isSummarizing && isButtonDisabled}
                  className={`w-[90%] sm:w-[80%] md:w-[80%] lg:w-[85%] xl:w-[90%] py-2 rounded-[8px] bg-[#F97316] text-white hover:bg-[#F97316]/80 focus:outline-none flex items-center justify-center gap-2  ${
                    isSummarizing || isButtonDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  {isSummarizing ? (
                    <div className="flex justify-center items-center gap-2">
                      <Image
                        src="/starry.svg"
                        alt="Music icon"
                        className="animate-spin ml-2 w-4 h-4 md:w-6 md:h-6"
                        width={6}
                        height={6}
                      />
                      <span>Summarizing</span>
                    </div>
                  ) : (
                    <>
                      <span>Summarize</span>
                    </>
                  )}
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <div className="relative bg-white border-dashed w-[90%] sm:w-[80%] md:w-[80%] lg:w-[85%] xl:w-[90%] max-w-6xl h-[260px] sm:h-[280px] md:h-[300px] mb-4 mx-auto border-[1px] border-[#7E97B4] rounded-lg flex flex-col items-center justify-center hover:bg-[#F97316]/5 hover:border-[#F97316] transition ease-in-out delay-150">
              {isUploading ? (
                <>
                  {file && (
                    <>
                      <div className="space-y-4 w-full p-4 sm:p-6 md:p-8 lg:p-10">
                        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
                          <span className="flex-shrink-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="62"
                              height="62"
                              viewBox="0 0 62 62"
                              fill="none"
                            >
                              <path
                                d="M23.2501 33.5832V12.9165C23.2501 10.0748 25.5751 7.74984 28.4167 7.74984H51.6667C54.5084 7.74984 56.8334 10.0748 56.8334 12.9165V28.4165H47.9726L44.6659 23.9215C44.6338 23.868 44.5883 23.8237 44.534 23.793C44.4797 23.7623 44.4183 23.7461 44.3559 23.7461C44.2935 23.7461 44.2321 23.7623 44.1778 23.793C44.1235 23.8237 44.0781 23.868 44.0459 23.9215L38.9051 30.9998C38.7501 31.1548 38.4401 31.1807 38.2851 30.9998L34.5909 26.479C34.5541 26.4364 34.5084 26.4021 34.4572 26.3787C34.4059 26.3552 34.3502 26.3431 34.2938 26.3431C34.2375 26.3431 34.1817 26.3552 34.1305 26.3787C34.0792 26.4021 34.0336 26.4364 33.9967 26.479L28.5459 33.3507C28.3392 33.5832 28.5201 33.9707 28.8301 33.9707H45.2084V38.7498H28.4167C25.5492 38.7498 23.2501 36.4507 23.2501 33.5832ZM15.5001 56.8332V54.2498H10.3334V56.8332H5.16675V5.1665H10.3334V7.74984H15.5001V5.1665H21.6742C19.4784 7.07817 18.0834 9.8165 18.0834 12.9165V33.5832C18.0834 39.2923 22.7076 43.9165 28.4167 43.9165H40.5584C37.8976 46.0607 36.1667 49.2898 36.1667 52.9582C36.1667 54.3273 36.4509 55.619 36.8901 56.8332H15.5001ZM10.3334 18.0832H15.5001V12.9165H10.3334V18.0832ZM10.3334 28.4165H15.5001V23.2498H10.3334V28.4165ZM10.3334 38.7498H15.5001V33.5832H10.3334V38.7498ZM15.5001 49.0832V43.9165H10.3334V49.0832H15.5001ZM59.4167 33.5832V38.7498H54.2501V52.9582C54.2501 54.671 53.5697 56.3137 52.3585 57.5249C51.1473 58.7361 49.5046 59.4165 47.7917 59.4165C46.0789 59.4165 44.4362 58.7361 43.225 57.5249C42.0138 56.3137 41.3334 54.671 41.3334 52.9582C41.334 51.8861 41.6014 50.831 42.1116 49.8881C42.6218 48.9452 43.3586 48.1441 44.2558 47.5572C45.1529 46.9702 46.182 46.6158 47.2503 46.5259C48.3186 46.436 49.3925 46.6135 50.3751 47.0423V33.5832H59.4167Z"
                                fill="#475467"
                              />
                            </svg>
                          </span>
                          <div className="flex flex-col items-center md:items-start">
                            <p className="text-lg md:text-xl text-center md:text-left font-bold text-[#1A1A1A]">
                              {truncateFileName(file?.name)}
                            </p>
                            <div className="flex items-center justify-center gap-2 mt-2 md:mt-0">
                              <Image
                                src="/starry.svg"
                                alt="Music icon"
                                className="animate-spin ml-2 w-4 h-4 md:w-6 md:h-6"
                                width={6}
                                height={6}
                              />
                              <span className="text-sm md:text-xl text-[#555]">
                                Uploading file, this will take a few minutes
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3 md:mt-5">
                          <ProgressBar value={uploadProgress} />
                          <span className="text-sm md:text-base">
                            {uploadProgress}%{" "}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div onDragOver={handleDragOver} onDrop={handleDrop}>
                  <input
                    type="file"
                    accept="audio/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="audioUpload"
                    ref={fileInputRef}
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
                        <path
                          d="M50 64.0015H80L65 49.0015L50 64.0015Z"
                          fill="black"
                        />
                      </mask>
                      <g mask="url(#mask0_16145_81277)">
                        <path d="M120 0H0V120H120V0Z" fill="#D0D5DD" />
                      </g>
                    </svg>
                    <p className=" text-[16px] md:text-[20px] text-[#475467] pt-3">
                      <span className="text-[#F97316]">Upload</span> or drag and
                      drop an Audio file.
                    </p>
                    <span className="block text-[#71717A] text-sm md:text-base">
                      MAX 25mb (MP4, MP3)
                    </span>
                    {errMsg && <p className="text-red-500 mt-2">{errMsg}</p>}
                  </label>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {/* input url & button */}
      {!isUploading && !isComplete && (
        <>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-[90%] sm:w-[80%] md:w-[80%] lg:w-[85%] xl:w-[72%] max-w-5xl mx-auto px-4 py-2 border border-[#CBD5E1] rounded-[8px]">
            {/* Input URL */}
            <div className="flex items-center gap-2 w-full sm:w-[70%]">
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
                value={inputUrl}
                onChange={handleChange}
                placeholder="Podcast link (MAX: 10 minutes)"
                className="w-full focus:outline-none text-sm sm:text-base text-[#1A1A1A] placeholder:text-[#94A3B8] py-2"
              />
            </div>

            {/* Upload Button */}
            <button
              onClick={handleSummarizeLink}
              disabled={(isSummarizing && isButtonDisabled) || !inputUrl}
              className={`w-full sm:w-auto py-2 px-4 rounded-[8px] bg-[#F97316] text-white hover:bg-[#F97316]/80 focus:outline-none flex items-center justify-center gap-2 ${
                isSummarizing || isButtonDisabled || !inputUrl
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              {isSummarizing ? (
                <div className="flex justify-center items-center gap-1">
                  <Image
                    src="/starry.svg"
                    alt="Music icon"
                    className="animate-spin ml-2 w-4 h-4 md:w-6 md:h-6"
                    width={4}
                    height={4}
                  />
                  <span>Summarizing</span>
                </div>
              ) : (
                <span>Summarize</span>
              )}
            </button>
          </div>

          {linkUrlError && <p className="text-red-500 mt-2">{linkUrlError}</p>}
        </>
      )}

      {openResult && (audioUrl || inputUrl) && (
        <div className="mt-10 w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%] max-w-6xl mx-auto flex flex-col justify-center">
          <h1 className="text-center mb-5 font-semibold text-2xl capitalize">
            Your Summarization
          </h1>

          {inputUrl && (
            <p
              onClick={handleCancelUpload}
              className="mb-1 font-semibold text-base flex gap-1 items-center cursor-pointer"
            >
              Cancel <X />
            </p>
          )}

          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-[40px]">
              <div className="w-full mx-auto border border-[#CBD5E1] px-4 py-10 rounded-[16px]">
                {file && audioUrl && (
                  <>
                    {file.type === "video/mp4" ? (
                      <video
                        ref={videoRef}
                        src={audioUrl}
                        onLoadedMetadata={handleLoadedMetadata}
                        onTimeUpdate={updateTime}
                        controls
                        className="w-full mb-10"
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <audio
                        ref={audioRef}
                        src={audioUrl}
                        onLoadedMetadata={handleLoadedMetadata}
                        onTimeUpdate={updateTime}
                        controls
                        className="w-full mb-8"
                      >
                        Your browser does not support the audio tag.
                      </audio>
                    )}
                  </>
                )}

                <p className="text-sm md:text-2xl text-left font-semibold ml-2 capitalize break-words truncate max-w-full">
                  {file
                    ? truncateFileName(file.name)
                    : truncateFileName(inputUrl)}
                </p>

                <div className="mt-12 flex flex-col gap-6">
                  {inputUrl && (
                    <div className="flex justify-between text-sm md:text-xl font-medium ml-2 mb-2">
                      <p className="text-[#98A2B3]">Host:</p>
                      <p className="text-[#1A1A1A]">John Doe</p>
                    </div>
                  )}
                  <div className="flex justify-between text-sm md:text-xl font-medium ml-2">
                    <p className="text-[#98A2B3]">Duration:</p>
                    <p className="text-[#1A1A1A]">
                      {file ? formatTime(duration) : "1min 30sec"}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm md:text-xl font-medium ml-2">
                    <p className="text-[#98A2B3]">Read Time:</p>
                    <p className="text-[#1A1A1A]">1min 30sec</p>
                  </div>
                </div>
              </div>

              <div className="w-full rounded-lg space-y-2 lg:space-y-5">
                <div className="border py-7 px-5 border-[#CBD5E1] rounded-[8px]">
                  <div className="flex items-center gap-2 bg-white border p-1 rounded-[8px] justify-between w-fit mb-7">
                    <button
                      onClick={() => setOption("summary")}
                      className={`px-3 py-1.5 rounded-[4px] ${
                        option === "summary"
                          ? "bg-[#F97316] hover:bg-[#F97316]/70 text-white"
                          : "bg-transparent"
                      }`}
                    >
                      Summary
                    </button>
                    <button
                      onClick={() => setOption("transcript")}
                      className={`px-3 py-1.5 rounded-[4px] ${
                        option === "transcript"
                          ? "bg-[#F97316] hover:bg-[#F97316]/70 text-white"
                          : "bg-transparent"
                      }`}
                    >
                      Transcript
                    </button>
                  </div>

                  {option === "summary" ? (
                    <div className="h-[420px] overflow-y-auto">
                      <p className="mb-5 text-left text-sm text-[#555]">
                        {breakTextIntoParagraphs(summaryText, 100)}
                      </p>
                    </div>
                  ) : (
                    <div className="h-[420px] overflow-y-auto">
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: formatTranscript(
                            transcriptText,
                            duration
                          ).join(""),
                        }}
                      />
                    </div>
                  )}

                  <div className="w-full flex items-center justify-end">
                    {copied ? (
                      <span className="text-green-600">
                        Copied to clipboard
                      </span>
                    ) : (
                      <Copy
                        size={22}
                        className="cursor-pointer"
                        onClick={() =>
                          copyText({ summaryText, transcriptText })
                        }
                      />
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button className="w-full max-w-4xl mx-auto p-4 mr-5 rounded-[8px] cursor-pointer bg-[#F4F4F5] hover:bg-[#F4F4F5]/70 text-[#1A1A1A] text-xs md:text-[18px] focus:outline-none flex items-center justify-center gap-2">
                    Save
                  </button>
                  <button className="w-full max-w-4xl mx-auto p-4 rounded-[8px] cursor-pointer bg-[#F97316] hover:bg-[#F97316]/80 text-white text-xs md:text-[18px] focus:outline-none flex items-center justify-center gap-2">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Summarizer;

const VolumeBar: React.FC<VolumeBarProps> = ({ volume, onVolumeChange }) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, x / rect.width));
    onVolumeChange(newVolume);
  };

  return (
    <div
      className="w-24 h-2 bg-gray-300 rounded-full cursor-pointer hidden md:inline-block"
      onClick={handleClick}
    >
      <div
        className="h-full bg-[#555555] rounded-full"
        style={{ width: `${volume * 100}%` }}
      />
    </div>
  );
};
