module.exports = {
  'no-styled-missing-transient-props': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Warns when a styled component has custom props but is missing shouldForwardProp.',
        category: 'Possible Errors',
        recommended: true,
        url: '',
      },
      schema: [],
      messages: {
        missingShouldForwardProp:
          "styled() has custom props, but is missing `shouldForwardProp`. Make sure that your props start with `$` and add `styled(..., { shouldForwardProp: (prop) => !prop.startsWith('$') })`.",
      },
    },
    create(context) {
      return {
        CallExpression(callExpression) {
          if (
            callExpression.callee.type === 'Identifier' &&
            callExpression.callee.name === 'styled'
          ) {
            let hasCustomProps = false;
            let hasShouldForwardProp = false;
            const taggedTemplate = callExpression.parent;

            if (
              taggedTemplate.typeArguments &&
              taggedTemplate.typeArguments.type ===
                'TSTypeParameterInstantiation' &&
              taggedTemplate.typeArguments.params.length > 0
            ) {
              hasCustomProps = true;
            }

            if (callExpression.arguments.length > 1) {
              hasShouldForwardProp = true;
            }

            if (hasCustomProps && !hasShouldForwardProp) {
              context.report({
                node: callExpression,
                messageId: 'missingShouldForwardProp',
              });
            }
          }
        },
      };
    },
  },
  'no-react-prefixed-hooks': {
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
  },
};
