export const DEFAULT_QUOTES = [
  { text: "Life Is Complex. Progress Shouldn't Be.", source: "ShaVex OS" },
  { text: "Choose Your Destination. Build Your System.", source: "ShaVex OS" },
  { text: "Optimism is a query parameter, action is the execution.", source: "AI Engineer" },
  { text: "First, solve the problem. Then, write the code.", source: "John Johnson" },
  { text: "Consistency is what transforms average into excellence.", source: "Unknown" },
  { text: "Simplify your decisions, increase your execution.", source: "ShaVex OS" }
];

export const ROADMAP_PRESETS = {
  "AI Engineer": [
    { name: "Computer Fundamentals", milestones: ["Internet", "Operating Systems", "Git", "GitHub", "Terminal"], resources: [] },
    { name: "Programming Foundations", milestones: ["Variables", "Data Types", "Operators", "Conditions", "Loops", "Functions", "OOP", "File Handling", "Exception Handling", "APIs"], resources: [] },
    { name: "Mathematics", milestones: ["Statistics", "Probability", "Linear Algebra"], resources: [] },
    { name: "Data Science", milestones: ["NumPy", "Pandas", "Data Cleaning", "Visualization", "EDA"], resources: [] },
    { name: "Machine Learning", milestones: ["Linear Regression", "Logistic Regression", "KNN", "Decision Trees", "Random Forest", "SVM", "Clustering"], resources: [] },
    { name: "Projects", milestones: ["EDA Project", "ML Prediction API"], resources: [] },
    { name: "Deep Learning", milestones: ["ANN", "CNN", "RNN", "Transformers"], resources: [] },
    { name: "Generative AI", milestones: ["Prompt Engineering", "LLMs", "RAG", "Agents", "Vector Databases"], resources: [] },
    { name: "Cloud & Deployment", milestones: ["APIs", "Docker", "Cloud Fundamentals", "Deployment"], resources: [] },
    { name: "Portfolio & Interviews", milestones: ["Portfolio website", "Mock Interviews"], resources: [] }
  ],
  "Data Analyst": [
    { name: "Excel", milestones: ["Basic calculations", "VLOOKUP & MATCH", "Pivot Tables & Charts"], resources: [] },
    { name: "SQL", milestones: ["SELECT queries & filtering", "Joins", "Aggregations", "Subqueries & CTEs"], resources: [] },
    { name: "Statistics", milestones: ["Descriptive Statistics", "Probability distribution", "Hypothesis testing"], resources: [] },
    { name: "Python", milestones: ["Syntax & data structures", "Variables & loops", "Functions & scripts"], resources: [] },
    { name: "Pandas", milestones: ["Loading data sources", "Data cleaning", "Slicing & merging"], resources: [] },
    { name: "Visualization", milestones: ["Matplotlib & Seaborn plots", "Formatting distribution graphs"], resources: [] },
    { name: "Power BI / Tableau", milestones: ["Interactive dashboards", "Publishing reports"], resources: [] },
    { name: "Projects", milestones: ["Ecommerce analysis", "Sales insights deck"], resources: [] },
    { name: "Portfolio", milestones: ["Build GitHub documentation", "Dashboard project links"], resources: [] },
    { name: "Interviews", milestones: ["SQL coding questions", "Data analysis case study"], resources: [] }
  ],
  "Full Stack": [
    { name: "HTML", milestones: ["HTML5 semantic structures", "Forms & inputs"], resources: [] },
    { name: "CSS", milestones: ["Flexbox & Grid layouts", "Responsive media queries", "Tailwind CSS"], resources: [] },
    { name: "JavaScript", milestones: ["ES6 variables & arrays", "DOM query manipulation", "Fetch API & async logic"], resources: [] },
    { name: "React", milestones: ["React state & hooks", "Nesting components", "React Router setups"], resources: [] },
    { name: "Backend", milestones: ["Node.js & Express routing", "REST API setups"], resources: [] },
    { name: "Database", milestones: ["Relational vs Document schemas", "Postgres table queries", "MongoDB object parsing"], resources: [] },
    { name: "Authentication", milestones: ["JSON Web Tokens (JWT)", "Supabase Auth setup", "Hashing user passwords"], resources: [] },
    { name: "Deployment", milestones: ["Deploy frontend to Vercel/Netlify", "Deploy backend host servers"], resources: [] },
    { name: "Projects", milestones: ["Build responsive ecommerce portal", "Build dynamic notes application"], resources: [] }
  ],
  "Cloud Engineer": [
    { name: "Networking", milestones: ["TCP/IP, DNS, & HTTP protocols", "IP Subnetting & Routing", "Firewalls & VPCs setup"], resources: [] },
    { name: "Linux", milestones: ["Linux terminal commands", "File permissions & users", "Bash scripting basics"], resources: [] },
    { name: "Git", milestones: ["Git commits & branching", "Resolving merge conflicts", "GitHub sync"], resources: [] },
    { name: "Cloud Fundamentals", milestones: ["Cloud service archetypes (IaaS, PaaS, SaaS)", "Identity Access Management (IAM)"], resources: [] },
    { name: "AWS / Azure / GCP", milestones: ["IAM policy settings", "VPC & Subnet networking"], resources: [] },
    { name: "Storage", milestones: ["Block storage systems", "Object storage buckets setup"], resources: [] },
    { name: "Compute", milestones: ["Deploy virtual machine hosts", "Set auto-scaling groups parameters"], resources: [] },
    { name: "Security", milestones: ["Network access controls", "Cloud auditing logs configuration"], resources: [] },
    { name: "Monitoring", milestones: ["Set performance metrics monitors", "Create custom warning triggers"], resources: [] },
    { name: "Projects", milestones: ["Deploy highly-available architecture", "Configure multi-tier network script"], resources: [] }
  ],
  "Cyber Security": [
    { name: "Networking", milestones: ["Understand TCP/IP layers", "Analyze packet protocols (Wireshark)", "Routing & ports settings"], resources: [] },
    { name: "Linux", milestones: ["Linux commands mastery", "File permissions auditing", "Process monitors & scripting"], resources: [] },
    { name: "Web Fundamentals", milestones: ["HTTP requests/responses headers", "SQL databases layouts", "Cookie & session tokens mechanics"], resources: [] },
    { name: "Security Fundamentals", milestones: ["Cryptography keys", "Hashing & encryption protocols", "IAM architectures"], resources: [] },
    { name: "OWASP", milestones: ["SQL Injection testing", "Cross-Site Scripting (XSS)", "Authentication bypass analysis"], resources: [] },
    { name: "Ethical Hacking", milestones: ["Nmap port scanning", "Vulnerability assessments", "Metasploit exploit tools"], resources: [] },
    { name: "SOC", milestones: ["Log file auditing", "Intrusion Detection Systems (IDS)", "Incidence response checklists"], resources: [] },
    { name: "Projects", milestones: ["Perform penetration test on local server", "Write security assessment report"], resources: [] }
  ],
  "JEE": [
    { name: "Physics", milestones: ["Mechanics", "Thermodynamics", "Electricity", "Magnetism", "Modern Physics"], resources: [] },
    { name: "Chemistry", milestones: ["Physical", "Organic", "Inorganic"], resources: [] },
    { name: "Mathematics", milestones: ["Algebra", "Calculus", "Coordinate Geometry", "Trigonometry"], resources: [] },
    { name: "PYQs", milestones: ["Solve past years papers", "Log errors"], resources: [] },
    { name: "Mock Tests", milestones: ["Timed mock exams", "Speed drills"], resources: [] },
    { name: "Revision", milestones: ["Formula cheat sheets", "Weak areas review"], resources: [] }
  ],
  "NEET": [
    { name: "Biology", milestones: ["Plant physiology", "Human anatomy", "Genetics & Evolution", "Ecology topics"], resources: [] },
    { name: "Chemistry", milestones: ["Inorganic qualitative analyses", "Organic named reactions", "Physical chemical kinetics"], resources: [] },
    { name: "Physics", milestones: ["Kinematics formulas", "Thermodynamics laws", "Electrostatics & Magnetism"], resources: [] },
    { name: "PYQs", milestones: ["Solve NEET papers (past 10 years)", "Review incorrect answers log"], resources: [] },
    { name: "Mock Tests", milestones: ["Complete mock test under standard timing", "Analyze score trends"], resources: [] },
    { name: "Revision", milestones: ["Anatomy diagrams checklists", "Review chemical reactions"], resources: [] }
  ],
  "Fitness": [
    { name: "Assessment", milestones: ["Log initial weight & measurements", "Set fitness target goal", "Calculate calorie requirements"], resources: [] },
    { name: "Nutrition", milestones: ["Design daily meal plans", "Log water targets", "Track macro parameters"], resources: [] },
    { name: "Workout", milestones: ["Establish training split", "Learn correct form for compound exercises"], resources: [] },
    { name: "Recovery", milestones: ["Ensure 8 hours sleep logs", "Schedule active stretching sessions"], resources: [] },
    { name: "Transformation", milestones: ["Evaluate 30-day weight trends", "Modify workout weights & reps"], resources: [] },
    { name: "Maintenance", milestones: ["Define calorie maintenance limits", "Set consistency goals"], resources: [] }
  ],
  "ML Engineer": [
    { name: "Math & Stats", milestones: ["Linear Algebra", "Calculus", "Probability", "Descriptive Stats"], resources: [] },
    { name: "ML Basics", milestones: ["Supervised Learning", "Unsupervised Learning", "Validation Techniques"], resources: [] },
    { name: "MLOps", milestones: ["Model Versioning", "Pipelines", "Model Serving", "Monitoring"], resources: [] }
  ],
  "Data Scientist": [
    { name: "Data Wrangling", milestones: ["SQL Queries", "Pandas & Numpy", "EDA Patterns"], resources: [] },
    { name: "Statistical Modeling", milestones: ["Hypothesis Testing", "Regression Analysis", "A/B Testing"], resources: [] },
    { name: "Advanced ML", milestones: ["Feature Engineering", "Clustering", "Ensemble Methods"], resources: [] }
  ],
  "UPSC": [
    { name: "Prelims GS I", milestones: ["History & Culture", "Geography", "Polity & Governance", "Economy", "Environment"], resources: [] },
    { name: "CSAT GS II", milestones: ["Reading Comprehension", "Logical Reasoning", "Quantitative Aptitude"], resources: [] },
    { name: "Mains Answer Writing", milestones: ["Essay Drafts", "GS 1-4 Papers Practice", "Optional Subject Mastery"], resources: [] }
  ],
  "CAT": [
    { name: "VARC", milestones: ["Reading Comprehension", "Verbal Ability", "Grammar & Vocabulary"], resources: [] },
    { name: "DILR", milestones: ["Data Interpretation", "Logical Reasoning", "Puzzles & Seating Arrangements"], resources: [] },
    { name: "QA", milestones: ["Arithmetic", "Algebra", "Geometry & Mensuration", "Number Systems"], resources: [] }
  ],
  "Weight Loss": [
    { name: "Calorie Deficit Setup", milestones: ["TDEE Calculation", "Macros Splitting", "Meal Prep Basics"], resources: [] },
    { name: "Cardio & Resistance", milestones: ["HIIT Sessions", "Strength Training Splits", "NEAT Level Logs"], resources: [] },
    { name: "Habit Stacking", milestones: ["Hydration Goals", "Sleep Optimization", "Progress Tracking"], resources: [] }
  ],
  "Weight Gain": [
    { name: "Caloric Surplus Setup", milestones: ["TDEE + Surplus Calculation", "High Protein Planning", "Weight & Strength Log Init"], resources: [] },
    { name: "Hypertrophy Program", milestones: ["Compound Lifts Form", "Progressive Overload Tracking", "Sleep & Recovery Audits"], resources: [] }
  ],
  "Startup": [
    { name: "Ideation & Validation", milestones: ["Market Research", "Problem-Solution Fit", "Customer Interviews"], resources: [] },
    { name: "MVP Build", milestones: ["Feature Scoping", "Fast Prototyping", "Feedback Iterations"], resources: [] },
    { name: "Launch & Growth", milestones: ["Early User Acquisition", "Analytics Dashboard Setup", "Fundraising Strategy"], resources: [] }
  ],
  "Freelancing": [
    { name: "Portfolio & Brand", milestones: ["Skill Specialization", "Showcase Site Build", "Social Proof Collection"], resources: [] },
    { name: "Client Acquisition", milestones: ["Cold Pitching", "Freelance Platforms Setup", "Proposal Writing Templates"], resources: [] },
    { name: "Operations & Scaling", milestones: ["Contract Drafts", "Time Tracking", "Retainer Pricing Structure"], resources: [] }
  ]
};

