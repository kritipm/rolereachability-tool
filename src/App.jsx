import React, { useState, useEffect, useRef } from "react";
import { storage } from "./storage";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:       "#0D1117",
  surface:  "#161B22",
  raised:   "#1C2128",
  border:   "#30363D",
  borderHover: "#484F58",
  text:     "#F0F6FC",
  muted:    "#B8C4CF",
  faint:    "#3D444D",
  amber:    "#8B5CF6",
  amberDim: "#4C1D95",
  amberSoft:"#1A1040",
  green:    "#10B981",
  greenDim: "#064E3B",
  greenSoft:"#031F17",
  rose:     "#F43F5E",
  roseDim:  "#4C0519",
  roseSoft: "#1F0209",
};

const SHADOW = "0 4px 24px rgba(0,0,0,0.4)";
const DASHBOARD_PASSCODE = "go gurl";

// ─── Static Data ──────────────────────────────────────────────────────────────
const DEGREE_OPTIONS = ["B.Tech / B.E","B.Des","BBA / BMS","B.Com","BA","BCA","B.Sc","Diploma","Other"];
const BRANCH_OPTIONS = ["Computer Science","Mechanical / Core Engineering","Design (UX/Product/Comm)","Marketing","Finance","Commerce","Economics","Psychology","English / Mass Comm","Other"];

const BRANCH_SKILL_MAP = {
  "Computer Science": ["Basic Coding (HTML/CSS/JS)","SQL","Python","Data Analysis","Project Management Tools","Figma","User Research"],
  "Mechanical / Core Engineering": ["Excel","Data Analysis","Project Management Tools","SQL","Python"],
  "Design (UX/Product/Comm)": ["Figma","UI Design","User Research","Photoshop","Content Writing","Market Research"],
  "Marketing": ["Content Writing","Social Media","Market Research","Data Analysis","Excel","Public Speaking"],
  "Finance": ["Excel","SQL","Data Analysis","Market Research"],
  "Commerce": ["Excel","Data Analysis","Project Management Tools","Customer Support","Market Research"],
  "Economics": ["Excel","SQL","Data Analysis","Market Research","Python"],
  "Psychology": ["Customer Support","Public Speaking","User Research","Content Writing"],
  "English / Mass Comm": ["Content Writing","Public Speaking","Social Media","Market Research","Photoshop"],
  "Other": ["Excel","Data Analysis","Content Writing","Public Speaking","Social Media","Customer Support","Market Research"],
};

const ALL_SKILLS = ["Figma","UI Design","User Research","Excel","SQL","Python","Data Analysis","Content Writing","Photoshop","Project Management Tools","Basic Coding (HTML/CSS/JS)","Public Speaking","Customer Support","Social Media","Market Research"];
const EXPERIENCE_TYPE_OPTIONS = ["Internship","Academic / College Project","Personal Project","Freelance Work","Part-time / Full-time Job","Hackathon","Built & Shipped Something","None yet"];
const LANGUAGE_OPTIONS = ["English","Hindi","Bengali","Tamil","Telugu","Marathi","Gujarati","Kannada","Malayalam","Punjabi","Odia","Urdu"];

const ROLES = [
  { id:"apm", name:"Associate Product Manager", description:"Own a slice of a product end-to-end — talk to users, decide what gets built, and work with design and engineering to ship it.", responsibilities:["Write PRD sections for features and get sign-off from engineering and design","Own the sprint board for your product area — prioritise, unblock, track","Run weekly user interviews and synthesise findings into a decision-ready 1-pager"], requiredSkills:["User Research","Data Analysis","Project Management Tools"], preferredBackground:["Design (UX/Product/Comm)","Computer Science","Marketing","Commerce"], commLevel:4 },
  { id:"uxr", name:"UX Researcher", description:"Talk to real users, run studies, and turn what you learn into decisions the whole team can act on.", responsibilities:["Recruit participants and moderate 45-minute user interviews","Synthesise findings into a research report the team actually acts on","Own the research backlog and prioritise studies by business impact"], requiredSkills:["User Research","Data Analysis","Public Speaking"], preferredBackground:["Design (UX/Product/Comm)","Psychology","English / Mass Comm"], commLevel:4 },
  { id:"growth", name:"Growth Marketer", description:"Run experiments across channels to find what actually moves signups, activation, and revenue.", responsibilities:["Run A/B tests on landing pages and report weekly lift numbers","Own one acquisition channel end-to-end — paid, organic, or referral","Pull funnel data and identify the exact drop-off point to fix next"], requiredSkills:["Data Analysis","Content Writing","Social Media"], preferredBackground:["Marketing","Commerce","Economics"], commLevel:3 },
  { id:"ba", name:"Business Analyst", description:"Turn messy spreadsheets and reports into the numbers leadership actually uses to decide things.", responsibilities:["Build and own the Excel/SQL dashboards the leadership team reviews weekly","Translate business questions into data queries and answer them clearly","Own the weekly reporting deck for your business unit"], requiredSkills:["Excel","SQL","Data Analysis"], preferredBackground:["Commerce","Economics","Computer Science","Mechanical / Core Engineering"], commLevel:3 },
  { id:"csm", name:"Customer Success Manager", description:"Be the person customers trust to actually solve their problem, not just file a ticket.", responsibilities:["Own a portfolio of 20–40 accounts and hit a monthly retention or expansion KPI","Onboard new customers from contract-signed to first value in 30 days","Be the first and most reliable line of response when a customer raises an issue"], requiredSkills:["Customer Support","Public Speaking","Project Management Tools"], preferredBackground:["Any"], commLevel:5 },
  { id:"pmm", name:"Product Marketing Manager", description:"Decide how a product gets talked about — positioning, messaging, and the story that makes people care.", responsibilities:["Write the messaging brief, positioning doc, and launch email for every feature","Own the website copy for your product area and keep it accurate","Run customer interviews to pressure-test positioning before it goes live"], requiredSkills:["Content Writing","Market Research","Public Speaking"], preferredBackground:["Marketing","Design (UX/Product/Comm)","English / Mass Comm"], commLevel:4 },
  { id:"techwriter", name:"Technical Writer", description:"Make confusing technical things easy to follow — docs, guides, and product copy people actually read.", responsibilities:["Write and maintain the product documentation for a feature area","Review every new feature release for documentation gaps before it ships","Work directly with engineers to translate specs into plain, usable English"], requiredSkills:["Content Writing","Basic Coding (HTML/CSS/JS)"], preferredBackground:["English / Mass Comm","Computer Science","Any"], commLevel:2 },
  { id:"devrel", name:"Developer Relations Associate", description:"Sit between engineers and the outside world — community, content, and making developers want to use the product.", responsibilities:["Publish one technical blog post or tutorial per week","Answer developer questions on the community forum, Discord, or Stack Overflow","Demo the product at meetups and developer events — in person or recorded"], requiredSkills:["Public Speaking","Social Media","Basic Coding (HTML/CSS/JS)"], preferredBackground:["Computer Science","Marketing","Any"], commLevel:4 },
  { id:"dataanalyst", name:"Data Analyst", description:"Dig into the data nobody else has time to look at, and surface what it's actually telling the business.", responsibilities:["Own the weekly numbers for your business area — pull, clean, and present","Build dashboards that answer the top 5 questions leadership keeps asking","Identify anomalies in the data and surface them before they become fires"], requiredSkills:["Excel","SQL","Python"], preferredBackground:["Computer Science","Economics","Mechanical / Core Engineering"], commLevel:2 },
  { id:"ops", name:"Operations Associate", description:"Keep the unglamorous, essential parts of the business running — and fix what's broken before it becomes a fire.", responsibilities:["Own the SOP docs for a process area and keep them updated","Run the weekly ops review meeting and track every action item to done","Fix broken workflows — manually first, then automate"], requiredSkills:["Excel","Project Management Tools","Customer Support"], preferredBackground:["Commerce","Any"], commLevel:3 },
  { id:"revops", name:"Revenue Operations Associate", description:"Make sales and marketing's numbers actually agree with each other, and fix the process gaps between them.", responsibilities:["Reconcile CRM data with billing to ensure revenue numbers are accurate","Build and maintain the sales pipeline dashboard leadership reviews every Monday","Own the lead routing logic and make sure no deal falls through the cracks"], requiredSkills:["Excel","Data Analysis","Project Management Tools"], preferredBackground:["Commerce","Economics","Marketing"], commLevel:3 },
  { id:"uidesigner", name:"UI Designer", description:"Design the screens people actually touch — clean, usable, and consistent across the whole product.", responsibilities:["Design and ship 3–5 screens per sprint in Figma","Maintain the component library and design system for your product area","Review every engineering PR for pixel accuracy before it goes to staging"], requiredSkills:["Figma","UI Design","Photoshop"], preferredBackground:["Design (UX/Product/Comm)","Any"], commLevel:2 },
  { id:"servicedesigner", name:"Service Designer", description:"Design the whole experience around a product, not just the screen — support, onboarding, every touchpoint.", responsibilities:["Map the end-to-end customer journey for a flow — from awareness through support","Run journey mapping workshops with cross-functional teams","Own the improvement backlog for a specific service touchpoint"], requiredSkills:["User Research","UI Design","Project Management Tools"], preferredBackground:["Design (UX/Product/Comm)","Commerce","Any"], commLevel:4 },
  { id:"strategy", name:"Strategy Associate (Founder's Office)", description:"Work directly with leadership on whatever the business needs most that week — research, numbers, execution.", responsibilities:["Own one research project per week — competitive analysis, market sizing, or process audit","Build the deck the founders present to investors or the board","Track OKRs across teams and flag what's off-track before the weekly review"], requiredSkills:["Data Analysis","Excel","Public Speaking"], preferredBackground:["Economics","Commerce","Mechanical / Core Engineering","Computer Science"], commLevel:4 },
  { id:"solutionseng", name:"Solutions Engineer", description:"Be the technical person in the room when sales is closing a deal — explain, demo, and solve for the customer.", responsibilities:["Build and deliver product demos for every prospect in the pipeline","Write solution briefs that answer the top 5 technical objections customers raise","Be the technical point of contact from discovery call through contract close"], requiredSkills:["Basic Coding (HTML/CSS/JS)","Customer Support","Public Speaking"], preferredBackground:["Computer Science","Mechanical / Core Engineering","Any"], commLevel:4 },
  { id:"peopleops", name:"People Ops Associate", description:"Handle the human side of a growing company — hiring, onboarding, and keeping people actually happy there.", responsibilities:["Own the hiring process for 2–3 open roles — from job description to offer letter","Run onboarding for every new hire in your function in their first 30 days","Manage the HR system and keep data accurate across payroll and benefits"], requiredSkills:["Customer Support","Excel","Public Speaking"], preferredBackground:["Psychology","Commerce","Any"], commLevel:4 },
  { id:"contentstrategist", name:"Content Strategist", description:"Decide what the brand says and where — blog, social, and every page someone reads before they trust you.", responsibilities:["Own the editorial calendar and ensure 3–4 pieces publish per week","Write and edit blog posts, newsletters, and social copy that actually get read","Track content performance metrics and adjust the calendar based on what works"], requiredSkills:["Content Writing","Social Media","Market Research"], preferredBackground:["English / Mass Comm","Marketing","Any"], commLevel:3 },
  { id:"nocode", name:"No-Code Automation Specialist", description:"Wire up tools so repetitive work runs itself, without needing an engineer for every small fix.", responsibilities:["Build Zapier or Make workflows that eliminate a recurring manual task","Audit the tools the team uses and identify every integration gap","Own the internal tools documentation — what does what, and how to use it"], requiredSkills:["Basic Coding (HTML/CSS/JS)","Excel","Project Management Tools"], preferredBackground:["Computer Science","Commerce","Any"], commLevel:2 },
];

