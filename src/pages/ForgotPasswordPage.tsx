import { useState } from "react";
import { Mail, KeyRound, Lock } from "lucide-react";
import Button from "../components/Button";
import "./AuthPage.css";
import { useNavigate } from "react-router-dom";
import bcrypt from 'bcryptjs'
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
  const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
  const TABLE = import.meta.env.VITE_AIRTABLE_USERS;
  const WEBHOOK = import.meta.env.VITE_FORGETPASSWORD_WEBHOOK_URL;

  /* ===============================
     1️⃣ SEND OTP → Make.com
  ================================ */
  const sendOtp = async () => {
    if (!email) return toast.error("Enter email");

    setLoading(true);
    setMessage("");

    try {
      // 1️⃣ Check if email exists in Airtable
      const formula = `{Email}='${email}'`;

      const res = await fetch(
        `https://api.airtable.com/v0/${BASE_ID}/${TABLE}?filterByFormula=${encodeURIComponent(formula)}&fields[]=Email`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        },
      );

      const data = await res.json();

      // ❌ If no user found
      if (!data.records.length) {
        setLoading(false);
        toast.error("Email not found");
        return;
      }

      // 2️⃣ If email exists → Send OTP webhook
      await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setStep(2);
      setMessage("OTP sent to your email");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  /* ===============================
     2️⃣ VERIFY OTP → Airtable
  ================================ */
  const verifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP");

    setLoading(true);

    const formula = `AND({Email}='${email}', {OTP}='${otp}')`;

    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE}?filterByFormula=${encodeURIComponent(formula)}&fields[]=Email`,
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
      },
    );

    const data = await res.json();

    setLoading(false);

    if (data.records.length > 0) {
      setStep(3);
      setMessage("OTP verified ✔");
    } else {
      toast.error("Invalid OTP");
    }
  };

  /* ===============================
     3️⃣ UPDATE PASSWORD
  ================================ */
  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    const formula = `{Email}='${email}'`;

    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE}?filterByFormula=${encodeURIComponent(formula)}`,
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
      },
    );

    const data = await res.json();

    if (!data.records.length) {
      setLoading(false);
      toast.error("User not found");
      return;
    }

    const recordId = data.records[0].id;
    // 2️⃣ HASH PASSWORD BEFORE SAVING
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE}/${recordId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Password: hashedPassword,
          OTP: "",
        },
      }),
    });

    setLoading(false);
    setStep(4);
    setMessage("Password updated successfully 🎉");
    navigate("/");
  };

  return (
    <div className="auth-page">
      {/* LEFT SIDE — FORM */}
      <div className="auth-left">
        <div className="auth-form-container">
          <div className="auth-header">
            <img src="/icon.png" alt="VitalState" className="auth-logo" />
            <h1>Reset your password</h1>
            <p>Enter your email to receive a verification code</p>
          </div>

          <div className="auth-form">
            {/* STEP 1 — EMAIL */}
            {step === 1 && (
              <div className="form-group">
                <label>Email address</label>
                <div className="input-wrapper">
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Button fullWidth onClick={sendOtp} disabled={loading}>
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
              </div>
            )}

            {/* STEP 2 — OTP */}
            {step === 2 && (
              <div className="form-group">
                <label>Enter OTP</label>
                <div className="input-wrapper">
                  <KeyRound size={20} className="input-icon" />
                  <input
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>

                <Button fullWidth onClick={verifyOtp} disabled={loading}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
              </div>
            )}

            {/* STEP 3 — NEW PASSWORD */}
            {step === 3 && (
              <>
                <div className="form-group">
                  <label>New Password</label>
                  <div className="input-wrapper">
                    <Lock size={20} className="input-icon" />
                    <input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="input-wrapper">
                    <Lock size={20} className="input-icon" />
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <Button fullWidth onClick={updatePassword} disabled={loading}>
                  {loading ? "Updating..." : "Save New Password"}
                </Button>
              </>
            )}

            {/* SUCCESS */}
            {step === 4 && (
              <p style={{ color: "green" }}>
                Password changed successfully. You can now sign in.
              </p>
            )}

            {message && <p style={{ marginTop: 12 }}>{message}</p>}
          </div>
          {/* 🔐 SIGN IN BUTTON */}
          <div className="auth-switch">
            <p>
              Remember your password?{" "}
              <button onClick={() => navigate("/")}>Sign in</button>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — SAME VISUAL */}
      <div className="auth-right">
        <div className="auth-visual">
          <h2>Secure account recovery</h2>
          <p>We'll help you regain access quickly and safely.</p>

          <div className="visual-features">
            <div className="visual-feature">
              <span className="check">✓</span>
              One-time secure code
            </div>
            <div className="visual-feature">
              <span className="check">✓</span>
              Fast verification
            </div>
            <div className="visual-feature">
              <span className="check">✓</span>
              Safe password reset
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
