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
    <div className="flex bg-black/5 rounded-full p-1">
      {durations.map((duration) => (
        <button
          key={duration}
          onClick={() => onDurationChange(duration)}
          className={`flex-1 py-2.5 px-4 text-center rounded-full text-sm font-medium transition-all duration-200 ${
            duration === selectedDuration
              ? 'bg-card text-ink-08 shadow-sm'
              : 'text-ink-05 hover:text-ink-08'
          }`}
        >
          {getDurationDisplayName(duration)}
        </button>
      ))}
    </div>
  );
}
