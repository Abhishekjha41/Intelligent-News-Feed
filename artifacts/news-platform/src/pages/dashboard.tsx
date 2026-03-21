import { useState, useMemo } from "react";
import { useGetNewsFeed, useGetTrendingTopics } from "@workspace/api-client-react";
import { TopBar } from "@/components/layout/TopBar";
import { NewsCard } from "@/components/news/NewsCard";
import { AlertPanel } from "@/components/news/AlertPanel";
import { AIDetailOverlay } from "@/components/news/AIDetailOverlay";
import { PreferencesDialog } from "@/components/settings/PreferencesDialog";
import { NewsArticle } from "@workspace/api-client-react";
import { Activity, TrendingUp, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const TABS = ["For You", "Tech", "Politics", "Sports", "Finance", "Entertainment", "World", "Science", "Business"] as const;
type Tab = typeof TABS[number];

const TOP_GENRES = ["Tech", "Finance", "World"] as const;

const GENRE_COLORS: Record<string, { from: string; to: string; glow: string }> = {
  Tech: { from: "#3b82f6", to: "#6366f1", glow: "#6366f144" },
  Finance: { from: "#10b981", to: "#059669", glow: "#10b98144" },
  World: { from: "#06b6d4", to: "#0891b2", glow: "#06b6d444" },
  Politics: { from: "#a855f7", to: "#7c3aed", glow: "#a855f744" },
  Sports: { from: "#f97316", to: "#ea580c", glow: "#f9731644" },
  Entertainment: { from: "#ec4899", to: "#db2777", glow: "#ec489944" },
  Science: { from: "#8b5cf6", to: "#7c3aed", glow: "#8b5cf644" },
  Business: { from: "#f59e0b", to: "#d97706", glow: "#f59e0b44" },
};

export default function Dashboard() {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("For You");

  const { data: articles, isLoading, error } = useGetNewsFeed();
  const { data: trending } = useGetTrendingTopics();

  const filteredArticles = useMemo(() => {
    if (!articles) return [];
    if (activeTab === "For You") return articles;
    return articles.filter(a => a.category === activeTab);
  }, [articles, activeTab]);

  const genreArticles = useMemo(() => {
    if (!articles) return {} as Record<string, NewsArticle[]>;
    return TOP_GENRES.reduce((acc, genre) => {
      acc[genre] = articles.filter(a => a.category === genre).slice(0, 4);
      return acc;
    }, {} as Record<string, NewsArticle[]>);
  }, [articles]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 26 } }
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
        <div className="flex-1 min-w-0">

          {/* Header + Tabs */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-3xl font-bold text-white tracking-tight">Your Briefing</h1>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                    activeTab === tab
                      ? "text-white"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  )}
                >
                  {activeTab === tab && (
                    <motion.span
                      layoutId="activeTabBg"
                      className="absolute inset-0 rounded-full bg-white/10 border border-white/20"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feed Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
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
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredArticles.length === 0 ? (
                  <motion.div variants={itemVariants} className="col-span-full p-12 text-center glass-panel rounded-2xl border border-white/10">
                    <p className="text-muted-foreground text-lg">No articles in this category yet.</p>
                  </motion.div>
                ) : (
                  filteredArticles.map(article => (
                    <motion.div key={article.id} variants={itemVariants}>
                      <NewsCard article={article} onClick={setSelectedArticle} />
                    </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Top Genres Section */}
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-white">Top Genres for You</h2>
            </div>
            <div className="space-y-8">
              {TOP_GENRES.map(genre => {
                const colors = GENRE_COLORS[genre];
                const gArticles = genreArticles[genre] || [];
                return (
                  <motion.div
                    key={genre}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="glass-panel rounded-2xl border border-white/10 p-6"
                    style={{ boxShadow: `0 0 40px -10px ${colors.glow}` }}
                  >
                    {/* Genre header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm"
                          style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
                        >
                          {genre[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">{genre}</h3>
                          <p className="text-xs text-muted-foreground">{gArticles.length} stories</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab(genre as Tab)}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-white/10 text-muted-foreground hover:text-white hover:border-white/20 transition-colors"
                      >
                        View all <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Concentric bubble layout */}
                    {gArticles.length > 0 ? (
                      <GenreBubbleLayout articles={gArticles} genre={genre} colors={colors} onArticleClick={setSelectedArticle} />
                    ) : (
                      <p className="text-muted-foreground text-sm">No articles available.</p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
          <AlertPanel />

          {/* Trending sidebar */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Trending Now
            </h3>
            <div className="space-y-3">
              {(trending ?? []).slice(0, 6).map((topic, i) => (
                <motion.div
                  key={topic.id}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-between group cursor-pointer py-1"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl font-bold text-white/20 group-hover:text-primary transition-colors flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors truncate">
                      {topic.name}
                    </span>
                  </div>
                  <span className={cn(
                    "text-xs font-medium px-1.5 py-0.5 rounded flex-shrink-0",
                    topic.trend === "rising" ? "text-emerald-400 bg-emerald-400/10" :
                    topic.trend === "falling" ? "text-rose-400 bg-rose-400/10" :
                    "text-blue-400 bg-blue-400/10"
                  )}>
                    {topic.trend === "rising" ? "↑" : topic.trend === "falling" ? "↓" : "→"}
                  </span>
                </motion.div>
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

function GenreBubbleLayout({
  articles,
  genre,
  colors,
  onArticleClick,
}: {
  articles: NewsArticle[];
  genre: string;
  colors: { from: string; to: string; glow: string };
  onArticleClick: (a: NewsArticle) => void;
}) {
  const centerSize = 110;
  const orbitRadius = 130;
  const satelliteSize = 80;
  const containerH = 320;

  const cx = "50%";
  const cy = containerH / 2;

  const satellites = articles.slice(0, Math.min(4, articles.length));
  const angleStep = (2 * Math.PI) / Math.max(satellites.length, 1);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: containerH }}>
      {/* Center: genre bubble */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
        className="absolute rounded-full flex items-center justify-center font-bold text-white cursor-default shadow-lg z-10"
        style={{
          width: centerSize,
          height: centerSize,
          left: `calc(${cx} - ${centerSize / 2}px)`,
          top: cy - centerSize / 2,
          background: `radial-gradient(circle at 35% 35%, ${colors.from}, ${colors.to})`,
          boxShadow: `0 0 30px ${colors.glow}, 0 0 60px ${colors.glow}`,
        }}
      >
        <span className="text-center leading-tight px-2 text-sm font-bold">{genre}</span>
      </motion.div>

      {/* Orbit ring */}
      <div
        className="absolute rounded-full border border-white/5"
        style={{
          width: orbitRadius * 2,
          height: orbitRadius * 2,
          left: `calc(${cx} - ${orbitRadius}px)`,
          top: cy - orbitRadius,
        }}
      />

      {/* Satellite article bubbles */}
      {satellites.map((article, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const bx = Math.cos(angle) * orbitRadius;
        const by = Math.sin(angle) * orbitRadius;

        const floatDelay = i * 0.8;

        return (
          <motion.div
            key={article.id}
            whileHover={{ scale: 1.15, zIndex: 20 }}
            whileTap={{ scale: 0.95 }}
            animate={{ y: [0, -5, 0] }}
            transition={{
              y: { repeat: Infinity, duration: 3.5 + i * 0.5, ease: "easeInOut", delay: floatDelay },
            }}
            onClick={() => onArticleClick(article)}
            className="absolute rounded-full flex items-center justify-center cursor-pointer glass-panel border border-white/15 hover:border-primary/50 z-10"
            style={{
              width: satelliteSize,
              height: satelliteSize,
              left: `calc(${cx} + ${bx}px - ${satelliteSize / 2}px)`,
              top: cy + by - satelliteSize / 2,
              boxShadow: `0 0 16px ${colors.glow}`,
            }}
          >
            <div className="text-center px-2">
              <p className="text-white text-[9px] font-medium leading-tight line-clamp-3">
                {article.title}
              </p>
            </div>
          </motion.div>
        );
      })}

      {/* Connector lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      >
        {satellites.map((_, i) => {
          const angle = angleStep * i - Math.PI / 2;
          const bx = Math.cos(angle) * orbitRadius;
          const by = Math.sin(angle) * orbitRadius;
          const containerWidth = 600;
          const halfW = containerWidth / 2;

          return (
            <line
              key={i}
              x1="50%"
              y1={cy}
              x2={`calc(50% + ${bx}px)`}
              y2={cy + by}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}
      </svg>
    </div>
  );
}
