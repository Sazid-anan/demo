/**
 * Analytics Service
 * Tracks user interactions, page views, and conversion events
 * Integrates with Google Analytics 4 and custom tracking
 */

export class AnalyticsService {
  isDev: boolean;
  isProd: boolean;
  events: any[] = [];
  private readonly MAX_EVENTS = 500;

  constructor() {
    this.isDev = (import.meta as any).env.DEV;
    this.isProd = (import.meta as any).env.PROD;
    this.events = [];
  }

  /**
   * Track page view
   */
  trackPageView(pageName: string, properties: Record<string, any> = {}) {
    const eventData = {
      event: "page_view",
      page_title: pageName,
      page_path: window.location.pathname,
      page_location: window.location.href,
      timestamp: new Date().toISOString(),
      ...properties,
    };

    this._logEvent(eventData);

    // Send to GA4
    if (this.isProd && (window as any).gtag) {
      (window as any).gtag("event", "page_view", {
        page_title: pageName,
        page_path: window.location.pathname,
        ...properties,
      });
    }
  }

  /**
   * Track user interaction events
   */
  trackEvent(eventName: string, category: string, label: string = "", value: number | string = "") {
    const eventData = {
      event: eventName,
      event_category: category,
      event_label: label,
      event_value: value,
      timestamp: new Date().toISOString(),
    };

    this._logEvent(eventData);

    // Send to GA4
    if (this.isProd && (window as any).gtag) {
      (window as any).gtag("event", eventName, {
        event_category: category,
        event_label: label,
        value,
      });
    }
  }

  /**
   * Track form submission
   */
  trackFormSubmission(formName: string, fields: Record<string, any> = {}, success: boolean = true) {
    const eventData = {
      event: success ? "form_submit_success" : "form_submit_error",
      form_name: formName,
      form_fields: Object.keys(fields).filter((k) => k !== "message"), // Don't track sensitive data
      timestamp: new Date().toISOString(),
    };

    this._logEvent(eventData);

    // Send to GA4
    if (this.isProd && (window as any).gtag) {
      (window as any).gtag("event", success ? "form_submit" : "form_error", {
        form_name: formName,
        form_destination: window.location.pathname,
      });
    }
  }

  /**
   * Track product interaction (view, click, add to cart simulation)
   */
  trackProductInteraction(
    productId: string,
    productName: string,
    action: "view" | "click" | "details" | "inquire",
    category: string = "",
  ) {
    const eventData = {
      event: `product_${action}`,
      product_id: productId,
      product_name: productName,
      product_category: category,
      timestamp: new Date().toISOString(),
    };

    this._logEvent(eventData);

    // Send to GA4
    if (this.isProd && (window as any).gtag) {
      (window as any).gtag("event", `product_${action}`, {
        product_id: productId,
        product_name: productName,
        product_category: category,
      });
    }
  }

  /**
   * Track blog interaction
   */
  trackBlogInteraction(
    blogId: string,
    blogTitle: string,
    action: "view" | "read" | "share",
    readTime: number = 0,
  ) {
    const eventData = {
      event: `blog_${action}`,
      content_id: blogId,
      content_title: blogTitle,
      content_type: "blog",
      engagement_time: action === "read" ? readTime : 0,
      timestamp: new Date().toISOString(),
    };

    this._logEvent(eventData);

    // Send to GA4
    if (this.isProd && (window as any).gtag) {
      (window as any).gtag("event", `blog_${action}`, {
        content_id: blogId,
        content_title: blogTitle,
        engagement_time: readTime,
      });
    }
  }

  /**
   * Track button/link clicks
   */
  trackClick(
    elementName: string,
    elementType: "button" | "link" | "tab",
    destination: string = "",
  ) {
    const eventData = {
      event: "element_click",
      element_name: elementName,
      element_type: elementType,
      destination,
      timestamp: new Date().toISOString(),
    };

    this._logEvent(eventData);

    // Send to GA4
    if (this.isProd && (window as any).gtag) {
      (window as any).gtag("event", "element_click", {
        element_name: elementName,
        element_type: elementType,
      });
    }
  }

  /**
   * Track conversion events
   */
  trackConversion(
    conversionName: string,
    conversionValue: number = 1,
    properties: Record<string, any> = {},
  ) {
    const eventData = {
      event: "conversion",
      conversion_name: conversionName,
      conversion_value: conversionValue,
      timestamp: new Date().toISOString(),
      ...properties,
    };

    this._logEvent(eventData);

    // Send to GA4
    if (this.isProd && (window as any).gtag) {
      (window as any).gtag("event", "conversion", {
        conversion_name: conversionName,
        conversion_value: conversionValue,
        ...properties,
      });
    }
  }

  /**
   * Track search/filter interactions
   */
  trackSearch(searchTerm: string, resultsCount: number = 0) {
    const eventData = {
      event: "search",
      search_term: searchTerm,
      results_count: resultsCount,
      timestamp: new Date().toISOString(),
    };

    this._logEvent(eventData);

    // Send to GA4
    if (this.isProd && (window as any).gtag) {
      (window as any).gtag("event", "search", {
        search_term: searchTerm,
        results: resultsCount,
      });
    }
  }

  /**
   * Track error events
   */
  trackError(errorMessage: string, errorType: string = "app_error") {
    const eventData = {
      event: "error",
      error_message: errorMessage,
      error_type: errorType,
      timestamp: new Date().toISOString(),
      page_location: window.location.href,
    };

    this._logEvent(eventData);

    // Send to GA4
    if (this.isProd && (window as any).gtag) {
      (window as any).gtag("event", "exception", {
        description: errorMessage,
        fatal: false,
      });
    }
  }

  /**
   * Track scroll depth
   */
  trackScrollDepth(percentage: number) {
    const eventData = {
      event: "scroll_depth",
      scroll_percentage: percentage,
      timestamp: new Date().toISOString(),
    };

    this._logEvent(eventData);

    // Send to GA4
    if (this.isProd && (window as any).gtag) {
      (window as any).gtag("event", "scroll", {
        scroll_percentage: percentage,
      });
    }
  }

  /**
   * Internal logging
   */
  private _logEvent(eventData: Record<string, any>) {
    this.events.push(eventData);

    // Enforce max events cap
    if (this.events.length > this.MAX_EVENTS) {
      this.events.shift();
    }

    if (this.isDev) {
      if (import.meta.env.DEV) {
        console.log("📊 Analytics Event:", eventData);
      }
    }
  }

  /**
   * Get all tracked events
   */
  getEvents() {
    return this.events;
  }

  /**
   * Get events by type
   */
  getEventsByType(eventType: string) {
    return this.events.filter((e) => e.event === eventType);
  }

  /**
   * Clear events
   */
  clearEvents() {
    this.events = [];
  }

  /**
   * Get session summary
   */
  getSessionSummary() {
    return {
      totalEvents: this.events.length,
      pageViews: this.events.filter((e) => e.event === "page_view").length,
      formSubmissions: this.events.filter((e) => e.event.includes("form_submit")).length,
      productInteractions: this.events.filter((e) => e.event.startsWith("product_")).length,
      blogInteractions: this.events.filter((e) => e.event.startsWith("blog_")).length,
      errors: this.events.filter((e) => e.event === "error").length,
    };
  }
}

export const analyticsService = new AnalyticsService();
