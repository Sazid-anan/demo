import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContent } from "../redux/slices/contentSlice";
import Container from "../components/common/Container";
import Button from "../components/ui/Button";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { renderMarkdown } from "../utils/markdown";
import { Package } from "lucide-react";

/**
 * Products Page
 * Displays all available products
 */
export default function Products() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.content);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dismissedProductId, setDismissedProductId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchContent());
  }, [dispatch]);

  const productId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("productId");
  }, [location.search]);

  // Get unique categories from products
  const categories = useMemo(() => {
    if (!products || products.length === 0) return [];
    return Array.from(
      new Set(products.map((p) => p.category).filter((c) => c)),
    ).sort();
  }, [products]);

  const autoSelectedProduct = useMemo(() => {
    if (!productId || !products || products.length === 0) return null;
    return products.find((p) => String(p.id) === String(productId)) || null;
  }, [productId, products]);

  const activeProduct =
    selectedProduct ||
    (productId && String(productId) === String(dismissedProductId)
      ? null
      : autoSelectedProduct);

  const normalizedDescription = activeProduct?.description?.trim() || "";
  const normalizedDetails = activeProduct?.details?.trim() || "";
  const hasDetails =
    normalizedDetails && normalizedDetails !== normalizedDescription;

  const buildContactLink = (productName, intent) => {
    const base = "/contact";
    const params = new URLSearchParams();
    if (productName) params.set("product", productName);
    if (intent) params.set("intent", intent);
    const query = params.toString();
    return query ? `${base}?${query}` : base;
  };

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!selectedCategory) return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  // Fallback products for demo
  const displayProducts =
    paginatedProducts && paginatedProducts.length > 0 ? paginatedProducts : []; // Empty array - use admin panel to add products

  const hasNoProducts = !products || products.length === 0;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="py-8 sm:py-10 md:py-12">
        <Container className="content-maxwidth">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 sm:mb-7 md:mb-8 lg:mb-10"
          >
            <div className="flex flex-row items-start gap-3 md:gap-4">
              <div className="w-full sm:flex-1 flex flex-col items-start text-left sm:w-auto">
                <h1 className="capabilities-gradient-text font-semibold leading-[1.25] tracking-tight mb-2 sm:mb-3 md:mb-4 lg:mb-6 text-[18px] sm:text-[24px] md:text-[32px] lg:text-[50px]">
                  Our Products
                </h1>
              </div>
              <div className="w-full sm:flex-[1.5] flex flex-col items-start text-left mt-4 sm:mt-0 sm:w-auto">
                <p className="text-justify text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-black">
                  From hardware design to edge AI deployment, we deliver
                  complete engineering solutions that bring intelligent products
                  to life.
                </p>
              </div>
            </div>
          </motion.div>
        </Container>
      </div>

      {/* Products Grid or Empty State */}
      {hasNoProducts ? (
        <Container className="py-8 sm:py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto px-4"
          >
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-h3 font-bold text-brand-black mb-4">
              Coming Soon
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg mb-8 leading-relaxed">
              We're working on some amazing products that will transform your
              business. Check back soon for exciting announcements!
            </p>
            <Link to="/">
              <Button className="mt-4">Back to Home</Button>
            </Link>
          </motion.div>
        </Container>
      ) : (
        <Container className="py-12 sm:py-16 md:py-20">
          {/* Category Filter */}
          {categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 sm:mb-7 md:mb-8 flex flex-wrap items-center gap-2 sm:gap-3"
            >
              <span className="font-medium text-brand-black text-xs sm:text-xs md:text-sm uppercase tracking-wide">
                Filter by Category:
              </span>
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full font-medium transition-all text-xs sm:text-xs md:text-sm ${
                  selectedCategory === ""
                    ? "bg-brand-orange text-brand-black shadow-lg"
                    : "bg-gray-100 text-brand-black hover:bg-gray-200"
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full font-medium transition-all text-xs sm:text-xs md:text-sm orange-pop-hover ${
                    selectedCategory === cat
                      ? "bg-brand-orange text-brand-black shadow-lg"
                      : "bg-gray-100 text-brand-black hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          )}

          {displayProducts.length === 0 &&
          filteredProducts.length === 0 &&
          !hasNoProducts ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 sm:py-12 px-4 text-gray-600"
            >
              <p className="text-xs sm:text-xs md:text-sm lg:text-base">
                No products found in this category. Try selecting a different
                one.
              </p>
            </motion.div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {displayProducts.map((product, i) => (
              <motion.div
                key={product.id}
                custom={i}
                variants={contentVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => {
                  setSelectedProduct(product);
                  setDismissedProductId(null);
                }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer relative group border-2 border-gray-200 orange-pop-hover"
                style={{ willChange: "transform" }}
              >
                {/* Glass effect overlay on hover - simplified for mobile */}
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-gray-100/60 opacity-0 md:group-hover:opacity-100 md:backdrop-blur-[1px] border border-white/60 md:shadow-2xl transition-opacity duration-300 z-10 pointer-events-none"></span>

                {/* Product Image */}
                <div className="relative overflow-hidden h-48 sm:h-52 md:h-56">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4 sm:p-5 md:p-6 relative z-20">
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-brand-black mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-xs md:text-sm lg:text-base mb-3 sm:mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                        setDismissedProductId(null);
                      }}
                      className="flex-1"
                    >
                      Learn More
                    </Button>
                    <Link
                      to={buildContactLink(product.name, "inquiry")}
                      className="flex-1"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Inquire
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination - Only show if actual products exist */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2 mt-8 sm:mt-12"
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-xs md:text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 text-brand-black hover:bg-brand-orange hover:text-white"
              >
                Previous
              </button>

              <div className="flex gap-1.5 sm:gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[32px] sm:min-w-[36px] md:min-w-[40px] h-8 sm:h-9 md:h-10 rounded-lg font-medium text-xs sm:text-xs md:text-sm transition-all flex-shrink-0 ${
                        currentPage === page
                          ? "bg-brand-orange text-white shadow-lg"
                          : "bg-gray-100 text-brand-black hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-xs md:text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 text-brand-black hover:bg-brand-orange hover:text-white"
              >
                Next
              </button>
            </motion.div>
          )}
        </Container>
      )}

      {/* Product Detail Modal */}
      {activeProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setSelectedProduct(null);
            if (productId) setDismissedProductId(productId);
          }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 flex justify-between items-center p-4 sm:p-6 z-10">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-black pr-4">
                {activeProduct.name}
              </h2>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  if (productId) setDismissedProductId(productId);
                }}
                type="button"
                aria-label="Close product details"
                className="text-gray-600 hover:text-brand-black text-2xl sm:text-3xl flex-shrink-0"
              >
                ×
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <img
                src={activeProduct.image_url}
                alt={activeProduct.name}
                className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-lg mb-4 sm:mb-6"
              />

              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-brand-black mb-2">
                  Description
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
                  {activeProduct.description}
                </p>
              </div>

              {hasDetails && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-bold text-brand-black mb-2">
                    Details
                  </h3>
                  <div
                    className="markdown-content text-xs sm:text-sm md:text-base"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(activeProduct.details),
                    }}
                  />
                </div>
              )}

              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-brand-black mb-2">
                  Contact Information
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base break-all">
                  Email:{" "}
                  <a
                    href={`mailto:${activeProduct.contact_info}`}
                    className="text-brand-orange hover:underline"
                  >
                    {activeProduct.contact_info}
                  </a>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  to={buildContactLink(activeProduct?.name, "demo")}
                  className="flex-1"
                >
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      setSelectedProduct(null);
                      if (productId) setDismissedProductId(productId);
                    }}
                  >
                    Request Demo
                  </Button>
                </Link>
                <Link
                  to={buildContactLink(activeProduct?.name, "inquiry")}
                  className="flex-1"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedProduct(null);
                      if (productId) setDismissedProductId(productId);
                    }}
                  >
                    Send Inquiry
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
