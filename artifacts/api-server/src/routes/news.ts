import { Router, type IRouter, type Request, type Response } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

const categories = ["Tech", "Politics", "Sports", "Finance", "Entertainment", "World", "Science", "Business"];

const mockArticles = [
  {
    id: "art-001",
    title: "OpenAI Releases GPT-5: A Leap Toward AGI",
    summary: "OpenAI has unveiled GPT-5, their most capable model yet, demonstrating unprecedented reasoning abilities and multimodal understanding that experts say moves us closer to artificial general intelligence.",
    category: "Tech",
    source: "TechCrunch",
    publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    importance: 10,
    sentiment: "positive",
    tags: ["AI", "OpenAI", "GPT-5", "Technology"],
    readTime: 180,
    relevanceReason: "You follow AI and Technology"
  },
  {
    id: "art-002",
    title: "Global Markets Surge Amid Fed Rate Cut Signals",
    summary: "Stock markets worldwide experienced significant gains after Federal Reserve officials signaled a potential interest rate cut, with the S&P 500 rising 2.3% and tech stocks leading the charge.",
    category: "Finance",
    source: "Bloomberg",
    publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    importance: 8,
    sentiment: "positive",
    tags: ["Markets", "Fed", "Economy", "Stocks"],
    readTime: 120,
    relevanceReason: "Trending in Finance"
  },
  {
    id: "art-003",
    title: "Climate Summit Reaches Historic Carbon Agreement",
    summary: "World leaders have agreed to a landmark carbon reduction treaty at the Geneva Climate Summit, pledging to reduce emissions by 60% by 2040 in what scientists are calling the most ambitious climate action in history.",
    category: "World",
    source: "Reuters",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800&q=80",
    importance: 9,
    sentiment: "positive",
    tags: ["Climate", "Environment", "World Leaders", "Policy"],
    readTime: 240,
    relevanceReason: "High global impact story"
  },
  {
    id: "art-004",
    title: "SpaceX Artemis Moon Mission Launches Successfully",
    summary: "SpaceX's Starship carrying NASA's Artemis crew launched flawlessly from Kennedy Space Center, marking the beginning of humanity's return to the lunar surface after over 50 years.",
    category: "Science",
    source: "NASA",
    publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&q=80",
    importance: 10,
    sentiment: "positive",
    tags: ["SpaceX", "NASA", "Moon", "Space"],
    readTime: 200,
    relevanceReason: "Historic milestone in space exploration"
  },
  {
    id: "art-005",
    title: "Election 2026: AI Deepfakes Threaten Democracy",
    summary: "Election officials across the country are sounding alarms about sophisticated AI-generated deepfakes targeting candidates, raising urgent questions about the integrity of upcoming midterm elections.",
    category: "Politics",
    source: "Politico",
    publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80",
    importance: 9,
    sentiment: "negative",
    tags: ["Politics", "AI", "Elections", "Deepfakes"],
    readTime: 300,
    relevanceReason: "Critical civic issue affecting you"
  },
  {
    id: "art-006",
    title: "NBA Finals: Warriors vs Heat — Game 7 Tonight",
    summary: "The NBA Finals reaches its dramatic conclusion tonight as the Golden State Warriors and Miami Heat battle for the championship in a winner-take-all Game 7 at Chase Center.",
    category: "Sports",
    source: "ESPN",
    publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1546519638405-a57d31ee7c52?w=800&q=80",
    importance: 7,
    sentiment: "neutral",
    tags: ["NBA", "Basketball", "Warriors", "Heat"],
    readTime: 90,
    relevanceReason: "Major sporting event tonight"
  },
  {
    id: "art-007",
    title: "Tesla Unveils Cybertruck 2.0 with 800-Mile Range",
    summary: "Tesla has announced the next-generation Cybertruck featuring a groundbreaking solid-state battery with an 800-mile range, promising to revolutionize electric vehicle technology and the trucking industry.",
    category: "Tech",
    source: "The Verge",
    publishedAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1617886903355-9354bb57751f?w=800&q=80",
    importance: 7,
    sentiment: "positive",
    tags: ["Tesla", "EV", "Cybertruck", "Battery"],
    readTime: 150,
    relevanceReason: "You follow Tesla and EVs"
  },
  {
    id: "art-008",
    title: "Hollywood Writers Strike: AI Terms Finally Agreed",
    summary: "Hollywood's major studios and the Writers Guild of America have reached a groundbreaking deal establishing strict AI usage limits and compensation frameworks for writers whose work trains AI systems.",
    category: "Entertainment",
    source: "Variety",
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=800&q=80",
    importance: 6,
    sentiment: "positive",
    tags: ["Hollywood", "WGA", "AI", "Strike"],
    readTime: 180,
    relevanceReason: "Affects the media you consume"
  },
  {
    id: "art-009",
    title: "Quantum Computing Breakthrough: 1 Million Qubits Achieved",
    summary: "IBM researchers have achieved a major milestone by successfully operating a one-million qubit quantum processor, a development that could render current encryption methods obsolete within a decade.",
    category: "Science",
    source: "Nature",
    publishedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    importance: 9,
    sentiment: "neutral",
    tags: ["Quantum", "IBM", "Computing", "Science"],
    readTime: 300,
    relevanceReason: "Transformative technology news"
  },
  {
    id: "art-010",
    title: "Medicare Drug Pricing Reform Signed Into Law",
    summary: "President signs landmark legislation allowing Medicare to negotiate directly with pharmaceutical companies on drug prices, expected to save seniors billions and reduce insulin costs by 85%.",
    category: "Politics",
    source: "AP News",
    publishedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    importance: 8,
    sentiment: "positive",
    tags: ["Healthcare", "Medicare", "Drugs", "Policy"],
    readTime: 240,
    relevanceReason: "Healthcare policy that affects many"
  },
  {
    id: "art-011",
    title: "Apple Vision Pro 2 Announced: Neural Interface Added",
    summary: "Apple has unveiled Vision Pro 2, featuring an experimental neural interface that lets users control apps with their thoughts, alongside a dramatically improved display and 18-hour battery life.",
    category: "Tech",
    source: "MacRumors",
    publishedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&q=80",
    importance: 8,
    sentiment: "positive",
    tags: ["Apple", "Vision Pro", "AR", "Neural"],
    readTime: 180,
    relevanceReason: "You follow Apple and Tech"
  },
  {
    id: "art-012",
    title: "Global Chip Shortage Eases as TSMC Opens US Fab",
    summary: "TSMC's new Arizona semiconductor fabrication plant begins mass production, marking a turning point in the global chip shortage and reducing US dependence on Asian chipmakers.",
    category: "Business",
    source: "Wall Street Journal",
    publishedAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    importance: 7,
    sentiment: "positive",
    tags: ["TSMC", "Chips", "Manufacturing", "Supply Chain"],
    readTime: 210,
    relevanceReason: "Critical supply chain development"
  },
];

