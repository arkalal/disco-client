"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast, Toaster } from "react-hot-toast";
import styles from "./LoginUI.module.scss";
import FeatureShowcase from "./FeatureShowcase";

const LoginUI = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterForm, setIsRegisterForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate inputs
    const newErrors = {};
    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.success("Account created successfully! Please sign in.");
      setIsRegisterForm(false);
      setPassword("");
      setShowPassword(false);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!showPassword) {
      if (!email.trim()) {
        setErrors({ email: "Email is required" });
        setLoading(false);
        return;
      }
      if (!validateEmail(email)) {
        setErrors({ email: "Please enter a valid email address" });
        setLoading(false);
        return;
      }
      setShowPassword(true);
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/home",
      });

      if (result?.error) {
        throw new Error("Invalid email or password");
      }

      toast.success("Logged in successfully!");

      // Add a small delay to ensure proper redirect handling
      setTimeout(() => {
        window.location.href = result?.url || "/home";
      }, 500);
    } catch (error) {
      toast.error(error.message || "Login failed");
      console.error("Login error:", error);
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsRegisterForm(!isRegisterForm);
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setErrors({});
  };

  const handleGoBack = () => {
    setShowPassword(false);
    setPassword("");
    setErrors({});
  };

  return (
    <div className={styles.loginContainer}>
      <Toaster position="top-center" reverseOrder={false} />
      <div className={styles.loginFormWrapper}>
        <div className={styles.loginFormContainer}>
          <div className={styles.loginForm}>
            <div className={styles.logoContainer}>
              <div className={styles.logoText}>disco</div>
              <p className={styles.tagline}>Data driven influencer marketing</p>
            </div>
            <h2 className={styles.formTitle}>
              {isRegisterForm
                ? "Create a new account"
                : showPassword
                ? "Enter your password"
                : "Sign in to your account"}
            </h2>
            <form onSubmit={isRegisterForm ? handleRegister : handleLogin}>
              {(!showPassword || isRegisterForm) && (
                <div className={styles.formGroup}>
                  <label htmlFor="business-email">Business email</label>
                  <input
                    id="business-email"
                    type="email"
                    placeholder="Enter your business email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    className={errors.email ? styles.errorInput : ""}
                  />
                  {errors.email && (
                    <p className={styles.errorText}>{errors.email}</p>
                  )}
                </div>
              )}

              {(showPassword || isRegisterForm) && (
                <div className={styles.formGroup}>
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder={
                      isRegisterForm
                        ? "Create a password"
                        : "Enter your password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    className={errors.password ? styles.errorInput : ""}
                  />
                  {errors.password && (
                    <p className={styles.errorText}>{errors.password}</p>
                  )}
                </div>
              )}

              {showPassword && !isRegisterForm && (
                <button
                  type="button"
                  className={styles.backButton}
                  onClick={handleGoBack}
                  disabled={loading}
                >
                  Back to email
                </button>
              )}

              <button
                type="submit"
                className={styles.continueButton}
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : isRegisterForm
                  ? "Register"
                  : "Continue"}
              </button>

              <div className={styles.formToggle}>
                {isRegisterForm ? (
                  <p>
                    Already have an account?{" "}
                    <span onClick={toggleForm} className={styles.toggleLink}>
                      Sign in
                    </span>
                  </p>
                ) : (
                  <p>
                    Not registered yet?{" "}
                    <span onClick={toggleForm} className={styles.toggleLink}>
                      Create an account
                    </span>
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className={styles.featureShowcaseContainer}>
        <FeatureShowcase />
      </div>
    </div>
  );
};

export default LoginUI;
