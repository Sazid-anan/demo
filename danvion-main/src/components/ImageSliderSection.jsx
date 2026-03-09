import { useEffect, useState, useRef, useCallback } from "react";
import Container from "./common/Container";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useResponsive } from "../hooks/useResponsive";
import { useSwipe } from "../hooks/useSwipe";

/**
 * Image Slider Section
 * Displays horizontally scrolling images from right to left with sliding overlay on hover
 *
 * Usage Example:
 * <ImageSliderSection
 *   images={[
 *     { src: "/images/IMIG_1.svg", name: "Future Tech", description: "A glimpse into tomorrow's technology." },
 *     { src: "/images/IMIG_2.svg", name: "Smart Device", description: "Smart device for modern living." },
 *     { src: "/images/IMIG_3.svg", name: "Innovative Design", description: "Sleek and innovative product design." },
 *
 *   title="Our Designed Products"
 *   autoPlay={true}
 *   interval={35000}
 * />
 *
 * Props:
 * - images: Array of {src, name, description} objects from public folder (required)
 * - title: Slider title (default: "Image Gallery")
 * - autoPlay: Enable auto-play (default: true)
 * - interval: Animation duration for one scroll cycle in ms (default: 35000)
 */
export default function ImageSliderSection({
  images = [],
  title = "Image Gallery",
  autoPlay = true,
  interval = 35000,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isManualMode, setIsManualMode] = useState(false);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);

  // Use responsive hook for device detection
  const { width } = useResponsive();

  useEffect(() => {
    if (!autoPlay || images.length === 0) return;

    // Create and inject animation keyframes
    const styleId = "slider-animation-style";
    let style = document.getElementById(styleId);

    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }

    // Update style content with current interval
    style.textContent = `
      @keyframes image-marquee {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }

      .animate-image-marquee {
        display: flex;
        gap: 16px;
        animation: image-marquee ${interval}ms linear infinite;
        will-change: transform;
      }

      @media (min-width: 640px) {
        .animate-image-marquee {
          gap: 24px;
        }
      }

      @media (min-width: 768px) {
        .animate-image-marquee {
          gap: 32px;
        }
      }

      .animate-image-marquee:hover {
        animation-play-state: paused;
      }

      .animate-image-marquee.manual-mode {
        animation: none;
      }

      @media (prefers-reduced-motion: reduce) {
        .animate-image-marquee {
          animation: none;
        }
      }

      @media (max-width: 640px) {
        .animate-image-marquee {
          gap: 16px;
        }
      }
    `;

    return () => {
      // Don't remove the style to avoid flickering on re-renders
    };
  }, [autoPlay, interval, images.length]);

  // Track active dot based on animation progress
  useEffect(() => {
    if (!autoPlay || images.length === 0 || isManualMode) return;

    const updateInterval = interval / images.length;
    let currentIdx = 0;

    const dotInterval = setInterval(() => {
      currentIdx = (currentIdx + 1) % images.length;
      setCurrentIndex(currentIdx);
    }, updateInterval);

    return () => clearInterval(dotInterval);
  }, [autoPlay, interval, images.length, isManualMode]);

  // Navigate to specific image with smooth transition
  const navigateToImage = useCallback(
    (index) => {
      setCurrentIndex(index);
      setIsManualMode(true); // Switch to manual mode permanently

      if (sliderRef.current) {
        // Add manual mode class to stop animation
        sliderRef.current.classList.add("manual-mode");

        // Get the appropriate width based on screen size using responsive hook
        let imageWidth, gap;

        if (width >= 768) {
          imageWidth = 360;
          gap = 32;
        } else if (width >= 640) {
          imageWidth = 280;
          gap = 24;
        } else {
          imageWidth = 200;
          gap = 16;
        }

        const scrollPosition = index * (imageWidth + gap);

        // Apply smooth transition
        sliderRef.current.style.transition = "transform 0.5s ease-in-out";
        sliderRef.current.style.transform = `translateX(-${scrollPosition}px)`;
      }
    },
    [width],
  );

  // Navigate to previous image
  const handlePrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    navigateToImage(newIndex);
  }, [currentIndex, images.length, navigateToImage]);

  // Navigate to next image
  const handleNext = useCallback(() => {
    const newIndex = (currentIndex + 1) % images.length;
    navigateToImage(newIndex);
  }, [currentIndex, images.length, navigateToImage]);

  // Set up swipe gesture handling
  const { ref: swipeRef } = useSwipe(handleNext, handlePrevious, 40);

  if (!images || images.length === 0) {
    return null;
  }

  // Create duplicate images for seamless loop (2x is enough)
  const duplicatedImages = [...images, ...images];

  return (
    <section className="pt-6 sm:pt-8 md:pt-10 lg:pt-14 pb-6 sm:pb-8 md:pb-10 lg:pb-14 bg-white">
      <Container className="content-maxwidth image-slider-content">
        <div className="text-left mb-6 sm:mb-7 md:mb-8 lg:mb-10 mt-0 pt-0">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            {/* Left: Headline */}
            <div className="w-full lg:flex-1 flex flex-col items-start text-left">
              <h1 className="section-heading-display heading-orange text-orange-500 font-semibold leading-[1.2] tracking-tight mb-6">
                {title}
              </h1>
            </div>

            {/* Right: Description */}
            <div className="w-full lg:flex-[1.5] flex flex-col items-start text-left lg:ml-11">
              <p className="paragraph-display font-medium text-gray-800 text-justify">
                Stop worrying about design errors or manufacturing delays. Our
                comprehensive approach integrates advanced simulation and
                in-house prototyping to catch issues early, delivering
                high-performance PCB designs that are optimized for cost and
                rapid production.
              </p>
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Carousel */}
        <div
          ref={(el) => {
            containerRef.current = el;
            swipeRef.current = el;
          }}
          className="overflow-hidden relative rounded-xl md:rounded-2xl group pb-2 sm:pb-3 md:pb-4"
        >
          {/* Left Arrow Button */}
          <button
            onClick={handlePrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div
            ref={sliderRef}
            className="animate-image-marquee"
            style={{ width: "max-content" }}
          >
            {duplicatedImages.map((image, index) => (
              <div
                key={`${index}-${typeof image === "object" ? image.src : image}`}
                className="shrink-0 w-40 h-25 sm:w-55 sm:h-35 md:w-70 md:h-45 lg:w-90 lg:h-60 rounded-lg md:rounded-xl lg:rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group relative cursor-pointer flex items-center justify-center"
                style={{ fontSize: 0, lineHeight: 0 }}
              >
                <img
                  src={typeof image === "object" ? image.src : image}
                  alt={
                    typeof image === "object"
                      ? image.name
                      : `Product ${(index % images.length) + 1}`
                  }
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="400"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{
                    objectPosition: "center",
                    display: "block",
                    verticalAlign: "middle",
                    height: "100%",
                    width: "100%",
                  }}
                />
                {/* Sliding Overlay on Hover */}
                {typeof image === "object" && image.name && (
                  <div className="absolute left-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-linear-to-t from-orange-700/90 via-orange-500/80 to-transparent text-white text-center py-1.5 sm:py-2 md:py-3 px-1.5 text-xs sm:text-sm md:text-base font-semibold tracking-wide flex flex-col items-center rounded-b-lg md:rounded-b-xl lg:rounded-b-2xl">
                    <div className="mb-0.5 sm:mb-1 text-xs sm:text-sm md:text-base font-bold drop-shadow-lg">
                      {image.name}
                    </div>
                    {image.description && (
                      <div className="text-sm md:text-base font-normal drop-shadow-md">
                        {image.description}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
