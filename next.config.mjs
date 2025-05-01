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
    domains: [
      'supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '') || '',
    ],
  },
  output: 'export',  // Changed from 'standalone' to 'export'
  reactStrictMode: true,
  devIndicators: false,
  basePath: '/milk-expenzify',  // Add basePath for GitHub Pages
  async redirects() {
    return []
  },
  experimental: {
    serverActions: true,
  },
}

export default nextConfig
