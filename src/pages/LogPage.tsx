import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Clock,
  Moon,
  Activity,
  Zap,
  Smile,
  Heart,
  Droplets,
  Pill,
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import Button from "../components/Button";
import "./LogPage.css";
import toast from "react-hot-toast";
import {
  greenFoodCategories,
  orangeFoodCategories,
  redFoodCategories,
  greenFoods,
  orangeFoods,
  redFoods,
} from "../Data/foodData";
import { useNavigate } from "react-router-dom";

type MealColor = "green" | "yellow" | "red";
type MealTime = "breakfast" | "lunch" | "dinner" | "snack";

interface Meal {
  id: string;
  mealTime: MealTime;
  color: MealColor;
  category: string;
  foodId: string;
  foodName: string;
  note?: string;
}

interface DailyLog {
  fasting?: number;
  sleep?: number;
  activity?: number;
  energy: number;
  mood: number;
  relational: number;
  waterIntake: number;
  supplements: string[];
}

const mealTimes: MealTime[] = ["breakfast", "lunch", "dinner", "snack"];

const colorLabels: Record<MealColor, { label: string; description: string }> = {
  green: { label: "Green", description: "Enjoy freely" },
  yellow: { label: "Orange", description: "Moderate portions" },
  red: { label: "Red", description: "Limit or avoid" },
};

const supplements = [
  "Magnesium",
  "Vit D3 & K2",
  "Telovite (Multi-vitamin)",
  "Metabolic Support ( Berberine)",
];