const SKILL_ALIASES = {
  "data analytics":"Data Analysis","analytics":"Data Analysis","data analyst":"Data Analysis","business analytics":"Data Analysis","data interpretation":"Data Analysis","statistical analysis":"Data Analysis","quantitative analysis":"Data Analysis",
  "ms excel":"Excel","microsoft excel":"Excel","spreadsheets":"Excel","google sheets":"Excel","spreadsheet":"Excel","excel spreadsheet":"Excel",
  "structured query language":"SQL","mysql":"SQL","postgresql":"SQL","database queries":"SQL","databases":"SQL","sqlite":"SQL",
  "python programming":"Python","python scripting":"Python","python3":"Python","py":"Python",
  "figma design":"Figma","ui design tool":"Figma","prototyping":"Figma",
  "user interface design":"UI Design","interface design":"UI Design","visual design":"UI Design","ux/ui":"UI Design","ui/ux":"UI Design","product design":"UI Design",
  "ux research":"User Research","user testing":"User Research","usability testing":"User Research","user interviews":"User Research","consumer research":"User Research","design research":"User Research","customer research":"User Research",
  "copywriting":"Content Writing","copy writing":"Content Writing","content creation":"Content Writing","blog writing":"Content Writing","technical writing":"Content Writing","writing":"Content Writing","content":"Content Writing",
  "communication":"Public Speaking","presentation":"Public Speaking","presentations":"Public Speaking","verbal communication":"Public Speaking","spoken english":"Public Speaking","oracy":"Public Speaking",
  "market analysis":"Market Research","competitive research":"Market Research","competitive analysis":"Market Research","industry research":"Market Research","marketing research":"Market Research",
  "social media marketing":"Social Media","social media management":"Social Media","instagram":"Social Media","linkedin":"Social Media","twitter":"Social Media","digital marketing":"Social Media",
  "customer service":"Customer Support","client support":"Customer Support","helpdesk":"Customer Support","customer care":"Customer Support","client relations":"Customer Support",
  "project management":"Project Management Tools","jira":"Project Management Tools","trello":"Project Management Tools","notion":"Project Management Tools","asana":"Project Management Tools","pm tools":"Project Management Tools","agile":"Project Management Tools","scrum":"Project Management Tools",
  "html":"Basic Coding (HTML/CSS/JS)","css":"Basic Coding (HTML/CSS/JS)","javascript":"Basic Coding (HTML/CSS/JS)","js":"Basic Coding (HTML/CSS/JS)","html/css":"Basic Coding (HTML/CSS/JS)","html css":"Basic Coding (HTML/CSS/JS)","web development":"Basic Coding (HTML/CSS/JS)","frontend":"Basic Coding (HTML/CSS/JS)","coding":"Basic Coding (HTML/CSS/JS)","programming":"Basic Coding (HTML/CSS/JS)",
  "adobe photoshop":"Photoshop","photo editing":"Photoshop","image editing":"Photoshop","adobe illustrator":"Photoshop","canva":"Photoshop","graphic design":"Photoshop",
};

function resolveSkill(raw) {
  const lower = raw.toLowerCase().trim();
  return SKILL_ALIASES[lower] || raw;
}

function experienceFitFromTypes(types) {
  if (!types || types.length === 0) return 25;
  const real = types.filter(t => t !== "None yet");
  if (real.length === 0) return 25;
  if (real.length === 1) return 60;
  return 90;
}

function scoreRole(profile, role) {
  const branchLower = (profile.branch || "").toLowerCase();
  const branchMatch = role.preferredBackground.some(b => b === "Any" || b.toLowerCase() === branchLower);
  const degreeFit = branchMatch ? 100 : 35;
  const profileSkillsResolved = profile.skills.map(s => resolveSkill(s).toLowerCase());
  const matchedSkills = role.requiredSkills.filter(s => profileSkillsResolved.includes(s.toLowerCase()));
  const missingSkills = role.requiredSkills.filter(s => !profileSkillsResolved.includes(s.toLowerCase()));
  const skillFit = role.requiredSkills.length === 0 ? 100 : Math.round((matchedSkills.length / role.requiredSkills.length) * 100);
  const experienceFit = experienceFitFromTypes(profile.experienceTypes);
  const profComm = profile.languageProficiency && Object.keys(profile.languageProficiency).length ? Math.max(...Object.values(profile.languageProficiency)) : 1;
  const commFit = profComm >= role.commLevel ? 100 : Math.max(0, 100 - (role.commLevel - profComm) * 25);
  const overall = Math.round(skillFit * 0.30 + experienceFit * 0.30 + degreeFit * 0.20 + commFit * 0.20);
  let tier = overall >= 70 ? "High" : overall >= 40 ? "Medium" : "Low";
  if (commFit < 50 && role.commLevel >= 4 && tier === "High") tier = "Medium";
  return { overall, tier, degreeFit, skillFit, experienceFit, commFit, matchedSkills, missingSkills };
}

const TIER = {
  High:   { label:"Ready to bridge", sub:"Strong fit — apply now",         color:C.green,  dim:C.greenDim,  soft:C.greenSoft  },
  Medium: { label:"Reachable",       sub:"A few focused gaps to close",     color:C.amber,  dim:C.amberDim,  soft:C.amberSoft  },
  Low:    { label:"Stretch",         sub:"Needs meaningful groundwork",     color:C.rose,   dim:C.roseDim,   soft:C.roseSoft   },
};

function buildFallbackExplanation(role, match) {
  const { tier, overall, matchedSkills, missingSkills } = match;
  const reqCount = role.requiredSkills.length;
  let whyMatch;
  if (matchedSkills.length === 0) whyMatch = `Right now there's no direct overlap between your listed skills and what ${role.name} asks for — ${tier} reachability (${overall}/100). That's a starting point, not a verdict. Closing even one gap below moves this number.`;
  else if (matchedSkills.length === reqCount) whyMatch = `You already bring every required skill for ${role.name} — ${matchedSkills.join(", ")}. That full overlap is driving your ${tier} score of ${overall}/100.`;
  else whyMatch = `You bring ${matchedSkills.join(", ")} — ${matchedSkills.length} of ${reqCount} skills ${role.name} needs. That overlap is why this comes out to ${tier} (${overall}/100).`;
  const gapAnalysis = missingSkills.length === 0 ? "No skill gap — every required skill is already on your profile." : `Missing: ${missingSkills.join(", ")} — ${missingSkills.length} skill${missingSkills.length!==1?"s":""} not yet on your profile. Fixable distance.`;
  const nextSteps = missingSkills.length === 0
    ? ["Apply directly — your profile already covers everything this role asks for.", `Lead with ${matchedSkills[0]||"your strongest matching skill"} — it's a confirmed overlap.`, "Do a quick informational call with someone in a similar role before applying."]
    : [`Start with ${missingSkills[0]} — build one small visible project around it, not just study it.`, missingSkills[1]?`Next: a short course or hands-on practice in ${missingSkills[1]}.`:`Practice ${missingSkills[0]} in a real context before applying, even a small one.`, `Don't wait for a perfect match — ${matchedSkills.length>0?`lead with ${matchedSkills[0]}`:"lead with your strongest related experience"} and be upfront about what you're still building.`];
  return { whyMatch, gapAnalysis, nextSteps };
}

// ─── Reusable UI Atoms ─────────────────────────────────────────────────────────

function Chip({ label, selected, onClick }) {
  return (
    <button type="button" onClick={onClick} className={selected ? "chip-selected" : ""} style={{
      padding:"6px 14px", borderRadius:6, fontSize:13, fontWeight:500, cursor:"pointer",
      border:`1px solid ${selected ? C.amber : C.border}`,
      background: selected ? C.amberSoft : "transparent",
      color: selected ? C.amber : C.muted,
      transition:"background 0.15s, border-color 0.15s, color 0.15s",
    }}>{label}</button>
  );
}

