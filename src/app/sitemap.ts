import { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blogData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://synapses-investments.vercel.app";
  const currentDate = new Date();

  // Core Landing & Marketing Pages
  const coreRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 0.98,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/intelligence`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/manifesto`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/risk-calculator`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/what-is-sn-journal`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ];

  // Dynamic Blog Post Articles
  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Feature Documentation Pages
  const featureRoutes = [
    "trade-journal",
    "analytics",
    "replay-simulator",
    "risk-calculator",
  ].map((feature) => ({
    url: `${baseUrl}/features/${feature}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // Dashboard & Application Routes
  const dashboardRoutes = [
    "",
    "/journal",
    "/analytics",
    "/backtesting",
    "/calculator",
  ].map((sub) => ({
    url: `${baseUrl}/dashboard${sub}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const authRoutes = [
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  return [
    ...coreRoutes,
    ...blogRoutes,
    ...featureRoutes,
    ...dashboardRoutes,
    ...authRoutes,
  ];
}
