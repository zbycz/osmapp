const { execSync } = require('child_process');
const path = require('path');

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

const parseGitDiff = (diffText) => {
  const lines = diffText.split('\n');
  const result = {};
  let currentFile = null;
  for (const line of lines) {
    if (line.startsWith('+++ b/')) {
      const relativePath = line.replace('+++ b/', '');
      currentFile = path.resolve(process.cwd(), relativePath);
      if (!result[currentFile]) result[currentFile] = [];
    }
    if (line.startsWith('@@')) {
      const match = /@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/.exec(line);
      if (match) {
        const start = parseInt(match[1], 10);
        const len = parseInt(match[2] || '1', 10);
        const lines = Array.from({ length: len }, (_, i) => start + i);

        result[currentFile].push(...lines);
      }
    }
  }
  return result;
};

const UTF = { encoding: 'utf8' };
let changedFilesTimestamp = 0;
let changedFiles = null;

const cacheChangedFiles = () => {
  if (Date.now() - changedFilesTimestamp < 2000) {
    return;
  }
  changedFilesTimestamp = Date.now();
  try {
    const diff = execSync('git diff --unified=0 --no-color HEAD', UTF);
    changedFiles = parseGitDiff(diff);
  } catch (e) {
    console.warn(e); // eslint-disable-line no-console
    changedFiles = null;
  }
};

const isFileChanged = (filename) => {
  cacheChangedFiles();
  if (changedFiles === null) {
    return false;
  }
  if (IGNORED.some((ignored) => filename.endsWith(ignored))) {
    return false;
  }

  return !!changedFiles[filename];
};

const isInChangedLines = (filename, start, end) => {
  const lines = changedFiles[filename];
  if (!lines) return false;

  return lines.some((line) => line >= start && line <= end);
};

const ruleMaxLinesPerFunction = {
  meta: {
    type: 'suggestion',
    messages: {
      tooManyLines:
        `This function has too many lines ({{count}}). Limit is ${MAX_LINES}. ` +
        'Please extract components, custom hooks or helper functions.\n' +
        '  /ᐠ. ｡.ᐟ\\ᵐᵉᵒʷˎˊ˗ \n' +
        '  Mention @zbycz if this file should be an exception. ' +
        '(This rule checks only changed functions in current commit ' +
        'as a reminder to refactor touched files incrementally. ' +
        'You can commit with --no-verify, merge the refactoring and then rebase.)\n',
    },
  },
  create(context) {
    if (process.env.CI === 'true') {
      return {};
    }

    const filename = context.filename;
    if (!isFileChanged(filename)) {
      return {};
    }

    const checkFunction = (node) => {
      if (!node.body || !node.body.loc) return;
      const start = node.body.loc.start.line;
      const end = node.body.loc.end.line;
      const count = end - start + 1;
      if (count > MAX_LINES && isInChangedLines(filename, start, end)) {
        context.report({
          loc: {
            start: { line: start, column: 0 },
            end: { line: start, column: 80 },
          },
          messageId: 'tooManyLines',
          data: { count },
        });
      }
    };
    return {
      FunctionDeclaration: checkFunction,
      FunctionExpression: checkFunction,
      ArrowFunctionExpression: checkFunction,
    };
  },
};

module.exports = ruleMaxLinesPerFunction;
