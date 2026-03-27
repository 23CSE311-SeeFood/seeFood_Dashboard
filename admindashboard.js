import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

/* ─── DESIGN TOKENS ─────────────────────────────────────────────── */
const T = {
  crimson: "#B1464A",
  black: "#000200",
  white: "#FFFFFF",
  rose: "#BD6467",
  fog: "#F9F9F9",
  surface: "#0C0C0C",
  surfaceAlt: "#111111",
  border: "#1E1E1E",
  borderHover: "#2E2E2E",
  muted: "#555555",
  mutedLight: "#888888",
  success: "#4C9A6A",
  warning: "#C97B30",
  info: "#4A7CB1",
};

/* ─── NAVIGATION CONFIG ─────────────────────────────────────────── */
const NAV_SECTIONS = [
  { id: "overview",     icon: "◈", label: "Analytics Overview" },
  { id: "slots",        icon: "◫", label: "Slot Capacity" },
  { id: "fairness",     icon: "⊜", label: "Fair Booking Rules" },
  { id: "audit",        icon: "≡", label: "Booking Audit Log" },
  { id: "fairaudit",    icon: "⊟", label: "Fairness Audit" },
  { id: "prepserved",   icon: "⊕", label: "Prep vs Served" },
  { id: "waste",        icon: "◎", label: "Waste Logging" },
  { id: "wasteanalytics", icon: "◉", label: "Waste Analytics" },
  { id: "forecast",     icon: "◈", label: "Demand Forecast" },
  { id: "recommendation", icon: "⊛", label: "Prep Recommendations" },
  { id: "incidents",    icon: "⚠", label: "Incident Log" },
];

/* ─── MOCK DATA ─────────────────────────────────────────────────── */
const prepVsServedData = [
  { day: "Mon", prep: 185, served: 162, waste: 23 },
  { day: "Tue", prep: 210, served: 198, waste: 12 },
  { day: "Wed", prep: 195, served: 170, waste: 25 },
  { day: "Thu", prep: 230, served: 218, waste: 12 },
  { day: "Fri", prep: 250, served: 235, waste: 15 },
  { day: "Sat", prep: 160, served: 148, waste: 12 },
  { day: "Sun", prep: 120, served: 108, waste: 12 },
];

const wasteWeekData = [
  { day: "Mon", kg: 23, cost: 46 },
  { day: "Tue", kg: 12, cost: 24 },
  { day: "Wed", kg: 25, cost: 50 },
  { day: "Thu", kg: 12, cost: 24 },
  { day: "Fri", kg: 15, cost: 30 },
  { day: "Sat", kg: 12, cost: 24 },
  { day: "Sun", kg: 8,  cost: 16 },
];

const forecastData = [
  { time: "08:00", actual: 45, forecast: 50, lower: 40, upper: 60 },
  { time: "09:00", actual: 82, forecast: 78, lower: 65, upper: 91 },
  { time: "10:00", actual: 60, forecast: 65, lower: 55, upper: 75 },
  { time: "11:00", actual: 140, forecast: 135, lower: 120, upper: 150 },
  { time: "12:00", actual: 210, forecast: 205, lower: 185, upper: 225 },
  { time: "13:00", actual: 195, forecast: 190, lower: 170, upper: 210 },
  { time: "14:00", actual: 110, forecast: 115, lower: 100, upper: 130 },
  { time: "15:00", actual: null, forecast: 75,  lower: 60,  upper: 90  },
  { time: "16:00", actual: null, forecast: 95,  lower: 78,  upper: 112 },
  { time: "17:00", actual: null, forecast: 155, lower: 135, upper: 175 },
  { time: "18:00", actual: null, forecast: 180, lower: 158, upper: 202 },
];

const auditLogs = [
  { id: "BK-2847", user: "s.chen@uni.ac", action: "BOOK",     slot: "12:00–12:30", token: "T-1042", time: "10:42:15", status: "confirmed" },
  { id: "BK-2846", user: "a.patel@uni.ac", action: "CANCEL",   slot: "13:00–13:30", token: "T-1039", time: "10:38:02", status: "cancelled" },
  { id: "BK-2845", user: "r.okonkwo@uni.ac", action: "BOOK",   slot: "11:30–12:00", token: "T-1038", time: "10:31:44", status: "confirmed" },
  { id: "BK-2844", user: "m.garcia@uni.ac", action: "WAITLIST", slot: "12:00–12:30", token: "T-1037", time: "10:28:01", status: "waitlisted" },
  { id: "BK-2843", user: "j.kim@uni.ac",  action: "BOOK",     slot: "14:00–14:30", token: "T-1035", time: "10:21:33", status: "confirmed" },
  { id: "BK-2842", user: "t.brown@uni.ac", action: "BOOK",     slot: "12:30–13:00", token: "T-1034", time: "10:18:59", status: "confirmed" },
  { id: "BK-2841", user: "f.ali@uni.ac",  action: "CANCEL",   slot: "11:00–11:30", token: "T-1032", time: "10:11:27", status: "cancelled" },
];

