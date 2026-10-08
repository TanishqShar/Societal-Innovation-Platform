// Shared domain constants for the India Societal Innovation Collaboration Portal.

export const CATEGORIES = [
  "Education",
  "Agriculture",
  "Healthcare",
  "Water Resources",
  "Sanitation",
  "Environment",
  "Energy",
  "Urban Development",
  "Accessibility",
  "Public Administration",
  "Rural Livelihoods",
] as const;

export type Category = (typeof CATEGORIES)[number];

// ---- Supported states (India-wide platform, initially 5 states) ---------------
export const STATES = [
  "Jharkhand",
  "Punjab",
  "Maharashtra",
  "Karnataka",
  "Rajasthan",
] as const;

export type State = (typeof STATES)[number];

// ---- District lists per state -----------------------------------------------
export const STATE_DISTRICTS: Record<State, readonly string[]> = {
  Jharkhand: [
    "Ranchi",
    "Dhanbad",
    "East Singhbhum (Jamshedpur)",
    "Bokaro",
    "Hazaribagh",
    "Deoghar",
    "Giridih",
    "Palamu",
    "Dumka",
    "Gumla",
    "Khunti",
    "Latehar",
    "Chatra",
    "Sahibganj",
    "West Singhbhum",
    "Saraikela Kharsawan",
    "Simdega",
    "Lohardaga",
    "Ramgarh",
    "Koderma",
    "Garhwa",
    "Godda",
    "Jamtara",
    "Pakur",
  ],
  Punjab: [
    "Amritsar",
    "Ludhiana",
    "Jalandhar",
    "Patiala",
    "Bathinda",
    "Mohali",
    "Gurdaspur",
    "Hoshiarpur",
    "Rupnagar",
    "Sangrur",
    "Fatehgarh Sahib",
    "Fazilka",
  ],
  Maharashtra: [
    "Mumbai City",
    "Mumbai Suburban",
    "Pune",
    "Nagpur",
    "Nashik",
    "Aurangabad",
    "Solapur",
    "Kolhapur",
    "Thane",
    "Amravati",
    "Latur",
    "Osmanabad",
    "Yavatmal",
  ],
  Karnataka: [
    "Bengaluru Urban",
    "Bengaluru Rural",
    "Mysuru",
    "Belagavi",
    "Kalaburagi",
    "Mangaluru",
    "Shivamogga",
    "Tumakuru",
    "Dharwad",
    "Vijayapura",
    "Hassan",
    "Raichur",
    "Bidar",
  ],
  Rajasthan: [
    "Jaipur",
    "Jodhpur",
    "Udaipur",
    "Kota",
    "Ajmer",
    "Bikaner",
    "Alwar",
    "Bharatpur",
    "Barmer",
    "Jaisalmer",
    "Nagaur",
    "Tonk",
  ],
};

// Flat list of Jharkhand districts (legacy / backward compat)
export const DISTRICTS = STATE_DISTRICTS.Jharkhand;

// ---- Canonical challenge lifecycle statuses ----------------------------------
export const CHALLENGE_STATUSES = [
  "submitted",
  "under_review",
  "validated",
  "assigned",
  "in_progress",
  "completed",
  "deployed",
  "rejected",
] as const;

export type ChallengeStatus = (typeof CHALLENGE_STATUSES)[number];

// Human-readable labels for challenge statuses
export const CHALLENGE_STATUS_LABELS: Record<ChallengeStatus, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  validated: "Validated",
  assigned: "Assigned",
  in_progress: "In Progress",
  completed: "Completed",
  deployed: "Deployed",
  rejected: "Rejected",
};

// ---- Canonical project lifecycle statuses -----------------------------------
export const PROJECT_STATUSES = [
  "planning",
  "research",
  "prototype",
  "testing",
  "pilot",
  "deployment",
  "completed",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: "Planning",
  research: "Research",
  prototype: "Prototype",
  testing: "Testing",
  pilot: "Pilot",
  deployment: "Deployment",
  completed: "Completed",
};

// ---- Priority levels --------------------------------------------------------
export const PRIORITIES = ["Critical", "High", "Medium", "Low"] as const;
export type Priority = (typeof PRIORITIES)[number];

