import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Problem, Category, ChallengeStatus, type Priority } from "./domain";
import type {
  Project,
  ProjectMember,
  Milestone,
  IndustryParticipation,
  Notification,
  Feedback,
  ImpactMetric,
  AIAnalysis,
  ProjectProposal,
  ProposalStatus,
  PatentRecord,
  StartupIncubation,
  ProjectDiscussion,
  Solution,
} from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;
if (url && anon) {
  client = createClient(url, anon);
}

const TABLE = "problems";

function newId() {
  return "p-" + Math.random().toString(36).slice(2, 10);
}

// 42 realistic, coherent community challenges across all 11 domains and 24 districts of Jharkhand
const seed: Problem[] = [
  // HERO DEMO CHALLENGE
  {
    id: "seed-hero-1",
    title: "Village residents in Dumka are facing drinking water quality problems",
    description: "Borewell and handpump water in Jama block, Dumka contains high iron, fluoride turbidity and seasonal microbial contamination. Over 1,200 villagers are suffering from gastrointestinal illnesses and skin irritation. Women travel 3 km daily to fetch potable water from a neighboring block.",
    category: "Water Resources",
    subcategory: "Drinking Water",
    state: "Jharkhand",
    district: "Dumka",
    village_ward: "Jama Block, Ward 4",
    submitter_name: "Santosh Soren",
    status: "assigned",
    priority: "High",
    priority_score: 88,
    assigned_to: "BIT Sindri",
    photo_url: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=800&auto=format&fit=crop&q=60",
    created_at: new Date(Date.now() - 5 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 2 * 864e5).toISOString(),
  },
  {
    id: "seed-1",
    title: "No safe drinking water in Namkum village",
    description: "The only community borewell has run dry and families walk 2 km for water. The nearby pond water is heavily contaminated with silt and runoff.",
    category: "Water Resources",
    subcategory: "Drinking Water",
    district: "Ranchi",
    village_ward: "Namkum Gram Panchayat",
    submitter_name: "Sunita Devi",
    status: "assigned",
    priority: "High",
    priority_score: 78,
    assigned_to: "Birsa Agricultural University",
    photo_url: null,
    created_at: new Date(Date.now() - 6 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 2 * 864e5).toISOString(),
  },
  {
    id: "seed-2",
    title: "Government school has no functional toilets",
    description: "The primary school sanitation facilities are broken, causing dozens of girl students to drop out or miss classes regularly.",
    category: "Sanitation",
    subcategory: "Open Defecation",
    district: "Hazaribagh",
    village_ward: "Barhi Ward 7",
    submitter_name: "Village Education Committee",
    status: "under_review",
    priority: "High",
    priority_score: 72,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 3 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-3",
    title: "Frequent power cuts damaging farm irrigation pumps",
    description: "Unscheduled load shedding of 8+ hours a day prevents farmers from running submersible irrigation pumps for paddy and vegetables.",
    category: "Energy",
    subcategory: "Power Outages",
    district: "Palamu",
    village_ward: "Daltonganj Rural",
    submitter_name: "Ramesh Oraon",
    status: "submitted",
    priority: "Medium",
    priority_score: 55,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 1 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-4",
    title: "No doctor at primary health centre in Gumla",
    description: "The village health post has had no permanent doctor or essential medicine for three months; the nearest sub-divisional hospital is 40 km away.",
    category: "Healthcare",
    subcategory: "Primary Healthcare",
    district: "Gumla",
    village_ward: "Raidih Block",
    submitter_name: "Anil Munda",
    status: "in_progress",
    priority: "Critical",
    priority_score: 92,
    assigned_to: "RIMS Ranchi",
    photo_url: null,
    created_at: new Date(Date.now() - 15 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 1 * 864e5).toISOString(),
  },
  {
    id: "seed-5",
    title: "MGNREGA wages delayed by 4 months",
    description: "Panchayat workers have not received wages for completed check-dam and trenching earthwork.",
    category: "Rural Livelihoods",
    subcategory: "MGNREGA",
    district: "Latehar",
    village_ward: "Mahuadanr",
    submitter_name: "Labour Collective",
    status: "validated",
    priority: "High",
    priority_score: 76,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 10 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-6",
    title: "Crop disease destroying tomato harvest",
    description: "Early blight fungal infection is wiping out tomato crops across 15 villages; farmers need quick diagnosis and eco-friendly bio-fungicides.",
    category: "Agriculture",
    subcategory: "Crop Disease",
    district: "Ranchi",
    village_ward: "Ormanjhi",
    submitter_name: "Mahato Farmers Group",
    status: "completed",
    priority: "High",
    priority_score: 70,
    assigned_to: "Birsa Agricultural University",
    photo_url: null,
    created_at: new Date(Date.now() - 45 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 5 * 864e5).toISOString(),
  },
  {
    id: "seed-7",
    title: "Illegal industrial dumping polluting Damodar tributary",
    description: "Industrial coal ash and effluent are being dumped into the river, severely deteriorating aquatic life and downstream village irrigation.",
    category: "Environment",
    subcategory: "Water Pollution",
    district: "Bokaro",
    village_ward: "Chas Rural",
    submitter_name: "Green Bokaro Collective",
    status: "deployed",
    priority: "Critical",
    priority_score: 88,
    assigned_to: "IIT (ISM) Dhanbad",
    photo_url: null,
    created_at: new Date(Date.now() - 90 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 10 * 864e5).toISOString(),
  },
  {
    id: "seed-8",
    title: "Open drains flooding the market road in Katras",
    description: "Uncovered choked storm drains overflow during monsoon rain, flooding wholesale market shops and public roads.",
    category: "Urban Development",
    subcategory: "Drainage",
    district: "Dhanbad",
    village_ward: "Katras Bazar",
    submitter_name: "Market Traders Union",
    status: "assigned",
    priority: "Medium",
    priority_score: 60,
    assigned_to: "IIT (ISM) Dhanbad",
    photo_url: null,
    created_at: new Date(Date.now() - 20 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-9",
    title: "No ramp access at the block development office",
    description: "Wheelchair users and elder citizens cannot access second floor pension and social welfare certificate counters.",
    category: "Accessibility",
    subcategory: "Physical Accessibility",
    district: "Ranchi",
    village_ward: "Ratu Block",
    submitter_name: "Divyang Welfare Group",
    status: "submitted",
    priority: "Low",
    priority_score: 35,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 2 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-10",
    title: "Ration card biometric mismatch for forest dwellers",
    description: "Fingerprint scanner failures leave 80 elderly Paharriya families without monthly grain rations for three consecutive cycles.",
    category: "Public Administration",
    subcategory: "Documentation",
    district: "Giridih",
    village_ward: "Tisri Block",
    submitter_name: "Panchayat Samiti",
    status: "assigned",
    priority: "Medium",
    priority_score: 58,
    assigned_to: "Ranchi University",
    photo_url: null,
    created_at: new Date(Date.now() - 18 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-11",
    title: "Solar micro-grid batteries degraded in remote tola",
    description: "Off-grid tribal hamlet has had zero lighting since lithium battery units failed following thunder surge.",
    category: "Energy",
    subcategory: "Renewable Energy",
    district: "Khunti",
    village_ward: "Torpa Block",
    submitter_name: "Karan Singh Munda",
    status: "validated",
    priority: "High",
    priority_score: 74,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 4 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-12",
    title: "Severe soil acidity dropping upland paddy yield",
    description: "Soil pH has declined below 4.8 across red soil tracts; farmers require low-cost agricultural lime distribution and soil test kits.",
    category: "Agriculture",
    subcategory: "Soil Health",
    district: "Simdega",
    village_ward: "Kolebira Block",
    submitter_name: "Kisan Morcha",
    status: "assigned",
    priority: "Medium",
    priority_score: 62,
    assigned_to: "Birsa Agricultural University",
    photo_url: null,
    created_at: new Date(Date.now() - 12 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-13",
    title: "Lack of cold chain storage for lac cultivators",
    description: "Tribal forest gatherers sell raw rangeeni lac at distress prices due to lack of local processing and moisture-controlled warehousing.",
    category: "Rural Livelihoods",
    subcategory: "SHG Support",
    district: "West Singhbhum",
    village_ward: "Chaibasa Forest Division",
    submitter_name: "Van Dhan Vikas Kendra",
    status: "in_progress",
    priority: "High",
    priority_score: 79,
    assigned_to: "Central University of Jharkhand",
    photo_url: null,
    created_at: new Date(Date.now() - 25 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 3 * 864e5).toISOString(),
  },
  {
    id: "seed-14",
    title: "Stray plastic waste choking Subarnarekha canal intake",
    description: "Urban municipal plastic debris accumulates at the irrigation barrage sluice gates, lowering downstream water supply.",
    category: "Environment",
    subcategory: "Plastic Waste",
    district: "East Singhbhum (Jamshedpur)",
    village_ward: "Mango Ward 12",
    submitter_name: "Clean Rivers Coalition",
    status: "validated",
    priority: "Medium",
    priority_score: 64,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 8 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-15",
    title: "Lack of sign language training in special schools",
    description: "Hearing-impaired students in Deoghar have no certified ISL teachers, impeding high school certificate examinations.",
    category: "Accessibility",
    subcategory: "Assistive Technology",
    district: "Deoghar",
    village_ward: "Mohanpur",
    submitter_name: "Prerna Deaf Care Centre",
    status: "under_review",
    priority: "High",
    priority_score: 75,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 5 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-16",
    title: "Frequent elephant herd incursions destroying standing maize",
    description: "Wild elephant herds from Dalma sanctuary enter fringe agricultural fields nightly; farmers need early bio-acoustic warning tripwires.",
    category: "Agriculture",
    subcategory: "Pest Control",
    district: "Saraikela Kharsawan",
    village_ward: "Chandil Border",
    submitter_name: "Gram Raksha Dal",
    status: "in_progress",
    priority: "Critical",
    priority_score: 90,
    assigned_to: "BIT Mesra, Ranchi",
    photo_url: null,
    created_at: new Date(Date.now() - 14 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 2 * 864e5).toISOString(),
  },
  {
    id: "seed-17",
    title: "High arsenic levels in Ganga riparian tubewells",
    description: "Tubewells in 6 riverbank villages show arsenic concentrations exceeding 0.05 mg/L; chronic keratosis detected among youth.",
    category: "Water Resources",
    subcategory: "Water Contamination",
    district: "Sahibganj",
    village_ward: "Rajmahal Block",
    submitter_name: "Ganga Bachao Samiti",
    status: "validated",
    priority: "Critical",
    priority_score: 94,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 11 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-18",
    title: "Unsafe rural bamboo bridge collapse during floods",
    description: "The footbridge connecting 4 villages to the nearest high school washed away in July, forcing 300 students to cross on wooden rafts.",
    category: "Urban Development",
    subcategory: "Road Infrastructure",
    district: "Garhwa",
    village_ward: "Bhandaria Block",
    submitter_name: "Panchayat Mukhiya",
    status: "assigned",
    priority: "Critical",
    priority_score: 89,
    assigned_to: "BIT Sindri",
    photo_url: null,
    created_at: new Date(Date.now() - 22 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-19",
    title: "High maternal anaemia prevalence in primitive tribal groups",
    description: "Over 68% of expectant mothers in Birhor settlements suffer from severe nutritional anaemia; supplemental iron supply is irregular.",
    category: "Healthcare",
    subcategory: "Maternal Health",
    district: "Chatra",
    village_ward: "Kanhachatti Block",
    submitter_name: "ASHA Union Chatra",
    status: "in_progress",
    priority: "Critical",
    priority_score: 93,
    assigned_to: "RIMS Ranchi",
    photo_url: null,
    created_at: new Date(Date.now() - 19 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 4 * 864e5).toISOString(),
  },
  {
    id: "seed-20",
    title: "Digital literacy gap for rural women SHG treasurers",
    description: "Self-help group bank account bookkeeping is delayed months because members cannot operate digital mobile banking apps.",
    category: "Education",
    subcategory: "Digital Literacy",
    district: "Koderma",
    village_ward: "Markacho Block",
    submitter_name: "Mahila Vikas Manch",
    status: "completed",
    priority: "Medium",
    priority_score: 58,
    assigned_to: "Central University of Jharkhand",
    photo_url: null,
    created_at: new Date(Date.now() - 50 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 8 * 864e5).toISOString(),
  },
  {
    id: "seed-21",
    title: "Uncontrolled dust emissions from mica grinding units",
    description: "Fine silica dust from unorganized mica pulverizers blankets nearby residential hamlets, causing chronic bronchitis.",
    category: "Environment",
    subcategory: "Air Pollution",
    district: "Giridih",
    village_ward: "Gawan Block",
    submitter_name: "Citizens Clean Air Forum",
    status: "submitted",
    priority: "High",
    priority_score: 81,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 3 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-22",
    title: "No mathematics and physics teachers in +2 high school",
    description: "Science stream students in government inter-college have had zero senior teachers for 18 months; dropouts surging.",
    category: "Education",
    subcategory: "Teacher Shortage",
    district: "Godda",
    village_ward: "Mahagama Ward 3",
    submitter_name: "Parents Welfare Council",
    status: "assigned",
    priority: "High",
    priority_score: 77,
    assigned_to: "Ranchi University",
    photo_url: null,
    created_at: new Date(Date.now() - 16 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-23",
    title: "Frequent cyber fraud targeting rural pensioners",
    description: "Phishing rings mimic DBT subsidy helpline calls, siphoning old-age pensions from Jan Dhan bank accounts.",
    category: "Public Administration",
    subcategory: "Digital Services",
    district: "Jamtara",
    village_ward: "Karmatanr Block",
    submitter_name: "Senior Citizens Cell",
    status: "in_progress",
    priority: "High",
    priority_score: 84,
    assigned_to: "BIT Mesra, Ranchi",
    photo_url: null,
    created_at: new Date(Date.now() - 28 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 5 * 864e5).toISOString(),
  },
  {
    id: "seed-24",
    title: "Absence of cold chain vaccine storage in hilltop villages",
    description: "Rotavirus and measles vaccines spoil during summer transport to remote Paharia settlements due to zero ice-pack freezers.",
    category: "Healthcare",
    subcategory: "Primary Healthcare",
    district: "Pakur",
    village_ward: "Littipara Block",
    submitter_name: "Community Health Corps",
    status: "assigned",
    priority: "Critical",
    priority_score: 91,
    assigned_to: "RIMS Ranchi",
    photo_url: null,
    created_at: new Date(Date.now() - 7 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-25",
    title: "Depleting groundwater levels due to stone crusher borewells",
    description: "Deep unpermitted borewells operated by commercial stone quarries have dried up drinking water wells across 8 villages.",
    category: "Water Resources",
    subcategory: "Groundwater Depletion",
    district: "Ramgarh",
    village_ward: "Patratu Rural",
    submitter_name: "Jal Adhikar Manch",
    status: "validated",
    priority: "High",
    priority_score: 80,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 9 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-26",
    title: "Lack of silk worm cocoon processing facilities",
    description: "Tasar cocoon producers sell cocoons raw to outside middlemen at one-third commercial value for lack of local reeling machines.",
    category: "Rural Livelihoods",
    subcategory: "Skills Training",
    district: "West Singhbhum",
    village_ward: "Khuntpani Block",
    submitter_name: "Tasar Weavers Co-op",
    status: "assigned",
    priority: "Medium",
    priority_score: 66,
    assigned_to: "Central University of Jharkhand",
    photo_url: null,
    created_at: new Date(Date.now() - 17 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-27",
    title: "Choked sewage lines causing urban backflow in Chas",
    description: "Domestic blackwater overflows onto roads near the bus terminal, creating severe disease hazard for vendors and travelers.",
    category: "Sanitation",
    subcategory: "Sewage Treatment",
    district: "Bokaro",
    village_ward: "Chas Municipality Ward 19",
    submitter_name: "Civic Action Group",
    status: "submitted",
    priority: "Medium",
    priority_score: 61,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 2 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-28",
    title: "Solar powered water pumps idling due to broken inverters",
    description: "Nine PM-KUSUM solar irrigation pumps installed in 2023 have been non-functional due to lightning damage to inverter modules.",
    category: "Energy",
    subcategory: "Renewable Energy",
    district: "Lohardaga",
    village_ward: "Kisko Block",
    submitter_name: "Kisan Vikas Samiti",
    status: "assigned",
    priority: "High",
    priority_score: 75,
    assigned_to: "BIT Sindri",
    photo_url: null,
    created_at: new Date(Date.now() - 13 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-29",
    title: "No tactile pavers on Ranchi railway station approach",
    description: "Visually impaired commuters face severe collision hazard navigating bus stops and ticket entrances on Station Road.",
    category: "Accessibility",
    subcategory: "Transport Accessibility",
    district: "Ranchi",
    village_ward: "Station Road, Ward 15",
    submitter_name: "Blind Citizens Forum",
    status: "validated",
    priority: "Medium",
    priority_score: 59,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 6 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-30",
    title: "Disposal of untreated hospital waste into open municipal bins",
    description: "Private clinics discard infectious syringes, blood bags, and bandages into public garbage skips near residential school.",
    category: "Sanitation",
    subcategory: "Solid Waste",
    district: "Dhanbad",
    village_ward: "Saraidhela Ward 22",
    submitter_name: "Resident Action Council",
    status: "assigned",
    priority: "Critical",
    priority_score: 87,
    assigned_to: "IIT (ISM) Dhanbad",
    photo_url: null,
    created_at: new Date(Date.now() - 8 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-31",
    title: "High infant mortality due to seasonal water-borne dysentery",
    description: "Annual post-monsoon cholera and dysentery surge in flood-prone riverbank hamlets without point-of-use chlorine chlorinators.",
    category: "Healthcare",
    subcategory: "Disease Outbreak",
    district: "Sahibganj",
    village_ward: "Udhwa Bird Sanctuary Fringe",
    submitter_name: "Rural Health Mission Vol.",
    status: "assigned",
    priority: "Critical",
    priority_score: 95,
    assigned_to: "RIMS Ranchi",
    photo_url: null,
    created_at: new Date(Date.now() - 10 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-32",
    title: "Absence of veterinary support for milch cattle breeding",
    description: "Indigenous breed cross-breeding suffers high calf mortality due to absence of liquid nitrogen artificial insemination canisters.",
    category: "Agriculture",
    subcategory: "Market Linkage",
    district: "Deoghar",
    village_ward: "Sarwan Block",
    submitter_name: "Dairy Farmers SHG",
    status: "under_review",
    priority: "Medium",
    priority_score: 54,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 4 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-33",
    title: "Forest fires destroying Sal timber and Mahua blossoms",
    description: "Uncontrolled ground fires sparked by dry litter burning during Mahua collection burn thousands of hectares of reserve forest.",
    category: "Environment",
    subcategory: "Deforestation",
    district: "Latehar",
    village_ward: "Garu Forest Division",
    submitter_name: "Forest Protection Committee",
    status: "validated",
    priority: "High",
    priority_score: 82,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 12 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-34",
    title: "Unregulated e-rickshaw congestion choking main market",
    description: "Absence of designated charging stations and route licenses creates severe gridlock and pedestrian collisions.",
    category: "Urban Development",
    subcategory: "Traffic Management",
    district: "Hazaribagh",
    village_ward: "Main Road Market",
    submitter_name: "Chamber of Commerce",
    status: "submitted",
    priority: "Low",
    priority_score: 42,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 1 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-35",
    title: "Government scholarships delayed due to portal mapping error",
    description: "Post-matric tribal scholarships for 450 college students stalled because college institute codes are unverified in state portal.",
    category: "Public Administration",
    subcategory: "Digital Services",
    district: "Ranchi",
    village_ward: "Morabadi Higher Edu",
    submitter_name: "Adivasi Chhatra Morcha",
    status: "validated",
    priority: "High",
    priority_score: 73,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 15 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-36",
    title: "Lack of cold storage for perishable green vegetables",
    description: "Cauliflower and pea growers sell 40% of harvest at distress rates of ₹3/kg during peak season for lack of solar micro-cold rooms.",
    category: "Agriculture",
    subcategory: "Market Linkage",
    district: "Palamu",
    village_ward: "Patan Block",
    submitter_name: "Vegetable Producers Union",
    status: "in_progress",
    priority: "High",
    priority_score: 78,
    assigned_to: "Birsa Agricultural University",
    photo_url: null,
    created_at: new Date(Date.now() - 21 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 3 * 864e5).toISOString(),
  },
  {
    id: "seed-37",
    title: "Low voltage preventing domestic water motor operation",
    description: "Village transformer operates at 130V instead of 230V, tripping motors and damaging fans during evening hours.",
    category: "Energy",
    subcategory: "Voltage Fluctuation",
    district: "Chatra",
    village_ward: "Pratappur Block",
    submitter_name: "Consumer Welfare Forum",
    status: "submitted",
    priority: "Medium",
    priority_score: 56,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 2 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-38",
    title: "Vocational IT center computers non-functional",
    description: "Skill development computer lab computers have broken motherboards, stopping youth certified employment training.",
    category: "Education",
    subcategory: "Vocational Training",
    district: "Godda",
    village_ward: "Poreyahat Block",
    submitter_name: "Yuva Chetna Manch",
    status: "under_review",
    priority: "Medium",
    priority_score: 52,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 5 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-39",
    title: "Absence of wheelchairs in district civil hospital OPD",
    description: "Injured patients and paraplegic individuals must be carried physically by relatives across hospital corridors.",
    category: "Accessibility",
    subcategory: "Physical Accessibility",
    district: "Dumka",
    village_ward: "Dumka Sadar Hospital",
    submitter_name: "Health Rights Forum",
    status: "validated",
    priority: "High",
    priority_score: 79,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 7 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-40",
    title: "Drainage runoff causing soil erosion along rural roads",
    description: "Unchannelled culvert runoff has cut 4-meter gullies into adjacent agricultural land, endangering rural road foundation.",
    category: "Urban Development",
    subcategory: "Road Infrastructure",
    district: "Simdega",
    village_ward: "Bano Block",
    submitter_name: "Gram Panchayat Bano",
    status: "submitted",
    priority: "Medium",
    priority_score: 60,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 3 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-41",
    title: "Groundwater salinity rendering borewell water undrinkable",
    description: "Borewells in mineral extraction zones show excessive total dissolved solids (TDS > 1800 ppm), causing kidney stones.",
    category: "Water Resources",
    subcategory: "Water Contamination",
    district: "Dhanbad",
    village_ward: "Nirsa Block",
    submitter_name: "Coal Belt Citizen Watch",
    status: "validated",
    priority: "High",
    priority_score: 83,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 9 * 864e5).toISOString(),
    updated_at: null,
  },
];

// ---- Multi-state demo seed data (clearly labeled as DEMO/SEED) ---------------
// NOTE: These are representative demo challenges added to illustrate the India-wide
// architecture. They are NOT verified real incidents.
const multiStateSeed: Problem[] = [
  // --- Punjab demo challenges ---
  {
    id: "seed-pb-1",
    title: "Stubble burning causing severe air quality deterioration in Amritsar",
    description: "[DEMO] Post-harvest paddy stubble burning across Amritsar district leads to AQI exceeding 400 in winter months, causing respiratory illness among 3 lakh residents.",
    category: "Environment",
    subcategory: "Air Pollution",
    state: "Punjab",
    district: "Amritsar",
    village_ward: "Rural Blocks, Amritsar",
    submitter_name: "Punjab Kisan Union (Demo)",
    status: "under_review",
    priority: "High",
    priority_score: 82,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 12 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-pb-2",
    title: "Groundwater depletion threatening wheat farming in Ludhiana",
    description: "[DEMO] Excessive tube-well irrigation has dropped the water table by 0.8m annually in Ludhiana. Farmers need affordable drip-irrigation and crop rotation advisory.",
    category: "Water Resources",
    subcategory: "Groundwater Depletion",
    state: "Punjab",
    district: "Ludhiana",
    village_ward: "Sahnewal Block",
    submitter_name: "Progressive Farmers Cooperative (Demo)",
    status: "assigned",
    priority: "Critical",
    priority_score: 90,
    assigned_to: "Punjab Agricultural University",
    photo_url: null,
    created_at: new Date(Date.now() - 20 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 5 * 864e5).toISOString(),
  },
  {
    id: "seed-pb-3",
    title: "Drug abuse rehabilitation support lacking in Bathinda district",
    description: "[DEMO] Youth drug addiction rate is high in several blocks of Bathinda. There are only 2 rehabilitation centers for a population of 15 lakh with no community support groups.",
    category: "Healthcare",
    subcategory: "Mental Health",
    state: "Punjab",
    district: "Bathinda",
    village_ward: "Talwandi Sabo Block",
    submitter_name: "Nasha Mukti Morcha (Demo)",
    status: "submitted",
    priority: "High",
    priority_score: 78,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 4 * 864e5).toISOString(),
    updated_at: null,
  },
  // --- Maharashtra demo challenges ---
  {
    id: "seed-mh-1",
    title: "Farmer suicides linked to crop failure and debt in Yavatmal",
    description: "[DEMO] Repeated cotton crop failures due to irregular rainfall and rising input costs have led to severe farmer distress in Yavatmal. Market linkage and crop insurance awareness are urgently needed.",
    category: "Agriculture",
    subcategory: "Market Linkage",
    state: "Maharashtra",
    district: "Yavatmal",
    village_ward: "Wani Taluka",
    submitter_name: "Shetkari Sanghatana (Demo)",
    status: "assigned",
    priority: "Critical",
    priority_score: 93,
    assigned_to: "University of Pune (SPPU)",
    photo_url: null,
    created_at: new Date(Date.now() - 30 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 8 * 864e5).toISOString(),
  },
  {
    id: "seed-mh-2",
    title: "Waterlogging and flooding in informal settlements of Thane",
    description: "[DEMO] Poor drainage infrastructure in low-lying areas of Thane Municipal Corporation causes annual flooding affecting 50,000 families during monsoon season.",
    category: "Urban Development",
    subcategory: "Drainage",
    state: "Maharashtra",
    district: "Thane",
    village_ward: "Mumbra Ward 7",
    submitter_name: "Navi Mumbai Residents Forum (Demo)",
    status: "in_progress",
    priority: "High",
    priority_score: 80,
    assigned_to: "IIT Bombay",
    photo_url: null,
    created_at: new Date(Date.now() - 45 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 10 * 864e5).toISOString(),
  },
  {
    id: "seed-mh-3",
    title: "Shortage of rural health workers in Osmanabad district",
    description: "[DEMO] Osmanabad has a critical shortage of ASHA workers and ANMs, with 40% of PHCs operating below minimum staffing. Maternal mortality indicators remain above state average.",
    category: "Healthcare",
    subcategory: "Maternal Health",
    state: "Maharashtra",
    district: "Osmanabad",
    village_ward: "Omerga Block",
    submitter_name: "Jan Arogya Abhiyan (Demo)",
    status: "submitted",
    priority: "High",
    priority_score: 77,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 7 * 864e5).toISOString(),
    updated_at: null,
  },
  // --- Karnataka demo challenges ---
  {
    id: "seed-ka-1",
    title: "Fluoride contamination in drinking water in Raichur district",
    description: "[DEMO] Groundwater in 87 habitations across Raichur shows fluoride levels exceeding 3 mg/L (safe limit: 1.5 mg/L), causing endemic fluorosis in children and adults.",
    category: "Water Resources",
    subcategory: "Water Contamination",
    state: "Karnataka",
    district: "Raichur",
    village_ward: "Sindhanur Taluk",
    submitter_name: "Karnataka Rural Health Action Group (Demo)",
    status: "validated",
    priority: "Critical",
    priority_score: 91,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 15 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "seed-ka-2",
    title: "Deforestation and human-wildlife conflict in Shivamogga forest zone",
    description: "[DEMO] Encroachment on forest fringes in Shivamogga has displaced wildlife corridors. Over 200 crop-raiding elephant incidents reported annually with inadequate early warning systems.",
    category: "Environment",
    subcategory: "Wildlife Conflict",
    state: "Karnataka",
    district: "Shivamogga",
    village_ward: "Thirthahalli Range",
    submitter_name: "Forest Rights Action Committee (Demo)",
    status: "in_progress",
    priority: "High",
    priority_score: 75,
    assigned_to: "IISc Bengaluru",
    photo_url: null,
    created_at: new Date(Date.now() - 25 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 3 * 864e5).toISOString(),
  },
  {
    id: "seed-ka-3",
    title: "Irrigation canal siltation reducing water supply to sugarcane farms",
    description: "[DEMO] The Tungabhadra Canal system serving Vijayapura farmers has 40% reduced capacity due to decades of siltation. Tail-end farmers receive no water for 3 months of the kharif season.",
    category: "Agriculture",
    subcategory: "Irrigation",
    state: "Karnataka",
    district: "Vijayapura",
    village_ward: "Indi Taluk",
    submitter_name: "Tungabhadra Water Users Association (Demo)",
    status: "assigned",
    priority: "High",
    priority_score: 79,
    assigned_to: "NIT Karnataka (NITK Surathkal)",
    photo_url: null,
    created_at: new Date(Date.now() - 18 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 4 * 864e5).toISOString(),
  },
  // --- Rajasthan demo challenges ---
  {
    id: "seed-rj-1",
    title: "Drinking water crisis in Barmer due to fluoride and salinity",
    description: "[DEMO] Desert district Barmer has no reliable surface water. Tanker-fed villages pay ₹120/kiloliter. Groundwater is fluoride-rich (>4 mg/L) causing severe dental and skeletal fluorosis.",
    category: "Water Resources",
    subcategory: "Drinking Water",
    state: "Rajasthan",
    district: "Barmer",
    village_ward: "Sheo Block",
    submitter_name: "Rajasthan Jal Sanrakshan Samiti (Demo)",
    status: "assigned",
    priority: "Critical",
    priority_score: 95,
    assigned_to: "IIT Jodhpur",
    photo_url: null,
    created_at: new Date(Date.now() - 35 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 7 * 864e5).toISOString(),
  },
  {
    id: "seed-rj-2",
    title: "Solar pump adoption barriers for small farmers in Nagaur",
    description: "[DEMO] Despite PMKUSUM subsidy, fewer than 12% eligible farmers in Nagaur have adopted solar pumps. Poor awareness, complex documentation, and lack of after-sales service are key barriers.",
    category: "Energy",
    subcategory: "Renewable Energy",
    state: "Rajasthan",
    district: "Nagaur",
    village_ward: "Didwana Block",
    submitter_name: "Rajasthan Farmer Producer Org (Demo)",
    status: "in_progress",
    priority: "Medium",
    priority_score: 65,
    assigned_to: "Rajasthan Technical University",
    photo_url: null,
    created_at: new Date(Date.now() - 22 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 5 * 864e5).toISOString(),
  },
  {
    id: "seed-rj-3",
    title: "Girl child dropout rate due to distance from schools in Jaisalmer",
    description: "[DEMO] Remote habitations in Jaisalmer block average 8 km from nearest secondary school. Girls stop schooling after class 5 due to lack of safe transport and hostel facilities.",
    category: "Education",
    subcategory: "Secondary Education",
    state: "Rajasthan",
    district: "Jaisalmer",
    village_ward: "Sam Block",
    submitter_name: "Rajasthan Balika Shiksha Abhiyan (Demo)",
    status: "submitted",
    priority: "High",
    priority_score: 76,
    assigned_to: null,
    photo_url: null,
    created_at: new Date(Date.now() - 6 * 864e5).toISOString(),
    updated_at: null,
  },
];

// Inject default state for all Jharkhand seed problems that don't have one
const jharkhandSeedWithState: Problem[] = seed.map((p) =>
  p.state ? p : { ...p, state: "Jharkhand" }
);

let memory: Problem[] = [...jharkhandSeedWithState, ...multiStateSeed];

// 5 Active / Completed Projects with coherent linkages
const seedProjects: Project[] = [
  // HERO DEMO PROJECT
  {
    id: "proj-hero-1",
    challenge_id: "seed-hero-1",
    title: "Smart Water Quality Monitoring & Community Filtration System",
    description: "Multidisciplinary initiative by BIT Sindri engineering faculty and student innovators to build an IoT-driven solar-powered low-cost community water filtration kiosk and turbidity/fluoride sensor network in Jama Block, Dumka.",
    university_name: "BIT Sindri",
    university_id: null,
    industry_partner: "Jindal Water Infra Ltd",
    status: "testing",
    progress: 75,
    trl_level: 6,
    incubation_center: "BIT Sindri Technology Business Incubator",
    start_date: new Date(Date.now() - 25 * 864e5).toISOString(),
    target_date: new Date(Date.now() + 45 * 864e5).toISOString(),
    created_at: new Date(Date.now() - 25 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 1 * 864e5).toISOString(),
  },
  {
    id: "proj-1",
    challenge_id: "seed-4",
    title: "Mobile Health Clinic for Remote Villages",
    description: "Deploying a tele-medicine enabled mobile clinic unit staffed by RIMS doctors and student interns to provide weekly primary diagnostics in Gumla.",
    university_name: "RIMS Ranchi",
    university_id: null,
    industry_partner: "HealthTech India Pvt Ltd",
    status: "pilot",
    progress: 70,
    trl_level: 5,
    incubation_center: "RIMS Health Innovation Hub",
    start_date: new Date(Date.now() - 30 * 864e5).toISOString(),
    target_date: new Date(Date.now() + 30 * 864e5).toISOString(),
    created_at: new Date(Date.now() - 30 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 2 * 864e5).toISOString(),
  },
  {
    id: "proj-2",
    challenge_id: "seed-6",
    title: "Integrated Crop Disease Management & Bio-Fungicide System",
    description: "AI-based smartphone disease detection app plus farmer training sessions on biological pest management.",
    university_name: "Birsa Agricultural University",
    university_id: null,
    industry_partner: "AgriSolutions Ltd",
    status: "completed",
    progress: 100,
    trl_level: 8,
    incubation_center: "Birsa Agri-Business Incubation Centre (BABIC)",
    start_date: new Date(Date.now() - 60 * 864e5).toISOString(),
    target_date: new Date(Date.now() - 5 * 864e5).toISOString(),
    created_at: new Date(Date.now() - 60 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 5 * 864e5).toISOString(),
  },
  {
    id: "proj-3",
    challenge_id: "seed-7",
    title: "Damodar River Pollution Monitoring & Bioremediation Pilot",
    description: "IoT sensor telemetry along industrial discharge points paired with bio-remediation microbial mats.",
    university_name: "IIT (ISM) Dhanbad",
    university_id: null,
    industry_partner: "EnviroSense Technologies",
    status: "deployment",
    progress: 90,
    trl_level: 7,
    incubation_center: "IIT ISM Centre for Innovation, Incubation & Entrepreneurship",
    start_date: new Date(Date.now() - 70 * 864e5).toISOString(),
    target_date: new Date(Date.now() + 10 * 864e5).toISOString(),
    created_at: new Date(Date.now() - 70 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 1 * 864e5).toISOString(),
  },
  {
    id: "proj-4",
    challenge_id: "seed-1",
    title: "Community Borewell Restoration & IoT Water Quality Monitor",
    description: "Restoring and deepening boreholes in Namkum village plus real-time continuous water level and turbidity sensors.",
    university_name: "Birsa Agricultural University",
    university_id: null,
    industry_partner: "Tata Steel CSR",
    status: "research",
    progress: 35,
    trl_level: 3,
    incubation_center: "Birsa Agricultural University Rural Lab",
    start_date: new Date(Date.now() - 10 * 864e5).toISOString(),
    target_date: new Date(Date.now() + 60 * 864e5).toISOString(),
    created_at: new Date(Date.now() - 10 * 864e5).toISOString(),
    updated_at: null,
  },
  {
    id: "proj-5",
    challenge_id: "seed-16",
    title: "Elephant Intrusion Bio-Acoustic Early Warning System",
    description: "Solar-powered infrasonic sensors and automated cellular sirens along forest corridor boundaries to warn farmers of wild herd movement.",
    university_name: "BIT Mesra, Ranchi",
    university_id: null,
    industry_partner: "Adani Foundation",
    status: "prototype",
    progress: 50,
    trl_level: 4,
    incubation_center: "BIT Mesra Technology Incubator",
    start_date: new Date(Date.now() - 15 * 864e5).toISOString(),
    target_date: new Date(Date.now() + 75 * 864e5).toISOString(),
    created_at: new Date(Date.now() - 15 * 864e5).toISOString(),
    updated_at: null,
  },
];

let memoryProjects: Project[] = [...seedProjects];

// Multidisciplinary Team Members
const seedMembers: ProjectMember[] = [
  // Hero Project Team (BIT Sindri multidisciplinary team)
  { project_id: "proj-hero-1", name: "Dr. R. K. Prasad", role: "faculty", department: "Environmental Engineering", organisation: "BIT Sindri" },
  { project_id: "proj-hero-1", name: "Prof. S. N. Mukherjee", role: "faculty", department: "Civil Engineering", organisation: "BIT Sindri" },
  { project_id: "proj-hero-1", name: "Alok Verma", role: "student", department: "Civil Engineering", organisation: "BIT Sindri" },
  { project_id: "proj-hero-1", name: "Sneha Kumari", role: "student", department: "Computer Science / IoT", organisation: "BIT Sindri" },
  { project_id: "proj-hero-1", name: "Deepak Soren", role: "student", department: "Mechanical Engineering", organisation: "BIT Sindri" },
  { project_id: "proj-hero-1", name: "Vikram Sharma", role: "industry", department: "R&D Water Systems", organisation: "Jindal Water Infra Ltd" },

  // Proj 1 Team (RIMS Ranchi)
  { project_id: "proj-1", name: "Dr. Meera Sinha", role: "faculty", department: "Community Medicine", organisation: "RIMS Ranchi" },
  { project_id: "proj-1", name: "Dr. Ajay Toppo", role: "faculty", department: "Pediatrics", organisation: "RIMS Ranchi" },
  { project_id: "proj-1", name: "Rahul Kumar", role: "student", department: "MBBS Final Year", organisation: "RIMS Ranchi" },
  { project_id: "proj-1", name: "Priya Oraon", role: "student", department: "Public Health", organisation: "RIMS Ranchi" },

  // Proj 2 Team (BAU Ranchi)
  { project_id: "proj-2", name: "Dr. B. C. Mahato", role: "faculty", department: "Agronomy", organisation: "Birsa Agricultural University" },
  { project_id: "proj-2", name: "Rakesh Ranjan", role: "student", department: "Agricultural Engineering", organisation: "Birsa Agricultural University" },

  // Proj 3 Team (IIT ISM Dhanbad)
  { project_id: "proj-3", name: "Prof. Amitava Das", role: "faculty", department: "Environmental Science", organisation: "IIT (ISM) Dhanbad" },
  { project_id: "proj-3", name: "Kavita Sanyal", role: "student", department: "Environmental Engineering", organisation: "IIT (ISM) Dhanbad" },
  { project_id: "proj-3", name: "Arjun Sen", role: "student", department: "Electronics & IoT", organisation: "IIT (ISM) Dhanbad" },
];

let memoryMembers: ProjectMember[] = [...seedMembers];

// Project Milestones
const seedMilestones: Milestone[] = [
  // Hero Project Milestones (Research ✓ -> Prototype ✓ -> Testing ● -> Pilot ○ -> Deployment ○)
  { id: "ms-hero-1", project_id: "proj-hero-1", title: "Groundwater testing & site survey", description: "Collect 25 water samples across Jama Block and analyze fluoride, iron, and microbial counts", deadline: new Date(Date.now() - 18 * 864e5).toISOString(), status: "completed", progress: 100, completed_at: new Date(Date.now() - 17 * 864e5).toISOString(), created_at: new Date(Date.now() - 25 * 864e5).toISOString(), deliverable_url: "https://drive.google.com/file/d/jama-water-baseline-survey-2024.pdf" },
  { id: "ms-hero-2", project_id: "proj-hero-1", title: "Filtration cartridge & IoT telemetry prototype", description: "Design activated alumina filtration bed integrated with solar-powered ESP32 sensors", deadline: new Date(Date.now() - 8 * 864e5).toISOString(), status: "completed", progress: 100, completed_at: new Date(Date.now() - 7 * 864e5).toISOString(), created_at: new Date(Date.now() - 25 * 864e5).toISOString(), deliverable_url: "https://github.com/jharkhand-innovations/iot-fluoride-kiosk/releases/tag/v1.0-prototype" },
  { id: "ms-hero-3", project_id: "proj-hero-1", title: "Field testing in Jama Village", description: "Continuous 30-day water telemetry testing with real-time turbidity and fluoride alerts", deadline: new Date(Date.now() + 10 * 864e5).toISOString(), status: "in_progress", progress: 75, completed_at: null, created_at: new Date(Date.now() - 25 * 864e5).toISOString(), deliverable_url: "https://dashboard.jharkhand-water.gov.in/telemetry/jama-live" },
  { id: "ms-hero-4", project_id: "proj-hero-1", title: "Community pilot kiosk launch", description: "Handover filtration kiosk to Village Water & Sanitation Committee", deadline: new Date(Date.now() + 28 * 864e5).toISOString(), status: "pending", progress: 0, completed_at: null, created_at: new Date(Date.now() - 25 * 864e5).toISOString() },
  { id: "ms-hero-5", project_id: "proj-hero-1", title: "Full block deployment", description: "Scale unit to 5 neighboring fluoride-affected Panchayats", deadline: new Date(Date.now() + 45 * 864e5).toISOString(), status: "pending", progress: 0, completed_at: null, created_at: new Date(Date.now() - 25 * 864e5).toISOString() },

  // Proj 1 Milestones
  { id: "ms-1", project_id: "proj-1", title: "Vehicle procurement & solar battery fitment", description: "Source and equip the mobile clinic vehicle with refrigeration", deadline: new Date(Date.now() - 20 * 864e5).toISOString(), status: "completed", progress: 100, completed_at: new Date(Date.now() - 18 * 864e5).toISOString(), created_at: new Date(Date.now() - 30 * 864e5).toISOString(), deliverable_url: "https://drive.google.com/file/d/mobile-clinic-van-specs.pdf" },
  { id: "ms-2", project_id: "proj-1", title: "Doctor rotation schedule & medicine supply", description: "Coordinate RIMS specialists for bi-weekly rural visits", deadline: new Date(Date.now() - 10 * 864e5).toISOString(), status: "completed", progress: 100, completed_at: new Date(Date.now() - 8 * 864e5).toISOString(), created_at: new Date(Date.now() - 30 * 864e5).toISOString(), deliverable_url: "https://rims-ranchi.ac.in/rural-health/schedules/raidih-2024.pdf" },
  { id: "ms-3", project_id: "proj-1", title: "Pilot mobile clinic visits in Raidih", description: "Conduct diagnostic camps in 5 tribal hamlets", deadline: new Date(Date.now() + 14 * 864e5).toISOString(), status: "in_progress", progress: 60, completed_at: null, created_at: new Date(Date.now() - 30 * 864e5).toISOString() },
  { id: "ms-4", project_id: "proj-1", title: "Impact & health outcome assessment", description: "Measure anemia and communicable disease reduction", deadline: new Date(Date.now() + 30 * 864e5).toISOString(), status: "pending", progress: 0, completed_at: null, created_at: new Date(Date.now() - 30 * 864e5).toISOString() },

  // Proj 2 Milestones (Completed)
  { id: "ms-5", project_id: "proj-2", title: "Disease identification model training", description: "Train and validate computer vision model on 12,000 local tomato blight images", deadline: new Date(Date.now() - 40 * 864e5).toISOString(), status: "completed", progress: 100, completed_at: new Date(Date.now() - 38 * 864e5).toISOString(), created_at: new Date(Date.now() - 60 * 864e5).toISOString(), deliverable_url: "https://github.com/jharkhand-innovations/tomato-blight-cv/blob/main/TRAINING_BENCHMARK.md" },
  { id: "ms-6", project_id: "proj-2", title: "Village workshops on biological control", description: "12 village-level farmer workshops conducted", deadline: new Date(Date.now() - 15 * 864e5).toISOString(), status: "completed", progress: 100, completed_at: new Date(Date.now() - 12 * 864e5).toISOString(), created_at: new Date(Date.now() - 60 * 864e5).toISOString(), deliverable_url: "https://bau-ranchi.ac.in/kisan-extension/tomato-workshop-signoffs.pdf" },
  { id: "ms-7", project_id: "proj-2", title: "App deployment to 500 farmers", description: "Smartphone app published and offline guides distributed", deadline: new Date(Date.now() - 5 * 864e5).toISOString(), status: "completed", progress: 100, completed_at: new Date(Date.now() - 5 * 864e5).toISOString(), created_at: new Date(Date.now() - 60 * 864e5).toISOString(), deliverable_url: "https://play.google.com/store/apps/details?id=in.gov.jharkhand.krishi.kisanrakshak" },

  // Proj 3 Milestones
  { id: "ms-8", project_id: "proj-3", title: "IoT sensor telemetry deployed", description: "20 monitoring stations active along 15 km Damodar stretch", deadline: new Date(Date.now() - 20 * 864e5).toISOString(), status: "completed", progress: 100, completed_at: new Date(Date.now() - 18 * 864e5).toISOString(), created_at: new Date(Date.now() - 70 * 864e5).toISOString(), deliverable_url: "https://dashboard.jharkhand-water.gov.in/telemetry/damodar-sensors" },
  { id: "ms-9", project_id: "proj-3", title: "Bioremediation microbial treatment", description: "Bacterial inoculation deployed at 3 industrial outfalls", deadline: new Date(Date.now() + 10 * 864e5).toISOString(), status: "in_progress", progress: 85, completed_at: null, created_at: new Date(Date.now() - 70 * 864e5).toISOString() },
];

let memoryMilestones: Milestone[] = [...seedMilestones];

// Project Proposals
const seedProposals: ProjectProposal[] = [
  {
    id: "prop-hero-1",
    project_id: "proj-hero-1",
    problem_statement: "Groundwater across Dumka's Jama block is heavily contaminated with naturally occurring fluoride (>2.5 mg/L) and industrial coal dust runoff, causing endemic fluorosis and water scarcity for 1,200 villagers.",
    proposed_solution: "A decentralized, solar-powered multi-stage activated alumina filtration kiosk equipped with low-cost IoT turbidity, pH, and conductivity sensors that transmit real-time telemetry to the district water engineering portal.",
    technology: "IoT ESP32 Microcontrollers, Cellular NB-IoT, Activated Alumina Adsorption, Solar PV with LiFePO4 battery storage, Mobile Dashboard.",
    implementation_plan: "Phase 1: Water mapping (Weeks 1-3). Phase 2: Pilot kiosk assembly & lab testing (Weeks 4-6). Phase 3: Field deployment and community training (Weeks 7-10). Phase 4: Long-term operations and district handover (Weeks 11-14).",
    expected_cost: 350000,
    expected_impact: "Provision of safe potable water adhering to BIS 10500 standards to 1,200+ villagers, reducing water-borne morbidity by 80% and freeing up 2 hours/day for rural women.",
    scalability: "Modular kiosk design can be replicated across 250 fluoride-affected Panchayats in Santhal Pargana.",
    sustainability: "Village Water Committee collects nominal ₹10/family/month maintenance corpus; solar-powered design eliminates grid electricity dependencies.",
    status: "approved",
    created_at: new Date(Date.now() - 24 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 20 * 864e5).toISOString(),
  },
  {
    id: "prop-1",
    project_id: "proj-1",
    problem_statement: "Complete lack of qualified medical doctors in rural Gumla PHC for 3 consecutive months.",
    proposed_solution: "Weekly tele-medicine mobile diagnostics van staffed by RIMS Ranchi doctors and interns.",
    technology: "Digital ECG, portable ultrasound, satellite telemetry, telemedicine consultation app.",
    implementation_plan: "Procurement, route scheduling, camp execution, patient EHR maintenance.",
    expected_cost: 500000,
    expected_impact: "Over 3,200 patients treated in remote blocks without traveling 40 km.",
    scalability: "Replicable across all 24 Jharkhand district peripheral zones.",
    sustainability: "Supported under State NHM innovation grant and corporate health CSR.",
    status: "approved",
    created_at: new Date(Date.now() - 29 * 864e5).toISOString(),
  },
];

const memoryProposals: ProjectProposal[] = [...seedProposals];

// Industry Partnerships
const seedIndustry: IndustryParticipation[] = [
  // Hero Industry Partner
  {
    id: "ind-hero-1",
    project_id: "proj-hero-1",
    industry_name: "Jindal Water Infra Ltd",
    stakeholder_type: "csr",
    contribution_types: ["funding", "hardware", "mentorship", "testing"],
    description: "Donating commercial adsorption media, solar inverter components, and providing senior environmental engineering mentorship.",
    funding_amount: 500000,
    status: "active",
    created_at: new Date(Date.now() - 22 * 864e5).toISOString(),
  },
  {
    id: "ind-1",
    project_id: "proj-1",
    industry_name: "HealthTech India Pvt Ltd",
    stakeholder_type: "startup",
    contribution_types: ["technology", "mentorship"],
    description: "Providing tele-medicine cloud platform and portable diagnostic kits.",
    funding_amount: 450000,
    status: "active",
    created_at: new Date(Date.now() - 22 * 864e5).toISOString(),
  },
  {
    id: "ind-2",
    project_id: "proj-2",
    industry_name: "AgriSolutions Ltd",
    stakeholder_type: "msme",
    contribution_types: ["technology", "funding", "testing"],
    description: "Crop disease computer vision model acceleration and regional field testing.",
    funding_amount: 300000,
    status: "completed",
    created_at: new Date(Date.now() - 55 * 864e5).toISOString(),
  },
  {
    id: "ind-3",
    project_id: "proj-3",
    industry_name: "EnviroSense Technologies",
    stakeholder_type: "lab",
    contribution_types: ["hardware", "technology"],
    description: "Continuous IoT water quality sensor probes and cloud data visualization.",
    funding_amount: 750000,
    status: "active",
    created_at: new Date(Date.now() - 65 * 864e5).toISOString(),
  },
  {
    id: "ind-4",
    project_id: "proj-4",
    industry_name: "Tata Steel CSR",
    stakeholder_type: "csr",
    contribution_types: ["funding", "hardware"],
    description: "Borewell deep drilling rig access and civil storage tank construction.",
    funding_amount: 600000,
    status: "active",
    created_at: new Date(Date.now() - 8 * 864e5).toISOString(),
  },
];

const memoryIndustry: IndustryParticipation[] = [...seedIndustry];

// Intellectual Property & Patents
const seedPatents: PatentRecord[] = [
  {
    id: "pat-1",
    project_id: "proj-hero-1",
    title: "Solar Powered Multi-Stage Fluoride Adsorption Filter with Real-time Turbidity Telemetry",
    patent_number: "IN-2024/JH/88349",
    filing_date: new Date(Date.now() - 15 * 864e5).toISOString(),
    status: "published",
    inventors: ["Dr. R. K. Prasad", "Sneha Kumari", "Alok Verma"],
    abstract: "A modular, solar-assisted activated alumina adsorption reactor for defluoridation of rural potable groundwater integrated with low-power ESP32 conductivity and turbidity telemetry.",
    created_at: new Date(Date.now() - 15 * 864e5).toISOString(),
  },
  {
    id: "pat-2",
    project_id: "proj-2",
    title: "Computer Vision Early Detection System for Solanaceae Crop Foliar Blight",
    patent_number: "IN-2024/JH/44912",
    filing_date: new Date(Date.now() - 45 * 864e5).toISOString(),
    status: "granted",
    inventors: ["Dr. B. C. Mahato", "Rakesh Ranjan"],
    abstract: "An offline edge-inferencing computer vision methodology detecting early stage Alternaria solani blight on tribal smallholder tomato cultivars.",
    created_at: new Date(Date.now() - 45 * 864e5).toISOString(),
  },
  {
    id: "pat-3",
    project_id: "proj-3",
    title: "Bio-remediation Microbial Inoculation Delivery Mat for Acid Mine Drainage",
    patent_number: "IN-2024/JH/92110",
    filing_date: new Date(Date.now() - 10 * 864e5).toISOString(),
    status: "provisional_filed",
    inventors: ["Prof. Amitava Das", "Kavita Sanyal"],
    abstract: "A biological floating mat impregnated with sulfate-reducing consortium to passively neutralize pH and precipitate heavy metals from coal mining runoff.",
    created_at: new Date(Date.now() - 10 * 864e5).toISOString(),
  },
];

const memoryPatents: PatentRecord[] = [...seedPatents];

// Startups Incubated
const seedStartups: StartupIncubation[] = [
  {
    id: "startup-1",
    project_id: "proj-hero-1",
    startup_name: "JalSutra CleanTech Innovations Pvt Ltd",
    incubation_center: "BIT Sindri Technology Business Incubator",
    dpiit_number: "DIPP109482",
    funding_received: 750000,
    founders: ["Alok Verma", "Sneha Kumari"],
    status: "incubated",
    created_at: new Date(Date.now() - 12 * 864e5).toISOString(),
  },
  {
    id: "startup-2",
    project_id: "proj-2",
    startup_name: "KisanVision AI Labs",
    incubation_center: "Birsa Agri-Business Incubation Centre (BABIC)",
    dpiit_number: "DIPP89123",
    funding_received: 1200000,
    founders: ["Rakesh Ranjan"],
    status: "seed_funded",
    created_at: new Date(Date.now() - 20 * 864e5).toISOString(),
  },
];

const memoryStartups: StartupIncubation[] = [...seedStartups];

// Project Collaboration & Mentorship Discussions
const seedDiscussions: ProjectDiscussion[] = [
  {
    id: "disc-1",
    project_id: "proj-hero-1",
    author_name: "Dr. R. K. Prasad",
    author_role: "faculty",
    message: "Completed 30-day telemetry test in Jama Block. Adsorption media is maintaining fluoride levels below 0.8 ppm (well under the 1.5 ppm BIS safe ceiling).",
    message_type: "update",
    created_at: new Date(Date.now() - 5 * 864e5).toISOString(),
  },
  {
    id: "disc-2",
    project_id: "proj-hero-1",
    author_name: "Vikram Sharma",
    author_role: "industry",
    message: "Jindal Water Infra has approved an additional ₹2.5L sponsorship for local fabrication of the stainless steel kiosk enclosures and replacement cartridges.",
    message_type: "guidance",
    created_at: new Date(Date.now() - 3 * 864e5).toISOString(),
  },
  {
    id: "disc-3",
    project_id: "proj-hero-1",
    author_name: "Santosh Soren",
    author_role: "student",
    message: "The villagers in Ward 4 are extremely grateful. Water taste and clarity have noticeably improved. Requesting scheduled maintenance schedule for filter backwashing.",
    message_type: "query",
    created_at: new Date(Date.now() - 2 * 864e5).toISOString(),
  },
  {
    id: "disc-4",
    project_id: "proj-hero-1",
    author_name: "District Development Officer, Dumka",
    author_role: "government",
    message: "Department conducted ground inspection on 18th Sept. Ready to allocate 15th Finance Commission Panchayat funds to replicate this in 5 neighboring fluoride-affected Panchayats.",
    message_type: "inspection",
    created_at: new Date(Date.now() - 1 * 864e5).toISOString(),
  },
];

const memoryDiscussions: ProjectDiscussion[] = [...seedDiscussions];

// Notifications
const seedNotifications: Notification[] = [
  {
    id: "notif-hero-1",
    user_name: "BIT Sindri",
    user_role: "university",
    title: "High Priority Challenge Assigned",
    message: "Dumka drinking water challenge (High Priority, 92% match) has been assigned to BIT Sindri.",
    type: "action",
    entity_type: "challenge",
    entity_id: "seed-hero-1",
    is_read: false,
    created_at: new Date(Date.now() - 5 * 864e5).toISOString(),
  },
  {
    id: "notif-hero-2",
    user_name: "Santosh Soren",
    user_role: "citizen",
    title: "Challenge Assigned to BIT Sindri",
    message: "Your reported water quality challenge has been accepted by BIT Sindri. A multidisciplinary innovation project has begun!",
    type: "success",
    entity_type: "challenge",
    entity_id: "seed-hero-1",
    is_read: true,
    created_at: new Date(Date.now() - 4 * 864e5).toISOString(),
  },
  {
    id: "notif-hero-3",
    user_name: "Jindal Water Infra Ltd",
    user_role: "industry",
    title: "Partnership Confirmed",
    message: "Your expression of interest for Smart Water Quality Monitoring has been approved.",
    type: "success",
    entity_type: "project",
    entity_id: "proj-hero-1",
    is_read: false,
    created_at: new Date(Date.now() - 2 * 864e5).toISOString(),
  },
  {
    id: "notif-1",
    user_name: "RIMS Ranchi",
    user_role: "university",
    title: "New challenge assigned",
    message: "Healthcare challenge from Gumla has been assigned to your institution.",
    type: "action",
    entity_type: "challenge",
    entity_id: "seed-4",
    is_read: true,
    created_at: new Date(Date.now() - 30 * 864e5).toISOString(),
  },
  {
    id: "notif-2",
    user_name: "Anil Munda",
    user_role: "citizen",
    title: "Your challenge is in progress",
    message: "RIMS Ranchi has accepted your challenge and started working on a mobile clinic solution.",
    type: "success",
    entity_type: "challenge",
    entity_id: "seed-4",
    is_read: true,
    created_at: new Date(Date.now() - 28 * 864e5).toISOString(),
  },
  {
    id: "notif-3",
    user_name: "Admin",
    user_role: "government",
    title: "Water Filtration Milestone Advanced",
    message: "Dumka water filtration project has completed lab prototyping and initiated field testing.",
    type: "info",
    entity_type: "project",
    entity_id: "proj-hero-1",
    is_read: false,
    created_at: new Date(Date.now() - 1 * 864e5).toISOString(),
  },
];

let memoryNotifications: Notification[] = [...seedNotifications];

// Impact Metrics
const seedImpact: ImpactMetric[] = [
  {
    id: "impact-hero-1",
    project_id: "proj-hero-1",
    people_impacted: 1200,
    cost_saved: 120000,
    water_saved: 45000,
    waste_reduced: 12,
    jobs_created: 4,
    satisfaction_score: 4.8,
    notes: "Potable fluoride-safe water delivered daily to 1,200 residents; zero acute diarrhea cases reported in Jama Ward 4 during monitoring.",
    created_at: new Date(Date.now() - 2 * 864e5).toISOString(),
  },
  {
    id: "impact-1",
    project_id: "proj-2",
    people_impacted: 4200,
    cost_saved: 180000,
    water_saved: null,
    waste_reduced: null,
    jobs_created: 12,
    satisfaction_score: 4.3,
    notes: "Farmers report 60% reduction in crop loss after using the disease detection app.",
    created_at: new Date(Date.now() - 5 * 864e5).toISOString(),
  },
  {
    id: "impact-2",
    project_id: "proj-3",
    people_impacted: 15000,
    cost_saved: null,
    water_saved: 50000,
    waste_reduced: 200,
    jobs_created: 8,
    satisfaction_score: 4.1,
    notes: "River dissolved oxygen levels improved by 35% at pilot sites along the Damodar.",
    created_at: new Date(Date.now() - 10 * 864e5).toISOString(),
  },
];

const memoryImpact: ImpactMetric[] = [...seedImpact];

// AI Analyses
const seedAnalysis: AIAnalysis[] = [
  // HERO DEMO AI ANALYSIS
  {
    id: "ai-hero-1",
    challenge_id: "seed-hero-1",
    category: "Water Resources",
    subcategory: "Drinking Water",
    priority: "High",
    priority_score: 88,
    impact_score: 88,
    urgency_score: 91,
    duplicate_score: 0.04,
    similar_challenge_id: null,
    problem_summary: "High fluoride and iron contamination in drinking water sources across Jama block, Dumka affecting ~1,200 villagers with acute health risks.",
    affected_population: 1200,
    required_disciplines: ["Civil Engineering", "Environmental Engineering", "IoT"],
    recommended_solution_types: ["Community adsorption filtration", "Solar-powered telemetry", "Borewell rehabilitation"],
    confidence_score: 0.94,
    ai_provider: "gemini",
  },
  {
    id: "ai-1",
    challenge_id: "seed-1",
    category: "Water Resources",
    subcategory: "Drinking Water",
    priority: "High",
    priority_score: 78,
    impact_score: 82,
    urgency_score: 75,
    duplicate_score: 0.05,
    similar_challenge_id: null,
    problem_summary: "Borewell failure causing drinking water crisis for ~800 residents in Namkum village, Ranchi.",
    affected_population: 800,
    required_disciplines: ["Civil Engineering", "Hydrology", "IoT", "Environmental Engineering"],
    recommended_solution_types: ["Borewell rehabilitation", "Water quality sensors", "Community filtration"],
    confidence_score: 0.87,
    ai_provider: "fallback",
  },
  {
    id: "ai-2",
    challenge_id: "seed-4",
    category: "Healthcare",
    subcategory: "Primary Healthcare",
    priority: "Critical",
    priority_score: 92,
    impact_score: 95,
    urgency_score: 90,
    duplicate_score: 0.02,
    similar_challenge_id: null,
    problem_summary: "Complete absence of medical services at Gumla PHC for 3 months. Rural population of ~3200 affected.",
    affected_population: 3200,
    required_disciplines: ["Medicine", "Public Health", "Telemedicine", "Biomedical Engineering"],
    recommended_solution_types: ["Mobile clinic", "Telemedicine infrastructure", "Doctor rotation scheme"],
    confidence_score: 0.91,
    ai_provider: "fallback",
  },
  {
    id: "ai-3",
    challenge_id: "seed-7",
    category: "Environment",
    subcategory: "Water Pollution",
    priority: "Critical",
    priority_score: 88,
    impact_score: 90,
    urgency_score: 85,
    duplicate_score: 0.03,
    similar_challenge_id: null,
    problem_summary: "Industrial effluent discharge into Damodar tributary affecting 15,000 residents downstream.",
    affected_population: 15000,
    required_disciplines: ["Environmental Engineering", "Chemistry", "IoT", "Policy Studies"],
    recommended_solution_types: ["IoT monitoring", "Bioremediation", "Effluent treatment enforcement"],
    confidence_score: 0.89,
    ai_provider: "fallback",
  },
];

const memoryAnalysis: AIAnalysis[] = [...seedAnalysis];

// Citizen Feedback
const seedFeedback: Feedback[] = [
  // HERO DEMO FEEDBACK
  {
    id: "fb-hero-1",
    challenge_id: "seed-hero-1",
    project_id: "proj-hero-1",
    submitter_name: "Santosh Soren",
    rating: 5,
    comment: "The water filtration prototype tested in our village has significantly reduced iron turbidity and taste issues. Students and faculty are actively testing water quality every week. Excellent initiative!",
    created_at: new Date(Date.now() - 1 * 864e5).toISOString(),
  },
  {
    id: "fb-1",
    challenge_id: "seed-6",
    project_id: "proj-2",
    submitter_name: "Mahato Farmers Group",
    rating: 5,
    comment: "The app has been very helpful. We could identify crop disease early and save most of our harvest.",
    created_at: new Date(Date.now() - 3 * 864e5).toISOString(),
  },
];

const memoryFeedback: Feedback[] = [...seedFeedback];

// ---- Problems CRUD ----------------------------------------------------------
export async function getProblems(stateFilter?: string): Promise<Problem[]> {
  if (client) {
    try {
      let query = client.from(TABLE).select("*").order("created_at", { ascending: false });
      if (stateFilter) query = query.eq("state", stateFilter);
      const { data, error } = await query;
      if (error) throw error;
      if (data) return data as Problem[];
    } catch { /* fall through to memory */ }
  }
  const sorted = [...memory].sort((a, b) => b.created_at.localeCompare(a.created_at));
  return stateFilter ? sorted.filter((p) => p.state === stateFilter) : sorted;
}

export async function getProblemById(id: string): Promise<Problem | null> {
  if (client) {
    try {
      const { data, error } = await client.from(TABLE).select("*").eq("id", id).single();
      if (error) throw error;
      if (data) return data as Problem;
    } catch { /* fall through to memory */ }
  }
  return memory.find((p) => p.id === id) ?? null;
}

export async function addProblem(
  p: Omit<Problem, "id" | "status" | "assigned_to" | "created_at" | "updated_at">
): Promise<string> {
  const id = newId();
  const row: Problem = {
    ...p,
    state: p.state ?? "Jharkhand", // backward compat default
    id,
    status: "submitted",
    assigned_to: null,
    created_at: new Date().toISOString(),
    updated_at: null,
  };
  if (client) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, created_at: _ca, updated_at: _ua, ...insert } = row;
      const { error } = await client.from(TABLE).insert(insert);
      if (error) throw error;
      const { data } = await client.from(TABLE).select("id").order("created_at", { ascending: false }).limit(1).single();
      return (data as { id: string } | null)?.id ?? id;
    } catch { /* fall through */ }
  }
  memory.unshift(row);
  return id;
}

export async function updateProblem(
  id: string,
  patch: {
    status?: ChallengeStatus;
    assigned_to?: string | null;
    priority?: Priority | null;
    priority_score?: number | null;
    subcategory?: string | null;
  }
): Promise<void> {
  const patchWithTs = { ...patch, updated_at: new Date().toISOString() };
  if (client) {
    try {
      const { error } = await client.from(TABLE).update(patchWithTs).eq("id", id);
      if (error) throw error;
      return;
    } catch { /* fall through */ }
  }
  memory = memory.map((p) => (p.id === id ? { ...p, ...patchWithTs } : p));
}

// ---- Projects CRUD ----------------------------------------------------------
export async function getProjects(): Promise<Project[]> {
  if (client) {
    try {
      const { data, error } = await client.from("projects").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      if (data) return data as Project[];
    } catch { /* fall through */ }
  }
  return [...memoryProjects].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (client) {
    try {
      const { data, error } = await client.from("projects").select("*").eq("id", id).single();
      if (error) throw error;
      if (data) return data as Project;
    } catch { /* fall through */ }
  }
  return memoryProjects.find((p) => p.id === id) ?? null;
}

export async function getProjectByChallenge(challengeId: string): Promise<Project | null> {
  if (client) {
    try {
      const { data, error } = await client.from("projects").select("*").eq("challenge_id", challengeId).limit(1).maybeSingle();
      if (error) throw error;
      if (data) return data as Project;
    } catch { /* fall through */ }
  }
  return memoryProjects.find((p) => p.challenge_id === challengeId) ?? null;
}

export async function addProject(p: Omit<Project, "id" | "created_at" | "updated_at">): Promise<string> {
  const id = "proj-" + Math.random().toString(36).slice(2, 8);
  const row: Project = { ...p, id, created_at: new Date().toISOString(), updated_at: null };
  if (client) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, created_at: _ca, updated_at: _ua, ...insert } = row;
      const { error } = await client.from("projects").insert(insert);
      if (error) throw error;
      return id;
    } catch { /* fall through */ }
  }
  memoryProjects.unshift(row);
  return id;
}

export async function updateProject(
  id: string,
  patch: Partial<Pick<Project, "status" | "progress" | "industry_partner" | "target_date" | "trl_level" | "incubation_center">>
): Promise<void> {
  const p = { ...patch, updated_at: new Date().toISOString() };
  if (client) {
    try {
      const { error } = await client.from("projects").update(p).eq("id", id);
      if (error) throw error;
      return;
    } catch { /* fall through */ }
  }
  memoryProjects = memoryProjects.map((proj) => (proj.id === id ? { ...proj, ...p } : proj));
}

// ---- Project Members --------------------------------------------------------
export async function getProjectMembers(projectId: string): Promise<ProjectMember[]> {
  if (client) {
    try {
      const { data, error } = await client.from("project_members").select("*").eq("project_id", projectId);
      if (error) throw error;
      if (data) return data as ProjectMember[];
    } catch { /* fall through */ }
  }
  const members = memoryMembers.filter((m) => m.project_id === projectId);
  if (members.length > 0) return members;
  const project = memoryProjects.find((p) => p.id === projectId);
  if (!project) return [];
  return [
    { project_id: projectId, name: "Dr. A. K. Sen", role: "faculty", department: "Engineering", organisation: project.university_name },
    { project_id: projectId, name: "Student Lead", role: "student", department: "Computer Science", organisation: project.university_name },
  ];
}

export async function addProjectMember(member: Omit<ProjectMember, "id" | "created_at">): Promise<void> {
  const row: ProjectMember = { ...member, id: "mem-" + Math.random().toString(36).slice(2, 8), created_at: new Date().toISOString() };
  if (client) {
    try {
      const { error } = await client.from("project_members").insert(member);
      if (error) throw error;
      return;
    } catch { /* fall through */ }
  }
  memoryMembers.push(row);
}

export async function removeProjectMember(projectId: string, name: string): Promise<void> {
  if (client) {
    try {
      const { error } = await client.from("project_members").delete().eq("project_id", projectId).eq("name", name);
      if (error) throw error;
      return;
    } catch { /* fall through */ }
  }
  memoryMembers = memoryMembers.filter((m) => !(m.project_id === projectId && m.name === name));
}

// ---- Project Proposals ------------------------------------------------------
export async function getProjectProposal(projectId: string): Promise<ProjectProposal | null> {
  if (client) {
    try {
      const { data, error } = await client.from("project_proposals").select("*").eq("project_id", projectId).maybeSingle();
      if (error) throw error;
      if (data) return data as ProjectProposal;
    } catch { /* fall through */ }
  }
  return memoryProposals.find((p) => p.project_id === projectId) ?? null;
}

export async function saveProjectProposal(proposal: Omit<ProjectProposal, "id" | "created_at" | "updated_at">): Promise<void> {
  const existing = memoryProposals.find((p) => p.project_id === proposal.project_id);
  const now = new Date().toISOString();
  if (existing) {
    const updated: ProjectProposal = { ...existing, ...proposal, updated_at: now };
    if (client) {
      try {
        const { error } = await client.from("project_proposals").update(updated).eq("id", existing.id);
        if (error) throw error;
        return;
      } catch { /* fall through */ }
    }
    const idx = memoryProposals.findIndex((p) => p.project_id === proposal.project_id);
    if (idx >= 0) memoryProposals[idx] = updated;
  } else {
    const created: ProjectProposal = {
      ...proposal,
      id: "prop-" + Math.random().toString(36).slice(2, 8),
      created_at: now,
      updated_at: null,
    };
    if (client) {
      try {
        const { error } = await client.from("project_proposals").insert(created);
        if (error) throw error;
        return;
      } catch { /* fall through */ }
    }
    memoryProposals.push(created);
  }
}

export async function updateProposalStatus(projectId: string, status: ProposalStatus): Promise<void> {
  const existing = memoryProposals.find((p) => p.project_id === projectId);
  if (existing) {
    existing.status = status;
    existing.updated_at = new Date().toISOString();
  }
}

// ---- Milestones CRUD --------------------------------------------------------
export async function getMilestones(projectId: string): Promise<Milestone[]> {
  if (client) {
    try {
      const { data, error } = await client.from("milestones").select("*").eq("project_id", projectId).order("created_at");
      if (error) throw error;
      if (data) return data as Milestone[];
    } catch { /* fall through */ }
  }
  return memoryMilestones.filter((m) => m.project_id === projectId);
}

export async function addMilestone(m: Omit<Milestone, "id" | "created_at" | "completed_at">): Promise<void> {
  const row: Milestone = { ...m, id: "ms-" + Math.random().toString(36).slice(2, 8), created_at: new Date().toISOString(), completed_at: null };
  if (client) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, created_at: _ca, ...insert } = row;
      const { error } = await client.from("milestones").insert(insert);
      if (error) throw error;
      return;
    } catch { /* fall through */ }
  }
  memoryMilestones.push(row);
}

