import { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "#events", label: "Events" },
    { href: "/about", label: "About" },
  ];

  const scrollToEvents = (e: React.MouseEvent) => {
    e.preventDefault();
    const eventsSection = document.getElementById('events');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glassmorphism">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/"
              className="text-2xl font-bold text-white tracking-tight hover:text-primary transition-colors"
              data-testid="logo-link"
            >
              ShowGo
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              item.href === "#events" ? (
                <button
                  key={item.href}
                  onClick={scrollToEvents}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </button>
              ) : (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors font-medium"
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden transition-all duration-300 ease-in-out",
          isMobileMenuOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}>
          <div className="py-2 space-y-1 border-t border-border mt-2">
            {navigationItems.map((item) => (
              item.href === "#events" ? (
                <button
                  key={item.href}
                  onClick={scrollToEvents}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-md transition-colors"
                  data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </button>
              ) : (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
