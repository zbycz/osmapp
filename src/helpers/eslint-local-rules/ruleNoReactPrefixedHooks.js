const ruleNoReactPrefixedHooks = {
  meta: {
    type: 'problem',
  },
  create(context) {
    return {
      MemberExpression(node) {
        if (
          node.object.name === 'React' &&
          ['useState', 'useRef', 'useEffect'].includes(node.property.name)
        ) {
          context.report({
            node,
            message:
              'Do not use React.useState, React.useRef or React.useEffect. Import the hook directly instead.',
          });
        }
      },
    };
  },
};

module.exports = ruleNoReactPrefixedHooks;
