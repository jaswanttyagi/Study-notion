import React from "react";
import FoundingStory from "../assest/images/FoundingStory.png";
import BannerImage1 from "../assest/images/aboutus1.webp";
import BannerImage2 from "../assest/images/aboutus2.webp";
import BannerImage3 from "../assest/images/aboutus3.webp";
import Footer from "../components/core/HomePage/common/Footer";
import Quote from "../components/core/AboutPage/Quote";

const stats = [
  { count: "5K", label: "Active Students" },
  { count: "10+", label: "Mentors" },
  { count: "200+", label: "Courses" },
  { count: "50+", label: "Awards" },
];

const MobileAbout = () => {
  return (
    <div className="mobile-about-page">
      <section className="mobile-about-hero">
        <p className="mobile-about-kicker">About StudyNotion</p>
        <h1 className="mobile-about-title">
          Driving innovation in online education for a brighter future
        </h1>
        <p className="mobile-about-copy">
          StudyNotion is focused on building an engaging online learning ecosystem with practical courses,
          modern tools, and a strong learner community.
        </p>

        <div className="mobile-about-gallery">
          <img src={BannerImage1} alt="About StudyNotion 1" />
          <img src={BannerImage2} alt="About StudyNotion 2" />
          <img src={BannerImage3} alt="About StudyNotion 3" />
        </div>
      </section>

      <section className="mobile-about-quote">
        <Quote />
      </section>

      <section className="mobile-about-story">
        <img src={FoundingStory} alt="Founding Story" className="mobile-about-story-image" />
        <div className="mobile-about-card">
          <h2>Our Founding Story</h2>
          <p>
            Our platform began with a shared belief that high-quality learning should be accessible,
            flexible, and useful in the real world.
          </p>
          <p>
            We built StudyNotion to remove traditional barriers and help learners grow with guided
            content, mentorship, and strong technical foundations.
          </p>
        </div>
      </section>

      <section className="mobile-about-dual">
        <div className="mobile-about-card">
          <h2>Our Vision</h2>
          <p>
            We want learning to feel modern, practical, and available to anyone who wants to build
            meaningful skills.
          </p>
        </div>

        <div className="mobile-about-card">
          <h2>Our Mission</h2>
          <p>
            We aim to create a strong learning community where students can grow through structured
            lessons, collaboration, and consistent practice.
          </p>
        </div>
      </section>

      <section className="mobile-about-stats">
        {stats.map((item) => (
          <div key={item.label} className="mobile-about-stat">
            <h3>{item.count}</h3>
            <p>{item.label}</p>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
};

export default MobileAbout;
