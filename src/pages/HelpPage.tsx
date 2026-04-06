import { useState, useEffect } from 'react'
import { HelpCircle, Mail, AlertCircle, Smartphone, Grid, Clock, Edit3, Info, Zap, Package, ChevronDown, ChevronUp } from 'lucide-react'
import './HelpPage.css'
import { useNavigate } from 'react-router-dom'

interface FAQ {
  id: string
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'What is the Green/Yellow/Red food system?',
    answer: 'Foods are color-coded based on their impact on insulin resistance. Green foods (unlimited) have 0-5g carbs per 100g and help turn off your fat switch. Yellow foods (limited) have 6-25g carbs and should be eaten in moderation. Red foods (avoid) activate your fat switch and promote insulin resistance.'
  },
  {
    id: 'faq-2',
    question: 'How does the 16:8 fasting schedule work?',
    answer: 'You fast for 16 hours and eat within an 8-hour window. For example, if you finish dinner at 8 PM, you wouldn\'t eat again until 12 PM the next day. During fasting, you can drink water, black coffee, or plain tea.'
  },
  {
    id: 'faq-3',
    question: 'How do I track my meals?',
    answer: 'Go to the Log tab and tap the food color tiles (Green, Yellow, Red) to log each meal. You can add notes, track portions, and see your daily summary. The app helps you aim for more green foods and fewer red foods.'
  },
  
  {
    id: 'faq-5',
    question: 'How is my health score calculated?',
    answer: 'Your health score is based on your insulin resistance assessment answers. It considers factors like weight distribution, energy levels, cravings, and other metabolic health indicators. Complete the health assessment in your profile to get your score.'
  }
]

const essentialSupport = [
  {
    id: 'faq',
    icon: HelpCircle,
    title: 'Frequently Asked Questions',
    description: 'View common questions below'
  },
  {
    id: 'contact',
    icon: Mail,
    title: 'Contact Us',
    description: 'info@myvitalstate.com'
  },
  {
    id: 'report',
    icon: AlertCircle,
    title: 'Report a Problem',
    description: 'Send us a bug report'
  }
]

const appGuidance = [
  {
    id: 'how-to',
    icon: Smartphone,
    title: 'How to Use the App',
    description: 'Quick walkthrough of main features',
    content: '1. LOG your meals using the color tiles (Green/Yellow/Red)\n\n2. TRACK your fasting with the timer on Home\n\n3. MONITOR your progress with daily logs\n\n4. LEARN from the Library articles\n\n5. EARN badges by staying consistent!'
  },
  {
    id: 'food-colors',
    icon: Grid,
    title: 'Understanding Food Colors',
    description: 'Learn the Green/Yellow/Red system',
    content: 'GREEN (Unlimited)\nAnimal proteins, healthy fats, above-ground veggies, nuts & seeds. 0-5g carbs/100g.\n\nYELLOW (Limited)\nFruits with limits, some root vegetables. 6-25g carbs/100g.\n\nRED (Avoid)\nGrains, bread, sugar, seed oils, processed foods. These activate your fat switch.'
  },
  {
    id: 'fasting',
    icon: Clock,
    title: 'Fasting Timer Guide',
    description: 'Master the 16:8 intermittent fasting',
    content: 'The 16:8 Method:\n\n- Fast for 16 hours\n- Eat within 8 hours\n\nExample Schedule:\n- Stop eating at 8 PM\n- Start eating at 12 PM next day\n\nDuring fasting, you can have:\n- Water\n- Black coffee\n- Plain tea'
  },
  {
    id: 'tracking',
    icon: Edit3,
    title: 'Tracking Tips',
    description: 'Best practices for logging',
    content: '- Log meals right after eating\n\n- Be honest with food colors\n\n- Track water intake daily\n\n- Complete your daily log before bed\n\n- Review weekly trends in Track\n\n- Celebrate small wins!'
  }
]

