import { useEffect, useState } from "react";
import {
  Search,
  ChevronRight,
  ArrowLeft,
  Zap,
  BookOpen,
  Tag,
  FileText,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import "./LibraryPage.css";
import { useNavigate } from "react-router-dom";
import PdfViewerPage from "./PdfViewerPage";

// =============================================
// TYPES
// =============================================
interface LibraryItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
}

interface PdfMapping {
  pdf: string;
  page: number;
}

// =============================================
// CATEGORIES
// =============================================
const categories = [
  { id: "all", name: "All" },
  { id: "quickstart", name: "Quick Start" },
  { id: "science", name: "The Science" },
  { id: "greensheets", name: "Green Sheets" },
  { id: "journal", name: "Journal" },
  { id: "faq", name: "FAQ" },
];

// =============================================
// PDF BASE URLs
// Change these to match your deployment
// =============================================
const QS_PDF = "VS_QUICKSTART_GUIDE.pdf";
const RES_PDF = "VS_RESOURCES.pdf";

// =============================================
// PDF PAGE MAPPING
//
// Place these 2 PDFs in your public folder:
//   public/VS_QUICKSTART_GUIDE.pdf
//   public/VS_RESOURCES.pdf
// =============================================
const PDF_PAGE_MAP: Record<string, PdfMapping> = {
  // ---- Quick Start → QuickStart PDF ----
  "qs-1": { pdf: QS_PDF, page: 5 },
  "qs-2": { pdf: QS_PDF, page: 6 },
  "qs-3": { pdf: QS_PDF, page: 9 },
  "qs-4": { pdf: QS_PDF, page: 11 },
  "qs-5": { pdf: QS_PDF, page: 12 },
  "qs-6": { pdf: QS_PDF, page: 13 },
  "qs-7": { pdf: QS_PDF, page: 16 },
  "qs-8": { pdf: QS_PDF, page: 18 },
  "qs-9": { pdf: QS_PDF, page: 21 },
  "qs-10": { pdf: QS_PDF, page: 23 },
  "qs-11": { pdf: QS_PDF, page: 24 },
  "qs-12": { pdf: QS_PDF, page: 24 },
  "qs-13": { pdf: QS_PDF, page: 26 },
  "qs-14": { pdf: QS_PDF, page: 35 },
  "qs-15": { pdf: QS_PDF, page: 32 },

  // ---- Green Sheets → QuickStart PDF ----
  "gs-1": { pdf: QS_PDF, page: 37 },
  "gs-2": { pdf: QS_PDF, page: 38 },
  "gs-3": { pdf: QS_PDF, page: 39 },

  // ---- Science (1-7) → QuickStart PDF ----
  "sci-1": { pdf: QS_PDF, page: 10 },
  "sci-2": { pdf: QS_PDF, page: 11 },
  "sci-3": { pdf: QS_PDF, page: 12 },
  "sci-4": { pdf: QS_PDF, page: 17 },
  "sci-5": { pdf: QS_PDF, page: 13 },
  "sci-6": { pdf: QS_PDF, page: 18 },
  "sci-7": { pdf: QS_PDF, page: 21 },

  // ---- Science (8-13) → Resources PDF ----
  "sci-8": { pdf: RES_PDF, page: 3 }, // How Seed Oils Destroy Your Health
  "sci-9": { pdf: RES_PDF, page: 14 }, // What Happens When We Fast
  "sci-10": { pdf: RES_PDF, page: 17 }, // Twelve Tips for Healthy Sleep
  "sci-11": { pdf: RES_PDF, page: 19 }, // Stress Relief Exercises
  "sci-12": { pdf: RES_PDF, page: 31 }, // Nutraceuticals & Supplements
  "sci-13": { pdf: RES_PDF, page: 40 }, // Nature Wants Us To Be Fat

  // ---- FAQ → Resources PDF ----
  "faq-1": { pdf: RES_PDF, page: 21 }, // Frequently Asked Questions

  // ---- No PDF (in-app only) ----
  // "jr-1"  → Journal
  // "faq-2" → Privacy Policy
};

// =============================================
// HELPERS
// =============================================
// const openPdfAtPage = (itemId: string) => {
//   const mapping = PDF_PAGE_MAP[itemId];
//   if (mapping) {
//     window.open(
//       `https://vitalstate.vercel.app/${mapping.pdf}#page=${mapping.page}`,
//       "_blank"
//     );
//   }
// };

const getPdfLabel = (itemId: string): string | null => {
  const mapping = PDF_PAGE_MAP[itemId];
  if (!mapping) return null;
  return mapping.pdf === QS_PDF ? " Quick Start" : " Resources";
};

