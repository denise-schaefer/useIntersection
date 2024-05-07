import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended, // Recommended config applied to all files
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.jest
      }
    }
  }
];