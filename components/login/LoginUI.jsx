"use client";

import { useState } from "react";
import styles from "./LoginUI.module.scss";
import FeatureShowcase from "./FeatureShowcase";

const LoginUI = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterForm, setIsRegisterForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegisterForm) {
      // Will be implemented with proper authentication later
      console.log("Register attempt with:", email, password);
    } else {
      // Will be implemented with proper authentication later
      console.log("Login attempt with:", email);
    }
  };

  const toggleForm = () => {
    setIsRegisterForm(!isRegisterForm);
    setEmail("");
    setPassword("");
  };

  return (
    <div className={styles.loginContainer}>
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
                : "Sign in to your account"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="business-email">Business email</label>
                <input
                  id="business-email"
                  type="email"
                  placeholder="Enter your business email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {isRegisterForm && (
                <div className={styles.formGroup}>
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              <button type="submit" className={styles.continueButton}>
                {isRegisterForm ? "Register" : "Continue"}
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
