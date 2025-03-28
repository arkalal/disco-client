"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./privacy-policy.module.scss";

export default function PrivacyPolicy() {
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logo}>
            disco
          </Link>
        </div>
        <div className={styles.navigation}>
          <Link href="/login" className={styles.navLink}>
            Login
          </Link>
          <Link href="/terms/brands" className={styles.navLink}>
            Terms for Brands
          </Link>
          <Link href="/terms/influencers" className={styles.navLink}>
            Terms for Influencers
          </Link>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <h1 className={styles.title}>WELCOME TO DISCO PRIVACY NOTICE</h1>
          <p className={styles.paragraph}>
            This Privacy notice is incorporated by reference into the DISCO
            Terms of Service (the "Terms") and the DISCO Privacy Policy.
          </p>

          <p className={styles.paragraph}>
            This Privacy notice applies to both Registered and Unregistered
            Influencer ("Influencer'' ''you'' "your") whose Personal Information
            has been processed by DISCO ("DISCO", "we", "us", "our") in the
            course of our business.
          </p>

          <p className={styles.paragraph}>
            DISCO is a web-based platform that helps you to connect with the
            brands, companies and marketing agencies, to monetise your digital
            media presence commercially. This platform provides you an
            opportunity to endorse and comment on the brands/ companies you
            prefer. To serve that purpose, we collect your Personal Information
            from a variety of public sources. After collation, we combine and
            couple your information and data with powerful tools to create an
            influencer Profile and then enable our Users to connect with you.
          </p>

          <p className={styles.paragraph}>
            We respect your privacy and are committed to protect your personal
            data. This privacy notice describes how we collect, use, process,
            and disclose your information, including Personal Data (as defined
            below), in conjunction with your access to and use of our Services,
            and it applies to all of the Services offered by DISCO and its
            affiliates including but not limited to all DISCO Apps, Sites, APIs
            (including exports), and Integrations.
          </p>

          <p className={styles.paragraph}>
            It is important that you read this privacy policy together with the
            privacy policy narrated here, and any other privacy notice or fair
            processing notice we may provide on specific occasions when we are
            collecting or processing personal data about you so that you are
            fully aware of how and why we are using your personal data.
          </p>

          <p className={styles.paragraph}>
            This privacy notice supplements the other notices/policy and is not
            intended to supersede them.
          </p>

          <h2 className={styles.sectionTitle}>INFORMATION WE COLLECT</h2>
          <p className={styles.paragraph}>
            To provide the services, we collect, store, process and share
            Personal information of both registered as well as unregistered
            influencers.
          </p>

          <p className={styles.paragraph}>
            ''Registered Influencer'' shall mean those who have volunteered to
            provide their personal details into include in DISCO database and
            registered their name as an influencer.
          </p>

          <p className={styles.paragraph}>
            Unregistered influencers shall mean influencer identified by DISCO
            from its own research whose contact and coordinates are extracted
            from various public sources.
          </p>

          <p className={styles.paragraph}>
            The type of Personal Information we may collect (directly from you
            or from Third-Party sources) and our privacy practices depend on the
            nature of the relationship you have with DISCO and the requirements
            of applicable law.
          </p>

          <p className={styles.paragraph}>
            Below are the ways on what information we collect from Registered
            influencers.
          </p>

          <h2 className={styles.sectionTitle}>I. REGISTERED INFLUENCERS</h2>
          <p className={styles.paragraph}>
            By registering and setting up DISCO profile, you give us explicit
            consent to collect, store, process and share your Personal
            information that is provided by you and we collect about you from
            various internet sources.
          </p>

          <p className={styles.paragraph}>
            "Personal data, or Personal Information" that we collect includes:
          </p>

          <ul className={styles.bulletList}>
            <li>name</li>
            <li>email id</li>
            <li>phone number</li>
            <li>location</li>
            <li>gender</li>
            <li>profile picture</li>
            <li>
              social media handles and public profile information of the
              followers for the influencer and for a particular post
            </li>
            <li>
              social media handles and public profile information of who the
              influencer is following.
            </li>
            <li>
              Text/image or video URL posted or uploaded by the influencer or
              the followers/friends of the influencer.
            </li>
            <li>
              Pages, social accounts, hashtags and groups that the influencer is
              connected with.
            </li>
            <li>
              Comments or posts by the influencer and/or friends/followers of
              influencer.
            </li>
            <li>
              Information about individuals who reacted(like/dislike), commented
              or shared the post and location data of the post
            </li>
            <li>Address</li>
            <li>
              Internet Protocol (IP) address, browser type and operating system
            </li>
          </ul>

          <p className={styles.paragraph}>
            Some of the personal information we collect may belong to special
            categories. However, such information we collect, and process are
            those which are manifestly made public by you.
          </p>

          <p className={styles.paragraph}>
            Some of the ways that DISCO may collect Personal Information
            include:
          </p>

          <h2 className={styles.sectionTitle}>
            A. INFORMATION YOU PROVIDE TO US
          </h2>
          <p className={styles.paragraph}>
            When you create a profile and you provide your basic details
            including your full name, email address, phone number Gender, Age,
            Location, area of interest and we may also ask you to connect to
            your social account. Your display name and username are always
            public.
          </p>

          <p className={styles.paragraph}>
            We collect every information that you provide in the DISCO platform
            including your name, email address, phone number, Gender, Age,
            Location, area of interest, the content you create, upload, or
            receive from others when using our services, , documents and
            spreadsheets you create, comments you make, and the comments others
            make about you on various social media platforms.
          </p>

          <p className={styles.paragraph}>
            We use your contact information, such as your email address or phone
            number, to authenticate your profile and keep it - and our services
            - secure, and to help prevent spam, fraud, and abuse. We also use
            your information to personalize our services, enable certain
            features and send you information about our services. If you provide
            us with your phone number and email id, you agree to receive text
            messages and emails from DISCO
          </p>

          <p className={styles.paragraph}>
            If you provide us feedback or contact us via e-mail, we will collect
            your name and e-mail address, as well as any other content included
            in the e-mail, in order to send you a reply.
          </p>

          <p className={styles.paragraph}>
            From time to time, we may contact you to participate in online
            surveys. If you do decide to participate, you may be asked to
            provide certain information which may include Personal Information.
            All information collected from your participation in our surveys is
            provided by you voluntarily. We may use such information to improve
            our products and/or Services and in any manner consistent with the
            policies provided herein.
          </p>

          {/* Content continues with various sections */}

          <h2 className={styles.sectionTitle}>CHANGES TO OUR PRIVACY POLICY</h2>
          <p className={styles.paragraph}>
            Any changes we make to this privacy notice in the future will be
            posted to our website. Please check back frequently to see any
            updates or changes to this privacy policy.
          </p>

          <p className={styles.paragraph}>Effective as on 23/10/19</p>
        </div>
      </div>
    </div>
  );
}
