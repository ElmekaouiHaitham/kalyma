export const LANGUAGES = [
  { code: "es", name: "Spanish", flag: "🇪🇸", speakers: "500M+" },
  { code: "fr", name: "French", flag: "🇫🇷", speakers: "300M+" },
  { code: "de", name: "German", flag: "🇩🇪", speakers: "130M+" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", speakers: "125M+" },
  { code: "pt", name: "Portuguese", flag: "🇧🇷", speakers: "260M+" },
  { code: "zh", name: "Mandarin", flag: "🇨🇳", speakers: "1.1B+" },
  { code: "ko", name: "Korean", flag: "🇰🇷", speakers: "80M+" },
  { code: "it", name: "Italian", flag: "🇮🇹", speakers: "85M+" },
  { code: "ar", name: "Arabic", flag: "🇸🇦", speakers: "420M+" },
  { code: "ru", name: "Russian", flag: "🇷🇺", speakers: "155M+" },
  { code: "hi", name: "Hindi", flag: "🇮🇳", speakers: "600M+" },
  { code: "nl", name: "Dutch", flag: "🇳🇱", speakers: "24M+" },
];

export const PROFICIENCY_LEVELS = [
  { code: "A1", label: "Beginner", desc: "Just starting out" },
  { code: "A2", label: "Elementary", desc: "Basic phrases" },
  { code: "B1", label: "Intermediate", desc: "Can handle most situations" },
  {
    code: "B2",
    label: "Upper-Intermediate",
    desc: "Fluent in familiar topics",
  },
  { code: "C1", label: "Advanced", desc: "Near-native ability" },
  { code: "C2", label: "Mastery", desc: "Fully proficient" },
];

export const TOPICS = [
  { id: "tech", label: "Technology", icon: "💻" },
  { id: "culture", label: "Culture & Arts", icon: "🎨" },
  { id: "business", label: "Business", icon: "💼" },
  { id: "travel", label: "Travel", icon: "✈️" },
  { id: "food", label: "Food & Cuisine", icon: "🍳" },
  { id: "sports", label: "Sports", icon: "⚽" },
  { id: "science", label: "Science", icon: "🔬" },
  { id: "politics", label: "Politics", icon: "🏛️" },
  { id: "music", label: "Music", icon: "🎵" },
  { id: "film", label: "Film & TV", icon: "🎬" },
  { id: "nature", label: "Nature", icon: "🌿" },
  { id: "fashion", label: "Fashion", icon: "👗" },
];

export const DAILY_GOALS = [
  { minutes: 5, label: "Casual", desc: "5 min / day", icon: "🌱" },
  { minutes: 10, label: "Regular", desc: "10 min / day", icon: "🌿" },
  { minutes: 20, label: "Serious", desc: "20 min / day", icon: "🌳" },
  { minutes: 30, label: "Intensive", desc: "30 min / day", icon: "🚀" },
];

export const ARTICLES = [
  {
    id: "1",
    title: "La Revolución de la Inteligencia Artificial en España",
    summary:
      "How AI is transforming Spain's largest tech companies and reshaping the job market.",
    category: "Technology",
    readingTime: 8,
    date: new Date(Date.now() - 86400000 * 2),
    level: "B1",
    language: "Spanish",
    completed: true,
    content: `La inteligencia artificial está cambiando el panorama tecnológico en España de maneras que nunca antes habíamos visto. Las grandes empresas tecnológicas están invirtiendo miles de millones de euros en proyectos de IA que prometen revolucionar desde la sanidad hasta el transporte.

En Madrid, el hub tecnológico más importante del país, startups como Clarity AI y Wallbox están liderando esta transformación. Clarity AI, por ejemplo, utiliza algoritmos de aprendizaje automático para evaluar el impacto social y medioambiental de las inversiones, mientras que Wallbox está revolucionando la carga de vehículos eléctricos con software inteligente.

El gobierno español ha respondido a esta transformación con el lanzamiento del Plan Nacional de Inteligencia Artificial 2021-2026, que incluye una inversión de 600 millones de euros para posicionar a España como líder europeo en IA. Este plan se centra en tres áreas principales: investigación y desarrollo, adopción empresarial, y formación de talento.

Sin embargo, no todo son noticias positivas. Los sindicatos expresan su preocupación por el impacto de la automatización en el mercado laboral. Según un estudio reciente del Instituto Nacional de Estadística, aproximadamente el 35% de los empleos actuales en España podrían verse afectados por la automatización en los próximos diez años.

La clave, según los expertos, estará en la capacidad de reconversión laboral. "No se trata de que las máquinas roben empleos, sino de que los trabajadores aprendan a colaborar con la IA", explica la directora del Centro de IA de la Universidad Politécnica de Madrid, María González.`,
  },
  {
    id: "2",
    title: "Le Marché du Travail en France Après la Pandémie",
    summary:
      "An in-depth look at how France's labour market has evolved in the post-pandemic era.",
    category: "Business",
    readingTime: 6,
    date: new Date(Date.now() - 86400000),
    level: "B2",
    language: "French",
    completed: true,
    content: `Le marché du travail français a connu des transformations profondes depuis la fin de la pandémie de COVID-19. La généralisation du télétravail, l'essor de l'économie des plateformes et les nouvelles attentes des salariés ont redessiné le paysage professionnel du pays.

Selon les dernières données de l'INSEE, le taux de chômage en France s'établit à 7,1% au troisième trimestre 2024, son niveau le plus bas depuis les années 1990. Cette embellie du marché du travail s'explique en partie par la forte création d'emplois dans les secteurs de la technologie, de la santé et des énergies renouvelables.

Le télétravail, initialement imposé par les circonstances sanitaires, est désormais ancré dans les habitudes professionnelles françaises. Une étude récente de la DARES révèle que 26% des salariés pratiquent le télétravail au moins un jour par semaine, contre seulement 4% avant la pandémie.

Cette évolution soulève de nouvelles questions juridiques et sociales. Le droit à la déconnexion, inscrit dans le Code du travail depuis 2017, prend une importance capitale dans ce nouveau contexte. Les entreprises doivent trouver l'équilibre entre flexibilité et cohésion d'équipe.`,
  },
  {
    id: "3",
    title: "Tokyo: La Ciudad que Nunca Duerme",
    summary:
      "Exploring the unique culture, food, and daily life of Japan's sprawling capital.",
    category: "Culture",
    readingTime: 10,
    date: new Date(),
    level: "B1",
    language: "Spanish",
    completed: false,
    isFeatured: true,
    content: `Tokio es una ciudad de contradicciones fascinantes. Con más de 13 millones de habitantes en su área metropolitana, es la metrópolis más grande del mundo, pero sus calles se mantienen limpias, sus trenes llegan con una precisión milimétrica y sus ciudadanos mantienen un nivel de cortesía que muchos occidentales encuentran sorprendente.

La ciudad se organiza en torno a una red de transporte público que es, sin duda, la mejor del mundo. El sistema de metro de Tokio cuenta con 13 líneas y más de 280 estaciones, transportando diariamente a más de 8 millones de personas. La puntualidad es legendaria: el retraso medio de los trenes es de apenas 54 segundos al año.

Pero Tokio no es solo eficiencia y tecnología. La ciudad alberga una escena culinaria que rivaliza con París y Nueva York. Con más restaurantes con estrellas Michelin que cualquier otra ciudad del mundo, Tokio es el paraíso de los amantes de la gastronomía. Desde los ramen shops en los callejones de Shinjuku hasta los refinados restaurantes de kaiseki en Ginza, la oferta gastronómica es simplemente abrumadora.

El contraste entre lo antiguo y lo moderno es quizás la característica más definitoria de Tokio. El templo de Senso-ji en Asakusa, construido en el siglo VII, está rodeado de rascacielos ultramodernos. En Akihabara, el barrio de la electrónica, coexisten las tiendas de manga y anime con los últimos gadgets tecnológicos.`,
  },
  {
    id: "4",
    title: "Die Klimawende in Deutschland",
    summary:
      "Germany's ambitious energy transition and what it means for Europe's future.",
    category: "Science",
    readingTime: 12,
    date: new Date(Date.now() + 86400000),
    level: "C1",
    language: "German",
    completed: false,
    locked: true,
    content: "",
  },
  {
    id: "5",
    title: "El Arte del Flamenco: Más que un Baile",
    summary:
      "The deep cultural roots and emotional complexity of Spain's most iconic art form.",
    category: "Culture",
    readingTime: 7,
    date: new Date(Date.now() + 86400000 * 2),
    level: "A2",
    language: "Spanish",
    completed: false,
    locked: true,
    content: "",
  },
];

export const BOOKS = [
  {
    id: "b1",
    title: "El Principito",
    author: "Antoine de Saint-Exupéry",
    cover: "📖",
    category: "Literature",
    totalChapters: 27,
    completedChapters: 8,
    readingTime: 120,
    level: "A2",
    language: "Spanish",
  },
  {
    id: "b2",
    title: "Le Tour du monde en 80 jours",
    author: "Jules Verne",
    cover: "🌍",
    category: "Adventure",
    totalChapters: 37,
    completedChapters: 12,
    readingTime: 240,
    level: "B1",
    language: "French",
  },
  {
    id: "b3",
    title: "Siddhartha",
    author: "Hermann Hesse",
    cover: "🧘",
    category: "Philosophy",
    totalChapters: 12,
    completedChapters: 0,
    readingTime: 180,
    level: "B2",
    language: "German",
  },
];

export const LIVE_SESSIONS = [
  {
    id: "ls1",
    title: "Daily Spanish Conversation: Travel & Tourism",
    host: "María Rodriguez",
    hostAvatar: "MR",
    language: "Spanish",
    level: "B1",
    viewers: 234,
    startedAt: new Date(Date.now() - 900000),
    isLive: true,
    thumbnail: "✈️",
  },
  {
    id: "ls2",
    title: "French Grammar Deep Dive: Subjunctive Mood",
    host: "Pierre Dubois",
    hostAvatar: "PD",
    language: "French",
    level: "B2",
    viewers: 89,
    startedAt: new Date(Date.now() - 1800000),
    isLive: true,
    thumbnail: "📚",
  },
];

export const PAST_SESSIONS = [
  {
    id: "ps1",
    title: "Mastering Spanish Ser vs. Estar",
    host: "Carlos Mendez",
    hostAvatar: "CM",
    language: "Spanish",
    level: "A2",
    date: new Date(Date.now() - 86400000),
    duration: 45,
    summary:
      "In this session, we explored the fundamental difference between 'ser' (permanent states) and 'estar' (temporary states). We covered common expression patterns, practiced with real-world examples, and worked through common mistakes that English speakers make.",
    vocabulary: [
      "ser",
      "estar",
      "permanente",
      "temporal",
      "estado",
      "condición",
    ],
    viewers: 412,
    thumbnail: "🎯",
  },
  {
    id: "ps2",
    title: "French Pronunciation Clinic: Nasal Vowels",
    host: "Sophie Laurent",
    hostAvatar: "SL",
    language: "French",
    level: "B1",
    date: new Date(Date.now() - 86400000 * 2),
    duration: 60,
    summary:
      "We tackled the notoriously tricky nasal vowels in French. The session included listening exercises, tongue placement diagrams, minimal pairs practice, and a Q&A session where learners practiced in real-time.",
    vocabulary: ["en", "on", "an", "in", "un", "nasale", "voyelle"],
    viewers: 287,
    thumbnail: "🔊",
  },
  {
    id: "ps3",
    title: "Business German: Professional Email Writing",
    host: "Klaus Weber",
    hostAvatar: "KW",
    language: "German",
    level: "B2",
    date: new Date(Date.now() - 86400000 * 3),
    duration: 50,
    summary:
      "A practical workshop focused on writing professional emails in German. We covered formal greetings, appropriate closings, workplace vocabulary, and cultural norms around German business communication.",
    vocabulary: [
      "Sehr geehrte",
      "Mit freundlichen Grüßen",
      "Betreff",
      "Anlage",
      "Besprechung",
    ],
    viewers: 163,
    thumbnail: "💼",
  },
];

export const CHAT_MESSAGES = [
  {
    id: "m1",
    role: "ai" as const,
    content:
      "¡Hola! I'm Atlas, your AI language companion. I'm here to help you practice Spanish in a natural, conversational way. How are you feeling today? (Feel free to mix Spanish and English as you get comfortable!)",
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: "m2",
    role: "user" as const,
    content:
      "Hola Atlas! Estoy muy bien, gracias. I wented to the market this morning.",
    timestamp: new Date(Date.now() - 240000),
    hasError: true,
  },
  {
    id: "m3",
    role: "ai" as const,
    content:
      '¡Qué bueno que estés bien! I love that you\'re mixing languages — that\'s a great sign! Quick note: the word "wented" doesn\'t exist in English. The past tense of "go" is irregular: **"I went to the market this morning."** Your Spanish was perfect though! 🌟\n\nNow tell me more — ¿qué compraste en el mercado? (What did you buy at the market?)',
    timestamp: new Date(Date.now() - 180000),
    correction: {
      original: "I wented to the market",
      corrected: "I went to the market",
    },
  },
  {
    id: "m4",
    role: "user" as const,
    content:
      "Compré frutas y verduras. Y también... cómo se dice 'cheese' en español?",
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: "m5",
    role: "ai" as const,
    content:
      '¡Perfecto! Your sentence was grammatically correct — great job! 🎉\n\n**Cheese** = **"queso"** in Spanish. \n\nSo you could say: *"Compré frutas, verduras y queso."* (I bought fruits, vegetables, and cheese.)\n\nSpain is famous for its incredible cheeses! Have you ever tried *manchego*? It\'s a classic Spanish cheese from La Mancha. ¿Te gusta el queso? (Do you like cheese?)',
    timestamp: new Date(Date.now() - 60000),
  },
];
