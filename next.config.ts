/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Configuration pour servir les fichiers statiques
  async rewrites() {
    return [
      {
        source: "/generated-pdfs/:path*",
        destination: "/generated-pdfs/:path*",
      },
    ];
  },
};

export default nextConfig;
