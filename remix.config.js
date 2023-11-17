/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  browserNodeBuiltinsPolyfill: {
    modules: {
      util: true,
      url: true,
      http: true,
      https: true,
      crypto: true,
      fs: true,
      os: true,
      path: true,
      events: true,
      buffer: true,
      stream: true,
    },
  },
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