export async function updateMilestone(
  id: string,
  patch: { status?: Milestone["status"]; progress?: number; completed_at?: string | null; deliverable_url?: string | null }
): Promise<void> {
  if (client) {
    try {
      const { error } = await client.from("milestones").update(patch).eq("id", id);
      if (error) throw error;
      return;
    } catch { /* fall through */ }
  }
  memoryMilestones = memoryMilestones.map((m) => (m.id === id ? { ...m, ...patch } : m));
}

// ---- Industry Participation -------------------------------------------------
export async function getIndustryParticipation(projectId?: string): Promise<IndustryParticipation[]> {
  if (client) {
    try {
      let q = client.from("industry_participation").select("*");
      if (projectId) q = q.eq("project_id", projectId);
      const { data, error } = await q.order("created_at", { ascending: false });
      if (error) throw error;
      if (data) return data as IndustryParticipation[];
    } catch { /* fall through */ }
  }
  if (projectId) return memoryIndustry.filter((i) => i.project_id === projectId);
  return [...memoryIndustry];
}

export async function addIndustryParticipation(p: Omit<IndustryParticipation, "id" | "created_at">): Promise<void> {
  const row: IndustryParticipation = { ...p, id: "ind-" + Math.random().toString(36).slice(2, 8), created_at: new Date().toISOString() };
  if (client) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, created_at: _ca, ...insert } = row;
      const { error } = await client.from("industry_participation").insert(insert);
      if (error) throw error;
      return;
    } catch { /* fall through */ }
  }
  memoryIndustry.push(row);
}

