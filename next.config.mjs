/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            { hostname: "pub-8b50a2a96a4e4d76a50ecc6edb85cd97.r2.dev"},
            { 
                protocol: 'https',
                hostname: process.env.NEXT_PUBLIC_S3_PUBLIC_URL?.replace(/^https?:\/\//, ''),
            }
        ],
    }
};

export default nextConfig;
