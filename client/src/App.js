import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://validator-backend-opon.onrender.com/';

function App() {
  const [view, setView] = useState('dashboard'); // 'dashboard', 'submit', 'detail'
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const res = await fetch(`${API_URL}/ideas`);
      const data = await res.json();
      setIdeas(data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/ideas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: desc }),
      });
      if (res.ok) {
        setTitle('');
        setDesc('');
        fetchIdeas();
        setView('dashboard');
      }
    } catch (err) { alert('Failed to analyze'); }
    setLoading(false);
  };

  const viewDetail = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/ideas/${id}`);
      const data = await res.json();
      setSelectedIdea(data);
      setView('detail');
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div className="container">
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1>🚀 Startup Validator</h1>
        {view === 'dashboard' && (
          <button onClick={() => setView('submit')}>+ New Idea</button>
        )}
      </header>

      {/* SUBMIT PAGE */}
      {view === 'submit' && (
        <div className="card">
          <button className="back-btn" onClick={() => setView('dashboard')}>← Back</button>
          <h2>Validate New Idea</h2>
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom: '15px'}}>
              <label>Startup Name / Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Uber for Mechanics" />
            </div>
            <div style={{marginBottom: '15px'}}>
              <label>Description</label>
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} required rows="5" placeholder="Describe the problem and solution..." />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Analyzing with AI...' : 'Submit for Validation'}
            </button>
          </form>
        </div>
      )}

      {/* DASHBOARD PAGE */}
      {view === 'dashboard' && (
        <div className="grid">
          {ideas.map((idea) => (
            <div key={idea.id} className="card">
              <h3>{idea.title}</h3>
              <p>{idea.description.substring(0, 80)}...</p>
              <div style={{marginTop: '10px'}}>
                <strong>Score: {idea.score}/100</strong>
              </div>
              <button onClick={() => viewDetail(idea.id)}>View Report</button>
            </div>
          ))}
          {ideas.length === 0 && <p>No ideas yet. Submit one!</p>}
        </div>
      )}

      {/* DETAIL PAGE */}
      {view === 'detail' && selectedIdea && (
        <div>
           <button className="back-btn" onClick={() => setView('dashboard')}>← Back to Dashboard</button>
           <div className="card">
              <div style={{borderBottom:'1px solid #eee', paddingBottom:'10px', marginBottom:'20px'}}>
                <h1 style={{margin:0}}>{selectedIdea.title}</h1>
                <p style={{color:'#666'}}>{selectedIdea.description}</p>
              </div>

              <div className="grid">
                <div>
                  <h3> Problem</h3>
                  <p>{selectedIdea.analysis.problem}</p>
                </div>
                <div>
                  <h3>👥 Customer</h3>
                  <p>{selectedIdea.analysis.customer}</p>
                </div>
              </div>

              <div className="grid" style={{marginTop:'20px'}}>
                 <div>
                    <h3>Market</h3>
                    <p>{selectedIdea.analysis.market}</p>
                 </div>
                 <div>
                    <h3> Competitors</h3>
                    <ul>
                      {Array.isArray(selectedIdea.analysis.competitor) 
                        ? selectedIdea.analysis.competitor.map((c, i) => <li key={i}>{c}</li>)
                        : <li>{selectedIdea.analysis.competitor}</li>}
                    </ul>
                 </div>
              </div>

              <div style={{marginTop:'20px', background:'#f8f9fa', padding:'15px', borderRadius:'8px'}}>
                <h3>🛠 Tech Stack</h3>
                <p>{selectedIdea.analysis.tech_stack}</p>
              </div>

              <div style={{display:'flex', justifyContent:'space-between', marginTop:'20px', alignItems:'center'}}>
                 <div>
                    <strong>Risk Level: </strong> 
                    <span className="badge" style={{background: selectedIdea.analysis.risk_level === 'High' ? '#ffebee' : '#e8f5e9'}}>
                      {selectedIdea.analysis.risk_level}
                    </span>
                 </div>
                 <div style={{textAlign:'right'}}>
                    <div>Profitability Score</div>
                    <div className="score">{selectedIdea.analysis.profitability_score}</div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default App;