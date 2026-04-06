import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./PricingPage.css";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

export default function PricingPage() {
  const navigate = useNavigate();

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

  const handleUpgrade = () => {
  const user = JSON.parse(localStorage.getItem("userData") || "{}");

  if (!user?.email) {
    alert("User not logged in");
    return;
  }

  const checkoutUrl = `https://myvitalstate.com/cart/${import.meta.env.VITE_SHOPIFY_VARIANT_ID}:1?checkout[email]=${user?.email}`;

  // optional email prefill

  window.open(checkoutUrl, "_blank");
};

  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <h1 className="app-name">VitalState</h1>
        <p className="pricing-tagline">
          Unlock your path to achieve optimal metabolic health and live with
          energy, confidence, and vitality.
        </p>
      </div>

      <div className="pricing-card">
        {isPremium ? (
          <>
            {/* ✅ PREMIUM USER CONTENT */}
            <div className="pricing-badge success">Premium Active</div>

            <h2 className="plan-title">You Are a Pro Member 🎉</h2>

            <p className="plan-description">
              Thank you for your one-time purchase. You now have access to all
              premium features of VitalState.
            </p>

            <ul className="features-list">
              <li>
                <CheckCircle size={18} /> Complete health assessment
              </li>
              <li>
                <CheckCircle size={18} /> Advanced metabolic scoring
              </li>

              <li>
                <CheckCircle size={18} /> Unlimited meal & symptom tracking
              </li>
              <li>
                <CheckCircle size={18} /> Progress analytics dashboard
              </li>
            </ul>

            <button
              className="upgrade-button"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </button>
          </>
        ) : (
          <>
            {/* ❌ NON-PREMIUM USER CONTENT */}
            <div className="pricing-badge">Premium Plan</div>

            <h2 className="plan-title">VitalState Pro</h2>

            <div className="price-section">
              <span className="price">$599</span>
              <span className="per-month"> One-Time Payment</span>
            </div>

            <p className="plan-description">
              Designed for serious transformation. Get access to assessments,
              tracking, scoring, and advanced insights with a single payment.
            </p>

            <ul className="features-list">
              <li>
                <CheckCircle size={18} /> Complete health assessment
              </li>
              <li>
                <CheckCircle size={18} /> Advanced metabolic scoring
              </li>

              <li>
                <CheckCircle size={18} /> Unlimited meal & symptom tracking
              </li>
              <li>
                <CheckCircle size={18} /> Progress analytics dashboard
              </li>
            </ul>
             <p className="important-note">
              <strong>Important:</strong> Please use the <strong>same email address</strong>{" "}
              you used during your VitalState payment. If you are a new user and purchased
              Premium, sign up with that same email to activate your account correctly.
            </p>

            <button className="upgrade-button" onClick={handleUpgrade}>
              Unlock Premium – $599 (One-Time)
            </button>

            <p className="secure-note">
              Secure one-time payment • No recurring charges
            </p>
          </>
        )}
      </div>
    </div>
  );
}