// ---- Legacy Status alias (kept for backward compat) -------------------------
// The old code used Title-case strings. New code uses ChallengeStatus.
// Both are usable; migrate incrementally.
export const STATUSES = [
  "Submitted",
  "Under Review",
  "Assigned",
  "In Progress",
  "Resolved",
] as const;
export type Status = (typeof STATUSES)[number];

// ---- Subcategories per domain -----------------------------------------------
export const SUBCATEGORIES: Record<Category, string[]> = {
  Education: ["Primary Education", "Secondary Education", "Vocational Training", "Digital Literacy", "Teacher Shortage"],
  Agriculture: ["Crop Disease", "Irrigation", "Soil Health", "Market Linkage", "Seed Supply", "Pest Control"],
  Healthcare: ["Primary Healthcare", "Maternal Health", "Nutrition", "Disease Outbreak", "Medicine Supply", "Mental Health"],
  "Water Resources": ["Drinking Water", "Groundwater Depletion", "Water Contamination", "Irrigation Water", "Flood Management"],
  Sanitation: ["Open Defecation", "Solid Waste", "Drainage", "Sewage Treatment", "Hygiene Awareness"],
  Environment: ["Air Pollution", "Water Pollution", "Deforestation", "Wildlife Conflict", "Plastic Waste", "Climate Impact"],
  Energy: ["Power Outages", "Rural Electrification", "Renewable Energy", "Street Lighting", "Voltage Fluctuation"],
  "Urban Development": ["Road Infrastructure", "Traffic Management", "Drainage", "Housing", "Public Spaces"],
  Accessibility: ["Physical Accessibility", "Assistive Technology", "Sign Language", "Braille", "Transport Accessibility"],
  "Public Administration": ["Documentation", "Corruption", "Scheme Delivery", "Digital Services", "Grievance Redressal"],
  "Rural Livelihoods": ["MGNREGA", "SHG Support", "Market Access", "Skills Training", "Micro-enterprise"],
};

// ---- Academic disciplines relevant to each domain ---------------------------
export const DOMAIN_DISCIPLINES: Record<Category, string[]> = {
  Education: ["Education Technology", "Pedagogy", "Social Work", "Computer Science"],
  Agriculture: ["Agronomy", "Soil Science", "Agricultural Engineering", "Biotechnology", "Remote Sensing"],
  Healthcare: ["Medicine", "Public Health", "Pharmacy", "Biomedical Engineering", "Epidemiology"],
  "Water Resources": ["Civil Engineering", "Environmental Engineering", "Hydrology", "IoT", "Chemistry"],
  Sanitation: ["Environmental Engineering", "Civil Engineering", "Public Health", "Microbiology"],
  Environment: ["Environmental Science", "Ecology", "Remote Sensing", "Chemistry", "Policy Studies"],
  Energy: ["Electrical Engineering", "Renewable Energy", "Electronics", "IoT", "Physics"],
  "Urban Development": ["Civil Engineering", "Architecture", "Urban Planning", "GIS", "Transportation"],
  Accessibility: ["Mechanical Engineering", "Rehabilitation Engineering", "Computer Science", "Design"],
  "Public Administration": ["Public Policy", "Law", "Information Systems", "Data Science"],
  "Rural Livelihoods": ["Economics", "Social Work", "Agribusiness", "Finance", "Entrepreneurship"],
};

// ---- Institution data (all supported states) --------------------------------
export interface InstitutionData {
  name: string;
  state: State;
  district: string;
  domains: Category[];
  departments: string[];
  expertise: string[];
  facilities: string[];
  research_areas: string[];
  strengths: Category[];     // backward-compat alias
  disciplines: string[];     // backward-compat alias
  location: string;          // backward-compat alias
}