const incidentLogs = [
  { id: "INC-047", severity: "critical", message: "Slot overbooking: 12:00 slot exceeded capacity by 4 users", time: "10:42:00", ack: false },
  { id: "INC-046", severity: "high",     message: "Fairness violation: user a.patel exceeded monthly booking quota (12/10)", time: "10:35:21", ack: false },
  { id: "INC-045", severity: "medium",   message: "Waste threshold exceeded: 25kg logged Wednesday — 15% above weekly avg", time: "09:55:08", ack: true },
  { id: "INC-044", severity: "low",      message: "Demand forecast deviation >18% for Friday dinner slot", time: "Yesterday", ack: true },
  { id: "INC-043", severity: "medium",   message: "Queue wait time exceeded 12 min at 12:15 — recommend slot redistribution", time: "Yesterday", ack: true },
];

const recommendations = [
  { meal: "Breakfast",  prep: 85,  forecast: 78,  confidence: 94, action: "Reduce by 8%",   priority: "low" },
  { meal: "Lunch",      prep: 220, forecast: 205, confidence: 88, action: "Reduce by 7%",   priority: "medium" },
  { meal: "High Tea",   prep: 65,  forecast: 80,  confidence: 91, action: "Increase by 23%", priority: "high" },
  { meal: "Dinner",     prep: 180, forecast: 175, confidence: 85, action: "Reduce by 3%",   priority: "low" },
];

/* ─── REUSABLE PRIMITIVES ────────────────────────────────────────── */
const Card = ({ children, style = {} }) => (
  <div style={{
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 8,
    padding: 24,
    ...style,
  }}>
    {children}
  </div>
);

const SectionLabel = ({ children }) => (
  <div style={{
    fontSize: 10,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: T.rose,
    fontWeight: 700,
    marginBottom: 18,
    display: "flex",
    alignItems: "center",
    gap: 8,
  }}>
    <span style={{ display: "inline-block", width: 16, height: 1, background: T.rose }} />
    {children}
  </div>
);

const FieldLabel = ({ children }) => (
  <label style={{ display: "block", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 6 }}>
    {children}
  </label>
);

const Input = ({ value, onChange, type = "text", placeholder = "" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      width: "100%",
      background: T.surfaceAlt,
      border: `1px solid ${T.border}`,
      borderRadius: 5,
      color: T.white,
      padding: "9px 12px",
      fontSize: 13,
      fontFamily: "inherit",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.15s",
    }}
    onFocus={e => e.target.style.borderColor = T.crimson}
    onBlur={e => e.target.style.borderColor = T.border}
  />
);

const Select = ({ value, onChange, children }) => (
  <select
    value={value}
    onChange={onChange}
    style={{
      width: "100%",
      background: T.surfaceAlt,
      border: `1px solid ${T.border}`,
      borderRadius: 5,
      color: T.white,
      padding: "9px 12px",
      fontSize: 13,
      fontFamily: "inherit",
      outline: "none",
      boxSizing: "border-box",
      cursor: "pointer",
    }}
  >
    {children}
  </select>
);

