import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Bell, User, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TopBarProps {
  onSettingsClick: () => void;
}

export function TopBar({ onSettingsClick }: TopBarProps) {
  const [location] = useLocation();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight hidden sm:block text-white">
            Nexus<span className="text-primary">AI</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className={`text-sm font-medium transition-colors ${location === '/' ? 'text-white' : 'text-muted-foreground hover:text-white'}`}>
            My Feed
          </Link>
          <Link href="/bubbles" className={`text-sm font-medium transition-colors ${location === '/bubbles' ? 'text-white' : 'text-muted-foreground hover:text-white'}`}>
            Explore Network
          </Link>
        </nav>
      </div>

      <div className="flex flex-1 max-w-xl px-4 lg:px-8">
        <div className={`relative w-full transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Ask AI about any topic..." 
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full h-11 bg-white/5 border border-white/10 rounded-full pl-11 pr-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1">
            <span className="text-[10px] bg-white/10 text-white/50 px-2 py-1 rounded border border-white/5 font-mono">⌘K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" className="relative hidden sm:flex text-muted-foreground hover:text-white">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onSettingsClick} className="text-muted-foreground hover:text-white">
          <Settings className="w-5 h-5" />
        </Button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-white/10 to-white/5 border border-white/20 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
          <User className="w-5 h-5 text-white/80" />
        </div>
      </div>
    </header>
  );
}
