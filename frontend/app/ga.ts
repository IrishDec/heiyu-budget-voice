export const GA_ID = "G-4FG0YF84Q9";

export const pageview = (url: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", GA_ID, {
      page_path: url,
    });
  }
};
