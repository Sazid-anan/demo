import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Container from "./Container";
import Button from "../ui/Button";

/**
 * Shared empty-state panel for listing pages.
 */
export default function EmptyStatePanel({
  icon: Icon,
  title,
  description,
  ctaLabel = "Back to Home",
  ctaTo = "/",
  className = "",
}) {
  return (
    <section className={`py-8 sm:py-12 md:py-16 ${className}`}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto px-4"
        >
          {Icon ? (
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100">
              <Icon className="w-10 h-10 text-gray-400" />
            </div>
          ) : null}
          <h2 className="text-h3 font-bold text-foreground mb-4">{title}</h2>
          <p className="text-gray-600 text-[14px] sm:text-[15px] md:text-[17px] lg:text-[19px] mb-8 leading-relaxed">
            {description}
          </p>
          <Link to={ctaTo}>
            <Button className="mt-2">{ctaLabel}</Button>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
