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
  reactStrictMode: true,
  devIndicators: false,
  basePath: '',
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
      bodySizeLimit: '2mb'
    }
  }
}

export default nextConfig
