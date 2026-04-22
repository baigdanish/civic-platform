import { defineConfig, globalIgnores } from "eslint/config";
import { deserialize, serialize } from "node:v8";
import nextVitals from "eslint-config-next/core-web-vitals";

if (typeof globalThis.structuredClone !== "function") {
  globalThis.structuredClone = (value) => deserialize(serialize(value));
}

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
