import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "../components/common/Container";
import Button from "../components/ui/Button";
import ImageSliderSection from "../components/ImageSliderSection";
import HeroTextSection from "../components/HeroTextSection";
import CapabilitiesSection from "../components/CapabilitiesSection";
import PhasesSection from "../components/PhasesSection";
import { Link } from "react-router-dom";
import Badge from "../components/ui/Badge";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebaseClient";

/**
 * Home Page
 * Modern SaaS landing page with hero section and featured content
 */
export default function Home() {
  const location = useLocation();
  const { homePage } = useSelector((state) => state.content);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message,
        created_at: serverTimestamp(),
      };

      await addDoc(collection(db, "contact_messages"), payload);
      setFormSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  // Default: show full Home page
  return (
    <div className="min-h-screen">
      {/* Hero Text Section */}
      <HeroTextSection />
      {/* Capabilities Section */}
      <CapabilitiesSection homePage={homePage} />
      {/* Phases Section */}
      <PhasesSection />
      {/* Image Slider Section */}
      <ImageSliderSection
        images={[
          {
            src: "/images/1.jpg",
          },
          {
            src: "/images/22.jpg",
          },
          {
            src: "/images/33.jpg",
          },
        ]}
        title="Our Designed Products"
        autoPlay={true}
        interval={35000}
      />
      {/* Contact Section */}
      <section
        id="contact"
        className="pt-2 pb-5 xl:pb-2 xxl:pb-5 font-sans bg-black"
      >
        <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 xxl:px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left mb-6 sm:mb-6 md:mb-6 xl:mb-0 xxl:mb-6 mt-0 pt-0"
          >
            <div className="flex flex-col md:flex-row items-start gap-3 md:gap-4">
              <div className="w-full sm:flex-1 flex flex-col items-start text-left sm:w-auto">
                <h1 className="animated-gradient-text font-semibold leading-[1.25] tracking-tight mb-2 sm:mb-3 md:mb-4 lg:mb-6 text-[28px] sm:text-[32px] md:text-[40px] lg:text-[50px]">
                  Get In Touch
                </h1>
              </div>
              <div className="w-full sm:flex-[1.5] flex flex-col items-start text-left mt-3 sm:mt-0 sm:w-auto">
                <p className="text-left md:text-justify text-[14px] sm:text-[15px] md:text-[17px] lg:text-[20px] font-semibold text-white leading-relaxed">
                  From hardware design to edge AI deployment, we deliver
                  complete engineering solutions that bring intelligent products
                  to life.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Two Column Layout: Cards + Form */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-6 lg:gap-12 xl:gap-16">
            {/* Left Column: Innovation Message */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex items-center justify-center w-full"
            >
              <div className="w-full text-left center">
                <style>
                  {`
                    @keyframes gradientWave {
                      0%, 100% {
                        background-position: 0% 50%;
                      }
                      50% {
                        background-position: 100% 50%;
                      }
                    }
                    .animated-gradient-text {
                      background: linear-gradient(
                        90deg,
                        #ffffff 0%,
                        #f37106 25%,
                        #ff8c42 50%,
                        #f37106 75%,
                        #ffffff 100%
                      );
                      background-size: 200% 100%;
                      -webkit-background-clip: text;
                      -webkit-text-fill-color: transparent;
                      background-clip: text;
                      animation: gradientWave 4s ease-in-out infinite;
                    }
                    .animated-gradient-text-orange {
                      background: linear-gradient(
                        90deg,
                        #f37106 0%,
                        #ff8c42 25%,
                        #ffa566 50%,
                        #ff8c42 75%,
                        #f37106 100%
                      );
                      background-size: 200% 100%;
                      -webkit-background-clip: text;
                      -webkit-text-fill-color: transparent;
                      background-clip: text;
                      animation: gradientWave 4s ease-in-out infinite;
                    }
                  `}
                </style>
                <h2
                  className="font-bold leading-[0.9] tracking-tighter"
                  style={{ fontSize: "clamp(18px, 4.5vw, 70px)" }}
                >
                  <span className="block mb-2 animated-gradient-text">
                    Let's Innovate
                  </span>
                  <span className="block mb-2 animated-gradient-text-orange">
                    With
                  </span>
                  <span className="block animated-gradient-text-orange">
                    Danvion
                  </span>
                </h2>
              </div>
            </motion.div>

            {/* Right Column: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="md:-ml-6 lg:ml-0"
            >
              <div>
                <h2
                  className="text-[20px] sm:text-[22px] md:text-[24px] lg:text-[32px] xl:text-[32px] xxl:text-[34px] font-bold text-white mb-4 sm:mb-5 md:mb-1 lg:mb-8 xl:mb-1 xxl:mb-8 text-center md:text-left"
                  style={{ color: "#ffffff" }}
                >
                  Send a Message
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 sm:space-y-6 md:space-y-0 lg:space-y-6 xl:space-y-0 xxl:space-y-6"
                >
                  {/* Name */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-4 sm:mt-5 md:mt-1 lg:mt-6"
                  >
                    <label
                      htmlFor="name"
                      className="block text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[16px] xxl:text-[18px] font-semibold text-white mb-2 md:mb-0.5 lg:mb-2 xl:mb-0.5 xxl:mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder=""
                      className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2 xl:py-2 xxl:py-2 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-gray-900 text-white shadow-sm hover:shadow-md text-[14px] sm:text-[14px] md:text-[15px] xl:text-[15px] xxl:text-[16px] placeholder-gray-500"
                    />
                  </motion.div>
                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.5 }}
                    className="xl:mt-1 xxl:mt-0"
                  >
                    <label
                      htmlFor="email"
                      className="block text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[16px] xxl:text-[18px] font-semibold text-white mb-2 md:mb-0.5 lg:mb-2 xl:mb-0.5 xxl:mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder=""
                      className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2 xl:py-2 xxl:py-2 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-gray-900 text-white shadow-sm hover:shadow-md text-[14px] sm:text-[14px] md:text-[15px] xl:text-[15px] xxl:text-[16px] placeholder-gray-500"
                    />
                  </motion.div>
                  {/* Phone */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.5 }}
                    className="xl:mt-1 xxl:mt-0"
                  >
                    <label
                      htmlFor="phone"
                      className="block text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[16px] xxl:text-[18px] font-semibold text-white mb-2 md:mb-0.5 lg:mb-2 xl:mb-0.5 xxl:mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder=""
                      className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2 xl:py-2 xxl:py-2 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-gray-900 text-white shadow-sm hover:shadow-md text-[14px] sm:text-[14px] md:text-[15px] xl:text-[15px] xxl:text-[16px] placeholder-gray-500"
                    />
                  </motion.div>
                  {/* Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="xl:mt-1 xxl:mt-0"
                  >
                    <label
                      htmlFor="message"
                      className="block text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[16px] xxl:text-[18px] font-semibold text-white mb-2 md:mb-0.5 lg:mb-2 xl:mb-0.5 xxl:mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows="3"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder=""
                      className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2 xl:py-2 xxl:py-2 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-gray-900 text-white shadow-sm hover:shadow-md resize-none text-[14px] sm:text-[14px] md:text-[15px] xl:text-[15px] xxl:text-[16px] placeholder-gray-500"
                    />
                  </motion.div>
                  {/* Submit Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="group w-full bg-orange-500 hover:bg-white border border-orange-500 hover:shadow-lg font-bold rounded-full py-2.5 md:py-2 lg:py-3.5 px-8 transition-all duration-300 disabled:opacity-70 cursor-pointer"
                  >
                    <span className="text-[13px] sm:text-[14px] md:text-[15px] lg:text-base text-white group-hover:text-orange-500 transition-colors duration-300">
                      {loading ? "Sending..." : "Send Message"}
                    </span>
                  </motion.button>
                  {/* Success Message */}
                  {formSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-green-900 border border-green-700 rounded-lg text-center text-green-200 font-medium"
                    >
                      Thank you! We'll get back to you soon.
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </div>
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
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-5 md:mb-6 text-foreground">
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
