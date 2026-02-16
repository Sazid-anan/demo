import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchContent } from "../redux/slices/contentSlice";
import Container from "../components/common/Container";
import Button from "../components/ui/Button";
import { motion } from "framer-motion";
import Badge from "../components/ui/Badge";
import { Card, CardContent } from "../components/ui/Card";
import { Calendar, Clock, ArrowRight, X, FileText } from "lucide-react";
import { renderMarkdown } from "../utils/markdown";

/**
 * Blogs Page
 * Displays all blog posts
 */
export default function Blogs() {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.content);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  useEffect(() => {
    dispatch(fetchContent());
  }, [dispatch]);

  // Get unique categories from blogs
  const categories = useMemo(() => {
    if (!blogs || blogs.length === 0) return [];
    return Array.from(
      new Set(blogs.map((b) => b.category).filter((c) => c)),
    ).sort();
  }, [blogs]);

  // Filter blogs by category
  const filteredBlogs = useMemo(() => {
    if (!selectedCategory) return blogs || [];
    return (blogs || []).filter((b) => b.category === selectedCategory);
  }, [blogs, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const paginatedBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + blogsPerPage,
  );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const hasNoBlogs = !blogs || blogs.length === 0;

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
                  Blogs
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

      {/* Empty State or Content */}
      {hasNoBlogs ? (
        <section className="py-8 sm:py-12 md:py-16">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-2xl mx-auto px-4"
            >
              <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-h3 font-bold text-foreground mb-4">
                Coming Soon
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg mb-8 leading-relaxed">
                We're crafting insightful articles and resources on Edge AI,
                product development, and technology innovation. Stay tuned for
                exciting content!
              </p>
              <Link to="/">
                <Button className="mt-4">Back to Home</Button>
              </Link>
            </motion.div>
          </Container>
        </section>
      ) : (
        <>
          {/* Category Filter */}
          {categories.length > 0 && (
            <section className="py-6 sm:py-7 md:py-8 border-b border-gray-200">
              <Container>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-xs md:text-sm font-semibold text-muted-foreground">
                    Filter by:
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedCategory("");
                      setCurrentPage(1);
                    }}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-xs md:text-sm font-medium transition-all ${
                      !selectedCategory
                        ? "bg-brand-orange text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:border-brand-orange"
                    }`}
                  >
                    All Posts
                  </motion.button>
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedCategory(category);
                        setCurrentPage(1);
                      }}
                      className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-xs md:text-sm lg:text-base font-medium transition-all ${
                        selectedCategory === category
                          ? "bg-brand-orange text-white"
                          : "bg-white border border-gray-200 text-gray-700 hover:border-brand-orange"
                      }`}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </Container>
            </section>
          )}

          {/* Blog Posts Grid */}
          <section className="py-12 sm:py-16 md:py-20">
            <Container>
              {filteredBlogs.length === 0 ? (
                <div className="text-center py-12 sm:py-16 md:py-20">
                  <p className="text-body-sm text-muted-foreground px-4">
                    No blog posts found in this category. Try selecting a
                    different one!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  {paginatedBlogs.map((blog, index) => (
                    <motion.div
                      key={blog.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      style={{ willChange: "opacity, transform" }}
                    >
                      <Card className="h-full hover:shadow-2xl transition-all cursor-pointer group">
                        <CardContent className="p-0">
                          {blog.featured_image && (
                            <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden rounded-t-xl">
                              <img
                                src={blog.featured_image}
                                alt={blog.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                                decoding="async"
                              />
                              {blog.category && (
                                <div className="absolute top-4 left-4">
                                  <Badge className="bg-white/90 text-brand-orange border-0">
                                    {blog.category}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          )}
                          <div className="p-5 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-xs text-muted-foreground mb-2 sm:mb-3">
                              {blog.published_date && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{formatDate(blog.published_date)}</span>
                                </div>
                              )}
                              {blog.read_time && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{blog.read_time} min read</span>
                                </div>
                              )}
                            </div>
                            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-foreground mb-2 sm:mb-3 group-hover:text-brand-orange transition-colors">
                              {blog.title}
                            </h3>
                            <p className="text-xs sm:text-xs md:text-sm lg:text-base text-muted-foreground mb-3 sm:mb-4 line-clamp-3">
                              {blog.excerpt || blog.description}
                            </p>
                            {blog.author && (
                              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-secondary flex items-center justify-center text-xs sm:text-xs md:text-sm font-semibold">
                                  {blog.author.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs sm:text-xs md:text-sm text-muted-foreground">
                                  {blog.author}
                                </span>
                              </div>
                            )}
                            <Button
                              size="sm"
                              className="group"
                              onClick={() => setSelectedBlog(blog)}
                            >
                              Read More
                              <ArrowRight
                                className="w-5 h-5 text-brand-orange group-hover:translate-x-1 transition-transform"
                                strokeWidth={2.7}
                              />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination - Only show if blogs exist */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2 mt-12"
                >
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-xs md:text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 text-brand-black hover:bg-brand-orange hover:text-white"
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
                    className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-xs md:text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 text-brand-black hover:bg-brand-orange hover:text-white"
                  >
                    Next
                  </button>
                </motion.div>
              )}
            </Container>
          </section>
        </>
      )}

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
          onClick={() => setSelectedBlog(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground pr-4">
                {selectedBlog.title}
              </h2>
              <button
                onClick={() => setSelectedBlog(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              {selectedBlog.featured_image && (
                <div className="mb-4 sm:mb-6 rounded-lg sm:rounded-xl overflow-hidden">
                  <img
                    src={selectedBlog.featured_image}
                    alt={selectedBlog.title}
                    className="w-full h-48 sm:h-64 md:h-80 lg:h-auto object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                {selectedBlog.author && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-semibold">
                      {selectedBlog.author.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{selectedBlog.author}</span>
                  </div>
                )}
                {selectedBlog.published_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(selectedBlog.published_date)}</span>
                  </div>
                )}
                {selectedBlog.read_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{selectedBlog.read_time} min read</span>
                  </div>
                )}
                {selectedBlog.category && (
                  <Badge className="bg-secondary text-foreground">
                    {selectedBlog.category}
                  </Badge>
                )}
              </div>

              <div
                className="prose prose-lg max-w-none markdown-content"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(selectedBlog.content || ""),
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
