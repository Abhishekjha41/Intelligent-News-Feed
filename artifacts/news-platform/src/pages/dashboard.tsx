import { useState } from "react";
import { useGetNewsFeed } from "@workspace/api-client-react";
import { TopBar } from "@/components/layout/TopBar";
import { NewsCard } from "@/components/news/NewsCard";
import { AlertPanel } from "@/components/news/AlertPanel";
import { AIDetailOverlay } from "@/components/news/AIDetailOverlay";
import { PreferencesDialog } from "@/components/settings/PreferencesDialog";
import { NewsArticle } from "@workspace/api-client-react";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  
  const { data: articles, isLoading, error } = useGetNewsFeed();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30">
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <img 
          src={`${import.meta.env.BASE_URL}images/deep-space-bg.png`} 
          alt="Space background" 
          className="w-full h-full object-cover opacity-60 mix-blend-screen"
        />
      </div>

      <TopBar onSettingsClick={() => setIsPreferencesOpen(true)} />
      
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Main Feed */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Your Briefing</h1>
            <div className="flex gap-2">
              {['For You', 'Trending', 'Local'].map((tab, i) => (
                <button key={tab} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${i === 0 ? 'bg-white/10 text-white border border-white/20' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-[380px] rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center glass-panel rounded-2xl">
              <Activity className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Error loading feed</h2>
              <p className="text-muted-foreground">Please try refreshing the page.</p>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {articles?.map(article => (
                <motion.div key={article.id} variants={itemVariants}>
                  <NewsCard article={article} onClick={setSelectedArticle} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-8">
          <AlertPanel />
          
          <div className="glass-panel p-5 rounded-2xl border-white/10">
            <h3 className="font-display font-bold text-lg text-white mb-4">Trending Now</h3>
            <div className="space-y-4">
              {['Quantum Computing Breakthrough', 'Global Market Rally', 'Mars Mission Update'].map((trend, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-white/20 group-hover:text-primary transition-colors">0{i+1}</span>
                    <span className="text-sm font-medium text-white/80 group-hover:text-white">{trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </main>

      <AIDetailOverlay 
        article={selectedArticle} 
        onClose={() => setSelectedArticle(null)} 
      />

      <PreferencesDialog 
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />
    </div>
  );
}
