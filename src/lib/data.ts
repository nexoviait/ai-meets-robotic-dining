export type StationId = "coffee" | "snack" | "meals" | "integrated";
export type Category = "coffee" | "tea" | "snacks" | "lunch" | "dinner";

export interface MenuItem {
  id: string;
  name: string;
  bn: string;
  category: Category;
  price: number;
  emoji: string;
  desc: string;
  prepSeconds: number;
}

export const MENU: MenuItem[] = [
  { id: "cappuccino", name: "Cappuccino", bn: "ক্যাপুচিনো", category: "coffee", price: 180, emoji: "☕", desc: "Robot-pulled double shot with velvet milk foam.", prepSeconds: 90 },
  { id: "americano", name: "Americano", bn: "আমেরিকানো", category: "coffee", price: 150, emoji: "☕", desc: "Espresso lengthened with hot water. Bold and clean.", prepSeconds: 60 },
  { id: "latte", name: "Latte", bn: "লাতে", category: "coffee", price: 190, emoji: "🥛", desc: "Smooth espresso with silky steamed milk and latte art.", prepSeconds: 90 },
  { id: "hot-tea", name: "Hot Tea", bn: "রং চা", category: "tea", price: 60, emoji: "🍵", desc: "Classic Bangladeshi liquor tea, brewed fresh.", prepSeconds: 45 },
  { id: "milk-tea", name: "Milk Tea", bn: "দুধ চা", category: "tea", price: 80, emoji: "🫖", desc: "Strong tea with steamed milk — the Dhaka favourite.", prepSeconds: 50 },
  { id: "green-tea", name: "Green Tea", bn: "গ্রিন টি", category: "tea", price: 90, emoji: "🌿", desc: "Light, antioxidant-rich green tea.", prepSeconds: 45 },
  { id: "burger", name: "Burger", bn: "বার্গার", category: "snacks", price: 220, emoji: "🍔", desc: "Grilled chicken patty, cheese, fresh lettuce — assembled by robot arm.", prepSeconds: 150 },
  { id: "sandwich", name: "Sandwich", bn: "স্যান্ডউইচ", category: "snacks", price: 160, emoji: "🥪", desc: "Toasted club sandwich with chicken and egg.", prepSeconds: 100 },
  { id: "cookies", name: "Cookies", bn: "কুকিজ", category: "snacks", price: 80, emoji: "🍪", desc: "Three warm chocolate-chip cookies.", prepSeconds: 30 },
  { id: "muffin", name: "Muffin", bn: "মাফিন", category: "snacks", price: 120, emoji: "🧁", desc: "Fresh-baked chocolate or blueberry muffin.", prepSeconds: 30 },
  { id: "fries", name: "French Fries", bn: "ফ্রেঞ্চ ফ্রাই", category: "snacks", price: 120, emoji: "🍟", desc: "Crispy golden fries, auto-fried and salted.", prepSeconds: 120 },
  { id: "chicken-bites", name: "Chicken Bites", bn: "চিকেন বাইটস", category: "snacks", price: 180, emoji: "🍗", desc: "Crunchy fried chicken bites with dip.", prepSeconds: 130 },
  { id: "chicken-curry", name: "Chicken Curry Meal", bn: "চিকেন কারি মিল", category: "lunch", price: 220, emoji: "🍛", desc: "Chicken curry, steamed rice, dal and salad.", prepSeconds: 180 },
  { id: "beef-curry", name: "Beef Curry Meal", bn: "বিফ কারি মিল", category: "lunch", price: 280, emoji: "🍛", desc: "Slow-cooked beef curry with rice and dal.", prepSeconds: 200 },
  { id: "fish-curry", name: "Fish Curry Meal", bn: "ফিশ কারি মিল", category: "lunch", price: 240, emoji: "🐟", desc: "Rui fish curry, rice, dal and bhaji.", prepSeconds: 190 },
  { id: "veg-meal", name: "Veg Meal", bn: "ভেজ মিল", category: "lunch", price: 180, emoji: "🥗", desc: "Mixed vegetables, dal, rice and salad.", prepSeconds: 150 },
  { id: "chicken-biryani", name: "Chicken Biryani", bn: "চিকেন বিরিয়ানি", category: "dinner", price: 250, emoji: "🍚", desc: "Fragrant kacchi-style chicken biryani.", prepSeconds: 200 },
  { id: "beef-tehari", name: "Beef Tehari", bn: "বিফ তেহারি", category: "dinner", price: 300, emoji: "🍚", desc: "Old Dhaka style beef tehari with mustard oil.", prepSeconds: 210 },
  { id: "khichuri", name: "Khichuri Special", bn: "খিচুড়ি স্পেশাল", category: "dinner", price: 200, emoji: "🥘", desc: "Bhuna khichuri with egg and beguni.", prepSeconds: 180 },
  { id: "combo", name: "Combo Meal", bn: "কম্বো মিল", category: "dinner", price: 320, emoji: "🍱", desc: "Biryani, chicken roast, salad and a drink.", prepSeconds: 220 },
];

