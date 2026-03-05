export class PerformanceMonitor {
  vitals: Record<string, number> = {};
  metrics: any[] = [];
  isDev: boolean;
  isProd: boolean;

  constructor() {
    this.vitals = {};
    this.metrics = [];
    this.isDev = (import.meta as any).env.DEV;
    this.isProd = (import.meta as any).env.PROD;
  }

  initWebVitals() {
    if (!("PerformanceObserver" in window)) return;

    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const lastEntry = list.getEntries().pop() as any;
        if (lastEntry) {
          this.vitals.LCP = lastEntry.renderTime || lastEntry.loadTime;
          this.logMetric("LCP", this.vitals.LCP, "ms", { threshold: 2500 });
        }
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      if (this.isDev) console.warn("LCP monitoring not available:", e);
    }

    // First Input Delay (FID) / Interaction to Next Paint (INP)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          const entryAny = entry as any;
          const delay = entryAny.processingStart - entry.startTime;
          this.vitals.FID = delay;
          this.logMetric("FID", delay, "ms", { threshold: 100 });
        }
      });
      fidObserver.observe({ entryTypes: ["first-input", "event"] });
    } catch (e) {
      if (this.isDev) console.warn("FID monitoring not available:", e);
    }

    // Cumulative Layout Shift (CLS)
    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const entryAny = entry as any;
          if (!entryAny.hadRecentInput) {
            this.vitals.CLS = (this.vitals.CLS || 0) + entryAny.value;
            this.logMetric("CLS", this.vitals.CLS, "", { threshold: 0.1 });
          }
        }
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });
    } catch (e) {
      if (this.isDev) console.warn("CLS monitoring not available:", e);
    }
  }

  logPageLoadTime() {
    if (typeof window === "undefined" || !window.performance) return;

    // Use modern Performance API instead of deprecated performance.timing
    try {
      const navigationEntry = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      if (!navigationEntry) return;

      const pageLoadTime = navigationEntry.loadEventEnd - navigationEntry.fetchStart;

      // Only log if values are valid (positive)
      if (pageLoadTime > 0 && pageLoadTime < 60000) {
        this.logMetric("Page Load Time", pageLoadTime, "ms", { threshold: 3000 });

        const metrics = {
          "DNS Lookup": navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
          "TCP Connection": navigationEntry.connectEnd - navigationEntry.connectStart,
          "Server Response": navigationEntry.responseEnd - navigationEntry.requestStart,
          "DOM Processing": navigationEntry.domComplete - navigationEntry.domInteractive,
          "Resource Loading": navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
        };

        Object.entries(metrics).forEach(([name, time]) => {
          if (time >= 0 && time < 60000) {
            this.logMetric(name, time, "ms");
          }
        });
      }
    } catch (e) {
      if (this.isDev) console.warn("Performance logging not available:", e);
    }
  }

  logMetric(
    metricName: string,
    value: number,
    unit: string = "ms",
    options: Record<string, any> = {},
  ) {
    const metric = {
      name: metricName,
      value,
      unit,
      timestamp: new Date().toISOString(),
      threshold: options.threshold,
      isThresholdExceeded: options.threshold && value > options.threshold,
    };

    this.metrics.push(metric);

    if (this.isDev) {
      const status = metric.isThresholdExceeded ? "⚠️" : "✅";
      console.log(
        `${status} ${metricName}: ${value}${unit}${
          options.threshold ? ` (threshold: ${options.threshold}${unit})` : ""
        }`,
      );
    }

    // Send to analytics in production
    if (this.isProd && (window as any).gtag) {
      (window as any).gtag("event", "page_view_metric", {
        metric_name: metricName,
        value: Math.round(value),
        unit,
      });
    }
  }

  measureOperation(operationName: string, duration: number) {
    this.logMetric(`Operation: ${operationName}`, duration, "ms", {
      threshold: 1000,
    });
  }

  getMetrics() {
    return this.metrics;
  }

  getVitals() {
    return this.vitals;
  }

  getPerformanceScore(): number {
    let score = 100;

    // LCP scoring
    if (this.vitals.LCP) {
      if (this.vitals.LCP > 4000) score -= 40;
      else if (this.vitals.LCP > 2500) score -= 20;
      else if (this.vitals.LCP > 1000) score -= 10;
    }

    // FID scoring
    if (this.vitals.FID) {
      if (this.vitals.FID > 300) score -= 40;
      else if (this.vitals.FID > 100) score -= 20;
      else if (this.vitals.FID > 50) score -= 10;
    }

    // CLS scoring
    if (this.vitals.CLS) {
      if (this.vitals.CLS > 0.25) score -= 40;
      else if (this.vitals.CLS > 0.1) score -= 20;
      else if (this.vitals.CLS > 0.05) score -= 10;
    }

    return Math.max(0, score);
  }
}

export const performanceMonitor = new PerformanceMonitor();
