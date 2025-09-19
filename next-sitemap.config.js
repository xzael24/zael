/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://zael.vercel.app",
  generateRobotsTxt: true, // auto generate robots.txt
  sitemapSize: 7000, // default aman
  changefreq: "weekly",
  priority: 0.7,
};
