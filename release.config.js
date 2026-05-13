// semantic-release configuration.
//
// The composite at composite/config/semantic-release sets SR_PRERELEASE=true
// for releases that target a pre-release branch (anything other than the
// stable ref). When that flag is on, the changelog and git plugins are
// omitted so pre-releases only publish a tag and a GitHub Release.

import { execFileSync } from "node:child_process";

const isPrerelease = process.env.SR_PRERELEASE === "true";

// Resolve a GitHub handle for a commit. Tries, in order:
//   1. GitHub commits API (authoritative — maps SHA -> author.login).
//   2. The `user@users.noreply.github.com` email pattern.
//   3. Bot-style author names ending in `[bot]`.
// Returns null if no handle can be inferred.
function resolveGithubHandle(commit) {
  const sha = commit.hash || commit.commit?.long;
  const email =
    (commit.author && commit.author.email) || commit.authorEmail || "";
  const name = (commit.author && commit.author.name) || commit.authorName || "";

  const repo = process.env.GITHUB_REPOSITORY;
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (sha && repo && token) {
    try {
      const out = execFileSync(
        "curl",
        [
          "-sf",
          "-H",
          `Authorization: Bearer ${token}`,
          "-H",
          "Accept: application/vnd.github+json",
          `https://api.github.com/repos/${repo}/commits/${sha}`,
        ],
        { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
      );
      const data = JSON.parse(out);
      const login = data?.author?.login || data?.committer?.login;
      if (login) return login;
    } catch {
      // fall through to email/name heuristics
    }
  }

  const noreply = email.match(
    /^(?:\d+\+)?([^@]+)@users\.noreply\.github\.com$/i,
  );
  if (noreply) return noreply[1];

  if (/\[bot\]$/i.test(name)) return name;

  return null;
}

const authorsFooterPartial = `
{{#if authors.length}}
### Authors

{{#each authors}}- {{this}}
{{/each}}
{{/if}}
`;

const commitAnalyzer = [
  "@semantic-release/commit-analyzer",
  {
    preset: "conventionalcommits",
    releaseRules: [
      { type: "feat", release: "minor" },
      { type: "fix", release: "patch" },
      { type: "perf", release: "patch" },
      { type: "refactor", release: "patch" },
      { type: "docs", release: false },
      { type: "style", release: false },
      { type: "test", release: false },
      { type: "chore", release: false },
      { type: "ci", release: false },
      { breaking: true, release: "major" },
    ],
  },
];

const releaseNotesGenerator = [
  "@semantic-release/release-notes-generator",
  {
    preset: "conventionalcommits",
    writerOpts: {
      finalizeContext(context, _writerOpts, _filteredCommits, _keyCommit, commits) {
        const source = commits && commits.length ? commits : context.commits || [];
        const handles = source
          .map((c) => resolveGithubHandle(c))
          .filter(Boolean)
          .map((h) => `@${h}`);
        context.authors = [...new Set(handles)].sort((a, b) =>
          a.localeCompare(b),
        );
        return context;
      },
      footerPartial: authorsFooterPartial,
    },
  },
];

const changelogPlugin = [
  "@semantic-release/changelog",
  { changelogFile: "CHANGELOG.md" },
];

const gitPlugin = [
  "@semantic-release/git",
  {
    assets: ["CHANGELOG.md"],
    message:
      "chore(release): ${nextRelease.version} [changelog] [skip ci]\n\n${nextRelease.notes}",
  },
];

const githubPlugin = "@semantic-release/github";

export default {
  branches: [
    { name: "main", channel: "latest" },
    { name: "stg", prerelease: "beta" },
    { name: "dev", prerelease: "alpha" },
  ],
  plugins: [
    commitAnalyzer,
    releaseNotesGenerator,
    ...(isPrerelease ? [] : [changelogPlugin, gitPlugin]),
    githubPlugin,
  ],
};
