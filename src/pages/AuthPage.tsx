import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Button from "../components/Button";
import "./AuthPage.css";
import bcrypt from 'bcryptjs'
import toast from "react-hot-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
  const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
  const TABLE = import.meta.env.VITE_AIRTABLE_USERS;

  // =========================================================
  // MAIN SUBMIT HANDLER
  // =========================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await handleLogin();
      } else {
        await handleSignup();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  // =========================================================
  // PASSWORD VALIDATION
  // =========================================================
  const isValidPassword = (password: any) => {
    // Minimum 8 chars + at least 1 number
    const regex = /^(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  // =========================================================
  // LOGIN FUNCTION
  // =========================================================
  const handleLogin = async () => {

      // 🔴 PASSWORD VALIDATION
    if (!isValidPassword(formData.password)) {
      toast.error("Password must be at least 8 characters and include at least one number");
      return;
    }
    // 1️⃣ Fetch user ONLY by email
    const filter = `{Email}='${formData.email}'`;

    const response = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE}?filterByFormula=${encodeURIComponent(filter)}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      },
    );

    const data = await response.json();

    if (!data.records || data.records.length === 0) {
      toast.error("User not found");
      return;
    }

    const record = data.records[0];
    const fields = record.fields;

    const hashedPassword = fields.Password;

    // 2️⃣ Compare entered password with hash
    const isMatch = await bcrypt.compare(formData.password, hashedPassword);

    if (!isMatch) {
      toast.error("Invalid password");
      return;
    }

    // 3️⃣ Login success
    const user = {
      id: record.id,
      name: fields.Name,
      email: fields.Email,
      role: fields.Role || "user",
      onboardingCompleted: fields.OnboardingCompleted || false,
      status: fields.Status || "free",
    };

    localStorage.setItem("userData", JSON.stringify(user));

    navigate("/dashboard");
  };

    // =========================================================
    // SIGNUP FUNCTION
    // =========================================================
    const handleSignup = async () => {

      // 🔴 PASSWORD VALIDATION
    if (!isValidPassword(formData.password)) {
      toast.error("Password must be at least 8 characters and include at least one number");
      return;
    }
    // 1️⃣ Check if email exists
    const checkFilter = `{Email}='${formData.email}'`;

    const checkResponse = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE}?filterByFormula=${encodeURIComponent(checkFilter)}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      },
    );

    const checkData = await checkResponse.json();

    if (checkData.records && checkData.records.length > 0) {
      toast.error("Email already registered");
      return;
    }

    // 2️⃣ HASH PASSWORD BEFORE SAVING
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    // 3️⃣ Create user
    const createResponse = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                Name: formData.name,
                Email: formData.email,
                Password: hashedPassword,
                Role: "user",
              },
            },
          ],
        }),
      },
    );

    const createData = await createResponse.json();

    const record = createData.records[0];
    const fields = record.fields;

     // 4️⃣ Trigger Make webhook after signup
    try {
      await fetch("https://hook.us2.make.com/6rqn04kqp8qhr69jbhrbbicxl13oe5eq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          airtableRecordId: record.id,
          name: fields.Name,
          email: fields.Email,
          role: fields.Role,
          onboardingCompleted: fields.OnboardingCompleted || false,
          status: fields.Status || "free",
          signupTime: new Date().toISOString(),
        }),
      });
    } catch (webhookError) {
      console.error("Webhook trigger failed:", webhookError);
      // Optional: don't block signup if webhook fails
    }

    const user = {
      id: record.id,
      name: fields.Name,
      email: fields.Email,
      role: fields.Role,
      onboardingCompleted: fields.OnboardingCompleted || false,
      status: fields.Status || "free",
    };

    localStorage.setItem("userData", JSON.stringify(user));

    toast.success("Account created successfully");

    navigate("/onboarding");
  };

  // =========================================================
  // INPUT CHANGE HANDLER
  // =========================================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-form-container">
          <div className="auth-header">
            <img src="/icon.png" alt="VitalState" className="auth-logo" />
            <h1>{isLogin ? "Welcome back" : "Create account"}</h1>
            <p>
              {isLogin
                ? "Enter your credentials to access your account"
                : "Start your metabolic reset journey today"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* NAME FIELD (SIGNUP ONLY) */}
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Full name</label>
                <div className="input-wrapper">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* EMAIL */}
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <div className="input-wrapper">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <small className="field-note">
    Important*: Please use the same email address you used during your VitalState payment. If you are a new user and purchased Premium, sign up with that same email to activate your account correctly.
  </small>
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* LOGIN OPTIONS */}
            {isLogin && (
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                <a href="/forgot-password" className="forgot-link">
                  Forgot password?
                </a>
              </div>
            )}

            <Button type="submit" fullWidth disabled={loading}>
              {loading
                ? "Please wait..."
                : isLogin
                  ? "Sign In"
                  : "Create Account"}
            </Button>
          </form>

          {/* SWITCH LOGIN / SIGNUP */}
          <div className="auth-switch">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <button onClick={() => setIsLogin(false)}>Sign up</button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button onClick={() => setIsLogin(true)}>Sign in</button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE PANEL */}
      <div className="auth-right">
        <div className="auth-visual">
          <h2>Start your metabolic reset</h2>
          <p>
            Join VitalState and discover a simpler approach to health. No
            calorie counting, no complicated rules — just simple daily choices
            that lead to lasting change.
          </p>

          <div className="visual-features">
            <div className="visual-feature">
              <span className="check">✓</span>
              Personalized food guidance
            </div>
            <div className="visual-feature">
              <span className="check">✓</span>
              Track your daily progress
            </div>
            <div className="visual-feature">
              <span className="check">✓</span>
              Access expert resources
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
