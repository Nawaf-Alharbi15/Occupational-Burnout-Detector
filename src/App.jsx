import { useState, useEffect } from "react";
import {q} from './quiestions.js'
import {options} from './quiestions.js'
import "./App.css";
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);
/* ============================================================
   DATA
   ============================================================ */
 
const questions = q;
 
const scaleOptions = options;
 
// Per-dimension theme colours (used as inline styles where CSS cannot reach)
const dimInfo = {
  exhaustion:  { label: "Exhaustion",  icon: "🔥", color: "#E87C3E", bg: "rgba(232,124,62,0.12)",  border: "rgba(232,124,62,0.3)"  },
  cynicism:    { label: "Cynicism",    icon: "🌫️", color: "#A07BE8", bg: "rgba(160,123,232,0.12)", border: "rgba(160,123,232,0.3)" },
  performance: { label: "Performance", icon: "⚡", color: "#3EB8A0", bg: "rgba(62,184,160,0.12)",  border: "rgba(62,184,160,0.3)"  },
};
 
/* ============================================================
   HELPERS
   ============================================================ */
 
function calcScores(answers) {
  const grouped = { exhaustion: [], cynicism: [], performance: [] };
  questions.forEach(q => {
    if (answers[q.id] !== undefined) {
      // If reverse: true, flip the value (4 - value)
      // e.g. an answer of 4 (Always) becomes 0 (Never) — meaning good performance = low burnout
      const value = q.reverse ? 4 - answers[q.id] : answers[q.id];
      grouped[q.category].push(value);
    }
  });
  const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  return {
    exhaustion: Math.round((avg(grouped.exhaustion) / 4) * 100),
    cynicism: Math.round((avg(grouped.cynicism) / 4) * 100),
    performance: Math.round((avg(grouped.performance) / 4) * 100),
  };
}
 
function getBurnoutLevel(scores) {
  const total = (scores.exhaustion + scores.cynicism + scores.performance) / 3;
  if (total < 1.5)   return { level: "Low",      color: "#3EB8A0", bg: "rgba(62,184,160,0.12)",  desc: "Minimal burnout indicators" };
  if (total < 2.5) return { level: "Moderate", color: "#E8B43E", bg: "rgba(232,180,62,0.12)",  desc: "Some burnout indicators present" };
  return               { level: "High",     color: "#E85C4A", bg: "rgba(232,92,74,0.12)",   desc: "Significant burnout indicators" };
}
 
// Injects Google Fonts once on mount
function useFonts() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap";
    link.rel  = "stylesheet";
    document.head.appendChild(link);
  }, []);
}
 
/* ============================================================
   HOME PAGE
   ============================================================ */
 
// Ember particle config — positions/sizes/colours are data, not presentation
const EMBERS = [
  { size: 6, color: "#E87C3E", top: 20, left: 10, duration: 3.2, delay: 0   },
  { size: 4, color: "#E8B43E", top: 65, left: 85, duration: 4.1, delay: 0.5 },
  { size: 8, color: "#E87C3E", top: 40, left: 30, duration: 2.8, delay: 1   },
  { size: 5, color: "#A07BE8", top: 80, left: 60, duration: 3.7, delay: 1.5 },
  { size: 7, color: "#E8B43E", top: 15, left: 75, duration: 4.5, delay: 0.3 },
  { size: 4, color: "#3EB8A0", top: 55, left: 20, duration: 3.0, delay: 0.8 },
  { size: 6, color: "#E87C3E", top: 70, left: 50, duration: 2.5, delay: 1.2 },
  { size: 5, color: "#A07BE8", top: 30, left: 40, duration: 4.2, delay: 0.2 },
  { size: 8, color: "#E8B43E", top: 50, left: 90, duration: 3.6, delay: 0.9 },
];
 
const SYMPTOMS = [
  "Chronic fatigue and lack of energy",
  "Increased mental distance from one's job",
  "Feelings of negativism or cynicism",
  "Reduced professional efficacy",
];
 