// ---- Notifications ----------------------------------------------------------
export async function getNotifications(userRole?: string): Promise<Notification[]> {
  if (client) {
    try {
      let q = client.from("notifications").select("*");
      if (userRole) q = q.eq("user_role", userRole);
      const { data, error } = await q.order("created_at", { ascending: false });
      if (error) throw error;
      if (data) return data as Notification[];
    } catch { /* fall through */ }
  }
  let notifs = [...memoryNotifications];
  if (userRole) notifs = notifs.filter((n) => n.user_role === userRole || n.user_role === "all");
  return notifs.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function addNotification(n: Omit<Notification, "id" | "created_at" | "is_read">): Promise<void> {
  const row: Notification = { ...n, id: "notif-" + Math.random().toString(36).slice(2, 8), is_read: false, created_at: new Date().toISOString() };
  if (client) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, created_at: _ca, ...insert } = row;
      const { error } = await client.from("notifications").insert(insert);
      if (error) throw error;
      return;
    } catch { /* fall through */ }
  }
  memoryNotifications.unshift(row);
}

export async function markNotificationRead(id: string): Promise<void> {
  if (client) {
    try {
      const { error } = await client.from("notifications").update({ is_read: true }).eq("id", id);
      if (error) throw error;
      return;
    } catch { /* fall through */ }
  }
  memoryNotifications = memoryNotifications.map((n) => (n.id === id ? { ...n, is_read: true } : n));
}

