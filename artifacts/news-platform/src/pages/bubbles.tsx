import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useGetTrendingTopics, TrendingTopic } from "@workspace/api-client-react";
import { TopBar } from "@/components/layout/TopBar";
import { getCategoryColor } from "@/lib/utils";

export default function BubblesView() {
  const { data: topics, isLoading } = useGetTrendingTopics();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight
      });
    }
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col h-screen overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <img 
          src={`${import.meta.env.BASE_URL}images/deep-space-bg.png`} 
          alt="Space background" 
          className="w-full h-full object-cover opacity-60 mix-blend-screen"
        />
      </div>
      
      <TopBar onSettingsClick={() => {}} />

      <main className="flex-1 relative p-4" ref={containerRef}>
        <div className="absolute top-8 left-8 z-10">
          <h1 className="text-4xl font-display font-bold text-white mb-2 text-glow">The Infoverse</h1>
          <p className="text-muted-foreground max-w-md">Explore trending topics conceptually. Larger bubbles represent higher global importance and engagement.</p>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {dimensions.width > 0 && topics?.map((topic, i) => {
          // Calculate random starting positions
          const size = Math.max(80, (topic.importance / 100) * 250);
          const startX = (dimensions.width / 2) + (Math.random() * 400 - 200);
          const startY = (dimensions.height / 2) + (Math.random() * 400 - 200);
          
          return (
            <Bubble 
              key={topic.id}
              topic={topic}
              size={size}
              startX={startX}
              startY={startY}
              index={i}
            />
          );
        })}
      </main>
    </div>
  );
}

function Bubble({ topic, size, startX, startY, index }: { topic: TrendingTopic, size: number, startX: number, startY: number, index: number }) {
  const colorClass = getCategoryColor(topic.category);
  // Extract just the background part or use standard glassmorphism
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: startX, y: startY }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: [startY, startY - 20, startY + 20, startY],
        x: [startX, startX + 15, startX - 15, startX]
      }}
      transition={{ 
        opacity: { duration: 0.5, delay: index * 0.1 },
        scale: { type: "spring", stiffness: 200, damping: 20, delay: index * 0.1 },
        y: { repeat: Infinity, duration: 5 + Math.random() * 5, ease: "easeInOut" },
        x: { repeat: Infinity, duration: 6 + Math.random() * 5, ease: "easeInOut" }
      }}
      whileHover={{ scale: 1.05, zIndex: 50 }}
      className={`absolute flex items-center justify-center rounded-full cursor-pointer glass-panel border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-primary/50 hover:shadow-[0_0_40px_rgba(0,240,255,0.3)]`}
      style={{ 
        width: size, 
        height: size,
        marginLeft: -size/2,
        marginTop: -size/2
      }}
    >
      <div className="text-center p-4">
        <span className="block text-xs font-bold uppercase tracking-widest text-primary/80 mb-1">{topic.category}</span>
        <h3 className="text-white font-bold leading-tight" style={{ fontSize: Math.max(12, size/10) }}>
          {topic.name}
        </h3>
        {size > 120 && (
          <span className="block text-xs text-muted-foreground mt-2">{topic.articleCount} stories</span>
        )}
      </div>
    </motion.div>
  );
}