export default function LogPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState<Meal[]>([]);
  const [dailyLog, setDailyLog] = useState<DailyLog>({
    energy: 5,
    mood: 5,
    relational: 5,
    waterIntake: 0,
    supplements: [],
  });
  const [journalContent, setJournalContent] = useState("");
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedMealTime, setSelectedMealTime] =
    useState<MealTime>("breakfast");
  const [selectedColor, setSelectedColor] = useState<MealColor | null>(null);
  const [mealNote, setMealNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const handleDateChange = (direction: "prev" | "next") => {
    setSelectedDate((prev) =>
      direction === "next" ? addDays(prev, 1) : subDays(prev, 1),
    );
  };
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFoods, setSelectedFoods] = useState<any[]>([]);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const hasUnsavedMealSelection = () => {
    return (
      selectedColor !== null ||
      selectedCategory !== null ||
      selectedFoods.length > 0 ||
      mealNote.trim() !== ""
    );
  };

  const openMealModal = (mealTime: MealTime) => {
    // Prevent opening next meal if previous required meal is not logged
    // if (!canOpenMeal(mealTime)) {
    //   showMealOrderAlert(mealTime);
    //   return;
    // }
    // 🚨 Prevent losing unsaved meal selections
    if (showMealModal && hasUnsavedMealSelection()) {
      toast.error(
        "You have unsaved meal selections. Save your meal first, or unselect your current food choices before switching meal type or meal time.",
      );
      return;
    }

    setSelectedMealTime(mealTime);
    setSelectedColor(null);
    setSelectedCategory(null);
    setSelectedFoods([]);
    setMealNote("");
    setShowMealModal(true);
  };

  const getCategoriesByColor = () => {
    if (selectedColor === "green") return greenFoodCategories;
    if (selectedColor === "yellow") return orangeFoodCategories;
    if (selectedColor === "red") return redFoodCategories;
    return [];
  };

  const getFoodsByCategory = () => {
    if (!selectedCategory) return [];

    if (selectedColor === "green")
      return greenFoods.filter((f) => f.category === selectedCategory);

    if (selectedColor === "yellow")
      return orangeFoods.filter((f) => f.category === selectedCategory);

    if (selectedColor === "red")
      return redFoods.filter((f) => f.category === selectedCategory);

    return [];
  };
  const toggleFoodSelection = (food: any) => {
    setSelectedFoods((prev) => {
      const alreadySelected = prev.some((f) => f.id === food.id);

      if (alreadySelected) {
        return prev.filter((f) => f.id !== food.id);
      }

      return [...prev, food];
    });
  };

  const handleSaveMeal = () => {
    if (!selectedColor || !selectedCategory || selectedFoods.length === 0) {
      toast.error("Please select color, category, and at least one food.");
      return;
    }

    const newMeals: Meal[] = selectedFoods.map((food) => ({
      id: `${Date.now()}-${food.id}`,
      mealTime: selectedMealTime,
      color: selectedColor,
      category: selectedCategory,
      foodId: food.id,
      foodName: food.name,
      note: mealNote || undefined,
    }));

    setMeals((prev) => [...prev, ...newMeals]);
    setShowMealModal(false);

    toast.success(
      `${selectedFoods.length} food item(s) saved to ${selectedMealTime} ✅`,
    );
  };

  const handleDeleteMeal = (mealId: string) => {
    setMeals(meals.filter((m) => m.id !== mealId));
  };

  const getMealsForTime = (time: MealTime) =>
    meals.filter((m) => m.mealTime === time);

  const hasMealLogged = (time: MealTime) => getMealsForTime(time).length > 0;
  const canOpenMeal = (mealTime: MealTime) => {
    if (mealTime === "breakfast") return true;

    if (mealTime === "lunch") {
      return hasMealLogged("breakfast");
    }

    if (mealTime === "dinner") {
      return hasMealLogged("breakfast") && hasMealLogged("lunch");
    }

    if (mealTime === "snack") {
      return hasMealLogged("breakfast");
      // hasMealLogged("lunch") &&
      // hasMealLogged("dinner")
    }

    return false;
  };

  const showMealOrderAlert = (mealTime: MealTime) => {
    if (mealTime === "lunch") {
      toast.error("Please log Breakfast first 🍳");
      return;
    }

    if (mealTime === "dinner") {
      if (!hasMealLogged("breakfast")) {
        toast.error("Please log Breakfast first 🍳");
        return;
      }
      if (!hasMealLogged("lunch")) {
        toast.error("Please log Lunch first 🥗");
        return;
      }
    }

    if (mealTime === "snack") {
      if (!hasMealLogged("breakfast")) {
        toast.error("Please log Breakfast first 🍳");
        return;
      }
      // if (!hasMealLogged("lunch")) {
      //   toast.error("Please log Lunch first 🥗");
      //   return;
      // }
      // if (!hasMealLogged("dinner")) {
      //   toast.error("Please log Dinner first 🍽️");
      //   return;
      // }
    }
  };

  const mealCounts = {
    green: meals.filter((m) => m.color === "green").length,
    yellow: meals.filter((m) => m.color === "yellow").length,
    red: meals.filter((m) => m.color === "red").length,
  };

  const totalMeals = mealCounts.green + mealCounts.yellow + mealCounts.red;

  const handleSymptomChange = (key: keyof DailyLog, value: number) => {
    setDailyLog((prev) => ({ ...prev, [key]: value }));
  };

  const handleSupplementToggle = (supplement: string) => {
    setDailyLog((prev) => ({
      ...prev,
      supplements: prev.supplements.includes(supplement)
        ? prev.supplements.filter((s) => s !== supplement)
        : [...prev.supplements, supplement],
    }));
  };

  const handleWaterChange = (amount: number) => {
    setDailyLog((prev) => ({
      ...prev,
      waterIntake: Math.max(0, Math.min(12, prev.waterIntake + amount)),
    }));
  };

  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsPageLoading(true);
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

        console.log(OnboardingCompleted);

        if (status?.toLowerCase() === "paid") {
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
      } catch (error) {
        console.error("Error fetching user:", error);
        setIsPremium(false);
        setIsPageLoading(false); // ✅ page opens only after API finishes
      }
    };

    fetchUser();
  }, []);

  const fetchLogForSelectedDate = async (date: Date) => {
    try {
      const storedUser = localStorage.getItem("userData");
      if (!storedUser) return;

      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id;
      if (!userId) return;

      const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
      const tableName = import.meta.env.VITE_AIRTABLE_LOGS;
      const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;

      const formattedDate = format(date, "yyyy-MM-dd");

      const filterFormula = `AND(
      FIND("${userId}", ARRAYJOIN({UserId})),
      IS_SAME({Date}, "${formattedDate}", 'day')
    )`;

      const res = await fetch(
        `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=${encodeURIComponent(
          filterFormula,
        )}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch daily log");

      const data = await res.json();
      const existingRecord = data.records?.[0];

      // ✅ If record exists → prefill values
      if (existingRecord) {
        const fields = existingRecord.fields || {};

        // Meals
        let parsedMeals: Meal[] = [];
        try {
          parsedMeals = fields.Meals ? JSON.parse(fields.Meals) : [];
        } catch (err) {
          console.error("Invalid meals JSON:", err);
          parsedMeals = [];
        }

        setMeals(parsedMeals);

        // Daily Log
        setDailyLog({
          fasting: fields.Fasting ?? undefined,
          sleep: fields.Sleep ?? undefined,
          activity: fields.Activity ?? undefined,
          energy: fields.Energy ?? 5,
          mood: fields.Mood ?? 5,
          relational: fields.Relational ?? 5,
          waterIntake: fields["Water Intake"] ?? 0,
          supplements: fields.Supplements
            ? String(fields.Supplements)
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean)
            : [],
        });

        // Journal
        setJournalContent(fields.Journal ?? "");
      } else {
        // ❌ No record for selected date → reset form
        setMeals([]);
        setDailyLog({
          fasting: undefined,
          sleep: undefined,
          activity: undefined,
          energy: 5,
          mood: 5,
          relational: 5,
          waterIntake: 0,
          supplements: [],
        });
        setJournalContent("");
      }
    } catch (error) {
      console.error("Error fetching log:", error);

      // Optional reset on error
      setMeals([]);
      setDailyLog({
        fasting: undefined,
        sleep: undefined,
        activity: undefined,
        energy: 5,
        mood: 5,
        relational: 5,
        waterIntake: 0,
        supplements: [],
      });
      setJournalContent("");
    }
  };
  useEffect(() => {
    fetchLogForSelectedDate(selectedDate);
  }, [selectedDate]);

  const saveLogToAirtable = async () => {
    if (isSaving) return;
    // ✅ Check if at least one field has data
    const hasData =
      meals.length > 0 ||
      dailyLog.fasting ||
      dailyLog.sleep ||
      dailyLog.activity ||
      dailyLog.waterIntake > 0 ||
      dailyLog.supplements.length > 0 ||
      journalContent.trim() !== "";

    if (!hasData) {
      toast.error("Please log at least one item before saving ❗");
      return;
    }
    setIsSaving(true);

    try {
      // ✅ NEW: Check if user is free
      if (!isPremium) {
        setShowUpgradePopup(true); // show popup instead of saving
        setIsSaving(false);
        return;
      }

      const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
      const tableName = import.meta.env.VITE_AIRTABLE_LOGS;
      const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;

      // 1️⃣ Check if email exists
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      const storedUser = localStorage.getItem("userData");
      if (!storedUser) return;

      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id;

      const checkFilter = `AND(
      FIND("${userId}", ARRAYJOIN({UserId})),
      IS_SAME({Date}, "${formattedDate}", 'day')
    )`;

      const checkRes = await fetch(
        `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=${encodeURIComponent(
          checkFilter,
        )}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );

      const checkData = await checkRes.json();
      const existingRecord = checkData.records?.[0];

      // 📦 Common fields
      const fields = {
        Date: formattedDate,
        UserId: userId,
        Meals: JSON.stringify(meals),

        Fasting: dailyLog.fasting ?? null,
        Sleep: dailyLog.sleep ?? null,
        Activity: dailyLog.activity ?? null,

        Energy: dailyLog.energy,
        Mood: dailyLog.mood,
        Relational: dailyLog.relational,

        "Water Intake": dailyLog.waterIntake,
        Supplements: dailyLog.supplements.join(", "),
        Journal: journalContent,
      };

      let res;

      // ✏️ STEP 2: UPDATE if exists
      if (existingRecord) {
        res = await fetch(
          `https://api.airtable.com/v0/${baseId}/${tableName}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              records: [
                {
                  id: existingRecord.id,
                  fields,
                },
              ],
            }),
          },
        );

        if (!res.ok) throw new Error("Failed to update log");
        toast.success("Log updated successfully ✅");
        await fetchLogForSelectedDate(selectedDate);
      }

      // ➕ STEP 3: CREATE if not exists
      else {
        res = await fetch(
          `https://api.airtable.com/v0/${baseId}/${tableName}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              records: [{ fields }],
            }),
          },
        );

        if (!res.ok) throw new Error("Failed to create log");
        toast.success("Log created successfully ✅");
        await fetchLogForSelectedDate(selectedDate);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving log ❌");
    } finally {
      setIsSaving(false);
    }
  };

  const resetMealModal = () => {
    setSelectedColor(null);
    setSelectedCategory(null);
    setSelectedFoods([]);
    setMealNote("");
    setShowMealModal(false);
  };

  const confirmDiscardMeal = () => {
    if (!hasUnsavedMealSelection()) {
      resetMealModal();
      return;
    }

    const confirmed = window.confirm("Discard your current meal selection?");

    if (confirmed) {
      resetMealModal();
    }
  };

  return (
    <>
      {isPageLoading ? (
        <div className="loading-state">
          <p>Loading Daily Log...</p>
        </div>
      ) : (
        <>
          <div className="log-page">
            <div className="log-header">
              <h1>Daily Log</h1>
              <p>Track your meals, habits, and how you're feeling</p>
            </div>

            <div className="date-selector">
              <button
                className="date-btn"
                onClick={() => handleDateChange("prev")}
              >
                <ChevronLeft size={20} />
              </button>
              <div className="date-display">
                <span className="date-day">{format(selectedDate, "EEEE")}</span>
                <span className="date-full">
                  {format(selectedDate, "MMMM d, yyyy")}
                </span>
              </div>
              <button
                className="date-btn"
                onClick={() => handleDateChange("next")}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <section className="log-section">
              <h2>Meals</h2>

              {totalMeals > 0 && (
                <div className="meal-summary-bar">
                  <div
                    className="summary-segment green"
                    style={{ flex: mealCounts.green || 0.1 }}
                  />
                  <div
                    className="summary-segment yellow"
                    style={{ flex: mealCounts.yellow || 0.1 }}
                  />
                  <div
                    className="summary-segment red"
                    style={{ flex: mealCounts.red || 0.1 }}
                  />
                </div>
              )}

              <div className="meal-times">
                {mealTimes.map((time) => {
                  const timeMeals = getMealsForTime(time);
                  return (
                    <div key={time} className="meal-time-card">
                      <div className="meal-time-header">
                        <span className="meal-time-label">{time}</span>
                        <button
                          className="add-meal-btn"
                          onClick={() => {
                            if (showMealModal) {
                              toast.error(
                                "Please save the current meal first before opening another one ⚠️",
                              );
                              return;
                            }
                            openMealModal(time);
                          }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      {timeMeals.length > 0 ? (
                        <div className="meals-list">
                          {timeMeals.map((meal) => (
                            <div key={meal.id} className="meal-item">
                              <div className={`meal-color-dot ${meal.color}`} />
                              <span className="meal-note">
                                {meal.note || colorLabels[meal.color].label}
                              </span>
                              <button
                                className="delete-meal-btn"
                                onClick={() => handleDeleteMeal(meal.id)}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="no-meals">No meals logged</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="log-section">
              <h2>Daily Habits</h2>
              <div className="habits-card">
                <div className="habit-row">
                  <div className="habit-label">
                    <Clock size={18} />
                    <span>Fasting</span>
                  </div>
                  <div className="segment-options">
                    {[
                      { label: "8 hrs", value: 8 },
                      { label: "16 hrs", value: 16 },
                      { label: "24 hrs", value: 24 },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        className={`segment-btn ${dailyLog.fasting === opt.value ? "active" : ""}`}
                        onClick={() =>
                          handleSymptomChange("fasting", opt.value)
                        }
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="habit-row">
                  <div className="habit-label">
                    <Moon size={18} />
                    <span>Sleep</span>
                  </div>
                  <div className="segment-options">
                    {[
                      { label: "<6 hrs", value: 5 },
                      { label: "6-8 hrs", value: 7 },
                      { label: ">8 hrs", value: 9 },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        className={`segment-btn ${dailyLog.sleep === opt.value ? "active" : ""}`}
                        onClick={() => handleSymptomChange("sleep", opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="habit-row">
                  <div className="habit-label">
                    <Activity size={18} />
                    <span>Activity</span>
                  </div>
                  <div className="segment-options">
                    {[
                      { label: "<1 hr", value: 0 },
                      { label: "1-2 hrs", value: 1 },
                      { label: ">2 hrs", value: 2 },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        className={`segment-btn ${dailyLog.activity === opt.value ? "active" : ""}`}
                        onClick={() =>
                          handleSymptomChange("activity", opt.value)
                        }
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="log-section">
              <h2>How are you feeling?</h2>
              <div className="feelings-card">
                <div className="feeling-row">
                  <div className="feeling-label">
                    <Zap size={18} />
                    <span>Energy</span>
                  </div>
                  <div className="slider-container">
                    <span className="slider-label-min">Tired</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={dailyLog.energy}
                      onChange={(e) =>
                        handleSymptomChange("energy", parseInt(e.target.value))
                      }
                      className="slider"
                    />
                    <span className="slider-label-max">Energized</span>
                    <span className="slider-value">{dailyLog.energy}</span>
                  </div>
                </div>
                <div className="feeling-row">
                  <div className="feeling-label">
                    <Smile size={18} />
                    <span>Mood</span>
                  </div>
                  <div className="slider-container">
                    <span className="slider-label-min">Low</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={dailyLog.mood}
                      onChange={(e) =>
                        handleSymptomChange("mood", parseInt(e.target.value))
                      }
                      className="slider"
                    />
                    <span className="slider-label-max">Great</span>
                    <span className="slider-value">{dailyLog.mood}</span>
                  </div>
                </div>
                <div className="feeling-row">
                  <div className="feeling-label">
                    <Heart size={18} />
                    <span>Relational</span>
                  </div>
                  <div className="slider-container">
                    <span className="slider-label-min">Disconnected</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={dailyLog.relational}
                      onChange={(e) =>
                        handleSymptomChange(
                          "relational",
                          parseInt(e.target.value),
                        )
                      }
                      className="slider"
                    />
                    <span className="slider-label-max">Connected</span>
                    <span className="slider-value">{dailyLog.relational}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="log-section">
              <h2>Daily Tracking</h2>
              <div className="tracking-card">
                <div className="water-tracker">
                  <div className="tracker-header">
                    <Droplets size={20} className="water-icon" />
                    <span>Water Intake</span>
                  </div>
                  <div className="water-controls">
                    <button
                      className="water-btn"
                      onClick={() => handleWaterChange(-1)}
                    >
                      -
                    </button>
                    <div className="water-display">
                      <span className="water-count">
                        {dailyLog.waterIntake}
                      </span>
                      <span className="water-unit">glasses</span>
                    </div>
                    <button
                      className="water-btn"
                      onClick={() => handleWaterChange(1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="water-progress">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className={`water-dot ${i < dailyLog.waterIntake ? "filled" : ""}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="supplement-tracker">
                  <div className="tracker-header">
                    <Pill size={20} className="supplement-icon" />
                    <span>Supplements</span>
                  </div>
                  <div className="supplement-grid">
                    {supplements.map((supplement) => (
                      <button
                        key={supplement}
                        className={`supplement-btn ${dailyLog.supplements.includes(supplement) ? "active" : ""}`}
                        onClick={() => handleSupplementToggle(supplement)}
                      >
                        {supplement}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="log-section">
              <h2>Journal</h2>
              <div className="journal-card">
                <textarea
                  className="journal-input"
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  placeholder="How was your day? Any wins, challenges, or reflections?"
                  rows={4}
                />
              </div>
            </section>
            <section className="log-section">
              <Button onClick={saveLogToAirtable} fullWidth disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Daily Log"}
              </Button>
            </section>

            {showMealModal && (
              <div
                className="modal-overlay"
                onClick={() => {
                  if (hasUnsavedMealSelection()) {
                    toast.error(
                      "You have unsaved meal selections. Save your meal first, or unselect your current food choices before switching meal type or meal time.",
                    );
                    return;
                  }
                  setShowMealModal(false);
                }}
              >
                <div
                  className="modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="modal-header">
                    <button
                      className="modal-close"
                      onClick={confirmDiscardMeal}
                    >
                      <X size={24} />
                    </button>
                    <h3>Log {selectedMealTime}</h3>
                    <div style={{ width: 24 }} />
                  </div>

                  <div className="modal-body">
                    <h4>Select Meal Type</h4>

                    {/* COLOR SELECTION */}
                    <div className="color-grid">
                      {(["green", "yellow", "red"] as MealColor[]).map(
                        (color) => (
                          <button
                            key={color}
                            className={`color-tile ${color} ${
                              selectedColor === color ? "selected" : ""
                            }`}
                            onClick={() => {
                              // 🚨 If user already started another selection, prevent losing it
                              if (
                                selectedColor &&
                                selectedColor !== color &&
                                hasUnsavedMealSelection()
                              ) {
                                toast.error(
                                  "You have unsaved meal selections. Save your meal first, or unselect your current food choices before switching meal type or meal time.",
                                );
                                return;
                              }
                              setSelectedColor(color);
                              setSelectedCategory(null);
                              setSelectedFoods([]);
                            }}
                          >
                            <span>{colorLabels[color].label}</span>
                          </button>
                        ),
                      )}
                    </div>

                    {/* CATEGORY SELECTION */}
                    {selectedColor && (
                      <>
                        <h4>Select Category</h4>
                        <div className="category-grid">
                          {getCategoriesByColor().map((cat: any) => (
                            <button
                              key={cat.id}
                              className={`category-tile ${
                                selectedCategory === cat.id ? "selected" : ""
                              }`}
                              onClick={() => {
                                // 🚨 Prevent changing category if foods already selected
                                if (
                                  selectedCategory &&
                                  selectedCategory !== cat.id &&
                                  selectedFoods.length > 0
                                ) {
                                  toast.error(
                                    "You have unsaved meal selections. Save your meal first, or unselect your current food choices before switching meal type or meal time.",
                                  );
                                  return;
                                }
                                setSelectedCategory(cat.id);
                                setSelectedFoods([]);
                              }}
                            >
                              <span className="category-icon">{cat.icon}</span>
                              <span className="category-label">
                                {cat.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* FOOD SELECTION */}
                    {selectedCategory && (
                      <>
                        <h4>Select Food</h4>
                        <div className="food-grid">
                          {getFoodsByCategory().map((food: any) => {
                            const isSelected = selectedFoods.some(
                              (f) => f.id === food.id,
                            );

                            return (
                              <button
                                key={food.id}
                                className={`food-tile ${isSelected ? "selected" : ""}`}
                                onClick={() => toggleFoodSelection(food)}
                              >
                                <span className="food-icon">{food.icon}</span>
                                <span className="food-name">{food.name}</span>

                                {selectedColor === "yellow" && food.limit && (
                                  <span className="food-limit">
                                    {food.limit}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}

                    <div className="note-input-container">
                      <label>Note (optional)</label>
                      <input
                        type="text"
                        className="note-input"
                        value={mealNote}
                        onChange={(e) => setMealNote(e.target.value)}
                      />
                    </div>
                    {selectedColor === "green" && (
                      <>
                        <p style={{ fontSize: "12px" }}>
                          <b>FLAVORINGS &CONDIMENTS</b>All flavorings and
                          condiments are okay, provided they do not contain
                          sugars and preservatives or vegetable oils.
                        </p>
                        <p style={{ fontSize: "12px" }}>
                          <span style={{ fontSize: "15px", color: "green" }}>
                            <b>
                              This ‘Green Sheet’ is an all-you-can-eat list -
                              you can choose anything you like without worrying
                              about the carbohydrate content as all the foods
                              will be between 0 to 5g/100g.
                            </b>
                          </span>{" "}
                          It will be almost impossible to overdo your
                          carbohydrate intake by sticking to this group of
                          foods. Over-eating protein is not recommended, so eat
                          a moderate amount of animal protein at each meal.
                          Include as much fat as you are comfortable with -
                          bearing in mind that the Program is high in fat.
                          <br></br>
                          <b>*Caution</b>: even though these are all-you-can eat
                          foods, only eat when hungry, stop when full and do not
                          overeat. The size and thickness of your palm without
                          fingers is a good measure for a serving of animal
                          protein.
                        </p>
                      </>
                    )}
                    {selectedColor === "yellow" && (
                      <>
                        <p style={{ fontSize: "12px" }}>
                          <b>KEY</b>
                          <br></br>C = cups per day<br></br>T = tablespoons per
                          day
                          <br></br>t = teaspoons per day<br></br>g = grams per
                          day
                          <br></br>
                          For example: Apples 1.5 are all the carbs you can have
                          for the day.
                        </p>
                        <br></br>
                        <p style={{ fontSize: "12px" }}>
                          <b style={{ fontSize: "15px", color: "orange" }}>
                            The ‘Orange Sheet’ is made up of ingredients
                            containing between 6g and 25g of carbs per 100g (6%
                            - 25%).
                          </b>
                          Chart your carbohydrates without getting obsessive and
                          still obtain an excellent outcome. If you are
                          endeavoring to go into ketosis, this list will assist
                          you to not overshoot the 25 to 50g/100g limit. These
                          are all net carbs and they are all 23 to 25g per
                          indicated amount. Ingredients are all fresh unless
                          otherwise indicated.
                        </p>
                      </>
                    )}
                    {selectedColor === "red" && (
                      <>
                        <p style={{ fontSize: "12px" }}>
                          <b style={{ fontSize: "15px", color: "red" }}>
                            The ‘Red Sheet’ will contain all the foods to avoid
                            as they will be either toxic (ie. seed oils, soya)
                            or high-carbohydrate foods (ie. potatoes, rice).
                          </b>
                          We strongly suggest you avoid all the items on this
                          list, or, at best, eat them very occasionally and
                          restrict the amount when you do. They will do nothing
                          to help you in your attempt to reach your goal.
                        </p>
                      </>
                    )}
                    <br></br>

                    <Button
                      onClick={handleSaveMeal}
                      disabled={selectedFoods.length === 0}
                      fullWidth
                    >
                      Save{" "}
                      {selectedFoods.length > 0
                        ? `(${selectedFoods.length})`
                        : ""}{" "}
                      Meal
                    </Button>
                    {selectedFoods.length > 0 && (
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          marginBottom: "10px",
                        }}
                      >
                        Selected Foods:{" "}
                        {selectedFoods.map((f) => f.name).join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
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
                    You’re currently on the <strong>Free Plan</strong>. Upgrade
                    to access all health insights, detailed scoring, and
                    personalized recommendations.
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
        </>
      )}
    </>
  );
}