// ---- AI Analysis ------------------------------------------------------------
export async function getAnalysis(challengeId: string): Promise<AIAnalysis | null> {
  if (client) {
    try {
      const { data, error } = await client.from("challenge_ai_analysis").select("*").eq("challenge_id", challengeId).maybeSingle();
      if (error) throw error;
      if (data) return data as AIAnalysis;
    } catch { /* fall through */ }
  }
  return memoryAnalysis.find((a) => a.challenge_id === challengeId) ?? null;
}

export async function saveAnalysis(analysis: Omit<AIAnalysis, "id" | "created_at">): Promise<void> {
  const row: AIAnalysis = { ...analysis, id: "ai-" + Math.random().toString(36).slice(2, 8), created_at: new Date().toISOString() };
  if (client) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, created_at: _ca, ...insert } = row;
      const { error } = await client.from("challenge_ai_analysis").upsert(insert, { onConflict: "challenge_id" });
      if (error) throw error;
      return;
    } catch { /* fall through */ }
  }
  const idx = memoryAnalysis.findIndex((a) => a.challenge_id === analysis.challenge_id);
  if (idx >= 0) memoryAnalysis[idx] = row;
  else memoryAnalysis.push(row);
}

// ---- Feedback ---------------------------------------------------------------
export async function getFeedback(challengeId?: string): Promise<Feedback[]> {
  if (client) {
    try {
      let q = client.from("feedback").select("*");
      if (challengeId) q = q.eq("challenge_id", challengeId);
      const { data, error } = await q.order("created_at", { ascending: false });
      if (error) throw error;
      if (data) return data as Feedback[];
    } catch { /* fall through */ }
  }
  if (challengeId) return memoryFeedback.filter((f) => f.challenge_id === challengeId);
  return [...memoryFeedback];
}

