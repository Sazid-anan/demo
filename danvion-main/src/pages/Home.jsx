// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useEffect, useState, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowRight } from "lucide-react";
import Container from "../components/common/Container";
import Button from "../components/ui/Button";
import HeroTextSection from "../components/HeroTextSection";

// Lazy load below-the-fold sections for better performance
const ImageSliderSection = lazy(
  () => import("../components/ImageSliderSection"),
);
const CapabilitiesSection = lazy(
  () => import("../components/CapabilitiesSection"),
);
const PhasesSection = lazy(() => import("../components/PhasesSection"));
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebaseClient";
import { useToast } from "../hooks/useToast";
import { useFormValidation } from "../hooks/useFormValidation";
import { errorLogger } from "../services/errorLogger";
import { analyticsService } from "../services/analyticsService";
import { SITE_CONTENT } from "../config/content";

const RATE_LIMIT_MINUTES = 5;

/**
 * Home Page
 * Modern SaaS landing page with hero section and featured content
 */
export default function Home() {
  const location = useLocation();
  const { homePage } = useSelector((state) => state.content);
  const toast = useToast();
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
        is_read: false,
        created_at: serverTimestamp(),
        consent_timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, "contact_messages"), payload);

      localStorage.setItem("lastContactSubmission", Date.now().toString());

      analyticsService.trackConversion("contact_form_submission", 1, {
        source: "home_page",
      });

      setFormSubmitted(true);

      // Now it is perfectly safe to call reset or setValues since form is already initialized
      form.setValues({ name: "", email: "", phone: "", message: "" });
      form.setTouched({});
      form.setErrors({});

      toast.success("✅ Thank you! We'll get back to you soon.");

      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (error) {
      errorLogger.captureException(error, {
        where: "home-contact-form",
        action: "submit_contact_form",
      });

      if (error.code === "resource-exhausted") {
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
          logo: "https://danvion.com/logo.png",
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

      {/* Engineering Capabilities Section - Lazy Loaded */}
      <Suspense
        fallback={
          <div className="min-h-100 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-brand-orange rounded-full animate-spin"></div>
          </div>
        }
      >
        <CapabilitiesSection />
      </Suspense>

      {/* Phases Section - Lazy Loaded */}
      <Suspense
        fallback={
          <div className="min-h-100 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-brand-orange rounded-full animate-spin"></div>
          </div>
        }
      >
        <PhasesSection />
      </Suspense>

      {/* Image Slider Section - Lazy Loaded */}
      <Suspense
        fallback={
          <div className="min-h-100 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-brand-orange rounded-full animate-spin"></div>
          </div>
        }
      >
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
      </Suspense>
      {/* Contact Section */}
      <section
        id="contact"
        className="pt-6 sm:pt-8 md:pt-10 lg:pt-14 pb-6 sm:pb-8 md:pb-10 lg:pb-14 font-sans bg-gray-100"
      >
        <Container className="content-maxwidth">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left mb-6 sm:mb-7 md:mb-8 lg:mb-10 mt-0 pt-0"
          >
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
              <div className="w-full lg:flex-1 flex flex-col items-start text-left">
                <h2 className="section-heading-display heading-orange text-orange-700 font-semibold leading-tight tracking-tight mb-6 sm:mb-6 md:mb-6 lg:mb-6">
                  Get In Touch
                </h2>
              </div>
              <div className="w-full lg:flex-[1.5] flex flex-col items-start text-left lg:ml-11">
                <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[23px] font-medium text-gray-800 leading-relaxed text-justify">
                  {SITE_CONTENT.sharedDescriptions.engineeringSolutions}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Two Column Layout: Cards + Form */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-6 lg:gap-12">
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
                  style={{ fontSize: "clamp(18px, 4.5vw, 70px)" }}
                >
                  <span className="heading-orange block mb-2">
                    Let's Innovate
                  </span>
                  <span className="heading-orange block mb-2">With</span>
                  <span className="heading-orange block">Danvion</span>
                </h2>
              </div>
            </motion.div>

            {/* Right Column: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex items-start pt-0 sm:pt-0 md:pt-2 lg:pt-0"
            >
              <div className="w-full">
                <form
                  onSubmit={handleContactSubmit}
                  className="space-y-4 sm:space-y-5 md:space-y-4 lg:space-y-5 relative"
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
                      className="block text-sm md:text-base lg:text-lg font-semibold text-gray-800 mb-2"
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
                      className={`w-full px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 bg-white text-gray-800 shadow-sm hover:shadow-md text-sm md:text-base placeholder-gray-400 ${
                        form.touched.name && form.errors.name
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-300 focus:border-orange-500 focus:ring-orange-500/20"
                      }`}
                    />
                    {form.touched.name && form.errors.name && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">
                        {form.errors.name}
                      </p>
                    )}
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
                      className="block text-sm md:text-base lg:text-lg font-semibold text-gray-800 mb-2"
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
                      className={`w-full px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 bg-white text-gray-800 shadow-sm hover:shadow-md text-sm md:text-base placeholder-gray-400 ${
                        form.touched.email && form.errors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-300 focus:border-orange-500 focus:ring-orange-500/20"
                      }`}
                    />
                    {form.touched.email && form.errors.email && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">
                        {form.errors.email}
                      </p>
                    )}
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
                      className="block text-sm md:text-base lg:text-lg font-semibold text-gray-800 mb-2"
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
                      className="w-full px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-white text-gray-800 shadow-sm hover:shadow-md text-sm md:text-base placeholder-gray-400"
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
                      className="block text-sm md:text-base lg:text-lg font-semibold text-gray-800 mb-2"
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
                      className={`w-full px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 bg-white text-gray-800 shadow-sm hover:shadow-md resize-none text-sm md:text-base placeholder-gray-400 ${
                        form.touched.message && form.errors.message
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-300 focus:border-orange-500 focus:ring-orange-500/20"
                      }`}
                    />
                    {form.touched.message && form.errors.message && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">
                        {form.errors.message}
                      </p>
                    )}
                  </motion.div>
                  {/* Submit Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={form.isSubmitting}
                    className="group w-full bg-orange-700 hover:bg-white border border-orange-700 hover:shadow-lg font-bold rounded-full py-2.5 md:py-2 lg:py-3.5 px-8 transition-all duration-300 disabled:opacity-70 cursor-pointer"
                  >
                    <span className="text-[12px] sm:text-xs md:text-sm lg:text-base text-white group-hover:text-orange-700 transition-colors duration-300">
                      {form.isSubmitting ? "Sending..." : "Send Message"}
                    </span>
                  </motion.button>
                  {/* Success Message - Non-overlapping */}
                  {formSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-green-900 border border-green-700 rounded-lg text-center text-green-200 font-medium mt-4 w-full"
                      role="status"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      Thank you! We'll get back to you soon.
                    </motion.div>
                  )}
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