export const INSTITUTIONS: InstitutionData[] = [
  // --- Jharkhand (Official primary institutions) ---
  {
    name: "BIT Sindri",
    state: "Jharkhand",
    district: "Dhanbad",
    domains: ["Water Resources", "Energy", "Urban Development", "Environment", "Agriculture"],
    departments: ["Civil Engineering", "Mechanical Engineering", "Chemical Engineering", "Electrical Engineering", "Mining Engineering", "Environmental Engineering"],
    expertise: ["Mine drainage filtration", "Water quality sensor telemetry", "Fly ash utilization", "Solar microgrid systems", "Heavy metal precipitation"],
    facilities: ["Advanced Water & Chemical Analysis Lab", "IoT Telemetry Testbench", "Metallurgical FabLab", "Environmental Engineering Testing Centre"],
    research_areas: ["Groundwater remediation", "Arsenic & Fluoride adsorption", "Clean coal technologies", "Rural sanitation hardware"],
    strengths: ["Water Resources", "Energy", "Urban Development", "Environment", "Agriculture"],
    disciplines: ["Civil Engineering", "Environmental Engineering", "IoT", "Electrical Engineering", "Mechanical Engineering", "Chemical Engineering"],
    location: "Dhanbad",
  },
  {
    name: "IIT (ISM) Dhanbad",
    state: "Jharkhand",
    district: "Dhanbad",
    domains: ["Energy", "Environment", "Water Resources", "Urban Development"],
    departments: ["Environmental Science & Engineering", "Mining Engineering", "Fuel & Mineral Engineering", "Computer Science", "Applied Geology", "Civil Engineering"],
    expertise: ["DeepTech sensing", "Geotechnical robotics", "Surface water modeling", "Clean fuel cells", "Subsurface contamination tracking"],
    facilities: ["Centre for Innovation & Incubation (CIIE)", "NVIDIA Supercomputing Cluster", "Environmental Monitoring Chamber", "Earth Sciences Telemetry Lab"],
    research_areas: ["Hydrogeology", "Subsidence control", "Air quality dispersion", "Renewable energy microgrids"],
    strengths: ["Energy", "Environment", "Water Resources", "Urban Development"],
    disciplines: ["Electrical Engineering", "Environmental Engineering", "Civil Engineering", "Mining Engineering", "IoT", "Computer Science"],
    location: "Dhanbad",
  },
  {
    name: "BIT Mesra, Ranchi",
    state: "Jharkhand",
    district: "Ranchi",
    domains: ["Energy", "Urban Development", "Accessibility", "Education"],
    departments: ["Mechanical Engineering", "Electronics & Communication", "Computer Science & Engineering", "Space Engineering & Rocketry", "Architecture"],
    expertise: ["Autonomous drone mapping", "Assistive mobility devices", "Smart power converters", "GIS spatial analytics", "Embedded sensor systems"],
    facilities: ["Science & Tech Entrepreneurs Park (STEP)", "Drone Fabrication Hangar", "RF & Microwave Chamber", "Additive 3D Prototyping Lab"],
    research_areas: ["Remote sensing for rural infrastructure", "Electric vehicles", "Embedded sensor systems", "Assistive robotics"],
    strengths: ["Energy", "Urban Development", "Accessibility", "Education"],
    disciplines: ["Mechanical Engineering", "Rehabilitation Engineering", "Computer Science", "Electronics", "Architecture"],
    location: "Ranchi",
  },
  {
    name: "Birsa Agricultural University",
    state: "Jharkhand",
    district: "Ranchi",
    domains: ["Agriculture", "Rural Livelihoods", "Water Resources"],
    departments: ["Agronomy", "Soil Science & Agricultural Chemistry", "Agricultural Engineering", "Plant Breeding", "Horticulture", "Biotechnology"],
    expertise: ["Indigenous drought-hardy millets", "Lac cultivation & processing", "Drip irrigation optimization", "Bio-fertilizers", "Micro-watershed crop planning"],
    facilities: ["Birsa Bio-Incubation Centre (BABIC)", "Soil Telemetry & Nutrient Testing Lab", "Tissue Culture Facility", "Polyhouse Research Testbed"],
    research_areas: ["Rainfed upland farming", "Tribal agroforestry", "Pest biocontrol", "Post-harvest cold chain storage"],
    strengths: ["Agriculture", "Rural Livelihoods", "Water Resources"],
    disciplines: ["Agronomy", "Soil Science", "Agricultural Engineering", "Hydrology", "Biotechnology"],
    location: "Ranchi",
  },
  {
    name: "RIMS Ranchi",
    state: "Jharkhand",
    district: "Ranchi",
    domains: ["Healthcare", "Sanitation"],
    departments: ["Community Medicine & Public Health", "Microbiology", "Biochemistry", "Pediatrics", "Pathology", "Epidemiology"],
    expertise: ["Sickle cell anemia screening in tribal belts", "Fluorosis diagnosis", "Vector-borne disease epidemiology", "Point-of-care diagnostics"],
    facilities: ["RIMS MedTech Innovation Hub", "Advanced Diagnostic Pathology Lab", "Mobile Health Clinics", "Epidemic Virology Unit"],
    research_areas: ["Tribal public health surveillance", "Water-borne pathogens", "Nutritional deficiency interventions", "Telemedicine outreach"],
    strengths: ["Healthcare", "Sanitation"],
    disciplines: ["Medicine", "Public Health", "Epidemiology", "Pharmacy", "Microbiology"],
    location: "Ranchi",
  },
  {
    name: "Central University of Jharkhand",
    state: "Jharkhand",
    district: "Ranchi",
    domains: ["Environment", "Rural Livelihoods", "Public Administration"],
    departments: ["Environmental Sciences", "Energy Engineering", "Tribal Studies", "Centre for Nanotechnology", "Economics", "Law"],
    expertise: ["Biomass gasification", "Tribal economic self-help networks", "Solar photovoltaic testing", "Policy design", "Forest resource rights"],
    facilities: ["Solar Radiation Resource Centre", "Water Analytical Instrument Lab", "Community Outreach Unit"],
    research_areas: ["Forest ecosystem restoration", "Rural decentralized energy", "Customary governance", "Environmental policy"],
    strengths: ["Environment", "Rural Livelihoods", "Public Administration"],
    disciplines: ["Environmental Science", "Economics", "Public Policy", "Social Work", "Law"],
    location: "Ranchi",
  },
  {
    name: "Ranchi University",
    state: "Jharkhand",
    district: "Ranchi",
    domains: ["Education", "Public Administration", "Accessibility"],
    departments: ["Education Technology", "Social Work", "Information Systems", "Computer Science", "Law"],
    expertise: ["Vernacular digital literacy", "Panchayat governance workflows", "Legal aid for tribal land claims", "Accessible civic portals"],
    facilities: ["Digital Learning Resource Centre", "Community Legal Clinic", "Language Technology Lab"],
    research_areas: ["Indigenous language preservation", "Public policy implementation", "Adult literacy models"],
    strengths: ["Education", "Public Administration", "Accessibility"],
    disciplines: ["Education Technology", "Social Work", "Information Systems", "Computer Science", "Law"],
    location: "Ranchi",
  },

  // --- Punjab ---
  {
    name: "IIT Ropar",
    state: "Punjab",
    district: "Rupnagar",
    domains: ["Agriculture", "Water Resources", "Energy", "Environment", "Urban Development"],
    departments: ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Computer Science", "Biomedical Engineering"],
    expertise: ["Paddy stubble biochar conversion", "Stubble management machinery", "Groundwater nitrate modeling", "Sub-surface drip irrigation telemetry"],
    facilities: ["Agriculture & Water Technology Development Hub (AWaDH)", "Precision Farming Testbed", "Advanced Water Treatment Testing Facility"],
    research_areas: ["Smart agriculture", "Canal water automation", "Air pollution source apportionment", "Rural IoT sensors"],
    strengths: ["Energy", "Water Resources", "Agriculture", "Urban Development"],
    disciplines: ["Civil Engineering", "Electrical Engineering", "Computer Science", "Biomedical Engineering", "Environmental Engineering"],
    location: "Rupnagar",
  },
  {
    name: "Punjab Agricultural University",
    state: "Punjab",
    district: "Ludhiana",
    domains: ["Agriculture", "Water Resources", "Rural Livelihoods"],
    departments: ["Soil and Water Engineering", "Agronomy", "Farm Machinery & Power Engineering", "Plant Pathology", "Food Science & Technology"],
    expertise: ["Happy Seeder technology", "Laser land leveling", "Low-water paddy varieties", "Tensiometer-based irrigation scheduling"],
    facilities: ["Soil Health & Nutrient Testing CoE", "Food Industry Centre", "Farm Machinery Testing & Training Centre"],
    research_areas: ["Groundwater conservation", "Residue in-situ management", "Bio-ethanol from crop waste", "Agrochemical residue tracking"],
    strengths: ["Agriculture", "Rural Livelihoods", "Water Resources"],
    disciplines: ["Agronomy", "Soil Science", "Agricultural Engineering", "Biotechnology", "Remote Sensing"],
    location: "Ludhiana",
  },
  {
    name: "Guru Nanak Dev University",
    state: "Punjab",
    district: "Amritsar",
    domains: ["Education", "Public Administration", "Rural Livelihoods"],
    departments: ["Education Technology", "Social Work", "Public Policy", "Economics", "Law"],
    expertise: ["Border belt youth skilling", "Agrarian microfinance", "Digital citizen grievance redressal"],
    facilities: ["Centre for Entrepreneurship", "Rural Skills Incubation Centre", "Data Analytics Lab"],
    research_areas: ["Agrarian debt recovery", "Vocational education pedagogy", "Civic governance digitisation"],
    strengths: ["Education", "Public Administration", "Rural Livelihoods"],
    disciplines: ["Education Technology", "Social Work", "Public Policy", "Economics", "Law"],
    location: "Amritsar",
  },
  {
    name: "Panjab University",
    state: "Punjab",
    district: "Mohali",
    domains: ["Healthcare", "Sanitation", "Environment"],
    departments: ["Pharmacology", "Microbiology", "Biochemistry", "Public Health", "Environmental Studies"],
    expertise: ["Groundwater heavy metal bio-remediation", "Rural hepatitis screening", "Antibiotic resistance surveillance"],
    facilities: ["Central Instrumentation Laboratory", "TBI BioNEST Incubator", "Water Quality Lab"],
    research_areas: ["Cancer registry in Malwa belt", "Fluoride & arsenic biosensors", "Solid waste bio-digestion"],
    strengths: ["Healthcare", "Sanitation", "Environment"],
    disciplines: ["Medicine", "Public Health", "Environmental Science", "Chemistry", "Pharmacy"],
    location: "Mohali",
  },

  // --- Maharashtra ---
  {
    name: "IIT Bombay",
    state: "Maharashtra",
    district: "Mumbai Suburban",
    domains: ["Urban Development", "Energy", "Environment", "Water Resources", "Healthcare", "Accessibility"],
    departments: ["Centre for Technology Alternatives for Rural Areas (CTARA)", "Civil Engineering", "Energy Science & Engineering", "Biosciences & Bioengineering", "IDC School of Design"],
    expertise: ["Rural drinking water schemes planning", "Solar urja lamps (SoUL)", "Affordable wheelchair design", "Decentralized sewage treatment (SBR)", "Watershed GIS analysis"],
    facilities: ["Society for Innovation & Entrepreneurship (SINE)", "Rural Tech FabLab", "Solar Energy Laboratory", "Biomedical Device Testing Lab"],
    research_areas: ["Drought mitigation in Vidarbha/Marathwada", "Affordable health diagnostic kits", "Decentralized mini-grids", "Urban flood drainage telemetry"],
    strengths: ["Urban Development", "Energy", "Environment", "Accessibility", "Water Resources"],
    disciplines: ["Civil Engineering", "Electrical Engineering", "Computer Science", "Urban Planning", "IoT", "GIS"],
    location: "Mumbai",
  },
  {
    name: "University of Pune (SPPU)",
    state: "Maharashtra",
    district: "Pune",
    domains: ["Education", "Public Administration", "Agriculture", "Environment"],
    departments: ["Environmental Science", "Geography", "Public Policy", "Biotechnology", "Computer Science"],
    expertise: ["Urban air monitoring", "GIS watershed mapping", "Drought contingency planning", "Micro-irrigation assessment"],
    facilities: ["Bio-Incubation Centre", "Remote Sensing & GIS Centre", "Renewable Energy Lab"],
    research_areas: ["Western Ghats biodiversity", "Municipal e-governance", "Agricultural micro-irrigation"],
    strengths: ["Education", "Public Administration", "Agriculture"],
    disciplines: ["Education Technology", "Public Policy", "Agronomy", "Social Work", "Information Systems"],
    location: "Pune",
  },
  {
    name: "VNIT Nagpur",
    state: "Maharashtra",
    district: "Nagpur",
    domains: ["Water Resources", "Urban Development", "Energy"],
    departments: ["Civil Engineering", "Environmental Engineering", "Electrical Engineering", "Mechanical Engineering", "Architecture"],
    expertise: ["Canal automation", "Low-cost water filtration", "Fly ash brick manufacturing", "Smart micro-grids"],
    facilities: ["Siemens Centre of Excellence", "Water Quality Analysis Lab", "High-Voltage Testing Lab"],
    research_areas: ["Vidarbha farm pond recharge", "Earthquake-resistant affordable housing", "Solar thermal drying"],
    strengths: ["Water Resources", "Urban Development", "Energy"],
    disciplines: ["Civil Engineering", "Environmental Engineering", "Electrical Engineering", "Mechanical Engineering", "Architecture"],
    location: "Nagpur",
  },
  {
    name: "AFMC Pune",
    state: "Maharashtra",
    district: "Pune",
    domains: ["Healthcare", "Sanitation"],
    departments: ["Community Medicine", "Preventive Medicine", "Microbiology", "Pathology"],
    expertise: ["Field epidemiology", "Rural emergency trauma response", "Water-borne outbreak control", "Malnutrition surveillance"],
    facilities: ["Clinical Research Laboratory", "Mobile Diagnostic Vans", "Tele-health Outreach Unit"],
    research_areas: ["Vector-borne diseases", "Disaster health management", "Sanitation-hygiene interventions"],
    strengths: ["Healthcare", "Sanitation"],
    disciplines: ["Medicine", "Public Health", "Epidemiology", "Biomedical Engineering", "Microbiology"],
    location: "Pune",
  },

  // --- Karnataka ---
  {
    name: "IISc Bengaluru",
    state: "Karnataka",
    district: "Bengaluru Urban",
    domains: ["Energy", "Environment", "Water Resources", "Agriculture", "Healthcare"],
    departments: ["Centre for Sustainable Technologies (CST)", "Civil Engineering", "Biochemical Engineering", "Computational & Data Sciences", "Interdisciplinary Centre for Water Research (ICWaR)"],
    expertise: ["Arsenic & fluoride removal (defluoridation filters)", "Biomethanation from organic waste", "AI for water network leakage", "Soil carbon sequestration sensing"],
    facilities: ["Society for Innovation & Development (SID)", "Centre for Nano Science & Engineering (CeNSE)", "Water Quality & Flow Dynamics Lab"],
    research_areas: ["River basin hydrological modeling", "Advanced solar thermal storage", "Epidemic surveillance platforms", "Dryland agriculture precision telemetry"],
    strengths: ["Energy", "Environment", "Water Resources", "Agriculture"],
    disciplines: ["Environmental Science", "Electrical Engineering", "Biomedical Engineering", "Chemistry", "IoT", "Remote Sensing"],
    location: "Bengaluru",
  },
  {
    name: "NIT Karnataka (NITK Surathkal)",
    state: "Karnataka",
    district: "Mangaluru",
    domains: ["Water Resources", "Urban Development", "Energy"],
    departments: ["Water Resources & Ocean Engineering", "Civil Engineering", "Chemical Engineering", "Electrical Engineering"],
    expertise: ["Coastal groundwater salinity modeling", "Rainwater harvesting in heavy rainfall zones", "Decentralized bio-toilets"],
    facilities: ["Hydraulics & Ocean Engineering Lab", "STEP TBI Incubator", "Environmental Engineering Lab"],
    research_areas: ["Saline water intrusion barrier design", "Floating wetland purification", "Wave & offshore solar power"],
    strengths: ["Water Resources", "Urban Development", "Energy"],
    disciplines: ["Civil Engineering", "Environmental Engineering", "Electrical Engineering", "Computer Science", "GIS"],
    location: "Mangaluru",
  },
  {
    name: "University of Agricultural Sciences Bengaluru",
    state: "Karnataka",
    district: "Bengaluru Rural",
    domains: ["Agriculture", "Rural Livelihoods", "Water Resources"],
    departments: ["Agronomy", "Soil Science", "Crop Physiology", "Agricultural Entomology", "Food Processing"],
    expertise: ["Ragi (finger millet) high-yield varieties", "Bio-pesticides", "Farm pond water conservation", "Drip fertigation"],
    facilities: ["Precision Farming Development Centre", "Bakery Training Unit", "Pesticide Residue Lab"],
    research_areas: ["Dryland moisture stress alleviation", "Organic farming certification", "Sericulture byproduct valorization"],
    strengths: ["Agriculture", "Rural Livelihoods", "Water Resources"],
    disciplines: ["Agronomy", "Soil Science", "Agricultural Engineering", "Biotechnology", "Horticulture"],
    location: "Bengaluru",
  },
  {
    name: "Rajiv Gandhi University of Health Sciences",
    state: "Karnataka",
    district: "Bengaluru Urban",
    domains: ["Healthcare", "Sanitation"],
    departments: ["Public Health", "Ayurvedic Medicine", "Microbiology", "Pharmaceutical Sciences"],
    expertise: ["Primary health center digitization", "Integration of traditional and modern therapeutics", "Community mental health"],
    facilities: ["Digital Health Resource Centre", "Pharmacognosy Testing Lab", "Community Health Outreach Centers"],
    research_areas: ["Rural non-communicable disease burden", "School sanitation and hygiene impact", "Affordable generic drug formulations"],
    strengths: ["Healthcare", "Sanitation"],
    disciplines: ["Medicine", "Public Health", "Pharmacy", "Nursing", "Epidemiology"],
    location: "Bengaluru",
  },

  // --- Rajasthan ---
  {
    name: "IIT Jodhpur",
    state: "Rajasthan",
    district: "Jodhpur",
    domains: ["Energy", "Water Resources", "Urban Development", "Environment", "Healthcare"],
    departments: ["Centre of Excellence in Solar Energy", "Civil Engineering", "Biosciences & Bioengineering", "Mechanical Engineering"],
    expertise: ["Solar brackish water desalination", "Atmospheric water harvesting in arid zones", "Sand-tolerant solar PV coatings", "Desert agro-horticulture telemetry"],
    facilities: ["Technology Innovation & Start-up Center (TISC)", "Arid Zone Desalination Pilot Facility", "Clean Energy Materials Characterization Lab"],
    research_areas: ["Desert aquifer recharge modeling", "Off-grid decentralized solar cold storage", "Fluoride mitigation in drinking water"],
    strengths: ["Energy", "Water Resources", "Urban Development"],
    disciplines: ["Electrical Engineering", "Civil Engineering", "Computer Science", "Environmental Engineering", "IoT"],
    location: "Jodhpur",
  },
  {
    name: "Maharana Pratap University of Agriculture & Technology",
    state: "Rajasthan",
    district: "Udaipur",
    domains: ["Agriculture", "Rural Livelihoods", "Water Resources"],
    departments: ["Soil & Water Conservation Engineering", "Agronomy", "Horticulture", "Animal Husbandry", "Renewable Energy Engineering"],
    expertise: ["Solar greenhouse dryers", "Micro-irrigation for arid horticultural crops", "Drought-tolerant pulses", "Goat breed improvement"],
    facilities: ["Renewable Energy Testing Lab", "Soil Health Assessment Lab", "KVK Outreach Network"],
    research_areas: ["Arid watershed management", "Solar thermal agricultural processing", "Pastureland regeneration"],
    strengths: ["Agriculture", "Rural Livelihoods", "Water Resources"],
    disciplines: ["Agronomy", "Soil Science", "Irrigation Engineering", "Animal Science", "Agricultural Economics"],
    location: "Udaipur",
  },
  {
    name: "Rajasthan University of Health Sciences",
    state: "Rajasthan",
    district: "Jaipur",
    domains: ["Healthcare", "Sanitation"],
    departments: ["Community Medicine", "Physiology", "Microbiology", "Public Health Dentistry"],
    expertise: ["Endemic skeletal fluorosis surveillance", "Mobile dental clinics in rural areas", "Silicosis screening in sandstone quarry workers"],
    facilities: ["Silicosis Diagnostic Lab", "Community Mobile Health Units", "Fluorosis Research Cell"],
    research_areas: ["Occupational dust hazard mitigation", "Safe drinking water epidemiological impact", "Maternal-child nutrition in desert districts"],
    strengths: ["Healthcare", "Sanitation"],
    disciplines: ["Medicine", "Public Health", "Pharmacy", "Nursing", "Epidemiology"],
    location: "Jaipur",
  },
  {
    name: "Rajasthan Technical University",
    state: "Rajasthan",
    district: "Kota",
    domains: ["Energy", "Urban Development", "Education", "Public Administration"],
    departments: ["Electrical Engineering", "Mechanical Engineering", "Computer Science", "Civil Engineering", "Architecture"],
    expertise: ["Solar rooftop optimization", "Urban drainage modeling in canal network cities", "Affordable low-cost construction"],
    facilities: ["Solar Energy Research Lab", "CAD/CAM Center", "Structural Testing Facility"],
    research_areas: ["Canal-top solar PV integration", "Smart city traffic signal synchronization", "Technical curriculum vernacular delivery"],
    strengths: ["Energy", "Urban Development", "Education", "Public Administration"],
    disciplines: ["Electrical Engineering", "Mechanical Engineering", "Computer Science", "Civil Engineering", "Architecture"],
    location: "Kota",
  },
];

