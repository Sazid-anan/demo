import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContent } from "../redux/slices/contentSlice";
import Container from "../components/common/Container";
import PageHero from "../components/common/PageHero";
import EmptyStatePanel from "../components/common/EmptyStatePanel";
import Button from "../components/ui/Button";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import FilterChips from "../components/common/FilterChips";
import PaginationControls from "../components/common/PaginationControls";
import DetailModalShell from "../components/common/DetailModalShell";
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
      <PageHero
        title="Our Products"
        description="From hardware design to edge AI deployment, we deliver complete engineering solutions that bring intelligent products to life."
      />

      {/* Products Grid or Empty State */}
      {hasNoProducts ? (
        <EmptyStatePanel
          icon={Package}
          title="Coming Soon"
          description="We're working on some amazing products that will transform your business. Check back soon for exciting announcements!"
        />
      ) : (
        <Container className="py-12 sm:py-16 md:py-20">
          {/* Category Filter */}
          {categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FilterChips
                label="Filter by Category:"
                options={categories}
                selected={selectedCategory}
                allLabel="All Products"
                onChange={(value) => {
                  setSelectedCategory(value);
                  setCurrentPage(1);
                }}
              />
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
              <p className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-base">
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
                  <p className="text-gray-600 text-[12px] sm:text-[13px] md:text-[14px] lg:text-base mb-3 sm:mb-4 line-clamp-2">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <PaginationControls
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              className="mt-8 sm:mt-12"
            />
          </motion.div>
        </Container>
      )}

      {/* Product Detail Modal */}
      {activeProduct && (
      <DetailModalShell
        isOpen={Boolean(activeProduct)}
        onClose={() => {
          setSelectedProduct(null);
          if (productId) setDismissedProductId(productId);
        }}
        title={activeProduct?.name}
        maxWidthClass="max-w-2xl"
        showBackdropBlur={false}
      >
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
      </DetailModalShell>
      )}
    </div>
  );
}