const Btn = ({ children, onClick, variant = "primary", size = "md" }) => {
  const [hover, setHover] = useState(false);
  const base = {
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontWeight: 700,
    fontSize: size === "sm" ? 10 : 11,
    padding: size === "sm" ? "6px 14px" : "10px 22px",
    transition: "all 0.15s",
  };
  const variants = {
    primary: { background: hover ? "#9a3b3e" : T.crimson, color: T.white },
    ghost:   { background: hover ? "#1a1a1a" : "transparent", color: hover ? T.white : T.muted, border: `1px solid ${T.border}` },
    success: { background: hover ? "#3d7a55" : T.success, color: T.white },
    warn:    { background: hover ? "#a3621f" : T.warning, color: T.white },
  };
  return (
    <button
      style={{ ...base, ...variants[variant] }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, color = T.crimson }) => (
  <span style={{
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 9px",
    borderRadius: 3,
    fontSize: 10,
    fontWeight: 700,
    background: `${color}22`,
    color: color,
    border: `1px solid ${color}44`,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  }}>
    {children}
  </span>
);

const severityColor = (s) => ({
  critical: T.crimson,
  high: "#D4722A",
  medium: T.warning,
  low: T.info,
}[s] || T.muted);

const StatusBadge = ({ status }) => {
  const map = {
    confirmed:  { c: T.success, label: "Confirmed" },
    cancelled:  { c: T.crimson, label: "Cancelled" },
    waitlisted: { c: T.warning, label: "Waitlisted" },
  };
  const { c, label } = map[status] || { c: T.muted, label: status };
  return <Badge color={c}>{label}</Badge>;
};

const StatCard = ({ value, label, delta, deltaPos, sub }) => (
  <Card style={{ padding: "20px 22px" }}>
    <div style={{ fontSize: 32, fontWeight: 800, color: T.white, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    {delta && <div style={{ fontSize: 11, color: deltaPos ? T.success : T.crimson, marginTop: 4 }}>{delta}</div>}
    <div style={{ fontSize: 10, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 8 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: T.mutedLight, marginTop: 4 }}>{sub}</div>}
  </Card>
);

const Toggle = ({ checked, onChange }) => (
  <div
    onClick={() => onChange(!checked)}
    style={{
      width: 40, height: 22, borderRadius: 11,
      background: checked ? T.crimson : "#2a2a2a",
      border: `1px solid ${checked ? T.crimson : T.border}`,
      cursor: "pointer", position: "relative", transition: "all 0.2s", flexShrink: 0,
    }}
  >
    <div style={{
      width: 16, height: 16, borderRadius: "50%",
      background: T.white,
      position: "absolute", top: 2,
      left: checked ? 20 : 2, transition: "left 0.2s",
    }} />
  </div>
);

const customTooltipStyle = {
  background: "#0d0d0d",
  border: `1px solid ${T.border}`,
  borderRadius: 6,
  color: T.white,
  fontSize: 12,
  fontFamily: "DM Mono, monospace",
};

/* ─── PAGE COMPONENTS ────────────────────────────────────────────── */

// 1. ANALYTICS OVERVIEW
const OverviewPage = () => (
  <div>
    <PageHeader title="Analytics Overview" sub="Centralized operational intelligence — today's snapshot" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
      <StatCard value="1,284" label="Total bookings today" delta="↑ 8.2% vs yesterday" deltaPos />
      <StatCard value="94.2%" label="Slot utilization" delta="↑ 1.4% vs avg" deltaPos />
      <StatCard value="18 kg" label="Waste logged today" delta="↓ 28% vs yesterday" deltaPos />
      <StatCard value="4.1 min" label="Avg wait time" delta="↑ 0.8 min" deltaPos={false} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
      <StatCard value="312" label="Active tokens" sub="Lunch period" />
      <StatCard value="3" label="Open incidents" sub="1 critical · 2 high" />
      <StatCard value="87%" label="Forecast accuracy" sub="7-day rolling avg" />
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
      <Card>
        <SectionLabel>Weekly Bookings</SectionLabel>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={prepVsServedData}>
            <defs>
              <linearGradient id="bgServed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={T.crimson} stopOpacity={0.3} />
                <stop offset="95%" stopColor={T.crimson} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1a1a1a" />
            <XAxis dataKey="day" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={customTooltipStyle} />
            <Area type="monotone" dataKey="served" stroke={T.crimson} fill="url(#bgServed)" strokeWidth={2} name="Served" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <SectionLabel>Waste This Week</SectionLabel>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={wasteWeekData}>
            <CartesianGrid stroke="#1a1a1a" />
            <XAxis dataKey="day" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={customTooltipStyle} />
            <Bar dataKey="kg" fill={T.rose} radius={[3, 3, 0, 0]} name="Waste (kg)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>

    <Card style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 13, color: T.white, fontWeight: 600 }}>Export All Analytics Data</div>
        <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>CSV / JSON — bookings, waste, forecast, fairness metrics</div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn variant="ghost">Export CSV</Btn>
        <Btn variant="primary">Export JSON</Btn>
      </div>
    </Card>
  </div>
);

