// Seeds ~40 realistic problems into Supabase, uploading photos to the
// `evidence` Storage bucket so the whole pipeline is exercised.
// Run:  node scripts/seed.mjs
import { createClient } from "@supabase/supabase-js";

const URL = "https://mivzbittowawzcatlmvh.supabase.co";
const ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pdnpiaXR0b3dhd3pjYXRsbXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NDUxOTQsImV4cCI6MjEwNDAyMTE5NH0.agaP9MyPKUGALJNL_phoOhEeBvPCtMQycN-tOXXsHLM";
const supabase = createClient(URL, ANON);
const BUCKET = "evidence";

const UNI = {
  Education: "BIT Mesra, Ranchi",
  Agriculture: "Birsa Agricultural University",
  Healthcare: "RIMS Ranchi",
  "Water Resources": "IIT (ISM) Dhanbad",
  Sanitation: "RIMS Ranchi",
  Environment: "IIT (ISM) Dhanbad",
  Energy: "IIT (ISM) Dhanbad",
  "Urban Development": "IIT (ISM) Dhanbad",
  Accessibility: "BIT Mesra, Ranchi",
  "Public Administration": "Central University of Jharkhand",
  "Rural Livelihoods": "Central University of Jharkhand",
};

// name, description, category, district, submitter, status, daysAgo, photo(bool)
const P = [
  ["Borewell dried up in Namkum village", "The only borewell has run dry; families walk 2 km for water and the pond is contaminated.", "Water Resources", "Ranchi", "Sunita Devi", "Assigned", 62, true],
  ["Primary school has no functional toilets", "Broken toilets mean many girl students have stopped attending classes.", "Sanitation", "Hazaribagh", "Village Education Committee", "In Progress", 55, true],
  ["8-hour power cuts damaging irrigation pumps", "Load shedding stops farmers running electric pumps for paddy irrigation.", "Energy", "Palamu", "Ramesh Oraon", "Under Review", 48, true],
  ["No doctor at the primary health centre", "The village clinic has had no doctor or medicine for three months; nearest hospital is 40 km away.", "Healthcare", "Gumla", "Anil Munda", "Assigned", 40, true],
  ["Government school lacks science teachers", "Class 9 and 10 have had no science or maths teacher all year.", "Education", "Dumka", "Parent Association", "Submitted", 3, false],
  ["Crop disease destroying tomato harvest", "A blight is wiping out tomato crops across the block; farmers need guidance on pesticides.", "Agriculture", "Ranchi", "Mahato Farmers Group", "In Progress", 30, true],
  ["Open drains flooding the market road", "Choked drains overflow during rain, flooding the weekly market and shops.", "Urban Development", "Dhanbad", "Market Traders Union", "Assigned", 25, true],
  ["Illegal dumping polluting the river", "Industrial waste is being dumped into the Damodar tributary, killing fish.", "Environment", "Bokaro", "Green Bokaro Collective", "Under Review", 20, true],
  ["No ramp access at the block office", "Wheelchair users cannot enter the block office to access schemes.", "Accessibility", "Ranchi", "Divyang Welfare Group", "Submitted", 2, false],
  ["Ration card corrections pending for months", "Dozens of families have wrong names on ration cards and cannot get grain.", "Public Administration", "Giridih", "Panchayat Samiti", "Assigned", 18, false],
  ["MGNREGA wages delayed by 4 months", "Workers have not received wages for completed pond-digging work.", "Rural Livelihoods", "Latehar", "Labour Collective", "Under Review", 15, true],
  ["Hand pump water is contaminated", "Water from the community hand pump smells and is causing stomach illness.", "Water Resources", "Chatra", "Sunita Kumari", "In Progress", 12, true],
  ["No electricity in the new tola", "Forty new houses in the settlement have never been connected to the grid.", "Energy", "Khunti", "Ward Member", "Submitted", 1, false],
  ["Anganwadi centre building is unsafe", "The Anganwadi roof leaks and a wall is cracked; children sit outside.", "Education", "Simdega", "Anganwadi Sevika", "Assigned", 22, true],
  ["Stray cattle causing road accidents", "Uncontrolled stray cattle on the highway have caused several night accidents.", "Urban Development", "Deoghar", "Residents Welfare", "Under Review", 17, false],
  ["Malaria outbreak in monsoon", "Stagnant water is breeding mosquitoes; the PHC has run out of test kits.", "Healthcare", "Sahibganj", "ASHA Worker", "In Progress", 28, true],
  ["Soil turning acidic, yields falling", "Paddy yields have dropped sharply; farmers suspect soil acidity but have no testing.", "Agriculture", "Gumla", "Kisan Club", "Submitted", 4, false],
  ["Garbage not collected for weeks", "Household waste piles up on streets; no municipal collection in the ward.", "Sanitation", "Jamshedpur", "Mohalla Committee", "Assigned", 14, true],
  ["Forest fire threatening village", "Repeated dry-season fires are creeping toward homes at the forest edge.", "Environment", "West Singhbhum", "Van Suraksha Samiti", "Under Review", 33, true],
  ["No sign language support in schools", "Deaf students have no interpreter and are dropping out.", "Accessibility", "Ranchi", "Parents of Deaf Children", "Submitted", 6, false],
  ["Pension not credited to elderly widows", "Old-age and widow pensions have stopped without explanation.", "Public Administration", "Pakur", "Elderly Support Group", "In Progress", 21, false],
  ["Weavers cannot reach markets", "Tribal weavers have no market linkage and sell at throwaway prices to middlemen.", "Rural Livelihoods", "Dumka", "Handloom SHG", "Assigned", 26, true],
  ["School building has no drinking water", "Students bring water from home as the school tank is broken.", "Water Resources", "Koderma", "Headmaster", "Under Review", 19, true],
  ["Frequent voltage fluctuation burning appliances", "Unstable supply is damaging fans, pumps and TVs across the panchayat.", "Energy", "Ramgarh", "Consumer Group", "Submitted", 5, false],
  ["Mid-day meal quality is poor", "Children report undercooked food and no vegetables in the mid-day meal.", "Education", "Godda", "Mothers Committee", "In Progress", 23, true],
  ["Broken bridge cutting off village", "The only footbridge collapsed; children cannot cross to school in the rains.", "Urban Development", "Saraikela", "Gram Sabha", "Assigned", 35, true],
  ["No ambulance service in the block", "Pregnant women are carried on cots for hours to reach hospital.", "Healthcare", "Latehar", "Health Committee", "Under Review", 27, false],
  ["Seed subsidy not reaching farmers", "The subsidised seed never arrives; farmers buy costly seed from private shops.", "Agriculture", "Palamu", "Farmer Producer Org", "Submitted", 7, false],
  ["Public toilet locked and unusable", "The community toilet built two years ago has never been opened.", "Sanitation", "Ranchi", "Slum Residents", "Assigned", 16, true],
  ["Plastic waste choking the pond", "The village pond is full of plastic; cattle drink from it.", "Environment", "Hazaribagh", "Youth Club", "In Progress", 24, true],
  ["Blind students have no braille books", "The inclusive school received no braille textbooks this year.", "Accessibility", "Bokaro", "Special Educator", "Under Review", 29, false],
  ["Caste certificate stuck in office", "Students miss scholarship deadlines because certificates are delayed for months.", "Public Administration", "Chaibasa", "Student Union", "Submitted", 8, false],
  ["Bamboo artisans lack raw material", "Rising bamboo prices are pushing traditional artisans out of work.", "Rural Livelihoods", "Khunti", "Artisan Cooperative", "Assigned", 31, true],
  ["Canal silted, fields not irrigated", "The minor canal is fully silted; tail-end farmers get no water.", "Water Resources", "Garhwa", "Water Users Association", "In Progress", 37, true],
  ["Solar street lights not working", "Installed solar lights stopped within months; the village is dark at night.", "Energy", "Dhanbad", "Night Patrol Group", "Under Review", 13, true],
  ["Overcrowded classrooms, one teacher", "A single teacher handles 90 children across five classes.", "Education", "Sahibganj", "SMC Chairperson", "Submitted", 9, false],
  ["Waterlogging after every rain", "Poor drainage floods the colony; water enters homes for days.", "Urban Development", "Ranchi", "Colony Association", "Assigned", 34, true],
  ["TB patients dropping treatment", "No follow-up support means TB patients stop medicines midway.", "Healthcare", "Dumka", "Community Health Volunteer", "In Progress", 45, false],
  ["Wild elephants destroying crops", "Elephant herds trample standing crops nightly; farmers keep vigil with fire.", "Agriculture", "Saraikela", "Village Defence Group", "Under Review", 41, true],
  ["No waste segregation in town", "All waste is mixed and burned openly, causing smoke and health issues.", "Sanitation", "Deoghar", "Clean City Volunteers", "Submitted", 10, false],
];