// =============================================
// LIBRARY CONTENT DATA
// =============================================
const LIBRARY_CONTENT: LibraryItem[] = [
  {
    id: "qs-1",
    title: "The 4 Week Diabesity Cure Program",
    category: "quickstart",
    summary: "Understanding the global health crisis and how to reverse it.",
    content: `**The 4 Week Diabesity Cure Program**

At the end of the American Civil War in 1865, chronic diseases were practically unheard of. Being overweight was exceedingly uncommon, and only about 1% of Americans qualified as obese.

**Today's Reality:**
- 74% of Americans are overweight
- 30% are obese
- 60%+ are diabetic or prediabetic
- 93% have metabolic dysfunction

Heart attacks were almost unknown - fewer than ten published cases existed. Cancer caused only 0.5% of deaths. Diabetes affected fewer than 3 per 100,000 people.

**Diabesity is Now the #1 Risk**

After age, diabesity (diabetes + obesity) is the biggest risk factor for chronic disease and early death. More than 1/3 of US adults have Metabolic Syndrome.

**Many Diseases - One Solution**

In 2019, for the first time in US history, the mean lifespan of Americans fell 2 years and 3 months (before Covid-19).

**The Good News:** 80% of all chronic disease and healthcare costs can be halted and reversed by turning off your "fat switch."`,
  },
  {
    id: "qs-2",
    title: "What Can We Learn from Nature?",
    category: "quickstart",
    summary:
      "The survival switch that protects us - and how it's become stuck.",
    content: `**Nature's Survival Switch**

Nature put a "survival switch" in our bodies to protect us from starvation. Stuck in the "on position," it is the hidden source of diabetes and all chronic disease that kills us today.

Animals in nature turn this switch on and off to store fat when needed. But our modern diet has permanently fixed it in the "on position."

**Two Critical Mutations**

Humans have two genetic mutations that make us especially vulnerable:

1. **Loss of Vitamin C Production** (65 million years ago)
   - Makes us more susceptible to oxidative stress
   - Most mammals make their own vitamin C; we cannot

2. **Loss of Uricase Enzyme** (17 million years ago)
   - We can't break down uric acid efficiently
   - Our uric acid levels are 3-4x higher than other mammals

**The Fructose Connection**

These mutations helped our ancestors survive when fruit was their main food source and became scarce during global cooling.

**The Modern Problem:**
- Fructose intake (as added sugars) has skyrocketed
- Natural fruits high in vitamin C have fallen
- This mismatch is responsible for the obesity epidemic

"It is not our culture or will power that makes us fat. It is our biology!"`,
  },
  {
    id: "qs-3",
    title: "Survival of the Fattest",
    category: "quickstart",
    summary: "How animals use the fat switch - and why ours is stuck.",
    content: `**Survival of the Fattest**

Just as Darwin emphasized "survival of the fittest," there is an equally important concept: "survival of the fattest."

**The Penguin Example**

The male Emperor Penguin doubles its body fat during the Antarctic summer by eating squid and fish. It then marches inland to incubate its mate's egg.

During this time, the penguin survives without food for as long as four months - living entirely on stored fat. Then it returns to normal.

**The Hummingbird Example**

Hummingbirds have incredibly high metabolic rates:
- Respiratory rate: 250/min
- Heart rate: 1,250/min
- Temperature: 102°F

They consume 4x their body weight each day in nectar. They develop temporary "diabetes" (blood sugars of 700+) and fatty livers during the day. By the following morning, they're back to normal with no complications.

**The Key Difference**

Animals activate the "fat switch" to gain weight, then turn it off.

Obese humans have the fat switch stuck in the "on position" - and it's responsible for all cardio-metabolic disease.`,
  },
  {
    id: "qs-4",
    title: "How Fructose Activates the Fat Switch",
    category: "quickstart",
    summary:
      "The unique way fructose metabolism creates a cellular energy crisis.",
    content: `**How Fructose Activates the Fat Switch**

When we eat, calories are either turned into usable energy (ATP) or stored for later. ATP is made in your mitochondria - your cellular energy factories.

**Glucose vs. Fructose: A Critical Difference**

**Glucose metabolism** has a built-in safety system. If ATP levels start to fall, the system slows down until ATP is replenished. Levels never fall significantly.

**Fructose metabolism** has NO check-and-balance system:
- Fructokinase breaks down fructose very rapidly
- ATP is used up faster than it can be replenished
- ATP levels can fall precipitously

**The Chain Reaction**

1. ATP drops and becomes ADP
2. Instead of recycling back to ATP, ADP breaks down to AMP
3. AMP is metabolized into uric acid
4. Uric acid causes oxidative stress in mitochondria
5. Damaged mitochondria decrease energy production and impair fat burning

**The Result**

Low ATP triggers an emergency response:
- Intense hunger
- Increased cravings
- Fat production increases
- Fat burning decreases

The food you eat to satisfy this hunger gets converted to fat. Eventually ATP recovers, but by then you've stored significant fat.`,
  },
  {
    id: "qs-5",
    title: "The Survival Switch Response",
    category: "quickstart",
    summary: "What happens in your body when the survival switch is activated.",
    content: `**The Survival Switch**

When the survival switch is activated, it triggers a cascade of responses designed for survival:

**Hunger**
Driven by low ATP levels (which simulate starvation) and by leptin resistance (which prevents you from recognizing when you're full).

**Craving**
Driven by fructose metabolism in the intestines and possibly the brain. You specifically crave more sugar.

**Foraging Behavior**
Aids in the search for food in unfamiliar areas. Includes:
- Risk-taking
- Impulsiveness
- Rapid decision-making
- Aggression

**The Metabolic Changes**
- Fat production increases dramatically
- Fat burning decreases
- Insulin resistance develops
- Leptin resistance develops
- Weight gain accelerates

**The Vicious Cycle**

Even as you eat more to satisfy hunger, much of it gets converted to fat because:
1. Your mitochondria are damaged by oxidative stress
2. If the food contains fructose, it drops ATP levels even further
3. The cycle continues and intensifies`,
  },
  {
    id: "qs-6",
    title: "Where Does Uric Acid Come From?",
    category: "quickstart",
    summary: "The three main sources of uric acid and their effects.",
    content: `**Where Does Uric Acid Come From?**

While sugar and HFCS are the dominant foods that turn on the survival switch, it can also be activated by high-glycemic carbs, salty foods, and umami foods.

**The Three Main Sources:**

**1. Fructose**
- Sugar (50% fructose, 50% glucose)
- High-fructose corn syrup (55% fructose)
- Fruit juices and dried fruits
- Honey and agave

**2. Alcohol (especially beer)**
- Contains purines that convert to uric acid
- Beer is particularly high
- Alcohol also impairs uric acid excretion

**3. Purines (from meat and fish)**
- Organ meats (liver, kidney)
- Red meats
- Shellfish
- Anchovies and sardines

**Two Metabolic Pathways**

Glucose → Caloric Pathway → Immediate energy (ATP) and stored energy

Fructose → Non-Caloric Pathway → Uric acid → Obesity and metabolic syndrome

**Key Insight:** Uric acid causes obesity and insulin resistance through its effects on mitochondria, not through the calories in the food itself.`,
  },
  {
    id: "qs-7",
    title: "The Body Can Also Make Fructose",
    category: "quickstart",
    summary: "How your body produces fructose internally under stress.",
    content: `**The Body Can Also Make Fructose**

Here's a surprising fact: your body can manufacture its own fructose through the "polyol pathway."

**When the Polyol Pathway Activates:**
- Glucose levels are very high (uncontrolled diabetes)
- You're dehydrated
- Blood pressure is low
- Blood supply is impaired (during heart attack)
- Oxygen is low (at high altitude)
- Uric acid levels are already high
- You've eaten fructose (it triggers more production!)

**Why This Matters**

This means avoiding dietary fructose isn't always enough if you're already metabolically stressed. High blood sugar, dehydration, and stress can all trigger internal fructose production.

**LDL Cholesterol and Fructose**

Cholesterol and LDL don't harm you unless the LDL becomes oxidized. Oxidized LDL is very dangerous because it's:
- Pro-inflammatory
- Pro-atherogenic
- Pro-thrombotic
- Cell-toxic

**Top 3 Foods That Oxidize LDL:**
1. Industrial seed oils and fried foods
2. Sugar and refined carbs
3. Processed and charred meats`,
  },
  {
    id: "qs-8",
    title: "How to Turn Off Your Fat Switch",
    category: "quickstart",
    summary: "The 10 key strategies to deactivate the survival switch.",
    content: `**How to Turn Off Your Fat Switch**

The goal of the 4 Week Diabesity Cure is to turn off the fat switch, increase energy production in your mitochondria, and reverse insulin resistance.

**The 10 Key Strategies:**

**1. Diet (The Green Sheets)**
- Minimize sugar (especially fructose)
- Eat moderate low-glycemic carbs
- Minimize seed oils
- Drink 8 glasses of water daily
- Coffee, tea, and dark chocolate are recommended
- Limit alcohol to 1-2 drinks per week
- No sodas, fruit juice, or dried fruit

**2. Intermittent Fasting**
- 16/8 schedule (16 hours fasting, 8 hours eating)
- Eat dinner early, breakfast late

**3. Sleep**
- 7 hours minimum per night
- No blue light 2 hours before bed

**4. Stress Management**
- Abdominal breathing
- Meditation

**5. Natural Sunlight**
- 1-2 hours minimum each day

**6. Hormesis**
- Hot/cold exposure
- Fasting/feasting cycles

**7. Heart-Brain Coherence**
- HeartMath techniques

**8. Exercise**
- Zone 2 training (able to talk while exercising)
- At least 1 hour/day, 5 days/week

**9. Nutraceuticals**
- Vitamin C, Omega-3, MitoQ, Urolithin A

**10. Medical Support**
- Peptides, bioregulators, hormones as needed`,
  },
  {
    id: "qs-9",
    title: "What Causes Insulin Resistance?",
    category: "quickstart",
    summary: "Carbohydrates, not fat, are the problem.",
    content: `**What Causes Insulin Resistance?**

Carbohydrates, not fat, are the problem!

**How Carb Intake Affects Your Health:**
- 0g carbs/day: Lose body fat, ideal body composition
- 50g: Keto zone
- 100g: Paleo, easy weight maintenance
- 150-200g: Start of cardiometabolic disease
- 250g+: Slow weight gain
- 300g+: Severe cardiometabolic disease
- 350g+: Extreme metabolic dysfunction

**Why Healthy Fat is Key:**
1. Fat does NOT raise insulin levels
2. Fat keeps you full (satiated)
3. Fat makes you thin!
4. Fat improves the taste of food

**The Insulin Response:**

When you eat carbohydrates:
- Your body breaks them down into simple sugars
- Blood sugar rises
- Insulin is released
- Cells become resistant over time
- More insulin is needed
- Fat storage increases
- Inflammation spreads

**The Three Drivers of Insulin Resistance:**
1. Sugar (especially fructose)
2. Grains
3. Seed oils (processed food)`,
  },
  {
    id: "qs-10",
    title: "Quit Sugar",
    category: "quickstart",
    summary: "Why sugar is the most toxic part of our diet.",
    content: `**Quit Sugar**

According to Dr. Robert Lustig, sugar is pure poison. Every time you eat sugary food, your insulin spikes, then crashes, triggering cravings for more sugar.

**Sugar Facts:**
- 1 teaspoon of sugar = 4 grams of carbs
- Average American consumes 20-22 teaspoons per day
- WHO recommends max 6 tsp/day for women, 9 tsp/day for men

**Hidden Sugar Examples:**
- 12oz Coke/Pepsi: 40g carbs (10 tsp sugar)
- Basmati rice serving: 40g carbs (10 tsp)
- Medium banana: 28g carbs (7 tsp)
- Glass of OJ: 28g carbs (7 tsp)
- Mars Bar: 64g carbs (16 tsp)

**How Fructose Damages You:**

The fructose in sugar is metabolized primarily in the liver. When it hits the liver in sufficient quantity and speed, the liver converts most of it to fat.

This induces insulin resistance - the underlying cause of obesity, diabetes, and most chronic disease.

**Hidden Names for Sugar:**
- Corn syrup, dextrose, fructose
- Glucose, lactose, maltose
- Sucrose, syrup

Added sugars are in more than 80% of processed foods.`,
  },
  {
    id: "qs-11",
    title: "Go Grain Free",
    category: "quickstart",
    summary: "Why grains are a modern health problem.",
    content: `**Go Grain Free**

Since the Agricultural Revolution, grains have become a cheap staple of the Western diet. But this was only 10,000 years ago - just 400 generations in our 2.5 million year history.

**The Problem with Grains:**

When you eat anything containing carbohydrates, your body breaks them down into simple sugars and releases them into the bloodstream. This leads to insulin spikes.

**Grains cause:**
- Underlying inflammation throughout the body
- Accelerated aging
- Chronic disease development

**Additional Issues:**

**Phytic Acid**
- Prevents absorption of calcium, magnesium, and iron
- Hurts bone health

**Leaky Gut**
- Gaps occur in the intestinal membrane
- Undigested food and bacteria leak into bloodstream
- Triggers autoimmune disorders

**Average American Consumption:**
- 140 lbs of sugar each year
- 200 lbs of grains each year
- 5,000 teaspoons of seed oils each year

**Foods to Avoid:**
Breads, pasta, cereals, pastries, cakes, muffins, pancakes, crackers`,
  },
  {
    id: "qs-12",
    title: "Beware Adulterated Plant Oils",
    category: "quickstart",
    summary: "Why seed oils are destroying our health.",
    content: `**Beware Adulterated Plant Oils**

Industrial seed oils are one of the most damaging additions to our modern diet, especially when heated.

**Saturated vs. Unsaturated Fats**

Saturated fats have each carbon molecule linked ("saturated") with hydrogen. When heated, the molecules remain stable and won't become oxidized or rancid.

**Seed oils (polyunsaturated)** are chemically fragile and prone to oxidation. When consumed - especially fried or reheated - they generate lipid peroxides that directly promote LDL oxidation.

**Seed Oils to Avoid:**
- Soybean oil
- Corn oil
- Canola oil
- Sunflower oil
- Safflower oil
- Cottonseed oil

**Safe Cooking Oils:**
- Butter
- Ghee
- Lard
- Coconut oil
- Avocado oil
- Tallow

**Note:** High-quality virgin olive oil is ideal for cold dishes like salad dressings, but shouldn't be heated to high temperatures.`,
  },
  {
    id: "qs-13",
    title: "The I.N.T.E.G.R.A.L. Approach",
    category: "quickstart",
    summary: "The complete framework for reversing insulin resistance.",
    content: `**The I.N.T.E.G.R.A.L. Approach to Health**

We use a "whole person" approach to reverse insulin resistance:

**I = Inflammation Control**
- Silent inflammation attacks the endothelium (blood vessel lining)
- Major cause: changes in our food supply over 50 years
- Solution: Paleo or Keto diet, stress control

**N = Nutrition & Metabolism**
- Accounts for 70% of your health
- Avoid sugar, grains, seed oils
- Try intermittent fasting (16/8)

**T = Toxins & Cancer Reduction**
- Cancer is a metabolic disease
- Sugar feeds cancer cells
- Reduce toxic load from environment

**E = Exercise & Sleep**
- Exercise adds 6-7 years to lifespan
- Sleep is more important for fat loss than exercise
- Need 7-8 hours of deep, uninterrupted sleep

**G = Gut Microbiome**
- 80% of immune system surrounds your gut
- Eat fermented foods and 35g fiber daily
- Avoid antibiotics when possible

**R = Restoration of Hormones**
- Hormones are the "juice of life"
- Restore to levels of a healthy 35-year-old
- Consider bioidentical hormone replacement

**A = Adequate Supplements**
- Core: Vitamin D3, Magnesium, Omega-3
- Targeted supplements for specific needs

**L = Lifetime Mindfulness**
- Stress kills
- Practice meditation and breathing exercises
- Heart Rate Variability training`,
  },
  {
    id: "qs-14",
    title: "Your 12-Week Monitoring Guide",
    category: "quickstart",
    summary: "How to track your progress through the program.",
    content: `**Step 3: Monitoring**

Use the 12-week journal to track your progress. This is an important part of reversing insulin resistance.

**What to Track:**
- Weight
- Body fat percentage
- Measurements (waist-to-height ratio)
- Labs (repeat at 12 weeks)
- Daily food journal
- Optional: Continuous Glucose Monitor (CGM)

**Continuous Glucose Monitoring**

A CGM provides valuable information about how your blood sugar responds to different foods. The Lingo by Abbott is available over the counter. Using it for just one month is often enough.

**The 4 Primary Hallmarks of Aging:**

1. **Nutrient Sensing** (what you eat)
   - Information turning on longevity genes or killer genes

2. **Microbiome**
   - Affected by diet
   - 2 billion year relationship with mitochondria

3. **Mitochondria**
   - Make 88 lbs of energy (ATP) daily
   - Most important signaling molecules

4. **Chronic Inflammation**
   - Drives the diseases of civilization

**The Elephant in the Room:**
80% of disease seen by doctors worldwide is cardio-metabolic disease. Most people don't know this global pandemic is due to insulin resistance.`,
  },
  {
    id: "qs-15",
    title: "Top 10 Healthy Lifestyle Tips",
    category: "quickstart",
    summary: "The essential daily practices for metabolic health.",
    content: `**Top 10 Healthy Lifestyle Tips**

Follow these guidelines to reverse insulin resistance and optimize your health:

**1. Stop Eating the Three Villains**
Eliminate sugars, seed oils, and grains. Eat mostly healthy fat and protein every day.

**2. Practice Intermittent Fasting**
Use the 16/8 protocol for best results - 16 hours fasting, 8 hours eating window.

**3. Cook with Safe Oils**
Only use butter, ghee, coconut oil, avocado oil, or tallow for cooking.

**4. Avoid Processed Foods**
Eliminate processed foods and everyday toxins to decrease inflammation.

**5. Exercise Daily**
Goal: Work up to 100 pushups, 100 squats, 100 sit-ups (in sets of 10, 20, 30, 50).

**6. Prioritize Sleep**
Get minimum 7 hours per day. Add 5,000 IU Vitamin D3 and 500mg magnesium at bedtime.

**7. Get Sunlight**
Get direct sunlight every day. Aim for a 40-minute walk outside.

**8. Optimize Hormones**
Restore all hormones to optimum levels. Have regular sex.

**9. Protect Your Gut**
Avoid deadly disruptions to the gut microbiome from antibiotics, artificial sweeteners, and processed foods.

**10. Manage Stress**
Practice mindfulness and eliminate stress through meditation, breathing exercises, and Heart-Math techniques.

**Remember:** The sum is greater than the parts. Following all these practices together creates powerful synergy for healing.`,
  },
  {
    id: "gs-1",
    title: "Green Foods - Your Foundation",
    category: "greensheets",
    summary: "Complete guide to foods that support metabolic health.",
    content: `**Green Foods = Metabolic Support**

These foods help stabilize blood sugar and support fat burning.

**Proteins:**
- Eggs (any style)
- Fish (salmon, sardines, mackerel)
- Poultry (chicken, turkey)
- Beef and lamb (grass-fed when possible)
- Shellfish

**Vegetables:**
- Leafy greens (spinach, kale, lettuce)
- Cruciferous (broccoli, cauliflower, cabbage)
- Above-ground vegetables (zucchini, peppers, tomatoes)
- Mushrooms
- Asparagus, green beans

**Healthy Fats:**
- Olive oil (extra virgin)
- Avocados
- Nuts (almonds, walnuts, macadamia)
- Seeds (chia, flax, pumpkin)
- Butter and ghee

**Beverages:**
- Water (still or sparkling)
- Black coffee
- Unsweetened tea
- Bone broth`,
  },
  {
    id: "gs-2",
    title: "Yellow Foods - Enjoy in Moderation",
    category: "greensheets",
    summary: "Foods to include carefully in your metabolic reset.",
    content: `**Yellow Foods = Mindful Choices**

These foods have their place but should be consumed thoughtfully.

**Fruits (best choices):**
- Berries (strawberries, blueberries, raspberries)
- Citrus fruits
- Apples and pears
- Stone fruits in season

**Dairy:**
- Full-fat Greek yogurt
- Hard cheeses
- Heavy cream

**Grains & Legumes:**
- Quinoa
- Lentils
- Black beans
- Steel-cut oats

**Tips for Yellow Foods:**
- Pair with protein or fat to slow absorption
- Eat earlier in the day when possible
- Monitor how you feel after eating
- Track portion sizes`,
  },
  {
    id: "gs-3",
    title: "Red Foods - Limit or Avoid",
    category: "greensheets",
    summary:
      "Foods that can disrupt metabolic health and trigger insulin spikes.",
    content: `**Red Foods = Proceed with Caution**

These foods can spike insulin and stall progress.

**Sugars:**
- Table sugar and honey
- Maple syrup, agave
- Candy and chocolate
- Sweetened beverages

**Refined Carbs:**
- White bread and pasta
- Most breakfast cereals
- Crackers and chips
- Pastries and baked goods

**Processed Foods:**
- Fast food
- Packaged snacks
- Processed meats with fillers
- Ready-made meals

**What to Do:**
- Notice red foods without judgment
- Track them honestly
- Look for patterns (stress eating, time of day)
- Plan green alternatives for cravings`,
  },
  {
    id: "jr-1",
    title: "Journaling for Metabolic Health",
    category: "journal",
    summary: "How to use daily journaling to support your reset.",
    content: `**Why Journal?**

Journaling creates awareness - the foundation of change.

**What to Track:**

1. **Meals & Colors**
   - What you ate
   - The color category
   - How full you felt

2. **Energy Levels**
   - Morning, afternoon, evening
   - After meals
   - During exercise

3. **Symptoms**
   - Hunger patterns
   - Cravings
   - Sleep quality
   - Mood changes

4. **Wins & Challenges**
   - What went well today?
   - What was difficult?
   - What will you try tomorrow?

**Tips:**
- Keep it simple
- Be honest, not perfect
- Look for patterns weekly
- Celebrate progress`,
  },
  {
    id: "faq-1",
    title: "Frequently Asked Questions",
    category: "faq",
    summary: "Answers to common questions about the VitalState program.",
    content: `**Common Questions**

**Q: Why am I feeling tired?**
A: Tiredness often comes from a cellular energy crisis. When you eat fructose (found in sugar, fruit juice, and processed foods), it rapidly depletes ATP - your cells' energy currency. This creates oxidative stress in your mitochondria (your cellular energy factories), making you feel exhausted even when you've eaten plenty. The solution: reduce fructose intake, prioritize protein and healthy fats, and ensure 7-8 hours of quality sleep.

**Q: Why am I always hungry?**
A: Constant hunger is a sign of insulin resistance. When insulin is high, your cells can't access stored fat for energy, so your brain thinks you're starving even when you have plenty of fat reserves. Fructose also blocks leptin (your satiety hormone), so you never feel full. Breaking this cycle requires cutting out fructose and processed carbs to lower insulin and restore normal hunger signals.

**Q: Why can't I lose weight?**
A: High insulin acts like a padlock on your fat cells. When insulin is elevated, you literally cannot burn stored fat - your body stores calories instead of using them. The solution isn't eating less; it's eating differently. Cut fructose and processed carbs to lower insulin, which unlocks your fat stores. Most people see changes in weeks 2-4 of the program.

**Q: What foods should I eat?**
A: Focus on Green Sheet foods (0-5g carbs per 100g): animal proteins (meat, fish, eggs), above-ground vegetables, healthy fats (olive oil, avocado, butter), nuts and seeds, and full-fat dairy. Avoid Red Sheet foods: all grains, bread, pasta, seed oils, sugar, and processed foods. Yellow Sheet foods (limited fruits, some root vegetables) are okay in moderation.

**Q: How does fasting help?**
A: Fasting lowers insulin, which unlocks your fat stores for energy. During a 16-hour fast, your body switches from burning glucose to burning fat. This improves insulin sensitivity, boosts energy, reduces inflammation, and accelerates fat loss. Start with a 16:8 pattern - eat within an 8-hour window and fast for 16 hours (including sleep).

**Q: Why should I avoid sugar?**
A: Sugar (especially fructose) flips your 'fat switch' ON. Unlike glucose, fructose depletes ATP rapidly, creates uric acid, and triggers fat storage mode. It also blocks leptin (satiety hormone), making you constantly hungry. Even 'healthy' sugars like honey, agave, and fruit juice have the same effect. Cutting sugar is the single most important dietary change for metabolic health.

**Q: How long until I see results?**
A: Most people notice increased energy within 1-2 weeks as their cells start producing ATP efficiently again. Weight changes typically begin in weeks 2-4. Full metabolic healing takes 4-12 weeks depending on your starting point. Remember: you're not just losing weight, you're reversing insulin resistance and healing your metabolism.

**Q: Why is sleep important?**
A: One night of poor sleep reduces insulin sensitivity by 25%. Sleep deprivation increases hunger hormones (ghrelin) and decreases satiety hormones (leptin). Growth hormone, essential for fat burning and muscle building, peaks during deep sleep. Aim for 7-8 hours of quality sleep in a cool, dark room. Finish eating 3 hours before bed.

---

**More Questions**

**Q: Do I need to count calories?**
A: No. Focus on food quality and color categories instead. Your body will naturally regulate when given the right fuel.

**Q: What if I have a red day?**
A: Notice it, log it, move on. One day doesn't define your journey. Tomorrow is a new opportunity.

**Q: Can I eat fruit?**
A: Yes, but choose wisely. Berries are best. Pair fruit with protein or fat. Eat earlier in the day.

**Q: Is intermittent fasting required?**
A: It's encouraged but not required. Start with a 12-hour overnight fast and extend gradually if comfortable.

**Q: What about alcohol?**
A: Alcohol is a red category. If you choose to drink, opt for dry wine or spirits without mixers.`,
  },
  {
    id: "faq-2",
    title: "Privacy Policy",
    category: "faq",
    summary: "How VitalState protects your health data and privacy.",
    content: `**VitalState Privacy Policy**

Your privacy matters to us. This policy explains how we collect, use, and protect your personal health information.

---

**What We Collect**

VitalState collects the following information to provide you with personalized health tracking:

- **Profile Information**: Name (optional), date of birth, sex
- **Health Metrics**: Weight, height, waist circumference
- **Health Assessment**: Your answers to the self-assessment questionnaire
- **Activity Data**: Food logs, fasting sessions, journal entries, daily logs
- **Progress Data**: Achievements, library reading progress

---

**How We Store Your Data**

Currently, all your data is stored **locally on your device** using secure storage. This means:

- Your data stays on your phone
- We do not have access to your personal information
- No health data is transmitted to external servers
- Only you can see your health information

---

**Data Security**

We take several measures to protect your data:

- Data is stored in your device's secure storage area
- The app does not share data with third parties
- No tracking or analytics on your health information
- Sensitive logging is automatically redacted

---

**Your Rights**

You have complete control over your data:

- **Access**: View all your data within the app at any time
- **Correction**: Edit your profile and measurements in Settings
- **Deletion**: Permanently delete all data via Profile > Delete All My Data
- **Portability**: Your data belongs to you

---

**Future Updates**

When we add cloud sync features:

- All data transmission will be encrypted
- You will control what data syncs
- You can opt out of cloud features
- We will update this policy and notify you

---

**Contact**

If you have questions about your privacy, please contact VitalState support.

Last updated: January 2026`,
  },
  {
    id: "sci-1",
    title: "The Fat Switch: Why Your Body Stores Fat",
    category: "science",
    summary:
      "Understanding the biological mechanism that controls fat storage.",
    content: `**The "Fat Switch" Concept**

Your body has what researchers call a "survival switch" - a built-in mechanism designed to help you survive periods of food scarcity.

**In nature, this is helpful:** Animals like emperor penguins or hummingbirds can turn this switch on and off seasonally to store fat when needed, then return to normal.

**In modern humans, it's stuck "on":** Our modern diet - particularly sugar, grains, and processed seed oils - has essentially jammed this switch in the activated position, leading to continuous fat storage and metabolic problems.

**The Key Player: Fructose**

When you consume fructose (found in sugar, high-fructose corn syrup, and even made by your body under stress), it triggers a unique metabolic pathway:

- **Energy crisis signal:** Fructose metabolism rapidly depletes ATP (your cells' energy currency) and produces uric acid
- **Mitochondrial stress:** This creates oxidative stress in your cellular energy factories
- **Fat storage mode:** Your body interprets this as starvation and responds by increasing hunger, slowing fat burning, ramping up fat production, and developing insulin resistance

**The Key Insight:** It is not our culture or will power that makes us fat. It is our biology!`,
  },
  {
    id: "sci-2",
    title: "Glucose vs. Fructose: Two Different Pathways",
    category: "science",
    summary: "Why fructose is uniquely damaging to your metabolism.",
    content: `**The Two Pathways**

Your body processes different sugars in fundamentally different ways:

**Glucose (the "safe" pathway):**
- Metabolized by every cell in your body
- Has built-in safety controls
- When ATP (energy) levels start to drop, the system automatically slows down
- Result: ATP levels stay stable, energy production is steady

**Fructose (the "dangerous" pathway):**
- Metabolized almost exclusively in your liver
- Has NO safety controls or feedback mechanisms
- The enzyme fructokinase breaks it down extremely rapidly
- Burns through ATP faster than it can be replenished
- Result: A cellular energy crisis that triggers the "survival switch"

**The Uric Acid Connection**

Here's what happens when fructose metabolism goes into overdrive:

1. ATP breaks down to ADP, then AMP
2. AMP gets metabolized into uric acid
3. Uric acid creates oxidative stress in your mitochondria
4. Damaged mitochondria decrease ATP production and impair fat burning

Think of it like throwing sand in the gears of your cellular factories.`,
  },
  {
    id: "sci-3",
    title: "The Survival Switch Response",
    category: "science",
    summary: "How your body responds when ATP levels crash.",
    content: `**When ATP Levels Crash**

Your body treats low ATP as an emergency starvation situation:

**Immediate responses:**
- Intense hunger - your body thinks you're starving and demands food
- Increased foraging behavior - includes risk-taking, impulsiveness, food obsession
- Cravings - especially for more sugar/fructose

**Metabolic changes:**
- Fat production increases dramatically
- Fat burning decreases
- Insulin resistance develops (cells stop responding to insulin's signals)
- Leptin resistance develops (you can't recognize when you're full)

**The Vicious Cycle**

Even as you eat more food to satisfy the hunger, much of it gets converted to fat rather than energy because:
- Your mitochondria are damaged by oxidative stress
- If the food contains fructose, it drops ATP levels even further
- Eventually ATP recovers, but by then you've stored significant fat

**Why Humans Are Especially Vulnerable**

Two critical evolutionary mutations:
1. **Loss of vitamin C production** (65 million years ago) - makes us more susceptible to oxidative stress
2. **Loss of uricase enzyme** (17 million years ago) - we can't break down uric acid, so we have 3-4x higher levels than other mammals`,
  },
  {
    id: "sci-4",
    title: "The Insulin Resistance Cascade",
    category: "science",
    summary: "How the fat switch leads to chronic disease.",
    content: `**The Core of Metabolic Disease**

This is why the "fat switch" causes so many diseases:

**Stage 1 - Initial damage:**
- Fructose creates uric acid, causing mitochondrial damage
- Cells become insulin resistant (they ignore insulin's signals)

**Stage 2 - Compensation:**
- Pancreas produces MORE insulin to overcome resistance
- Blood sugar stays "normal" but insulin levels skyrocket
- More fat storage, especially visceral (belly) fat

**Stage 3 - System failure:**
- Pancreas can't keep up with insulin demand
- Blood sugar rises (prediabetes to Type 2 diabetes)
- Fatty liver develops
- Inflammation spreads throughout the body

**Stage 4 - Chronic disease:**
- Cardiovascular disease (80% of heart attacks occur in insulin-resistant people)
- Type 2 diabetes
- Alzheimer's (now called "Type 3 diabetes" - brain insulin resistance)
- Cancer (cancer cells thrive on sugar)
- And many more...

**The Good News:** This cascade is reversible with the right dietary changes.`,
  },
  {
    id: "sci-5",
    title: "The Three Dietary Villains",
    category: "science",
    summary: "The main food categories driving metabolic dysfunction.",
    content: `**Three Food Categories Are Particularly Problematic:**

**1. Sugar & High-Fructose Corn Syrup**
- Direct fructose delivery system
- No fiber to slow absorption
- Rapidly overwhelms liver metabolism
- Found in 80% of processed foods

**2. High-Glycemic Carbohydrates**
- White bread, rice, potatoes, etc.
- Cause blood sugar spikes
- Can trigger the polyol pathway (internal fructose production)
- Also spike insulin directly

**3. Industrial Seed Oils**
- Soybean, corn, canola, sunflower oils
- High in omega-6 polyunsaturated fats
- Chemically unstable - oxidize easily when heated
- Create oxidized LDL cholesterol (the truly dangerous kind)
- Add to inflammatory burden

**Your Body Can Also MAKE Fructose**

The "polyol pathway" activates when:
- Blood glucose is very high
- You're dehydrated
- You've eaten fructose (it triggers more internal production!)
- You're under metabolic stress

This means avoiding dietary fructose isn't always enough if you're already metabolically stressed.`,
  },
  {
    id: "sci-6",
    title: "How Eliminating Sugar Heals You",
    category: "science",
    summary: "Week-by-week changes when you stop eating fructose.",
    content: `**What Happens When You Stop Fructose:**

**Week 1-2: Immediate effects**
- Fructokinase enzyme activity drops
- ATP depletion cycles stop
- Uric acid production from fructose metabolism ceases
- Liver can begin clearing existing uric acid

**Week 2-4: Mitochondrial recovery begins**
- Oxidative stress in mitochondria decreases
- Mitochondria start producing ATP efficiently again
- Fat burning machinery starts to reactivate
- Energy levels begin stabilizing (no more energy crashes)

**Month 2-3: Metabolic healing**
- Liver insulin sensitivity improves
- Fatty liver begins to reverse
- Leptin sensitivity returns (you can feel fullness again)
- Hunger signals normalize

**The Mechanism**

Without constant fructose bombardment, your liver shifts from "emergency fat storage mode" back to "normal energy processing mode."

The mitochondria repair themselves because they're no longer being damaged by uric acid-induced oxidative stress.`,
  },
  {
    id: "sci-7",
    title: "How Reducing Carbs Unlocks Fat Burning",
    category: "science",
    summary:
      "The insulin-lowering cascade that restores metabolic flexibility.",
    content: `**The Insulin-Lowering Cascade:**

**Immediate (hours to days):**
- Blood glucose spikes stop
- Pancreas doesn't need to pump out massive insulin doses
- Insulin levels drop by 30-50% within days

**Week 1-2:**
- Cells become more insulin-sensitive
- Glucose gets into cells more efficiently
- Less glucose converted to fat
- Polyol pathway shuts down (body stops making internal fructose)

**Week 2-6:**
- Visceral fat (belly fat) begins mobilizing
- As visceral fat decreases, inflammatory markers drop
- Insulin resistance improves in a positive feedback loop

**Month 2+:**
- HbA1c (3-month blood sugar average) normalizes
- Fasting insulin drops to healthy levels
- Metabolic flexibility returns (can burn both fat and glucose efficiently)

**The Key Insight**

High insulin is like a padlock on your fat cells. When insulin is high, you literally cannot access stored fat for energy. Lowering carbs drops insulin, which unlocks fat burning.

**The Carb Threshold:**
- 50-100g carbs/day: Most people reverse insulin resistance
- 20-50g carbs/day: Ketosis begins
- <20g carbs/day: Deep ketosis (aggressive approach)`,
  },
  {
    id: "sci-8",
    title: "How Seed Oils Destroy Your Health",
    category: "science",
    summary: "The hidden danger in vegetable oils and processed foods.",
    content: `**The Problem with Seed Oils**

Industrial seed oils (also called vegetable oils) are one of the most damaging additions to our modern diet.

**Common Seed Oils to Avoid:**
- Soybean oil
- Corn oil
- Canola (rapeseed) oil
- Sunflower oil
- Safflower oil
- Cottonseed oil
- Grapeseed oil

**Why They're Harmful:**

1. **High Omega-6 Content**
   - Creates inflammatory imbalance
   - Ideal omega-6 to omega-3 ratio: 1:1 to 4:1
   - Modern diet ratio: 20:1 or higher

2. **Oxidation & Rancidity**
   - These oils are chemically unstable
   - They oxidize easily when heated
   - Oxidized oils create free radicals

3. **Processing Methods**
   - Extracted using hexane (a petroleum solvent)
   - Bleached and deodorized to hide rancidity
   - Nothing natural about "vegetable" oil

**Healthy Alternatives:**
- Extra virgin olive oil (cold dishes or low heat)
- Coconut oil
- Butter and ghee
- Avocado oil (high heat)
- Animal fats (tallow, lard)`,
  },
  {
    id: "sci-9",
    title: "What Happens When We Fast",
    category: "science",
    summary: "The metabolic magic of intermittent fasting.",
    content: `**The Fasting Timeline**

Your body goes through predictable stages when you stop eating:

**Hours 0-4: Fed State**
- Digesting recent meal
- Blood sugar elevated
- Insulin high
- Fat storage mode

**Hours 4-8: Early Fasting**
- Blood sugar normalizes
- Insulin starts dropping
- Body shifts to using stored glycogen

**Hours 8-12: Post-Absorptive**
- Glycogen stores depleting
- Fat burning begins to increase
- Growth hormone starts rising

**Hours 12-18: Fat Burning Zone**
- Insulin at baseline
- Significant fat oxidation
- Ketone production begins
- Autophagy (cellular cleanup) starts

**Hours 18-24: Deep Fasting**
- Strong autophagy
- Enhanced fat burning
- Increased mental clarity
- Cellular repair in high gear

**Key Benefits of Fasting:**
- Lowers insulin resistance
- Promotes fat burning
- Triggers cellular repair (autophagy)
- Reduces inflammation
- Improves mental clarity

**The 16:8 Protocol:**
Fast for 16 hours, eat within an 8-hour window. For most people, this means skipping breakfast or dinner.`,
  },
  {
    id: "sci-10",
    title: "Twelve Tips for Healthy Sleep",
    category: "science",
    summary: "Optimize your sleep for metabolic health and recovery.",
    content: `**Sleep & Metabolic Health**

Poor sleep directly impacts insulin sensitivity and weight. Here are 12 strategies:

**Environment:**
1. **Keep it cool** - 65-68°F (18-20°C) is optimal
2. **Make it dark** - Use blackout curtains or an eye mask
3. **Reduce noise** - White noise or earplugs if needed
4. **Remove screens** - No TV or devices in bedroom

**Timing:**
5. **Consistent schedule** - Same bedtime and wake time daily
6. **Limit naps** - If you nap, keep it under 30 minutes before 3pm
7. **Morning light** - Get bright light exposure within an hour of waking
8. **Evening dimness** - Reduce light 2 hours before bed

**Habits:**
9. **No caffeine after 2pm** - It has a 6-hour half-life
10. **Limit alcohol** - It disrupts deep sleep stages
11. **Finish eating 3 hours before bed** - Digestion interferes with sleep
12. **Wind-down routine** - Reading, stretching, or relaxation exercises

**Why Sleep Matters for Metabolism:**
- One night of poor sleep reduces insulin sensitivity by 25%
- Sleep deprivation increases hunger hormones
- Growth hormone (fat-burning, muscle-building) peaks during deep sleep`,
  },
  {
    id: "sci-11",
    title: "Stress Relief Exercises",
    category: "science",
    summary:
      "Simple techniques to lower cortisol and support metabolic health.",
    content: `**Stress & Your Metabolism**

Chronic stress raises cortisol, which:
- Increases blood sugar
- Promotes belly fat storage
- Triggers cravings for sugar and carbs
- Disrupts sleep

**Quick Stress Relief Techniques:**

**1. Box Breathing (4-4-4-4)**
- Inhale for 4 counts
- Hold for 4 counts
- Exhale for 4 counts
- Hold for 4 counts
- Repeat 4 times

**2. 5-4-3-2-1 Grounding**
- Notice 5 things you can see
- 4 things you can touch
- 3 things you can hear
- 2 things you can smell
- 1 thing you can taste

**3. Progressive Muscle Relaxation**
- Start at your feet
- Tense muscles for 5 seconds
- Release and notice relaxation
- Move up through body

**4. Nature Connection**
- 20 minutes outdoors
- Walk barefoot on grass
- Listen to natural sounds

**5. Movement**
- Walking
- Gentle stretching
- Yoga
- Dancing

**Daily Practice:**
Choose one technique and practice for 5-10 minutes daily. Consistency matters more than duration.`,
  },
  {
    id: "sci-12",
    title: "Nutraceuticals & Supplements",
    category: "science",
    summary: "Supportive supplements for metabolic health.",
    content: `**Supplements That Support Metabolic Health**

While food comes first, certain supplements can accelerate healing:

**Core Supplements:**

1. **Vitamin D3**
   - Most people are deficient
   - Supports insulin sensitivity
   - Dose: 2,000-5,000 IU daily

2. **Magnesium**
   - Essential for 300+ enzymatic reactions
   - Supports blood sugar regulation
   - Dose: 200-400mg (glycinate or citrate)

3. **Omega-3 Fish Oil**
   - Reduces inflammation
   - Supports brain and heart health
   - Look for EPA+DHA: 1-2g daily

4. **Berberine**
   - Natural blood sugar support
   - Activates AMPK pathway
   - As effective as some medications

**Supportive Supplements:**

5. **Alpha Lipoic Acid (ALA)**
   - Antioxidant support
   - Helps with nerve health

6. **Chromium**
   - Supports insulin function
   - May reduce cravings

7. **B Vitamins (B-Complex)**
   - Energy metabolism
   - Nerve function

**Important Notes:**
- Consult your healthcare provider
- Quality matters - choose reputable brands
- Supplements support, not replace, good nutrition`,
  },
  {
    id: "sci-13",
    title: "Nature Wants Us To Be Fat",
    category: "science",
    summary: "Understanding the evolutionary basis of metabolic dysfunction.",
    content: `**The Survival Advantage**

Why would nature design us to gain weight so easily? Because for most of human history, storing fat was essential for survival.

**The Seasonal Fat Cycle:**

In nature, many animals follow a predictable pattern:
- **Fall:** Eat abundantly, gain fat for winter
- **Winter:** Live off stored fat, stay warm
- **Spring:** Fat depleted, return to lean state

Humans evolved the same mechanism. Our ancestors:
- Found ripe fruit in late summer/fall
- The fructose triggered fat storage
- They survived winter on stored reserves

**The Modern Problem:**

Today, we have:
- Unlimited access to fructose (sugar) year-round
- No winter famine to deplete fat stores
- A survival switch that's ALWAYS on

**Key Insight from Dr. Richard Johnson:**

"We are not fat because we eat too much and exercise too little. We eat too much and exercise too little because we are activating our fat switch."

The cause and effect are reversed from what we've been told.

**The Solution:**

Understanding that our biology - not our willpower - is driving weight gain is liberating. We can work WITH our biology by:
- Avoiding fructose to turn off the switch
- Using intermittent fasting to access stored fat
- Eating whole foods our ancestors would recognize`,
  },
];

