// @ts-ignore
import * as rawEsbuild from "https://deno.land/x/esbuild@v0.15.7/mod.js";
// @ts-ignore
import { NodeModulesPolyfillPlugin } from "npm:@esbuild-plugins/node-modules-polyfill";

const esbuild = rawEsbuild as typeof import("esbuild");

esbuild.serve({
  servedir: "./webui",
  onRequest: (req) =>
    console.log(
      `[${req.remoteAddress}] ${req.status} ${req.method} ${req.path} ${req.timeInMS}ms`,
    ),
}, {
  bundle: true,
  entryPoints: ["./webui/index.tsx"],
  outfile: "./webui/index.js",
  format: "esm",
  plugins: [NodeModulesPolyfillPlugin()],
  sourcemap: "inline",
  define: {
    "process.env": "{}",
  },
}).then((res) => console.log(`listening at ${res.host}:${res.port}`));
