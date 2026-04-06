import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Coffee,
  CheckCircle,
  Zap,
  Smile,
  Activity,
  TrendingDown,
  Target,
} from "lucide-react";
import "./TrackPage.css";

type TimeRange = "week" | "month" | "all";

const parseAirtableDate = (dateValue: any): Date | null => {
  if (!dateValue) return null;

  // If already Date object
  if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
    const d = new Date(dateValue);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  if (typeof dateValue === "string") {
    const clean = dateValue.trim();

    // ✅ Handles Airtable format: 2026-05-05
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
      const [year, month, day] = clean.split("-").map(Number);
      const d = new Date(year, month - 1, day);
      d.setHours(0, 0, 0, 0);
      return isNaN(d.getTime()) ? null : d;
    }

    // ✅ Handles browser/full date string:
    // Fri Apr 03 2026 14:33:40 GMT+0530 ...
    const nativeDate = new Date(clean);
    if (!isNaN(nativeDate.getTime())) {
      nativeDate.setHours(0, 0, 0, 0);
      return nativeDate;
    }

    // Optional fallback for M/D/YYYY
    const parts = clean.split("/");
    if (parts.length === 3) {
      const month = Number(parts[0]) - 1;
      const day = Number(parts[1]);
      const year = Number(parts[2]);

      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        const d = new Date(year, month, day);
        d.setHours(0, 0, 0, 0);
        return isNaN(d.getTime()) ? null : d;
      }
    }
  }

  return null;
};

const isSameMonth = (date: Date, compare: Date) => {
  return (
    date.getMonth() === compare.getMonth() &&
    date.getFullYear() === compare.getFullYear()
  );
};

const isWithinLast7Days = (date: Date, today: Date) => {
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  start.setDate(today.getDate() - 6);

  return date >= start && date <= today;
};

