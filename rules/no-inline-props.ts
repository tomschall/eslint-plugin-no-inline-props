const rule = {
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
  create(context: any) {
    return {
      JSXAttribute(node: any) {
        const val = node.value?.expression;
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
      JSXElement(node: any) {
        node.children.forEach((child: any) => {
          // Case 1: <Component>{<h1>...</h1>}</Component>
          if (
            child.type === 'JSXExpressionContainer' &&
            child.expression.type === 'JSXElement'
          ) {
            context.report({
              node: child.expression,
              messageId: 'inlineProp',
              data: {
                name: 'children',
                type: 'JSXElement',
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
                type: 'JSXElement',
              },
            });
          }
        });
      },
    };
  },
};

export default rule;