export const getCustomGoalPreset = (goalName) => {
  return [
    { name: "Initial Research", milestones: [`Audit core units for ${goalName}`, "Set target milestone lists"], resources: [] },
    { name: "Execution Sprint", milestones: ["Study primary modules", "Build initial practice projects"], resources: [] },
    { name: "Graduation Phase", milestones: ["Final polish and review", "Deploy project to portfolio"], resources: [] }
  ];
};

export const INITIAL_STATE = {
  currentDay: 1,
  onboarded: false,
  profile: {
    name: "Shashwat Tiwari",
    username: "shashwat",
    avatar: "",
    userType: "College Student",
    mainGoal: "AI Engineer",
    missionStatement: "I want to become an AI Engineer by 2027.",
    primaryGoal: "AI Engineer",
    secondaryGoals: ["Full Stack", "Fitness"],
    preferredStudyTime: "18:00 - 21:00 (Evening)",
    learningStyle: "Visual Learner",
    targetYear: "2027",
    skillLevel: "Intermediate",
    joinDate: new Date().toISOString().split('T')[0]
  },
  memory: {
    lastCompletedMilestone: "Internet",
    lastActiveRoadmapPhase: "Computer Fundamentals",
    lastMission: "Initialize baseline study materials for AI Engineer",
    lastStudyResource: "AI Engineer Core Objectives Documentation",
    lastStudySession: new Date().toISOString(),
    consistencyHistory: [true, true, true, true, true, true, true]
  },
  goals: {},
  currentGoalName: "AI Engineer",
  
  nextMove: {
    task: "Complete Computer Fundamentals",
    estimatedTime: "45 Minutes",
    impact: "High",
    goalName: "AI Engineer",
    phaseIndex: 0,
    milestoneIndex: 0
  },

  focusSession: {
    active: false,
    startTime: null,
    duration: 1500,
    timerRemaining: 1500,
    goalName: "",
    phaseIndex: 0,
    milestoneIndex: 0
  },

  missions: {
    today: [
      { id: "m_t1", text: "Complete Computer Fundamentals initial phase", completed: false },
      { id: "m_t2", text: "Practice CLI / Terminal commands", completed: false },
      { id: "m_t3", text: "Water intake and sleep targets", completed: false }
    ],
    weekly: [
      { id: "m_w1", text: "Complete computer fundamentals phase", completed: false }
    ],
    monthly: [
      { id: "m_m1", text: "Complete Python basics and OOP concepts", completed: false }
    ]
  },

  reflections: {},

  vault: [],

  aiProfile: {
    learningSpeed: "Optimal (4.2 milestones/wk)",
    consistencyScore: 95,
    preferredStudyWindow: "18:00 - 21:00 (Evening)",
    strongAreas: ["Programming Foundations", "Generative AI"],
    weakAreas: ["Mathematics", "Data Science"],
    revisionRequirement: "High (Statistics)",
    
    // Hidden metrics tracked continuously
    learningSpeedHistory: [],
    completionRate: 85,
    averageSessionDuration: 42,
    goalSwitchingCount: 0,
    weakTopicsLog: { "Mathematics": 2, "Data Science": 1 },
    strongTopicsLog: { "Programming Foundations": 3 },
    forgettingCurve: {
      "Computer Fundamentals": 90,
      "Programming Foundations": 85,
      "Mathematics": 45,
      "Data Science": 75
    }
  },

  fitness: {
    steps: {},
    walkingDistance: {},
    runningDistance: {},
    cyclingDistance: {},
    calories: {},
    waterIntake: {},
    sleepHours: {},
    weight: {}
  },

  lifeTimeline: [
    {
      id: "tl_1",
      year: "2026",
      type: "Goal",
      title: "Launch ShaVex OS",
      desc: "Kicked off accelerated learning roadmap system."
    }
  ],

  momentum: {
    lastActiveDate: new Date().toISOString().split('T')[0]
  },

  auth: {
    user: {
      id: "guest_user",
      email: "guest@shavex.os",
      user_metadata: {
        full_name: "Guest Explorer"
      }
    }
  }
};
