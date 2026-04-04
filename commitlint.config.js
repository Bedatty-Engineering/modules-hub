/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Scope is mandatory — every commit must declare what area it touches.
    "scope-empty": [2, "never"],

    // Allowed scopes map to the repo's domain structure.
    "scope-enum": [
      2,
      "always",
      [
        "terraform", // composite/terraform/** and .github/workflows/terraform/**
        "config",    // composite/config/**
        "hub",       // composite/hub/** and .github/workflows/hub/**
        "release",   // .releaserc.json, package.json, commitlint config
        "deps",      // dependency updates (npm)
        "docs",      // docs/**
      ],
    ],
  },
};