const STATS = [
  ["15", "Questions"],
  ["3",  "Dimensions"],
  ["~5", "Minutes"],
];
 
function HomePage({ onStart }) {
  useFonts();
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);
 
  // Fade-in is JS-driven (opacity + translateY depend on `visible` state) → stays inline
  const fadeIn = (delay = 0) => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`,
  });
 
  return (
    <div className="page">
 
      {/* ── SECTION 1: Hero ── */}
      <section className="hero-section">
 
        {/* Floating ember particles — position/size/colour are per-ember data → inline */}
        {EMBERS.map((e, i) => (
          <div key={i} className="ember-particle" style={{
            width:      e.size,
            height:     e.size,
            background: e.color,
            top:        `${e.top}%`,
            left:       `${e.left}%`,
            animation:  `ember ${e.duration}s ease-in-out ${e.delay}s infinite`,
          }} />
        ))}
 
        <div className="hero-glow" />
 
        <div className="hero-badge-wrap" style={fadeIn(0)}>
          <span className="hero-badge">Burnout Assessment Tool</span>
        </div>
 
        <h1 className="hero-title serif-heading" style={fadeIn(120)}>
          Occupational<br />
          <em className="hero-title-accent">Burnout</em> Detector
        </h1>
 
        <p className="hero-subtitle" style={fadeIn(240)}>
          Recognize the signs and learn how to protect your well-being.
        </p>
 
        <div className="scroll-cue" style={fadeIn(400)}>
          <span className="scroll-cue-text">Explore below</span>
          <div className="scroll-cue-line" />
        </div>
      </section>
 
      {/* ── SECTION 2: What is Occupational Burnout? ── */}
      <section className="definition-section">
        <span className="section-label">Definition</span>
 
        <h2 className="serif-heading definition-heading">
          What is Occupational Burnout?
        </h2>
 
        <p className="definition-body">
          Occupational burnout is a state of physical, emotional, and mental exhaustion
          caused by prolonged exposure to demanding work situations. It manifests through
          three core dimensions:{" "}
          <span className="definition-highlight">overwhelming exhaustion</span>,{" "}
          <span className="definition-highlight">feelings of cynicism and detachment from work</span>,
          {" "}and a{" "}
          <span className="definition-highlight">sense of ineffectiveness and lack of accomplishment</span>.
        </p>
 
        {/* Three dimension cards — border/bg/label-colour are per-dimension data → inline */}
        <div className="dim-cards-grid">
          {Object.entries(dimInfo).map(([key, d]) => (
            <div key={key} className="dim-card"
              style={{ background: d.bg, border: `0.5px solid ${d.border}` }}>
              
              <div className="dim-card-label" style={{ color: d.color }}>{d.label}</div>
              <div className="dim-card-desc">
                {key === "exhaustion"  && "Persistent depletion of physical and emotional resources."}
                {key === "cynicism"    && "Growing detachment and indifference toward your work."}
                {key === "performance" && "Declining confidence in your ability to perform effectively."}
              </div>
            </div>
          ))}
        </div>
 
        {/* Key symptoms */}
        <div className="symptoms-block">
          <h3 className="symptoms-heading">Key Symptoms</h3>
          <div className="symptoms-list">
            {SYMPTOMS.map(symptom => (
              <div key={symptom} className="symptom-card">
                <div className="symptom-dot" />
                <span className="symptom-text">{symptom}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* ── SECTION 3: Assessment CTA ── */}
      <section className="cta-section">
        <div className="cta-divider" />
 
        <span className="cta-label">Assessment</span>
 
        <h2 className="serif-heading cta-heading">
          Discover your burnout profile
        </h2>
 
        <p className="cta-body">
          Answer 15 questions across three dimensions to receive a personalised
          assessment and actionable guidance.
        </p>
 
        <div className="stats-row">
          {STATS.map(([number, label]) => (
            <div key={label} className="stat-item">
              <div className="stat-number">{number}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
 
        <button className="start-btn" onClick={onStart}>
          Start Assessment →
        </button>
          
        
         

        <p className="privacy-note">Your responses are private and not stored.</p>
      </section>
    </div>
  );
}
 
/* ============================================================
   ASSESSMENT PAGE
   ============================================================ */
 
function AssessmentPage({ onComplete, onBack }) {
  const [current,  setCurrent]  = useState(0);
  const [answers,  setAnswers]  = useState({});
  const [selected, setSelected] = useState(null);
  const [animDir,  setAnimDir]  = useState(1);
  const [visible,  setVisible]  = useState(true);
 
  const q        = questions[current];
  const dim      = dimInfo[q.category];
  const progress = (current / questions.length) * 100;
  const canNext  = selected !== null;
  const isLast   = current === questions.length - 1;
 
  // Restore saved answer whenever the question changes
  useEffect(() => {
    setSelected(answers[q.id] !== undefined ? answers[q.id] : null);
    setTimeout(() => setVisible(true), 20);
  }, [current]);
 
  function go(dir) {
    setAnimDir(dir);
    setVisible(false);
    setTimeout(() => {
      if (dir === 1) {
        if (current < questions.length - 1) setCurrent(c => c + 1);
        else onComplete({ ...answers, [q.id]: selected });
      } else {
        if (current > 0) setCurrent(c => c - 1);
        else onBack();
      }
    }, 220);
  }
 
  function choose(val) {
    setSelected(val);
    setAnswers(prev => ({ ...prev, [q.id]: val }));
  }
 
  return (
    <div className="page assessment-page">
 
      {/* Progress bar — width and colour are JS-driven → inline */}
      <div className="progress-track">
        <div className="progress-fill"
          style={{ width: `${progress}%`, background: dim.color }} />
      </div>
 
      {/* Header */}
      <div className="assessment-header">
        <button className="back-btn" onClick={() => go(-1)}>
          ← {current === 0 ? "Back" : "Previous"}
        </button>
        <span className="question-counter">
          <span className="counter-current">{current + 1}</span> / {questions.length}
        </span>
      </div>
 
      {/* Centred question */}
      <div className="question-area">
 
        {/* Slide wrapper — opacity/transform are JS-driven → inline */}
        <div className="question-slide" style={{
          opacity:   visible ? 1 : 0,
          transform: visible ? "translateX(0)" : `translateX(${animDir * 30}px)`,
        }}>
 
          {/* Dimension badge — label colour is per-dimension → inline */}
          <div className="dim-badge">
            <span className="dim-badge-icon">{dim.icon}</span>
            <span className="dim-badge-label" style={{ color: dim.color }}>{dim.label}</span>
          </div>
 
          <h2 className="serif-heading question-text">{q.text}</h2>
 
          {/* Scale options */}
          <div className="options-list">
            {scaleOptions.map(opt => {
              const isChosen = selected === opt.value;
              return (
                <button key={opt.value} className="opt-btn"
                  onClick={() => choose(opt.value)}
                  style={{
                    // CSS custom properties let the :hover rule in CSS read them
                    "--dim-color": dim.color,
                    "--dim-bg":    dim.bg,
                    // Active state colours depend on isChosen + dim → inline
                    background: isChosen ? dim.bg   : "rgba(255,255,255,0.03)",
                    border:     `0.5px solid ${isChosen ? dim.color : "rgba(255,255,255,0.08)"}`,
                  }}>
 
                  <span className="opt-label"
                    style={{ color: isChosen ? "#F0EDE6" : "#9E9AAD" }}>
                    {opt.label}
                  </span>
 
                  {/* Dot row — active/inactive colour depends on isChosen + dim → inline */}
                  <div className="opt-dots">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="opt-dot" style={{
                        background: i <= opt.value
                          ? (isChosen ? dim.color : "rgba(255,255,255,0.2)")
                          : "rgba(255,255,255,0.06)",
                      }} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
 
          {/* Continue / results button — colour depends on canNext + dim → inline */}
          <div className="next-wrapper">
            <button className="next-btn" disabled={!canNext} onClick={() => go(1)}
              style={{
                "--dim-color": dim.color,
                color:  canNext ? dim.color : "#5A5670",
                border: `1px solid ${canNext ? dim.color : "rgba(255,255,255,0.1)"}`,
                cursor: canNext ? "pointer" : "not-allowed",
              }}>
              {isLast ? "See my results →" : "Continue →"}
            </button>
          </div>
 
        </div>
      </div>
    </div>
  );
}

 
/* ============================================================
   RESULTS PAGE
   ============================================================ */
 
function ResultsPage({ answers, onRestart,onGoHome }) {
  const [guidance, setGuidance] = useState("");
  const [loading,  setLoading]  = useState(true);
  const [activeDim, setActiveDim] = useState('exhaustion');

  const scores  = calcScores(answers);
  const overall = getBurnoutLevel(scores);
 
  useEffect(() => { fetchGuidance(); }, []);
 

const getAdvice = () => {
  const score = scores[activeDim];
  const info = dimInfo[activeDim];

  if (score <= 40) {
    return {
      status: "Low Concern",
      color: "#3EB8A0",
      text: `Your ${info.label} level is healthy. To maintain this, focus on consistent self-care and setting clear work-life boundaries.`
    };
  } else if (score <= 70) {
    return {
      status: "Moderate Warning",
      color: "#E8B43E",
      text: `You're doing okay, but ${info.label} is starting to rise. You should focus on delegating tasks and ensuring you take full breaks away from screens.`
    };
  } else {
    return {
      status: "High Priority",
      color: "#E85C4A",
      text: `Your ${info.label} levels are critical. It is highly recommended to speak with a supervisor about workload or consult a professional for burnout recovery.`
    };
  }
};

