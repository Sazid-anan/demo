// eslint-disable-next-line no-unused-vars
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowRight } from "lucide-react";
import Container from "../components/common/Container";
import Button from "../components/ui/Button";
import HeroTextSection from "../components/HeroTextSection";
import ImageSliderSection from "../components/ImageSliderSection";
import CapabilitiesSection from "../components/CapabilitiesSection";
import PhasesSection from "../components/PhasesSection";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import apiClient from "../services/apiClient";
import { useToast } from "../hooks/useToast";
import { useFormValidation } from "../hooks/useFormValidation";
import { errorLogger } from "../services/errorLogger";
import { analyticsService } from "../services/analyticsService";
import { SITE_CONTENT } from "../config/content";

const RATE_LIMIT_MINUTES = 1;

/**
 * Home Page
 * Modern SaaS landing page with hero section and featured content
 */
export default function Home() {
  const location = useLocation();
  const { homePage } = useSelector((state) => state.content);
  const toast = useToast();
  const prefersReducedMotion = useReducedMotion();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const validateForm = (values) => {
    const errors = {};

    // Name validation
    if (!values.name || values.name.trim().length === 0) {
      errors.name = "Name is required";
    } else if (values.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!values.email || values.email.trim().length === 0) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Message validation
    if (!values.message || values.message.trim().length === 0) {
      errors.message = "Message is required";
    } else if (values.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    }

    return errors;
  };

  const form = useFormValidation(
    { name: "", email: "", phone: "", message: "" },
    () => {}, // Placeholder, we will override handleSubmit
    validateForm,
  );

  // Override the form's handleSubmit with our custom logic that can safely reference 'form'
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    form.setTouched({
      name: true,
      email: true,
      phone: true,
      message: true,
    });

    const errors = validateForm(form.values);
    form.setErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    form.setIsSubmitting(true);

    try {
      // Check rate limiting on client side
      const lastSubmission = localStorage.getItem("lastContactSubmission");
      const rateLimitTimeMs = Date.now() - RATE_LIMIT_MINUTES * 60 * 1000;

      if (lastSubmission && parseInt(lastSubmission) > rateLimitTimeMs) {
        toast.error(
          `⏱️ Please wait ${RATE_LIMIT_MINUTES} minutes before submitting another message.`,
        );
        form.setIsSubmitting(false);
        return;
      }

      const payload = {
        name: form.values.name.trim(),
        email: form.values.email.trim(),
        phone: form.values.phone.trim() || null,
        message: form.values.message.trim(),
      };

      await apiClient.post("/public/contact.php", payload);

      localStorage.setItem("lastContactSubmission", Date.now().toString());

      analyticsService.trackConversion("contact_form_submission", 1, {
        source: "home_page",
      });

      setFormSubmitted(true);

      // Now it is perfectly safe to call reset or setValues since form is already initialized
      form.setValues({ name: "", email: "", phone: "", message: "" });
      form.setTouched({});
      form.setErrors({});

      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (error) {
      errorLogger.captureException(error, {
        where: "home-contact-form",
        action: "submit_contact_form",
      });

      if (error?.message?.toLowerCase().includes("wait 1 minute")) {
        toast.error("⏱️ Too many submissions. Please try again in 5 minutes.");
      } else {
        toast.error("❌ Failed to submit form. Please try again.");
      }
    } finally {
      form.setIsSubmitting(false);
    }
  };

  // Section 2 variables
  const section2Title = homePage?.section2_title || "";
  const section2TextOne = homePage?.section2_text_one || "";
  const section2TextTwo = homePage?.section2_text_two || "";
  const hero2ImageUrl = homePage?.hero2_image_url || "";
  const hero2ImageDetails = homePage?.hero2_image_details || "";

  // Scroll to section if hash is present in URL
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.substring(1));
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to ensure DOM is ready
      }
    }
  }, [location.hash]);

  const handleBlur = (e) => {
    const { name } = e.target;
    form.setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validateForm(form.values);
    form.setErrors(fieldErrors);
  };

  const hasValidationErrors =
    Object.keys(form.errors).length > 0 && Object.keys(form.touched).length > 0;
  const isSuccessState = formSubmitted && !form.isSubmitting;
  const buttonLabel = form.isSubmitting
    ? "Sending..."
    : isSuccessState
      ? "Message send Successfully"
      : hasValidationErrors
        ? "Please fill required fields"
        : "Send Message";

  // Default: show full Home page
  return (
    <div className="min-h-screen">
      <SEO
        title="Edge AI Solutions & Product Development | Danvion"
        description="Danvion specializes in Edge AI solutions, embedded systems, and complete product development from concept to production. IoT, machine learning, and innovative technology."
        image="https://danvion.com/og-image.png"
        url="/"
        keywords="Edge AI, AI solutions, machine learning, embedded systems, IoT development, product development, AI optimization, edge computing"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Danvion Ltd",
          url: "https://danvion.com",
          logo: "https://danvion.com/logo-optimized.png",
          description:
            "Leading provider of Edge AI solutions and complete product development services",
          sameAs: ["https://www.linkedin.com/company/danvion"],
          address: {
            "@type": "PostalAddress",
            streetAddress: "128 City Road",
            addressLocality: "London",
            postalCode: "EC1V 2NX",
            addressCountry: "GB",
          },
          contact: {
            "@type": "ContactPoint",
            contactType: "Customer Support",
            email: "support@danvion.com",
          },
          serviceArea: "WW",
        }}
      />
      {/* Hero Text Section */}
      <HeroTextSection />

      {/* Engineering Capabilities Section */}
      <CapabilitiesSection homePage={homePage} />

      {/* Phases Section */}
      <PhasesSection />

      {/* Image Slider Section */}
      <ImageSliderSection
        images={[
          {
            src: "/images/IMIG_1.svg",
            name: "AI-Powered Edge Computing Device",
          },
          {
            src: "/images/IMIG_2.svg",
            name: "IoT Embedded System Design",
          },
          {
            src: "/images/IMIG_3.svg",
            name: "Smart Automation Solution",
          },
        ]}
        title="Our Designed Products"
        autoPlay={true}
        interval={35000}
      />
      {/* Contact Section */}
      <section
        id="contact"
        className="pt-6 sm:pt-8 md:pt-10 lg:pt-12 pb-6 sm:pb-8 md:pb-10 lg:pb-12 font-sans bg-gray-100"
      >
        <Container className="content-maxwidth">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left mb-1.5 sm:mb-2 md:mb-2 lg:mb-2 mt-0 pt-0"
          >
            <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-5">
              <div className="w-full lg:flex-1 flex flex-col items-start text-left">
                <h2 className="section-heading-display heading-orange text-orange-700 font-semibold leading-tight tracking-tight mb-4 sm:mb-4 md:mb-4 lg:mb-4">
                  Get In Touch
                </h2>
              </div>
              <div className="w-full lg:flex-[1.5] flex flex-col items-start text-left lg:ml-8">
                <p className="paragraph-display font-medium text-gray-800">
                  {SITE_CONTENT.sharedDescriptions.engineeringSolutions}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Two Column Layout: Cards + Form */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            {/* Left Column: Innovation Message */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex items-center justify-center w-full"
            >
              <div className="w-full text-left center">
                <h2
                  className="font-bold leading-[0.9] tracking-tighter text-orange-700"
                  style={{ fontSize: "clamp(18px, 4.5vw, 60px)" }}
                >
                  <span className="heading-orange block mb-0.5">
                    Let's Innovate
                  </span>
                  <span className="heading-orange block mb-0.5">With</span>
                  <span className="heading-orange block">Danvion</span>
                </h2>
              </div>
            </motion.div>

            {/* Right Column: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex items-start pt-0 -mt-1.5 sm:-mt-2 md:-mt-2 lg:-mt-2"
            >
              <div className="w-full">
                <form
                  onSubmit={handleContactSubmit}
                  className="contact-form space-y-0.5 sm:space-y-1 md:space-y-1.5 lg:space-y-1.5 relative"
                >
                  {/* Name */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-0"
                  >
                    <label
                      htmlFor="name"
                      className="block text-base font-semibold text-gray-800 mb-0.5"
                    >
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={form.values.name}
                      onChange={form.handleChange}
                      onBlur={handleBlur}
                      placeholder=""
                      className={`w-full px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 md:py-2 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 bg-white text-gray-800 shadow-md hover:shadow-lg text-sm placeholder-gray-400 ${
                        form.touched.name && form.errors.name
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-300 focus:border-orange-500 focus:ring-orange-500/20"
                      }`}
                    />
                  </motion.div>
                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.5 }}
                    className="mt-0"
                  >
                    <label
                      htmlFor="email"
                      className="block text-base font-semibold text-gray-800 mb-0.5"
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.values.email}
                      onChange={form.handleChange}
                      onBlur={handleBlur}
                      placeholder=""
                      className={`w-full px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 md:py-2 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 bg-white text-gray-800 shadow-md hover:shadow-lg text-sm placeholder-gray-400 ${
                        form.touched.email && form.errors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-300 focus:border-orange-500 focus:ring-orange-500/20"
                      }`}
                    />
                  </motion.div>
                  {/* Phone */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.5 }}
                    className="mt-0"
                  >
                    <label
                      htmlFor="phone"
                      className="block text-base font-semibold text-gray-800 mb-0.5"
                    >
                      Phone Number (Optional)
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.values.phone}
                      onChange={form.handleChange}
                      placeholder=""
                      className="w-full px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 md:py-2 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-white text-gray-800 shadow-md hover:shadow-lg text-sm placeholder-gray-400"
                    />
                  </motion.div>
                  {/* Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mt-0"
                  >
                    <label
                      htmlFor="message"
                      className="block text-base font-semibold text-gray-800 mb-0.5"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="3"
                      value={form.values.message}
                      onChange={form.handleChange}
                      onBlur={handleBlur}
                      placeholder=""
                      className={`w-full px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 bg-white text-gray-800 shadow-md hover:shadow-lg resize-none text-sm placeholder-gray-400 ${
                        form.touched.message && form.errors.message
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-300 focus:border-orange-500 focus:ring-orange-500/20"
                      }`}
                    />
                  </motion.div>
                  {/* Submit Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.5 }}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                    type="submit"
                    disabled={form.isSubmitting}
                    className={`group w-full border font-bold rounded-full py-3 md:py-3 lg:py-3.5 px-8 text-base transition-all duration-300 disabled:opacity-70 cursor-pointer ${
                      isSuccessState
                        ? "bg-emerald-600 border-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200/50"
                        : "bg-orange-700 hover:bg-white border-orange-700 hover:shadow-lg"
                    }`}
                  >
                    <motion.span
                      key={buttonLabel}
                      initial={
                        prefersReducedMotion || !isSuccessState
                          ? { opacity: 1, y: 0, scale: 1 }
                          : { opacity: 0.85, y: 2, scale: 0.98 }
                      }
                      animate={
                        prefersReducedMotion || !isSuccessState
                          ? { opacity: 1, y: 0, scale: 1 }
                          : { opacity: 1, y: 0, scale: [1, 1.03, 1] }
                      }
                      transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
                      aria-live="polite"
                      aria-atomic="true"
                      className={`text-[12px] sm:text-xs md:text-sm lg:text-base transition-colors duration-300 ${
                        isSuccessState
                          ? "text-emerald-50"
                          : "text-white group-hover:text-orange-700"
                      }`}
                    >
                      {buttonLabel}
                    </motion.span>
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
      {/* Second Section */}
      {section2Title && (
        <section className="py-10 sm:py-12 md:py-16 lg:py-20">
          <Container>
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
              {/* Left Image */}
              {hero2ImageUrl && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1"
                >
                  <img
                    src={hero2ImageUrl}
                    alt={hero2ImageDetails || "Solutions"}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    width="800"
                    height="600"
                  />
                </motion.div>
              )}
              {/* Right Content */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-1 lg:order-2"
              >
                <h2 className="section-heading-display font-semibold mb-4 sm:mb-5 md:mb-6 text-foreground">
                  {section2Title}
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                  {section2TextOne}
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 sm:mb-7 md:mb-8 leading-relaxed">
                  {section2TextTwo}
                </p>
                <Link to="/products">
                  <Button size="lg" className="group">
                    Discover More
                    <ArrowRight
                      className="w-5 h-5 text-brand-orange group-hover:translate-x-1 transition-transform"
                      strokeWidth={2.7}
                    />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
