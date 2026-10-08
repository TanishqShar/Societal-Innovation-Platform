# 🌐 Societal Innovation Platform (SIP)

<div align="center">

[![Repository](https://img.shields.io/badge/GitHub-Societal--Innovation--Platform-181717?style=for-the-badge&logo=github)](https://github.com/TanishqShar/Societal-Innovation-Platform)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285f4?style=for-the-badge&logo=google)](https://aistudio.google.com/)
[![NEP 2020](https://img.shields.io/badge/NEP_2020-Aligned-10b981?style=for-the-badge)](https://www.education.gov.in/nep-2020)
[![UN SDGs](https://img.shields.io/badge/UN_SDGs-17_Goals-E5243B?style=for-the-badge)](https://sdgs.un.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

<p align="center">
  <strong>An AI-powered closed-loop societal innovation ecosystem bridging grassroots community challenges, Higher Education Institutions (HEIs), and Industry CSR capital across regional districts and states.</strong>
</p>

[Quick Start](#-quick-start-guide) •
[Architecture & Innovation Loop](#-the-end-to-end-innovation-loop) •
[Core Modules](#-core-modules--workspaces) •
[AI & Matching Algorithms](#-ai-analysis--matching-algorithms) •
[TRL & IP Pipeline](#-technology-readiness-level-trl--ip-pipeline) •
[Database Architecture](#-dual-engine-database-architecture) •
[Jury Demo Walkthrough](#-jury--evaluator-demo-script)

</div>

---

## 📌 Problem Context & Vision

Grassroots communities across developing regions face acute, real-world challenges in **clean drinking water, agricultural pestilence, maternal healthcare access, erratic microgrid power, and sanitation**.

Simultaneously:
1. **Higher Education Institutions (HEIs)** possess immense multidisciplinary research and engineering capabilities, yet student capstone and research projects often remain theoretical, detached from community ground realities.
2. **Corporate & Industrial Enterprises** seek vetted, high-impact societal initiatives to deploy **Corporate Social Responsibility (CSR)** capital and equipment grants with transparent telemetry.
3. **Government & District Administrations** lack unified empirical pipelines to prioritize grassroots distress, commission targeted academic solutions, and track measurable outcomes.

The **Societal Innovation Platform (SIP)** bridges these stakeholders into a high-trust, collaborative ecosystem aligned with the **National Education Policy (NEP 2020)** for multidisciplinary experiential learning and the **United Nations Sustainable Development Goals (UN SDGs)**.

---

## 🔄 The End-to-End Innovation Loop

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                             THE CLOSED-LOOP INNOVATION PIPELINE                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
                                               │
    [1] CITIZEN INTAKE ──────► 4-Step Guided Wizard with Field Photo Evidence & Geo-tagging
                                               │
                                               ▼
    [2] AI UNDERSTANDING ────► Google Gemini 1.5 Flash + Deterministic NLP Fallback
                               (Categorization, Priority Score, Urgency, Required Disciplines,
                                Duplicate Detection & Suggested Interventions)
                                               │
                                               ▼
    [3] GOV VALIDATION ──────► District Administration authenticates & verifies community need
                                               │
                                               ▼
    [4] HEI AUTO-MATCHING ───► Deterministic 40/30/20/10 Algorithm ranks top Universities
                               (Evaluates Domain, Discipline Overlap, Faculty Bench & Proximity)
                                               │
                                               ▼
    [5] UNIVERSITY PROJECT ──► Matched HEI initializes multidisciplinary R&D workspace
                                               │
                                               ▼
    [6] MULTIDISCIPLINARY ───► Faculty Lead + Cross-department Students (Civil, CSE, ECE, Mech, Env)
        TEAM ROSTER
                                               │
                                               ▼
    [7] INDUSTRY CSR ────────► Corporate partners browse open needs & pledge grants, lab equipment
        COLLABORATION          or industrial mentorship
                                               │
                                               ▼
    [8] PROPOSAL & TRL ──────► Stage-gated lifecycle tracking:
        MILESTONES             Planning (TRL 1-3) → Prototype (TRL 4-5) → Field Pilot (TRL 6-7) → Deployed (TRL 8-9)
                                               │
                                               ▼
    [9] CITIZEN FEEDBACK ────► Verified 1–5 Star Community Ratings & Grassroots Testimonials
                                               │
                                               ▼
   [10] IMPACT TELEMETRY ────► Empirical state telemetry (Liters water treated, waste diverted,
                               lives touched, jobs created) rendered on Command Center Heatmaps
```

---

## 🚀 Core Modules & Workspaces

### 1. Citizen Problem Intake & Tracker (`/submit`, `/citizen`)
- **4-Step Progressive Intake Wizard**:
  - *Location & Geo-Context*: Multi-state and 24-district selector, Village/Ward tagging, and automated GPS tagging.
  - *Problem Description*: Challenge title, deep description, estimated affected population, and urgency rating.
  - *Field Evidence Upload*: Direct photo evidence upload to Supabase Storage with preview and metadata.
  - *AI Diagnostics Preview*: Real-time category classification preview before final confirmation.
- **Citizen Personal Portal**: Live status dashboard (`Submitted` → `Under Review` → `Assigned` → `In Progress` → `Deployed`), university contact details, and community rating forms.

### 2. Challenge Hub & Automated AI Diagnostics (`/challenges/[id]`)
- **7-Stage Visual Lifecycle Stepper**: Full status transitions with transparent audit logs.
- **AI Diagnostics Intelligence Panel**:
  - Domain mapping and subcategory extraction.
  - Multi-variable priority scoring (0–100) and urgency grading (`Critical`, `High`, `Medium`, `Low`).
  - Automated duplicate detection against historical challenges.
  - Recommended multidisciplinary academic disciplines and technological interventions.
- **Explainable University Matching**: Top 3 ranked Higher Education Institutions with itemized score breakdowns.
- **Proven Solutions Recommender**: Instant links to existing, field-tested innovations tackling similar problems.

### 3. Proven Solutions Catalog & Cross-State Scalability (`/solutions`, `/states/[state]`)
- **Solutions Repository**: Discover scalable, field-proven technologies and interventions ready for replication across districts and states.
- **Multi-State Scaling**: Dynamic regional portals supporting multi-state expansion with state-level KPI tracking.
- **Similarity Engine**: Natural language text vectorization and cosine similarity engine linking incoming problems to relevant established solutions.

### 4. University Innovation Hub & Multidisciplinary Projects (`/university`, `/projects/[id]`)
- **Institutional Workspace**: High-level KPIs tracking assigned challenges, active student projects, research labs, and milestone velocity.
- **Challenge Inbox**: Review AI-matched problems, accept assignments, or spawn new projects.
- **Multidisciplinary Team Builder**: Faculty leads assemble student rosters spanning diverse departments (*Computer Science, Mechanical, Civil, Electrical, Biotechnology, Environmental Sciences*).
- **Stage-Gated Proposal System**: Comprehensive project proposals with problem statements, technical architecture, budget itemization (₹), and milestones.
- **TRL Progress Tracker**: Granular stage progression from concept validation to pilot testing.

### 5. Industry Innovation & CSR Marketplace (`/industry`)
- **CSR Capital Dashboard**: Track industry capital commitments, active corporate partnerships, and funded university teams.
- **Sponsorship Marketplace**: Filter open societal problems by domain, funding gap, or required industrial equipment.
- **Interactive Pledge Flow**: Corporate partners pledge financial grants, donate lab hardware, provide technical mentorship, or license tech transfer.

### 6. State Command Center & Visual Analytics (`/analytics`)
- **Interactive Regional Heatmap**: Spatial density visualizer covering administrative divisions and districts with localized problem drill-downs.
- **8 Interactive Recharts Visualizations**:
  1. *Challenges by Thematic Domain* (11 NEP categories)
  2. *Challenge Status Distribution* (Funnel breakdown across lifecycle)
  3. *District/Regional Problem Concentration* (Heatmap & bar breakdown)
  4. *Innovation Pipeline Velocity Trend* (Submission vs. resolution velocity)
  5. *Project Conversion Funnel* (Intake to deployment)
  6. *Verified Societal Impact Metrics* (Citizens impacted, water saved, waste diverted, rural jobs)
  7. *University Innovation League Table* (HEI project volume & rankings)
  8. *Industry CSR Engagement* (Corporate funding breakdown)

### 7. Intellectual Property & Incubation Ecosystem (`/dashboard`, `/university`)
- **IP & Patent Registry**: Track patent filings, provisional disclosures, and technology transfer agreements originating from university projects.
- **Incubator Integration**: Connect university spinoffs and student startups with regional incubation centres and seed funding.

---

## 🧠 AI Analysis & Matching Algorithms

### 1. Dual-Mode AI Diagnostics Pipeline (`lib/ai.ts`)

1. **Google Gemini 1.5 Flash (Primary)**:
   - Evaluates citizen problem text and generates structured JSON diagnostics:
     - `category`: Mapped to one of the 11 NEP domains.
     - `subcategory`: Specific thematic subfield.
     - `priority` & `priority_score`: Calculated multi-variable urgency (0–100).
     - `impact_score` & `urgency_score`: Affected population severity index.
     - `duplicate_score`: Semantic similarity check against database challenges.
     - `required_disciplines`: 2–5 academic disciplines required for solution.
     - `recommended_solution_types`: Concrete technological interventions.
2. **Deterministic NLP Fallback Engine (Zero-Downtime Guarantee)**:
   - If the `GEMINI_API_KEY` is omitted or network limits occur, the platform instantaneously executes rule-based keyword classification (`lib/domain.ts`) and priority calculators (`lib/priority.ts`), ensuring **100% uninterrupted offline operation**.

### 2. University Matching Engine (`lib/matching.ts`)

Matches societal challenges to Higher Education Institutions using a deterministic, explainable **40 / 30 / 20 / 10** weighted formula:

$$\text{Score} = S_{\text{domain}} (40\%) + S_{\text{discipline}} (30\%) + S_{\text{capability}} (20\%) + S_{\text{location}} (10\%)$$

| Component | Weight | Calculation Logic |
|---|---|---|
| **Domain Match** ($S_{\text{domain}}$) | **40%** | Full 40 points if the university lists this NEP domain as an official institutional focus area. |
| **Discipline Overlap** ($S_{\text{discipline}}$) | **30%** | Proportional score based on the overlap between AI-required disciplines and active departments at the HEI: $\frac{|\text{Matched Disciplines}|}{|\text{Required Disciplines}|} \times 30$. |
| **Institutional Capability** ($S_{\text{capability}}$) | **20%** | Capability score derived from accredited engineering and scientific departments ($\min(20, \frac{|\text{Disciplines}|}{8} \times 20)$). |
| **Geographic Proximity** ($S_{\text{location}}$) | **10%** | Proximity factor prioritizing institutions located in or adjacent to the challenge district. |

---

## 📈 Technology Readiness Level (TRL) & IP Pipeline

The platform enforces a structured **TRL 1–9 maturity progression**:

| TRL Band | Stage Name | Description | Platform Deliverables |
|:---:|---|---|---|
| **TRL 1–3** | **Concept & Ideation** | Basic principles observed, technology concept formulated, and analytical proof of concept. | Problem definition, multidisciplinary team roster, literature survey. |
| **TRL 4–5** | **Laboratory Validation** | Component validation in laboratory environment; basic prototype assembled. | Lab test bench results, prototype CAD models, initial proposal approval. |
| **TRL 6–7** | **Field Demonstration** | Model demonstration in relevant field environment; pilot plant or operational prototype. | Field trial logs, citizen feedback ratings, CSR equipment sponsorship. |
| **TRL 8–9** | **Full Deployment & Transfer** | Actual system completed and qualified; commercial or municipal deployment. | Impact telemetry, IP / Patent filing, Technology Transfer Office (TTO) licensing. |

---

## 🎓 National Policy & SDG Alignment

### National Education Policy (NEP 2020) Alignment
| NEP 2020 Mandate | Implementation in Platform |
|---|---|
| **Multidisciplinary Education** | Projects mandate cross-department rosters combining Engineering, Computer Science/IoT, Environmental Sciences, and Humanities. |
| **Experiential Learning** | Theoretical capstones replaced with real grassroots societal problems submitted by citizens. |
| **Industry-Academia Linkage** | Direct CSR marketplace connecting corporate sponsors to university innovation teams. |
| **Community Engagement** | Citizen feedback loop where residents rate deployed solutions, ensuring ground accountability. |
| **Academic Credit & Proof-of-Work** | Stage-gated milestone tracking provides verifiable audit trails for academic evaluation. |

### UN Sustainable Development Goals (SDG) Alignment
The platform natively maps societal challenges to key UN SDGs:
- 💧 **SDG 6 (Clean Water & Sanitation)**: Potable water purification, borewell maintenance, wastewater management.
- ⚡ **SDG 7 (Affordable & Clean Energy)**: Solar microgrids, rural electrification, biomethanation.
- 🌾 **SDG 2 (Zero Hunger)**: Precision agriculture, cold storage, pest diagnosis, soil regeneration.
- 🏥 **SDG 3 (Good Health & Well-being)**: Maternal healthcare logistics, PHC diagnostic toolkits, waterborne disease tracking.
- 🏗️ **SDG 9 (Industry, Innovation & Infrastructure)**: Rural bridges, digital public infrastructure, local manufacturing.
- 🏙️ **SDG 11 (Sustainable Cities & Communities)**: Solid waste sorting, rainwater harvesting, municipal drainage.

---

## 💾 Dual-Engine Database Architecture

The platform employs a resilient **dual-engine architecture** designed for both zero-setup instant local evaluation and production cloud deployment:

```text
                     ┌───────────────────────────────────┐
                     │         Data Access Layer         │
                     │            (lib/db.ts)            │
                     └─────────────────┬─────────────────┘
                                       │
                    Is NEXT_PUBLIC_SUPABASE_URL set?
                                       │
                     ┌─────────────────┴─────────────────┐
                     ▼                                   ▼
                [ YES ]                             [ NO ]
      ┌───────────────────────────┐       ┌───────────────────────────┐
      │    Cloud Supabase DB      │       │ Zero-Config In-Memory DB  │
      │   PostgreSQL + RLS +      │       │ 42+ Pre-Seeded Challenges │
      │     Storage Buckets       │       │ Across 24 Districts       │
      └───────────────────────────┘       └───────────────────────────┘
```

1. **Zero-Config In-Memory Engine (Default for Instant Evaluation)**:
   - Operates out-of-the-box with **zero external dependencies or database setups**.
   - Contains **42+ realistic pre-seeded challenges** across diverse districts and domains.
   - Fully loaded with multidisciplinary teams, approved proposals, milestones, CSR sponsorships, and verified community testimonials.
2. **Cloud Supabase PostgreSQL Engine (Production Persistence)**:
   - Full PostgreSQL schema with automated Row Level Security (RLS).
   - Dedicated Supabase Storage bucket (`evidence`) for survey photo uploads.
   - Comprehensive SQL migration scripts ([`supabase-schema.sql`](./supabase-schema.sql), [`supabase-migration.sql`](./supabase-migration.sql), [`supabase-migration-v2.sql`](./supabase-migration-v2.sql)).

---

## 👥 Role-Based Access Control (RBAC) & Personas

The platform includes 5 pre-configured personas accessible via 1-click login on [`/login`](http://localhost:3000/login):

| Persona | Role Key | Landing Page | Primary Capabilities |
|---|---|---|---|
| **Citizen** | `citizen` | `/citizen` | Submit community challenges, attach photo evidence, track progress, submit star ratings. |
| **University Faculty/Student** | `university` | `/university` | Review matched challenges, initialize projects, build multidisciplinary rosters, draft proposals, update milestones. |
| **Industry CSR Lead** | `industry` | `/industry` | Browse unfunded challenges, pledge CSR grants/equipment, track project milestones and impact telemetry. |
| **District Officer / Govt** | `government` | `/analytics` | Validate submissions, monitor district concentration, review impact telemetry, inspect state conversion funnels. |
| **State Portal Administrator** | `admin` | `/dashboard` | Complete end-to-end management: validation, manual HEI re-routing, proposal review, and audit controls. |

> **Demo Staff Password**: `demo123` (Pre-filled on the 1-click login screen for all staff personas).

---

## 📂 Repository Structure

```text
Societal-Innovation-Platform/
├── app/
│   ├── actions.ts                  # Server Actions (Auth, Submissions, Proposals, Milestones, Feedback)
│   ├── analytics/page.tsx          # Command Center (Regional Heatmap & 8 Recharts Visualizations)
│   ├── challenges/[id]/page.tsx    # Challenge Detail (AI Diagnostics, HEI Matches, Community Feedback)
│   ├── citizen/page.tsx            # Citizen Dashboard & Personal Challenge Tracker
│   ├── dashboard/page.tsx          # Administrator Console & Operational Management
│   ├── industry/page.tsx           # Industry Hub & CSR Sponsorship Marketplace
│   ├── login/page.tsx              # Role-based 1-click demo authentication
│   ├── notifications/page.tsx      # In-app notification center
│   ├── problems/page.tsx           # Public searchable problem directory
│   ├── projects/
│   │   ├── page.tsx                # University Projects Directory
│   │   ├── new/page.tsx            # New Project Creation Wizard
│   │   └── [id]/page.tsx           # Project Workspace (Lifecycle, Team, Proposal, Milestones, TRL)
│   ├── solutions/
│   │   └── page.tsx                # Proven Solutions Catalog & Cross-District Innovation Explorer
│   ├── states/
│   │   └── [state]/page.tsx        # Multi-State Scalability & Regional Command Portals
│   ├── submit/page.tsx             # 4-Step Citizen Intake Form
│   ├── university/page.tsx         # University Workspace & Challenge Inbox
│   ├── globals.css                 # Tailwind CSS v4 styling & design tokens
│   └── layout.tsx                  # Root layout, role-aware navigation bar & toast provider
├── components/
│   ├── ai-analysis-panel.tsx       # AI Diagnostics, subcategory & discipline display
│   ├── badges.tsx                  # Color-coded badges for statuses, priorities & domains
│   ├── charts.tsx                  # Recharts visualizations (Pie, Bar, Funnel, Line)
│   ├── district-map.tsx            # Interactive Regional District Map Visualizer
│   ├── milestone-list.tsx          # Interactive milestone tracker with progress toggles
│   ├── multistep-submit-form.tsx   # 4-Step progressive intake wizard
│   ├── notification-bell.tsx       # Notification bell with unread badges
│   ├── photo-upload.tsx            # Field evidence image uploader with preview
│   ├── problems-explorer.tsx       # Searchable problem explorer with multi-filters
│   ├── project-discussion.tsx      # Project collaboration and discussion thread
│   ├── proposal-panel.tsx          # Solution proposal editor & approval workflow
│   ├── similar-and-solutions.tsx   # Similar problems & proven solutions recommender
│   ├── team-builder.tsx            # Multidisciplinary student/faculty roster builder
│   ├── toast-provider.tsx          # Context-based action toast alert system
│   └── university-matches.tsx      # Top 3 university match cards with score details
├── lib/
│   ├── ai.ts                       # Google Gemini 1.5 Flash client & NLP fallback engine
│   ├── auth.ts                     # Cookie-based session & role-guard utilities
│   ├── db.ts                       # Dual-engine database (Supabase + 42 In-Memory Seed Records)
│   ├── domain.ts                   # 11 NEP domains, regional districts, HEI metadata & dictionaries
│   ├── matching.ts                 # 40/30/20/10 University Matching Algorithm
│   ├── priority.ts                 # Multi-factor priority calculation engine
│   ├── similarity.ts               # Cosine / TF-IDF text similarity & duplicate detection engine
│   ├── supabase-browser.ts         # Client-side Supabase instance
│   └── types.ts                    # TypeScript schemas for all platform entities
├── public/                         # Static assets and icons
├── scripts/
│   ├── seed.mjs                    # Standalone script to populate cloud Supabase instance
│   ├── verify-all-flows.mjs        # End-to-end integration test runner
│   └── verify-part2.mjs            # Secondary verification suite
├── supabase-schema.sql             # Base SQL tables & RLS policies
├── supabase-migration.sql          # SQL migration v1 (Projects, Proposals, Members, Milestones)
├── supabase-migration-v2.sql       # SQL migration v2 (Startups, Patents, TTO, TRL, SDG mappings)
├── supabase-storage.sql            # Evidence storage bucket setup & policies
├── .env.example                    # Environment variable template
├── package.json                    # Project metadata & dependencies
└── tsconfig.json                   # TypeScript configuration
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: `v18.17.0+` (Node.js 20 or 22 recommended)
- **npm** or **pnpm**

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/TanishqShar/Societal-Innovation-Platform.git

# Navigate into the project folder
cd Societal-Innovation-Platform

# Install dependencies
npm install
```

### 2. Configure Environment Variables (Optional)

The platform runs **out of the box with zero external configuration** using its in-memory dual engine. To connect live Google Gemini AI and persistent Supabase cloud storage:

```bash
# Copy template
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Optional: Supabase credentials (from https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key

# Optional: Google Gemini API Key (from https://aistudio.google.com)
GEMINI_API_KEY=your-gemini-api-key
```

### 3. Start Development Server

```bash
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## ☁️ Cloud Supabase Setup (Optional)

To connect a persistent cloud database:

1. Create a free project at [supabase.com](https://supabase.com).
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Run the SQL scripts in order:
   - [`supabase-schema.sql`](./supabase-schema.sql) — Base `problems` table & policies.
   - [`supabase-migration.sql`](./supabase-migration.sql) — `projects`, `proposals`, `members`, `milestones`, `industry`, `telemetry`.
   - [`supabase-migration-v2.sql`](./supabase-migration-v2.sql) — `startups`, `patents`, `incubation_centres`, `trl_levels`.
   - [`supabase-storage.sql`](./supabase-storage.sql) — `evidence` storage bucket policies.
4. *(Optional)* Seed cloud data:
   ```bash
   node scripts/seed.mjs
   ```

---

## 🏆 Jury / Evaluator Demo Script

Follow this structured 5-minute walkthrough during presentations:

| Step | Route | Action & Talking Points |
|:---:|---|---|
| **1. The Vision & Loop** | `/` | **Landing Page**: Point out live impact telemetry (42+ challenges, regional districts, ₹34L+ CSR funds). Explain the **10-step Innovation Pipeline** and alignment with **NEP 2020** & **UN SDGs**. |
| **2. Citizen Intake** | `/submit` | **Citizen Wizard**: Walk through the 4-step intake. Select a district, describe a real problem, upload photo evidence, and submit. Highlight the instant AI classification. |
| **3. Hero Challenge & AI Matching** | `/challenges/seed-hero-1` | **AI Diagnostics & Matching**: Review *"Village residents in Dumka facing drinking water quality problems"*. Point out: (1) AI extracted disciplines, (2) Top university match via the 40/30/20/10 algorithm, and (3) verified community star ratings. |
| **4. Solutions Catalog** | `/solutions` | **Proven Solutions**: Show how similar problems cross-reference existing, proven technological interventions to avoid reinventing the wheel. |
| **5. Multidisciplinary Project Hub** | `/projects/proj-hero-1` | **Execution Workspace**: Show the **TRL Lifecycle Stepper**, **Multidisciplinary Team Roster** (Faculty Lead + cross-department students), approved proposal, and **Corporate CSR Grant** (₹4.5 Lakh). |
| **6. Industry CSR Marketplace** | `/industry` | **CSR Hub**: Browse challenges seeking funding. Click **Express Interest** to demonstrate corporate grant pledging (Financial, Equipment, Mentorship). |
| **7. State Command Center** | `/analytics` | **Visual Analytics**: Interact with the **District Heatmap**, **8 Recharts Visualizations**, and **Verified Telemetry** (18,400+ citizens impacted, 2.4M liters of water saved). |
| **8. 1-Click Persona Switching** | `/login` | **Instant RBAC**: Demonstrate seamless switching between `Citizen`, `University`, `Industry`, `Government`, and `Admin` personas. |

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 16.3.4 (App Router & Turbopack) | Server-side rendering, Server Actions, streaming, fast development builds |
| **Language** | TypeScript 5 | End-to-end static type safety across schemas, matching, and APIs |
| **UI & Styling** | React 19.2.8 + Tailwind CSS v4 | High-performance modern utility CSS and component architecture |
| **Icons** | Lucide React | Clean, lightweight, accessible iconography |
| **Charts** | Recharts 3.10.1 | Responsive SVG charts (Bar, Pie, Funnel, Line) |
| **Database** | Supabase (PostgreSQL) + Zero-Config In-Memory Engine | Scalable SQL backend with instant zero-downtime offline fallback |
| **AI / NLP** | Google Gemini 1.5 Flash + Fallback NLP Classifier | High-accuracy LLM analysis backed by deterministic keyword heuristics |
| **Storage** | Supabase Storage (`evidence` bucket) | Field photo survey uploads with secure public URLs |
| **Authentication** | Role-Guarded Cookie Sessions | Fast, frictionless persona switching tailored for evaluations |

---

## 🗺️ The 11 Thematic Domains

1. 💧 **Water Resources**: Potable water quality, groundwater depletion, tubewell maintenance, reservoir management.
2. 🌾 **Agriculture**: Crop blight diagnosis, soil acidity, micro-irrigation, cold storage, seed distribution.
3. 🏥 **Healthcare**: Primary healthcare center access, maternal nutrition, telemedicine, malaria surveillance.
4. ⚡ **Energy**: Solar microgrids, rural electrification, agricultural feeder voltage stabilization.
5. 🚽 **Sanitation**: Solid waste management, blackwater drainage, school sanitation facilities.
6. 🌲 **Environment & Forests**: Industrial effluent monitoring, mine reclamation, human-wildlife conflict mitigation.
7. 🏙️ **Urban & Rural Infrastructure**: Drainage congestion, market infrastructure, rural link roads, bridge safety.
8. ♿ **Accessibility**: Assistive technology, braille/sign language support, barrier-free public infrastructure.
9. 🏛️ **Public Administration**: Digital grievance redressal, certificate delivery, welfare scheme transparency.
10. 🧵 **Rural Livelihoods**: Tribal handicraft cooperatives, lac cultivation, bamboo processing, SHG market linkage.
11. 📚 **Quality Education**: Digital classrooms, STEM laboratory access, teacher shortage support.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m "Add amazing feature"`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ for Societal Impact and Innovation by <strong>Tanishq Sharma</strong>.</sub>
</div>