const mockTrending = [
  { id: "t1", name: "AI Revolution", category: "Tech", importance: 95, articleCount: 142, trend: "rising", color: "#6366f1" },
  { id: "t2", name: "Climate Action", category: "World", importance: 88, articleCount: 98, trend: "rising", color: "#10b981" },
  { id: "t3", name: "Space Race", category: "Science", importance: 82, articleCount: 76, trend: "rising", color: "#8b5cf6" },
  { id: "t4", name: "Election 2026", category: "Politics", importance: 78, articleCount: 115, trend: "rising", color: "#f59e0b" },
  { id: "t5", name: "Market Rally", category: "Finance", importance: 72, articleCount: 64, trend: "stable", color: "#3b82f6" },
  { id: "t6", name: "NBA Finals", category: "Sports", importance: 68, articleCount: 54, trend: "rising", color: "#ef4444" },
  { id: "t7", name: "Quantum Computing", category: "Science", importance: 62, articleCount: 42, trend: "rising", color: "#ec4899" },
  { id: "t8", name: "EV Innovation", category: "Tech", importance: 55, articleCount: 38, trend: "stable", color: "#14b8a6" },
  { id: "t9", name: "Crypto Rebound", category: "Finance", importance: 45, articleCount: 29, trend: "falling", color: "#f97316" },
  { id: "t10", name: "Hollywood AI Deal", category: "Entertainment", importance: 40, articleCount: 22, trend: "falling", color: "#a855f7" },
];