// Backward-compat alias for Jharkhand institutions
export const UNIVERSITIES = INSTITUTIONS.filter((i) => i.state === "Jharkhand");

// --- Lightweight "AI" classifier -------------------------------------------
const KEYWORDS: Record<Category, string[]> = {
  Education: ["school", "teacher", "student", "class", "education", "study", "learning", "college", "book", "literacy"],
  Agriculture: ["farm", "crop", "soil", "irrigation", "seed", "harvest", "farmer", "pesticide", "fertiliser", "fertilizer", "paddy"],
  Healthcare: ["hospital", "doctor", "health", "medicine", "clinic", "disease", "patient", "nurse", "vaccine", "medical"],
  "Water Resources": ["water", "well", "borewell", "river", "pond", "drinking water", "tubewell", "groundwater", "dam"],
  Sanitation: ["toilet", "sanitation", "garbage", "waste", "sewage", "drain", "hygiene", "cleanliness"],
  Environment: ["pollution", "forest", "tree", "environment", "air quality", "plastic", "wildlife", "deforestation", "climate"],
  Energy: ["electricity", "power", "solar", "energy", "grid", "load shedding", "streetlight", "generator"],
  "Urban Development": ["road", "traffic", "building", "drainage", "footpath", "bridge", "housing", "encroachment", "parking"],
  Accessibility: ["disabled", "wheelchair", "ramp", "accessibility", "blind", "differently abled", "divyang"],
  "Public Administration": ["certificate", "office", "corruption", "document", "ration", "pension", "aadhaar", "scheme", "bribe"],
  "Rural Livelihoods": ["job", "employment", "mgnrega", "livelihood", "income", "shg", "self help group", "wages", "market"],
};

