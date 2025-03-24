import { TSESTree, TSESLint } from '@typescript-eslint/utils';

const rule: TSESLint.RuleModule<'inlineProp', []> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow inline props (JSXElement, ObjectExpression, FunctionExpression)',
    },
    messages: {
      inlineProp:
        '⚠️ Inline prop "{{name}}" detected ({{type}}). Extract to a variable.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context: TSESLint.RuleContext<'inlineProp', []>) {
    return {
      JSXAttribute(node: TSESTree.JSXAttribute) {
        const val =
          node.value?.type === 'JSXExpressionContainer'
            ? node.value.expression
            : null;

        if (!val) return;

        const isInline =
          val.type === 'ObjectExpression' ||
          val.type === 'ArrowFunctionExpression' ||
          val.type === 'JSXElement';

        if (isInline) {
          context.report({
            node,
            messageId: 'inlineProp',
            data: {
              name: node.name.name,
              type: val.type,
            },
          });
        }
      },
      JSXElement(node: TSESTree.JSXElement) {
        node.children.forEach((child) => {
          // ⛔ Skip native HTML elements like <div>, <nav>, etc.
          if (
            node.openingElement.name.type === 'JSXIdentifier' &&
            /^[a-z]/.test(node.openingElement.name.name)
          ) {
            return;
          }

          // Case 1: <Component>{<h1>...</h1>}</Component> or other expressions
          if (
            child.type === 'JSXExpressionContainer' &&
            [
              'JSXElement',
              'ObjectExpression',
              'ArrowFunctionExpression',
              'FunctionExpression',
            ].includes(child.expression.type)
          ) {
            context.report({
              node: child.expression,
              messageId: 'inlineProp',
              data: {
                name: 'children',
                type: child.expression.type,
              },
            });
          }

          // Case 2: <Component><h1>...</h1></Component>
          if (child.type === 'JSXElement') {
            context.report({
              node: child,
              messageId: 'inlineProp',
              data: {
                name: 'children',
                type: child.type,
              },
            });
          }
        });
      },
    };
  },
};

export default rule;
