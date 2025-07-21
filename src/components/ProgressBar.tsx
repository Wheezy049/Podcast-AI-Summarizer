import React from 'react'

type ProgressBarProps = {
  value: number;
};

function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <div
        className="bg-blue-600 h-full transition-all duration-300 ease-in-out"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

export default ProgressBar