import { useState } from "react";

const MODES = { home: "home", generate: "generate", optimize: "optimize", result: "result" };

const GEN_STEPS = ["Personal", "Experience", "Skills", "Projects"];

const EMPTY_DATA = {
  name: "", title: "", email: "", phone: "", location: "", linkedin: "", github: "", summary: "",
  experience: [{ company: "", role: "", period: "", bullets: "" }],
  skills: { languages: "", backend: "", frontend: "", tools: "", concepts: "" },
  projects: [{ name: "", stack: "", bullets: "" }],
  education: { degree: "", college: "" }
};

// ─── Shared primitives ───────────────────────────────────────────────
function Inp({ value, onChange, placeholder, rows, type = "text" }) {
  const base = {
    width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8, padding: rows ? "12px 14px" : "10px 14px", color: "#f0ede8",
    fontFamily: "inherit", fontSize: 14, outline: "none", boxSizing: "border-box",
    lineHeight: 1.6, resize: rows ? "vertical" : "none", transition: "border-color 0.2s",
  };
  return rows
    ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={base}
        onFocus={e => e.target.style.borderColor = "#e8a87c"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"} />
    : <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={base}
        onFocus={e => e.target.style.borderColor = "#e8a87c"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"} />;
}

function Field({ label, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a09890", marginBottom: 6 }}>{label}</div>
      <Inp {...props} />
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", disabled, style = {} }) {
  const styles = {
    primary: { background: "#e8a87c", color: "#1a1209", border: "none" },
    outline: { background: "transparent", color: "#e8a87c", border: "1px solid #e8a87c" },
    ghost:   { background: "rgba(255,255,255,0.07)", color: "#c4b8ae", border: "1px solid rgba(255,255,255,0.1)" },
    danger:  { background: "transparent", color: "#e87c7c", border: "1px solid #e87c7c" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...styles[variant], padding: "10px 22px", borderRadius: 8, fontFamily: "inherit",
      fontWeight: 700, fontSize: 13, cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1, transition: "all 0.15s", letterSpacing: "0.03em", ...style
    }}>{children}</button>
  );
}

// ─── API call ────────────────────────────────────────────────────────
async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await res.json();
  return data.content?.find(b => b.type === "text")?.text || "";
}

// ─── Home screen ─────────────────────────────────────────────────────
function Home({ setMode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>

      <div style={{ fontSize: 13, letterSpacing: "0.25em", textTransform: "uppercase", color: "#e8a87c", marginBottom: 20, fontWeight: 600 }}>
        ✦ Powered by Claude AI
      </div>

      <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, margin: "0 0 16px", lineHeight: 1.1, fontFamily: "'Playfair Display', Georgia, serif", color: "#f0ede8", letterSpacing: -1 }}>
        Resume<br /><span style={{ color: "#e8a87c" }}>Studio</span>
      </h1>

      <p style={{ color: "#a09890", fontSize: 16, maxWidth: 440, margin: "0 0 56px", lineHeight: 1.7 }}>
        Generate a professional resume from scratch or optimize your existing one to match any job description.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 560, width: "100%" }}>

        <div onClick={() => setMode(MODES.generate)} style={{
          background: "rgba(232,168,124,0.08)", border: "1px solid rgba(232,168,124,0.25)",
          borderRadius: 16, padding: "32px 24px", cursor: "pointer", transition: "all 0.2s", textAlign: "left"
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(232,168,124,0.14)"; e.currentTarget.style.borderColor = "rgba(232,168,124,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(232,168,124,0.08)"; e.currentTarget.style.borderColor = "rgba(232,168,124,0.25)"; }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>✨</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#f0ede8", marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>Generate</div>
          <div style={{ fontSize: 13, color: "#a09890", lineHeight: 1.6 }}>Fill in your details — Claude builds your resume from scratch</div>
        </div>

        <div onClick={() => setMode(MODES.optimize)} style={{
          background: "rgba(124,168,232,0.08)", border: "1px solid rgba(124,168,232,0.25)",
          borderRadius: 16, padding: "32px 24px", cursor: "pointer", transition: "all 0.2s", textAlign: "left"
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,168,232,0.14)"; e.currentTarget.style.borderColor = "rgba(124,168,232,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,168,232,0.08)"; e.currentTarget.style.borderColor = "rgba(124,168,232,0.25)"; }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>🎯</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#f0ede8", marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>Optimize</div>
          <div style={{ fontSize: 13, color: "#a09890", lineHeight: 1.6 }}>Paste a job description — Claude tailors your resume to match</div>
        </div>

      </div>
    </div>
  );
}

// ─── Generator ───────────────────────────────────────────────────────
function Generator({ setMode, setResult, setResultType }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(EMPTY_DATA);
  const [loading, setLoading] = useState(false);

  const set = (path, val) => {
    setData(prev => {
      const d = JSON.parse(JSON.stringify(prev));
      path.split(".").reduce((o, k, i, a) => i === a.length - 1 ? (o[k] = val) : o[k], d);
      return d;
    });
  };
  const setArr = (key, i, field, val) => setData(p => { const d = JSON.parse(JSON.stringify(p)); d[key][i][field] = val; return d; });

  const generate = async () => {
    setLoading(true);
    try {
      const text = await callClaude(`Generate a professional ATS-optimized resume in plain text with clear sections, bullet points (•), action verbs, and quantified achievements.

Name: ${data.name} | Title: ${data.title} | Email: ${data.email} | Phone: ${data.phone}
Location: ${data.location} | LinkedIn: ${data.linkedin} | GitHub: ${data.github}
Summary: ${data.summary}

EXPERIENCE:
${data.experience.map(e => `${e.role} at ${e.company} (${e.period})\n${e.bullets}`).join("\n\n")}

SKILLS: Languages: ${data.skills.languages} | Backend: ${data.skills.backend} | Frontend: ${data.skills.frontend} | Tools: ${data.skills.tools} | Concepts: ${data.skills.concepts}

PROJECTS:
${data.projects.map(p => `${p.name} | ${p.stack}\n${p.bullets}`).join("\n\n")}

EDUCATION: ${data.education.degree} — ${data.education.college}

Generate complete professional resume with all sections.`);
      setResult(text);
      setResultType("generate");
      setMode(MODES.result);
    } catch { alert("Failed. Try again."); }
    setLoading(false);
  };

  const card = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 28 };
  const isLast = step === GEN_STEPS.length - 1;

  return (
    <div style={{ maxWidth: 660, margin: "0 auto", padding: "32px 20px" }}>

      <button onClick={() => setMode(MODES.home)} style={{ background: "none", border: "none", color: "#a09890", cursor: "pointer", fontSize: 13, marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>
        ← Back
      </button>

      {/* Step bar */}
      <div style={{ display: "flex", gap: 6, marginBottom: 28, flexWrap: "wrap" }}>
        {GEN_STEPS.map((s, i) => (
          <div key={s} onClick={() => i < step && setStep(i)} style={{
            padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: i < step ? "pointer" : "default",
            background: step === i ? "#e8a87c" : i < step ? "rgba(232,168,124,0.15)" : "rgba(255,255,255,0.06)",
            color: step === i ? "#1a1209" : i < step ? "#e8a87c" : "#7a7068",
            border: `1px solid ${step === i ? "#e8a87c" : i < step ? "rgba(232,168,124,0.4)" : "rgba(255,255,255,0.1)"}`
          }}>{i + 1}. {s}</div>
        ))}
      </div>

      {/* Step 0: Personal */}
      {step === 0 && <div style={card}>
        <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, fontFamily: "serif", color: "#f0ede8" }}>Personal Info</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
          <Field label="Full Name" value={data.name} onChange={e => set("name", e.target.value)} placeholder="Praveen Nayak" />
          <Field label="Job Title" value={data.title} onChange={e => set("title", e.target.value)} placeholder="Junior Software Engineer" />
          <Field label="Email" value={data.email} onChange={e => set("email", e.target.value)} placeholder="you@email.com" />
          <Field label="Phone" value={data.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 9000000000" />
          <Field label="Location" value={data.location} onChange={e => set("location", e.target.value)} placeholder="Bangalore, India" />
          <Field label="LinkedIn" value={data.linkedin} onChange={e => set("linkedin", e.target.value)} placeholder="linkedin.com/in/yourname" />
        </div>
        <Field label="GitHub" value={data.github} onChange={e => set("github", e.target.value)} placeholder="github.com/username" />
        <Field label="Summary (optional)" value={data.summary} onChange={e => set("summary", e.target.value)} placeholder="Brief professional summary..." rows={3} />
      </div>}

      {/* Step 1: Experience */}
      {step === 1 && <div style={card}>
        <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, fontFamily: "serif", color: "#f0ede8" }}>Work Experience</h2>
        {data.experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: i < data.experience.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: "#e8a87c", fontWeight: 700 }}>Experience #{i + 1}</span>
              {data.experience.length > 1 && <button onClick={() => setData(p => ({ ...p, experience: p.experience.filter((_, j) => j !== i) }))} style={{ background: "none", border: "none", color: "#e87c7c", cursor: "pointer", fontSize: 16 }}>×</button>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
              <Field label="Company" value={exp.company} onChange={e => setArr("experience", i, "company", e.target.value)} placeholder="Company Name" />
              <Field label="Role" value={exp.role} onChange={e => setArr("experience", i, "role", e.target.value)} placeholder="Software Engineer" />
            </div>
            <Field label="Period" value={exp.period} onChange={e => setArr("experience", i, "period", e.target.value)} placeholder="Jan 2024 – Present" />
            <Field label="What did you do? (one point per line)" value={exp.bullets} onChange={e => setArr("experience", i, "bullets", e.target.value)} placeholder={"Built REST APIs with Spring Boot\nImproved performance by 40%"} rows={4} />
          </div>
        ))}
        <button onClick={() => setData(p => ({ ...p, experience: [...p.experience, { company: "", role: "", period: "", bullets: "" }] }))} style={{ background: "transparent", border: "1px dashed rgba(232,168,124,0.4)", color: "#e8a87c", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600 }}>+ Add Experience</button>
      </div>}

      {/* Step 2: Skills */}
      {step === 2 && <div style={card}>
        <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, fontFamily: "serif", color: "#f0ede8" }}>Skills & Education</h2>
        <Field label="Languages" value={data.skills.languages} onChange={e => set("skills.languages", e.target.value)} placeholder="Java, Python, JavaScript, TypeScript" />
        <Field label="Backend" value={data.skills.backend} onChange={e => set("skills.backend", e.target.value)} placeholder="Spring Boot, Node.js, Express, REST APIs" />
        <Field label="Frontend" value={data.skills.frontend} onChange={e => set("skills.frontend", e.target.value)} placeholder="React.js, HTML5, CSS3, JavaScript" />
        <Field label="Tools" value={data.skills.tools} onChange={e => set("skills.tools", e.target.value)} placeholder="Git, GitHub, Postman, VS Code" />
        <Field label="Concepts" value={data.skills.concepts} onChange={e => set("skills.concepts", e.target.value)} placeholder="OOP, Data Structures, Agile, SDLC" />
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16, marginTop: 4 }}>
          <Field label="Degree" value={data.education.degree} onChange={e => set("education.degree", e.target.value)} placeholder="Bachelor of Computer Applications (BCA)" />
          <Field label="College" value={data.education.college} onChange={e => set("education.college", e.target.value)} placeholder="Fatima Degree College, Dharwad" />
        </div>
      </div>}

      {/* Step 3: Projects */}
      {step === 3 && <div style={card}>
        <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, fontFamily: "serif", color: "#f0ede8" }}>Projects</h2>
        {data.projects.map((proj, i) => (
          <div key={i} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: i < data.projects.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: "#e8a87c", fontWeight: 700 }}>Project #{i + 1}</span>
              {data.projects.length > 1 && <button onClick={() => setData(p => ({ ...p, projects: p.projects.filter((_, j) => j !== i) }))} style={{ background: "none", border: "none", color: "#e87c7c", cursor: "pointer", fontSize: 16 }}>×</button>}
            </div>
            <Field label="Project Name" value={proj.name} onChange={e => setArr("projects", i, "name", e.target.value)} placeholder="Rice Morph Pro" />
            <Field label="Tech Stack" value={proj.stack} onChange={e => setArr("projects", i, "stack", e.target.value)} placeholder="Spring Boot, MySQL, REST API" />
            <Field label="What did you build?" value={proj.bullets} onChange={e => setArr("projects", i, "bullets", e.target.value)} placeholder={"Built REST APIs processing 500+ records\nDeployed live on Netlify"} rows={3} />
          </div>
        ))}
        <button onClick={() => setData(p => ({ ...p, projects: [...p.projects, { name: "", stack: "", bullets: "" }] }))} style={{ background: "transparent", border: "1px dashed rgba(232,168,124,0.4)", color: "#e8a87c", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600 }}>+ Add Project</button>
      </div>}

      {/* Nav */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
        <Btn variant="ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>← Back</Btn>
        {!isLast
          ? <Btn onClick={() => setStep(s => s + 1)}>Next →</Btn>
          : <Btn onClick={generate} disabled={loading} style={{ minWidth: 160 }}>{loading ? "⚡ Generating..." : "✨ Generate Resume"}</Btn>
        }
      </div>
    </div>
  );
}

