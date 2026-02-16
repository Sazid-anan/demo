/**
 * Card Component
 * Container component with modern styling
 */
export function Card({ children, className = "" }) {
  return (
    <div
      className={`
      bg-card text-card-foreground 
      rounded-xl border border-border
      flex flex-col gap-6
      transition-all duration-300 ease-out
      hover:shadow-xl hover:border-orange-200/50
      ${className}
    `}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div
      className={`
      grid auto-rows-min items-start gap-1.5 
      px-6 pt-6
      ${className}
    `}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }) {
  return (
    <h4
      className={`
      text-lg font-semibold leading-none
      ${className}
    `}
    >
      {children}
    </h4>
  );
}

export function CardDescription({ children, className = "" }) {
  return (
    <p
      className={`
      text-muted-foreground text-sm
      ${className}
    `}
    >
      {children}
    </p>
  );
}

export function CardContent({ children, className = "" }) {
  return (
    <div
      className={`
      px-6 pb-6
      ${className}
    `}
    >
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "" }) {
  return (
    <div
      className={`
      px-6 pb-6 flex gap-3
      ${className}
    `}
    >
      {children}
    </div>
  );
}