export const CATEGORY_LABEL: Record<Category, [string, string]> = {
  coffee: ["Coffee", "কফি"],
  tea: ["Tea", "চা"],
  snacks: ["Snacks", "স্ন্যাকস"],
  lunch: ["Lunch", "লাঞ্চ"],
  dinner: ["Dinner", "ডিনার"],
};

export const STATIONS: { id: StationId; name: string; bn: string; tagline: string; categories: Category[]; features: string[] }[] = [
  { id: "coffee", name: "Automated Coffee & Tea Bar", bn: "স্বয়ংক্রিয় কফি ও টি বার", tagline: "Scan · Order · Pay · Collect", categories: ["coffee", "tea"], features: ["Touchscreen order kiosk", "Scan & Pay with bKash / Nagad", "Collect Your Drink counter"] },
  { id: "snack", name: "Automated Snack Station", bn: "স্বয়ংক্রিয় স্ন্যাক স্টেশন", tagline: "AI Powered · Robotic Kitchen · 24/7", categories: ["snacks"], features: ["Robotic assembly line", "Pay by bKash / Nagad / Card / QR", "Pick Up Your Food hatch"] },
  { id: "meals", name: "Automated Lunch & Dinner Station", bn: "স্বয়ংক্রিয় লাঞ্চ ও ডিনার স্টেশন", tagline: "Robot Chef · Quick & Fresh · Hygienic & Safe", categories: ["lunch", "dinner"], features: ["Robot chef with woks", "Select meal · Pay by QR", "Collect Your Meal Here"] },
  { id: "integrated", name: "Automated Food-Service Station", bn: "সমন্বিত ২৪/৭ ফুড-সার্ভিস স্টেশন", tagline: "Coffee | Tea | Snacks | Lunch | Dinner | 24/7", categories: ["coffee", "tea", "snacks", "lunch", "dinner"], features: ["All-in-one ordering", "Real-time pickup status", "Multiple Pickup Here bays"] },
];

export const PACKAGES = [
  { id: "launch", name: "Launch Kit", range: [5000, 25000], automation: 0.12, growth: 0.05, desc: "Brand identity, landing page, social kit and AI content starter for new ventures.", includes: ["Logo & brand kit", "Landing page", "30-day content plan", "WhatsApp catalogue setup"] },
  { id: "growth", name: "Growth Kit", range: [25000, 150000], automation: 0.25, growth: 0.12, desc: "Marketing systems, e-commerce, ads funnels and AI-assisted customer service.", includes: ["E-commerce store", "Ad funnel & tracking", "AI chat assistant", "Monthly analytics"] },
  { id: "automation", name: "Automation Kit", range: [50000, 300000], automation: 0.4, growth: 0.15, desc: "Workflow automation across orders, invoices, inventory and follow-ups.", includes: ["Process mapping", "Order & invoice automation", "Inventory alerts", "Staff training"] },
  { id: "bizos", name: "Business OS", range: [150000, 600000], automation: 0.5, growth: 0.2, desc: "A connected operating system: CRM, HR, accounts and dashboards in one place.", includes: ["CRM + sales pipeline", "HR & payroll", "Accounts dashboard", "Managed support"] },
  { id: "studio", name: "Build Studio", range: [200000, 1500000], automation: 0.45, growth: 0.25, desc: "Custom apps, platforms and AI products built with our production studio.", includes: ["Product discovery", "Custom web / mobile app", "AI feature integration", "Launch support"] },
  { id: "enterprise", name: "Enterprise AI", range: [300000, 5000000], automation: 0.6, growth: 0.3, desc: "Enterprise architecture, private AI, data platforms and managed services.", includes: ["AI strategy & governance", "Private LLM / data stack", "System integration", "SLA-backed managed services"] },
] as const;

