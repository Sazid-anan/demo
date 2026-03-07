/**
 * Skeleton Components
 * Loading placeholders for better UX during content loading
 */

export function SkeletonBox({ className = "", width = "100%", height = "20px" }) {
  return (
    <div className={`bg-gray-200 animate-pulse rounded ${className}`} style={{ width, height }} />
  );
}

export function SkeletonText({ lines = 1, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBox key={i} height="16px" width={i === lines - 1 ? "80%" : "100%"} />
      ))}
    </div>
  );
}

export function SkeletonImage({ className = "", width = "100%", height = "200px" }) {
  return (
    <div className={`bg-gray-200 animate-pulse rounded ${className}`} style={{ width, height }} />
  );
}

export function SkeletonCard({ className = "" }) {
  return (
    <div className={`p-4 space-y-4 ${className}`}>
      <SkeletonImage height="180px" />
      <SkeletonText lines={2} />
      <div className="flex gap-2">
        <SkeletonBox width="60%" height="30px" />
        <SkeletonBox width="35%" height="30px" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3, className = "" }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonBox key={i} height="60px" />
      ))}
    </div>
  );
}
