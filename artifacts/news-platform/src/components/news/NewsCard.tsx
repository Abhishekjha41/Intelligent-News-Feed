import { useState } from "react";
import { motion } from "framer-motion";
import { NewsArticle } from "@workspace/api-client-react";
import { cn, formatTimeAgo, getCategoryColor, getSentimentColor } from "@/lib/utils";
import { Brain, Clock, ChevronRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NewsCardProps {
  article: NewsArticle;
  onClick: (article: NewsArticle) => void;
}

export function NewsCard({ article, onClick }: NewsCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative h-[380px] w-full perspective-[1000px] cursor-pointer group"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => onClick(article)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-all duration-500"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* FRONT OF CARD */}
        <div className="absolute w-full h-full backface-hidden glass-panel rounded-2xl overflow-hidden flex flex-col border border-white/10 group-hover:border-primary/50">
          <div className="h-48 relative overflow-hidden">
            {article.imageUrl ? (
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                <Activity className="w-12 h-12 text-white/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md", getCategoryColor(article.category))}>
                {article.category}
              </span>
            </div>
            
            {/* Importance Gauge */}
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1.5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-white">{article.importance}/10</span>
            </div>
          </div>
          
          <div className="p-5 flex flex-col flex-grow">
            <h3 className="font-display font-bold text-lg leading-tight line-clamp-3 text-white mb-2">
              {article.title}
            </h3>
            
            <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="text-white/70">{article.source}</span>
                <span>•</span>
                <span>{formatTimeAgo(article.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{article.readTime ? Math.round(article.readTime/60) : 3}m</span>
              </div>
            </div>
          </div>
        </div>

        {/* BACK OF CARD (AI INSIGHTS) */}
        <div className="absolute w-full h-full backface-hidden glass-panel rounded-2xl p-6 flex flex-col items-center justify-center text-center rotate-y-180 border-primary/30 bg-gradient-to-br from-background via-background to-primary/10">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          
          <h4 className="text-primary font-display font-bold text-xl mb-3">AI Insight</h4>
          
          <p className="text-sm text-muted-foreground line-clamp-4 mb-6">
            {article.summary}
          </p>
          
          <div className="w-full space-y-2 mb-6 text-left text-xs bg-black/20 rounded-xl p-3">
            <div className="flex justify-between items-center">
              <span className="text-white/50">Sentiment:</span>
              <span className={cn("font-medium", getSentimentColor(article.sentiment))}>
                {article.sentiment.toUpperCase()}
              </span>
            </div>
            {article.relevanceReason && (
              <div className="flex justify-between items-center">
                <span className="text-white/50">Why you:</span>
                <span className="font-medium text-white/90 line-clamp-1 max-w-[60%]">{article.relevanceReason}</span>
              </div>
            )}
          </div>

          <Button variant="glow" className="w-full mt-auto group/btn">
            Deep Dive
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
