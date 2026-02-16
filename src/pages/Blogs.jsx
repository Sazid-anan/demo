import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContent } from "../redux/slices/contentSlice";
import Container from "../components/common/Container";
import PageHero from "../components/common/PageHero";
import EmptyStatePanel from "../components/common/EmptyStatePanel";
import Button from "../components/ui/Button";
import { motion } from "framer-motion";
import FilterChips from "../components/common/FilterChips";
import PaginationControls from "../components/common/PaginationControls";
import DetailModalShell from "../components/common/DetailModalShell";
import Badge from "../components/ui/Badge";
import { Card, CardContent } from "../components/ui/Card";
import { Calendar, Clock, ArrowRight, FileText } from "lucide-react";
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
      <PageHero
        title="Blogs"
        description="From hardware design to edge AI deployment, we deliver complete engineering solutions that bring intelligent products to life."
      />

      {/* Empty State or Content */}
      {hasNoBlogs ? (
        <EmptyStatePanel
          icon={FileText}
          title="Coming Soon"
          description="We're crafting insightful articles and resources on Edge AI, product development, and technology innovation. Stay tuned for exciting content!"
        />
      ) : (
        <>
          {/* Category Filter */}
          {categories.length > 0 && (
            <section className="py-6 sm:py-7 md:py-8 border-b border-gray-200">
              <Container>
                <FilterChips
                  label="Filter by:"
                  options={categories}
                  selected={selectedCategory}
                  allLabel="All Posts"
                  selectedClass="bg-brand-orange text-white"
                  unselectedClass="bg-white border border-gray-200 text-gray-700 hover:border-brand-orange"
                  onChange={(value) => {
                    setSelectedCategory(value);
                    setCurrentPage(1);
                  }}
                />
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
                            <div className="flex items-center gap-2 sm:gap-3 text-[12px] sm:text-[13px] text-muted-foreground mb-2 sm:mb-3">
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
                            <p className="text-[13px] sm:text-[14px] md:text-[15px] lg:text-base text-muted-foreground mb-3 sm:mb-4 line-clamp-3">
                              {blog.excerpt || blog.description}
                            </p>
                            {blog.author && (
                              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-secondary flex items-center justify-center text-xs sm:text-xs md:text-sm font-semibold">
                                  {blog.author.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-[12px] sm:text-[13px] md:text-[14px] text-muted-foreground">
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
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <PaginationControls
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </motion.div>
            </Container>
          </section>
        </>
      )}

      {/* Blog Detail Modal */}
      {selectedBlog && (
      <DetailModalShell
        isOpen={Boolean(selectedBlog)}
        onClose={() => setSelectedBlog(null)}
        title={selectedBlog?.title}
        maxWidthClass="max-w-4xl"
      >
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
      </DetailModalShell>
      )}
    </div>
  );
}