async function uploadPhoto(i) {
  // Fetch a placeholder photo and upload it into the evidence bucket.
  const res = await fetch(`https://picsum.photos/seed/sih${i}/800/500`);
  if (!res.ok) throw new Error("picsum " + res.status);
  const buf = new Uint8Array(await res.arrayBuffer());
  const path = `seed/problem-${i}.jpg`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buf, { contentType: "image/jpeg", upsert: true });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

async function main() {
  let uploaded = 0;
  const rows = [];
  for (let i = 0; i < P.length; i++) {
    const [title, description, category, district, submitter_name, status, daysAgo, photo] = P[i];
    let photo_url = null;
    if (photo) {
      try {
        photo_url = await uploadPhoto(i);
        uploaded++;
        process.stdout.write(`  ✓ photo ${i}\r`);
      } catch (e) {
        console.log("  ! photo failed for", i, e.message);
      }
    }
    const assigned_to = ["Assigned", "In Progress", "Resolved"].includes(status)
      ? UNI[category]
      : null;
    rows.push({
      title,
      description,
      category,
      district,
      submitter_name,
      status,
      assigned_to,
      photo_url,
      created_at: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    });
  }

  console.log(`\nUploaded ${uploaded} photos to bucket. Inserting ${rows.length} rows...`);
  const { error } = await supabase.from("problems").insert(rows);
  if (error) {
    console.error("INSERT FAILED:", error.message);
    process.exit(1);
  }
  console.log(`✅ Inserted ${rows.length} problems.`);
}

main();