export function classify(text: string): Category {
  const lower = text.toLowerCase();
  let best: Category = "Public Administration";
  let bestScore = 0;
  for (const category of CATEGORIES) {
    const words = KEYWORDS[category] ?? [];
    let score = 0;
    for (const w of words) {
      if (lower.includes(w)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = category;
    }
  }
  return best;
}

export function routeToUniversity(category: Category, state?: string): string {
  const stateInstitutions = state
    ? INSTITUTIONS.filter((i) => i.state === state)
    : UNIVERSITIES; // fallback to Jharkhand
  const match = stateInstitutions.find((u) => u.strengths.includes(category));
  return match?.name ?? (stateInstitutions[0]?.name ?? "Central University of Jharkhand");
}

// ---- Legacy Problem type (kept for backward compat) -------------------------
export type Problem = {
  id: string;
  title: string;
  description: string;
  category: Category;
  subcategory?: string | null;
  state?: string;         // e.g. "Jharkhand" — optional for legacy seed compat; defaults to "Jharkhand"
  district: string;
  village_ward?: string | null;
  location_lat?: number | null;
  location_lng?: number | null;
  submitter_name: string | null;
  submitter_id?: string | null;
  submitter_type?: "citizen" | "panchayat" | "ulb" | "community_org" | "government" | null;
  status: ChallengeStatus;
  priority?: Priority | null;
  priority_score?: number | null;
  assigned_university_id?: string | null;
  assigned_to?: string | null;
  photo_url?: string | null;
  video_url?: string | null;
  document_url?: string | null;
  created_at: string;
  updated_at?: string | null;
};
