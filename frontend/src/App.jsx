import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
async function request(path, options = {}) {
  const response = await fetch(API + path, { credentials: "include", headers: { "Content-Type": "application/json", ...(options.headers || {}) }, ...options });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.detail || payload.error || "Request failed");
  return payload;
}
export default function App() {
  const [dealers, setDealers] = useState([]);
  const [state, setState] = useState("");
  const [selected, setSelected] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState("");
  const [login, setLogin] = useState({ username: "", password: "" });
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadDealers(filter = state) {
    setBusy(true); setMessage("");
    try { setDealers(await request("/dealers/" + (filter ? "?state=" + encodeURIComponent(filter) : ""))); }
    catch (e) { setMessage(e.message + ". Start the Django server and check API URL."); }
    finally { setBusy(false); }
  }
  useEffect(() => { loadDealers(""); }, []);
  async function openDealer(d) {
    setSelected(d); setReviews([]); setReview("");
    try { setReviews(await request("/dealers/" + d.id + "/reviews/"); } catch (e) { setMessage(e.message); }
  }
  async function doLogin(e) {
    e.preventDefault(); setMessage("");
    try { const result = await request("/login/", { method: "POST", body: JSON.stringify(login) }); setUser(result.username); setMessage(result.message); }
    catch (e) { setMessage(e.message); }
  }
  async function doLogout() {
    try { await request("/logout/", { method: "POST" }); setUser(""); setMessage("Logged out."); }
    catch (e) { setMessage(e.message); }
  }
  async function submitReview(e) {
    e.preventDefault();
    if (!selected || !review.trim()) return;
    try {
      await request("/reviews/", { method: "POST", body: JSON.stringify({ dealer: selected.id, name: user || "Guest", review }) });
      setMessage("Review submitted."); setReview(""); await openDealer(selected);
    } catch (e) { setMessage(e.message); }
  }
  return <div className="app">
    <header><div><p className="eyebrow">AUTOMOTIVE COMMUNITY</p><h1>Dealership Reviews</h1><p>Discover dealerships. Read real reviews. Share your experience.</p></div>
      <div className="login">{user ? <><span>Welcome, {user}</span><button onClick={doLogout}>Logout</button></> : <form onSubmit={doLogin}><input placeholder="Username" value={login.username} onChange={e=>setLogin({...login,username:e.target.value})} required/><input type="password" placeholder="Password" value={login.password} onChange={e=>setLogin({...login,password:e.target.value})} required/><button>Login</button></form>}</div></header>
    {message && <div className="notice">{message}</div>}
    <main><section className="filter"><div><h2>Browse dealerships</h2><p>Find a dealer by location or open one to see its reviews.</p></div><form onSubmit={e=>{e.preventDefault();loadDealers(state);}}><input placeholder="Filter by state (e.g. Kansas)" value={state} onChange={e=>setState(e.target.value)}/><button>Search</button><button type="button" className="secondary" onClick={()=>{setState("");loadDealers("");}}>Clear</button></form></section>
    <div className="grid"><section className="dealer-list"><h3>{dealers.length} dealerships</h3>{busy ? <p>Loading…</p> : dealers.map(d=><button key={d.id} className={"dealer "+(selected?.id===d.id?"active":"")} onClick={()=>openDealer(d)}><strong>{d.name}</strong><span>{[d.city,d.state].filter(Boolean).join(", ")}</span></button>)}{!busy&&!dealers.length&&<p>No dealers found. Add dealer data through Django admin.</p>}</section>
    <section className="details">{selected ? <><div className="detail-head"><div><p className="eyebrow">DEALERSHIP PROFILE</p><h2>{selected.name}</h2><p>{[selected.address,selected.city,selected.state,selected.zip_code].filter(Boolean).join(", ")}</p></div></div><div className="review-list"><h3>Customer reviews ({reviews.length})</h3>{reviews.map(r=><article key={r.id}><strong>{r.name || r.author || "Customer"}</strong><p>{r.review}</p><small>{r.sentiment}</small></article>)}{reviews.length===0&&<p>No reviews yet for this dealer.</p>}</div><form className="review-form" onSubmit={submitReview}><h3>Write a review</h3><textarea value={review} onChange={e=>setReview(e.target.value)} placeholder="Share your dealership experience…" required/><button>Submit review</button></form></> : <div className="empty"><h2>Select a dealership</h2><p>Choose a dealership from the list to see details and reviews.</p></div>}</section></div></main><footer>Dealership Reviews · IBM Full Stack Software Developer Capstone</footer></div>;
}