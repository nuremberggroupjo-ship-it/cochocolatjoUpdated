import type { NextConfig } from "next"

import path from "path"

import { env } from "@/lib/env"

const nextConfig: NextConfig = {
  serverExternalPackages: ["@node-rs/argon2"],

  // This is a workaround to handle SVG imports in Next.js
  webpack(config, { isServer }) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find(
      (rule: { test: { test: (path: string) => boolean } }) =>
        rule.test?.test?.(".svg"),
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          },
        },
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    // for rich editor
    if (!isServer) {
      // Ensure that all imports of 'yjs' resolve to the same instance
      config.resolve.alias["yjs"] = path.resolve(__dirname, "node_modules/yjs")
    }

    return config
  },

  images: {
    
    domains: ['qytn7coh2c.ufs.sh'], 
  
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${env.NEXT_PUBLIC_UPLOADTHING_APP_ID}.ufs.sh`,
        pathname: "/f/*",
      },
      {
        protocol: "https",
        hostname: `lh3.googleusercontent.com`,
        pathname: "/a/*",
      },
    ],
  },
}

export default nextConfig
