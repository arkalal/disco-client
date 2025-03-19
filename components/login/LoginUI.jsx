"use client";

import { useState } from "react";
import styles from "./LoginUI.module.scss";
import FeatureShowcase from "./FeatureShowcase";

const LoginUI = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Will be implemented with proper authentication later
    console.log("Login attempt with:", email);
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
            <h2 className={styles.formTitle}>Sign in to your account</h2>
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
              <button type="submit" className={styles.continueButton}>
                Continue
              </button>
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
