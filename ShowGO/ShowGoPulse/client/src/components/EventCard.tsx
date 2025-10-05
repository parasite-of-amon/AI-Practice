import { MapPin, Building, Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Event } from "@shared/schema";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Card className="event-card bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all" data-testid={`event-card-${event.id}`}>
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/3 lg:w-1/4 relative overflow-hidden bg-secondary min-h-[200px] md:min-h-[250px]">
          <img 
            src={event.imageUrl} 
            alt={event.name}
            className="event-image absolute inset-0 w-full h-full object-cover"
            data-testid={`event-image-${event.id}`}
          />
          <div className="absolute top-4 left-4 px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full text-xs font-semibold">
            <span data-testid={`event-category-${event.id}`}>{event.category}</span>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="flex-1 p-6 md:p-8">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <h3 
                className="text-2xl md:text-3xl font-bold mb-3 text-foreground"
                data-testid={`event-title-${event.id}`}
              >
                {event.name}
              </h3>
              <p 
                className="text-muted-foreground mb-4 leading-relaxed"
                data-testid={`event-description-${event.id}`}
              >
                {event.description}
              </p>
              
              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6" data-testid={`event-tags-${event.id}`}>
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      data-testid={`event-tag-${event.id}-${index}`}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium" data-testid={`event-location-${event.id}`}>
                    {event.location}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Building className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Venue</p>
                  <p className="font-medium" data-testid={`event-venue-${event.id}`}>
                    {event.venue}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium" data-testid={`event-date-${event.id}`}>
                    {event.date}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium" data-testid={`event-time-${event.id}`}>
                    {event.time}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
