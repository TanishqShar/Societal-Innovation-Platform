"use client";

import { useState } from "react";
import {
  FileText,
  MapPin,
  Camera,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Navigation,
  Loader2,
  Languages,
} from "lucide-react";
import { STATES, STATE_DISTRICTS } from "@/lib/domain";
import { submitProblem } from "@/app/actions";

export function MultiStepSubmitForm() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [selectedState, setSelectedState] = useState<string>("Jharkhand");
  const [district, setDistrict] = useState(STATE_DISTRICTS["Jharkhand"][0]);
  const [villageWard, setVillageWard] = useState("");
  const [submitterName, setSubmitterName] = useState("");
  const [submitterType, setSubmitterType] = useState<"citizen" | "panchayat" | "ulb" | "community_org" | "government">("citizen");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [locationLat, setLocationLat] = useState<number | null>(null);
  const [locationLng, setLocationLng] = useState<number | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");

  const steps = [
    { num: 1, label: lang === "hi" ? "स्थान (राज्य/जिला)" : "Location", icon: MapPin },
    { num: 2, label: lang === "hi" ? "समस्या का विवरण" : "The Problem", icon: FileText },
    { num: 3, label: lang === "hi" ? "फोटो व वीडियो" : "Evidence", icon: Camera },
    { num: 4, label: lang === "hi" ? "समीक्षा व AI" : "Review & AI", icon: Sparkles },
  ];

  const handleNext = () => {
    if (step === 1 && (!selectedState || !district)) {
      alert(lang === "hi" ? "कृपया राज्य और जिला चुनें।" : "Please select both a state and district.");
      return;
    }
    if (step === 2 && (!title.trim() || !description.trim())) {
      alert(lang === "hi" ? "कृपया समस्या का शीर्षक और विस्तृत विवरण दोनों दर्ज करें।" : "Please provide both a title and description for the problem.");
      return;
    }
    setStep((prev) => Math.min(4, prev + 1));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGpsError(lang === "hi" ? "आपके ब्राउज़र में जीपीएस सुविधा उपलब्ध नहीं है।" : "Geolocation is not supported by your browser.");
      return;
    }
    setGpsLoading(true);
    setGpsError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationLat(parseFloat(pos.coords.latitude.toFixed(6)));
        setLocationLng(parseFloat(pos.coords.longitude.toFixed(6)));
        setGpsLoading(false);
      },
      (err) => {
        setGpsError(lang === "hi" ? "स्थान प्राप्त करने में विफल (कृपया अनुमति दें)" : `GPS error: ${err.message}`);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="card p-4 sm:p-6 md:p-8 space-y-6 bg-white shadow-sm border border-black/10">
      {/* Top Bar: Language Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-black/5 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-xs text-black/55 font-medium">
          <Languages size={14} className="text-brand" />
          <span>{lang === "hi" ? "भाषा चुनें / Select Language:" : "Language:"}</span>
        </div>
        <div className="flex items-center rounded-lg border border-black/10 p-0.5 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`px-3 py-1 rounded-md transition ${lang === "en" ? "bg-white text-brand shadow-xs" : "text-black/55 hover:text-black"}`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLang("hi")}
            className={`px-3 py-1 rounded-md transition ${lang === "hi" ? "bg-white text-brand shadow-xs" : "text-black/55 hover:text-black"}`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-2">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;

            return (
              <div
                key={s.num}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                  isCurrent
                    ? "border-brand bg-brand/5 ring-1 ring-brand text-brand-dark font-bold"
                    : isCompleted
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold"
                    : "border-black/5 bg-slate-50 text-black/40 font-medium"
                }`}
              >
                <div className="flex items-center justify-center gap-1 text-xs">
                  {isCompleted ? (
                    <CheckCircle2 size={14} className="text-emerald-600" />
                  ) : (
                    <Icon size={14} className={isCurrent ? "text-brand" : "text-black/40"} />
                  )}
                  <span className="hidden sm:inline">Step {s.num}</span>
                </div>
                <span className="text-[11px] truncate w-full">{s.label}</span>
              </div>
            );
          })}
        </div>
        {/* Continuous progress indicator */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-brand h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Progressive Form Form Container */}
      <form
        action={async (formData: FormData) => {
          setIsSubmitting(true);
          try {
            await submitProblem(formData);
          } finally {
            setIsSubmitting(false);
          }
        }}
        className="space-y-6"
      >
        {/* Hidden inputs to preserve multi-step state */}
        <input type="hidden" name="title" value={title} />
        <input type="hidden" name="description" value={description} />
        <input type="hidden" name="state" value={selectedState} />
        <input type="hidden" name="district" value={district} />
        <input type="hidden" name="village_ward" value={villageWard} />
        <input type="hidden" name="submitter_name" value={submitterName} />
        <input type="hidden" name="submitter_type" value={submitterType} />
        <input type="hidden" name="photo_url" value={photoUrl} />
        <input type="hidden" name="video_url" value={videoUrl} />
        <input type="hidden" name="location_lat" value={locationLat ?? ""} />
        <input type="hidden" name="location_lng" value={locationLng ?? ""} />

        {/* STEP 1: State, District, Local Area (Village/Ward) */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold">
                {lang === "hi" ? "चरण 1: राज्य, जिला व स्थानीय क्षेत्र" : "Step 1: State, District & Local Area"}
              </h2>
              <p className="text-sm text-black/60 mt-1">
                {lang === "hi"
                  ? "समस्या का प्रशासनिक राज्य, जिला और गांव/वार्ड दर्ज करें ताकि सही क्षेत्रीय संस्थान को कार्य सौंपा जा सके।"
                  : "Specify the state, district, and local village/ward for institutional matching and regional routing."}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">{lang === "hi" ? "राज्य" : "State"}</span>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    const newState = e.target.value;
                    setSelectedState(newState);
                    const firstDistrict = STATE_DISTRICTS[newState as keyof typeof STATE_DISTRICTS]?.[0] ?? "";
                    setDistrict(firstDistrict);
                  }}
                  required
                  className="input mt-1.5"
                >
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-900">{lang === "hi" ? "जिला" : "District"}</span>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                  className="input mt-1.5"
                >
                  {(STATE_DISTRICTS[selectedState as keyof typeof STATE_DISTRICTS] ?? []).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                {lang === "hi" ? "स्थानीय क्षेत्र (गांव / वार्ड / पंचायत / ब्लॉक)" : "Local Area (Village / Ward / Panchayat / Block)"}
              </span>
              <input
                value={villageWard}
                onChange={(e) => setVillageWard(e.target.value)}
                placeholder={lang === "hi" ? "उदा: जामा प्रखंड, वार्ड नं 4" : "e.g. Talwandi Sabo, Ward 3 or Jama Block, Ward 4"}
                className="input mt-1.5"
              />
            </label>

            {/* Submitter Entity Type */}
            <div>
              <span className="text-sm font-semibold text-slate-900 block mb-1.5">
                {lang === "hi" ? "प्रस्तुतकर्ता का प्रकार (संस्था / नागरिक)" : "Submitter Entity Type"}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {([
                  { value: "citizen", label: lang === "hi" ? "नागरिक (व्यक्तिगत)" : "Citizen (Individual)", icon: "🧑‍🌾" },
                  { value: "panchayat", label: lang === "hi" ? "ग्राम पंचायत (PRI)" : "Panchayat (PRI)", icon: "🏛️" },
                  { value: "ulb", label: lang === "hi" ? "नगर निगम (ULB)" : "Urban Local Body (ULB)", icon: "🏢" },
                  { value: "community_org", label: lang === "hi" ? "स्वयं सहायता समूह / NGO" : "Community Org / NGO", icon: "🤝" },
                  { value: "government", label: lang === "hi" ? "सरकारी विभाग" : "Government Line Dept", icon: "📋" },
                ] as const).map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setSubmitterType(t.value)}
                    className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                      submitterType === t.value
                        ? "border-brand bg-brand/5 ring-1 ring-brand text-brand-dark font-semibold"
                        : "border-black/10 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className="text-xl shrink-0">{t.icon}</span>
                    <span className="text-xs leading-tight">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                {lang === "hi" ? "प्रस्तुतकर्ता का नाम" : "Submitter / Contact Name"}
              </span>
              <span className="text-xs text-black/45 ml-2">
                {lang === "hi" ? "(वैकल्पिक - सार्वजनिक रूप से छुपा रहेगा)" : "(Optional - kept private)"}
              </span>
              <input
                value={submitterName}
                onChange={(e) => setSubmitterName(e.target.value)}
                placeholder={lang === "hi" ? "उदा: संतोष सोरेन / ग्राम प्रधान" : "e.g. Rajesh Kumar / Gram Pradhan"}
                className="input mt-1.5"
              />
            </label>
          </div>
        )}

        {/* STEP 2: Problem Title & Description */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold">
                {lang === "hi" ? "चरण 2: सामुदायिक चुनौती का विवरण दें" : "Step 2: Describe the Problem"}
              </h2>
              <p className="text-sm text-black/60 mt-1">
                {lang === "hi"
                  ? "अपने गांव, पंचायत या शहर की समस्या का स्पष्ट शीर्षक और विस्तृत विवरण लिखें।"
                  : "Provide a clear headline and detailed explanation of the issue affecting your community."}
              </p>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                {lang === "hi" ? "समस्या का शीर्षक" : "Problem Title"}
              </span>
              <span className="text-xs text-black/45 ml-2">
                {lang === "hi" ? "(संक्षिप्त मुख्य समाचार)" : "(Short, clear headline)"}
              </span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={120}
                placeholder={lang === "hi" ? "उदा: पेयजल में फ्लोराइड और गंदगी की गंभीर समस्या" : "e.g. Village residents facing severe drinking water contamination"}
                className="input mt-1.5"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                {lang === "hi" ? "विस्तृत विवरण" : "Detailed Problem Description"}
              </span>
              <span className="text-xs text-black/45 ml-2">
                {lang === "hi" ? "(कितने लोग प्रभावित हैं, कब से, और कितनी गंभीरता है?)" : "(Who is affected, since when, and how severe?)"}
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                placeholder={lang === "hi"
                  ? "स्थिति का विस्तार से वर्णन करें। उदाहरण: चापाकल और बोरवेल का पानी लाल और मटमैला आ रहा है। 1,200 ग्रामीण पेट और हड्डियों के दर्द से पीड़ित हैं..."
                  : "Explain the situation in detail. For example: Groundwater handpumps contain high iron and fluoride turbidity. Over 1,200 villagers suffer from health issues and must travel 3 km daily..."}
                className="input mt-1.5 leading-relaxed"
              />
            </label>

            {/* AI auto-categorization banner note */}
            <div className="p-3.5 rounded-xl bg-brand/5 border border-brand/15 flex items-start gap-3">
              <Sparkles size={18} className="text-brand shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong>{lang === "hi" ? "श्रेणी चुनने की आवश्यकता नहीं:" : "No category selection required:"}</strong>{" "}
                {lang === "hi"
                  ? "हमारा जेमिनी AI सबमिट करते ही समस्या की सही थीम (जल संसाधन, कृषि, स्वास्थ्य आदि), प्रभाव स्कोर और प्राथमिकता का स्वतः निर्धारण करेगा।"
                  : "Integrated Gemini AI automatically detects the thematic domain (Water Resources, Healthcare, Agriculture, etc.), computes urgency scores, and maps required engineering disciplines upon submission."}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Photo / Evidence, Video, GPS */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold">
                {lang === "hi" ? "चरण 3: साक्ष्य, फोटो व वीडियो" : "Step 3: Evidence, Photos & Videos"}
              </h2>
              <p className="text-sm text-black/60 mt-1">
                {lang === "hi"
                  ? "समस्या की वास्तविकता सिद्ध करने के लिए फोटो, वीडियो लिंक या जीपीएस पिन संलग्न करें।"
                  : "Attach real-world evidence, on-ground photos, video links, or precise GPS pin for validation."}
              </p>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                {lang === "hi" ? "फोटो / दस्तावेज़ लिंक (URL)" : "Photo Evidence URL"}
              </span>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or uploaded photo link"
                className="input mt-1.5"
              />
            </label>

            {/* Quick Demo Pre-fill Photo Buttons */}
            <div>
              <span className="text-xs font-semibold text-black/50 block mb-1.5">
                {lang === "hi" ? "त्वरित डेमो हेतु नमूना फोटो चुनें:" : "Or select sample evidence photo for demonstration:"}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "Water Turbidity", url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80" },
                  { label: "Crop Residue", url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80" },
                  { label: "Rural Road", url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80" },
                  { label: "Community Clinic", url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80" },
                ].map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={() => setPhotoUrl(sample.url)}
                    className="p-2 rounded-lg border border-black/10 hover:border-brand bg-slate-50 text-xs text-left truncate transition"
                  >
                    📷 {sample.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                {lang === "hi" ? "वीडियो विवरण लिंक (वैकल्पिक)" : "Video Evidence Link (Optional)"}
              </span>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or Vimeo"
                className="input mt-1.5"
              />
            </label>

            {/* GPS Geolocation Detector */}
            <div className="p-4 rounded-xl border border-black/10 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Navigation size={14} className="text-brand" />
                    <span>{lang === "hi" ? "सटीक जीपीएस निर्देशांक" : "Precise GPS Geolocation"}</span>
                  </div>
                  <p className="text-[11px] text-black/55 mt-0.5">
                    {lang === "hi" ? "मैप पर सटीक स्थान दर्ज करने के लिए अपना जीपीएस ऑन करें।" : "Attach exact geographical coordinates for drone and ground surveys."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={gpsLoading}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-black/15 px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 transition shadow-2xs"
                >
                  {gpsLoading ? (
                    <>
                      <Loader2 size={13} className="animate-spin text-brand" />
                      <span>{lang === "hi" ? "स्थान खोज रहे हैं..." : "Detecting..."}</span>
                    </>
                  ) : (
                    <>
                      <MapPin size={13} className="text-brand" />
                      <span>{lang === "hi" ? "📍 वर्तमान स्थान प्राप्त करें" : "📍 Detect Location"}</span>
                    </>
                  )}
                </button>
              </div>

              {locationLat && locationLng && (
                <div className="inline-flex items-center gap-2 text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-md">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>GPS: {locationLat}, {locationLng}</span>
                </div>
              )}
              {gpsError && (
                <p className="text-xs text-red-600">{gpsError}</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Review, Auto-Categorization & Submit */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 size={22} className="text-brand" />
                {lang === "hi" ? "चरण 4: समीक्षा व सबमिट करें" : "Step 4: Review and Submit"}
              </h2>
              <p className="text-sm text-black/60 mt-1">
                {lang === "hi"
                  ? "दर्ज विवरण की पुष्टि करें। सबमिट करने पर पोर्टल तुरंत AI मूल्यांकन व विश्वविद्यालय मैचिंग करेगा।"
                  : "Confirm your details. Upon submission, the platform runs instant Gemini AI evaluation and institution matching."}
              </p>
            </div>

            {/* Review Summary Card */}
            <div className="rounded-xl border border-black/10 p-4 bg-slate-50 space-y-3">
              <div>
                <div className="text-xs text-black/45 font-bold uppercase tracking-wider">{lang === "hi" ? "समस्या का शीर्षक" : "Problem Headline"}</div>
                <div className="text-base font-semibold text-slate-900 mt-0.5">{title}</div>
              </div>

              <div>
                <div className="text-xs text-black/45 font-bold uppercase tracking-wider">{lang === "hi" ? "विवरण" : "Description"}</div>
                <div className="text-sm text-slate-700 mt-0.5 leading-relaxed">{description}</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-black/5 text-xs">
                <div>
                  <span className="text-black/45">{lang === "hi" ? "राज्य:" : "State:"}</span> <strong>{selectedState}</strong>
                </div>
                <div>
                  <span className="text-black/45">{lang === "hi" ? "जिला:" : "District:"}</span> <strong>{district}</strong>
                </div>
                <div>
                  <span className="text-black/45">{lang === "hi" ? "स्थान:" : "Local Area:"}</span> <strong>{villageWard || (lang === "hi" ? "अनिर्दिष्ट" : "Not specified")}</strong>
                </div>
                <div>
                  <span className="text-black/45">{lang === "hi" ? "प्रस्तुतकर्ता:" : "Submitter:"}</span> <strong className="capitalize">{submitterType} ({submitterName || "Anonymous"})</strong>
                </div>
                {locationLat && locationLng && (
                  <div className="col-span-2">
                    <span className="text-black/45">GPS:</span> <strong className="font-mono">{locationLat}, {locationLng}</strong>
                  </div>
                )}
                {videoUrl && (
                  <div className="col-span-2 truncate">
                    <span className="text-black/45">Video:</span> <span className="font-mono text-brand">{videoUrl}</span>
                  </div>
                )}
              </div>

              {photoUrl && (
                <div className="pt-2 border-t border-black/5 flex items-center gap-3">
                  <span className="text-xs text-black/45 font-semibold">{lang === "hi" ? "संलग्न फोटो:" : "Attached Evidence:"}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoUrl} alt="Attached Evidence" className="h-14 w-20 object-cover rounded-lg border border-black/10 shadow-xs" />
                </div>
              )}
            </div>

            {/* AI Automated Categorization & Routing Guarantee */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-brand/10 via-brand/5 to-sky-50 border border-brand/20 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-brand-dark">
                <Sparkles size={16} /> {lang === "hi" ? "स्वतः AI वर्गीकरण व संस्था आवंटन" : "Automated AI Understanding & Routing"}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {lang === "hi"
                  ? "आपकी समस्या को हमारे जेमिनी AI मॉडल द्वारा विश्लेषित कर प्राथमिकता स्कोर, प्रभावित जनसंख्या, आवश्यक शैक्षणिक विषय (सिविल, पर्यावरण, IoT आदि) और भारत के शीर्ष तकनीकी संस्थानों को तुरंत भेजा जाएगा।"
                  : "Your challenge will be processed by our Gemini AI pipeline to compute priority, urgency index, estimated affected population, required academic disciplines, and the top recommended institutions across India."}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-black/10">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-slate-50 transition min-h-[44px]"
            >
              <ArrowLeft size={16} /> {lang === "hi" ? "पीछे" : "Back"}
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition shadow-sm min-h-[44px]"
            >
              {lang === "hi" ? "अगला चरण" : "Next Step"} <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-accent text-slate-900 text-sm font-bold hover:brightness-110 shadow-md transition disabled:opacity-50 min-h-[44px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-slate-900" />
                  <span>{lang === "hi" ? "AI विश्लेषण हो रहा है..." : "Analyzing with Gemini AI..."}</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} className="text-slate-900" />
                  <span>{lang === "hi" ? "सबमिट करें व AI विश्लेषण प्राप्त करें" : "Submit & Run Gemini Analysis"}</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