export const SECTORS = [
  { name: "Retail & E-commerce", icon: "ShoppingBag", plays: ["Product catalogue + AI descriptions", "Order & delivery automation", "Facebook / WhatsApp commerce bots"] },
  { name: "Food & Hospitality", icon: "UtensilsCrossed", plays: ["QR ordering & kitchen display", "Inventory & wastage tracking", "Reviews and loyalty automation"] },
  { name: "Professional Services", icon: "Briefcase", plays: ["Client intake & proposals", "Document drafting with AI", "Billing & follow-up automation"] },
  { name: "Healthcare", icon: "HeartPulse", plays: ["Appointment booking", "Patient reminders", "Report summarisation (human-reviewed)"] },
  { name: "Real Estate", icon: "Building2", plays: ["Listing content & virtual tours", "Lead scoring & CRM", "Site-visit scheduling"] },
  { name: "Manufacturing", icon: "Factory", plays: ["Production dashboards", "Quality-check workflows", "Buyer communication & compliance"] },
  { name: "Creators", icon: "Clapperboard", plays: ["Video & thumbnail production", "Content calendars", "Sponsorship & audience analytics"] },
];

export const ZONES = [
  { id: "floor", name: "Open Workstation Floor", sqft: 4200, col: "1 / 4", row: "1 / 3", desc: "200+ AI-enabled workstations, 3,000 seat-hours of daily capacity, tiered by session length." },
  { id: "consult", name: "Consultation Rooms", sqft: 1000, col: "4 / 5", row: "1 / 2", desc: "Private rooms where human consultants review AI output and design your solution." },
  { id: "studio", name: "Production Studio", sqft: 800, col: "4 / 5", row: "2 / 3", desc: "Photo, video and podcast studio for brand, product and creator content." },
  { id: "training", name: "Training & Community", sqft: 1000, col: "1 / 3", row: "3 / 4", desc: "Workshops, sector clinics, meetups and certification courses." },
  { id: "cafe", name: "AI Food Automation Café", sqft: 1000, col: "3 / 5", row: "3 / 4", desc: "Robotic coffee bar, snack station and lunch & dinner station — open 24/7." },
];

export const JOURNEY = [
  ["Book", "Reserve a BDT 100 session online or at the hub."],
  ["Discover", "Explore your idea with AI tools at your workstation."],
  ["Design", "Turn the idea into a plan, brand or product spec."],
  ["Human Review", "A consultant checks the work and recommends a package."],
  ["Implement", "Our team and studio build and automate it."],
  ["Grow", "Subscriptions and managed services keep you scaling."],
];

export const WORKSTATIONS = [
  { id: "standard", name: "Standard AI Station", price: 100, desc: "AI-enabled workstation with premium tools. Included in entry ticket." },
  { id: "gpu", name: "GPU Deep-Work Pod", price: 500, desc: "High-performance local compute for video, models and design." },
  { id: "booth", name: "Private Consultation Booth", price: 700, desc: "Private booth with a dedicated human consultant for 30 minutes." },
];

export const SLOTS = [
  { id: "morning", name: "Morning", time: "6:00 AM – 11:00 AM", start: 6 },
  { id: "afternoon", name: "Afternoon", time: "11:00 AM – 4:00 PM", start: 11 },
  { id: "evening", name: "Evening", time: "4:00 PM – 11:00 PM", start: 16 },
  { id: "night", name: "Night Owl 24/7", time: "11:00 PM – 6:00 AM", start: 23 },
];

export const FOCUS = ["Idea Discovery", "Marketing & Branding", "Automation & Systems", "Enterprise Architecture"];

export const BDT_PER_USD = 124.75;
export const NATIONAL_INVESTMENT_USD = 100_000_000;
export const PILOT_MIN_USD = 5_000_000;
export const PILOT_MAX_USD = 10_000_000;
export const DISTRICT_HUB_COUNT = 64;
export const MIN_HUB_SQFT = 8_000;
export const TOTAL_MIN_SQFT = DISTRICT_HUB_COUNT * MIN_HUB_SQFT;
export const AVERAGE_HUB_USD = NATIONAL_INVESTMENT_USD / DISTRICT_HUB_COUNT;
export const usdToBdtCrore = (usd: number) => (usd * BDT_PER_USD) / 10_000_000;
export const crore = (n: number) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 3 });
export const usdMillions = (n: number) => `USD ${(n / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 4 })} Million`;

