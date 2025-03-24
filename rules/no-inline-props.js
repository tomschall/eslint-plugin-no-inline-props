module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow inline props (JSXElement, ObjectExpression, FunctionExpression)',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(node) {
        const val = node.value?.expression;
        if (!val) return;

        const isInline =
          val.type === 'ObjectExpression' ||
          val.type === 'ArrowFunctionExpression' ||
          val.type === 'JSXElement';

        if (isInline) {
          context.report({
            node,
            message: `⚠️ Inline prop "\${node.name.name}" detected (\${val.type}). Extract to variable.`,
          });
        }
      },
    };
  },
};
