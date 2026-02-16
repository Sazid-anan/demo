/**
 * Shared filter chips for category/tag selection.
 */
export default function FilterChips({
  label = "Filter by:",
  options = [],
  selected = "",
  allLabel = "All",
  onChange,
  selectedClass = "bg-brand-orange text-brand-black shadow-lg",
  unselectedClass = "bg-gray-100 text-brand-black hover:bg-gray-200",
  className = "",
}) {
  return (
    <div
      className={`mb-6 sm:mb-7 md:mb-8 flex flex-wrap items-center gap-2 sm:gap-3 ${className}`}
      role="group"
      aria-label={label}
    >
      <span className="font-medium text-brand-black text-[12px] sm:text-[13px] md:text-[14px] uppercase tracking-wide">
        {label}
      </span>

      <button
        type="button"
        onClick={() => onChange?.("")}
        aria-pressed={selected === ""}
        className={`px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full font-medium transition-all text-[12px] sm:text-[13px] md:text-[14px] ${
          selected === ""
            ? selectedClass
            : unselectedClass
        }`}
      >
        {allLabel}
      </button>

      {options.map((option) => (
        <button
          type="button"
          key={option}
          onClick={() => onChange?.(option)}
          aria-pressed={selected === option}
          className={`px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full font-medium transition-all text-[12px] sm:text-[13px] md:text-[14px] orange-pop-hover ${
            selected === option
              ? selectedClass
              : unselectedClass
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