function Select({ value, onChange, options, placeholder, error }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div ref={ref} style={{ position:"relative", zIndex: open ? 999 : "auto" }}>
      <button type="button" onClick={()=>setOpen(o=>!o)} style={{
        width:"100%", padding:"11px 14px", borderRadius:8, fontSize:14, textAlign:"left", cursor:"pointer",
        background:C.surface, border:`1px solid ${error?C.rose:open?C.amber:C.border}`,
        color: value ? C.text : C.muted, display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <span>{value || placeholder}</span>
        <span style={{ fontSize:10, color:C.muted, transform:open?"rotate(180deg)":"rotate(0)", transition:"transform 0.2s" }}>▼</span>
      </button>
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, zIndex:9999, background:C.raised, border:`1px solid ${C.border}`, borderRadius:8, overflow:"hidden", boxShadow:SHADOW, maxHeight:260, overflowY:"auto" }}>
          {options.map(opt => (
            <button key={opt} type="button" onClick={()=>{ onChange(opt); setOpen(false); }} style={{
              width:"100%", padding:"10px 14px", textAlign:"left", fontSize:14, cursor:"pointer",
              background: value===opt ? C.amberSoft : "transparent",
              color: value===opt ? C.amber : C.text,
              border:"none", borderBottom:`1px solid ${C.border}`,
            }} onMouseEnter={e=>{ if(value!==opt) e.target.style.background=C.surface; }}
               onMouseLeave={e=>{ if(value!==opt) e.target.style.background="transparent"; }}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ScoreBar({ pct, color }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 50); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ height:4, borderRadius:2, background:C.faint, overflow:"hidden" }}>
      <div className="scorebar-fill" style={{ height:"100%", width:`${w}%`, background:color, borderRadius:2 }} />
    </div>
  );
}

function ProficiencyPicker({ language, value, onChange }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 0", flexWrap:"wrap", gap:8 }}>
      <span style={{ fontSize:14, color:C.text }}>{language}</span>
      <div style={{ display:"flex", gap:6 }}>
        {[1,2,3,4,5].map(n => (
          <button key={n} type="button" onClick={()=>onChange(language,n)} style={{
            width:28, height:28, borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer",
            border:`1px solid ${value>=n?C.amber:C.border}`,
            background: value>=n ? C.amber : "transparent",
            color: value>=n ? "#000" : C.muted,
          }}>{n}</button>
        ))}
      </div>
    </div>
  );
}

function StepBar({ step }) {
  const steps = ["Education","Skills","Experience","Languages"];
  return (
    <div style={{ display:"flex", gap:6, marginBottom:32 }}>
      {steps.map((s,i) => (
        <div key={s} style={{ flex:1 }}>
          <div style={{ height:3, borderRadius:2, background:C.faint, overflow:"hidden" }}>
            <div className="stepfill" style={{ height:"100%", width: i<=step ? "100%" : "0%", background:C.amber, borderRadius:2 }} />
          </div>
          <div style={{ fontSize:10, color: i<=step ? C.amber : C.muted, marginTop:5, fontFamily:"JetBrains Mono, monospace", letterSpacing:"0.04em", transition:"color 0.3s" }}>{s}</div>
        </div>
      ))}
    </div>
  );
}