export async function addFeedback(f: Omit<Feedback, "id" | "created_at">): Promise<void> {
  const row: Feedback = { ...f, id: "fb-" + Math.random().toString(36).slice(2, 8), created_at: new Date().toISOString() };
  if (client) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, created_at: _ca, ...insert } = row;
      const { error } = await client.from("feedback").insert(insert);
      if (error) throw error;
      return;
    } catch { /* fall through */ }
  }
  memoryFeedback.unshift(row);
}

// ---- Impact Metrics ---------------------------------------------------------
export async function getImpactMetrics(projectId?: string): Promise<ImpactMetric[]> {
  if (client) {
    try {
      let q = client.from("impact_metrics").select("*");
      if (projectId) q = q.eq("project_id", projectId);
      const { data, error } = await q.order("created_at", { ascending: false });
      if (error) throw error;
      if (data) return data as ImpactMetric[];
    } catch { /* fall through */ }
  }
  if (projectId) return memoryImpact.filter((i) => i.project_id === projectId);
  return [...memoryImpact];
}

export async function addImpactMetric(m: Omit<ImpactMetric, "id" | "created_at">): Promise<void> {
  const row: ImpactMetric = { ...m, id: "impact-" + Math.random().toString(36).slice(2, 8), created_at: new Date().toISOString() };
  if (client) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, created_at: _ca, ...insert } = row;
      const { error } = await client.from("impact_metrics").insert(insert);
      if (error) throw error;
      return;
    } catch { /* fall through */ }
  }
  memoryImpact.unshift(row);
}

