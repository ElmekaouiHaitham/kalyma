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
  {
    id: "tech",
    label: "Technology",
    icon: "💻",
    subTopics: [
      "AI & Machine Learning",
      "Software Development",
      "Digital Gadgets",
      "Web Development",
      "Network Security",
    ],
  },
  {
    id: "culture",
    label: "Culture & Arts",
    icon: "🎨",
    subTopics: [
      "History",
      "Museums & Galleries",
      "Festivals",
      "Architecture",
      "Local Traditions",
    ],
  },
  {
    id: "business",
    label: "Business",
    icon: "💼",
    subTopics: [
      "Entrepreneurship",
      "Marketing",
      "Finance",
      "Leadership",
      "Economy",
    ],
  },
  {
    id: "travel",
    label: "Travel",
    icon: "✈️",
    subTopics: ["Destinations", "Cruises", "Solo Travel", "Ecotourism", "Hiking"],
  },
  {
    id: "food",
    label: "Food & Cuisine",
    icon: "🍳",
    subTopics: ["Cooking", "Street Food", "Healthy Diet", "Fine Dining", "Wine"],
  },
  {
    id: "sports",
    label: "Sports",
    icon: "⚽",
    subTopics: ["Football", "Tennis", "Fitness", "Extreme Sports", "E-Sports"],
  },
  {
    id: "science",
    label: "Science",
    icon: "🔬",
    subTopics: ["Physics", "Biology", "Environment", "Technology", "Research"],
  },
  {
    id: "politics",
    label: "Politics",
    icon: "🏛️",
    subTopics: ["Government", "International Relations", "Human Rights", "Policy"],
  },
  {
    id: "music",
    label: "Music",
    icon: "🎵",
    subTopics: ["Genres", "Instruments", "Concerts", "Theory", "Production"],
  },
  {
    id: "film",
    label: "Film & TV",
    icon: "🎬",
    subTopics: ["Movies", "Documentaries", "Animations", "Production", "Cinema"],
  },
  {
    id: "nature",
    label: "Nature",
    icon: "🌿",
    subTopics: ["Wildlife", "Environment", "Plants", "Gardening", "Ecology"],
  },
  {
    id: "fashion",
    label: "Fashion",
    icon: "👗",
    subTopics: ["Apparel", "Trends", "Sustainability", "Design", "Shows"],
  },
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
    read: true,
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
    read: true,
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
    read: false,
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

export const NEWS_CATEGORIES = ["General", "Tech", "Science", "Economy", "Culture", "Health"];