// ─── Optimizer ───────────────────────────────────────────────────────
function Optimizer({ setMode, setResult, setResultType }) {
  const [jobDesc, setJobDesc] = useState("");
  const [resumeTxt, setResumeTxt] = useState("");
  const [loading, setLoading] = useState(false);

  const optimize = async () => {
    if (!jobDesc.trim() || !resumeTxt.trim()) return;
    setLoading(true);
    try {
      const text = await callClaude(`You are an expert ATS resume optimizer.

JOB DESCRIPTION:
${jobDesc}

CURRENT RESUME:
${resumeTxt}

Rewrite the resume to match the job. Use keywords from JD naturally, strong action verbs, quantified achievements. Keep same experience but tailor it.

Format EXACTLY:
===OPTIMIZED RESUME===
[full optimized resume]

===OPTIMIZATION TIPS===
• [tip 1]
• [tip 2]
• [tip 3]
• [tip 4]
• [tip 5]`);
      setResult(text);
      setResultType("optimize");
      setMode(MODES.result);
    } catch { alert("Failed. Try again."); }
    setLoading(false);
  };

  const card = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 28 };

  return (
    <div style={{ maxWidth: 660, margin: "0 auto", padding: "32px 20px" }}>
      <button onClick={() => setMode(MODES.home)} style={{ background: "none", border: "none", color: "#a09890", cursor: "pointer", fontSize: 13, marginBottom: 24 }}>← Back</button>

      <div style={card}>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, fontFamily: "serif", color: "#f0ede8" }}>Resume Optimizer</h2>
        <p style={{ color: "#a09890", fontSize: 13, margin: "0 0 24px" }}>Paste a job description + your resume — Claude tailors it to match perfectly</p>

        <Field label="Job Description" value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Paste the full job description here — requirements, responsibilities, tech stack..." rows={7} />
        <Field label="Your Current Resume" value={resumeTxt} onChange={e => setResumeTxt(e.target.value)} placeholder="Paste your current resume text here..." rows={10} />

        <Btn onClick={optimize} disabled={loading || !jobDesc.trim() || !resumeTxt.trim()} style={{ width: "100%", justifyContent: "center", padding: "13px" }}>
          {loading ? "⚡ Optimizing with Claude..." : "🎯 Optimize Resume →"}
        </Btn>
      </div>
    </div>
  );
}