// ---- Intellectual Property & Patents ----------------------------------------
export async function getPatents(projectId?: string): Promise<PatentRecord[]> {
  if (client) {
    try {
      let q = client.from("patents").select("*");
      if (projectId) q = q.eq("project_id", projectId);
      const { data, error } = await q.order("created_at", { ascending: false });
      if (error) throw error;
      if (data) return data as PatentRecord[];
    } catch { /* fall through */ }
  }
  if (projectId) return memoryPatents.filter((p) => p.project_id === projectId);
  return [...memoryPatents];
}

export async function addPatent(p: Omit<PatentRecord, "id" | "created_at">): Promise<void> {
  const row: PatentRecord = { ...p, id: "pat-" + Math.random().toString(36).slice(2, 8), created_at: new Date().toISOString() };
  if (client) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, created_at: _ca, ...insert } = row;
      const { error } = await client.from("patents").insert(insert);
      if (error) throw error;
      return;
    } catch { /* fall through */ }
  }
  memoryPatents.unshift(row);
}

// ---- Startup Incubation -----------------------------------------------------
export async function getStartups(projectId?: string): Promise<StartupIncubation[]> {
  if (client) {
    try {
      let q = client.from("startups").select("*");
      if (projectId) q = q.eq("project_id", projectId);
      const { data, error } = await q.order("created_at", { ascending: false });
      if (error) throw error;
      if (data) return data as StartupIncubation[];
    } catch { /* fall through */ }
  }
  if (projectId) return memoryStartups.filter((s) => s.project_id === projectId);
  return [...memoryStartups];
}

