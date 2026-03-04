import { useState, useEffect, useCallback } from "react";

// ─── Theme ─────────────────────────────────────────────────────────
const T = {
  crimson: "#B1464A",
  black: "#000200",
  white: "#FFFFFF",
  rose: "#BD6467",
  fog: "#F9F9F9",
  dark1: "#0a0a0a",
  dark2: "#111111",
  dark3: "#1a1a1a",
  dark4: "#242424",
  muted: "#555555",
  mutedLt: "#888888",
  green: "#4caf7d",
  amber: "#e09c4b",
  red: "#B1464A",
};

// ─── Global Styles injected once ──────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #000200; }

  .op-root {
    font-family: 'IBM Plex Mono', monospace;
    background: ${T.black};
    color: ${T.white};
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Pulse animation for live indicator */
  @keyframes pulse-ring {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes overload-pulse {
    0%, 100% { background: rgba(177,70,74,0.12); border-color: rgba(177,70,74,0.4); }
    50% { background: rgba(177,70,74,0.22); border-color: rgba(177,70,74,0.8); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }

  .pulse-dot {
    position: relative;
    display: inline-block;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: ${T.green};
  }
  .pulse-dot::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: ${T.green};
    animation: pulse-ring 1.4s ease-out infinite;
  }

  .token-card {
    background: ${T.dark2};
    border: 1px solid ${T.dark3};
    border-radius: 6px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    transition: all 0.15s;
    animation: slideIn 0.25s ease;
    position: relative;
  }
  .token-card:hover { border-color: #2e2e2e; background: #161616; }
  .token-card.serving {
    background: rgba(177,70,74,0.08);
    border-color: rgba(177,70,74,0.5);
  }
  .token-card.selected {
    border-color: ${T.rose};
    background: rgba(189,100,103,0.08);
  }
  .token-card.expired {
    opacity: 0.4;
  }

  .overload-banner {
    animation: overload-pulse 1.5s ease-in-out infinite;
  }

  .btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 18px;
    border-radius: 5px; border: none; cursor: pointer;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .btn:active { transform: scale(0.97); }
  .btn-primary { background: ${T.crimson}; color: ${T.white}; }
  .btn-primary:hover { background: #c85558; }
  .btn-success { background: #1e3d2a; color: ${T.green}; border: 1px solid #2a5a3c; }
  .btn-success:hover { background: #234730; }
  .btn-ghost { background: transparent; color: ${T.mutedLt}; border: 1px solid ${T.dark3}; }
  .btn-ghost:hover { border-color: #333; color: ${T.white}; }
  .btn-warning { background: rgba(224,156,75,0.12); color: ${T.amber}; border: 1px solid rgba(224,156,75,0.3); }
  .btn-warning:hover { background: rgba(224,156,75,0.2); }
  .btn-danger { background: rgba(177,70,74,0.12); color: ${T.crimson}; border: 1px solid rgba(177,70,74,0.35); }
  .btn-danger:hover { background: rgba(177,70,74,0.2); }
  .btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,2,0,0.85);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    animation: slideIn 0.2s ease;
  }
  .modal-box {
    background: ${T.dark1};
    border: 1px solid ${T.dark4};
    border-radius: 8px;
    padding: 32px;
    width: 480px;
    max-width: 92vw;
  }

  .log-row { animation: slideIn 0.2s ease; }

  .tag {
    display: inline-block;
    padding: 2px 8px; border-radius: 3px;
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
  }
  .tag-serving { background: rgba(177,70,74,0.18); color: ${T.rose}; border: 1px solid rgba(177,70,74,0.4); }
  .tag-waiting { background: rgba(136,136,136,0.12); color: #888; border: 1px solid #2a2a2a; }
  .tag-served { background: rgba(76,175,125,0.12); color: ${T.green}; border: 1px solid rgba(76,175,125,0.3); }
  .tag-expired { background: rgba(224,156,75,0.12); color: ${T.amber}; border: 1px solid rgba(224,156,75,0.3); }
  .tag-skipped { background: rgba(136,136,136,0.1); color: #666; border: 1px solid #222; }
  .tag-override { background: rgba(224,156,75,0.15); color: ${T.amber}; border: 1px solid rgba(224,156,75,0.35); }

  input, select, textarea {
    background: #181818; border: 1px solid #2a2a2a; border-radius: 4px;
    color: ${T.white}; padding: 9px 12px; font-size: 13px;
    font-family: 'IBM Plex Mono', monospace; outline: none; width: 100%;
    transition: border-color 0.15s;
  }
  input:focus, select:focus, textarea:focus { border-color: ${T.rose}; }
  select option { background: #181818; }

  label { font-size: 10px; color: ${T.muted}; letter-spacing: 0.1em; text-transform: uppercase; display: block; margin-bottom: 6px; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
`;

// ─── Helpers ───────────────────────────────────────────────────────
let tokenCounter = 1100;
const newId = () => `T-${++tokenCounter}`;
const now = () => new Date().toLocaleTimeString("en-US", { hour12: false });
const pad = (n) => String(n).padStart(2, "0");
const formatWait = (sec) => `${Math.floor(sec / 60)}:${pad(sec % 60)}`;

const NAMES = ["Arjun K.", "Priya M.", "Ravi S.", "Deepa R.", "Kiran T.", "Meena V.", "Suresh P.", "Ananya N.", "Vikram L.", "Divya C."];
const randName = () => NAMES[Math.floor(Math.random() * NAMES.length)];

const makeToken = (pos) => ({
  id: newId(),
  name: randName(),
  position: pos,
  status: "waiting",
  waitSec: Math.floor(Math.random() * 600) + 60,
  bookedAt: now(),
  expiresIn: Math.floor(Math.random() * 180) + 120,
  category: ["Regular", "Priority", "VIP"][Math.floor(Math.random() * 3)],
});

const INITIAL_QUEUE = Array.from({ length: 8 }, (_, i) => makeToken(i + 1));
INITIAL_QUEUE[0].status = "serving";

// ─── Main Component ───────────────────────────────────────────────
export default function OperatorDashboard() {
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [activityLog, setActivityLog] = useState([
    { id: 1, action: "Session started", token: null, time: now(), type: "system" },
    { id: 2, action: "Serving", token: INITIAL_QUEUE[0].id, time: now(), type: "serve" },
  ]);
  const [logIdCtr, setLogIdCtr] = useState(3);
  const [selected, setSelected] = useState(null);
  const [showOverride, setShowOverride] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideToken, setOverrideToken] = useState("");
  const [capacity, setCapacity] = useState(12);
  const [occupancy, setOccupancy] = useState(9);
  const [tick, setTick] = useState(0);

  // Live clock tick
  useEffect(() => {
    const t = setInterval(() => setTick((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Countdown expiry timers
  useEffect(() => {
    setQueue((q) =>
      q.map((t) =>
        t.status === "waiting" ? { ...t, expiresIn: Math.max(0, t.expiresIn - 1), waitSec: t.waitSec + 1 } : t
      )
    );
  }, [tick]);

  const addLog = useCallback((action, token, type = "action") => {
    setActivityLog((prev) => [
      { id: logIdCtr, action, token, time: now(), type },
      ...prev.slice(0, 49),
    ]);
    setLogIdCtr((c) => c + 1);
  }, [logIdCtr]);

  const servingToken = queue.find((t) => t.status === "serving");
  const waitingQueue = queue.filter((t) => t.status === "waiting");
  const isOverloaded = occupancy >= capacity;
  const occupancyPct = Math.round((occupancy / capacity) * 100);

  const callNext = () => {
    const next = waitingQueue[0];
    if (!next) return;
    setQueue((q) =>
      q.map((t) =>
        t.id === next.id ? { ...t, status: "serving" } : t
      )
    );
    setOccupancy((o) => Math.min(o + 1, capacity + 3));
    addLog("Called next token", next.id, "call");
  };

  const markServed = () => {
    if (!servingToken) return;
    setQueue((q) =>
      q.map((t) =>
        t.id === servingToken.id ? { ...t, status: "served" } : t
      ).concat([makeToken(q.length + 1)])
    );
    setOccupancy((o) => Math.max(0, o - 1));
    addLog("Marked as served", servingToken.id, "served");
  };

  const markServing = () => {
    if (!selected || selected === servingToken?.id) return;
    const tok = queue.find((t) => t.id === selected);
    if (!tok || tok.status !== "waiting") return;
    setQueue((q) =>
      q.map((t) =>
        t.id === selected ? { ...t, status: "serving" } : t.status === "serving" ? { ...t, status: "waiting" } : t
      )
    );
    addLog("Manually set serving", selected, "override");
    setSelected(null);
  };

  const skipToken = (id) => {
    setQueue((q) =>
      q.map((t) => (t.id === id ? { ...t, status: "skipped" } : t))
    );
    addLog("Token skipped", id, "skip");
  };

  const expireToken = (id) => {
    setQueue((q) =>
      q.map((t) => (t.id === id ? { ...t, status: "expired" } : t))
    );
    addLog("Token expired", id, "expire");
  };

  const submitOverride = () => {
    if (!overrideToken || !overrideReason) return;
    const tok = queue.find((t) => t.id === overrideToken);
    if (!tok) return;
    setQueue((q) =>
      q.map((t) =>
        t.id === overrideToken
          ? { ...t, status: "serving" }
          : t.status === "serving"
          ? { ...t, status: "waiting" }
          : t
      )
    );
    addLog(`Manual override: ${overrideReason}`, overrideToken, "override");
    setShowOverride(false);
    setOverrideReason("");
    setOverrideToken("");
  };

  const logColor = (type) => {
    const m = { call: T.rose, served: T.green, override: T.amber, skip: T.muted, expire: "#555", system: "#444", action: T.mutedLt };
    return m[type] || T.mutedLt;
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="op-root">

        {/* ── Top Header ── */}
        <div style={{ background: T.dark1, borderBottom: `1px solid ${T.dark3}`, padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 32, height: 32, background: T.crimson, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>Q</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: T.white }}>QUEUEMASTER</div>
              <div style={{ fontSize: 10, color: T.muted, letterSpacing: "0.08em" }}>OPERATOR CONSOLE · STATION 04</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {/* Live indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: T.green, letterSpacing: "0.1em" }}>
              <span className="pulse-dot" />
              LIVE
            </div>
            {/* Clock */}
            <div style={{ fontSize: 13, color: T.white, letterSpacing: "0.1em", minWidth: 72 }}>
              {new Date().toLocaleTimeString("en-US", { hour12: false })}
            </div>
            <button className="btn btn-ghost" style={{ fontSize: 10 }} onClick={() => setShowOverride(true)}>
              ⚡ Manual Override
            </button>
          </div>
        </div>

        {/* ── Overload Banner ── */}
        {isOverloaded && (
          <div className="overload-banner" style={{ margin: "16px 28px 0", padding: "12px 18px", borderRadius: 6, border: `1px solid ${T.crimson}44`, display: "flex", alignItems: "center", gap: 12, fontSize: 12 }}>
            <span style={{ fontSize: 18, animation: "blink 1s infinite" }}>⚠</span>
            <span style={{ color: T.rose, fontWeight: 600, letterSpacing: "0.08em" }}>OVERLOAD WARNING</span>
            <span style={{ color: T.mutedLt }}>— Occupancy has exceeded configured capacity ({occupancy}/{capacity}). Consider pausing new admissions.</span>
            <button className="btn btn-danger" style={{ marginLeft: "auto" }} onClick={() => setOccupancy(capacity - 1)}>
              Release Slot
            </button>
          </div>
        )}

        {/* ── Main Grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, padding: "20px 28px", flex: 1 }}>

          {/* ── Left Column: Queue + Controls ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Stat Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {[
                { label: "Now Serving", val: servingToken?.id || "—", color: T.rose },
                { label: "In Queue", val: waitingQueue.length, color: T.white },
                {
                  label: "Occupancy",
                  val: `${occupancy}/${capacity}`,
                  color: isOverloaded ? T.crimson : occupancyPct > 80 ? T.amber : T.green,
                },
                { label: "Served Today", val: queue.filter((t) => t.status === "served").length, color: T.mutedLt },
              ].map((s) => (
                <div key={s.label} style={{ background: T.dark2, border: `1px solid ${T.dark3}`, borderRadius: 6, padding: "16px 18px" }}>
                  <div style={{ fontSize: 10, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: s.color, lineHeight: 1, animation: "countUp 0.3s ease" }}>{s.val}</div>
                  {s.label === "Occupancy" && (
                    <div style={{ marginTop: 8, height: 3, background: T.dark3, borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${Math.min(occupancyPct, 100)}%`, background: isOverloaded ? T.crimson : occupancyPct > 80 ? T.amber : T.green, borderRadius: 2, transition: "width 0.4s ease" }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={callNext} disabled={!waitingQueue.length}>
                ▶ Call Next Token
              </button>
              <button className="btn btn-success" onClick={markServed} disabled={!servingToken}>
                ✓ Mark as Served
              </button>
              <button className="btn btn-warning" onClick={markServing} disabled={!selected}>
                ↪ Mark Selected as Serving
              </button>
              <button
                className="btn btn-danger"
                disabled={!selected}
                onClick={() => {
                  if (selected) skipToken(selected); setSelected(null);
                }}
              >
                ✕ Skip Token
              </button>
              <button
                className="btn btn-ghost"
                disabled={!selected}
                onClick={() => {
                  if (selected) expireToken(selected); setSelected(null);
                }}
              >
                ⏱ Expire Token
              </button>
            </div>

            {/* Serving Now Card */}
            {servingToken && (
              <div style={{ background: "rgba(177,70,74,0.07)", border: `1px solid rgba(177,70,74,0.4)`, borderRadius: 8, padding: "18px 20px", display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 52, height: 52, background: T.crimson, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", flexShrink: 0 }}>
                  NOW<br />SRVING
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: T.white, letterSpacing: "0.06em" }}>{servingToken.id}</div>
                  <div style={{ fontSize: 12, color: T.rose, marginTop: 2 }}>{servingToken.name} · {servingToken.category}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10, color: T.muted, letterSpacing: "0.1em" }}>WAIT TIME</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: T.white, marginTop: 2 }}>{formatWait(servingToken.waitSec)}</div>
                </div>
              </div>
            )}

            {/* Queue List */}
            <div style={{ background: T.dark1, border: `1px solid ${T.dark3}`, borderRadius: 8, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.dark3}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: T.rose, textTransform: "uppercase" }}>Live Queue</div>
                <div style={{ fontSize: 10, color: T.muted }}>{waitingQueue.length} waiting</div>
              </div>
              <div style={{ maxHeight: 380, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                {queue.map((tok) => {
                  const isExpiring = tok.status === "waiting" && tok.expiresIn < 30;
                  return (
                    <div
                      key={tok.id}
                      className={`token-card ${tok.status === "serving" ? "serving" : ""} ${selected === tok.id ? "selected" : ""} ${tok.status === "expired" || tok.status === "skipped" || tok.status === "served" ? "expired" : ""}`}
                      onClick={() => tok.status === "waiting" && setSelected(selected === tok.id ? null : tok.id)}
                    >
                      {/* Position Badge */}
                      <div style={{ width: 32, height: 32, background: tok.status === "serving" ? T.crimson : T.dark3, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: T.white, flexShrink: 0 }}>
                        {tok.position}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: T.white }}>{tok.id}</span>
                          <span className={`tag tag-${tok.status}`}>{tok.status}</span>
                          {tok.category !== "Regular" && <span style={{ fontSize: 10, color: T.amber, letterSpacing: "0.06em" }}>{tok.category}</span>}
                        </div>
                        <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>{tok.name} · booked {tok.bookedAt}</div>
                      </div>

                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        {tok.status === "waiting" && (
                          <>
                            <div style={{ fontSize: 11, color: isExpiring ? T.amber : T.mutedLt, animation: isExpiring ? "blink 1s infinite" : "none" }}>
                              {isExpiring ? "⚠ " : ""}exp {formatWait(tok.expiresIn)}
                            </div>
                            <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>wait {formatWait(tok.waitSec)}</div>
                          </>
                        )}
                        {tok.status === "waiting" && (
                          <div style={{ display: "flex", gap: 4, marginTop: 6, justifyContent: "flex-end" }}>
                            <button className="btn btn-ghost" style={{ padding: "3px 8px", fontSize: 9 }} onClick={(e) => { e.stopPropagation(); skipToken(tok.id); }}>skip</button>
                            <button className="btn btn-ghost" style={{ padding: "3px 8px", fontSize: 9 }} onClick={(e) => { e.stopPropagation(); expireToken(tok.id); }}>expire</button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Right Column: Activity Log ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Occupancy Detail */}
            <div style={{ background: T.dark1, border: `1px solid ${T.dark3}`, borderRadius: 8, padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: T.rose, textTransform: "uppercase", marginBottom: 16 }}>Occupancy</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: isOverloaded ? T.crimson : T.white, lineHeight: 1 }}>{occupancyPct}%</div>
                <div style={{ fontSize: 12, color: T.muted }}>{occupancy} / {capacity}</div>
              </div>
              <div style={{ height: 6, background: T.dark3, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(occupancyPct, 100)}%`, background: isOverloaded ? T.crimson : occupancyPct > 80 ? T.amber : T.green, borderRadius: 4, transition: "width 0.6s ease" }} />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => setOccupancy((o) => Math.max(0, o - 1))}>− Release</button>
                <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => setOccupancy((o) => o + 1)}>+ Admit</button>
              </div>
            </div>

            {/* Selected Token Detail */}
            {selected && (() => {
              const tok = queue.find((t) => t.id === selected);
              return tok ? (
                <div style={{ background: "rgba(189,100,103,0.06)", border: `1px solid rgba(189,100,103,0.3)`, borderRadius: 8, padding: 16, animation: "slideIn 0.2s ease" }}>
                  <div style={{ fontSize: 10, color: T.rose, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Selected Token</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{tok.id}</div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{tok.name}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12, fontSize: 11, color: T.mutedLt }}>
                    <div>Category: <span style={{ color: T.white }}>{tok.category}</span></div>
                    <div>Position: <span style={{ color: T.white }}>{tok.position}</span></div>
                    <div>Wait: <span style={{ color: T.white }}>{formatWait(tok.waitSec)}</span></div>
                    <div>Expires: <span style={{ color: tok.expiresIn < 30 ? T.amber : T.white }}>{formatWait(tok.expiresIn)}</span></div>
                  </div>
                </div>
              ) : null;
            })()}

            {/* Activity Log */}
            <div style={{ background: T.dark1, border: `1px solid ${T.dark3}`, borderRadius: 8, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.dark3}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: T.rose, textTransform: "uppercase" }}>Activity Log</div>
                <div style={{ fontSize: 10, color: T.muted }}>{activityLog.length} events</div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: 1 }}>
                {activityLog.map((log) => (
                  <div key={log.id} className="log-row" style={{ padding: "9px 10px", borderRadius: 4, display: "flex", gap: 10, alignItems: "flex-start", borderBottom: `1px solid ${T.dark3}10` }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: logColor(log.type), marginTop: 4, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: T.white }}>{log.action}</div>
                      {log.token && <div style={{ fontSize: 10, color: logColor(log.type), marginTop: 2 }}>{log.token}</div>}
                    </div>
                    <div style={{ fontSize: 10, color: T.muted, flexShrink: 0 }}>{log.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Manual Override Modal ── */}
        {showOverride && (
          <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowOverride(false)}>
            <div className="modal-box">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.1em", color: T.amber }}>MANUAL OVERRIDE</div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>Force a token to serving status with audit reason</div>
                </div>
                <button className="btn btn-ghost" style={{ padding: "6px 10px" }} onClick={() => setShowOverride(false)}>✕</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label>Token ID</label>
                  <select value={overrideToken} onChange={(e) => setOverrideToken(e.target.value)}>
                    <option value="">Select token…</option>
                    {waitingQueue.map((t) => (
                      <option key={t.id} value={t.id}>{t.id} — {t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Override Reason</label>
                  <select value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)}>
                    <option value="">Select reason…</option>
                    <option value="Medical priority">Medical priority</option>
                    <option value="VIP escalation">VIP escalation</option>
                    <option value="Technical issue">Technical issue</option>
                    <option value="Manager request">Manager request</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {overrideReason === "Other" && (
                  <div>
                    <label>Custom Reason</label>
                    <input placeholder="Describe the reason…" onChange={(e) => setOverrideReason(e.target.value)} />
                  </div>
                )}
                <div style={{ padding: 12, background: "rgba(224,156,75,0.06)", border: `1px solid rgba(224,156,75,0.25)`, borderRadius: 5, fontSize: 11, color: T.amber, lineHeight: 1.6 }}>
                  ⚠ This action will be recorded in the audit log and flagged for supervisor review.
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button className="btn btn-ghost" onClick={() => setShowOverride(false)}>Cancel</button>
                  <button className="btn btn-warning" onClick={submitOverride} disabled={!overrideToken || !overrideReason}>
                    ⚡ Confirm Override
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
