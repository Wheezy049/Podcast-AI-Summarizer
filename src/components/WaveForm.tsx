import React, { useRef, useEffect, useState } from 'react';

interface WaveformProps {
    audioUrl: string;
    onTimeUpdate: (time: number) => void;
    duration: number;
    currentTime: number;
    width: number;
    height: number;
}
interface CustomWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

const Waveform: React.FC<WaveformProps> = ({
    audioUrl, onTimeUpdate,
    duration, currentTime,
    width, height
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [waveformData, setWaveformData] = useState<number[]>([]);

    useEffect(() => {
        if (audioUrl) {
            generateWaveform(audioUrl);
        }
    }, [audioUrl]);

    const generateWaveform = async (url: string) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch audio');
            const arrayBuffer = await response.arrayBuffer();
            const audioContext = new (window.AudioContext || (window as CustomWindow).webkitAudioContext!)();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            const channelData = audioBuffer.getChannelData(0);
            const samples = 200;
            const blockSize = Math.floor(channelData.length / samples);
            const waveform = [];

            for (let i = 0; i < samples; i++) {
                const start = i * blockSize;
                let sum = 0;
                for (let j = 0; j < blockSize; j++) {
                    sum += Math.abs(channelData[start + j]);
                }
                waveform.push(sum / blockSize);
            }

            setWaveformData(waveform);
        } catch (error) {
            console.error('Error generating waveform:', error);
        }
    };

    useEffect(() => {
        if (canvasRef.current && waveformData.length > 0) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const gap = 2; // space between bars
const barWidth = (canvas.width - (waveformData.length - 1) * gap) / waveformData.length;

                const heightMultiplier = canvas.height / Math.max(...waveformData);

                waveformData.forEach((amplitude, index) => {
                    const x = index * barWidth;
                    const height = amplitude * heightMultiplier;

                    if (index / waveformData.length <= currentTime / duration) {
                        ctx.fillStyle = '#F97316';
                    } else {
                        ctx.fillStyle = '#CACACA';
                    }

                    ctx.fillRect(x, (canvas.height - height) / 2, barWidth - 2, height);
                });
            }
        }
    }, [waveformData, currentTime, duration]);

    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const clickPosition = x / rect.width;
            onTimeUpdate(clickPosition * duration);
        }
    };

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={100}
            onClick={handleClick}
            style={{ cursor: 'pointer', width: `${width}rem`, height: `${height}rem` }}
        />
    );
};

export default Waveform;

