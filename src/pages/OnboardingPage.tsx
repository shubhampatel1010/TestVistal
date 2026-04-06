import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Shield,
  User,
  Ruler,
  ClipboardList,
  BarChart3,
  Phone,
} from "lucide-react";
import Button from "../components/Button";
import "./OnboardingPage.css";
import { ca } from "date-fns/locale";
import toast from "react-hot-toast";

interface BasicInfo {
  phone: string;
  name: string;
  email: string;
  dateOfBirth: string;
  sex: string;
}

interface Measurements {
  weight: string;
  height: string;
  waist: string;
}

type HealthAnswers = Record<string, boolean>;

const INFLAMMATION_QUESTIONS = [
  "Have you or a family member had diabetes or prediabetes?",
  "Have you or a family member ever had high blood pressure?",
  "Are you overweight?",
  "Do you have a history of eczema, psoriasis, gastric reflux, inflammatory bowel disease, arthritis, or chronic pain?",
  "Do you engage in high-intensity exercise more than 5 days a week?",
  "Do you eat fried or fast food?",
  // "Have you experienced long periods of chronic stress?",
  "Do you spend less than 30 minutes outdoors every day?",
];

const NUTRITION_QUESTIONS = [
  "I drink juice or sodas at least once a week.",
  "I eat wheat (bread, cereals, pasta, pastries, etc.) at least 3 times per week.",
  "I eat tropical fruits like mangoes, bananas, and melons regularly.",
  "I consume processed foods (chips, cookies, candies, ice cream) at least 3 times per week.",
  "I often cook with canola, sunflower, corn, or cottonseed oil.",
  "Do you have a sweet tooth or crave sugar after a meal?",
  "Do you consume alcoholic beverages more than 3 times a week?",
  "Do you or any family members have a history of metabolic syndrome, diabetes, pre-diabetes, hypoglycemia, PCOS, or pancreatitis?",
];

const EXERCISE_SLEEP_QUESTIONS = [
  "I very rarely exercise.",
  "My exercise is very light due to injuries.",
  "I am short of breath with mild exercise.",
  "I sleep less than 7 hours a night and don't feel rested.",
  "I often snore.",
  "I have more than 3 hours of screen time after 5pm or have lights on when I sleep.",
  "I often travel across several time zones or work night shifts.",
  "I often need to use sleeping pills.",
];

