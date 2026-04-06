import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./TermsPage.css";

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="terms-container">
      <div className="terms-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
        <h1>Terms & Privacy</h1>
      </div>

      <div className="terms-scroll">
        {/* Disclaimer Box */}
        <div className="disclaimer-box">
          <AlertCircle size={20} className="disclaimer-icon" />
          <p>
            This app is for informational purposes only and is not a substitute
            for professional medical advice, diagnosis, or treatment.
          </p>
        </div>

        <h2>Terms of Service</h2>

        <h4>Medical Disclaimer</h4>
        <ul>
          <li>VitalState provides health information for educational purposes only</li>
          <li>Always consult your physician before starting any diet, fasting, or exercise program</li>
          <li>Do not disregard professional medical advice based on information from this app</li>
          <li>Individual results may vary</li>
          <li>This app is not intended to diagnose, treat, cure, or prevent any disease</li>
        </ul>

        <h4>User Responsibilities</h4>
        <ul>
          <li>You must be at least 18 years old to use this app</li>
          <li>Provide accurate information about yourself</li>
          <li>Use the app only for personal, non-commercial purposes</li>
          <li>Do not share your account with others</li>
          <li>Report any bugs or issues through Help & Support</li>
        </ul>

        <h4>Content Ownership</h4>
        <ul>
          <li>You own your personal health data</li>
          <li>VitalState owns the app, design, and educational content</li>
          <li>The Diabesity Reversal Program content is proprietary</li>
          <li>Do not copy or redistribute program materials</li>
        </ul>

        <h4>Limitation of Liability</h4>
        <ul>
          <li>VitalState is not responsible for health outcomes</li>
          <li>We do not guarantee specific results from using the app</li>
          <li>Use the app and program at your own risk</li>
          <li>We are not liable for any damages arising from app use</li>
        </ul>

        <h4>Account Termination</h4>
        <ul>
          <li>You may delete your account at any time via Profile settings</li>
          <li>We reserve the right to suspend accounts for misuse</li>
          <li>Terms may be updated; continued use constitutes acceptance</li>
        </ul>

        <hr />

        <h2>Privacy Policy</h2>

        <p>
          This policy explains how we collect, use, and protect your personal
          health information.
        </p>

        <h4>What We Collect</h4>
        <ul>
          <li>Profile info: name, email, date of birth, sex</li>
          <li>Health metrics: weight, height, waist measurements</li>
          <li>Activity data: food logs, fasting sessions, journal entries</li>
          <li>Assessment data: health questionnaire responses</li>
          <li>Progress: achievements, reading history, streaks</li>
        </ul>

        <h4>How We Store Your Data</h4>
        <ul>
          <li>All data is stored locally on your device</li>
          <li>We do not have access to your personal information</li>
          <li>No health data is transmitted to external servers</li>
          <li>Future cloud sync will use end-to-end encryption</li>
        </ul>

        <h4>Data Security</h4>
        <ul>
          <li>Data stored in your device's secure storage</li>
          <li>No sharing with third parties</li>
          <li>No tracking or analytics on health information</li>
          <li>Sensitive logging automatically redacted</li>
          <li>Passwords are securely hashed, never stored in plain text</li>
        </ul>

        <h4>Your Rights</h4>
        <ul>
          <li>Access: View all your data within the app</li>
          <li>Correction: Edit your profile and measurements anytime</li>
          <li>Deletion: Delete all data permanently via Profile settings</li>
          <li>Portability: Your data belongs to you</li>
        </ul>

        <h4>Contact Us</h4>
        <p>
          For privacy questions or concerns, contact us at:
          <br />
          info@myvitalstate.com
        </p>

        <p className="last-updated">Last updated: February 2026</p>
      </div>
    </div>
  );
}