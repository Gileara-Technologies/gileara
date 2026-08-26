/** @type {import('next').NextConfig} */
const securityHeaders = [
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
    },
    {
        key: 'X-Frame-Options',
        value: 'DENY',
    },
    {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
    },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
    },
];

const nextConfig = {
    reactStrictMode: true,
    // Security headers applied here because Next 16 middleware/proxy runs on
    // the Node.js runtime, which @opennextjs/cloudflare cannot bundle yet.
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: securityHeaders,
            },
        ];
    },
    // Fabricated case-study stories were replaced by /how-we-transform (D9);
    // indexed URLs redirect so no visitor hits a 404.
    async redirects() {
        return [
            {
                source: '/case-studies',
                destination: '/how-we-transform',
                permanent: true,
            },
            {
                source: '/case-studies/:slug',
                destination: '/how-we-transform',
                permanent: true,
            },
        ];
    },
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