export async function addStartup(s: Omit<StartupIncubation, "id" | "created_at">): Promise<void> {
  const row: StartupIncubation = { ...s, id: "startup-" + Math.random().toString(36).slice(2, 8), created_at: new Date().toISOString() };
  if (client) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, created_at: _ca, ...insert } = row;
      const { error } = await client.from("startups").insert(insert);
      if (error) throw error;
      return;
    } catch { /* fall through */ }
  }
  memoryStartups.unshift(row);
}

// ---- Project Discussions & Mentorship Feed ---------------------------------
export async function getDiscussions(projectId: string): Promise<ProjectDiscussion[]> {
  if (client) {
    try {
      const { data, error } = await client
        .from("project_discussions")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      if (data) return data as ProjectDiscussion[];
    } catch { /* fall through */ }
  }
  return memoryDiscussions.filter((d) => d.project_id === projectId);
}

export async function addDiscussion(d: Omit<ProjectDiscussion, "id" | "created_at">): Promise<void> {
  const row: ProjectDiscussion = { ...d, id: "disc-" + Math.random().toString(36).slice(2, 8), created_at: new Date().toISOString() };
  if (client) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, created_at: _ca, ...insert } = row;
      const { error } = await client.from("project_discussions").insert(insert);
      if (error) throw error;
      return;
    } catch { /* fall through */ }
  }
  memoryDiscussions.push(row);
}