export default function TrackPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [profile, setProfile] = useState([] as any);
  const [logs, setLogs] = useState([] as any);
  const navigate = useNavigate();

  // =============================
  // Load user from localStorage
  // =============================
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");

    if (!storedUser) {
      navigate("/");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    // Fetch Airtable profile using userId
    fetchLogs(parsedUser.id);
  }, [navigate]);
  

  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("userData");
        if (!storedUser) return;

        const parsedUser = JSON.parse(storedUser);
        const recordId = parsedUser.id;

        if (!recordId) return;

        const res = await fetch(
          `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_AIRTABLE_USERS}?filterByFormula=${encodeURIComponent(
            `RECORD_ID()='${recordId}'`,
          )}&fields[]=Status&fields[]=BloodWork&fields[]=OnboardingCompleted&fields[]=Email&fields[]=Weight&fields[]=BMI&fields[]=WaistHeightRatio`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
            },
          },
        );

        if (!res.ok) {
          console.error("Failed to fetch user");
          setIsPremium(false);
          return;
        }

        const data = await res.json();
        
        // ✅ Get first matched record
        const record = data.records?.[0];

        if (record) {
          setProfile(record.fields);
        } 

        if(data.records.length == 0){
          localStorage.removeItem("userData");
          navigate("/");
        }

        const status = data?.records[0]?.fields?.Status || "";
        const BloodWork = data?.records[0]?.fields?.BloodWork || "";
        const OnboardingCompleted = data?.records[0]?.fields?.OnboardingCompleted ?? false;

        console.log(OnboardingCompleted);

        if (status?.toLowerCase() === "paid") {
          if (BloodWork != "completed" && BloodWork != "pending" && OnboardingCompleted === false ) {
            const storedUser = JSON.parse(
              localStorage.getItem("userData") || "{}",
            );

            const updatedUser = {
              ...storedUser,
              onboardingCompleted: false,
              status: "paid",
            };

            localStorage.setItem("userData", JSON.stringify(updatedUser));
          }

          setIsPremium(true);
        } else {
          setIsPremium(false);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setIsPremium(false);
      }
    };

    fetchUser();
  }, []);
  const fetchLogs = async (userId: string) => {
    try {

      const res = await fetch(
        `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_AIRTABLE_LOGS}?filterByFormula=${encodeURIComponent(
          `{UserId}='${userId}'`,
        )}&fields[]=Date&fields[]=Meals&fields[]=Energy&fields[]=Mood`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
          },
        },
      );

      const data = await res.json();

      setLogs(data.records || []);
    } catch (err) {
      console.error("Airtable fetch error:", err);
    }
  };

 const calculateStats = (records: any[], range: TimeRange) => {
  if (!records || records.length === 0) {
    return {
      daysActive: 0,
      greenMeals: 0,
      yellowMeals: 0,
      redMeals: 0,
      averageEnergy: 0,
      averageMood: 0,
      daysLogged: 0,
    };
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  let green = 0;
  let yellow = 0;
  let red = 0;

  let energyTotal = 0;
  let moodTotal = 0;

  let energyCount = 0;
  let moodCount = 0;

  const activeDays = new Set<string>();
  let daysLogged = 0;

  records.forEach((rec) => {
    const f = rec.fields;
    if (!f?.Date) return;

    const logDate = parseAirtableDate(f.Date);
    if (!logDate) return;

    let include = false;

    if (range === "all") {
      include = true;
    } else if (range === "week") {
      include = isWithinLast7Days(logDate, today);
    } else if (range === "month") {
      include = isSameMonth(logDate, today);
    }

    if (!include) return;

    daysLogged++;
    activeDays.add(logDate.toDateString());

    if (typeof f.Energy === "number") {
      energyTotal += f.Energy;
      energyCount++;
    }

    if (typeof f.Mood === "number") {
      moodTotal += f.Mood;
      moodCount++;
    }

    if (f.Meals) {
      try {
        const meals =
          typeof f.Meals === "string" ? JSON.parse(f.Meals) : f.Meals;

        if (Array.isArray(meals)) {
          meals.forEach((m: any) => {
            if (m.color === "green") green++;
            else if (m.color === "yellow") yellow++;
            else if (m.color === "red") red++;
          });
        }
      } catch (err) {
        console.error("Meals parse error:", err);
      }
    }
  });

  return {
    daysActive: activeDays.size,
    greenMeals: green,
    yellowMeals: yellow,
    redMeals: red,
    averageEnergy:
      energyCount > 0 ? +(energyTotal / energyCount).toFixed(1) : 0,
    averageMood: moodCount > 0 ? +(moodTotal / moodCount).toFixed(1) : 0,
    daysLogged,
  };
};

  // =============================
  // 🔥 USE REAL DATA HERE
  // =============================
  const stats = useMemo(
    () => calculateStats(logs, timeRange),
    [logs, timeRange],
  );

  const totalMeals = stats.greenMeals + stats.yellowMeals + stats.redMeals;

  const greenPercentage =
    totalMeals > 0 ? Math.round((stats.greenMeals / totalMeals) * 100) : 0;

  const getSummaryTitle = () => {
    switch (timeRange) {
      case "week":
        return "Weekly Summary";
      case "month":
        return "Monthly Summary";
      case "all":
        return "All Time Summary";
    }
  };

  return (
    <div className="track-page">
      <div className="track-header">
        <h1>Progress</h1>
        <p>Track your journey and see how far you've come</p>
      </div>

      <div className="time-range-selector">
        {(["week", "month", "all"] as TimeRange[]).map((range) => (
          <button
            key={range}
            className={`time-range-btn ${timeRange === range ? "active" : ""}`}
            onClick={() => setTimeRange(range)}
          >
            {range === "all" ? "All Time" : `This ${range}`}
          </button>
        ))}
      </div>

      <section className="track-section">
        <h2>Overview</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div
              className="stat-icon"
              style={{ background: "rgba(74, 124, 89, 0.1)", color: "#4A7C59" }}
            >
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.daysActive}</span>
              <span className="stat-label">Days Active</span>
            </div>
          </div>
          <div className="stat-card">
            <div
              className="stat-icon"
              style={{ background: "rgba(234, 179, 8, 0.1)", color: "#EAB308" }}
            >
              <Coffee size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{totalMeals}</span>
              <span className="stat-label">Total Meals</span>
            </div>
          </div>
          <div className="stat-card">
            <div
              className="stat-icon"
              style={{ background: "rgba(34, 197, 94, 0.1)", color: "#22C55E" }}
            >
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{greenPercentage}%</span>
              <span className="stat-label">Green Meals</span>
              <span className="stat-subtitle">{stats.greenMeals} meals</span>
            </div>
          </div>
          <div className="stat-card">
            <div
              className="stat-icon"
              style={{
                background: "rgba(59, 130, 246, 0.1)",
                color: "#3B82F6",
              }}
            >
              <Zap size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.averageEnergy}/10</span>
              <span className="stat-label">Avg Energy</span>
            </div>
          </div>
        </div>
      </section>

      <section className="track-section">
        <h2>Meal Distribution</h2>
        <div className="distribution-card">
          <div className="distribution-bar">
            <div
              className="bar-segment green"
              style={{ flex: stats.greenMeals }}
            />
            <div
              className="bar-segment yellow"
              style={{ flex: stats.yellowMeals }}
            />
            <div className="bar-segment red" style={{ flex: stats.redMeals }} />
          </div>
          <div className="distribution-stats">
            <div className="dist-row">
              <div className="dist-dot green" />
              <span className="dist-label">Green meals</span>
              <span className="dist-value">{stats.greenMeals}</span>
            </div>
            <div className="dist-row">
              <div className="dist-dot yellow" />
              <span className="dist-label">Orange meals</span>
              <span className="dist-value">{stats.yellowMeals}</span>
            </div>
            <div className="dist-row">
              <div className="dist-dot red" />
              <span className="dist-label">Red meals</span>
              <span className="dist-value">{stats.redMeals}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="track-section">
        <h2>Health Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">
              <Activity size={20} />
            </div>
            <div className="metric-content">
              <span className="metric-value">{profile.BMI}</span>
              <span className="metric-label">BMI</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">
              <Target size={20} />
            </div>
            <div className="metric-content">
              <span className="metric-value">{profile.WaistHeightRatio}</span>
              <span className="metric-label">Waist-Height Ratio</span>
            </div>
          </div>
        </div>

        <div className="weight-card">
          <TrendingDown size={20} className="weight-icon" />
          <div className="weight-info">
            <span className="weight-title">Current Weight</span>
            <span className="weight-subtitle">
              Last updated at program start
            </span>
          </div>
          <span className="weight-value">{profile.Weight || "0"} lbs</span>
        </div>
      </section>

      <section className="track-section">
        <h2>{getSummaryTitle()}</h2>
        <div className="summary-card">
          <div className="summary-row">
            <Smile size={20} className="summary-icon mood" />
            <span className="summary-label">Average Mood</span>
            <span className="summary-value">{stats.averageMood}/10</span>
          </div>
          <div className="summary-row">
            <Zap size={20} className="summary-icon energy" />
            <span className="summary-label">Average Energy</span>
            <span className="summary-value">{stats.averageEnergy}/10</span>
          </div>
          <div className="summary-row">
            <CheckCircle size={20} className="summary-icon logged" />
            <span className="summary-label">Days Logged</span>
            <span className="summary-value">{stats.daysLogged}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
