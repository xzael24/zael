/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Optimasi untuk mengurangi TBT
  experimental: {
    optimizePackageImports: ['@paper-design/shaders-react', 'framer-motion'],
  },
  // Bundle analyzer dan optimasi
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Optimasi untuk production
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },

          shaders: {
            test: /[\\/]node_modules[\\/]@paper-design[\\/]/,
            name: 'shaders',
            chunks: 'all',
            priority: 30,
          },
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'all',
            priority: 30,
          },
        },
      }
    }
    return config
  },
  // Compression dan optimasi
  compress: true,
  poweredByHeader: false,
  // Preload critical resources
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

export default nextConfig
