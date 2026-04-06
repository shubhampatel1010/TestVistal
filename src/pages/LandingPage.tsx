import { Link } from 'react-router-dom'
import { Activity, CheckCircle, Heart, ArrowRight, Leaf, TrendingUp, Users } from 'lucide-react'
import Button from '../components/Button'
import './LandingPage.css'

const features = [
  {
    icon: Activity,
    title: 'Understand your body',
    description: 'Learn how your metabolism works and take control of your fat switch with science-backed insights.'
  },
  {
    icon: CheckCircle,
    title: 'No calorie counting',
    description: 'Focus on making simple, sustainable daily choices instead of obsessing over numbers.'
  },
  {
    icon: Heart,
    title: 'One day at a time',
    description: 'Build lasting habits with a supportive approach that celebrates every small win.'
  }
]

const benefits = [
  {
    icon: Leaf,
    title: 'Whole Food Focus',
    description: 'Discover which foods support your metabolic health with our color-coded food guide.'
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Log your daily choices and watch your healthy habits grow over time.'
  },
  {
    icon: Users,
    title: 'Expert Guidance',
    description: 'Access a library of resources to deepen your understanding of metabolic health.'
  }
]

export default function LandingPage() {
  return (
    <div className="landing">
      <header className="landing-header">
        <div className="container header-content">
          <div className="logo-section">
            <img src="/icon.png" alt="VitalState" className="header-logo" />
            <span className="header-title">VitalState</span>
          </div>
          <div className="header-actions">
            <Link to="/auth" className="login-link">Log in</Link>
            <Link to="/auth">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Start your<br />
              <span className="highlight">metabolic reset</span>
            </h1>
            <p className="hero-subtitle">
              Take control of your health with VitalState. No calorie counting, 
              no complicated rules - just simple daily choices that lead to lasting change.
            </p>
            <div className="hero-cta">
              <Link to="/auth">
                <Button size="lg">
                  Get Started Free
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <p className="cta-note">No credit card required</p>
            </div>
          </div>
          <div className="hero-visual">
            <div className="feature-cards">
              {features.map((feature, index) => (
                <div key={feature.title} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="feature-icon">
                    <feature.icon size={24} />
                  </div>
                  <div className="feature-content">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="benefits">
        <div className="container">
          <h2 className="section-title">Everything you need to succeed</h2>
          <p className="section-subtitle">
            VitalState gives you the tools and knowledge to make lasting changes to your health.
          </p>
          <div className="benefits-grid">
            {benefits.map(benefit => (
              <div key={benefit.title} className="benefit-card">
                <div className="benefit-icon">
                  <benefit.icon size={28} />
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to transform your health?</h2>
            <p>Join thousands of others who have taken control of their metabolic health.</p>
            <Link to="/auth">
              <Button size="lg" variant="outline">
                Start Your Journey
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container footer-content">
          <div className="footer-logo">
            <img src="/icon.png" alt="VitalState" />
            <span>VitalState</span>
          </div>
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} VitalState. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