export async function updateProjectTrl(projectId: string, trl: number): Promise<void> {
  await updateProject(projectId, { trl_level: trl });
}

// ---- Solution Repository ----------------------------------------------------
const seedSolutions: Solution[] = [
  {
    id: "sol-pb-1",
    title: "In-situ Paddy Stubble to Biochar & Super-Seeder Micro-Enterprise",
    problem_solved: "Seasonal agricultural air pollution, PM2.5 spikes, and loss of soil organic carbon caused by open paddy residue burning.",
    domain: "Agriculture",
    state: "Punjab",
    district: "Bathinda",
    institution: "IIT Ropar",
    technology: "Mobile Pyrolysis Biochar Kiln + Telemetric Smart Seed Drills",
    project_stage: "Commercialized",
    deployment_status: "Active across 14 village panchayats",
    impact: "420 tonnes stubble converted into soil-enhancing biochar; local PM2.5 reduced by 34%; 28 rural green jobs generated.",
    project_timeline: "8 Months (Research to Panchayat Deployment)",
    created_at: new Date(Date.now() - 60 * 864e5).toISOString(),
  },
  {
    id: "sol-mh-1",
    title: "Decentralized Solar Cold Storage with Phase Change Thermal Backup",
    problem_solved: "Rapid post-harvest deterioration of perishable vegetables and fruits due to erratic rural electrical supply and heat waves.",
    domain: "Energy",
    state: "Maharashtra",
    district: "Osmanabad",
    institution: "IIT Bombay",
    technology: "Phase-Change Material (PCM) Off-Grid Solar Refrigeration",
    project_stage: "Field Deployed",
    deployment_status: "Operational across 3 Farmer Producer Organizations (FPOs)",
    impact: "Post-harvest loss reduced from 38% to 6%; average farmer price realization improved by ₹4,200/quintal.",
    project_timeline: "6 Months (Prototyping to FPO Handover)",
    created_at: new Date(Date.now() - 45 * 864e5).toISOString(),
  },
  {
    id: "sol-ka-1",
    title: "Nano-Adsorptive Community Defluoridation & Arsenic Removal Column",
    problem_solved: "Endemic skeletal and dental fluorosis from deep over-extracted granitic aquifers affecting rural schoolchildren and elders.",
    domain: "Water Resources",
    state: "Karnataka",
    district: "Kalaburagi",
    institution: "IISc Bengaluru",
    technology: "Regenerative Activated Alumina & Clay-Biochar Ceramic Filters",
    project_stage: "Deployed",
    deployment_status: "Operating in 18 rural water purification centers",
    impact: "Safe fluoride levels (< 0.7 mg/L) delivered to 24,000 residents; zero fluorosis recurrence in monitored primary schools.",
    project_timeline: "12 Months (Lab Column to 18 Village Plants)",
    created_at: new Date(Date.now() - 90 * 864e5).toISOString(),
  },
  {
    id: "sol-rj-1",
    title: "Solar-Powered Brackish Water Reverse Osmosis with Zero Liquid Discharge",
    problem_solved: "High TDS (>3200 ppm) saline groundwater and severe drinking water scarcity in arid desert communities.",
    domain: "Water Resources",
    state: "Rajasthan",
    district: "Barmer",
    institution: "IIT Jodhpur",
    technology: "Sand-Tolerant Direct Solar PV-RO with Evaporative Brine Recovery",
    project_stage: "Deployed",
    deployment_status: "Deployed in 8 desert hamlets",
    impact: "TDS reduced from 3400 ppm to 180 ppm; daily drinking water output of 5,000 L per unit at zero grid electricity cost.",
    project_timeline: "9 Months (Field Testing to Desert Deployment)",
    created_at: new Date(Date.now() - 75 * 864e5).toISOString(),
  },
  {
    id: "sol-jh-1",
    title: "Gravity-Fed Iron & Microbial Filtration with Backwashable Terracotta Media",
    problem_solved: "Turbid, rust-contaminated handpump water carrying heavy ferric hydroxide and seasonal diarrheal pathogens in tribal habitations.",
    domain: "Water Resources",
    state: "Jharkhand",
    district: "Dumka",
    institution: "BIT Sindri",
    technology: "Multi-stage terracotta pebble-charcoal adsorption column",
    project_stage: "Deployed",
    deployment_status: "Active in 12 villages across Jama and Kathikund blocks",
    impact: "Waterborne diarrhea reduced by 78%; 3,800 villagers provided potable water under Jal Jeevan Mission convergence.",
    project_timeline: "6 Months (Lab Verification to JJM Integration)",
    created_at: new Date(Date.now() - 30 * 864e5).toISOString(),
  },
  {
    id: "sol-mh-2",
    title: "Modular Bio-Trickling Sequenced Filtration for Slum Drainage Outfalls",
    problem_solved: "Open blackwater drain stagnation, noxious odors, and monsoon flooding spreading water-borne disease in informal settlements.",
    domain: "Sanitation",
    state: "Maharashtra",
    district: "Thane",
    institution: "COEP Technological University",
    technology: "Micro-aerated immobilized bacterial biofilm media with solar sump pumps",
    project_stage: "Deployed",
    deployment_status: "Active in 6 municipal wards",
    impact: "BOD reduced by 82%; eradicated vector breeding pools across 1.4 km of drain corridors.",
    project_timeline: "5 Months (Bio-culture Optimization to Ward Scale)",
    created_at: new Date(Date.now() - 40 * 864e5).toISOString(),
  },
  {
    id: "sol-pb-2",
    title: "Canal Water Telemetry & Micro-Drip Automation Network",
    problem_solved: "Extreme canal water inequity between head and tail farmers leading to crop desiccation and over-pumping of groundwater.",
    domain: "Water Resources",
    state: "Punjab",
    district: "Fazilka",
    institution: "Punjab Agricultural University",
    technology: "Solar LoRa Gate Actuators & Soil Matric Potential Probes",
    project_stage: "Field Pilot",
    deployment_status: "Covering 1,200 hectares of command area",
    impact: "38% canal irrigation water conserved; tail-end farmers gained equal access to canal turns.",
    project_timeline: "7 Months (LoRa Gateway to Command Area Trial)",
    created_at: new Date(Date.now() - 50 * 864e5).toISOString(),
  },
  {
    id: "sol-rj-2",
    title: "Low-Cost CXR Silicosis Early AI Screening & Mist-Shrouded Cutting Rig",
    problem_solved: "High incidence of unrecorded fatal silicosis among artisanal sandstone quarry workers.",
    domain: "Healthcare",
    state: "Rajasthan",
    district: "Jodhpur",
    institution: "Rajasthan University of Health Sciences",
    technology: "Portable digital CXR classifier + Water Mist Shrouded Chisels",
    project_stage: "Deployed",
    deployment_status: "Screened 4,800 quarry artisans; rigs distributed across 32 artisanal clusters",
    impact: "Dust exposure reduced by 72%; certified 840 workers for early PM-relief without bureaucratic delays.",
    project_timeline: "10 Months (Clinical Validation to Cluster Rollout)",
    created_at: new Date(Date.now() - 80 * 864e5).toISOString(),
  },
  {
    id: "sol-jh-2",
    title: "Lac Resin Refining & Bio-Coating for Tribal Forest Produce Preservation",
    problem_solved: "Distress sale of raw lac resin at low rates due to rapid storage deterioration and lack of local value addition.",
    domain: "Rural Livelihoods",
    state: "Jharkhand",
    district: "Khunti",
    institution: "Birsa Agricultural University",
    technology: "Decentralized Solar-Powered Washing & De-waxing Reactor",
    project_stage: "Deployed",
    deployment_status: "Operational across 5 tribal SHG federations",
    impact: "Household income increased by 45% for 650 tribal harvesters; value addition retained locally.",
    project_timeline: "6 Months (Reactor Fabrication to SHG Training)",
    created_at: new Date(Date.now() - 35 * 864e5).toISOString(),
  },
  {
    id: "sol-mh-3",
    title: "Terrain-Adaptive Electric All-Terrain Wheelchair for Rural Roads",
    problem_solved: "Complete mobility isolation for individuals with locomotor disabilities in unpaved rural terrain.",
    domain: "Accessibility",
    state: "Maharashtra",
    district: "Pune",
    institution: "IIT Bombay",
    technology: "High-Torque Hub Motors with Articulated Bogie Suspension",
    project_stage: "Field Pilot",
    deployment_status: "Deployed to 45 rural beneficiaries across 3 talukas",
    impact: "Enabled independent rural mobility; zero breakdown across 12 months on unpaved gravel tracks.",
    project_timeline: "8 Months (Suspension Prototyping to Road Trial)",
    created_at: new Date(Date.now() - 25 * 864e5).toISOString(),
  },
];

const memorySolutions: Solution[] = [...seedSolutions];

export async function getSolutions(filter?: { domain?: Category; state?: string }): Promise<Solution[]> {
  if (client) {
    try {
      let q = client.from("solutions").select("*");
      if (filter?.domain) q = q.eq("domain", filter.domain);
      if (filter?.state) q = q.eq("state", filter.state);
      const { data, error } = await q.order("created_at", { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) return data as Solution[];
    } catch { /* fall through to in-memory store */ }
  }

  let list = [...memorySolutions];
  if (filter?.domain) list = list.filter((s) => s.domain === filter.domain);
  if (filter?.state) list = list.filter((s) => s.state.toLowerCase() === filter.state!.toLowerCase());
  return list;
}

export async function getReusableSolutions(problem: Problem): Promise<Solution[]> {
  const allSolutions = await getSolutions();
  const problemState = problem.state ?? "Jharkhand";
  const problemText = `${problem.title} ${problem.description} ${problem.subcategory ?? ""}`.toLowerCase();
  const words = problemText.split(/\W+/).filter((w) => w.length > 4);

  // Score each solution for relevance
  const scored = allSolutions.map((sol) => {
    let score = 0;
    // Same domain is a major match
    if (sol.domain === problem.category) score += 40;
    // Text overlap with problem solved or technology
    const solText = `${sol.title} ${sol.problem_solved} ${sol.technology}`.toLowerCase();
    for (const w of words) {
      if (solText.includes(w)) score += 6;
    }
    // High bonus for cross-state solutions (as requested: highlight completed solutions from other states)
    const isOtherState = sol.state.toLowerCase() !== problemState.toLowerCase();
    if (isOtherState) score += 15;

    return { sol, score, isOtherState };
  });

  return scored
    .filter((s) => s.score >= 30)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.sol)
    .slice(0, 4);
}

export async function addSolution(s: Omit<Solution, "id" | "created_at">): Promise<Solution> {
  const row: Solution = {
    ...s,
    id: "sol-" + Math.random().toString(36).slice(2, 8),
    created_at: new Date().toISOString(),
  };

  if (client) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, created_at: _ca, ...insert } = row;
      const { error } = await client.from("solutions").insert(insert);
      if (error) throw error;
      return row;
    } catch { /* fall through */ }
  }

  memorySolutions.unshift(row);
  return row;
}

// ---- Utility ----------------------------------------------------------------
export function usingSupabase(): boolean {
  return Boolean(client);
}