export const NEWS_ITEMS = [
  {
    id: "n1",
    title: "Global Markets Rally as Tech Stocks Hit Record Highs",
    summary: "Investors show renewed confidence in semiconductor and AI companies across major indices.",
    category: "Economy",
    date: new Date(),
    read: false,
    image: "📈",
    content: `Global financial markets surged to new highs on Monday as investors poured capital into technology stocks, particularly those focused on artificial intelligence and semiconductor manufacturing. The S&P 500 climbed 2.3% while the NASDAQ composite jumped 3.1%, marking the strongest single-day performance in over six months.

The rally was led by chip manufacturers and AI software companies, whose valuations have been climbing steadily throughout the year. Analysts attribute the surge to a combination of strong earnings reports and growing institutional confidence in the long-term potential of generative AI technologies.

"We're witnessing a fundamental shift in how investors value technology companies," said Morgan Stanley analyst Rebecca Chen. "The question is no longer whether AI will transform industries, but how quickly and which companies will lead that transformation."

Not everyone is optimistic. Some economists warn that valuations have become detached from underlying fundamentals, drawing comparisons to the dot-com bubble of the late 1990s. The price-to-earnings ratios for many AI-focused companies now exceed historical averages by a significant margin.

Despite these concerns, retail investor participation has remained robust. Trading volumes on major platforms hit record levels, with younger investors in particular showing strong appetite for technology exposure. Central banks are closely monitoring these developments as they continue to navigate the delicate balance between controlling inflation and sustaining economic growth.`,
  },
  {
    id: "n2",
    title: "NASA's Newest Mars Rover Successfully Lands",
    summary: "The rover will search for signs of ancient life and collect samples for future return to Earth.",
    category: "Science",
    date: new Date(),
    read: false,
    image: "🚀",
    content: `NASA's latest Mars rover mission achieved a flawless landing in the Jezero Crater region early Tuesday morning, sending back the first high-resolution images of its new Martian home just hours after touchdown. Mission control at the Jet Propulsion Laboratory erupted in celebration as telemetry confirmed successful landing.

The rover, equipped with an advanced suite of scientific instruments, will spend the next two years searching for biosignatures — chemical or physical evidence of past microbial life. Scientists believe Jezero Crater, once an ancient lake, is one of the most promising locations for such a search.

"Every time we land on Mars, we learn something new about the limits of what's possible," said NASA Administrator Bill Nelson during a press conference. "This mission represents our most ambitious scientific endeavor on another world."

One of the rover's most significant capabilities is its sample caching system, which will seal rock and soil samples in titanium tubes for retrieval by a future joint NASA-ESA mission. This sample return campaign, planned for the early 2030s, is considered the highest priority in planetary science.

The rover also carries a small helicopter drone, the third of its kind to fly on Mars, which will scout terrain and assist in selecting optimal drilling sites. Scientists expect the mission to provide transformative insights into Mars's geological and possibly biological history.`,
  },
  {
    id: "n3",
    title: "AI Breakthrough in Medical Diagnostics",
    summary: "New machine learning model identifies rare diseases with 99.8% accuracy.",
    category: "Tech",
    date: new Date(),
    read: false,
    image: "🔬",
    content: `A team of researchers at Johns Hopkins University has unveiled a machine learning system capable of diagnosing over 200 rare diseases from a standard blood panel with 99.8% accuracy — a breakthrough that could revolutionize early detection and dramatically reduce the years-long diagnostic odyssey many patients endure.

Rare diseases, by definition, affect fewer than 200,000 people in the United States, but collectively they impact nearly 300 million people worldwide. Many patients wait an average of five to seven years before receiving an accurate diagnosis, during which time their condition may worsen significantly.

The system, trained on anonymized medical records from over 2 million patients, uses a novel combination of transformer-based natural language processing and multimodal biological data analysis. It performs comparably to specialists and dramatically outperforms general practitioners in identifying subtle patterns associated with rare genetic disorders.

"We're not replacing doctors," emphasized Dr. Sarah Kim, the study's lead author. "We're giving them a powerful tool to do what they already do — care for patients — but faster and with greater precision."

The model has already been submitted for FDA review. If approved, hospitals could begin deploying it within 18 months. Several health systems have already expressed interest in pilot programs, and the research team is exploring partnerships with insurers to ensure the technology reaches underserved communities.`,
  },
  {
    id: "n4",
    title: "Major Cultural Festival Returns to Kyoto",
    summary: "The streets were filled with traditional costumes and music for the first time in three years.",
    category: "Culture",
    date: new Date(Date.now() - 86400000),
    read: true,
    image: "🏮",
    content: `Kyoto's legendary Gion Matsuri festival returned in its full splendor this weekend, drawing hundreds of thousands of visitors from around the world to witness one of Japan's most iconic cultural celebrations. The festival, which dates back over 1,100 years, had been scaled back for three consecutive years due to public health concerns.

The highlight of the festivities was the Yamaboko Junko procession, in which enormous wooden floats — some dating to the 17th century — were pulled through the ancient streets of central Kyoto by teams of hundreds. Each float, crafted by local artisan guilds, is a masterpiece of traditional Japanese craftsmanship adorned with tapestries and lacquerwork.

"Gion Matsuri is not just a festival — it's our living history," said Takeshi Yamamoto, a third-generation member of one of the float-building guilds. "When we pull these floats, we feel connected to every generation before us."

The economic impact on the city was significant. Hotels reported 98% occupancy rates, and local businesses along the festival route experienced record sales. City officials estimate the event generated over 50 billion yen in economic activity.

The festival also served as a showcase for traditional arts including tea ceremony demonstrations, ikebana flower arranging exhibitions, and performances of Noh theater — a dramatic art form designated by UNESCO as an Intangible Cultural Heritage of Humanity.`,
  },
  {
    id: "n5",
    title: "Understanding the New Health Guidelines for 2026",
    summary: "Simplified nutrition and exercise recommendations released by global health authorities.",
    category: "Health",
    date: new Date(Date.now() - 86400000 * 2),
    read: true,
    image: "🍎",
    content: `The World Health Organization and the American Heart Association jointly released updated health guidelines this week that represent the most significant revision to nutrition and exercise recommendations in over a decade. The new guidelines reflect years of accumulated research and aim to be more accessible and actionable for the general public.

Perhaps the most notable change is the shift away from specific calorie-counting in favor of a quality-first approach to nutrition. Rather than prescribing exact quantities, the guidelines emphasize the importance of dietary patterns — specifically the Mediterranean and MIND diets — which have consistently shown benefits for cardiovascular health and cognitive function.

"We've moved beyond the idea that a single nutrient is either good or bad," explained Dr. Maria Santos, one of the lead scientists behind the revision. "What matters is the overall quality and diversity of what you eat."

On the exercise front, the guidelines introduce the concept of "movement snacks" — short bursts of physical activity of three to five minutes that, accumulated throughout the day, confer benefits comparable to a single extended workout session. This approach recognizes the reality that many people struggle to find 30 consecutive minutes for exercise.

The guidelines also place greater emphasis on sleep quality and stress management, acknowledging that physical health cannot be separated from mental health. Recommendations now include guidance on digital device use before bedtime and mindfulness practices as legitimate health interventions.`,
  },
  {
    id: "n6",
    title: "Renewable Energy Capacity Set to Double by 2030",
    summary: "Solar and wind projects lead the charge in the latest global energy outlook report.",
    category: "Science",
    date: new Date(Date.now() - 86400000 * 3),
    read: true,
    image: "☀️",
    content: `The International Energy Agency's latest World Energy Outlook reports that global renewable energy capacity is on track to more than double by 2030, driven by an unprecedented surge in solar and wind installations across Asia, Europe, and North America. The projection marks a significant acceleration from previous forecasts and suggests the energy transition is proceeding faster than most models predicted.

Solar power additions are leading the charge, with the cost of utility-scale solar installations having fallen by 89% over the past decade. China remains the dominant force in manufacturing and deployment, but the United States, India, and the European Union are investing at record levels following major policy initiatives including the U.S. Inflation Reduction Act.

"We are witnessing a historic inflection point," said IEA Executive Director Fatih Birol. "Clean energy is winning not because of mandates, but because it has become the most economically rational choice in most of the world."

However, the report also highlights significant challenges that could derail progress. Grid infrastructure in many regions is not prepared to accommodate the variability of renewable generation. Investments in transmission networks, battery storage, and grid modernization must accelerate substantially to avoid bottlenecks.

The mining of critical minerals including lithium, cobalt, and rare earth elements — essential for batteries and electric motors — presents another challenge. The geographic concentration of these resources raises geopolitical concerns and underscores the need for recycling programs and alternative technologies.`,
  },
];

