import { ASTNode, generateAst } from './ast';
import { tokenize } from './tokens';

export const getAST = (inputValue: string) => {
  const tokens = tokenize(inputValue);
  return generateAst(tokens);
};

export const queryWizardLabel = (ast: ASTNode) => {
  return 'Query Wizard';
};