export const ROADMAP = [
  { phase: "Phase 1", when: "Pilot development", title: "Prove the operating model", points: ["Secure USD 5–10 Million in pilot funding", "Establish the initial operational hubs", "Develop the central technology platform", "Validate service demand and revenue models"] },
  { phase: "Phase 2", when: "Regional expansion", title: "Build regional capability", points: ["Expand to additional district hubs", "Establish regional management and technical support", "Develop education and business partnerships", "Standardize the hub operating playbook"] },
  { phase: "Phase 3", when: "National network", title: "Connect all 64 districts", points: ["Progressively establish hubs across all 64 districts", "Standardize facilities and operating procedures", "Integrate every hub into one national AI ecosystem", "Scale only after funding and operational validation"] },
  { phase: "Phase 4", when: "National AI ecosystem", title: "Deepen national impact", points: ["Build a nationwide entrepreneur and startup network", "Expand AI education and professional certification", "Develop international technology collaboration", "Position Bangladesh as a regional AI innovation destination"] },
];

export const HUB_INFRASTRUCTURE = [
  "AI Workstation and Computing Zone",
  "AI Training and Learning Academy",
  "Startup Incubation and Innovation Center",
  "Business Automation and AI Consulting Center",
  "Software Development and Technology Lab",
  "Robotics and Smart Technology Lab",
  "Digital Marketing and Creative Production Studio",
  "Entrepreneur Collaboration and Coworking Space",
  "Conference, Meeting and Investor Presentation Rooms",
  "Business Support and AI Research Facilities",
];

export const PILOT_OPTIONS = [
  {
    name: "Option A · Entry pilot",
    usd: PILOT_MIN_USD,
    share: "5% of the national target",
    note: "Approximately 3.2 average hub-equivalents of investment capacity; actual centers may share central infrastructure.",
    points: ["Initial AI Hub establishment", "Central AI technology platform", "Computing and workstation infrastructure", "AI training and entrepreneurship programs", "Initial staffing, operations and market validation"],
  },
  {
    name: "Option B · Preferred pilot",
    usd: PILOT_MAX_USD,
    share: "10% of the national target",
    note: "Approximately 5–6 pilot hubs may be possible, subject to final cost planning and shared national infrastructure.",
    points: ["Initial district pilot hubs", "National AI technology backbone", "Expanded AI computing facilities", "Commercial AI services and startup incubation", "University, business and technology partnerships"],
  },
];

export const REVENUE_STREAMS = [
  { name: "AI Services", items: ["AI employee solutions and agents", "Business automation and enterprise implementation", "AI-powered customer support", "AI consulting and integration"] },
  { name: "AI Education", items: ["Professional and corporate AI training", "AI entrepreneurship programs", "Technical workshops and certifications"] },
  { name: "Technology & Infrastructure", items: ["AI workstation access", "Computing and cloud services", "Software development and subscriptions"] },
  { name: "Business & Startup Ecosystem", items: ["Startup incubation and coworking memberships", "Business advisory and innovation programs", "Corporate partnerships and sponsored programs"] },
  { name: "Creative & Digital Services", items: ["AI content, video and design production", "Digital marketing", "Business branding and automation"] },
];

export const ALLOCATION_CATEGORIES = [
  "Physical infrastructure and facility development",
  "AI computing hardware and workstations",
  "Technology platforms and software development",
  "Robotics, research and innovation facilities",
  "Human resources and technical talent",
  "Training, education and startup incubation",
  "Marketing, business development and partnerships",
  "Central management, governance and contingency",
];

export const PARTNERSHIP_TYPES = [
  "International AI technology companies and cloud providers",
  "Hardware, workstation, robotics and automation companies",
  "Universities and research institutions",
  "Local and international startup ecosystems",
  "Banks, financial institutions and corporate investors",
  "Government and development organizations",
];

export const GOVERNANCE_STRUCTURE = [
  "Board of Directors and executive leadership",
  "Chief Executive, Technology and Financial Officers",
  "National Operations Director and District Hub Managers",
  "Technology, innovation, finance, compliance and audit teams",
  "Standardized reporting, monitoring and performance measurement",
];

export const NATIONAL_IMPACT = [
  "Expand district-level access to artificial intelligence",
  "Support local entrepreneurs, startups and SMEs",
  "Create technology-based employment opportunities",
  "Improve digital skills and workforce readiness",
  "Encourage research, innovation and technology development",
  "Connect district businesses with national and international markets",
];

export const HUB = {
  address: "Gawsia Twin Peak, 30 N Circular Rd, Dhaka 1205",
  hours: "6:00 AM – 11:00 PM daily",
  cafe: "Café open 24/7",
  whatsapp: "8801700000000",
  email: "hello@aihubbd.com",
};

export const taka = (n: number) => `৳${Math.round(n).toLocaleString("en-IN")}`;
