import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
},
typescript: {
  // !! WARN !!
  // Dangerously allow production builds to successfully complete even if
  // your project has type errors.
  // !! WARN !!
  ignoreBuildErrors: true,
},
webpack(config) {
  // Exclude chrome-aws-lambda from webpack processing
  config.externals = [
    ...(config.externals || []),
    'chrome-aws-lambda',
  ];

  return config;
},
images: {
  loader: "cloudinary",
  path: "https://res.cloudinary.com/dwklt6k9c/image/upload",
  domains: ["res.cloudinary.com"], // Ensure the domain is allowed
},
};

export default nextConfig;
