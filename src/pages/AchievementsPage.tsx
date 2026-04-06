import { useState, useEffect } from 'react'
import { Award, Clock, Salad, BookOpen, Target, Heart, Check, Lock, Zap, Star, UserCheck } from 'lucide-react'
import './AchievementsPage.css'
import { useNavigate } from 'react-router-dom'

// ------------------ ACHIEVEMENT DEFINITIONS ------------------
interface Achievement {
  id: string
  title: string
  description: string
  category: 'fasting' | 'nutrition' | 'learning' | 'consistency' | 'health'
  icon: any
  progress: number
  target: number
  unlockedAt?: string
}

// ✅ IMPORTANT: keep this synced with LibraryPage total article count
const TOTAL_LIBRARY_ARTICLES = 40

const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'progress' | 'unlockedAt'>[] = [
  // Fasting Achievements
  { id: 'first-fast', title: 'First Fast', description: 'Complete your first 16-hour fast', icon: Clock, category: 'fasting', target: 1 },
  { id: 'fasting-streak-3', title: 'Fasting Rookie', description: 'Complete 3 fasts', icon: Zap, category: 'fasting', target: 3 },
  { id: 'fasting-streak-7', title: 'Fasting Pro', description: 'Complete 7 fasts', icon: Star, category: 'fasting', target: 7 },
  { id: 'fasting-streak-30', title: 'Fasting Master', description: 'Complete 30 fasts', icon: Star, category: 'fasting', target: 30 },

  // Nutrition Achievements
  { id: 'first-green-meal', title: 'Going Green', description: 'Log your first green meal', icon: Salad, category: 'nutrition', target: 1 },
  { id: 'green-day', title: 'Green Day', description: 'Log only green meals for an entire day', icon: Star, category: 'nutrition', target: 1 },
  { id: 'green-streak-7', title: 'Green Machine', description: 'Log 7 green meals in a row', icon: Star, category: 'nutrition', target: 7 },
  { id: 'meals-logged-10', title: 'Food Tracker', description: 'Log 10 meals', icon: Salad, category: 'nutrition', target: 10 },
  { id: 'meals-logged-50', title: 'Nutrition Master', description: 'Log 50 meals', icon: Salad, category: 'nutrition', target: 50 },

  // Learning Achievements
  { id: 'first-article', title: 'Curious Mind', description: 'Read your first library article', icon: BookOpen, category: 'learning', target: 1 },
  { id: 'knowledge-seeker', title: 'Knowledge Seeker', description: 'Read 10 library articles', icon: BookOpen, category: 'learning', target: 10 },
  { id: 'scholar', title: 'Health Scholar', description: 'Read all library articles', icon: BookOpen, category: 'learning', target: TOTAL_LIBRARY_ARTICLES },

  // Consistency Achievements
  { id: 'first-log', title: 'Getting Started', description: 'Complete your first daily log', icon: Target, category: 'consistency', target: 1 },
  { id: 'week-warrior', title: 'Week Warrior', description: 'Log daily for 7 consecutive days', icon: Target, category: 'consistency', target: 7 },
  { id: 'month-champion', title: 'Month Champion', description: 'Log daily for 30 consecutive days', icon: Target, category: 'consistency', target: 30 },
  { id: 'hydration-hero', title: 'Hydration Hero', description: 'Hit your water goal 7 days in a row', icon: Heart, category: 'consistency', target: 7 },

  // Health Achievements
  { id: 'weight-logged', title: 'Scale Brave', description: 'Log your weight for the first time', icon: Target, category: 'health', target: 1 },
  { id: 'waist-logged', title: 'Measuring Up', description: 'Log your waist measurement', icon: Target, category: 'health', target: 1 },
  { id: 'health-assessment', title: 'Self Aware', description: 'Complete the health assessment', icon: Heart, category: 'health', target: 1 },
  { id: 'profile-complete', title: 'All Set Up', description: 'Complete your profile with all details', icon: UserCheck, category: 'health', target: 1 }
]

// ------------------ CATEGORY INFO ------------------
const CATEGORY_LABELS: Record<string, string> = {
  fasting: 'Fasting',
  nutrition: 'Nutrition',
  learning: 'Learning',
  consistency: 'Consistency',
  health: 'Health'
}

const CATEGORY_COLORS: Record<string, string> = {
  fasting: '#8B5CF6',
  nutrition: '#22C55E',
  learning: '#3B82F6',
  consistency: '#F59E0B',
  health: '#EF4444'
}

