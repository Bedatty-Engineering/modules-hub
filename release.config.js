// semantic-release configuration.
//
// The composite at composite/config/semantic-release sets SR_PRERELEASE=true
// for releases that target a pre-release branch (anything other than the
// stable ref). When that flag is on, the changelog and git plugins are
// omitted so pre-releases only publish a tag and a GitHub Release.

const isPrerelease = process.env.SR_PRERELEASE === "true";

const contributorsFooterPartial = `
{{#if contributors.length}}
### Contributors

{{#each contributors}}- {{this}}
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
        const names = source
          .map((c) => (c.author && c.author.name) || c.authorName)
          .filter(Boolean);
        context.contributors = [...new Set(names)].sort((a, b) =>
          a.localeCompare(b),
        );
        return context;
      },
      footerPartial: contributorsFooterPartial,
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