const advice = getAdvice();

  async function fetchGuidance() {
    setLoading(true);
    const scoreDesc = `Exhaustion: ${scores.exhaustion}%, Cynicism: ${scores.cynicism}%, Performance: ${scores.performance}%`;
 
    try {
      const res  = await fetch("https://api.anthropic.com/v1/messages", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model:      "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are a compassionate occupational health expert. Provide empathetic, actionable guidance based on burnout assessment scores. Keep your response warm, practical, and under 300 words. Use plain paragraphs — no markdown headers or bullet lists. Focus on 2-3 concrete recommendations tailored to the specific score profile.",
          messages: [{ role: "user", content: `Please provide personalised guidance based on these burnout assessment results:\n\n${scoreDesc}` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      setGuidance(text || "Unable to generate guidance at this time. Please consult a mental health professional or occupational health advisor for personalised support.");
    } catch {
      setGuidance("We weren't able to load personalised guidance right now. Based on your scores, consider speaking with an occupational health professional or a trusted colleague about your workload and well-being.");
    }
    setLoading(false);
  }

 // 1. Calculate the sum
 const totalPoints = (scores.exhaustion || 0) + (scores.cynicism || 0) + (scores.performance || 0);

 // 2. Create the data array safely
 // If totalPoints is 0, we show [0, 0, 0] to avoid the glitch
 const chartValues = totalPoints > 0 
  ? [
      Math.round((scores.exhaustion / totalPoints) * 100),
      Math.round((scores.cynicism / totalPoints) * 100),
      Math.round((scores.performance / totalPoints) * 100),
    ]
  : [0, 0, 0];

  const chartData = {
    labels: ['Exhaustion', 'Cynicism', 'Performance'],
    datasets: [{
      label: 'Your Score',
      data: [scores.exhaustion, scores.cynicism, scores.performance],
      backgroundColor: [
        '#E87C3E', //Exhaustion
        '#A07BE8', //Cynicism
        '#3EB8A0', //Performance
      ],
      borderRadius: 10,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const dims = ['exhaustion', 'cynicism', 'performance'];
        setActiveDim(dims[index]); // This now works because it's inside the function
      }
    },
    scales: {
      y: { min: 0, max: 100, ticks: { color: '#F0EDE6', callback: (v) => v + '%' } },
      x: { ticks: { color: '#F0EDE6' } }
    },
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: 'end', align: 'top', color: '#F0EDE6',
        formatter: (val) => val + '%'
      }
    }
  };


  return (
    
    <div className="page results-page">
      <div className="results-container">
        <div className="results-header">
          <span className="section-label">Your Results</span>
          <h1 className="serif-heading results-title">Burnout Assessment</h1>
 
          {/* Overall badge — bg/border depend on overall.color → inline */}
          <div className="overall-badge"
            style={{ background: overall.bg, border: `1px solid ${overall.color}40` }}>
            <div className="overall-dot" style={{ background: overall.color }} />
            <span className="overall-level" style={{ color: overall.color }}>
              {overall.level} Risk
            </span>
            <span className="overall-desc">— {overall.desc}</span>
          </div>
        </div>
 
        {/* --- PIE CHART SECTION --- */}

          <div className="score-card" style={{ padding: '40px', marginBottom: '24px', textAlign: 'center' }}>
  <h3 className="serif-heading" style={{ fontSize: '24px', marginBottom: '30px', color: '#F0EDE6' }}>
    Score Distribution
  </h3>
  <div style={{ height: '350px', width: '100%', position: 'relative', margin: '0 auto' }}>
    <Bar data={chartData} options={chartOptions} />
  </div>
</div>

        {/* Per-dimension score cards */}
        {/* Interactive Advice Container */}
<div className="score-card advice-container" 
     style={{ 
       padding: '30px', 
       marginBottom: '24px',
       borderLeft: `6px solid ${dimInfo[activeDim].color}`,
       textAlign: 'left',
       transition: 'all 0.3s ease'
     }}>
  
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
    <h2 className="serif-heading" style={{ color: dimInfo[activeDim].color, margin: 0, fontSize: '24px' }}>
      {dimInfo[activeDim].icon} {dimInfo[activeDim].label} Advice
    </h2>
    <span style={{ color: advice.color, fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
      {advice.status}
    </span>
  </div>

  <p style={{ color: '#F0EDE6', lineHeight: '1.7', fontSize: '18px', marginBottom: '15px' }}>
    {advice.text}
  </p>

  <p style={{ color: '#9E9AAD', fontSize: '12px', marginTop: '10px', fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
    *Select another bar in the "Score Distribution" chart to see specific advice for that dimension.
  </p>
</div>
 
        {/* AI-generated guidance */}
        <div className="guidance-card">
          <div className="guidance-header">
            <div className="guidance-icon-wrap">✦</div>
            <span className="guidance-title">Personalised Guidance</span>
          </div>
 
          {loading ? (
            <div className="guidance-loading">
              <div className="loading-spinner" />
              Generating your personalised guidance…
            </div>
          ) : (
            <p className="guidance-text">{guidance}</p>
          )}
        </div>
 
        <p className="disclaimer">
          This assessment is for informational purposes only and does not constitute
          medical or psychological advice. If you are experiencing significant distress,
          please consult a qualified professional.
        </p>
 
        <div className="restart-wrapper">
          <button className="restart-btn" onClick={onRestart}>
            Retake Assessment
          </button>
        </div>
        <button className="go-back-btn" onClick={onGoHome}>
            Go back
          </button>
 
      </div>
    </div>
  );
}
 
/* ============================================================
   APP ROOT
   ============================================================ */
 
export default function App() {
  const [view, setView] = useState("home");
  const [finalAnswers, setFinalAnswers] = useState(null);

  return (
    <div>
      {view === "home" && (
        <HomePage onStart={() => setView("assessment")} />
      )}

      {view === "assessment" && (
        <AssessmentPage
          onComplete={answers => { setFinalAnswers(answers); setView("results"); }}
          onBack={() => setView("home")}
        />
      )}

      {view === "results" && finalAnswers && (
        <ResultsPage
          answers={finalAnswers}
          // Retake goes straight to assessment
          onRestart={() => { setFinalAnswers(null); setView("assessment"); }}
          // Go back goes to home
          onGoHome={() => { setFinalAnswers(null); setView("home"); }}
        />
      )}
    </div>
  );
}