const DEFAULT_PROFILE = { degree:"", branch:"", skills:[], experienceTypes:[], experienceDetail:"", languages:[], languageProficiency:{}, name:"", email:"" };

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("form");
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [customSkill, setCustomSkill] = useState("");
  const [errors, setErrors] = useState({});
  const [formStep, setFormStep] = useState(0);
  const [scoredRoles, setScoredRoles] = useState([]);
  const [markedEntries, setMarkedEntries] = useState({});
  const [aiCache, setAiCache] = useState({});
  const [sessionId, setSessionId] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [markSaveError, setMarkSaveError] = useState(null);
  const [tierFilter, setTierFilter] = useState(null);
  const [profileHistory, setProfileHistory] = useState([]);
  const [currentProfileId, setCurrentProfileId] = useState(null);
  const [slowLoad, setSlowLoad] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [roleDetailOrigin, setRoleDetailOrigin] = useState("results");
  const [selectedMarkProfileId, setSelectedMarkProfileId] = useState(null);
  const [dashboardUnlocked, setDashboardUnlocked] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [gapCopied, setGapCopied] = useState(false);
  const [gapCopyText, setGapCopyText] = useState(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [profileBackup, setProfileBackup] = useState(null);
  const [markPulse, setMarkPulse] = useState(false);

  useEffect(() => {
    (async () => {
      let sid = null;
      try { const r = await storage.get("session-id",false); if(r?.value) sid=r.value; } catch {}
      if(!sid){ sid="s_"+Math.random().toString(36).slice(2,10)+Date.now().toString(36); try{await storage.set("session-id",sid,false);}catch{} }
      setSessionId(sid);
      try { const e=await storage.get(`session:${sid}`,true); if(e?.value) setSessionData(JSON.parse(e.value)); } catch {}
      try { const r=await storage.get("marked-entries",false); if(r?.value) setMarkedEntries(JSON.parse(r.value)); } catch {}
      try {
        const r=await storage.get("user-profile",false);
        if(r?.value){
          const s={...DEFAULT_PROFILE,...JSON.parse(r.value)};
          const has=s.degree||s.branch||s.skills.length||s.experienceTypes.length||s.languages.length;
          if(has){ setProfileBackup(s); setProfile(p=>({...DEFAULT_PROFILE,name:s.name,email:s.email})); }
          else setProfile(s);
        }
      } catch {}
      try { const r=await storage.get("profile-history",false); if(r?.value){const h=JSON.parse(r.value);setProfileHistory(h);if(h.length)setCurrentProfileId(h[h.length-1].id);} } catch {}
      try { const r=await storage.get("dashboard-unlocked",false); if(r?.value==="true") setDashboardUnlocked(true); } catch {}
    })();
  }, []);

  const persistMarkedEntries = async e => { try{const r=await storage.set("marked-entries",JSON.stringify(e),false);return!!r;}catch{return false;} };
  const persistProfile = async p => { try{await storage.set("user-profile",JSON.stringify(p),false);}catch{} };
  const persistProfileHistory = async h => { try{await storage.set("profile-history",JSON.stringify(h),false);}catch{} };
  const ensureSession = () => sessionData||{sessionId,startedAt:new Date().toISOString(),browsed:false,detailViews:[],gapViews:[],marked:[]};
  const persistSession = async next => { setSessionData(next); if(!sessionId) return; try{await storage.set(`session:${sessionId}`,JSON.stringify(next),true);}catch{} };

  const loadDashboard = async () => {
    setDashboardLoading(true);
    try {
      const list=await storage.list("session:",true); const keys=list?.keys||[]; const sessions=[];
      for(const k of keys){try{const r=await storage.get(k,true);if(r?.value)sessions.push(JSON.parse(r.value));}catch{}}
      const total=sessions.length;
      const reachedResults=sessions.filter(s=>s.browsed).length;
      const markedAtLeastOne=sessions.filter(s=>(s.marked||[]).length>0).length;
      const avgDetailViews=total?sessions.reduce((a,s)=>a+(s.detailViews||[]).length,0)/total:0;
      const avgGapViews=total?sessions.reduce((a,s)=>a+(s.gapViews||[]).length,0)/total:0;
      const avgMarked=total?sessions.reduce((a,s)=>a+(s.marked||[]).length,0)/total:0;
      const krPercent=total?Math.round((markedAtLeastOne/total)*1000)/10:0;
      setDashboard({total,reachedResults,markedAtLeastOne,avgDetailViews,avgGapViews,avgMarked,krPercent});
    } catch { setDashboard({error:true}); }
    setDashboardLoading(false);
  };

  const unlockDashboard = () => {
    if(passcodeInput===DASHBOARD_PASSCODE){ setDashboardUnlocked(true); setPasscodeError(false); try{storage.set("dashboard-unlocked","true",false);}catch{} loadDashboard(); }
    else setPasscodeError(true);
  };

  const toggleSkill = s => setProfile(p=>({...p,skills:p.skills.includes(s)?p.skills.filter(x=>x!==s):[...p.skills,s]}));
  const addCustomSkill = () => { const t=customSkill.trim(); if(t&&!profile.skills.includes(t)){setProfile(p=>({...p,skills:[...p.skills,t]}));setCustomSkill("");} };
  const toggleExperienceType = type => setProfile(p=>{
    let next; if(type==="None yet"){next=p.experienceTypes.includes("None yet")?[]:["None yet"];}
    else{const w=p.experienceTypes.filter(t=>t!=="None yet");next=w.includes(type)?w.filter(t=>t!==type):[...w,type];}
    return{...p,experienceTypes:next};
  });
  const toggleLanguage = lang => setProfile(p=>{
    const has=p.languages.includes(lang);
    if(has){const n=p.languages.filter(l=>l!==lang);const np={...p.languageProficiency};delete np[lang];return{...p,languages:n,languageProficiency:np};}
    return{...p,languages:[...p.languages,lang],languageProficiency:{...p.languageProficiency,[lang]:3}};
  });
  const setLanguageProficiency = (lang,level) => setProfile(p=>({...p,languageProficiency:{...p.languageProficiency,[lang]:level}}));

  const goToQuestionnaire = () => {
    const has=profile.degree||profile.branch||profile.skills.length||profile.experienceTypes.length||profile.languages.length;
    if(has){setProfileBackup(profile);setProfile(p=>({...DEFAULT_PROFILE,name:p.name,email:p.email}));setErrors({});}
    setFormStep(0); setPage("form");
  };
  const undoClearProfile = () => { if(profileBackup){setProfile(profileBackup);setProfileBackup(null);setErrors({});} };

  const handleSubmit = () => {
    const errs={};
    if(!profile.degree) errs.degree="Pick your degree";
    if(!profile.branch) errs.branch="Pick your branch";
    if(!profile.skills.length) errs.skills="Select at least one skill";
    if(!profile.experienceTypes.length) errs.experience='Pick at least one — even "None yet" works';
    if(!profile.languages.length) errs.languages="Select at least one language";
    setErrors(errs); if(Object.keys(errs).length) return;
    const profileId="p_"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
    const snapshot={id:profileId,profile:{degree:profile.degree,branch:profile.branch,skills:profile.skills,experienceTypes:profile.experienceTypes,experienceDetail:profile.experienceDetail,languages:profile.languages,languageProficiency:profile.languageProficiency},submittedAt:new Date().toISOString()};
    const nextHistory=[...profileHistory,snapshot]; setProfileHistory(nextHistory); setCurrentProfileId(profileId); persistProfileHistory(nextHistory);
    const scored=ROLES.map(r=>({...r,match:scoreRole(profile,r)})).sort((a,b)=>b.match.overall-a.match.overall);
    setScoredRoles(scored); setAiCache({}); setTierFilter(null); setProfileBackup(null); setPage("results");
    persistSession({...ensureSession(),browsed:true}); persistProfile(profile);
  };

  const markKey=(roleId,profileId)=>`${roleId}::${profileId||"unsaved"}`;
  const aiCacheKey=(roleId,origin,ctxPid)=>{ const pid=origin==="marked"?(ctxPid||"unknown"):(currentProfileId||"live"); return markKey(roleId,pid); };

  const openRoleDetail=(roleId,origin,ctxPid)=>{
    setSelectedRoleId(roleId); setRoleDetailOrigin(origin||"results");
    setSelectedMarkProfileId(origin==="marked"?(ctxPid||null):null);
    setPage("roleDetail"); setBannerDismissed(false); setGapCopyText(null);
    const sd=ensureSession(); if(!sd.detailViews.includes(roleId)) persistSession({...sd,detailViews:[...sd.detailViews,roleId]});
    const key=aiCacheKey(roleId,origin||"results",ctxPid); if(!aiCache[key]) generateExplanation(roleId,origin||"results",ctxPid);
  };

  const generateExplanation=async(roleId,origin="results",ctxPid=null)=>{
    const cacheKey=aiCacheKey(roleId,origin,ctxPid);
    setAiCache(c=>({...c,[cacheKey]:{status:"loading"}})); setSlowLoad(false);
    const slowTimer=setTimeout(()=>setSlowLoad(true),4000);
    const roleStaticLookup=ROLES.find(r=>r.id===roleId);
    let profileForPrompt=profile,matchForPrompt=null;
    if(origin==="marked"&&ctxPid){
      const entry=markedEntries[markKey(roleId,ctxPid)];
      const snap=profileHistory.find(p=>p.id===ctxPid);
      if(snap) profileForPrompt={...DEFAULT_PROFILE,...snap.profile};
      if(entry) matchForPrompt={tier:entry.tier,overall:entry.overall,matchedSkills:entry.matchedSkills,missingSkills:entry.missingSkills};
    } else { const liveRole=scoredRoles.find(r=>r.id===roleId); matchForPrompt=liveRole?liveRole.match:null; }
    const role=roleStaticLookup&&matchForPrompt?{...roleStaticLookup,match:matchForPrompt}:null;
    if(!role){clearTimeout(slowTimer);setAiCache(c=>({...c,[cacheKey]:{status:"error"}}));return;}
    const expSummary=!profileForPrompt.experienceTypes.length||profileForPrompt.experienceTypes.includes("None yet")?"No formal experience yet":profileForPrompt.experienceTypes.join(", ")+(profileForPrompt.experienceDetail?` — ${profileForPrompt.experienceDetail}`:"");
    const langSummary=profileForPrompt.languages.length?profileForPrompt.languages.map(l=>`${l} (${profileForPrompt.languageProficiency[l]}/5)`).join(", "):"Not specified";
    const prompt=`User background:\nDegree: ${profileForPrompt.degree}, Branch: ${profileForPrompt.branch}\nSkills: ${profileForPrompt.skills.join(", ")||"none listed"}\nExperience: ${expSummary}\nLanguages & comfort: ${langSummary}\n\nTarget role: ${role.name}\nDescription: ${role.description}\nDay-to-day: ${role.responsibilities.join("; ")}\nRequired skills: ${role.requiredSkills.join(", ")}\nPreferred background: ${role.preferredBackground.join(", ")}\nReachability: ${role.match.tier} (${role.match.overall}/100)\nMatched: ${role.match.matchedSkills.join(", ")||"none"}\nMissing: ${role.match.missingSkills.join(", ")||"none"}\n\nShort, honest, encouraging — for this specific person. Return ONLY valid JSON:\n{"whyMatch":"2-3 sentences","gapAnalysis":"1-2 sentences","nextSteps":["step 1","step 2","step 3"]}`;
    try {
      const res=await fetch("/api/explain",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt})});
      const data=await res.json(); const text=(data.content||[]).map(b=>b.text||"").join("");
      const parsed=JSON.parse(text.replace(/```json|```/g,"").trim());
      clearTimeout(slowTimer); setAiCache(c=>({...c,[cacheKey]:{status:"success",data:parsed}}));
      const sd=ensureSession(); if(!sd.gapViews.includes(roleId)) persistSession({...sd,gapViews:[...sd.gapViews,roleId]});
    } catch {
      clearTimeout(slowTimer);
      const fallback=buildFallbackExplanation(role,role.match);
      setAiCache(c=>({...c,[cacheKey]:{status:"fallback",data:fallback}}));
    }
  };

  const toggleMarked=async(roleId,profileId)=>{
    const key=markKey(roleId,profileId); const willMark=!markedEntries[key]; let nextEntries;
    if(willMark){
      setMarkPulse(true); setTimeout(()=>setMarkPulse(false),350);
      const role=scoredRoles.find(x=>x.id===roleId); if(!role) return;
      nextEntries={...markedEntries,[key]:{roleId,roleName:role.name,profileId,tier:role.match.tier,overall:role.match.overall,matchedSkills:role.match.matchedSkills,missingSkills:role.match.missingSkills,markedAt:new Date().toISOString()}};
    } else { nextEntries={...markedEntries}; delete nextEntries[key]; }
    setMarkedEntries(nextEntries); const ok=await persistMarkedEntries(nextEntries); setMarkSaveError(ok?null:key);
    const sd=ensureSession(); const marked=willMark?(sd.marked.includes(roleId)?sd.marked:[...sd.marked,roleId]):sd.marked.filter(id=>id!==roleId); persistSession({...sd,marked});
  };

  const retryMarkSave=async key=>{const ok=await persistMarkedEntries(markedEntries);setMarkSaveError(ok?null:key);};
  const saveProfileInfo=()=>{persistProfile(profile);setProfileSaved(true);setTimeout(()=>setProfileSaved(false),2000);};
  const copyGapText=async text=>{
    try{if(!navigator.clipboard||!navigator.clipboard.writeText)throw new Error("unavailable");await navigator.clipboard.writeText(text);setGapCopied(true);setGapCopyText(null);setTimeout(()=>setGapCopied(false),2000);}
    catch{setGapCopied(false);setGapCopyText(text);}
  };

  const grouped=(tierFilter?[tierFilter]:["High","Medium","Low"]).map(t=>({tier:t,roles:scoredRoles.filter(r=>r.match.tier===t)}));
  const recommendedSkills=profile.branch&&BRANCH_SKILL_MAP[profile.branch]?BRANCH_SKILL_MAP[profile.branch]:[];
  const otherSkills=ALL_SKILLS.filter(s=>!recommendedSkills.includes(s));
  const customAddedSkills=profile.skills.filter(s=>!ALL_SKILLS.includes(s));
  const selectedRoleStatic=selectedRoleId?ROLES.find(x=>x.id===selectedRoleId):null;
  const selectedLiveMatch=selectedRoleId?scoredRoles.find(x=>x.id===selectedRoleId)?.match:null;
  const selectedFrozen=(selectedRoleId&&roleDetailOrigin==="marked"&&selectedMarkProfileId)?markedEntries[markKey(selectedRoleId,selectedMarkProfileId)]:null;
  const selectedMatch=(roleDetailOrigin==="marked"&&selectedFrozen)?{tier:selectedFrozen.tier,overall:selectedFrozen.overall,matchedSkills:selectedFrozen.matchedSkills,missingSkills:selectedFrozen.missingSkills}:selectedLiveMatch;
  const markedList=Object.values(markedEntries);
  const knownProfileIds=new Set(profileHistory.map(p=>p.id));
  const groupsByProfile=[...profileHistory].reverse().map(snap=>({profile:snap,entries:markedList.filter(e=>e.profileId===snap.id)})).filter(g=>g.entries.length>0);
  const orphanEntries=markedList.filter(e=>!knownProfileIds.has(e.profileId));
  const mono="JetBrains Mono, monospace";

  const S = {
    page: { background:C.bg, minHeight:"100vh", fontFamily:"Space Grotesk, Inter, sans-serif", color:C.text },
    inner: { maxWidth:960, margin:"0 auto", padding:"0 20px 60px" },
    label: { fontFamily:mono, fontSize:10, letterSpacing:"0.1em", color:C.amber, textTransform:"uppercase", marginBottom:10, display:"block" },
    section: { marginBottom:36 },
    card: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:24 },
    input: { width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"11px 14px", fontSize:14, color:C.text, outline:"none", boxSizing:"border-box" },
    btnPrimary: { width:"100%", padding:"15px 24px", borderRadius:10, fontSize:15, fontWeight:600, cursor:"pointer", border:"none", background:`linear-gradient(135deg, ${C.amber} 0%, #D97706 100%)`, color:"#000", letterSpacing:"0.02em" },
    divider: { borderTop:`1px solid ${C.border}`, margin:"20px 0" },
    backBtn: { background:"none", border:"none", color:C.muted, fontSize:13, cursor:"pointer", fontFamily:mono, letterSpacing:"0.04em", padding:0, marginBottom:24, display:"block" },
  };

  return (
    <div style={S.page}>
      <style>{`
        * { box-sizing:border-box; }
        input::placeholder, textarea::placeholder { color:${C.muted}; }
        select { display:none; }
        textarea { resize:vertical; }
        button { font-family:inherit; }
        ::-webkit-scrollbar { width:6px; } ::-webkit-scrollbar-track { background:${C.bg}; } ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:3px; }

        @keyframes slideDown { from { opacity:0; transform:translateY(-100%); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeUpSmall { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideInRight { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes chipPulse { 0% { transform:scale(1); } 50% { transform:scale(1.06); } 100% { transform:scale(1); } }
        @keyframes markPulse { 0% { background:${C.greenSoft}; } 40% { background:#1A6B4A; } 100% { background:${C.greenSoft}; } }
        @keyframes checkPop { from { transform:scale(0); } to { transform:scale(1); } }

        .anim-topbar { animation: slideDown 300ms ease-out both; }
        .anim-heading { animation: fadeUp 400ms ease-out 150ms both; }
        .anim-section { animation: fadeUpSmall 300ms ease-out both; }
        .anim-card { animation: fadeUpSmall 300ms ease-out both; }
        .anim-hero { animation: slideInRight 350ms ease-out both; }
        .anim-hero-section { animation: fadeUpSmall 300ms ease-out both; }
        .chip-selected { animation: chipPulse 150ms ease-out; }
        .mark-pulse { animation: markPulse 300ms ease-out; }
        .check-pop { display:inline-block; animation: checkPop 250ms cubic-bezier(0.34,1.56,0.64,1) both; }
        .scorebar-fill { transition: width 600ms ease-out; }
        .stepfill { transition: width 400ms ease-out, background 300ms; }
        .cta-btn { transition: transform 80ms ease-out; }
        .cta-btn:hover { transform: translateY(-1px); }
        .cta-btn:active { transform: scale(0.98); }

        @media (prefers-reduced-motion: reduce) {
          .anim-topbar, .anim-heading, .anim-section, .anim-card, .anim-hero, .anim-hero-section, .chip-selected, .mark-pulse, .check-pop { animation: none !important; }
          .scorebar-fill, .stepfill, .cta-btn { transition: none !important; }
          .cta-btn:hover, .cta-btn:active { transform: none !important; }
        }
      `}</style>

      {/* ── Top bar ── */}
      <div className="anim-topbar" style={{ borderBottom:`1px solid ${C.border}`, padding:"0 20px" }}>
        <div style={{ maxWidth:960, margin:"0 auto", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:C.amber }} />
            <span style={{ fontFamily:mono, fontSize:11, color:C.text, letterSpacing:"0.1em", textTransform:"uppercase" }}>Emerging Roles · Reachability</span>
          </div>
          {(page==="form"||page==="results") && (
            <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
              {[["Profile","profile"],["Marked Roles","marked"],["Live KPIs","dashboard"]].map(([label,pg])=>(
                <button key={pg} type="button" onClick={()=>setPage(pg)} style={{ background:"none", border:"none", color:C.text, fontSize:12, cursor:"pointer", fontFamily:mono, letterSpacing:"0.04em", opacity:0.7 }}>{label} →</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={S.inner}>

        {/* ── Page heading ── */}
        <div className="anim-heading" style={{ padding:"36px 0 28px" }}>
          <h1 style={{ fontSize:page==="form"||page==="results"?36:28, fontWeight:700, lineHeight:1.15, margin:0, letterSpacing:"-0.02em" }}>
            {page==="form"       && <><span style={{ background:"linear-gradient(135deg, #6366F1, #EC4899)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Discover</span> what's actually within reach.</>}
            {page==="results"    && "Your reachable map."}
            {page==="dashboard"  && "Live Key Result"}
            {page==="profile"    && "Your Profile"}
            {page==="marked"     && "Your marked roles."}
            {page==="roleDetail" && (selectedRoleStatic?selectedRoleStatic.name:"Role detail")}
          </h1>
          {page==="form"    && <p style={{ color:C.muted, fontSize:15, margin:"8px 0 0" }}>Tell us about yourself — takes about a minute. We'll match your background to roles you can realistically reach.</p>}
          {page==="results" && <p style={{ color:C.muted, fontSize:14, margin:"8px 0 0" }}>Tap any role to see your full gap analysis.</p>}
          {page==="marked"  && <p style={{ color:C.muted, fontSize:14, margin:"8px 0 0" }}>Every role you've marked, grouped by the profile that surfaced it.</p>}
        </div>

        {/* ══ FORM ══ */}
        {page==="form" && (
          <div>
            <StepBar step={formStep} />

            {profileBackup && (
              <div style={{ background:C.amberSoft, border:`1px solid ${C.amberDim}`, borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28, flexWrap:"wrap", gap:8 }}>
                <span style={{ fontSize:13, color:C.text }}>Starting fresh — your previous answers are saved if you want them back.</span>
                <button type="button" onClick={undoClearProfile} style={{ background:"none", border:"none", color:C.amber, fontSize:13, fontWeight:600, cursor:"pointer", textDecoration:"underline" }}>↺ Restore my answers</button>
              </div>
            )}

            <div style={{...S.section}}>
              <span style={S.label}>01 · Education</span>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <Select value={profile.degree} onChange={v=>setProfile(p=>({...p,degree:v}))} options={DEGREE_OPTIONS} placeholder="Degree" error={errors.degree} />
                  {errors.degree && <div style={{ color:C.rose, fontSize:11, marginTop:4 }}>{errors.degree}</div>}
                </div>
                <div>
                  <Select value={profile.branch} onChange={v=>setProfile(p=>({...p,branch:v}))} options={BRANCH_OPTIONS} placeholder="Branch / specialization" error={errors.branch} />
                  {errors.branch && <div style={{ color:C.rose, fontSize:11, marginTop:4 }}>{errors.branch}</div>}
                </div>
              </div>
            </div>

            <div className="anim-section" style={{...S.section, animationDelay:"280ms"}} onClick={()=>setFormStep(s=>Math.max(s,1))}>
              <span style={S.label}>02 · Skills</span>
              {recommendedSkills.length>0 && (
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:11, color:C.muted, marginBottom:8 }}>Recommended for {profile.branch}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>{recommendedSkills.map(s=><Chip key={s} label={s} selected={profile.skills.includes(s)} onClick={()=>toggleSkill(s)} />)}</div>
                </div>
              )}
              <div style={{ marginBottom:12 }}>
                {recommendedSkills.length>0 && <div style={{ fontSize:11, color:C.muted, marginBottom:8 }}>More skills</div>}
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {otherSkills.map(s=><Chip key={s} label={s} selected={profile.skills.includes(s)} onClick={()=>toggleSkill(s)} />)}
                  {customAddedSkills.map(s=><Chip key={s} label={s} selected={true} onClick={()=>toggleSkill(s)} />)}
                </div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <input value={customSkill} onChange={e=>setCustomSkill(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addCustomSkill();}} placeholder="Add a skill not listed above" style={{...S.input, flex:1}} />
                <button type="button" onClick={addCustomSkill} style={{ padding:"11px 18px", borderRadius:8, background:C.surface, border:`1px solid ${C.border}`, color:C.text, fontSize:13, cursor:"pointer" }}>Add</button>
              </div>
              {errors.skills && <div style={{ color:C.rose, fontSize:11, marginTop:6 }}>{errors.skills}</div>}
            </div>

            <div className="anim-section" style={{...S.section, animationDelay:"360ms"}} onClick={()=>setFormStep(s=>Math.max(s,2))}>
              <span style={S.label}>03 · Experience</span>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
                {EXPERIENCE_TYPE_OPTIONS.map(t=><Chip key={t} label={t} selected={profile.experienceTypes.includes(t)} onClick={()=>toggleExperienceType(t)} />)}
              </div>
              <p style={{ color:C.muted, fontSize:13, margin:"0 0 10px", lineHeight:1.6 }}>Any kind of experience counts — even just applying a skill on a small project. "None yet" is a valid answer.</p>
              <textarea value={profile.experienceDetail} onChange={e=>setProfile(p=>({...p,experienceDetail:e.target.value}))} placeholder="Add detail if you'd like (optional) — e.g. 2 design internships, built a portfolio site" rows={2} style={{...S.input}} />
              {errors.experience && <div style={{ color:C.rose, fontSize:11, marginTop:6 }}>{errors.experience}</div>}
            </div>

            <div className="anim-section" style={{...S.section, animationDelay:"440ms"}} onClick={()=>setFormStep(s=>Math.max(s,3))}>
              <span style={S.label}>04 · Languages & Communication</span>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
                {LANGUAGE_OPTIONS.map(l=><Chip key={l} label={l} selected={profile.languages.includes(l)} onClick={()=>toggleLanguage(l)} />)}
              </div>
              {profile.languages.length>0 && (
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"4px 16px" }}>
                  <div style={{ fontSize:11, color:C.muted, padding:"10px 0 4px" }}>Rate your comfort speaking each, out of 5</div>
                  {profile.languages.map(l=><ProficiencyPicker key={l} language={l} value={profile.languageProficiency[l]||3} onChange={setLanguageProficiency} />)}
                </div>
              )}
              {errors.languages && <div style={{ color:C.rose, fontSize:11, marginTop:6 }}>{errors.languages}</div>}
            </div>

            <button type="button" className="cta-btn" onClick={handleSubmit} style={S.btnPrimary}>Find My Roles →</button>
          </div>
        )}

        {/* ══ RESULTS ══ */}
        {page==="results" && (
          <div>
            <button style={S.backBtn} onClick={goToQuestionnaire}>← Edit profile</button>

            {/* Tier filter */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:28, alignItems:"center" }}>
              <span style={{ fontFamily:mono, fontSize:10, color:C.muted, letterSpacing:"0.08em", textTransform:"uppercase", marginRight:4 }}>Filter</span>
              {["High","Medium","Low"].map(t=>{
                const m=TIER[t]; const active=tierFilter===t;
                return <button key={t} type="button" onClick={()=>setTierFilter(p=>p===t?null:t)} style={{ padding:"6px 16px", borderRadius:6, fontSize:13, fontWeight:500, cursor:"pointer", border:`1px solid ${active?m.color:C.border}`, background:active?m.soft:"transparent", color:active?m.color:C.muted }}>{m.label}</button>;
              })}
              {tierFilter && <button type="button" onClick={()=>setTierFilter(null)} style={{ background:"none", border:"none", color:C.muted, fontSize:12, cursor:"pointer", fontFamily:mono, textDecoration:"underline" }}>Clear</button>}
            </div>

            {tierFilter&&grouped.every(g=>g.roles.length===0)&&(()=>{
              const fc={High:scoredRoles.filter(r=>r.match.tier==="High").length,Medium:scoredRoles.filter(r=>r.match.tier==="Medium").length,Low:scoredRoles.filter(r=>r.match.tier==="Low").length};
              const avail=["High","Medium","Low"].filter(t=>t!==tierFilter&&fc[t]>0);
              return <div style={{ background:C.amberSoft, border:`1px solid ${C.amberDim}`, borderRadius:12, padding:24, marginBottom:28, textAlign:"center" }}>
                <div style={{ fontWeight:600, marginBottom:8 }}>No "{TIER[tierFilter].label}" roles for your profile yet</div>
                <div style={{ color:C.muted, fontSize:14, marginBottom:16 }}>{avail.length>0?`But you have ${avail.map(t=>`${fc[t]} ${TIER[t].label}`).join(" and ")} roles waiting.`:"Clear the filter to see everything."}</div>
                <button type="button" onClick={()=>setTierFilter(null)} style={{ padding:"8px 20px", borderRadius:8, background:C.amber, color:"#000", border:"none", fontSize:13, fontWeight:600, cursor:"pointer" }}>Show all roles</button>
              </div>;
            })()}

            {grouped.map(({tier,roles})=>{
              if(!roles.length) return null;
              const m=TIER[tier];
              return <div key={tier} style={{ marginBottom:36 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, padding:"10px 16px", background:m.soft, border:`1px solid ${m.dim}`, borderRadius:8 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:m.color, flexShrink:0 }} />
                  <div>
                    <div style={{ fontWeight:600, fontSize:15 }}>{m.label}</div>
                    <div style={{ fontSize:11, color:m.color, fontFamily:mono }}>{m.sub}</div>
                  </div>
                  <span style={{ marginLeft:"auto", fontFamily:mono, fontSize:12, color:m.color }}>{roles.length} role{roles.length!==1?"s":""}</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:12 }}>
                  {roles.map((r,ri)=>{
                    const isMarkedNow=!!markedEntries[markKey(r.id,currentProfileId)];
                    return <div key={r.id} className="anim-card" onClick={()=>openRoleDetail(r.id,"results")} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, cursor:"pointer", borderLeft:`3px solid ${m.color}`, transition:"border-color 0.15s", animationDelay:`${ri*50}ms` }}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=m.color}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8, gap:10 }}>
                        <div>
                          <div style={{ fontWeight:600, fontSize:16, marginBottom:4 }}>{r.name}</div>
                          {isMarkedNow && <span style={{ fontFamily:mono, fontSize:10, color:C.green, background:C.greenSoft, padding:"2px 8px", borderRadius:4 }}>✓ Marked</span>}
                        </div>
                        <div style={{ textAlign:"right", flexShrink:0 }}>
                          <div style={{ fontFamily:mono, fontSize:22, fontWeight:700, color:m.color }}>{r.match.overall}</div>
                          <div style={{ fontFamily:mono, fontSize:9, color:C.muted }}>/100</div>
                        </div>
                      </div>
                      <div style={{ color:C.muted, fontSize:13, lineHeight:1.5, marginBottom:12 }}>{r.description}</div>
                      <ScoreBar pct={r.match.overall} color={m.color} />
                      <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                        <span style={{ fontFamily:mono, fontSize:10, color:C.muted }}>{r.match.matchedSkills.length}/{r.requiredSkills.length} skills matched</span>
                        <span style={{ fontFamily:mono, fontSize:11, color:C.muted }}>→</span>
                      </div>
                    </div>;
                  })}
                </div>
              </div>;
            })}
          </div>
        )}

        {/* ══ ROLE DETAIL ══ */}
        {page==="roleDetail"&&selectedRoleStatic&&selectedMatch&&(()=>{
          const m=TIER[selectedMatch.tier];
          const ctxPid=roleDetailOrigin==="marked"?selectedMarkProfileId:currentProfileId;
          const cacheKey=aiCacheKey(selectedRoleId,roleDetailOrigin,ctxPid);
          const ai=aiCache[cacheKey];
          const tmk=markKey(selectedRoleId,ctxPid);
          const isMarked=!!markedEntries[tmk];
          return <div style={{ maxWidth:680, margin:"0 auto" }}>
            <button style={S.backBtn} onClick={()=>setPage(roleDetailOrigin==="marked"?"marked":"results")}>← {roleDetailOrigin==="marked"?"Back to marked roles":"Back to results"}</button>

            {(ai?.status==="error"||(ai?.status==="loading"&&slowLoad))&&!bannerDismissed&&(
              <div style={{ background:ai?.status==="error"?C.roseSoft:C.amberSoft, border:`1px solid ${ai?.status==="error"?C.roseDim:C.amberDim}`, borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, gap:12, flexWrap:"wrap" }}>
                <span style={{ fontSize:13, color:C.text }}>{ai?.status==="error"?"⚠ Write-up failed — score and gap analysis below are unaffected.":"⏳ Taking longer than usual to generate your personalised write-up."}</span>
                <div style={{ display:"flex", gap:8 }}>
                  <button type="button" onClick={()=>{setBannerDismissed(false);generateExplanation(selectedRoleId,roleDetailOrigin,ctxPid);}} style={{ padding:"6px 14px", borderRadius:6, background:C.raised, border:`1px solid ${C.border}`, color:C.text, fontSize:12, cursor:"pointer" }}>Retry</button>
                  <button type="button" onClick={()=>setBannerDismissed(true)} style={{ padding:"6px 14px", borderRadius:6, background:"transparent", border:`1px solid ${C.border}`, color:C.muted, fontSize:12, cursor:"pointer" }}>Dismiss</button>
                </div>
              </div>
            )}

            {/* Hero card */}
            <div className="anim-hero" style={{ background:C.surface, border:`1px solid ${m.color}`, borderRadius:14, marginBottom:16, overflow:"hidden" }}>
              <div style={{ padding:24, borderBottom:`1px solid ${C.border}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16 }}>
                  <div>
                    {isMarked&&<span style={{ fontFamily:mono, fontSize:10, color:C.green, background:C.greenSoft, padding:"2px 8px", borderRadius:4, display:"inline-block", marginBottom:8 }}>✓ Marked Relevant & Reachable</span>}
                    <p style={{ color:C.muted, fontSize:14, lineHeight:1.6, margin:0 }}>{selectedRoleStatic.description}</p>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontFamily:mono, fontSize:32, fontWeight:700, color:m.color, lineHeight:1 }}>{selectedMatch.overall}</div>
                    <div style={{ fontFamily:mono, fontSize:10, color:C.muted }}>/100</div>
                    <div style={{ fontSize:11, color:m.color, fontWeight:600, marginTop:4 }}>{m.label}</div>
                  </div>
                </div>
                <div style={{ marginTop:16 }}>
                  <ScoreBar pct={selectedMatch.overall} color={m.color} />
                </div>
              </div>

              <div style={{ padding:24 }}>
                {/* What you'd actually do */}
                <div style={{ marginBottom:24, paddingBottom:24, borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ fontFamily:mono, fontSize:10, color:C.amber, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>What you'd actually do</div>
                  {selectedRoleStatic.responsibilities.map((r,i)=>(
                    <div key={i} style={{ display:"flex", gap:12, marginBottom:10 }}>
                      <span style={{ fontFamily:mono, fontSize:11, color:C.amber, flexShrink:0, marginTop:2 }}>{String(i+1).padStart(2,"0")}</span>
                      <span style={{ fontSize:14, color:C.muted, lineHeight:1.5 }}>{r}</span>
                    </div>
                  ))}
                </div>

                {/* Why you match */}
                <div style={{ marginBottom:24, paddingBottom:24, borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ fontFamily:mono, fontSize:10, color:C.amber, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>Why you match</div>
                  {ai?.status==="loading"&&<div style={{ color:C.muted, fontSize:14, fontStyle:"italic" }}>Generating your personalised read…{slowLoad&&<span style={{ display:"block", marginTop:4 }}>Still working — thanks for your patience.</span>}</div>}
                  {ai?.status==="success"&&<div style={{ fontSize:14, lineHeight:1.7, color:C.muted }}>{ai.data.whyMatch}</div>}
                  {ai?.status==="fallback"&&<div>
                    <div style={{ fontFamily:mono, fontSize:10, color:C.muted, letterSpacing:"0.04em", textTransform:"uppercase", marginBottom:8 }}>Rule-based — not AI-personalised</div>
                    <div style={{ fontSize:14, lineHeight:1.7, color:C.muted }}>{ai.data.whyMatch}</div>
                    <button type="button" onClick={()=>generateExplanation(selectedRoleId,roleDetailOrigin,ctxPid)} style={{ background:"none", border:"none", color:C.amber, fontSize:12, cursor:"pointer", textDecoration:"underline", marginTop:8, padding:0 }}>Try the AI version</button>
                  </div>}
                  {ai?.status==="error"&&<div>
                    <div style={{ color:C.muted, fontSize:14, fontStyle:"italic", marginBottom:8 }}>Couldn't generate the personalised write-up — score and gap analysis are unaffected.</div>
                    <button type="button" onClick={()=>generateExplanation(selectedRoleId,roleDetailOrigin,ctxPid)} style={{ background:"none", border:"none", color:C.amber, fontSize:12, cursor:"pointer", textDecoration:"underline", padding:0 }}>Try again</button>
                  </div>}
                  {!ai&&<div style={{ color:C.muted, fontSize:14, fontStyle:"italic" }}>Gap analysis below is fully accurate — write-up loads when connected.</div>}
                </div>

                {/* Gap analysis */}
                <div style={{ marginBottom:24, paddingBottom:24, borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ fontFamily:mono, fontSize:10, color:C.amber, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16 }}>Gap analysis</div>

                  {/* Split bar */}
                  <div style={{ height:8, borderRadius:4, background:C.faint, overflow:"hidden", marginBottom:8 }}>
                    <div style={{ height:"100%", width:`${selectedMatch.overall}%`, background:`linear-gradient(90deg, ${C.green} 0%, ${C.amber} 100%)`, borderRadius:4 }} />
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, fontFamily:mono, marginBottom:20 }}>
                    <span style={{ color:C.green }}>You bring · {selectedMatch.overall}%</span>
                    <span style={{ color:C.rose }}>Gap · {100-selectedMatch.overall}%</span>
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
                    <div>
                      <div style={{ fontFamily:mono, fontSize:10, color:C.green, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10 }}>You bring</div>
                      {selectedMatch.matchedSkills.length===0&&<div style={{ color:C.muted, fontSize:13, fontStyle:"italic" }}>No overlap yet — stretch role.</div>}
                      {selectedMatch.matchedSkills.map(s=><div key={s} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:8 }}><span style={{ color:C.green, fontSize:13, lineHeight:"1.4", flexShrink:0 }}>✓</span><span style={{ fontSize:13, color:C.text, lineHeight:"1.4" }}>{s}</span></div>)}
                    </div>
                    <div>
                      <div style={{ fontFamily:mono, fontSize:10, color:C.rose, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10 }}>Still to build</div>
                      {selectedMatch.missingSkills.length===0&&<div style={{ color:C.muted, fontSize:13, fontStyle:"italic" }}>All skills covered.</div>}
                      {selectedMatch.missingSkills.map(s=><div key={s} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:8 }}><span style={{ color:C.rose, fontSize:13, lineHeight:"1.4", flexShrink:0 }}>○</span><span style={{ fontSize:13, color:C.text, lineHeight:"1.4" }}>{s}</span></div>)}
                    </div>
                  </div>

                  {(ai?.status==="success"||ai?.status==="fallback")&&(
                    <div style={{ background:C.raised, border:`1px solid ${C.border}`, borderRadius:10, padding:16 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, flexWrap:"wrap", gap:8 }}>
                        <div style={{ fontFamily:mono, fontSize:10, color:C.amber, letterSpacing:"0.1em", textTransform:"uppercase" }}>In plain terms</div>
                        <button type="button" onClick={()=>{
                          const lines=[`${selectedRoleStatic.name} — ${m.label} (${selectedMatch.overall}/100)`,"",`You bring: ${selectedMatch.matchedSkills.join(", ")||"—"}`,`Still to build: ${selectedMatch.missingSkills.join(", ")||"—"}`,"","In plain terms:",ai.data.gapAnalysis];
                          copyGapText(lines.join("\n"));
                        }} style={{ background:"none", border:"none", color:C.amber, fontSize:12, cursor:"pointer", textDecoration:"underline", fontFamily:mono, padding:0 }}>{gapCopied?"✓ Copied":"Copy full gap analysis"}</button>
                      </div>
                      <div style={{ fontSize:14, lineHeight:1.7, color:C.muted }}>{ai.data.gapAnalysis}</div>
                      {gapCopyText&&<div style={{ marginTop:12 }}>
                        <div style={{ color:C.muted, fontSize:12, marginBottom:6 }}>Couldn't auto-copy — select the box below and copy manually.</div>
                        <textarea readOnly value={gapCopyText} rows={5} onClick={e=>e.target.select()} style={{ width:"100%", background:C.bg, border:`1px solid ${C.amber}`, borderRadius:8, padding:12, fontSize:11, color:C.text, fontFamily:mono, resize:"none" }} />
                      </div>}
                    </div>
                  )}
                </div>

                {/* Next steps */}
                {(ai?.status==="success"||ai?.status==="fallback")&&(
                  <div style={{ marginBottom:24, paddingBottom:24, borderBottom:`1px solid ${C.border}` }}>
                    <div style={{ fontFamily:mono, fontSize:10, color:C.amber, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Suggested next steps</div>
                    <div style={{ fontSize:12, color:C.muted, marginBottom:14 }}>Things you can do on your own — a course, a project, a mentor conversation.</div>
                    {ai.data.nextSteps.map((step,i)=>(
                      <div key={i} style={{ display:"flex", gap:14, marginBottom:16, alignItems:"flex-start" }}>
                        <div style={{ width:26, height:26, borderRadius:6, background:[C.green,C.amber,C.rose][i]||C.muted, color:"#000", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:mono, fontSize:11, fontWeight:700, flexShrink:0 }}>{i+1}</div>
                        <span style={{ fontSize:14, color:C.muted, lineHeight:1.6, paddingTop:4 }}>{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Save warning */}
                {markSaveError===tmk&&(
                  <div style={{ background:C.roseSoft, border:`1px solid ${C.roseDim}`, borderRadius:8, padding:"10px 14px", fontSize:13, display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, marginBottom:16, flexWrap:"wrap" }}>
                    <span>⚠ Didn't save — this mark may not persist after a refresh.</span>
                    <button type="button" onClick={()=>retryMarkSave(tmk)} style={{ background:"none", border:"none", color:C.rose, fontSize:12, cursor:"pointer", textDecoration:"underline" }}>Retry</button>
                  </div>
                )}

                {/* Mark button */}
                <button type="button" className={markPulse?"mark-pulse":""} onClick={()=>toggleMarked(selectedRoleId,ctxPid)} style={{ width:"100%", padding:"14px 24px", borderRadius:10, fontSize:15, fontWeight:600, cursor:"pointer", border:`1px solid ${isMarked?C.green:C.border}`, background:isMarked?C.greenSoft:"transparent", color:isMarked?C.green:C.text }}>
                  {isMarked?<><span className="check-pop">✓</span> Relevant & Reachable</>:"Mark Relevant & Reachable"}
                </button>

                {/* What next */}
                {isMarked&&(
                  <div style={{ marginTop:24, paddingTop:24, borderTop:`1px solid ${C.border}` }}>
                    <div style={{ fontFamily:mono, fontSize:10, color:C.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>What next?</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {[["Browse more roles →","results"],["See all my marked roles →","marked"],["Retake the questionnaire →","retake"]].map(([label,action])=>(
                        <button key={action} type="button" onClick={()=>action==="retake"?goToQuestionnaire():setPage(action)} style={{ width:"100%", padding:"12px 16px", textAlign:"left", borderRadius:8, background:C.surface, border:`1px solid ${C.border}`, color:C.text, fontSize:14, cursor:"pointer" }}>{label}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>;
        })()}

        {/* ══ MARKED ROLES ══ */}
        {page==="marked"&&(
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:8 }}>
              <button style={S.backBtn} onClick={()=>setPage(scoredRoles.length?"results":"form")}>← Back</button>
              <button style={{ ...S.backBtn, marginBottom:0 }} onClick={()=>setPage("form")}>🏠 Home</button>
            </div>
            {markedList.length===0&&<div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:24, color:C.muted, fontSize:14 }}>Nothing marked yet — mark a role Relevant & Reachable and it'll show up here.</div>}
            {markedList.length>0&&<>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, marginBottom:28 }}>
                <div style={{ fontWeight:700, fontSize:20 }}>{markedList.length} role{markedList.length!==1?"s":""} marked</div>
                <div style={{ color:C.muted, fontSize:12, marginTop:4 }}>Across {groupsByProfile.length+(orphanEntries.length?1:0)} questionnaire submission{(groupsByProfile.length+(orphanEntries.length?1:0))!==1?"s":""}</div>
              </div>
              {groupsByProfile.map(g=>(
                <div key={g.profile.id} style={{ marginBottom:28 }}>
                  <div style={{ fontFamily:mono, fontSize:10, color:C.amber, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>{new Date(g.profile.submittedAt).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})} · {g.profile.profile.degree}, {g.profile.profile.branch}</div>
                  <div style={{ color:C.muted, fontSize:12, marginBottom:12 }}>{g.entries.length} role{g.entries.length!==1?"s":""} marked on this profile</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {g.entries.map(e=>{
                      const m=TIER[e.tier];
                      return <div key={`${e.roleId}::${e.profileId}`} onClick={()=>openRoleDetail(e.roleId,"marked",e.profileId)} style={{ background:C.surface, border:`1px solid ${C.border}`, borderLeft:`3px solid ${m.color}`, borderRadius:10, padding:"14px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background:m.color, flexShrink:0 }} />
                        <span style={{ fontWeight:500, flex:1, fontSize:14 }}>{e.roleName}</span>
                        <span style={{ fontFamily:mono, fontSize:11, color:m.color, fontWeight:600 }}>{e.tier} · {e.overall}/100</span>
                        <span style={{ fontFamily:mono, fontSize:11, color:C.muted }}>→</span>
                      </div>;
                    })}
                  </div>
                </div>
              ))}
              {orphanEntries.length>0&&(
                <div style={{ marginBottom:28 }}>
                  <div style={{ fontFamily:mono, fontSize:10, color:C.amber, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>Earlier marks</div>
                  <div style={{ color:C.muted, fontSize:12, marginBottom:12 }}>{orphanEntries.length} role{orphanEntries.length!==1?"s":""} marked before profile tracking was added</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {orphanEntries.map(e=>{
                      const m=TIER[e.tier];
                      return <div key={`${e.roleId}::${e.profileId}`} onClick={()=>openRoleDetail(e.roleId,"marked",e.profileId)} style={{ background:C.surface, border:`1px solid ${C.border}`, borderLeft:`3px solid ${m.color}`, borderRadius:10, padding:"14px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background:m.color, flexShrink:0 }} />
                        <span style={{ fontWeight:500, flex:1, fontSize:14 }}>{e.roleName}</span>
                        <span style={{ fontFamily:mono, fontSize:11, color:m.color, fontWeight:600 }}>{e.tier} · {e.overall}/100</span>
                        <span style={{ fontFamily:mono, fontSize:11, color:C.muted }}>→</span>
                      </div>;
                    })}
                  </div>
                </div>
              )}
            </>}
          </div>
        )}

        {/* ══ PROFILE ══ */}
        {page==="profile"&&(
          <div>
            <button style={S.backBtn} onClick={()=>setPage("form")}>← Back</button>
            <div style={{ ...S.card, marginBottom:16 }}>
              <div style={{ fontFamily:mono, fontSize:10, color:C.amber, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16 }}>About you (kept on-device only)</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                <input value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))} placeholder="Name" style={S.input} />
                <input value={profile.email} onChange={e=>setProfile(p=>({...p,email:e.target.value}))} placeholder="Email" style={S.input} />
              </div>
              <button type="button" onClick={saveProfileInfo} style={{ padding:"10px 20px", borderRadius:8, background:C.surface, border:`1px solid ${C.border}`, color:C.text, fontSize:13, cursor:"pointer" }}>{profileSaved?"✓ Saved":"Save"}</button>
              <div style={{ color:C.muted, fontSize:12, marginTop:10 }}>Name and email stay on your device — never sent anywhere.</div>
            </div>
            <div style={S.card}>
              <div style={{ fontFamily:mono, fontSize:10, color:C.amber, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16 }}>Your answers</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10, fontSize:14 }}>
                {[["Degree",profile.degree],["Branch",profile.branch],["Skills",profile.skills.join(", ")],["Experience",profile.experienceTypes.join(", ")],profile.experienceDetail&&["Detail",profile.experienceDetail],["Languages",profile.languages.length?profile.languages.map(l=>`${l} (${profile.languageProficiency[l]}/5)`).join(", "):"—"]].filter(Boolean).map(([k,v])=>(
                  <div key={k} style={{ display:"flex", gap:8 }}><span style={{ color:C.muted, width:80, flexShrink:0 }}>{k}</span><span style={{ color:C.text }}>{v||"—"}</span></div>
                ))}
              </div>
              {scoredRoles.length>0&&<button type="button" onClick={()=>setPage("results")} style={{ ...S.btnPrimary, marginTop:16 }}>Back to my role map →</button>}
            </div>
          </div>
        )}

        {/* ══ DASHBOARD ══ */}
        {page==="dashboard"&&(
          <div>
            <button style={S.backBtn} onClick={()=>setPage("form")}>← Back</button>
            {!dashboardUnlocked&&(
              <div style={S.card}>
                <div style={{ fontFamily:mono, fontSize:10, color:C.amber, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>Private — passcode required</div>
                <div style={{ color:C.muted, fontSize:14, marginBottom:16 }}>Only people you've shared the passcode with can view these numbers.</div>
                <div style={{ display:"flex", gap:8 }}>
                  <input type="password" value={passcodeInput} onChange={e=>{setPasscodeInput(e.target.value);setPasscodeError(false);}} onKeyDown={e=>{if(e.key==="Enter")unlockDashboard();}} placeholder="Enter passcode" style={{...S.input,flex:1,border:`1px solid ${passcodeError?C.rose:C.border}`}} />
                  <button type="button" onClick={unlockDashboard} style={{ padding:"11px 20px", borderRadius:8, background:C.amber, color:"#000", border:"none", fontSize:14, fontWeight:600, cursor:"pointer" }}>Unlock</button>
                </div>
                {passcodeError&&<div style={{ color:C.rose, fontSize:12, marginTop:8 }}>That's not it — try again.</div>}
              </div>
            )}
            {dashboardUnlocked&&<>
              {dashboardLoading&&<div style={{ color:C.muted, fontSize:14, fontStyle:"italic" }}>Loading sessions…</div>}
              {!dashboardLoading&&dashboard?.error&&<div style={{ color:C.rose, fontSize:14 }}>Couldn't load session data right now.</div>}
              {!dashboardLoading&&dashboard&&!dashboard.error&&dashboard.total===0&&<div style={{ ...S.card, color:C.muted, fontSize:14 }}>No sessions yet — real numbers appear once testers use it.</div>}
              {!dashboardLoading&&dashboard&&!dashboard.error&&dashboard.total>0&&(()=>{
                const MIN=62,TARGET_PCT=35;
                const sampleMet=dashboard.total>=MIN;
                const targetCount=Math.ceil(dashboard.total*(TARGET_PCT/100));
                const remaining=Math.max(0,targetCount-dashboard.markedAtLeastOne);
                const targetMet=dashboard.markedAtLeastOne>=targetCount;
                const progressPct=targetCount>0?Math.min(100,Math.round((dashboard.markedAtLeastOne/targetCount)*100)):0;
                return <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
                  <div>
                    <div style={{ fontFamily:mono, fontSize:10, color:C.amber, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>KPIs</div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
                      {[["Reached results",`${dashboard.reachedResults} / ${dashboard.total}`],["Detail views",`${dashboard.avgDetailViews.toFixed(1)} avg`],["Gap views",`${dashboard.avgGapViews.toFixed(1)} avg`],["Roles marked",`${dashboard.avgMarked.toFixed(1)} avg`]].map(([label,val])=>(
                        <div key={label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"16px 20px" }}>
                          <div style={{ fontFamily:mono, fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>{label}</div>
                          <div style={{ fontFamily:mono, fontSize:20, fontWeight:700, color:C.text }}>{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background:C.surface, border:`1px solid ${sampleMet?C.green:C.amberDim}`, borderRadius:10, padding:20 }}>
                    <div style={{ fontFamily:mono, fontSize:10, color:C.amber, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>Sample size</div>
                    <div style={{ fontFamily:mono, fontSize:24, fontWeight:700, color:C.text, marginBottom:6 }}>{dashboard.total} <span style={{ fontSize:13, fontWeight:400, color:C.muted }}>/ {MIN} minimum</span></div>
                    <div style={{ fontSize:13, color:sampleMet?C.green:C.muted }}>{sampleMet?"✓ Minimum reached — KR% below is valid signal":`Need ${MIN-dashboard.total} more tester${MIN-dashboard.total!==1?"s":""} before this is a valid pass/fail`}</div>
                  </div>
                  <div style={{ background:C.surface, border:`1px solid ${!sampleMet?C.border:targetMet?C.green:C.rose}`, borderRadius:10, padding:24 }}>
                    <div style={{ fontFamily:mono, fontSize:10, color:C.amber, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>Key result progress</div>
                    <div style={{ fontFamily:mono, fontSize:42, fontWeight:700, color:!sampleMet?C.muted:targetMet?C.green:C.rose, lineHeight:1, marginBottom:6 }}>{dashboard.krPercent}%</div>
                    <div style={{ fontSize:12, color:C.muted, marginBottom:16 }}>Target: 35% · {dashboard.markedAtLeastOne} of {dashboard.total} sessions marked a role reachable</div>
                    <div style={{ height:6, borderRadius:3, background:C.faint, overflow:"hidden", marginBottom:10 }}>
                      <div style={{ height:"100%", width:`${progressPct}%`, background:!sampleMet?C.muted:targetMet?C.green:C.rose, borderRadius:3, transition:"width 0.6s ease" }} />
                    </div>
                    <div style={{ fontSize:13, color:C.text }}>
                      {!sampleMet?"Inconclusive — below the 62-tester minimum, not a pass or fail yet":targetMet?`Target reached — ${dashboard.markedAtLeastOne-targetCount} session${dashboard.markedAtLeastOne-targetCount!==1?"s":""} above threshold`:`${remaining} more session${remaining!==1?"s":""} needed to hit 35%`}
                    </div>
                  </div>
                  <button type="button" onClick={loadDashboard} style={{ background:"none", border:"none", color:C.muted, fontSize:12, cursor:"pointer", fontFamily:mono, textDecoration:"underline", textAlign:"left", padding:0 }}>Refresh</button>
                </div>;
              })()}
            </>}
          </div>
        )}

      </div>
    </div>
  );
}
