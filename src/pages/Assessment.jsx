import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { withImageFallback } from "../utils/mediaUrl";
import { api } from "../utils/api";

const QUESTIONS = [
  { id: "goal", eyebrow: "Your priority", title: "What would you most like support with?", description: "Choose the concern that matters most to you right now.", options: [
    ["digestion", "Digestion & gut comfort", "Bloating, heaviness or irregular digestion", "fa-seedling"],
    ["immunity", "Everyday immunity", "Seasonal and daily resilience", "fa-shield-halved"],
    ["energy", "Energy & vitality", "Low stamina or daily tiredness", "fa-bolt"],
    ["heart", "Heart wellness", "Everyday cardiovascular support", "fa-heart-pulse"],
    ["pain", "Joint & body comfort", "Stiffness or active-lifestyle support", "fa-person-walking"],
    ["general", "General wellbeing", "A balanced everyday ritual", "fa-spa"],
  ]},
  { id: "intensity", eyebrow: "How you feel", title: "How much does this affect your routine?", description: "This helps us avoid overstating the strength of a match.", options: [
    ["mild", "A little", "Occasional; mostly preventative"], ["moderate", "Noticeably", "It comes up several times a week"], ["high", "A lot", "It regularly affects my day"],
  ]},
  { id: "routine", eyebrow: "Your routine", title: "Which format fits your day best?", description: "Consistency matters, so choose what you would realistically use.", options: [
    ["Juice", "A daily drink", "A measured morning or evening ritual", "fa-glass-water"], ["Capsule", "Quick capsules", "Simple and easy to carry", "fa-capsules"], ["Drop", "Concentrated drops", "Flexible and easy to add", "fa-droplet"], ["Any", "No preference", "Recommend the closest overall match", "fa-shuffle"],
  ]},
  { id: "experience", eyebrow: "Your experience", title: "How familiar are you with herbal wellness?", description: "There is no right answer—this shapes the guidance we show.", options: [
    ["new", "Completely new", "I would like a simple place to begin"], ["some", "Some experience", "I use herbal products occasionally"], ["regular", "Part of my routine", "I already use them consistently"],
  ]},
  { id: "considerations", eyebrow: "One last check", title: "Do any of these apply to you?", description: "This does not diagnose suitability. It helps us add the right safety guidance.", options: [
    ["none", "None of these", "Continue to my match"], ["medication", "I take regular medication", "Check possible interactions with a clinician"], ["pregnancy", "Pregnant or breastfeeding", "Professional guidance is important"], ["condition", "I manage a health condition", "Please review ingredients with your clinician"],
  ]},
].map(q => ({ ...q, options: q.options.map(([value, label, note, icon]) => ({ value, label, note, icon })) }));

const goalLabel = value => QUESTIONS[0].options.find(item => item.value === value)?.label;

