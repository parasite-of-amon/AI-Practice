import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import EventCard from "@/components/EventCard";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  const categories = ["All", "Rock", "Jazz", "India", "Classical"];

  const filteredEvents = events?.filter(event => 
    selectedCategory === "All" || event.category === selectedCategory
  );

  useEffect(() => {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-5');
          entry.target.classList.add('opacity-100', 'translate-y-0');
        }
      });
    }, observerOptions);

    // Observe all event cards
    const cards = document.querySelectorAll('.event-card');
    cards.forEach(card => {
      card.classList.add('opacity-0', 'translate-y-5', 'transition-all', 'duration-700', 'ease-out');
      observerRef.current?.observe(card);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [filteredEvents]);

  const handleJoinMovement = () => {
    toast({
      title: "Welcome to the movement!",
      description: "Scroll down to discover amazing music events near you.",
    });
  };

  if (error) {
    console.error('Error loading events:', error);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <HeroSection onJoinMovement={handleJoinMovement} />
      
      <section id="events" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-12">
            <h2 
              className="text-4xl md:text-5xl font-bold mb-4"
              data-testid="events-section-title"
            >
              Upcoming Events
            </h2>
            <p className="text-muted-foreground text-lg">
              Don't miss out on these incredible live music experiences
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  data-testid={`category-${category.toLowerCase()}`}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Events List */}
          <div className="space-y-6">
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground" data-testid="loading-message">
                  Loading amazing events...
                </p>
              </div>
            )}
            
            {error && (
              <div className="text-center py-12">
                <p className="text-destructive mb-4" data-testid="error-message">
                  Unable to load events at this time.
                </p>
                <p className="text-muted-foreground">
                  Please check your connection and try again later.
                </p>
              </div>
            )}
            
            {filteredEvents && filteredEvents.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg" data-testid="no-events-message">
                  {selectedCategory === "All" 
                    ? "No events scheduled at the moment. Check back soon for new shows!"
                    : `No ${selectedCategory} events available at the moment.`
                  }
                </p>
              </div>
            )}
            
            {filteredEvents && filteredEvents.length > 0 && (
              <>
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </>
            )}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-border mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4" data-testid="footer-brand">ShowGo</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Discover and experience the best live music events in your city. Join the movement today.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors" 
                  aria-label="Twitter"
                  data-testid="social-twitter"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors" 
                  aria-label="Instagram"
                  data-testid="social-instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors" 
                  aria-label="Facebook"
                  data-testid="social-facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/" className="hover:text-primary transition-colors" data-testid="footer-link-home">Home</a></li>
                <li><a href="#events" className="hover:text-primary transition-colors" data-testid="footer-link-events">Events</a></li>
                <li><a href="/about" className="hover:text-primary transition-colors" data-testid="footer-link-about">About</a></li>
                <li><a href="/contact" className="hover:text-primary transition-colors" data-testid="footer-link-contact">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/privacy" className="hover:text-primary transition-colors" data-testid="footer-link-privacy">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-primary transition-colors" data-testid="footer-link-terms">Terms of Service</a></li>
                <li><a href="/cookies" className="hover:text-primary transition-colors" data-testid="footer-link-cookies">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
            <p data-testid="footer-copyright">&copy; 2024 ShowGo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
