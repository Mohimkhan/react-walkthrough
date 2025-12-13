import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  input: "src/index.ts",
  output: { format: "es", dir: "dist", name: "react-walkthrough" },
  external: ["react", "react-dom"],
  plugins: [typescript({ tsconfig: "./tsconfig.json" })],
});
