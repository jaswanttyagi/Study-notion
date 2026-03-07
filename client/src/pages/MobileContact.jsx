import React from "react";
import Footer from "../components/core/HomePage/common/Footer";
import ContactDetails from "../components/core/HomePage/contactPage/ContactDetails";
import ContactForm from "../components/core/HomePage/contactPage/ContactForm";

const MobileContact = () => {
  return (
    <div className="mobile-contact-page">
      <section className="mobile-contact-hero">
        <p className="mobile-contact-kicker">Contact Us</p>
        <h1 className="mobile-contact-title">Let&apos;s talk about your next learning move</h1>
        <p className="mobile-contact-copy">
          Reach out to our team for course guidance, support, or collaboration. We&apos;ll help you find the right path.
        </p>
      </section>

      <section className="mobile-contact-stack">
        <div className="mobile-contact-panel">
          <ContactDetails />
        </div>
        <div className="mobile-contact-panel">
          <ContactForm />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MobileContact;
