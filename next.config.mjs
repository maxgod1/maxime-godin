/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'qdsaso162l.ufs.sh',
                port: '',
                pathname: '/f/**',
            },
        ],
    },
};

export default nextConfig;
