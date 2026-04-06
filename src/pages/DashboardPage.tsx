import { useState, useEffect } from "react";
import {
  Calendar,
  PlusCircle,
  Edit3,
  Activity,
  Droplet,
  Heart,
  Zap,
  CheckCircle,
  ChevronRight,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./DashboardPage.css";
import { set } from "date-fns";
import { useNavigate } from "react-router-dom";

type MealColor = "green" | "yellow" | "red";

export default function DashboardPage() {
  /* ===============================
     👤 STATES
  ================================ */

  const [user, setUser] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);


  const [mealCounts, setMealCounts] = useState<Record<MealColor, number>>({
    green: 0,
    yellow: 0,
    red: 0,
  });

  const [daysActive, setDaysActive] = useState(0);
  const navigate = useNavigate();
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);


  const hasJournal = false;
  const hasTrackedSymptoms = false;

  /* ===============================
     👤 LOAD USER
  ================================ */

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchLogs(parsedUser.id);
    }
  }, []);

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
          )}&fields[]=Status&fields[]=BloodWork&fields[]=OnboardingCompleted`,
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

  /* ===============================
     📊 FETCH LOGS FROM AIRTABLE
  ================================ */

  const fetchLogs = async (userId: string) => {
    try {
      const today = new Date().toISOString().split("T")[0];

      // ✅ Fetch today logs only
      const res = await fetch(
        `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_AIRTABLE_LOGS}?filterByFormula=${encodeURIComponent(
          `AND({UserId}='${userId}', IS_SAME({Date}, '${today}', 'day'))`,
        )}&fields[]=Date&fields[]=Meals`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
          },
        },
      );

      const data = await res.json();
      const todayRecords = data.records || [];

      /* ===============================
         🟢 COUNT MEALS (TODAY)
      ================================ */

      let green = 0;
      let yellow = 0;
      let red = 0;

      todayRecords.forEach((record: any) => {
        if (record.fields.Meals) {
          let mealsArray = record.fields.Meals;

          // Airtable sometimes returns string
          if (typeof mealsArray === "string") {
            try {
              mealsArray = JSON.parse(mealsArray);
            } catch {
              mealsArray = [];
            }
          }

          mealsArray.forEach((meal: any) => {
            if (meal.color === "green") green++;
            if (meal.color === "yellow") yellow++;
            if (meal.color === "red") red++;
          });
        }
      });

      setMealCounts({ green, yellow, red });

      /* ===============================
         📅 CALCULATE DAYS ACTIVE
      ================================ */

      const allDatesRes = await fetch(
        `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_AIRTABLE_LOGS}?filterByFormula=${encodeURIComponent(
          `{UserId}='${userId}'`,
        )}&fields[]=Date&fields[]=Water Intake&fields[]=Supplements`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
          },
        },
      );

      const allDatesData = await allDatesRes.json();
      setLogs(allDatesData.records || []);

      const uniqueDates = new Set(
        (allDatesData.records || []).map(
          (rec: any) => rec.fields.Date?.split("T")[0],
        ),
      );

      setDaysActive(uniqueDates.size);
    } catch (err) {
      console.error("Airtable fetch error:", err);
    }
  };

  /* ===============================
     📊 CALCULATIONS
  ================================ */

  const totalMeals = mealCounts.green + mealCounts.yellow + mealCounts.red;

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();

  const weekNumber = Math.ceil(daysActive / 7) || 1;

  /* ===============================
     🎨 UI
  ================================ */

  return (
    <div className="dashboard">
      {/* GREETING */}
      <div className="dashboard-greeting">
        <p className="greeting-text">
          {greeting}
          {user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </p>

        <h1 className="day-title">Day {daysActive || 1}</h1>

        <div className="week-badge">
          <Calendar size={14} />
          <span>Week {weekNumber} of your journey</span>
        </div>
      </div>

      {/* HERO CARD */}
      <div className="hero-card">
        <div className="hero-content">
          <h2>Today's Focus</h2>
          <p>Focus on your green foods today. Every meal is a fresh choice.</p>
        </div>

        <div className="hero-stats">
          <div className="meal-summary-bar">
            <div
              className="bar-segment green"
              style={{ flex: mealCounts.green || 0.1 }}
            />
            <div
              className="bar-segment yellow"
              style={{ flex: mealCounts.yellow || 0.1 }}
            />
            <div
              className="bar-segment red"
              style={{ flex: mealCounts.red || 0.1 }}
            />
          </div>

          <p className="meals-logged">
            {totalMeals > 0
              ? `${totalMeals} meal${totalMeals === 1 ? "" : "s"} logged today`
              : "No meals logged yet"}
          </p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="dashboard-section">
        <h3 className="section-title">Quick Actions</h3>

        <Link
          to="/log"
          className="action-card"
        >
          <div className="action-icon green">
            <PlusCircle size={20} />
          </div>
          <div className="action-content">
            <span className="action-title">Log a Meal</span>
            <span className="action-subtitle">
              {totalMeals} meal{totalMeals === 1 ? "" : "s"} today
            </span>
          </div>
          {totalMeals >= 3 && (
            <CheckCircle size={20} className="action-complete" />
          )}
          <ChevronRight size={20} className="action-chevron" />
        </Link>

        <Link
          to="/log"
          className="action-card"
        >
          <div className="action-icon blue">
            <Edit3 size={20} />
          </div>
          <div className="action-content">
            <span className="action-title">Daily Journal</span>
            <span className="action-subtitle">
              {hasJournal ? "Completed" : "Reflect on your day"}
            </span>
          </div>
          {hasJournal && <CheckCircle size={20} className="action-complete" />}
          <ChevronRight size={20} className="action-chevron" />
        </Link>

        <Link
          to="/log"
          className="action-card"
        >
          <div className="action-icon yellow">
            <Activity size={20} />
          </div>
          <div className="action-content">
            <span className="action-title">Track Symptoms</span>
            <span className="action-subtitle">
              {hasTrackedSymptoms ? "Completed" : "How are you feeling?"}
            </span>
          </div>
          {hasTrackedSymptoms && (
            <CheckCircle size={20} className="action-complete" />
          )}
          <ChevronRight size={20} className="action-chevron" />
        </Link>
      </div>

      {/* REMINDERS */}
      {(logs[0]?.fields["Water Intake"] < 8 ||
        logs[0]?.fields["Supplements"] < 4) && (
        <div className="dashboard-section">
          <h3 className="section-title">Daily Reminders</h3>

          {logs[0]?.fields["Water Intake"] < 8 && (
            <Link
              to="/log"
              className="reminder-card water"
            >
              <div className="reminder-icon">
                <Droplet size={20} />
              </div>
              <div className="reminder-content">
                <span className="reminder-title">Stay Hydrated</span>
                <span className="reminder-subtitle">
                  {logs[0]?.fields["Water Intake"]}/8 glasses today —{" "}
                  {8 - logs[0]?.fields["Water Intake"]} more to go!
                </span>
              </div>
              <ChevronRight size={20} className="reminder-chevron" />
            </Link>
          )}
        </div>
      )}
      <Link to="/achievements" className="achievements-link">
        <div className="achievements-icon">
          <Award size={24} />
        </div>
        <div className="achievements-content">
          <span className="achievements-title">Achievements</span>
          <span className="achievements-desc">
            View your badges and progress
          </span>
        </div>
        <ChevronRight size={20} className="achievements-arrow" />
      </Link>

      {/* PROGRESS SNAPSHOT */}
      <div className="dashboard-section">
        <h3 className="section-title">Progress Snapshot</h3>

        <div className="progress-cards">
          <div className="progress-card">
            <div className="progress-icon blue">
              <Zap size={20} />
            </div>
            <div className="progress-value">{daysActive}</div>
            <div className="progress-label">Days Active</div>
          </div>

          <div className="progress-card">
            <div className="progress-icon green">
              <CheckCircle size={20} />
            </div>
            <div className="progress-value">{mealCounts.green}</div>
            <div className="progress-label">Green Meals</div>
            <div className="progress-subtitle">Today</div>
          </div>
        </div>
      </div>

      {/* MOTIVATION */}
      <div className="motivation-card">
        <Heart size={20} className="motivation-icon" />
        <p>
          Remember: Today doesn't need to be perfect to count. One green choice
          at a time.
        </p>
      </div>
      {showUpgradePopup && (
        <div className="upgrade-modal-overlay">
          <div className="upgrade-modal">
            <button
              className="upgrade-close"
              onClick={() => setShowUpgradePopup(false)}
            >
              ✕
            </button>

            <div className="upgrade-icon">🔒</div>

            <h2 className="upgrade-title">Unlock Full Assessment</h2>

            <p className="upgrade-text">
              You’re currently on the <strong>Free Plan</strong>. Upgrade to
              access all health insights, detailed scoring, and personalized
              recommendations.
            </p>

            <ul className="upgrade-features">
              <li>✔ Complete health evaluation</li>
              <li>✔ Advanced risk scoring</li>
              <li>✔ Unlimited assessments</li>
            </ul>

            <div className="upgrade-actions">
              <button
                className="upgrade-btn secondary"
                onClick={() => setShowUpgradePopup(false)}
              >
                Maybe Later
              </button>

              <button
                className="upgrade-btn primary"
                onClick={() => navigate("/pricing")}
              >
                Upgrade Now 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
