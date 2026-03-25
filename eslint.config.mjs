import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [".next/**", "node_modules/**", "base-carteira/**", "carteira-bootstrap/**", "temp-bootstrap/**"],
  },
  ...nextVitals,
  ...nextTypescript,
];

export default config;