const programResources = [
  {
    id: 'about',
    icon: Info,
    title: 'About the Program',
    description: 'The Diabesity Reversal approach',
    content: 'VitalState is based on the 4-Week Diabesity Cure Program by Dr. Graham Simpson M.D.\n\nKey Concepts:\n- The Fat Switch & Survival Switch\n- Insulin Resistance reversal\n- The I.N.T.E.G.R.A.L. Approach\n\nThe program uses the Green/Yellow/Red food system, intermittent fasting, and lifestyle changes to help reset your metabolism.'
  },
  {
    id: 'quickstart',
    icon: Zap,
    title: 'Quick Start Guide',
    description: 'Get started with the program',
    content: 'Week 1-2: Foundation\n- Eliminate red foods\n- Start 14:10 fasting\n- Drink 8 glasses of water\n\nWeek 3-4: Acceleration\n- Progress to 16:8 fasting\n- Focus on green foods\n- Add movement'
  },
  {
    id: 'supplements',
    icon: Package,
    title: 'Supplement Information',
    description: 'Recommended supplements',
    content: 'The program may recommend supplements such as:\n\n- Magnesium\n- Vit D3 & K2\n- Telovite (Multi-vitamin)\n- Metabolic Support ( Berberine)\n\nAlways consult your healthcare provider before starting any supplement regimen.'
  },
  {
  id: 'WhatsIncluded',
  icon: Package,
  title: 'Whats Included',
  description: 'Everything you need to start and track your Diabesity reversal journey.',
  content: 'What\'s Included:\n\n- HFLC Nutritional Green Sheets. Food to eat, food to limit, food to cut out\n- 4 Week Diabesity Cure Book\n- Lab test – Large Diabesity Panel\n- Definitive Insulin Resistance score (calculated)\n- 90-day supply of Dr Simpsons’s recommended supplements\n- Tape Measure\n- Smart Body Fat Scale\n- 12 week Diabesity Journal\n- 4 week Diabesity Cure (quickstart guide)'
}
]

export default function HelpPage() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null)
  const navigate = useNavigate()

  const toggleFaq = (id: string) => {
    setExpandedFaq(prev => prev === id ? null : id)
  }

  const toggleGuide = (id: string) => {
    setExpandedGuide(prev => prev === id ? null : id)
  }

  const handleContact = (subject?: string) => {
    const email = 'info@myvitalstate.com'
    const mailtoUrl = subject
      ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
      : `mailto:${email}`
    window.open(mailtoUrl, '_blank')
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
    <div className="help-page">
      <div className="help-header">
        <h1>Help & Support</h1>
        <p>Find answers and get the support you need</p>
      </div>

      <section className="help-section">
        <h2>Essential Support</h2>
        <div className="support-grid">
          {essentialSupport.map(item => (
            <div
              key={item.id}
              className="support-card"
              onClick={() => {
                if (item.id === 'contact') handleContact()
                else if (item.id === 'report') handleContact('VitalState Bug Report')
              }}
            >
              <div className="support-icon">
                <item.icon size={24} />
              </div>
              <div className="support-content">
                <span className="support-title">{item.title}</span>
                <span className="support-desc">{item.description}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="help-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map(faq => (
            <div key={faq.id} className={`faq-item ${expandedFaq === faq.id ? 'expanded' : ''}`}>
              <button className="faq-question" onClick={() => toggleFaq(faq.id)}>
                <span>{faq.question}</span>
                {expandedFaq === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {expandedFaq === faq.id && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="help-section">
        <h2>App Guidance</h2>
        <div className="guide-list">
          {appGuidance.map(guide => (
            <div key={guide.id} className={`guide-item ${expandedGuide === guide.id ? 'expanded' : ''}`}>
              <button className="guide-header" onClick={() => toggleGuide(guide.id)}>
                <div className="guide-icon">
                  <guide.icon size={20} />
                </div>
                <div className="guide-info">
                  <span className="guide-title">{guide.title}</span>
                  <span className="guide-desc">{guide.description}</span>
                </div>
                {expandedGuide === guide.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {expandedGuide === guide.id && (
                <div className="guide-content">
                  <p>{guide.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="help-section">
        <h2>Program Resources</h2>
        <div className="guide-list">
          {programResources.map(resource => (
            <div key={resource.id} className={`guide-item ${expandedGuide === resource.id ? 'expanded' : ''}`}>
              <button className="guide-header" onClick={() => toggleGuide(resource.id)}>
                <div className="guide-icon">
                  <resource.icon size={20} />
                </div>
                <div className="guide-info">
                  <span className="guide-title">{resource.title}</span>
                  <span className="guide-desc">{resource.description}</span>
                </div>
                {expandedGuide === resource.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {expandedGuide === resource.id && (
                <div className="guide-content">
                  <p>{resource.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
