/**
 * Shared pagination controls used by list pages.
 */
export default function PaginationControls({
  totalPages,
  currentPage,
  onPageChange,
  className = "",
}) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div
      className={`flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2 mt-12 ${className}`}
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[12px] sm:text-[13px] md:text-[14px] font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 text-brand-black hover:bg-brand-orange hover:text-white"
      >
        Previous
      </button>

      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            type="button"
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? "page" : undefined}
            className={`min-w-[32px] sm:min-w-[36px] md:min-w-[40px] h-8 sm:h-9 md:h-10 rounded-lg font-medium text-[12px] sm:text-[13px] md:text-[14px] transition-all flex-shrink-0 ${
              currentPage === page
                ? "bg-brand-orange text-white shadow-lg"
                : "bg-gray-100 text-brand-black hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[12px] sm:text-[13px] md:text-[14px] font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 text-brand-black hover:bg-brand-orange hover:text-white"
      >
        Next
      </button>
    </div>
  );
}