// 2. SLOT CAPACITY
const SlotCapacityPage = () => {
  const [slots, setSlots] = useState([
    { id: 1, time: "08:00–08:30", capacity: 40, current: 38, buffer: 5, active: true },
    { id: 2, time: "08:30–09:00", capacity: 40, current: 22, buffer: 5, active: true },
    { id: 3, time: "11:30–12:00", capacity: 80, current: 75, buffer: 8, active: true },
    { id: 4, time: "12:00–12:30", capacity: 80, current: 80, buffer: 8, active: true },
    { id: 5, time: "12:30–13:00", capacity: 80, current: 61, buffer: 8, active: true },
    { id: 6, time: "13:00–13:30", capacity: 60, current: 40, buffer: 6, active: false },
    { id: 7, time: "17:30–18:00", capacity: 70, current: 55, buffer: 7, active: true },
    { id: 8, time: "18:00–18:30", capacity: 70, current: 48, buffer: 7, active: true },
  ]);

  const [globalCap, setGlobalCap] = useState(80);
  const [bufferPct, setBufferPct] = useState(10);

  const updateSlot = (id, field, value) =>
    setSlots(slots.map(s => s.id === id ? { ...s, [field]: value } : s));

  return (
    <div>
      <PageHeader title="Slot Capacity Configuration" sub="Configure per-slot maximum occupancy and buffer thresholds" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <Card>
          <SectionLabel>Global Defaults</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <FieldLabel>Default Max Capacity</FieldLabel>
              <Input type="number" value={globalCap} onChange={e => setGlobalCap(e.target.value)} />
            </div>
            <div>
              <FieldLabel>Buffer Percentage (%)</FieldLabel>
              <Input type="number" value={bufferPct} onChange={e => setBufferPct(e.target.value)} />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <Btn>Apply to All Slots</Btn>
          </div>
        </Card>
        <Card>
          <SectionLabel>Today's Utilization Summary</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <StatCard value="8" label="Active slots" />
            <StatCard value="94%" label="Peak utilization" />
          </div>
        </Card>
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${T.border}` }}>
          <SectionLabel>Per-Slot Configuration</SectionLabel>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#0a0a0a" }}>
              {["Time Slot", "Max Capacity", "Current Bookings", "Buffer Size", "Fill %", "Active"].map(h => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 10, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: `1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map(s => {
              const pct = Math.round((s.current / s.capacity) * 100);
              const fillColor = pct >= 100 ? T.crimson : pct >= 80 ? T.warning : T.success;
              return (
                <tr key={s.id} style={{ borderBottom: `1px solid ${T.border}`, opacity: s.active ? 1 : 0.45 }}>
                  <td style={{ padding: "12px 20px", color: T.white, fontWeight: 600 }}>{s.time}</td>
                  <td style={{ padding: "12px 20px" }}>
                    <input
                      type="number"
                      value={s.capacity}
                      onChange={e => updateSlot(s.id, "capacity", +e.target.value)}
                      style={{ width: 70, background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 4, color: T.white, padding: "5px 8px", fontFamily: "inherit", fontSize: 12, outline: "none" }}
                    />
                  </td>
                  <td style={{ padding: "12px 20px", color: T.mutedLight }}>{s.current}</td>
                  <td style={{ padding: "12px 20px" }}>
                    <input
                      type="number"
                      value={s.buffer}
                      onChange={e => updateSlot(s.id, "buffer", +e.target.value)}
                      style={{ width: 60, background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 4, color: T.white, padding: "5px 8px", fontFamily: "inherit", fontSize: 12, outline: "none" }}
                    />
                  </td>
                  <td style={{ padding: "12px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: "#1a1a1a", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: fillColor, borderRadius: 3, transition: "width 0.3s" }} />
                      </div>
                      <span style={{ color: fillColor, fontSize: 11, fontWeight: 700, width: 36 }}>{pct}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 20px" }}>
                    <Toggle checked={s.active} onChange={v => updateSlot(s.id, "active", v)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// 3. FAIR BOOKING RULES
const FairBookingPage = () => {
  const [rules, setRules] = useState({
    maxPerDay: 1,
    maxPerWeek: 5,
    maxPerMonth: 20,
    advanceBookingDays: 3,
    waitlistEnabled: true,
    priorityGroups: true,
    fairShareMode: "rotating",
    penaltyNoShow: true,
    noShowPenaltyDays: 2,
    cancelCutoffHours: 2,
  });

  const update = (k, v) => setRules({ ...rules, [k]: v });

  return (
    <div>
      <PageHeader title="Fair Booking Rules" sub="Configure allocation policies and fairness constraints" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionLabel>Booking Limits</SectionLabel>
          <div style={{ display: "grid", gap: 14 }}>
            {[
              ["Max bookings per day", "maxPerDay"],
              ["Max bookings per week", "maxPerWeek"],
              ["Max bookings per month", "maxPerMonth"],
              ["Advance booking window (days)", "advanceBookingDays"],
              ["Cancel cutoff (hours before slot)", "cancelCutoffHours"],
            ].map(([label, key]) => (
              <div key={key}>
                <FieldLabel>{label}</FieldLabel>
                <Input type="number" value={rules[key]} onChange={e => update(key, +e.target.value)} />
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <SectionLabel>Fair Share Mode</SectionLabel>
            <FieldLabel>Allocation Algorithm</FieldLabel>
            <Select value={rules.fairShareMode} onChange={e => update("fairShareMode", e.target.value)}>
              <option value="rotating">Rotating Priority</option>
              <option value="lottery">Random Lottery</option>
              <option value="fcfs">First-Come-First-Served</option>
              <option value="weighted">Weighted Equity</option>
            </Select>
            <div style={{ marginTop: 12, fontSize: 11, color: T.muted, lineHeight: 1.7 }}>
              Rotating Priority ensures users who booked less frequently get higher allocation weight, promoting equitable access across all students.
            </div>
          </Card>

          <Card>
            <SectionLabel>Feature Toggles</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                ["Waitlist enabled", "waitlistEnabled"],
                ["Priority groups (staff, dietary needs)", "priorityGroups"],
                ["No-show penalty", "penaltyNoShow"],
              ].map(([label, key]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: T.white }}>{label}</span>
                  <Toggle checked={rules[key]} onChange={v => update(key, v)} />
                </div>
              ))}
              {rules.penaltyNoShow && (
                <div style={{ paddingLeft: 0 }}>
                  <FieldLabel>No-show ban duration (days)</FieldLabel>
                  <Input type="number" value={rules.noShowPenaltyDays} onChange={e => update("noShowPenaltyDays", +e.target.value)} />
                </div>
              )}
            </div>
          </Card>

          <div style={{ display: "flex", gap: 10 }}>
            <Btn>Save Rules</Btn>
            <Btn variant="ghost">Reset Defaults</Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. BOOKING AUDIT LOG
const AuditLogPage = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = auditLogs.filter(l =>
    (filter === "all" || l.status === filter) &&
    (l.user.includes(search) || l.id.includes(search) || l.token.includes(search))
  );

  return (
    <div>
      <PageHeader title="Booking Audit Log" sub="Full tamper-evident record of all booking events" />
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <FieldLabel>Search user / booking ID / token</FieldLabel>
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="s.chen@uni.ac" />
          </div>
          <div style={{ width: 180 }}>
            <FieldLabel>Filter by status</FieldLabel>
            <Select value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="waitlisted">Waitlisted</option>
            </Select>
          </div>
          <Btn variant="ghost">Export Log</Btn>
        </div>
      </Card>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#0a0a0a" }}>
              {["Booking ID", "User", "Action", "Slot", "Token", "Time", "Status"].map(h => (
                <th key={h} style={{ padding: "11px 18px", textAlign: "left", fontSize: 10, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: `1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} style={{ borderBottom: `1px solid ${T.border}` }}
                onMouseEnter={e => e.currentTarget.style.background = "#111"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "11px 18px", color: T.rose, fontWeight: 700 }}>{l.id}</td>
                <td style={{ padding: "11px 18px", color: T.white }}>{l.user}</td>
                <td style={{ padding: "11px 18px" }}>
                  <Badge color={l.action === "BOOK" ? T.info : l.action === "CANCEL" ? T.crimson : T.warning}>{l.action}</Badge>
                </td>
                <td style={{ padding: "11px 18px", color: T.mutedLight }}>{l.slot}</td>
                <td style={{ padding: "11px 18px", color: T.muted, fontFamily: "monospace" }}>{l.token}</td>
                <td style={{ padding: "11px 18px", color: T.muted }}>{l.time}</td>
                <td style={{ padding: "11px 18px" }}><StatusBadge status={l.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: "12px 18px", borderTop: `1px solid ${T.border}`, fontSize: 11, color: T.muted }}>
          Showing {filtered.length} of {auditLogs.length} records
        </div>
      </Card>
    </div>
  );
};

// 5. FAIRNESS AUDIT DASHBOARD
const FairnessAuditPage = () => {
  const users = [
    { name: "s.chen@uni.ac",    bookings: 18, allowed: 20, violations: 0, score: 98, status: "good" },
    { name: "a.patel@uni.ac",   bookings: 12, allowed: 10, violations: 2, score: 61, status: "violation" },
    { name: "r.okonkwo@uni.ac", bookings: 9,  allowed: 20, violations: 0, score: 100, status: "good" },
    { name: "m.garcia@uni.ac",  bookings: 10, allowed: 10, violations: 0, score: 88, status: "good" },
    { name: "j.kim@uni.ac",     bookings: 7,  allowed: 20, violations: 0, score: 100, status: "good" },
    { name: "t.brown@uni.ac",   bookings: 11, allowed: 10, violations: 1, score: 72, status: "warning" },
  ];

  const scoreColor = s => s >= 90 ? T.success : s >= 70 ? T.warning : T.crimson;

  return (
    <div>
      <PageHeader title="Fairness Audit Dashboard" sub="Per-user allocation equity analysis and violation tracking" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard value="98.2%" label="System fairness index" delta="↑ 0.4% this week" deltaPos />
        <StatCard value="3" label="Active violations" delta="↑ 1 new today" deltaPos={false} />
        <StatCard value="1,284" label="Users served equitably" />
        <StatCard value="0.12" label="Gini coefficient" sub="Lower = more equal" />
      </div>

      <Card>
        <SectionLabel>Per-User Fairness Analysis</SectionLabel>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#0a0a0a" }}>
              {["User", "Bookings This Month", "Allowed", "Violations", "Fairness Score", "Status"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: `1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.name} style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: "12px 16px", color: T.white }}>{u.name}</td>
                <td style={{ padding: "12px 16px", color: T.mutedLight }}>{u.bookings}</td>
                <td style={{ padding: "12px 16px", color: T.mutedLight }}>{u.allowed}</td>
                <td style={{ padding: "12px 16px" }}>
                  {u.violations > 0 ? <Badge color={T.crimson}>{u.violations} violation{u.violations > 1 ? "s" : ""}</Badge> : <span style={{ color: T.muted }}>—</span>}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 80, height: 6, background: "#1a1a1a", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${u.score}%`, height: "100%", background: scoreColor(u.score), borderRadius: 3 }} />
                    </div>
                    <span style={{ color: scoreColor(u.score), fontWeight: 700, fontSize: 11 }}>{u.score}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <Badge color={u.status === "good" ? T.success : u.status === "warning" ? T.warning : T.crimson}>
                    {u.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// 6. PREP VS SERVED CHART
const PrepServedPage = () => (
  <div>
    <PageHeader title="Prep vs Served Comparison" sub="Track preparation efficiency and identify over-production patterns" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
      <StatCard value="107 kg" label="Total waste this week" delta="↓ 18% vs last week" deltaPos />
      <StatCard value="92.6%" label="Serving efficiency" delta="↑ 2.1% this week" deltaPos />
      <StatCard value="Rs 214" label="Estimated cost of waste" />
    </div>

    <Card style={{ marginBottom: 16 }}>
      <SectionLabel>Weekly Prep vs Served vs Waste</SectionLabel>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={prepVsServedData} barGap={4}>
          <CartesianGrid stroke="#1a1a1a" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={customTooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11, color: T.muted }} />
          <Bar dataKey="prep" fill={T.info} radius={[3, 3, 0, 0]} name="Prepared" />
          <Bar dataKey="served" fill={T.success} radius={[3, 3, 0, 0]} name="Served" />
          <Bar dataKey="waste" fill={T.crimson} radius={[3, 3, 0, 0]} name="Waste" />
        </BarChart>
      </ResponsiveContainer>
    </Card>

    <Card>
      <SectionLabel>Prep Efficiency Trend</SectionLabel>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={prepVsServedData}>
          <CartesianGrid stroke="#1a1a1a" />
          <XAxis dataKey="day" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 300]} />
          <Tooltip contentStyle={customTooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11, color: T.muted }} />
          <Line type="monotone" dataKey="prep" stroke={T.rose} strokeWidth={2} dot={false} name="Prepared" />
          <Line type="monotone" dataKey="served" stroke={T.success} strokeWidth={2} dot={false} name="Served" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  </div>
);

// 7. WASTE LOGGING FORM
const WasteLoggingPage = () => {
  const [form, setForm] = useState({ meal: "lunch", category: "main", quantity: "", unit: "kg", reason: "overprep", notes: "" });
  const [saved, setSaved] = useState(false);
  const upd = (k, v) => setForm({ ...form, [k]: v });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <PageHeader title="Waste Logging Entry" sub="Record food waste events for sustainability tracking" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionLabel>New Waste Entry</SectionLabel>
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <FieldLabel>Meal Period</FieldLabel>
                <Select value={form.meal} onChange={e => upd("meal", e.target.value)}>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="high-tea">High Tea</option>
                  <option value="dinner">Dinner</option>
                </Select>
              </div>
              <div>
                <FieldLabel>Category</FieldLabel>
                <Select value={form.category} onChange={e => upd("category", e.target.value)}>
                  <option value="main">Main Course</option>
                  <option value="side">Side Dish</option>
                  <option value="dessert">Dessert</option>
                  <option value="beverage">Beverage</option>
                  <option value="raw">Raw Ingredients</option>
                </Select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
              <div>
                <FieldLabel>Quantity</FieldLabel>
                <Input type="number" value={form.quantity} onChange={e => upd("quantity", e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <FieldLabel>Unit</FieldLabel>
                <Select value={form.unit} onChange={e => upd("unit", e.target.value)}>
                  <option value="kg">kg</option>
                  <option value="portions">portions</option>
                  <option value="litres">litres</option>
                </Select>
              </div>
            </div>
            <div>
              <FieldLabel>Reason</FieldLabel>
              <Select value={form.reason} onChange={e => upd("reason", e.target.value)}>
                <option value="overprep">Over-preparation</option>
                <option value="noshow">No-shows</option>
                <option value="spoilage">Spoilage</option>
                <option value="quality">Quality rejection</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div>
              <FieldLabel>Additional Notes</FieldLabel>
              <textarea
                value={form.notes}
                onChange={e => upd("notes", e.target.value)}
                placeholder="Optional context..."
                rows={3}
                style={{ width: "100%", background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 5, color: T.white, padding: "9px 12px", fontSize: 13, fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={handleSave}>{saved ? "✓ Saved!" : "Log Entry"}</Btn>
              <Btn variant="ghost" onClick={() => setForm({ meal: "lunch", category: "main", quantity: "", unit: "kg", reason: "overprep", notes: "" })}>Clear</Btn>
            </div>
          </div>
        </Card>

        <Card>
          <SectionLabel>Recent Entries Today</SectionLabel>
          {[
            { time: "13:45", meal: "Lunch", cat: "Main", qty: "8.2 kg", reason: "Over-preparation" },
            { time: "13:40", meal: "Lunch", cat: "Side",  qty: "3.1 kg", reason: "No-shows" },
            { time: "09:10", meal: "Breakfast", cat: "Main", qty: "2.8 kg", reason: "Spoilage" },
          ].map((e, i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: i < 2 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ color: T.white, fontSize: 13, fontWeight: 600 }}>{e.meal} — {e.cat}</span>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>{e.reason}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: T.crimson, fontWeight: 700, fontSize: 13 }}>{e.qty}</div>
                  <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{e.time}</div>
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// 8. WASTE ANALYTICS
const WasteAnalyticsPage = () => (
  <div>
    <PageHeader title="Waste Analytics" sub="Longitudinal waste pattern analysis and sustainability metrics" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
      <StatCard value="107 kg" label="Waste this week" delta="↓ 18% vs last week" deltaPos />
      <StatCard value="Rs 214" label="Estimated value lost" />
      <StatCard value="4.2%" label="Waste as % of prep" delta="Target: <3%" deltaPos={false} />
      <StatCard value="↓ 31%" label="Improvement vs last month" delta="Great progress" deltaPos />
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
      <Card>
        <SectionLabel>Daily Waste (kg) — This Week</SectionLabel>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={wasteWeekData}>
            <CartesianGrid stroke="#1a1a1a" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={customTooltipStyle} />
            <Bar dataKey="kg" fill={T.crimson} radius={[3, 3, 0, 0]} name="Waste (kg)">
              {wasteWeekData.map((entry, i) => (
                <rect key={i} fill={entry.kg === Math.max(...wasteWeekData.map(d => d.kg)) ? T.crimson : T.rose} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <SectionLabel>Waste by Category</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 8 }}>
          {[
            { label: "Main Course",    pct: 42, kg: 45 },
            { label: "Side Dishes",    pct: 28, kg: 30 },
            { label: "Desserts",       pct: 15, kg: 16 },
            { label: "Beverages",      pct: 9,  kg: 10 },
            { label: "Raw Ingredients", pct: 6, kg: 6 },
          ].map(c => (
            <div key={c.label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: T.white }}>{c.label}</span>
                <span style={{ fontSize: 11, color: T.muted }}>{c.kg} kg · {c.pct}%</span>
              </div>
              <div style={{ height: 8, background: "#1a1a1a", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${c.pct}%`, height: "100%", background: `linear-gradient(90deg, ${T.crimson}, ${T.rose})`, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>

    <Card>
      <SectionLabel>4-Week Waste Trend</SectionLabel>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={[
          { week: "W-4", kg: 158 }, { week: "W-3", kg: 143 }, { week: "W-2", kg: 131 }, { week: "W-1", kg: 107 },
        ]}>
          <defs>
            <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={T.crimson} stopOpacity={0.3} />
              <stop offset="95%" stopColor={T.crimson} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1a1a1a" />
          <XAxis dataKey="week" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={customTooltipStyle} />
          <Area type="monotone" dataKey="kg" stroke={T.crimson} fill="url(#wasteGrad)" strokeWidth={2} name="Waste (kg)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  </div>
);

// 9. DEMAND FORECAST
const ForecastPage = () => (
  <div>
    <PageHeader title="Demand Forecast Visualization" sub="AI/ML-driven crowd prediction for optimal slot management" />

    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
      <StatCard value="87%" label="7-day forecast accuracy" delta="↑ 2.3% this week" deltaPos />
      <StatCard value="180" label="Peak forecast (18:00)" sub="Dinner service" />
      <StatCard value="±12" label="Avg confidence interval" sub="At 90% CI" />
    </div>

    <Card style={{ marginBottom: 16 }}>
      <SectionLabel>Today's Demand Forecast vs Actuals</SectionLabel>
      <div style={{ fontSize: 11, color: T.muted, marginBottom: 16 }}>
        <span style={{ color: T.success, marginRight: 16 }}>● Actual arrivals</span>
        <span style={{ color: T.crimson, marginRight: 16 }}>● Forecast</span>
        <span style={{ color: "#2a3a4a", marginRight: 4 }}>■</span> 90% confidence band
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={forecastData}>
          <defs>
            <linearGradient id="ciGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={T.info} stopOpacity={0.15} />
              <stop offset="95%" stopColor={T.info} stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1a1a1a" />
          <XAxis dataKey="time" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={customTooltipStyle} />
          <Area type="monotone" dataKey="upper" stroke="transparent" fill="url(#ciGrad)" />
          <Area type="monotone" dataKey="lower" stroke="transparent" fill={T.black} />
          <Line type="monotone" dataKey="forecast" stroke={T.crimson} strokeWidth={2} dot={false} name="Forecast" strokeDasharray="5 3" />
          <Line type="monotone" dataKey="actual" stroke={T.success} strokeWidth={2.5} dot={{ fill: T.success, r: 3 }} name="Actual" connectNulls={false} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Card>
        <SectionLabel>Forecast Factors</SectionLabel>
        {[
          { factor: "Day of week (Friday)", impact: "+12%", dir: true },
          { factor: "Academic schedule: exams week", impact: "-8%", dir: false },
          { factor: "Weather: sunny, 28°C", impact: "+4%", dir: true },
          { factor: "Event: Sports day on campus", impact: "+18%", dir: true },
        ].map(f => (
          <div key={f.factor} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 12, color: T.mutedLight }}>{f.factor}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: f.dir ? T.success : T.crimson }}>{f.impact}</span>
          </div>
        ))}
      </Card>
      <Card>
        <SectionLabel>5-Day Outlook</SectionLabel>
        {[
          { day: "Sat", crowd: "Low", est: 320, color: T.success },
          { day: "Sun", crowd: "Very Low", est: 180, color: T.success },
          { day: "Mon", crowd: "High", est: 620, color: T.warning },
          { day: "Tue", crowd: "Medium", est: 490, color: T.info },
          { day: "Wed", crowd: "Very High", est: 780, color: T.crimson },
        ].map(d => (
          <div key={d.day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 12, color: T.white, fontWeight: 600 }}>{d.day}</span>
            <Badge color={d.color}>{d.crowd}</Badge>
            <span style={{ fontSize: 12, color: T.muted }}>~{d.est} diners</span>
          </div>
        ))}
      </Card>
    </div>
  </div>
);

// 10. PREP RECOMMENDATIONS
const RecommendationsPage = () => (
  <div>
    <PageHeader title="Preparation Recommendations" sub="AI-driven prep quantity suggestions based on demand forecast" />

    <Alert style={{ background: "#1a0e0e", border: `1px solid ${T.crimson}44`, borderRadius: 6, marginBottom: 20, color: T.white }}>
      <AlertDescription style={{ fontSize: 12, color: T.rose }}>
        ⚠ High Tea is currently under-prepared by an estimated 23%. Review and act on recommendation below.
      </AlertDescription>
    </Alert>

    <div style={{ display: "grid", gap: 14 }}>
      {recommendations.map(r => {
        const priorityColor = { low: T.success, medium: T.warning, high: T.crimson }[r.priority];
        const over = r.prep > r.forecast;
        return (
          <Card key={r.meal} style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: T.white }}>{r.meal}</span>
                <Badge color={priorityColor}>{r.priority} priority</Badge>
              </div>
              <div style={{ fontSize: 11, color: T.muted }}>
                Forecast: <strong style={{ color: T.white }}>{r.forecast} portions</strong> &nbsp;·&nbsp; 
                Current prep: <strong style={{ color: over ? T.crimson : T.success }}>{r.prep} portions</strong> &nbsp;·&nbsp;
                Confidence: {r.confidence}%
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: priorityColor, marginBottom: 4 }}>{r.action}</div>
              <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Recommended change</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn size="sm" variant="success">Apply</Btn>
              <Btn size="sm" variant="ghost">Dismiss</Btn>
            </div>
          </Card>
        );
      })}
    </div>

    <Card style={{ marginTop: 16 }}>
      <SectionLabel>Forecast vs Recommended Prep</SectionLabel>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={recommendations} barGap={6}>
          <CartesianGrid stroke="#1a1a1a" vertical={false} />
          <XAxis dataKey="meal" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={customTooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11, color: T.muted }} />
          <Bar dataKey="forecast" fill={T.success} radius={[3, 3, 0, 0]} name="Forecast" />
          <Bar dataKey="prep" fill={T.rose} radius={[3, 3, 0, 0]} name="Current Prep" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  </div>
);

// 11. INCIDENT LOG
const IncidentLogPage = () => {
  const [incidents, setIncidents] = useState(incidentLogs);
  const ackIncident = id => setIncidents(incidents.map(i => i.id === id ? { ...i, ack: true } : i));

  return (
    <div>
      <PageHeader title="Incident Log" sub="System anomaly tracker — operational alerts and resolution status" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard value={incidents.filter(i => !i.ack).length} label="Open incidents" />
        <StatCard value={incidents.filter(i => i.severity === "critical").length} label="Critical" />
        <StatCard value={incidents.filter(i => i.severity === "high").length} label="High" />
        <StatCard value={incidents.filter(i => i.ack).length} label="Acknowledged" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {incidents.map(inc => {
          const sc = severityColor(inc.severity);
          return (
            <Card key={inc.id} style={{ display: "flex", alignItems: "flex-start", gap: 16, opacity: inc.ack ? 0.55 : 1, transition: "opacity 0.2s", borderLeft: `3px solid ${sc}`, paddingLeft: 20 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.white, fontFamily: "monospace" }}>{inc.id}</span>
                  <Badge color={sc}>{inc.severity}</Badge>
                  {inc.ack && <Badge color={T.muted}>acknowledged</Badge>}
                </div>
                <div style={{ fontSize: 13, color: T.mutedLight, lineHeight: 1.5 }}>{inc.message}</div>
                <div style={{ fontSize: 10, color: T.muted, marginTop: 6 }}>{inc.time}</div>
              </div>
              {!inc.ack && (
                <Btn size="sm" variant="ghost" onClick={() => ackIncident(inc.id)}>Acknowledge</Btn>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

/* ─── PAGE HEADER ────────────────────────────────────────────────── */
const PageHeader = ({ title, sub }) => (
  <div style={{ marginBottom: 28 }}>
    <h1 style={{ fontSize: 24, fontWeight: 800, color: T.white, letterSpacing: "0.01em", margin: 0 }}>{title}</h1>
    <p style={{ fontSize: 12, color: T.muted, marginTop: 5, letterSpacing: "0.05em" }}>{sub}</p>
  </div>
);

/* ─── ROOT APP ───────────────────────────────────────────────────── */
const PAGE_MAP = {
  overview: OverviewPage,
  slots: SlotCapacityPage,
  fairness: FairBookingPage,
  audit: AuditLogPage,
  fairaudit: FairnessAuditPage,
  prepserved: PrepServedPage,
  waste: WasteLoggingPage,
  wasteanalytics: WasteAnalyticsPage,
  forecast: ForecastPage,
  recommendation: RecommendationsPage,
  incidents: IncidentLogPage,
};

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const ActivePage = PAGE_MAP[active];

  return (
    <div style={{
      fontFamily: "'DM Mono', 'Courier New', monospace",
      background: T.black,
      color: T.white,
      minHeight: "100vh",
      display: "flex",
      fontSize: 14,
    }}>
      {/* SIDEBAR */}
      <aside style={{
        width: 230,
        background: "#080808",
        borderRight: `1px solid ${T.border}`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{ padding: "22px 20px 20px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: T.crimson, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>◈</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: T.white }}>CaféAdmin</div>
              <div style={{ fontSize: 9, color: T.muted, letterSpacing: "0.1em" }}>Smart Cafeteria System</div>
            </div>
          </div>
        </div>

        {/* Uptime pill */}
        <div style={{ padding: "10px 20px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.success, boxShadow: `0 0 6px ${T.success}` }} />
            <span style={{ fontSize: 10, color: T.muted, letterSpacing: "0.08em" }}>System operational</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 0" }}>
          {NAV_SECTIONS.map(({ id, icon, label }) => {
            const isActive = active === id;
            return (
              <div
                key={id}
                onClick={() => setActive(id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 20px",
                  cursor: "pointer",
                  background: isActive ? `${T.crimson}18` : "transparent",
                  borderLeft: `2px solid ${isActive ? T.crimson : "transparent"}`,
                  color: isActive ? T.white : T.muted,
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  transition: "all 0.12s",
                  userSelect: "none",
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = T.white; e.currentTarget.style.background = "#111" } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = T.muted; e.currentTarget.style.background = "transparent" } }}
              >
                <span style={{ fontSize: 13, color: isActive ? T.crimson : T.muted }}>{icon}</span>
                {label}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 10, color: T.muted }}>Admin v2.4.1</div>
          <div style={{ fontSize: 10, color: "#333", marginTop: 2 }}>Feb 28, 2026</div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto", maxWidth: "calc(100vw - 230px)" }}>
        <ActivePage />
      </main>
    </div>
  );
}
