import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

const businessBenefits = [
  {
    title: "List and manage products",
    description: "Create new catalog items, update stock, and keep pricing in sync from one admin workspace."
  },
  {
    title: "Track orders and customers",
    description: "Review orders, update delivery status, and monitor who is buying from your store."
  },
  {
    title: "Run offers and growth campaigns",
    description: "Launch coupons, adjust categories, and control storefront performance without extra tools."
  }
];

function BusinessAccountPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, createBusinessAccount } = useAuth();
  const [setupStarted, setSetupStarted] = useState(false);
  const [activeStep, setActiveStep] = useState("email");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpInput, setEmailOtpInput] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneOtpInput, setPhoneOtpInput] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [formState, setFormState] = useState({
    businessName: "",
    businessType: "",
    phone: user?.phone ?? "",
    gstNumber: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormState((current) => ({
      ...current,
      phone: user?.phone ?? current.phone
    }));
  }, [user?.phone]);

  const handleChange = (event) => {
    setError("");
    setFormState((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const sendEmailOtp = () => {
    const nextOtp = createOtp();
    setEmailOtp(nextOtp);
    setEmailOtpInput("");
    setError("");
  };

  const verifyEmailOtp = () => {
    if (!emailOtpInput.trim()) {
      setError("Enter the email OTP.");
      return;
    }

    if (emailOtpInput.trim() !== emailOtp) {
      setError("The email OTP is not correct.");
      return;
    }

    setEmailVerified(true);
    setActiveStep("phone");
    setError("");
  };

  const sendPhoneOtp = () => {
    if (!formState.phone.trim()) {
      setError("Enter a mobile number first.");
      return;
    }

    const nextOtp = createOtp();
    setPhoneOtp(nextOtp);
    setPhoneOtpInput("");
    setError("");
  };

  const verifyPhoneOtp = () => {
    if (!phoneOtpInput.trim()) {
      setError("Enter the mobile OTP.");
      return;
    }

    if (phoneOtpInput.trim() !== phoneOtp) {
      setError("The mobile OTP is not correct.");
      return;
    }

    setPhoneVerified(true);
    setActiveStep("details");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await createBusinessAccount(formState);
      setActiveStep("finish");
      window.setTimeout(() => {
        navigate("/admin", { replace: true });
      }, 700);
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="business-page">
      <div className="business-hero">
        <div className="business-hero-copy">
          <span className="section-kicker">Business Account</span>
          <h1>Sell with BrightCart from a dedicated business workspace.</h1>
          <p>
            Personal accounts stay customer-first. When you are ready to sell, create a business
            account and unlock the admin tools for products, orders, customers, and offers.
          </p>
          <div className="business-step-row">
            <span className={getStepClassName(setupStarted ? activeStep : "")}>1. Verify</span>
            <span className={getStepClassName(activeStep === "details" || activeStep === "finish" ? "details" : "")}>
              2. Business details
            </span>
            <span className={getStepClassName(activeStep === "finish" ? "finish" : "")}>3. Finish</span>
          </div>
        </div>

        <div className="business-benefits-card">
          {businessBenefits.map((benefit) => (
            <article key={benefit.title} className="business-benefit-item">
              <strong>{benefit.title}</strong>
              <p>{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>

      {!isAuthenticated ? (
        <div className="business-form-card">
          <span className="section-kicker">Get Started</span>
          <h2>Create an account or log in first.</h2>
          <p>After login, tap Add business details to start verification and seller setup.</p>
          <div className="business-guest-actions">
            <Button onClick={() => navigate("/login", { state: { from: { pathname: "/business-account" } } })}>
              Login
            </Button>
            <Button variant="ghost" onClick={() => navigate("/signup")}>
              Create account
            </Button>
          </div>
        </div>
      ) : isAdmin ? (
        <div className="business-form-card">
          <span className="section-kicker">Admin Ready</span>
          <h2>Your account already has business access.</h2>
          <p>You can open your admin workspace right away and continue managing your store.</p>
          <Button onClick={() => navigate("/admin")}>Open Admin Dashboard</Button>
        </div>
      ) : !setupStarted ? (
        <div className="business-form-card">
          <span className="section-kicker">Start Setup</span>
          <h2>Upgrade {user?.email} into a business account.</h2>
          <p>Verify your email and mobile number first, then add your business details.</p>
          <div className="business-form-actions">
            <Button
              onClick={() => {
                setSetupStarted(true);
                setActiveStep("email");
                sendEmailOtp();
              }}
            >
              Add Business Details
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate("/account")}>
              Keep Customer Account
            </Button>
          </div>
        </div>
      ) : activeStep === "email" ? (
        <div className="business-form-card">
          <span className="section-kicker">Step 1</span>
          <h2>Verify email address</h2>
          <p>We sent an OTP to {user?.email}.</p>
          {emailOtp ? <p className="auth-otp-card">Demo OTP: {emailOtp}</p> : null}
          <label className="auth-field">
            <span>Enter OTP</span>
            <input
              type="text"
              value={emailOtpInput}
              onChange={(event) => setEmailOtpInput(event.target.value)}
              placeholder="Enter OTP"
            />
          </label>
          {error ? <p className="auth-error">{error}</p> : null}
          <div className="business-form-actions">
            <Button onClick={verifyEmailOtp}>Verify</Button>
            <Button type="button" variant="ghost" onClick={sendEmailOtp}>
              Resend OTP
            </Button>
          </div>
        </div>
      ) : activeStep === "phone" ? (
        <div className="business-form-card">
          <span className="section-kicker">Step 1</span>
          <h2>Add mobile number</h2>
          <label className="auth-field">
            <span>Mobile number</span>
            <input
              type="tel"
              name="phone"
              value={formState.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
            />
          </label>
          {phoneOtp ? <p className="auth-otp-card">Demo OTP: {phoneOtp}</p> : null}
          <label className="auth-field">
            <span>Enter OTP</span>
            <input
              type="text"
              value={phoneOtpInput}
              onChange={(event) => setPhoneOtpInput(event.target.value)}
              placeholder="Enter OTP"
            />
          </label>
          {error ? <p className="auth-error">{error}</p> : null}
          <div className="business-form-actions">
            <Button type="button" onClick={verifyPhoneOtp} disabled={!phoneOtp}>
              Verify
            </Button>
            <Button type="button" variant="ghost" onClick={sendPhoneOtp}>
              {phoneOtp ? "Resend OTP" : "Send OTP"}
            </Button>
          </div>
        </div>
      ) : activeStep === "details" ? (
        <div className="business-form-card">
          <span className="section-kicker">Step 2</span>
          <h2>Business details</h2>
          <p>Add the seller details for this account.</p>

          <form className="business-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Business name</span>
              <input
                type="text"
                name="businessName"
                value={formState.businessName}
                onChange={handleChange}
                placeholder="Enter your business name"
                required
              />
            </label>

            <div className="business-form-grid">
              <label className="auth-field">
                <span>Business type</span>
                <input
                  type="text"
                  name="businessType"
                  value={formState.businessType}
                  onChange={handleChange}
                  placeholder="Retailer, distributor, brand"
                  required
                />
              </label>

              <label className="auth-field">
                <span>GST number</span>
                <input
                  type="text"
                  name="gstNumber"
                  value={formState.gstNumber}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </label>
            </div>

            {error ? <p className="auth-error">{error}</p> : null}

            <div className="business-form-actions">
              <Button type="submit" disabled={!emailVerified || !phoneVerified || isSubmitting}>
                {isSubmitting ? "Creating business account..." : "Create Business Account"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setActiveStep("phone")}>
                Back
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="business-form-card">
          <span className="section-kicker">Step 3</span>
          <h2>Business account ready</h2>
          <p>Opening admin mode for your account.</p>
        </div>
      )}
    </section>
  );
}

function createOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function getStepClassName(activeKey) {
  return activeKey ? "business-step-active" : "";
}

export default BusinessAccountPage;
