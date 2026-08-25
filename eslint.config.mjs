import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".open-next/**",
      "out/**",
      "build/**",
      "coverage/**",
      "next-env.d.ts",
      "stitch_gileara_technologies_website/**",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default eslintConfig;
