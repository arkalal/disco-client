"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./influencers.module.scss";

export default function TermsInfluencers() {
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
          <Link href="/privacy-policy" className={styles.navLink}>
            Privacy Policy
          </Link>
          <Link href="/terms/brands" className={styles.navLink}>
            Terms for Brands
          </Link>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <h1 className={styles.title}>Welcome to DISCO!</h1>
          <p className={styles.paragraph}>
            This is the official site ("Site") of Datrux Systems Pvt Ltd
            ("Company"), a company duly incorporated under the laws of India and
            other sites linking to these Terms of Use, including mobile versions
            of such sites (collectively, the "Sites" or, individually, a
            "Site'')
          </p>

          <p className={styles.paragraph}>
            This Site is an online portal that allows organized interaction with
            social media influencers. This Site brings together companies/
            individuals who are seeking valuable inputs recommendations and
            endorsements on specific brands/topics and
            bloggers/individuals/social media influencers who are willing to
            provide such inputs.
          </p>

          <p className={styles.paragraph}>
            DISCO can be used by digital marketing companies, brands, PR
            agencies for identifying the right influencers who could potentially
            promote their brands, products or services.
          </p>

          <p className={styles.paragraph}>
            DISCO is also a platform for influencers (people having large
            presence in various social media platforms like Facebook, Twitter,
            Instagram, YouTube etc who have large followers, subscribers) who
            love to monetise their digital media presence by listing through
            Disco, so that their social media presence can be commercially
            benefited by endorsing and commenting on brands that they prefer.
          </p>

          <p className={styles.paragraph}>
            The Site is thus a marketplace for digital marketing companies,
            brands, PR agencies and influencers.
          </p>

          <h2 className={styles.sectionTitle}>Definition:</h2>
          <p className={styles.paragraph}>
            "Services" any services offered on or through the Site, to a guest
            or a registered user (hereafter "Agreement").
          </p>

          <p className={styles.paragraph}>
            ''User'' shall mean and include digital marketing companies/ brands,
            individuals/ and PR agencies and influencer.
          </p>

          <p className={styles.paragraph}>
            Influencer" shall mean persons who is active in social medias (like
            Facebook, Twitter Instagram, YouTube etc and/ or who has substantial
            followers, subscribers, and who has the ability to influence other
            social media users who have been included in DISCO database either
            as registered influencers or unregistered influencers.
          </p>

          <p className={styles.paragraph}>
            Unregistered influencers shall mean influencer identified by DISCO
            from its own research whose contact and coordinates are extracted
            from various public sources.
          </p>

          <p className={styles.paragraph}>
            ''Registered Influencer'' shall mean those who have volunteered to
            provide their personal details into include in DISCO database and
            registered their name as an influencer.
          </p>

          <p className={styles.paragraph}>
            "Content" shall mean and include any inputs on specific
            brands/topics by any user including any blogger/individuals/ social
            media influencers which may be in the form of text, reviews,
            comments, data, information, images, photographs, music, sound,
            video or any other material or any reactions thereto.
          </p>

          <p className={styles.paragraph}>
            "Personal information" shall mean and include any information
            relating to the user including name, email id, phone number,
            location, gender, IP address, address, photograph and economic,
            cultural or social identity of the user;
          </p>

          <h2 className={styles.sectionTitle}>ELIGIBILITY</h2>
          <p className={styles.paragraph}>
            By using the Services, you represent and warrant that you are above
            the 18 years of age and qualified to enter into contract. If you are
            not eligible to enter into contracts, then please discontinue use of
            the Services and leave now.
          </p>

          <p className={styles.paragraph}>
            If you are the parent or guardian of a child under 18 years of age,
            by registering/by creating an account or profile on the Site, you
            provide your consent to your child's registration and you agree to
            be bound by these Terms in respect of their use of our Site. We will
            at all times assume (and by using this Site you warrant that) you
            have the legal capacity to enter into the agreement (i.e. that you
            are of sufficient age and mental capacity and are otherwise entitled
            to be legally bound in contract).
          </p>

          {/* Content continues with various sections */}

          <h2 className={styles.sectionTitle}>AFFIRMATION OF AGREEMENT</h2>
          <p className={styles.paragraph}>
            You hereby acknowledge and affirm that you have read this entire
            Agreement and that you agree to be bound by all its terms and
            conditions by clicking where indicated on the Service registration
            page and/or by authorizing the use of Services by creating Profile
            with us.
          </p>
        </div>
      </div>
    </div>
  );
}