const mockAlerts = [
  {
    id: "alert-001",
    type: "breaking",
    title: "Breaking: Fed Rate Decision",
    message: "Federal Reserve announces emergency rate cut of 0.5% following market volatility",
    impact: "Stock markets expected to surge — check your portfolio",
    severity: "high",
    location: "National",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    id: "alert-002",
    type: "weather",
    title: "Severe Weather Warning",
    message: "Heavy rainfall and thunderstorms expected in major metropolitan areas tonight",
    impact: "Expect travel delays of 30-60 minutes on major highways",
    severity: "medium",
    location: "Regional",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: "alert-003",
    type: "local",
    title: "Political Rally Nearby",
    message: "Large political demonstration planned in downtown area from 2PM-8PM",
    impact: "Road closures and transit delays expected",
    severity: "low",
    location: "Local",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: "alert-004",
    type: "safety",
    title: "Cybersecurity Alert",
    message: "Major data breach affects 50M users of popular banking app — change passwords immediately",
    impact: "Financial data may be compromised — take action now",
    severity: "critical",
    location: "National",
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString()
  }
];

router.get("/news/feed", (req: Request, res: Response) => {
  const { categories: catParam, limit = "20", offset = "0" } = req.query;
  const lim = parseInt(limit as string, 10);
  const off = parseInt(offset as string, 10);
  
  let articles = [...mockArticles];
  
  if (catParam && typeof catParam === "string") {
    const cats = catParam.toLowerCase().split(",");
    articles = articles.filter(a => cats.some(c => a.category.toLowerCase().includes(c)));
  }
  
  const page = articles.slice(off, off + lim);
  res.json(page);
});

router.get("/news/trending", (_req: Request, res: Response) => {
  res.json(mockTrending);
});

router.get("/news/alerts", (_req: Request, res: Response) => {
  res.json(mockAlerts);
});

router.post("/news/articles/:id/briefing", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { mode = "normal", style = "tldr" } = req.body;
  
  const article = mockArticles.find(a => a.id === id);
  
  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  try {
    const levelGuide = mode === "beginner" 
      ? "Use simple language, avoid jargon, explain technical terms." 
      : mode === "expert"
      ? "Use technical language, include detailed analysis, assume high knowledge."
      : "Use clear, professional language for a general audience.";

    const styleGuide = style === "thirty_seconds"
      ? "Keep the entire briefing extremely brief - 30 seconds to read max."
      : style === "deep_dive"
      ? "Provide thorough, detailed analysis with nuance and context."
      : "Be concise but comprehensive.";

    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content: `You are an elite news analyst AI. ${levelGuide} ${styleGuide} Respond in valid JSON only.`
        },
        {
          role: "user",
          content: `Generate a structured news briefing for this article:

Title: ${article.title}
Summary: ${article.summary}
Category: ${article.category}
Tags: ${article.tags.join(", ")}
Sentiment: ${article.sentiment}

Return a JSON object with these exact fields:
{
  "tldr": "one sentence summary",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4"],
  "whyItMatters": "why this is important",
  "impact": "broader societal/economic/political impact",
  "whatNext": "what to expect next"
}`
        }
      ]
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { tldr: raw, keyPoints: [], whyItMatters: "", impact: "", whatNext: "" };
    }

    res.json({
      articleId: id,
      tldr: parsed.tldr as string || article.summary,
      keyPoints: parsed.keyPoints as string[] || [],
      whyItMatters: parsed.whyItMatters as string || "",
      impact: parsed.impact as string || "",
      whatNext: parsed.whatNext as string || "",
      mode
    });
  } catch (err) {
    req.log.error({ err }, "AI briefing failed, using fallback");
    res.json({
      articleId: id,
      tldr: article.summary,
      keyPoints: article.tags.map(t => `${t} is a key factor in this story`),
      whyItMatters: "This story has significant implications for the field and broader society.",
      impact: `This development in ${article.category} could have wide-ranging effects on policy and public opinion.`,
      whatNext: "Experts and analysts will be monitoring developments closely in the coming days.",
      mode
    });
  }
});