export const PRACTICE_DECK = [
  {
    id: "v1",
    front: "Ephemeral",
    back: "Lasting for a very short time.",
    example: "The beauty of a sunset is ephemeral.",
    type: "Vocabulary",
    level: "C1",
    category: "Nature",
    nextReview: new Date(),
    ease: 2.5,
    interval: 0,
  },
  {
    id: "g1",
    front: "If I were you...",
    back: "Used for giving advice (Second Conditional).",
    example: "If I were you, I would take that offer.",
    type: "Grammar",
    level: "B1",
    category: "Advice",
    nextReview: new Date(),
    ease: 2.3,
    interval: 0,
  },
  {
    id: "v2",
    front: "Pernicious",
    back: "Having a harmful effect, especially in a gradual or subtle way.",
    example: "The pernicious effects of social media.",
    type: "Vocabulary",
    level: "C2",
    category: "Social",
    nextReview: new Date(),
    ease: 2.5,
    interval: 0,
  },
  {
    id: "v3",
    front: "Surreal",
    back: "Happening in a way that is bizarre or like a dream.",
    example: "It was a surreal experience to win the lottery.",
    type: "Vocabulary",
    level: "B2",
    category: "Experience",
    nextReview: new Date(),
    ease: 2.5,
    interval: 0,
  },
  {
    id: "g2",
    front: "Passive Voice",
    back: "The subject receives the action: [Be + Past Participle].",
    example: "The book was written by Jane.",
    type: "Grammar",
    level: "A2",
    category: "Structure",
    nextReview: new Date(),
    ease: 2.4,
    interval: 0,
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
    description: "A poetic tale about a young prince who travels the universe, learning about life, love, and human nature.",
    content: `Once upon a time there was a little prince who lived on a planet scarcely bigger than himself, and who had need of a sheep.

When a mystery is too overpowering, one dare not disobey. Absurd as it might seem to me, a thousand miles from any human habitation and in danger of death, I took out of my pocket a sheet of paper and my fountain pen. But then I remembered how my studies had been concentrated on geography, history, arithmetic and grammar, and I told the little chap (a little crossly, too) that I did not know how to draw.

He answered me: "That doesn't matter. Draw me a sheep."

But I had never drawn a sheep. So I drew for him one of the two pictures I had drawn so often. It was that of the boa constrictor from the outside. And I was astounded to hear the little fellow greet it with: "No, no, no! I do not want an elephant inside a boa constrictor. A boa constrictor is a very dangerous creature, and an elephant is very cumbersome. Where I live, everything is very small. What I need is a sheep. Draw me a sheep."

So then I made a drawing. He looked at it carefully, then he said: "No. This sheep is already very sickly. Make me another."

So I made another drawing. My friend smiled gently and indulgently. "You see yourself," he said, "that this is not a sheep. This is a ram. It has horns."

So then I did my drawing over once more. But it was rejected too, just like the others. "This one is too old. I want a sheep that will live a long time."

By this time my patience was exhausted, because I was in a hurry to start taking my engine apart. So I tossed off this drawing and explained to him: "This is only his box. The sheep you asked for is inside."

I was very surprised to see a light break over the face of my young judge: "That is exactly the way I wanted it! Do you think that this sheep will have to have a great deal of grass?"

"Why?"

"Because where I live everything is very small..."

"There will surely be enough grass for him," I said. "It is a very small sheep that I have given you."

He bent his head over the drawing: "Not so small that— Look! He has gone to sleep..."

And that is how I made the acquaintance of the little prince.`,
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
    description: "A Victorian gentleman bets he can travel around the entire world in just 80 days.",
    content: `In the year 1872, the house at No. 7, Saville Row, Burlington Gardens, the house in which Sheridan died in 1814, was occupied by Phileas Fogg. He was one of the most singular and conspicuous members of the Reform Club, though he seemed always to avoid attracting attention.

To one of the most impressive orators who dignified England, he succeeded one of the most reserved and taciturn men in existence. Nothing was known of the origin of Phileas Fogg. He was a British subject with an exceedingly neat appearance. He was not known to have any wife or children, which may happen to the most honest people.

His residence in Saville Row notwithstanding, he never appeared there except at certain invariable hours. His life was regulated with such mathematical precision that a dissatisfied witness might have said, "Nobody could live more exactly."

Phileas Fogg had neither wife nor children. He was a member of the Reform Club, where he had all his meals, and where he passed his evenings in a corner at whist, always finding the same partners — Andrew Stuart, the engineer; John Sullivan and Samuel Fallentin, the bankers; William Ostwald, the brewer; and Thomas Flanagan, the distiller. They formed a regular party at whist.

On this particular evening — it was the second of October, 1872 — a discussion arose among the members of the Reform Club which eventually led Phileas Fogg to make the most remarkable bet of his career. It had started innocuously enough, over a matter of thieves and mathematics.`,
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
    description: "The spiritual journey of self-discovery of a man named Siddhartha during the time of the Gautama Buddha.",
    content: `In the shade of the house, in the sunshine of the riverbank near the boats, in the shade of the Sal-wood forest, in the shade of the fig tree is where Siddhartha grew up, the handsome son of the Brahman, the young falcon, together with his friend Govinda, son of a Brahman.

Love stirred in the hearts of the young Brahmans' daughters whenever Siddhartha walked through the lanes of the town with luminous forehead, with his king's eyes, with his narrow hips.

But more than all the others he was loved by Govinda, his friend, the Brahman's son. He loved Siddhartha's eye and his sweet voice, his walk and the perfect decency of his movements, and everything Siddhartha did and said and all the while admired him.

Thus Siddhartha was loved by everyone. He was a source of joy for everybody and he was a delight to them all. But he, Siddhartha, was not a source of joy for himself, he found no delight in himself. Walking the rosy paths of the fig tree garden, sitting in the bluish shade of the grove of contemplation, washing his limbs daily in the bath of repentance, sacrificing in the dim shade of the mango forest, his gestures of perfect decency, everyone's love and joy, he still lacked all joy in his heart.

Dreams and restless thoughts came into his mind, flowing from the water of the river, sparkling from the stars at night, melting from the beams of the sun, dreams came to him and a restlessness of the soul, rising out of the smoke of the sacrifices, wafting from the verses of the Rig-Veda, trickling through from the teachings of the old Brahmans.

Siddhartha had started to nurse discontent in himself, he had started to feel that the love of his father and the love of his mother, and also the love of his friend, Govinda, would not bring him joy forever and ever, would not nurse him, feed him, satisfy him.`,
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