// ------------------ COMPONENT ------------------
export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        const userId = userData?.id
        if (!userId) return

        const headers = {
          Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`
        }

        // ------------------ FETCH LOGS ------------------
        const logsRes = await fetch(
          `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/Logs?filterByFormula=${encodeURIComponent(`{UserId}='${userId}'`)}`,
          { headers }
        )

        const logsData = await logsRes.json()
        const logs = (logsData.records || []).map((rec: any) => rec.fields)

        // ------------------ FETCH MASTER USER TABLE ------------------
        const formula = `RECORD_ID()="${String(userId).replace(/"/g, '\\"')}"`

        const userRes = await fetch(
          `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/Users?filterByFormula=${encodeURIComponent(formula)}`,
          { headers }
        )

        const userTableData = await userRes.json()
        const masterUser = userTableData.records?.[0]?.fields || {}

        const sortedLogs = logs
          .filter((l: any) => l.Date)
          .sort((a: any, b: any) =>
            new Date(a.Date).getTime() - new Date(b.Date).getTime()
          )

        const parseMeals = (mealString: string) => {
          try {
            return JSON.parse(mealString)
          } catch {
            return []
          }
        }

        const allMeals = sortedLogs.flatMap((log: any) =>
          log.Meals ? parseMeals(log.Meals) : []
        )

        const greenMeals = allMeals.filter((m: any) => m.color === 'green')

        const greenDays = sortedLogs.filter((log: any) => {
          if (!log.Meals) return false
          const meals = parseMeals(log.Meals)
          if (meals.length === 0) return false
          return meals.every((m: any) => m.color === 'green')
        })

        let greenStreak = 0
        let currentGreenStreak = 0

        allMeals.forEach((meal: any) => {
          if (meal.color === 'green') {
            currentGreenStreak++
            greenStreak = Math.max(greenStreak, currentGreenStreak)
          } else {
            currentGreenStreak = 0
          }
        })

        const fastingCount = sortedLogs.filter((l: any) => l.Fasting).length
        const totalLogs = sortedLogs.length

        let maxDailyStreak = 0
        let currentDailyStreak = 0

        for (let i = 0; i < sortedLogs.length; i++) {
          if (i === 0) {
            currentDailyStreak = 1
          } else {
            const prev = new Date(sortedLogs[i - 1].Date)
            const curr = new Date(sortedLogs[i].Date)
            const diff =
              (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)

            if (diff === 1) currentDailyStreak++
            else currentDailyStreak = 1
          }
          maxDailyStreak = Math.max(maxDailyStreak, currentDailyStreak)
        }

        let hydrationStreak = 0
        let currentHydrationStreak = 0

        sortedLogs.forEach((log: any) => {
          if (Number(log['Water Intake']) >= 8) {
            currentHydrationStreak++
            hydrationStreak = Math.max(hydrationStreak, currentHydrationStreak)
          } else {
            currentHydrationStreak = 0
          }
        })

        // ------------------ MASTER TABLE HEALTH CHECKS ------------------
        const hasWeight =
          masterUser.Weight !== undefined &&
          masterUser.Weight !== null &&
          masterUser.Weight !== ''

        const hasWaist =
          masterUser.Waist !== undefined &&
          masterUser.Waist !== null &&
          masterUser.Waist !== ''

        const hasHealthScore =
          masterUser.HealthScore !== undefined &&
          masterUser.HealthScore !== null &&
          masterUser.HealthScore !== ''

        const Phone =
          masterUser.Phone !== undefined &&
          masterUser.Phone !== null &&
          masterUser.Phone !== ''

        const DateOfBirth =
          masterUser.DateOfBirth !== undefined &&
          masterUser.DateOfBirth !== null &&
          masterUser.DateOfBirth !== ''

        const Sex =
          masterUser.Sex !== undefined &&
          masterUser.Sex !== null &&
          masterUser.Sex !== ''

        const hasName =
          masterUser['Name'] !== undefined &&
          masterUser['Name'] !== null &&
          masterUser['Name'] !== ''

        const hasEmail =
          masterUser['Email'] !== undefined &&
          masterUser['Email'] !== null &&
          masterUser['Email'] !== ''

        // ------------------ LIBRARY ACHIEVEMENTS ------------------
        let libraryReadIds: string[] = []
        let libraryReadCount = 0

        try {
          const rawIds = masterUser.LibraryReadIds
          if (rawIds) {
            const parsed = JSON.parse(rawIds)
            if (Array.isArray(parsed)) {
              libraryReadIds = [...new Set(parsed)]
            }
          }
        } catch {
          libraryReadIds = []
        }

        libraryReadCount =
          typeof masterUser.LibraryReadCount === 'number'
            ? masterUser.LibraryReadCount
            : libraryReadIds.length

        // Always trust unique IDs more than count if mismatch
        if (libraryReadIds.length > libraryReadCount) {
          libraryReadCount = libraryReadIds.length
        }

        const updated = ACHIEVEMENT_DEFINITIONS.map(def => {
          let progress = 0
          let unlockedAt: string | undefined

          switch (def.id) {
            case 'first-fast':
            case 'fasting-streak-3':
            case 'fasting-streak-7':
            case 'fasting-streak-30':
              progress = fastingCount
              break

            case 'first-green-meal':
              progress = greenMeals.length
              break

            case 'green-day':
              progress = greenDays.length
              break

            case 'green-streak-7':
              progress = greenStreak
              break

            case 'meals-logged-10':
            case 'meals-logged-50':
              progress = allMeals.length
              break

            // ------------------ LEARNING ACHIEVEMENTS ------------------
            case 'first-article':
              progress = libraryReadCount
              break

            case 'knowledge-seeker':
              progress = libraryReadCount
              break

            case 'scholar':
              progress = libraryReadCount
              break

            case 'first-log':
              progress = totalLogs
              break

            case 'week-warrior':
            case 'month-champion':
              progress = maxDailyStreak
              break

            case 'hydration-hero':
              progress = hydrationStreak
              break

            // ------------------ HEALTH ACHIEVEMENTS ------------------
            case 'weight-logged':
              progress = hasWeight ? 1 : 0
              break

            case 'waist-logged':
              progress = hasWaist ? 1 : 0
              break

            case 'health-assessment':
              progress = hasHealthScore ? 1 : 0
              break

            case 'profile-complete':
              progress =
                hasName &&
                hasEmail &&
                hasWeight &&
                hasWaist &&
                hasHealthScore &&
                Phone &&
                DateOfBirth &&
                Sex
                  ? 1
                  : 0
              break

            default:
              progress = 0
          }

          if (progress >= def.target) {
            unlockedAt = new Date().toISOString()
            progress = def.target
          }

          return { ...def, progress, unlockedAt }
        })

        setAchievements(updated)
      } catch (err) {
        console.error('Error fetching achievements:', err)
      }
    }

    fetchAchievements()
  }, [])

  const categories = ['fasting', 'nutrition', 'learning', 'consistency', 'health']

  const filteredAchievements = selectedCategory
    ? achievements.filter(a => a.category === selectedCategory)
    : achievements

  const unlockedCount = achievements.filter(a => a.unlockedAt).length
  const totalCount = achievements.length

  const handleBadgeClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement)
  }

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

  return (
    <div className="achievements-page">
      <div className="achievements-header">
        <h1>Achievements</h1>
        <p>Track your progress and earn badges</p>
      </div>

      <div className="summary-card">
        <div className="summary-icon">
          <Award size={32} />
        </div>
        <div className="summary-text">
          <span className="summary-count">{unlockedCount}/{totalCount}</span>
          <span className="summary-label">Achievements Unlocked</span>
        </div>
        <div className="summary-ring">
          <span>{Math.round((unlockedCount / totalCount) * 100)}%</span>
        </div>
      </div>

      <div className="category-filter">
        <button
          className={`category-chip ${!selectedCategory ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
            style={{ '--chip-color': CATEGORY_COLORS[cat] } as React.CSSProperties}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="badge-grid">
        {filteredAchievements.map(achievement => {
          const isUnlocked = !!achievement.unlockedAt
          const categoryColor = CATEGORY_COLORS[achievement.category]
          const progressPercent = Math.min((achievement.progress / achievement.target) * 100, 100)

          return (
            <button
              key={achievement.id}
              className={`badge ${isUnlocked ? 'unlocked' : ''}`}
              style={{ '--badge-color': categoryColor } as React.CSSProperties}
              onClick={() => handleBadgeClick(achievement)}
            >
              <div className="badge-icon">
                <achievement.icon size={24} />
              </div>
              <span className="badge-title">{achievement.title}</span>

              {!isUnlocked && achievement.target > 1 && (
                <div className="badge-progress">
                  <div className="badge-progress-bar">
                    <div className="badge-progress-fill" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <span className="badge-progress-text">{achievement.progress}/{achievement.target}</span>
                </div>
              )}

              {isUnlocked && (
                <div className="badge-check">
                  <Check size={10} />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {selectedAchievement && (
        <div className="modal-overlay" onClick={() => setSelectedAchievement(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div
              className={`modal-icon ${selectedAchievement.unlockedAt ? 'unlocked' : ''}`}
              style={{ '--badge-color': CATEGORY_COLORS[selectedAchievement.category] } as React.CSSProperties}
            >
              <selectedAchievement.icon size={40} />
            </div>
            <h3 className="modal-title">{selectedAchievement.title}</h3>
            <p className="modal-description">{selectedAchievement.description}</p>
            <div
              className="modal-category"
              style={{ '--badge-color': CATEGORY_COLORS[selectedAchievement.category] } as React.CSSProperties}
            >
              {CATEGORY_LABELS[selectedAchievement.category]}
            </div>

            {selectedAchievement.unlockedAt ? (
              <div className="modal-status unlocked">
                <Check size={16} />
                <span>Unlocked {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}</span>
              </div>
            ) : (
              <div className="modal-status locked">
                <Lock size={16} />
                <span>Progress: {selectedAchievement.progress}/{selectedAchievement.target}</span>
              </div>
            )}

            <button className="modal-close-btn" onClick={() => setSelectedAchievement(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}