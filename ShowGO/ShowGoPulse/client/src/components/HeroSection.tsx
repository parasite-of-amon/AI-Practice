import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import SoundWave from "./SoundWave";

interface HeroSectionProps {
  onJoinMovement?: () => void;
}

export default function HeroSection({ onJoinMovement }: HeroSectionProps) {
  const scrollToEvents = () => {
    const eventsSection = document.getElementById('events');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleJoinMovement = () => {
    if (onJoinMovement) {
      onJoinMovement();
    } else {
      // Default behavior - scroll to events
      scrollToEvents();
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
      
      {/* Animated particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: '1s' }}
        />
      </div>
      
      <div className="relative max-w-4xl mx-auto text-center z-10">
        {/* Main Heading */}
        <h1 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 animate-fade-in-up"
          data-testid="hero-title"
        >
          Discover Music Events
        </h1>
        
        {/* Animated sound wave visualization */}
        <div className="mb-10 h-24 animate-fade-in-up stagger-1">
          <SoundWave />
        </div>
        
        {/* CTA Button */}
        <Button
          onClick={handleJoinMovement}
          className="group relative px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl text-lg hover:bg-primary/90 transition-all duration-300 glow-effect animate-fade-in-up stagger-2"
          data-testid="cta-join-movement"
        >
          <span className="relative z-10">Join the movement</span>
          <div className="absolute inset-0 bg-primary rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
        </Button>
        
        {/* Scroll indicator */}
        <button
          onClick={scrollToEvents}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-muted-foreground hover:text-primary transition-colors"
          data-testid="scroll-indicator"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