const LIFESTYLE_RISK_QUESTIONS = [
  "Do you or a family member have diabetes or prediabetes?",
  "Are you overweight or have difficulty losing weight?",
  "Are you constantly tired, especially after meals?",
  "Do you crave sugar or carbs intensely?",
  "Do you have high blood pressure (or family history)?",
  "Do you eat processed foods, bread, or pasta 3+ times per week?",
  "Do you drink juice or soda at least once a week?",
  "Do you rarely exercise or are you short of breath with mild exercise?",
  "Do you sleep less than 7 hours or don't feel rested?",
  "Have you experienced long periods of chronic stress?",
];

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

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    name: "",
    email: "",
    dateOfBirth: "",
    sex: "",
    phone: "",
  });
  const [measurements, setMeasurements] = useState<Measurements>({
    weight: "",
    height: "",
    waist: "",
  });
  const [healthAnswers, setHealthAnswers] = useState<HealthAnswers>({});
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  type BloodWorkAnswers = Record<string, string>;

  const [bloodWorkAnswers, setBloodWorkAnswers] = useState<BloodWorkAnswers>(
    {},
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("userData");
        if (!storedUser) return;

        const parsedUser = JSON.parse(storedUser);
        const recordId = parsedUser.id;

        if (!recordId) return;
        setIsPageLoading(true);

        const res = await fetch(
          `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_AIRTABLE_USERS}?filterByFormula=${encodeURIComponent(
            `RECORD_ID()='${recordId}'`,
          )}&fields[]=Status&fields[]=Name&fields[]=Email&fields[]=DateOfBirth&fields[]=Sex&fields[]=Phone&fields[]=Weight&fields[]=Height&fields[]=Waist&fields[]=BloodWork&fields[]=OnboardingCompleted&fields[]=HealthAnswers`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
            },
          },
        );

        if (!res.ok) {
          console.error("Failed to fetch user");
          setIsPremium(false);
          setIsPageLoading(false);
          return;
        }

        const data = await res.json();

        if (data.records.length == 0) {
          localStorage.removeItem("userData");
          navigate("/");
        }

        const status = data?.records[0]?.fields?.Status || "";
        const BloodWork = data?.records[0]?.fields?.BloodWork || "";
        const OnboardingCompleted =
          data?.records[0]?.fields?.OnboardingCompleted ?? false;
        const savedHealthAnswers =
          data?.records[0]?.fields?.HealthAnswers || "{}";

        if (status.toLowerCase() === "paid") {
          if (
            BloodWork != "completed" &&
            BloodWork != "pending" &&
            OnboardingCompleted === false
          ) {
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
          setIsPageLoading(false); // ✅ page opens only after API finishes
        } else {
          setIsPremium(false);
          setIsPageLoading(false); // ✅ page opens only after API finishes
        }

        setBasicInfo((prev) => ({
          ...prev,
          name: data?.records[0]?.fields?.Name || "",
          email: data?.records[0]?.fields?.Email || "",
          dateOfBirth: data?.records[0]?.fields?.DateOfBirth || "",
          sex: data?.records[0]?.fields?.Sex || "",
          phone: data?.records[0]?.fields?.Phone || "",
        }));
        setMeasurements((prev) => ({
          ...prev,
          weight: data?.records[0]?.fields?.Weight || "",
          height: data?.records[0]?.fields?.Height || "",
          waist: data?.records[0]?.fields?.Waist || "",
        }));
        try {
          const parsedHealthAnswers = JSON.parse(savedHealthAnswers || "{}");
          setHealthAnswers(parsedHealthAnswers);
        } catch (err) {
          console.error("Failed to parse HealthAnswers:", err);
          setHealthAnswers({});
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setIsPremium(false);
        setIsPageLoading(false); // ✅ page opens only after API finishes
      }
    };

    fetchUser();
  }, []);

  const handleBloodWorkChange = (field: string, value: string) => {
    setBloodWorkAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const totalSteps = 6;

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // FINAL STEP — SAVE DATA
      try {
        setIsSaving(true);

        await saveOnboardingToAirtable();

        navigate("/dashboard");
      } catch (err) {
        console.error(err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return privacyAccepted;
      case 2:
        return (
          basicInfo.name &&
          basicInfo.email &&
          basicInfo.dateOfBirth &&
          basicInfo.sex &&
          basicInfo.phone
        );
      case 3:
        return measurements.weight && measurements.height && measurements.waist;
      case 4:
        return Object.keys(healthAnswers).length > 0;
      case 5:
        return Object.keys(bloodWorkAnswers).length > 0;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const calculateBMI = () => {
    const weight = parseFloat(measurements.weight);
    const height = parseFloat(measurements.height);
    if (weight && height) {
      const bmi = (703 * weight) / (height * height);
      return bmi.toFixed(2);
    }
    return "--";
  };
  const bodyFatPercentage = () => {
    const weightCircumference = parseFloat(measurements.waist);
    const height = parseFloat(measurements.height);
    const sex = basicInfo.sex;

    if (weightCircumference && height && sex) {
      if (sex === "Male") {
        return (64 - 20 * (height / weightCircumference)).toFixed(2);
      } else {
        return (76 - 20 * (height / weightCircumference)).toFixed(2);
      }
    }
    return "--";
  };
  const waistHeightRatio = () => {
    const weightCircumference = parseFloat(measurements.waist);
    const height = parseFloat(measurements.height);

    if (weightCircumference && height) {
      return (weightCircumference / height).toFixed(2);
    }
    return "--";
  };

  const CHRONIC_STRESS_QUESTION =
    "Have you experienced long periods of chronic stress?";

  const calculateHealthScore = () => {
    let premiumTrueCount = 0;

    // count only chronic stress from lifestyle section
    if (healthAnswers[CHRONIC_STRESS_QUESTION] === true) {
      premiumTrueCount += 1;
    }

    // count premium-only sections normally
    premiumTrueCount += INFLAMMATION_QUESTIONS.filter(
      (q) => healthAnswers[q] === true,
    ).length;

    premiumTrueCount += NUTRITION_QUESTIONS.filter(
      (q) => healthAnswers[q] === true,
    ).length;

    premiumTrueCount += EXERCISE_SLEEP_QUESTIONS.filter(
      (q) => healthAnswers[q] === true,
    ).length;

    return (premiumTrueCount * 2.67).toFixed(0);
  };

  const calculateFreeUserHealthScore = () => {
    return (
      Object.values(healthAnswers).filter((v) => v === true).length * 2
    ).toFixed(0);
  };

  const calculateIRSScore = () => {
    const v = (name: string) => parseFloat(bloodWorkAnswers[name] || "0");
    const sex = basicInfo.sex;

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
    const bodyFat = parseFloat(bodyFatPercentage());

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

    const whr = parseFloat(waistHeightRatio());
    if (whr > 0.55) score += 3;
    else if (whr >= 0.53) score += 2;
    else if (whr >= 0.5) score += 1;

    const bmi = parseFloat(calculateBMI());
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

  const calculateIRSFreeuserScore = () => {
    const v = (name: string) => parseFloat(bloodWorkAnswers[name] || "0");

    let score = 0;

    // Health questionnaire score
    const history =
      Object.values(healthAnswers).filter((v) => v === true).length * 2;

    score += history; // ✅ add history score

    const age = v("Age (years)");
    if (age > 60) score += 3;
    else if (age >= 41) score += 2;
    else if (age >= 18) score += 1;

    const whr = parseFloat(waistHeightRatio());
    if (whr > 0.55) score += 3;
    else if (whr >= 0.53) score += 2;
    else if (whr >= 0.5) score += 1;

    const bmi = parseFloat(calculateBMI());
    if (bmi > 35) score += 3;
    else if (bmi >= 30) score += 2;
    else if (bmi >= 25) score += 1;

    return Math.max(score, 0);
  };

  const stepIcons = [
    Shield,
    User,
    Ruler,
    ClipboardList,
    ClipboardList,
    BarChart3,
  ];
  const stepLabels = [
    "Privacy",
    "Basic Info",
    "Measurements",
    "Health Assessment",
    "Blood Work",
    "Summary",
  ];
  const isBloodWorkComplete = BLOOD_WORK_FIELDS.every((field) => {
    const value = bloodWorkAnswers[field];
    return value !== undefined && value !== null && String(value).trim() !== "";
  });

  const saveOnboardingToAirtable = async () => {
    try {
      const userData = localStorage.getItem("userData");
      if (!userData) {
        toast.error("User not logged in");
        return;
      }

      const user = JSON.parse(userData);

      const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
      const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
      const TABLE = import.meta.env.VITE_AIRTABLE_USERS;

      const bmi = calculateBMI();
      const healthScore = calculateHealthScore();
      const healthFreeuserScore = calculateFreeUserHealthScore();
      const bodyFat = bodyFatPercentage();
      const waistHeight = waistHeightRatio();
      const irsScore = calculateIRSScore();
      const irsScoreFreeUser = calculateIRSFreeuserScore();
      const isBloodWorkComplete =
        isPremium &&
        BLOOD_WORK_FIELDS.every((field) => {
          const value = bloodWorkAnswers[field];
          return (
            value !== undefined && value !== null && String(value).trim() !== ""
          );
        });

      const response = await fetch(
        `https://api.airtable.com/v0/${BASE_ID}/${TABLE}/${user.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: {
              Name: basicInfo.name,
              Email: basicInfo.email,
              Phone: basicInfo.phone,
              DateOfBirth:
                basicInfo.dateOfBirth || new Date().toISOString().split("T")[0],
              Sex: basicInfo.sex,
              Weight: parseInt(measurements.weight) || 0,
              Height: parseInt(measurements.height) || 0,
              Waist: parseInt(measurements.waist) || 0,
              HealthAnswers: JSON.stringify(healthAnswers),
              // BloodWork: JSON.stringify(bloodWorkAnswers), // ⭐ ADD THIS
              BloodWork: isBloodWorkComplete ? "completed" : "pending", // ⭐ ADD THIS
              BMI: parseInt(bmi) || 0,
              HealthScore: isPremium
                ? parseInt(healthScore) || 0
                : parseInt(healthFreeuserScore) || 0,
              OnboardingCompleted: true,
              BodyFatPercentage: parseFloat(bodyFat) || 0,
              WaistHeightRatio: parseFloat(waistHeight) || 0,
              IRSScore: isPremium ? irsScore : irsScoreFreeUser,
              DefinitiveInsulinScore: !isPremium
                ? irsScoreFreeUser >= 30
                  ? "Very severe - You have very severe insulin resistance and diabetes. This increases your risk of heart disease, cancer, neurodegenerative and other chronic disease. You must immediately halt and reverse this disease and you would most likely benefit by adding a GLP to your program. Studies show that reversing diabetes and normalizing your sugar and insulin will halt and reduce your risk of all chronic disease. Keeping your insulin resistance normal willc ontinue to protect you from chronic disease in the decades ahead increasing both your healthspan and lifespan."
                  : irsScoreFreeUser >= 23
                    ? "Severe - You have severe insulin resistance and diabetes. This increases your risk of heart disease, cancer, neurodegenerative and other chronic disease. You must immediately halt and reverse this disease and you would most likely benefit by adding a GLP to your program. Studies show that reversing diabetes and normalizing your sugar and insulin will halt and reduce your risk of all chronic disease. Keeping your insulin resistance normal will continue to protect you from chronic disease in the decades ahead increasing both your healthspan and lifespan."
                    : irsScoreFreeUser >= 16
                      ? "Moderate - You have moderate insulin resistance and prediabetes. This increases your risk of heart disease, cancer and neurodegenerative and other chronic diseases.disease. Studies show that reversing prediabetes and normalizing your sugar and insulin will halt and reduce your risk of all chronic disease. Keeping your insulin resistance normal will continue to protect you from chronic disease in the decades ahead increasing both your healthspan and lifespan."
                      : irsScoreFreeUser >= 9
                        ? "Mild - You have mild insulin resistance. This should be able to be reversed with more attention to the green sheets and other lifestyle factors like good sleep and exercise etc to correct this. Please review the Resource Section."
                        : "Normal - Excellent results look like you are insulin sensitive with good metabolic flexibility. Keep up your great nutrition."
                : irsScore > 50
                  ? "Very Severe - You have very severe insulin resistance and diabetes. This increases your risk of heart disease, cancer, neurodegenerative and other chronic disease. You must immediately halt and reverse this disease and you would most likely benefit by adding a GLP to your program. Studies show that reversing diabetes and normalizing your sugar and insulin will halt and reduce your risk of all chronic disease. Keeping your insulin resistance normal will continue to protect you from chronic disease in the decades ahead increasing both your healthspan and lifespan."
                  : irsScore >= 36
                    ? "Severe - You have severe insulin resistance and diabetes. This increases your risk of heart disease, cancer, neurodegenerative and other chronic disease. You must immediately halt and reverse this disease and you would most likely benefit by adding a GLP to your program. Studies show that reversing diabetes and normalizing your sugar and insulin will halt and reduce your risk of all chronic disease. Keeping your insulin resistance normal will continue to protect you from chronic disease in the decades ahead increasing both your healthspan and lifespan."
                    : irsScore >= 25
                      ? "Moderate - You have moderate insulin resistance and prediabetes. This increases your risk of heart disease, cancer and neurodegenerative and other chronic diseases.disease. Studies show that reversing prediabetes and normalizing your sugar and insulin will halt and reduce your risk of all chronic disease. Keeping your insulin resistance normal will continue to protect you from chronic disease in the decades ahead increasing both your healthspan and lifespan."
                      : irsScore >= 13
                        ? "Mild - You have mild insulin resistance. This should be able to be reversed with more attention to the green sheets and other lifestyle factors like good sleep and exercise etc to correct this. Please review the Resource Section."
                        : "Normal - Excellent results look like you are insulin sensitive with good metabolic flexibility. Keep up your great nutrition.",
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Update failed");
      }
      // ✅ UPDATE LOCAL STORAGE ALSO
      const updatedUser = {
        ...user,
        onboardingCompleted: true,
      };

      localStorage.setItem("userData", JSON.stringify(updatedUser));
      toast.success("Onboarding saved successfully 🎉");

      console.log("Onboarding saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save onboarding data");
    }
  };
  const handleAnswer = (q: string, value: boolean, locked: boolean) => {
    if (locked) {
      setShowUpgradePopup(true);
      return;
    }
    setHealthAnswers((prev) => ({ ...prev, [q]: value }));
  };

  const renderSection = (
    title: string,
    questions: string[],
    locked: boolean,
  ) => (
    <div className={`questions-section ${locked ? "locked" : ""}`}>
      <h3>{title}</h3>

      {questions.map((q) => (
        <div key={q} className="question-item">
          <span>{q}</span>

          <div className="yes-no-buttons">
            <button
              className={`yn-btn ${healthAnswers[q] === true ? "active yes" : ""}`}
              onClick={() => handleAnswer(q, true, locked)}
            >
              Yes
            </button>

            <button
              className={`yn-btn ${healthAnswers[q] === false ? "active no" : ""}`}
              onClick={() => handleAnswer(q, false, locked)}
            >
              No
            </button>
          </div>
        </div>
      ))}
    </div>
  );
  const calculateAge = () => {
    if (!basicInfo.dateOfBirth) return 0;

    const today = new Date();
    const birthDate = new Date(basicInfo.dateOfBirth);

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
  // ✅ ADD THIS useEffect INSIDE YOUR COMPONENT
  // (Place BELOW all calculation functions and ABOVE return)

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

    setBloodWorkAnswers((prev) => ({
      ...prev,

      // 🔹 AUTO CALCULATED
      "HOMA-IR (calculated)": homa ? homa.toFixed(2) : "",
      "TG/HDL Ratio (calculated)": tgHdl ? tgHdl.toFixed(2) : "",
      "LDL/HDL Ratio (calculated)": ldlHdlRatio ? ldlHdlRatio.toFixed(2) : "",
      "Cholesterol/HDL Ratio (calculated)": cholHdl ? cholHdl.toFixed(2) : "",
      "History Score (from questionnaire)": isPremium
        ? calculateHealthScore().toString()
        : calculateFreeUserHealthScore().toString(),
      "Waist/Height Ratio": waistHeightRatio(),
      "Relative Fat Mass (%)": bodyFatPercentage(),
      "Age (years)": calculateAge().toString(),
      BMI: calculateBMI(),
    }));
  }, [
    bloodWorkAnswers["Fasting Insulin (μIU/mL)"],
    bloodWorkAnswers["Fasting Glucose (mg/dL)"],
    bloodWorkAnswers["HDL Cholesterol (mg/dL)"],
    bloodWorkAnswers["LDL Cholesterol (mg/dL)"],
    bloodWorkAnswers["Total Cholesterol (mg/dL)"],
    measurements,
    healthAnswers,
  ]);

  return (
    <>
      {isPageLoading ? (
        <div className="loading-state">
          <p>Loading onboarding...</p>
        </div>
      ) : (
        <>
          <div className="onboarding">
            <div className="onboarding-container">
              <div className="onboarding-progress">
                {stepLabels.map((label, index) => {
                  const Icon = stepIcons[index];
                  const stepNum = index + 1;
                  const isActive = step === stepNum;
                  const isCompleted = step > stepNum;
                  return (
                    <div
                      key={label}
                      className={`progress-step ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
                    >
                      <div className="step-icon">
                        {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                      </div>
                      <span className="step-label">{label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="onboarding-content">
                {step === 1 && (
                  <div className="step-content">
                    <h2>Privacy Agreement</h2>
                    <p className="step-description">
                      Please review and accept our privacy policy to continue.
                    </p>

                    <div className="privacy-box">
                      <h3>Your Privacy Matters</h3>
                      <p>
                        We collect health information to personalize your
                        experience and help you achieve your metabolic health
                        goals. Your data is encrypted and never shared with
                        third parties without your consent.
                      </p>
                      <ul>
                        <li>Your health data is stored securely</li>
                        <li>You can delete your data at any time</li>
                        <li>We never sell your personal information</li>
                        <li>You control what information you share</li>
                      </ul>
                    </div>

                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={privacyAccepted}
                        onChange={(e) => setPrivacyAccepted(e.target.checked)}
                      />
                      <span>
                        I accept the privacy policy and{" "}
                        <a href="/terms">terms of service</a>
                      </span>
                    </label>
                  </div>
                )}

                {step === 2 && (
                  <div className="step-content">
                    <h2>Basic Information</h2>
                    <p className="step-description">
                      Tell us a bit about yourself.
                    </p>

                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={basicInfo.name}
                        required
                        disabled
                        onChange={(e) =>
                          setBasicInfo({ ...basicInfo, name: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={basicInfo.email}
                        required
                        disabled
                        onChange={(e) =>
                          setBasicInfo({ ...basicInfo, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="number"
                        placeholder="Enter mobile number (e.g. +91 9876543210)"
                        value={basicInfo.phone}
                        required
                        onChange={(e) =>
                          setBasicInfo({ ...basicInfo, phone: e.target.value })
                        }
                      />
                      <small
                        className="form-note"
                        style={{ color: "darkgreen" }}
                      >
                        Please include your country code without the + sign
                        (e.g. 91 for India, 1 for USA).
                      </small>
                    </div>

                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        value={basicInfo.dateOfBirth}
                        required
                        onChange={(e) =>
                          setBasicInfo({
                            ...basicInfo,
                            dateOfBirth: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Sex</label>
                      <div className="radio-group">
                        {["Male", "Female", "Other"].map((option) => (
                          <label key={option} className="radio-label">
                            <input
                              type="radio"
                              name="sex"
                              value={option}
                              required
                              checked={basicInfo.sex === option}
                              onChange={(e) =>
                                setBasicInfo({
                                  ...basicInfo,
                                  sex: e.target.value,
                                })
                              }
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="step-content">
                    <h2>Your Measurements</h2>
                    <p className="step-description">
                      We need some measurements to calculate your health
                      metrics.
                    </p>

                    <div className="form-group">
                      <label>Weight (lbs) *</label>
                      <input
                        type="number"
                        placeholder="Enter weight in pounds"
                        value={measurements.weight}
                        onChange={(e) =>
                          setMeasurements({
                            ...measurements,
                            weight: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Height (inches) *</label>
                      <input
                        type="number"
                        placeholder="Enter height in inches"
                        value={measurements.height}
                        onChange={(e) =>
                          setMeasurements({
                            ...measurements,
                            height: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Waist Circumference (inches - just below belly button)*
                      </label>
                      <input
                        type="number"
                        placeholder="Enter waist measurement"
                        value={measurements.waist}
                        onChange={(e) =>
                          setMeasurements({
                            ...measurements,
                            waist: e.target.value,
                          })
                        }
                      />
                    </div>

                    <p className="required-note">* Required fields</p>
                  </div>
                )}

                {/* STEP 4 — HEALTH */}
                {step === 4 && (
                  <div className="step-content">
                    <h2>Self-Health Assessment</h2>

                    {/* FREE ACCESS */}
                    {renderSection(
                      "Lifestyle Risk Factors",
                      LIFESTYLE_RISK_QUESTIONS,
                      false,
                    )}
                    {renderSection(
                      "Inflammation",
                      INFLAMMATION_QUESTIONS,
                      !isPremium,
                    )}
                    {renderSection(
                      "Nutrition",
                      NUTRITION_QUESTIONS,
                      !isPremium,
                    )}
                    {renderSection(
                      "Exercise & Sleep",
                      EXERCISE_SLEEP_QUESTIONS,
                      !isPremium,
                    )}
                  </div>
                )}

                {step === 5 && (
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
                              value={bloodWorkAnswers[field] || ""}
                              disabled={!isPremium}
                              onChange={(e) =>
                                handleBloodWorkChange(field, e.target.value)
                              }
                            >
                              <option value="0">Select</option>
                              <option value="1">Obesity</option>
                              <option value="1">Pre-diabetic</option>
                              <option value="1">Diabetes</option>
                            </select>
                          ) : field === "History of High Blood Pressure" ? (
                            /* 🔴 HIGH BP DROPDOWN */
                            <select
                              value={bloodWorkAnswers[field] || ""}
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
                    <small className="form-note" style={{ color: "brown" }}>
                      Note : If your blood work is not available right now, you
                      can skip this step and continue. Later, once your report
                      is available, go to your Profile and update your blood
                      work. Note: blood work can only be submitted once.
                    </small>
                  </div>
                )}

                {step === 6 && (
                  <div className="step-content">
                    <h2>Your Health Summary</h2>
                    <p className="step-description">
                      Based on your answers, here's your starting point.
                    </p>

                    <div className="summary-cards">
                      <div className="summary-card">
                        <div className="summary-icon bmi">
                          <Ruler size={24} />
                        </div>
                        <div className="summary-value">{calculateBMI()}</div>
                        <div className="summary-label">BMI</div>
                      </div>

                      <div className="summary-card">
                        <div className="summary-icon score">
                          <BarChart3 size={24} />
                        </div>
                        <div className="summary-value">
                          {isPremium
                            ? calculateHealthScore()
                            : calculateFreeUserHealthScore()}
                        </div>
                        <div className="summary-label">
                          Weighted History Score (for IRS calculation):
                        </div>
                      </div>
                      {/* {isPremium && (
                  <>
                    <div className="summary-card">
                      <div className="summary-icon score">
                        <BarChart3 size={24} />
                      </div>
                      <div className="summary-value">{bodyFatPercentage()}</div>
                      <div className="summary-label">
                        Relative Fat Mass or Percent Body Fat %
                      </div>
                    </div>
                  </>
                )} */}
                      <div className="summary-card">
                        <div className="summary-icon score">
                          <BarChart3 size={24} />
                        </div>
                        <div className="summary-value">
                          {waistHeightRatio()}
                        </div>
                        <div className="summary-label">
                          Waist / Height Ratio
                        </div>
                      </div>
                      <div className="summary-card">
                        <div className="summary-icon score">
                          <BarChart3 size={24} />
                        </div>
                        <div className="summary-value">
                          {isPremium
                            ? calculateIRSScore()
                            : calculateIRSFreeuserScore()}
                        </div>
                        <div className="summary-label">
                          {!isPremium ? "Quick IRS" : "Definitive IRS"} Score
                        </div>
                      </div>
                    </div>
                    {isPremium && !isBloodWorkComplete && (
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#d32f2f",
                          fontWeight: 600,
                          marginTop: "10px",
                          lineHeight: "1.5",
                        }}
                      >
                        Note: Your Definitive IRS value is not complete without
                        blood work. The score shown right now is your Quick IRS
                        estimate only.
                      </p>
                    )}
                    <div className="metrics-card">
                      <h3>
                        {!isPremium ? "Quick IRS" : "Definitive IRS"} SCORE
                        INTERPRETATION
                      </h3>
                      <p className="metrics-note">
                        <span
                          className="stat-text"
                          style={{
                            color: !isPremium
                              ? calculateIRSFreeuserScore() >= 30
                                ? "#d32f2f" // Very High Risk - Red
                                : calculateIRSFreeuserScore() >= 23
                                  ? "#f57c00" // High Risk - Orange
                                  : calculateIRSFreeuserScore() >= 16
                                    ? "#f9a825" // Moderate Risk - Amber
                                    : calculateIRSFreeuserScore() >= 9
                                      ? "#2e7d32" // Mild Risk - Green
                                      : "#1b5e20" // Low Risk - Dark Green
                              : calculateIRSScore() > 50
                                ? "#d32f2f" // Very Severe
                                : calculateIRSScore() >= 36
                                  ? "#f57c00" // Severe
                                  : calculateIRSScore() >= 25
                                    ? "#f9a825" // Moderate
                                    : calculateIRSScore() >= 13
                                      ? "#2e7d32" // Mild
                                      : "#1b5e20", // Normal
                          }}
                        >
                          <b>
                            {!isPremium
                              ? calculateIRSFreeuserScore() >= 30
                                ? "Very severe - You have very severe insulin resistance and diabetes. This increases your risk of heart disease, cancer, neurodegenerative and other chronic disease. You must immediately halt and reverse this disease and you would most likely benefit by adding a GLP to your program. Studies show that reversing diabetes and normalizing your sugar and insulin will halt and reduce your risk of all chronic disease. Keeping your insulin resistance normal willc ontinue to protect you from chronic disease in the decades ahead increasing both your healthspan and lifespan."
                                : calculateIRSFreeuserScore() >= 23
                                  ? "Severe - You have severe insulin resistance and diabetes. This increases your risk of heart disease, cancer, neurodegenerative and other chronic disease. You must immediately halt and reverse this disease and you would most likely benefit by adding a GLP to your program. Studies show that reversing diabetes and normalizing your sugar and insulin will halt and reduce your risk of all chronic disease. Keeping your insulin resistance normal will continue to protect you from chronic disease in the decades ahead increasing both your healthspan and lifespan."
                                  : calculateIRSFreeuserScore() >= 16
                                    ? "Moderate - You have moderate insulin resistance and prediabetes. This increases your risk of heart disease, cancer and neurodegenerative and other chronic diseases.disease. Studies show that reversing prediabetes and normalizing your sugar and insulin will halt and reduce your risk of all chronic disease. Keeping your insulin resistance normal will continue to protect you from chronic disease in the decades ahead increasing both your healthspan and lifespan."
                                    : calculateIRSFreeuserScore() >= 9
                                      ? "Mild - You have mild insulin resistance. This should be able to be reversed with more attention to the green sheets and other lifestyle factors like good sleep and exercise etc to correct this. Please review the Resource Section."
                                      : "Normal - Excellent results look like you are insulin sensitive with good metabolic flexibility. Keep up your great nutrition."
                              : calculateIRSScore() > 50
                                ? "Very Severe - You have very severe insulin resistance and diabetes. This increases your risk of heart disease, cancer, neurodegenerative and other chronic disease. You must immediately halt and reverse this disease and you would most likely benefit by adding a GLP to your program. Studies show that reversing diabetes and normalizing your sugar and insulin will halt and reduce your risk of all chronic disease. Keeping your insulin resistance normal will continue to protect you from chronic disease in the decades ahead increasing both your healthspan and lifespan."
                                : calculateIRSScore() >= 36
                                  ? "Severe - You have severe insulin resistance and diabetes. This increases your risk of heart disease, cancer, neurodegenerative and other chronic disease. You must immediately halt and reverse this disease and you would most likely benefit by adding a GLP to your program. Studies show that reversing diabetes and normalizing your sugar and insulin will halt and reduce your risk of all chronic disease. Keeping your insulin resistance normal will continue to protect you from chronic disease in the decades ahead increasing both your healthspan and lifespan."
                                  : calculateIRSScore() >= 25
                                    ? "Moderate - You have moderate insulin resistance and prediabetes. This increases your risk of heart disease, cancer and neurodegenerative and other chronic diseases.disease. Studies show that reversing prediabetes and normalizing your sugar and insulin will halt and reduce your risk of all chronic disease. Keeping your insulin resistance normal will continue to protect you from chronic disease in the decades ahead increasing both your healthspan and lifespan."
                                    : calculateIRSScore() >= 13
                                      ? "Mild - You have mild insulin resistance. This should be able to be reversed with more attention to the green sheets and other lifestyle factors like good sleep and exercise etc to correct this. Please review the Resource Section."
                                      : "Normal - Excellent results look like you are insulin sensitive with good metabolic flexibility. Keep up your great nutrition."}
                          </b>
                        </span>
                      </p>
                    </div>
                    <br></br>

                    {!isPremium && (
                      <>
                        <p style={{ fontSize: "12px" }}>
                          <ul>
                            <li style={{ color: "red" }}>
                              ✓ This Quick IRS Score is a preliminary assessment
                              only{" "}
                            </li>
                            <li style={{ color: "red" }}>
                              ✓ For a complete diagnosis, get the Definitive IRS
                              Score (includes full bloodwork)
                            </li>
                            <li style={{ color: "red" }}>
                              ✓ Recommended lab tests: Fasting Insulin, Fasting
                              Glucose, HbA1c, Lipid Panel{" "}
                            </li>
                            <li style={{ color: "red" }}>
                              ✓ Join VitalState for personalized protocols to
                              reverse insulin resistance
                            </li>
                          </ul>
                        </p>
                      </>
                    )}

                    <div className="summary-message">
                      <h3>You're ready to start!</h3>
                      <p>
                        Your personalized 4-week program is ready. Focus on
                        green foods, track your meals, and watch your health
                        improve day by day.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="onboarding-actions">
                {step > 1 && (
                  <Button variant="outline" onClick={handleBack}>
                    <ChevronLeft size={18} />
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={!canProceed() || isSaving}
                >
                  {isSaving
                    ? "Saving..."
                    : step === totalSteps
                      ? "Get Started"
                      : step === 5
                        ? "Skip & Continue"
                        : "Continue"}

                  {!isSaving && step < totalSteps && <ChevronRight size={18} />}
                </Button>
              </div>

              {/* 🔥 PREMIUM UPGRADE MODAL */}
              {showUpgradePopup && (
                <div className="upgrade-modal-overlay">
                  <div className="upgrade-modal">
                    {/* Close button */}
                    <button
                      className="upgrade-close"
                      onClick={() => setShowUpgradePopup(false)}
                    >
                      ✕
                    </button>

                    {/* Icon */}
                    <div className="upgrade-icon">🔒</div>

                    {/* Title */}
                    <h2 className="upgrade-title">Unlock Full Assessment</h2>

                    {/* Message */}
                    <p className="upgrade-text">
                      You’re currently on the <strong>Free Plan</strong>.
                      Upgrade to access all health insights, detailed scoring,
                      and personalized recommendations.
                    </p>

                    {/* Features preview */}
                    <ul className="upgrade-features">
                      <li>✔ Complete health evaluation</li>
                      <li>✔ Advanced risk scoring</li>
                      <li>✔ Unlimited assessments</li>
                    </ul>

                    {/* Actions */}
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
          </div>
        </>
      )}
    </>
  );
}
