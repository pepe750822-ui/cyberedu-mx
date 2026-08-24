# Graph Report - src  (2026-07-14)

## Corpus Check
- Large corpus: 235 files � ~585,089 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 1143 nodes · 2332 edges · 101 communities (83 shown, 18 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- User Profile & Progress Tracking
- AI Quiz & Question Engine
- App Routing & Navigation
- Profile Customization UI
- AI Tutor Card Components
- AI Tutor Core Engine
- Sync & Notification System
- Sidebar Navigation UI
- Admin Analytics & Marketing
- AI Response Parser
- Navigation & Exam Countdown
- Achievement & Study Plans
- Admin Routes & Onboarding
- Spatial Series Visualization
- Daily Challenge System
- EXANI-I Exam Data
- Simulator Active & Question Bank
- Studio Map & Index Page
- Globe Visualization Artifact
- Header & Avatar UI
- Exam Simulator Engine
- Badge & Progress UI
- Streak & PWA Features
- Area & Video Cards
- Carousel UI Component
- Educational Image Viewer
- Service Worker & Offline Cache
- Lazy Loading Utility
- Menubar UI Component
- Auth Context & Provider
- Question Bank Adapter
- Algebra Visualization Artifact
- Chat Message & Chart Renderer
- Accordion UI Component
- Chart UI Component
- Footer & Marketing Page
- Context Menu UI
- Dropdown Menu UI
- Flashcards Data
- Supabase Type Definitions
- Human Body Visualization
- Mexico Map Artifact
- Access Control & Accordion
- Alert Dialog UI
- Blog Data & Separator UI
- Table UI Component
- Admin Dashboard
- Admin Summary Page
- Study Guide 2026 Page
- Chemistry Visualization Artifact
- Solar System Visualization
- Timeline Visualization Artifact
- Certification & Badge UI
- Breadcrumb Navigation UI
- Drawer UI Component
- Navigation Menu UI
- Select UI Component
- Atom Visualization Artifact
- Global Search System
- ECOEMS News Component
- Error Boundary System
- Toggle UI Component
- Analytics Tracking Hooks
- EXANI-II Landing Page
- Chat Analytics System
- Theme & Online Presence
- App Diagnostics Hook
- AI Task Queue System
- Calculator Artifact
- 3D Spatial Reasoning Artifact
- PWA Install Banner
- OTP Input UI
- Study Plans Hook
- Admin Monitoring Page
- Circuit Lab Artifact
- Exercise Artifact
- Lewis Structure Artifact
- Math Graph Artifact
- Physics Simulation Artifact
- Physics Graph Artifact
- Simulator Artifact
- Mermaid Diagram Component
- Spline 3D UI
- Force Diagram Artifact
- Exam Countdown Timer
- Related Questions Panel
- Toast Notification (Sonner)
- Global Type Declarations
- Hero Asset Image 1
- Hero Asset Image 2
- Hero Asset Image 3
- Hero Asset Image 4
- Hero Asset Image 5
- Hero Asset Image 6
- Hero Asset Image 7

## God Nodes (most connected - your core abstractions)
1. `cn()` - 173 edges
2. `useAuth()` - 57 edges
3. `Button` - 36 edges
4. `useVideoProgress()` - 28 edges
5. `supabase` - 27 edges
6. `parseAllBlocksHelper()` - 26 edges
7. `SimuladorPro()` - 24 edges
8. `Question` - 23 edges
9. `safeParseJSON()` - 22 edges
10. `AITutor()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `CalculatorArtifact()` --calls--> `cn()`  [EXTRACTED]
  components/CalculatorArtifact.tsx → lib/utils.ts
- `EduImageViewer()` --calls--> `cn()`  [EXTRACTED]
  components/EduImageViewer.tsx → lib/utils.ts
- `ExerciseArtifact()` --calls--> `cn()`  [EXTRACTED]
  components/ExerciseArtifact.tsx → lib/utils.ts
- `NewsECOEMS()` --calls--> `cn()`  [EXTRACTED]
  components/NewsECOEMS.tsx → lib/utils.ts
- `PhysicsArtifact()` --calls--> `cn()`  [EXTRACTED]
  components/PhysicsArtifact.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (101 total, 18 thin omitted)

### Community 0 - "User Profile & Progress Tracking"
Cohesion: 0.06
Nodes (54): PageViewTracker(), Achievement, BadgesShowcase(), AREA_EMOJI, getBancoLabel(), MEDAL_CONFIG, MedalType, ProgressPanel() (+46 more)

### Community 1 - "AI Quiz & Question Engine"
Cohesion: 0.07
Nodes (33): AITutorQuiz(), Props, shuffleArray(), shuffleQuizQuestion(), updateAgentMemory(), FlashcardViewer(), Props, MarkdownViewer() (+25 more)

### Community 2 - "App Routing & Navigation"
Cohesion: 0.05
Nodes (37): Acordeon, Admin, AdminAnalytics, AdminDashboard, AdminMonitoring, AdminResumen, AITutor, AreaDetail (+29 more)

### Community 3 - "Profile Customization UI"
Cohesion: 0.06
Nodes (32): AVATARS, COLORS, ProfileDialog(), ProfileDialogProps, SCHOOLS, StudioModalProps, Command, CommandDialogProps (+24 more)

### Community 4 - "AI Tutor Card Components"
Cohesion: 0.09
Nodes (27): ApiStatusBanner(), DiagnosticsCard(), QuizCard(), ReasoningCard(), TaskItem(), Announcement, GlobalAnnouncementBanner(), ButtonProps (+19 more)

### Community 5 - "AI Tutor Core Engine"
Cohesion: 0.09
Nodes (24): AgentMemory, AITutor(), AnalysisCard(), autoLinkCitations(), Decision, getUrlForPaso(), loadMemory(), MATERIA_PREFIX (+16 more)

### Community 6 - "Sync & Notification System"
Cohesion: 0.11
Nodes (25): PendingResultSync(), Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle (+17 more)

### Community 7 - "Sidebar Navigation UI"
Cohesion: 0.07
Nodes (27): Sidebar, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel (+19 more)

### Community 8 - "Admin Analytics & Marketing"
Cohesion: 0.18
Nodes (17): ApiStatus, LlaveMXEmailTemplate(), NewsletterEmailTemplate(), WeeklyProgressEmailTemplate(), WelcomeEmailTemplate(), Button, Card, CardContent (+9 more)

### Community 9 - "AI Response Parser"
Cohesion: 0.13
Nodes (27): cleanNullBlocks(), cleanTutorResponse(), parseAlgebrasFromContent(), parseAllBlocksHelper(), parseAtomsFromContent(), parseCalculatorsFromContent(), parseChartsFromContent(), parseChemistryFromContent() (+19 more)

### Community 10 - "Navigation & Exam Countdown"
Cohesion: 0.07
Nodes (15): NavLink, NavLinkCompatProps, Alert, AlertDescription, AlertTitle, alertVariants, Checkbox, HoverCardContent (+7 more)

### Community 11 - "Achievement & Study Plans"
Cohesion: 0.22
Nodes (17): AchievementObserver(), NextAchievementCard(), PlanEstudioDiario(), ProgresoDashboard(), RecommendedVideos(), RecommendedVideosProps, areas, allVideoIds (+9 more)

### Community 12 - "Admin Routes & Onboarding"
Cohesion: 0.15
Nodes (16): AdminResumenRoute(), AdminRoute(), MarketingManager(), markDone(), OnboardingModal(), steps, ProtectedRoute(), useAuth() (+8 more)

### Community 13 - "Spatial Series Visualization"
Cohesion: 0.10
Nodes (18): SpatialSeriesArtifact(), DIFF_COLOR, DIFF_LABEL, Difficulty, Exercise, EXERCISES, ExType, FigureEx (+10 more)

### Community 14 - "Daily Challenge System"
Cohesion: 0.13
Nodes (12): allQuestions, DailyChallenge(), seed, bank10Questions, simuladoECOEMS4, bank5Questions, bank6Questions, bank7Questions (+4 more)

### Community 15 - "EXANI-I Exam Data"
Cohesion: 0.15
Nodes (17): Area, areas, colorMap, Subtema, Area, areas, colorMap, Subtema (+9 more)

### Community 16 - "Simulator Active & Question Bank"
Cohesion: 0.16
Nodes (12): SimulatorActiveProps, bank11Questions, bank12Questions, simuladoECOEMS2, simuladoECOEMS3, BankSelection, ExamMode, Question (+4 more)

### Community 17 - "Studio Map & Index Page"
Cohesion: 0.12
Nodes (15): fullSimulators, studioMapping, StudioSimulator, BadgeSystem, CountdownExam, NeuralBrainCanvas, NewsECOEMS, PARTICLES (+7 more)

### Community 18 - "Globe Visualization Artifact"
Cohesion: 0.19
Nodes (14): GlobeArtifact(), computeCountryCenter(), CONTINENT_CENTERS, CONTINENT_COLORS, COUNTRY_ALIASES, COUNTRY_INFO, CountryExtra, drawGeoPolygon() (+6 more)

### Community 19 - "Header & Avatar UI"
Cohesion: 0.18
Nodes (12): Avatar, AvatarFallback, AvatarImage, SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader() (+4 more)

### Community 20 - "Exam Simulator Engine"
Cohesion: 0.17
Nodes (12): SimulatorActive(), generarSimuladorPersonalizado(), AREA_EMOJI_EXANI, DISTRIBUCION_EXANI, EXANI_FEATURES, MATERIAS_EXANI, guardarResultadoSimulador(), AREA_GROUPS (+4 more)

### Community 21 - "Badge & Progress UI"
Cohesion: 0.20
Nodes (9): Badge, BadgeSystem(), Progress, UltimoVideoCard(), WeeklyChallenges(), notebookLinks, getAllProgress(), ProgressiveVideoData (+1 more)

### Community 22 - "Streak & PWA Features"
Cohesion: 0.23
Nodes (10): StreakAutoSync(), PWAStatusBar(), DEFAULT_PREFS, NotificationPrefs, STREAK_REMINDER_TIMES, useNotifications(), CacheInfo, useOfflineCache() (+2 more)

### Community 23 - "Area & Video Cards"
Cohesion: 0.20
Nodes (6): AreaCardProps, VideoCardProps, Area, Video, materiales, MaterialVideo

### Community 24 - "Carousel UI Component"
Cohesion: 0.14
Nodes (12): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+4 more)

### Community 25 - "Educational Image Viewer"
Cohesion: 0.21
Nodes (10): AREA_COLORS, EduImageViewer(), EduImageViewerProps, getProxiedUrl(), ImageCard(), Lightbox(), availableImageKeys, educationalImages (+2 more)

### Community 26 - "Service Worker & Offline Cache"
Cohesion: 0.17
Nodes (4): BUILD_ASSETS, cacheFirstDynamic(), STATIC_ASSETS, trimCache()

### Community 27 - "Lazy Loading Utility"
Cohesion: 0.29
Nodes (10): LazyWithTimeout(), Props, State, DeviceType, getDeviceType(), isDesktop(), isMobile(), isTablet() (+2 more)

### Community 28 - "Menubar UI Component"
Cohesion: 0.17
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 29 - "Auth Context & Provider"
Cohesion: 0.24
Nodes (9): AuthContext, AuthContextValue, AuthProvider(), generateReferralCode(), UserProfile, clarityEvent(), clarityIdentify(), CATEGORIES (+1 more)

### Community 30 - "Question Bank Adapter"
Cohesion: 0.21
Nodes (10): ALL_MATERIAS, ARCHIVO_A_AREA, BANCO_IMPORTS, cargarPreguntasSubindices(), DISTRIBUCION_OFICIAL, PreguntaSubindice, PREMIUM_EXPORTS, DISTRIBUCION_OFICIAL (+2 more)

### Community 31 - "Algebra Visualization Artifact"
Cohesion: 0.25
Nodes (10): AlgebraArtifact(), AlgebraArtifact(), EXAMPLES, fmt(), LinearResult, QuadResult, solveLinear(), solveQuadratic() (+2 more)

### Community 32 - "Chat Message & Chart Renderer"
Cohesion: 0.20
Nodes (9): Message, CHART_ICONS, ChartData, ChartRenderer(), detectKeys(), PALETTE, ContentRecommendation, ProgressAnalysis (+1 more)

### Community 33 - "Accordion UI Component"
Cohesion: 0.25
Nodes (8): AccordionContent, AccordionItem, AccordionTrigger, Window, YouTubePlayer(), YouTubePlayerProps, getNotebookUrl(), AreaDetail()

### Community 34 - "Chart UI Component"
Cohesion: 0.18
Nodes (7): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartTooltipContent, THEMES

### Community 35 - "Footer & Marketing Page"
Cohesion: 0.24
Nodes (6): Footer(), ESCUELAS_SIN_EXAMEN, etapas, faqData, ModalidadCard(), modalidades

### Community 36 - "Context Menu UI"
Cohesion: 0.20
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 37 - "Dropdown Menu UI"
Cohesion: 0.20
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 38 - "Flashcards Data"
Cohesion: 0.38
Nodes (7): exaniFlashcardAreas, exaniFlashcardsData, Flashcard, flashcardAreas, flashcardsData, Flashcards(), shuffle()

### Community 39 - "Supabase Type Definitions"
Cohesion: 0.20
Nodes (9): CompositeTypes, Constants, DatabaseWithoutInternals, DefaultSchema, Enums, Json, Tables, TablesInsert (+1 more)

### Community 40 - "Human Body Visualization"
Cohesion: 0.28
Nodes (7): HumanBodyArtifact(), BodySystem, HumanBodyArtifact(), renderShape(), SYSTEMS, ZONE_SHAPES, ZoneShape

### Community 41 - "Mexico Map Artifact"
Cohesion: 0.28
Nodes (8): MexicoMapArtifact(), CITIES, CityEntry, MexicoMapArtifact(), nrm(), REGION_COLORS, StateInfo, STATES

### Community 42 - "Access Control & Accordion"
Cohesion: 0.22
Nodes (7): PromoBloqueo(), PromoBloqueoProps, Acordeon(), Area, colorMap, ecoemsAreas, Subtema

### Community 43 - "Alert Dialog UI"
Cohesion: 0.22
Nodes (8): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle

### Community 44 - "Blog Data & Separator UI"
Cohesion: 0.31
Nodes (3): Separator, BlogPost, blogPosts

### Community 45 - "Table UI Component"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 46 - "Admin Dashboard"
Cohesion: 0.33
Nodes (8): AdminDashboard(), ChartPoint, ConversionStats, last7Days(), mexicoToday(), RecentEvent, timeAgo(), TodayStats

### Community 47 - "Admin Summary Page"
Cohesion: 0.39
Nodes (8): AdminResumen(), calcCostUSD(), EXTERNAL, fmtMXN(), fmtUSD(), last7Days(), mexicoToday(), Stats

### Community 48 - "Study Guide 2026 Page"
Cohesion: 0.33
Nodes (8): COLOR_MAP, DEFAULT_COLOR, getThumbnail(), getYoutubeId(), Guia2026(), MATERIAS, Tema, TEMAS

### Community 49 - "Chemistry Visualization Artifact"
Cohesion: 0.29
Nodes (7): ChemistryArtifact(), CATEGORY_INFO, ChemistryArtifact(), ChemistryProps, getPeriod(), PT_FULL, PT_PLACEHOLDERS

### Community 50 - "Solar System Visualization"
Cohesion: 0.36
Nodes (7): SolarSystemArtifact(), HIT_RADIUS(), Planet, PLANETS, SolarSystemArtifact(), SUN_HIT_RADIUS(), SUN_INFO

### Community 51 - "Timeline Visualization Artifact"
Cohesion: 0.32
Nodes (7): TimelineArtifact(), EVENTS, Filter, getInitialState(), matchesKeyword(), TimelineArtifact(), TimelineEvent

### Community 52 - "Certification & Badge UI"
Cohesion: 0.43
Nodes (5): CertificationCard(), CertificationProps, Badge(), BadgeProps, badgeVariants

### Community 53 - "Breadcrumb Navigation UI"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 54 - "Drawer UI Component"
Cohesion: 0.25
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 55 - "Navigation Menu UI"
Cohesion: 0.25
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 56 - "Select UI Component"
Cohesion: 0.25
Nodes (7): SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 57 - "Atom Visualization Artifact"
Cohesion: 0.38
Nodes (6): AtomArtifact(), AtomArtifact(), Element, ELEMENTS, getOrbitalConfig(), OrbitingElectron

### Community 58 - "Global Search System"
Cohesion: 0.43
Nodes (5): buildIndex(), GlobalSearch(), normalize(), SearchResult, Input

### Community 59 - "ECOEMS News Component"
Cohesion: 0.29
Nodes (6): alcaldiasData, difficultyConfig, NewsECOEMS(), SchoolScore, ScoreCategory, scoreData

### Community 60 - "Error Boundary System"
Cohesion: 0.29
Nodes (3): Props, SafeBlockErrorBoundary, State

### Community 61 - "Toggle UI Component"
Cohesion: 0.33
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 62 - "Analytics Tracking Hooks"
Cohesion: 0.43
Nodes (6): EventoPlataforma, trackClarity(), trackGA4(), trackInternal(), TrackOptions, useTracking()

### Community 63 - "EXANI-II Landing Page"
Cohesion: 0.29
Nodes (5): ExaniI(), fadeUp, particles, stagger, staggerFast

### Community 64 - "Chat Analytics System"
Cohesion: 0.33
Nodes (5): AdminAnalytics(), AggregatedMetrics, ChatError, ChatMetric, useChatAnalytics()

### Community 65 - "Theme & Online Presence"
Cohesion: 0.40
Nodes (5): Header(), useOnlineUsers(), getInitialTheme(), Theme, useTheme()

### Community 66 - "App Diagnostics Hook"
Cohesion: 0.33
Nodes (5): CapturedError, CheckStatus, DiagnosticCheck, DiagnosticsResult, useAppDiagnostics()

### Community 67 - "AI Task Queue System"
Cohesion: 0.33
Nodes (5): AgentMemory, AgentTask, TaskPriority, TaskStatus, useTaskQueue()

### Community 68 - "Calculator Artifact"
Cohesion: 0.40
Nodes (4): CalculatorArtifact(), CalculatorArtifact(), CalculatorProps, Variable

### Community 70 - "PWA Install Banner"
Cohesion: 0.60
Nodes (3): PWAInstallBanner(), BeforeInstallPromptEvent, usePWA()

### Community 71 - "OTP Input UI"
Cohesion: 0.40
Nodes (4): InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 72 - "Study Plans Hook"
Cohesion: 0.60
Nodes (4): loadPlans(), PlanPaso, savePlans(), useStudyPlans()

### Community 73 - "Admin Monitoring Page"
Cohesion: 0.60
Nodes (4): AdminMonitoring(), BroadcastRecord, loadHistory(), saveHistory()

### Community 75 - "Exercise Artifact"
Cohesion: 0.50
Nodes (3): ExerciseArtifact(), ExerciseArtifact(), ExerciseData

### Community 78 - "Physics Simulation Artifact"
Cohesion: 0.50
Nodes (3): PhysicsArtifact(), PhysicsArtifact(), PhysicsProps

### Community 80 - "Simulator Artifact"
Cohesion: 0.50
Nodes (3): SimulatorArtifact(), SimulatorArtifact(), SimulatorStep

### Community 81 - "Mermaid Diagram Component"
Cohesion: 0.67
Nodes (3): getMermaidId(), Mermaid(), MermaidProps

## Knowledge Gaps
- **431 isolated node(s):** `Index`, `AreaDetail`, `AITutor`, `Auth`, `Tokens` (+426 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `AI Tutor Card Components` to `User Profile & Progress Tracking`, `AI Quiz & Question Engine`, `Profile Customization UI`, `AI Tutor Core Engine`, `Sync & Notification System`, `Sidebar Navigation UI`, `Admin Analytics & Marketing`, `Navigation & Exam Countdown`, `Achievement & Study Plans`, `Admin Routes & Onboarding`, `Daily Challenge System`, `Studio Map & Index Page`, `Header & Avatar UI`, `Exam Simulator Engine`, `Badge & Progress UI`, `Streak & PWA Features`, `Carousel UI Component`, `Educational Image Viewer`, `Menubar UI Component`, `Chat Message & Chart Renderer`, `Accordion UI Component`, `Chart UI Component`, `Footer & Marketing Page`, `Context Menu UI`, `Dropdown Menu UI`, `Alert Dialog UI`, `Blog Data & Separator UI`, `Table UI Component`, `Study Guide 2026 Page`, `Chemistry Visualization Artifact`, `Certification & Badge UI`, `Breadcrumb Navigation UI`, `Drawer UI Component`, `Navigation Menu UI`, `Select UI Component`, `Global Search System`, `ECOEMS News Component`, `Toggle UI Component`, `Chat Analytics System`, `Calculator Artifact`, `PWA Install Banner`, `OTP Input UI`, `Admin Monitoring Page`, `Exercise Artifact`, `Math Graph Artifact`, `Physics Simulation Artifact`, `Simulator Artifact`, `Mermaid Diagram Component`?**
  _High betweenness centrality (0.301) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `Admin Routes & Onboarding` to `User Profile & Progress Tracking`, `App Routing & Navigation`, `Profile Customization UI`, `AI Tutor Core Engine`, `Sync & Notification System`, `Admin Analytics & Marketing`, `Achievement & Study Plans`, `Daily Challenge System`, `EXANI-I Exam Data`, `Studio Map & Index Page`, `Header & Avatar UI`, `Exam Simulator Engine`, `Auth Context & Provider`, `Flashcards Data`, `Access Control & Accordion`, `Study Guide 2026 Page`, `Certification & Badge UI`, `EXANI-II Landing Page`, `Theme & Online Presence`, `Admin Monitoring Page`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `Button` connect `Admin Analytics & Marketing` to `User Profile & Progress Tracking`, `AI Quiz & Question Engine`, `Accordion UI Component`, `Profile Customization UI`, `Footer & Marketing Page`, `AI Tutor Core Engine`, `Sidebar Navigation UI`, `Achievement & Study Plans`, `Blog Data & Separator UI`, `Daily Challenge System`, `Studio Map & Index Page`, `Header & Avatar UI`, `Certification & Badge UI`, `Badge & Progress UI`, `Carousel UI Component`, `Auth Context & Provider`, `EXANI-II Landing Page`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `Index`, `AreaDetail`, `AITutor` to the rest of the system?**
  _431 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `User Profile & Progress Tracking` be split into smaller, more focused modules?**
  _Cohesion score 0.05547785547785548 - nodes in this community are weakly interconnected._
- **Should `AI Quiz & Question Engine` be split into smaller, more focused modules?**
  _Cohesion score 0.06636500754147813 - nodes in this community are weakly interconnected._
- **Should `App Routing & Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.04983388704318937 - nodes in this community are weakly interconnected._