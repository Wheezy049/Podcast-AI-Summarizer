import Image from 'next/image';

interface CardProps {
    step: number;
    title: string;
    description: string;
    src: string;
}

const data = [
    {
      step: 1,
      title: "Upload the Podcast",
      description:
        "Upload the Podcast directly from your local computer or enter the URL of the Apple podcast you want to transcribe/summarize.",
      src: "/image2.png",
    },
    {
      step: 2,
      title: "Convert Podcast to Text",
      description:
        'Click the "Transcribe" button, and our AI tool will generate the transcript and summary of the the podcast.',
      src: "/image4.png",
    },
    {
      step: 3,
      title: "Copy/Download transcript",
      description:
        "Copy the transcription and summary or download as a PDF or DOC file.",
      src: "/image.png",
    },
  ];

export default function HowItWorks() {
    return (
        <div className="w-full lg:max-w-[1300px] md:max-w-[800px] mx-auto space-y-5 md:space-y-7 md:p-12">
            <h1 className="text-[24px] md:text-[40px] font-[500] leading-[32.78px] md:leading-[54.64px] text-center text-[#1F1F1F]">
                How To Summarize Podcast
            </h1>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10 content-center justify-items-center">
                {data.map((step) => (
                    <Card key={step.step} {...step} />
                ))}
            </div>
        </div>
    )
}

const Card = ({ step, title, description, src }: CardProps) => {
    return (
        <div className="w-full px-5 py-10 flex flex-col justify-between space-y-3 border border-[#CBD5E1] rounded-2xl hover:-translate-y-1 hover:shadow-lg transition ease-in-out delay-150 duration-300 mb-10">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="rounded-lg bg-[#F97316] text-white text-center flex items-center justify-center h-8 w-8">{step}</span>
                    <h3 className="text-base md:text-xl font-semibold text-[#1A1A1A]">{title}</h3>
                </div>
                <p className="text-sm md:text-base text-[#555555]">
                    {description}
                </p>
            </div>
            <Image src={src} alt={title} width={250} height={140} className="w-3/4 mx-auto" />
        </div>
    )
}