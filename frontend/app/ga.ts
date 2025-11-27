export const GA_ID = "G-4TLH82SZF2";


export const pageview = (url: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", GA_ID, {
      page_path: url,
    });
  }
};
