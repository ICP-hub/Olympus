import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginImport from "eslint-plugin-import";
import pluginJSX_A11y from "eslint-plugin-jsx-a11y";
import pluginReactHooks from "eslint-plugin-react-hooks";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    // Flat config now uses plugin objects, not just names
    plugins: {
      js: pluginJs,
      react: pluginReact,
      import: pluginImport,
      jsxA11y: pluginJSX_A11y,
      reactHooks: pluginReactHooks,
    },
    rules: {
      // Example Airbnb rules manually added:
      "react/jsx-filename-extension": ["warn", { extensions: [".jsx", ".js"] }],
      "import/prefer-default-export": "off",
      "react/react-in-jsx-scope": "off",

      // Custom rules
      "no-unused-vars": "warn",
      "no-undef": "error",
      "arrow-body-style": ["error", "always"],
    },
  },
];
