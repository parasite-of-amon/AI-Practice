import { type Event, type InsertEvent, type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private events: Map<string, Event>;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    
    // Initialize with sample events
    this.initializeEvents();
  }

  private initializeEvents() {
    const sampleEvents: InsertEvent[] = [
      {
        name: "Rock Concert",
        description: "An electrifying night of rock music with epic performances.",
        location: "New York, NY",
        venue: "Madison Square Garden",
        date: "August 25",
        time: "8:00 PM",
        category: "Rock",
        tags: ["Live", "Outdoor", "Guitar"],
        imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      },
      {
        name: "Jazz Night",
        description: "Join us for a smooth and soulful evening of jazz tunes.",
        location: "Los Angeles, CA",
        venue: "The Jazz Lounge",
        date: "September 10",
        time: "7:30 PM",
        category: "Jazz",
        tags: ["Smooth", "Intimate", "Saxophone"],
        imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      },
      {
        name: "Classical Symphony",
        description: "Experience the timeless beauty of classical music with a full orchestra.",
        location: "Boston, MA",
        venue: "Symphony Hall",
        date: "September 18",
        time: "7:00 PM",
        category: "Classical",
        tags: ["Orchestra", "Traditional", "Elegant"],
        imageUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      },
      {
        name: "Bollywood Night",
        description: "Dance to the vibrant rhythms of Bollywood music and celebrate Indian culture.",
        location: "San Francisco, CA",
        venue: "The Palace",
        date: "September 22",
        time: "8:00 PM",
        category: "India",
        tags: ["Dance", "Bollywood", "Cultural"],
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      },
      {
        name: "Hard Rock Festival",
        description: "The ultimate rock experience with legendary bands and emerging artists.",
        location: "Las Vegas, NV",
        venue: "The Arena",
        date: "October 5",
        time: "6:00 PM",
        category: "Rock",
        tags: ["Festival", "Heavy", "Live"],
        imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      },
      {
        name: "Jazz Fusion",
        description: "An experimental blend of jazz with modern sounds and improvisation.",
        location: "Chicago, IL",
        venue: "Blue Note Jazz Club",
        date: "October 12",
        time: "9:00 PM",
        category: "Jazz",
        tags: ["Modern", "Experimental", "Improvisation"],
        imageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      },
      {
        name: "Classical Piano Recital",
        description: "A masterful performance of classical piano works by renowned composers.",
        location: "New York, NY",
        venue: "Carnegie Hall",
        date: "October 20",
        time: "7:30 PM",
        category: "Classical",
        tags: ["Piano", "Solo", "Traditional"],
        imageUrl: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      },
      {
        name: "Indian Classical Music",
        description: "Traditional Indian classical music featuring sitar and tabla performances.",
        location: "Seattle, WA",
        venue: "Cultural Center",
        date: "October 28",
        time: "7:00 PM",
        category: "India",
        tags: ["Traditional", "Sitar", "Tabla"],
        imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      }
    ];

    sampleEvents.forEach(event => {
      this.createEvent(event);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const event: Event = {
      ...insertEvent,
      id,
      tags: insertEvent.tags || [],
      createdAt: new Date(),
    };
    this.events.set(id, event);
    return event;
  }
}

export const storage = new MemStorage();
