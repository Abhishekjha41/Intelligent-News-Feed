import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NewsArticle, useGenerateBriefing, useGetArticleTimeline, BriefingRequestMode } from "@workspace/api-client-react";
import { X, Brain, Clock, ChevronRight, Activity, TrendingUp, Sparkles, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn, formatDate } from "@/lib/utils";

interface AIDetailOverlayProps {
  article: NewsArticle | null;
  onClose: () => void;
}

type TabType = 'summary' | 'deep_dive' | 'timeline' | 'impact';

export function AIDetailOverlay({ article, onClose }: AIDetailOverlayProps) {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [readingMode, setReadingMode] = useState<BriefingRequestMode>('normal');

  const { data: briefing, isPending: isBriefingLoading, mutate: getBriefing } = useGenerateBriefing();
  const { data: timeline, isLoading: isTimelineLoading } = useGetArticleTimeline(article?.id || "", {
    query: { enabled: activeTab === 'timeline' && !!article }
  });

  useEffect(() => {
    if (article && (activeTab === 'summary' || activeTab === 'deep_dive' || activeTab === 'impact')) {
      getBriefing({
        id: article.id,
        data: { mode: readingMode, style: activeTab === 'deep_dive' ? 'deep_dive' : 'tldr' }
      });
    }
  }, [article, activeTab, readingMode]);

  if (!article) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="relative w-full max-w-5xl max-h-full h-[90vh] glass-panel rounded-3xl overflow-hidden flex flex-col border border-white/10 shadow-2xl"
        >
          {/* Header */}
          <div className="relative h-48 md:h-64 flex-shrink-0">
            {article.imageUrl ? (
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white border border-white/10 hover:bg-white/10 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
              <div className="flex gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30 backdrop-blur-md">
                  {article.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium border border-white/10 backdrop-blur-md">
                  {article.source}
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-display font-bold text-white max-w-3xl leading-tight">
                {article.title}
              </h2>
            </div>
          </div>

          <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 p-4 md:p-6 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible flex-shrink-0">
              <TabButton 
                active={activeTab === 'summary'} 
                onClick={() => setActiveTab('summary')}
                icon={<Sparkles className="w-4 h-4" />}
                label="AI Summary"
              />
              <TabButton 
                active={activeTab === 'deep_dive'} 
                onClick={() => setActiveTab('deep_dive')}
                icon={<Layers className="w-4 h-4" />}
                label="Deep Dive"
              />
              <TabButton 
                active={activeTab === 'timeline'} 
                onClick={() => setActiveTab('timeline')}
                icon={<Clock className="w-4 h-4" />}
                label="Story Timeline"
              />
              <TabButton 
                active={activeTab === 'impact'} 
                onClick={() => setActiveTab('impact')}
                icon={<Activity className="w-4 h-4" />}
                label="Wider Impact"
              />

              <div className="mt-auto hidden md:block pt-6 border-t border-white/10">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Understanding Level</p>
                <div className="flex flex-col gap-2">
                  {(['beginner', 'normal', 'expert'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setReadingMode(mode)}
                      className={cn(
                        "text-sm text-left px-3 py-2 rounded-lg transition-colors capitalize",
                        readingMode === mode 
                          ? "bg-primary/20 text-primary font-medium" 
                          : "text-muted-foreground hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto p-6 md:p-8 hide-scrollbar">
              <AnimatePresence mode="wait">
                {(isBriefingLoading && activeTab !== 'timeline') || (isTimelineLoading && activeTab === 'timeline') ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-primary"
                  >
                    <Brain className="w-12 h-12 animate-pulse mb-4" />
                    <p className="font-medium animate-pulse">AI is analyzing this story...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-3xl space-y-8"
                  >
                    {activeTab === 'summary' && briefing && (
                      <div className="space-y-8 text-white/90">
                        <section>
                          <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
                            <Sparkles className="text-primary w-5 h-5" /> TL;DR
                          </h3>
                          <p className="text-lg leading-relaxed text-muted-foreground bg-white/5 p-5 rounded-2xl border border-white/10">
                            {briefing.tldr}
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-display font-bold text-white mb-4">Key Takeaways</h3>
                          <ul className="space-y-3">
                            {briefing.keyPoints.map((point, i) => (
                              <li key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-colors">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                                  {i + 1}
                                </span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </section>
                      </div>
                    )}

                    {activeTab === 'deep_dive' && briefing && (
                      <div className="space-y-8 text-white/90">
                         <section>
                          <h3 className="text-xl font-display font-bold text-white mb-4">Why It Matters</h3>
                          <div className="prose prose-invert max-w-none text-muted-foreground prose-p:leading-relaxed">
                            <p>{briefing.whyItMatters}</p>
                          </div>
                        </section>
                      </div>
                    )}

                    {activeTab === 'impact' && briefing && (
                      <div className="space-y-8 text-white/90">
                         <section>
                          <h3 className="text-xl font-display font-bold text-white mb-4">Global Impact</h3>
                          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                            <p className="text-lg text-white/90">{briefing.impact}</p>
                          </div>
                        </section>
                        <section>
                          <h3 className="text-xl font-display font-bold text-white mb-4">What's Next?</h3>
                          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <p className="text-muted-foreground">{briefing.whatNext}</p>
                          </div>
                        </section>
                      </div>
                    )}

                    {activeTab === 'timeline' && timeline && (
                      <div className="space-y-8 text-white/90">
                        <div className="relative border-l-2 border-white/10 ml-3 md:ml-4 space-y-8 pb-4">
                          {timeline.events.map((event, i) => (
                            <div key={i} className="relative pl-6 md:pl-8">
                              <div className={cn(
                                "absolute w-4 h-4 rounded-full -left-[9px] top-1 border-2 border-background",
                                event.importance === 'high' ? 'bg-primary shadow-[0_0_10px_rgba(0,240,255,0.8)]' : 
                                event.importance === 'medium' ? 'bg-secondary' : 'bg-white/30'
                              )} />
                              <span className="text-primary font-mono text-sm mb-1 block">{formatDate(event.date)}</span>
                              <h4 className="text-lg font-bold text-white mb-2">{event.title}</h4>
                              <p className="text-muted-foreground text-sm">{event.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-sm font-medium whitespace-nowrap md:whitespace-normal",
        active 
          ? "bg-white/10 text-white shadow-inner" 
          : "text-muted-foreground hover:bg-white/5 hover:text-white"
      )}
    >
      <div className={cn("flex-shrink-0", active ? "text-primary" : "text-muted-foreground")}>
        {icon}
      </div>
      {label}
      {active && (
        <motion.div 
          layoutId="activeTab" 
          className="absolute left-0 w-1 h-8 bg-primary rounded-r-full hidden md:block" 
        />
      )}
    </button>
  );
}
