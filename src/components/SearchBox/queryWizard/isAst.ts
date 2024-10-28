import {
  ASTNode,
  ASTNodeComparison,
  ASTNodeExpression,
  ASTNodeGroup,
} from './ast';

const isComparisonAstNode = (obj: any): obj is ASTNodeComparison => {
  try {
    const { type, key, value, operator } = obj;
    return (
      type === 'comparison' &&
      typeof key === 'string' &&
      typeof value === 'string' &&
      operator === '='
    );
  } catch {
    return false;
  }
};

const isGroupAstNode = (obj: any): obj is ASTNodeGroup => {
  try {
    return obj.type === 'group' && isAstNode(obj.expression);
  } catch {
    return false;
  }
};
const isExpressionAstNode = (obj: any): obj is ASTNodeExpression => {
  try {
    const { type, expressions } = obj;
    return (
      type === 'expression' &&
      Array.isArray(expressions) &&
      expressions.every(isAstNode)
    );
  } catch {
    return false;
  }
};

export const isAstNode = (obj: any): obj is ASTNode => {
  return (
    isComparisonAstNode(obj) || isGroupAstNode(obj) || isExpressionAstNode(obj)
  );
};
