import React from "react";
import { FaArrowRight, FaCode, FaLayerGroup, FaPlayCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import Banner from "../assest/images/banner.mp4";
import Instructor from "../assest/images/Instructor.png";
import Know_your_progress from "../assest/images/Know_your_progress.png";
import Compare_with_others from "../assest/images/Compare_with_others.png";
import Plan_your_lessons from "../assest/images/Plan_your_lessons.png";
import ExploreSection from "../components/core/HomePage/ExploreSection";
import ReviewSlider from "../components/core/HomePage/common/ReviewSlider";
import Footer from "../components/core/HomePage/common/Footer";

const mobileTimeline = [
  {
    title: "Leadership",
    description: "Fully committed to the success of our students.",
  },
  {
    title: "Responsibility",
    description: "Students will always be our top priority.",
  },
  {
    title: "Flexibility",
    description: "Learn in a way that fits your schedule.",
  },
  {
    title: "Problem Solving",
    description: "Build practical skills through real coding work.",
  },
];

const MobileHome = () => {
  return (
    <div className="mobile-home">
      <section className="mobile-home-hero">
        <Link to="/signup" className="mobile-home-pill">
          <span>Become an instructor</span>
          <FaArrowRight />
        </Link>

        <h1 className="mobile-home-title">
          Empower your future with <span>Coding Skills</span>
        </h1>

        <p className="mobile-home-copy">
          With our online coding courses, you can learn at your own pace from anywhere in the world and
          get access to projects, quizzes, and direct instructor guidance.
        </p>

        <div className="mobile-home-actions">
          <Link to="/signup" className="mobile-home-btn mobile-home-btn-primary">
            Learn More
          </Link>
          <Link to="/login" className="mobile-home-btn mobile-home-btn-secondary">
            Book a Demo
          </Link>
        </div>

        <div className="mobile-home-video-wrap">
          <video className="mobile-home-video" muted loop autoPlay playsInline>
            <source src={Banner} type="video/mp4" />
          </video>
        </div>
      </section>

      <section className="mobile-home-section">
        <div className="mobile-home-section-head">
          <p className="mobile-home-kicker">Why StudyNotion</p>
          <h2>Start coding faster with guided lessons and practical projects</h2>
        </div>

        <div className="mobile-home-feature-card">
          <div className="mobile-home-feature-icon">
            <FaCode />
          </div>
          <div>
            <h3>Unlock your coding potential</h3>
            <p>
              Courses are designed by experienced instructors and structured so you can keep moving from basics
              to hands-on building.
            </p>
          </div>
        </div>

        <div className="mobile-home-code-card">
          <div className="mobile-home-code-top">
            <FaPlayCircle />
            <span>Code Preview</span>
          </div>
          <pre>{`<!DOCTYPE html>
<html lang="en">
  <head>
    <title>StudyNotion</title>
  </head>
  <body>
    <h1>Build. Practice. Grow.</h1>
  </body>
</html>`}</pre>
        </div>

        <div className="mobile-home-actions">
          <Link to="/signup" className="mobile-home-btn mobile-home-btn-primary">
            Try it Yourself
          </Link>
          <Link to="/login" className="mobile-home-btn mobile-home-btn-secondary">
            Learn More
          </Link>
        </div>
      </section>

      <section className="mobile-home-section">
        <div className="mobile-home-section-head">
          <p className="mobile-home-kicker">Explore Tracks</p>
          <h2>Find a path that matches your learning stage</h2>
        </div>
        <ExploreSection />
      </section>

      <section className="mobile-home-section mobile-home-light">
        <div className="mobile-home-section-head">
          <p className="mobile-home-kicker">Skills That Matter</p>
          <h2>Get the skills you need for a job that is in demand</h2>
        </div>

        <div className="mobile-home-timeline">
          {mobileTimeline.map((item) => (
            <div key={item.title} className="mobile-home-timeline-item">
              <div className="mobile-home-timeline-dot"></div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <Link to="/signup" className="mobile-home-btn mobile-home-btn-primary mobile-home-inline-btn">
          Learn More
        </Link>
      </section>

      <section className="mobile-home-section mobile-home-language">
        <div className="mobile-home-section-head">
          <p className="mobile-home-kicker">Language Learning</p>
          <h2>Your Swiss knife for learning languages</h2>
        </div>
        <p className="mobile-home-copy mobile-home-copy-tight">
          Progress tracking, comparison insights, and lesson planning in one place to keep your learning consistent.
        </p>

        <div className="mobile-home-language-stack">
          <img src={Know_your_progress} alt="Know your progress" />
          <img src={Compare_with_others} alt="Compare with others" />
          <img src={Plan_your_lessons} alt="Plan your lessons" />
        </div>

        <Link to="/signup" className="mobile-home-btn mobile-home-btn-primary mobile-home-inline-btn">
          Explore Full Catalog
        </Link>
      </section>

      <section className="mobile-home-section">
        <div className="mobile-home-instructor">
          <img src={Instructor} alt="Instructor" className="mobile-home-instructor-image" />
          <div className="mobile-home-section-head">
            <p className="mobile-home-kicker">For Instructors</p>
            <h2>Teach what you love and reach learners worldwide</h2>
          </div>
          <p className="mobile-home-copy mobile-home-copy-tight">
            StudyNotion gives instructors the tools to teach effectively and scale their impact.
          </p>
          <Link to="/signup" className="mobile-home-btn mobile-home-btn-primary mobile-home-inline-btn">
            Start Teaching Today
          </Link>
        </div>
      </section>

      <section className="mobile-home-section mobile-home-reviews">
        <div className="mobile-home-section-head">
          <p className="mobile-home-kicker">Learner Reviews</p>
          <h2>Reviews from other learners</h2>
        </div>
        <ReviewSlider />
      </section>

      <Footer />
    </div>
  );
};

export default MobileHome;
