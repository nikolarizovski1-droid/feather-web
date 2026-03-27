'use client';

interface DurationPickerProps {
  durations: string[];
  selectedDuration: string;
  getDurationDisplayName: (duration: string) => string;
  onDurationChange: (duration: string) => void;
}

export default function DurationPicker({
  durations,
  selectedDuration,
  getDurationDisplayName,
  onDurationChange,
}: DurationPickerProps) {
  return (
    <div className="flex bg-[#252525] rounded-lg p-1">
      {durations.map((duration) => (
        <button
          key={duration}
          onClick={() => onDurationChange(duration)}
          className={`flex-1 py-2.5 px-4 text-center rounded-md text-sm font-medium transition-all ${
            duration === selectedDuration
              ? 'bg-[#313131] text-white'
              : 'text-[#CFCFCF] hover:text-white'
          }`}
        >
          {getDurationDisplayName(duration)}
        </button>
      ))}
    </div>
  );
}
