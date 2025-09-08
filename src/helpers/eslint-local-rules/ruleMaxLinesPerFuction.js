const { execSync } = require('child_process');

const MAX_LINES = 50;

const IGNORED = [
  'GlobalStyle.tsx',
  'FaviconsOsmapp.tsx',
  'FaviconsOpenClimbing.tsx',
  'Homepage.tsx',
  'SupportUs.tsx',
  'InstallDialog.tsx',
  'ourPresets.ts',
  'refreshClimbingTiles.ts',
];

const UTF = { encoding: 'utf8' };
let changedFilesTimestamp = 0;
let changedFiles = [];

const cacheChangedFiles = () => {
  if (Date.now() - changedFilesTimestamp < 2000) {
    return;
  }
  changedFilesTimestamp = Date.now();
  try {
    const diff = execSync('git diff --name-only origin/master', UTF);
    const status = execSync("git status --porcelain | awk '{print $2}'", UTF);
    changedFiles = [
      ...new Set([...diff.split('\n'), ...status.split('\n')]),
    ].filter(Boolean);
  } catch (e) {
    changedFiles = null;
  }
};

const isFileChanged = (filename) => {
  cacheChangedFiles();
  if (changedFiles === null) {
    return false;
  }
  if (IGNORED.some((f) => filename.endsWith(f))) {
    return false;
  }
  return changedFiles.some((f) => filename.endsWith(f));
};

const ruleMaxLinesPerFuction = {
  meta: {
    type: 'problem',
    messages: {
      tooManyLines:
        `This function has too many lines ({{count}}). Limit is ${MAX_LINES}. ` +
        'Please extract components, custom hooks or helper functions. /ᐠ. ｡.ᐟ\\ᵐᵉᵒʷˎˊ˗ \n' +
        '  Mention @zbycz if this file should be an exception. ' +
        '(This rule only runs on changed files in current branch ' +
        'as a reminder to refactor touched files incrementaly. ' +
        'You can commit with --no-verify, merge the refactoring and then rebase.)\n',
    },
  },
  create(context) {
    if (process.env.CI === 'true') {
      return {};
    }
    if (!isFileChanged(context.filename)) {
      return {};
    }

    function checkFunction(node) {
      if (!node.body || !node.body.loc) return;
      const start = node.body.loc.start.line;
      const end = node.body.loc.end.line;
      const count = end - start + 1;
      if (count > MAX_LINES) {
        context.report({
          loc: {
            start: { line: start, column: 0 },
            end: { line: start, column: 1000 },
          },
          messageId: 'tooManyLines',
          data: { count },
        });
      }
    }
    return {
      FunctionDeclaration: checkFunction,
      FunctionExpression: checkFunction,
      ArrowFunctionExpression: checkFunction,
    };
  },
};

module.exports = ruleMaxLinesPerFuction;
