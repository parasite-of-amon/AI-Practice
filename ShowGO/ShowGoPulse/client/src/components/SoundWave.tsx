import { cn } from "@/lib/utils";

interface SoundWaveProps {
  className?: string;
}

export default function SoundWave({ className }: SoundWaveProps) {
  const waveHeights = [
    { height: "h-8", animation: "animate-wave" },
    { height: "h-12", animation: "animate-wave-delay-1" },
    { height: "h-16", animation: "animate-wave-delay-2" },
    { height: "h-20", animation: "animate-wave-delay-3" },
    { height: "h-24", animation: "animate-wave-delay-4" },
    { height: "h-20", animation: "animate-wave" },
    { height: "h-16", animation: "animate-wave-delay-1" },
    { height: "h-12", animation: "animate-wave-delay-2" },
    { height: "h-16", animation: "animate-wave-delay-3" },
    { height: "h-20", animation: "animate-wave-delay-4" },
    { height: "h-24", animation: "animate-wave" },
    { height: "h-20", animation: "animate-wave-delay-1" },
    { height: "h-16", animation: "animate-wave-delay-2" },
    { height: "h-12", animation: "animate-wave-delay-3" },
    { height: "h-8", animation: "animate-wave-delay-4" },
  ];

  return (
    <div className={cn("flex items-center justify-center gap-1.5", className)} data-testid="sound-wave">
      {waveHeights.map((wave, index) => (
        <div
          key={index}
          className={cn(
            "w-1 bg-primary rounded-full",
            wave.height,
            wave.animation
          )}
          data-testid={`wave-bar-${index}`}
        />
      ))}
    </div>
  );
}
