import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Camera,
  Award,
  Trash2,
  Crown,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";
import "./ProfilePage.css";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState([] as any);
  const [metrics, setMetrics] = useState({
    Weight: "",
    Height: "",
    Waist: "",
    BMI: "",
    WaistHeightRatio: "",
  });
  const [bloodWorkAnswers, setBloodWorkAnswers] = useState<BloodWorkAnswers>(
    {},
  );

  const BLOOD_WORK_FIELDS = [
    "Fasting Insulin (μIU/mL)",
    "HbA1c (%)",
    "Uric Acid (mg/dL)",
    "Fasting Glucose (mg/dL)",
    "HOMA-IR (calculated)",
    "Triglycerides (mg/dL)",
    "HDL Cholesterol (mg/dL)",
    "TG/HDL Ratio (calculated)",
    "TSH (mIU/L)",
    "LDL Cholesterol (mg/dL)",
    "LDL/HDL Ratio (calculated)",
    "Total Cholesterol (mg/dL)",
    "Cholesterol/HDL Ratio (calculated)",
    "History Score (from questionnaire)",
    "Family History of Diabetes",
    "Age (years)",
    "Waist/Height Ratio",
    "Relative Fat Mass (%)",
    "BMI",
    "History of High Blood Pressure",
  ];

  useEffect(() => {
    const w = parseFloat(metrics.Weight);
    const h = parseFloat(metrics.Height);

    if (!isNaN(w) && !isNaN(h) && h > 0) {
      const ratio = (w / h).toFixed(2); // 3 decimal places

      // ✅ BMI using US formula
      const bmi = ((703 * w) / (h * h)).toFixed(2);

      setMetrics((prev) => ({
        ...prev,
        WaistHeightRatio: ratio,
        BMI: bmi,
      }));
    } else {
      setMetrics((prev) => ({
        ...prev,
        WaistHeightRatio: "",
      }));
    }
  }, [metrics.Weight, metrics.Height]);

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
    setUser(parsedUser);

    // Fetch Airtable profile using userId
    fetchProfile(parsedUser.id);
  }, [navigate]);

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return 0;

    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // =============================
  // Fetch Airtable Data
  // =============================
  const fetchProfile = async (userId: any) => {
    try {
      const res = await fetch(
        `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_AIRTABLE_USERS}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
          },
        },
      );

      const data = await res.json();
      setProfile(data.fields);
      setMetrics({
        Weight: data.fields.Weight || "",
        Height: data.fields.Height || "",
        Waist: data.fields.Waist || "",
        BMI: data.fields.BMI || "",
        WaistHeightRatio: data.fields.WaistHeightRatio || "",
      });
      // ✅ FIX: Load notification state from Airtable
      setNotifications(data.fields.Notifications === true);

      setBloodWorkAnswers({
        "History Score (from questionnaire)": data.fields.HealthScore,
        "Waist/Height Ratio": data.fields.WaistHeightRatio,
        "Relative Fat Mass (%)": data.fields.BodyFatPercentage,
        BMI: data.fields.BMI,
        "Age (years)": calculateAge(data.fields.DateOfBirth).toString(),
      });
    } catch (err) {
      console.error("Airtable fetch error:", err);
    }
  };
  const REQUIRED_METRIC_FIELDS = ["Weight", "Height", "Waist"];

  const AUTO_CALCULATED_BLOOD_FIELDS = [
    "HOMA-IR (calculated)",
    "TG/HDL Ratio (calculated)",
    "LDL/HDL Ratio (calculated)",
    "Cholesterol/HDL Ratio (calculated)",
    "History Score (from questionnaire)",
    "Waist/Height Ratio",
    "Relative Fat Mass (%)",
    "BMI",
    "Age (years)",
  ];

  const REQUIRED_BLOOD_WORK_FIELDS = BLOOD_WORK_FIELDS.filter(
    (field) => !AUTO_CALCULATED_BLOOD_FIELDS.includes(field)&&
    field !== "Family History of Diabetes" &&
    field !== "History of High Blood Pressure",
  );

  const isEmptyValue = (value: any) =>
    value === undefined || value === null || String(value).trim() === "" || String(value).trim() === "0";;

  const validateMetrics = () => {
    const missingFields = REQUIRED_METRIC_FIELDS.filter((field) =>
      isEmptyValue(metrics[field as keyof typeof metrics]),
    );

    if (missingFields.length > 0) {
      toast.error(`Please fill all metric fields: ${missingFields.join(", ")}`);
      return false;
    }

    return true;
  };

  const validateBloodWork = () => {
    const missingFields = REQUIRED_BLOOD_WORK_FIELDS.filter((field) =>
      isEmptyValue(bloodWorkAnswers[field]),
    );

    if (missingFields.length > 0) {
      toast.error(`Please fill all blood work fields`);
      return false;
    }

    return true;
  };
  const saveMetrics = async () => {
    if (!isPremium) return;
    if (!validateMetrics()) return;

    setSaving(true); // ✅ start loader

    try {
      const numericMetrics = {
        Weight: Number(metrics.Weight) || 0,
        Height: Number(metrics.Height) || 0,
        Waist: Number(metrics.Waist) || 0,
        BMI: Number(metrics.BMI) || 0,
        WaistHeightRatio: Number(metrics.WaistHeightRatio) || 0,
      };

      await fetch(
        `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_AIRTABLE_USERS}/${user.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: numericMetrics,
          }),
        },
      );
      fetchProfile(user.id); // Refresh profile data after saving

      toast.success("Metrics updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Error updating metrics");
    } finally {
      setSaving(false); // ✅ stop loader
    }
  };
  const saveBloodWork = async () => {
  if (!isPremium) return;

  if (!validateMetrics()) {
    toast.error("Please complete all metric fields first");
    return;
  }

  if (!validateBloodWork()) return;

  setSaving(true);

  try {
    const irsScore = calculateIRSScore();

    let definitiveInsulinScore = "";

    if (irsScore > 50) {
      definitiveInsulinScore =
        "Very Severe - You have very severe insulin resistance and diabetes. This increases your risk of heart disease, cancer, neurodegenerative and other chronic disease. You must immediately halt and reverse this disease and you would most likely benefit by adding a GLP to your program. Studies show that reversing diabetes and normalizing your sugar and insulin will halt and reduce your risk of all chronic disease. Keeping your insulin resistance normal will continue to protect you from chronic disease in the decades ahead increasing both your healthspan and lifespan.";
    } else if (irsScore >= 36) {
      definitiveInsulinScore =
        "Severe - You have severe insulin resistance and diabetes. This increases your risk of heart disease, cancer, neurodegenerative and other chronic disease. You must immediately halt and reverse this disease and you would most likely benefit by adding a GLP to your program. Studies show that reversing diabetes and normalizing your sugar and insulin will halt and reduce your risk of all chronic disease. Keeping your insulin resistance normal will continue to protect you from chronic disease in the decades ahead increasing both your healthspan and lifespan.";
    } else if (irsScore >= 25) {
      definitiveInsulinScore =
        "Moderate - You have moderate insulin resistance and prediabetes. This increases your risk of heart disease, cancer and neurodegenerative and other chronic diseases. Studies show that reversing prediabetes and normalizing your sugar and insulin will halt and reduce your risk of all chronic disease. Keeping your insulin resistance normal will continue to protect you from chronic disease in the decades ahead increasing both your healthspan and lifespan.";
    } else if (irsScore >= 13) {
      definitiveInsulinScore =
        "Mild - You have mild insulin resistance. This should be able to be reversed with more attention to the green sheets and other lifestyle factors like good sleep and exercise etc to correct this. Please review the Resource Section.";
    } else {
      definitiveInsulinScore =
        "Normal - Excellent results look like you are insulin sensitive with good metabolic flexibility. Keep up your great nutrition.";
    }

    const numericMetrics = {
      BloodWork: "completed",
      IRSScore: irsScore,
      DefinitiveInsulinScore: definitiveInsulinScore,
    };

    const response = await fetch(
      `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_AIRTABLE_USERS}/${user.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: numericMetrics,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update Airtable");
    }

    await fetchProfile(user.id);

    toast.success("Blood work updated successfully");
  } catch (err) {
    console.error("Error updating blood work:", err);
    toast.error("Error updating blood work");
  } finally {
    setSaving(false);
  }
};
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

  const toggleNotifications = async () => {
    const newValue = !notifications;

    setNotifications(newValue); // update UI immediately

    try {
      await fetch(
        `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_AIRTABLE_USERS}/${user.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: {
              Notifications: newValue,
            },
          }),
        },
      );
    } catch (err) {
      console.error(err);
      toast.error("Error saving notification setting");
    }
  };

  const deleteAllData = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This will delete ALL your health data. This action cannot be undone.",
    );

    if (!confirmDelete) return;

    try {
      await fetch(
        `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_AIRTABLE_USERS}/${user.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: {
              // KEEP THESE — do not touch
              Name: profile?.Name || "",
              DateOfBirth: profile?.DateOfBirth || "",
              Sex: profile?.Sex || "",
              Email: profile.Email,
              Password: profile?.Password || "",

              // CLEAR EVERYTHING ELSE
              Weight: 0,
              Height: 0,
              Waist: 0,
              HealthAnswers: "",
              BMI: 0,
              WaistHeightRatio: 0,
              HealthScore: 0,
              OnboardingCompleted: false,
              BodyFatPercentage: 0,
              BloodWork: "",
              IRSScore: 0,
              DefinitiveInsulinScore: "",
              Notifications: false,
            },
          }),
        },
      );

      // 1️⃣ Fetch all logs where UserId == user.id
      const response = await fetch(
        `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_AIRTABLE_LOGS}?filterByFormula={UserId}='${user.id}'`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
          },
        },
      );

      const data = await response.json();

      if (!data.records || data.records.length === 0) {
        console.log("No logs found for this user.");
      } else {
        // 2️⃣ Delete in batches of 10 (Airtable limit)
        const recordIds = data.records.map((record) => record.id);

        for (let i = 0; i < recordIds.length; i += 10) {
          const batch = recordIds.slice(i, i + 10);

          const deleteQuery = batch.map((id) => `records[]=${id}`).join("&");

          await fetch(
            `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_AIRTABLE_LOGS}?${deleteQuery}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
              },
            },
          );
        }
      }

      toast.success("All data deleted successfully");
      fetchProfile(user.id);
      const storedUser = JSON.parse(
        localStorage.getItem("userData") || "{}",
      );

      const updatedUser = {
        ...storedUser,
        onboardingCompleted: false,
        status: "paid",
      };

      localStorage.setItem("userData", JSON.stringify(updatedUser));
      navigate('/onboarding');
    } catch (err) {
      console.error(err);
      toast.error("Error deleting data");
    }
  };

  const scoreText = profile?.DefinitiveInsulinScore ?? "";

  let irsColor = "green";

  if (
    scoreText.includes("Very Severe") ||
    scoreText.includes("Very High Risk")
  ) {
    irsColor = "#dc2626"; // dark red
  } else if (scoreText.includes("Severe") || scoreText.includes("High Risk")) {
    irsColor = "#ef4444"; // red
  } else if (
    scoreText.includes("Moderate") ||
    scoreText.includes("Moderate Risk")
  ) {
    irsColor = "#f97316"; // orange
  } else if (scoreText.includes("Mild") || scoreText.includes("Mild Risk")) {
    irsColor = "#eab308"; // yellow
  } else if (scoreText.includes("Normal") || scoreText.includes("Low Risk")) {
    irsColor = "#16a34a"; // green
  }

  const handleBloodWorkChange = (field: string, value: string) => {
    setBloodWorkAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateIRSScore = () => {
    const v = (name: string) => parseFloat(bloodWorkAnswers[name] || "0");
    const sex = profile.Sex;

    let score = 0;

    // 🔹 Fasting Insulin
    const insulin = v("Fasting Insulin (μIU/mL)");
    if (insulin > 10) score += 3;
    else if (insulin >= 6) score += 2;
    else if (insulin >= 5) score += 1;

    // 🔹 HbA1c
    const hba1c = v("HbA1c (%)");
    if (hba1c > 6.4) score += 3;
    else if (hba1c > 5.7) score += 2;
    else if (hba1c > 5) score += 1;

    // =================================================
    // 🔥 SEX-SPECIFIC RULES
    // =================================================

    const uric = v("Uric Acid (mg/dL)");
    const hdl = v("HDL Cholesterol (mg/dL)");
    const bodyFat = parseFloat(profile?.BodyFatPercentage);

    if (sex === "Male") {
      // 🔹 Uric Acid — Male
      if (uric > 6) score += 3;
      else if (uric >= 4.5) score += 2;
      else score += 1;

      // 🔹 HDL — Male
      if (hdl < 30) score += 3;
      else if (hdl < 35) score += 2;
      else if (hdl < 40) score += 1;

      // 🔹 Body Fat % — Male
      if (bodyFat > 40) score += 3;
      else if (bodyFat > 30) score += 2;
      else if (bodyFat > 25) score += 1;
    } else {
      // 🔹 Uric Acid — Female
      if (uric > 5) score += 3;
      else if (uric >= 3.5) score += 2;
      else score += 1;

      // 🔹 HDL — Female
      if (hdl < 40) score += 3;
      else if (hdl < 45) score += 2;
      else if (hdl < 50) score += 1;

      // 🔹 Body Fat % — Female
      if (bodyFat > 40) score += 3;
      else if (bodyFat > 35) score += 2;
      else if (bodyFat > 30) score += 1;
    }

    // =================================================
    // 🔹 Remaining Common Metrics
    // =================================================

    const glucose = v("Fasting Glucose (mg/dL)");
    if (glucose > 100) score += 3;
    else if (glucose > 91) score += 2;
    else if (glucose > 85.9) score += 1;

    const triglycerides = v("Triglycerides (mg/dL)");
    if (triglycerides > 200) score += 3;
    else if (triglycerides > 150) score += 2;
    else if (triglycerides > 100) score += 1;

    const homa = v("HOMA-IR (calculated)");
    if (homa > 2.9) score += 3;
    else if (homa > 1.9) score += 2;
    else if (homa > 1.2) score += 1;

    const tgHdl = v("TG/HDL Ratio (calculated)");
    if (tgHdl > 3) score += 3;
    else if (tgHdl > 2) score += 2;
    else if (tgHdl > 1) score += 1;

    const tsh = v("TSH (mIU/L)");
    if (tsh > 4) score += 3;
    else if (tsh > 3) score += 2;
    else if (tsh > 2) score += 1;

    const ldlHdl = v("LDL/HDL Ratio (calculated)");
    if (ldlHdl > 4.5) score += 3;
    else if (ldlHdl > 4) score += 2;
    else if (ldlHdl > 3.5) score += 1;

    const cholHdl = v("Cholesterol/HDL Ratio (calculated)");
    if (cholHdl > 5) score += 3;
    else if (cholHdl > 4.5) score += 2;
    else if (cholHdl > 4) score += 1;

    const history = v("History Score (from questionnaire)");
    if (history > 30) score += 3;
    else if (history >= 15) score += 2;
    else score += 1;

    const age = v("Age (years)");
    if (age > 60) score += 3;
    else if (age >= 41) score += 2;
    else if (age >= 18) score += 1;

    const whr = parseFloat(profile.WaistHeightRatio);
    if (whr > 0.55) score += 3;
    else if (whr >= 0.53) score += 2;
    else if (whr >= 0.5) score += 1;

    const bmi = parseFloat(profile.BMI);
    if (bmi > 35) score += 3;
    else if (bmi >= 30) score += 2;
    else if (bmi >= 25) score += 1;

    // =================================================
    // 🔴 FAMILY HISTORY ADJUSTMENT (+1 EACH IF SELECTED)
    // =================================================

    const familyDM = v("Family History of Diabetes");
    const highBP = v("History of High Blood Pressure");

    // If any option selected (value = 1)
    if (familyDM >= 1) score += 1;

    if (highBP >= 1) score += 1;

    return Math.max(score, 0);
  };

  console.log(calculateIRSScore());

  useEffect(() => {
    const insulin = parseFloat(
      bloodWorkAnswers["Fasting Insulin (μIU/mL)"] || "0",
    );
    const glucose = parseFloat(
      bloodWorkAnswers["Fasting Glucose (mg/dL)"] || "0",
    );
    const triglycerides = parseFloat(
      bloodWorkAnswers["Triglycerides (mg/dL)"] || "0",
    );
    const ldl = parseFloat(bloodWorkAnswers["LDL Cholesterol (mg/dL)"] || "0");
    const hdl = parseFloat(bloodWorkAnswers["HDL Cholesterol (mg/dL)"] || "0");
    const tchol = parseFloat(
      bloodWorkAnswers["Total Cholesterol (mg/dL)"] || "0",
    );

    const homa = insulin && glucose ? (glucose * insulin) / 405 : 0;
    const tgHdl = triglycerides && hdl ? triglycerides / hdl : 0;
    const cholHdl = tchol && hdl ? tchol / hdl : 0;
    const ldlHdlRatio = ldl && hdl ? ldl / hdl : 0;

    setBloodWorkAnswers((prev: any) => ({
      ...prev,

      // 🔹 AUTO CALCULATED
      "HOMA-IR (calculated)": homa ? homa.toFixed(2) : "",
      "TG/HDL Ratio (calculated)": tgHdl ? tgHdl.toFixed(2) : "",
      "LDL/HDL Ratio (calculated)": ldlHdlRatio ? ldlHdlRatio.toFixed(2) : "",
      "Cholesterol/HDL Ratio (calculated)": cholHdl ? cholHdl.toFixed(2) : "",
    }));
  }, [
    bloodWorkAnswers["Fasting Insulin (μIU/mL)"],
    bloodWorkAnswers["Fasting Glucose (mg/dL)"],
    bloodWorkAnswers["HDL Cholesterol (mg/dL)"],
    bloodWorkAnswers["LDL Cholesterol (mg/dL)"],
    bloodWorkAnswers["Total Cholesterol (mg/dL)"],
  ]);

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>Profile</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="profile-card">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {/* Avatar from Airtable if available */}
            {profile?.Avatar ? (
              <img src={profile.Avatar[0].url} alt="avatar" />
            ) : (
              user?.name?.charAt(0) || "U"
            )}

            <button className="avatar-edit">
              <Camera size={16} />
            </button>
          </div>

          <div className="profile-info">
            <h2>{user?.name || "User"}</h2>
            <p>{user?.email || "user@example.com"}</p>
          </div>
        </div>

        {/* Replace static stats if Airtable has values */}
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="stat-number">
              {profile?.WaistHeightRatio ?? 0}
            </span>
            <span className="stat-text">Waist/Height Ratio</span>
          </div>

          <div className="profile-stat">
            <span className="stat-number">{profile?.BMI ?? 0}</span>
            <span className="stat-text">BMI</span>
          </div>

          <div className="profile-stat">
            <span className="stat-number">{profile?.IRSScore ?? "0"}</span>
            <span className="stat-text">{!isPremium ? "Quick IRS" : "Definitive IRS"} Score</span>
          </div>
          <div className="profile-stat">
            <span className="stat-number">{profile?.HealthScore ?? "0"}</span>
            <span className="stat-text">Health Score</span>
          </div>
        </div>
      </div>
      <div className="metrics-card">
        <h3>{!isPremium ? "Quick IRS" : "Definitive IRS"} SCORE INTERPRETATION</h3>
        <p className="metrics-note">
          <span className="stat-text" style={{ color: irsColor }}>
            <b>{scoreText}</b>
          </span>
        </p>
      </div>
      <div className="metrics-card">
        <h3>Metrics</h3>
        <p className="metrics-note">Track weekly — Reminder every Monday</p>

        <div className="metrics-grid">
          <div className="metric-field">
            <label>Weight (lbs) </label>
            <input
              type="number"
              value={metrics.Weight}
              onChange={(e) =>
                setMetrics({ ...metrics, Weight: e.target.value })
              }
              disabled={!isPremium}
            />
          </div>

          <div className="metric-field">
            <label>Height (inches)</label>
            <input
              type="number"
              value={metrics.Height}
              onChange={(e) =>
                setMetrics({ ...metrics, Height: e.target.value })
              }
              disabled={!isPremium}
            />
          </div>

          <div className="metric-field">
            <label>
              Waist Circumference (inches - just below belly button)
            </label>
            <input
              type="number"
              value={metrics.Waist}
              onChange={(e) =>
                setMetrics({ ...metrics, Waist: e.target.value })
              }
              disabled={!isPremium}
            />
          </div>

          <div className="metric-field" style={{ display: "none" }}>
            <label>BMI</label>
            <input
              type="number"
              value={metrics.BMI}
              onChange={(e) => setMetrics({ ...metrics, BMI: e.target.value })}
              disabled={true}
            />
          </div>

          <div className="metric-field" style={{ display: "none" }}>
            <label>Waist/Height Ratio</label>
            <input
              type="number"
              value={metrics.WaistHeightRatio}
              onChange={(e) =>
                setMetrics({
                  ...metrics,
                  WaistHeightRatio: e.target.value,
                })
              }
              disabled={true}
            />
          </div>
        </div>

        {isPremium ? (
          <Button onClick={saveMetrics} disabled={saving}>
            {saving ? "Saving..." : "Save Metrics"}
          </Button>
        ) : (
          <div className="premium-lock">
            Premium feature — upgrade to access &nbsp;&nbsp;
            <button
              className="upgrade-btn primary"
              onClick={() => navigate("/pricing")}
            >
              Upgrade Now 🚀
            </button>
          </div>
        )}
      </div>
      {isPremium && profile.BloodWork == "pending" && (
        <div className="metrics-card">
          <div className="step-content">
            <h2>Blood Work Results</h2>
            <p
              className={` ${!isPremium ? "premium-warning" : ""}`}
              style={{ fontSize: "12px" }}
            >
              {!isPremium
                ? "Blood work analysis is available for premium users only."
                : "Enter your latest lab values."}
            </p>
            {!isPremium && (
              <button
                className="upgrade-btn primary"
                onClick={() => navigate("/pricing")}
              >
                Upgrade Now 🚀
              </button>
            )}

            <div className="blood-grid">
              {BLOOD_WORK_FIELDS.map((field) => (
                <div key={field} className="blood-item">
                  <label>{field}</label>

                  {/* 🔵 FAMILY HX D.M. DROPDOWN */}
                  {field === "Family History of Diabetes" ? (
                    <select
                      value={bloodWorkAnswers[field] || "0"}
                      disabled={!isPremium}
                      onChange={(e) =>
                        handleBloodWorkChange(field, e.target.value)
                      }
                    >
                      <option value="0">No</option>
                      <option value="1">Obesity</option>
                      <option value="1">Pre-diabetic</option>
                      <option value="1">Diabetes</option>
                    </select>
                  ) : field === "History of High Blood Pressure" ? (
                    /* 🔴 HIGH BP DROPDOWN */
                    <select
                      value={bloodWorkAnswers[field] || "0"}
                      disabled={!isPremium}
                      onChange={(e) =>
                        handleBloodWorkChange(field, e.target.value)
                      }
                    >
                      <option value="0">No</option>
                      <option value="1">Mild</option>
                      <option value="1">Moderate</option>
                      <option value="1">Severe</option>
                    </select>
                  ) : (
                    /* 🟢 DEFAULT INPUT */
                    <input
                      type="text"
                      placeholder="Enter value"
                      value={bloodWorkAnswers[field] || ""}
                      disabled={
                        !isPremium ||
                        [
                          "HOMA-IR (calculated)",
                          "TG/HDL Ratio (calculated)",
                          "Cholesterol/HDL Ratio (calculated)",
                          "History Score (from questionnaire)",
                          "Waist/Height Ratio",
                          "Relative Fat Mass (%)",
                          "BMI",
                          "Age (years)",
                          "LDL/HDL Ratio (calculated)",
                        ].includes(field)
                      }
                      onChange={(e) =>
                        handleBloodWorkChange(field, e.target.value)
                      }
                    />
                  )}
                </div>
              ))}
            </div>
            <br></br>
            <Button onClick={saveBloodWork} disabled={saving}>
              {saving ? "Saving..." : "Save Blood Work"}
            </Button>
            <hr></hr>
            <p
  style={{
    fontSize: "13px",
    color: "#d32f2f",
    fontWeight: 600,
    marginTop: "10px",
    lineHeight: "1.5",
  }}
>
  Note: Your Definitive IRS is not complete until blood work is submitted. The score currently shown is your Quick IRS estimate only. Blood work can only be completed once, so please review all values carefully before saving.
</p>
          </div>
        </div>
      )}
      <br></br>

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
      {/* ================= ACCOUNT SETTINGS ================= */}
      <div className="settings-card">
        <h3>Account</h3>

        {/* Notifications */}
        <div className="settings-item">
          <div className="settings-left">
            <Bell size={20} />
            <span>Turn on notifications</span>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={notifications}
              onChange={toggleNotifications}
              // disabled={!isPremium}
            />
            <span className="n-slider"></span>
          </label>
        </div>

        {/* Help & Support */}
        <Link to="/help" className="settings-item link">
          <div className="settings-left">
            <HelpCircle size={20} />
            <span>Help & Support</span>
          </div>
          <ChevronRight size={18} />
        </Link>

        {/* Terms & Privacy */}
        <Link to="/terms" className="settings-item link">
          <div className="settings-left">
            <Shield size={20} />
            <span>Terms & Privacy</span>
          </div>
          <ChevronRight size={18} />
        </Link>
        {/* Terms & Privacy */}
        <Link to="/pricing" className="settings-item link">
          <div className="settings-left">
            <Crown size={20} />
            <span>Pricing</span>
          </div>
          <ChevronRight size={18} />
        </Link>

        {/* Delete Data */}
        <div
          className={`settings-item delete ${!isPremium ? "disabled" : ""}`}
          onClick={isPremium ? deleteAllData : undefined}
        >
          <div className="settings-left">
            <Trash2 size={20} />
            <span>Delete all data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