router.get("/news/articles/:id/timeline", async (req: Request, res: Response) => {
  const { id } = req.params;
  const article = mockArticles.find(a => a.id === id);

  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content: "You are a news timeline analyst. Create realistic, plausible story arcs. Respond in valid JSON only."
        },
        {
          role: "user",
          content: `Create a story arc timeline for this news article:

Title: ${article.title}
Summary: ${article.summary}
Category: ${article.category}
Published: ${article.publishedAt}

Return a JSON object with these exact fields:
{
  "events": [
    {"date": "YYYY-MM-DD", "title": "event title", "description": "what happened", "importance": "low|medium|high"},
    ... (5-7 events spanning the story arc)
  ],
  "keyPeople": [
    {"name": "person name", "role": "their role", "sentiment": "positive|neutral|negative"},
    ... (3-5 key people)
  ],
  "sentimentChanges": [
    {"date": "YYYY-MM-DD", "sentiment": 0.0, "label": "public reaction label"},
    ... (5 data points from -1 to 1)
  ],
  "futurePredictions": [
    "prediction 1",
    "prediction 2",
    "prediction 3"
  ]
}`
        }
      ]
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {};
    }

    res.json({
      articleId: id,
      title: article.title,
      events: parsed.events || [],
      keyPeople: parsed.keyPeople || [],
      sentimentChanges: parsed.sentimentChanges || [],
      futurePredictions: parsed.futurePredictions || []
    });
  } catch (err) {
    req.log.error({ err }, "Timeline generation failed, using fallback");
    const now = new Date();
    res.json({
      articleId: id,
      title: article.title,
      events: [
        { date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30).toISOString().split("T")[0], title: "Story Begins", description: "Initial reports emerge about this developing situation.", importance: "medium" },
        { date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 14).toISOString().split("T")[0], title: "Major Development", description: "Key stakeholders respond and the story gains momentum.", importance: "high" },
        { date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString().split("T")[0], title: "Public Attention", description: "Public and media focus intensifies on the issue.", importance: "high" },
        { date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString().split("T")[0], title: "Latest Update", description: "New information confirms earlier reports and adds context.", importance: "high" },
        { date: now.toISOString().split("T")[0], title: "Current State", description: article.summary, importance: "high" }
      ],
      keyPeople: [
        { name: "Senior Official", role: "Decision Maker", sentiment: "neutral" },
        { name: "Industry Expert", role: "Analyst", sentiment: "positive" },
        { name: "Public Spokesperson", role: "Communications", sentiment: "neutral" }
      ],
      sentimentChanges: [
        { date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30).toISOString().split("T")[0], sentiment: 0.1, label: "Cautious" },
        { date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 14).toISOString().split("T")[0], sentiment: -0.3, label: "Concerned" },
        { date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString().split("T")[0], sentiment: 0.2, label: "Hopeful" },
        { date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString().split("T")[0], sentiment: 0.5, label: "Optimistic" },
        { date: now.toISOString().split("T")[0], sentiment: article.sentiment === "positive" ? 0.7 : article.sentiment === "negative" ? -0.5 : 0.3, label: article.sentiment === "positive" ? "Positive" : article.sentiment === "negative" ? "Negative" : "Neutral" }
      ],
      futurePredictions: [
        `Further developments in ${article.category} are expected in the next few weeks`,
        "Key stakeholders will continue to respond and adjust their positions",
        "Long-term impact will depend on public and political response"
      ]
    });
  }
});

router.get("/news/preferences", (_req: Request, res: Response) => {
  res.json({
    categories: ["Tech", "Finance", "World", "Science"],
    location: "San Francisco, CA",
    readingLevel: "normal",
    alertsEnabled: true
  });
});

router.post("/news/preferences", (req: Request, res: Response) => {
  res.json(req.body);
});

export default router;