export default function Assessment() {
  const products = useSelector(state => state.products.items);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState("questions");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const question = QUESTIONS[step];
  const alternatives = useMemo(() => result?.ranked?.slice(1, 3) || [], [result]);
  const reset = () => { setStep(0); setAnswers({}); setStatus("questions"); setResult(null); setError(""); };
  const askAI = async () => {
    setError("");
    setStatus("thinking");
    try {
      const response = await api.post("/product/recommend", { answers });
      const recommendation = response.data;
      const findProduct = id => products.find(product => String(product._id) === String(id));
      const bestProduct = findProduct(recommendation.productId);
      if (!bestProduct) throw new Error("The recommended product is no longer available in the catalog.");
      const ranked = recommendation.alternativeProductIds.map(findProduct).filter(Boolean).map(product => ({ product, score: Math.max(45, recommendation.confidence - 8) }));
      setResult({ ranked: [{ product: bestProduct, score: recommendation.confidence }, ...ranked], best: { product: bestProduct, score: recommendation.confidence, reasons: recommendation.reasons, summary: recommendation.summary } });
      setStatus("result");
    } catch (requestError) {
      setError(requestError.message || "AI could not create your recommendation. Please try again.");
      setStatus("questions");
    }
  };

  return <main className="assessment-page">
    <div className="assessment-glow assessment-glow-one" /><div className="assessment-glow assessment-glow-two" />
    <section className="assessment-shell">
      <div className="assessment-topbar">
        <Link to="/shop" className="assessment-back"><ArrowLeft size={16} /> Back to shop</Link>
        <div className="assessment-brand"><span><Sparkles size={15} /></span> Veadya Match</div>
        <span className="assessment-time">Takes about 2 minutes</span>
      </div>
      {status !== "result" && <div className="assessment-progress-wrap">
        <div className="assessment-progress-meta"><span>{status === "thinking" ? "Creating your match" : `Question ${step + 1} of ${QUESTIONS.length}`}</span><span>{Math.round(((step + 1) / QUESTIONS.length) * 100)}% complete</span></div>
        <div className="assessment-progress"><span style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} /></div>
      </div>}

      {status === "questions" && <div className="assessment-card">
        <p className="assessment-eyebrow">{question.eyebrow}</p><h1>{question.title}</h1><p className="assessment-subtitle">{question.description}</p>
        <div className={`assessment-options ${question.options.length > 4 ? "assessment-options-wide" : ""}`}>
          {question.options.map(option => { const selected = answers[question.id] === option.value; return <button key={option.value} className={`assessment-option ${selected ? "selected" : ""}`} onClick={() => setAnswers(current => ({ ...current, [question.id]: option.value }))} aria-pressed={selected}>
            <span className="assessment-radio">{selected && <Check size={14} strokeWidth={3} />}</span>
            {option.icon && <span className="assessment-option-icon"><i className={`fa-solid ${option.icon}`} /></span>}
            <span><strong>{option.label}</strong><small>{option.note}</small></span>
          </button>; })}
        </div>
        <div className="assessment-actions">
          <button className="assessment-secondary" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}><ArrowLeft size={16} /> Previous</button>
          {step < QUESTIONS.length - 1 ? <button className="assessment-primary" onClick={() => setStep(s => s + 1)} disabled={!answers[question.id]}>Continue <ArrowRight size={16} /></button> : <button className="assessment-primary assessment-ai" onClick={askAI} disabled={!answers[question.id] || !products.length}><Sparkles size={16} /> Ask AI for my match</button>}
        </div>
        {step === QUESTIONS.length - 1 && !products.length && <p className="assessment-loading-note">Loading the product catalog…</p>}
        {error && <p className="assessment-error" role="alert">{error}</p>}
      </div>}

      {status === "thinking" && <div className="assessment-card assessment-thinking"><div className="ai-orbit"><Sparkles size={26} /></div><p className="assessment-eyebrow">Veadya Match AI</p><h1>Reading your wellness profile…</h1><p className="assessment-subtitle">Comparing your priorities and routine with our live product catalog.</p><div className="thinking-lines"><span /><span /><span /></div></div>}

      {status === "result" && result?.best && (() => { const { product, score, reasons, summary } = result.best; return <div className="assessment-result">
        <div className="result-heading"><span className="result-kicker"><Check size={14} /> Assessment complete</span><h1>Your closest wellness match</h1><p>Based on your primary goal, preferred format, and the information available in our catalog.</p></div>
        <div className="result-product-card">
          <div className="result-image"><span className="result-badge"><Sparkles size={13} /> Best match</span><img src={product.image} onError={withImageFallback()} alt={product.name} /></div>
          <div className="result-copy"><div className="result-score"><span>{score}% AI match</span><div><i style={{ width: `${score}%` }} /></div></div><p className="assessment-eyebrow">AI recommendation · {product.category} · {product.size || "Wellness formulation"}</p><h2>{product.name}</h2><p className="result-description">{summary || product.shortDescription || `Selected as the closest catalog match for ${goalLabel(answers.goal).toLowerCase()}.`}</p>
            <div className="result-reasons"><h3>Why AI selected this</h3><ul>{reasons.map((reason, index) => <li key={`${index}-${reason}`}><Check size={15} /> {reason}</li>)}</ul></div>
            <div className="result-price"><strong>₹{product.price}</strong>{product.originalPrice > product.price && <del>₹{product.originalPrice}</del>}</div><div className="result-buttons"><Link to={`/product/${product.id}`} className="assessment-primary">View product <ArrowRight size={16} /></Link><button className="assessment-secondary" onClick={reset}><RotateCcw size={15} /> Retake</button></div>
          </div>
        </div>
        {alternatives.length > 0 && <div className="result-alternatives"><h3>Other close matches</h3><div>{alternatives.map(({ product: alt, score: altScore }) => <Link key={alt.id} to={`/product/${alt.id}`}><img src={alt.image} onError={withImageFallback()} alt="" /><span><strong>{alt.name}</strong><small>{altScore}% fit · {alt.category}</small></span><ArrowRight size={16} /></Link>)}</div></div>}
        <div className={`result-safety ${answers.considerations !== "none" ? "result-safety-important" : ""}`}><ShieldCheck size={22} /><div><strong>{answers.considerations !== "none" ? "Please check with a qualified clinician" : "A thoughtful starting point—not a diagnosis"}</strong><p>This match is based on your answers and product descriptions. It does not assess medical suitability or replace professional advice. Always read the label and check with a clinician if appropriate.</p></div></div>
      </div>; })()}
    </section>
  </main>;
}