// =============================================
// MAIN COMPONENT
// =============================================
export default function LibraryPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  const filteredResources = LIBRARY_CONTENT.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const [showUpgradePopup, setShowUpgradePopup] = useState(false);

  const [isPremium, setIsPremium] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

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

  // =============================================
  // Handle item click - PDF or detail view
  // =============================================
  // const handleItemClick = (item: LibraryItem) => {
  //   if (!isPremium && PDF_PAGE_MAP[item.id]) {
  //     setShowUpgradePopup(true);
  //     return;
  //   }
  //   if (PDF_PAGE_MAP[item.id]) {
  //     openPdfAtPage(item.id);
  //   } else {
  //     setSelectedItem(item);
  //   }
  // };

  const handleItemClick = async (item: LibraryItem) => {
    if (!isPremium && PDF_PAGE_MAP[item.id]) {
      setShowUpgradePopup(true);
      return;
    }
    // ✅ Track article read BEFORE opening
    await trackLibraryRead(item.id);

    const mapping = PDF_PAGE_MAP[item.id];

    if (mapping) {
      navigate("/pdf-viewer", {
        state: {
          pdf: mapping.pdf,
          page: mapping.page,
          title: item.title,
        },
      });
    } else {
      setSelectedItem(item);
    }
  };

  // =============================================
  // DETAIL VIEW (for items without PDF mapping)
  // =============================================
  if (selectedItem) {
    return (
      <div className="library-detail-wrapper">
        <div className="detail-header">
          <button className="back-button" onClick={() => setSelectedItem(null)}>
            <ArrowLeft size={18} />
            Back to Library
          </button>

          <div className="category-badge">
            <Tag size={14} />
            {selectedItem.category}
          </div>
        </div>

        <div className="detail-card">
          <h1 className="detail-title">{selectedItem.title}</h1>
          <p className="detail-summary">{selectedItem.summary}</p>

          <div className="detail-divider" />

          <div className="library-content">
            <ReactMarkdown>{selectedItem.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  // =============================================
  // LIST VIEW
  // =============================================

  const TOTAL_LIBRARY_ARTICLES = LIBRARY_CONTENT.length;

  async function trackLibraryRead(itemId: string) {
    try {
      const storedUser = localStorage.getItem("userData");
      if (!storedUser) return;

      const parsedUser = JSON.parse(storedUser);
      const recordId = parsedUser.id;
      if (!recordId) return;

      const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
      const tableName = import.meta.env.VITE_AIRTABLE_USERS;
      const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;

      const headers = {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      };

      // 1) Get current read progress from Airtable
      const getRes = await fetch(
        `https://api.airtable.com/v0/${baseId}/${tableName}/${recordId}`,
        { headers },
      );

      if (!getRes.ok) {
        console.error("Failed to fetch library progress");
        return;
      }

      const userData = await getRes.json();

      let existingIds: string[] = [];

      try {
        const rawIds = userData?.fields?.LibraryReadIds;
        if (rawIds) {
          existingIds = JSON.parse(rawIds);
          if (!Array.isArray(existingIds)) existingIds = [];
        }
      } catch {
        existingIds = [];
      }

      // 2) Only add if not already read
      if (!existingIds.includes(itemId)) {
        existingIds.push(itemId);
      }

      const uniqueIds = [...new Set(existingIds)];
      const readCount = uniqueIds.length;

      const curiousMind = readCount >= 1;
      const knowledgeSeeker = readCount >= 10;
      const healthScholar = readCount >= TOTAL_LIBRARY_ARTICLES;

      // 3) Update Airtable
      const updateRes = await fetch(
        `https://api.airtable.com/v0/${baseId}/${tableName}/${recordId}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            fields: {
              LibraryReadIds: JSON.stringify(uniqueIds),
              LibraryReadCount: readCount,
              "Curious Mind": curiousMind,
              "Knowledge Seeker": knowledgeSeeker,
              "Health Scholar": healthScholar,
            },
          }),
        },
      );

      if (!updateRes.ok) {
        const err = await updateRes.text();
        console.error("Failed to update library progress:", err);
        return;
      }

      console.log("Library progress updated successfully");
    } catch (error) {
      console.error("Error tracking library read:", error);
    }
  }
  return (
    <>
      <div className="library">
        <div className="library-search">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-tab ${
                activeCategory === category.id ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {isPageLoading ? (
          <div className="loading-state">
            <p>Loading library...</p>
          </div>
        ) : (
          <div className="resources-list">
        {filteredResources.map((item) => {
          const pdfLabel = getPdfLabel(item.id);

          return (
            <div
              key={item.id}
              className="resource-card"
              onClick={() => handleItemClick(item)}
            >
              <div className="resource-left">
                <div className="resource-icon">
                  {pdfLabel ? (
                    <FileText size={20} />
                  ) : item.category === "quickstart" ? (
                    <Zap size={20} />
                  ) : (
                    <BookOpen size={20} />
                  )}
                </div>

                <div>
                  <h3>
                    {item.title}
                    {pdfLabel && (
                      <span
                        className={`pdf-badge ${
                          pdfLabel === "Resources"
                            ? "pdf-badge-resources"
                            : "pdf-badge-quickstart"
                        }`}
                      >
                        {pdfLabel}
                      </span>
                    )}
                  </h3>
                  <p>{item.summary}</p>
                </div>
              </div>

              <ChevronRight size={20} />
            </div>
          );
        })}
      </div>
        )}
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
              You’re currently on the <strong>Free Plan</strong>. Upgrade to
              access all health insights, detailed scoring, and personalized
              recommendations.
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
    </>
  );
}
