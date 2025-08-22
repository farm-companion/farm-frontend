/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://farmcompanion.co.uk',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admin/*', '/api/*'],
  transform: async (config, path) => {
    // Custom transform for produce pages
    if (path.startsWith('/seasonal/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
        alternateRefs: [],
      }
    }
    
    // Default transform for other pages
    return {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: [],
    }
  },
  additionalPaths: async (config) => {
    // Add all produce pages to sitemap
    // Hardcode the produce slugs since we can't import TypeScript directly
    const produceSlugs = [
      'sweetcorn',
      'tomatoes', 
      'strawberries',
      'blackberries',
      'runner-beans',
      'plums',
      'apples',
      'pumpkins'
    ]
    
    return produceSlugs.map((slug) => ({
      loc: `/seasonal/${slug}`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    }))
  },
}