// ─── Result screen ───────────────────────────────────────────────────
function Result({ result, resultType, setMode }) {
  const [tab, setTab] = useState("resume");
  const [copied, setCopied] = useState(false);

  const getSection = (label) => {
    const start = result.indexOf(`===${label}===`);
    if (start === -1) return result;
    const content = result.slice(start + label.length + 6);
    const next = content.indexOf("===");
    return (next === -1 ? content : content.slice(0, next)).trim();
  };

  const optimized = resultType === "optimize" ? getSection("OPTIMIZED RESUME") : result;
  const tips = resultType === "optimize" ? getSection("OPTIMIZATION TIPS") : "";

  const copy = () => { navigator.clipboard.writeText(optimized); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const parseTips = t => t.split("\n").filter(l => l.trim().match(/^[•\-\*]/)).map(l => l.replace(/^[•\-\*]\s*/, "").trim()).filter(Boolean);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px" }}>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: "#e8a87c", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
            {resultType === "generate" ? "✨ Resume Generated" : "🎯 Resume Optimized"}
          </div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, fontFamily: "serif", color: "#f0ede8" }}>Your AI Resume is Ready</h2>
        </div>
        <Btn variant="ghost" onClick={() => setMode(MODES.home)}>Start Over</Btn>
      </div>

      {/* Tabs */}
      {resultType === "optimize" && (
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "rgba(255,255,255,0.05)", padding: 4, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)" }}>
          {[["resume", "📄 Optimized Resume"], ["tips", "💡 Tips"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              flex: 1, padding: "8px 16px", border: "none", borderRadius: 7,
              background: tab === key ? "rgba(232,168,124,0.15)" : "transparent",
              color: tab === key ? "#e8a87c" : "#7a7068",
              fontFamily: "inherit", fontSize: 13, fontWeight: tab === key ? 700 : 500, cursor: "pointer",
              borderBottom: tab === key ? "2px solid #e8a87c" : "2px solid transparent"
            }}>{label}</button>
          ))}
        </div>
      )}

      {/* Resume output */}
      {tab === "resume" && (
        <>
          <pre style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12, padding: 24, fontSize: 12.5, lineHeight: 1.8,
            fontFamily: "'Courier New', monospace", whiteSpace: "pre-wrap", wordBreak: "break-word",
            maxHeight: 520, overflowY: "auto", color: "#d4cfc9", margin: 0
          }}>{optimized}</pre>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <Btn onClick={copy}>{copied ? "✅ Copied!" : "📋 Copy Resume"}</Btn>
            <Btn variant="ghost" onClick={() => setMode(resultType === "generate" ? MODES.generate : MODES.optimize)}>Try Again</Btn>
          </div>
        </>
      )}

      {/* Tips */}
      {tab === "tips" && tips && (
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24 }}>
          {parseTips(tips).map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < parseTips(tips).length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div style={{ width: 6, height: 6, minWidth: 6, background: "#e8a87c", borderRadius: "50%", marginTop: 7 }} />
              <span style={{ fontSize: 14, color: "#c4b8ae", lineHeight: 1.6 }}>{tip}</span>
            </div>
          ))}
          <div style={{ marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => setMode(MODES.optimize)}>Optimize Another</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState(MODES.home);
  const [result, setResult] = useState("");
  const [resultType, setResultType] = useState("");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#100d09",
      backgroundImage: "radial-gradient(ellipse at 20% 20%, rgba(232,168,124,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(124,168,232,0.05) 0%, transparent 60%)",
      color: "#f0ede8",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>

      {/* Top bar */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => setMode(MODES.home)} style={{ cursor: "pointer", fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#f0ede8", letterSpacing: -0.5 }}>
          Resume<span style={{ color: "#e8a87c" }}>Studio</span>
        </div>
        <div style={{ fontSize: 11, color: "#7a7068", letterSpacing: "0.15em", textTransform: "uppercase" }}>Claude AI</div>
      </div>

      {mode === MODES.home     && <Home setMode={setMode} />}
      {mode === MODES.generate && <Generator setMode={setMode} setResult={setResult} setResultType={setResultType} />}
      {mode === MODES.optimize && <Optimizer setMode={setMode} setResult={setResult} setResultType={setResultType} />}
      {mode === MODES.result   && <Result result={result} resultType={resultType} setMode={setMode} />}

    </div>
  );
}
