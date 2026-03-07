export default function Container({ children, className = "" }) {
  return (
    <div
      className={`
        w-full mx-auto max-w-[1280px]
        px-4 sm:px-6 md:px-8 lg:px-10
        ${className}
      `}
    >
      {children}
    </div>
  );
}
